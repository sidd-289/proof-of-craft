'use client';

import React, { useState, useEffect } from 'react';
import { StatusBar } from './StatusBar';
import { DayNavigation } from './DayNavigation';
import { LevelDisplay } from './LevelDisplay';
import { XPProgressBar } from './XPProgressBar';
import { AttributeStats } from './AttributeStats';
import { RankBadge } from './RankBadge';
import { FlipCharacterCard } from './FlipCharacterCard';
import { ProfileCustomizerModal } from './ProfileCustomizerModal';
import { CompetitiveProfilesModal } from './CompetitiveProfilesModal';
import { CharacterData, AttributeStat, RankTier, CharacterCustomization } from '@/types/character';
import { PlatformType, PlatformStats, UserCompetitiveProfiles } from '@/types/profile';
import { Modal } from '@/components/ui/Modal';
import { Sparkles, Sliders, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LeetCodeIcon, CodeforcesIcon, CodeChefIcon } from '@/components/ui/Icons';
import { sound } from '@/lib/sound';

interface CharacterDashboardProps {
  initialData: CharacterData;
  competitiveProfiles?: UserCompetitiveProfiles;
  geminiApiKey?: string;
  onOpenSettings?: () => void;
  onXpGain?: (amount: number) => void;
  onSaveCompetitiveProfile?: (platform: PlatformType, stats: PlatformStats) => void;
  onRemoveCompetitiveProfile?: (platform: PlatformType) => void;
  onUpdateProfile?: (updated: {
    name: string;
    title: string;
    avatarUrl?: string;
    customization?: CharacterCustomization;
  }) => void;
}

export const CharacterDashboard: React.FC<CharacterDashboardProps> = ({
  initialData,
  competitiveProfiles,
  geminiApiKey,
  onOpenSettings,
  onXpGain,
  onSaveCompetitiveProfile,
  onRemoveCompetitiveProfile,
  onUpdateProfile,
}) => {
  const [character, setCharacter] = useState<CharacterData>(initialData);
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeStat | null>(null);
  const [isCustomizerModalOpen, setIsCustomizerModalOpen] = useState(false);
  const [isCompetitiveModalOpen, setIsCompetitiveModalOpen] = useState(false);

  // Sync state if external store data updates (e.g. video watched, lab logged)
  useEffect(() => {
    setCharacter((prev) => ({
      ...prev,
      name: initialData.name || prev.name,
      title: initialData.title || prev.title,
      avatarUrl: initialData.avatarUrl || prev.avatarUrl,
      customization: initialData.customization || prev.customization,
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
    sound.playLevelUp();
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

                <div className="flex items-center gap-1.5">
                  {/* Linked Profiles Trigger */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsCompetitiveModalOpen(true);
                    }}
                    className="p-1.5 px-2.5 rounded-lg bg-[#202020] text-gray-300 hover:text-[#F5F0E5] hover:border-[#FF8A32]/60 border border-[#2d2d2d] transition-all text-xs flex items-center gap-1.5 font-mono shadow-sm active:scale-95"
                    title="Login & Link Profiles (GitHub, LeetCode, Codeforces, CodeChef)"
                  >
                    <ShieldCheck size={14} className="text-[#E9A13D]" />
                    <span className="hidden sm:inline">Linked Profiles</span>
                  </button>

                  {/* Profile & Avatar Studio Trigger */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsCustomizerModalOpen(true);
                    }}
                    className="p-1.5 px-2.5 rounded-lg text-gray-300 hover:text-[#F5F0E5] hover:bg-[#202020] border border-[#2d2d2d] transition-all text-xs flex items-center gap-1.5 font-mono shadow-sm active:scale-95"
                    title="Profile & Custom Anime Avatar Studio"
                  >
                    <Sliders size={13} className="text-[#FF8A32]" />
                    <span className="hidden sm:inline">Avatar Studio</span>
                  </button>
                </div>
              </div>

              {/* Linked Competitive Profiles & Proof-of-Work Badges Strip */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {competitiveProfiles && Object.values(competitiveProfiles).some((p) => p?.verified) ? (
                  <>
                    {competitiveProfiles.github?.verified && (
                      <button
                        onClick={() => setIsCompetitiveModalOpen(true)}
                        className="px-2.5 py-1 rounded-md bg-[#1d1d1d] border border-[#333333] hover:border-[#F5F0E5]/60 text-xs font-mono text-[#F5F0E5] flex items-center gap-1.5 transition-all shadow-sm"
                        title="GitHub Verified Proof"
                      >
                        <GithubIcon size={12} />
                        <span>{competitiveProfiles.github.username}</span>
                        <span className="text-[10px] text-[#888888]">({competitiveProfiles.github.metrics?.primaryValue} repos)</span>
                        <CheckCircle2 size={11} className="text-emerald-400" />
                      </button>
                    )}
                    {competitiveProfiles.leetcode?.verified && (
                      <button
                        onClick={() => setIsCompetitiveModalOpen(true)}
                        className="px-2.5 py-1 rounded-md bg-[#221a0f] border border-[#FFA116]/40 hover:border-[#FFA116] text-xs font-mono text-[#FFA116] flex items-center gap-1.5 transition-all shadow-sm"
                        title="LeetCode Verified Proof"
                      >
                        <LeetCodeIcon size={13} />
                        <span>LeetCode</span>
                        <span className="text-[10px] text-[#F5F0E5]">({competitiveProfiles.leetcode.metrics?.primaryValue} Solved)</span>
                        <CheckCircle2 size={11} className="text-emerald-400" />
                      </button>
                    )}
                    {competitiveProfiles.codeforces?.verified && (
                      <button
                        onClick={() => setIsCompetitiveModalOpen(true)}
                        className="px-2.5 py-1 rounded-md bg-[#0a2133] border border-[#38BDF8]/40 hover:border-[#38BDF8] text-xs font-mono text-[#38BDF8] flex items-center gap-1.5 transition-all shadow-sm"
                        title="Codeforces Verified Proof"
                      >
                        <CodeforcesIcon size={13} />
                        <span>CF</span>
                        <span className="text-[10px] text-[#F5F0E5]">({competitiveProfiles.codeforces.metrics?.primaryValue} {competitiveProfiles.codeforces.metrics?.rankTitle})</span>
                        <CheckCircle2 size={11} className="text-emerald-400" />
                      </button>
                    )}
                    {competitiveProfiles.codechef?.verified && (
                      <button
                        onClick={() => setIsCompetitiveModalOpen(true)}
                        className="px-2.5 py-1 rounded-md bg-[#1f1733] border border-[#C4B5FD]/40 hover:border-[#C4B5FD] text-xs font-mono text-[#C4B5FD] flex items-center gap-1.5 transition-all shadow-sm"
                        title="CodeChef Verified Proof"
                      >
                        <CodeChefIcon size={13} />
                        <span>CodeChef</span>
                        <span className="text-[10px] text-[#F5F0E5]">({competitiveProfiles.codechef.metrics?.primaryValue})</span>
                        <CheckCircle2 size={11} className="text-emerald-400" />
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setIsCompetitiveModalOpen(true)}
                    className="px-2.5 py-1 rounded-md bg-[#181818] border border-dashed border-[#383838] hover:border-[#FF8A32] text-xs font-mono text-gray-400 hover:text-[#F5F0E5] flex items-center gap-1.5 transition-all"
                  >
                    <ShieldCheck size={13} className="text-[#E9A13D]" />
                    <span>+ Login & Link Profiles (GitHub, LeetCode, Codeforces, CodeChef)</span>
                  </button>
                )}
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

          {/* RIGHT 42%: 3D Flippable Holographic Character Card */}
          <div className="w-full lg:w-[42%] flex items-center justify-center">
            <FlipCharacterCard
              character={character}
              competitiveProfiles={competitiveProfiles}
              onRankSelect={handleRankSelect}
              onOpenCustomizer={() => {
                sound.playClick();
                setIsCustomizerModalOpen(true);
              }}
            />
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
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center font-mono font-black text-2xl border border-black shadow-md"
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

      {/* Profile & Anime Avatar Studio Modal */}
      <ProfileCustomizerModal
        isOpen={isCustomizerModalOpen}
        onClose={() => setIsCustomizerModalOpen(false)}
        character={character}
        geminiApiKey={geminiApiKey}
        onSave={(updated) => {
          setCharacter((prev) => ({
            ...prev,
            name: updated.name,
            title: updated.title,
            avatarUrl: updated.avatarUrl || prev.avatarUrl,
            customization: updated.customization || prev.customization,
          }));
          if (onUpdateProfile) {
            onUpdateProfile(updated);
          }
        }}
      />

      {/* Competitive Profiles & GitHub Tracker Modal */}
      <CompetitiveProfilesModal
        isOpen={isCompetitiveModalOpen}
        onClose={() => setIsCompetitiveModalOpen(false)}
        profiles={competitiveProfiles || {}}
        onSaveProfile={onSaveCompetitiveProfile || (() => {})}
        onRemoveProfile={onRemoveCompetitiveProfile || (() => {})}
      />
    </div>
  );
};
