import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import HeroSection from './components/HeroSection';
import PlatformSection from './components/PlatformSection';
import FeaturedProducts from './components/FeaturedProducts';
import ServicesTeaser from './components/ServicesTeaser';
import UsedBulkSection from './components/UsedBulkSection';
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

      {/* 4. Repair center preview */}
      <ServicesTeaser />

      {/* 5. Used Deals & Bulk Deals — real featured batch */}
      <UsedBulkSection />

      {/* 6. Hosting support */}
      <HostingTeaser />

      {/* 7. Brands ticker */}
      <BrandsSection />

      {/* 8. Proof strip — practical trust points (no stats) */}
      <ProofStrip />

      {/* 9. Final CTA — buy / repair / source */}
      <FinalCTA />

      <Footer />

      <DiscountPopup />
    </div>
  );
}
