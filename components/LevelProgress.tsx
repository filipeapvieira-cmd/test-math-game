'use client';

interface LevelProgressProps {
  current: number;
  total: number;
}

export default function LevelProgress({ current, total }: LevelProgressProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 font-pixel">
      <div className="flex justify-between items-end mb-1 px-1">
        <span className="text-white text-shadow-sm text-sm">PROGRESS</span>
        <span className="text-white text-shadow-sm text-sm">{current}/{total}</span>
      </div>
      
      {/* Mario Style Bar Container */}
      <div className="h-8 bg-black border-4 border-white relative">
        {/* Fill */}
        <div 
          className="h-full bg-[#fcd000] transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/40"></div>
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: total - 1 }).map((_, i) => (
            <div 
              key={i} 
              className="h-full border-r-2 border-black/20 flex-1"
              style={{ flexBasis: `${100/total}%`, flexGrow: 0 }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
