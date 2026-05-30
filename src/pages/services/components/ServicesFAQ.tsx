
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { repairFAQ } from '../../../mocks/faq';

const ServicesFAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  return (
    <section className="py-24 bg-graphite">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-orbitron font-bold text-4xl text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-soft-gray font-inter text-base max-w-2xl mx-auto">
            Common questions about our repair services, turnaround times, and warranty
            coverage.
          </p>
        </motion.div>

        <div className="space-y-3">
          {repairFAQ.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-midnight rounded-lg overflow-hidden border border-crimson-accent/10"
            >
              <button
                onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-midnight/80 transition-colors"
              >
                <span className="text-white font-inter font-medium text-base pr-4">
                  {item.question}
                </span>
                <div
                  className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-transform ${
                    openItem === item.id ? 'rotate-180' : ''
                  }`}
                >
                  <i className="ri-arrow-down-s-line text-xl text-crimson-accent"></i>
                </div>
              </button>
              <AnimatePresence>
                {openItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-soft-gray font-inter text-base leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesFAQ;
