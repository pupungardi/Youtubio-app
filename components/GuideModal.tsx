'use client';

import React from 'react';
import { HelpCircle, FileText, Terminal, Code, Cpu, ExternalLink } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface GuideModalProps {
  currentLang: Language;
}

export default function GuideModal({ currentLang }: GuideModalProps) {
  const t = getTranslation(currentLang);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-red-500" />
            {t.guideTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Panduan lengkap penggunaan ekstraksi manifest, FFmpeg generator, dan penyematan video Youtubio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1 */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {t.guideSection1Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.guideSection1Text}
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {t.guideSection2Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.guideSection2Text}
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Code className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {t.guideSection3Title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.guideSection3Text}
          </p>
        </div>
      </div>

      {/* FFmpeg Commands cheat sheet */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          FFmpeg Terminal Command Quick Reference
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-red-400 font-semibold">1. Stream Copy (Fastest):</div>
            <code className="text-slate-300 block bg-slate-950 p-2 rounded">
              ffmpeg -i &quot;URL_M3U8&quot; -c copy &quot;video.mp4&quot;
            </code>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-semibold">2. Extract MP3 Audio:</div>
            <code className="text-slate-300 block bg-slate-950 p-2 rounded">
              ffmpeg -i &quot;URL_STREAM&quot; -vn -c:a mp3 &quot;music.mp3&quot;
            </code>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-amber-400 font-semibold">3. Trim 1 Minute Video:</div>
            <code className="text-slate-300 block bg-slate-950 p-2 rounded">
              ffmpeg -i &quot;URL&quot; -ss 00:00:00 -t 00:01:00 -c copy &quot;clip.mp4&quot;
            </code>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-purple-400 font-semibold">4. User-Agent Custom Header:</div>
            <code className="text-slate-300 block bg-slate-950 p-2 rounded">
              ffmpeg -headers &quot;User-Agent: Mozilla/5.0&quot; -i &quot;URL&quot; -c copy &quot;out.mp4&quot;
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
