'use client';

import React from 'react';
import { Tv, History, Terminal, HelpCircle, Globe, Sparkles, Check } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'analyzer' | 'history' | 'ffmpeg' | 'guide';
  onTabChange: (tab: 'analyzer' | 'history' | 'ffmpeg' | 'guide') => void;
  historyCount: number;
}

export default function Navbar({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  historyCount,
}: NavbarProps) {
  const t = getTranslation(currentLang);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <div 
          onClick={() => onTabChange('analyzer')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-md shadow-red-900/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Tv className="w-5 h-5 text-red-500 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Youtubio
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Manifest Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-analyzer"
            onClick={() => onTabChange('analyzer')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'analyzer'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">{t.navAnalyzer}</span>
          </button>

          <button
            id="nav-tab-history"
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
              activeTab === 'history'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden md:inline">{t.navHistory}</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-slate-950 text-red-400 rounded-full border border-red-500/40">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-ffmpeg"
            onClick={() => onTabChange('ffmpeg')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'ffmpeg'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden md:inline">{t.navFfmpeg}</span>
          </button>

          <button
            id="nav-tab-guide"
            onClick={() => onTabChange('guide')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'guide'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">{t.navGuide}</span>
          </button>

          {/* Multilingual Selector */}
          <div className="ml-2 pl-2 border-l border-slate-800 flex items-center gap-1">
            <button
              id="lang-toggle-btn"
              onClick={() => onLanguageChange(currentLang === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Ganti Bahasa / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-red-400" />
              <span>{currentLang === 'id' ? '🇮🇩 ID' : '🇺🇸 EN'}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
