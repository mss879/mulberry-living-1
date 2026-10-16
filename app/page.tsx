import type { Metadata } from "next";
import Home from "@/views/Home";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: { absolute: "Hotel Near Colombo Airport & Negombo Beach Stay | Mulberry Living" },
  description:
    "Stay in Ettukala, Negombo, 12 km from Colombo airport. Private ensuite rooms, dorms and a 2-bed apartment with Free Starlink WiFi, smart key entry, parking and rooftop views.",
  keywords: [
    "hotel near Colombo airport",
    "Negombo beach stay",
    "Negombo accommodation",
    "rooms near Colombo airport",
    "ladies only dorm Negombo",
    "Negombo hostel",
    "budget stay Negombo",
    "Ettukala guesthouse",
    "backpacker hostel Sri Lanka",
    "private rooms Negombo",
    "dorm beds Negombo",
    "apartment Negombo Sri Lanka",
    "Mulberry Living Negombo",
    "Sri Lanka travel accommodation",
  ],
  alternates: {
    canonical: "https://mulberry-living.com",
  },
  openGraph: {
    title: "Hotel Near Colombo Airport & Negombo Beach Stay | Mulberry Living",
    description:
      "Stay in Ettukala, Negombo, 12 km from Colombo airport. Private ensuite rooms, dorms and a 2-bed apartment with Free Starlink WiFi, smart key entry, parking and rooftop views.",
    url: "https://mulberry-living.com",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Mulberry Living — accommodation in Negombo, Sri Lanka",
      },
    ],
  },
};

const lodgingBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LodgingBusiness", "LocalBusiness"],
  "@id": "https://mulberry-living.com/#business",
  name: "Mulberry Living",
  description:
    "Guest house in Ettukala, Negombo, 12 km from Colombo airport and close to the beach, offering private ensuite rooms, a mixed dorm, a ladies-only dorm, and a two-bedroom apartment.",
  url: "https://mulberry-living.com",
  telephone: "+94779900394",
  email: "info@mulberry-living.com",
  hasMap: "https://www.google.com/maps/search/?api=1&query=Mulberry+Living+No+25+Rani+Mawatha+Ettukala+Negombo",
  sameAs: [
    "https://www.instagram.com/mulberrylivings/",
    "https://www.facebook.com/MulberryLivings/",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "No 25, Rani Mawatha, Ettukala",
    addressLocality: "Negombo",
    addressRegion: "Western Province",
    postalCode: "11500",
    addressCountry: "LK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 7.2194,
    longitude: 79.8385,
  },
  image: "https://mulberry-living.com/hero.jpg",
  priceRange: "$",
  starRating: {
    "@type": "Rating",
    ratingValue: "5",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "100",
    bestRating: "5",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free Starlink WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Smart Key Entry (guest-only access)", value: true },
    { "@type": "LocationFeatureSpecification", name: "CCTV in common areas", value: true },
    { "@type": "LocationFeatureSpecification", name: "Airport Pickup & Drop-off", value: true },
    { "@type": "LocationFeatureSpecification", name: "Rooftop Views", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hot Water", value: true },
  ],
  checkinTime: "14:00",
  checkoutTime: "11:00",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What room types does Mulberry Living offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer 8 ensuite private rooms, a 6-bed mixed dorm, a 6-bed ladies-only dorm, and a two-bedroom apartment (max 6 guests).",
      },
    },
    {
      "@type": "Question",
      name: "Can you arrange airport transfers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Airport pickup ($15) and drop-off ($10) can be arranged on request. Our team member meets you at the Meet and Greet area at Bandaranaike International Airport.",
      },
    },
    {
      "@type": "Question",
      name: "Is there Wi-Fi available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide free Starlink WiFi throughout the property.",
      },
    },
    {
      "@type": "Question",
      name: "How does entrance access work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only staying guests can open the main entrance through smart key. You get a physical smart key at check-in, or an entry code on WhatsApp if you arrive late.",
      },
    },
    {
      "@type": "Question",
      name: "How far is the beach from Mulberry Living?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Negombo Beach is just 500m away. We're also 4 km from Negombo City and 12 km from Bandaranaike International Airport (about 20 mins).",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      {/* Preload the hero video so the browser starts fetching it immediately */}
      <link rel="preload" href="/hero-vid.mp4" as="video" type="video/mp4" />
      <link rel="preload" href="/hero-vid-poster.jpg" as="image" />
      <JsonLd data={lodgingBusinessSchema} />
      <JsonLd data={faqSchema} />
      <Home />
    </>
  );
}
