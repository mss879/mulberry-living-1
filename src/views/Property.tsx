"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, X, MapPin, Clock, Ban, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { propertyData } from "@/lib/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/hero-villa.jpg";
import interiorImage from "@/assets/villa-interior.jpg";
import bedroomImage from "@/assets/villa-bedroom.jpg";
import poolImage from "@/assets/villa-pool.jpg";
import terraceImage from "@/assets/villa-terrace.jpg";

const galleryImages = [
  { src: heroImage.src, alt: "Villa exterior with pool" },
  { src: interiorImage.src, alt: "Living room with fireplace" },
  { src: bedroomImage.src, alt: "Master bedroom" },
  { src: poolImage.src, alt: "Infinity pool" },
  { src: terraceImage.src, alt: "Outdoor dining terrace" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Property() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <Layout>
      {/* Hero Gallery */}
      <section className="pt-20">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[60vh] min-h-[400px]">
          <div
            className="col-span-2 row-span-2 cursor-pointer overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          {galleryImages.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="cursor-pointer overflow-hidden"
              onClick={() => openLightbox(index + 1)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Title & Summary */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{propertyData.locationText}</span>
                </div>
                <h1 className="heading-display mb-4">{propertyData.name}</h1>
                <p className="body-large">{propertyData.summary}</p>
              </motion.div>

              {/* Description */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="heading-card mb-4">About the Property</h2>
                <div className="prose prose-lg text-muted-foreground space-y-4">
                  {propertyData.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="heading-card mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {propertyData.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="p-1 rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Rules */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="heading-card mb-6">House Rules & Policies</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-card border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Check-in</span>
                    </div>
                    <p className="text-muted-foreground">{propertyData.rules.checkIn}</p>
                  </div>
                  <div className="p-6 rounded-xl bg-card border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Check-out</span>
                    </div>
                    <p className="text-muted-foreground">{propertyData.rules.checkOut}</p>
                  </div>
                </div>
                <div className="mt-6 p-6 rounded-xl bg-card border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Ban className="h-5 w-5 text-primary" />
                    <span className="font-medium">Cancellation Policy</span>
                  </div>
                  <p className="text-muted-foreground">{propertyData.rules.cancellation}</p>
                </div>
                <div className="mt-6 space-y-3">
                  {propertyData.rules.other.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1 mt-0.5 rounded-full bg-muted">
                        <Check className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground">{rule}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* FAQs */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  <h2 className="heading-card">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {propertyData.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-28 p-6 rounded-2xl bg-card border border-border shadow-lg"
              >
                <div className="text-center mb-6">
                  <p className="text-3xl font-serif font-semibold text-foreground">
                    {propertyData.priceText}
                  </p>
                  <p className="text-muted-foreground">per night</p>
                </div>
                
                <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      propertyData.status === 'available' 
                        ? 'bg-status-confirmed' 
                        : 'bg-status-cancelled'
                    }`} />
                    <span className="font-medium text-foreground">
                      {propertyData.status === 'available' ? 'Available' : 'Currently Occupied'}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full mb-4" size="lg">
                  <Link href="/booking">Book Now</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/contact">Ask a Question</Link>
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  You won't be charged yet
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 p-2 text-primary-foreground hover:bg-primary-foreground/10 rounded-full transition-colors"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
            >
              <X className="h-8 w-8" />
            </button>
            <button
              className="absolute left-6 p-3 text-primary-foreground hover:bg-primary-foreground/10 rounded-full transition-colors"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              className="absolute right-6 p-3 text-primary-foreground hover:bg-primary-foreground/10 rounded-full transition-colors"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={galleryImages[currentImage].src}
              alt={galleryImages[currentImage].alt}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImage ? 'bg-primary-foreground' : 'bg-primary-foreground/40'
                  }`}
                  onClick={(e) => { e.stopPropagation(); setCurrentImage(index); }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
