'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface XPProgressBarProps {
  currentXp: number;
  nextLevelXp: number;
  level: number;
  segmentCount?: number;
  accentColor?: string;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXp,
  nextLevelXp,
  level,
  segmentCount = 18,
  accentColor = '#FF8A32',
}) => {
  const xpRemaining = Math.max(0, nextLevelXp - currentXp);
  const ratio = Math.min(1, Math.max(0, currentXp / nextLevelXp));
  const activeSegments = Math.round(ratio * segmentCount);

  return (
    <div className="w-full max-w-sm mb-6">
      <div className="flex items-center gap-1.5 w-full mb-2">
        {Array.from({ length: segmentCount }).map((_, index) => {
          const isFilled = index < activeSegments;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scaleY: 0.5 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: index * 0.015 }}
              className="h-3 flex-1 rounded-[2px] transition-colors duration-300"
              style={{
                backgroundColor: isFilled ? accentColor : '#252525',
                boxShadow: isFilled ? `0 0 6px ${accentColor}40` : 'none',
              }}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[#F5F0E5] font-semibold">
          <span className="font-bold text-[#FF8A32]">{xpRemaining} XP</span> to LVL {level + 1}
        </span>
        <span className="text-gray-400">
          {currentXp} / {nextLevelXp} XP
        </span>
      </div>
    </div>
  );
};

