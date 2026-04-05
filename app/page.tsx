import type { Metadata } from "next";
import Home from "@/views/Home";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Mulberry Living | Affordable Rooms & Stays in Negombo, Sri Lanka",
  description:
    "Book private ensuite rooms, mixed dorm beds, or a full apartment at Mulberry Living in Ettukala, Negombo — just 12 km from Colombo airport. Free Starlink WiFi, parking, rooftop views.",
  keywords: [
    "Negombo accommodation",
    "rooms near Colombo airport",
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
    title: "Mulberry Living | Affordable Rooms & Stays in Negombo, Sri Lanka",
    description:
      "Book private ensuite rooms, mixed dorm beds, or a full apartment at Mulberry Living in Ettukala, Negombo — just 12 km from Colombo airport.",
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
  "@type": "LodgingBusiness",
  name: "Mulberry Living",
  description:
    "A relaxed, welcoming space in Negombo, Sri Lanka offering private ensuite rooms, mixed dorm beds, and a full two-bedroom apartment for travelers.",
  url: "https://mulberry-living.com",
  telephone: "+94779900394",
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
    { "@type": "LocationFeatureSpecification", name: "24/7 Security & CCTV", value: true },
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
        text: "We offer 8 ensuite private rooms, 2 mixed dorm rooms (3 bunk beds each), and a two-bedroom apartment.",
      },
    },
    {
      "@type": "Question",
      name: "Can you arrange airport transfers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Airport pick-ups and drop-offs can be arranged on request.",
      },
    },
    {
      "@type": "Question",
      name: "Is there Wi-Fi available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide free Starlink Internet throughout the property.",
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
      <JsonLd data={lodgingBusinessSchema} />
      <JsonLd data={faqSchema} />
      <Home />
    </>
  );
}
