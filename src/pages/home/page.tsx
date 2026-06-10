import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import HeroSection from './components/HeroSection';
import PlatformSection from './components/PlatformSection';
import FeaturedProducts from './components/FeaturedProducts';
import BulkFeatureSection from './components/BulkFeatureSection';
import ServicesTeaser from './components/ServicesTeaser';
import SellUpgradeSection from './components/SellUpgradeSection';
import HostingTeaser from './components/HostingTeaser';
import BrandsSection from './components/BrandsSection';
import ProofStrip from './components/ProofStrip';
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

      {/* 2. Platform — the four business layers (Sales / Repair / Bulk / Hosting) */}
      <PlatformSection />

      {/* 3. Featured miners — six catalog cards + View All Miners */}
      <FeaturedProducts />

      {/* 4. Bulk Deals feature — real featured wholesale batch */}
      <BulkFeatureSection />

      {/* 5. Repair center preview */}
      <ServicesTeaser />

      {/* 6. Sell or Upgrade — acquisition / liquidation path */}
      <SellUpgradeSection />

      {/* 7. Hosting support */}
      <HostingTeaser />

      {/* 8. Brands ticker */}
      <BrandsSection />

      {/* 9. Proof strip (no stats) + Final CTA */}
      <ProofStrip />
      <FinalCTA />

      <Footer />

      <DiscountPopup />
    </div>
  );
}
