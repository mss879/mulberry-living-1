import AdminProperty from "@/views/admin/PropertyManagement";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminPropertyPage() {
  return (
    <ProtectedRoute>
      <AdminProperty />
    </ProtectedRoute>
  );
}
