-- ============================================================
-- Migration: Switch promotions from single stay to multi-stay
-- Date: 2026-05-09
-- Description:
--   1. Adds applicable_stay_ids (uuid[]) column to promotions
--   2. Migrates data from applicable_stay_id to the new array
--   3. Drops the old applicable_stay_id column + FK
--   4. Updates validate_promotion_code and redeem_promotion_code
--      RPCs to check against the array
-- ============================================================

-- 1. Add the new array column
ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS applicable_stay_ids UUID[] NOT NULL DEFAULT '{}';

-- 2. Migrate existing data: copy single FK into array
UPDATE public.promotions
SET applicable_stay_ids = ARRAY[applicable_stay_id]
WHERE applicable_stay_id IS NOT NULL;

-- 3. Drop the old single FK column
ALTER TABLE public.promotions
  DROP COLUMN IF EXISTS applicable_stay_id;

-- 4. Update validate_promotion_code to use array check
CREATE OR REPLACE FUNCTION public.validate_promotion_code(
  _code        TEXT,
  _stay_id     UUID,
  _nights      INTEGER,
  _guests      INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _promo RECORD;
  _today DATE := CURRENT_DATE;
BEGIN
  -- Look up the coupon code (case-insensitive)
  SELECT * INTO _promo
  FROM public.promotions
  WHERE UPPER(coupon_code) = UPPER(_code);

  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'Invalid promotion code.');
  END IF;

  -- Check active
  IF _promo.is_active = false THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion is no longer active.');
  END IF;

  -- Check date range
  IF _promo.valid_from IS NOT NULL AND _today < _promo.valid_from THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion has not started yet.');
  END IF;

  IF _promo.valid_until IS NOT NULL AND _today > _promo.valid_until THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion has expired.');
  END IF;

  -- Check usage limit
  IF _promo.max_uses > 0 AND _promo.times_used >= _promo.max_uses THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion code has reached its usage limit.');
  END IF;

  -- Check min nights
  IF _promo.min_nights > 0 AND _nights < _promo.min_nights THEN
    RETURN json_build_object('valid', false, 'error',
      'Minimum ' || _promo.min_nights || ' night(s) required for this promotion.');
  END IF;

  -- Check min guests
  IF _promo.min_guests > 0 AND _guests < _promo.min_guests THEN
    RETURN json_build_object('valid', false, 'error',
      'Minimum ' || _promo.min_guests || ' guest(s) required for this promotion.');
  END IF;

  -- Check applicable stays (empty array = applies to all stays)
  IF array_length(_promo.applicable_stay_ids, 1) IS NOT NULL
     AND NOT (_stay_id = ANY(_promo.applicable_stay_ids)) THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion code is not valid for the selected stay.');
  END IF;

  -- All checks passed
  RETURN json_build_object(
    'valid',          true,
    'promotion_id',   _promo.id,
    'title',          _promo.title,
    'reward',         _promo.reward,
    'discount_type',  _promo.discount_type,
    'discount_value', _promo.discount_value,
    'max_uses',       _promo.max_uses,
    'times_used',     _promo.times_used
  );
END;
$$;

-- 5. Update redeem_promotion_code to use array check
CREATE OR REPLACE FUNCTION public.redeem_promotion_code(
  _code        TEXT,
  _stay_id     UUID,
  _nights      INTEGER,
  _guests      INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _promo RECORD;
  _today DATE := CURRENT_DATE;
BEGIN
  -- Lock the row to prevent concurrent redemptions
  SELECT * INTO _promo
  FROM public.promotions
  WHERE UPPER(coupon_code) = UPPER(_code)
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'Invalid promotion code.');
  END IF;

  IF _promo.is_active = false THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion is no longer active.');
  END IF;

  IF _promo.valid_from IS NOT NULL AND _today < _promo.valid_from THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion has not started yet.');
  END IF;

  IF _promo.valid_until IS NOT NULL AND _today > _promo.valid_until THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion has expired.');
  END IF;

  IF _promo.max_uses > 0 AND _promo.times_used >= _promo.max_uses THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion code has reached its usage limit.');
  END IF;

  IF _promo.min_nights > 0 AND _nights < _promo.min_nights THEN
    RETURN json_build_object('valid', false, 'error',
      'Minimum ' || _promo.min_nights || ' night(s) required for this promotion.');
  END IF;

  IF _promo.min_guests > 0 AND _guests < _promo.min_guests THEN
    RETURN json_build_object('valid', false, 'error',
      'Minimum ' || _promo.min_guests || ' guest(s) required for this promotion.');
  END IF;

  -- Check applicable stays (empty array = applies to all stays)
  IF array_length(_promo.applicable_stay_ids, 1) IS NOT NULL
     AND NOT (_stay_id = ANY(_promo.applicable_stay_ids)) THEN
    RETURN json_build_object('valid', false, 'error', 'This promotion code is not valid for the selected stay.');
  END IF;

  -- All checks passed — atomically increment usage
  UPDATE public.promotions
  SET times_used = times_used + 1
  WHERE id = _promo.id;

  RETURN json_build_object(
    'valid',          true,
    'promotion_id',   _promo.id,
    'title',          _promo.title,
    'reward',         _promo.reward,
    'discount_type',  _promo.discount_type,
    'discount_value', _promo.discount_value,
    'max_uses',       _promo.max_uses,
    'times_used',     _promo.times_used + 1
  );
END;
$$;

-- Re-grant permissions
GRANT EXECUTE ON FUNCTION public.validate_promotion_code(TEXT, UUID, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_promotion_code(TEXT, UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_promotion_code(TEXT, UUID, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.redeem_promotion_code(TEXT, UUID, INTEGER, INTEGER) TO authenticated;

COMMENT ON COLUMN public.promotions.applicable_stay_ids IS 'Array of stay UUIDs this promo applies to. Empty array = all stays.';
