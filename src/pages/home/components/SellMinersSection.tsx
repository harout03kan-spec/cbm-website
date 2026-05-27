import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SellMinersSection = () => {
  const { t } = useTranslation();
  const rows = [
    { num: '01', title: t('sell_r1_title'), desc: t('sell_r1_desc') },
    { num: '02', title: t('sell_r2_title'), desc: t('sell_r2_desc') },
    { num: '03', title: t('sell_r3_title'), desc: t('sell_r3_desc') },
  ];

  return (
    <>
      <style>{`
        .trade-desk-section { background: radial-gradient(circle at top right, rgba(255,59,59,0.10), transparent 24%), radial-gradient(circle at bottom left, rgba(255,59,59,0.06), transparent 28%), #050505; padding: 100px 20px; overflow: hidden; }
        .trade-desk-container { max-width: 1200px; margin: 0 auto; }
        .trade-desk-shell { display: grid; grid-template-columns: 1.2fr 0.95fr; gap: 34px; align-items: stretch; padding: 34px; border: 1px solid rgba(255,255,255,0.08); border-radius: 30px; background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)), linear-gradient(135deg, rgba(255,59,59,0.045), rgba(255,59,59,0.01)); box-shadow: 0 24px 60px rgba(0,0,0,0.35); }
        .trade-desk-main { position: relative; padding: 8px 10px 8px 0; }
        .trade-kicker { display: inline-block; color: #ff4a4a; font-size: 12px; font-weight: 800; letter-spacing: 2px; margin-bottom: 16px; }
        .trade-desk-main h2 { margin: 0 0 18px; color: #ffffff; font-size: 42px; line-height: 1.05; font-weight: 900; letter-spacing: -0.5px; max-width: 560px; }
        .trade-seo-text { margin: 0 0 12px; max-width: 580px; color: #b8c0cc; font-size: 15px; line-height: 1.8; }
        .trade-models-text { margin: 0; max-width: 580px; color: #94a3b8; font-size: 14px; line-height: 1.7; }
        .trade-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 28px; }
        .trade-btn { min-height: 52px; padding: 0 22px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 15px; font-weight: 800; transition: all .2s ease; }
        .trade-btn-primary { background: #ff2a2a; border: 1px solid #ff2a2a; color: #ffffff; }
        .trade-btn-primary:hover { background: #e02020; border-color: #e02020; }
        .trade-btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.18); color: #ffffff; }
        .trade-btn-secondary:hover { background: rgba(255,255,255,0.05); }
        .trade-desk-side { display: flex; flex-direction: column; justify-content: center; gap: 14px; }
        .trade-row { display: grid; grid-template-columns: 60px 1fr; gap: 16px; align-items: flex-start; padding: 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.025); transition: all .22s ease; }
        .trade-row:hover { border-color: rgba(255,59,59,0.28); background: rgba(255,255,255,0.04); transform: translateX(4px); }
        .trade-index { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: rgba(255,59,59,0.12); border: 1px solid rgba(255,59,59,0.22); color: #ff5a5a; font-size: 14px; font-weight: 900; }
        .trade-copy h3 { margin: 2px 0 6px; color: #ffffff; font-size: 20px; font-weight: 800; }
        .trade-copy p { margin: 0; color: #aeb7c2; font-size: 13px; line-height: 1.6; }
        .trade-seo-support { max-width: 1000px; margin: 24px auto 0; text-align: center; color: #6b7280; font-size: 13px; line-height: 1.7; }
        @media (max-width: 900px) { .trade-desk-shell { grid-template-columns: 1fr; } .trade-desk-main h2 { font-size: 32px; } }
      `}</style>
      <section className="trade-desk-section">
        <div className="trade-desk-container">
          <div className="trade-desk-shell">
            <div className="trade-desk-main">
              <span className="trade-kicker">{t('sell_tag')}</span>
              <h2>{t('sell_title')}</h2>
              <p className="trade-seo-text">{t('sell_desc')}</p>
              <p className="trade-seo-text">{t('sell_desc2')}</p>
              <div className="trade-actions">
                <Link to="/contact" className="trade-btn trade-btn-primary">{t('sell_cta1')}</Link>
                <Link to="/contact" className="trade-btn trade-btn-secondary">{t('sell_cta2')}</Link>
              </div>
            </div>
            <div className="trade-desk-side">
              {rows.map((row) => (
                <div key={row.num} className="trade-row">
                  <div className="trade-index">{row.num}</div>
                  <div className="trade-copy">
                    <h3>{row.title}</h3>
                    <p>{row.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="trade-seo-support">{t('sell_footer')}</p>
        </div>
      </section>
    </>
  );
};
export default SellMinersSection;
