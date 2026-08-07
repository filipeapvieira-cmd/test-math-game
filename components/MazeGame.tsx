'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import AnswerButtons from './AnswerButtons';
import EducationalPopup from './EducationalPopup';
import FootballCupSVG from './FootballCupSVG';
import FootballPlayerSVG from './FootballPlayerSVG';
import GameSettingsPanel from './GameSettingsPanel';
import GoalEggSVG from './GoalEggSVG';
import JudoBeltSVG from './JudoBeltSVG';
import JudoKidSVG from './JudoKidSVG';
import MathProblem from './MathProblem';
import MonsterTruckSVG from './MonsterTruckSVG';
import PeterTRexSVG from './PeterTRexSVG';
import RallyTrophySVG from './RallyTrophySVG';
import {
  createProblem,
  DEFAULT_SETTINGS,
  DIFFICULTY_LABELS,
  OPERATION_LABELS,
  parseGameSettings,
  type GameSettings,
  type GameTheme,
  type Problem,
} from './gameEngine';

const PREFERENCES_KEY = 'peter-number-quest-preferences-v1';
const MAZE = [
  '###############',
  '#S....#.......#',
  '#####.#.#####.#',
  '#.....#.....#.#',
  '#.#########.#.#',
  '#.....#.....#.#',
  '#.###.#.#####.#',
  '#...#.#.......#',
  '###.#.#######.#',
  '#...#.........#',
  '#.###########.#',
  '#............G#',
  '###############',
] as const;

const START = { row: 1, column: 1 };
const GATES = [
  { row: 1, column: 4 },
  { row: 4, column: 1 },
  { row: 8, column: 5 },
  { row: 10, column: 13 },
] as const;
const TOTAL_SPARKS = MAZE.reduce((total, row) => total + [...row].filter((cell) => cell === '.').length, 0);
const THEMES: GameTheme[] = ['dino', 'rally', 'judo', 'football'];

const HEROES = {
  dino: <PeterTRexSVG />,
  rally: <MonsterTruckSVG />,
  judo: <JudoKidSVG />,
  football: <FootballPlayerSVG />,
};

const GOALS = {
  dino: <GoalEggSVG />,
  rally: <RallyTrophySVG />,
  judo: <JudoBeltSVG />,
  football: <FootballCupSVG />,
};

const THEME_SHORT_NAMES: Record<GameTheme, string> = {
  dino: 'Peter',
  rally: 'Truck 7',
  judo: 'Judo Kid',
  football: 'Number 10',
};

type Direction = 'up' | 'down' | 'left' | 'right';
type ChallengeStatus = 'answering' | 'correct' | 'incorrect';

interface Position {
  row: number;
  column: number;
}

interface GateChallenge extends Position {
  index: number;
  problem: Problem;
  selectedAnswer: number | null;
  status: ChallengeStatus;
  attempts: number;
}

interface MazeGameProps {
  onExit: () => void;
}

const MOVE_DELTAS: Record<Direction, Position> = {
  up: { row: -1, column: 0 },
  down: { row: 1, column: 0 },
  left: { row: 0, column: -1 },
  right: { row: 0, column: 1 },
};

function positionKey(row: number, column: number) {
  return `${row}:${column}`;
}

function createStartingSparks() {
  return new Set<string>();
}

export default function MazeGame({ onExit }: MazeGameProps) {
  const reduceMotion = useReducedMotion();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [player, setPlayer] = useState<Position>(START);
  const [direction, setDirection] = useState<Direction>('right');
  const [collectedSparks, setCollectedSparks] = useState<Set<string>>(createStartingSparks);
  const [unlockedGates, setUnlockedGates] = useState<Set<number>>(() => new Set());
  const [challenge, setChallenge] = useState<GateChallenge | null>(null);
  const [explanation, setExplanation] = useState<Problem | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [announcement, setAnnouncement] = useState('Use the arrow keys or direction pad to move.');
  const recentProblemIds = useRef<string[]>([]);

  useEffect(() => {
    let restoreTimer: number | undefined;
    try {
      const saved = JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) ?? 'null') as unknown;
      const parsed = parseGameSettings(saved);
      if (parsed) restoreTimer = window.setTimeout(() => setSettings(parsed), 0);
    } catch {
      // Keep the default adventure if saved preferences are malformed.
    }

    return () => {
      if (restoreTimer) window.clearTimeout(restoreTimer);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(settings));
  }, [settings]);

  const resetMaze = useCallback(() => {
    setPlayer(START);
    setDirection('right');
    setCollectedSparks(createStartingSparks());
    setUnlockedGates(new Set());
    setChallenge(null);
    setExplanation(null);
    setComplete(false);
    setMoves(0);
    setAnnouncement('Fresh maze! Find the glowing treasure.');
    recentProblemIds.current = [];
  }, []);

  const finishMove = useCallback((row: number, column: number) => {
    setPlayer({ row, column });
    setMoves((current) => current + 1);
    const cell = MAZE[row]?.[column];

    if (cell === '.') {
      setCollectedSparks((current) => {
        const key = positionKey(row, column);
        if (current.has(key)) return current;
        const next = new Set(current);
        next.add(key);
        return next;
      });
    }

    if (cell === 'G') {
      setComplete(true);
      setAnnouncement('Maze complete! You found the treasure!');
    }
  }, []);

  const movePlayer = useCallback((nextDirection: Direction) => {
    setDirection(nextDirection);
    if (challenge || explanation || complete || settingsOpen) return;

    const delta = MOVE_DELTAS[nextDirection];
    const nextRow = player.row + delta.row;
    const nextColumn = player.column + delta.column;
    const cell = MAZE[nextRow]?.[nextColumn];

    if (!cell || cell === '#') {
      setAnnouncement('Bonk! That is a wall — try another way.');
      return;
    }

    const gateIndex = GATES.findIndex((gate) => gate.row === nextRow && gate.column === nextColumn);
    if (gateIndex >= 0 && !unlockedGates.has(gateIndex)) {
      const problem = createProblem(settings, recentProblemIds.current);
      recentProblemIds.current = [...recentProblemIds.current.slice(-4), problem.id];
      setChallenge({
        row: nextRow,
        column: nextColumn,
        index: gateIndex,
        problem,
        selectedAnswer: null,
        status: 'answering',
        attempts: 0,
      });
      setAnnouncement(`Number gate ${gateIndex + 1}! Solve it to pass.`);
      return;
    }

    finishMove(nextRow, nextColumn);
  }, [challenge, complete, explanation, finishMove, player, settings, settingsOpen, unlockedGates]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyDirections: Record<string, Direction | undefined> = {
        ArrowUp: 'up', w: 'up', W: 'up',
        ArrowDown: 'down', s: 'down', S: 'down',
        ArrowLeft: 'left', a: 'left', A: 'left',
        ArrowRight: 'right', d: 'right', D: 'right',
      };
      const nextDirection = keyDirections[event.key];
      if (!nextDirection) return;
      event.preventDefault();
      movePlayer(nextDirection);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  useEffect(() => {
    if (challenge?.status !== 'correct') return;

    const timer = window.setTimeout(() => {
      setUnlockedGates((current) => new Set(current).add(challenge.index));
      finishMove(challenge.row, challenge.column);
      setChallenge(null);
      setAnnouncement('Gate unlocked! Keep exploring.');
    }, reduceMotion ? 200 : 850);

    return () => window.clearTimeout(timer);
  }, [challenge, finishMove, reduceMotion]);

  const answerChallenge = (answer: number) => {
    if (!challenge || challenge.status !== 'answering') return;
    const correct = answer === challenge.problem.answer;
    setChallenge((current) => current ? {
      ...current,
      selectedAnswer: answer,
      status: correct ? 'correct' : 'incorrect',
      attempts: current.attempts + 1,
    } : null);

    if (!correct) {
      setAnnouncement('Not quite. Watch the clue, then try the same gate again.');
      setExplanation(challenge.problem);
    }
  };

  const closeExplanation = useCallback(() => {
    setExplanation(null);
    setChallenge((current) => current ? { ...current, status: 'answering', selectedAnswer: null } : null);
  }, []);

  const applySettings = (nextSettings: GameSettings) => {
    setSettings(nextSettings);
    setSettingsOpen(false);
    resetMaze();
  };

  const chooseTheme = (theme: GameTheme) => {
    setSettings((current) => ({ ...current, theme }));
    resetMaze();
  };

  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const gateProgress = unlockedGates.size;

  return (
    <main className="maze-shell" data-theme={settings.theme}>
      <div className="maze-ambient" aria-hidden="true"><i /><i /><i /></div>

      <div className="maze-layout">
        <header className="maze-header">
          <div className="maze-title-group">
            <button className="maze-back-button" type="button" onClick={onExit} aria-label="Choose another game">←</button>
            <div>
              <p>Mathiverse</p>
              <h1>Maze Mission</h1>
            </div>
          </div>

          <div className="maze-stats" aria-label="Maze progress">
            <span><i aria-hidden="true">◆</i><b>{collectedSparks.size}</b><small>/ {TOTAL_SPARKS} sparks</small></span>
            <span><i aria-hidden="true">🔓</i><b>{gateProgress}</b><small>/ {GATES.length} gates</small></span>
          </div>

          <button className="maze-settings-button" type="button" onClick={() => setSettingsOpen(true)}>
            <span aria-hidden="true">⚙</span> Game settings
          </button>
        </header>

        <section className="hero-picker" aria-label="Choose your maze hero">
          <div className="hero-picker-copy">
            <span>Choose your explorer</span>
            <small>{OPERATION_LABELS[settings.operation]} · {DIFFICULTY_LABELS[settings.difficulty]}</small>
          </div>
          <div className="hero-picker-options">
            {THEMES.map((theme) => (
              <button
                aria-label={`Play as ${THEME_SHORT_NAMES[theme]}`}
                aria-pressed={settings.theme === theme}
                data-selected={settings.theme === theme}
                key={theme}
                type="button"
                onClick={() => chooseTheme(theme)}
              >
                <span aria-hidden="true">{HEROES[theme]}</span>
                <b>{THEME_SHORT_NAMES[theme]}</b>
              </button>
            ))}
          </div>
        </section>

        <div className="maze-play-area">
          <section className="maze-board-wrap">
            <div
              className="maze-board"
              role="application"
              aria-label={`Maze board. ${gateProgress} of ${GATES.length} number gates unlocked.`}
              style={{ '--maze-columns': MAZE[0].length, '--maze-rows': MAZE.length } as CSSProperties}
            >
              {MAZE.flatMap((row, rowIndex) => [...row].map((cell, columnIndex) => {
                const gateIndex = GATES.findIndex((gate) => gate.row === rowIndex && gate.column === columnIndex);
                const sparkCollected = collectedSparks.has(positionKey(rowIndex, columnIndex));
                const isPlayer = player.row === rowIndex && player.column === columnIndex;

                return (
                  <div
                    className="maze-cell"
                    data-cell={cell === '#' ? 'wall' : cell === 'G' ? 'goal' : 'path'}
                    key={`${rowIndex}-${columnIndex}`}
                  >
                    {cell === '.' && !sparkCollected ? <span className="maze-spark" aria-hidden="true" /> : null}
                    {gateIndex >= 0 ? (
                      <span className="number-gate" data-open={unlockedGates.has(gateIndex)} aria-hidden="true">
                        {unlockedGates.has(gateIndex) ? '✓' : '?'}
                      </span>
                    ) : null}
                    {cell === 'G' ? <span className="maze-goal" aria-hidden="true">{GOALS[settings.theme]}</span> : null}
                    {isPlayer ? (
                      <motion.span
                        className="maze-player"
                        data-direction={direction}
                        layout
                        transition={{ type: 'spring', stiffness: 560, damping: 34 }}
                      >
                        {HEROES[settings.theme]}
                      </motion.span>
                    ) : null}
                  </div>
                );
              }))}
            </div>
            <div className="maze-announcement" role="status" aria-live="polite">
              <span aria-hidden="true">✦</span>{announcement}
            </div>
          </section>

          <aside className="maze-side-panel">
            <div className="maze-mission-card">
              <p>Mission</p>
              <h2>Reach the treasure!</h2>
              <ol>
                <li data-done={true}><span>1</span>Move through the paths</li>
                <li data-done={gateProgress === GATES.length}><span>{gateProgress === GATES.length ? '✓' : '2'}</span>Unlock all 4 number gates</li>
                <li data-done={complete}><span>{complete ? '✓' : '3'}</span>Find the glowing goal</li>
              </ol>
            </div>

            <div className="d-pad" aria-label="Movement controls">
              <button className="d-pad-up" type="button" aria-label="Move up" onClick={() => movePlayer('up')}>▲</button>
              <button className="d-pad-left" type="button" aria-label="Move left" onClick={() => movePlayer('left')}>◀</button>
              <span aria-hidden="true">✦</span>
              <button className="d-pad-right" type="button" aria-label="Move right" onClick={() => movePlayer('right')}>▶</button>
              <button className="d-pad-down" type="button" aria-label="Move down" onClick={() => movePlayer('down')}>▼</button>
            </div>
            <p className="keyboard-tip"><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> or WASD</p>
          </aside>
        </div>
      </div>

      {challenge ? (
        <div className="maze-question-backdrop">
          <section className="maze-question-dialog" role="dialog" aria-modal="true" aria-labelledby="maze-question-title">
            <button className="maze-question-close" aria-label="Close number gate" type="button" onClick={() => setChallenge(null)}>×</button>
            <p className="eyebrow">Number gate {challenge.index + 1} of {GATES.length}</p>
            <h2 id="maze-question-title">Solve it to unlock the path!</h2>
            <div className="maze-question-content">
              <MathProblem
                left={challenge.problem.left}
                right={challenge.problem.right}
                symbol={challenge.problem.symbol}
                hint={challenge.problem.hint}
                showHint={challenge.attempts > 0 && challenge.status === 'answering'}
              />
              <AnswerButtons
                answers={challenge.problem.choices}
                correctAnswer={challenge.problem.answer}
                selectedAnswer={challenge.selectedAnswer}
                feedback={challenge.status}
                onAnswer={answerChallenge}
              />
            </div>
            <p className="maze-question-feedback" data-status={challenge.status} aria-live="polite">
              {challenge.status === 'correct' ? 'Brilliant! The gate is opening…' : 'Choose the answer to power up this gate.'}
            </p>
          </section>
        </div>
      ) : null}

      {explanation ? (
        <EducationalPopup key={explanation.id} problem={explanation} theme={settings.theme} onClose={closeExplanation} />
      ) : null}

      {settingsOpen ? (
        <GameSettingsPanel settings={settings} onApply={applySettings} onClose={closeSettings} />
      ) : null}

      {complete ? (
        <div className="maze-complete-backdrop">
          <motion.section
            className="maze-complete-card"
            role="dialog"
            aria-modal="true"
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.86, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <div className="maze-complete-stars" aria-hidden="true">✦ ★ ✦</div>
            <p className="eyebrow">Maze mastered</p>
            <h2>You found the treasure!</h2>
            <div className="maze-complete-art" aria-hidden="true">
              <span>{HEROES[settings.theme]}</span><b>{GOALS[settings.theme]}</b>
            </div>
            <div className="maze-complete-stats">
              <span><b>{GATES.length}</b> gates unlocked</span>
              <span><b>{collectedSparks.size}</b> sparks found</span>
              <span><b>{moves}</b> clever moves</span>
            </div>
            <div className="celebration-actions">
              <button className="primary-button" type="button" onClick={resetMaze}>Play again</button>
              <button className="secondary-button" type="button" onClick={onExit}>Choose game</button>
            </div>
          </motion.section>
        </div>
      ) : null}
    </main>
  );
}
