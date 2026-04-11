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
  Tag,
  TicketPercent,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  coupon_code: string | null;
  max_uses: number;
  times_used: number;
  min_nights: number;
  min_guests: number;
  discount_type: string;
  discount_value: number;
  applicable_stay_id: string | null;
}

interface Stay {
  id: string;
  title: string;
  slug: string;
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
    coupon_code: "",
    max_uses: "0",
    min_nights: "0",
    min_guests: "0",
    discount_type: "fixed",
    discount_value: "0",
    applicable_stay_id: "",
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

  const { data: stays } = useQuery({
    queryKey: ["adminStays"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stays")
        .select("id, title, slug")
        .order("title", { ascending: true });
      if (error) throw error;
      return data as Stay[];
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
          coupon_code: form.coupon_code !== undefined ? (form.coupon_code || null) : promo.coupon_code,
          max_uses: form.max_uses ?? promo.max_uses,
          min_nights: form.min_nights ?? promo.min_nights,
          min_guests: form.min_guests ?? promo.min_guests,
          discount_type: form.discount_type ?? promo.discount_type,
          discount_value: form.discount_value ?? promo.discount_value,
          applicable_stay_id: form.applicable_stay_id !== undefined
            ? (form.applicable_stay_id || null)
            : promo.applicable_stay_id,
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
        coupon_code: newPromo.coupon_code || null,
        max_uses: parseInt(newPromo.max_uses) || 0,
        min_nights: parseInt(newPromo.min_nights) || 0,
        min_guests: parseInt(newPromo.min_guests) || 0,
        discount_type: newPromo.discount_type,
        discount_value: parseFloat(newPromo.discount_value) || 0,
        applicable_stay_id: newPromo.applicable_stay_id || null,
      });
      toast.success("Promotion added");
      setNewPromo({
        title: "",
        condition: "",
        reward: "",
        description: "",
        valid_from: "",
        valid_until: "",
        coupon_code: "",
        max_uses: "0",
        min_nights: "0",
        min_guests: "0",
        discount_type: "fixed",
        discount_value: "0",
        applicable_stay_id: "",
      });
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
              Create and manage promotional offers and coupon codes.
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

                {/* Row 1: Basic Info */}
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
                </div>

                {/* Row 2: Dates */}
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
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

                {/* Row 3: Coupon Code Settings */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-accent" />
                    Coupon Code Settings
                    <span className="text-xs text-muted-foreground font-normal">(optional — leave blank for display-only offers)</span>
                  </h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Coupon Code</Label>
                      <Input
                        placeholder="e.g. APRIL20"
                        value={newPromo.coupon_code}
                        onChange={(e) => setNewPromo((p) => ({ ...p, coupon_code: e.target.value.toUpperCase() }))}
                        className="uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Uses</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0 = unlimited"
                        value={newPromo.max_uses}
                        onChange={(e) => setNewPromo((p) => ({ ...p, max_uses: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground">0 = unlimited</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <Select
                        value={newPromo.discount_type}
                        onValueChange={(v) => setNewPromo((p) => ({ ...p, discount_type: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed ($)</SelectItem>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Value</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 10"
                        value={newPromo.discount_value}
                        onChange={(e) => setNewPromo((p) => ({ ...p, discount_value: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Min Nights Required</Label>
                      <Input
                        type="number"
                        min="0"
                        value={newPromo.min_nights}
                        onChange={(e) => setNewPromo((p) => ({ ...p, min_nights: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground">0 = no minimum</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Min Guests Required</Label>
                      <Input
                        type="number"
                        min="0"
                        value={newPromo.min_guests}
                        onChange={(e) => setNewPromo((p) => ({ ...p, min_guests: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground">0 = no minimum</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Applicable Stay</Label>
                      <Select
                        value={newPromo.applicable_stay_id || "any"}
                        onValueChange={(v) => setNewPromo((p) => ({ ...p, applicable_stay_id: v === "any" ? "" : v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any Stay" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Stay</SelectItem>
                          {stays?.map((stay) => (
                            <SelectItem key={stay.id} value={stay.id}>
                              {stay.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                      {/* Row 1: Basic info */}
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

                      {/* Row 2: Dates & Description */}
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

                      {/* Row 3: Coupon settings */}
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-3.5 w-3.5 text-accent" />
                          <span className="text-xs font-medium text-muted-foreground">Coupon Code</span>
                          {promo.coupon_code && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono">
                              {promo.coupon_code}
                            </span>
                          )}
                          {promo.coupon_code && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              {promo.times_used} / {promo.max_uses === 0 ? "∞" : promo.max_uses} used
                            </span>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Code</Label>
                            <Input
                              value={form.coupon_code || ""}
                              onChange={(e) => updateField(promo.id, "coupon_code", e.target.value.toUpperCase())}
                              className="h-8 text-sm uppercase font-mono"
                              placeholder="e.g. APRIL20"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Max Uses</Label>
                            <Input
                              type="number"
                              min="0"
                              value={form.max_uses}
                              onChange={(e) => updateField(promo.id, "max_uses", parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Discount Type</Label>
                            <Select
                              value={form.discount_type || "fixed"}
                              onValueChange={(v) => updateField(promo.id, "discount_type", v)}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed ($)</SelectItem>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Discount Value</Label>
                            <Input
                              type="number"
                              min="0"
                              value={form.discount_value}
                              onChange={(e) => updateField(promo.id, "discount_value", parseFloat(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3 mt-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Min Nights</Label>
                            <Input
                              type="number"
                              min="0"
                              value={form.min_nights}
                              onChange={(e) => updateField(promo.id, "min_nights", parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Min Guests</Label>
                            <Input
                              type="number"
                              min="0"
                              value={form.min_guests}
                              onChange={(e) => updateField(promo.id, "min_guests", parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Applicable Stay</Label>
                            <Select
                              value={form.applicable_stay_id || "any"}
                              onValueChange={(v) => updateField(promo.id, "applicable_stay_id", v === "any" ? "" : v)}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Any Stay" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any Stay</SelectItem>
                                {stays?.map((stay) => (
                                  <SelectItem key={stay.id} value={stay.id}>
                                    {stay.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
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
