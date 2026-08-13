/**
 * Decorative stand-in for the 3D render in the Figma frames.
 *
 * TO SWAP IN THE REAL ASSET: export the illustration from Figma as PNG/WebP to
 * `public/auth-illustration.png`, then replace the <svg> below with:
 *
 *   <Image src="/auth-illustration.png" alt="" fill priority
 *          sizes="(max-width: 1024px) 100vw, 50vw"
 *          className="object-contain object-bottom" />
 *
 * Inline SVG is used meanwhile so the panel ships zero image bytes and scales
 * losslessly. It is `aria-hidden` either way — purely decorative.
 */
export function AuthIllustration() {
  return (
    <svg
      viewBox="0 0 420 420"
      aria-hidden
      className="h-auto w-full max-w-md drop-shadow-2xl"
    >
      <defs>
        <linearGradient id="ai-crate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8f2230" />
          <stop offset="100%" stopColor="#5e1420" />
        </linearGradient>
        <linearGradient id="ai-basket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7f8ce8" />
          <stop offset="100%" stopColor="#4c56b8" />
        </linearGradient>
        <linearGradient id="ai-bag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0b183" />
          <stop offset="100%" stopColor="#c08d5b" />
        </linearGradient>
        <linearGradient id="ai-pie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbb2f2" />
          <stop offset="100%" stopColor="#9b7ede" />
        </linearGradient>
      </defs>

      {/* Back crate */}
      <rect x="96" y="120" width="228" height="176" rx="18" fill="url(#ai-crate)" />
      <rect x="96" y="120" width="228" height="26" rx="13" fill="#a82c3c" opacity="0.75" />

      {/* Bunting across the crate */}
      <path
        d="M112 168 Q210 214 308 168"
        fill="none"
        stroke="#f2f4ff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      {[136, 176, 216, 256, 292].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={182 + (i % 2 === 0 ? 10 : 2)}
          width="18"
          height="30"
          rx="3"
          fill={i % 2 === 0 ? "#dfe4ff" : "#b9c2f5"}
        />
      ))}

      {/* Pie chart wedge, left */}
      <g transform="translate(34 196)">
        <circle cx="46" cy="46" r="46" fill="url(#ai-pie)" />
        <path d="M46 46 L46 0 A46 46 0 0 1 88 30 Z" fill="#f6f0ff" opacity="0.9" />
        <circle cx="46" cy="46" r="14" fill="#6b4fae" opacity="0.35" />
      </g>

      {/* Paper bags, right */}
      <g>
        <rect x="236" y="206" width="66" height="104" rx="8" fill="url(#ai-bag)" />
        <path
          d="M252 206 q14 -22 28 0"
          fill="none"
          stroke="#8a6237"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="290" y="228" width="52" height="84" rx="8" fill="#d3a678" />
      </g>

      {/* Shopping basket, front */}
      <g>
        <path
          d="M104 250 h188 l-18 104 a20 20 0 0 1 -20 17 h-112 a20 20 0 0 1 -20 -17 Z"
          fill="url(#ai-basket)"
        />
        <rect x="94" y="238" width="208" height="26" rx="13" fill="#9aa4f0" />
        <path
          d="M150 238 v-22 a48 48 0 0 1 96 0 v22"
          fill="none"
          stroke="#8b93e6"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {[142, 174, 206, 238, 270].map((x) => (
          <line
            key={x}
            x1={x}
            y1="272"
            x2={x - 6}
            y2="352"
            stroke="#5f6ad0"
            strokeWidth="4"
            opacity="0.55"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Discount badge */}
      <g>
        <circle cx="150" cy="286" r="34" fill="#f4485c" />
        <circle cx="150" cy="286" r="34" fill="#ff6d7e" opacity="0.45" />
        <text
          x="150"
          y="298"
          textAnchor="middle"
          fontSize="30"
          fontWeight="800"
          fill="#ffffff"
          fontFamily="system-ui, sans-serif"
        >
          %
        </text>
      </g>

      {/* Pins */}
      {[
        [86, 150],
        [330, 168],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <line
            x1={cx}
            y1={cy}
            x2={cx + 14}
            y2={cy + 52}
            stroke="#e8ecff"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="15" fill="#f6a8a0" />
        </g>
      ))}
    </svg>
  );
}
