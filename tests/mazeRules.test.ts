import { describe, expect, it } from 'vitest';
import {
  allGatesUnlocked,
  GATES,
  getGateIndex,
  isGoalCell,
  MAZE,
  START,
  TOTAL_SPARKS,
} from '../components/mazeRules';

describe('maze rules', () => {
  it('requires every configured number gate before the treasure can open', () => {
    const unlockedGates = new Set<number>();

    for (let index = 0; index < GATES.length; index += 1) {
      expect(allGatesUnlocked(unlockedGates)).toBe(false);
      unlockedGates.add(index);
    }

    expect(allGatesUnlocked(unlockedGates)).toBe(true);
    expect(allGatesUnlocked(new Set([0, 1, 2, 99]))).toBe(false);
  });

  it('keeps gate positions unique and on traversable cells', () => {
    const positions = GATES.map((gate) => `${gate.row}:${gate.column}`);

    expect(new Set(positions).size).toBe(GATES.length);
    GATES.forEach((gate, index) => {
      expect(MAZE[gate.row][gate.column]).toBe('.');
      expect(getGateIndex(gate.row, gate.column)).toBe(index);
    });
  });

  it('keeps every gate and the goal reachable in the configured maze', () => {
    const queue: Array<{ row: number; column: number }> = [START];
    const visited = new Set([`${START.row}:${START.column}`]);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;

      for (const [rowOffset, columnOffset] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const row = current.row + rowOffset;
        const column = current.column + columnOffset;
        const key = `${row}:${column}`;
        if (visited.has(key) || !MAZE[row]?.[column] || MAZE[row][column] === '#') continue;
        visited.add(key);
        queue.push({ row, column });
      }
    }

    GATES.forEach((gate) => expect(visited.has(`${gate.row}:${gate.column}`)).toBe(true));
    expect([...visited].some((key) => {
      const [row, column] = key.split(':').map(Number);
      return isGoalCell(row, column);
    })).toBe(true);
  });

  it('reports the spark total from the maze layout', () => {
    const sparkCount = MAZE.reduce(
      (total, row) => total + [...row].filter((cell) => cell === '.').length,
      0,
    );

    expect(TOTAL_SPARKS).toBe(sparkCount);
    expect(TOTAL_SPARKS).toBe(83);
  });
});
