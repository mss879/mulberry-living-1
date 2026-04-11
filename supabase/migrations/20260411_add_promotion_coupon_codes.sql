-- ============================================================
-- Migration: Add coupon code support to promotions
-- Date: 2026-04-11
-- ============================================================

-- --------------------------------------------------------
-- 1. Add coupon columns to the existing promotions table
-- --------------------------------------------------------
ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS coupon_code    TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS max_uses       INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS times_used     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_nights     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_guests     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_type  TEXT NOT NULL DEFAULT 'fixed',
  ADD COLUMN IF NOT EXISTS discount_value NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS applicable_stay_id UUID REFERENCES public.stays(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.promotions.coupon_code      IS 'Unique code the guest types at checkout (NULL = display-only offer)';
COMMENT ON COLUMN public.promotions.max_uses          IS 'Maximum redemptions allowed. 0 = unlimited.';
COMMENT ON COLUMN public.promotions.times_used        IS 'How many times the code has been redeemed so far.';
COMMENT ON COLUMN public.promotions.min_nights        IS 'Minimum nights of stay required to use this code. 0 = no minimum.';
COMMENT ON COLUMN public.promotions.min_guests        IS 'Minimum guest count required. 0 = no minimum.';
COMMENT ON COLUMN public.promotions.discount_type     IS 'Either ''fixed'' (flat amount) or ''percentage''.';
COMMENT ON COLUMN public.promotions.discount_value    IS 'Discount amount: e.g. 10 means $10 off (fixed) or 10% off (percentage).';
COMMENT ON COLUMN public.promotions.applicable_stay_id IS 'If set, this code only works for the specified stay. NULL = any stay.';

-- --------------------------------------------------------
-- 2. Add promotion tracking columns to bookings table
-- --------------------------------------------------------
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS promotion_id   UUID REFERENCES public.promotions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.bookings.promotion_id   IS 'The promotion/coupon that was applied to this booking.';
COMMENT ON COLUMN public.bookings.discount_amount IS 'Calculated discount amount that was applied.';

-- --------------------------------------------------------
-- 3. RPC: Validate a promotion code (read-only, no side effects)
--    Returns a JSON object with promotion details or error.
-- --------------------------------------------------------
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

  -- Check applicable stay
  IF _promo.applicable_stay_id IS NOT NULL AND _promo.applicable_stay_id != _stay_id THEN
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

-- --------------------------------------------------------
-- 4. RPC: Redeem a promotion code (atomically increments times_used)
--    Call this ONLY when finalising the booking.
-- --------------------------------------------------------
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

  IF _promo.applicable_stay_id IS NOT NULL AND _promo.applicable_stay_id != _stay_id THEN
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

-- --------------------------------------------------------
-- 5. Allow anonymous users to call the RPC functions
--    (needed so guests can validate codes during checkout)
-- --------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.validate_promotion_code(TEXT, UUID, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_promotion_code(TEXT, UUID, INTEGER, INTEGER) TO authenticated;

GRANT EXECUTE ON FUNCTION public.redeem_promotion_code(TEXT, UUID, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.redeem_promotion_code(TEXT, UUID, INTEGER, INTEGER) TO authenticated;
