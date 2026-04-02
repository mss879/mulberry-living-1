import { Suspense } from "react";
import Booking from "@/views/Booking";

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <Booking />
    </Suspense>
  );
}
