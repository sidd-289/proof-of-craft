'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Trash2,
  RefreshCw,
  Key,
  ChevronDown,
  ChevronUp,
  LogIn,
  Zap,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  GithubIcon,
  LeetCodeIcon,
  CodeforcesIcon,
  CodeChefIcon,
} from '@/components/ui/Icons';
import {
  PlatformType,
  PlatformStats,
  PLATFORM_DEFINITIONS,
  UserCompetitiveProfiles,
} from '@/types/profile';
import { sound } from '@/lib/sound';

interface CompetitiveProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserCompetitiveProfiles;
  onSaveProfile: (platform: PlatformType, stats: PlatformStats) => void;
  onRemoveProfile: (platform: PlatformType) => void;
}

export const CompetitiveProfilesModal: React.FC<CompetitiveProfilesModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSaveProfile,
  onRemoveProfile,
}) => {
  const [activePlatform, setActivePlatform] = useState<PlatformType>('github');
  const [handleInput, setHandleInput] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [showAdvancedToken, setShowAdvancedToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeDef = PLATFORM_DEFINITIONS.find((p) => p.id === activePlatform) || PLATFORM_DEFINITIONS[0];
  const activeSavedProfile = profiles[activePlatform];

  const handleSelectPlatform = (platform: PlatformType) => {
    setActivePlatform(platform);
    const existing = profiles[platform];
    setHandleInput(existing?.username || '');
    setCustomToken(existing?.apiKey || '');
    setErrorMessage(null);
  };

  // 1-Click Smooth Account Authorization & Live Sync
  const handleAuthorizeAccount = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!handleInput.trim() || isConnecting) return;

    setIsConnecting(true);
    setErrorMessage(null);
    sound.playClick();

    try {
      const res = await fetch('/api/verify-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: activePlatform,
          username: handleInput.trim(),
          apiKey: customToken.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.error || `Unable to authorize ${activeDef.name} account.`);
        return;
      }

      // Save connected account with live verified metrics
      const newStats: PlatformStats = {
        platform: activePlatform,
        username: data.username,
        apiKey: customToken.trim() || undefined,
        verified: true,
        verifiedAt: data.verifiedAt || new Date().toISOString(),
        metrics: data.metrics,
      };

      onSaveProfile(activePlatform, newStats);
      sound.playSuccess();
    } catch (err: any) {
      console.error('Account connection failed:', err);
      setErrorMessage(err.message || 'Network connection failed while authorizing.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleUnlink = () => {
    onRemoveProfile(activePlatform);
    setHandleInput('');
    setCustomToken('');
    setErrorMessage(null);
    sound.playClick();
  };

  // Launch GitHub 1-Click OAuth flow
  const handleGithubOAuth = () => {
    sound.playClick();
    window.location.href = '/api/auth/github';
  };

  const getPlatformIcon = (id: PlatformType, size = 18) => {
    switch (id) {
      case 'github':
        return <GithubIcon size={size} />;
      case 'leetcode':
        return <LeetCodeIcon size={size} />;
      case 'codeforces':
        return <CodeforcesIcon size={size} />;
      case 'codechef':
        return <CodeChefIcon size={size} />;
    }
  };

  const getAttributeBonusHint = (id: PlatformType) => {
    switch (id) {
      case 'github':
        return '+3 CON, +3 WIS (Open Source Craft)';
      case 'leetcode':
        return '+4 FOC, +3 STR (Algorithmic Grit)';
      case 'codeforces':
        return '+4 DIS (Contest Execution)';
      case 'codechef':
        return '+4 WIS (Competitive Problem Solving)';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Logins & Account Sync"
    >
      <div className="space-y-6">
        <p className="text-xs text-gray-400 font-mono leading-relaxed">
          Sign in or link your profiles. No manual API keys required. We verify your public achievements and stats live to empower your RPG character attributes.
        </p>

        {/* 4 Social Sign-In Platform Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PLATFORM_DEFINITIONS.map((def) => {
            const isSelected = activePlatform === def.id;
            const profile = profiles[def.id];
            const isConnected = profile?.verified;

            return (
              <button
                key={def.id}
                type="button"
                onClick={() => handleSelectPlatform(def.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#1e1e1e] border-[#FF8A32] shadow-[0_0_14px_rgba(255,138,50,0.2)]'
                    : 'bg-[#151515] border-[#262626] hover:border-[#383838]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: def.badgeBg, color: def.color }}
                  >
                    {getPlatformIcon(def.id, 22)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-[#F5F0E5] truncate flex items-center gap-1.5">
                      <span>{def.name}</span>
                    </div>
                    {isConnected ? (
                      <div className="text-[11px] font-mono text-emerald-400 truncate flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>@{profile.username}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-gray-500">
                        Sign in to link
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {isConnected ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-[#102418] border border-emerald-500/30">
                      Linked
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-gray-300 px-2 py-0.5 rounded bg-[#202020] border border-[#303030]">
                      Login
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Platform Login / Linked Card */}
        <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <span style={{ color: activeDef.color }}>{getPlatformIcon(activeDef.id, 20)}</span>
              <span className="font-mono text-sm font-bold text-[#F5F0E5]">
                {activeSavedProfile?.verified
                  ? `${activeDef.name} Account Active`
                  : `Login with ${activeDef.name}`}
              </span>
            </div>

            {activeSavedProfile?.verified ? (
              <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-[#102418] border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck size={13} /> Verified
              </span>
            ) : (
              <span className="text-[11px] font-mono text-[#E9A13D] flex items-center gap-1">
                <Zap size={12} /> {getAttributeBonusHint(activeDef.id)}
              </span>
            )}
          </div>

          {/* View 1: Connected Profile Details */}
          {activeSavedProfile?.verified && activeSavedProfile.metrics ? (
            <div className="space-y-3.5">
              <div className="p-3 rounded-lg bg-[#191919] border border-[#282828] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeSavedProfile.metrics.avatarUrl ? (
                    <img
                      src={activeSavedProfile.metrics.avatarUrl}
                      alt={activeSavedProfile.username}
                      className="w-10 h-10 rounded-full border border-[#383838] object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#242424] border border-[#383838] flex items-center justify-center font-mono font-bold text-[#FF8A32]">
                      {activeSavedProfile.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#F5F0E5]">
                        {activeSavedProfile.metrics.details?.name || activeSavedProfile.username}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">
                        @{activeSavedProfile.username}
                      </span>
                    </div>
                    {activeSavedProfile.metrics.rankTitle && (
                      <span className="text-[10px] font-mono font-bold text-[#E9A13D] uppercase">
                        {activeSavedProfile.metrics.rankTitle}
                      </span>
                    )}
                  </div>
                </div>

                {activeSavedProfile.metrics.profileUrl && (
                  <a
                    href={activeSavedProfile.metrics.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#202020] text-gray-300 hover:text-white border border-[#2d2d2d] transition-colors"
                    title="Open Platform Profile"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Verified Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-[#141414] border border-[#242424]">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">
                    {activeSavedProfile.metrics.primaryLabel}
                  </div>
                  <div className="text-base font-mono font-black text-[#F5F0E5]">
                    {typeof activeSavedProfile.metrics.primaryValue === 'number'
                      ? activeSavedProfile.metrics.primaryValue.toLocaleString()
                      : activeSavedProfile.metrics.primaryValue}
                  </div>
                </div>

                {activeSavedProfile.metrics.secondaryLabel && (
                  <div className="p-2.5 rounded-lg bg-[#141414] border border-[#242424]">
                    <div className="text-[10px] font-mono text-gray-400 uppercase">
                      {activeSavedProfile.metrics.secondaryLabel}
                    </div>
                    <div className="text-base font-mono font-black text-[#F5F0E5]">
                      {typeof activeSavedProfile.metrics.secondaryValue === 'number'
                        ? activeSavedProfile.metrics.secondaryValue.toLocaleString()
                        : activeSavedProfile.metrics.secondaryValue}
                    </div>
                  </div>
                )}

                {activeSavedProfile.metrics.tertiaryLabel && (
                  <div className="p-2.5 rounded-lg bg-[#141414] border border-[#242424]">
                    <div className="text-[10px] font-mono text-gray-400 uppercase">
                      {activeSavedProfile.metrics.tertiaryLabel}
                    </div>
                    <div className="text-base font-mono font-black text-[#FF8A32]">
                      {activeSavedProfile.metrics.tertiaryValue}
                    </div>
                  </div>
                )}
              </div>

              {/* Status footer with Sync & Unlink */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleUnlink}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-red-400 hover:text-red-300 hover:bg-[#201515] border border-red-500/30 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={13} /> Disconnect Account
                </button>

                <button
                  type="button"
                  onClick={handleAuthorizeAccount}
                  disabled={isConnecting}
                  className="px-3 py-1.5 rounded-lg bg-[#222222] text-[#F5F0E5] hover:border-[#FF8A32] border border-[#303030] text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw size={13} className={isConnecting ? 'animate-spin' : ''} />
                  <span>Sync Latest Stats</span>
                </button>
              </div>
            </div>
          ) : (
            /* View 2: Platform Sign-in Flow */
            <div className="space-y-4">
              {activePlatform === 'github' && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGithubOAuth}
                    className="w-full py-3 px-4 rounded-lg bg-[#242424] hover:bg-[#2e2e2e] text-[#F5F0E5] border border-[#3a3a3a] text-xs font-mono font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-98"
                  >
                    <GithubIcon size={18} />
                    <span>Authorize with GitHub (OAuth 1-Click)</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-px bg-[#262626] flex-1" />
                    <span className="text-[11px] font-mono text-gray-500 uppercase">Or connect by username</span>
                    <div className="h-px bg-[#262626] flex-1" />
                  </div>
                </div>
              )}

              <form onSubmit={handleAuthorizeAccount} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
                    {activeDef.name} Username / Handle <span className="text-[#FF8A32]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      placeholder={activeDef.placeholder}
                      disabled={isConnecting}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FF8A32] font-mono transition-colors"
                      required
                    />
                  </div>
                  <p className="text-[11px] font-mono text-gray-500 mt-1">
                    Enter your public {activeDef.name} handle. We verify your stats instantly via the platform API.
                  </p>
                </div>

                {/* Optional Developer Token (Hidden by default so users don't have to fiddle with keys) */}
                <div className="border border-[#222222] rounded-lg p-2.5 bg-[#171717]">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedToken(!showAdvancedToken)}
                    className="w-full flex items-center justify-between text-xs font-mono text-gray-400 hover:text-[#F5F0E5]"
                  >
                    <span className="flex items-center gap-1.5">
                      <Key size={12} className="text-[#E9A13D]" />
                      <span>Advanced: Personal Token (Optional)</span>
                    </span>
                    {showAdvancedToken ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {showAdvancedToken && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#222222] space-y-2">
                      <input
                        type="password"
                        value={customToken}
                        onChange={(e) => setCustomToken(e.target.value)}
                        placeholder="Optional Personal Access Token / API Key"
                        className="w-full px-3 py-1.5 rounded bg-[#131313] border border-[#2d2d2d] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A32]"
                      />
                      <p className="text-[11px] font-mono text-gray-500">
                        Not required. Leave blank for instant public profile verification.
                      </p>
                    </div>
                  )}
                </div>

                {/* Error diagnostics */}
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-[#271414] border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2">
                    <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Dedicated Branded "Login with {Platform}" Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!handleInput.trim() || isConnecting}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#FF8A32] text-black text-xs font-mono font-black hover:bg-[#E9A13D] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Verifying with {activeDef.name}...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={15} />
                        <span>Login with {activeDef.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="text-xs font-mono">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
