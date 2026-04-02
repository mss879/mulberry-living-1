import { Suspense } from "react";
import AdminBookings from "@/views/admin/Bookings";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <AdminBookings />
      </Suspense>
    </ProtectedRoute>
  );
}
