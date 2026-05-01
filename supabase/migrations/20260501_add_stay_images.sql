-- ============================================================
-- Migration: stay_images table for dynamic gallery management
-- ============================================================

-- Create the stay_images table
CREATE TABLE public.stay_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id UUID NOT NULL REFERENCES public.stays(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  focal_x REAL DEFAULT 50,
  focal_y REAL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX idx_stay_images_stay_id ON public.stay_images(stay_id);
CREATE INDEX idx_stay_images_ordering ON public.stay_images(stay_id, position);

-- Enable RLS
ALTER TABLE public.stay_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view stay images"
  ON public.stay_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert stay images"
  ON public.stay_images
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stay images"
  ON public.stay_images
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stay images"
  ON public.stay_images
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- Seed existing images into stay_images
-- Maps the current hardcoded public folder images to DB rows
-- ============================================================

-- Private Rooms (slug: 'private-rooms')
INSERT INTO public.stay_images (stay_id, url, alt, position) VALUES
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Queen Room/843449793.jpg', 'Ensuite private queen room at Mulberry Living', 0),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Queen Room/843690968.jpg', 'Queen room interior view', 1),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Queen Room/843691600.jpg', 'Queen room bathroom and amenities', 2),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Queen Room/843449416.jpg', 'Queen room comfortable bed', 3),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Queen Room/843449658.jpg', 'Queen room balcony access', 4),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Queen Room/843449733.jpg', 'Queen room detail', 5),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Twin Room with Balcony/843449275.jpg', 'Twin room with balcony at Mulberry Living', 6),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Twin Room with Balcony/843449283.jpg', 'Twin room interior', 7),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Twin Room with Balcony/843449416.jpg', 'Twin room beds', 8),
  ((SELECT id FROM public.stays WHERE slug = 'private-rooms'), '/Twin Room with Balcony/843691852.jpg', 'Twin room balcony view', 9);

-- Dorms (slug: 'dorms')
INSERT INTO public.stay_images (stay_id, url, alt, position) VALUES
  ((SELECT id FROM public.stays WHERE slug = 'dorms'), '/6-Bed Mixed Dormitory Room/843449191.jpg', 'Mixed dormitory room at Mulberry Living', 0),
  ((SELECT id FROM public.stays WHERE slug = 'dorms'), '/6-Bed Mixed Dormitory Room/843449466.jpg', 'Dorm bunk beds', 1),
  ((SELECT id FROM public.stays WHERE slug = 'dorms'), '/6-Bed Mixed Dormitory Room/843723344.jpg', 'Dorm room overview', 2),
  ((SELECT id FROM public.stays WHERE slug = 'dorms'), '/6-Bed Mixed Dormitory Room/843450146.jpg', 'Dorm room detail', 3),
  ((SELECT id FROM public.stays WHERE slug = 'dorms'), '/6-Bed Mixed Dormitory Room/843723374.jpg', 'Dorm common area', 4);

-- Apartment (slug: 'apartment')
INSERT INTO public.stay_images (stay_id, url, alt, position) VALUES
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843683565.jpg', 'Two-bedroom apartment at Mulberry Living', 0),
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843683569.jpg', 'Apartment living space', 1),
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843683514.jpg', 'Apartment bedroom', 2),
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843683565 (1).jpg', 'Apartment kitchen area', 3),
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843683568.jpg', 'Apartment interior detail', 4),
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843683570.jpg', 'Apartment second bedroom', 5),
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843683572.jpg', 'Apartment bathroom', 6),
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843694021.jpg', 'Apartment overview', 7),
  ((SELECT id FROM public.stays WHERE slug = 'apartment'), '/Apartment/843694385.jpg', 'Apartment balcony', 8);
