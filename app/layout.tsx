import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Youtubio - Manifest Extractor & FFmpeg Generator',
  description: 'Ekstrak link manifest.json, pratinjau video, generator perintah FFmpeg, dan analisis channel Youtubio.',
  openGraph: {
    title: 'Youtubio - Manifest Extractor & FFmpeg Generator',
    description: 'Ekstrak link manifest.json, pratinjau video, generator perintah FFmpeg, dan analisis channel Youtubio.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youtubio - Manifest Extractor & FFmpeg Generator',
    description: 'Ekstrak link manifest.json, pratinjau video, generator perintah FFmpeg, dan analisis channel Youtubio.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
