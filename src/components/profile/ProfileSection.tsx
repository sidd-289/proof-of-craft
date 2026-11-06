'use client';

import React, { useState } from 'react';
import {
  User,
  Sliders,
  Share2,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  ExternalLink,
  RotateCw,
  Sparkles,
  Camera,
  Layers,
  Code2,
  Terminal,
} from 'lucide-react';
import { CharacterData, RankTier } from '@/types/character';
import { UserProfile, UserCompetitiveProfiles, PlatformStats, PlatformType } from '@/types';
import { FlipCharacterCard } from '@/components/character/FlipCharacterCard';
import { ProfileCustomizerModal } from '@/components/character/ProfileCustomizerModal';
import { ShareCardModal } from '@/components/character/ShareCardModal';
import { CompetitiveProfilesModal } from '@/components/character/CompetitiveProfilesModal';
import {
  GithubIcon,
  LeetCodeIcon,
  CodeforcesIcon,
  CodeChefIcon,
} from '@/components/ui/Icons';
import { sound } from '@/lib/sound';

interface ProfileSectionProps {
  profile: UserProfile;
  character: CharacterData;
  competitiveProfiles?: UserCompetitiveProfiles;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSaveCompetitiveProfile: (platform: PlatformType, stats: PlatformStats) => void;
  onRemoveCompetitiveProfile: (platform: PlatformType) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  character,
  competitiveProfiles,
  onUpdateProfile,
  onSaveCompetitiveProfile,
  onRemoveCompetitiveProfile,
}) => {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);

  const totalXp = profile.totalCraftsmanXp + profile.totalVelocityXp + profile.totalKnowledgeXp;
  const craftsmanRatio = totalXp > 0 ? Math.round((profile.totalCraftsmanXp / totalXp) * 100) : 50;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Profile Hero Bar */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#171717] border border-[#262626] shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={character.avatarUrl || '/assets/character-cyber-craftsman.png'}
              alt={character.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#383838] shadow-md"
            />
            <button
              onClick={() => {
                sound.playClick();
                setIsCustomizerOpen(true);
              }}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#FF8A32] text-black hover:bg-[#E9A13D] shadow-md transition-all"
              title="Change Avatar & Photo"
            >
              <Camera size={13} />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black font-mono text-[#F5F0E5] tracking-tight">
                {character.name}
              </h2>
              <span className="text-xs font-mono font-black text-black px-2 py-0.5 rounded bg-[#FF8A32]">
                LV. {character.level}
              </span>
              <span className="text-xs font-mono font-bold text-[#E9A13D] px-2 py-0.5 rounded bg-[#1e170d] border border-[#E9A13D]/40 uppercase">
                {character.rank}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-1">
              {character.title}
            </p>
            <p className="text-xs font-mono text-gray-500 italic mt-0.5">
              "{character.customization?.bio || 'Building bare-metal logic and high-agency architectures.'}"
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCustomizerOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-[#F5F0E5] border border-[#383838] text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Sliders size={14} className="text-[#FF8A32]" />
            <span>Avatar Studio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsShareModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#FF8A32] hover:bg-[#E9A13D] text-black text-xs font-mono font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Share2 size={14} />
            <span>Share Proof Card</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: 3D Flip Card + Detailed Progression Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 Cols): 3D Flipping Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FF8A32]" />
              <span>Interactive Status Card</span>
            </span>
            <span className="text-[11px] font-mono text-gray-500">Click to Flip</span>
          </div>

          <FlipCharacterCard
            character={character}
            competitiveProfiles={competitiveProfiles}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
          />
        </div>

        {/* Right Column (7 Cols): Account Linking & Progression Hub */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Linked Developer & Competitive Platforms */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#171717] border border-[#262626] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#FF8A32]" />
                <h3 className="font-mono text-sm font-bold text-[#F5F0E5]">
                  Linked Platform Profiles
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsAccountsModalOpen(true);
                }}
                className="text-xs font-mono text-[#E9A13D] hover:underline"
              >
                Manage Accounts
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* GitHub */}
              <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#222222] text-[#F5F0E5] flex items-center justify-center flex-shrink-0">
                    <GithubIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-[#F5F0E5]">GitHub</div>
                    {competitiveProfiles?.github?.verified ? (
                      <div className="text-[11px] font-mono text-emerald-400 truncate">
                        @{competitiveProfiles.github.username} ({competitiveProfiles.github.metrics?.primaryValue} repos)
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-gray-500">Not Linked</div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAccountsModalOpen(true)}
                  className="px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#282828] text-[10px] font-mono font-bold text-gray-300 border border-[#303030]"
                >
                  {competitiveProfiles?.github?.verified ? 'Active' : 'Login'}
                </button>
              </div>

              {/* LeetCode */}
              <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#281a05] text-[#FFA116] flex items-center justify-center flex-shrink-0">
                    <LeetCodeIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-[#F5F0E5]">LeetCode</div>
                    {competitiveProfiles?.leetcode?.verified ? (
                      <div className="text-[11px] font-mono text-[#FFA116] truncate">
                        @{competitiveProfiles.leetcode.username} ({competitiveProfiles.leetcode.metrics?.primaryValue} Solved)
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-gray-500">Not Linked</div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAccountsModalOpen(true)}
                  className="px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#282828] text-[10px] font-mono font-bold text-gray-300 border border-[#303030]"
                >
                  {competitiveProfiles?.leetcode?.verified ? 'Active' : 'Login'}
                </button>
              </div>

              {/* Codeforces */}
              <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#082f49] text-[#38BDF8] flex items-center justify-center flex-shrink-0">
                    <CodeforcesIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-[#F5F0E5]">Codeforces</div>
                    {competitiveProfiles?.codeforces?.verified ? (
                      <div className="text-[11px] font-mono text-[#38BDF8] truncate">
                        @{competitiveProfiles.codeforces.username} ({competitiveProfiles.codeforces.metrics?.primaryValue} RTG)
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-gray-500">Not Linked</div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAccountsModalOpen(true)}
                  className="px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#282828] text-[10px] font-mono font-bold text-gray-300 border border-[#303030]"
                >
                  {competitiveProfiles?.codeforces?.verified ? 'Active' : 'Login'}
                </button>
              </div>

              {/* CodeChef */}
              <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#241a3d] text-[#C4B5FD] flex items-center justify-center flex-shrink-0">
                    <CodeChefIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-[#F5F0E5]">CodeChef</div>
                    {competitiveProfiles?.codechef?.verified ? (
                      <div className="text-[11px] font-mono text-[#C4B5FD] truncate">
                        @{competitiveProfiles.codechef.username} ({competitiveProfiles.codechef.metrics?.secondaryValue})
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-gray-500">Not Linked</div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAccountsModalOpen(true)}
                  className="px-2 py-1 rounded bg-[#1e1e1e] hover:bg-[#282828] text-[10px] font-mono font-bold text-gray-300 border border-[#303030]"
                >
                  {competitiveProfiles?.codechef?.verified ? 'Active' : 'Login'}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Dual Mastery Spectrum (Craftsman vs. Velocity) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#171717] border border-[#262626] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#242424]">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#E9A13D]" />
                <h3 className="font-mono text-sm font-bold text-[#F5F0E5]">
                  Authorship Spectrum Mastery
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#6EE7B7]">
                {craftsmanRatio}% Craftsman Core
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[#6EE7B7] font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Craftsman XP (College, Systems, Scratch)
                  </span>
                  <span className="font-black text-[#F5F0E5]">{profile.totalCraftsmanXp} XP</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#141414] border border-[#282828] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#6EE7B7]"
                    style={{ width: `${Math.min(100, (profile.totalCraftsmanXp / 1500) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[#C4B5FD] font-bold flex items-center gap-1.5">
                    <Zap size={14} /> Velocity XP (AI Assisted, Hackathon Assembly)
                  </span>
                  <span className="font-black text-[#F5F0E5]">{profile.totalVelocityXp} XP</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#141414] border border-[#282828] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#C4B5FD]"
                    style={{ width: `${Math.min(100, (profile.totalVelocityXp / 1500) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-gray-500 leading-relaxed pt-1">
              Proof-of-Craft enforces an honest separation: college labs and bare-metal syntax earn Craftsman XP, while AI-accelerated hackathon prototypes earn Velocity XP.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        character={character}
        geminiApiKey={profile.geminiApiKey}
        onSave={(updated) => {
          onUpdateProfile({
            name: updated.name,
            title: updated.title,
            avatarUrl: updated.avatarUrl,
            characterCustomization: updated.customization,
          });
        }}
      />

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        character={character}
        competitiveProfiles={competitiveProfiles}
        craftsmanXp={profile.totalCraftsmanXp}
        velocityXp={profile.totalVelocityXp}
      />

      <CompetitiveProfilesModal
        isOpen={isAccountsModalOpen}
        onClose={() => setIsAccountsModalOpen(false)}
        profiles={competitiveProfiles || {}}
        onSaveProfile={onSaveCompetitiveProfile}
        onRemoveProfile={onRemoveCompetitiveProfile}
      />
    </div>
  );
};
