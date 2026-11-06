'use client';

import React, { useState, useEffect } from 'react';
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
  Compass,
  PlaySquare,
  Shield,
  Layers,
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

  // Auto-capture OAuth redirect callback (e.g. GitHub Sign-in)
  useEffect(() => {
    if (typeof window === 'undefined' || !store.isLoaded) return;
    const params = new URLSearchParams(window.location.search);
    const authSuccess = params.get('auth_success');
    const username = params.get('username');
    const token = params.get('token');

    if (authSuccess === 'github' && username) {
      fetch('/api/verify-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'github',
          username,
          apiKey: token || undefined,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            store.saveCompetitiveProfile('github', {
              platform: 'github',
              username: data.username,
              apiKey: token || undefined,
              verified: true,
              verifiedAt: data.verifiedAt || new Date().toISOString(),
              metrics: data.metrics,
            });
          }
        })
        .catch(console.error)
        .finally(() => {
          // Clean URL params without page reload
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        });
    }
  }, [store.isLoaded]);

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

  // Dynamic player progression calculations
  const totalPlayerXp = store.profile.totalCraftsmanXp + store.profile.totalVelocityXp + store.profile.totalKnowledgeXp;
  const currentLevel = Math.max(1, Math.floor(totalPlayerXp / 250) + 1);
  const currentLevelBaseXp = (currentLevel - 1) * 250;
  const currentXpProgress = Math.max(0, totalPlayerXp - currentLevelBaseXp);
  const nextLevelRequirement = 250;

  return (
    <div className="min-h-screen flex flex-col bg-[#101010] text-[#F5F0E5]">
      {/* Top Header */}
      <Header
        profile={store.profile}
        onSaveApiKey={store.setGeminiApiKey}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation Tabs (Sleek Anime RPG HUD Switcher) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar border-b border-[#222222]">
          {[
            { id: 'focus', label: 'Daily Focus', icon: Compass, count: null },
            { id: 'vault', label: 'Vault', icon: Bookmark, count: store.websites.length },
            { id: 'youtube', label: 'YouTube', icon: PlaySquare, count: store.youtubeVideos.filter((v) => v.status === 'to_watch').length },
            { id: 'journey', label: 'Journey & Labs', icon: Shield, count: store.milestones.length },
            { id: 'skills', label: 'Skill Matrix', icon: Layers, count: store.skills.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold border transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1e1e1e] text-[#F5F0E5] border-[#FF8A32] shadow-[0_0_12px_rgba(255,138,50,0.18)]'
                    : 'bg-[#141414] text-[#888888] border-[#242424] hover:text-[#F5F0E5] hover:border-[#383838]'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#FF8A32]' : 'text-[#777777]'} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-[#2a2a2a] text-[#FF8A32]' : 'bg-[#1a1a1a] text-[#666666]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
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
            {/* Anime RPG Character Progression Card (Hero Status Screen) */}
            <CharacterDashboard
              initialData={{
                ...INITIAL_CHARACTER_DATA,
                name: store.profile.name || 'Sidd',
                title: store.profile.title || 'Cyber Craftsman & System Architect',
                avatarUrl: store.profile.avatarUrl || '/assets/character-cyber-craftsman.png',
                customization: store.profile.characterCustomization || INITIAL_CHARACTER_DATA.customization,
                level: currentLevel,
                currentXp: currentXpProgress,
                nextLevelXp: nextLevelRequirement,
                streakDays: store.profile.streakDays,
                totalAchievements: store.milestones.length,
                totalXp: totalPlayerXp,
                attributes: {
                  CON: {
                    ...INITIAL_CHARACTER_DATA.attributes.CON,
                    value: Math.min(
                      30,
                      12 + store.profile.streakDays + (store.profile.competitiveProfiles?.github?.verified ? 3 : 0)
                    ),
                  },
                  FOC: {
                    ...INITIAL_CHARACTER_DATA.attributes.FOC,
                    value: Math.min(
                      30,
                      8 +
                        store.youtubeVideos.filter((v) => v.status === 'watched').length * 2 +
                        (store.profile.competitiveProfiles?.leetcode?.verified ? 4 : 0)
                    ),
                  },
                  DIS: {
                    ...INITIAL_CHARACTER_DATA.attributes.DIS,
                    value: Math.min(
                      30,
                      10 +
                        store.milestones.filter((m) => m.authorship === 'handcrafted').length * 4 +
                        (store.profile.competitiveProfiles?.codeforces?.verified ? 4 : 0)
                    ),
                  },
                  STR: {
                    ...INITIAL_CHARACTER_DATA.attributes.STR,
                    value: Math.min(
                      30,
                      8 +
                        Math.floor(store.profile.totalCraftsmanXp / 50) +
                        (store.profile.competitiveProfiles?.leetcode?.verified ? 3 : 0)
                    ),
                  },
                  WIS: {
                    ...INITIAL_CHARACTER_DATA.attributes.WIS,
                    value: Math.min(
                      30,
                      8 +
                        Math.floor((store.profile.totalKnowledgeXp + store.profile.totalVelocityXp) / 45) +
                        (store.profile.competitiveProfiles?.github?.verified ? 3 : 0) +
                        (store.profile.competitiveProfiles?.codechef?.verified ? 4 : 0)
                    ),
                  },
                },
              }}
              competitiveProfiles={store.profile.competitiveProfiles}
              geminiApiKey={store.profile.geminiApiKey}
              onSaveCompetitiveProfile={store.saveCompetitiveProfile}
              onRemoveCompetitiveProfile={store.removeCompetitiveProfile}
              onUpdateProfile={store.updateProfile}
            />

            {/* Dual Mastery Specialization Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Craftsman Box */}
              <div className="p-5 rounded-2xl bg-[#171717] border border-[#282828] hover:border-[#E9A13D]/50 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#E9A13D]">
                    <ShieldCheck size={20} />
                    <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E5]">
                      Craftsman Discipline
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#241c10] text-[#E9A13D] border border-[#E9A13D]/40">
                    100% Core Code
                  </span>
                </div>
                <div className="text-3xl font-mono font-black text-[#F5F0E5] mb-1">
                  {store.profile.totalCraftsmanXp} <span className="text-xs text-[#777777] font-normal">XP</span>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed mb-4">
                  Gained from college labs, coursework, manual debugging, and scratch implementations. Never artificially inflated by AI-generated boilerplate.
                </p>
                <button
                  className="w-full py-2 px-3 rounded-lg bg-[#202020] text-xs font-mono font-bold text-[#E9A13D] border border-[#333333] hover:border-[#E9A13D] hover:bg-[#252018] transition-all flex items-center justify-center gap-1.5"
                  onClick={() => setActiveTab('journey')}
                >
                  <span>Inspect College Labs & Coursework</span> <ArrowRight size={14} />
                </button>
              </div>

              {/* Velocity Box */}
              <div className="p-5 rounded-2xl bg-[#171717] border border-[#282828] hover:border-[#FF8A32]/50 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#FF8A32]">
                    <Zap size={20} />
                    <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F0E5]">
                      Velocity Arcanum
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#26160d] text-[#FF8A32] border border-[#FF8A32]/40">
                    Rapid Shipping
                  </span>
                </div>
                <div className="text-3xl font-mono font-black text-[#F5F0E5] mb-1">
                  {store.profile.totalVelocityXp} <span className="text-xs text-[#777777] font-normal">XP</span>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed mb-4">
                  Gained from hackathon MVPs, prompt engineering, multi-agent pipelines, and high-speed product prototyping.
                </p>
                <button
                  className="w-full py-2 px-3 rounded-lg bg-[#202020] text-xs font-mono font-bold text-[#FF8A32] border border-[#333333] hover:border-[#FF8A32] hover:bg-[#261a12] transition-all flex items-center justify-center gap-1.5"
                  onClick={() => setActiveTab('skills')}
                >
                  <span>Explore Tech Skill Matrix</span> <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* UP NEXT TO WATCH (Active Training Simulations) */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Play size={18} className="text-[#FF8A32] fill-[#FF8A32]" />
                  <h3 className="text-sm sm:text-base font-bold text-[#F5F0E5] font-mono uppercase tracking-wide">
                    Up Next to Watch ({store.youtubeVideos.filter((v) => v.status === 'to_watch').length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('youtube')}
                  className="text-xs font-mono text-[#E9A13D] hover:underline flex items-center gap-1"
                >
                  Full Watch Queue <ArrowRight size={12} />
                </button>
              </div>

              {toWatchVideos.length === 0 ? (
                <div className="rounded-xl p-6 text-center text-[#777777] text-xs bg-[#171717] border border-[#262626]">
                  Your training queue is clear. Enter a YouTube URL in the terminal above to queue video learning.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toWatchVideos.map((video) => (
                    <div
                      key={video.id}
                      className="p-3.5 rounded-xl bg-[#171717] border border-[#282828] flex flex-col sm:flex-row gap-3.5 items-center justify-between hover:border-[#404040] transition-colors"
                    >
                      <div className="relative w-full sm:w-36 aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0 border border-[#262626]">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        {video.duration && (
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <h4 className="text-xs font-bold text-[#F5F0E5] truncate mb-1">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-[#777777] font-mono mb-2">
                          {video.channelTitle}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => store.markVideoWatched(video.id)}
                            className="py-1 px-2.5 rounded-md bg-[#FF8A32] text-black text-[11px] font-mono font-black hover:bg-[#E9A13D] transition-colors flex items-center gap-1 active:scale-95 shadow-sm"
                          >
                            <CheckCircle2 size={13} /> Mark Watched (+35 XP)
                          </button>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#202020] text-gray-300 hover:text-white border border-[#2b2b2b]"
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
              {/* Recent Bookmarks (Knowledge Codex) */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <Bookmark size={18} className="text-[#E9A13D]" />
                    <h3 className="text-sm sm:text-base font-bold text-[#F5F0E5] font-mono uppercase tracking-wide">
                      Recently Saved Resources
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('vault')}
                    className="text-xs font-mono text-[#E9A13D] hover:underline flex items-center gap-1"
                  >
                    View All Vault <ArrowRight size={12} />
                  </button>
                </div>

                <div className="space-y-3">
                  {recentWebsites.map((site) => (
                    <div
                      key={site.id}
                      className="p-3.5 rounded-xl bg-[#171717] border border-[#282828] flex items-center justify-between gap-3 hover:border-[#383838] transition-colors"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#F5F0E5] truncate mb-1">
                          {site.title}
                        </h4>
                        <p className="text-[11px] text-[#777777] truncate mb-1">
                          {site.description || site.url}
                        </p>
                        <div className="flex gap-1">
                          {site.tags.slice(0, 2).map((t, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#202020] text-[#888888] border border-[#2b2b2b]"
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
                        className="p-2 rounded-lg bg-[#202020] text-[#F5F0E5] hover:bg-[#FF8A32] hover:text-black transition-colors border border-[#2d2d2d] flex-shrink-0"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Milestone (Chronicles of Ascension) */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-[#FF8A32]" />
                    <h3 className="text-sm sm:text-base font-bold text-[#F5F0E5] font-mono uppercase tracking-wide">
                      Latest Verified Milestone
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('journey')}
                    className="text-xs font-mono text-[#FF8A32] hover:underline flex items-center gap-1"
                  >
                    Full Timeline <ArrowRight size={12} />
                  </button>
                </div>

                {latestMilestone && (
                  <div className="p-4 rounded-xl bg-[#171717] border border-[#282828]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-[#777777]">
                        {latestMilestone.date}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#E9A13D] px-2 py-0.5 rounded bg-[#241c10] border border-[#E9A13D]/40">
                        {latestMilestone.authorship === 'handcrafted' ? '100% Handcrafted' : 'AI-Assisted'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F5F0E5] mb-2 leading-snug">
                      {latestMilestone.title}
                    </h4>

                    <p className="text-xs text-[#888888] leading-relaxed mb-3.5 bg-[#141414] p-3 rounded-lg border border-[#222222]">
                      {latestMilestone.description}
                    </p>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#E9A13D] font-bold">
                        {latestMilestone.outcome}
                      </span>
                      <span className="text-[#FF8A32] font-bold">
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
