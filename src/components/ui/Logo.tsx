'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 36, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-[#141414] border border-[#2d2d2d] shadow-[0_0_16px_rgba(255,138,50,0.2)] overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF8A32]/20 via-[#E9A13D]/10 to-transparent pointer-events-none" />

      {/* Bespoke Geometric Crest SVG */}
      <svg
        width={Math.round(size * 0.65)}
        height={Math.round(size * 0.65)}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="logo-grad-primary" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF8A32" />
            <stop offset="100%" stopColor="#E9A13D" />
          </linearGradient>
          <linearGradient id="logo-grad-accent" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF8A32" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Angular Shield Hexagon */}
        <polygon
          points="16,2 29,8 29,24 16,30 3,24 3,8"
          stroke="url(#logo-grad-primary)"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="#171717"
          fillOpacity="0.75"
        />

        {/* Inner Chevron Core / Ascend Symbol */}
        <path
          d="M16 7L24 13L16 19L8 13L16 7Z"
          fill="url(#logo-grad-primary)"
        />
        <path
          d="M16 14L22 18.5L16 23L10 18.5L16 14Z"
          fill="url(#logo-grad-accent)"
        />

        {/* Central Core Dot */}
        <circle cx="16" cy="18.5" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

