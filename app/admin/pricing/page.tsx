import AdminPricing from "@/views/admin/Pricing";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminPricingPage() {
  return (
    <ProtectedRoute>
      <AdminPricing />
    </ProtectedRoute>
  );
}
