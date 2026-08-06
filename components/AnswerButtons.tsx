'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface AnswerButtonsProps {
  answers: number[];
  correctAnswer: number;
  selectedAnswer: number | null;
  onAnswer: (answer: number) => void;
  feedback: 'answering' | 'correct' | 'incorrect';
}

export default function AnswerButtons({
  answers,
  correctAnswer,
  selectedAnswer,
  onAnswer,
  feedback,
}: AnswerButtonsProps) {
  const reduceMotion = useReducedMotion();
  const disabled = feedback !== 'answering';

  return (
    <div className="answer-grid" aria-label="Answer choices" role="group">
      {answers.map((answer) => {
        const isSelected = selectedAnswer === answer;
        const isCorrectSelection = feedback === 'correct' && isSelected && answer === correctAnswer;
        const isWrongSelection = feedback === 'incorrect' && isSelected;

        return (
          <motion.button
            aria-label={`Answer ${answer}`}
            className="answer-button"
            data-state={isCorrectSelection ? 'correct' : isWrongSelection ? 'incorrect' : 'idle'}
            disabled={disabled}
            key={answer}
            type="button"
            onClick={() => onAnswer(answer)}
            whileTap={reduceMotion || disabled ? undefined : { scale: 0.94 }}
            animate={
              reduceMotion
                ? undefined
                : isCorrectSelection
                  ? { scale: [1, 1.08, 1] }
                  : isWrongSelection
                    ? { x: [0, -7, 7, -5, 5, 0] }
                    : undefined
            }
            transition={{ duration: isWrongSelection ? 0.4 : 0.5 }}
          >
            <span className="answer-number">{answer}</span>
            <span className="answer-result" aria-hidden="true">
              {isCorrectSelection ? '✓' : isWrongSelection ? '×' : ''}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
