import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Preloader } from "../src/components/Preloader";

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mulberry-living.com"),
  title: {
    default: "Mulberry Living | Affordable Stays in Negombo, Sri Lanka",
    template: "%s | Mulberry Living",
  },
  description:
    "Mulberry Living is a relaxed home base for travelers, backpackers, couples, digital nomads, and small groups in Negombo, Sri Lanka. Private rooms, dorms, and apartments.",
  keywords: [
    "Negombo accommodation",
    "Sri Lanka hostel",
    "rooms near Colombo airport",
    "Negombo guesthouse",
    "budget accommodation Sri Lanka",
    "Ettukala Negombo",
    "backpacker hostel Sri Lanka",
    "private rooms Negombo",
    "dorm beds Negombo",
    "apartment Negombo",
    "Mulberry Living",
  ],
  authors: [{ name: "Mulberry Living" }],
  creator: "Mulberry Living",
  publisher: "Mulberry Living",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mulberry-living.com",
    siteName: "Mulberry Living",
    title: "Mulberry Living | Affordable Stays in Negombo, Sri Lanka",
    description:
      "Private rooms, social dorms, and a full apartment in Negombo — close to the airport, beach, and everything you need.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Mulberry Living — accommodation in Negombo, Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mulberry Living | Affordable Stays in Negombo, Sri Lanka",
    description:
      "Private rooms, social dorms, and a full apartment in Negombo — close to the airport, beach, and everything you need.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://mulberry-living.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <Preloader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
