export const MAZE = [
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

export const START = { row: 1, column: 1 } as const;

export const GATES = [
  { row: 1, column: 4 },
  { row: 4, column: 1 },
  { row: 8, column: 5 },
  { row: 10, column: 13 },
] as const;

export const TOTAL_SPARKS = MAZE.reduce(
  (total, row) => total + [...row].filter((cell) => cell === '.').length,
  0,
);

const GATE_INDEX_BY_POSITION = new Map(
  GATES.map((gate, index) => [`${gate.row}:${gate.column}`, index]),
);

export function getGateIndex(row: number, column: number) {
  return GATE_INDEX_BY_POSITION.get(`${row}:${column}`) ?? -1;
}

export function allGatesUnlocked(unlockedGates: ReadonlySet<number>) {
  return GATES.every((_, index) => unlockedGates.has(index));
}

export function isGoalCell(row: number, column: number) {
  return MAZE[row]?.[column] === 'G';
}
