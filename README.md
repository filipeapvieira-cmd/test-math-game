# Peter the T-Rex Math Game 🦖

An engaging educational math game for children where they help Peter the T-Rex reach a tablet by solving addition problems!

## Features

- 🎮 **Interactive Gameplay**: Kids solve 10 addition problems to help Peter reach his goal
- 🎨 **Vibrant Design**: Colorful, child-friendly interface with smooth animations
- ✨ **Positive Reinforcement**: Celebrations for correct answers, gentle feedback for mistakes
- 📊 **Progress Tracking**: Visual progress bar showing distance to the tablet reward
- 🎉 **Victory Celebration**: Confetti animation and encouraging messages when completing the game
- 📱 **Responsive**: Works great on desktop, tablet, and mobile devices

## Technology Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Effects**: React Confetti

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Customization

The game is designed to be easily extensible. To modify game settings, edit the `GAME_CONFIG` object in `components/GameState.tsx`:

```typescript
const GAME_CONFIG = {
  minNumber: 1,        // Minimum number in problems
  maxNumber: 10,       // Maximum number in problems
  questionsToWin: 10,  // Number of correct answers needed
};
```

### Future Extensions

The architecture supports easy addition of:
- Different difficulty levels (larger numbers, subtraction, multiplication)
- Multiple game modes
- Time challenges
- Sound effects
- Different characters and themes

## Build for Production

```bash
npm run build
npm start
```

## License

Built with ❤️ for young learners
