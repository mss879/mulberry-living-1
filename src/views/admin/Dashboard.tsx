"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Bed,
  Users,
  Home as HomeIcon
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stayIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'private-rooms': Bed,
  'dorms': Users,
  'apartment': HomeIcon,
};

export default function AdminDashboard() {
  // Fetch bookings
  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, stays(title, slug)')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Fetch enquiries
  const { data: enquiries, isLoading: loadingEnquiries } = useQuery({
    queryKey: ['adminEnquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*, stays(title, slug)')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Fetch stays
  const { data: stays, isLoading: loadingStays } = useQuery({
    queryKey: ['adminStays'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stays')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Stats calculations
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const newEnquiries = enquiries?.filter(e => e.status === 'new').length || 0;

  const stats = [
    {
      label: "Booking Requests",
      value: bookings?.length || 0,
      subtext: "Total",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/admin/bookings",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings,
      subtext: "Awaiting confirmation",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      href: "/admin/bookings?status=pending",
    },
    {
      label: "New Enquiries",
      value: newEnquiries,
      subtext: "Need response",
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/admin/enquiries?status=new",
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
      subtext: "Bookings",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      href: "/admin/bookings?status=confirmed",
    },
  ];

  const recentBookings = bookings?.slice(0, 3) || [];
  const recentEnquiries = enquiries?.slice(0, 3) || [];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-2xl font-serif font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your property.
            </p>
          </motion.div>

          {/* Stay Options Status */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4"
          >
            {loadingStays ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))
            ) : (
              stays?.map((stay) => {
                const IconComponent = stayIcons[stay.slug] || Bed;
                const isAvailable = stay.status === 'available';
                
                return (
                  <Link
                    key={stay.id}
                    href="/admin/property"
                    className="p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-accent/10">
                        <IconComponent className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{stay.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stay.inventory_total} {stay.inventory_type === 'bed' ? 'beds' : stay.inventory_type === 'unit' ? 'unit' : 'rooms'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            isAvailable 
                              ? "bg-green-500/10 text-green-600" 
                              : "bg-red-500/10 text-red-600"
                          )}>
                            {isAvailable ? 'Available' : 'Occupied'}
                          </span>
                          {stay.is_visible ? (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Eye className="h-3 w-3" /> Visible
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <AlertCircle className="h-3 w-3" /> Hidden
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-all"
              >
                <div className={cn("inline-flex p-2 rounded-lg mb-4", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                {loadingBookings || loadingEnquiries ? (
                  <Skeleton className="h-8 w-12 mb-1" />
                ) : (
                  <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                )}
                <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </Link>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-foreground">Recent Bookings</h3>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/bookings">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              {loadingBookings ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{booking.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.check_in), 'MMM d')} → {format(new Date(booking.check_out), 'MMM d, yyyy')}
                        </p>
                        {booking.stays && (
                          <p className="text-xs text-accent mt-1">{booking.stays.title}</p>
                        )}
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        booking.status === "pending" && "bg-amber-500/10 text-amber-600",
                        booking.status === "confirmed" && "bg-green-500/10 text-green-600",
                        booking.status === "cancelled" && "bg-red-500/10 text-red-600"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Enquiries */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-foreground">Recent Enquiries</h3>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/enquiries">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              {loadingEnquiries ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : recentEnquiries.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No enquiries yet</p>
              ) : (
                <div className="space-y-4">
                  {recentEnquiries.map((enquiry: any) => (
                    <div
                      key={enquiry.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{enquiry.full_name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {enquiry.message}
                        </p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ml-4",
                        enquiry.status === "new" && "bg-blue-500/10 text-blue-600",
                        enquiry.status === "in_progress" && "bg-amber-500/10 text-amber-600",
                        enquiry.status === "closed" && "bg-muted text-muted-foreground"
                      )}>
                        {enquiry.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-medium text-foreground mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/admin/property">Manage Properties</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/bookings">View All Bookings</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/enquiries">View All Enquiries</Link>
              </Button>
              <Button asChild variant="ghost">
                <a href="/" target="_blank">View Website →</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
