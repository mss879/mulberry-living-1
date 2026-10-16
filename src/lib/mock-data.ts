// Mock data for the property - will be replaced with Supabase data

export const WHATSAPP_URL = "https://wa.me/94779900394";
export const WHATSAPP_DISPLAY = "+94 77 990 0394";
export const CONTACT_EMAIL = "info@mulberry-living.com";
export const GUEST_ENTRY_FEATURE = "Guest-only smart entrance access";

export const CANCELLATION_POLICY =
  "Free cancellation up to 48 hours before check-in. Inside 48 hours, first night charged. No-show charged in full. Early check-in / late check-out subject to availability, inquire on WhatsApp.";

export const heroContent = {
  eyebrow: "Ettukala, Negombo - 12 km from Colombo Airport, close to the beach",
  headline: "A home away from home, minutes from the airport",
  summary:
    "Private ensuite rooms, mixed and ladies-only dorms, and a 2-bedroom apartment in Negombo. Free Starlink WiFi, AC private rooms, guest-only smart entry, rooftop views.",
  trust: [
    "Check-in 2:00 PM / Check-out 11:00 AM",
    "Guest-only smart door access",
    "Reply within a few hours on WhatsApp",
  ],
};

export const propertyData = {
  id: "1",
  name: "Mulberry Living",
  headline: heroContent.headline,
  summary: heroContent.summary,
  description: `Whether you are landing in Sri Lanka, heading out for your next stop, or staying a little longer, you'll find clean spaces, comfy beds, and a laid-back atmosphere where it's easy to meet people and feel at home.

Mulberry Living offers four stay options, so you can choose what fits your trip:

• 8 Ensuite Private Rooms - for couples, solo travellers and digital nomads
• 1 Mixed Dorm (6 beds) + 1 Ladies-Only Dorm (6 beds) - same layout, for budget-friendly social stays
• 1 Two-Bedroom Apartment (max 6 guests) - for friends, families and longer stays

You will also enjoy free Starlink WiFi, guest-only smart entry, parking, and a rooftop space to unwind with a view. Housekeeping is available on request, and laundry services are available at an additional charge.`,
  priceText: "Affordable rates for every traveler",
  pricePerNight: null,
  amenities: [
    "Free Starlink WiFi",
    GUEST_ENTRY_FEATURE,
    "Clean bathrooms with hot water",
    "Air-conditioned rooms",
    "CCTV in common areas and on-call management",
    "Rooftop with a view",
    "Free parking",
    "Housekeeping on request",
    "Laundry service (extra charge)",
    "Mini bar facility",
    "Balcony (private rooms)"
  ],
  rules: {
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    cancellation: CANCELLATION_POLICY,
    other: [
      "Respectful of other guests",
      "Quiet hours observed",
      "No smoking inside the property"
    ]
  },
  faqs: [
    {
      q: "What room types do you offer?",
      a: "We offer 8 ensuite private rooms, a 6-bed mixed dorm, a 6-bed ladies-only dorm, and a two-bedroom apartment (max 6 guests)."
    },
    {
      q: "Can you arrange airport transfers?",
      a: "Yes. Airport pickup ($15) and drop-off ($10) can be arranged on request. Share your flight number and landing time on WhatsApp and we will coordinate."
    },
    {
      q: "What experiences can you help arrange?",
      a: "We can help arrange Negombo city tours, boat tours through the lagoon and waterways, and more. Just tell us what you feel like doing!"
    },
    {
      q: "Is there Wi-Fi available?",
      a: "Yes, we provide free Starlink WiFi throughout the property."
    },
    {
      q: "How does entrance access work?",
      a: "Only staying guests can open the main entrance through smart key. You get a physical smart key at check-in, or an entry code on WhatsApp if you arrive late."
    },
    {
      q: "How far is the beach?",
      a: "Negombo Beach is just 500m away. We're also 4 km from Negombo City and 12 km from Bandaranaike International Airport (about 20 mins)."
    }
  ],
  locationText: "Ettukala, Negombo, Sri Lanka – Right where you need to be. Close to the airport, beach, and everyday essentials.",
  mapEmbedUrl: "https://maps.google.com/maps?q=Mulberry%20Living%20No%2025,%20Rani%20Mawatha,%20Ettukala,%20Negombo&t=&z=15&ie=UTF8&iwloc=&output=embed",
  status: "available" as "available" | "occupied",
  isVisible: true,
  gallery: [
    { path: "/hero.jpg", alt: "Mulberry Living exterior" },
    { path: "/DUO08623-HDR.jpg", alt: "Private room with ensuite" },
    { path: "/DUO08647-HDR.jpg", alt: "Mulberry Living common lounge area in Negombo" },
    { path: "/843450319.jpg", alt: "Two-bedroom apartment" },
    { path: "/843450348.jpg", alt: "Rooftop with view" },
    { path: "/843697524.jpg", alt: "Common area" },
  ],
  contact: {
    address: "No 25, Rani Mawatha, Ettukala, Negombo, Sri Lanka 11500",
    phone: "0779900394",
    email: CONTACT_EMAIL,
    distances: [
      { place: "Bandaranaike International Airport", distance: "12 km (about 20 mins)" },
      { place: "Negombo City", distance: "4 km" },
      { place: "Negombo Beach", distance: "500m" },
      { place: "Cafes, restaurants, supermarkets", distance: "about 1 km" },
      { place: "Kattuwa Railway Station", distance: "1 km" },
    ]
  }
};

const dormImages = ["/6-Bed Mixed Dormitory Room/843449191.jpg", "/6-Bed Mixed Dormitory Room/843449466.jpg", "/6-Bed Mixed Dormitory Room/843723344.jpg", "/6-Bed Mixed Dormitory Room/843450146.jpg", "/6-Bed Mixed Dormitory Room/843723374.jpg"];
// No separate photos of the ladies-only dorm yet; it shares the mixed dorm's layout
const ladiesDormImages = [dormImages[2], dormImages[0], dormImages[3], dormImages[1], dormImages[4]];

const dormFeatures = [
  "Private bathroom",
  "Free Starlink WiFi",
  "Air conditioning",
  GUEST_ENTRY_FEATURE,
];

export const roomTypes = [
  {
    id: "queen",
    name: "Queen Room",
    subtitle: "Ensuite Private Room",
    description: "Comfortable and private room perfect for couples or solo travelers who want comfort without the hotel price tag.",
    features: [
      "Ensuite bathroom with hot water",
      "Comfortable queen bed and fresh linen",
      "Air conditioning",
      "Free Starlink WiFi",
      "Balcony and mini bar facility",
      GUEST_ENTRY_FEATURE
    ],
    bestFor: "Post-flight recovery, relaxed workdays.",
    href: "/stays/private-rooms",
    whatsappToBook: false,
    images: ["/Queen Room/843449793.jpg", "/Queen Room/843690968.jpg", "/Queen Room/843691600.jpg", "/Queen Room/843449416.jpg", "/Queen Room/843449658.jpg", "/Queen Room/843449733.jpg", "/Queen Room/843683569.jpg"]
  },
  {
    id: "twin",
    name: "Twin Room with Balcony",
    subtitle: "Ensuite Private Room",
    description: "Perfect for friends or colleagues sharing a room, with the added bonus of a relaxing balcony.",
    features: [
      "Ensuite bathroom with hot water",
      "Two comfortable beds and fresh linen",
      "Air conditioning",
      "Free Starlink WiFi",
      "Private balcony and mini bar facility",
      GUEST_ENTRY_FEATURE
    ],
    bestFor: "Friends sharing, relaxed beach-town evenings.",
    href: "/stays/private-rooms",
    whatsappToBook: false,
    images: ["/Twin Room with Balcony/843449416.jpg", "/Twin Room with Balcony/843449283.jpg", "/Twin Room with Balcony/843691852.jpg", "/Twin Room with Balcony/843449275.jpg"]
  },
  {
    id: "dorm",
    name: "6-Bed Mixed Dorm",
    subtitle: "Dormitory",
    description: "Budget-friendly, clean and social.",
    features: dormFeatures,
    bestFor: "Backpackers, groups",
    href: "/stays/mixed-dorm",
    whatsappToBook: true,
    images: dormImages
  },
  {
    id: "ladies-dorm",
    name: "Ladies-Only Dorm",
    subtitle: "6-bed female-only dorm",
    description: "Same clean design as our mixed dorm, reserved for women.",
    features: dormFeatures,
    bestFor: "Solo female travellers, friends travelling together",
    href: "/stays/ladies-dorm",
    whatsappToBook: true,
    images: ladiesDormImages
  },
  {
    id: "apartment",
    name: "Apartment",
    subtitle: "Full Apartment",
    description: "More space. More privacy. More flexibility. Ideal for friends, families, and longer stays while still enjoying the Mulberry Living vibe.",
    features: [
      "Two private bedrooms (max 6 guests)",
      "Living space to relax or hang out",
      "Kitchenette",
      "Air conditioning",
      "Free Starlink WiFi",
      GUEST_ENTRY_FEATURE
    ],
    bestFor: "Small groups and extended stays in Negombo.",
    href: "/stays/apartment",
    whatsappToBook: false,
    images: ["/Apartment/843683565.jpg", "/Apartment/843683569.jpg", "/Apartment/843683514.jpg", "/Apartment/843683565 (1).jpg", "/Apartment/843683568.jpg", "/Apartment/843683570.jpg", "/Apartment/843683572.jpg", "/Apartment/843694021.jpg", "/Apartment/843694385.jpg"]
  }
];

const dormFaqs = [
  {
    q: "Is the ladies-only dorm different from the mixed dorm?",
    a: "Same clean layout and facilities, reserved for women only for comfort. Both have private bathrooms, Starlink WiFi, Air conditioning, guest-only smart entry."
  },
  {
    q: "How does entrance access work?",
    a: "Only staying guests can open the main entrance. Perfect for late arrivals from the airport, physical key at check-in or code on WhatsApp."
  }
];

export type StaticStay = {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  description: string;
  best_for: string;
  amenities: string[];
  highlights: string[];
  rules: { checkIn: string; checkOut: string; cancellation: string };
  faqs: { q: string; a: string }[];
  images: { url: string; alt: string }[];
};

/**
 * The dorms are booked over WhatsApp, so their detail pages are served from here
 * rather than from the `stays` table that powers the booking form.
 */
export const staticStays: Record<string, StaticStay> = {
  "mixed-dorm": {
    slug: "mixed-dorm",
    title: "6-Bed Mixed Dorm",
    headline: "Dormitory",
    summary: "Budget-friendly, clean and social. Private Bathroom, Starlink Wi-Fi, Air conditioning, guest-only smart entry.",
    description: "Our 6-bed mixed dorm is simple, clean and social: easy to meet people, easy to rest. Comfortable bunk beds with fresh bedding, a private bathroom for the dorm, air conditioning and free Starlink WiFi, with guest-only smart entry to the building.",
    best_for: "Backpackers, groups",
    amenities: ["Comfortable bunk beds with fresh bedding", ...dormFeatures],
    highlights: ["6 beds", "Private bathroom", "Air conditioned", "Social without the chaos"],
    rules: { checkIn: "2:00 PM", checkOut: "11:00 AM", cancellation: CANCELLATION_POLICY },
    faqs: dormFaqs,
    images: dormImages.map((url, i) => ({ url, alt: i === 0 ? "6-bed mixed dorm at Mulberry Living Negombo" : "Mixed dorm room detail" })),
  },
  "ladies-dorm": {
    slug: "ladies-dorm",
    title: "Ladies-Only Dorm",
    headline: "6-bed female-only dorm",
    summary: "Same clean design as our mixed dorm, reserved for women. Private bathroom, Starlink Wi-Fi, Air conditioning, guest-only smart entry.",
    description: "Our ladies-only dorm has the same clean layout and facilities as the mixed dorm, reserved for women only for comfort. Comfortable bunk beds with fresh bedding, a private bathroom for the dorm, air conditioning and free Starlink WiFi, with guest-only smart entry to the building.",
    best_for: "Solo female travellers, friends travelling together",
    amenities: ["Comfortable bunk beds with fresh bedding", ...dormFeatures],
    highlights: ["6 beds", "Women only", "Private bathroom", "Air conditioned"],
    rules: { checkIn: "2:00 PM", checkOut: "11:00 AM", cancellation: CANCELLATION_POLICY },
    faqs: dormFaqs,
    images: ladiesDormImages.map((url, i) => ({ url, alt: i === 0 ? "Ladies-only dorm at Mulberry Living Negombo" : "Ladies-only dorm room detail" })),
  },
};

export const experiences = [
  {
    id: "airport",
    name: "Airport Shuttle",
    description: "Pickup ($15) and drop-off ($10) arranged on request. We meet you at the Meet and Greet area at Bandaranaike International Airport."
  },
  {
    id: "city-tour",
    name: "Negombo City Tour",
    description: "Beaches, markets, churches, local food spots, and hidden corners."
  },
  {
    id: "boat-tour",
    name: "Boat Tours",
    description: "Scenic rides through the Negombo lagoon and waterways, a true local highlight."
  },
  {
    id: "lounge",
    name: "Lounge",
    description: "Relax in our comfortable lounge area."
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Tea and coffee at a charge, and cold beverages available."
  },
  {
    id: "breakfast",
    name: "Breakfast",
    description: "Breakfast can be arranged at prior notice."
  }
];

export const whyChooseUs = [
  {
    title: "Ensuite private rooms, mixed dorm, ladies-only dorm, and a 2-bedroom apartment",
    description: "Choose privacy, community, or full space to suit your trip."
  },
  {
    title: "Social without the chaos",
    description: "Easy to meet people, easy to rest."
  },
  {
    title: "Clean, secure and guest-only access",
    description: "Smart key entry for staying guests only, plus CCTV in common areas and on-call management. Fresh linen and hot water daily."
  },
  {
    title: "Great base in Ettukala, Negombo",
    description: "Close to the airport, beach, restaurants and everyday essentials."
  },
  {
    title: "Airport transfers, tours and local help",
    description: "Pickup, drop, city tour and lagoon boat tours arranged on request."
  }
];

export const testimonials = [
  {
    id: "1",
    name: "Sarah & James",
    location: "London, UK",
    text: "A fantastic home base for our Sri Lanka adventure. Clean rooms, friendly atmosphere, and the location couldn't be better. We'll definitely be back!",
    rating: 5
  },
  {
    id: "2", 
    name: "Marco",
    location: "Berlin, Germany",
    text: "Perfect for budget travelers! The dorms are clean and comfortable, and I made so many friends in the common areas. The staff helped arrange an amazing boat tour.",
    rating: 5
  },
  {
    id: "3",
    name: "The Chen Family",
    location: "Singapore",
    text: "The two-bedroom apartment was ideal for our family. Close to the beach, safe neighborhood, and the hosts were incredibly helpful with local tips.",
    rating: 5
  }
];

export type PropertyStatus = "available" | "occupied";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type EnquiryStatus = "new" | "in_progress" | "closed";

export interface Booking {
  id: string;
  propertyId: string;
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  specialRequests?: string;
  status: BookingStatus;
  paid: boolean;
  paymentProvider?: string;
  paymentReference?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock bookings for admin demo
export const mockBookings: Booking[] = [
  {
    id: "b1",
    propertyId: "1",
    fullName: "Emma Thompson",
    email: "emma@example.com",
    phone: "+44 7700 900123",
    guests: 2,
    checkIn: "2024-03-15",
    checkOut: "2024-03-22",
    specialRequests: "Late check-in around 8 PM if possible. Just landed from London.",
    status: "confirmed",
    paid: true,
    internalNotes: "Airport pickup arranged",
    createdAt: "2024-02-01T10:30:00Z",
    updatedAt: "2024-02-05T14:20:00Z"
  },
  {
    id: "b2",
    propertyId: "1",
    fullName: "Marco Rossi",
    email: "marco.rossi@example.com",
    phone: "+39 333 123 4567",
    guests: 1,
    checkIn: "2024-04-01",
    checkOut: "2024-04-08",
    status: "pending",
    paid: false,
    createdAt: "2024-02-20T08:15:00Z",
    updatedAt: "2024-02-20T08:15:00Z"
  },
  {
    id: "b3",
    propertyId: "1",
    fullName: "Sophie Chen",
    email: "sophie.chen@example.com",
    phone: "+1 555 987 6543",
    guests: 4,
    checkIn: "2024-03-28",
    checkOut: "2024-04-04",
    specialRequests: "Interested in the two-bedroom apartment",
    status: "cancelled",
    paid: false,
    internalNotes: "Cancelled due to travel restrictions",
    createdAt: "2024-01-15T16:45:00Z",
    updatedAt: "2024-02-10T09:00:00Z"
  }
];

// Mock enquiries for admin demo
export const mockEnquiries: Enquiry[] = [
  {
    id: "e1",
    propertyId: "1",
    fullName: "David Williams",
    email: "david.w@example.com",
    phone: "+1 555 123 4567",
    message: "Hi, I'm interested in booking for a group of 6 backpackers in July. Do you have availability in the dorms? Also, is it possible to arrange a boat tour?",
    status: "new",
    createdAt: "2024-02-22T11:30:00Z",
    updatedAt: "2024-02-22T11:30:00Z"
  },
  {
    id: "e2",
    propertyId: "1",
    fullName: "Anna Kowalski",
    email: "anna.k@example.com",
    phone: "+48 500 123 456",
    message: "Could you tell me more about the airport shuttle service? What time can pickups be arranged?",
    status: "in_progress",
    internalNotes: "Sent shuttle pricing and availability. Awaiting response.",
    createdAt: "2024-02-18T14:20:00Z",
    updatedAt: "2024-02-19T10:00:00Z"
  },
  {
    id: "e3",
    propertyId: "1",
    fullName: "Robert Johnson",
    email: "r.johnson@example.com",
    phone: "+44 7900 123456",
    message: "Do you offer any discounts for stays longer than 2 weeks in the apartment?",
    status: "closed",
    internalNotes: "Confirmed discount for extended stays. Guest proceeded to book.",
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-02-12T16:30:00Z"
  }
];
