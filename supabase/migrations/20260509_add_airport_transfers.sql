-- =============================================================
-- Migration: Airport Transfer (Pickup & Drop-off) Feature
-- Date: 2026-05-09
-- Description:
--   1. Creates airport_transfer_settings table (single-row config)
--   2. Adds airport transfer columns to bookings table
-- =============================================================

-- 1. Airport Transfer Settings Table
CREATE TABLE IF NOT EXISTS public.airport_transfer_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_price numeric NOT NULL DEFAULT 0,
  dropoff_price numeric NOT NULL DEFAULT 0,
  is_pickup_enabled boolean NOT NULL DEFAULT true,
  is_dropoff_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed a single default row
INSERT INTO public.airport_transfer_settings (pickup_price, dropoff_price, is_pickup_enabled, is_dropoff_enabled)
VALUES (15, 15, true, true);

-- Enable RLS
ALTER TABLE public.airport_transfer_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read transfer settings (needed for booking page)
CREATE POLICY "Anyone can read airport transfer settings"
  ON public.airport_transfer_settings
  FOR SELECT
  USING (true);

-- Only authenticated users (admins) can update
CREATE POLICY "Authenticated users can update airport transfer settings"
  ON public.airport_transfer_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 2. Add airport transfer columns to bookings table
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS airport_pickup boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS airport_dropoff boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS airport_pickup_price numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS airport_dropoff_price numeric NOT NULL DEFAULT 0;

-- Add a comment for documentation
COMMENT ON TABLE public.airport_transfer_settings IS 'Single-row configuration for airport pickup/drop-off pricing. Managed via admin panel.';
COMMENT ON COLUMN public.bookings.airport_pickup IS 'Whether the guest requested airport pickup';
COMMENT ON COLUMN public.bookings.airport_dropoff IS 'Whether the guest requested airport drop-off';
COMMENT ON COLUMN public.bookings.airport_pickup_price IS 'Snapshot of pickup price at time of booking';
COMMENT ON COLUMN public.bookings.airport_dropoff_price IS 'Snapshot of drop-off price at time of booking';
