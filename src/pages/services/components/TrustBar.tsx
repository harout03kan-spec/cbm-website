import { motion } from 'framer-motion';

const TrustBar = () => {
  const stats = [
    { icon: 'ri-tools-fill', value: '2,000+', label: 'Miners Serviced' },
    { icon: 'ri-checkbox-circle-fill', value: '92%', label: 'Repair Success Rate' },
    { icon: 'ri-time-fill', value: '4+', label: 'Years in Canadian Mining' },
    { icon: 'ri-map-pin-fill', value: 'Montreal', label: 'Based Facility' }
  ];

  return (
    <section className="py-16 bg-midnight border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 bg-crimson-accent/10 rounded-lg">
                <i className={`${stat.icon} text-2xl text-crimson-accent`}></i>
              </div>
              <div className="text-white font-inter font-bold text-3xl mb-1">
                {stat.value}
              </div>
              <div className="text-soft-gray font-inter text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
