'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import GoalEggSVG from './GoalEggSVG';
import FootballCupSVG from './FootballCupSVG';
import FootballPlayerSVG from './FootballPlayerSVG';
import JudoBeltSVG from './JudoBeltSVG';
import JudoKidSVG from './JudoKidSVG';
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
  onExit?: () => void;
}

export default function CelebrationScreen({
  theme,
  totalQuestions,
  totalAttempts,
  bestStreak,
  onPlayAgain,
  onOpenSettings,
  onExit,
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
  const celebration = {
    dino: {
      eyebrow: 'Adventure complete',
      title: 'Peter found the mystery egg!',
      stat: 'stars found',
      colors: ['#FFD166', '#61C454', '#79D7F2', '#FF7477'],
      heroClass: 'celebration-peter',
      goalClass: 'celebration-egg',
      hero: <PeterTRexSVG />,
      goal: <GoalEggSVG />,
    },
    rally: {
      eyebrow: 'Championship complete',
      title: 'You conquered the Monster Rally!',
      stat: 'checkpoints',
      colors: ['#FFB000', '#F4F1E8', '#1F5B78', '#D94B35'],
      heroClass: 'celebration-truck',
      goalClass: 'celebration-trophy',
      hero: <MonsterTruckSVG />,
      goal: <RallyTrophySVG />,
    },
    judo: {
      eyebrow: 'Golden belt earned',
      title: 'Ippon! You mastered the Judo Journey!',
      stat: 'techniques',
      colors: ['#E84D45', '#F7F1E5', '#1A2A44', '#F2C94C'],
      heroClass: 'celebration-judo',
      goalClass: 'celebration-judo-belt',
      hero: <JudoKidSVG />,
      goal: <JudoBeltSVG />,
    },
    football: {
      eyebrow: 'Full-time glory',
      title: 'Champions! You lifted the Number Cup!',
      stat: 'goals scored',
      colors: ['#17A77B', '#F4C542', '#F8FFEA', '#173E6B'],
      heroClass: 'celebration-footballer',
      goalClass: 'celebration-football-cup',
      hero: <FootballPlayerSVG />,
      goal: <FootballCupSVG />,
    },
  }[theme];

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
          colors={celebration.colors}
        />
      )}

      <motion.section
        className="celebration-card"
        initial={reduceMotion ? undefined : { opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.35 }}
      >
        <p className="eyebrow">{celebration.eyebrow}</p>
        <h1>{celebration.title}</h1>

        <div className="celebration-heroes" aria-hidden="true">
          <motion.div
            className={celebration.heroClass}
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 1.4, repeat: 2, ease: 'easeInOut' }}
          >
            {celebration.hero}
          </motion.div>
          <motion.div
            className={celebration.goalClass}
            animate={reduceMotion ? undefined : { rotate: [0, -5, 5, -3, 0] }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            {celebration.goal}
          </motion.div>
        </div>

        <div className="result-stats">
          <div><strong>{accuracy}%</strong><span>accuracy</span></div>
          <div><strong>{bestStreak}</strong><span>best streak</span></div>
          <div><strong>{totalQuestions}</strong><span>{celebration.stat}</span></div>
        </div>

        <div className="celebration-actions">
          <button className="primary-button" type="button" onClick={onPlayAgain}>Play again</button>
          <button className="secondary-button" type="button" onClick={onOpenSettings}>New adventure</button>
          {onExit ? <button className="secondary-button" type="button" onClick={onExit}>Choose game</button> : null}
        </div>
      </motion.section>
    </main>
  );
}
