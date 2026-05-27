
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useTranslation } from 'react-i18next';

const OrderSuccessPage = () => {
  const { t } = useTranslation();
  const [orderNumber] = useState(() => 'CBM-' + Math.random().toString(36).substring(2, 9).toUpperCase());
  const [orderDate] = useState(() => new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }} className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50">
              <i className="ri-check-line text-white text-7xl"></i>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-12">
            <h1 className="font-orbitron font-bold text-5xl text-white mb-4">{t('success_title')}</h1>
            <p className="text-soft-gray font-inter text-xl">{t('success_sub')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-graphite border border-crimson-accent/20 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-soft-gray font-inter text-sm mb-2">Order Number</div>
                <div className="text-white font-orbitron font-bold text-2xl">{orderNumber}</div>
              </div>
              <div>
                <div className="text-soft-gray font-inter text-sm mb-2">Order Date</div>
                <div className="text-white font-inter text-lg">{orderDate}</div>
              </div>
            </div>

            <div className="bg-midnight border border-crimson-accent/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <i className="ri-mail-send-line text-crimson-accent text-3xl"></i>
                <div>
                  <h3 className="text-white font-inter font-bold text-lg mb-2">Confirmation Email Sent</h3>
                  <p className="text-soft-gray font-inter text-sm mb-3">We have sent a detailed order confirmation to your email address.</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-soft-gray font-inter text-sm"><i className="ri-file-list-3-line text-crimson-accent"></i><span>Order Summary</span></div>
                    <div className="flex items-center gap-2 text-soft-gray font-inter text-sm"><i className="ri-truck-line text-crimson-accent"></i><span>Shipping Details</span></div>
                    <div className="flex items-center gap-2 text-soft-gray font-inter text-sm"><i className="ri-bill-line text-crimson-accent"></i><span>Invoice</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-graphite border border-crimson-accent/20 rounded-2xl p-8 mb-8">
            <h2 className="font-orbitron font-bold text-2xl text-white mb-6">What Happens Next?</h2>
            <div className="space-y-6">
              {[
                { num: '1', title: 'Order Processing', desc: 'Our team will verify your order and prepare your mining equipment for shipment.' },
                { num: '2', title: 'Quality Check & Packaging', desc: 'Each miner undergoes rigorous testing and is securely packaged.' },
                { num: '3', title: 'Shipping & Tracking', desc: 'You will receive a tracking number via email once your order ships.' },
                { num: '4', title: 'Setup Support', desc: 'Our technical team is available 24/7 to assist with installation.' }
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-12 h-12 bg-crimson-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-crimson-accent font-orbitron font-bold text-xl">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-inter font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-soft-gray font-inter text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: 'ri-customer-service-2-line', title: '24/7 Support', desc: 'Questions about your order?', link: 'tel:+14165550123', linkText: '(416) 555-0123' },
              { icon: 'ri-book-open-line', title: 'Setup Guides', desc: 'Access detailed installation guides.', link: '/services', linkText: 'View Resources' },
              { icon: 'ri-shield-check-line', title: 'Warranty Info', desc: 'All products include warranty.', link: '/about', linkText: 'Learn More' }
            ].map((item) => (
              <div key={item.title} className="bg-graphite border border-crimson-accent/20 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-crimson-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${item.icon} text-crimson-accent text-3xl`}></i>
                </div>
                <h3 className="text-white font-inter font-bold mb-2">{item.title}</h3>
                <p className="text-soft-gray font-inter text-sm mb-4">{item.desc}</p>
                <Link to={item.link} className="text-crimson-accent font-inter text-sm hover:underline cursor-pointer whitespace-nowrap">{item.linkText}</Link>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="px-8 py-4 border-2 border-crimson-accent text-crimson-accent font-inter font-bold text-lg rounded-xl hover:bg-crimson-accent hover:text-white transition-all text-center cursor-pointer whitespace-nowrap">{t('success_back')}</Link>
            <Link to="/" className="px-8 py-4 bg-gradient-crimson text-white font-inter font-bold text-lg rounded-xl hover:scale-105 transition-transform text-center cursor-pointer whitespace-nowrap">Back to Home</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-12 text-center">
            <p className="text-soft-gray font-inter text-sm">Need to make changes to your order? Contact us within 24 hours at <a href="mailto:orders@canadabtcminers.com" className="text-crimson-accent hover:underline cursor-pointer">orders@canadabtcminers.com</a></p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
