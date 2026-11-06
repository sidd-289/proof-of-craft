'use client';

import React, { useState } from 'react';
import {
  RotateCw,
  Sparkles,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Layers,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import {
  GithubIcon,
  LeetCodeIcon,
  CodeforcesIcon,
  CodeChefIcon,
} from '@/components/ui/Icons';
import { CharacterData, RankTier } from '@/types/character';
import { UserCompetitiveProfiles } from '@/types/profile';
import { RankBadge } from './RankBadge';
import { sound } from '@/lib/sound';

interface FlipCharacterCardProps {
  character: CharacterData;
  competitiveProfiles?: UserCompetitiveProfiles;
  onRankSelect?: (rank: RankTier) => void;
  onOpenCustomizer?: () => void;
}

export const FlipCharacterCard: React.FC<FlipCharacterCardProps> = ({
  character,
  competitiveProfiles,
  onRankSelect,
  onOpenCustomizer,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image error state whenever avatar URL changes
  React.useEffect(() => {
    setImageError(false);
  }, [character.avatarUrl]);

  const auraColor = character.customization?.auraColor || '#FF8A32';
  const avatarUrl = character.avatarUrl || '/assets/character.png';

  const handleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFlipped((prev) => !prev);
    sound.playClick();
  };

  // Compute character aggregate power rating
  const attrSum = Object.values(character.attributes).reduce(
    (acc, attr) => acc + (attr?.value || 0),
    0
  );
  const combatPower = character.level * 120 + attrSum * 8 + Math.floor(character.totalXp / 20);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 3D Perspective Flip Container */}
      <div
        className="w-full max-w-[400px] h-[480px] sm:h-[510px] relative cursor-pointer group"
        style={{ perspective: '1200px' }}
        onClick={() => handleFlip()}
      >
        <div
          className="w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ======================================================== */}
          {/* FRONT FACE: Authentic Anime Holographic Trading Card     */}
          {/* ======================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-b from-[#1c1c1c] via-[#141414] to-[#0d0d0d] border-2 border-[#2c2c2c] group-hover:border-[#FF8A32]/70 shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-3.5 transition-all"
            style={{
              backfaceVisibility: 'hidden',
              boxShadow: `0 0 25px ${auraColor}18, 0 16px 40px rgba(0,0,0,0.8)`,
            }}
          >
            {/* Holographic Prismatic Sheen Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ mixBlendMode: 'overlay' }}
            />

            {/* Corner Cyber Notches */}
            <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E9A13D] pointer-events-none" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#E9A13D] pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#E9A13D] pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E9A13D] pointer-events-none" />

            {/* Top Card Header */}
            <div className="w-full flex items-center justify-between z-20 pb-2 border-b border-[#242424]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-black text-black px-2 py-0.5 rounded bg-[#E9A13D] uppercase tracking-wider shadow-sm">
                  SSR // UNIQUE
                </span>
                <span className="text-[10px] font-mono font-bold text-[#FF8A32] uppercase">
                  LV.{character.level}
                </span>
              </div>

              <button
                type="button"
                onClick={handleFlip}
                className="p-1 px-2.5 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-[#F5F0E5] border border-[#363636] text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all hover:border-[#FF8A32]"
                title="Click to Flip Card and Inspect Stats"
              >
                <RotateCw size={12} className="text-[#E9A13D]" />
                <span>Stats Sheet</span>
              </button>
            </div>

            {/* Center: Character Illustration with Geometric Aura Rings */}
            <div className="relative flex-1 w-full flex items-end justify-center overflow-hidden my-1">
              {/* Spinning Anime Geometric Energy Seals */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-64 h-64 rounded-full border border-dashed opacity-35 animate-[spin_40s_linear_infinite]"
                  style={{ borderColor: auraColor }}
                />
                <div
                  className="w-48 h-48 rounded-full border border-dotted opacity-25 animate-[spin_25s_linear_infinite_reverse]"
                  style={{ borderColor: auraColor }}
                />
                <div
                  className="w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: auraColor }}
                />
              </div>

              {/* Anime Character Artwork */}
              {!imageError ? (
                <img
                  src={avatarUrl}
                  alt={character.name}
                  onError={() => setImageError(true)}
                  className="relative z-10 w-auto h-full max-h-[340px] sm:max-h-[360px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] pointer-events-none select-none"
                />
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs">
                  <Cpu size={40} className="mb-2 text-[#FF8A32]" />
                  <span>Anime Avatar Initializing...</span>
                </div>
              )}

              {/* Vignette bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent pointer-events-none z-10" />
            </div>

            {/* Bottom Card Footer Nameplate */}
            <div className="w-full z-20 pt-2 border-t border-[#242424] space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-mono font-black text-[#F5F0E5] tracking-wide flex items-center gap-1.5">
                    <span>{character.name}</span>
                    <span className="text-[10px] font-mono text-gray-500">#{character.level.toString().padStart(3, '0')}</span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 truncate max-w-[200px]">
                    {character.title}
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <RankBadge
                    currentRank={character.rank}
                    onRankSelect={onRankSelect || (() => {})}
                  />
                </div>
              </div>

              {/* Flip Hint Bar */}
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-gray-500">
                <span className="flex items-center gap-1 text-[#E9A13D]">
                  <Sparkles size={11} /> Click card to flip
                </span>
                <span>Proof-of-Craft v1.0</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* BACK FACE: High-Tech Character Status Dossier / Sheet   */}
          {/* ======================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-b from-[#181818] via-[#121212] to-[#0a0a0a] border-2 border-[#FF8A32]/60 shadow-[0_16px_40px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between p-4 transition-all"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: `0 0 30px ${auraColor}20, 0 16px 40px rgba(0,0,0,0.9)`,
            }}
          >
            {/* Header: Card Back */}
            <div className="w-full flex items-center justify-between pb-2.5 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-[#F5F0E5] tracking-wider uppercase">
                  STATUS DOSSIER
                </span>
              </div>

              <button
                type="button"
                onClick={handleFlip}
                className="p-1 px-2.5 rounded-lg bg-[#202020] hover:bg-[#282828] text-[#F5F0E5] border border-[#333333] text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all hover:border-[#FF8A32]"
              >
                <RotateCw size={12} className="text-[#FF8A32]" />
                <span>Artwork</span>
              </button>
            </div>

            {/* Dossier Body */}
            <div className="flex-1 py-2 space-y-3 overflow-y-auto no-scrollbar">
              {/* Power Rating Hero Pill */}
              <div className="p-2.5 rounded-xl bg-[#1d1d1d] border border-[#2e2e2e] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Combat Power Rating</div>
                  <div className="text-lg font-mono font-black text-[#FF8A32]">
                    PWR {combatPower.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">Mastery Tier</div>
                  <div className="text-xs font-mono font-bold text-[#E9A13D] uppercase">
                    {character.rank}
                  </div>
                </div>
              </div>

              {/* Core Attributes Bar Gauges */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Attribute Sheet</span>
                  <span>Max: 30</span>
                </div>

                {Object.values(character.attributes).map((attr) => {
                  const percent = Math.min(100, Math.round((attr.value / attr.maxValue) * 100));
                  return (
                    <div key={attr.code} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-gray-300 flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: attr.color }}
                          />
                          <span>{attr.name}</span>
                        </span>
                        <span className="font-black" style={{ color: attr.color }}>
                          {attr.value}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#1b1b1b] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: attr.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Verified Guild Proofs */}
              {competitiveProfiles && Object.values(competitiveProfiles).some((p) => p?.verified) && (
                <div className="pt-1 space-y-1.5">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    Verified Proof Links
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {competitiveProfiles.github?.verified && (
                      <div className="p-1.5 rounded-lg bg-[#181818] border border-[#2b2b2b] text-[10px] font-mono text-gray-300 flex items-center gap-1.5">
                        <GithubIcon size={12} />
                        <span className="truncate">{competitiveProfiles.github.username}</span>
                      </div>
                    )}
                    {competitiveProfiles.leetcode?.verified && (
                      <div className="p-1.5 rounded-lg bg-[#181818] border border-[#2b2b2b] text-[10px] font-mono text-[#FFA116] flex items-center gap-1.5">
                        <LeetCodeIcon size={12} />
                        <span>{competitiveProfiles.leetcode.metrics?.primaryValue} Solved</span>
                      </div>
                    )}
                    {competitiveProfiles.codeforces?.verified && (
                      <div className="p-1.5 rounded-lg bg-[#181818] border border-[#2b2b2b] text-[10px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                        <CodeforcesIcon size={12} />
                        <span>{competitiveProfiles.codeforces.metrics?.primaryValue} RTG</span>
                      </div>
                    )}
                    {competitiveProfiles.codechef?.verified && (
                      <div className="p-1.5 rounded-lg bg-[#181818] border border-[#2b2b2b] text-[10px] font-mono text-[#C4B5FD] flex items-center gap-1.5">
                        <CodeChefIcon size={12} />
                        <span>{competitiveProfiles.codechef.metrics?.secondaryValue}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Character Signature Gear & Bio */}
              <div className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] space-y-1">
                <div className="text-[10px] font-mono text-[#E9A13D] uppercase flex items-center gap-1">
                  <Zap size={11} />
                  <span>Gear: {character.customization?.gear || 'Holo-Blade of Logic'}</span>
                </div>
                <p className="text-[11px] font-mono text-gray-400 leading-relaxed italic">
                  "{character.customization?.bio || 'Building bare-metal logic and high-agency architectures.'}"
                </p>
              </div>
            </div>

            {/* Back Footer Action */}
            <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
              {onOpenCustomizer && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCustomizer();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2d2d2d] text-xs font-mono font-bold text-[#F5F0E5] border border-[#383838] transition-all"
                >
                  Customize Card
                </button>
              )}

              <button
                type="button"
                onClick={handleFlip}
                className="px-3 py-1.5 rounded-lg bg-[#FF8A32] text-black text-xs font-mono font-black hover:bg-[#E9A13D] transition-all flex items-center gap-1 ml-auto"
              >
                <RotateCw size={12} />
                <span>Flip Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

