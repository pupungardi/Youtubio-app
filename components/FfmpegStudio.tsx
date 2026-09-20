'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Settings, Scissors, Music, Shield, Play } from 'lucide-react';
import { FfmpegOptions, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface FfmpegStudioProps {
  streamUrl: string;
  videoTitle: string;
  currentLang: Language;
}

export default function FfmpegStudio({
  streamUrl,
  videoTitle,
  currentLang,
}: FfmpegStudioProps) {
  const t = getTranslation(currentLang);
  const [copied, setCopied] = useState(false);

  const [options, setOptions] = useState<FfmpegOptions>({
    outputFormat: 'mp4',
    vcodec: 'copy',
    acodec: 'copy',
    crf: 23,
    startTime: '',
    duration: '',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    preset: 'fast',
  });

  const [isAudioOnly, setIsAudioOnly] = useState(false);

  const safeFilename = (videoTitle || 'youtubio_output')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);

  const buildCommand = (): string => {
    let cmd = 'ffmpeg';

    // Headers / User Agent
    if (options.userAgent) {
      cmd += ` -headers "User-Agent: ${options.userAgent}"`;
    }

    // Input URL
    cmd += ` -i "${streamUrl || 'https://example.com/stream.m3u8'}"`;

    // Trim start time
    if (options.startTime.trim()) {
      cmd += ` -ss ${options.startTime.trim()}`;
    }

    // Trim duration
    if (options.duration.trim()) {
      cmd += ` -t ${options.duration.trim()}`;
    }

    if (isAudioOnly) {
      cmd += ` -vn -c:a ${options.acodec === 'copy' ? 'copy' : 'libmp3lame -b:a 192k'}`;
      cmd += ` "${safeFilename}.mp3"`;
    } else {
      // Video codec
      if (options.vcodec === 'copy') {
        cmd += ` -c:v copy`;
      } else {
        cmd += ` -c:v ${options.vcodec} -crf ${options.crf} -preset ${options.preset}`;
      }

      // Audio codec
      if (options.acodec === 'copy') {
        cmd += ` -c:a copy`;
      } else {
        cmd += ` -c:a ${options.acodec} -b:a 192k`;
      }

      // Bitstream filter for HLS MP4 output
      if (streamUrl.includes('.m3u8') && options.outputFormat === 'mp4' && options.vcodec === 'copy') {
        cmd += ` -bsf:a aac_adtstoasc`;
      }

      cmd += ` "${safeFilename}.${options.outputFormat}"`;
    }

    return cmd;
  };

  const currentCommand = buildCommand();

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            {t.ffmpegTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.ffmpegSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            FFmpeg v6.0+ Compatible
          </span>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Output Format & Audio Switch */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-red-400" />
            {t.outputFormat}
          </label>

          <div className="grid grid-cols-3 gap-1.5">
            {(['mp4', 'mkv', 'ts', 'avi', 'webm'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => {
                  setOptions({ ...options, outputFormat: fmt });
                  setIsAudioOnly(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                  !isAudioOnly && options.outputFormat === fmt
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                .{fmt}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Music className="w-3.5 h-3.5 text-amber-400" />
              {t.audioOnly}
            </span>
            <input
              type="checkbox"
              checked={isAudioOnly}
              onChange={(e) => setIsAudioOnly(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Codec & Speed Options */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Play className="w-4 h-4 text-amber-400" />
            {t.videoCodec}
          </label>

          <select
            value={options.vcodec}
            onChange={(e) => setOptions({ ...options, vcodec: e.target.value as any })}
            disabled={isAudioOnly}
            className="w-full bg-slate-900 text-slate-200 border border-slate-700 text-xs rounded-lg p-2 focus:border-red-500 outline-none disabled:opacity-50"
          >
            <option value="copy">Stream Copy (Fastest, No Re-encoding)</option>
            <option value="libx264">H.264 (libx264 - Best Compatibility)</option>
            <option value="libx265">H.265 / HEVC (libx265 - High Compression)</option>
            <option value="libvpx-vp9">VP9 (libvpx-vp9 - WebM Standard)</option>
          </select>

          <div className="text-[11px] text-slate-400">
            {options.vcodec === 'copy' ? (
              <p className="text-emerald-400 font-medium">⚡ {t.fastCopy}</p>
            ) : (
              <p>Mengkonversi ulang stream dengan kustomisasi CRF {options.crf}.</p>
            )}
          </div>
        </div>

        {/* Trim Controls */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Scissors className="w-4 h-4 text-purple-400" />
            Trim & Potong Video
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400">{t.trimStart}</span>
              <input
                type="text"
                placeholder="00:00:10"
                value={options.startTime}
                onChange={(e) => setOptions({ ...options, startTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-1.5 font-mono focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">{t.trimDuration}</span>
              <input
                type="text"
                placeholder="00:05:00"
                value={options.duration}
                onChange={(e) => setOptions({ ...options, duration: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-1.5 font-mono focus:border-red-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Code Output Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>{t.generatedCommand}</span>
          <span className="text-slate-400 font-mono text-[11px]">{t.runInTerminal}</span>
        </div>

        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-inner group">
          <pre className="text-emerald-400 font-mono text-xs sm:text-sm whitespace-pre-wrap break-all pr-12">
            {currentCommand}
          </pre>

          <button
            id="copy-ffmpeg-terminal-cmd-btn"
            type="button"
            onClick={handleCopyCommand}
            className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg transition-all cursor-pointer"
            title={t.copyCommand}
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
