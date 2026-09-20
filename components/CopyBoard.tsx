'use client';

import React, { useState } from 'react';
import { Copy, Check, FileJson, Video, Terminal, Code, Layout, Sparkles } from 'lucide-react';
import { ManifestData, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface CopyBoardProps {
  data: ManifestData;
  ffmpegCommand: string;
  embedCode: { iframe: string; html5Video: string };
  currentLang: Language;
}

export default function CopyBoard({
  data,
  ffmpegCommand,
  embedCode,
  currentLang,
}: CopyBoardProps) {
  const t = getTranslation(currentLang);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const manifestUrl = data.manifestUrl || `${data.url}/manifest.json`;
  const primaryStreamUrl = data.videoStreams[0]?.url || data.url;

  const copyItems = [
    {
      id: 'manifest',
      title: t.copyManifestBtn,
      value: manifestUrl,
      icon: FileJson,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      description: 'Link URL file manifest.json',
    },
    {
      id: 'stream',
      title: t.copyStreamBtn,
      value: primaryStreamUrl,
      icon: Video,
      color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
      description: 'Direct link stream HLS / MP4 / Dash',
    },
    {
      id: 'ffmpeg',
      title: t.copyFfmpegBtn,
      value: ffmpegCommand,
      icon: Terminal,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      description: 'Perintah Terminal FFmpeg Siap Pakai',
    },
    {
      id: 'iframe',
      title: t.copyIframeBtn,
      value: embedCode.iframe,
      icon: Layout,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
      description: 'Kode Iframe HTML untuk website / blog',
    },
    {
      id: 'html5',
      title: t.copyHtml5Btn,
      value: embedCode.html5Video,
      icon: Code,
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
      description: 'Elemen <video> HTML5 lengkap',
    },
    {
      id: 'json',
      title: t.copyJsonBtn,
      value: JSON.stringify(data, null, 2),
      icon: Sparkles,
      color: 'from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30',
      description: 'Payload metadata hasil ekstraksi',
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="pb-3 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Copy className="w-5 h-5 text-red-500" />
          {t.copyCenterTitle}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t.copyCenterDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {copyItems.map((item) => {
          const Icon = item.icon;
          const isCopied = copiedKey === item.id;

          return (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col justify-between gap-3 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <button
                    id={`copy-item-btn-${item.id}`}
                    type="button"
                    onClick={() => handleCopy(item.id, item.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Text Preview Box */}
              <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 text-[11px] font-mono text-slate-300 truncate select-all">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
