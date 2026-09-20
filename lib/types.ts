export interface VideoStream {
  id: string;
  quality: string; // '1080p' | '720p' | '480p' | '360p' | 'Auto' | 'Audio Only'
  url: string;
  format: 'mp4' | 'hls' | 'dash' | 'youtube' | 'embed' | 'unknown';
  codec?: string;
  bitrate?: string;
  fps?: number;
}

export interface ManifestData {
  url: string;
  manifestUrl: string | null;
  foundManifest: boolean;
  manifestSource: 'link_header' | 'json_root' | 'inferred' | 'none';
  title: string;
  channelName: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  videoStreams: VideoStream[];
  manifestJsonRaw?: Record<string, any> | null;
  siteName?: string;
  language?: string;
  analyzedAt: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  manifestUrl: string | null;
  foundManifest: boolean;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  category: string;
  timestamp: number;
  isPinned?: boolean;
  streamCount: number;
  previewStreamUrl?: string;
}

export interface FfmpegOptions {
  outputFormat: 'mp4' | 'mkv' | 'avi' | 'ts' | 'mp3' | 'aac' | 'webm';
  vcodec: 'copy' | 'libx264' | 'libx265' | 'libvpx-vp9' | 'none';
  acodec: 'copy' | 'aac' | 'libmp3lame' | 'opus' | 'none';
  crf: number;
  startTime: string; // e.g. "00:00:00"
  duration: string; // e.g. "00:05:00"
  userAgent?: string;
  headers?: string;
  preset: 'ultrafast' | 'fast' | 'medium' | 'slow';
}

export type Language = 'id' | 'en';
