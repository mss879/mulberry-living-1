-- Add inventory_available column to track current availability
ALTER TABLE public.stays 
ADD COLUMN inventory_available integer;

-- Set initial values based on inventory_total (all available by default)
UPDATE public.stays 
SET inventory_available = inventory_total;

-- Add NOT NULL constraint after setting values
ALTER TABLE public.stays 
ALTER COLUMN inventory_available SET NOT NULL;

-- Add default to match inventory_total for new stays
ALTER TABLE public.stays 
ALTER COLUMN inventory_available SET DEFAULT 1;