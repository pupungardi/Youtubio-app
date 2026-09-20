'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import UrlAnalyzer from '@/components/UrlAnalyzer';
import ManifestCard from '@/components/ManifestCard';
import VideoPreview from '@/components/VideoPreview';
import CopyBoard from '@/components/CopyBoard';
import FfmpegStudio from '@/components/FfmpegStudio';
import SearchHistory from '@/components/SearchHistory';
import ManifestInspector from '@/components/ManifestInspector';
import GuideModal from '@/components/GuideModal';
import { ManifestData, HistoryItem, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Language>('id');
  const [activeTab, setActiveTab] = useState<'analyzer' | 'history' | 'ffmpeg' | 'guide'>('analyzer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [currentData, setCurrentData] = useState<ManifestData | null>(null);
  const [ffmpegCmds, setFfmpegCmds] = useState<any>(null);
  const [embedCodes, setEmbedCodes] = useState<any>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const t = getTranslation(currentLang);

  // Load client settings and history from localStorage safely after mount to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedLang = localStorage.getItem('youtubio_lang') as Language;
        if (savedLang === 'id' || savedLang === 'en') {
          setCurrentLang(savedLang);
        }
        const savedHist = localStorage.getItem('youtubio_history');
        if (savedHist) {
          setHistory(JSON.parse(savedHist));
        }
      } catch (e) {}
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveHistory = (items: HistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem('youtubio_history', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('youtubio_lang', lang);
    } catch (e) {}
  };

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAnalyze = useCallback(async (url: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || t.errorFetchFailed);
      }

      const data: ManifestData = json.data;
      setCurrentData(data);
      setFfmpegCmds(json.ffmpegCommands);
      setEmbedCodes(json.embedCode);

      // Create history record
      const newHistoryItem: HistoryItem = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url: data.url,
        manifestUrl: data.manifestUrl,
        foundManifest: data.foundManifest,
        title: data.title,
        channelName: data.channelName,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        timestamp: Date.now(),
        streamCount: data.videoStreams.length,
        previewStreamUrl: data.videoStreams[0]?.url,
        isPinned: false,
      };

      // Add to history without duplicating identical active URL
      setHistory((prevHistory) => {
        const filtered = prevHistory.filter((h) => h.url !== data.url);
        const updated = [newHistoryItem, ...filtered];
        try {
          localStorage.setItem('youtubio_history', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      showToast(t.successAnalysis);
      setActiveTab('analyzer');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || t.errorFetchFailed);
    } finally {
      setIsLoading(false);
    }
  }, [t.errorFetchFailed, t.successAnalysis]);

  // Auto load initial default sample for instant preview on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleAnalyze('https://youtubio.elfhosted.com');
    }, 0);
    return () => clearTimeout(timer);
  }, [handleAnalyze]);

  const handleCategoryUpdate = (newCategory: string) => {
    if (!currentData) return;
    const updated = { ...currentData, category: newCategory };
    setCurrentData(updated);

    // Update in history
    const updatedHistory = history.map((h) => {
      if (h.url === updated.url) {
        return { ...h, category: newCategory };
      }
      return h;
    });
    saveHistory(updatedHistory);
    showToast(`Kategori diperbarui: ${newCategory}`);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} ${t.copiedSuccess}`);
  };

  const handleTogglePin = (id: string) => {
    const updated = history.map((h) => (h.id === id ? { ...h, isPinned: !h.isPinned } : h));
    saveHistory(updated);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
  };

  const handleClearAllHistory = () => {
    if (confirm(t.confirmClearHistory)) {
      saveHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-red-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Always visible URL Search Component */}
        <UrlAnalyzer
          currentLang={currentLang}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="bg-red-950/60 border border-red-800/80 p-4 rounded-2xl flex items-center gap-3 text-red-300 text-xs sm:text-sm shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Tab View Switcher */}
        {activeTab === 'guide' ? (
          <GuideModal currentLang={currentLang} />
        ) : activeTab === 'history' ? (
          <SearchHistory
            history={history}
            currentLang={currentLang}
            onSelect={(url) => {
              handleAnalyze(url);
            }}
            onTogglePin={handleTogglePin}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
          />
        ) : activeTab === 'ffmpeg' && currentData ? (
          <FfmpegStudio
            streamUrl={currentData.videoStreams[0]?.url || currentData.url}
            videoTitle={currentData.title}
            currentLang={currentLang}
          />
        ) : (
          /* Default Main Analyzer View */
          currentData && (
            <div className="space-y-8 animate-fadeIn">
              {/* Manifest Card & Category Selector */}
              <ManifestCard
                data={currentData}
                currentLang={currentLang}
                onCopy={handleCopyText}
                onCategoryUpdate={handleCategoryUpdate}
              />

              {/* Video Player Preview */}
              <VideoPreview
                streams={currentData.videoStreams}
                title={currentData.title}
                thumbnailUrl={currentData.thumbnailUrl}
                currentLang={currentLang}
              />

              {/* Salin ke Papan Klip */}
              <CopyBoard
                data={currentData}
                ffmpegCommand={
                  ffmpegCmds?.download ||
                  `ffmpeg -i "${currentData.videoStreams[0]?.url || currentData.url}" -c copy output.mp4`
                }
                embedCode={
                  embedCodes || {
                    iframe: `<iframe src="${currentData.url}" width="100%" height="450"></iframe>`,
                    html5Video: `<video src="${currentData.videoStreams[0]?.url || currentData.url}" controls></video>`,
                  }
                }
                currentLang={currentLang}
              />

              {/* FFmpeg Embed Video Generator */}
              <FfmpegStudio
                streamUrl={currentData.videoStreams[0]?.url || currentData.url}
                videoTitle={currentData.title}
                currentLang={currentLang}
              />

              {/* Raw JSON Manifest Inspector */}
              <ManifestInspector
                manifestJson={currentData.manifestJsonRaw || null}
                currentLang={currentLang}
              />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>Youtubio Manifest & Video Studio</span>
          </div>
          <p>© {new Date().getFullYear()} Youtubio - Ekstraksi Manifest, Pratinjau Video & FFmpeg Generator.</p>
        </div>
      </footer>
    </div>
  );
}
