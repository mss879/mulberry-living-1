"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  GripVertical,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const promoClient = supabase as any;

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  condition: string;
  reward: string;
  display_order: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
}

export default function AdminPromotions() {
  const queryClient = useQueryClient();
  const [editingForms, setEditingForms] = useState<Record<string, Partial<Promotion>>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [newPromo, setNewPromo] = useState({
    title: "",
    condition: "",
    reward: "",
    description: "",
    valid_from: "",
    valid_until: "",
  });

  const {
    data: promotions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminPromotions"],
    queryFn: async () => {
      const { data, error } = await promoClient
        .from("promotions")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Promotion[];
    },
  });

  // -------- UPDATE --------
  const updatePromo = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await promoClient
        .from("promotions")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPromotions"] });
      queryClient.invalidateQueries({ queryKey: ["activePromotions"] });
    },
  });

  // -------- INSERT --------
  const insertPromo = useMutation({
    mutationFn: async (promo: any) => {
      const { error } = await promoClient.from("promotions").insert(promo);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPromotions"] });
      queryClient.invalidateQueries({ queryKey: ["activePromotions"] });
    },
  });

  // -------- DELETE --------
  const deletePromo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await promoClient.from("promotions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPromotions"] });
      queryClient.invalidateQueries({ queryKey: ["activePromotions"] });
    },
  });

  // -------- HELPERS --------
  const getForm = (promo: Promotion) => {
    if (editingForms[promo.id]) return { ...promo, ...editingForms[promo.id] };
    return promo;
  };

  const updateField = (id: string, field: string, value: any) => {
    setEditingForms((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const handleSave = async (promo: Promotion) => {
    const form = editingForms[promo.id];
    if (!form) {
      toast.info("No changes to save");
      return;
    }

    setSavingIds((prev) => new Set(prev).add(promo.id));
    try {
      await updatePromo.mutateAsync({
        id: promo.id,
        updates: {
          title: form.title ?? promo.title,
          condition: form.condition ?? promo.condition,
          reward: form.reward ?? promo.reward,
          description: form.description ?? promo.description,
          valid_from: form.valid_from ?? promo.valid_from,
          valid_until: form.valid_until ?? promo.valid_until,
          display_order: form.display_order ?? promo.display_order,
          is_active: form.is_active ?? promo.is_active,
        },
      });
      toast.success("Promotion updated");
      setEditingForms((prev) => {
        const next = { ...prev };
        delete next[promo.id];
        return next;
      });
    } catch {
      toast.error("Failed to update promotion");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(promo.id);
        return next;
      });
    }
  };

  const handleAdd = async () => {
    if (!newPromo.condition.trim() || !newPromo.reward.trim()) {
      toast.error("Condition and reward are required");
      return;
    }

    try {
      const maxOrder = promotions?.length
        ? Math.max(...promotions.map((p) => p.display_order))
        : 0;
      await insertPromo.mutateAsync({
        title: newPromo.title || "Special Offer",
        condition: newPromo.condition,
        reward: newPromo.reward,
        description: newPromo.description || null,
        valid_from: newPromo.valid_from || null,
        valid_until: newPromo.valid_until || null,
        display_order: maxOrder + 1,
        is_active: true,
      });
      toast.success("Promotion added");
      setNewPromo({ title: "", condition: "", reward: "", description: "", valid_from: "", valid_until: "" });
      setIsAdding(false);
    } catch {
      toast.error("Failed to add promotion");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    try {
      await deletePromo.mutateAsync(id);
      toast.success("Promotion deleted");
    } catch {
      toast.error("Failed to delete promotion");
    }
  };

  const toggleActive = async (promo: Promotion) => {
    setSavingIds((prev) => new Set(prev).add(promo.id));
    try {
      await updatePromo.mutateAsync({
        id: promo.id,
        updates: { is_active: !promo.is_active },
      });
      toast.success(promo.is_active ? "Promotion hidden" : "Promotion activated");
    } catch {
      toast.error("Failed to toggle promotion");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(promo.id);
        return next;
      });
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
              Promotions Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage promotional offers shown on the website.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Promotion
            </Button>
          </div>
        </div>

        {/* Add New Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-6 rounded-2xl bg-accent/5 border-2 border-dashed border-accent/30">
                <h3 className="text-lg font-serif font-medium mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-accent" />
                  New Promotion
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Group Title</Label>
                    <Input
                      placeholder="e.g. April Specials"
                      value={newPromo.title}
                      onChange={(e) => setNewPromo((p) => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Input
                      placeholder="e.g. Extra info about this offer"
                      value={newPromo.description}
                      onChange={(e) => setNewPromo((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Condition *</Label>
                    <Input
                      placeholder="e.g. 5 nights stay"
                      value={newPromo.condition}
                      onChange={(e) => setNewPromo((p) => ({ ...p, condition: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reward *</Label>
                    <Input
                      placeholder="e.g. 1 night free"
                      value={newPromo.reward}
                      onChange={(e) => setNewPromo((p) => ({ ...p, reward: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valid From</Label>
                    <Input
                      type="date"
                      value={newPromo.valid_from}
                      onChange={(e) => setNewPromo((p) => ({ ...p, valid_from: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valid Until</Label>
                    <Input
                      type="date"
                      value={newPromo.valid_until}
                      onChange={(e) => setNewPromo((p) => ({ ...p, valid_until: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} disabled={insertPromo.isPending}>
                    {insertPromo.isPending ? "Adding..." : "Add Promotion"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Promotions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : !promotions?.length ? (
          <div className="text-center py-16 text-muted-foreground">
            <Gift className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No promotions yet. Click &quot;Add Promotion&quot; to create one.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {promotions.map((promo) => {
              const form = getForm(promo);
              const isSaving = savingIds.has(promo.id);
              const hasEdits = !!editingForms[promo.id];

              return (
                <div
                  key={promo.id}
                  className={`p-5 rounded-2xl border transition-colors ${
                    promo.is_active
                      ? "bg-card border-border"
                      : "bg-muted/30 border-border/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag handle placeholder */}
                    <div className="pt-2 text-muted-foreground/30">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    {/* Editable fields */}
                    <div className="flex-1 space-y-3">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Group Title</Label>
                          <Input
                            value={form.title}
                            onChange={(e) => updateField(promo.id, "title", e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Condition</Label>
                          <Input
                            value={form.condition}
                            onChange={(e) => updateField(promo.id, "condition", e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Reward</Label>
                          <Input
                            value={form.reward}
                            onChange={(e) => updateField(promo.id, "reward", e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Order</Label>
                          <Input
                            type="number"
                            value={form.display_order}
                            onChange={(e) =>
                              updateField(promo.id, "display_order", parseInt(e.target.value) || 0)
                            }
                            className="h-9 text-sm w-20"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Valid From</Label>
                          <Input
                            type="date"
                            value={form.valid_from || ""}
                            onChange={(e) => updateField(promo.id, "valid_from", e.target.value || null)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Valid Until</Label>
                          <Input
                            type="date"
                            value={form.valid_until || ""}
                            onChange={(e) => updateField(promo.id, "valid_until", e.target.value || null)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Description (optional)</Label>
                          <Input
                            value={form.description || ""}
                            onChange={(e) => updateField(promo.id, "description", e.target.value)}
                            className="h-9 text-sm"
                            placeholder="Optional extra info"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 pt-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title={promo.is_active ? "Hide" : "Show"}
                        onClick={() => toggleActive(promo)}
                        disabled={isSaving}
                      >
                        {promo.is_active ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSave(promo)}
                        disabled={isSaving || !hasEdits}
                        title="Save changes"
                      >
                        <Save className={`h-4 w-4 ${hasEdits ? "text-accent" : "text-muted-foreground/30"}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => handleDelete(promo.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
