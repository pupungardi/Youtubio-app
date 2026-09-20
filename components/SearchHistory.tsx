'use client';

import React, { useState } from 'react';
import { History, Search, Pin, Trash2, Play, Copy, ExternalLink, Download, FileJson, Check } from 'lucide-react';
import { HistoryItem, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface SearchHistoryProps {
  history: HistoryItem[];
  currentLang: Language;
  onSelect: (url: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function SearchHistory({
  history,
  currentLang,
  onSelect,
  onTogglePin,
  onDelete,
  onClearAll,
}: SearchHistoryProps) {
  const t = getTranslation(currentLang);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.channelName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort pinned first, then by timestamp desc
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp - a.timestamp;
  });

  const categories = Array.from(
    new Set(history.map((h) => h.category).filter(Boolean))
  );

  const handleCopyManifest = (id: string, manifestUrl: string | null) => {
    if (!manifestUrl) return;
    navigator.clipboard.writeText(manifestUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `youtubio_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Export/Clear Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-red-500" />
            {t.historyTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.historySubtitle} ({history.length} URL)
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white text-xs font-semibold rounded-xl border border-red-800/60 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t.searchHistoryPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:border-red-500 outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.filterAllCats}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History Grid */}
      {sortedHistory.length === 0 ? (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
          <History className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-semibold text-slate-300">{t.emptyHistory}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedHistory.map((item) => (
            <div
              key={item.id}
              className={`bg-slate-950 border rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all relative group ${
                item.isPinned
                  ? 'border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Thumbnail & Badges */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/youtubio/800/450';
                  }}
                />

                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {item.category || 'General'}
                  </span>
                  {item.foundManifest && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur text-[10px] font-bold text-emerald-400">
                      MANIFEST
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onTogglePin(item.id)}
                  className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur transition-colors ${
                    item.isPinned
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                  title={item.isPinned ? t.unpinItem : t.pinItem}
                >
                  <Pin className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  {item.url}
                </p>
                <div className="text-[10px] text-slate-500 pt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(item.url)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{t.reAnalyze}</span>
                </button>

                <div className="flex items-center gap-1">
                  {item.manifestUrl && (
                    <button
                      type="button"
                      onClick={() => handleCopyManifest(item.id, item.manifestUrl)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title={t.copyManifestBtn}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <FileJson className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-red-300 rounded-lg transition-colors"
                    title={t.deleteItem}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
