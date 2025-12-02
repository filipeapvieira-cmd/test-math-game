'use client';

import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import TabletRewardSVG from './TabletRewardSVG';

interface CelebrationScreenProps {
  onPlayAgain: () => void;
}

export default function CelebrationScreen({ onPlayAgain }: CelebrationScreenProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#5c94fc] z-50">
      <Confetti width={windowSize.width} height={windowSize.height} recycle={true} numberOfPieces={300} />
      
      <motion.div
        initial={{ y: -500 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="bg-[#fcd000] border-8 border-[#e60012] p-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)] text-center max-w-3xl mx-4 relative"
      >
        {/* Corner Bolts */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-black opacity-20 rounded-full"></div>
        <div className="absolute top-2 right-2 w-4 h-4 bg-black opacity-20 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-black opacity-20 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-black opacity-20 rounded-full"></div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8 flex justify-center"
        >
          <div className="scale-150">
            <TabletRewardSVG />
          </div>
        </motion.div>
        
        <h1 className="text-5xl font-pixel text-[#e60012] mb-8 text-shadow-md leading-tight">
          COURSE CLEAR!
        </h1>
        
        <p className="text-xl font-pixel text-black mb-8 leading-relaxed">
          PETER REACHED THE GOAL!
        </p>
        
        <motion.button
          onClick={onPlayAgain}
          className="bg-[#00aa00] text-white font-pixel text-xl px-8 py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-[#00cc00] active:translate-y-1 active:shadow-none transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          PLAY AGAIN
        </motion.button>
      </motion.div>
    </div>
  );
}
