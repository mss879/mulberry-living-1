import AdminDashboard from "@/views/admin/Dashboard";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
