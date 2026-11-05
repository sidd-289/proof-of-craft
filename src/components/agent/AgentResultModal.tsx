'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AgentActionExecution } from '@/types';

interface AgentResultModalProps {
  result: AgentActionExecution | null;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const AgentResultModal: React.FC<AgentResultModalProps> = ({ result, onClose, onNavigateTab }) => {
  if (!result) return null;

  const isSuccess = result.success;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative z-10 w-full max-w-lg brutal-card bg-[#14161c] border-2 border-white p-6 shadow-[6px_6px_0px_#000000]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] ${
                isSuccess ? 'bg-[#6ee7b7] text-black' : 'bg-rose-500 text-white'
              }`}
            >
              {isSuccess ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {isSuccess ? 'Agent Action Executed' : 'Notice'}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                {result.type.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-200 mb-5 font-medium leading-relaxed bg-[#1b1e26] p-3.5 rounded-xl border border-[#2d323d]">
            {result.message}
          </p>

          {/* XP Gained Pill */}
          {result.xpGained && (
            <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-[#1b221d] border-2 border-[#6ee7b7]/40 shadow-[2px_2px_0px_#000]">
              <Sparkles size={18} className="text-[#6ee7b7]" />
              <span className="text-xs font-mono font-bold text-gray-300">
                Reward Earned:
              </span>
              <span className="text-sm font-mono font-black text-[#6ee7b7]">
                +{result.xpGained.amount} {result.xpGained.track.toUpperCase()} XP
              </span>
              {result.xpGained.skillName && (
                <span className="text-xs text-gray-400 ml-auto font-mono">
                  ({result.xpGained.skillName})
                </span>
              )}
            </div>
          )}

          {/* Ideation Preview if any */}
          {result.type === 'ideate' && result.data?.ideas && (
            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
              {result.data.ideas.map((idea: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#1a1d24] border border-[#383e4d] shadow-[2px_2px_0px_#000]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-amber-300">{idea.title}</span>
                    <Badge variant="amber">{idea.track}</Badge>
                  </div>
                  <p className="text-xs text-gray-300 mb-2 leading-relaxed">{idea.pitch}</p>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Leverages: <span className="text-gray-300">{idea.leverages}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Website / YouTube Card Preview */}
          {result.data && (result.type === 'save_website' || result.type === 'save_youtube') && (
            <div className="p-3.5 rounded-xl bg-[#1a1d24] border border-[#383e4d] mb-5 flex items-center justify-between">
              <div className="truncate mr-3">
                <p className="text-sm font-bold text-white truncate">{result.data.title}</p>
                <p className="text-xs text-gray-400 font-mono truncate">{result.data.url}</p>
              </div>
              <a
                href={result.data.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#252a35] text-white hover:bg-white hover:text-black transition-colors border border-[#383e4d] flex-shrink-0"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            {result.type === 'save_youtube' && onNavigateTab && (
              <Button
                variant="amber"
                size="sm"
                onClick={() => {
                  onNavigateTab('youtube');
                  onClose();
                }}
              >
                View in Watch Queue <ArrowRight size={14} />
              </Button>
            )}
            {result.type === 'save_website' && onNavigateTab && (
              <Button
                variant="sky"
                size="sm"
                onClick={() => {
                  onNavigateTab('vault');
                  onClose();
                }}
              >
                View in Vault <ArrowRight size={14} />
              </Button>
            )}
            {result.type === 'log_milestone' && onNavigateTab && (
              <Button
                variant="mint"
                size="sm"
                onClick={() => {
                  onNavigateTab('journey');
                  onClose();
                }}
              >
                View in Journey <ArrowRight size={14} />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

