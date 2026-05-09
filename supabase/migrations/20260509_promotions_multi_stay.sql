-- ============================================================
-- Migration: Switch promotions from single stay to multi-stay
-- Date: 2026-05-09
-- Description:
--   1. Adds applicable_stay_ids (uuid[]) column to promotions
--   2. Migrates data from applicable_stay_id to the new array
--   3. Drops the old applicable_stay_id column + FK
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

COMMENT ON COLUMN public.promotions.applicable_stay_ids IS 'Array of stay UUIDs this promo applies to. Empty array = all stays.';
