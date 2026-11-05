'use client';

import React from 'react';
import {
  ShieldCheck,
  Zap,
  Cpu,
  GitFork,
  Database,
  Bot,
  Layers,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Skill } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SkillTreeProps {
  skills: Skill[];
  onPracticeSkill: (skillName: string, amount: number, track: 'craftsman' | 'velocity') => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ skills, onPracticeSkill }) => {
  const craftsmanSkills = skills.filter((s) => s.track === 'craftsman');
  const velocitySkills = skills.filter((s) => s.track === 'velocity');

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu size={20} />;
      case 'GitFork':
        return <GitFork size={20} />;
      case 'Database':
        return <Database size={20} />;
      case 'Bot':
        return <Bot size={20} />;
      case 'Layers':
        return <Layers size={20} />;
      default:
        return <Sparkles size={20} />;
    }
  };

  const renderSkillCard = (skill: Skill) => {
    const isCraftsman = skill.track === 'craftsman';
    const percent = Math.min(100, Math.round((skill.xp / skill.nextLevelXp) * 100));

    return (
      <div
        key={skill.id}
        className="brutal-card p-4.5 bg-[#14161c] border-2 border-[#2d323d] hover:border-gray-300 transition-all shadow-[3px_3px_0px_#000]"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]"
              style={{
                backgroundColor: isCraftsman ? '#6ee7b7' : '#c4b5fd',
                color: '#0c0d11',
              }}
            >
              {getSkillIcon(skill.icon)}
            </div>

            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{skill.name}</h4>
              <p className="text-[11px] text-gray-400 font-mono">{skill.category}</p>
            </div>
          </div>

          {/* Level Pill */}
          <div className="text-right flex-shrink-0">
            <div
              className="text-base font-black font-mono"
              style={{ color: isCraftsman ? '#6ee7b7' : '#c4b5fd' }}
            >
              Lv. {skill.level}
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e222b] text-amber-300 border border-[#2d323d] uppercase font-bold">
              {skill.tier}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {skill.description}
        </p>

        {/* Segmented XP Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-1">
            <span>XP Progress</span>
            <span>
              {skill.xp} / {skill.nextLevelXp} XP ({percent}%)
            </span>
          </div>

          <div className="h-2.5 w-full bg-[#1b1e26] rounded-full border border-[#2d323d] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percent}%`,
                backgroundColor: isCraftsman ? '#6ee7b7' : '#c4b5fd',
              }}
            />
          </div>
        </div>

        {/* Practice Button */}
        <button
          onClick={() => onPracticeSkill(skill.name, 120, skill.track)}
          className={`w-full py-1.5 px-3 rounded-lg text-xs font-mono font-bold border-2 transition-all shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 ${
            isCraftsman
              ? 'bg-[#1b261f] text-[#6ee7b7] border-[#6ee7b7]/40 hover:bg-[#6ee7b7] hover:text-black hover:border-black'
              : 'bg-[#221c29] text-[#c4b5fd] border-[#c4b5fd]/40 hover:bg-[#c4b5fd] hover:text-black hover:border-black'
          }`}
        >
          <Sparkles size={13} />
          <span>Practice & Gain XP (+120 XP)</span>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Craftsman Track */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#6ee7b7] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Craftsman Track (Foundational & Handcrafted)
              </h3>
              <p className="text-xs text-gray-400">
                Gained exclusively from college labs, coursework, and pure hand-written code.
              </p>
            </div>
          </div>
          <Badge variant="craftsman">Core Mastery</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {craftsmanSkills.map(renderSkillCard)}
        </div>
      </div>

      {/* Velocity Track */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#c4b5fd] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Velocity Track (AI Orchestration & Rapid Shipping)
              </h3>
              <p className="text-xs text-gray-400">
                Gained from hackathons, AI prompting, tool assembling, and fast prototyping.
              </p>
            </div>
          </div>
          <Badge variant="velocity">High-Speed Prototyping</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {velocitySkills.map(renderSkillCard)}
        </div>
      </div>
    </div>
  );
};

