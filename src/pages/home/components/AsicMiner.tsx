import { memo } from 'react';

/**
 * Stylized Antminer S21 XP–style ASIC, drawn as a single 3/4 isometric SVG
 * (vector only — no photo, no 3D bundle). Matches the real S21 silhouette: a
 * narrow, deep gunmetal body whose front-left face carries two large stacked
 * fans, a PSU block bolted flush to the right with three smaller stacked fans
 * sitting in the middle zone between them, a control board spanning the top
 * front edge (ANTMINER S21 XP nameplate + ETH/IP/Reset/Fault/Normal cluster),
 * and a single square power inlet at the PSU base. Five fans total. Fans/LEDs
 * animate via CSS once powered; one thick cable plugs into the inlet from below.
 *
 * Everything lives in one viewBox so the hero overlay (cable, plug, packets)
 * can anchor exactly to the ports.
 */
export const MINER_VIEWBOX = '0 0 400 350';

// Shared anchor points (SVG user units) used by the hero overlay.
export const MINER_PORTS = {
  // ETH RJ45 sits at the LEFT of the top control board; the cable enters from the left.
  eth: { x: 75, y: 80 },
  // Single square power inlet centered under the three PSU fans.
  socket: { x: 194, y: 284 },
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
  const P = MINER_PORTS;
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
          <stop offset="0" stopColor="#23262b" />
          <stop offset="1" stopColor="#0d0e10" />
        </linearGradient>
        <radialGradient id="fanWell" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#202227" />
          <stop offset="1" stopColor="#0a0b0d" />
        </radialGradient>
      </defs>

      {/* contact shadow on the floor */}
      <ellipse cx="144" cy="318" rx="168" ry="18" fill="rgba(0,0,0,0.55)" style={{ filter: 'blur(6px)' }} />

      {/* ── deep right side wall (recedes back) ──────────────────────── */}
      <polygon points="224,70 319,20 319,255 224,305" fill="url(#sideGrad)" stroke="#000" strokeWidth={1} />
      {/* ribbed vent slits down the side give it depth */}
      {[120, 160, 200, 240].map((y, i) => (
        <line key={i} x1="232" y1={y} x2="312" y2={y - 42} stroke="rgba(0,0,0,0.4)" strokeWidth={1.4} />
      ))}
      <line x1="224" y1="70" x2="319" y2="20" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />

      {/* ── continuous top face ──────────────────────────────────────── */}
      <polygon points="64,70 224,70 319,20 159,20" fill="url(#topGrad)" stroke="#000" strokeWidth={1} />
      <line x1="64" y1="70" x2="159" y2="20" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      {[110, 160].map((x, i) => (
        <line key={i} x1={x} y1="70" x2={x + 95} y2="20" stroke="rgba(0,0,0,0.18)" strokeWidth={1} />
      ))}

      {/* ── miner front face (two large fans) — narrower body ─────────── */}
      <rect x="64" y="70" width="100" height="235" rx="6" fill="url(#frontGrad)" stroke="#000" strokeWidth={1.2} />
      <rect x="64" y="70" width="100" height="235" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <line x1="65" y1="104" x2="65" y2="303" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      {[[71, 299], [157, 299]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.3} fill="#0c0d0f" stroke="rgba(255,255,255,0.18)" strokeWidth={0.7} />
      ))}

      {/* ── PSU block front face (flush right, no gap) ───────────────── */}
      <rect x="164" y="70" width="60" height="235" rx="5" fill="url(#psuGrad)" stroke="#000" strokeWidth={1.2} />
      <rect x="164" y="70" width="60" height="235" rx="5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      {[[170, 299], [218, 299]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2} fill="#0c0d0f" stroke="rgba(255,255,255,0.16)" strokeWidth={0.6} />
      ))}
      {/* subtle "APW" PSU label (between the control board and the top PSU fan) */}
      <text x="194" y="124" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="6" letterSpacing="1.2" fontWeight={700} fill="rgba(255,255,255,0.22)">
        APW
      </text>

      {/* recessed control channel down the seam (below the control board) */}
      <rect x="161" y="104" width="6" height="201" fill="rgba(0,0,0,0.45)" />
      <line x1="164" y1="106" x2="164" y2="303" stroke="rgba(255,255,255,0.14)" strokeWidth={0.8} />

      {/* ══ TOP CONTROL BOARD (spans the front top edge) ═══════════════ */}
      <rect x="64" y="70" width="160" height="34" rx="5" fill="url(#stripGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />
      <line x1="66" y1="103" x2="222" y2="103" stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
      {/* red corner accents */}
      {[[68, 74], [220, 74]].map(([x, y], i) => (
        <rect
          key={i}
          x={x - 1.5}
          y={y - 1.5}
          width={3}
          height={3}
          rx={0.6}
          fill="#DC2626"
          style={{ opacity: powered ? 0.85 : 0.3, filter: powered ? 'drop-shadow(0 0 2px rgba(220,38,38,0.8))' : 'none', transition: 'opacity 0.6s ease' }}
        />
      ))}

      {/* control cluster — ETH (left) · IP Report · Reset · Fault (off) · Normal (lit) */}
      {/* ETH RJ45 jack + link LEDs */}
      <g>
        <rect x={P.eth.x - 7.5} y={P.eth.y - 6} width={15} height={12} rx={1.6} fill="#0a0b0d" stroke="rgba(255,255,255,0.22)" strokeWidth={0.8} />
        <rect x={P.eth.x - 4.5} y={P.eth.y - 6} width={9} height={3} fill="#1a1c20" />
        <circle
          cx={P.eth.x - 4}
          cy={P.eth.y + 4}
          r={1.4}
          fill={powered ? '#22c55e' : '#1f2937'}
          className={powered ? 'animate-eth-blink' : ''}
          style={{ filter: powered ? 'drop-shadow(0 0 3px #22c55e)' : 'none' }}
        />
        <circle cx={P.eth.x + 4} cy={P.eth.y + 4} r={1.4} fill={powered ? '#eab308' : '#1f2937'} />
      </g>

      {/* IP Report button */}
      <rect x="100" y="76" width="8" height="8" rx="1.6" fill="#2a2d33" stroke="rgba(255,255,255,0.16)" strokeWidth={0.6} />
      <rect x="101" y="77" width="6" height="2" rx="1" fill="rgba(255,255,255,0.12)" />

      {/* Reset button (recessed) */}
      <circle cx="130" cy="80" r={3} fill="#15171a" stroke="rgba(255,255,255,0.16)" strokeWidth={0.7} />
      <circle cx="130" cy="80" r={1.2} fill="#0a0b0d" />

      {/* Fault LED (exists but stays off) */}
      <circle cx="156" cy="80" r={2.6} fill="#3a1416" stroke="rgba(0,0,0,0.6)" strokeWidth={0.6} />
      <text x="156" y="98" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="3.4" letterSpacing="0.1" fontWeight={600} fill="rgba(255,255,255,0.4)">
        FAULT
      </text>

      {/* Normal LED (only this one is lit) */}
      <circle
        cx="184"
        cy="80"
        r={2.6}
        fill={powered ? '#22c55e' : '#16291c'}
        className={powered ? 'animate-eth-blink' : ''}
        style={{ filter: powered ? 'drop-shadow(0 0 4px rgba(34,197,94,0.9))' : 'none', transition: 'fill 0.5s ease' }}
      />
      <text x="184" y="98" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="3.4" letterSpacing="0.1" fontWeight={600} fill="rgba(255,255,255,0.5)">
        NORMAL
      </text>

      {/* nameplate along the lower edge of the control board */}
      <text x="70" y="100" fontFamily="'Inter', sans-serif" fontSize="7" letterSpacing="0.3" fontWeight={800} fill="rgba(255,255,255,0.85)">
        ANTMINER S21{' '}
        <tspan
          fontWeight={800}
          fill="#ff4d4d"
          style={{ filter: 'drop-shadow(0 0 2px rgba(248,60,60,0.95))' }}
        >
          XP
        </tspan>
      </text>

      {/* ── the two large miner fans (bigger, higher, tight to the board) ─ */}
      <Fan cx={114} cy={153} r={48} powered={powered} />
      <Fan cx={114} cy={254} r={48} powered={powered} />

      {/* ── three smaller PSU fans (centered in the middle zone between them) ─ */}
      <Fan cx={194} cy={166} r={16} powered={powered} />
      <Fan cx={194} cy={204} r={16} powered={powered} />
      <Fan cx={194} cy={242} r={16} powered={powered} />

      {/* ── single square power inlet at the PSU base (cable plugs in here) ─ */}
      <rect x={P.socket.x - 15} y="271" width="30" height="28" rx="3" fill="#0a0b0d" stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
      <rect x={P.socket.x - 11} y="275" width="22" height="20" rx="2" fill="#050506" stroke="rgba(255,255,255,0.06)" strokeWidth={0.6} />
      <rect x={P.socket.x - 5} y="280" width="2.6" height="6" rx="1" fill="#2a2d33" />
      <rect x={P.socket.x + 2.4} y="280" width="2.6" height="6" rx="1" fill="#2a2d33" />
      <rect x={P.socket.x - 1.3} y="288" width="2.6" height="4" rx="1" fill="#2a2d33" />
    </svg>
  );
}

export default memo(AsicMiner);
