'use client';

export default function LevelBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sky is handled by global CSS background color */}
      
      {/* Clouds */}
      <div className="absolute top-20 left-20 opacity-80">
        <Cloud width={100} />
      </div>
      <div className="absolute top-40 right-40 opacity-90">
        <Cloud width={140} />
      </div>
      <div className="absolute top-10 left-1/2 opacity-70">
        <Cloud width={80} />
      </div>

      {/* Hills */}
      <div className="absolute bottom-16 left-0 w-full flex items-end justify-between px-10 opacity-90">
        <Hill color="#00aa00" height={120} />
        <Hill color="#00cc00" height={80} />
        <Hill color="#009900" height={150} />
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-world/grass.png')] bg-repeat-x" 
           style={{ 
             backgroundColor: '#924a0b',
             backgroundImage: 'linear-gradient(45deg, #c46210 25%, transparent 25%, transparent 75%, #c46210 75%, #c46210), linear-gradient(45deg, #c46210 25%, transparent 25%, transparent 75%, #c46210 75%, #c46210)',
             backgroundSize: '40px 40px',
             backgroundPosition: '0 0, 20px 20px',
             borderTop: '4px solid #000'
           }}>
      </div>
    </div>
  );
}

function Cloud({ width }: { width: number }) {
  return (
    <svg width={width} viewBox="0 0 100 60" fill="white">
      <path d="M20 50 C 10 50, 0 40, 0 30 C 0 15, 15 5, 30 10 C 35 0, 55 0, 60 10 C 75 5, 90 15, 90 30 C 90 40, 80 50, 70 50 Z" />
    </svg>
  );
}

function Hill({ color, height }: { color: string, height: number }) {
  return (
    <svg width={height * 1.5} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0 100 Q 50 0 100 100 Z" fill={color} stroke="black" strokeWidth="2" />
      {/* Eyes on hill */}
      <circle cx="40" cy="60" r="3" fill="black" opacity="0.3" />
      <circle cx="60" cy="60" r="3" fill="black" opacity="0.3" />
    </svg>
  );
}
