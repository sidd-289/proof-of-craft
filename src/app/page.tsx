'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bookmark,
  Play,
  Trophy,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CommandBar } from '@/components/agent/CommandBar';
import { AgentResultModal } from '@/components/agent/AgentResultModal';
import { LevelUpCelebration } from '@/components/gamification/LevelUpCelebration';
import { WebsiteGrid } from '@/components/vault/WebsiteGrid';
import { VideoQueue } from '@/components/youtube/VideoQueue';
import { MilestoneTimeline } from '@/components/journey/MilestoneTimeline';
import { SkillTree } from '@/components/gamification/SkillTree';
import { CharacterDashboard } from '@/components/character/CharacterDashboard';
import { INITIAL_CHARACTER_DATA } from '@/types/character';
import { useTrackerStore } from '@/lib/store';
import { AgentActionExecution } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { INITIAL_CATEGORIES, INITIAL_MILESTONES, INITIAL_SKILLS, INITIAL_USER_PROFILE, INITIAL_WEBSITES, INITIAL_YOUTUBE_VIDEOS } from '@/lib/initial-data';

export default function Home() {
  const store = useTrackerStore();
  const [activeTab, setActiveTab] = useState<'focus' | 'vault' | 'youtube' | 'journey' | 'skills'>('focus');
  const [agentResult, setAgentResult] = useState<AgentActionExecution | null>(null);

  if (!store.isLoaded) {
    return (
      <div className="min-h-screen bg-[#0c0d11] flex items-center justify-center">
        <div className="text-center font-mono">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your digital tracker...</p>
        </div>
      </div>
    );
  }

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const toWatchVideos = store.youtubeVideos.filter((v) => v.status === 'to_watch').slice(0, 2);
  const recentWebsites = store.websites.slice(0, 3);
  const latestMilestone = store.milestones[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d11] text-[#f4f4f6]">
      {/* Top Header */}
      <Header
        profile={store.profile}
        onSaveApiKey={store.setGeminiApiKey}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation Tabs (Minimal Neo-Brutalist Pill Switcher) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar border-b border-[#232733]">
          {[
            { id: 'focus', label: '🏠 Daily Focus' },
            { id: 'vault', label: `🔖 Vault (${store.websites.length})` },
            { id: 'youtube', label: `🎬 YouTube (${store.youtubeVideos.filter(v => v.status === 'to_watch').length})` },
            { id: 'journey', label: `⚔️ Journey & Labs (${store.milestones.length})` },
            { id: 'skills', label: `🌳 Skill Matrix (${store.skills.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold border-2 transition-all shadow-[2px_2px_0px_#000] whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-black border-black shadow-[3px_3px_0px_#000]'
                    : 'bg-[#14161c] text-gray-300 border-[#2d323d] hover:border-gray-400'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Global Agent Command Bar (Prompt & Done) */}
        <CommandBar
          context={{
            categories: store.categories,
            websites: store.websites,
            youtubeVideos: store.youtubeVideos,
            skills: store.skills,
            onAddWebsite: store.addWebsite,
            onAddYouTube: store.addYouTubeVideo,
            onMarkVideoWatched: store.markVideoWatched,
            onLogMilestone: store.logMilestone,
            onAwardXp: store.awardXpToSkill,
            geminiApiKey: store.profile.geminiApiKey,
          }}
          onExecutionComplete={(result) => setAgentResult(result)}
        />

        {/* TAB 1: DAILY FOCUS DASHBOARD */}
        {activeTab === 'focus' && (
          <div className="space-y-8">
            {/* Anime RPG Character Progression Card */}
            <CharacterDashboard
              initialData={{
                ...INITIAL_CHARACTER_DATA,
                name: store.profile.name || 'Sidd',
                streakDays: store.profile.streakDays,
                totalAchievements: store.milestones.length,
                totalXp: store.profile.totalCraftsmanXp + store.profile.totalVelocityXp + store.profile.totalKnowledgeXp,
                attributes: {
                  ...INITIAL_CHARACTER_DATA.attributes,
                  CON: {
                    ...INITIAL_CHARACTER_DATA.attributes.CON,
                    value: Math.min(30, 15 + store.profile.streakDays),
                  },
                  STR: {
                    ...INITIAL_CHARACTER_DATA.attributes.STR,
                    value: Math.min(30, Math.floor(store.profile.totalCraftsmanXp / 50)),
                  },
                  WIS: {
                    ...INITIAL_CHARACTER_DATA.attributes.WIS,
                    value: Math.min(30, Math.floor(store.profile.totalKnowledgeXp / 30)),
                  },
                },
              }}
            />

            {/* Dual Radar XP & Track Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Craftsman Box */}
              <div className="brutal-card p-5 bg-[#141b18] border-2 border-[#6ee7b7]/60 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#6ee7b7]">
                    <ShieldCheck size={20} />
                    <span className="font-mono text-sm font-bold uppercase tracking-wider">
                      Craftsman Mastery
                    </span>
                  </div>
                  <Badge variant="craftsman">100% Core Code</Badge>
                </div>
                <div className="text-3xl font-mono font-black text-white mb-1">
                  {store.profile.totalCraftsmanXp} <span className="text-sm text-gray-400 font-normal">XP</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Gained from college labs, coursework, manual debugging, and scratch implementations. Never artificially inflated by AI-generated boilerplate.
                </p>
                <Button
                  variant="mint"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveTab('journey')}
                >
                  View College Labs & Coursework <ArrowRight size={14} />
                </Button>
              </div>

              {/* Velocity Box */}
              <div className="brutal-card p-5 bg-[#1b1725] border-2 border-[#c4b5fd]/60 shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#c4b5fd]">
                    <Zap size={20} />
                    <span className="font-mono text-sm font-bold uppercase tracking-wider">
                      AI & Velocity Mastery
                    </span>
                  </div>
                  <Badge variant="velocity">Rapid Shipping</Badge>
                </div>
                <div className="text-3xl font-mono font-black text-white mb-1">
                  {store.profile.totalVelocityXp} <span className="text-sm text-gray-400 font-normal">XP</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Gained from hackathon MVPs, prompt engineering, multi-agent pipelines, and high-speed product prototyping.
                </p>
                <Button
                  variant="violet"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setActiveTab('skills')}
                >
                  View Tech Skill Tree <ArrowRight size={14} />
                </Button>
              </div>
            </div>

            {/* UP NEXT TO WATCH (YouTube Mini-Queue) */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Play size={18} className="text-amber-400 fill-amber-400" />
                  <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                    Up Next to Watch ({store.youtubeVideos.filter((v) => v.status === 'to_watch').length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('youtube')}
                  className="text-xs font-mono text-amber-300 hover:underline flex items-center gap-1"
                >
                  Full Watch Queue <ArrowRight size={12} />
                </button>
              </div>

              {toWatchVideos.length === 0 ? (
                <div className="brutal-card p-6 text-center text-gray-400 text-xs">
                  Your Watch queue is clear! Paste a YouTube URL in the bar above to queue video learning.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toWatchVideos.map((video) => (
                    <div
                      key={video.id}
                      className="brutal-card p-3.5 flex flex-col sm:flex-row gap-3.5 items-center justify-between hover:border-gray-300"
                    >
                      <div className="relative w-full sm:w-36 aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0 border border-[#2d323d]">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        {video.duration && (
                          <div className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-xs font-mono text-white">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <h4 className="text-xs font-bold text-white truncate mb-1">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-mono mb-2">
                          {video.channelTitle}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="mint"
                            size="sm"
                            className="py-1 px-2.5 text-[11px]"
                            onClick={() => store.markVideoWatched(video.id)}
                          >
                            <CheckCircle2 size={13} /> Mark Watched (+35 XP)
                          </Button>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#1f222a] text-gray-300 hover:text-white border border-[#2d323d]"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECENT VAULT WEBSITES & LATEST MILESTONE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookmarks */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <Bookmark size={18} className="text-[#93c5fd]" />
                    <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                      Recently Saved Resources
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('vault')}
                    className="text-xs font-mono text-[#93c5fd] hover:underline flex items-center gap-1"
                  >
                    View All Vault <ArrowRight size={12} />
                  </button>
                </div>

                <div className="space-y-3">
                  {recentWebsites.map((site) => (
                    <div
                      key={site.id}
                      className="brutal-card p-3.5 flex items-center justify-between gap-3 hover:border-gray-300"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate mb-1">
                          {site.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 truncate mb-1">
                          {site.description || site.url}
                        </p>
                        <div className="flex gap-1">
                          {site.tags.slice(0, 2).map((t, i) => (
                            <span
                              key={i}
                              className="text-xs font-mono px-1.5 py-0.2 rounded bg-[#1e222b] text-gray-400 border border-[#2d323d]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#1b1e26] text-white hover:bg-white hover:text-black transition-colors border border-[#383e4d] flex-shrink-0"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Milestone */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-amber-400" />
                    <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                      Latest Verified Milestone
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('journey')}
                    className="text-xs font-mono text-amber-300 hover:underline flex items-center gap-1"
                  >
                    Full Timeline <ArrowRight size={12} />
                  </button>
                </div>

                {latestMilestone && (
                  <div className="brutal-card p-4.5 bg-[#14161c] border-2 border-[#2d323d]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-400">
                        {latestMilestone.date}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#6ee7b7] px-2 py-0.5 rounded bg-[#16271e] border border-[#6ee7b7]/40">
                        {latestMilestone.authorship === 'handcrafted' ? '100% Handcrafted' : 'AI-Assisted'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                      {latestMilestone.title}
                    </h4>

                    <p className="text-xs text-gray-300 leading-relaxed mb-3.5 bg-[#1a1d24] p-3 rounded-lg border border-[#272b35]">
                      {latestMilestone.description}
                    </p>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-300 font-bold">
                        {latestMilestone.outcome}
                      </span>
                      <span className="text-emerald-400 font-bold">
                        +{latestMilestone.xpAwarded.craftsmanXp || latestMilestone.xpAwarded.velocityXp} XP Awarded
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KNOWLEDGE VAULT */}
        {activeTab === 'vault' && (
          <WebsiteGrid
            websites={store.websites}
            categories={store.categories}
            onAddWebsite={store.addWebsite}
            onDeleteWebsite={store.deleteWebsite}
            onUpdateWebsite={store.updateWebsite}
          />
        )}

        {/* TAB 3: YOUTUBE HUB */}
        {activeTab === 'youtube' && (
          <VideoQueue
            videos={store.youtubeVideos}
            categories={store.categories}
            onAddVideo={store.addYouTubeVideo}
            onUpdateVideo={store.updateYouTubeVideo}
            onDeleteVideo={store.deleteYouTubeVideo}
            onMarkWatched={store.markVideoWatched}
          />
        )}

        {/* TAB 4: JOURNEY & HACKATHONS */}
        {activeTab === 'journey' && (
          <MilestoneTimeline
            milestones={store.milestones}
            onLogMilestone={store.logMilestone}
          />
        )}

        {/* TAB 5: SKILL MATRIX */}
        {activeTab === 'skills' && (
          <SkillTree
            skills={store.skills}
            onPracticeSkill={(name, xp, track) => store.awardXpToSkill(name, xp, track)}
          />
        )}
      </main>

      {/* Interactive Level-Up Celebration Modal (Confetti + Fanfare) */}
      <LevelUpCelebration
        event={store.activeLevelUp}
        onDismiss={() => store.setActiveLevelUp(null)}
      />

      {/* Agent Execution Feedback Card */}
      <AgentResultModal
        result={agentResult}
        onClose={() => setAgentResult(null)}
        onNavigateTab={(tab) => setActiveTab(tab as any)}
      />
    </div>
  );
}
