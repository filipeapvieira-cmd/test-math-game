export default function MonsterTruckSVG() {
  return (
    <svg
      aria-hidden="true"
      className="monster-truck-svg h-auto w-full overflow-visible"
      viewBox="0 0 230 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="118" cy="126" rx="91" ry="8" fill="#03070A" opacity="0.32" />

      {/* Chassis and suspension */}
      <path d="M52 91h129" stroke="#101820" strokeWidth="9" strokeLinecap="round" />
      <path d="m62 84 17 26m84-26-16 26M88 91l-9 19m57-19 11 19" stroke="#FFB000" strokeWidth="5" strokeLinecap="round" />
      <path d="M70 83h93" stroke="#D8E0E5" strokeWidth="5" strokeLinecap="round" />

      {/* Oversized tyres */}
      <g className="truck-wheel">
        <circle cx="62" cy="104" r="31" fill="#101820" stroke="#05090C" strokeWidth="5" />
        <path d="m41 84 42 41M34 102l54 6M45 127l36-47" stroke="#35424B" strokeWidth="5" />
        <circle cx="62" cy="104" r="14" fill="#AAB4BB" stroke="#101820" strokeWidth="5" />
        <circle cx="62" cy="104" r="5" fill="#FFB000" />
      </g>
      <g className="truck-wheel">
        <circle cx="174" cy="104" r="31" fill="#101820" stroke="#05090C" strokeWidth="5" />
        <path d="m153 84 42 41m-49-23 54 6m-43 19 36-47" stroke="#35424B" strokeWidth="5" />
        <circle cx="174" cy="104" r="14" fill="#AAB4BB" stroke="#101820" strokeWidth="5" />
        <circle cx="174" cy="104" r="5" fill="#FFB000" />
      </g>

      {/* Truck body */}
      <path
        d="M36 73c5-20 19-31 42-35l19-24h48l24 26 34 8c12 3 19 11 21 25l-8 17h-30c-5-15-16-22-31-22-14 0-25 7-30 22H92c-5-15-15-22-30-22-14 0-24 7-29 21H19V76l17-3Z"
        fill="#1F5B78"
        stroke="#101820"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="m97 20-13 22h72l-17-22H97Z" fill="#172A38" stroke="#101820" strokeWidth="5" strokeLinejoin="round" />
      <path d="M104 25h30l11 16h-51l10-16Z" fill="#7FC8D9" opacity="0.85" />
      <path d="M39 57h160l16 11H35l4-11Z" fill="#FFB000" />
      <path d="M31 70h184" stroke="#101820" strokeWidth="5" />
      <path d="m111 53 17 9-10 15-18-8 11-16Z" fill="#F4F1E8" stroke="#101820" strokeWidth="3" />
      <text x="106" y="69" fill="#101820" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="900">7</text>

      {/* Grill, lights and safety cage */}
      <path d="M201 53h15l8 12-8 10h-13" fill="#263844" stroke="#101820" strokeWidth="4" />
      <rect x="208" y="56" width="12" height="9" rx="3" fill="#FFF1A8" />
      <path d="M82 39V18h75v24" stroke="#101820" strokeWidth="5" strokeLinejoin="round" />
      <path d="M93 18h54" stroke="#D8E0E5" strokeWidth="4" />
      <circle cx="103" cy="17" r="6" fill="#FFB000" stroke="#101820" strokeWidth="3" />
      <circle cx="122" cy="17" r="6" fill="#FFB000" stroke="#101820" strokeWidth="3" />
      <circle cx="141" cy="17" r="6" fill="#FFB000" stroke="#101820" strokeWidth="3" />
      <path d="M19 77h18v11H19" fill="#AAB4BB" stroke="#101820" strokeWidth="4" />

      {/* Motion dust */}
      <path d="M15 103H4m20 14H10" stroke="#CDA56A" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
