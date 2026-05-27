import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ServicesHub = () => {
  const { t } = useTranslation();

  const cards = [
    {
      tag: t('hub_s1_tag'),
      title: t('hub_s1_title'),
      desc: t('hub_s1_desc'),
      btn: t('hub_s1_btn'),
      to: '/shop',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
      ),
    },
    {
      tag: t('hub_s2_tag'),
      title: t('hub_s2_title'),
      desc: t('hub_s2_desc'),
      btn: t('hub_s2_btn'),
      to: '/services',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      ),
    },
    {
      tag: t('hub_s3_tag'),
      title: t('hub_s3_title'),
      desc: t('hub_s3_desc'),
      btn: t('hub_s3_btn'),
      to: '/hosting',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .services-hub-section { position: relative; overflow: hidden; background: radial-gradient(circle at top left, rgba(220,38,38,0.08), transparent 30%), radial-gradient(circle at bottom right, rgba(220,38,38,0.05), transparent 28%), #050505; padding: 96px 20px; }
        .services-hub-container { max-width: 1200px; margin: 0 auto; }
        .services-hub-header { text-align: center; max-width: 820px; margin: 0 auto 56px; }
        .services-tag { display: inline-block; color: #DC2626; font-size: 12px; font-weight: 800; letter-spacing: 2px; margin-bottom: 14px; }
        .services-hub-header h2 { margin: 0 0 16px; color: #ffffff; font-size: 46px; line-height: 1.08; font-weight: 900; letter-spacing: -0.5px; }
        .services-hub-header p { margin: 0; color: #aeb7c2; font-size: 17px; line-height: 1.75; }
        .services-hub-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
        .service-hub-card { position: relative; display: flex; flex-direction: column; min-height: 100%; padding: 30px 28px 28px; border-radius: 24px; overflow: hidden; background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), linear-gradient(140deg, rgba(220,38,38,0.03), rgba(220,38,38,0.01)); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 18px 40px rgba(0,0,0,0.32); transition: transform .24s ease, border-color .24s ease, box-shadow .24s ease; }
        .service-hub-card:hover { transform: translateY(-8px); border-color: rgba(220,38,38,0.34); box-shadow: 0 30px 60px rgba(0,0,0,0.46); }
        .service-card-glow { position: absolute; top: -90px; right: -90px; width: 220px; height: 220px; border-radius: 999px; background: radial-gradient(circle, rgba(220,38,38,0.18) 0%, rgba(220,38,38,0.03) 46%, transparent 74%); pointer-events: none; }
        .service-icon-wrap { position: relative; z-index: 2; width: 62px; height: 62px; border-radius: 18px; background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.24); display: flex; align-items: center; justify-content: center; color: #ef4444; margin-bottom: 18px; }
        .service-icon-wrap svg { width: 27px; height: 27px; }
        .service-mini-tag { position: relative; z-index: 2; color: #f87171; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; margin-bottom: 10px; display: block; }
        .service-hub-card h3 { position: relative; z-index: 2; margin: 0 0 12px; color: #ffffff; font-size: 29px; line-height: 1.1; font-weight: 850; }
        .service-hub-card > p { position: relative; z-index: 2; margin: 0 0 22px; color: #b8c0cc; font-size: 15px; line-height: 1.7; flex: 1; }
        .service-btn { position: relative; z-index: 2; width: 100%; min-height: 52px; margin-top: auto; padding: 0 18px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: #DC2626; border: 1px solid #DC2626; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; cursor: pointer; transition: background .2s ease, border-color .2s ease; }
        .service-btn:hover { background: #b91c1c; border-color: #b91c1c; }
        @media (max-width: 1100px) { .services-hub-grid { grid-template-columns: 1fr; } .services-hub-header h2 { font-size: 38px; } }
        @media (max-width: 760px) { .services-hub-section { padding: 78px 16px; } .services-hub-header h2 { font-size: 31px; } }
      `}</style>
      <section className="services-hub-section">
        <div className="services-hub-container">
          <div className="services-hub-header">
            <span className="services-tag">{t('hub_tag')}</span>
            <h2>{t('hub_title')}</h2>
            <p>{t('hub_sub')}</p>
          </div>
          <div className="services-hub-grid">
            {cards.map((card) => (
              <div key={card.to} className="service-hub-card">
                <div className="service-card-glow"></div>
                <div className="service-icon-wrap">{card.icon}</div>
                <span className="service-mini-tag">{card.tag}</span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <Link to={card.to} className="service-btn">{card.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default ServicesHub;
