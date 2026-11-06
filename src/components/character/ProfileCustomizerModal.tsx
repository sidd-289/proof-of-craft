'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Sparkles,
  RefreshCw,
  Camera,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  Layers,
  Palette,
  User,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  CharacterData,
  CharacterArchetype,
  ARCHETYPE_PRESETS,
  CharacterCustomization,
} from '@/types/character';
import { sound } from '@/lib/sound';

interface ProfileCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterData;
  geminiApiKey?: string;
  onSave: (updated: {
    name: string;
    title: string;
    avatarUrl?: string;
    customization?: CharacterCustomization;
  }) => void;
}

export const ProfileCustomizerModal: React.FC<ProfileCustomizerModalProps> = ({
  isOpen,
  onClose,
  character,
  geminiApiKey,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'customize'>('upload');

  // Form State
  const [name, setName] = useState(character.name || 'Sidd');
  const [title, setTitle] = useState(character.title || 'Cyber Craftsman & System Architect');
  const [bio, setBio] = useState(
    character.customization?.bio ||
      'Building bare-metal logic and high-agency architectures.'
  );

  // Customization State
  const [archetype, setArchetype] = useState<CharacterArchetype>(
    character.customization?.archetype || 'cyber_craftsman'
  );
  const [auraColor, setAuraColor] = useState(
    character.customization?.auraColor || '#FF8A32'
  );
  const [gear, setGear] = useState(
    character.customization?.gear || 'Holo-Blade of Logic'
  );
  const [expression, setExpression] = useState(
    character.customization?.expression || 'Focused'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    character.avatarUrl || '/assets/character.png'
  );

  // Upload & AI Generation State
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    character.customization?.uploadedPhotoUrl || null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationAnalysis, setGenerationAnalysis] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local photo file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size must be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      setErrorMsg(null);
      sound.playSuccess();
    };
    reader.readAsDataURL(file);
  };

  // Trigger Anime Avatar Synthesis
  const handleGenerateAnimeAvatar = async () => {
    if (!uploadedImage) {
      setErrorMsg('Please upload a profile photo first.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationAnalysis(null);
    sound.playClick();

    try {
      const res = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          geminiApiKey: geminiApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to synthesize avatar.');
      }

      // Apply synthesized anime traits
      if (data.archetype && ARCHETYPE_PRESETS[data.archetype as CharacterArchetype]) {
        setArchetype(data.archetype);
      }
      if (data.title) setTitle(data.title);
      if (data.auraColor) setAuraColor(data.auraColor);
      if (data.gear) setGear(data.gear);
      if (data.expression) setExpression(data.expression);
      if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
      if (data.analysis) setGenerationAnalysis(data.analysis);

      sound.playSuccess();
    } catch (err: any) {
      console.error('Avatar synthesis failed:', err);
      setErrorMsg(err.message || 'Avatar generation encountered an error.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Preset Archetype Selection
  const handleSelectArchetype = (archKey: CharacterArchetype) => {
    const preset = ARCHETYPE_PRESETS[archKey];
    setArchetype(archKey);
    setAuraColor(preset.auraColor);
    setGear(preset.defaultGear);
    setAvatarUrl(preset.avatarUrl);
    sound.playClick();
  };

  // Save Identity and Customization
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      title: title.trim(),
      avatarUrl,
      customization: {
        archetype,
        hairStyle: 'Cyber Flow',
        hairColor: '#171717',
        auraColor,
        gear,
        expression,
        uploadedPhotoUrl: uploadedImage || undefined,
        customAvatarUrl: avatarUrl,
        bio: bio.trim(),
        element: ARCHETYPE_PRESETS[archetype].statFocus,
      },
    });

    sound.playSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile & Anime Avatar Studio"
    >
      <div className="space-y-5">
        {/* Studio Subtitle */}
        <p className="text-xs text-gray-400 font-mono leading-relaxed">
          Upload a profile photo to generate an anime protagonist matching your features, or customize your archetype, aura, and signature gear.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#242424] pb-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-[#FF8A32] text-black shadow-sm'
                : 'bg-[#181818] text-gray-400 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            <Camera size={13} />
            <span>Upload & AI Avatar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('customize');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'customize'
                ? 'bg-[#FF8A32] text-black shadow-sm'
                : 'bg-[#181818] text-gray-400 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            <Sliders size={13} />
            <span>Character Customizer</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: Photo Upload & AI Avatar Synthesis Engine          */}
        {/* ======================================================== */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {/* Split Screen: Uploaded Photo -> Anime Transformation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
              {/* Left: Real Photo Upload */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-gray-300 uppercase flex items-center justify-between">
                  <span>1. Your Profile Picture</span>
                  {uploadedImage && <span className="text-emerald-400 text-[10px]">Ready</span>}
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all overflow-hidden ${
                    uploadedImage
                      ? 'border-[#FF8A32]/60 bg-[#191919]'
                      : 'border-[#333333] hover:border-[#FF8A32] bg-[#121212]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {uploadedImage ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <img
                        src={uploadedImage}
                        alt="Uploaded preview"
                        className="w-28 h-28 rounded-xl object-cover border border-[#383838] shadow-md"
                      />
                      <span className="text-[10px] font-mono text-gray-400 mt-2 hover:text-[#FF8A32]">
                        Click to change photo
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <div className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center text-[#FF8A32]">
                        <Upload size={18} />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#F5F0E5]">
                        Click or Drop Profile Photo
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        PNG, JPG, or WEBP up to 8MB
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Synthesized Anime Avatar */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-gray-300 uppercase flex items-center justify-between">
                  <span>2. Anime Transformation</span>
                  <span className="text-[#E9A13D] text-[10px]">{ARCHETYPE_PRESETS[archetype].name}</span>
                </div>

                <div className="h-48 rounded-xl bg-[#101010] border border-[#282828] relative flex items-center justify-center overflow-hidden p-2">
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none blur-xl"
                    style={{ backgroundColor: auraColor }}
                  />
                  <img
                    src={avatarUrl}
                    alt="Anime transformation"
                    className="relative z-10 w-auto h-full max-h-40 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
                  />
                  <div className="absolute bottom-2 left-2 right-2 text-center z-20">
                    <span
                      className="text-[9px] font-mono font-black text-black px-2 py-0.5 rounded shadow-sm"
                      style={{ backgroundColor: auraColor }}
                    >
                      {expression} // {ARCHETYPE_PRESETS[archetype].name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#271414] border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* AI Analysis Pill */}
            {generationAnalysis && (
              <div className="p-3 rounded-lg bg-[#142318] border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{generationAnalysis}</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerateAnimeAvatar}
              disabled={!uploadedImage || isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-[#FF8A32] text-black font-mono font-black text-xs hover:bg-[#E9A13D] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-98"
            >
              <Sparkles size={15} className={isGenerating ? 'animate-spin' : ''} />
              <span>
                {isGenerating
                  ? 'Analyzing Photo & Synthesizing Anime Avatar...'
                  : 'Generate Anime Avatar from Photo'}
              </span>
            </button>

            {/* Archetype Quick Switcher Gallery */}
            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-mono font-bold text-gray-400 uppercase">
                Or Select from Signature Anime Styles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(ARCHETYPE_PRESETS) as CharacterArchetype[])
                  .filter((key) => key !== 'void_walker')
                  .map((key) => {
                    const preset = ARCHETYPE_PRESETS[key];
                    const isSelected = archetype === key;
                    return (
                      <div
                        key={key}
                        onClick={() => handleSelectArchetype(key)}
                        className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#202020] border-[#FF8A32] shadow-sm'
                            : 'bg-[#151515] border-[#262626] hover:border-[#383838]'
                        }`}
                      >
                        <div className="w-14 h-14 mx-auto rounded-lg overflow-hidden bg-[#101010] border border-[#2a2a2a] mb-1.5 flex items-center justify-center">
                          <img
                            src={preset.avatarUrl}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-[10px] font-mono font-bold text-[#F5F0E5] truncate">
                          {preset.name}
                        </div>
                        <div
                          className="text-[9px] font-mono font-black uppercase mt-0.5"
                          style={{ color: preset.auraColor }}
                        >
                          {preset.statFocus}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: Character Identity & Visual Customizer             */}
        {/* ======================================================== */}
        {activeTab === 'customize' && (
          <div className="space-y-4">
            {/* Identity Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                  Player Name <span className="text-[#FF8A32]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sidd, Jinwoo, Ken"
                  className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#2c2c2c] text-white text-xs font-mono focus:outline-none focus:border-[#FF8A32]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                  Title / Class Designation
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cyber Craftsman & System Architect"
                  className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#2c2c2c] text-white text-xs font-mono focus:outline-none focus:border-[#FF8A32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                Guild Motto / Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Personal programming mantra or bio..."
                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#2c2c2c] text-white text-xs font-mono focus:outline-none focus:border-[#FF8A32] resize-none"
              />
            </div>

            {/* Aura Energy Glow Selection */}
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5 flex items-center justify-between">
                <span>Aura Energy Color</span>
                <span className="font-mono text-[10px]" style={{ color: auraColor }}>
                  {auraColor}
                </span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: 'Amber Flame', hex: '#FF8A32' },
                  { label: 'Radiant Gold', hex: '#E9A13D' },
                  { label: 'Electric Cyan', hex: '#38BDF8' },
                  { label: 'Neon Violet', hex: '#C4B5FD' },
                  { label: 'Crimson Surge', hex: '#EF4444' },
                  { label: 'Emerald Matrix', hex: '#10B981' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => {
                      setAuraColor(color.hex);
                      sound.playClick();
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
                      auraColor === color.hex
                        ? 'border-white bg-[#222222] shadow-sm'
                        : 'border-[#2a2a2a] bg-[#141414] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gear & Demeanor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                  Signature Gear
                </label>
                <input
                  type="text"
                  value={gear}
                  onChange={(e) => setGear(e.target.value)}
                  placeholder="e.g. Holo-Blade of Logic, Terminal Gauntlet"
                  className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#2c2c2c] text-white text-xs font-mono focus:outline-none focus:border-[#FF8A32]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1">
                  Expression / Demeanor
                </label>
                <select
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#2c2c2c] text-white text-xs font-mono focus:outline-none focus:border-[#FF8A32]"
                >
                  <option value="Focused">Focused</option>
                  <option value="Stoic">Stoic</option>
                  <option value="Fierce">Fierce</option>
                  <option value="Enlightened">Enlightened</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#242424]">
          <Button variant="outline" onClick={onClose} className="text-xs font-mono">
            Cancel
          </Button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg bg-[#FF8A32] text-black font-mono font-black text-xs hover:bg-[#E9A13D] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <CheckCircle2 size={14} />
            <span>Save Character Identity</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

