'use client';

import React, { useState } from 'react';
import { FileJson, CheckCircle2, AlertCircle, Copy, ExternalLink, Tag, Save, Check, User, Info } from 'lucide-react';
import { ManifestData, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface ManifestCardProps {
  data: ManifestData;
  currentLang: Language;
  onCopy: (text: string, label: string) => void;
  onCategoryUpdate: (newCategory: string) => void;
}

export default function ManifestCard({
  data,
  currentLang,
  onCopy,
  onCategoryUpdate,
}: ManifestCardProps) {
  const t = getTranslation(currentLang);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(data.category || 'General');

  const categories = [
    { value: 'Gaming', label: t.catGaming },
    { value: 'Music', label: t.catMusic },
    { value: 'Tech', label: t.catTech },
    { value: 'Entertainment', label: t.catEntertainment },
    { value: 'News', label: t.catNews },
    { value: 'Tutorial', label: t.catTutorial },
    { value: 'Vlog', label: t.catVlog },
    { value: 'General', label: t.catGeneral },
  ];

  const handleCopyManifest = () => {
    const manifestLink = data.manifestUrl || `${data.url}/manifest.json`;
    onCopy(manifestLink, t.copyManifestBtn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCategory(val);
    onCategoryUpdate(val);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Manifest Detection Badge Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-xl ${
            data.foundManifest
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            <FileJson className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {data.foundManifest ? t.manifestFound : t.manifestNotFound}
              </h2>
              {data.foundManifest ? (
                <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  FOUND
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  INFERRED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {data.manifestSource === 'link_header' && t.manifestSourceLink}
              {data.manifestSource === 'json_root' && t.manifestSourceJson}
              {data.manifestSource === 'inferred' && t.manifestSourceInferred}
              {data.manifestSource === 'none' && t.manifestSourceInferred}
            </p>
          </div>
        </div>

        {/* Quick Copy Manifest URL Button */}
        <div className="flex items-center gap-2">
          {data.manifestUrl && (
            <a
              href={data.manifestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
              title={t.openManifestLink}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            id="copy-manifest-url-btn"
            type="button"
            onClick={handleCopyManifest}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.copiedSuccess : t.copyManifestUrl}</span>
          </button>
        </div>
      </div>

      {/* Manifest URL Bar */}
      {data.manifestUrl && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-medium shrink-0">manifest.json:</span>
          <span className="text-red-400 font-mono truncate select-all">{data.manifestUrl}</span>
        </div>
      )}

      {/* Channel Information & Categorization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thumbnail Preview */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
          <img
            src={data.thumbnailUrl}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/youtubio/800/450';
            }}
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur text-[10px] text-slate-300 font-mono">
            {data.siteName || 'Youtubio'}
          </div>
        </div>

        {/* Channel Details */}
        <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5" />
              <span>{data.channelName || 'Youtubio Channel'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2">
              {data.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-1">
              {data.description}
            </p>
          </div>

          {/* Channel Categorization Control */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">
                {t.categoryLabel}
              </span>
            </div>

            <select
              id="channel-category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-lg px-3 py-1.5 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
