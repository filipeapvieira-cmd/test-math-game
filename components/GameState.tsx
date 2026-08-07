'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useReducer, useState } from 'react';
import AnswerButtons from './AnswerButtons';
import EducationalPopup from './EducationalPopup';
import GameSettingsPanel from './GameSettingsPanel';
import LevelBackground from './LevelBackground';
import LevelProgress from './LevelProgress';
import MathProblem from './MathProblem';
import ProgressBar from './ProgressBar';
import {
  createProblem,
  DEFAULT_SETTINGS,
  DIFFICULTY_LABELS,
  type GameSettings,
  parseGameSettings,
  OPERATION_LABELS,
  type Problem,
} from './gameEngine';

const CelebrationScreen = dynamic(() => import('./CelebrationScreen'), { ssr: false });
const PREFERENCES_KEY = 'peter-number-quest-preferences-v1';

type GameStatus = 'loading' | 'answering' | 'correct' | 'incorrect' | 'complete';

interface State {
  settings: GameSettings;
  problem: Problem | null;
  status: GameStatus;
  score: number;
  selectedAnswer: number | null;
  attemptsOnProblem: number;
  totalAttempts: number;
  streak: number;
  bestStreak: number;
  recentProblemIds: string[];
}

type Action =
  | { type: 'START'; settings: GameSettings; problem: Problem }
  | { type: 'ANSWER'; answer: number; correct: boolean }
  | { type: 'RETRY' }
  | { type: 'NEXT'; problem: Problem }
  | { type: 'COMPLETE' }
  | { type: 'SET_SOUND'; enabled: boolean };

const initialState: State = {
  settings: DEFAULT_SETTINGS,
  problem: null,
  status: 'loading',
  score: 0,
  selectedAnswer: null,
  attemptsOnProblem: 0,
  totalAttempts: 0,
  streak: 0,
  bestStreak: 0,
  recentProblemIds: [],
};

function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return {
        ...initialState,
        settings: action.settings,
        problem: action.problem,
        status: 'answering',
        recentProblemIds: [action.problem.id],
      };
    case 'ANSWER': {
      const streak = action.correct ? state.streak + 1 : 0;
      return {
        ...state,
        status: action.correct ? 'correct' : 'incorrect',
        selectedAnswer: action.answer,
        attemptsOnProblem: state.attemptsOnProblem + 1,
        totalAttempts: state.totalAttempts + 1,
        score: action.correct ? state.score + 1 : state.score,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
      };
    }
    case 'RETRY':
      return { ...state, status: 'answering', selectedAnswer: null };
    case 'NEXT':
      return {
        ...state,
        problem: action.problem,
        status: 'answering',
        selectedAnswer: null,
        attemptsOnProblem: 0,
        recentProblemIds: [...state.recentProblemIds.slice(-4), action.problem.id],
      };
    case 'COMPLETE':
      return { ...state, status: 'complete', selectedAnswer: null };
    case 'SET_SOUND':
      return { ...state, settings: { ...state.settings, soundEnabled: action.enabled } };
    default:
      return state;
  }
}

function playFeedbackSound(correct: boolean, enabled: boolean, theme: GameSettings['theme']) {
  if (!enabled || typeof window === 'undefined') return;

  const AudioContextClass = window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = theme === 'rally' ? 'triangle' : correct ? 'sine' : 'triangle';
  const startFrequency = theme === 'rally' ? (correct ? 145 : 125) : (correct ? 520 : 220);
  const endFrequency = theme === 'rally' ? (correct ? 280 : 92) : (correct ? 780 : 180);
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.25);
  oscillator.addEventListener('ended', () => void context.close(), { once: true });
}

export default function GameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [explanationProblem, setExplanationProblem] = useState<Problem | null>(null);

  const startGame = useCallback((settings: GameSettings) => {
    dispatch({ type: 'START', settings, problem: createProblem(settings) });
  }, []);

  useEffect(() => {
    let settings = DEFAULT_SETTINGS;

    try {
      const saved = JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) ?? 'null') as unknown;
      settings = parseGameSettings(saved) ?? DEFAULT_SETTINGS;
    } catch {
      // A malformed preference should never prevent the game from starting.
    }

    startGame(settings);
  }, [startGame]);

  useEffect(() => {
    if (state.status === 'loading') return;
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state.settings));
  }, [state.settings, state.status]);

  useEffect(() => {
    if (state.status === 'correct') {
      const nextTimer = window.setTimeout(() => {
        if (state.score >= state.settings.questionsToWin) {
          dispatch({ type: 'COMPLETE' });
          return;
        }

        dispatch({
          type: 'NEXT',
          problem: createProblem(state.settings, state.recentProblemIds),
        });
      }, 1050);

      return () => window.clearTimeout(nextTimer);
    }
  }, [state.recentProblemIds, state.score, state.settings, state.status]);

  const handleAnswer = (answer: number) => {
    if (state.status !== 'answering' || !state.problem) return;
    const correct = answer === state.problem.answer;
    playFeedbackSound(correct, state.settings.soundEnabled, state.settings.theme);
    dispatch({ type: 'ANSWER', answer, correct });
    if (!correct) setExplanationProblem(state.problem);
  };

  const handleApplySettings = (settings: GameSettings) => {
    setExplanationProblem(null);
    startGame(settings);
    setSettingsOpen(false);
  };

  const handlePlayAgain = () => {
    setExplanationProblem(null);
    startGame(state.settings);
  };
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const closeExplanation = useCallback(() => {
    setExplanationProblem(null);
    dispatch({ type: 'RETRY' });
  }, []);

  if (!state.problem) {
    return (
      <main className="game-shell game-loading" data-theme={state.settings.theme}>
        <LevelBackground theme={state.settings.theme} />
        <div className="loading-bubble" role="status">Preparing the challenge…</div>
      </main>
    );
  }

  if (state.status === 'complete') {
    return (
      <>
        <CelebrationScreen
          theme={state.settings.theme}
          totalQuestions={state.settings.questionsToWin}
          totalAttempts={state.totalAttempts}
          bestStreak={state.bestStreak}
          onPlayAgain={handlePlayAgain}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        {settingsOpen ? (
          <GameSettingsPanel settings={state.settings} onApply={handleApplySettings} onClose={closeSettings} />
        ) : null}
      </>
    );
  }

  const feedback = state.status === 'correct' || state.status === 'incorrect'
    ? state.status
    : 'answering';
  const isRally = state.settings.theme === 'rally';
  const feedbackMessage = state.status === 'correct'
    ? state.streak >= 3
      ? isRally ? `${state.streak} clean checkpoints in a row!` : `Amazing! ${state.streak} in a row!`
      : isRally ? 'Clean jump! The truck charges ahead.' : 'Great thinking! Peter moves ahead!'
    : state.status === 'incorrect'
      ? isRally ? 'Check your line and try the clue.' : 'Almost! Here comes a clue.'
      : '';

  return (
    <main className="game-shell" data-theme={state.settings.theme}>
      <LevelBackground theme={state.settings.theme} />

      <div className="game-frame">
        <header className="game-header">
          <div className="game-brand">
            <span className="brand-badge" aria-hidden="true">{isRally ? '7' : 'P'}</span>
            <div>
              <p>{isRally ? 'Monster' : "Peter's"}</p>
              <h1>{isRally ? 'Number Rally' : 'Number Quest'}</h1>
            </div>
          </div>

          <LevelProgress
            current={state.score}
            total={state.settings.questionsToWin}
            streak={state.streak}
            theme={state.settings.theme}
          />

          <div className="game-controls">
            <button
              aria-label={state.settings.soundEnabled ? 'Turn sound off' : 'Turn sound on'}
              aria-pressed={state.settings.soundEnabled}
              className="icon-button"
              type="button"
              onClick={() => dispatch({ type: 'SET_SOUND', enabled: !state.settings.soundEnabled })}
            >
              <span aria-hidden="true">{state.settings.soundEnabled ? '♪' : '×'}</span>
            </button>
            <button
              aria-label="Open game settings"
              className="icon-button"
              type="button"
              onClick={() => setSettingsOpen(true)}
            >
              <span aria-hidden="true">⚙</span>
            </button>
          </div>
        </header>

        <ProgressBar
          current={state.score}
          total={state.settings.questionsToWin}
          feedback={feedback}
          theme={state.settings.theme}
        />

        <section className="game-content">
          <div className="question-column">
            <div className="mode-label">
              {OPERATION_LABELS[state.settings.operation]} · {DIFFICULTY_LABELS[state.settings.difficulty]}
            </div>
            <MathProblem
              left={state.problem.left}
              right={state.problem.right}
              symbol={state.problem.symbol}
              hint={state.problem.hint}
              showHint={state.attemptsOnProblem > 0 && state.status === 'answering'}
            />
            <div className="feedback-message" data-kind={feedback} aria-live="polite" role="status">
              {feedbackMessage}
            </div>
          </div>

          <AnswerButtons
            answers={state.problem.choices}
            correctAnswer={state.problem.answer}
            selectedAnswer={state.selectedAnswer}
            onAnswer={handleAnswer}
            feedback={feedback}
          />
        </section>
      </div>

      {settingsOpen ? (
        <GameSettingsPanel settings={state.settings} onApply={handleApplySettings} onClose={closeSettings} />
      ) : null}
      {explanationProblem ? (
        <EducationalPopup
          key={explanationProblem.id}
          problem={explanationProblem}
          theme={state.settings.theme}
          onClose={closeExplanation}
        />
      ) : null}
    </main>
  );
}
