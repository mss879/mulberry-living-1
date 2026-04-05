"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Layout } from "@/components/layout/Layout";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

const enquirySchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address").max(255),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "0779900394",
    href: "tel:+94779900394",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/94779900394",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "No 25, Rani Mawatha, Ettukala, Negombo, Sri Lanka 11500",
    href: null,
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
];

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || 'Not provided',
          message: data.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );

      setIsSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Please try again.");
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
            <h1 className="heading-section mb-4">Message Sent!</h1>
            <p className="body-large max-w-lg mx-auto mb-8">
              Thank you for reaching out. We&apos;ve received your enquiry and will respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/stays">View Property</Link>
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
          style={{ backgroundImage: "url('/DUO08623-HDR.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground container-narrow pb-24 md:pb-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-display mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            We're here to help make your stay perfect. Get in touch with our team.
          </motion.p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 transform translate-y-[1px]">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-background" d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:col-span-1 space-y-8"
            >
              <div>
                <h2 className="heading-card mb-4">Contact Information</h2>
                <p className="text-muted-foreground">
                  Have a question about Mulberry Living? We&apos;re here to help. Reach out and we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-medium text-foreground mb-2">Ready to Book?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you&apos;re ready to make a reservation, head to our booking page.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="p-8 rounded-2xl bg-card border border-border">
                <h2 className="heading-card mb-6">Send Us a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your plans, ask questions, or let us know how we can help..."
                              className="min-h-[150px]"
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
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
