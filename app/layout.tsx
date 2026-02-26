import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Reuse the same CSS variable names so all existing classes (font-display, etc.) work
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://arbutus.vercel.app"
  ),
  title: "Arbutus — Same-day wellness in Victoria, BC",
  description:
    "Find same-day massage, physio, and chiro openings in Victoria. Real-time availability from local practitioners. Book directly, no account needed.",
  openGraph: {
    title: "Arbutus — Same-day wellness in Victoria, BC",
    description:
      "Find same-day massage, physio, and chiro openings in Victoria. Real-time availability from local practitioners.",
    siteName: "Arbutus",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arbutus — Same-day wellness in Victoria, BC",
    description:
      "Find same-day massage, physio, and chiro openings in Victoria.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${manrope.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
