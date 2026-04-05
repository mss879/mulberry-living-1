"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, CheckCircle2, AlertCircle, Bed, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useStays, useStay } from '@/hooks/useStays';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const bookingSchema = z.object({
  staySlug: z.string().min(1, 'Please select a stay option'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').max(255),
  phone: z.string().min(6, 'Please enter a valid phone number').max(20),
  guests: z.string().min(1, 'Please select number of guests'),
  quantity: z.string().min(1, 'Please select quantity'),
  checkIn: z.date({ required_error: 'Please select a check-in date' }),
  checkOut: z.date({ required_error: 'Please select a check-out date' }),
  specialRequests: z.string().max(1000).optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: 'Check-out must be after check-in',
  path: ['checkOut'],
});

type BookingFormData = z.infer<typeof bookingSchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stayIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'private-rooms': Bed,
  'dorms': Users,
  'apartment': HomeIcon,
};

export default function Booking() {
  const searchParams = useSearchParams();
  const preselectedStay = searchParams.get('stay');
  
  const { data: stays, isLoading: staysLoading } = useStays();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      staySlug: preselectedStay || '',
      fullName: '',
      email: '',
      phone: '',
      guests: '',
      quantity: '1',
      specialRequests: '',
    },
  });

  const selectedStaySlug = form.watch('staySlug');
  const selectedStay = stays?.find(s => s.slug === selectedStaySlug);
  const isOccupied = selectedStay?.status !== 'available';

  // Update quantity options based on stay type
  const getQuantityOptions = () => {
    if (!selectedStay) return [];
    const max = selectedStay.inventory_total || 1;
    return Array.from({ length: max }, (_, i) => i + 1);
  };

  const getQuantityLabel = () => {
    if (!selectedStay) return 'Quantity';
    switch (selectedStay.inventory_type) {
      case 'bed':
        return 'Number of Beds';
      case 'unit':
        return 'Unit';
      case 'room':
      default:
        return 'Number of Rooms';
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedStay) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        stay_id: selectedStay.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        guests: parseInt(data.guests),
        quantity: parseInt(data.quantity),
        check_in: format(data.checkIn, 'yyyy-MM-dd'),
        check_out: format(data.checkOut, 'yyyy-MM-dd'),
        special_requests: data.specialRequests || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Booking request submitted!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="min-h-screen pt-20 flex items-center justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container-narrow text-center py-20"
          >
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="heading-section mb-4">Booking Request Received!</h1>
            <p className="body-large max-w-lg mx-auto mb-8">
              Thank you for your interest in Mulberry Living. We've received your booking request and will get back to you within 24 hours to confirm availability and next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/stays">View Other Stays</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[500px] flex items-center justify-center pt-32 md:pt-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground container-narrow pb-24 md:pb-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-display mb-4"
          >
            Book Your Stay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Choose your perfect accommodation
          </motion.p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-background" d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Form */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="lg:col-span-2 space-y-8"
                >
                  {/* Step 1: Select Stay Option */}
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm font-bold">1</span>
                      Select Your Stay Option
                    </h2>
                    
                    {staysLoading ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="staySlug"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="grid md:grid-cols-3 gap-4"
                              >
                                {stays?.map((stay) => {
                                  const IconComponent = stayIcons[stay.slug] || Bed;
                                  const isSelected = field.value === stay.slug;
                                  const isAvailable = stay.status === 'available';

                                  return (
                                    <Label
                                      key={stay.id}
                                      htmlFor={stay.slug}
                                      className={cn(
                                        'relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all',
                                        isSelected
                                          ? 'border-accent bg-accent/5'
                                          : 'border-border hover:border-accent/50'
                                      )}
                                    >
                                      <RadioGroupItem
                                        value={stay.slug}
                                        id={stay.slug}
                                        className="sr-only"
                                      />
                                      <div className="flex items-start gap-3 mb-3">
                                        <div className={cn(
                                          'p-2 rounded-lg',
                                          isSelected ? 'bg-accent/20' : 'bg-secondary'
                                        )}>
                                          <IconComponent className={cn(
                                            'h-5 w-5',
                                            isSelected ? 'text-accent' : 'text-muted-foreground'
                                          )} />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-foreground text-sm">{stay.title}</p>
                                          <p className="text-xs text-muted-foreground">{stay.headline}</p>
                                        </div>
                                      </div>
                                      <span className={cn(
                                        'text-xs px-2 py-0.5 rounded-full self-start',
                                        isAvailable
                                          ? 'bg-green-500/10 text-green-600'
                                          : 'bg-red-500/10 text-red-600'
                                      )}>
                                        {isAvailable ? 'Available' : 'Occupied'}
                                      </span>
                                    </Label>
                                  );
                                })}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Availability Status */}
                  {selectedStay && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      {isOccupied ? (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">Currently Occupied</p>
                            <p className="text-sm text-muted-foreground">
                              This option is currently occupied. You can still submit a booking request for future dates, or{' '}
                              <Link href="/contact" className="text-primary underline">send an enquiry</Link>.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">Available for Booking</p>
                            <p className="text-sm text-muted-foreground">
                              Great news! This option is available. Submit your request and we'll confirm within 24 hours.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Dates & Details */}
                  <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm font-bold">2</span>
                      Dates & Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="checkIn"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Check-in Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, 'PPP') : 'Select date'}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="checkOut"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Check-out Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, 'PPP') : 'Select date'}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => {
                                    const checkIn = form.getValues('checkIn');
                                    return date < new Date() || (checkIn && date <= checkIn);
                                  }}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Guests</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select guests" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      {num} {num === 1 ? 'Guest' : 'Guests'}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {selectedStay && selectedStay.inventory_type !== 'unit' && (
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{getQuantityLabel()}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select quantity" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getQuantityOptions().map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  {/* Step 3: Guest Information */}
                  <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm font-bold">3</span>
                      Your Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Let us know about any special requirements..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting || !selectedStay}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-1"
                >
                  <div className="sticky top-28 p-6 rounded-2xl bg-card border border-border">
                    <Image
                      src="/hero.jpg"
                      alt="Mulberry Living accommodation in Negombo"
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                    <h3 className="heading-card mb-2">Mulberry Living</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ettukala, Negombo, Sri Lanka
                    </p>
                    
                    {selectedStay && (
                      <div className="border-t border-border pt-4 mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Selected Stay</p>
                        <p className="font-semibold text-foreground">{selectedStay.title}</p>
                        <p className="text-lg font-serif text-accent mt-2">
                          {selectedStay.price_text || 'Contact for rates'}
                        </p>
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                      <p>Check-in: 2:00 PM</p>
                      <p>Check-out: 11:00 AM</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </Layout>
  );
}
