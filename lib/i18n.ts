import { Language } from './types';

export const translations = {
  id: {
    appTitle: 'Youtubio',
    appSubtitle: 'Ekstraktor Manifest.json & Generator Embed Video FFmpeg',
    tagline: 'Analisis URL website, dapatkan link manifest.json, pratinjau video, dan dapatkan perintah FFmpeg secara otomatis.',
    
    // Header & Nav
    navAnalyzer: 'Analisis URL',
    navHistory: 'Riwayat Pencarian',
    navFfmpeg: 'FFmpeg Studio',
    navGuide: 'Panduan & Bantuan',
    langName: 'Bahasa Indonesia',

    // Input & Search
    inputPlaceholder: 'Masukkan URL website atau link manifest.json (contoh: https://youtubio.elfhosted.com)...',
    btnAnalyze: 'Analisis & Ekstrak',
    btnAnalyzing: 'Mengekstrak...',
    btnPaste: 'Tempel URL',
    btnClear: 'Bersihkan',
    presetTitle: 'URL Sampel Uji Coba:',
    presetYoutubio: 'Youtubio Main Site',
    presetManifest: 'Youtubio Manifest JSON',
    presetHls: 'Sampel HLS Stream (.m3u8)',
    presetMp4: 'Sampel Video Direct MP4',

    // Manifest Status Card
    manifestFound: 'Manifest.json Ditemukan!',
    manifestNotFound: 'Manifest.json Tidak Ditemukan Langsung',
    manifestSourceLink: 'Ditemukan dari tag <link rel="manifest">',
    manifestSourceJson: 'URL merupakan file JSON Manifest langsung',
    manifestSourceInferred: 'Disimpulkan dari struktur media website',
    copyManifestUrl: 'Salin URL Manifest.json',
    openManifestLink: 'Buka Manifest JSON',
    channelInfo: 'Informasi Channel / Platform',
    channelName: 'Nama Channel',
    categoryLabel: 'Kategori Channel:',
    selectCategory: 'Pilih Kategori...',
    catGaming: 'Gaming & Esport',
    catMusic: 'Musik & Lagu',
    catTech: 'Teknologi & Gadget',
    catEntertainment: 'Hiburan & Film',
    catNews: 'Berita & Politik',
    catTutorial: 'Edukasi & Tutorial',
    catVlog: 'Vlog & Gaya Hidup',
    catGeneral: 'Umum / Lainnya',
    saveCategory: 'Simpan Kategori',

    // Video Preview
    previewTitle: 'Pratinjau Video Stream',
    previewSubtitle: 'Tonton video hasil ekstraksi sebelum mengategorikan channel.',
    qualityLabel: 'Pilih Kualitas Stream:',
    noStreams: 'Tidak ada aliran video yang dapat diputar secara langsung. Gunakan link embed atau perintah FFmpeg di bawah.',
    streamType: 'Tipe Stream',
    streamUrl: 'URL Stream',
    playStream: 'Putar Stream',

    // Copy to Clipboard Section
    copyCenterTitle: 'Salin ke Papan Klip',
    copyCenterDesc: 'Klik tombol di bawah untuk menyalin URL, perintah FFmpeg, atau kode embed dengan 1-klik.',
    copyManifestBtn: 'Salin URL Manifest',
    copyStreamBtn: 'Salin URL Video Stream',
    copyFfmpegBtn: 'Salin Perintah FFmpeg',
    copyIframeBtn: 'Salin Kode Iframe Embed',
    copyHtml5Btn: 'Salin HTML5 <video> Tag',
    copyJsonBtn: 'Salin Metadata JSON',
    copiedSuccess: 'Berhasil disalin ke papan klip!',
    copiedError: 'Gagal menyalin ke papan klip',

    // FFmpeg Studio
    ffmpegTitle: 'FFmpeg Embed & Download Studio',
    ffmpegSubtitle: 'Buat perintah terminal FFmpeg instan untuk mendownload, merekam, atau mengkonversi video tanpa ribet.',
    outputFormat: 'Format Output',
    videoCodec: 'Codec Video',
    audioCodec: 'Codec Audio',
    fastCopy: 'Kecepatan Maksimal (tanpa re-encode)',
    trimStart: 'Waktu Mulai (-ss)',
    trimDuration: 'Durasi (-t)',
    audioOnly: 'Ekstrak Audio Saja',
    userAgentHeader: 'User-Agent / Header Tambahan',
    generatedCommand: 'Perintah FFmpeg Siap Pakai:',
    copyCommand: 'Salin Perintah',
    runInTerminal: 'Jalankan perintah ini di Command Prompt / Terminal perangkat Anda.',

    // Embed Code
    embedTitle: 'Kode Embed Video Website',
    embedIframeDesc: 'Gunakan iframe ini untuk menyematkan pemutar video di halaman web Anda:',
    embedHtmlDesc: 'Gunakan HTML5 Video Tag ini untuk pemutaran langsung:',

    // JSON Inspector
    jsonTitle: 'Inspektor Raw Manifest.json',
    jsonSubtitle: 'Struktur data JSON lengkap yang diekstrak dari website.',

    // History
    historyTitle: 'Riwayat Pencarian & Analisis',
    historySubtitle: 'Daftar URL yang telah dianalisis sebelumnya untuk akses cepat.',
    emptyHistory: 'Belum ada riwayat pencarian. Masukkan URL di atas untuk memulai!',
    clearHistory: 'Hapus Semua Riwayat',
    searchHistoryPlaceholder: 'Cari dalam riwayat (judul, URL, kategori)...',
    filterAllCats: 'Semua Kategori',
    reAnalyze: 'Analisis Ulang',
    pinItem: 'Sematkan',
    unpinItem: 'Lepas Sematan',
    deleteItem: 'Hapus',
    confirmClearHistory: 'Apakah Anda yakin ingin menghapus seluruh riwayat pencarian?',

    // Guide Modal / Help
    guideTitle: 'Panduan Penggunaan Youtubio',
    guideSection1Title: '1. Cara Ekstraksi Manifest.json',
    guideSection1Text: 'Masukkan URL website Youtubio atau situs video streaming lainnya. Sistem akan secara otomatis memindai tag <link rel="manifest">, endpoint JSON, serta sumber video HLS (.m3u8) atau MP4.',
    guideSection2Title: '2. Menggunakan Perintah FFmpeg',
    guideSection2Text: 'FFmpeg adalah tool command line populer. Setelah mengekstrak URL video, pilih opsi yang diinginkan di FFmpeg Studio, lalu salin perintahnya dan jalankan di Command Prompt (Windows) atau Terminal (Mac/Linux).',
    guideSection3Title: '3. Penyelamatan & Embed Video',
    guideSection3Text: 'Gunakan kode embed HTML5 atau iframe untuk langsung memasang video pada blog, website, atau LMS tanpa perlu mencari kode embed secara manual.',

    // Status / Toast
    errorInvalidUrl: 'URL tidak valid. Mohon sertakan http:// atau https://',
    errorFetchFailed: 'Gagal mengambil data dari URL tersebut. Pastikan situs dapat diakses.',
    successAnalysis: 'Berhasil mengekstrak data dari URL!',
  },
  en: {
    appTitle: 'Youtubio',
    appSubtitle: 'Manifest.json Extractor & FFmpeg Video Embed Generator',
    tagline: 'Analyze website URLs, extract manifest.json links, preview video streams, and auto-generate FFmpeg commands.',
    
    // Header & Nav
    navAnalyzer: 'URL Analyzer',
    navHistory: 'Search History',
    navFfmpeg: 'FFmpeg Studio',
    navGuide: 'Guide & Help',
    langName: 'English',

    // Input & Search
    inputPlaceholder: 'Enter website URL or manifest.json link (e.g., https://youtubio.elfhosted.com)...',
    btnAnalyze: 'Analyze & Extract',
    btnAnalyzing: 'Extracting...',
    btnPaste: 'Paste URL',
    btnClear: 'Clear',
    presetTitle: 'Quick Test URLs:',
    presetYoutubio: 'Youtubio Main Site',
    presetManifest: 'Youtubio Manifest JSON',
    presetHls: 'Sample HLS Stream (.m3u8)',
    presetMp4: 'Sample Direct MP4 Video',

    // Manifest Status Card
    manifestFound: 'Manifest.json Discovered!',
    manifestNotFound: 'Manifest.json Not Found Directly',
    manifestSourceLink: 'Discovered from <link rel="manifest"> tag',
    manifestSourceJson: 'URL is a direct JSON Manifest file',
    manifestSourceInferred: 'Inferred from website media structure',
    copyManifestUrl: 'Copy Manifest.json URL',
    openManifestLink: 'Open Manifest JSON',
    channelInfo: 'Channel / Platform Info',
    channelName: 'Channel Name',
    categoryLabel: 'Channel Category:',
    selectCategory: 'Select Category...',
    catGaming: 'Gaming & Esports',
    catMusic: 'Music & Songs',
    catTech: 'Technology & Gadgets',
    catEntertainment: 'Entertainment & Movies',
    catNews: 'News & Politics',
    catTutorial: 'Education & Tutorials',
    catVlog: 'Vlog & Lifestyle',
    catGeneral: 'General / Other',
    saveCategory: 'Save Category',

    // Video Preview
    previewTitle: 'Video Stream Preview',
    previewSubtitle: 'Preview video playback before categorizing the channel.',
    qualityLabel: 'Select Stream Quality:',
    noStreams: 'No directly playable video stream detected. Use the embed code or FFmpeg commands below.',
    streamType: 'Stream Type',
    streamUrl: 'Stream URL',
    playStream: 'Play Stream',

    // Copy to Clipboard Section
    copyCenterTitle: 'Copy to Clipboard',
    copyCenterDesc: '1-click copy buttons for Manifest URL, direct video links, FFmpeg CLI commands, or embed codes.',
    copyManifestBtn: 'Copy Manifest URL',
    copyStreamBtn: 'Copy Stream URL',
    copyFfmpegBtn: 'Copy FFmpeg Command',
    copyIframeBtn: 'Copy Iframe Embed',
    copyHtml5Btn: 'Copy HTML5 <video> Tag',
    copyJsonBtn: 'Copy Metadata JSON',
    copiedSuccess: 'Successfully copied to clipboard!',
    copiedError: 'Failed to copy to clipboard',

    // FFmpeg Studio
    ffmpegTitle: 'FFmpeg Embed & Download Studio',
    ffmpegSubtitle: 'Generate instant terminal FFmpeg commands to download, record, or convert videos effortlessly.',
    outputFormat: 'Output Format',
    videoCodec: 'Video Codec',
    audioCodec: 'Audio Codec',
    fastCopy: 'Maximum Speed (Stream copy, no re-encode)',
    trimStart: 'Start Time (-ss)',
    trimDuration: 'Duration (-t)',
    audioOnly: 'Extract Audio Only',
    userAgentHeader: 'User-Agent / Extra Headers',
    generatedCommand: 'Ready-to-use FFmpeg Command:',
    copyCommand: 'Copy Command',
    runInTerminal: 'Run this command in your Command Prompt / Terminal.',

    // Embed Code
    embedTitle: 'Website Video Embed Code',
    embedIframeDesc: 'Use this iframe snippet to embed the player on your website:',
    embedHtmlDesc: 'Use this HTML5 video tag for direct playback:',

    // JSON Inspector
    jsonTitle: 'Raw Manifest.json Inspector',
    jsonSubtitle: 'Complete JSON data structure extracted from the website.',

    // History
    historyTitle: 'Search & Analysis History',
    historySubtitle: 'List of previously analyzed URLs for fast access.',
    emptyHistory: 'No search history yet. Input a URL above to get started!',
    clearHistory: 'Clear All History',
    searchHistoryPlaceholder: 'Search history (title, URL, category)...',
    filterAllCats: 'All Categories',
    reAnalyze: 'Re-Analyze',
    pinItem: 'Pin',
    unpinItem: 'Unpin',
    deleteItem: 'Delete',
    confirmClearHistory: 'Are you sure you want to clear all search history?',

    // Guide Modal / Help
    guideTitle: 'Youtubio User Guide',
    guideSection1Title: '1. How Manifest.json Extraction Works',
    guideSection1Text: 'Enter any Youtubio or video web page URL. The app automatically scans for <link rel="manifest">, JSON endpoints, and HLS (.m3u8) or MP4 video streams.',
    guideSection2Title: '2. Using FFmpeg Commands',
    guideSection2Text: 'FFmpeg is a command-line tool. After extracting video streams, customize your desired flags in FFmpeg Studio, copy the command, and run it in Command Prompt or Terminal.',
    guideSection3Title: '3. Video Embedding',
    guideSection3Text: 'Copy the ready-made HTML5 or iframe embed snippets to insert video players into your blog or web application without manual code writing.',

    // Status / Toast
    errorInvalidUrl: 'Invalid URL. Please include http:// or https://',
    errorFetchFailed: 'Failed to fetch data from this URL. Make sure the site is accessible.',
    successAnalysis: 'Successfully extracted data from URL!',
  }
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.id;
}
