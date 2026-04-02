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
  StickyNote,
  MessageSquare,
  RefreshCw,
  Bed,
  Users,
  Home as HomeIcon
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

type EnquiryStatus = 'new' | 'in_progress' | 'closed';

const statusColors: Record<EnquiryStatus, string> = {
  new: "bg-blue-500/10 text-blue-600",
  in_progress: "bg-amber-500/10 text-amber-600",
  closed: "bg-muted text-muted-foreground",
};

const stayIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'private-rooms': Bed,
  'dorms': Users,
  'apartment': HomeIcon,
};

export default function AdminEnquiries() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get('status') || 'all';

  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [internalNotes, setInternalNotes] = useState("");

  // Fetch enquiries
  const { data: enquiries, isLoading, refetch } = useQuery({
    queryKey: ['adminAllEnquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*, stays(id, title, slug)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Update enquiry mutation
  const updateEnquiry = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('enquiries')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllEnquiries'] });
      queryClient.invalidateQueries({ queryKey: ['adminEnquiries'] });
    },
  });

  const filteredEnquiries = enquiries?.filter((enquiry) => {
    const matchesSearch = 
      enquiry.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const updateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    try {
      await updateEnquiry.mutateAsync({ id, updates: { status } });
      toast.success(`Enquiry status updated to ${status.replace("_", " ")}`);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const saveNotes = async () => {
    if (selectedEnquiry) {
      try {
        await updateEnquiry.mutateAsync({ 
          id: selectedEnquiry.id, 
          updates: { internal_notes: internalNotes } 
        });
        toast.success("Notes saved");
        setSelectedEnquiry({ ...selectedEnquiry, internal_notes: internalNotes });
      } catch (error) {
        toast.error('Failed to save notes');
      }
    }
  };

  const openEnquiryDetail = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setInternalNotes(enquiry.internal_notes || "");
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
              <h1 className="text-2xl font-serif font-semibold text-foreground">Enquiries</h1>
              <p className="text-muted-foreground mt-1">
                Manage all guest enquiries and messages
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
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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
                      <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Related Stay</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Message</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Created</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enquiry) => {
                      const IconComponent = enquiry.stays ? stayIcons[enquiry.stays.slug] || MessageSquare : MessageSquare;
                      
                      return (
                        <tr key={enquiry.id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-4">
                            <p className="font-medium text-foreground">{enquiry.full_name}</p>
                            <p className="text-sm text-muted-foreground">{enquiry.email}</p>
                          </td>
                          <td className="p-4">
                            {enquiry.stays ? (
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4 text-accent" />
                                <span className="text-sm text-foreground">{enquiry.stays.title}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">General enquiry</span>
                            )}
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-foreground line-clamp-2">{enquiry.message}</p>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium capitalize",
                              statusColors[enquiry.status as EnquiryStatus]
                            )}>
                              {enquiry.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {format(new Date(enquiry.created_at), 'MMM d, yyyy')}
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEnquiryDetail(enquiry)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateEnquiryStatus(enquiry.id, "new")}>
                                  Mark New
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateEnquiryStatus(enquiry.id, "in_progress")}>
                                  Mark In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateEnquiryStatus(enquiry.id, "closed")}>
                                  Mark Closed
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a href={`mailto:${enquiry.email}`}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </a>
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

            {!isLoading && filteredEnquiries.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                No enquiries found
              </div>
            )}
          </motion.div>

          {/* Enquiry Detail Sheet */}
          <Sheet open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              {selectedEnquiry && (
                <>
                  <SheetHeader>
                    <SheetTitle className="font-serif">Enquiry Details</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Related Stay */}
                    {selectedEnquiry.stays && (
                      <div className="p-4 rounded-xl bg-accent/10 flex items-center gap-3">
                        {(() => {
                          const IconComponent = stayIcons[selectedEnquiry.stays.slug] || MessageSquare;
                          return <IconComponent className="h-5 w-5 text-accent" />;
                        })()}
                        <div>
                          <p className="text-sm text-muted-foreground">Related to</p>
                          <p className="font-medium text-foreground">{selectedEnquiry.stays.title}</p>
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-foreground">{selectedEnquiry.full_name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <a href={`mailto:${selectedEnquiry.email}`} className="text-primary hover:underline">
                            {selectedEnquiry.email}
                          </a>
                        </div>
                        {selectedEnquiry.phone && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <a href={`tel:${selectedEnquiry.phone}`} className="text-foreground">
                              {selectedEnquiry.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground">Message</h3>
                      <p className="text-foreground p-4 rounded-lg bg-muted/50 leading-relaxed whitespace-pre-wrap">
                        {selectedEnquiry.message}
                      </p>
                    </div>

                    {/* Received Date */}
                    <div className="text-sm text-muted-foreground">
                      Received on {format(new Date(selectedEnquiry.created_at), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
                    </div>

                    {/* Status Actions */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {(["new", "in_progress", "closed"] as EnquiryStatus[]).map((status) => (
                          <Button
                            key={status}
                            variant={selectedEnquiry.status === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateEnquiryStatus(selectedEnquiry.id, status)}
                            className="capitalize"
                          >
                            {status.replace("_", " ")}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Reply */}
                    <div className="space-y-3">
                      <Button asChild variant="outline" className="w-full">
                        <a href={`mailto:${selectedEnquiry.email}?subject=Re: Your enquiry about Mulberry Living`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Reply via Email
                        </a>
                      </Button>
                      {selectedEnquiry.phone && (
                        <Button asChild variant="outline" className="w-full">
                          <a href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                            WhatsApp Reply
                          </a>
                        </Button>
                      )}
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
                        placeholder="Add private notes about this enquiry..."
                        className="min-h-[100px]"
                      />
                      <Button onClick={saveNotes} size="sm" disabled={updateEnquiry.isPending}>
                        {updateEnquiry.isPending ? 'Saving...' : 'Save Notes'}
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
