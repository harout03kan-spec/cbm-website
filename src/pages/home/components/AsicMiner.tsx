import { memo } from 'react';

/**
 * Stylized Antminer S19 XP–style ASIC, drawn as a single 3/4 isometric SVG
 * (vector only — no photo, no 3D bundle). Reads as a real industrial miner:
 * gunmetal boxy body, two large front fans, a top control strip with the ETH
 * port + Fault/Normal status LEDs, a PSU side face with twin power sockets, and
 * the twisted power harness off the top. Fans/LEDs animate via CSS once powered.
 *
 * Everything lives in one viewBox so the hero overlay (cables, packets) can
 * anchor exactly to the ports below.
 */
export const MINER_VIEWBOX = '0 0 360 340';

// Shared anchor points (SVG user units) used by the hero overlay for cables.
export const MINER_PORTS = {
  eth: { x: 150, y: 83 },
  socketA: { x: 245, y: 270 },
  socketB: { x: 267, y: 258 },
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
        <pattern id="hexVent" width="11" height="12.7" patternUnits="userSpaceOnUse" patternTransform="scale(0.85)">
          <circle cx="5.5" cy="3.2" r="2.1" fill="rgba(0,0,0,0.5)" />
          <circle cx="0" cy="9.5" r="2.1" fill="rgba(0,0,0,0.5)" />
          <circle cx="11" cy="9.5" r="2.1" fill="rgba(0,0,0,0.5)" />
        </pattern>
      </defs>

      {/* contact shadow on the floor */}
      <ellipse cx="178" cy="312" rx="150" ry="20" fill="rgba(0,0,0,0.55)" style={{ filter: 'blur(6px)' }} />

      {/* ── side / PSU face (back-right) ─────────────────────────────── */}
      <polygon points="212,68 294,28 294,262 212,302" fill="url(#sideGrad)" stroke="#000" strokeWidth={1} />
      {/* hex venting on the PSU */}
      <polygon points="222,82 286,50 286,150 222,180" fill="url(#hexVent)" opacity={0.7} />
      {/* PSU label plate */}
      <polygon points="224,196 286,166 286,196 224,224" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />
      <line x1="230" y1="200" x2="276" y2="178" stroke="rgba(255,255,255,0.18)" strokeWidth={1.4} />
      <line x1="230" y1="208" x2="270" y2="188" stroke="rgba(255,255,255,0.1)" strokeWidth={1.2} />

      {/* twin power sockets (C13 style) near the bottom of the PSU face */}
      {[
        { x: MINER_PORTS.socketA.x, y: MINER_PORTS.socketA.y },
        { x: MINER_PORTS.socketB.x, y: MINER_PORTS.socketB.y },
      ].map((s, i) => (
        <g key={i}>
          <rect
            x={s.x - 9}
            y={s.y - 8}
            width={18}
            height={16}
            rx={2.5}
            fill="#0c0d0f"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={1}
            transform={`translate(${s.x} ${s.y}) skewY(-26) translate(${-s.x} ${-s.y})`}
          />
          <g transform={`translate(${s.x} ${s.y}) skewY(-26) translate(${-s.x} ${-s.y})`}>
            <rect x={s.x - 4} y={s.y - 4} width={2.4} height={5} rx={1} fill="#26282c" />
            <rect x={s.x + 1.6} y={s.y - 4} width={2.4} height={5} rx={1} fill="#26282c" />
            <rect x={s.x - 1.2} y={s.y + 1.6} width={2.4} height={3} rx={1} fill="#26282c" />
          </g>
        </g>
      ))}

      {/* ── top face ─────────────────────────────────────────────────── */}
      <polygon points="58,68 212,68 294,28 140,28" fill="url(#topGrad)" stroke="#000" strokeWidth={1} />
      <line x1="58" y1="68" x2="140" y2="28" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      <line x1="212" y1="68" x2="294" y2="28" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {/* twisted multicolor power harness off the top */}
      <g strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.9}>
        <path d="M214 44 C 222 18, 236 14, 240 0" stroke="#b91c1c" />
        <path d="M218 46 C 226 20, 238 14, 244 0" stroke="#eab308" />
        <path d="M222 48 C 230 22, 242 16, 248 0" stroke="#2563eb" />
      </g>

      {/* ── front face (fans) ────────────────────────────────────────── */}
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
        ANTMINER S19 XP
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

      {/* the two large fans */}
      <Fan cx={135} cy={150} r={46} powered={powered} />
      <Fan cx={135} cy={250} r={46} powered={powered} />

      {/* front-left vertical edge highlight */}
      <line x1="59" y1="70" x2="59" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
    </svg>
  );
}

export default memo(AsicMiner);
