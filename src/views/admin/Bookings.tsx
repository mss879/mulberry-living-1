"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  Calendar,
  Users,
  DollarSign,
  StickyNote,
  Bed,
  Home as HomeIcon,
  RefreshCw
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  confirmed: "bg-green-500/10 text-green-600",
  cancelled: "bg-red-500/10 text-red-600",
};

const stayIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'private-rooms': Bed,
  'dorms': Users,
  'apartment': HomeIcon,
};

export default function AdminBookings() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get('status') || 'all';
  
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [stayFilter, setStayFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [internalNotes, setInternalNotes] = useState("");

  // Fetch bookings
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['adminAllBookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, stays(id, title, slug, inventory_type)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // Fetch stays for filter
  const { data: stays } = useQuery({
    queryKey: ['staysForFilter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stays')
        .select('id, title, slug')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // Update booking mutation
  const updateBooking = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('bookings')
        // @ts-expect-error - Auto-generated types occasionally evaluate to 'never' for update operations
        .update(updates as any)
        .eq('id', id as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllBookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
    },
  });

  const filteredBookings = bookings?.filter((booking) => {
    const matchesSearch = 
      booking.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesStay = stayFilter === "all" || booking.stay_id === stayFilter;
    return matchesSearch && matchesStatus && matchesStay;
  }) || [];

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await updateBooking.mutateAsync({ id, updates: { status } });
      toast.success(`Booking status updated to ${status}`);
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const togglePaid = async (id: string, currentPaid: boolean) => {
    try {
      await updateBooking.mutateAsync({ id, updates: { paid: !currentPaid } });
      toast.success("Payment status updated");
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, paid: !currentPaid });
      }
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const saveNotes = async () => {
    if (selectedBooking) {
      try {
        await updateBooking.mutateAsync({ 
          id: selectedBooking.id, 
          updates: { internal_notes: internalNotes } 
        });
        toast.success("Notes saved");
        setSelectedBooking({ ...selectedBooking, internal_notes: internalNotes });
      } catch (error) {
        toast.error('Failed to save notes');
      }
    }
  };

  const openBookingDetail = (booking: any) => {
    setSelectedBooking(booking);
    setInternalNotes(booking.internal_notes || "");
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-serif font-semibold text-foreground">Bookings</h1>
              <p className="text-muted-foreground mt-1">
                Manage all booking requests and reservations
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stayFilter} onValueChange={setStayFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Stay Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stays</SelectItem>
                {stays?.map((stay) => (
                  <SelectItem key={stay.id} value={stay.id}>{stay.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Table */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Guest</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Stay</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Dates</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Guests</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Paid</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Created</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const IconComponent = booking.stays ? stayIcons[booking.stays.slug] || Bed : Bed;
                      
                      return (
                        <tr key={booking.id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-4">
                            <p className="font-medium text-foreground">{booking.full_name}</p>
                            <p className="text-sm text-muted-foreground">{booking.email}</p>
                          </td>
                          <td className="p-4">
                            {booking.stays ? (
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4 text-accent" />
                                <span className="text-sm text-foreground">{booking.stays.title}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="text-foreground">{format(new Date(booking.check_in), 'MMM d, yyyy')}</p>
                            <p className="text-sm text-muted-foreground">to {format(new Date(booking.check_out), 'MMM d, yyyy')}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-foreground">{booking.guests}</span>
                            {booking.quantity > 1 && (
                              <span className="text-sm text-muted-foreground ml-1">
                                ({booking.quantity} {booking.stays?.inventory_type === 'bed' ? 'beds' : 'rooms'})
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium capitalize",
                              statusColors[booking.status as BookingStatus]
                            )}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              booking.paid 
                                ? "bg-green-500/10 text-green-600" 
                                : "bg-muted text-muted-foreground"
                            )}>
                              {booking.paid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {format(new Date(booking.created_at), 'MMM d, yyyy')}
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openBookingDetail(booking)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                  Confirm Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "pending")}>
                                  Mark Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "cancelled")}>
                                  Cancel Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => togglePaid(booking.id, booking.paid)}>
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Toggle Paid
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && filteredBookings.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                No bookings found
              </div>
            )}
          </motion.div>

          {/* Booking Detail Sheet */}
          <Sheet open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              {selectedBooking && (
                <>
                  <SheetHeader>
                    <SheetTitle className="font-serif">Booking Details</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Stay Info */}
                    {selectedBooking.stays && (
                      <div className="p-4 rounded-xl bg-accent/10 flex items-center gap-3">
                        {(() => {
                          const IconComponent = stayIcons[selectedBooking.stays.slug] || Bed;
                          return <IconComponent className="h-5 w-5 text-accent" />;
                        })()}
                        <div>
                          <p className="font-medium text-foreground">{selectedBooking.stays.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedBooking.quantity} {selectedBooking.stays.inventory_type === 'bed' ? 'bed(s)' : selectedBooking.stays.inventory_type === 'unit' ? 'unit' : 'room(s)'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Guest Info */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Guest Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{selectedBooking.full_name}</p>
                            <p className="text-sm text-muted-foreground">{selectedBooking.guests} guest(s)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <a href={`mailto:${selectedBooking.email}`} className="text-primary hover:underline">
                            {selectedBooking.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <a href={`tel:${selectedBooking.phone}`} className="text-foreground">
                            {selectedBooking.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Stay Details</h3>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-foreground">
                            {format(new Date(selectedBooking.check_in), 'EEEE, MMMM d, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            to {format(new Date(selectedBooking.check_out), 'EEEE, MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {selectedBooking.special_requests && (
                      <div className="space-y-2">
                        <h3 className="font-medium text-foreground">Special Requests</h3>
                        <p className="text-muted-foreground p-4 rounded-lg bg-muted/50">
                          {selectedBooking.special_requests}
                        </p>
                      </div>
                    )}

                    {/* Status Actions */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {(["pending", "confirmed", "cancelled"] as BookingStatus[]).map((status) => (
                          <Button
                            key={status}
                            variant={selectedBooking.status === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateBookingStatus(selectedBooking.id, status)}
                            className="capitalize"
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant={selectedBooking.paid ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePaid(selectedBooking.id, selectedBooking.paid)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        {selectedBooking.paid ? "Paid" : "Mark as Paid"}
                      </Button>
                    </div>

                    {/* Internal Notes */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium text-foreground">Internal Notes</h3>
                      </div>
                      <Textarea
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        placeholder="Add private notes about this booking..."
                        className="min-h-[100px]"
                      />
                      <Button onClick={saveNotes} size="sm" disabled={updateBooking.isPending}>
                        {updateBooking.isPending ? 'Saving...' : 'Save Notes'}
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <Button asChild variant="outline" className="w-full">
                        <a href={`mailto:${selectedBooking.email}?subject=Your Booking at Mulberry Living`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email Guest
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <a href={`https://wa.me/${selectedBooking.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          WhatsApp Guest
                        </a>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
