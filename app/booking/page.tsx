import type { Metadata } from "next";
import { Suspense } from "react";
import Booking from "@/views/Booking";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description:
    "Book private rooms, dorm beds, or an apartment at Mulberry Living in Negombo, Sri Lanka. Easy online booking with confirmation within 24 hours.",
  keywords: [
    "book room Negombo",
    "hostel reservation Sri Lanka",
    "Negombo accommodation booking",
    "private room booking Negombo",
    "dorm bed reservation",
    "apartment booking Negombo",
  ],
  alternates: {
    canonical: "https://mulberry-living.com/booking",
  },
  openGraph: {
    title: "Book Your Stay | Mulberry Living — Negombo, Sri Lanka",
    description:
      "Choose your perfect accommodation — private rooms, dorm beds, or a full apartment.",
    url: "https://mulberry-living.com/booking",
  },
};

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <Booking />
    </Suspense>
  );
}
