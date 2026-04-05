-- Migration: Add discount columns to stays table
-- The price_per_night column already exists from the initial migration.
-- We reuse it as the "starting price" and add discount support.

-- Add discount percentage (0 = no discount, e.g. 20 = 20% off)
ALTER TABLE public.stays
  ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;

-- Add optional discount label (e.g. "Early Bird Special", "Summer Deal")
ALTER TABLE public.stays
  ADD COLUMN IF NOT EXISTS discount_label TEXT DEFAULT NULL;

-- Ensure price_per_night defaults are sensible
COMMENT ON COLUMN public.stays.price_per_night IS 'Starting price per night in USD';
COMMENT ON COLUMN public.stays.discount_percentage IS 'Discount percentage (0-100). 0 means no discount.';
COMMENT ON COLUMN public.stays.discount_label IS 'Optional label for the discount badge, e.g. Early Bird Special';
