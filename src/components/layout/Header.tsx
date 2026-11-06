'use client';

import React, { useState } from 'react';
import {
  Flame,
  Settings,
  ShieldCheck,
  Zap,
  BookOpen,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { UserProfile } from '@/types';
import { SettingsModal } from './SettingsModal';
import { sound } from '@/lib/sound';
import { Logo } from '@/components/ui/Logo';

interface HeaderProps {
  profile: UserProfile;
  onSaveApiKey: (key: string) => void;
  onResetData: () => void;
  onNavigateToProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onSaveApiKey,
  onResetData,
  onNavigateToProfile,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Calculate overall player level based on total XP
  const totalXp = profile.totalCraftsmanXp + profile.totalVelocityXp + profile.totalKnowledgeXp;
  const overallLevel = Math.max(1, Math.floor(totalXp / 250));

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="w-full border-b border-[#222222] bg-[#101010]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Persona */}
        <div className="flex items-center gap-3">
          <Logo size={38} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-black tracking-tight text-[#F5F0E5] font-mono">
                TRACKER // AGENT
              </span>
              <span className="hidden sm:inline-block text-xs font-mono px-1.5 py-0.5 rounded bg-[#1c1c1c] text-[#888888] border border-[#2a2a2a]">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-[#777777] hidden sm:block font-mono">
              Vault · YouTube Hub · Dual Skill Matrix
            </p>
          </div>
        </div>

        {/* Gamification Stats: Streak & Level & XP */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1c140d] border border-[#FF8A32]/40 text-[#FF8A32] shadow-sm">
            <Flame size={15} className="fill-[#FF8A32] text-[#FF8A32] animate-pulse" />
            <span className="text-xs font-mono font-bold">{profile.streakDays}d Streak</span>
          </div>

          {/* Level Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#171717] border border-[#2b2b2b] shadow-sm">
            <span className="text-xs font-mono text-[#777777]">Level</span>
            <span className="text-xs font-mono font-black text-[#F5F0E5] bg-[#222222] px-1.5 py-0.5 rounded border border-[#333333]">
              Lv. {overallLevel}
            </span>
          </div>

          {/* XP Breakdowns */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-[#E9A13D]" title="Craftsman XP (College/Labs)">
              <ShieldCheck size={13} /> {profile.totalCraftsmanXp}
            </span>
            <span className="flex items-center gap-1 text-[#FF8A32]" title="Velocity XP (AI/Hackathons)">
              <Zap size={13} /> {profile.totalVelocityXp}
            </span>
          </div>

          {/* Character Mini Avatar Pill */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (onNavigateToProfile) onNavigateToProfile();
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#181818] hover:bg-[#222222] border border-[#2b2b2b] hover:border-[#FF8A32] shadow-sm transition-all cursor-pointer active:scale-95"
            title="Open Profile Dossier"
          >
            <img
              src={profile.avatarUrl || '/assets/character-cyber-craftsman.png'}
              alt={profile.name}
              className="w-6 h-6 rounded-full object-cover border border-[#383838]"
            />
            <span className="text-xs font-mono font-bold text-[#F5F0E5] hidden md:inline">
              {profile.name}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#171717] border border-[#2b2b2b] text-gray-300 hover:text-[#F5F0E5] hover:border-[#404040] shadow-sm active:scale-95 transition-all"
            title={isMuted ? 'Unmute arcade sounds' : 'Mute arcade sounds'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-[#171717] border border-[#2b2b2b] text-gray-300 hover:text-[#F5F0E5] hover:border-[#404040] shadow-sm active:scale-95 transition-all"
            title="Open Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiApiKey={profile.geminiApiKey}
        onSaveApiKey={onSaveApiKey}
        onResetData={onResetData}
      />
    </header>
  );
};

