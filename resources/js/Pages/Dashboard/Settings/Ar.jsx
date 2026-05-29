import { Head, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Ar({ invitation, groomNickname, brideNickname, arUrl, nftReady }) {
    const { flash } = usePage().props;
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(invitation.ar_style || 'classic');
    const [saving, setSaving] = useState(false);

    // ── NFT State ──
    const [nftStatus, setNftStatus]   = useState(nftReady ? 'ready' : 'idle'); // idle | loading | uploading | ready | error
    const [nftMessage, setNftMessage] = useState('');
    const [nftProgress, setNftProgress] = useState(0);

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(arUrl)}`;
    const hiroMarkerUrl = '/images/ar/hiro.png';

    const handleStyleChange = (style) => {
        setSelectedStyle(style);
        setSaving(true);
        router.post(route('settings.ar.style'), { ar_style: style }, {
            preserveScroll: true,
            onSuccess: () => setSaving(false),
            onError: () => setSaving(false),
        });
    };

    // ── NFT: generate + upload ──
    const handleGenerateNft = async () => {
        setNftStatus('loading');
        setNftMessage('Memuat NFT engine...');
        setNftProgress(5);

        try {
            // 1. Load QR code image via canvas (bypass CORS with proxy)
            setNftMessage('Mengambil gambar QR code...');
            setNftProgress(10);
            const qrImg = await loadImageToCanvas(qrCodeUrl, 400, 400);

            // 2. Load NFT Marker Creator WASM from CDN
            setNftMessage('Memuat NFT engine (WebAssembly)...');
            setNftProgress(20);

            const script = await loadScript('https://raw.githack.com/nicktindall/cyclon.p2p-rtc-server/master/static/artoolkitNFT.min.js');

            // 3. Use NFT Marker Creator web tool API
            setNftMessage('Memproses QR sebagai NFT marker...');
            setNftProgress(40);

            // Use the online NFT Marker Creator API approach
            const descriptors = await generateNftDescriptors(qrImg);

            setNftMessage('Mengunggah descriptor ke server...');
            setNftProgress(85);

            // 4. Upload to server
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(route('settings.ar.nft.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    fset:  descriptors.fset,
                    fset3: descriptors.fset3,
                    iset:  descriptors.iset,
                }),
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'Upload gagal');

            setNftProgress(100);
            setNftStatus('ready');
            setNftMessage('NFT marker berhasil dibuat! Refresh halaman AR untuk menggunakannya.');

        } catch (err) {
            console.error('NFT generation error:', err);
            setNftStatus('error');
            setNftMessage('Gagal: ' + err.message);
        }
    };

    const handleResetNft = async () => {
        if (!confirm('Reset ke Hiro marker? NFT marker QR akan dihapus.')) return;
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        await fetch(route('settings.ar.nft.destroy'), {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': csrfToken || '', 'Accept': 'application/json' },
        });
        setNftStatus('idle');
        setNftMessage('');
        setNftProgress(0);
    };

    // ── Helpers ──
    function loadImageToCanvas(src, w, h) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const c = document.createElement('canvas');
                c.width = w; c.height = h;
                c.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(c);
            };
            img.onerror = () => reject(new Error('Gagal load QR image'));
            // Use QR server with explicit size
            img.src = src + '&t=' + Date.now();
        });
    }

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
            const s = document.createElement('script');
            s.src = url; s.async = true;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Gagal memuat script: ' + url));
            document.head.appendChild(s);
        });
    }

    async function generateNftDescriptors(canvas) {
        // Use the NFT Marker Creator approach:
        // Load jsartoolkitnft from CDN and generate descriptors
        setNftMessage('Menginisialisasi NFT tracker...');
        setNftProgress(45);

        // Try to use ARToolkitNFT if available (loaded from aframe-ar-nft.js)
        // Otherwise use the simplified descriptor generation
        return new Promise(async (resolve, reject) => {
            try {
                // Load the NFT marker creator script
                await loadScript('https://raw.githack.com/Carnaux/NFT-Marker-Creator/master/app/static/artoolkitNFT_ES6_wasm.js');
                setNftProgress(60);

                const ctx = canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                if (typeof ARToolkitNFT === 'undefined') {
                    throw new Error('ARToolkitNFT tidak tersedia. Coba gunakan upload manual.');
                }

                const artoolkit = await ARToolkitNFT.init();
                setNftProgress(70);

                const nft = new artoolkit();
                await nft.setup(canvas.width, canvas.height, 72);

                setNftProgress(75);
                const result = await nft.processImage(imageData.data, canvas.width, canvas.height);

                if (!result) throw new Error('Gagal generate descriptor');

                // Convert ArrayBuffer to base64
                const toBase64 = (buf) => {
                    const bytes = new Uint8Array(buf);
                    let binary = '';
                    bytes.forEach(b => binary += String.fromCharCode(b));
                    return btoa(binary);
                };

                resolve({
                    fset:  toBase64(result.fset),
                    fset3: toBase64(result.fset3),
                    iset:  toBase64(result.iset),
                });

            } catch (e) {
                reject(e);
            }
        });
    }

    const handleDownloadCard = () => {
        setDownloading(true);
        setDownloadError('');

        // ── CANVAS: Portrait 600×900 Combined Card ──
        const canvas = document.createElement('canvas');
        canvas.width  = 600;
        canvas.height = 920;
        const ctx = canvas.getContext('2d');

        // Background warm cream
        const grad = ctx.createLinearGradient(0, 0, 600, 920);
        grad.addColorStop(0, '#FFFBF9');
        grad.addColorStop(1, '#FFF0E8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 920);

        // Outer border (coral)
        ctx.strokeStyle = '#E5654B';
        ctx.lineWidth = 6;
        roundRect(ctx, 20, 20, 560, 880, 18);
        ctx.stroke();

        // Inner gold border
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.5;
        roundRect(ctx, 30, 30, 540, 860, 14);
        ctx.stroke();

        // Title chip
        ctx.fillStyle = '#E5654B';
        ctx.font = 'bold 13px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '2px';
        ctx.fillText('KARTU AUGMENTED REALITY (AR)', 300, 68);

        // Names
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'italic bold 38px Georgia, serif';
        ctx.fillText(`${groomNickname} & ${brideNickname}`, 300, 118);

        // Thin divider
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(120, 134); ctx.lineTo(480, 134); ctx.stroke();

        // Helper: round rect path
        function roundRect(c, x, y, w, h, r) {
            c.beginPath();
            c.moveTo(x + r, y);
            c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
            c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
            c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y);
            c.closePath();
        }

        const loadImg = (src, crossorigin) => new Promise((resolve, reject) => {
            const img = new Image();
            if (crossorigin) img.crossOrigin = 'Anonymous';
            img.onload  = () => resolve(img);
            img.onerror = () => reject(new Error(`Gagal memuat: ${src}`));
            img.src = src;
        });

        Promise.all([
            loadImg(hiroMarkerUrl, false),
            loadImg(qrCodeUrl, true)
        ]).then(([hiroImg, qrImg]) => {

            // ── Section 1: Hiro Marker ──
            ctx.fillStyle = '#F9F9F9';
            roundRect(ctx, 80, 154, 440, 330, 14);
            ctx.fill();
            ctx.strokeStyle = '#EEEEEE'; ctx.lineWidth = 1;
            roundRect(ctx, 80, 154, 440, 330, 14);
            ctx.stroke();

            // Step badge
            ctx.fillStyle = '#E5654B';
            ctx.beginPath(); ctx.arc(110, 182, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center';
            ctx.fillText('2', 110, 187);

            ctx.fillStyle = '#555';
            ctx.font = 'bold 11px Arial'; ctx.textAlign = 'left';
            ctx.fillText('ARAHKAN KAMERA KE MARKER INI', 132, 187);

            // Draw Hiro image centred in section
            const hiroSize = 240;
            ctx.drawImage(hiroImg, (600 - hiroSize) / 2, 204, hiroSize, hiroSize);

            // ── Divider with arrow ──
            ctx.fillStyle = '#E5654B';
            ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center';
            ctx.fillText('▼', 300, 507);
            ctx.fillStyle = '#aaa';
            ctx.font = '10px Arial';
            ctx.fillText('Scan QR lalu arahkan kamera ke marker di atas', 300, 524);

            // ── Section 2: QR Code ──
            ctx.fillStyle = '#F9F9F9';
            roundRect(ctx, 80, 536, 440, 310, 14);
            ctx.fill();
            ctx.strokeStyle = '#EEEEEE'; ctx.lineWidth = 1;
            roundRect(ctx, 80, 536, 440, 310, 14);
            ctx.stroke();

            // Step badge
            ctx.fillStyle = '#E5654B';
            ctx.beginPath(); ctx.arc(110, 564, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center';
            ctx.fillText('1', 110, 569);

            ctx.fillStyle = '#555';
            ctx.font = 'bold 11px Arial'; ctx.textAlign = 'left';
            ctx.fillText('SCAN QR CODE INI TERLEBIH DAHULU', 132, 569);

            const qrSize = 220;
            ctx.drawImage(qrImg, (600 - qrSize) / 2, 585, qrSize, qrSize);

            // ── Footer ──
            ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(120, 862); ctx.lineTo(480, 862); ctx.stroke();
            ctx.fillStyle = '#aaa';
            ctx.font = 'italic 10px Arial'; ctx.textAlign = 'center';
            ctx.fillText('Undangan Digital Premium — Scan & Lihat Keajaiban 3D', 300, 880);

            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `Kartu_AR_${invitation.slug}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloading(false);

        }).catch(err => {
            console.error(err);
            setDownloadError('Gagal men-download kartu. Klik kanan pada pratinjau untuk menyimpan.');
            setDownloading(false);
        });
    };

    return (
        <DashboardLayout title="Undangan AR (Augmented Reality)">
            <Head title="Undangan AR" />
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header Information */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-md">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Augmented Reality (AR) Undangan</h2>
                            <p className="text-orange-50 text-sm mt-1">
                                Hadirkan efek magis 3D interaktif pada undangan fisik Anda! Cukup cetak Kartu AR di bawah dan lampirkan bersama undangan cetak Anda.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Instruction Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-[#E5654B] flex items-center justify-center font-bold flex-shrink-0 text-sm">1</div>
                        <div>
                            <h4 className="font-semibold text-gray-800 text-sm">Unduh & Cetak Kartu</h4>
                            <p className="text-xs text-gray-500 mt-1">Unduh kartu AR di bawah ini lalu cetak dan lampirkan bersama undangan fisik yang Anda bagikan.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-[#E5654B] flex items-center justify-center font-bold flex-shrink-0 text-sm">2</div>
                        <div>
                            <h4 className="font-semibold text-gray-800 text-sm">Pindai QR Code</h4>
                            <p className="text-xs text-gray-500 mt-1">Tamu cukup memindai QR Code menggunakan kamera HP untuk membuka browser WebAR secara instan.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-[#E5654B] flex items-center justify-center font-bold flex-shrink-0 text-sm">3</div>
                        <div>
                            <h4 className="font-semibold text-gray-800 text-sm">Arahkan ke Marker</h4>
                            <p className="text-xs text-gray-500 mt-1">Arahkan kamera HP ke pola Marker Hiro pada kartu, maka visual 3D foto Anda & musik akan muncul melayang!</p>
                        </div>
                    </div>
                </div>

                {/* Theme Selector */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                        <h3 className="font-bold text-gray-800">Pilih Tema Visual WebAR</h3>
                        <p className="text-xs text-gray-400">Pilih nuansa visual 3D yang akan muncul saat marker discan</p>
                    </div>

                    {flash?.success && (
                        <div className="bg-orange-50 border border-orange-200 text-[#b03a24] px-4 py-3 rounded-xl text-xs mb-4 flex items-center gap-2">
                            <span className="text-sm">✓</span>
                            <span>{flash.success}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Classic Floral Card */}
                        <button
                            onClick={() => handleStyleChange('classic')}
                            disabled={saving}
                            className={`text-left rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden min-h-[160px] ${
                                selectedStyle === 'classic'
                                    ? 'border-[#E5654B] bg-orange-50/20 ring-2 ring-[#E5654B]/20'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#E5654B]/5 rounded-bl-full flex items-center justify-center">
                                <span className="text-lg">🌸</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-[#E5654B] tracking-wider uppercase">TEMA CLASSIC</span>
                                <h4 className="font-bold text-gray-800 text-sm mt-1">Classic Floral Arch</h4>
                                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                                    Gerbang bunga mawar romantis dengan sepasang burung merpati mengepakkan sayap dan kelopak bunga mawar merah muda berjatuhan.
                                </p>
                            </div>
                            {selectedStyle === 'classic' && (
                                <span className="absolute bottom-4 right-4 text-xs font-bold text-[#E5654B] flex items-center gap-1">
                                    Aktif <span className="text-sm">✓</span>
                                </span>
                            )}
                        </button>

                        {/* Cosmic Stars Card */}
                        <button
                            onClick={() => handleStyleChange('cosmic')}
                            disabled={saving}
                            className={`text-left rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden min-h-[160px] ${
                                selectedStyle === 'cosmic'
                                    ? 'border-indigo-600 bg-indigo-50/10 ring-2 ring-indigo-600/20'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 rounded-bl-full flex items-center justify-center">
                                <span className="text-lg">✨</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">TEMA MODERN</span>
                                <h4 className="font-bold text-gray-800 text-sm mt-1">Cosmic Galaxy</h4>
                                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                                    Cincin bintang berkilau melayang dengan bulan berputar, gugusan partikel angkasa perak, dan percikan kembang api kosmik.
                                </p>
                            </div>
                            {selectedStyle === 'cosmic' && (
                                <span className="absolute bottom-4 right-4 text-xs font-bold text-indigo-600 flex items-center gap-1">
                                    Aktif <span className="text-sm">✓</span>
                                </span>
                            )}
                        </button>

                        {/* Traditional Javanese Card */}
                        <button
                            onClick={() => handleStyleChange('java')}
                            disabled={saving}
                            className={`text-left rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden min-h-[160px] ${
                                selectedStyle === 'java'
                                    ? 'border-amber-600 bg-amber-50/10 ring-2 ring-amber-600/20'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-600/5 rounded-bl-full flex items-center justify-center">
                                <span className="text-lg">👑</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase">TEMA ETNIK</span>
                                <h4 className="font-bold text-gray-800 text-sm mt-1">Traditional Javanese</h4>
                                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                                    Gunungan wayang kulit megah bernuansa emas-cokelat tradisional dengan kepakan burung serta hujan cahaya keemasan.
                                </p>
                            </div>
                            {selectedStyle === 'java' && (
                                <span className="absolute bottom-4 right-4 text-xs font-bold text-amber-600 flex items-center gap-1">
                                    Aktif <span className="text-sm">✓</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Card Design Preview */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-3">
                        <div>
                            <h3 className="font-bold text-gray-800">Desain Kartu AR Anda</h3>
                            <p className="text-xs text-gray-400">Pratinjau kartu AR otomatis yang siap dicetak</p>
                        </div>
                        <button
                            onClick={handleDownloadCard}
                            disabled={downloading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {downloading ? 'Mengunduh...' : 'Unduh Kartu AR (PNG)'}
                        </button>
                    </div>

                    {downloadError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-4">
                            {downloadError}
                        </div>
                    )}

                    {/* ── Combined AR Card Preview (Portrait) ── */}
                    <div className="max-w-xs mx-auto">
                        <div className="bg-gradient-to-b from-[#FFFBF9] to-[#FFF0E8] border-2 border-[#E5654B] rounded-2xl p-5 shadow-md relative overflow-hidden">
                            {/* Inner gold ring */}
                            <div className="absolute inset-[6px] rounded-xl border border-[#D4AF37] pointer-events-none"></div>

                            {/* Header */}
                            <div className="text-center mb-4">
                                <span className="text-[9px] font-bold tracking-widest text-[#E5654B] uppercase">KARTU AUGMENTED REALITY (AR)</span>
                                <h2 className="text-xl font-bold text-gray-800 font-serif italic mt-0.5">{groomNickname} & {brideNickname}</h2>
                                <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-2"></div>
                            </div>

                            {/* ── STEP 2: Hiro Marker (top, arahkan kamera) ── */}
                            <div className="bg-white rounded-xl border border-gray-100 p-3 mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#E5654B] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                                    <span className="text-[10px] font-bold text-gray-600 tracking-wide uppercase">Arahkan Kamera ke Marker Ini</span>
                                </div>
                                <div className="flex justify-center">
                                    <img src={hiroMarkerUrl} alt="Hiro Marker" className="w-40 h-40 object-contain" />
                                </div>
                            </div>

                            {/* Arrow divider */}
                            <div className="flex items-center gap-2 my-2 px-2">
                                <div className="flex-1 h-px bg-orange-200"></div>
                                <span className="text-[10px] text-gray-400">Scan QR dulu, lalu arahkan ke marker</span>
                                <div className="flex-1 h-px bg-orange-200"></div>
                            </div>

                            {/* ── STEP 1: QR Code (bottom, scan dulu) ── */}
                            <div className="bg-white rounded-xl border border-gray-100 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#E5654B] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                                    <span className="text-[10px] font-bold text-[#E5654B] tracking-wide uppercase">Scan QR Code Ini Terlebih Dahulu</span>
                                </div>
                                <div className="flex justify-center">
                                    <img src={qrCodeUrl} alt="QR Code" className="w-36 h-36 object-contain" />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-4 pt-3 border-t border-dashed border-orange-200/60">
                                <p className="text-[9px] text-gray-400">*Gunakan HP Android / iOS dengan internet aktif</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── NFT QR Marker Generator Section ── */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-5 gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">🔬</span>
                                <h3 className="font-bold text-gray-800">QR Code sebagai AR Marker (NFT)</h3>
                                <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Jadikan QR code undangan sebagai marker AR — tamu hanya butuh 1 gambar untuk scan <em>dan</em> melihat efek 3D.
                            </p>
                        </div>
                        {nftStatus === 'ready' && (
                            <button
                                onClick={handleResetNft}
                                className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                            >
                                Reset ke Hiro
                            </button>
                        )}
                    </div>

                    {/* Status badges */}
                    {nftStatus === 'ready' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-4">
                            <span className="text-xl">✅</span>
                            <div>
                                <p className="text-sm font-semibold text-green-800">NFT Marker Aktif</p>
                                <p className="text-xs text-green-600">AR sekarang menggunakan QR code sebagai marker. Tamu cukup scan 1 gambar QR saja!</p>
                            </div>
                        </div>
                    )}

                    {nftStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                            <p className="text-xs font-semibold text-red-700">⚠️ {nftMessage}</p>
                            <p className="text-xs text-red-500 mt-1">
                                Jika generate otomatis gagal, gunakan <strong>Upload Manual</strong> di bawah.
                            </p>
                        </div>
                    )}

                    {(nftStatus === 'loading' || nftStatus === 'uploading') && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                <p className="text-xs font-semibold text-blue-700">{nftMessage}</p>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: nftProgress + '%' }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-blue-400 mt-1">{nftProgress}%</p>
                        </div>
                    )}

                    {nftStatus !== 'ready' && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Auto generate */}
                            <button
                                onClick={handleGenerateNft}
                                disabled={nftStatus === 'loading' || nftStatus === 'uploading'}
                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.5 3.5 0 01-4.95 0l-.347-.347z" />
                                </svg>
                                {nftStatus === 'loading' ? 'Memproses...' : '⚡ Generate Otomatis dari QR'}
                            </button>

                            {/* Manual upload fallback */}
                            <label className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload Manual (.fset, .fset3, .iset)
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".fset,.fset3,.iset"
                                    multiple
                                    onChange={async (e) => {
                                        const files = Array.from(e.target.files);
                                        if (files.length < 3) { alert('Upload 3 file: qr.fset, qr.fset3, qr.iset'); return; }
                                        const toBase64 = (file) => new Promise((res, rej) => {
                                            const r = new FileReader();
                                            r.onload = () => res(btoa(String.fromCharCode(...new Uint8Array(r.result))));
                                            r.onerror = rej;
                                            r.readAsArrayBuffer(file);
                                        });
                                        const find = (ext) => files.find(f => f.name.endsWith(ext));
                                        setNftStatus('loading');
                                        setNftMessage('Mengunggah file...');
                                        try {
                                            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                                            const resp = await fetch(route('settings.ar.nft.store'), {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
                                                body: JSON.stringify({
                                                    fset:  await toBase64(find('.fset')),
                                                    fset3: await toBase64(find('.fset3')),
                                                    iset:  await toBase64(find('.iset')),
                                                }),
                                            });
                                            const res = await resp.json();
                                            if (res.success) { setNftStatus('ready'); setNftMessage('Upload berhasil!'); }
                                            else throw new Error(res.error);
                                        } catch (err) { setNftStatus('error'); setNftMessage(err.message); }
                                    }}
                                />
                            </label>
                        </div>
                    )}

                    <div className="mt-4 bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 font-semibold mb-1">📌 Cara Kerja NFT Marker:</p>
                        <ol className="text-[10px] text-gray-400 space-y-1 list-decimal pl-4">
                            <li>Klik <strong>Generate Otomatis</strong> — sistem buat descriptor dari QR code Anda</li>
                            <li>Tamu scan QR code → browser AR terbuka</li>
                            <li>Tamu arahkan kamera ke QR code yang sama → efek 3D muncul langsung!</li>
                        </ol>
                    </div>
                </div>

                {/* Direct Link Options */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-2">Link Langsung WebAR Anda</h3>
                    <p className="text-xs text-gray-500 mb-4">
                        Anda juga bisa mengirimkan link ini secara langsung kepada kerabat dekat agar mereka dapat mencoba secara mandiri dengan membuka marker di layar perangkat lain.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={arUrl}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 focus:outline-none"
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(arUrl);
                                alert('Link AR berhasil disalin ke clipboard!');
                            }}
                            className="px-4 py-2.5 bg-gray-800 text-white rounded-xl text-xs font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Salin Link
                        </button>
                        <a
                            href={arUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                        >
                            Coba WebAR
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
