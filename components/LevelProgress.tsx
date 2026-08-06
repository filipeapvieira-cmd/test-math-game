import type { GameTheme } from './gameEngine';

interface LevelProgressProps {
  current: number;
  total: number;
  streak: number;
  theme: GameTheme;
}

export default function LevelProgress({ current, total, streak, theme }: LevelProgressProps) {
  const isRally = theme === 'rally';

  return (
    <div className="progress-summary" aria-label={`${current} out of ${total} complete. Current streak: ${streak}`}>
      <div className="progress-score">
        <span aria-hidden="true">{isRally ? '◆' : '★'}</span>
        <strong>{current}</strong>
        <span className="progress-total">/ {total}</span>
      </div>
      <div className="progress-segments" aria-hidden="true">
        {Array.from({ length: total }).map((_, index) => (
          <span data-completed={index < current} key={index} />
        ))}
      </div>
      <div className="streak-pill" data-active={streak > 1}>
        <span aria-hidden="true">{isRally ? '⚡' : '🔥'}</span>
        {streak === 0 ? 'Ready!' : `${streak} streak`}
      </div>
    </div>
  );
}
