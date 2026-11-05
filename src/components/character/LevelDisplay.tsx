'use client';

import React from 'react';

interface LevelDisplayProps {
  name: string;
  title?: string;
  level: number;
}

export const LevelDisplay: React.FC<LevelDisplayProps> = ({ name, title, level }) => {
  return (
    <div className="flex flex-col mb-4">
      <h3 className="text-xl sm:text-2xl font-black text-[#F5F0E5] tracking-tight leading-none mb-1">
        {name}
      </h3>
      {title && (
        <p className="text-[11px] font-mono tracking-wider text-gray-400 uppercase mb-3">
          {title}
        </p>
      )}

      <div className="flex items-baseline gap-2">
        <span className="text-sm font-mono font-bold tracking-widest text-[#FF8A32] uppercase">
          LV
        </span>
        <span
          className="text-6xl sm:text-7xl font-black font-mono text-[#F5F0E5] tracking-tighter leading-none select-none"
          style={{
            textShadow: '3px 3px 0px #FF8A32',
          }}
        >
          {level}
        </span>
      </div>
    </div>
  );
};
