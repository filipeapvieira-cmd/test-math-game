'use client';

import { motion, useReducedMotion } from 'framer-motion';
import MonsterTruckSVG from './MonsterTruckSVG';

interface MonsterTruckCharacterProps {
  progress: number;
  feedback: 'answering' | 'correct' | 'incorrect';
}

export default function MonsterTruckCharacter({ progress, feedback }: MonsterTruckCharacterProps) {
  const reduceMotion = useReducedMotion();
  const left = 7 + Math.min(1, Math.max(0, progress)) * 75;

  return (
    <motion.div
      aria-label={`The monster truck is ${Math.round(progress * 100)} percent through the rally`}
      className="monster-truck-character"
      animate={{
        left: `${left}%`,
        y: reduceMotion || feedback !== 'correct' ? 0 : [0, -24, -17, 0],
        rotate: reduceMotion || feedback !== 'correct' ? 0 : [0, -2.5, 2, 0],
        x: reduceMotion || feedback !== 'incorrect' ? 0 : [0, -6, 5, -3, 0],
      }}
      transition={{
        left: { type: 'spring', stiffness: 100, damping: 19 },
        y: { duration: 0.7, ease: 'easeOut' },
        rotate: { duration: 0.7 },
        x: { duration: 0.4 },
      }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -1.5, 0], rotate: [0, 0.4, 0] }}
        transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MonsterTruckSVG />
      </motion.div>
    </motion.div>
  );
}
