'use client';

import { motion } from 'framer-motion';
import PeterTRexSVG from './PeterTRexSVG';

interface PeterCharacterProps {
  progress: number; // 0 to 100
  isCorrect: boolean;
  isWaiting: boolean;
}

export default function PeterCharacter({ progress, isCorrect, isWaiting }: PeterCharacterProps) {
  return (
    <motion.div
      className="relative"
      animate={{
        x: `${progress * 6}px`, // Moves across screen based on progress
        scale: isCorrect ? [1, 1.2, 1] : 1,
        rotate: isCorrect ? [0, 5, -5, 0] : 0,
      }}
      transition={{
        x: { type: 'spring', stiffness: 100, damping: 20 },
        scale: { duration: 0.5 },
        rotate: { duration: 0.5 },
      }}
    >
      <motion.div
        animate={
          isWaiting
            ? {
                y: [0, -8, 0],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <PeterTRexSVG />
      </motion.div>
    </motion.div>
  );
}
