'use client';

import React from 'react';
import { AttributeStat } from '@/types/character';
import { sound } from '@/lib/sound';

interface AttributeStatsProps {
  attributes: {
    CON: AttributeStat;
    FOC: AttributeStat;
    DIS: AttributeStat;
    STR: AttributeStat;
    WIS: AttributeStat;
  };
  onAttributeClick?: (attr: AttributeStat) => void;
}

export const AttributeStats: React.FC<AttributeStatsProps> = ({
  attributes,
  onAttributeClick,
}) => {
  const statList = [
    attributes.CON,
    attributes.FOC,
    attributes.DIS,
    attributes.STR,
    attributes.WIS,
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full">
      {statList.map((stat) => {
        const percent = Math.min(100, Math.round((stat.value / stat.maxValue) * 100));

        return (
          <div
            key={stat.code}
            onClick={() => {
              sound.playClick();
              if (onAttributeClick) onAttributeClick(stat);
            }}
            className="flex flex-col p-2.5 rounded-lg bg-[#141414] border border-[#262626] hover:border-[#383838] transition-all cursor-pointer group hover:bg-[#181818]"
            title={`${stat.name}: ${stat.description}`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
              <span className="text-gray-400 group-hover:text-white transition-colors">
                {stat.code}
              </span>
              <span
                className="font-black text-sm"
                style={{ color: stat.color || '#F5F0E5' }}
              >
                {stat.value}
              </span>
            </div>

            <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percent}%`,
                  backgroundColor: stat.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

