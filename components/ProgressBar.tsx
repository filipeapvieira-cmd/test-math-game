'use client';

import GoalEggSVG from './GoalEggSVG';
import FootballCharacter from './FootballCharacter';
import FootballCupSVG from './FootballCupSVG';
import JudoBeltSVG from './JudoBeltSVG';
import JudoCharacter from './JudoCharacter';
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
  const isJudo = theme === 'judo';
  const isFootball = theme === 'football';
  const journeyLabel = {
    dino: `Journey progress: ${current} of ${total} questions complete`,
    rally: `Rally progress: ${current} of ${total} checkpoints complete`,
    judo: `Judo journey: ${current} of ${total} techniques complete`,
    football: `Football match: ${current} of ${total} goals complete`,
  }[theme];

  return (
    <section
      aria-label={journeyLabel}
      className={`journey journey-${theme}`}
    >
      {isRally ? (
        <>
          <div className="rally-stage-light rally-stage-light-one" />
          <div className="rally-stage-light rally-stage-light-two" />
          <div className="rally-stage-stands" />
          <div className="rally-stage-ramp rally-stage-ramp-one" />
          <div className="rally-stage-ramp rally-stage-ramp-two" />
        </>
      ) : isJudo ? (
        <>
          <div className="judo-stage-sun" />
          <div className="judo-stage-panel judo-stage-panel-one" />
          <div className="judo-stage-panel judo-stage-panel-two" />
          <div className="judo-stage-banner">精力善用</div>
          <div className="judo-stage-tatami" />
        </>
      ) : isFootball ? (
        <>
          <div className="football-stage-light football-stage-light-one" />
          <div className="football-stage-light football-stage-light-two" />
          <div className="football-stage-crowd" />
          <div className="football-stage-pitch" />
          <div className="football-stage-goal"><span /><span /><span /></div>
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
            <i>{completed ? (isRally ? '✓' : isJudo ? '礼' : isFootball ? '⚽' : '★') : ''}</i>
          </span>
        );
      })}

      {isRally ? (
        <MonsterTruckCharacter progress={progress} feedback={feedback} />
      ) : isJudo ? (
        <JudoCharacter progress={progress} feedback={feedback} />
      ) : isFootball ? (
        <FootballCharacter progress={progress} feedback={feedback} />
      ) : (
        <PeterCharacter progress={progress} feedback={feedback} />
      )}

      {isRally ? (
        <div className="goal-trophy">
          <span className="checkered-flag" aria-hidden="true">▦</span>
          <RallyTrophySVG />
        </div>
      ) : isJudo ? (
        <div className="goal-judo-belt">
          <span className="goal-kanji" aria-hidden="true">道</span>
          <JudoBeltSVG />
        </div>
      ) : isFootball ? (
        <div className="goal-football-cup">
          <span className="goal-cup-glow" aria-hidden="true">✦</span>
          <FootballCupSVG />
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
