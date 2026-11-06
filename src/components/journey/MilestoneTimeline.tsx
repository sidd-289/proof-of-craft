'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Trophy,
  Zap,
  ShieldCheck,
  Bot,
  Plus,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { Milestone } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LogMilestoneModal } from './LogMilestoneModal';

interface MilestoneTimelineProps {
  milestones: Milestone[];
  onLogMilestone: (milestone: Omit<Milestone, 'id'>) => void;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  onLogMilestone,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const filteredMilestones = milestones.filter((m) => {
    if (filterType === 'all') return true;
    if (filterType === 'college') return m.type === 'college_lab' || m.type === 'coursework';
    if (filterType === 'hackathons') return m.type === 'hackathon' || m.type === 'competition';
    if (filterType === 'projects') return m.type === 'personal_project';
    return true;
  });

  const getAuthorshipBadge = (authorship: Milestone['authorship']) => {
    switch (authorship) {
      case 'handcrafted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16271e] text-[#6ee7b7] border border-[#6ee7b7]/50 text-xs font-mono font-bold">
            <ShieldCheck size={14} /> 100% Hand-Crafted (Core Skill)
          </span>
        );
      case 'assisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#251e33] text-[#c4b5fd] border border-[#c4b5fd]/50 text-xs font-mono font-bold">
            <Zap size={14} /> AI-Assisted (Pair-Programmed)
          </span>
        );
      case 'ai_generated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#271e26] text-[#f472b6] border border-[#f472b6]/50 text-xs font-mono font-bold">
            <Bot size={14} /> Vibe-Coded (Velocity Only)
          </span>
        );
    }
  };

  const getTypeIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'college_lab':
      case 'coursework':
        return <GraduationCap size={18} className="text-[#6ee7b7]" />;
      case 'hackathon':
      case 'competition':
        return <Trophy size={18} className="text-[#fde047]" />;
      default:
        return <Zap size={18} className="text-[#c4b5fd]" />;
    }
  };

  return (
    <div>
      {/* Action & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: `All Milestones (${milestones.length})` },
            { id: 'college', label: 'College & Labs' },
            { id: 'hackathons', label: 'Hackathons' },
            { id: 'projects', label: 'Personal Projects' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 transition-all shadow-[2px_2px_0px_#000] whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-white text-black border-black'
                  : 'bg-[#14161c] text-gray-300 border-[#2d323d] hover:border-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button variant="mint" size="sm" onClick={() => setIsLogModalOpen(true)}>
          <Plus size={16} />
          <span>Log Milestone</span>
        </Button>
      </div>

      {/* Timeline Feed */}
      {filteredMilestones.length === 0 ? (
        <div className="brutal-card p-12 text-center border-dashed border-[#383e4d]">
          <Trophy size={40} className="mx-auto text-gray-600 mb-3" />
          <h4 className="text-base font-bold text-gray-300 mb-1">No milestones logged in this category</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Record a college lab, an algorithm implementation, or a hackathon submission to track your genuine growth.
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsLogModalOpen(true)}>
            <Plus size={14} /> Log Milestone
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMilestones.map((item) => (
            <div
              key={item.id}
              className="brutal-card p-5 bg-[#14161c] border-2 border-[#2d323d] hover:border-gray-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1b1e26] border-2 border-[#2d323d] shadow-[2px_2px_0px_#000] flex-shrink-0 mt-0.5">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white leading-snug mb-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {item.date}
                      </span>
                      {item.outcome && (
                        <span className="flex items-center gap-1 text-amber-300 font-bold">
                          <CheckCircle size={13} /> {item.outcome}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Authorship Pill */}
                <div className="flex-shrink-0">
                  {getAuthorshipBadge(item.authorship)}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 mb-3.5 leading-relaxed bg-[#191c24] p-3 rounded-xl border border-[#272b35]">
                {item.description}
              </p>

              {/* Tech Stack & XP Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#232733]">
                <div className="flex flex-wrap gap-1.5">
                  {item.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e222b] text-gray-300 border border-[#2d323d]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* XP Breakdown */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  {item.xpAwarded.craftsmanXp > 0 && (
                    <span className="px-2 py-0.5 rounded bg-[#6ee7b7]/15 text-[#6ee7b7] font-bold border border-[#6ee7b7]/30">
                      +{item.xpAwarded.craftsmanXp} Craftsman XP
                    </span>
                  )}
                  {item.xpAwarded.velocityXp > 0 && (
                    <span className="px-2 py-0.5 rounded bg-[#c4b5fd]/15 text-[#c4b5fd] font-bold border border-[#c4b5fd]/30">
                      +{item.xpAwarded.velocityXp} Velocity XP
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Milestone Modal */}
      <LogMilestoneModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onLog={onLogMilestone}
      />
    </div>
  );
};

