import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WA_NUMBER = '15146047050';
const WA_URL = `https://wa.me/${WA_NUMBER}`;

export default function WhatsAppChat() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Show after 2s on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Stop pulse after 6s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // The CRM at /crm is an isolated internal tool and must not inherit the
  // public storefront's floating WhatsApp widget.
  if (/(^|\/)crm(\/|$)/.test(pathname)) return null;

  if (!visible) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Widget container — pointer-events-none so its (mostly empty) bounding box
          never blocks taps on page controls beneath it; only the real children
          (FAB + open modal) re-enable pointer events. */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Chat modal */}
        <div
          className={`transition-all duration-300 ease-out origin-bottom-right ${
            open
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="w-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10">

            {/* Header */}
            <div className="bg-[#1e1e1e] px-4 py-3 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-900/40 flex items-center justify-center">
                  <i className="ri-whatsapp-fill text-xl text-red-500" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1e1e1e]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">Canada BTC Miners</div>
                <div className="text-red-500 text-xs">{t('wa_status')}</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close chat"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* Chat bubble area */}
            <div className="bg-[#111] px-4 py-5 space-y-3">
              {/* Time */}
              <div className="text-center text-zinc-600 text-xs">Today</div>

              {/* Message bubble */}
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-900/30 flex-shrink-0 flex items-center justify-center mb-1">
                  <i className="ri-whatsapp-fill text-sm text-red-500" />
                </div>
                <div className="bg-[#1e1e1e] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[220px]">
                  <p className="text-white text-sm leading-relaxed">
                    {t('wa_msg1')}
                  </p>
                  <p className="text-white text-sm leading-relaxed mt-1">
                    {t('wa_msg2')}
                  </p>
                  <div className="text-right mt-1">
                    <span className="text-zinc-600 text-[10px]">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-[#111] px-4 pb-4">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-500 transition-colors text-white font-semibold py-3 rounded-xl text-sm"
                onClick={() => setOpen(false)}
              >
                <i className="ri-whatsapp-fill text-lg" />
                {t('wa_cta')}
              </a>
              <p className="text-center text-zinc-600 text-xs mt-2">+1 (514) 604-7050</p>
            </div>

          </div>
        </div>

        {/* FAB button */}
        <button
          onClick={() => { setOpen(!open); setPulse(false); }}
          aria-label="Chat on WhatsApp"
          className="pointer-events-auto relative w-14 h-14 bg-red-600 hover:bg-red-500 rounded-full shadow-lg shadow-red-900/40 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        >
          {/* Pulse ring */}
          {pulse && !open && (
            <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-40" />
          )}

          <i className={`text-white text-2xl transition-all duration-200 ${open ? 'ri-close-line' : 'ri-whatsapp-fill'}`} />

          {/* Notification dot */}
          {!open && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">1</span>
            </span>
          )}
        </button>

      </div>
    </>
  );
}
