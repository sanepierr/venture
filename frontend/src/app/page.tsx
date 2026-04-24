import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { MobilePreview } from "@/components/MobilePreview";
import { HowItWorks } from "@/components/HowItWorks";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Marquee />
      <Features />
      <MobilePreview />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
