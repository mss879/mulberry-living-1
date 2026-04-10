// Mock data for the property - will be replaced with Supabase data

export const propertyData = {
  id: "1",
  name: "Mulberry Living",
  headline: "Your Perfect Landing Spot\nin Tropical Negombo",
  summary: "A comfortable and welcoming space designed for travelers. Whether you're resting post-flight or exploring the coast, you'll find everything you need right here.",
  description: `Whether you are landing in Sri Lanka, heading out for your next stop, or staying a little longer, you'll find clean spaces, comfy beds, and a laid-back atmosphere where it's easy to meet people and feel at home.

Mulberry Living offers three stay options, so you can choose what fits your trip:

• 8 Ensuite Private Rooms – for couples, solo travelers, and digital nomads
• 2 Mixed Dorm Rooms (3 bunk beds each) – for budget-friendly social stays  
• A Two-Bedroom Apartment – for friends, families, and longer visits

You'll also enjoy free Starlink Internet, parking, and a rooftop space to unwind with a view. Housekeeping is available on request, and laundry services are available at an additional charge.`,
  priceText: "Affordable rates for every traveler",
  pricePerNight: null,
  amenities: [
    "Free Starlink Internet",
    "Clean bathrooms with hot water",
    "Air-conditioned rooms",
    "Secure premises with security and CCTV",
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
    cancellation: "Please contact us directly for our cancellation policy.",
    other: [
      "Respectful of other guests",
      "Quiet hours observed",
      "No smoking inside the property"
    ]
  },
  faqs: [
    {
      q: "What room types do you offer?",
      a: "We offer 8 ensuite private rooms, 2 mixed dorm rooms (3 bunk beds each), and a two-bedroom apartment."
    },
    {
      q: "Can you arrange airport transfers?",
      a: "Yes! Airport pick-ups and drop-offs can be arranged on request."
    },
    {
      q: "What experiences can you help arrange?",
      a: "We can help arrange Negombo city tours, boat tours through the lagoon and waterways, and more. Just tell us what you feel like doing!"
    },
    {
      q: "Is there Wi-Fi available?",
      a: "Yes, we provide free Starlink Internet throughout the property."
    },
    {
      q: "How far is the beach?",
      a: "Negombo Beach is just 500m away. We're also 4 km from Negombo City and 12 km from Bandaranaike International Airport (about 20 mins)."
    }
  ],
  locationText: "Ettukala, Negombo, Sri Lanka – Right where you need to be. Close to the airport, beach, and everyday essentials.",
  mapEmbedUrl: null,
  status: "available" as "available" | "occupied",
  isVisible: true,
  gallery: [
    { path: "/hero.jpg", alt: "Mulberry Living exterior" },
    { path: "/DUO08623-HDR.jpg", alt: "Private room with ensuite" },
    { path: "/DUO08647-HDR.jpg", alt: "Dorm room" },
    { path: "/843450319.jpg", alt: "Two-bedroom apartment" },
    { path: "/843450348.jpg", alt: "Rooftop with view" },
    { path: "/843697524.jpg", alt: "Common area" },
  ],
  contact: {
    address: "No 25, Rani Mawatha, Ettukala, Negombo, Sri Lanka 11500",
    phone: "0779900394",
    distances: [
      { place: "Bandaranaike International Airport", distance: "12 km (about 20 mins)" },
      { place: "Negombo City", distance: "4 km" },
      { place: "Negombo Beach", distance: "500m" },
      { place: "Cafes, restaurants, supermarkets", distance: "about 1 km" },
      { place: "Kattuwa Railway Station", distance: "1 km" },
    ]
  }
};

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
      "Free Starlink Internet",
      "Mini bar facility",
      "Balcony"
    ],
    bestFor: "Post-flight recovery, relaxed workdays.",
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
      "Free Starlink Internet",
      "Mini bar facility",
      "Private balcony"
    ],
    bestFor: "Friends sharing, relaxed beach-town evenings.",
    images: ["/Twin Room with Balcony/843449416.jpg", "/Twin Room with Balcony/843449283.jpg", "/Twin Room with Balcony/843691852.jpg", "/Twin Room with Balcony/843449275.jpg"]
  },
  {
    id: "dorm",
    name: "6-Bed Mixed Dormitory Room",
    subtitle: "Dormitory",
    description: "Traveling on a budget or want to meet other travelers? Our mixed dorms are simple, clean, and social.",
    features: [
      "Comfortable bunk beds with clean bedding",
      "Shared bathrooms",
      "Fan ventilation",
      "Free Starlink Internet"
    ],
    bestFor: "Backpackers, groups, and travelers who like community.",
    images: ["/6-Bed Mixed Dormitory Room/843449191.jpg", "/6-Bed Mixed Dormitory Room/843449466.jpg", "/6-Bed Mixed Dormitory Room/843723344.jpg", "/6-Bed Mixed Dormitory Room/843450146.jpg", "/6-Bed Mixed Dormitory Room/843723374.jpg"]
  },
  {
    id: "apartment",
    name: "Apartment",
    subtitle: "Full Apartment",
    description: "More space. More privacy. More flexibility. Ideal for friends, families, and longer stays while still enjoying the Mulberry Living vibe.",
    features: [
      "Two private bedrooms",
      "Living space to relax or hang out",
      "Kitchen or kitchenette",
      "Air conditioning and Free Starlink Internet"
    ],
    bestFor: "Small groups and extended stays in Negombo.",
    images: ["/Apartment/843683565.jpg", "/Apartment/843683569.jpg", "/Apartment/843683514.jpg", "/Apartment/843683565 (1).jpg", "/Apartment/843683568.jpg", "/Apartment/843683570.jpg", "/Apartment/843683572.jpg", "/Apartment/843694021.jpg", "/Apartment/843694385.jpg"]
  }
];

export const experiences = [
  {
    id: "airport",
    name: "Airport Shuttle",
    description: "Pick-ups and drop-offs can be arranged on request."
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
  "A mix of ensuite private rooms, mixed dorms, and a two-bedroom apartment",
  "A social, traveler-friendly vibe without the chaos",
  "Clean, safe, and well-managed",
  "Great location in Ettukala, Negombo",
  "Easy access to transport, tours, and local experiences"
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
