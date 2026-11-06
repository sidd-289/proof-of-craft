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
  RefreshCw,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { Milestone } from '@/types';
import { UserCompetitiveProfiles } from '@/types/profile';
import { Button } from '@/components/ui/Button';
import {
  GithubIcon,
  LeetCodeIcon,
  CodeforcesIcon,
} from '@/components/ui/Icons';
import { LogMilestoneModal } from './LogMilestoneModal';
import { sound } from '@/lib/sound';

interface MilestoneTimelineProps {
  milestones: Milestone[];
  onLogMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onSyncActivity?: () => Promise<{ count: number; xp: number }>;
  competitiveProfiles?: UserCompetitiveProfiles;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  onLogMilestone,
  onSyncActivity,
  competitiveProfiles,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const filteredMilestones = milestones.filter((m) => {
    if (filterType === 'all') return true;
    if (filterType === 'college') return m.type === 'college_lab' || m.type === 'coursework';
    if (filterType === 'hackathons') return m.type === 'hackathon' || m.type === 'competition';
    if (filterType === 'projects') return m.type === 'personal_project';
    if (filterType === 'verified') return m.outcome?.includes('Verified') || m.outcome?.includes('Accepted');
    return true;
  });

  const handleTriggerSync = async () => {
    if (!onSyncActivity || isSyncing) return;
    setIsSyncing(true);
    setSyncFeedback(null);
    sound.playClick();

    try {
      const res = await onSyncActivity();
      if (res.count > 0) {
        setSyncFeedback(`Successfully synced ${res.count} verified milestones (+${res.xp} XP)!`);
        sound.playSuccess();
      } else {
        setSyncFeedback('All platform activity is up to date.');
      }
    } catch (err: any) {
      setSyncFeedback(err.message || 'Failed to sync platform activity.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  const getAuthorshipBadge = (authorship: Milestone['authorship']) => {
    switch (authorship) {
      case 'handcrafted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16271e] text-[#6ee7b7] border border-[#6ee7b7]/50 text-xs font-mono font-bold">
            <ShieldCheck size={14} /> 100% Hand-Crafted
          </span>
        );
      case 'assisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#251e33] text-[#c4b5fd] border border-[#c4b5fd]/50 text-xs font-mono font-bold">
            <Zap size={14} /> AI-Assisted
          </span>
        );
      case 'ai_generated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#271e26] text-[#f472b6] border border-[#f472b6]/50 text-xs font-mono font-bold">
            <Bot size={14} /> Vibe-Coded
          </span>
        );
    }
  };

  const getTypeIcon = (item: Milestone) => {
    if (item.title.startsWith('Git Push') || item.title.startsWith('Created Repository')) {
      return <GithubIcon size={18} className="text-[#F5F0E5]" />;
    }
    if (item.title.startsWith('Solved LeetCode')) {
      return <LeetCodeIcon size={18} className="text-[#FFA116]" />;
    }
    if (item.title.startsWith('Passed Codeforces')) {
      return <CodeforcesIcon size={18} className="text-[#38BDF8]" />;
    }

    switch (item.type) {
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

  const hasConnectedProfiles =
    competitiveProfiles &&
    Object.values(competitiveProfiles).some((p) => p?.verified);

  return (
    <div>
      {/* Action & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: `All Milestones (${milestones.length})` },
            { id: 'verified', label: 'Verified Proofs' },
            { id: 'college', label: 'College & Labs' },
            { id: 'hackathons', label: 'Hackathons' },
            { id: 'projects', label: 'Personal Projects' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-[#1e1e1e] text-[#F5F0E5] border-[#FF8A32] shadow-[0_0_12px_rgba(255,138,50,0.2)]'
                  : 'bg-[#141414] text-gray-400 border-[#262626] hover:text-white hover:border-[#383838]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onSyncActivity && (
            <button
              type="button"
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[#F5F0E5] border border-[#2d2d2d] hover:border-[#FF8A32] text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              title="Sync recent commits & LeetCode/Codeforces problem milestones"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin text-[#FF8A32]' : 'text-[#E9A13D]'} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Live Activity'}</span>
            </button>
          )}

          <Button variant="mint" size="sm" onClick={() => setIsLogModalOpen(true)}>
            <Plus size={16} />
            <span>Log Milestone</span>
          </Button>
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="mb-4 p-3 rounded-xl bg-[#162219] border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-400" />
            <span>{syncFeedback}</span>
          </span>
          <button
            onClick={() => setSyncFeedback(null)}
            className="text-gray-400 hover:text-white text-xs font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Timeline Feed */}
      {filteredMilestones.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#141414] border border-dashed border-[#2d2d2d]">
          <Trophy size={40} className="mx-auto text-gray-600 mb-3" />
          <h4 className="text-base font-bold text-gray-300 mb-1">No milestones logged in this category</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4 font-mono">
            Record a college lab, an algorithm implementation, or click "Sync Live Activity" to import your verified GitHub & LeetCode work.
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsLogModalOpen(true)}>
            <Plus size={14} /> Log Milestone
          </Button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredMilestones.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl bg-[#151515] border border-[#262626] hover:border-[#383838] transition-all space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-lg bg-[#1d1d1d] border border-[#2d2d2d] flex-shrink-0 mt-0.5">
                    {getTypeIcon(item)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm sm:text-base font-bold text-[#F5F0E5] font-mono leading-snug truncate">
                        {item.title}
                      </h4>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#FF8A32] transition-colors"
                          title="Open Verified Proof Link"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {item.date}
                      </span>
                      {item.outcome && (
                        <span className="flex items-center gap-1 text-[#E9A13D] font-bold">
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
              <p className="text-xs text-gray-300 leading-relaxed bg-[#111111] p-3 rounded-lg border border-[#222222] font-mono">
                {item.description}
              </p>

              {/* Tech Stack & XP Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#222222]">
                <div className="flex flex-wrap gap-1.5">
                  {item.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* XP Breakdown */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  {item.xpAwarded.craftsmanXp > 0 && (
                    <span className="px-2 py-0.5 rounded bg-[#13271a] text-[#6EE7B7] font-bold border border-[#6EE7B7]/30">
                      +{item.xpAwarded.craftsmanXp} Craftsman XP
                    </span>
                  )}
                  {item.xpAwarded.velocityXp > 0 && (
                    <span className="px-2 py-0.5 rounded bg-[#241b33] text-[#C4B5FD] font-bold border border-[#C4B5FD]/30">
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
