'use client';

import React, { useState, useEffect } from 'react';
import { StatusBar } from './StatusBar';
import { DayNavigation } from './DayNavigation';
import { LevelDisplay } from './LevelDisplay';
import { XPProgressBar } from './XPProgressBar';
import { AttributeStats } from './AttributeStats';
import { RankBadge } from './RankBadge';
import { CharacterIllustration } from './CharacterIllustration';
import { CharacterData, AttributeStat, RankTier } from '@/types/character';
import { Modal } from '@/components/ui/Modal';
import { Sparkles, Edit3 } from 'lucide-react';
import { sound } from '@/lib/sound';

interface CharacterDashboardProps {
  initialData: CharacterData;
  onOpenSettings?: () => void;
  onXpGain?: (amount: number) => void;
}

export const CharacterDashboard: React.FC<CharacterDashboardProps> = ({
  initialData,
  onOpenSettings,
  onXpGain,
}) => {
  const [character, setCharacter] = useState<CharacterData>(initialData);
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeStat | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(character.name);
  const [editTitle, setEditTitle] = useState(character.title);

  // Sync state if external store data updates (e.g. video watched, lab logged)
  useEffect(() => {
    setCharacter((prev) => ({
      ...prev,
      name: initialData.name || prev.name,
      streakDays: initialData.streakDays,
      totalAchievements: initialData.totalAchievements,
      totalXp: initialData.totalXp,
      currentXp: initialData.currentXp,
      nextLevelXp: initialData.nextLevelXp,
      level: initialData.level,
      attributes: initialData.attributes,
    }));
  }, [initialData]);

  // Day Navigation handlers
  const handlePrevDay = () => {
    setCharacter((prev) => ({
      ...prev,
      currentDay: Math.max(1, prev.currentDay - 1),
    }));
  };

  const handleNextDay = () => {
    setCharacter((prev) => ({
      ...prev,
      currentDay: prev.currentDay + 1,
      totalDays: Math.max(prev.totalDays, prev.currentDay + 1),
    }));
  };

  const handleRankSelect = (newRank: RankTier) => {
    setCharacter((prev) => ({ ...prev, rank: newRank }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCharacter((prev) => ({
      ...prev,
      name: editName.trim() || prev.name,
      title: editTitle.trim() || prev.title,
    }));
    sound.playSuccess();
    setIsEditModalOpen(false);
  };

  return (
    <div className="w-full mb-8">
      {/* Main RPG Character Card */}
      <div className="relative w-full rounded-2xl bg-[#171717] border border-[#2b2b2b] p-5 sm:p-7 shadow-[0_18px_40px_rgba(0,0,0,0.65)] overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
          {/* LEFT 60%: Character Stats, Day Progress, Level & Attributes */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Top Status Bar (Streak, Achievements, Total XP, Settings) */}
              <StatusBar
                streakDays={character.streakDays}
                totalAchievements={character.totalAchievements}
                totalXp={character.totalXp}
                onOpenSettings={onOpenSettings || (() => {})}
              />

              {/* Day Progression Section */}
              <DayNavigation
                currentDay={character.currentDay}
                totalDays={character.totalDays}
                onPrevDay={handlePrevDay}
                onNextDay={handleNextDay}
              />

              {/* Character Profile & Level Display */}
              <div className="flex items-start justify-between">
                <LevelDisplay
                  name={character.name}
                  title={character.title}
                  level={character.level}
                />

                {/* Edit Character Trigger */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-[#F5F0E5] hover:bg-[#202020] transition-colors text-xs flex items-center gap-1 font-mono"
                  title="Edit Character"
                >
                  <Edit3 size={14} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </div>

              {/* XP Progression System */}
              <XPProgressBar
                currentXp={character.currentXp}
                nextLevelXp={character.nextLevelXp}
                level={character.level}
                accentColor="#FF8A32"
              />
            </div>

            {/* Bottom: Character Attributes (CON, FOC, DIS, STR, WIS) */}
            <div className="pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#FF8A32]" />
                <span>Core Progression Attributes</span>
              </div>
              <AttributeStats
                attributes={character.attributes}
                onAttributeClick={(attr) => setSelectedAttribute(attr)}
              />
            </div>
          </div>

          {/* RIGHT 40%: Character Illustration & Rank Badge */}
          <div className="w-full lg:w-[42%] min-h-[340px] sm:min-h-[420px] relative flex flex-col justify-between items-center bg-gradient-to-b from-[#1a1a1a]/40 to-[#121212]/80 rounded-xl border border-[#262626] overflow-hidden p-3">
            {/* Anime Character Artwork with Aura */}
            <div className="w-full flex-1 flex items-end justify-center">
              <CharacterIllustration
                avatarUrl={character.avatarUrl}
                accentColor="#FF8A32"
              />
            </div>

            {/* Bottom-Right Rank System Badge */}
            <div className="w-full flex items-center justify-between pt-2 border-t border-[#262626]/80 px-2 z-30">
              <div className="text-[11px] font-mono text-gray-400">
                Tier Rank:
              </div>
              <RankBadge
                currentRank={character.rank}
                onRankSelect={handleRankSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Detail Modal on Click */}
      {selectedAttribute && (
        <Modal
          isOpen={!!selectedAttribute}
          onClose={() => setSelectedAttribute(null)}
          title={`Attribute: ${selectedAttribute.name} (${selectedAttribute.code})`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#2b2b2b]">
              <div>
                <p className="text-xs font-mono text-gray-400 uppercase">Current Stat Level</p>
                <p className="text-3xl font-black font-mono text-[#F5F0E5]" style={{ color: selectedAttribute.color }}>
                  {selectedAttribute.value} / {selectedAttribute.maxValue}
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center font-mono font-black text-2xl border border-black shadow-md"
                style={{ backgroundColor: selectedAttribute.color, color: '#101010' }}
              >
                {selectedAttribute.code}
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed bg-[#171717] p-3 rounded-lg border border-[#262626]">
              {selectedAttribute.description}
            </p>

            <div className="text-xs text-gray-400 font-mono bg-[#141414] p-2.5 rounded-lg border border-[#222222]">
              <span className="text-[#FF8A32] font-bold uppercase tracking-wider">Note:</span> Completing college labs levels up <span className="text-[#F472B6] font-bold">STR</span>, watching technical lectures advances <span className="text-[#C4B5FD] font-bold">WIS</span>, and maintaining daily streaks advances <span className="text-[#FF8A32] font-bold">CON</span>.
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Configure Character Identity"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
                Character Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Andre, Sidd, Jinwoo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-[#2b2b2b] text-[#F5F0E5] text-sm focus:outline-none focus:border-[#FF8A32]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
                Class / Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Cyber Craftsman & System Architect"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-[#2b2b2b] text-[#F5F0E5] text-sm focus:outline-none focus:border-[#FF8A32]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-400 hover:text-white border border-[#2b2b2b] text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#FF8A32] text-black font-bold font-mono text-xs hover:bg-[#ff9c52] transition-colors"
              >
                Save Identity
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
