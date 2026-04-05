"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import logo from "@/assets/mulberry-logo-white.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <img 
                src={logo.src} 
                alt="Mulberry Living Logo" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 text-primary-foreground/70 text-sm leading-relaxed">
              A relaxed, welcoming space in Negombo, Sri Lanka. Private rooms, social dorms, and a full apartment for every type of traveler.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Explore</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/stays" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Rooms & Apartments
              </Link>
              <Link href="/booking" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Book Your Stay
              </Link>
              <Link href="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+94779900394"
                className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                0779900394
              </a>
              <a
                href="https://wa.me/94779900394"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>No 25, Rani Mawatha, Ettukala, Negombo, Sri Lanka 11500</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <p className="text-sm text-primary-foreground/60 w-full md:w-1/3 text-center md:text-left">
            © {currentYear} Mulberry Living. All rights reserved.
          </p>
          
          <div className="w-full md:w-1/3 flex justify-center">
            <a
              href="https://www.arcai.agency"
              target="_blank"
              rel="noopener"
              title="ARC AI - Web Design & Digital Solutions"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors group"
            >
              Designed & Developed by 
              <img 
                src="/arc%20logo.png" 
                alt="ARC AI - Web Design & Digital Solutions" 
                className="h-7 md:h-8 w-auto relative translate-y-0.5 -translate-x-1" 
              />
            </a>
          </div>

          <div className="flex gap-6 w-full md:w-1/3 justify-center md:justify-end">
            <Link href="/privacy" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
