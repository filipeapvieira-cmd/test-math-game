'use client';

import { useState, useEffect } from 'react';
import MathProblem from './MathProblem';
import AnswerButtons from './AnswerButtons';
import LevelProgress from './LevelProgress';
import CelebrationScreen from './CelebrationScreen';
import LevelBackground from './LevelBackground';

const GAME_CONFIG = {
  questionsToWin: 10,
};

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  choices: number[];
}

export default function GameState() {
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'won'>('playing');
  const [isCorrect, setIsCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState<1 | 2>(1); // Level 1 or 2

  // Initialize first problem on mount
  useEffect(() => {
    setCurrentProblem(generateProblem(difficulty));
  }, [difficulty]); // Regenerate if difficulty changes

  function generateProblem(level: 1 | 2): Problem {
    let num1: number, num2: number, answer: number;

    if (level === 1) {
      // Level 1: Sums 0-10
      answer = Math.floor(Math.random() * 11); // 0 to 10
      num1 = Math.floor(Math.random() * (answer + 1)); // 0 to answer
      num2 = answer - num1;
    } else {
      // Level 2: Sums 10-20
      answer = Math.floor(Math.random() * 11) + 10; // 10 to 20
      num1 = Math.floor(Math.random() * (answer + 1));
      num2 = answer - num1;
    }
    
    // Generate choices
    const wrong: number[] = [];
    const possibleOffsets = [-3, -2, -1, 1, 2, 3, 4, 5];
    while (wrong.length < 3) {
      const offset = possibleOffsets[Math.floor(Math.random() * possibleOffsets.length)];
      const val = answer + offset;
      // Ensure positive and within reasonable range
      if (val >= 0 && val !== answer && !wrong.includes(val) && val <= 25) {
        wrong.push(val);
      }
    }
    const choices = [answer, ...wrong].sort(() => Math.random() - 0.5);

    return { num1, num2, answer, choices };
  }

  const handleAnswer = (answer: number) => {
    if (gameState !== 'playing' || !currentProblem) return;

    setSelectedAnswer(answer);
    setGameState('feedback');
    
    const correct = answer === currentProblem.answer;
    setIsCorrect(correct);
  };

  const handleContinue = () => {
    if (!currentProblem) return;

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= GAME_CONFIG.questionsToWin) {
        setGameState('won');
      } else {
        setCurrentProblem(generateProblem(difficulty));
        setGameState('playing');
        setSelectedAnswer(null);
        setIsCorrect(false);
      }
    } else {
      // Retry same problem
      setGameState('playing');
      setSelectedAnswer(null);
      setIsCorrect(false);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentProblem(generateProblem(difficulty));
    setGameState('playing');
    setSelectedAnswer(null);
    setIsCorrect(false);
  };

  const changeDifficulty = (level: 1 | 2) => {
    setDifficulty(level);
    setScore(0); // Reset score on level change? Yes, fair.
    setGameState('playing');
    setSelectedAnswer(null);
    setIsCorrect(false);
  };

  if (gameState === 'won') {
    return <CelebrationScreen onPlayAgain={resetGame} />;
  }

  if (!currentProblem) return null;

  return (
    <div className="h-screen w-screen relative overflow-hidden font-sans bg-[#5c94fc] flex items-center justify-center">
      <LevelBackground />

      {/* Game Container */}
      <div className="relative z-10 w-full max-w-4xl h-full max-h-[800px] flex flex-col p-4 transition-all duration-300">
        
        {/* Top HUD: Progress & Settings */}
        <div className="flex-none flex flex-col gap-4 mb-8">
          {/* Settings Bar */}
          <div className="flex justify-center gap-4">
            {/* Operation Selector */}
            <select 
              className="font-pixel text-sm border-2 border-black bg-white text-black px-2 py-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none cursor-pointer hover:bg-gray-50"
              defaultValue="addition"
            >
              <option value="addition">ADDITION (+)</option>
              <option value="subtraction" disabled>SUBTRACTION (-)</option>
              <option value="multiplication" disabled>MULTIPLICATION (×)</option>
            </select>

            {/* Difficulty Selector */}
            <select 
              value={difficulty}
              onChange={(e) => changeDifficulty(Number(e.target.value) as 1 | 2)}
              className="font-pixel text-sm border-2 border-black bg-white text-black px-2 py-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none cursor-pointer hover:bg-gray-50"
            >
              <option value={1}>LEVEL 1 (0-10)</option>
              <option value={2}>LEVEL 2 (10-20)</option>
            </select>
          </div>
          
          <LevelProgress current={score} total={GAME_CONFIG.questionsToWin} />
        </div>

        {/* Main Stage */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 min-h-0">
          
          {/* Math Problem (No Dino) */}
          <div className="flex-none scale-125">
            <MathProblem num1={currentProblem.num1} num2={currentProblem.num2} />
          </div>

          {/* Answer Area */}
          <div className="flex-none w-full flex flex-col items-center gap-6">
            <AnswerButtons
              answers={currentProblem.choices}
              correctAnswer={currentProblem.answer}
              selectedAnswer={selectedAnswer}
              onAnswer={handleAnswer}
              disabled={gameState !== 'playing'}
              showFeedback={gameState === 'feedback'}
            />

            {/* Fixed Height Container for Continue Button to prevent layout shift */}
            <div className="h-20 w-full flex items-center justify-center">
              {gameState === 'feedback' && (
                <button
                  onClick={handleContinue}
                  className="animate-bounce bg-white text-black font-pixel border-4 border-black px-8 py-4 text-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-transform"
                >
                  {isCorrect ? "NEXT LEVEL ➤" : "TRY AGAIN ↺"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
