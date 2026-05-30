import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="mb-4">
              <h2 className="text-lg font-orbitron font-bold text-white tracking-wider leading-tight">Canada BTC Miners</h2>
              <p className="text-xs text-crimson-accent font-inter tracking-wide">Premium Mining Hardware</p>
            </div>
            <p className="text-gray-400 text-sm max-w-xs mb-4">{t('footer_desc')}</p>
            <a href="https://wa.me/15146047050" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white font-semibold text-sm mb-5 hover:text-green-400 transition-colors">
              <i className="ri-whatsapp-fill text-lg text-green-400"></i>
              +1 (514) 604-7050
            </a>
            <div className="flex items-center gap-3">
              <a href="https://t.me/CanadaBTCMiners" target="_blank" rel="noopener noreferrer nofollow" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg hover:bg-white/10 transition-colors" aria-label="Telegram"><i className="ri-telegram-fill text-lg text-white"></i></a>
              <a href="https://www.facebook.com/profile.php?id=61576904563276" target="_blank" rel="noopener noreferrer nofollow" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg hover:bg-white/10 transition-colors" aria-label="Facebook"><i className="ri-facebook-fill text-lg text-white"></i></a>
              <a href="https://wa.me/15146047050" target="_blank" rel="noopener noreferrer nofollow" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg hover:bg-white/10 transition-colors" aria-label="WhatsApp"><i className="ri-whatsapp-fill text-lg text-white"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_products')}</h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">{t('footer_asic')}</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">{t('footer_accessories')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_services')}</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">{t('footer_repairs')}</Link></li>
              <li><Link to="/hosting" className="text-gray-400 hover:text-white transition-colors">{t('footer_hosting')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_company')}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">{t('footer_about')}</Link></li>
              <li><a href="mailto:info@canadabtcminers.ca" className="text-gray-400 hover:text-white transition-colors">{t('footer_contact')}</a></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">{t('footer_warranty')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_connect')}</h3>
            <ul className="space-y-3">
              <li><a href="https://t.me/CanadaBTCMiners" target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><i className="ri-telegram-fill text-base"></i> Telegram</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=61576904563276" target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><i className="ri-facebook-fill text-base"></i> Facebook</a></li>
              <li><a href="https://wa.me/15146047050" target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><i className="ri-whatsapp-fill text-base"></i> WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1A1A1A] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{t('footer_rights')}</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition-colors">{t('footer_privacy')}</span>
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition-colors">{t('footer_terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
