import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import ProofStrip from './components/ProofStrip';
import PlatformSection from './components/PlatformSection';
import BrandsSection from './components/BrandsSection';
import BulkFeatureSection from './components/BulkFeatureSection';
import ServicesTeaser from './components/ServicesTeaser';
import SellUpgradeSection from './components/SellUpgradeSection';
import HostingTeaser from './components/HostingTeaser';
import FinalCTA from './components/FinalCTA';
import DiscountPopup from './components/DiscountPopup';
import Seo, { organizationLd, websiteLd, localBusinessLd } from '../../components/feature/Seo';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-midnight">
      <Seo
        title={t('seo_home_title')}
        description={t('seo_home_desc')}
        path="/"
        jsonLd={[organizationLd, websiteLd, localBusinessLd]}
      />
      <Navbar />

      {/* 1. Hero — sales / repair / bulk across Canada */}
      <HeroSection />

      {/* 2. Featured miners — six catalog cards + View All Miners */}
      <FeaturedProducts />

      {/* 3. Compact trust row — practical points + phone (no stats) */}
      <ProofStrip />

      {/* 4. Services gateway — Miner Sales / ASIC Repairs / Bulk Deals / Hosting */}
      <PlatformSection />

      {/* 5. Brands we sell and repair */}
      <BrandsSection />

      {/* 6. Bulk Deals feature — real featured wholesale batch */}
      <BulkFeatureSection />

      {/* 7. Repair center preview */}
      <ServicesTeaser />

      {/* 8. Sell or Upgrade — acquisition / liquidation path */}
      <SellUpgradeSection />

      {/* 9. Hosting support */}
      <HostingTeaser />

      {/* 10. Final CTA — buy / repair / source */}
      <FinalCTA />

      <Footer />

      <DiscountPopup />
    </div>
  );
}
