export default function PeterTRexSVG() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Yoshi-style Green Body */}
      <path
        d="M60 20 C 45 20, 35 35, 35 50 C 35 65, 45 75, 50 85 L 50 100 L 70 100 L 70 85 C 80 75, 85 65, 85 50 C 85 35, 75 20, 60 20"
        fill="#43b047"
        stroke="black"
        strokeWidth="3"
      />
      
      {/* White Belly/Cheeks */}
      <path
        d="M45 50 C 45 60, 50 70, 60 70 C 70 70, 75 60, 75 50 C 75 40, 70 35, 60 35 C 50 35, 45 40, 45 50"
        fill="white"
      />
      
      {/* Big Nose */}
      <circle cx="85" cy="40" r="15" fill="#43b047" stroke="black" strokeWidth="3" />
      
      {/* Eyes */}
      <ellipse cx="60" cy="25" rx="8" ry="12" fill="white" stroke="black" strokeWidth="2" />
      <ellipse cx="75" cy="25" rx="8" ry="12" fill="white" stroke="black" strokeWidth="2" />
      <circle cx="62" cy="25" r="3" fill="black" />
      <circle cx="73" cy="25" r="3" fill="black" />
      
      {/* Orange Shoes */}
      <path
        d="M40 100 L 55 100 L 55 110 C 55 115, 50 118, 45 118 L 40 118 C 35 118, 30 115, 30 110 L 30 105 C 30 102, 35 100, 40 100"
        fill="#ff6b00"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M65 100 L 80 100 L 80 110 C 80 115, 75 118, 70 118 L 65 118 C 60 118, 55 115, 55 110 L 55 105 C 55 102, 60 100, 65 100"
        fill="#ff6b00"
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Red Spikes/Saddle */}
      <path d="M35 50 L 25 45 L 35 40" fill="#e60012" stroke="black" strokeWidth="2" />
      <path d="M30 65 L 20 60 L 30 55" fill="#e60012" stroke="black" strokeWidth="2" />
      
      {/* Arm */}
      <ellipse cx="50" cy="65" rx="10" ry="5" fill="#43b047" stroke="black" strokeWidth="2" />
    </svg>
  );
}
