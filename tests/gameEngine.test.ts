import { describe, expect, it } from 'vitest';
import {
  createProblem,
  parseGameSettings,
  type Difficulty,
  type Operation,
} from '../components/gameEngine';

const operations: Operation[] = ['addition', 'subtraction', 'multiplication'];
const difficulties: Difficulty[] = [1, 2, 3];

describe('game engine', () => {
  it.each(operations)('generates valid %s problems and answer choices', (operation) => {
    difficulties.forEach((difficulty) => {
      for (let sample = 0; sample < 250; sample += 1) {
        const problem = createProblem({ operation, difficulty });

        expect(problem.answer).toBeGreaterThanOrEqual(0);
        expect(problem.choices).toHaveLength(4);
        expect(new Set(problem.choices).size).toBe(4);
        expect(problem.choices).toContain(problem.answer);
        expect(problem.choices.every((choice) => choice >= 0)).toBe(true);

        if (operation === 'addition') expect(problem.left + problem.right).toBe(problem.answer);
        if (operation === 'subtraction') expect(problem.left - problem.right).toBe(problem.answer);
        if (operation === 'multiplication') expect(problem.left * problem.right).toBe(problem.answer);
      }
    });
  });

  it('accepts only complete, supported saved settings', () => {
    expect(parseGameSettings({
      theme: 'football',
      operation: 'multiplication',
      difficulty: 3,
      questionsToWin: 15,
      soundEnabled: false,
    })).toEqual({
      theme: 'football',
      operation: 'multiplication',
      difficulty: 3,
      questionsToWin: 15,
      soundEnabled: false,
    });

    expect(parseGameSettings({ operation: 'division' })).toBeNull();
    expect(parseGameSettings({
      theme: 'dino',
      operation: 'addition',
      difficulty: 4,
      questionsToWin: 10,
      soundEnabled: true,
    })).toBeNull();
  });
});
