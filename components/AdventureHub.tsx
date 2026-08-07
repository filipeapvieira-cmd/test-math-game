'use client';

import { useState } from 'react';
import GameState from './GameState';
import MazeGame from './MazeGame';
import PeterTRexSVG from './PeterTRexSVG';

type GameChoice = 'quest' | 'maze' | null;

export default function AdventureHub() {
  const [game, setGame] = useState<GameChoice>(null);

  if (game === 'quest') return <GameState onExit={() => setGame(null)} />;
  if (game === 'maze') return <MazeGame onExit={() => setGame(null)} />;

  return (
    <main className="game-lobby">
      <div className="lobby-orb lobby-orb-one" aria-hidden="true" />
      <div className="lobby-orb lobby-orb-two" aria-hidden="true" />

      <section className="lobby-content" aria-labelledby="lobby-title">
        <header className="lobby-header">
          <div className="lobby-logo" aria-hidden="true"><span>+</span><span>×</span></div>
          <div>
            <p className="lobby-eyebrow">Welcome to</p>
            <h1 id="lobby-title">Mathiverse</h1>
            <p className="lobby-subtitle">Pick a world. Power up your maths.</p>
          </div>
        </header>

        <div className="game-choice-grid">
          <button className="game-choice-card quest-choice" type="button" onClick={() => setGame('quest')}>
            <span className="choice-copy">
              <span className="choice-kicker">Classic adventure</span>
              <strong>Number Quest</strong>
              <small>Solve quick-fire questions and race your hero to the prize.</small>
              <span className="choice-action">Play Number Quest <b aria-hidden="true">→</b></span>
            </span>
            <span className="quest-choice-art" aria-hidden="true">
              <PeterTRexSVG />
              <i>?</i><i>7</i><i>+</i>
            </span>
          </button>

          <button className="game-choice-card maze-choice" type="button" onClick={() => setGame('maze')}>
            <span className="new-game-pill">New game</span>
            <span className="choice-copy">
              <span className="choice-kicker">Move · unlock · escape</span>
              <strong>Maze Mission</strong>
              <small>Explore twisting paths, munch number sparks, and solve gates to reach the treasure.</small>
              <span className="choice-action">Enter the maze <b aria-hidden="true">→</b></span>
            </span>
            <span className="maze-choice-art" aria-hidden="true">
              {Array.from({ length: 35 }).map((_, index) => (
                <i key={index} data-wall={[0,1,2,3,4,5,6,7,9,11,13,14,15,17,18,20,21,23,25,27,28,29,30,31,32,33,34].includes(index)} />
              ))}
              <b className="maze-mini-player"><PeterTRexSVG /></b>
              <em>★</em>
            </span>
          </button>
        </div>

        <p className="lobby-footnote"><span aria-hidden="true">★</span> Every game adapts to your chosen level and maths skill.</p>
      </section>
    </main>
  );
}
