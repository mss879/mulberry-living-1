import type { Metadata } from "next";
import Contact from "@/views/Contact";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description:
    "Get in touch with Mulberry Living in Negombo, Sri Lanka. Call, WhatsApp, or send us a message — we respond within 24 hours. Located at No 25, Rani Mawatha, Ettukala.",
  keywords: [
    "contact Mulberry Living",
    "Negombo guesthouse phone",
    "book accommodation Negombo",
    "WhatsApp hostel Sri Lanka",
    "Ettukala Negombo contact",
  ],
  alternates: {
    canonical: "https://mulberry-living.com/contact",
  },
  openGraph: {
    title: "Contact Mulberry Living | Get in Touch — Negombo, Sri Lanka",
    description:
      "We're here to help make your stay perfect. Call, WhatsApp, or send us a message.",
    url: "https://mulberry-living.com/contact",
    images: [
      {
        url: "/DUO08623-HDR.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Mulberry Living — Negombo accommodation",
      },
    ],
  },
};

export default function ContactPage() {
  return <Contact />;
}
