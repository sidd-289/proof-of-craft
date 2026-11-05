'use client';

import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Plus,
  Clock,
  Sparkles,
  BookOpen,
  FolderOpen,
} from 'lucide-react';
import { YouTubeVideo, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AddVideoModal } from './AddVideoModal';

interface VideoQueueProps {
  videos: YouTubeVideo[];
  categories: Category[];
  onAddVideo: (video: Omit<YouTubeVideo, 'id' | 'createdAt'>) => void;
  onUpdateVideo: (id: string, partial: Partial<YouTubeVideo>) => void;
  onDeleteVideo: (id: string) => void;
  onMarkWatched: (id: string, notes?: string) => void;
}

export const VideoQueue: React.FC<VideoQueueProps> = ({
  videos,
  categories,
  onAddVideo,
  onDeleteVideo,
  onMarkWatched,
}) => {
  const [activeTab, setActiveTab] = useState<'to_watch' | 'watched'>('to_watch');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  const filteredVideos = videos.filter((video) => {
    const matchesTab = video.status === activeTab;
    const matchesCategory = selectedCategory === 'all' || video.categoryId === selectedCategory;
    return matchesTab && matchesCategory;
  });

  const toWatchCount = videos.filter((v) => v.status === 'to_watch').length;
  const watchedCount = videos.filter((v) => v.status === 'watched').length;

  return (
    <div>
      {/* Tab Switcher & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* To Watch vs Watched Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#14161c] border-2 border-[#2d323d] shadow-[3px_3px_0px_#000] w-fit">
          <button
            onClick={() => setActiveTab('to_watch')}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold font-mono transition-all flex items-center gap-2 ${
              activeTab === 'to_watch'
                ? 'bg-[#fde047] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock size={16} />
            <span>To Watch ({toWatchCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('watched')}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold font-mono transition-all flex items-center gap-2 ${
              activeTab === 'watched'
                ? 'bg-[#6ee7b7] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CheckCircle2 size={16} />
            <span>Watched Archive ({watchedCount})</span>
          </button>
        </div>

        {/* Add Video Button */}
        <Button variant="amber" size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add YouTube Video</span>
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-md text-xs font-mono font-bold border transition-all ${
            selectedCategory === 'all'
              ? 'bg-white text-black border-white'
              : 'bg-[#14161c] text-gray-400 border-[#2d323d] hover:border-gray-400'
          }`}
        >
          All Topics
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold border transition-all ${
                isSelected
                  ? 'border-white text-white'
                  : 'bg-[#14161c] text-gray-400 border-[#2d323d] hover:border-gray-400'
              }`}
              style={isSelected ? { backgroundColor: `${cat.color}30`, borderColor: cat.color } : undefined}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Video Cards Grid */}
      {filteredVideos.length === 0 ? (
        <div className="brutal-card p-12 text-center border-dashed border-[#383e4d]">
          <Play size={40} className="mx-auto text-gray-600 mb-3" />
          <h4 className="text-base font-bold text-gray-300 mb-1">
            {activeTab === 'to_watch' ? 'No videos in your To Watch queue' : 'No watched videos yet'}
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            {activeTab === 'to_watch'
              ? 'Paste a YouTube video URL in the AI Command Bar above or click "Add YouTube Video".'
              : 'When you finish watching a video, click "Mark as Watched" to earn Knowledge XP!'}
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={14} /> Add Video
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const category = categories.find((c) => c.id === video.categoryId);
            const isSummaryExpanded = expandedSummaryId === video.id;

            return (
              <div
                key={video.id}
                className="brutal-card overflow-hidden flex flex-col justify-between hover:border-gray-300 group"
              >
                <div>
                  {/* Thumbnail with HQ Preview & Duration */}
                  <div className="relative aspect-video bg-black overflow-hidden border-b-2 border-[#2d323d]">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Play Badge */}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                        <Play size={20} className="ml-1" fill="currentColor" />
                      </div>
                    </a>

                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-xs font-mono text-white font-bold">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {category ? (
                        <Badge color={category.color}>
                          <FolderOpen size={11} />
                          {category.name}
                        </Badge>
                      ) : (
                        <Badge variant="neutral">AI / General</Badge>
                      )}

                      <button
                        onClick={() => onDeleteVideo(video.id)}
                        className="p-1 rounded text-gray-600 hover:text-rose-400 transition-colors"
                        title="Remove Video"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
                      {video.title}
                    </h4>

                    <p className="text-xs text-gray-400 font-mono mb-3">
                      Channel: <span className="text-gray-300">{video.channelTitle}</span>
                    </p>

                    {/* Notes / Takeaways */}
                    {video.notes && (
                      <div className="p-2.5 rounded-lg bg-[#1a1d24] border border-[#2d323d] text-xs text-gray-300 mb-3 flex items-start gap-2">
                        <BookOpen size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{video.notes}</span>
                      </div>
                    )}

                    {/* AI Summary Toggle */}
                    {video.aiSummary && (
                      <div className="mb-3">
                        <button
                          onClick={() => setExpandedSummaryId(isSummaryExpanded ? null : video.id)}
                          className="text-[11px] font-mono text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <Sparkles size={12} />
                          {isSummaryExpanded ? 'Hide AI Briefing' : 'View AI Briefing'}
                        </button>
                        {isSummaryExpanded && (
                          <div className="mt-2 p-2.5 rounded-lg bg-[#221f14] border border-amber-500/30 text-xs text-amber-100 leading-relaxed font-sans">
                            {video.aiSummary}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 space-y-2">
                  {video.status === 'to_watch' ? (
                    <Button
                      variant="mint"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => onMarkWatched(video.id)}
                    >
                      <CheckCircle2 size={15} />
                      <span>Mark as Watched (+35 XP)</span>
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400 py-1.5 px-3 rounded-lg bg-[#16241b] border border-[#6ee7b7]/30">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Completed
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {video.watchedAt ? new Date(video.watchedAt).toLocaleDateString() : 'Finished'}
                      </span>
                    </div>
                  )}

                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full brutal-btn py-1.5 text-xs bg-[#1a1d24] text-gray-300 border-[#2d323d] hover:bg-white hover:text-black flex items-center justify-center gap-1.5"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onAdd={onAddVideo}
      />
    </div>
  );
};

