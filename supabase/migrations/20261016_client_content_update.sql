-- Client content update (Oct 2026): Starlink WiFi + guest-only smart entry in
-- "What's Included", new FAQ answers, and the new cancellation policy.
-- The dorm pages (/stays/mixed-dorm, /stays/ladies-dorm) are defined in code, not here.

UPDATE public.stays
SET
  amenities = '[
    "Ensuite bathroom with hot water",
    "Free Starlink WiFi",
    "Air conditioning",
    "Comfortable bed and fresh linen",
    "Mini bar facility",
    "Balcony",
    "Guest-only smart entrance access"
  ]'::jsonb,
  faqs = '[
    {"q": "Do rooms have private bathrooms?", "a": "Yes. All 8 private rooms have their own ensuite bathroom with hot water."},
    {"q": "Is there air conditioning?", "a": "Yes. All private rooms have AC, plus Free Starlink WiFi."},
    {"q": "Can I work from my room?", "a": "Yes. Starlink WiFi, work-friendly setup, and quiet rooms for post-flight recovery and workdays."},
    {"q": "How does entrance access work?", "a": "Only staying guests can open the main entrance through smart key. You get a physical smart key at check-in. Arriving late? We send an entry code on WhatsApp before arrival so you can get in securely."},
    {"q": "Is housekeeping available on short/long stays?", "a": "Housekeeping and linen change will be done every 5 days for long stays. For short stays, housekeeping & linen change can be requested at a charge."}
  ]'::jsonb,
  rules = COALESCE(rules, '{}'::jsonb) || '{"cancellation": "Free cancellation up to 48 hours before check-in. Inside 48 hours, first night charged. No-show charged in full. Early check-in / late check-out subject to availability, inquire on WhatsApp."}'::jsonb,
  updated_at = now()
WHERE slug = 'private-rooms';

UPDATE public.stays
SET
  amenities = '[
    "Two private bedrooms (max 6 guests)",
    "Kitchenette plus living space to relax",
    "Air conditioning",
    "Free Starlink WiFi",
    "Smart TV with local & international channels",
    "Guest-only smart entrance access"
  ]'::jsonb,
  faqs = '[
    {"q": "Does the apartment have a kitchen?", "a": "Yes. Kitchenette for cooking plus living space to relax."},
    {"q": "How many bedrooms?", "a": "Two private bedrooms, max 6 guests total."},
    {"q": "Is it suitable for families?", "a": "Yes. Ideal for families, friends and longer stays. Full privacy with Starlink WiFi, AC, & Smart TV with Local & International Channels."},
    {"q": "How does entrance access work?", "a": "Separate entrance to the apartment on the ground floor with a key upon check-in."},
    {"q": "Is housekeeping available on short/long stays?", "a": "Housekeeping and linen change will be done every 5 days for long stays. For short stays, housekeeping & linen change can be requested at a charge."}
  ]'::jsonb,
  rules = COALESCE(rules, '{}'::jsonb) || '{"cancellation": "Free cancellation up to 48 hours before check-in. Inside 48 hours, first night charged. No-show charged in full. Early check-in / late check-out subject to availability, inquire on WhatsApp."}'::jsonb,
  updated_at = now()
WHERE slug = 'apartment';
