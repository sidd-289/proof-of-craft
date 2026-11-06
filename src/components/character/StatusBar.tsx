'use client';

import React from 'react';
import { Flame, Trophy, Star, Settings } from 'lucide-react';
import { sound } from '@/lib/sound';

interface StatusBarProps {
  streakDays: number;
  totalAchievements: number;
  totalXp: number;
  onOpenSettings: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  streakDays,
  totalAchievements,
  totalXp,
  onOpenSettings,
}) => {
  return (
    <div className="flex items-center justify-between w-full mb-6">
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        {/* Fire icon - Streak */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] shadow-sm hover:border-[#383838] transition-colors">
          <Flame size={15} className="text-[#FF8A32] fill-[#FF8A32]" />
          <span className="text-xs font-mono font-bold text-[#F5F0E5]">
            {streakDays}
          </span>
        </div>

        {/* Trophy icon - Achievements */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] shadow-sm hover:border-[#383838] transition-colors">
          <Trophy size={15} className="text-[#E9A13D] fill-[#E9A13D]/20" />
          <span className="text-xs font-mono font-bold text-[#F5F0E5]">
            {totalAchievements}
          </span>
        </div>

        {/* Star icon - Total XP */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] shadow-sm hover:border-[#383838] transition-colors">
          <Star size={15} className="text-[#E9A13D] fill-[#E9A13D]" />
          <span className="text-xs font-mono font-bold text-[#F5F0E5]">
            {totalXp.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Settings */}
      <button
        onClick={() => {
          sound.playClick();
          onOpenSettings();
        }}
        className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-gray-400 hover:text-[#F5F0E5] hover:border-[#404040] transition-all active:scale-95"
        title="Settings"
      >
        <Settings size={16} />
      </button>
    </div>
  );
};

