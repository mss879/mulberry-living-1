import type { Metadata } from "next";
import About from "@/views/About";

export const metadata: Metadata = {
  title: "About Us — Our Story & Philosophy",
  description:
    "Learn about Mulberry Living — a relaxed, welcoming space in Ettukala, Negombo created for travelers who want comfort, cleanliness, and connection. Private rooms, dorms, and apartments.",
  keywords: [
    "about Mulberry Living",
    "guesthouse Ettukala Negombo",
    "Negombo hostel story",
    "Sri Lanka accommodation",
    "traveler-friendly hostel",
  ],
  alternates: {
    canonical: "https://mulberry-living.com/about",
  },
  openGraph: {
    title: "About Mulberry Living | Our Story — Negombo, Sri Lanka",
    description:
      "A friendly stay in Negombo, built for travelers — comfort, cleanliness, and community.",
    url: "https://mulberry-living.com/about",
    images: [
      {
        url: "/843697524.jpg",
        width: 1200,
        height: 630,
        alt: "Mulberry Living — about our guesthouse in Negombo",
      },
    ],
  },
};

export default function AboutPage() {
  return <About />;
}
