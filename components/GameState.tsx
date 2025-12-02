'use client';

import { useState, useEffect } from 'react';
import PeterCharacter from './PeterCharacter';
import MathProblem from './MathProblem';
import AnswerButtons from './AnswerButtons';
import LevelProgress from './LevelProgress';
import CelebrationScreen from './CelebrationScreen';
import LevelBackground from './LevelBackground';

const GAME_CONFIG = {
  minNumber: 1,
  maxNumber: 10,
  questionsToWin: 10,
};

interface Problem {
  num1: number;
  num2: number;
  answer: number;
  choices: number[]; // Store choices here to prevent reshuffling
}

export default function GameState() {
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'won'>('playing');
  const [isCorrect, setIsCorrect] = useState(false); // For Peter animation

  // Initialize first problem on mount
  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, []);

  function generateProblem(): Problem {
    const num1 = Math.floor(Math.random() * GAME_CONFIG.maxNumber) + GAME_CONFIG.minNumber;
    const num2 = Math.floor(Math.random() * GAME_CONFIG.maxNumber) + GAME_CONFIG.minNumber;
    const answer = num1 + num2;
    
    // Generate choices
    const wrong: number[] = [];
    const possibleOffsets = [-3, -2, -1, 1, 2, 3, 4, 5];
    while (wrong.length < 3) {
      const offset = possibleOffsets[Math.floor(Math.random() * possibleOffsets.length)];
      const val = answer + offset;
      if (val > 0 && val !== answer && !wrong.includes(val) && val <= 20) {
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

    if (correct) {
      // Play sound?
    } else {
      // Play wrong sound?
    }
  };

  const handleContinue = () => {
    if (!currentProblem) return;

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= GAME_CONFIG.questionsToWin) {
        setGameState('won');
      } else {
        setCurrentProblem(generateProblem());
        setGameState('playing');
        setSelectedAnswer(null);
        setIsCorrect(false);
      }
    } else {
      // Wrong answer - just reset to playing state for same problem? 
      // Or generate new one? User usually retries same problem in educational games.
      // But user asked "Wait for user click to proceed".
      // Let's reset the selection and let them try again.
      setGameState('playing');
      setSelectedAnswer(null);
      setIsCorrect(false);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentProblem(generateProblem());
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

      {/* Game Container - Centered and Scaled */}
      <div className="relative z-10 w-full max-w-4xl h-full max-h-[800px] flex flex-col p-4 transition-all duration-300">
        
        {/* Top HUD */}
        <div className="flex-none">
          <LevelProgress current={score} total={GAME_CONFIG.questionsToWin} />
        </div>

        {/* Main Stage */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
          
          {/* Character */}
          <div className="flex-none h-32 flex items-end justify-center">
             <PeterCharacter 
              progress={0} 
              isCorrect={isCorrect && gameState === 'feedback'} 
              isWaiting={gameState === 'playing'} 
            />
          </div>

          {/* Math Problem */}
          <div className="flex-none">
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

            {/* Continue Button */}
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
  );
}
