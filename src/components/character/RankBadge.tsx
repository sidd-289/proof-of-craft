'use client';

import React, { useState } from 'react';
import { ChevronDown, Shield, Sparkles } from 'lucide-react';
import { RankTier } from '@/types/character';
import { sound } from '@/lib/sound';

interface RankBadgeProps {
  currentRank: RankTier;
  onRankSelect?: (rank: RankTier) => void;
}

const ALL_RANKS: { rank: RankTier; color: string; bg: string }[] = [
  { rank: 'Bronze', color: '#0c0d11', bg: '#FF8A32' },
  { rank: 'Silver', color: '#0c0d11', bg: '#E2E8F0' },
  { rank: 'Gold', color: '#0c0d11', bg: '#E9A13D' },
  { rank: 'Platinum', color: '#0c0d11', bg: '#38BDF8' },
  { rank: 'Diamond', color: '#0c0d11', bg: '#818CF8' },
  { rank: 'Master', color: '#0c0d11', bg: '#F472B6' },
  { rank: 'Grandmaster', color: '#0c0d11', bg: '#EF4444' },
];

export const RankBadge: React.FC<RankBadgeProps> = ({ currentRank, onRankSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeRankConfig = ALL_RANKS.find((r) => r.rank === currentRank) || ALL_RANKS[0];

  const handleSelect = (rank: RankTier) => {
    sound.playSuccess();
    if (onRankSelect) onRankSelect(rank);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-black tracking-wider uppercase transition-all transform active:scale-95 shadow-md"
        style={{
          backgroundColor: activeRankConfig.bg,
          color: activeRankConfig.color,
        }}
      >
        <Shield size={13} fill="currentColor" />
        <span>{currentRank}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 bottom-full mb-2 z-50 w-44 rounded-lg bg-[#181818] border border-[#2e2e2e] shadow-xl py-1.5 overflow-hidden">
            <div className="px-3 py-1 text-[10px] font-mono uppercase text-gray-500 tracking-wider border-b border-[#242424]">
              Select Tier
            </div>
            {ALL_RANKS.map((item) => (
              <button
                key={item.rank}
                onClick={() => handleSelect(item.rank)}
                className={`w-full px-3 py-1.5 text-left text-xs font-mono font-bold flex items-center justify-between hover:bg-[#222222] transition-colors ${
                  item.rank === currentRank ? 'text-white' : 'text-gray-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.bg }}
                  />
                  {item.rank}
                </span>
                {item.rank === currentRank && (
                  <Sparkles size={12} className="text-[#FF8A32]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

