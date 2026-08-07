'use client';

import { motion, useReducedMotion } from 'framer-motion';
import FootballPlayerSVG from './FootballPlayerSVG';

interface FootballCharacterProps {
  progress: number;
  feedback: 'answering' | 'correct' | 'incorrect';
}

export default function FootballCharacter({ progress, feedback }: FootballCharacterProps) {
  const reduceMotion = useReducedMotion();
  const left = 7 + Math.min(1, Math.max(0, progress)) * 75;

  return (
    <motion.div
      aria-label={`The footballer is ${Math.round(progress * 100)} percent of the way to the cup`}
      className="football-character"
      animate={{
        left: `${left}%`,
        y: reduceMotion || feedback !== 'correct' ? 0 : [0, -17, 0],
        rotate: reduceMotion || feedback !== 'correct' ? 0 : [0, -2, 1, 0],
        x: reduceMotion || feedback !== 'incorrect' ? 0 : [0, -5, 4, 0],
      }}
      transition={{
        left: { type: 'spring', stiffness: 105, damping: 18 },
        y: { duration: 0.64, ease: 'easeOut' },
        rotate: { duration: 0.64 },
        x: { duration: 0.38 },
      }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -2.5, 0], rotate: [0, 0.8, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FootballPlayerSVG />
      </motion.div>
    </motion.div>
  );
}
