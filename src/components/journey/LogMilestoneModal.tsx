'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Milestone, AuthorshipMode } from '@/types';
import { ShieldCheck, Zap, Bot, GraduationCap, Trophy } from 'lucide-react';

interface LogMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (milestone: Omit<Milestone, 'id'>) => void;
}

export const LogMilestoneModal: React.FC<LogMilestoneModalProps> = ({ isOpen, onClose, onLog }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Milestone['type']>('college_lab');
  const [authorship, setAuthorship] = useState<AuthorshipMode>('handcrafted');
  const [techStackInput, setTechStackInput] = useState('');
  const [description, setDescription] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [outcome, setOutcome] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Calculate XP based on Authorship Mode
    let craftsmanXp = 0;
    let velocityXp = 0;

    if (authorship === 'handcrafted') {
      craftsmanXp = type === 'college_lab' ? 150 : 200;
      velocityXp = 0;
    } else if (authorship === 'assisted') {
      craftsmanXp = 60;
      velocityXp = 250;
    } else {
      // AI Generated / Vibe coded
      craftsmanXp = 0;
      velocityXp = 300;
    }

    onLog({
      title: title.trim(),
      type,
      authorship,
      date: new Date().toISOString().split('T')[0],
      techStack: techStack.length > 0 ? techStack : ['Computer Science'],
      description: description.trim(),
      roleDescription: roleDescription.trim(),
      xpAwarded: {
        craftsmanXp,
        velocityXp,
      },
      outcome: outcome.trim() || 'Logged Successfully',
    });

    setTitle('');
    setDescription('');
    setRoleDescription('');
    setTechStackInput('');
    setOutcome('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Project, Lab or Hackathon" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            Milestone / Project Name *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Operating Systems: Multithreaded Web Server in C"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        {/* Milestone Type */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            Activity Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'college_lab', label: 'College Lab', icon: GraduationCap },
              { id: 'coursework', label: 'Coursework', icon: GraduationCap },
              { id: 'hackathon', label: 'Hackathon', icon: Trophy },
              { id: 'personal_project', label: 'Personal Project', icon: Zap },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-mono border-2 transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] ${
                  type === item.id
                    ? 'bg-white text-black border-black'
                    : 'bg-[#1a1d24] text-gray-400 border-[#2d323d] hover:text-white'
                }`}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI INVOLVEMENT SPECTRUM (CRITICAL) */}
        <div className="p-4 rounded-xl bg-[#13151b] border-2 border-[#383e4d] shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Authorship & AI Involvement</span>
            </label>
            <span className="text-[11px] font-mono text-gray-400">
              Protects genuine core skills
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Handcrafted */}
            <button
              type="button"
              onClick={() => setAuthorship('handcrafted')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                authorship === 'handcrafted'
                  ? 'bg-[#182a20] border-[#6ee7b7] text-white shadow-[2px_2px_0px_#6ee7b7]'
                  : 'bg-[#181a21] border-[#2d323d] text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6ee7b7] mb-1 font-mono">
                <ShieldCheck size={16} /> 100% Handcrafted
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                College lab, scratch code, manual debugging. Awards <b>Craftsman XP</b>.
              </p>
            </button>

            {/* AI Assisted */}
            <button
              type="button"
              onClick={() => setAuthorship('assisted')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                authorship === 'assisted'
                  ? 'bg-[#251f33] border-[#c4b5fd] text-white shadow-[2px_2px_0px_#c4b5fd]'
                  : 'bg-[#181a21] border-[#2d323d] text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#c4b5fd] mb-1 font-mono">
                <Zap size={16} /> AI-Assisted (Hybrid)
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Designed logic; AI generated boilerplate/tests. Balanced XP.
              </p>
            </button>

            {/* AI Orchestrated */}
            <button
              type="button"
              onClick={() => setAuthorship('ai_generated')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                authorship === 'ai_generated'
                  ? 'bg-[#261e27] border-[#f472b6] text-white shadow-[2px_2px_0px_#f472b6]'
                  : 'bg-[#181a21] border-[#2d323d] text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f472b6] mb-1 font-mono">
                <Bot size={16} /> Vibe-Coded / AI MVP
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                AI wrote code; you prompted. Awards <b>Velocity XP</b> (0% core syntax).
              </p>
            </button>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            Tech Stack / Languages (comma separated) *
          </label>
          <input
            type="text"
            required
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            placeholder="e.g. C++, Pthreads, Linux or Next.js, Supabase"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            What did you build & what was your role?
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key concepts implemented, bugs solved, or challenges overcome..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        {/* Outcome / Grade / Award */}
        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            Outcome / Grade / Award (Optional)
          </label>
          <input
            type="text"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="e.g. Grade 10/10, Hackathon Finalist, Shipped to GitHub"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={authorship === 'handcrafted' ? 'mint' : 'violet'}
            type="submit"
          >
            Log Milestone & Claim XP
          </Button>
        </div>
      </form>
    </Modal>
  );
};

