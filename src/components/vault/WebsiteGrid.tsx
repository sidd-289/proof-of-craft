'use client';

import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  Star,
  Trash2,
  Plus,
  Globe,
  Tag,
  FolderOpen,
} from 'lucide-react';
import { Website, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AddWebsiteModal } from './AddWebsiteModal';

interface WebsiteGridProps {
  websites: Website[];
  categories: Category[];
  onAddWebsite: (site: Omit<Website, 'id' | 'createdAt'>) => void;
  onDeleteWebsite: (id: string) => void;
  onUpdateWebsite: (id: string, partial: Partial<Website>) => void;
}

export const WebsiteGrid: React.FC<WebsiteGridProps> = ({
  websites,
  categories,
  onAddWebsite,
  onDeleteWebsite,
  onUpdateWebsite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredWebsites = websites.filter((site) => {
    const matchesCategory = selectedCategory === 'all' || site.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      site.title.toLowerCase().includes(q) ||
      site.description.toLowerCase().includes(q) ||
      site.url.toLowerCase().includes(q) ||
      site.tags.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Category Pills & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 transition-all shadow-[2px_2px_0px_#000] whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white text-black border-black'
                : 'bg-[#14161c] text-gray-300 border-[#2d323d] hover:border-gray-400'
            }`}
          >
            All Resources ({websites.length})
          </button>

          {categories.map((cat) => {
            const count = websites.filter((w) => w.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 transition-all shadow-[2px_2px_0px_#000] whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-black text-black'
                    : 'bg-[#14161c] text-gray-300 border-[#2d323d] hover:border-gray-400'
                }`}
                style={isSelected ? { backgroundColor: cat.color } : undefined}
              >
                <span>{cat.name}</span>
                <span className="opacity-70 text-xs">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Add Website */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search links, tags, titles..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#14161c] border-2 border-[#2d323d] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white shadow-[2px_2px_0px_#000]"
            />
          </div>

          <Button
            variant="sky"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-shrink-0"
          >
            <Plus size={16} />
            <span>Add Link</span>
          </Button>
        </div>
      </div>

      {/* Website Cards Grid */}
      {filteredWebsites.length === 0 ? (
        <div className="brutal-card p-12 text-center border-dashed border-[#383e4d]">
          <Globe size={40} className="mx-auto text-gray-600 mb-3" />
          <h4 className="text-base font-bold text-gray-300 mb-1">No websites found</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            No resources match your filter or search query. Paste a URL in the AI Command Bar above or click "Add Link".
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={14} /> Add First Link
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWebsites.map((site) => {
            const category = categories.find((c) => c.id === site.categoryId);

            return (
              <div
                key={site.id}
                className="brutal-card p-4 flex flex-col justify-between hover:border-gray-300 group"
              >
                <div>
                  {/* Category Pill & Favorite */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    {category ? (
                      <Badge color={category.color}>
                        <FolderOpen size={12} />
                        {category.name}
                      </Badge>
                    ) : (
                      <Badge variant="neutral">General</Badge>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateWebsite(site.id, { isFavorite: !site.isFavorite })}
                        className={`p-1 rounded transition-colors ${
                          site.isFavorite
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-gray-600 hover:text-gray-400'
                        }`}
                        title={site.isFavorite ? 'Unfavorite' : 'Favorite'}
                      >
                        <Star size={16} fill={site.isFavorite ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={() => onDeleteWebsite(site.id)}
                        className="p-1 rounded text-gray-600 hover:text-rose-400 transition-colors"
                        title="Delete Website"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Domain */}
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
                    {site.title}
                  </h4>

                  <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {site.description || 'No description provided.'}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  {site.tags && site.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {site.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono px-2 py-0.5 rounded bg-[#1c1f26] text-gray-400 border border-[#2d323d]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Visit Link Button */}
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full brutal-btn py-1.5 text-xs bg-[#1a1d24] text-gray-200 border-[#2d323d] hover:bg-white hover:text-black flex items-center justify-center gap-1.5"
                  >
                    <span>Open Resource</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Website Modal */}
      <AddWebsiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onAdd={onAddWebsite}
      />
    </div>
  );
};

