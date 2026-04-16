import type { Metadata } from "next";
import Promotions from "@/views/Promotions";

export const metadata: Metadata = {
  title: "Exclusive Offers & Promotions",
  description:
    "Discover exclusive deals at Mulberry Living, Negombo. Free city tours, airport transfers, boat trips, and complimentary nights — limited time offers for our guests.",
  keywords: [
    "Mulberry Living promotions",
    "Negombo guesthouse deals",
    "Sri Lanka accommodation offers",
    "free airport transfer Negombo",
    "Negombo tuk tuk tour",
    "hostel deals Sri Lanka",
  ],
  alternates: {
    canonical: "https://mulberry-living.com/promotions",
  },
  openGraph: {
    title: "Exclusive Offers & Promotions — Mulberry Living, Negombo",
    description:
      "Special deals on stays: free city tours, airport transfers, lagoon boat trips, and complimentary nights.",
    url: "https://mulberry-living.com/promotions",
    images: [
      {
        url: "/843697524.jpg",
        width: 1200,
        height: 630,
        alt: "Mulberry Living — exclusive promotions and offers",
      },
    ],
  },
};

export default function PromotionsPage() {
  return <Promotions />;
}
