"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bed, Users, Home as HomeIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useStays } from '@/hooks/useStays';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-villa.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const getImageForSlug = (slug: string) => {
  switch (slug) {
    case 'dorms':
    case '6-bed-mixed-dormitory-room':
      return '/6-Bed Mixed Dormitory Room/843450146.jpg';
    case 'apartment':
      return '/Apartment/843683565 (1).jpg';
    case 'private-rooms':
    case 'queen':
    case 'queen-room':
      return '/Queen Room/843449793.jpg';
    case 'twin':
    case 'twin-room-with-balcony':
      return '/Twin Room with Balcony/843449275.jpg';
    default:
      return heroImage.src;
  }
};

export default function StaysIndex() {
  const { data: stays, isLoading } = useStays();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[500px] flex items-end pt-32 md:pt-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/DUO08647-HDR.jpg')` }}
        >
          <div className="absolute inset-0 bg-black/50 bg-gradient-hero" />
        </div>
        <div className="relative z-10 container-wide pb-24 md:pb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p variants={fadeInUp} className="text-sm font-medium text-accent mb-4 tracking-widest uppercase">
              Our Accommodations
            </motion.p>
            <motion.h1 variants={fadeInUp} className="heading-display text-primary-foreground mb-4">
              Stay Your Way
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-primary-foreground/80 max-w-2xl">
              Choose the perfect space for your trip — from private comfort to social dorm living, 
              or a full apartment for longer stays.
            </motion.p>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-background" d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* Stays Grid */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl border border-border p-8">
                  <Skeleton className="h-12 w-12 rounded-2xl mb-6" />
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-20 w-full mb-6" />
                  <div className="space-y-3 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid md:grid-cols-3 gap-8"
            >
              {stays?.map((stay) => {
                const amenities = (stay.amenities as string[]) || [];
                const available = stay.inventory_available ?? stay.inventory_total ?? 1;
                const total = stay.inventory_total ?? 1;
                const isAvailable = available > 0;
                const unitType = stay.inventory_type === 'bed' ? 'beds' : stay.inventory_type === 'unit' ? 'unit' : 'rooms';

                return (
                  <motion.div
                    key={stay.id}
                    variants={fadeInUp}
                    className="group relative rounded-3xl bg-card border border-border overflow-hidden hover-lift"
                  >
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                      isAvailable 
                        ? 'bg-primary/90 text-primary-foreground backdrop-blur-md' 
                        : 'bg-destructive/90 text-destructive-foreground backdrop-blur-md'
                    }`}>
                      {isAvailable ? `${available} ${unitType} left` : 'Fully Booked'}
                    </div>

                    <div className="relative w-full h-64 overflow-hidden">
                      <img src={getImageForSlug(stay.slug)} alt={stay.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="p-8 pt-6 relative">
                      <div className="relative z-10">
                        <h3 className="heading-card mb-2 text-foreground">{stay.title}</h3>
                        <p className="text-sm text-accent font-medium mb-4">{stay.headline}</p>
                        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                          {stay.summary}
                        </p>
                        
                        <ul className="space-y-3 mb-6">
                          {amenities.slice(0, 4).map((amenity, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-accent shrink-0" />
                              {amenity}
                            </li>
                          ))}
                        </ul>
                        
                        {stay.best_for && (
                          <p className="text-sm text-foreground mb-6">
                            <span className="font-semibold">Best for:</span> {stay.best_for}
                          </p>
                        )}

                        <div className="flex flex-col gap-3">
                          <Button asChild className="w-full">
                            <Link href={`/stays/${stay.slug}`}>
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                            <Link href="/booking">
                              Book Now
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
