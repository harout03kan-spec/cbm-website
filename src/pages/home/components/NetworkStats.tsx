
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LiveStats {
  btcPriceUSD: string;
  btcPriceCAD: string;
  networkHashrate: string;
  difficulty: string;
  blockHeight: string;
}

const NetworkStats = () => {
  const [stats, setStats] = useState<LiveStats>({
    btcPriceUSD: '—',
    btcPriceCAD: '—',
    networkHashrate: '—',
    difficulty: '—',
    blockHeight: '—',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // BTC price (CoinGecko — no API key needed)
        const priceRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cad'
        );
        const priceData = await priceRes.json();
        const usd: number = priceData?.bitcoin?.usd ?? 0;
        const cad: number = priceData?.bitcoin?.cad ?? 0;

        // Network stats (blockchain.info)
        const netRes = await fetch('https://blockchain.info/stats?format=json');
        const netData = await netRes.json();

        const hashrateEH = netData?.hash_rate
          ? (netData.hash_rate / 1e18).toFixed(1)
          : '—';
        const difficultyT = netData?.difficulty
          ? (netData.difficulty / 1e12).toFixed(2)
          : '—';
        const blockHeight = netData?.n_blocks_total
          ? netData.n_blocks_total.toLocaleString()
          : '—';

        setStats({
          btcPriceUSD: usd ? `$${usd.toLocaleString()}` : '—',
          btcPriceCAD: cad ? `$${cad.toLocaleString()}` : '—',
          networkHashrate: hashrateEH !== '—' ? hashrateEH : '—',
          difficulty: difficultyT !== '—' ? difficultyT : '—',
          blockHeight,
        });
      } catch {
        // silently keep defaults on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 3 minutes
    const interval = setInterval(fetchStats, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      icon: 'ri-bitcoin-fill',
      label: 'BTC Price (USD)',
      value: stats.btcPriceUSD,
      unit: '',
    },
    {
      icon: 'ri-exchange-dollar-fill',
      label: 'BTC Price (CAD)',
      value: stats.btcPriceCAD,
      unit: '',
    },
    {
      icon: 'ri-speed-fill',
      label: 'Network Hashrate',
      value: stats.networkHashrate,
      unit: stats.networkHashrate !== '—' ? 'EH/s' : '',
    },
    {
      icon: 'ri-database-2-fill',
      label: 'Block Height',
      value: stats.blockHeight,
      unit: '',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative -mt-16 z-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-graphite/60 backdrop-blur-2xl border-t-2 border-crimson-accent rounded-2xl shadow-2xl p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <i className={`${stat.icon} text-3xl text-crimson-accent`}></i>
                </div>
                <div className="font-orbitron font-bold text-2xl lg:text-3xl text-white mb-1 flex items-baseline justify-center gap-1">
                  {loading ? (
                    <span className="animate-pulse text-white/30">—</span>
                  ) : (
                    <>
                      {stat.value}
                      {stat.unit && (
                        <span className="text-lg text-soft-gray">{stat.unit}</span>
                      )}
                    </>
                  )}
                </div>
                <div className="text-white font-inter text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Live indicator */}
          {!loading && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
              <span className="text-white/40 font-inter text-xs">Live data · refreshes every 3 min</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NetworkStats;
