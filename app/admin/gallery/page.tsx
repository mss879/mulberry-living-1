import GalleryManagement from "@/views/admin/GalleryManagement";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

export default function AdminGalleryPage() {
  return (
    <ProtectedRoute>
      <GalleryManagement />
    </ProtectedRoute>
  );
}
