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

interface HeaderProps {
  profile: UserProfile;
  onSaveApiKey: (key: string) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onSaveApiKey, onResetData }) => {
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
    <header className="w-full border-b-2 border-[#2d323d] bg-[#0f1015]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Persona */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-black border-2 border-black flex items-center justify-center font-black font-mono shadow-[2px_2px_0px_#000]">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-black tracking-tight text-white font-mono">
                TRACKER // AGENT
              </span>
              <span className="hidden sm:inline-block text-xs font-mono px-1.5 py-0.5 rounded bg-[#1f232c] text-gray-400 border border-[#2d323d]">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Vault • YouTube Hub • Dual Skill Matrix
            </p>
          </div>
        </div>

        {/* Gamification Stats: Streak & Level & XP */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#241a14] border-2 border-[#f59e0b]/50 text-amber-400 shadow-[2px_2px_0px_#000]">
            <Flame size={15} className="fill-amber-400 text-amber-500 animate-pulse" />
            <span className="text-xs font-mono font-bold">{profile.streakDays}d Streak</span>
          </div>

          {/* Level Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#14161c] border-2 border-[#2d323d] shadow-[2px_2px_0px_#000]">
            <span className="text-xs font-mono text-gray-400">Level</span>
            <span className="text-xs font-mono font-black text-white bg-[#22252f] px-1.5 py-0.5 rounded border border-[#383e4d]">
              Lv. {overallLevel}
            </span>
          </div>

          {/* XP Breakdowns tooltip / summary */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-[#6ee7b7]" title="Craftsman XP (College/Labs)">
              <ShieldCheck size={13} /> {profile.totalCraftsmanXp}
            </span>
            <span className="flex items-center gap-1 text-[#c4b5fd]" title="Velocity XP (AI/Hackathons)">
              <Zap size={13} /> {profile.totalVelocityXp}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#14161c] border-2 border-[#2d323d] text-gray-300 hover:text-white hover:border-gray-400 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title={isMuted ? 'Unmute arcade sounds' : 'Mute arcade sounds'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-[#14161c] border-2 border-[#2d323d] text-gray-300 hover:text-white hover:border-gray-400 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
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

