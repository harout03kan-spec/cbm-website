import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../../../hooks/useProducts';
import ProductCard from '../../../components/feature/ProductCard';

// Homepage featured grid — six hand-picked catalog miners shown with the exact
// same card as the shop page. Selected by catalog id, in order. No filters, no
// extra products: just these six and a single "View All Miners" button.
const FEATURED_IDS = [
  632281392, // Antminer S19j Pro (104Th)
  673938218, // Antminer S19 XP (141)TH
  769976556, // Antminer S21 XP 270TH
  900000030, // Antminer S21j XP Hyd 495T (hydro)
  714997514, // Antminer L9 (variants — card shows highest, 16.5G)
  800783107, // Canaan Avalon Q 90TH
];

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const { products } = useProducts();

  const featured = FEATURED_IDS
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section data-section="products" id="products" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-inter font-bold text-5xl md:text-6xl text-white mb-4">{t('fp_title')}</h2>
          <p className="text-soft-gray font-inter text-xl max-w-3xl mx-auto">{t('fp_sub')}</p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-12">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/shop" className="inline-block px-12 py-4 bg-transparent border-2 border-white text-white font-inter font-semibold text-lg rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap">{t('fp_view_all')}</Link>
        </div>
      </div>
    </section>
  );
}
