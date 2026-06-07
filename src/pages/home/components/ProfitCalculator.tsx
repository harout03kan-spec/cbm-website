
import { useState } from 'react';
import { motion } from 'framer-motion';

const ProfitCalculator = () => {
  const [hashrate, setHashrate] = useState('234');
  const [powerCost, setPowerCost] = useState('0.10');
  const [btcPrice, setBtcPrice] = useState('89234');

  const calculateProfit = () => {
    const hash = parseFloat(hashrate);
    const cost = parseFloat(powerCost);
    const price = parseFloat(btcPrice);
    
    // Simplified calculation (actual would be more complex)
    const dailyBTC = (hash / 1000000) * 0.00001;
    const dailyRevenue = dailyBTC * price;
    const dailyPowerCost = (3.5 * 24 * cost);
    const dailyProfit = dailyRevenue - dailyPowerCost;
    
    return {
      daily: dailyProfit.toFixed(2),
      monthly: (dailyProfit * 30).toFixed(2),
      yearly: (dailyProfit * 365).toFixed(2),
    };
  };

  const profit = calculateProfit();

  return (
    <section id="calculator" className="py-24 bg-midnight">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-gradient-to-br from-graphite/60 to-graphite/40 backdrop-blur-xl border border-crimson-accent/30 rounded-2xl p-8 shadow-2xl"
          >
            <h2 className="font-inter font-bold text-4xl text-white mb-2">
              Calculate Your Mining ROI
            </h2>
            <div className="w-24 h-1 bg-gradient-crimson mb-8"></div>

            <div className="space-y-6">
              {/* Hashrate Input */}
              <div>
                <label className="block text-white font-inter font-semibold mb-2">
                  Hashrate (TH/s)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={hashrate}
                    onChange={(e) => setHashrate(e.target.value)}
                    className="w-full px-4 py-3 bg-midnight border-2 border-crimson-accent/30 rounded-lg text-white font-inter focus:outline-none focus:border-crimson-accent transition-colors"
                  />
                  <select className="absolute right-3 top-1/2 -translate-y-1/2 bg-graphite text-white font-inter text-sm px-3 py-1 rounded border border-crimson-accent/30 cursor-pointer">
                    <option>S21 Pro (234)</option>
                    <option>S21 Hydro (335)</option>
                    <option>M60S (172)</option>
                    <option>M63S (406)</option>
                  </select>
                </div>
              </div>

              {/* Power Cost Input */}
              <div>
                <label className="block text-white font-inter font-semibold mb-2">
                  Power Cost (CAD/kWh)
                  <span className="ml-2 text-soft-gray text-xs">Canadian avg: $0.10-0.13</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={powerCost}
                  onChange={(e) => setPowerCost(e.target.value)}
                  className="w-full px-4 py-3 bg-midnight border-2 border-crimson-accent/30 rounded-lg text-white font-inter focus:outline-none focus:border-crimson-accent transition-colors"
                />
              </div>

              {/* BTC Price Input */}
              <div>
                <label className="block text-white font-inter font-semibold mb-2">
                  BTC Price (CAD)
                  <button className="ml-2 text-crimson-accent text-xs hover:underline cursor-pointer">
                    Use live price
                  </button>
                </label>
                <input
                  type="number"
                  value={btcPrice}
                  onChange={(e) => setBtcPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-midnight border-2 border-crimson-accent/30 rounded-lg text-white font-inter focus:outline-none focus:border-crimson-accent transition-colors"
                />
              </div>

              {/* Calculate Button */}
              <button className="w-full py-4 bg-gradient-crimson text-white font-inter font-bold text-lg rounded-xl hover:scale-105 transition-transform cursor-pointer whitespace-nowrap">
                Calculate Profitability
              </button>

              {/* Results */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-crimson-accent/20">
                <div className="bg-midnight/50 border border-crimson-accent/30 rounded-xl p-4 text-center">
                  <div className="text-crimson-accent font-inter font-bold text-2xl">
                    ${profit.daily}
                  </div>
                  <div className="text-soft-gray font-inter text-sm mt-1">Daily</div>
                </div>
                <div className="bg-midnight/50 border border-crimson-accent/30 rounded-xl p-4 text-center">
                  <div className="text-crimson-accent font-inter font-bold text-2xl">
                    ${profit.monthly}
                  </div>
                  <div className="text-soft-gray font-inter text-sm mt-1">Monthly</div>
                </div>
                <div className="bg-midnight/50 border border-crimson-accent/30 rounded-xl p-4 text-center">
                  <div className="text-crimson-accent font-inter font-bold text-2xl">
                    ${profit.yearly}
                  </div>
                  <div className="text-soft-gray font-inter text-sm mt-1">Yearly</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Quick Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Best Seller Card */}
            <div className="bg-gradient-to-br from-crimson-accent/20 to-crimson-accent/5 border border-crimson-accent/30 rounded-xl p-6">
              <div className="text-crimson-accent font-inter text-xs font-semibold mb-2">
                CURRENT BEST SELLER
              </div>
              <h3 className="text-white font-inter font-bold text-xl mb-3">
                Antminer S21 Pro
              </h3>
              <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20black%20metallic%20ASIC%20bitcoin%20mining%20hardware%20with%20red%20LED%20lights%20on%20pure%20black%20background%20studio%20product%20shot%20compact%20view&width=400&height=300&seq=calc-s21-red&orientation=landscape"
                  alt="Antminer S21 Pro"
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-soft-gray font-inter">234 TH/s</span>
                <span className="text-white font-inter font-bold">$4,299 CAD</span>
              </div>
              <button className="w-full py-2 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:scale-105 transition-transform cursor-pointer whitespace-nowrap">
                View Details
              </button>
            </div>

            {/* Hosting Available */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6">
              <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full mb-3">
                <i className="ri-server-fill text-2xl text-white"></i>
              </div>
              <h3 className="text-white font-inter font-bold text-lg mb-2">
                Hosting Available
              </h3>
              <p className="text-soft-gray font-inter text-sm mb-4">
                Immersion-cooled hosting in Toronto. 99.9% uptime SLA.
              </p>
              <a href="/hosting" className="text-crimson-accent font-inter text-sm font-semibold hover:underline cursor-pointer">
                Learn More →
              </a>
            </div>

            {/* Canadian Warranty */}
            <div className="bg-graphite/60 border border-white/20 rounded-xl p-6">
              <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full mb-3">
                <i className="ri-shield-check-fill text-2xl text-white"></i>
              </div>
              <h3 className="text-white font-inter font-bold text-lg mb-2">
                Canadian Warranty
              </h3>
              <p className="text-soft-gray font-inter text-sm">
                Extended warranty with parts stocked in Toronto. 30-day returns.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProfitCalculator;
