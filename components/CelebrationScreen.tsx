'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import GoalEggSVG from './GoalEggSVG';
import MonsterTruckSVG from './MonsterTruckSVG';
import PeterTRexSVG from './PeterTRexSVG';
import RallyTrophySVG from './RallyTrophySVG';
import type { GameTheme } from './gameEngine';

interface CelebrationScreenProps {
  theme: GameTheme;
  totalQuestions: number;
  totalAttempts: number;
  bestStreak: number;
  onPlayAgain: () => void;
  onOpenSettings: () => void;
}

export default function CelebrationScreen({
  theme,
  totalQuestions,
  totalAttempts,
  bestStreak,
  onPlayAgain,
  onOpenSettings,
}: CelebrationScreenProps) {
  const reduceMotion = useReducedMotion();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const accuracy = Math.round((totalQuestions / Math.max(totalQuestions, totalAttempts)) * 100);
  const isRally = theme === 'rally';

  return (
    <main className="celebration-screen" data-theme={theme}>
      {reduceMotion ? null : (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={180}
          gravity={0.16}
          tweenDuration={6500}
          colors={isRally
            ? ['#FFB000', '#F4F1E8', '#1F5B78', '#D94B35']
            : ['#FFD166', '#61C454', '#79D7F2', '#FF7477']}
        />
      )}

      <motion.section
        className="celebration-card"
        initial={reduceMotion ? undefined : { opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.35 }}
      >
        <p className="eyebrow">{isRally ? 'Championship complete' : 'Adventure complete'}</p>
        <h1>{isRally ? 'You conquered the Monster Rally!' : 'Peter found the mystery egg!'}</h1>

        <div className="celebration-heroes" aria-hidden="true">
          <motion.div
            className={isRally ? 'celebration-truck' : 'celebration-peter'}
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 1.4, repeat: 2, ease: 'easeInOut' }}
          >
            {isRally ? <MonsterTruckSVG /> : <PeterTRexSVG />}
          </motion.div>
          <motion.div
            className={isRally ? 'celebration-trophy' : 'celebration-egg'}
            animate={reduceMotion ? undefined : { rotate: [0, -5, 5, -3, 0] }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            {isRally ? <RallyTrophySVG /> : <GoalEggSVG />}
          </motion.div>
        </div>

        <div className="result-stats">
          <div><strong>{accuracy}%</strong><span>accuracy</span></div>
          <div><strong>{bestStreak}</strong><span>best streak</span></div>
          <div><strong>{totalQuestions}</strong><span>{isRally ? 'checkpoints' : 'stars found'}</span></div>
        </div>

        <div className="celebration-actions">
          <button className="primary-button" type="button" onClick={onPlayAgain}>Play again</button>
          <button className="secondary-button" type="button" onClick={onOpenSettings}>New adventure</button>
        </div>
      </motion.section>
    </main>
  );
}
