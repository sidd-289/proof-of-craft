'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  Terminal,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CharacterData } from '@/types/character';
import { UserCompetitiveProfiles } from '@/types/profile';
import {
  GithubIcon,
  LeetCodeIcon,
  CodeforcesIcon,
  CodeChefIcon,
} from '@/components/ui/Icons';
import { sound } from '@/lib/sound';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterData;
  competitiveProfiles?: UserCompetitiveProfiles;
  craftsmanXp: number;
  velocityXp: number;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  character,
  competitiveProfiles,
  craftsmanXp,
  velocityXp,
}) => {
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const auraColor = character.customization?.auraColor || '#FF8A32';
  const avatarUrl = character.avatarUrl || '/assets/character-cyber-craftsman.png';

  // Radar chart math for 5 attributes (CON, FOC, DIS, STR, WIS)
  const attributes = [
    { key: 'STR', val: character.attributes.STR.value, max: 30, color: '#F472B6' },
    { key: 'CON', val: character.attributes.CON.value, max: 30, color: '#FF8A32' },
    { key: 'FOC', val: character.attributes.FOC.value, max: 30, color: '#38BDF8' },
    { key: 'DIS', val: character.attributes.DIS.value, max: 30, color: '#6EE7B7' },
    { key: 'WIS', val: character.attributes.WIS.value, max: 30, color: '#C4B5FD' },
  ];

  const radarRadius = 60;
  const radarCenter = { x: 90, y: 85 };

  const getCoordinates = (index: number, total: number, valueRatio: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = radarRadius * Math.max(0.15, Math.min(1, valueRatio));
    return {
      x: radarCenter.x + r * Math.cos(angle),
      y: radarCenter.y + r * Math.sin(angle),
    };
  };

  const radarPoints = attributes
    .map((attr, idx) => {
      const pt = getCoordinates(idx, attributes.length, attr.val / attr.max);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const handleCopyMarkdown = () => {
    const markdown = `<!-- Proof-of-Craft Developer Identity -->
<div align="center">
  <a href="https://github.com/sidd-289/proof-of-craft">
    <img src="https://img.shields.io/badge/Proof--of--Craft-Level_${character.level}_${encodeURIComponent(
      character.name
    )}-FF8A32?style=for-the-badge&logo=codeforces&logoColor=black" alt="Proof-of-Craft Level" />
    <img src="https://img.shields.io/badge/Craftsman_XP-${craftsmanXp}_XP-E9A13D?style=for-the-badge&logo=github&logoColor=white" alt="Craftsman XP" />
    <img src="https://img.shields.io/badge/Velocity_XP-${velocityXp}_XP-F472B6?style=for-the-badge&logo=fastapi&logoColor=white" alt="Velocity XP" />
  </a>
  <p><em>Verified via Proof-of-Craft: Authentic college systems & algorithmic progression.</em></p>
</div>`;

    navigator.clipboard.writeText(markdown);
    setCopiedMarkdown(true);
    sound.playSuccess();
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  const handleCopyShareText = () => {
    const text = `Proof-of-Craft Progress Update:
Level ${character.level} ${character.title}
Craftsman XP: ${craftsmanXp} | Velocity XP: ${velocityXp}
Verified Developer Proof on GitHub & LeetCode!
Check my progression: https://github.com/sidd-289/proof-of-craft`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    sound.playSuccess();
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Export card as SVG image download
  const handleDownloadSVG = () => {
    if (!cardRef.current) return;
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
        <rect width="100%" height="100%" fill="#101010" />
        <rect x="20" y="20" width="760" height="380" rx="16" fill="#171717" stroke="#333333" stroke-width="2" />
        <text x="50" y="70" fill="#FF8A32" font-family="monospace" font-size="14" font-weight="bold">PROOF-OF-CRAFT // VERIFIED DEVELOPER DOSSIER</text>
        <text x="50" y="115" fill="#F5F0E5" font-family="monospace" font-size="28" font-weight="900">${character.name}</text>
        <text x="50" y="145" fill="#A0A0A0" font-family="monospace" font-size="14">${character.title}</text>
        <text x="50" y="190" fill="#E9A13D" font-family="monospace" font-size="18" font-weight="bold">LEVEL ${character.level} [${character.rank} TIER]</text>
        <text x="50" y="235" fill="#6EE7B7" font-family="monospace" font-size="14">CRAFTSMAN XP: ${craftsmanXp}</text>
        <text x="50" y="260" fill="#C4B5FD" font-family="monospace" font-size="14">VELOCITY XP: ${velocityXp}</text>
        <text x="50" y="300" fill="#FF8A32" font-family="monospace" font-size="13">CON ${character.attributes.CON.value} | FOC ${character.attributes.FOC.value} | DIS ${character.attributes.DIS.value} | STR ${character.attributes.STR.value} | WIS ${character.attributes.WIS.value}</text>
        <text x="50" y="360" fill="#777777" font-family="monospace" font-size="11">AUTHENTICATED PROOF-OF-WORK // ZERO ARTIFICIAL INFLATION</text>
      </svg>
    `;

    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proof-of-craft-${character.name.toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    sound.playSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shareable Proof-of-Craft Developer Card"
    >
      <div className="space-y-6">
        <p className="text-xs text-gray-400 font-mono leading-relaxed">
          Export your authentic proof-of-work status card for your GitHub README, portfolio, or developer resume.
        </p>

        {/* Live Card Preview Box */}
        <div
          ref={cardRef}
          className="relative w-full rounded-2xl bg-gradient-to-br from-[#1b1b1b] via-[#141414] to-[#0c0c0c] border-2 border-[#2f2f2f] p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden"
          style={{ boxShadow: `0 0 30px ${auraColor}18, 0 16px 40px rgba(0,0,0,0.8)` }}
        >
          {/* Subtle Ambient Ring */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: auraColor }}
          />

          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-black px-2 py-0.5 rounded bg-[#FF8A32] uppercase">
                PROOF-OF-CRAFT // VERIFIED
              </span>
              <span className="text-xs font-mono font-bold text-[#E9A13D]">
                LV.{character.level}
              </span>
            </div>
            <div className="text-[11px] font-mono text-gray-400">
              Tier: <span className="text-[#F5F0E5] font-bold uppercase">{character.rank}</span>
            </div>
          </div>

          {/* Card Body: Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-center">
            {/* Left 4 Cols: Character Portrait & Name */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#101010] border-2 border-[#383838] shadow-md relative mb-2 flex items-center justify-center">
                <img
                  src={avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base font-mono font-black text-[#F5F0E5] tracking-wide">
                {character.name}
              </h3>
              <p className="text-[11px] font-mono text-gray-400 leading-tight">
                {character.title}
              </p>
            </div>

            {/* Middle 4 Cols: Dual Mastery & Attribute Gauges */}
            <div className="md:col-span-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-[#6EE7B7] font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> Craftsman XP
                  </span>
                  <span className="text-[#F5F0E5] font-black">{craftsmanXp}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1e1e1e] overflow-hidden">
                  <div
                    className="h-full bg-[#6EE7B7] rounded-full"
                    style={{ width: `${Math.min(100, (craftsmanXp / 1500) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-[#C4B5FD] font-bold flex items-center gap-1">
                    <Zap size={12} /> Velocity XP
                  </span>
                  <span className="text-[#F5F0E5] font-black">{velocityXp}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1e1e1e] overflow-hidden">
                  <div
                    className="h-full bg-[#C4B5FD] rounded-full"
                    style={{ width: `${Math.min(100, (velocityXp / 1500) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Attributes Mini Strip */}
              <div className="grid grid-cols-5 gap-1 pt-1 text-center font-mono">
                {attributes.map((attr) => (
                  <div key={attr.key} className="p-1 rounded bg-[#161616] border border-[#262626]">
                    <div className="text-[9px] text-gray-400">{attr.key}</div>
                    <div className="text-[11px] font-black" style={{ color: attr.color }}>
                      {attr.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: 5-Axis Spider Radar Chart */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <svg width="180" height="170" viewBox="0 0 180 170" className="overflow-visible">
                {/* Background Concentric Radar Rings */}
                {[0.3, 0.6, 1].map((scale, i) => {
                  const points = attributes
                    .map((_, idx) => {
                      const pt = getCoordinates(idx, attributes.length, scale);
                      return `${pt.x},${pt.y}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={i}
                      points={points}
                      fill="none"
                      stroke="#2d2d2d"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Radar Axis Lines */}
                {attributes.map((_, idx) => {
                  const pt = getCoordinates(idx, attributes.length, 1);
                  return (
                    <line
                      key={idx}
                      x1={radarCenter.x}
                      y1={radarCenter.y}
                      x2={pt.x}
                      y2={pt.y}
                      stroke="#2d2d2d"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Filled Radar Area */}
                <polygon
                  points={radarPoints}
                  fill={auraColor}
                  fillOpacity="0.3"
                  stroke={auraColor}
                  strokeWidth="2"
                />

                {/* Stat Labels */}
                {attributes.map((attr, idx) => {
                  const pt = getCoordinates(idx, attributes.length, 1.25);
                  return (
                    <text
                      key={attr.key}
                      x={pt.x}
                      y={pt.y + 4}
                      fill={attr.color}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {attr.key}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Bottom Card Footer: Verified Platform Badges */}
          <div className="pt-3 border-t border-[#242424] flex items-center justify-between flex-wrap gap-2 text-[10px] font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              {competitiveProfiles?.github?.verified && (
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#2d2d2d] text-gray-300 flex items-center gap-1">
                  <GithubIcon size={11} />
                  <span>{competitiveProfiles.github.username}</span>
                  <span className="text-[#888888]">({competitiveProfiles.github.metrics?.primaryValue} repos)</span>
                </span>
              )}
              {competitiveProfiles?.leetcode?.verified && (
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#2d2d2d] text-[#FFA116] flex items-center gap-1">
                  <LeetCodeIcon size={11} />
                  <span>{competitiveProfiles.leetcode.metrics?.primaryValue} Solved</span>
                </span>
              )}
              {competitiveProfiles?.codeforces?.verified && (
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#2d2d2d] text-[#38BDF8] flex items-center gap-1">
                  <CodeforcesIcon size={11} />
                  <span>{competitiveProfiles.codeforces.metrics?.primaryValue} RTG</span>
                </span>
              )}
              {competitiveProfiles?.codechef?.verified && (
                <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#2d2d2d] text-[#C4B5FD] flex items-center gap-1">
                  <CodeChefIcon size={11} />
                  <span>{competitiveProfiles.codechef.metrics?.secondaryValue}</span>
                </span>
              )}
            </div>

            <span className="text-gray-500">proof-of-craft.dev</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleDownloadSVG}
            className="py-2.5 px-3 rounded-xl bg-[#222222] hover:bg-[#2b2b2b] text-[#F5F0E5] border border-[#383838] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Download size={14} className="text-[#FF8A32]" />
            <span>Download SVG Image</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="py-2.5 px-3 rounded-xl bg-[#222222] hover:bg-[#2b2b2b] text-[#F5F0E5] border border-[#383838] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {copiedMarkdown ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">Copied Markdown!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-[#E9A13D]" />
                <span>Copy README Snippet</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyShareText}
            className="py-2.5 px-3 rounded-xl bg-[#FF8A32] hover:bg-[#E9A13D] text-black text-xs font-mono font-black flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {copiedText ? (
              <>
                <Check size={14} />
                <span>Copied Update!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Copy Share Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
