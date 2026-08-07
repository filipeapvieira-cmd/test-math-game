export default function FootballPlayerSVG() {
  return (
    <svg
      aria-hidden="true"
      className="football-player-svg h-auto w-full overflow-visible"
      viewBox="0 0 220 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="112" cy="159" rx="82" ry="8" fill="#082A25" opacity="0.22" />

      {/* Trailing arm */}
      <path d="m78 71-32 16-22-7" stroke="#123047" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m78 71-32 16-22-7" stroke="#D79567" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

      {/* Head and hair */}
      <circle cx="105" cy="36" r="26" fill="#D79567" stroke="#123047" strokeWidth="5" />
      <path d="M81 31c0-17 12-27 27-27 14 0 25 8 27 22-9-4-18-8-28-9-6 6-14 10-26 11" fill="#172B3D" stroke="#123047" strokeWidth="5" strokeLinejoin="round" />
      <path d="M91 39h2m22-1h2" stroke="#123047" strokeWidth="5" strokeLinecap="round" />
      <path d="M100 50c5 3 10 3 14-1" stroke="#8E443A" strokeWidth="3" strokeLinecap="round" />

      {/* Shirt and badge */}
      <path d="M77 64c17-8 38-8 55 0l26 35-19 12-15-19 3 41H77l5-42-14 20-20-12 29-35Z" fill="#17A77B" stroke="#123047" strokeWidth="6" strokeLinejoin="round" />
      <path d="m91 61 14 16 14-16" stroke="#E9FFB1" strokeWidth="5" strokeLinejoin="round" />
      <path d="M68 86h68" stroke="#0C755C" strokeWidth="4" opacity="0.75" />
      <text x="94" y="112" fill="#F8FFEA" fontFamily="Arial, sans-serif" fontSize="31" fontWeight="900">10</text>
      <path d="M120 77h12v12h-12z" fill="#F4C542" stroke="#123047" strokeWidth="2.5" />

      {/* Forward arm */}
      <path d="m139 81 34-20 19 4" stroke="#123047" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m139 81 34-20 19 4" stroke="#D79567" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

      {/* Shorts, legs and boots */}
      <path d="M75 126h54l10 20-31 3-6-15-5 15-32-3 10-20Z" fill="#173E6B" stroke="#123047" strokeWidth="6" strokeLinejoin="round" />
      <path d="m79 143-12 15m52-14 4 16" stroke="#123047" strokeWidth="17" strokeLinecap="round" />
      <path d="m79 143-12 15m52-14 4 16" stroke="#D79567" strokeWidth="10" strokeLinecap="round" />
      <path d="m70 151-23 5c-8 2-7 10 2 11h25l2-10-6-6Zm48 2 3 13h30c8-1 9-8 2-11l-30-7-5 5Z" fill="#F4C542" stroke="#123047" strokeWidth="5" strokeLinejoin="round" />

      {/* Ball */}
      <g className="football-ball">
        <circle cx="183" cy="137" r="26" fill="#FFFDF2" stroke="#123047" strokeWidth="5" />
        <path d="m183 123 10 8-4 12h-13l-4-12 11-8Zm-20 2 10 6m19 0 10-7m-13 19 6 11m-19-11-7 11m14-31v-10" stroke="#123047" strokeWidth="4" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
