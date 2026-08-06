export type Operation = 'addition' | 'subtraction' | 'multiplication';
export type Difficulty = 1 | 2 | 3;
export type SessionLength = 5 | 10 | 15;
export type GameTheme = 'dino' | 'rally';

export interface GameSettings {
  theme: GameTheme;
  operation: Operation;
  difficulty: Difficulty;
  questionsToWin: SessionLength;
  soundEnabled: boolean;
}

export interface Problem {
  id: string;
  left: number;
  right: number;
  answer: number;
  choices: number[];
  operation: Operation;
  symbol: '+' | '−' | '×';
  hint: string;
}

export const DEFAULT_SETTINGS: GameSettings = {
  theme: 'dino',
  operation: 'addition',
  difficulty: 1,
  questionsToWin: 10,
  soundEnabled: true,
};

export const THEME_LABELS: Record<GameTheme, { name: string; description: string }> = {
  dino: {
    name: 'Dino Valley',
    description: 'Peter explores a bright prehistoric world.',
  },
  rally: {
    name: 'Monster Rally',
    description: 'A tougher night race through the stadium.',
  },
};

export const OPERATION_LABELS: Record<Operation, string> = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Times tables',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: 'Starter',
  2: 'Explorer',
  3: 'Champion',
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function createOperands(operation: Operation, difficulty: Difficulty) {
  if (operation === 'addition') {
    const ranges = {
      1: { min: 1, max: 10 },
      2: { min: 8, max: 20 },
      3: { min: 15, max: 50 },
    } as const;
    const range = ranges[difficulty];
    const answer = randomInt(range.min, range.max);
    const minimumOperand = difficulty === 1 ? 0 : 1;
    const left = randomInt(minimumOperand, answer - minimumOperand);

    return { left, right: answer - left, answer };
  }

  if (operation === 'subtraction') {
    const maximums = { 1: 10, 2: 20, 3: 50 } as const;
    const left = randomInt(difficulty === 1 ? 2 : 6, maximums[difficulty]);
    const right = randomInt(difficulty === 1 ? 0 : 1, left);

    return { left, right, answer: left - right };
  }

  const factorRanges = {
    1: { min: 0, max: 5 },
    2: { min: 1, max: 10 },
    3: { min: 2, max: 12 },
  } as const;
  const range = factorRanges[difficulty];
  const left = randomInt(range.min, range.max);
  const right = randomInt(range.min, range.max);

  return { left, right, answer: left * right };
}

function createChoices(
  answer: number,
  operation: Operation,
  difficulty: Difficulty,
  left: number,
  right: number,
) {
  const distractors = new Set<number>();
  const offsets = operation === 'multiplication'
    ? shuffle([
        left * Math.max(0, right - 1) - answer,
        left * (right + 1) - answer,
        Math.max(0, left - 1) * right - answer,
        (left + 1) * right - answer,
        -Math.max(1, left),
        Math.max(1, right),
        -1,
        1,
      ])
    : shuffle([
        -3,
        -2,
        -1,
        1,
        2,
        3,
        4,
        -4,
      ]);

  for (const offset of offsets) {
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer) distractors.add(candidate);
    if (distractors.size === 3) break;
  }

  while (distractors.size < 3) {
    const candidate = randomInt(0, Math.max(12, answer + 10));
    if (candidate !== answer) distractors.add(candidate);
  }

  return shuffle([answer, ...distractors]);
}

function createHint(operation: Operation, left: number, right: number) {
  if (operation === 'addition') {
    if (left === 0 || right === 0) return 'Adding 0 keeps the other number the same.';
    const start = Math.max(left, right);
    const steps = Math.min(left, right);
    return `Start at ${start}, then count ${steps} more.`;
  }

  if (operation === 'subtraction') {
    if (right === 0) return `Taking away 0 keeps ${left} the same.`;
    return `Start at ${left}, then count back ${right}.`;
  }

  if (left === 0 || right === 0) return 'Any number times 0 is 0.';
  if (left === 1) return `One group of ${right} is ${right}.`;
  if (right === 1) return `Multiplying by 1 keeps ${left} the same.`;
  return `Think of ${left} groups with ${right} in each group.`;
}

export function createProblem(
  settings: Pick<GameSettings, 'operation' | 'difficulty'>,
  recentProblemIds: string[] = [],
): Problem {
  let operands = createOperands(settings.operation, settings.difficulty);
  let id = `${settings.operation}:${operands.left}:${operands.right}`;
  let attempts = 0;

  while (recentProblemIds.includes(id) && attempts < 20) {
    operands = createOperands(settings.operation, settings.difficulty);
    id = `${settings.operation}:${operands.left}:${operands.right}`;
    attempts += 1;
  }

  const symbols = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
  } as const;

  return {
    id,
    ...operands,
    operation: settings.operation,
    symbol: symbols[settings.operation],
    choices: createChoices(
      operands.answer,
      settings.operation,
      settings.difficulty,
      operands.left,
      operands.right,
    ),
    hint: createHint(settings.operation, operands.left, operands.right),
  };
}

export function parseGameSettings(value: unknown): GameSettings | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<GameSettings>;
  const isValid = (
    ['addition', 'subtraction', 'multiplication'].includes(candidate.operation ?? '') &&
    [1, 2, 3].includes(candidate.difficulty ?? 0) &&
    [5, 10, 15].includes(candidate.questionsToWin ?? 0) &&
    typeof candidate.soundEnabled === 'boolean' &&
    (candidate.theme === undefined || ['dino', 'rally'].includes(candidate.theme))
  );

  if (!isValid) return null;

  return {
    theme: candidate.theme ?? 'dino',
    operation: candidate.operation as Operation,
    difficulty: candidate.difficulty as Difficulty,
    questionsToWin: candidate.questionsToWin as SessionLength,
    soundEnabled: candidate.soundEnabled as boolean,
  };
}
