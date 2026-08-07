'use client';

import { motion, useReducedMotion } from 'framer-motion';
import JudoKidSVG from './JudoKidSVG';

interface JudoCharacterProps {
  progress: number;
  feedback: 'answering' | 'correct' | 'incorrect';
}

export default function JudoCharacter({ progress, feedback }: JudoCharacterProps) {
  const reduceMotion = useReducedMotion();
  const left = 7 + Math.min(1, Math.max(0, progress)) * 76;

  return (
    <motion.div
      aria-label={`The judoka is ${Math.round(progress * 100)} percent of the way to the golden belt`}
      className="judo-character"
      animate={{
        left: `${left}%`,
        y: reduceMotion || feedback !== 'correct' ? 0 : [0, -19, 0],
        rotate: reduceMotion || feedback !== 'incorrect' ? 0 : [0, -3, 3, 0],
      }}
      transition={{
        left: { type: 'spring', stiffness: 98, damping: 19 },
        y: { duration: 0.58, ease: 'easeOut' },
        rotate: { duration: 0.4 },
      }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <JudoKidSVG />
      </motion.div>
    </motion.div>
  );
}
