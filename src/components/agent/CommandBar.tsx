'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, Loader2, CornerDownLeft } from 'lucide-react';
import { sound } from '@/lib/sound';
import { AgentActionExecution } from '@/types';
import { processAgentPrompt, AgentContext } from '@/lib/agent';

interface CommandBarProps {
  context: AgentContext;
  onExecutionComplete: (result: AgentActionExecution) => void;
}

const EXAMPLE_PROMPTS = [
  'Save https://youtu.be/kCc8FmEb1nY to watch later',
  'Log college OS lab on Semaphores in C (100% scratch)',
  'Save https://astral.sh/uv to dev tools',
  'Brainstorm hackathon project ideas based on my skills',
];

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

  const handleSuggestionClick = (example: string) => {
    setPrompt(example);
    inputRef.current?.focus();
    sound.playClick();
  };

  return (
    <div className="w-full mb-8">
      {/* Omni-Command Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center brutal-card bg-[#14161c] border-2 border-[#383e4d] p-2 pl-4 shadow-[4px_4px_0px_#000000] focus-within:border-white focus-within:shadow-[6px_6px_0px_#000000] transition-all"
      >
        <div className="flex items-center gap-2 mr-3 text-[#c4b5fd]">
          <Bot size={22} className="text-[#c4b5fd]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste any link, log a college lab milestone, or ask your agent to find/suggest..."
          disabled={isProcessing}
          className="w-full bg-transparent text-sm md:text-base text-white placeholder-gray-500 focus:outline-none font-medium"
        />

        <div className="flex items-center gap-2 ml-2">
          {/* Cmd+K Badge */}
          <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-[#1e222b] text-[11px] font-mono text-gray-400 border border-[#2d323d]">
            <span>⌘</span>
            <span>K</span>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className={`brutal-btn px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
              prompt.trim() && !isProcessing
                ? 'bg-[#c4b5fd] text-black border-black hover:bg-white'
                : 'bg-[#1e222b] text-gray-500 border-[#2d323d] opacity-60 cursor-not-allowed'
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

      {/* Quick Example Suggestions */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
          <Sparkles size={12} className="text-amber-400" /> Try:
        </span>
        {EXAMPLE_PROMPTS.map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestionClick(ex)}
            className="text-xs px-2.5 py-1 rounded-md bg-[#16181f] text-gray-300 border border-[#272b35] hover:border-gray-400 hover:text-white transition-all whitespace-nowrap shadow-[1px_1px_0px_#000]"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
};

