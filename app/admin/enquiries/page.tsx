import { Suspense } from "react";
import AdminEnquiries from "@/views/admin/Enquiries";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminEnquiriesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <AdminEnquiries />
      </Suspense>
    </ProtectedRoute>
  );
}
