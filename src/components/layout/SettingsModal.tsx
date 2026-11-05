'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Key, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '@/lib/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiApiKey?: string;
  onSaveApiKey: (key: string) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  geminiApiKey = '',
  onSaveApiKey,
  onResetData,
}) => {
  const [apiKey, setApiKey] = useState(geminiApiKey);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(apiKey.trim());
    onClose();
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data back to initial defaults?')) {
      onResetData();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="App & Agent Settings">
      <form onSubmit={handleSave} className="space-y-5">
        {/* Gemini API Key */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5 flex items-center gap-1.5">
            <Key size={14} className="text-amber-400" />
            <span>Gemini API Key (Optional)</span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            By default, a built-in smart NLP engine runs locally. Supplying your Gemini API key unlocks deep video summaries, automated category classification, and hackathon ideation.
          </p>
        </div>

        {/* Audio / SFX Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181a21] border border-[#2d323d]">
          <div className="flex items-center gap-2.5">
            {isMuted ? <VolumeX size={18} className="text-gray-500" /> : <Volume2 size={18} className="text-[#6ee7b7]" />}
            <div>
              <p className="text-xs font-bold text-white">Arcade Sound Effects & Level-Up Chimes</p>
              <p className="text-[11px] text-gray-400">Audio feedback when leveling up or executing actions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleSound}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 transition-all shadow-[2px_2px_0px_#000] ${
              !isMuted
                ? 'bg-[#6ee7b7] text-black border-black'
                : 'bg-[#22252e] text-gray-400 border-[#2d323d]'
            }`}
          >
            {!isMuted ? 'Enabled' : 'Muted'}
          </button>
        </div>

        {/* Theme Indicator */}
        <div className="p-3.5 rounded-xl bg-[#181a21] border border-[#2d323d]">
          <p className="text-xs font-bold text-white mb-0.5">Active Theme</p>
          <p className="text-[11px] text-gray-400">
            Dark Minimal Neo-Brutalism (Tactile 2px borders, hard drop shadows, high-contrast neon accents).
          </p>
        </div>

        {/* Reset Defaults */}
        <div className="pt-2 border-t border-[#232733] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Reset Demo Data</span>
          </button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" size="sm" type="submit">
              Save Settings
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

