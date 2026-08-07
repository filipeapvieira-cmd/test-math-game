# Peter's Number Quest 🦖

A touch-first maths game with four complete visual themes: explore Dino Valley, race a monster truck, master a Judo journey, or chase football glory under the floodlights.

## Features

- Animated journey with immediate, encouraging feedback
- Four complete worlds: Dino Valley, Monster Rally, Judo Journey, and Football Fever
- Addition, subtraction, and multiplication
- Three difficulty levels and 5, 10, or 15-question sessions
- Large tablet-friendly controls in portrait and landscape
- Hints after an incorrect attempt without revealing the answer
- Streaks, progress milestones, and a finite victory celebration
- Optional sound with saved preferences
- Reduced-motion and screen-reader support
- Installable standalone web-app metadata

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
pnpm lint
pnpm build
```

The maths problem generator and its configuration types live in `components/gameEngine.ts`. The main interaction state machine lives in `components/GameState.tsx`.
