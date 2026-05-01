"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ImageIcon,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Edit2,
  Check,
  X,
  Star,
  Crosshair,
  Bed,
  Users,
  Home as HomeIcon,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  StayImage,
  useStayImages,
  useUploadStayImage,
  useDeleteStayImage,
  useReorderStayImages,
  useUpdateStayImage,
} from "@/hooks/useStayImages";

const stayIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "private-rooms": Bed,
  dorms: Users,
  apartment: HomeIcon,
};

export default function GalleryManagement() {
  const [selectedStayId, setSelectedStayId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [focalPointImage, setFocalPointImage] = useState<StayImage | null>(null);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [altValue, setAltValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all stays (admin sees all)
  const {
    data: stays,
    isLoading: staysLoading,
    refetch: refetchStays,
  } = useQuery({
    queryKey: ["adminGalleryStays"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("stays")
        .select("id, slug, title, headline")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as { id: string; slug: string; title: string; headline: string }[];
    },
  });

  // Auto-select first stay
  const activeStayId = selectedStayId || stays?.[0]?.id || null;
  const activeStay = stays?.find((s) => s.id === activeStayId);

  // Fetch images for the active stay
  const {
    data: images,
    isLoading: imagesLoading,
    refetch: refetchImages,
  } = useStayImages(activeStayId || undefined);

  const uploadMutation = useUploadStayImage();
  const deleteMutation = useDeleteStayImage();
  const reorderMutation = useReorderStayImages();
  const updateMutation = useUpdateStayImage();

  const activeImages = images;

  // Handle file upload
  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!activeStayId) return;

      const currentMax = activeImages?.length || 0;
      const fileArray = Array.from(files);

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        try {
          await uploadMutation.mutateAsync({
            stayId: activeStayId,
            file,
            alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            position: currentMax + i,
          });
          toast.success(`Uploaded ${file.name}`);
        } catch (err) {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    },
    [activeStayId, activeImages, uploadMutation]
  );

  // Drop zone handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Delete image
  const handleDelete = async (image: StayImage) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    try {
      await deleteMutation.mutateAsync({ image });
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // Move image up or down in position
  const moveImage = async (index: number, direction: 'up' | 'down') => {
    if (!activeStayId || !activeImages) return;
    const newOrder = [...activeImages];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newOrder.length) return;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    const orderedIds = newOrder.map((i) => i.id);
    try {
      await reorderMutation.mutateAsync({ stayId: activeStayId, orderedIds });
    } catch {
      toast.error("Failed to reorder");
    }
  };

  // Alt text editing
  const startEditAlt = (image: StayImage) => {
    setEditingAlt(image.id);
    setAltValue(image.alt || "");
  };

  const saveAlt = async (imageId: string) => {
    try {
      await updateMutation.mutateAsync({ id: imageId, updates: { alt: altValue } });
      toast.success("Alt text updated");
      setEditingAlt(null);
    } catch {
      toast.error("Failed to update alt text");
    }
  };

  // Focal point
  const handleFocalPointClick = (
    e: React.MouseEvent<HTMLDivElement>,
    image: StayImage
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    updateMutation.mutate(
      { id: image.id, updates: { focal_x: x, focal_y: y } },
      {
        onSuccess: () => {
          toast.success(`Focal point set to ${x}%, ${y}%`);
          setFocalPointImage({ ...image, focal_x: x, focal_y: y });
        },
      }
    );
  };

  // Move image to position 0 (make it the hero/primary)
  const makeHero = async (image: StayImage) => {
    if (!activeStayId || !activeImages) return;
    const newOrder = [image, ...activeImages.filter((i) => i.id !== image.id)];
    const orderedIds = newOrder.map((i) => i.id);
    try {
      await reorderMutation.mutateAsync({ stayId: activeStayId, orderedIds });
      toast.success("Set as primary image");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
              Gallery Management
            </h1>
            <p className="text-muted-foreground">
              Upload, reorder, and manage images for each stay category.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchStays();
              refetchImages();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stay Category Tabs */}
        {staysLoading ? (
          <div className="flex gap-3 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stays?.map((stay) => {
              const Icon = stayIcons[stay.slug] || Bed;
              const isActive = activeStayId === stay.id;
              return (
                <button
                  key={stay.id}
                  onClick={() => setSelectedStayId(stay.id)}
                  className={`
                    p-5 rounded-2xl border-2 text-left transition-all duration-200
                    ${
                      isActive
                        ? "border-accent bg-accent/5 shadow-sm"
                        : "border-border bg-card hover:border-accent/30 hover:bg-accent/5"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isActive ? "bg-accent/10" : "bg-secondary"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-accent" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {stay.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{stay.headline}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Image Management Area */}
        {activeStayId && (
          <motion.div
            key={activeStayId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative mb-8 p-8 rounded-2xl border-2 border-dashed text-center transition-all duration-200 cursor-pointer
                ${
                  isDragging
                    ? "border-accent bg-accent/5 scale-[1.01]"
                    : "border-border hover:border-accent/40 hover:bg-accent/5"
                }
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFileUpload(e.target.files);
                  e.target.value = "";
                }}
              />
              <Upload
                className={`h-10 w-10 mx-auto mb-3 ${
                  isDragging ? "text-accent" : "text-muted-foreground"
                }`}
              />
              <p className="font-medium text-foreground mb-1">
                {isDragging ? "Drop images here" : "Click or drag images to upload"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WebP. Multiple files allowed.
              </p>
              {uploadMutation.isPending && (
                <div className="absolute inset-0 bg-background/80 rounded-2xl flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Image Grid */}
            {imagesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                ))}
              </div>
            ) : activeImages && activeImages.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    {activeImages.length} image{activeImages.length !== 1 ? "s" : ""} •
                    Use arrows to reorder • First image = primary thumbnail
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative group rounded-xl overflow-hidden border border-border bg-card"
                    >
                      {/* Position Badge */}
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-bold shadow-sm ${
                            index === 0
                              ? "bg-accent text-accent-foreground"
                              : "bg-black/60 text-white"
                          }`}
                        >
                          {index === 0 ? "★ Primary" : `#${index + 1}`}
                        </span>
                      </div>

                      {/* Reorder Arrows */}
                      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button
                            onClick={() => moveImage(index, 'up')}
                            className="p-1 rounded-md bg-black/60 hover:bg-black/80 text-white transition-colors"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {index < activeImages.length - 1 && (
                          <button
                            onClick={() => moveImage(index, 'down')}
                            className="p-1 rounded-md bg-black/60 hover:bg-black/80 text-white transition-colors"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Image */}
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={image.url}
                          alt={image.alt || "Stay image"}
                          fill
                          className="object-cover"
                          style={{
                            objectPosition: `${image.focal_x}% ${image.focal_y}%`,
                          }}
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>

                      {/* Actions Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Alt text */}
                        {editingAlt === image.id ? (
                          <div className="flex gap-1 mb-2">
                            <Input
                              value={altValue}
                              onChange={(e) => setAltValue(e.target.value)}
                              className="h-7 text-xs bg-white/90 text-black"
                              placeholder="Alt text..."
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-white hover:text-green-400"
                              onClick={() => saveAlt(image.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-white hover:text-red-400"
                              onClick={() => setEditingAlt(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <p
                            className="text-[11px] text-white/80 mb-2 truncate cursor-pointer hover:text-white"
                            onClick={() => startEditAlt(image)}
                          >
                            {image.alt || "Click to add alt text..."}
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-1.5">
                          {index !== 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-white hover:text-accent hover:bg-white/10"
                              onClick={() => makeHero(image)}
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Primary
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs text-white hover:text-accent hover:bg-white/10"
                            onClick={() => setFocalPointImage(image)}
                          >
                            <Crosshair className="h-3 w-3 mr-1" />
                            Focus
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs text-white hover:text-red-400 hover:bg-white/10 ml-auto"
                            onClick={() => handleDelete(image)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 rounded-2xl border border-dashed border-border">
                <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium mb-1">No images yet</p>
                <p className="text-sm text-muted-foreground">
                  Upload images for {activeStay?.title || "this stay"} using the area
                  above.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Focal Point Dialog */}
        <Dialog
          open={!!focalPointImage}
          onOpenChange={() => setFocalPointImage(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Set Focal Point</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-4">
              Click on the image where the most important content is. This determines
              how the image is cropped on different screen sizes.
            </p>
            {focalPointImage && (
              <div className="relative">
                <div
                  className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-crosshair border border-border"
                  onClick={(e) => handleFocalPointClick(e, focalPointImage)}
                >
                  <Image
                    src={focalPointImage.url}
                    alt={focalPointImage.alt || ""}
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                  {/* Focal point indicator */}
                  <div
                    className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      left: `${focalPointImage.focal_x}%`,
                      top: `${focalPointImage.focal_y}%`,
                    }}
                  >
                    <div className="w-full h-full rounded-full border-2 border-white shadow-lg animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Current focal point: {focalPointImage.focal_x}%,{" "}
                  {focalPointImage.focal_y}%
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}
