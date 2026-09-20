'use client';

import React, { useState } from 'react';
import { Search, Clipboard, X, Play, Loader2, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface UrlAnalyzerProps {
  currentLang: Language;
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export default function UrlAnalyzer({
  currentLang,
  onAnalyze,
  isLoading,
}: UrlAnalyzerProps) {
  const [inputUrl, setInputUrl] = useState('');
  const t = getTranslation(currentLang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onAnalyze(inputUrl.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const presets = [
    {
      label: t.presetYoutubio,
      url: 'https://youtubio.elfhosted.com',
      badge: 'Youtubio',
    },
    {
      label: t.presetManifest,
      url: 'https://youtubio.elfhosted.com/manifest.json',
      badge: 'Manifest.json',
    },
    {
      label: t.presetHls,
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      badge: 'HLS Stream',
    },
    {
      label: t.presetMp4,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      badge: 'Direct MP4',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Title & Headline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-red-500" />
              {t.inputPlaceholder.split('(')[0]}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>

            <input
              id="url-input-field"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder={t.inputPlaceholder}
              disabled={isLoading}
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-white placeholder-slate-500 text-sm rounded-xl pl-12 pr-28 py-3.5 transition-all shadow-inner outline-none disabled:opacity-60"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              {inputUrl ? (
                <button
                  type="button"
                  onClick={() => setInputUrl('')}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title={t.btnClear}
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                  title={t.btnPaste}
                >
                  <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{t.btnPaste}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              id="analyze-submit-btn"
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t.btnAnalyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.btnAnalyze}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Test Presets */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <span>{t.presetTitle}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => {
                  setInputUrl(p.url);
                  onAnalyze(p.url);
                }}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs rounded-lg border border-slate-800 hover:border-slate-700 transition-all group cursor-pointer"
              >
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-red-400 border border-red-500/20 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  {p.badge}
                </span>
                <span className="truncate max-w-[180px]">{p.label}</span>
                <Play className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
