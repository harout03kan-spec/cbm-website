import { motion } from 'framer-motion';

const RepairPricing = () => {
  const pricingData = [
    {
      service: 'Control Board Repair',
      description: 'Diagnostic and repair of main control board',
      turnaround: '5-7 business days',
      price: '$150'
    },
    {
      service: 'Single Hashboard Repair',
      description: 'Repair of one hashboard including diagnostics',
      turnaround: '7-10 business days',
      price: '$200'
    },
    {
      service: 'Multiple Board Repair',
      description: 'Repair of 2-3 hashboards with full testing',
      turnaround: '10-12 business days',
      price: '$450'
    },
    {
      service: 'Full Unit Diagnostic & Repair',
      description: 'Complete unit assessment and repair',
      turnaround: '10-14 business days',
      price: '$600'
    }
  ];

  return (
    <section className="py-24 bg-midnight">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-orbitron font-bold text-4xl text-white mb-4">ASIC Repair Pricing</h2>
          <p className="text-soft-gray font-inter text-base max-w-2xl mx-auto">
            Transparent pricing for board-level repairs. All prices in CAD and include diagnostics, genuine parts, and 30-day warranty.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full bg-graphite rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-midnight border-b border-crimson-accent/20">
                <th className="text-left px-6 py-4 text-white font-orbitron font-bold text-sm">Service Level</th>
                <th className="text-left px-6 py-4 text-white font-orbitron font-bold text-sm">Description</th>
                <th className="text-left px-6 py-4 text-white font-orbitron font-bold text-sm">Estimated Turnaround</th>
                <th className="text-right px-6 py-4 text-white font-orbitron font-bold text-sm">Starting Price (CAD)</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((item, index) => (
                <tr
                  key={item.service}
                  className={`border-b border-white/5 hover:bg-midnight/50 transition-colors ${
                    index === pricingData.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-6 py-5 text-white font-inter font-medium">{item.service}</td>
                  <td className="px-6 py-5 text-soft-gray font-inter text-sm">{item.description}</td>
                  <td className="px-6 py-5 text-soft-gray font-inter text-sm">{item.turnaround}</td>
                  <td className="px-6 py-5 text-right text-crimson-accent font-inter font-bold text-lg">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-soft-gray font-inter text-sm"
        >
          Final pricing may vary based on specific hardware condition and required parts. Contact us for a detailed quote.
        </motion.p>
      </div>
    </section>
  );
};

export default RepairPricing;
