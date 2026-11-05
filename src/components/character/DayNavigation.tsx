'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '@/lib/sound';

interface DayNavigationProps {
  currentDay: number;
  totalDays: number;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const DayNavigation: React.FC<DayNavigationProps> = ({
  currentDay,
  totalDays,
  onPrevDay,
  onNextDay,
}) => {
  return (
    <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-[#232323]">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase mr-1">
          DAY
        </span>
        <span className="text-3xl sm:text-4xl font-black font-mono text-[#F5F0E5] tracking-tight">
          {currentDay}
        </span>
        <span className="text-base sm:text-lg font-mono text-[#9ca3af] font-semibold">
          / {totalDays}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            sound.playClick();
            onPrevDay();
          }}
          disabled={currentDay <= 1}
          className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-gray-300 hover:text-white hover:border-[#404040] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          title="Previous Day"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onNextDay();
          }}
          className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-gray-300 hover:text-white hover:border-[#404040] transition-all active:scale-95"
          title="Next Day"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
