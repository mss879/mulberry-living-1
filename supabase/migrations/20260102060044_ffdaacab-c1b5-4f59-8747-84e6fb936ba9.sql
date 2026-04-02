-- Create custom types
CREATE TYPE public.stay_status AS ENUM ('available', 'occupied');
CREATE TYPE public.inventory_type AS ENUM ('room', 'bed', 'unit');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE public.enquiry_status AS ENUM ('new', 'in_progress', 'closed');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create stays table
CREATE TABLE public.stays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  headline TEXT,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  best_for TEXT,
  price_text TEXT,
  price_per_night NUMERIC,
  capacity_adults INTEGER,
  capacity_max INTEGER,
  inventory_total INTEGER DEFAULT 1,
  inventory_type public.inventory_type DEFAULT 'room',
  amenities JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  rules JSONB DEFAULT '{}'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  status public.stay_status DEFAULT 'available',
  is_visible BOOLEAN DEFAULT true,
  gallery JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stay_id UUID REFERENCES public.stays(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  quantity INTEGER NOT NULL DEFAULT 1,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  special_requests TEXT,
  status public.booking_status DEFAULT 'pending',
  paid BOOLEAN DEFAULT false,
  payment_provider TEXT,
  payment_reference TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stay_id UUID REFERENCES public.stays(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status public.enquiry_status DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin authentication
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create admin_profiles table for future-ready admin info
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_stays_updated_at
  BEFORE UPDATE ON public.stays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for stays
CREATE POLICY "Anyone can view visible stays"
  ON public.stays
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can view all stays"
  ON public.stays
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert stays"
  ON public.stays
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stays"
  ON public.stays
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stays"
  ON public.stays
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for bookings
CREATE POLICY "Anyone can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for enquiries
CREATE POLICY "Anyone can create enquiries"
  ON public.enquiries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all enquiries"
  ON public.enquiries
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update enquiries"
  ON public.enquiries
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete enquiries"
  ON public.enquiries
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for admin_profiles
CREATE POLICY "Admins can view admin profiles"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR id = auth.uid());

CREATE POLICY "Admins can update their own profile"
  ON public.admin_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Seed the 3 stay options
INSERT INTO public.stays (slug, title, headline, summary, description, best_for, price_text, inventory_total, inventory_type, amenities, highlights, rules, faqs, status, is_visible) VALUES
(
  'private-rooms',
  'Ensuite Private Rooms',
  '8 Rooms Available',
  'Privacy with a hostel-friendly feel. Perfect for couples, solo travelers, and digital nomads who want comfort without the hotel price tag.',
  'Enjoy your own private space with ensuite facilities. Each room features a comfortable bed with fresh linen, air conditioning, and a balcony for relaxing. Perfect for those who value privacy while still being part of the Mulberry Living community.',
  'Post-flight recovery, relaxed workdays, and easy beach-town evenings.',
  'Contact for rates',
  8,
  'room',
  '["Ensuite bathroom with hot water", "Comfortable bed and fresh linen", "Air conditioning", "Free Wi-Fi", "Mini bar facility", "Balcony"]'::jsonb,
  '["Private ensuite bathroom", "Air conditioning", "Balcony access", "8 rooms available"]'::jsonb,
  '{"checkIn": "2:00 PM", "checkOut": "11:00 AM", "cancellation": "Please contact us directly for our cancellation policy."}'::jsonb,
  '[{"q": "Do rooms have private bathrooms?", "a": "Yes, all private rooms come with ensuite bathrooms featuring hot water."}, {"q": "Is there air conditioning?", "a": "Yes, all private rooms are fully air-conditioned."}, {"q": "Can I work from my room?", "a": "Absolutely! We have free high-speed Wi-Fi perfect for digital nomads."}]'::jsonb,
  'available',
  true
),
(
  'dorms',
  'Mixed Dorm Rooms',
  '2 Rooms, 3 Bunk Beds Each',
  'Traveling on a budget or want to meet other travelers? Our mixed dorms are simple, clean, and social.',
  'Our mixed dorm rooms are perfect for backpackers and social travelers. Each room has 3 comfortable bunk beds with clean bedding, shared bathroom facilities, and secure storage for your belongings. Meet fellow travelers and share stories in our community spaces.',
  'Backpackers, groups, and travelers who like community.',
  'Budget-friendly rates',
  6,
  'bed',
  '["Comfortable bunk beds with clean bedding", "Shared bathrooms", "Fan ventilation", "Lockers or secure storage", "Free Wi-Fi"]'::jsonb,
  '["Budget-friendly", "Social atmosphere", "Secure storage", "6 beds total"]'::jsonb,
  '{"checkIn": "2:00 PM", "checkOut": "11:00 AM", "cancellation": "Please contact us directly for our cancellation policy."}'::jsonb,
  '[{"q": "Are the dorms mixed gender?", "a": "Yes, our dorms are mixed gender for a social travel experience."}, {"q": "Is there secure storage?", "a": "Yes, lockers and secure storage are provided for all guests."}, {"q": "How many beds per room?", "a": "Each dorm room has 3 bunk beds (6 beds total across 2 rooms)."}]'::jsonb,
  'available',
  true
),
(
  'apartment',
  'Two-Bedroom Apartment',
  'Full Apartment',
  'More space. More privacy. More flexibility. Ideal for friends, families, and longer stays while still enjoying the Mulberry Living vibe.',
  'Our two-bedroom apartment offers the perfect blend of independence and community. With a private living space, kitchen facilities, and two separate bedrooms, it is ideal for families, friend groups, or those planning extended stays in Negombo.',
  'Small groups and extended stays in Negombo.',
  'Contact for rates',
  1,
  'unit',
  '["Two private bedrooms", "Living space to relax or hang out", "Kitchen or kitchenette", "Air conditioning and Wi-Fi"]'::jsonb,
  '["Full apartment privacy", "Kitchen facilities", "Perfect for families", "Extended stay friendly"]'::jsonb,
  '{"checkIn": "2:00 PM", "checkOut": "11:00 AM", "cancellation": "Please contact us directly for our cancellation policy."}'::jsonb,
  '[{"q": "Does the apartment have a kitchen?", "a": "Yes, the apartment includes a kitchen or kitchenette for your convenience."}, {"q": "How many bedrooms?", "a": "The apartment has two private bedrooms."}, {"q": "Is it suitable for families?", "a": "Absolutely! It is perfect for families and small groups."}]'::jsonb,
  'available',
  true
);

-- Create storage bucket for stay images
INSERT INTO storage.buckets (id, name, public) VALUES ('stay-images', 'stay-images', true);

-- Storage policies for stay-images bucket
CREATE POLICY "Anyone can view stay images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'stay-images');

CREATE POLICY "Admins can upload stay images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'stay-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stay images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'stay-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stay images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'stay-images' AND public.has_role(auth.uid(), 'admin'));