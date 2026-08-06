'use client';

import { motion, useReducedMotion } from 'framer-motion';
import PeterTRexSVG from './PeterTRexSVG';

interface PeterCharacterProps {
  progress: number;
  feedback: 'answering' | 'correct' | 'incorrect';
}

export default function PeterCharacter({ progress, feedback }: PeterCharacterProps) {
  const reduceMotion = useReducedMotion();
  const left = 7 + Math.min(1, Math.max(0, progress)) * 76;

  return (
    <motion.div
      className="peter-character"
      aria-label={`Peter is ${Math.round(progress * 100)} percent of the way to the egg`}
      animate={{
        left: `${left}%`,
        y: reduceMotion || feedback !== 'correct' ? 0 : [0, -22, 0],
        rotate: reduceMotion || feedback !== 'incorrect' ? 0 : [0, -4, 4, -3, 0],
      }}
      transition={{
        left: { type: 'spring', stiffness: 95, damping: 18 },
        y: { duration: 0.65, ease: 'easeOut' },
        rotate: { duration: 0.42 },
      }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -3, 0], rotate: [0, 0.7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PeterTRexSVG />
      </motion.div>
    </motion.div>
  );
}
