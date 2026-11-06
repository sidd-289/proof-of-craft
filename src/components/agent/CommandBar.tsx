'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Loader2, CornerDownLeft } from 'lucide-react';
import { sound } from '@/lib/sound';
import { AgentActionExecution } from '@/types';
import { processAgentPrompt, AgentContext } from '@/lib/agent';

interface CommandBarProps {
  context: AgentContext;
  onExecutionComplete: (result: AgentActionExecution) => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({ context, onExecutionComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        sound.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    const currentPrompt = prompt;
    setIsProcessing(true);
    sound.playClick();

    try {
      const result = await processAgentPrompt(currentPrompt, context);
      onExecutionComplete(result);
      setPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full mb-6">
      {/* Omni-Command Input Box (Clean System RPG Terminal) */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center rounded-xl bg-[#171717] border border-[#2b2b2b] p-2 pl-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] focus-within:border-[#FF8A32] focus-within:shadow-[0_0_16px_rgba(255,138,50,0.2)] transition-all"
      >
        <div className="flex items-center gap-2 mr-3 text-[#FF8A32]">
          <Bot size={20} className="text-[#FF8A32]" />
          <span className="hidden md:inline text-[11px] font-mono text-[#E9A13D] font-bold tracking-wider uppercase">
            SYS://
          </span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste any link, log a college lab milestone, or ask your agent to find/suggest..."
          disabled={isProcessing}
          className="w-full bg-transparent text-sm md:text-base text-[#F5F0E5] placeholder-[#777777] focus:outline-none font-medium"
        />

        <div className="flex items-center gap-2 ml-2">
          {/* Cmd+K Badge */}
          <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-[#202020] text-[11px] font-mono text-[#F5F0E5] border border-[#333333]">
            <span>CMD</span>
            <span>K</span>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-mono font-black flex items-center gap-1.5 transition-all shadow-sm ${
              prompt.trim() && !isProcessing
                ? 'bg-[#FF8A32] text-black hover:bg-[#E9A13D] shadow-[0_0_12px_rgba(255,138,50,0.3)] active:scale-95'
                : 'bg-[#202020] text-gray-500 border border-[#2b2b2b] opacity-60 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">Executing...</span>
              </>
            ) : (
              <>
                <span>Prompt</span>
                <CornerDownLeft size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
