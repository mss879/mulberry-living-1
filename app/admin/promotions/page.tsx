import AdminPromotions from "@/views/admin/Promotions";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminPromotionsPage() {
  return (
    <ProtectedRoute>
      <AdminPromotions />
    </ProtectedRoute>
  );
}
