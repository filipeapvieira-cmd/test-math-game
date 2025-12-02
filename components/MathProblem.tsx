'use client';

interface MathProblemProps {
  num1: number;
  num2: number;
}

export default function MathProblem({ num1, num2 }: MathProblemProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md border-4 border-white rounded-xl p-6 shadow-lg inline-block">
      <div className="flex items-center justify-center gap-4 text-white font-pixel">
        <span className="text-5xl drop-shadow-[4px_4px_0_#000]">{num1}</span>
        <span className="text-4xl text-[#fcd000] drop-shadow-[2px_2px_0_#000]">+</span>
        <span className="text-5xl drop-shadow-[4px_4px_0_#000]">{num2}</span>
        <span className="text-4xl text-[#fcd000] drop-shadow-[2px_2px_0_#000]">=</span>
        <span className="text-5xl text-[#fcd000] drop-shadow-[4px_4px_0_#000]">?</span>
      </div>
    </div>
  );
}
