'use client';

import GoalEggSVG from './GoalEggSVG';
import MonsterTruckCharacter from './MonsterTruckCharacter';
import PeterCharacter from './PeterCharacter';
import RallyTrophySVG from './RallyTrophySVG';
import type { GameTheme } from './gameEngine';

interface ProgressBarProps {
  current: number;
  total: number;
  feedback: 'answering' | 'correct' | 'incorrect';
  theme: GameTheme;
}

export default function ProgressBar({ current, total, feedback, theme }: ProgressBarProps) {
  const progress = total === 0 ? 0 : current / total;
  const isRally = theme === 'rally';

  return (
    <section
      aria-label={isRally
        ? `Rally progress: ${current} of ${total} checkpoints complete`
        : `Journey progress: ${current} of ${total} questions complete`}
      className={`journey ${isRally ? 'journey-rally' : ''}`}
    >
      {isRally ? (
        <>
          <div className="rally-stage-light rally-stage-light-one" />
          <div className="rally-stage-light rally-stage-light-two" />
          <div className="rally-stage-stands" />
          <div className="rally-stage-ramp rally-stage-ramp-one" />
          <div className="rally-stage-ramp rally-stage-ramp-two" />
        </>
      ) : (
        <>
          <div className="journey-sun" />
          <div className="journey-ridge journey-ridge-back" />
          <div className="journey-ridge journey-ridge-front" />
        </>
      )}
      <div className="journey-path" />

      {Array.from({ length: total }).map((_, index) => {
        const stepProgress = total === 1 ? 1 : index / (total - 1);
        const completed = index < current;

        return (
          <span
            aria-hidden="true"
            className="journey-step"
            data-completed={completed}
            key={index}
            style={{ left: `${10 + stepProgress * 72}%` }}
          >
            <i>{completed ? (isRally ? '✓' : '★') : ''}</i>
          </span>
        );
      })}

      {isRally ? (
        <MonsterTruckCharacter progress={progress} feedback={feedback} />
      ) : (
        <PeterCharacter progress={progress} feedback={feedback} />
      )}

      {isRally ? (
        <div className="goal-trophy">
          <span className="checkered-flag" aria-hidden="true">▦</span>
          <RallyTrophySVG />
        </div>
      ) : (
        <div className="goal-egg">
          <span className="goal-spark goal-spark-one">✦</span>
          <span className="goal-spark goal-spark-two">✦</span>
          <GoalEggSVG />
        </div>
      )}
    </section>
  );
}
