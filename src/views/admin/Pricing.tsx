"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Save, Percent, Tag, Bed, Users, Home as HomeIcon, RefreshCw, Plane } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

// Auto-generated Supabase types may not include pricing columns yet
const staysClient = supabase as any;

const stayIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'private-rooms': Bed,
  'dorms': Users,
  'apartment': HomeIcon,
};

interface PricingForm {
  price_per_night: string;
  discount_percentage: string;
  discount_label: string;
}

interface TransferForm {
  pickup_price: string;
  dropoff_price: string;
  is_pickup_enabled: boolean;
  is_dropoff_enabled: boolean;
}

export default function Pricing() {
  const queryClient = useQueryClient();
  const [editingForms, setEditingForms] = useState<Record<string, PricingForm>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  // Airport transfer state
  const [transferForm, setTransferForm] = useState<TransferForm | null>(null);
  const [isSavingTransfer, setIsSavingTransfer] = useState(false);
  const [transferSettingsId, setTransferSettingsId] = useState<string | null>(null);

  const { data: stays, isLoading, refetch } = useQuery({
    queryKey: ['adminPricingStays'],
    queryFn: async () => {
      const { data, error } = await staysClient
        .from('stays')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Fetch airport transfer settings
  const { data: transferSettings, refetch: refetchTransfer } = useQuery({
    queryKey: ['adminTransferSettings'],
    queryFn: async () => {
      const { data, error } = await staysClient
        .from('airport_transfer_settings')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Sync transfer settings into local form state
  useState(() => {
    if (transferSettings && !transferForm) {
      setTransferSettingsId(transferSettings.id);
      setTransferForm({
        pickup_price: transferSettings.pickup_price?.toString() || '0',
        dropoff_price: transferSettings.dropoff_price?.toString() || '0',
        is_pickup_enabled: transferSettings.is_pickup_enabled ?? true,
        is_dropoff_enabled: transferSettings.is_dropoff_enabled ?? true,
      });
    }
  });

  // Effect to sync when data loads
  const currentTransferForm = transferForm || (transferSettings ? {
    pickup_price: transferSettings.pickup_price?.toString() || '0',
    dropoff_price: transferSettings.dropoff_price?.toString() || '0',
    is_pickup_enabled: transferSettings.is_pickup_enabled ?? true,
    is_dropoff_enabled: transferSettings.is_dropoff_enabled ?? true,
  } : null);

  const hasTransferEdits = transferForm !== null;

  const updateStay = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await staysClient
        .from('stays')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPricingStays'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['allStays'] });
    },
  });

  const getForm = (stay: any): PricingForm => {
    if (editingForms[stay.id]) return editingForms[stay.id];
    return {
      price_per_night: stay.price_per_night?.toString() || '',
      discount_percentage: stay.discount_percentage?.toString() || '0',
      discount_label: stay.discount_label || '',
    };
  };

  const updateForm = (stayId: string, field: keyof PricingForm, value: string) => {
    const stay = stays?.find((s: any) => s.id === stayId);
    const current = getForm(stay);
    setEditingForms(prev => ({
      ...prev,
      [stayId]: { ...current, [field]: value },
    }));
  };

  const handleSave = async (stayId: string) => {
    const form = editingForms[stayId];
    if (!form) {
      toast.info('No changes to save');
      return;
    }

    const priceVal = form.price_per_night ? parseFloat(form.price_per_night) : null;
    const discountVal = form.discount_percentage ? parseInt(form.discount_percentage) : 0;

    if (priceVal !== null && (isNaN(priceVal) || priceVal < 0)) {
      toast.error('Please enter a valid price');
      return;
    }

    if (isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
      toast.error('Discount must be between 0 and 100');
      return;
    }

    setSavingIds(prev => new Set(prev).add(stayId));
    try {
      await updateStay.mutateAsync({
        id: stayId,
        updates: {
          price_per_night: priceVal,
          discount_percentage: discountVal,
          discount_label: form.discount_label || null,
        },
      });
      toast.success('Pricing updated successfully');
      // Clear editing state for this stay
      setEditingForms(prev => {
        const next = { ...prev };
        delete next[stayId];
        return next;
      });
    } catch (error) {
      toast.error('Failed to update pricing');
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(stayId);
        return next;
      });
    }
  };

  // Airport transfer save handler
  const handleSaveTransfer = async () => {
    if (!currentTransferForm) return;
    const settingsId = transferSettingsId || transferSettings?.id;
    if (!settingsId) {
      toast.error('Transfer settings not found');
      return;
    }

    const pickupVal = parseFloat(currentTransferForm.pickup_price);
    const dropoffVal = parseFloat(currentTransferForm.dropoff_price);

    if (isNaN(pickupVal) || pickupVal < 0) {
      toast.error('Please enter a valid pickup price');
      return;
    }
    if (isNaN(dropoffVal) || dropoffVal < 0) {
      toast.error('Please enter a valid drop-off price');
      return;
    }

    setIsSavingTransfer(true);
    try {
      const { error } = await staysClient
        .from('airport_transfer_settings')
        .update({
          pickup_price: pickupVal,
          dropoff_price: dropoffVal,
          is_pickup_enabled: currentTransferForm.is_pickup_enabled,
          is_dropoff_enabled: currentTransferForm.is_dropoff_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settingsId);
      if (error) throw error;
      toast.success('Airport transfer pricing updated');
      setTransferForm(null); // Clear editing state
      queryClient.invalidateQueries({ queryKey: ['adminTransferSettings'] });
      queryClient.invalidateQueries({ queryKey: ['airportTransferSettings'] });
    } catch (error) {
      toast.error('Failed to update transfer pricing');
    } finally {
      setIsSavingTransfer(false);
    }
  };

  const updateTransferField = (field: keyof TransferForm, value: string | boolean) => {
    const current = currentTransferForm || {
      pickup_price: '0',
      dropoff_price: '0',
      is_pickup_enabled: true,
      is_dropoff_enabled: true,
    };
    setTransferForm({ ...current, [field]: value });
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">Pricing Management</h1>
            <p className="text-muted-foreground">Set starting prices, manage discounts, and configure airport transfer pricing.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { refetch(); refetchTransfer(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Airport Transfer Pricing Card */}
        {currentTransferForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-accent/10 shrink-0">
                  <Plane className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Airport Transfer Pricing</h3>
                  <p className="text-sm text-muted-foreground">Set prices for airport pickup and drop-off services. These are shown to guests during booking.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pickup Price */}
                <div className="space-y-2">
                  <Label htmlFor="transfer-pickup-price" className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Pickup Price (USD)
                  </Label>
                  <Input
                    id="transfer-pickup-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 15"
                    value={currentTransferForm.pickup_price}
                    onChange={(e) => updateTransferField('pickup_price', e.target.value)}
                  />
                </div>

                {/* Dropoff Price */}
                <div className="space-y-2">
                  <Label htmlFor="transfer-dropoff-price" className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Drop-off Price (USD)
                  </Label>
                  <Input
                    id="transfer-dropoff-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 15"
                    value={currentTransferForm.dropoff_price}
                    onChange={(e) => updateTransferField('dropoff_price', e.target.value)}
                  />
                </div>

                {/* Pickup Enabled */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    Pickup Available
                  </Label>
                  <div className="flex items-center gap-3 h-10">
                    <Switch
                      checked={currentTransferForm.is_pickup_enabled}
                      onCheckedChange={(checked) => updateTransferField('is_pickup_enabled', checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {currentTransferForm.is_pickup_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Dropoff Enabled */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    Drop-off Available
                  </Label>
                  <div className="flex items-center gap-3 h-10">
                    <Switch
                      checked={currentTransferForm.is_dropoff_enabled}
                      onCheckedChange={(checked) => updateTransferField('is_dropoff_enabled', checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {currentTransferForm.is_dropoff_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-border/50">
                <Button
                  onClick={handleSaveTransfer}
                  disabled={isSavingTransfer || !hasTransferEdits}
                  className={hasTransferEdits ? '' : 'opacity-50'}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingTransfer ? 'Saving...' : 'Save Transfer Pricing'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {stays?.map((stay: any) => {
              const form = getForm(stay);
              const IconComponent = stayIcons[stay.slug] || Bed;
              const isSaving = savingIds.has(stay.id);
              const hasEdits = !!editingForms[stay.id];
              const previewPrice = form.price_per_night ? parseFloat(form.price_per_night) : undefined;
              const previewDiscount = form.discount_percentage ? parseInt(form.discount_percentage) : 0;

              return (
                <div
                  key={stay.id}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Stay Info */}
                    <div className="flex items-start gap-4 lg:w-1/4 shrink-0">
                      <div className="p-3 rounded-2xl bg-accent/10 shrink-0">
                        <IconComponent className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{stay.title}</h3>
                        <p className="text-sm text-muted-foreground">{stay.headline}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stay.inventory_total} {stay.inventory_type === 'bed' ? 'beds' : stay.inventory_type === 'unit' ? 'unit' : 'rooms'}
                        </p>
                      </div>
                    </div>

                    {/* Pricing Form */}
                    <div className="flex-1 space-y-4">
                      <div className="grid sm:grid-cols-3 gap-4">
                        {/* Starting Price */}
                        <div className="space-y-2">
                          <Label htmlFor={`price-${stay.id}`} className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            Starting Price (USD/night)
                          </Label>
                          <Input
                            id={`price-${stay.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g. 35"
                            value={form.price_per_night}
                            onChange={(e) => updateForm(stay.id, 'price_per_night', e.target.value)}
                          />
                        </div>

                        {/* Discount Percentage */}
                        <div className="space-y-2">
                          <Label htmlFor={`discount-${stay.id}`} className="flex items-center gap-2 text-sm">
                            <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                            Discount (%)
                          </Label>
                          <Input
                            id={`discount-${stay.id}`}
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={form.discount_percentage}
                            onChange={(e) => updateForm(stay.id, 'discount_percentage', e.target.value)}
                          />
                        </div>

                        {/* Discount Label */}
                        <div className="space-y-2">
                          <Label htmlFor={`label-${stay.id}`} className="flex items-center gap-2 text-sm">
                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                            Discount Label (optional)
                          </Label>
                          <Input
                            id={`label-${stay.id}`}
                            type="text"
                            placeholder="e.g. Summer Deal"
                            value={form.discount_label}
                            onChange={(e) => updateForm(stay.id, 'discount_label', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Preview + Save */}
                      <div className="flex items-end justify-between pt-2 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Live Preview</p>
                          <PriceDisplay
                            pricePerNight={previewPrice}
                            discountPercentage={previewDiscount}
                            discountLabel={form.discount_label || undefined}
                            priceText={stay.price_text}
                            size="md"
                          />
                        </div>
                        <Button
                          onClick={() => handleSave(stay.id)}
                          disabled={isSaving || !hasEdits}
                          className={hasEdits ? '' : 'opacity-50'}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save Pricing'}
                        </Button>
                      </div>
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
