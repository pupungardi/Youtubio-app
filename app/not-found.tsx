import Link from 'next/link';
import { Tv, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
          <Tv className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-xs text-slate-400">
          Halaman yang Anda cari tidak ditemukan. Kembali ke halaman utama Youtubio.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
