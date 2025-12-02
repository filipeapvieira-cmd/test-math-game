export default function TabletReward() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tablet Body */}
      <rect x="15" y="10" width="70" height="80" rx="8" fill="#6366F1" />
      <rect x="20" y="15" width="60" height="70" rx="4" fill="#818CF8" />
      
      {/* Screen Glow */}
      <rect x="22" y="17" width="56" height="60" rx="2" fill="#C7D2FE" />
      
      {/* Stars on screen */}
      <text x="35" y="45" fontSize="20" fill="#FFD700">⭐</text>
      <text x="55" y="35" fontSize="16" fill="#FFD700">✨</text>
      <text x="50" y="60" fontSize="18" fill="#FFD700">⭐</text>
      
      {/* Home button */}
      <circle cx="50" cy="85" r="3" fill="#C7D2FE" />
      
      {/* Sparkles around tablet */}
      <text x="5" y="25" fontSize="12" fill="#FBBF24">✨</text>
      <text x="85" y="30" fontSize="14" fill="#FBBF24">⭐</text>
      <text x="10" y="70" fontSize="12" fill="#FBBF24">⭐</text>
      <text x="88" y="75" fontSize="12" fill="#FBBF24">✨</text>
    </svg>
  );
}
