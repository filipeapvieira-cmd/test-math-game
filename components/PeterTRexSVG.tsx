export default function PeterTRexSVG() {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full overflow-visible"
      viewBox="0 0 170 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="87" cy="111" rx="55" ry="7" fill="#15324A" opacity="0.18" />

      {/* Tail and body */}
      <path
        d="M58 71C41 76 23 73 7 61c12 3 25 0 36-9 5-18 20-30 42-30 30 0 48 21 48 45 0 24-18 39-46 39-24 0-40-11-43-29"
        fill="#61C454"
        stroke="#17324D"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M58 73c4 20 15 29 34 31-26 5-43-5-48-27" fill="#3EA644" />

      {/* Head and snout */}
      <path
        d="M80 25C84 8 102 2 120 7c18 5 25 19 21 35 15 4 23 13 21 24-3 16-19 20-44 17-25-2-41-15-39-33"
        fill="#73D45E"
        stroke="#17324D"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M111 50c15 6 32 6 47 1 6 6 6 16 0 23-12 9-35 9-49 2"
        fill="#B8EA82"
        stroke="#17324D"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Eye and face */}
      <ellipse cx="118" cy="30" rx="10" ry="12" fill="white" stroke="#17324D" strokeWidth="4" />
      <circle cx="121" cy="33" r="4" fill="#17324D" />
      <circle cx="132" cy="47" r="3" fill="#17324D" />
      <path d="M132 69c6 3 13 3 19-1" stroke="#17324D" strokeWidth="3" strokeLinecap="round" />
      <path d="m116 79 7 8 7-7m4 2 6 6 6-8" fill="white" stroke="#17324D" strokeWidth="2" strokeLinejoin="round" />

      {/* Back spikes */}
      <path d="m78 25-8-15 17 8m4-10 7 14 8-16 5 17" fill="#FF8A65" stroke="#17324D" strokeWidth="4" strokeLinejoin="round" />

      {/* Tiny arms */}
      <path d="M96 66c-12 1-17 7-18 16m18-16 8 9m-26 7-7-2" stroke="#17324D" strokeWidth="6" strokeLinecap="round" />
      <path d="M96 64c-12 1-17 7-18 16m18-16 8 9" stroke="#73D45E" strokeWidth="3" strokeLinecap="round" />

      {/* Legs and shoes */}
      <path d="M66 91v17m36-15v15" stroke="#17324D" strokeWidth="12" strokeLinecap="round" />
      <path d="M57 108c0-6 5-10 11-10h10c6 0 10 5 10 11H57Zm35 1c0-7 5-11 11-11h10c7 0 12 5 12 11H92Z" fill="#FFB84D" stroke="#17324D" strokeWidth="4" strokeLinejoin="round" />

      {/* Cheek */}
      <circle cx="105" cy="48" r="6" fill="#FF8A80" opacity="0.75" />
    </svg>
  );
}
