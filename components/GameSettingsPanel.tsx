'use client';

import { useState } from 'react';
import {
  DIFFICULTY_LABELS,
  GameSettings,
  OPERATION_LABELS,
  THEME_LABELS,
  type Difficulty,
  type GameTheme,
  type Operation,
  type SessionLength,
} from './gameEngine';
import MonsterTruckSVG from './MonsterTruckSVG';
import PeterTRexSVG from './PeterTRexSVG';
import JudoKidSVG from './JudoKidSVG';
import FootballPlayerSVG from './FootballPlayerSVG';
import { useModalDialog } from './useModalDialog';

interface GameSettingsPanelProps {
  settings: GameSettings;
  onApply: (settings: GameSettings) => void;
  onClose: () => void;
}

const operations: Operation[] = ['addition', 'subtraction', 'multiplication'];
const difficulties: Difficulty[] = [1, 2, 3];
const sessionLengths: SessionLength[] = [5, 10, 15];
const themes: GameTheme[] = ['dino', 'rally', 'judo', 'football'];

const themeArtwork: Record<GameTheme, React.ReactNode> = {
  dino: <PeterTRexSVG />,
  rally: <MonsterTruckSVG />,
  judo: <JudoKidSVG />,
  football: <FootballPlayerSVG />,
};

export default function GameSettingsPanel({ settings, onApply, onClose }: GameSettingsPanelProps) {
  const [draft, setDraft] = useState(settings);
  const dialogRef = useModalDialog<HTMLElement>({ onClose });

  return (
    <div className="settings-backdrop" role="presentation" onPointerDown={onClose}>
      <section
        aria-labelledby="settings-title"
        aria-modal="true"
        className="settings-panel"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="settings-heading">
          <div>
            <p className="eyebrow">Grown-up controls</p>
            <h2 id="settings-title">Choose an adventure</h2>
          </div>
          <button
            aria-label="Close settings"
            autoFocus
            className="icon-button icon-button-dark"
            type="button"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <fieldset className="settings-group theme-settings-group">
          <legend>Theme</legend>
          <div className="theme-options">
            {themes.map((theme) => (
              <button
                aria-pressed={draft.theme === theme}
                className="theme-option"
                data-selected={draft.theme === theme}
                data-theme-preview={theme}
                key={theme}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, theme }))}
              >
                <span className="theme-preview-art" aria-hidden="true">
                  {themeArtwork[theme]}
                </span>
                <span className="theme-preview-copy">
                  <strong>{THEME_LABELS[theme].name}</strong>
                  <small>{THEME_LABELS[theme].description}</small>
                </span>
                <span className="theme-check" aria-hidden="true">✓</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="settings-group">
          <legend>Maths</legend>
          <div className="settings-options settings-options-three">
            {operations.map((operation) => (
              <button
                className="settings-option"
                data-selected={draft.operation === operation}
                aria-pressed={draft.operation === operation}
                key={operation}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, operation }))}
              >
                <span className="settings-symbol" aria-hidden="true">
                  {operation === 'addition' ? '+' : operation === 'subtraction' ? '−' : '×'}
                </span>
                {OPERATION_LABELS[operation]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="settings-group">
          <legend>Challenge</legend>
          <div className="settings-options settings-options-three">
            {difficulties.map((difficulty) => (
              <button
                className="settings-option"
                data-selected={draft.difficulty === difficulty}
                aria-pressed={draft.difficulty === difficulty}
                key={difficulty}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, difficulty }))}
              >
                <span className="difficulty-stars" aria-hidden="true">{'★'.repeat(difficulty)}</span>
                {DIFFICULTY_LABELS[difficulty]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="settings-group">
          <legend>Journey length</legend>
          <div className="settings-options settings-options-three">
            {sessionLengths.map((questionsToWin) => (
              <button
                className="settings-option settings-option-compact"
                data-selected={draft.questionsToWin === questionsToWin}
                aria-pressed={draft.questionsToWin === questionsToWin}
                key={questionsToWin}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, questionsToWin }))}
              >
                <strong>{questionsToWin}</strong>
                questions
              </button>
            ))}
          </div>
        </fieldset>

        <button
          className="primary-button settings-apply"
          type="button"
          onClick={() => onApply(draft)}
        >
          Start this adventure
        </button>
        <p className="settings-note">Changing these options starts a fresh journey.</p>
      </section>
    </div>
  );
}
