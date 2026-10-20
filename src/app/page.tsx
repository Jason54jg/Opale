import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HomemadeSection } from "@/components/HomemadeSection";
import { MenuSection } from "@/components/MenuSection";
import { MobileBar } from "@/components/MobileBar";
import { Navbar } from "@/components/Navbar";
import { ReviewsSection } from "@/components/ReviewsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MenuSection />
        <HomemadeSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
