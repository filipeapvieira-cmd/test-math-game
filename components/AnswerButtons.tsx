'use client';

import { motion } from 'framer-motion';

interface AnswerButtonsProps {
  answers: number[];
  correctAnswer: number;
  selectedAnswer: number | null;
  onAnswer: (answer: number) => void;
  disabled: boolean;
  showFeedback: boolean; // New prop to show correct/wrong state
}

export default function AnswerButtons({ 
  answers, 
  correctAnswer, 
  selectedAnswer, 
  onAnswer, 
  disabled,
  showFeedback 
}: AnswerButtonsProps) {

  const getBackgroundColor = (answer: number) => {
    if (!showFeedback) {
      // Normal state
      if (selectedAnswer === answer) return 'bg-[#fcd000] brightness-110'; // Selected highlight
      return 'bg-[#fcd000]';
    }

    // Feedback state
    if (answer === correctAnswer) return 'bg-[#00aa00]'; // Correct is always Green
    if (selectedAnswer === answer && answer !== correctAnswer) return 'bg-[#924a0b]'; // Wrong selection is Brown
    return 'bg-[#fcd000] opacity-50'; // Others dimmed
  };

  return (
    <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
      {answers.map((answer, index) => (
        <motion.button
          key={index}
          onClick={() => onAnswer(answer)}
          disabled={disabled}
          className={`
            relative overflow-hidden
            text-4xl font-bold font-pixel
            w-full aspect-square max-w-[140px] mx-auto
            flex items-center justify-center
            border-4 border-black
            shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
            transition-transform
            ${getBackgroundColor(answer)}
            ${(showFeedback && answer === correctAnswer) ? 'text-white' : 'text-black'}
          `}
          style={{
            backgroundImage: 'radial-gradient(#eac300 15%, transparent 16%)',
            backgroundSize: '10px 10px'
          }}
          whileHover={{ y: disabled ? 0 : -5 }}
          whileTap={{ y: disabled ? 0 : -5 }}
          animate={
            showFeedback && answer === correctAnswer
              ? { scale: [1, 1.1, 1] }
              : (showFeedback && selectedAnswer === answer && answer !== correctAnswer)
                ? { x: [-5, 5, -5, 5, 0] }
                : {}
          }
        >
          {/* Corner bolts */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-black opacity-20 rounded-full"></div>
          <div className="absolute top-1 right-1 w-2 h-2 bg-black opacity-20 rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-black opacity-20 rounded-full"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-black opacity-20 rounded-full"></div>

          <span className="text-5xl drop-shadow-md relative z-10">{answer}</span>
        </motion.button>
      ))}
    </div>
  );
}
