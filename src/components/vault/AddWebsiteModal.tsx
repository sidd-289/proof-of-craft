'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Category, Website } from '@/types';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (website: Omit<Website, 'id' | 'createdAt'>) => void;
}

export const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAdd,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-tools');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let computedTitle = title.trim();
    if (!computedTitle) {
      try {
        const u = new URL(url);
        computedTitle = u.hostname.replace('www.', '');
      } catch {
        computedTitle = url;
      }
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onAdd({
      url: url.trim(),
      title: computedTitle,
      description: description.trim(),
      categoryId,
      tags: tags.length > 0 ? tags : ['Resource'],
      isFavorite: false,
      status: 'unread',
    });

    setUrl('');
    setTitle('');
    setDescription('');
    setTagsInput('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Website to Vault">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            Website URL *
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. VisuAlgo - Algorithm Visualizer"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

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
            Why this matters / Notes
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key concepts or what this tool is useful for..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. React, Algorithms, OS"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1d24] border-2 border-[#2d323d] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="sky" type="submit">
            Save to Vault
          </Button>
        </div>
      </form>
    </Modal>
  );
};

