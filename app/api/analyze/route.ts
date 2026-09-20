import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ManifestData, VideoStream } from '@/lib/types';

export const runtime = 'nodejs';

function normalizeUrl(input: string): string {
  let urlStr = input.trim();
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = 'https://' + urlStr;
  }
  return urlStr;
}

function generateFfmpegCommands(streamUrl: string, title: string) {
  const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30) || 'output';
  return {
    download: `ffmpeg -i "${streamUrl}" -c copy -bsf:a aac_adtstoasc "${safeTitle}.mp4"`,
    reencode: `ffmpeg -i "${streamUrl}" -c:v libx264 -crf 23 -c:a aac -b:a 192k "${safeTitle}_reencoded.mp4"`,
    extractAudio: `ffmpeg -i "${streamUrl}" -vn -c:a mp3 -b:a 192k "${safeTitle}_audio.mp3"`,
    hlsRecord: `ffmpeg -headers "User-Agent: Mozilla/5.0" -i "${streamUrl}" -c copy -f mp4 "${safeTitle}_live.mp4"`,
    custom: `ffmpeg -i "${streamUrl}" -ss 00:00:00 -t 00:05:00 -c copy "${safeTitle}_trimmed.mp4"`,
  };
}

function generateEmbedCodes(streamUrl: string, title: string, manifestUrl: string | null) {
  const safeTitle = title || 'Youtubio Video Stream';
  
  if (streamUrl.includes('youtube.com/embed/') || streamUrl.includes('youtu.be/')) {
    return {
      iframe: `<iframe width="100%" height="450" src="${streamUrl}" title="${safeTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
      html5Video: `<!-- Embedded YouTube iFrame used for stream source -->\n<iframe width="100%" height="450" src="${streamUrl}" frameborder="0" allowfullscreen></iframe>`,
    };
  }

  return {
    iframe: `<iframe width="100%" height="450" src="${streamUrl}" title="${safeTitle}" frameborder="0" allowfullscreen></iframe>`,
    html5Video: `<video controls width="100%" height="auto" poster="" crossorigin="anonymous">\n  <source src="${streamUrl}" type="application/x-mpegURL" />\n  <source src="${streamUrl}" type="video/mp4" />\n  Your browser does not support the video tag.\n</video>`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { url, customCategory } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL parameter is required.' }, { status: 400 });
    }

    const targetUrl = normalizeUrl(url);
    const parsedUrl = new URL(targetUrl);
    const origin = parsedUrl.origin;

    let foundManifest = false;
    let manifestUrl: string | null = null;
    let manifestSource: ManifestData['manifestSource'] = 'none';
    let manifestJsonRaw: Record<string, any> | null = null;
    let pageTitle = '';
    let channelName = '';
    let description = '';
    let thumbnailUrl = '';
    let detectedCategory = customCategory || 'General';
    let tags: string[] = ['Youtubio', 'Video Stream', 'Manifest'];
    let videoStreams: VideoStream[] = [];

    // Helper fetch with timeout
    const fetchWithTimeout = async (target: string, headers = {}) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(target, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml,application/json,*/*',
            ...headers,
          },
          signal: controller.signal,
        });
        clearTimeout(timer);
        return res;
      } catch (err) {
        clearTimeout(timer);
        return null;
      }
    };

    // Check if target URL itself is directly a manifest.json
    if (parsedUrl.pathname.endsWith('/manifest.json') || parsedUrl.pathname.endsWith('manifest.json')) {
      const jsonRes = await fetchWithTimeout(targetUrl);
      if (jsonRes && jsonRes.ok) {
        try {
          manifestJsonRaw = await jsonRes.json();
          foundManifest = true;
          manifestUrl = targetUrl;
          manifestSource = 'json_root';
        } catch (_) {}
      }
    }

    // If not direct json manifest, attempt fetching HTML or checking default /manifest.json path
    let htmlText = '';
    if (!foundManifest) {
      const res = await fetchWithTimeout(targetUrl);
      if (res && res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          try {
            manifestJsonRaw = await res.json();
            foundManifest = true;
            manifestUrl = targetUrl;
            manifestSource = 'json_root';
          } catch (_) {}
        } else {
          htmlText = await res.text();
        }
      }

      // If HTML was fetched, scan for <link rel="manifest" href="...">
      if (htmlText && !foundManifest) {
        const manifestLinkMatch = htmlText.match(/<link[^>]+rel=["']manifest["'][^>]+href=["']([^"']+)["']/i) ||
                                  htmlText.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']manifest["']/i);
        if (manifestLinkMatch && manifestLinkMatch[1]) {
          const rawHref = manifestLinkMatch[1];
          manifestUrl = new URL(rawHref, targetUrl).href;
          foundManifest = true;
          manifestSource = 'link_header';

          // Try fetching the discovered manifest URL
          const mRes = await fetchWithTimeout(manifestUrl);
          if (mRes && mRes.ok) {
            try {
              manifestJsonRaw = await mRes.json();
            } catch (_) {}
          }
        }
      }

      // Proactive check: try origin + '/manifest.json' if still not found
      if (!foundManifest) {
        const fallbackManifestUrl = `${origin}/manifest.json`;
        const fRes = await fetchWithTimeout(fallbackManifestUrl);
        if (fRes && fRes.ok) {
          const cType = fRes.headers.get('content-type') || '';
          if (cType.includes('json') || fallbackManifestUrl.endsWith('manifest.json')) {
            try {
              manifestJsonRaw = await fRes.json();
              foundManifest = true;
              manifestUrl = fallbackManifestUrl;
              manifestSource = 'inferred';
            } catch (_) {}
          }
        }
      }
    }

    // Extract metadata from manifestJsonRaw if available
    if (manifestJsonRaw) {
      pageTitle = manifestJsonRaw.name || manifestJsonRaw.short_name || manifestJsonRaw.title || pageTitle;
      description = manifestJsonRaw.description || description;
      channelName = manifestJsonRaw.author || manifestJsonRaw.channel_name || manifestJsonRaw.publisher || manifestJsonRaw.short_name || parsedUrl.hostname;

      if (manifestJsonRaw.icons && Array.isArray(manifestJsonRaw.icons) && manifestJsonRaw.icons.length > 0) {
        const iconSrc = manifestJsonRaw.icons[0].src;
        if (iconSrc) {
          thumbnailUrl = new URL(iconSrc, manifestUrl || targetUrl).href;
        }
      }

      // Handle Stremio/Youtubio addon manifest properties
      if (manifestJsonRaw.catalogs && Array.isArray(manifestJsonRaw.catalogs)) {
        const genres = manifestJsonRaw.catalogs.map((c: any) => c.name || c.id).filter(Boolean);
        if (genres.length > 0) {
          tags.push(...genres);
          detectedCategory = genres[0] || detectedCategory;
        }
      }

      // Extract streams embedded in custom manifest JSON
      if (manifestJsonRaw.streams && Array.isArray(manifestJsonRaw.streams)) {
        manifestJsonRaw.streams.forEach((st: any, idx: number) => {
          if (st.url || st.ytId) {
            const stUrl = st.url || `https://www.youtube.com/watch?v=${st.ytId}`;
            videoStreams.push({
              id: `manifest-stream-${idx}`,
              quality: st.title || st.quality || '1080p',
              url: stUrl,
              format: stUrl.includes('.m3u8') ? 'hls' : stUrl.includes('youtube') ? 'youtube' : 'mp4',
            });
          }
        });
      }
    }

    // Parse HTML metadata (OG tags, title, video links) if htmlText exists
    if (htmlText) {
      const titleMatch = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && !pageTitle) pageTitle = titleMatch[1].trim();

      const ogTitleMatch = htmlText.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) pageTitle = ogTitleMatch[1].trim();

      const ogSiteNameMatch = htmlText.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i);
      if (ogSiteNameMatch && ogSiteNameMatch[1]) channelName = ogSiteNameMatch[1].trim();

      const ogDescMatch = htmlText.match(/<meta[^>]+(?:property|name)=["'](?:og:description|description)["'][^>]+content=["']([^"']+)["']/i);
      if (ogDescMatch && ogDescMatch[1] && !description) description = ogDescMatch[1].trim();

      const ogImgMatch = htmlText.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i);
      if (ogImgMatch && ogImgMatch[1] && !thumbnailUrl) {
        thumbnailUrl = new URL(ogImgMatch[1], targetUrl).href;
      }

      // Extract video streams from HTML (<video src>, <source src>, og:video, m3u8 regex, youtube embeds)
      const streamUrlsFound = new Set<string>();

      // 1. OG video
      const ogVideoMatch = htmlText.match(/<meta[^>]+property=["']og:video(?::url)?["'][^>]+content=["']([^"']+)["']/i);
      if (ogVideoMatch && ogVideoMatch[1]) {
        streamUrlsFound.add(new URL(ogVideoMatch[1], targetUrl).href);
      }

      // 2. HTML5 Video / Source tags
      const videoSrcRegex = /<(?:video|source)[^>]+src=["']([^"']+)["']/gi;
      let match;
      while ((match = videoSrcRegex.exec(htmlText)) !== null) {
        if (match[1]) {
          try {
            streamUrlsFound.add(new URL(match[1], targetUrl).href);
          } catch (_) {}
        }
      }

      // 3. Regex for .m3u8, .mpd, or .mp4 links in scripts or content
      const mediaRegex = /(https?:\/\/[^\s"']+\.(?:m3u8|mpd|mp4)(?:\?[^\s"']*)?)/gi;
      let mediaMatch;
      while ((mediaMatch = mediaRegex.exec(htmlText)) !== null) {
        if (mediaMatch[1]) {
          streamUrlsFound.add(mediaMatch[1]);
        }
      }

      // 4. Regex for YouTube embeds or watch URLs
      const ytRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[a-zA-Z0-9_-]{11})/gi;
      let ytMatch;
      while ((ytMatch = ytRegex.exec(htmlText)) !== null) {
        if (ytMatch[1]) {
          streamUrlsFound.add(ytMatch[1]);
        }
      }

      // Add discovered streams
      Array.from(streamUrlsFound).forEach((stUrl, i) => {
        let fmt: VideoStream['format'] = 'mp4';
        if (stUrl.includes('.m3u8')) fmt = 'hls';
        else if (stUrl.includes('.mpd')) fmt = 'dash';
        else if (stUrl.includes('youtube') || stUrl.includes('youtu.be')) fmt = 'youtube';

        // Avoid duplication
        if (!videoStreams.some(s => s.url === stUrl)) {
          videoStreams.push({
            id: `html-stream-${i}`,
            quality: i === 0 ? '1080p (Full HD)' : i === 1 ? '720p (HD)' : 'Auto',
            url: stUrl,
            format: fmt,
          });
        }
      });
    }

    // Fallbacks if metadata is still empty
    if (!pageTitle) {
      pageTitle = parsedUrl.hostname.replace('www.', '') + ' Video Stream';
    }
    if (!channelName) {
      channelName = parsedUrl.hostname.split('.')[0].toUpperCase() || 'Youtubio Channel';
    }
    if (!description) {
      description = `Koleksi video stream & manifest media dari ${channelName} (${parsedUrl.hostname}).`;
    }
    if (!thumbnailUrl) {
      thumbnailUrl = `https://picsum.photos/seed/${encodeURIComponent(parsedUrl.hostname)}/800/450`;
    }

    // Default sample stream fallback if no stream extracted from dead/empty site
    if (videoStreams.length === 0) {
      if (targetUrl.includes('youtubio') || targetUrl.includes('elfhosted')) {
        videoStreams.push({
          id: `sample-stream-hls`,
          quality: '1080p (HLS Live Stream)',
          url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          format: 'hls',
        });
        videoStreams.push({
          id: `sample-stream-mp4`,
          quality: '720p (Direct MP4)',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          format: 'mp4',
        });
      } else {
        videoStreams.push({
          id: `direct-target-stream`,
          quality: 'Auto Stream',
          url: targetUrl.includes('.m3u8') || targetUrl.includes('.mp4') ? targetUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          format: targetUrl.includes('.m3u8') ? 'hls' : 'mp4',
        });
      }
    }

    // Optional Gemini AI enhancement for auto-categorizing and generating channel tags
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Analyze this video streaming website metadata and categorize the channel.
URL: ${targetUrl}
Title: ${pageTitle}
Channel: ${channelName}
Description: ${description}
Manifest Data: ${JSON.stringify(manifestJsonRaw || {}).substring(0, 500)}

Respond with JSON format only:
{
  "category": "One of [Gaming, Music, Tech, Entertainment, News, Education, Vlog, General]",
  "refinedTitle": "Refined title if needed",
  "tags": ["tag1", "tag2", "tag3"]
}`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (aiResponse.text) {
          const cleanText = aiResponse.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedAi = JSON.parse(cleanText);
          if (parsedAi.category && !customCategory) {
            detectedCategory = parsedAi.category;
          }
          if (parsedAi.tags && Array.isArray(parsedAi.tags)) {
            tags = Array.from(new Set([...tags, ...parsedAi.tags]));
          }
          if (parsedAi.refinedTitle && parsedAi.refinedTitle.length > 3) {
            pageTitle = parsedAi.refinedTitle;
          }
        }
      } catch (geminiError) {
        console.warn('Gemini categorization skipped:', geminiError);
      }
    }

    const primaryStreamUrl = videoStreams[0]?.url || targetUrl;
    const ffmpegCmds = generateFfmpegCommands(primaryStreamUrl, pageTitle);
    const embeds = generateEmbedCodes(primaryStreamUrl, pageTitle, manifestUrl);

    const result: ManifestData = {
      url: targetUrl,
      manifestUrl,
      foundManifest,
      manifestSource,
      title: pageTitle,
      channelName,
      description,
      thumbnailUrl,
      category: detectedCategory,
      tags,
      videoStreams,
      manifestJsonRaw: manifestJsonRaw || {
        name: pageTitle,
        short_name: channelName,
        description,
        start_url: targetUrl,
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#3b82f6',
        icons: [
          { src: thumbnailUrl, sizes: '512x512', type: 'image/jpeg' }
        ],
        source_parsed: targetUrl,
      },
      siteName: parsedUrl.hostname,
      analyzedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: result,
      ffmpegCommands: ffmpegCmds,
      embedCode: embeds,
    });
  } catch (err: any) {
    console.error('Error analyzing URL:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred while analyzing the URL.' },
      { status: 500 }
    );
  }
}
