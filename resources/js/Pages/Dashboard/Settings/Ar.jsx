import { Head, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Ar({ invitation, groomNickname, brideNickname, arUrl }) {
    const { flash } = usePage().props;
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');
    const canvasRef = useRef(null);

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(arUrl)}`;
    const hiroMarkerUrl = '/images/ar/hiro.png';

    const handleDownloadCard = () => {
        setDownloading(true);
        setDownloadError('');

        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        // Draw elegant gradient background
        const grad = ctx.createLinearGradient(0, 0, 1200, 800);
        grad.addColorStop(0, '#FFFBF9');
        grad.addColorStop(1, '#FFF2EC');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 800);

        // Draw outer card border / frame
        ctx.strokeStyle = '#E5654B';
        ctx.lineWidth = 8;
        ctx.strokeRect(40, 40, 1120, 720);

        // Draw inner thin gold frame
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.strokeRect(55, 55, 1090, 690);

        // Draw Title text
        ctx.fillStyle = '#E5654B';
        ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('KARTU AUGMENTED REALITY (AR)', 600, 110);

        // Draw Subtitle / Names
        ctx.fillStyle = '#333333';
        ctx.font = 'italic 50px "Great Vibes", cursive, Georgia, serif';
        ctx.fillText(`${groomNickname} & ${brideNickname}`, 600, 185);

        ctx.fillStyle = '#777777';
        ctx.font = '500 20px Figtree, Arial, sans-serif';
        ctx.fillText('PINDAI QR & LIHAT MAGIS PERNIKAHAN KAMI', 600, 235);

        // Load and draw Hiro Marker & QR Code
        const loadImg = (src, isCrossorigin) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                if (isCrossorigin) {
                    img.crossOrigin = 'Anonymous';
                }
                img.onload = () => resolve(img);
                img.onerror = (e) => reject(new Error(`Gagal memuat gambar: ${src}`));
                img.src = src;
            });
        };

        Promise.all([
            loadImg(hiroMarkerUrl, false),
            loadImg(qrCodeUrl, true)
        ]).then(([hiroImg, qrImg]) => {
            // Draw backgrounds for elements
            ctx.fillStyle = '#FFFFFF';
            // Left side (Hiro)
            ctx.fillRect(200, 280, 320, 320);
            ctx.strokeStyle = '#EAEAEA';
            ctx.lineWidth = 2;
            ctx.strokeRect(200, 280, 320, 320);
            ctx.drawImage(hiroImg, 220, 300, 280, 280);

            // Right side (QR Code)
            ctx.fillRect(680, 280, 320, 320);
            ctx.strokeRect(680, 280, 320, 320);
            ctx.drawImage(qrImg, 700, 300, 280, 280);

            // Draw Labels
            ctx.fillStyle = '#E5654B';
            ctx.font = 'bold 24px Figtree, Arial, sans-serif';
            ctx.fillText('1. SCAN QR CODE INI', 840, 640);
            ctx.fillText('2. ARAHKAN KAMERA KE MARKER INI', 360, 640);

            // Draw Footer / Brand
            ctx.fillStyle = '#999999';
            ctx.font = 'italic 16px Figtree, Arial, sans-serif';
            ctx.fillText('Dibuat secara otomatis oleh Undangan Digital Premium', 600, 715);

            // Trigger download
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
            setDownloadError('Gagal men-download kartu AR karena kendala koneksi gambar. Silakan klik kanan pratinjau kartu untuk menyimpan.');
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

                    {/* Aesthetic Glassmorphic Card Mockup */}
                    <div className="bg-gradient-to-tr from-amber-50/40 via-orange-50/20 to-red-50/30 border border-orange-100/50 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-sm relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-400/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-red-400/10 rounded-full blur-xl"></div>
                        
                        <div className="text-center space-y-2 mb-6">
                            <span className="text-[10px] font-bold tracking-widest text-[#E5654B] uppercase bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">KARTU AUGMENTED REALITY (AR)</span>
                            <h2 className="text-2xl font-bold text-gray-800 font-serif italic mt-2">{groomNickname} & {brideNickname}</h2>
                            <p className="text-xs text-gray-400 tracking-wide">Pindai QR & Arahkan Kamera ke Marker untuk Melihat Magis</p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-12 py-4">
                            {/* Left Side: Hiro Marker */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-44 h-44 bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center">
                                    <img src={hiroMarkerUrl} alt="Hiro Marker" className="w-36 h-36 object-contain" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 tracking-wider">MARKER HIRO</span>
                            </div>

                            {/* Right Side: QR Code */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-44 h-44 bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center">
                                    <img src={qrCodeUrl} alt="QR Code Link" className="w-36 h-36 object-contain" />
                                </div>
                                <span className="text-[10px] font-bold text-[#E5654B] tracking-wider">SCAN UNTUK KAMERA</span>
                            </div>
                        </div>

                        <div className="text-center mt-6 pt-4 border-t border-dashed border-orange-200/50 text-[10px] text-gray-400">
                            *Gunakan HP Android atau iOS dengan koneksi internet aktif.
                        </div>
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
