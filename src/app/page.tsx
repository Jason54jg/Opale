import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HomemadeSection } from "@/components/HomemadeSection";
import { MenuSection } from "@/components/MenuSection";
import { MobileBar } from "@/components/MobileBar";
import { Navbar } from "@/components/Navbar";
import { ReviewsSection } from "@/components/ReviewsSection";
import { fetchLiveGoogleRating } from "@/lib/googleRating";

export default async function Home() {
  const googleRating = await fetchLiveGoogleRating();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MenuSection />
        <HomemadeSection />
        <ReviewsSection initialData={googleRating} />
        <ContactSection />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
