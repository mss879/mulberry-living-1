import type { Metadata } from "next";
import StaysIndex from "@/views/stays/StaysIndex";

export const metadata: Metadata = {
  title: "Rooms & Apartments — Stay Your Way",
  description:
    "Browse all stay options at Mulberry Living: ensuite private queen rooms, twin rooms with balcony, 6-bed mixed dorms, and a full two-bedroom apartment in Negombo, Sri Lanka.",
  keywords: [
    "Negombo rooms",
    "private rooms Negombo Sri Lanka",
    "dorm beds Negombo",
    "apartment Negombo",
    "queen room hostel",
    "twin room balcony Negombo",
    "budget accommodation Negombo",
  ],
  alternates: {
    canonical: "https://mulberry-living.com/stays",
  },
  openGraph: {
    title: "Rooms & Apartments | Mulberry Living — Negombo, Sri Lanka",
    description:
      "Choose from private rooms, social dorms, or a full apartment — the perfect space for your trip.",
    url: "https://mulberry-living.com/stays",
    images: [
      {
        url: "/DUO08647-HDR.jpg",
        width: 1200,
        height: 630,
        alt: "Mulberry Living rooms and apartments in Negombo",
      },
    ],
  },
};

export default function StaysPage() {
  return <StaysIndex />;
}
