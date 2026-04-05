import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Preloader } from "../src/components/Preloader";

export const metadata: Metadata = {
  title: "Mulberry Living | Your Friendly Stay in Negombo, Sri Lanka",
  description:
    "Mulberry Living is a relaxed home base for travelers, backpackers, couples, digital nomads, and small groups in Negombo, Sri Lanka. Private rooms, dorms, and apartments.",
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
