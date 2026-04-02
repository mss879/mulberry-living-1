"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed, Users, Home as HomeIcon, Edit2, Eye, EyeOff, Check, X, RefreshCw } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const stayIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'private-rooms': Bed,
  'dorms': Users,
  'apartment': HomeIcon,
};

export default function PropertyManagement() {
  const queryClient = useQueryClient();
  
  // Fetch all stays
  const { data: stays, isLoading, refetch } = useQuery({
    queryKey: ['adminPropertyStays'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stays')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Update stay mutation
  const updateStay = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('stays')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPropertyStays'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['allStays'] });
    },
  });

  const [editingStay, setEditingStay] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    headline: '',
    summary: '',
    description: '',
    best_for: '',
    price_text: '',
  });

  // Toggle individual unit availability
  const handleToggleUnit = async (stay: any, unitIndex: number) => {
    const currentAvailable = stay.inventory_available || 0;
    const total = stay.inventory_total || 1;
    
    // If this unit is currently "available" (index < currentAvailable), mark it occupied
    // Otherwise, mark it available
    const isUnitAvailable = unitIndex < currentAvailable;
    const newAvailable = isUnitAvailable ? currentAvailable - 1 : currentAvailable + 1;
    
    // Clamp to valid range
    const clampedAvailable = Math.max(0, Math.min(total, newAvailable));
    
    // Update status based on availability
    const newStatus = clampedAvailable === 0 ? 'occupied' : 'available';
    
    try {
      await updateStay.mutateAsync({
        id: stay.id,
        updates: { 
          inventory_available: clampedAvailable,
          status: newStatus 
        },
      });
      const unitType = stay.inventory_type === 'bed' ? 'Bed' : stay.inventory_type === 'unit' ? 'Unit' : 'Room';
      toast.success(`${unitType} ${unitIndex + 1} ${isUnitAvailable ? 'marked occupied' : 'marked available'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleToggleVisibility = async (stayId: string, currentVisibility: boolean) => {
    try {
      await updateStay.mutateAsync({
        id: stayId,
        updates: { is_visible: !currentVisibility },
      });
      toast.success(`Visibility ${!currentVisibility ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const openEditDialog = (stay: any) => {
    setEditingStay(stay.id);
    setEditForm({
      title: stay.title || '',
      headline: stay.headline || '',
      summary: stay.summary || '',
      description: stay.description || '',
      best_for: stay.best_for || '',
      price_text: stay.price_text || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingStay) return;
    try {
      await updateStay.mutateAsync({
        id: editingStay,
        updates: editForm,
      });
      toast.success('Stay updated successfully');
      setEditingStay(null);
    } catch (error) {
      toast.error('Failed to update stay');
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">Property Management</h1>
            <p className="text-muted-foreground">Manage your stay options, availability, and visibility.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {stays?.map((stay) => {
              const IconComponent = stayIcons[stay.slug] || Bed;
              const isAvailable = stay.status === 'available';
              const amenities = Array.isArray(stay.amenities) ? stay.amenities : [];

              return (
                <div
                  key={stay.id}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Icon and Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-4 rounded-2xl bg-accent/10 shrink-0">
                        <IconComponent className="h-8 w-8 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-foreground mb-1">{stay.title}</h3>
                        <p className="text-sm text-accent mb-2">{stay.headline}</p>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{stay.summary}</p>
                        
                        {/* Inventory Info */}
                        <p className="text-sm text-muted-foreground mb-4">
                          <span className="font-medium text-foreground">{stay.inventory_available ?? stay.inventory_total}</span> of{' '}
                          <span className="font-medium text-foreground">{stay.inventory_total}</span>{' '}
                          {stay.inventory_type === 'bed' ? 'beds' : stay.inventory_type === 'unit' ? 'unit' : 'rooms'} available
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {amenities.slice(0, 4).map((amenity, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground"
                            >
                              {String(amenity)}
                            </span>
                          ))}
                          {amenities.length > 4 && (
                            <span className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
                              +{amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-4 lg:min-w-[320px]">
                      {/* Individual Unit Toggles */}
                      <div className="p-4 rounded-xl bg-secondary">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {stay.inventory_type === 'bed' ? 'Bed Availability' : stay.inventory_type === 'unit' ? 'Unit Availability' : 'Room Availability'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Toggle individual {stay.inventory_type === 'bed' ? 'beds' : stay.inventory_type === 'unit' ? 'units' : 'rooms'} on/off
                            </p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {stay.inventory_available ?? stay.inventory_total}/{stay.inventory_total} Available
                          </span>
                        </div>
                        
                        {/* Unit Toggles Grid */}
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: stay.inventory_total || 1 }).map((_, index) => {
                            const available = stay.inventory_available ?? stay.inventory_total ?? 1;
                            const isUnitAvailable = index < available;
                            const unitLabel = stay.inventory_type === 'bed' ? 'B' : stay.inventory_type === 'unit' ? 'U' : 'R';
                            
                            return (
                              <button
                                key={index}
                                onClick={() => handleToggleUnit(stay, index)}
                                disabled={updateStay.isPending}
                                className={`
                                  w-10 h-10 rounded-lg text-sm font-medium transition-all
                                  ${isUnitAvailable 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300' 
                                    : 'bg-red-100 text-red-600 hover:bg-red-200 border-2 border-red-300'
                                  }
                                  disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                                title={`${unitLabel}${index + 1}: ${isUnitAvailable ? 'Available - Click to mark occupied' : 'Occupied - Click to mark available'}`}
                              >
                                {unitLabel}{index + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Visibility Toggle */}
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                        <div>
                          <p className="text-sm font-medium text-foreground">Visibility</p>
                          <p className="text-xs text-muted-foreground">
                            {stay.is_visible ? 'Shown on website' : 'Hidden from website'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {stay.is_visible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Switch
                            checked={stay.is_visible || false}
                            onCheckedChange={() => handleToggleVisibility(stay.id, stay.is_visible || false)}
                            disabled={updateStay.isPending}
                          />
                        </div>
                      </div>

                      {/* Edit Button */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openEditDialog(stay)}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingStay} onOpenChange={() => setEditingStay(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Stay Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={editForm.headline}
                    onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_text">Price Text</Label>
                  <Input
                    id="price_text"
                    value={editForm.price_text}
                    onChange={(e) => setEditForm({ ...editForm, price_text: e.target.value })}
                    placeholder="e.g., From $50/night"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="best_for">Best For</Label>
                  <Input
                    id="best_for"
                    value={editForm.best_for}
                    onChange={(e) => setEditForm({ ...editForm, best_for: e.target.value })}
                    placeholder="e.g., Couples, Digital Nomads"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={editForm.summary}
                  onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditingStay(null)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={updateStay.isPending}>
                  <Check className="mr-2 h-4 w-4" />
                  {updateStay.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}
