'use client';

import { motion } from 'framer-motion';
import TabletRewardSVG from './TabletRewardSVG';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold text-purple-600">
          {current} / {total} correct! 🎉
        </span>
        <div className="scale-75">
          <TabletRewardSVG />
        </div>
      </div>
      
      <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <motion.div
            className="h-full w-full"
            animate={{
              background: [
                'linear-gradient(90deg, #4ade80, #3b82f6, #a855f7)',
                'linear-gradient(90deg, #3b82f6, #a855f7, #4ade80)',
                'linear-gradient(90deg, #a855f7, #4ade80, #3b82f6)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>
      
      <p className="text-center mt-3 text-xl font-semibold text-gray-700">
        {current === 0 && "Help Peter reach the tablet! 🦖"}
        {current > 0 && current < total / 2 && "Great start! Keep going! 🌟"}
        {current >= total / 2 && current < total && "You're almost there! 💪"}
      </p>
    </div>
  );
}
