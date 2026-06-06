import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  // Accepted payment methods. Generic RemixIcon glyphs only — no brand logos,
  // no new dependencies.
  const paymentMethods = [
    { key: 'footer_pay_credit', icon: 'ri-bank-card-line' },
    { key: 'footer_pay_debit', icon: 'ri-bank-card-2-line' },
    { key: 'footer_pay_crypto', icon: 'ri-coin-line' },
    { key: 'footer_pay_cash', icon: 'ri-cash-line' },
  ];

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
            <a href="tel:+15146047050" className="flex items-center gap-2 text-white font-semibold text-sm mb-2 hover:text-crimson-accent transition-colors" aria-label="Call +1 514 604 7050">
              <i className="ri-phone-fill text-lg text-crimson-accent"></i>
              +1 (514) 604-7050
            </a>
            <a href="mailto:info@canadabtcminers.ca" className="flex items-center gap-2 text-gray-300 text-sm mb-5 hover:text-white transition-colors">
              <i className="ri-mail-fill text-lg text-crimson-accent"></i>
              info@canadabtcminers.ca
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
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{t('footer_contact')}</Link></li>
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
        <div className="border-t border-[#1A1A1A] pt-8 mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-[0.18em]">{t('footer_payment_title')}</span>
          <div className="grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
            {paymentMethods.map((m) => (
              <span key={m.key} className="flex flex-col items-center justify-center gap-1 text-center leading-tight rounded-lg border border-white/10 bg-white/5 px-1.5 py-2 text-[10px] text-gray-300 sm:flex-row sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm">
                <i className={`${m.icon} text-sm text-crimson-accent sm:text-base`} aria-hidden="true"></i>
                {t(m.key)}
              </span>
            ))}
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
