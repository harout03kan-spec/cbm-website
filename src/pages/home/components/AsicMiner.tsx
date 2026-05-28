import { memo } from 'react';

/**
 * Stylized Antminer S21 XP–style ASIC, drawn as a single 3/4 isometric SVG
 * (vector only — no photo, no 3D bundle). Matches the real S21 silhouette: a
 * narrow, deep gunmetal body whose front-left face carries two large stacked
 * fans, a dedicated PSU block bolted flush to the right with three smaller
 * stacked fans, a control channel down the seam, and a single square power
 * socket + rocker switch at the PSU base. Five fans total. Fans/LEDs animate
 * via CSS once powered; one thick cable plugs into the PSU socket from below.
 *
 * Everything lives in one viewBox so the hero overlay (cable, plug, packets)
 * can anchor exactly to the ports below.
 */
export const MINER_VIEWBOX = '0 0 400 350';

// Shared anchor points (SVG user units) used by the hero overlay.
export const MINER_PORTS = {
  eth: { x: 212, y: 82 },
  // Single square power socket at the bottom of the PSU.
  socket: { x: 206, y: 300 },
};

function Fan({ cx, cy, r, powered }: { cx: number; cy: number; r: number; powered: boolean }) {
  const blades = Array.from({ length: 11 });
  return (
    <g>
      {/* recessed well */}
      <circle cx={cx} cy={cy} r={r} fill="url(#fanWell)" stroke="#000" strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />

      {/* spinning blades (behind the grill) */}
      <g
        className={powered ? 'animate-fan-spin' : ''}
        style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: powered ? 0.9 : 0.5 }}
      >
        {blades.map((_, i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy - r * 0.42}
            rx={r * 0.14}
            ry={r * 0.46}
            fill="rgba(190,195,205,0.16)"
            transform={`rotate(${(360 / blades.length) * i} ${cx} ${cy})`}
          />
        ))}
      </g>

      {/* concentric grill (in front of blades) */}
      {[0.94, 0.78, 0.62, 0.46, 0.3].map((f, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r * f}
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth={r > 32 ? 1.6 : 1.2}
        />
      ))}
      {/* grill spokes */}
      {[0, 45, 90, 135].map(a => (
        <line
          key={a}
          x1={cx + r * Math.cos((a * Math.PI) / 180)}
          y1={cy + r * Math.sin((a * Math.PI) / 180)}
          x2={cx - r * Math.cos((a * Math.PI) / 180)}
          y2={cy - r * Math.sin((a * Math.PI) / 180)}
          stroke="rgba(0,0,0,0.45)"
          strokeWidth={1.1}
        />
      ))}
      {/* hub */}
      <circle cx={cx} cy={cy} r={r * 0.17} fill="#1a1c20" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r * 0.06} fill="#2a2d33" />

      {/* crimson rim glow on power-on */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#DC2626"
        strokeWidth={2}
        style={{
          opacity: powered ? 0.7 : 0,
          filter: 'drop-shadow(0 0 5px rgba(220,38,38,0.85))',
          transition: 'opacity 0.7s ease',
        }}
      />
    </g>
  );
}

function AsicMiner({ powered, reduce }: { powered: boolean; reduce: boolean }) {
  void reduce; // visual state is driven by `powered`; motion is gated by the parent
  return (
    <svg
      viewBox={MINER_VIEWBOX}
      className="absolute inset-0 h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="frontGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#42454b" />
          <stop offset="0.45" stopColor="#26282d" />
          <stop offset="1" stopColor="#16171a" />
        </linearGradient>
        <linearGradient id="psuGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3d43" />
          <stop offset="0.45" stopColor="#202227" />
          <stop offset="1" stopColor="#101113" />
        </linearGradient>
        <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#34373d" />
          <stop offset="1" stopColor="#15171a" />
        </linearGradient>
        <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#55585f" />
          <stop offset="1" stopColor="#34373d" />
        </linearGradient>
        <linearGradient id="stripGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1d21" />
          <stop offset="1" stopColor="#0d0e10" />
        </linearGradient>
        <radialGradient id="fanWell" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#202227" />
          <stop offset="1" stopColor="#0a0b0d" />
        </radialGradient>
      </defs>

      {/* contact shadow on the floor */}
      <ellipse cx="205" cy="318" rx="180" ry="18" fill="rgba(0,0,0,0.55)" style={{ filter: 'blur(6px)' }} />

      {/* ── deep right side wall (recedes back) ──────────────────────── */}
      <polygon points="240,70 335,20 335,255 240,305" fill="url(#sideGrad)" stroke="#000" strokeWidth={1} />
      {/* ribbed vent slits down the side give it depth */}
      {[112, 150, 188, 226].map((y, i) => (
        <line key={i} x1="248" y1={y} x2="330" y2={y - 43} stroke="rgba(0,0,0,0.4)" strokeWidth={1.4} />
      ))}
      <line x1="240" y1="70" x2="335" y2="20" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />

      {/* ── continuous top face ──────────────────────────────────────── */}
      <polygon points="60,70 240,70 335,20 155,20" fill="url(#topGrad)" stroke="#000" strokeWidth={1} />
      <line x1="60" y1="70" x2="155" y2="20" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      {[120, 180].map((x, i) => (
        <line key={i} x1={x} y1="70" x2={x + 95} y2="20" stroke="rgba(0,0,0,0.18)" strokeWidth={1} />
      ))}

      {/* ── miner front face (two large fans) ────────────────────────── */}
      <rect x="60" y="70" width="110" height="235" rx="6" fill="url(#frontGrad)" stroke="#000" strokeWidth={1.2} />
      <rect x="60" y="70" width="110" height="235" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <line x1="61" y1="72" x2="61" y2="303" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      {[[68, 79], [162, 79], [68, 297], [162, 297]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.3} fill="#0c0d0f" stroke="rgba(255,255,255,0.18)" strokeWidth={0.7} />
      ))}

      {/* ── PSU block front face (flush right, no gap) ───────────────── */}
      <rect x="170" y="70" width="70" height="235" rx="5" fill="url(#psuGrad)" stroke="#000" strokeWidth={1.2} />
      <rect x="170" y="70" width="70" height="235" rx="5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      {[[177, 79], [233, 79], [177, 297], [233, 297]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2} fill="#0c0d0f" stroke="rgba(255,255,255,0.16)" strokeWidth={0.6} />
      ))}

      {/* recessed control channel down the seam between body and PSU */}
      <rect x="167" y="70" width="6" height="235" fill="rgba(0,0,0,0.45)" />
      <line x1="170" y1="72" x2="170" y2="303" stroke="rgba(255,255,255,0.14)" strokeWidth={0.8} />

      {/* ── top nameplate banner + brand label ───────────────────────── */}
      <rect x="64" y="72" width="172" height="20" rx="3" fill="url(#stripGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />
      <text x="72" y="87" fontFamily="'Inter', sans-serif" fontSize="10" letterSpacing="0.4" fontWeight={800} fill="rgba(255,255,255,0.78)">
        ANTMINER S21{' '}
        <tspan
          fontSize="13"
          fontWeight={900}
          letterSpacing="0.8"
          fill="#ff4d4d"
          style={{ filter: 'drop-shadow(0 0 3px rgba(248,60,60,0.95))' }}
        >
          XP
        </tspan>
      </text>

      {/* ETH RJ45 port + link LEDs (right end of the banner) */}
      <g>
        <rect x={MINER_PORTS.eth.x - 8} y={MINER_PORTS.eth.y - 6} width={16} height={11} rx={1.5} fill="#0a0b0d" stroke="rgba(255,255,255,0.22)" strokeWidth={0.8} />
        <rect x={MINER_PORTS.eth.x - 5} y={MINER_PORTS.eth.y - 6} width={10} height={3} fill="#1a1c20" />
        <circle
          cx={MINER_PORTS.eth.x - 4}
          cy={MINER_PORTS.eth.y + 7}
          r={1.5}
          fill={powered ? '#22c55e' : '#1f2937'}
          className={powered ? 'animate-eth-blink' : ''}
          style={{ filter: powered ? 'drop-shadow(0 0 3px #22c55e)' : 'none' }}
        />
        <circle cx={MINER_PORTS.eth.x + 4} cy={MINER_PORTS.eth.y + 7} r={1.5} fill={powered ? '#eab308' : '#1f2937'} />
      </g>

      {/* ── the two large miner fans (dominant) ──────────────────────── */}
      <Fan cx={115} cy={156} r={44} powered={powered} />
      <Fan cx={115} cy={252} r={44} powered={powered} />

      {/* ── three smaller PSU fans (less dominant) ───────────────────── */}
      <Fan cx={205} cy={117} r={22} powered={powered} />
      <Fan cx={205} cy={175} r={22} powered={powered} />
      <Fan cx={205} cy={233} r={22} powered={powered} />

      {/* ── PSU bottom control: rocker switch + single square socket ──── */}
      {/* rocker switch */}
      <rect x="178" y="280" width="13" height="16" rx="2" fill="#0c0d0f" stroke="rgba(255,255,255,0.14)" strokeWidth={0.8} />
      <rect
        x="180"
        y="282"
        width="9"
        height="12"
        rx="1.2"
        fill={powered ? '#b91c1c' : '#3a1416'}
        style={{ filter: powered ? 'drop-shadow(0 0 3px rgba(220,38,38,0.7))' : 'none', transition: 'fill 0.5s ease' }}
      />
      {/* single square power socket (cable plugs in here from below) */}
      <rect x={MINER_PORTS.socket.x - 15} y="274" width="30" height="26" rx="3" fill="#0a0b0d" stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
      <rect x={MINER_PORTS.socket.x - 11} y="278" width="22" height="18" rx="2" fill="#050506" stroke="rgba(255,255,255,0.06)" strokeWidth={0.6} />
      <rect x={MINER_PORTS.socket.x - 5} y="282" width="2.6" height="6" rx="1" fill="#2a2d33" />
      <rect x={MINER_PORTS.socket.x + 2.4} y="282" width="2.6" height="6" rx="1" fill="#2a2d33" />
      <rect x={MINER_PORTS.socket.x - 1.3} y="290" width="2.6" height="4" rx="1" fill="#2a2d33" />
    </svg>
  );
}

export default memo(AsicMiner);
