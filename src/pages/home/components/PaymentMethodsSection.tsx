import { motion } from 'framer-motion';

/* ── Inline SVG icons for each payment method ── */

const InteracIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#FFD000"/>
    <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="bold" fontFamily="Arial, sans-serif" fill="#E31837">i</text>
  </svg>
);

const WireTransferIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#1A3A6B"/>
    <rect x="6" y="20" width="28" height="3" rx="1.5" fill="white"/>
    <rect x="6" y="26" width="28" height="3" rx="1.5" fill="white" opacity="0.6"/>
    <path d="M20 7L28 15H22V20H18V15H12L20 7Z" fill="white"/>
  </svg>
);

const CashIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#15803D"/>
    <rect x="5" y="13" width="30" height="14" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="20" cy="20" r="4" stroke="white" strokeWidth="1.5" fill="none"/>
    <rect x="8" y="16" width="3" height="8" rx="1" fill="white" opacity="0.5"/>
    <rect x="29" y="16" width="3" height="8" rx="1" fill="white" opacity="0.5"/>
    <line x1="20" y1="17" x2="20" y2="23" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="17.5" y1="18.5" x2="22.5" y2="18.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="17.5" y1="21.5" x2="22.5" y2="21.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const BitcoinIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <rect width="40" height="40" rx="6" fill="#F7931A"/>
    <path
      d="M27.5 17.2c.4-2.5-1.5-3.8-4.1-4.7l.8-3.4-2-.5-.8 3.3c-.5-.1-1-.3-1.6-.4l.8-3.3-2-.5-.8 3.4c-.4-.1-.8-.2-1.2-.3l-2.7-.7-.5 2.1s1.5.3 1.5.4c.8.2 1 .7.9 1.1l-2.2 8.8c-.1.4-.5.9-1.3.7 0 .1-1.5-.4-1.5-.4l-1 2.3 2.6.6 1.4.4-.9 3.4 2 .5.8-3.4c.5.1 1.1.3 1.6.4l-.8 3.3 2 .5.9-3.4c3.5.7 6.1.4 7.2-2.8.9-2.5-.1-4-1.9-4.9 1.3-.3 2.3-1.2 2.6-3zm-4.7 6.6c-.6 2.5-4.9 1.2-6.3.8l1.1-4.5c1.4.4 5.9 1 5.2 3.7zm.7-6.6c-.6 2.3-4.1 1.1-5.2.8l1-4.1c1.1.3 4.9.8 4.2 3.3z"
      fill="white"
    />
  </svg>
);

const methods = [
  { icon: <InteracIcon />,      name: 'Interac e-Transfer' },
  { icon: <WireTransferIcon />, name: 'Wire Transfer'       },
  { icon: <CashIcon />,         name: 'Cash (In-Person)'   },
  { icon: <BitcoinIcon />,      name: 'Cryptocurrency'     },
];

const PaymentMethodsSection = () => {
  return (
    <section className="py-20 bg-midnight">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-inter font-bold text-4xl text-white mb-4">
            Accepted Payment Methods
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8">
          {methods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 bg-graphite border border-white/10 rounded-lg px-6 py-4 hover:border-crimson-accent/30 transition-all"
            >
              <div className="flex-shrink-0">
                {method.icon}
              </div>
              <span className="text-white font-inter font-medium">
                {method.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMethodsSection;
