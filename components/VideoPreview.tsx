'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, Tv, Check, RefreshCw } from 'lucide-react';
import { VideoStream, Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

interface VideoPreviewProps {
  streams: VideoStream[];
  title: string;
  thumbnailUrl: string;
  currentLang: Language;
}

export default function VideoPreview({
  streams,
  title,
  thumbnailUrl,
  currentLang,
}: VideoPreviewProps) {
  const t = getTranslation(currentLang);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [useFallbackEmbed, setUseFallbackEmbed] = useState(false);

  const activeStream = streams[selectedStreamIndex] || streams[0];

  useEffect(() => {
    let hlsInstance: any = null;

    if (!activeStream || useFallbackEmbed) return;

    const streamUrl = activeStream.url;
    const isHls = streamUrl.includes('.m3u8') || activeStream.format === 'hls';

    if (isHls && videoRef.current) {
      // Dynamic import hls.js to avoid SSR window error
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(videoRef.current!);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed successfully');
          });
          hlsInstance.on(Hls.Events.ERROR, (_: any, data: any) => {
            if (data.fatal) {
              console.warn('HLS Fatal Error, falling back:', data);
              setUseFallbackEmbed(true);
            }
          });
        } else if (videoRef.current!.canPlayType('application/vnd.apple.mpegurl')) {
          // Native Safari HLS
          videoRef.current!.src = streamUrl;
        }
      }).catch((err) => {
        console.warn('Could not load hls.js:', err);
      });
    } else if (videoRef.current) {
      videoRef.current.src = streamUrl;
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [activeStream, useFallbackEmbed]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  if (!streams || streams.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <Tv className="w-12 h-12 mx-auto text-slate-600 mb-2" />
        <p className="text-sm font-medium">{t.noStreams}</p>
      </div>
    );
  }

  const isYouTube = activeStream.url.includes('youtube.com') || activeStream.url.includes('youtu.be');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header & Quality Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-red-500" />
            {t.previewTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.previewSubtitle}
          </p>
        </div>

        {/* Quality Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" />
            {t.qualityLabel}
          </label>
          <select
            id="stream-quality-select"
            value={selectedStreamIndex}
            onChange={(e) => {
              setSelectedStreamIndex(Number(e.target.value));
              setUseFallbackEmbed(false);
            }}
            className="bg-slate-950 text-slate-200 border border-slate-700 text-xs rounded-xl px-3 py-1.5 focus:border-red-500 outline-none cursor-pointer"
          >
            {streams.map((st, i) => (
              <option key={st.id || i} value={i}>
                {st.quality} ({st.format.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner group">
        {isYouTube || useFallbackEmbed ? (
          <iframe
            src={
              isYouTube
                ? activeStream.url.replace('watch?v=', 'embed/')
                : activeStream.url
            }
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              poster={thumbnailUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              crossOrigin="anonymous"
              controls
              className="w-full h-full object-contain bg-black"
            />
          </>
        )}
      </div>

      {/* Stream Info Bar */}
      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold uppercase tracking-wider text-[10px] border border-red-500/30">
            {activeStream.format}
          </span>
          <span className="text-slate-300 font-mono truncate max-w-xs sm:max-w-md">
            {activeStream.url}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setUseFallbackEmbed(!useFallbackEmbed)}
          className="flex items-center gap-1 text-slate-400 hover:text-amber-400 text-xs transition-colors"
          title="Toggle Embed / Direct Video"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{useFallbackEmbed ? 'Gunakan Video Player' : 'Gunakan iFrame Embed'}</span>
        </button>
      </div>
    </div>
  );
}
