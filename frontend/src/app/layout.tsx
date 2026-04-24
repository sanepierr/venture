import type { Metadata } from "next";
import { Inter, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Venture | Know where to invest",
  description:
    "AI-powered business intelligence for Ugandan entrepreneurs. Pick a location in Kampala and discover which business will thrive there.",
  openGraph: {
    title: "Venture | Pick the Perfect Location",
    description: "AI-powered business intelligence for Kampala entrepreneurs.",
    images: [{ url: "/mobile-mockup.png" }]
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
    >
      <body className="grain">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SmoothScroll>{children}</SmoothScroll>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
