'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CharacterIllustrationProps {
  avatarUrl?: string;
  accentColor?: string;
}

export const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({
  avatarUrl = '/assets/character.png',
  accentColor = '#FF8A32',
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] flex items-end justify-center overflow-hidden">
      {/* Background Anime Energy Atmosphere & Geometric Crest */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Ambient Darkened Disc */}
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-[#1e1e1e] border border-[#2e2e2e]/50 opacity-80" />

        {/* Cyber / Magic Geometric Ring */}
        <div
          className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-[#FF8A32]/30 opacity-60 animate-[spin_60s_linear_infinite]"
          style={{ borderStyle: 'dashed' }}
        />
        <div className="absolute w-48 h-48 rounded-full border border-[#E9A13D]/25 opacity-40" />
      </div>

      {/* Anime Character Artwork */}
      {!imageError ? (
        <motion.img
          src={avatarUrl}
          alt="Character Avatar"
          onError={() => setImageError(true)}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-[320px] sm:max-w-[380px] h-auto object-contain max-h-[380px] sm:max-h-[420px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] pointer-events-none select-none"
        />
      ) : (
        /* Dynamic SVG High-Res Anime Protagonist Silhouette Fallback */
        <div className="relative z-10 flex flex-col items-center justify-end pb-4 text-center">
          <svg
            className="w-56 h-72 text-gray-400"
            viewBox="0 0 200 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 20 C85 20, 70 35, 70 55 C70 70, 80 82, 92 88 C60 100, 40 130, 35 180 C32 210, 30 250, 30 300 L170 300 C170 250, 168 210, 165 180 C160 130, 140 100, 108 88 C120 82, 130 70, 130 55 C130 35, 115 20, 100 20 Z"
              fill="url(#char-gradient)"
            />
            <defs>
              <linearGradient id="char-gradient" x1="100" y1="20" x2="100" y2="300" gradientUnits="userSpaceOnUse">
                <stop stopColor="#303030" />
                <stop offset="1" stopColor="#171717" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Subtle Bottom Ambient Gradient Overlay for Natural Card Blending */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#171717] via-[#171717]/60 to-transparent pointer-events-none z-20" />
    </div>
  );
};
