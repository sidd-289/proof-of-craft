'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Award,
  Terminal,
  Code2,
  Key,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
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
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('github');
  const [usernameInput, setUsernameInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const activeDef = PLATFORM_DEFINITIONS.find((p) => p.id === selectedPlatform) || PLATFORM_DEFINITIONS[0];
  const activeSavedProfile = profiles[selectedPlatform];

  // When switching platforms, sync local inputs with stored data
  const handleSelectPlatform = (platform: PlatformType) => {
    setSelectedPlatform(platform);
    const existing = profiles[platform];
    setUsernameInput(existing?.username || '');
    setApiKeyInput(existing?.apiKey || '');
    setVerificationError(null);
  };

  // 1-Click Smooth Verification Engine
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!usernameInput.trim() || isVerifying) return;

    setIsVerifying(true);
    setVerificationError(null);
    sound.playClick();

    try {
      const res = await fetch('/api/verify-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          username: usernameInput.trim(),
          apiKey: apiKeyInput.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setVerificationError(data.error || 'Failed to verify profile with platform API.');
        return;
      }

      // Success: Save verified stats to store
      const newStats: PlatformStats = {
        platform: selectedPlatform,
        username: data.username,
        apiKey: apiKeyInput.trim() || undefined,
        verified: true,
        verifiedAt: data.verifiedAt || new Date().toISOString(),
        metrics: data.metrics,
      };

      onSaveProfile(selectedPlatform, newStats);
      sound.playSuccess();
    } catch (err: any) {
      console.error('Verification network error:', err);
      setVerificationError(err.message || 'Network connection failed while verifying.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUnlink = () => {
    onRemoveProfile(selectedPlatform);
    setUsernameInput('');
    setApiKeyInput('');
    setVerificationError(null);
    sound.playClick();
  };

  const getPlatformIcon = (id: PlatformType) => {
    switch (id) {
      case 'github':
        return <GithubIcon size={18} />;
      case 'leetcode':
        return <Code2 size={18} />;
      case 'codeforces':
        return <Terminal size={18} />;
      case 'codechef':
        return <Award size={18} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Competitive Profiles & GitHub Tracker"
    >
      <div className="space-y-6">
        {/* Subtitle explanation */}
        <p className="text-xs text-gray-400 font-mono leading-relaxed">
          Link and verify your authentic developer & competitive coding IDs. Live metrics directly attribute to your Craftsman Discipline and Velocity rank.
        </p>

        {/* Platform Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLATFORM_DEFINITIONS.map((def) => {
            const isSelected = selectedPlatform === def.id;
            const isVerified = profiles[def.id]?.verified;

            return (
              <button
                key={def.id}
                type="button"
                onClick={() => handleSelectPlatform(def.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#222222] border-[#FF8A32] shadow-[0_0_12px_rgba(255,138,50,0.2)]'
                    : 'bg-[#151515] border-[#262626] hover:border-[#383838]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="p-1 rounded-md"
                    style={{ color: def.color, backgroundColor: def.badgeBg }}
                  >
                    {getPlatformIcon(def.id)}
                  </span>
                  {isVerified ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 size={11} /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-gray-500">
                      Unlinked
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs font-bold text-[#F5F0E5]">
                  {def.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Platform Configuration Card */}
        <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <span style={{ color: activeDef.color }}>{getPlatformIcon(activeDef.id)}</span>
              <span className="font-mono text-sm font-bold text-[#F5F0E5]">
                {activeDef.name} Integration
              </span>
            </div>

            {activeSavedProfile?.verified && (
              <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-[#102418] border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck size={13} /> Verified Proof-of-Work
              </span>
            )}
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleVerify} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                {activeDef.name} Username / Handle <span className="text-[#FF8A32]">*</span>
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder={activeDef.placeholder}
                disabled={isVerifying}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FF8A32] font-mono transition-colors"
                required
              />
            </div>

            {/* Optional API Key / Token */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase flex items-center gap-1">
                  <Key size={12} className="text-[#E9A13D]" />
                  <span>{activeDef.apiKeyLabel || 'API Key / Token (Optional)'}</span>
                </label>
                {activeDef.docsUrl && (
                  <a
                    href={activeDef.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-[#E9A13D] hover:underline flex items-center gap-0.5"
                  >
                    <span>Get Key</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={activeDef.apiKeyPlaceholder || 'Enter token if required...'}
                  disabled={isVerifying}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#FF8A32] font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {activeDef.apiKeyHelper && (
                <p className="text-[11px] font-mono text-gray-500 mt-1">
                  {activeDef.apiKeyHelper}
                </p>
              )}
            </div>

            {/* Error Diagnostics Alert */}
            {verificationError && (
              <div className="p-3 rounded-lg bg-[#271414] border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span>{verificationError}</span>
              </div>
            )}

            {/* Verification Actions */}
            <div className="flex items-center justify-between pt-2">
              {activeSavedProfile?.verified ? (
                <button
                  type="button"
                  onClick={handleUnlink}
                  className="px-3 py-2 rounded-lg text-xs font-mono font-bold text-red-400 hover:text-red-300 hover:bg-[#201515] border border-red-500/30 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={13} /> Unlink
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={!usernameInput.trim() || isVerifying}
                className="px-4 py-2 rounded-lg bg-[#FF8A32] text-black text-xs font-mono font-black hover:bg-[#E9A13D] transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Verifying with {activeDef.name}...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    <span>{activeSavedProfile?.verified ? 'Re-Verify & Sync' : 'Verify & Track'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Verified Proof-of-Work Metrics Display */}
        {activeSavedProfile?.verified && activeSavedProfile.metrics && (
          <div className="p-4 rounded-xl bg-[#171717] border border-[#2b2b2b] shadow-md space-y-3">
            <div className="flex items-center justify-between">
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
                    <span className="text-[10px] font-mono text-gray-500">
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
                  className="p-1.5 rounded-lg bg-[#202020] text-gray-300 hover:text-white border border-[#2d2d2d]"
                  title="View Public Profile"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-2 rounded-lg bg-[#141414] border border-[#242424]">
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
                <div className="p-2 rounded-lg bg-[#141414] border border-[#242424]">
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
                <div className="p-2 rounded-lg bg-[#141414] border border-[#242424]">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">
                    {activeSavedProfile.metrics.tertiaryLabel}
                  </div>
                  <div className="text-base font-mono font-black text-[#FF8A32]">
                    {activeSavedProfile.metrics.tertiaryValue}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1">
              <span>Synced via {activeDef.name} API</span>
              <span>Last verified: {activeSavedProfile.verifiedAt ? new Date(activeSavedProfile.verifiedAt).toLocaleTimeString() : 'Just now'}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="text-xs font-mono">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
