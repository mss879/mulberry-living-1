"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gift, Sparkles, ArrowRight, Star, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Icon mapping for variety in promotion cards
const promoIcons = [Gift, Star, Sparkles, Gift, Star, Sparkles];

export default function Promotions() {
  const { data: promotions, isLoading } = useQuery({
    queryKey: ["activePromotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions" as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  // Group promotions by title
  const grouped = promotions?.reduce((acc: Record<string, any[]>, promo: any) => {
    const key = promo.title || "Special Offers";
    if (!acc[key]) acc[key] = [];
    acc[key].push(promo);
    return acc;
  }, {}) || {};

  const groupKeys = Object.keys(grouped);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[500px] flex items-center justify-center pt-32 md:pt-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/843697524.jpg')` }}
        >
          <div className="absolute inset-0 bg-black/50 bg-gradient-hero" />
        </div>

        {/* Floating sparkle decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Sparkles className="h-5 w-5 text-accent/60" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center text-primary-foreground container-narrow pb-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-5 py-2 rounded-full mb-6"
          >
            <Gift className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Limited Time Offers</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-display mb-4"
          >
            Exclusive Offers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Special deals designed to make your Negombo stay even more memorable
          </motion.p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-background" d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : groupKeys.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Gift className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="heading-card mb-3">No Active Promotions</h2>
              <p className="text-muted-foreground">Check back soon for exciting offers!</p>
            </motion.div>
          ) : (
            groupKeys.map((groupTitle) => (
              <div key={groupTitle} className="mb-16 last:mb-0">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="text-center mb-12"
                >
                  <motion.p
                    variants={fadeInUp}
                    className="text-sm font-medium text-accent mb-4 tracking-widest uppercase"
                  >
                    {grouped[groupTitle][0]?.valid_from && grouped[groupTitle][0]?.valid_until
                      ? `${new Date(grouped[groupTitle][0].valid_from).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
                      : "Current Offers"}
                  </motion.p>
                  <motion.h2 variants={fadeInUp} className="heading-section mb-4">
                    {groupTitle}
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="body-large max-w-xl mx-auto">
                    Take advantage of these exclusive deals during your stay at Mulberry Living
                  </motion.p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                  {grouped[groupTitle].map((promo: any, index: number) => {
                    const IconComponent = promoIcons[index % promoIcons.length];
                    return (
                      <motion.div
                        key={promo.id}
                        variants={fadeInUp}
                        className="group relative flex flex-col p-8 rounded-3xl bg-background/60 backdrop-blur-md border border-border/60 hover:border-accent/40 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                      >
                        {/* Decorative top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col h-full flex-1">
                          {/* Top Section: Icon & Availability */}
                          <div className="flex items-start justify-between mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 group-hover:from-accent/25 group-hover:to-accent/10 transition-all duration-500 border border-accent/10 shadow-sm">
                              <IconComponent className="h-6 w-6 text-accent group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs font-medium border border-accent/20">
                              <Check className="h-3.5 w-3.5" />
                              Active
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 flex flex-col justify-between min-h-[140px]">
                            <div>
                               <p className="text-sm font-sans tracking-widest text-muted-foreground uppercase mb-2">
                                 The Offer
                               </p>
                               <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground leading-tight group-hover:text-accent transition-colors duration-300">
                                 {promo.reward}
                               </h3>
                            </div>
                            
                            <div className="mt-6 pt-5 border-t border-border/50">
                               <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                                 Condition
                               </p>
                               <p className="text-base text-foreground font-medium">
                                 {promo.condition}
                               </p>
                            </div>
                          </div>

                          {promo.description && (
                            <p className="text-sm text-muted-foreground/80 mt-4 bg-secondary/50 p-3 rounded-lg">
                              {promo.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Validity note */}
                {grouped[groupTitle][0]?.valid_until && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground"
                  >
                    <Clock className="h-4 w-4" />
                    <span>
                      Valid until{" "}
                      {new Date(grouped[groupTitle][0].valid_until).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Terms / How it Works */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-narrow relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="heading-section mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="body-large max-w-xl mx-auto">
              Claiming your offer is simple
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                step: "01",
                title: "Book Your Stay",
                description: "Choose your dates and room type through our booking page.",
              },
              {
                step: "02",
                title: "Mention the Offer",
                description: "Let us know which promotion you'd like to claim when booking.",
              },
              {
                step: "03",
                title: "Enjoy Your Reward",
                description: "We'll arrange everything — just show up and enjoy your stay!",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="p-8 rounded-3xl bg-background/50 backdrop-blur-xl border border-border/60 text-center"
              >
                <span className="inline-block text-4xl font-serif font-semibold text-accent/30 mb-4">
                  {item.step}
                </span>
                <h3 className="heading-card mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="heading-section mb-4">
              Don&apos;t Miss Out
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              These exclusive offers are available for a limited time. Book now and make the most of your Negombo getaway.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero-outline" size="xl">
                <Link href="/booking">
                  Book Your Stay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link href="/contact">Ask About Offers</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
