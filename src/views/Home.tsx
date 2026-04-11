"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight, Wifi, Car, Shield, Eye, Star, MapPin, Bed, Users, Home as HomeIcon, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout/Layout";
import { Preloader } from "@/components/Preloader";
import { propertyData, testimonials, whyChooseUs, roomTypes, experiences } from "@/lib/mock-data";
import { useStays } from "@/hooks/useStays";
import { useAllConfirmedBookings, getAvailabilityOnDate, getNextAvailableDate } from "@/hooks/useAvailability";
import { format } from "date-fns";
const heroImage = { src: "/hero.jpg" };
const interiorImage = { src: "/843450348.jpg" };
const poolImage = { src: "/DUO08647-HDR.jpg" };
const terraceImage = { src: "/843697524.jpg" };
const bedroomImage = { src: "/DUO08623-HDR.jpg" };

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const heroContentLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const heroCardsRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stats = [
  { number: "100+", label: "Happy Guests" },
  { number: "5★", label: "Rating" },
  { number: "3", label: "Room Types" },
  { number: "24/7", label: "Support" },
];

const highlightAmenities = [
  { icon: Wifi, label: "Free Starlink WiFi", description: "High-speed internet" },
  { icon: Car, label: "Free Parking", description: "Secure parking space" },
  { icon: Shield, label: "24/7 Security", description: "Safe & protected" },
  { icon: Eye, label: "Rooftop Views", description: "Stunning panorama" },
];

const roomIcons = {
  queen: Bed,
  twin: Bed,
  dorm: Users,
  apartment: HomeIcon,
};

export default function Home() {
  const { data: stays = [] } = useStays();
  const { data: bookings = [] } = useAllConfirmedBookings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        // Set mobile to 2.5x speed, desktop 2x speed
        const isMobile = window.innerWidth <= 768;
        videoRef.current.playbackRate = isMobile ? 2.5 : 2.0;
        videoRef.current.play().catch(console.error);
      }
    };

    if (typeof window !== "undefined" && window.__preloaderFinished) {
      playVideo();
    } else {
      window.addEventListener("preloaderEnded", playVideo);
      return () => window.removeEventListener("preloaderEnded", playVideo);
    }
  }, []);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    window.dispatchEvent(new Event("heroVideoEnded"));
  };

  return (
    <>
      <Preloader />
      <Layout>
        {/* Hero Section - Full bleed on mobile, contained on desktop */}
        <div className="p-0 md:p-[7px]">
          <section className="relative min-h-[100dvh] md:min-h-[calc(100vh-14px)] flex items-end pb-20 md:pb-32 rounded-none md:rounded-[2rem] overflow-hidden bg-black">
            {/* Background Video */}
            <div className="absolute inset-0">
              <video
                ref={videoRef}
                src="/hero-vid.mp4"
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover"
              />
              {/* Show overlay only after video ends to make text readable */}
              <AnimatePresence>
                {videoEnded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative z-10 w-full px-6 lg:px-[41px]">
              <div className="grid lg:grid-cols-[55%_45%] xl:grid-cols-[60%_40%] gap-12 items-center">
                {/* Hero Content (from left) */}
                <AnimatePresence>
                  {videoEnded && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={heroContentLeft}
                      className="glass-card-dark p-6 md:p-8 rounded-3xl border border-white/10 w-fit"
                    >
                      <motion.h1
                        variants={fadeInUp}
                        className="heading-display mb-4 text-primary-foreground whitespace-pre-line !text-5xl md:!text-6xl lg:!text-[4.2rem] leading-[1.1]"
                      >
                        {propertyData.headline}
                      </motion.h1>
                      <motion.p
                        variants={fadeInUp}
                        className="text-lg md:text-xl text-primary-foreground/90 max-w-xl leading-relaxed"
                      >
                        {propertyData.summary}
                      </motion.p>
                    </ motion.div>
                  )}
                </AnimatePresence>

                {/* Stats Cards - Glass Effect (from right) */}
                <AnimatePresence>
                  {videoEnded && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={heroCardsRight}
                      className="hidden md:grid grid-cols-2 gap-3 max-w-sm w-full lg:ml-8 lg:-mt-16 pb-8"
                    >
                      {stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          variants={fadeInUp}
                          className="glass-card-dark p-4 text-center"
                        >
                          <div className="text-3xl font-serif font-semibold text-primary-foreground mb-1">{stat.number}</div>
                          <div className="text-xs text-primary-foreground/70 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2"
              >
                <div className="w-1 h-2 rounded-full bg-primary-foreground/50" />
              </motion.div>
            </motion.div>
          </section>
        </div>

        {/* Mission Section - Asymmetric Layout */}
        <section className="section-padding bg-background overflow-hidden">
          <div className="container-wide">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={stagger}
                className="lg:col-span-5"
              >
                <motion.p variants={fadeInUp} className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
                  Our Philosophy
                </motion.p>
                <motion.h2 variants={fadeInUp} className="heading-section mb-6">
                  A home away from home in tropical Sri Lanka
                </motion.h2>
                <motion.p variants={fadeInUp} className="body-large mb-8">
                  Whether you're a solo traveler, a couple on a beach getaway, or a family exploring the island — we've got you covered. Comfy stays, real local experiences, and friendly vibes.
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <Button asChild size="lg">
                    <Link href="/about">
                      Discover Our Story
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Image Grid */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-12 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="col-span-7 image-zoom rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={interiorImage.src}
                      alt="Mulberry Living interior lounge area in Negombo"
                      width={1200}
                      height={480}
                      quality={100}
                      className="w-full h-80 object-cover"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="col-span-5 image-zoom rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={poolImage.src}
                      alt="Mulberry Living common area and pool in Negombo"
                      width={900}
                      height={480}
                      quality={100}
                      className="w-full h-80 object-cover"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="col-span-5 image-zoom rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={bedroomImage.src}
                      alt="Comfortable bedroom at Mulberry Living Negombo"
                      width={900}
                      height={384}
                      quality={100}
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="col-span-7 image-zoom rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={terraceImage.src}
                      alt="Rooftop terrace view at Mulberry Living Negombo"
                      width={1200}
                      height={384}
                      quality={100}
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Why Choose Us - Sticky Editorial Layout */}
        <section className="section-padding bg-background border-y border-border/50">
          <div className="container-wide">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">

              {/* Sticky Intro */}
              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={stagger}
                >
                  <motion.p variants={fadeInUp} className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
                    The Mulberry Difference
                  </motion.p>
                  <motion.h2 variants={fadeInUp} className="heading-section mb-6 leading-tight">
                    Why our guests <br className="hidden lg:block" /> never want to leave.
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-lg text-muted-foreground leading-relaxed">
                    We've obsessed over every detail to create a sanctuary that feels both deeply relaxing and cleanly managed. Here is what sets us apart from the rest.
                  </motion.p>
                </motion.div>
              </div>

              {/* Scrolling Alternating Cards */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {whyChooseUs.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={cn(
                      "relative overflow-hidden group p-8 md:p-10 rounded-3xl transition-all duration-500 hover:-translate-y-1",
                      index % 2 === 0 ? "bg-secondary" : "bg-foreground text-background"
                    )}
                  >
                    <div className={cn(
                      "absolute top-6 right-8 text-3xl font-serif font-medium",
                      index % 2 === 0 ? "text-foreground/30 group-hover:text-accent transition-colors" : "text-white/30 group-hover:text-white/70 transition-colors"
                    )}>
                      0{index + 1}
                    </div>

                    <div className="relative z-10 flex gap-6 items-start">
                      <div className={cn(
                        "mt-1 w-12 h-12 shrink-0 rounded-full flex items-center justify-center border",
                        index % 2 === 0 ? "border-accent/20 bg-background" : "border-background/20 bg-white/5"
                      )}>
                        <Check className={cn("h-5 w-5", index % 2 === 0 ? "text-accent" : "text-white")} />
                      </div>
                      <div>
                        <h3 className={cn(
                          "text-xl md:text-2xl font-serif font-medium leading-tight max-w-sm",
                          index % 2 === 0 ? "text-foreground" : "text-white"
                        )}>
                          {reason}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Amenities - Premium Grid */}
        <section className="section-padding bg-foreground text-background">
          <div className="container-wide">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <motion.div variants={fadeInLeft}>
                <p className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
                  Premium Amenities
                </p>
                <h2 className="heading-section mb-6 text-background">
                  Everything you need for a perfect stay
                </h2>
                <p className="text-lg text-background/70 mb-8 leading-relaxed">
                  From high-speed Starlink WiFi to stunning rooftop views, we've thought of everything to make your stay comfortable and memorable.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {highlightAmenities.map((amenity, i) => (
                    <motion.div
                      key={amenity.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="p-3 rounded-xl bg-background/10">
                        <amenity.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-background mb-1">{amenity.label}</h4>
                        <p className="text-sm text-background/60">{amenity.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeInRight}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                  <Image
                    src={heroImage.src}
                    alt="Mulberry Living amenities and facilities in Negombo"
                    width={900}
                    height={1125}
                    quality={100}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                </div>
                {/* Floating Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 glass-card p-6 max-w-xs"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">5.0 Rating</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "The best accommodation in Negombo. Clean, friendly, and perfectly located."
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Premium Accommodations - Overlapping Alternating Design */}
        <section className="section-padding bg-background">
          <div className="container-wide">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.p variants={fadeInUp} className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
                Accommodations
              </motion.p>
              <motion.h2 variants={fadeInUp} className="heading-display mb-6 !text-4xl md:!text-5xl">
                Stay Your Way
              </motion.h2>
              <motion.p variants={fadeInUp} className="body-large max-w-2xl mx-auto text-base">
                Choose the perfect space for your trip, from private comfort to social dorm living.
              </motion.p>
            </motion.div>

            <div className="flex flex-col gap-20 md:gap-24">
              {roomTypes.map((room, index) => {
                const isEven = index % 2 === 0;
                const mainImage = room.images && room.images.length > 0 ? room.images[0] : "";
                const secondaryImage = room.images && room.images.length > 1 ? room.images[1] : "";
                const tertiaryImage = room.images && room.images.length > 2 ? room.images[2] : "";

                return (
                  <div key={room.id} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Info Column */}
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={isEven ? fadeInLeft : fadeInRight}
                      className={cn("flex flex-col", !isEven && "lg:order-2")}
                    >
                      <div className="mb-4 flex items-center gap-4">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-foreground tracking-tight">{room.name}</h3>
                      </div>

                      <p className="text-xs text-accent tracking-wider uppercase mb-4 font-semibold">{room.subtitle}</p>
                      <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                        {room.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-3 mb-6">
                        {room.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground/80">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-secondary border border-border/50 inline-flex">
                          <p className="text-sm text-foreground">
                            <span className="font-semibold mr-2">Best for:</span>{room.bestFor}
                          </p>
                        </div>

                        {(() => {
                          const stay = stays.find(s => s.slug === room.id || s.slug.includes(room.id));
                          if (!stay) return null;

                          const today = new Date();
                          const { availableCount, isAvailable } = getAvailabilityOnDate(today, stay, bookings);
                          const nextDate = !isAvailable ? getNextAvailableDate(stay, bookings) : null;
                          const unitType = stay.inventory_type === 'bed' ? 'beds' : stay.inventory_type === 'unit' ? 'unit' : 'rooms';

                          return (
                            <div className={`p-3 rounded-xl border inline-flex ${isAvailable ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                              <p className="text-sm font-medium">
                                {isAvailable ? `${availableCount} ${unitType} available` : (nextDate ? `Booked till ${format(nextDate, 'MMM d')}` : 'Fully Booked')}
                              </p>
                            </div>
                          );
                        })()}
                      </div>

                      <div>
                        <Button asChild variant="outline" className="rounded-full px-6 bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300">
                          <Link href="/stays">View Room Details</Link>
                        </Button>
                      </div>
                    </motion.div>

                    {/* Creative Duotone Overlapping Images Column */}
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={isEven ? fadeInRight : fadeInLeft}
                      className={cn("relative h-[300px] md:h-[400px] lg:h-[450px] w-full", !isEven && "lg:order-1")}
                    >
                      {/* Primary Image - Back */}
                      <div className={cn(
                        "absolute top-0 w-[85%] md:w-[75%] h-[80%] md:h-[80%] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl",
                        isEven ? "right-0" : "left-0"
                      )}>
                        {mainImage && (
                          <Image src={mainImage} alt={`${room.name} at Mulberry Living Negombo`} width={800} height={600} quality={100} loading="eager" sizes="(max-width: 768px) 85vw, 50vw" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      </div>

                      {/* Secondary Image - Front Offset */}
                      <div className={cn(
                        "absolute bottom-0 md:-bottom-8 w-[65%] md:w-[55%] h-[55%] md:h-[55%] rounded-[1.5rem] md:rounded-3xl overflow-hidden shadow-2xl border-[6px] md:border-[10px] border-background",
                        isEven ? "left-0 md:-left-8" : "right-0 md:-right-8"
                      )}>
                        {secondaryImage && (
                          <Image src={secondaryImage} alt={`${room.name} interior detail`} width={500} height={400} quality={100} loading="eager" sizes="(max-width: 768px) 65vw, 33vw" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                        )}
                      </div>

                      {/* Tertiary Image - Even Smaller Overlay */}
                      {tertiaryImage && (
                        <div className={cn(
                          "hidden md:block absolute -top-10 md:-top-12 w-[35%] h-[40%] rounded-[1.5rem] overflow-hidden shadow-xl border-[8px] border-background z-20",
                          isEven ? "-right-8 md:-right-10" : "-left-8 md:-left-10"
                        )}>
                          <Image src={tertiaryImage} alt={`${room.name} extra detail`} width={300} height={250} quality={100} loading="eager" sizes="25vw" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                        </div>
                      )}
                    </motion.div>

                  </div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-24"
            >
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-12 h-14 text-lg hidden">
                <Link href="/stays">
                  View All Room Details
                </Link>
              </Button>

            </motion.div>
          </div>
        </section>

        {/* Experiences Section - Split-Pane Editorial Design */}
        <section className="py-20 md:py-28 bg-secondary border-t border-border/50">
          <div className="container-wide">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-stretch relative">

              {/* Left Column - Heading & Intro */}
              <div className="lg:col-span-5 relative">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={stagger}
                  className="lg:sticky lg:top-[35vh]"
                >
                  <motion.p variants={fadeInUp} className="text-xs font-medium text-accent tracking-widest uppercase mb-4">
                    Extra Services
                  </motion.p>
                  <motion.h2 variants={fadeInUp} className="heading-display mb-6 !text-4xl md:!text-5xl text-foreground">
                    Curated Experiences
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm">
                    Make your trip smoother and more memorable with our optional add-ons, handled precisely so you can simply relax.
                  </motion.p>
                </motion.div>
              </div>

              {/* Right Column - Editorial List */}
              <div className="lg:col-span-7">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="flex flex-col gap-6"
                >
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      variants={fadeInUp}
                      className="group relative bg-background border border-border/50 shadow-sm p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center gap-6 transition-all duration-500 hover:shadow-md"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/5 transition-colors duration-500">
                        <span className="font-serif italic text-accent font-medium text-lg">0{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-serif font-medium text-foreground mb-2 tracking-tight group-hover:text-accent transition-colors duration-300">
                          {exp.name}
                        </h3>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="section-padding bg-background">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden"
              >
                <iframe
                  title="Mulberry Living Location Map"
                  src="https://maps.google.com/maps?q=Mulberry%20Living%20No%2025,%20Rani%20Mawatha,%20Ettukala,%20Negombo&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full object-cover"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent pointer-events-none" />

                {/* Location Pin Glass Card */}
                <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-accent">
                      <MapPin className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Negombo, Sri Lanka</h4>
                      <p className="text-sm text-muted-foreground">{propertyData.contact?.address}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.p variants={fadeInUp} className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
                  Location
                </motion.p>
                <motion.h2 variants={fadeInUp} className="heading-section mb-6">
                  Right Where You Need to Be
                </motion.h2>
                <motion.p variants={fadeInUp} className="body-large mb-8">
                  {propertyData.locationText}
                </motion.p>
                <motion.div variants={fadeInUp} className="space-y-4 mb-8">
                  {propertyData.contact?.distances.map((d, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-secondary">
                      <span className="text-muted-foreground">{d.place}</span>
                      <span className="font-semibold text-foreground">{d.distance}</span>
                    </div>
                  ))}
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Get Directions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-padding bg-foreground text-background">
          <div className="container-wide">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.p variants={fadeInUp} className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
                Testimonials
              </motion.p>
              <motion.h2 variants={fadeInUp} className="heading-section text-background mb-6">
                What Our Guests Say
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  variants={fadeInUp}
                  className="glass-card-dark p-8 rounded-3xl"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-background/90 mb-6 leading-relaxed text-lg">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-background">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-background">{testimonial.name}</p>
                      <p className="text-sm text-background/60">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative section-padding overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${terraceImage.src})` }}
          >
            <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 container-narrow text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeInUp} className="heading-section text-background mb-6">
                Ready to Experience Mulberry Living?
              </motion.h2>
              <motion.p variants={fadeInUp} className="body-large text-background/70 mb-10 max-w-2xl mx-auto">
                Book your stay today and discover why guests love our cozy, friendly accommodation in Negombo.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90 rounded-md font-semibold">
                  <Link href="/booking">
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline" className="border-background/30 text-background bg-transparent hover:bg-background/10">
                  <a href="https://wa.me/94779900394" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
}
