"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "@/assets/mulberry-logo-white.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/stays", label: "Stays" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavElements, setShowNavElements] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // If not home, or already saw the sequence, show immediately
    if (!isHome || sessionStorage.getItem("heroPlayed")) {
      setShowNavElements(true);
      return;
    }

    // Wait for the custom event from the Home view video
    const handleVideoEnded = () => setShowNavElements(true);
    window.addEventListener("heroVideoEnded", handleVideoEnded);
    return () => window.removeEventListener("heroVideoEnded", handleVideoEnded);
  }, [isHome]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled || !isHome
          ? "glass shadow-glass py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="w-full px-6 lg:px-12 mt-2">
        <nav aria-label="Main navigation" className="flex items-center justify-between h-16">
          {/* Logo */}
          <AnimatePresence>
            {showNavElements && (
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Link 
                  href="/" 
                  className={cn(
                    "flex items-center transition-all duration-300",
                    (isScrolled || !isHome) && "bg-foreground px-4 py-2 rounded-xl shadow-md"
                  )}
                >
                  <Image 
                    src={logo.src} 
                    alt="Mulberry Living" 
                    width={160}
                    height={48}
                    priority
                    className={cn(
                      "w-auto transition-all duration-300",
                      (isScrolled || !isHome) ? "h-6 md:h-8" : "h-10 md:h-12"
                    )}
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Navigation */}
          <AnimatePresence>
            {showNavElements && (
              <motion.div 
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                  "hidden md:flex items-center gap-8 transition-all duration-500",
                  (!isScrolled && isHome) ? "bg-white px-6 py-2.5 rounded-2xl shadow-xl" : ""
                )}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-base font-medium transition-all duration-300 relative",
                      pathname === link.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      pathname === link.href && "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="relative flex items-center">
                  <span className="absolute inset-0 rounded-md bg-foreground animate-beacon"></span>
                  <Button
                    asChild
                    className="relative bg-foreground text-background hover:bg-foreground/90 rounded-md px-6 text-base font-semibold h-11"
                  >
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu Button */}
          <AnimatePresence>
            {showNavElements && (
              <motion.div
                className="md:hidden flex items-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <button
                  className="p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className={cn("h-6 w-6", isScrolled || !isHome ? "text-foreground" : "text-primary-foreground")} />
                  ) : (
                    <Menu className={cn("h-6 w-6", isScrolled || !isHome ? "text-foreground" : "text-primary-foreground")} />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50"
          >
            <div className="container-wide py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium py-2 transition-colors",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative mt-4 flex">
                <span className="absolute inset-0 rounded-md bg-foreground animate-beacon"></span>
                <Button asChild className="relative w-full bg-foreground text-background hover:bg-foreground/90 rounded-md text-base h-12 font-semibold">
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
