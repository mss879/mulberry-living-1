"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, Check, MessageCircle, Calendar, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useStay } from '@/hooks/useStays';
import { useAllConfirmedBookings, getAvailabilityOnDate, getNextAvailableDate } from '@/hooks/useAvailability';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-villa.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const getImagesForSlug = (slug: string) => {
  switch (slug) {
    case 'dorms':
    case '6-bed-mixed-dormitory-room':
      return [
        "/6-Bed Mixed Dormitory Room/843450146.jpg", 
        "/6-Bed Mixed Dormitory Room/843449466.jpg", 
        "/6-Bed Mixed Dormitory Room/843449191.jpg", 
        "/6-Bed Mixed Dormitory Room/843723344.jpg", 
        "/6-Bed Mixed Dormitory Room/843723374.jpg"
      ];
    case 'apartment':
      return [
        "/Apartment/843683565 (1).jpg", 
        "/Apartment/843683514.jpg", 
        "/Apartment/843683565.jpg", 
        "/Apartment/843683568.jpg", 
        "/Apartment/843683569.jpg"
      ];
    case 'private-rooms':
    case 'queen':
    case 'queen-room':
      return [
        "/Queen Room/843449793.jpg", 
        "/Queen Room/843449658.jpg", 
        "/Queen Room/843449733.jpg", 
        "/Queen Room/843449416.jpg", 
        "/Queen Room/843683569.jpg"
      ];
    case 'twin':
    case 'twin-room-with-balcony':
      return [
        "/Twin Room with Balcony/843449275.jpg", 
        "/Twin Room with Balcony/843449283.jpg", 
        "/Twin Room with Balcony/843449416.jpg", 
        "/Twin Room with Balcony/843691852.jpg"
      ];
    default:
      return [heroImage.src, heroImage.src, heroImage.src, heroImage.src, heroImage.src];
  }
};

interface FAQ {
  q: string;
  a: string;
}

interface Rules {
  checkIn?: string;
  checkOut?: string;
  cancellation?: string;
}

export default function StayDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: stay, isLoading: stayLoading, error } = useStay(slug || '');
  const { data: bookings = [], isLoading: bookingsLoading } = useAllConfirmedBookings();

  const isLoading = stayLoading || bookingsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20 bg-background">
          <div className="container-wide">
            <Skeleton className="h-[50vh] w-full rounded-3xl mb-8" />
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div>
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !stay) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20 bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="heading-section mb-4">Stay Not Found</h1>
            <p className="text-muted-foreground mb-8">The stay option you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/stays">View All Stays</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const amenities = Array.isArray(stay.amenities) ? (stay.amenities as string[]) : [];
  const highlights = Array.isArray(stay.highlights) ? (stay.highlights as string[]) : [];
  const faqs = Array.isArray(stay.faqs) ? (stay.faqs as unknown as FAQ[]) : [];
  const rules = (stay.rules && typeof stay.rules === 'object' && !Array.isArray(stay.rules)) 
    ? (stay.rules as unknown as Rules) 
    : {};
  
  const unitType = stay.inventory_type === 'bed' ? 'beds' : stay.inventory_type === 'unit' ? 'unit' : 'rooms';
  const total = stay.inventory_total ?? 1;
  
  // Real-time Availability
  const today = new Date();
  const { availableCount, isAvailable } = getAvailabilityOnDate(today, stay, bookings);
  const nextDate = !isAvailable ? getNextAvailableDate(stay, bookings) : null;

  return (
    <Layout>
      <section className="container-wide pt-28 pb-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="mb-8">
            <p className="text-sm font-medium text-accent mb-2 tracking-wider uppercase">
              {stay.headline}
            </p>
            <h1 className="heading-display mb-4 text-foreground">
              {stay.title}
            </h1>
            
            <div className="flex justify-center mb-6">
              <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                isAvailable 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              }`}>
                {isAvailable 
                  ? `${availableCount} ${unitType} currently available` 
                  : nextDate ? `Booked till ${format(nextDate, 'MMMM d, yyyy')}` : 'Currently fully booked'}
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto md:mx-0 text-center md:text-left">
              {stay.summary}
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[50vh] min-h-[400px] mb-8 rounded-3xl overflow-hidden">
            <div className="md:col-span-2 md:row-span-2 relative">
              <Image src={getImagesForSlug(stay.slug)[0]} alt={`${stay.title} — primary photo`} width={800} height={600} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            {getImagesForSlug(stay.slug).slice(1, 5).map((img, i) => (
              <div key={i} className="relative hidden md:block overflow-hidden">
                <Image src={img} alt={`${stay.title} gallery photo ${i + 2}`} width={400} height={300} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer" />
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-12"
            >
              {/* Description */}
              <div>
                <h2 className="heading-card mb-4">About This Stay</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {stay.description}
                </p>
                {stay.best_for && (
                  <p className="mt-4 text-foreground">
                    <span className="font-semibold">Best for:</span> {stay.best_for}
                  </p>
                )}
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div>
                  <h2 className="heading-card mb-6">What's Included</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-secondary"
                      >
                        <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                          <Check className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {highlights.length > 0 && (
                <div>
                  <h2 className="heading-card mb-6">Highlights</h2>
                  <div className="flex flex-wrap gap-3">
                    {highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* House Rules */}
              {(rules.checkIn || rules.checkOut) && (
                <div>
                  <h2 className="heading-card mb-6">House Rules</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {rules.checkIn && (
                      <div className="p-4 rounded-xl bg-secondary">
                        <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                        <p className="font-medium text-foreground">{rules.checkIn}</p>
                      </div>
                    )}
                    {rules.checkOut && (
                      <div className="p-4 rounded-xl bg-secondary">
                        <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                        <p className="font-medium text-foreground">{rules.checkOut}</p>
                      </div>
                    )}
                  </div>
                  {rules.cancellation && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {rules.cancellation}
                    </p>
                  )}
                </div>
              )}

              {/* FAQs */}
              {faqs.length > 0 && (
                <div>
                  <h2 className="heading-card mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`faq-${index}`}
                        className="border border-border rounded-xl px-6 py-1 bg-card"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-28 p-6 rounded-2xl bg-card border border-border space-y-6">
                <div>
                  <p className="text-2xl font-serif font-semibold text-foreground">
                    {stay.price_text || 'Contact for rates'}
                  </p>
                  {total && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {availableCount} of {total} {unitType} available based on bookings
                    </p>
                  )}
                </div>

                <div className={`p-4 rounded-xl ${isAvailable ? 'bg-primary/10 border border-primary/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {isAvailable 
                        ? `${availableCount} ${unitType} currently available` 
                        : nextDate ? `Booked till ${format(nextDate, 'MMMM d, yyyy')}` : 'Currently fully booked'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isAvailable
                      ? `Great news! We have ${availableCount} ${unitType} ready for you.`
                      : 'These dates are booked. You can still send an enquiry for future stay dates.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/booking">
                      Book This Stay
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <a href="https://wa.me/94779900394" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp Us
                    </a>
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Have questions? We typically respond within a few hours.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
