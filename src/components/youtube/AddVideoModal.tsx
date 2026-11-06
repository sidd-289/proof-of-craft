'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Category, YouTubeVideo } from '@/types';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from '@/lib/youtube';
import { Play } from 'lucide-react';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (video: Omit<YouTubeVideo, 'id' | 'createdAt'>) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAdd,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-ai');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'to_watch' | 'watched'>('to_watch');
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  // Auto-parse on URL change
  useEffect(() => {
    const parsed = parseYouTubeUrl(url);
    if (parsed) {
      setPreviewThumbnail(parsed.thumbnailUrl);
      fetchYouTubeOEmbed(parsed.cleanUrl).then((data) => {
        if (data?.title && !title) setTitle(data.title);
        if (data?.author_name && !channelTitle) setChannelTitle(data.author_name);
      });
    } else {
      setPreviewThumbnail(null);
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseYouTubeUrl(url);
    if (!parsed) {
      alert('Please enter a valid YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)');
      return;
    }

    onAdd({
      url: parsed.cleanUrl,
      videoId: parsed.videoId,
      title: title.trim() || `YouTube Video (${parsed.videoId})`,
      channelTitle: channelTitle.trim() || 'YouTube Creator',
      thumbnailUrl: parsed.thumbnailUrl,
      categoryId,
      status,
      notes: notes.trim(),
      watchedAt: status === 'watched' ? new Date().toISOString() : undefined,
    });

    setUrl('');
    setTitle('');
    setChannelTitle('');
    setNotes('');
    setPreviewThumbnail(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add YouTube Video">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            YouTube Link *
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        {/* Live Thumbnail Preview */}
        {previewThumbnail && (
          <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-[#383e4d] shadow-[3px_3px_0px_#000] bg-black">
            <img
              src={previewThumbnail}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                <Play size={20} className="ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Auto-detected or enter title"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
              Channel Name
            </label>
            <input
              type="text"
              value={channelTitle}
              onChange={(e) => setChannelTitle(e.target.value)}
              placeholder="e.g. 3Blue1Brown, Fireship"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
              Queue Status
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('to_watch')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all shadow-[2px_2px_0px_#000] ${
                  status === 'to_watch'
                    ? 'bg-[#fde047] text-black border-black'
                    : 'bg-[#1a1d24] text-gray-400 border-[#2d323d]'
                }`}
              >
                To Watch
              </button>
              <button
                type="button"
                onClick={() => setStatus('watched')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all shadow-[2px_2px_0px_#000] ${
                  status === 'watched'
                    ? 'bg-[#6ee7b7] text-black border-black'
                    : 'bg-[#1a1d24] text-gray-400 border-[#2d323d]'
                }`}
              >
                Already Watched
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            Key Learning Notes / Why Watch
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Watch chapter 3 before college OS exam on deadlocks..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" type="submit">
            Add Video
          </Button>
        </div>
      </form>
    </Modal>
  );
};

