'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Award, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LevelUpEvent } from '@/lib/store';

interface LevelUpCelebrationProps {
  event: LevelUpEvent | null;
  onDismiss: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ event, onDismiss }) => {
  useEffect(() => {
    if (!event) return;

    // Fire Neo-Brutalist celebratory confetti burst
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#6ee7b7', '#c4b5fd', '#fde047', '#f472b6', '#38bdf8'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, [event]);

  if (!event) return null;

  const isCraftsman = event.track === 'craftsman';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={onDismiss}
        />

        {/* Celebratory Card */}
        <motion.div
          initial={{ scale: 0.8, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 280 }}
          className="relative z-10 w-full max-w-md brutal-card bg-[#12141a] border-2 border-white p-8 text-center shadow-[8px_8px_0px_#000000]"
        >
          {/* Glowing Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-5 border-2 border-black shadow-[2px_2px_0px_#000]"
            style={{
              backgroundColor: isCraftsman ? '#6ee7b7' : '#c4b5fd',
              color: '#0c0d11',
            }}
          >
            <Sparkles size={14} className="animate-spin" />
            Skill Level Up!
          </div>

          {/* Animated Icon Crest */}
          <motion.div
            initial={{ rotate: -15, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_#000]"
            style={{
              backgroundColor: isCraftsman ? '#6ee7b7' : '#c4b5fd',
              color: '#0c0d11',
            }}
          >
            {isCraftsman ? <Trophy size={48} strokeWidth={2.5} /> : <Award size={48} strokeWidth={2.5} />}
          </motion.div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            {event.skillName}
          </h2>

          <p className="text-sm text-gray-400 font-mono mb-6">
            Track: <span className="text-white font-bold">{isCraftsman ? 'Craftsman (Core Scratch / College)' : 'Velocity (AI Prototyping)'}</span>
          </p>

          {/* Level Transition Pill */}
          <div className="flex items-center justify-center gap-4 py-3 px-6 bg-[#181b22] border-2 border-[#2d323d] rounded-xl mb-6 shadow-[3px_3px_0px_#000]">
            <div className="text-gray-400 font-mono font-semibold">
              Lv. {event.previousLevel}
            </div>
            <ArrowUpRight className="text-amber-400" size={20} />
            <div className="text-xl font-mono font-black text-white"
              style={{ color: isCraftsman ? '#6ee7b7' : '#c4b5fd' }}
            >
              Lv. {event.newLevel}
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#252a35] text-amber-300 font-bold font-mono uppercase border border-[#383e4d]">
              {event.tier}
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Your persistence and genuine proof-of-work advanced your mastery level. Keep building!
          </p>

          <Button
            variant={isCraftsman ? 'mint' : 'violet'}
            size="lg"
            className="w-full text-base"
            onClick={onDismiss}
          >
            Claim Mastery & Continue 🚀
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

