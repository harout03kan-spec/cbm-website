import { memo } from 'react';

/**
 * Stylized Antminer S21 XP–style ASIC, drawn as a single 3/4 isometric SVG
 * (vector only — no photo, no 3D bundle). Reads as a real industrial miner:
 * gunmetal boxy body, two large front fans, a top control strip with the ETH
 * port + Fault/Normal status LEDs, and a dedicated power-supply (PSU) block
 * bolted flush to the right wall carrying three smaller fans. Five fans total.
 * Fans/LEDs animate via CSS once powered; power cables drop from the PSU base.
 *
 * Everything lives in one viewBox so the hero overlay (cables, packets) can
 * anchor exactly to the ports below.
 */
export const MINER_VIEWBOX = '0 0 400 340';

// Shared anchor points (SVG user units) used by the hero overlay for cables.
export const MINER_PORTS = {
  eth: { x: 150, y: 83 },
  // Power inlets live at the bottom of the PSU block now (not the miner side).
  socketA: { x: 240, y: 300 },
  socketB: { x: 272, y: 300 },
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
          strokeWidth={1.6}
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
          strokeWidth={1.2}
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
          <stop offset="1" stopColor="#121315" />
        </linearGradient>
        <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#303338" />
          <stop offset="1" stopColor="#191b1e" />
        </linearGradient>
        <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#55585f" />
          <stop offset="1" stopColor="#34373d" />
        </linearGradient>
        <linearGradient id="stripGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1d21" />
          <stop offset="1" stopColor="#101113" />
        </linearGradient>
        <radialGradient id="fanWell" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#202227" />
          <stop offset="1" stopColor="#0a0b0d" />
        </radialGradient>
      </defs>

      {/* contact shadow on the floor (covers miner + PSU) */}
      <ellipse cx="210" cy="312" rx="190" ry="20" fill="rgba(0,0,0,0.55)" style={{ filter: 'blur(6px)' }} />

      {/* ── PSU block (right): receding side + top, behind the front faces ── */}
      <polygon points="300,68 382,28 382,262 300,302" fill="url(#sideGrad)" stroke="#000" strokeWidth={1} />
      <polygon points="212,68 300,68 382,28 294,28" fill="url(#topGrad)" stroke="#000" strokeWidth={1} />
      <line x1="300" y1="68" x2="382" y2="28" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

      {/* ── miner top face ───────────────────────────────────────────── */}
      <polygon points="58,68 212,68 294,28 140,28" fill="url(#topGrad)" stroke="#000" strokeWidth={1} />
      <line x1="58" y1="68" x2="140" y2="28" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      {/* seam between miner top and PSU top */}
      <line x1="212" y1="68" x2="294" y2="28" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {/* ── miner front face (two main fans) ─────────────────────────── */}
      <rect x="58" y="68" width="154" height="234" rx="7" fill="url(#frontGrad)" stroke="#000" strokeWidth={1.2} />
      <rect x="58" y="68" width="154" height="234" rx="7" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      {/* corner screws */}
      {[
        [68, 78], [202, 78], [68, 292], [202, 292],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.4} fill="#0c0d0f" stroke="rgba(255,255,255,0.18)" strokeWidth={0.7} />
      ))}

      {/* control strip */}
      <rect x="64" y="72" width="142" height="22" rx="3" fill="url(#stripGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />
      <text x="69" y="85" fontFamily="'Inter', sans-serif" fontSize="6" letterSpacing="0.3" fontWeight={700} fill="rgba(255,255,255,0.55)">
        ANTMINER S21{' '}
        <tspan
          fontSize="9"
          fontWeight={800}
          letterSpacing="0.6"
          fill="#f87171"
          style={{ filter: 'drop-shadow(0 0 2px rgba(248,113,113,0.85))' }}
        >
          XP
        </tspan>
      </text>
      {/* ETH RJ45 port */}
      <g>
        <rect x={MINER_PORTS.eth.x - 8} y={MINER_PORTS.eth.y - 6} width={16} height={12} rx={1.5} fill="#0a0b0d" stroke="rgba(255,255,255,0.22)" strokeWidth={0.8} />
        <rect x={MINER_PORTS.eth.x - 5} y={MINER_PORTS.eth.y - 6} width={10} height={3} fill="#1a1c20" />
        {/* link LEDs: green (blinks when powered), yellow (steady) */}
        <circle
          cx={MINER_PORTS.eth.x - 5}
          cy={MINER_PORTS.eth.y + 3.5}
          r={1.5}
          fill={powered ? '#22c55e' : '#1f2937'}
          className={powered ? 'animate-eth-blink' : ''}
          style={{ filter: powered ? 'drop-shadow(0 0 3px #22c55e)' : 'none' }}
        />
        <circle cx={MINER_PORTS.eth.x + 5} cy={MINER_PORTS.eth.y + 3.5} r={1.5} fill={powered ? '#eab308' : '#1f2937'} />
      </g>
      {/* IP report + reset micro-buttons */}
      <circle cx={127} cy={83} r={1.9} fill="#0c0d0f" stroke="rgba(255,255,255,0.15)" strokeWidth={0.6} />
      <circle cx={169} cy={83} r={1.9} fill="#0c0d0f" stroke="rgba(255,255,255,0.15)" strokeWidth={0.6} />
      {/* status LEDs: Fault (stays off) + Normal (green, lit) */}
      <circle cx={184} cy={83} r={2.4} fill="#3a1416" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
      <circle
        cx={195}
        cy={83}
        r={2.4}
        fill={powered ? '#22c55e' : '#14321d'}
        className={powered ? 'animate-led-flicker' : ''}
        style={{ filter: powered ? 'drop-shadow(0 0 4px #22c55e)' : 'none' }}
      />

      {/* the two large miner fans */}
      <Fan cx={135} cy={150} r={46} powered={powered} />
      <Fan cx={135} cy={250} r={46} powered={powered} />

      {/* front-left vertical edge highlight */}
      <line x1="59" y1="70" x2="59" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

      {/* ── PSU front face (bolted flush to the right, no gap) ────────── */}
      <rect x="212" y="68" width="88" height="234" rx="5" fill="url(#psuGrad)" stroke="#000" strokeWidth={1.2} />
      <rect x="212" y="68" width="88" height="234" rx="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      {/* seam where the PSU meets the miner body */}
      <line x1="212" y1="70" x2="212" y2="300" stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
      {/* PSU label plate */}
      <rect x="226" y="74" width="60" height="13" rx="2.5" fill="url(#stripGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.7} />
      <text x="232" y="83.5" fontFamily="'Inter', sans-serif" fontSize="5.4" letterSpacing="0.4" fontWeight={700} fill="rgba(255,255,255,0.5)">
        APW POWER
      </text>
      {/* PSU corner screws */}
      {[
        [220, 78], [292, 78], [220, 292], [292, 292],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.2} fill="#0c0d0f" stroke="rgba(255,255,255,0.18)" strokeWidth={0.6} />
      ))}

      {/* three smaller PSU fans */}
      <Fan cx={256} cy={132} r={29} powered={powered} />
      <Fan cx={256} cy={198} r={29} powered={powered} />
      <Fan cx={256} cy={264} r={29} powered={powered} />

      {/* power inlets at the bottom of the PSU (cables plug in here) */}
      {[MINER_PORTS.socketA, MINER_PORTS.socketB].map((s, i) => (
        <g key={i}>
          <rect x={s.x - 7} y={s.y - 7} width={14} height={11} rx={2} fill="#0a0b0d" stroke="rgba(255,255,255,0.16)" strokeWidth={0.9} />
          <rect x={s.x - 4} y={s.y - 4} width={2.4} height={5} rx={1} fill="#26282c" />
          <rect x={s.x + 1.6} y={s.y - 4} width={2.4} height={5} rx={1} fill="#26282c" />
          <rect x={s.x - 1.2} y={s.y + 1} width={2.4} height={3} rx={1} fill="#26282c" />
        </g>
      ))}
    </svg>
  );
}

export default memo(AsicMiner);
