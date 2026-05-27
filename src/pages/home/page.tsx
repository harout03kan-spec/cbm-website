import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import HeroSection from './components/HeroSection';
import HeroTrustBar from './components/HeroTrustBar';
import ServicesHub from './components/ServicesHub';
import FeaturedProducts from './components/FeaturedProducts';
import TrustBar from './components/TrustBar';
import ServicesTeaser from './components/ServicesTeaser';
import BrandsSection from './components/BrandsSection';
import HostingTeaser from './components/HostingTeaser';
import SellMinersSection from './components/SellMinersSection';
import FAQSection from './components/FAQSection';
import FinalCTA from './components/FinalCTA';
import DiscountPopup from './components/DiscountPopup';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust Bar — 2,300+ Miners / 92% Repair / 4+ Years / Montreal */}
      <HeroTrustBar />

      {/* 3. Services — ASIC Sales / ASIC Repairs / Hosting cards (scroll-to links) */}
      <ServicesHub />

      {/* 4. Products — ASIC cards with specs, price, add to cart */}
      <FeaturedProducts />

      {/* 5. Info Strip — Shipping / Tax / Canadian inventory / Repairs / Warranty */}
      <TrustBar />

      {/* 6. ASIC Repair Section */}
      <ServicesTeaser />

      {/* 7. Rolling brands ticker */}
      <BrandsSection />

      {/* 8. Sell Your Miners */}
      <SellMinersSection />

      {/* 9. Hosting Section */}
      <HostingTeaser />

      {/* 10. FAQ */}
      <FAQSection />

      {/* 11. Final CTA */}
      <FinalCTA />

      {/* 12. Footer */}
      <Footer />

      <DiscountPopup />
    </div>
  );
}
