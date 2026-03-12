import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import jsQR from 'jsqr';

export default function QrScanner({ invitation }) {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ checked_in: 0, total: 0 });
    const [recentScans, setRecentScans] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);

    // Poll stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(route('live-tamu.data'));
                const d = await res.json();
                setStats(d.stats);
            } catch (e) {}
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const startScanning = async () => {
        setError(null);
        setResult(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setScanning(true);
            // Start scanning loop after video is ready
            videoRef.current.onloadedmetadata = () => {
                scanFrame();
            };
        } catch (e) {
            setError('Tidak bisa mengakses kamera. Pastikan izin kamera sudah diberikan.');
        }
    };

    const scanFrame = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });
            if (code) {
                handleQrResult(code.data);
                return;
            }
        }
        animFrameRef.current = requestAnimationFrame(scanFrame);
    };

    const handleQrResult = async (url) => {
        // Extract check-in URL pattern: /u/{slug}/checkin?to={guest_slug}
        // Or just any URL with /checkin in it
        let checkinUrl = url;

        // If the scanned QR is just the invitation URL (/u/{slug}?to={guest_slug}),
        // we need to convert it to the checkin URL
        if (url.includes('/u/') && !url.includes('/checkin')) {
            checkinUrl = url.replace(/\/u\/([^/?]+)/, '/u/$1/checkin');
        }

        // Make sure it's a checkin URL
        if (!checkinUrl.includes('/checkin')) {
            setResult({ success: false, message: 'QR Code tidak valid untuk check-in' });
            setTimeout(() => { setResult(null); resumeScanning(); }, 2000);
            return;
        }

        try {
            const res = await fetch(checkinUrl, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();
            setResult(data);

            if (data.success && data.guest) {
                setRecentScans(prev => [
                    { ...data.guest, already: data.already, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
                    ...prev.slice(0, 9)
                ]);
                // Refresh stats
                try {
                    const statsRes = await fetch(route('live-tamu.data'));
                    const statsData = await statsRes.json();
                    setStats(statsData.stats);
                } catch (e) {}
            }

            // Resume scanning after 2.5s
            setTimeout(() => { setResult(null); resumeScanning(); }, 2500);
        } catch (e) {
            setResult({ success: false, message: 'Gagal memproses check-in' });
            setTimeout(() => { setResult(null); resumeScanning(); }, 2000);
        }
    };

    const resumeScanning = () => {
        if (scanning && videoRef.current && videoRef.current.srcObject) {
            scanFrame();
        }
    };

    const stopScanning = () => {
        setScanning(false);
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        };
    }, []);

    const pct = stats.total > 0 ? Math.round((stats.checked_in / stats.total) * 100) : 0;

    return (
        <DashboardLayout title="QR Scanner">
            <Head title="QR Scanner Check-in" />

            <div className="max-w-lg mx-auto space-y-3">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <div className="text-xl font-bold text-emerald-600">{stats.checked_in}</div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Hadir</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <div className="text-xl font-bold text-gray-800">{stats.total}</div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Total</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <div className="text-xl font-bold text-blue-600">{pct}%</div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Kehadiran</div>
                    </div>
                </div>

                {/* Scanner Area */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {!scanning ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 mb-1">Scan QR Code Tamu</h3>
                            <p className="text-xs text-gray-400 mb-4">Arahkan kamera ke QR undangan tamu untuk check-in otomatis</p>
                            <button onClick={startScanning}
                                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors inline-flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                </svg>
                                Mulai Scan
                            </button>
                            {error && (
                                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">{error}</div>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <video ref={videoRef} className="w-full aspect-square object-cover" playsInline muted />
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Scan overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-48 h-48 border-2 border-white/50 rounded-2xl relative">
                                    <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
                                    <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
                                    <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />
                                </div>
                            </div>

                            {/* Result overlay */}
                            {result && (
                                <div className={`absolute inset-0 flex items-center justify-center ${result.success ? 'bg-emerald-500/90' : 'bg-red-500/90'}`}>
                                    <div className="text-center text-white p-4">
                                        <div className="text-4xl mb-2">{result.success ? (result.already ? '⚠️' : '✅') : '❌'}</div>
                                        <div className="text-lg font-bold">{result.guest?.name || ''}</div>
                                        <div className="text-sm opacity-90 mt-1">{result.message}</div>
                                    </div>
                                </div>
                            )}

                            {/* Stop button */}
                            <button onClick={stopScanning}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Scanning indicator */}
                            {!result && (
                                <div className="absolute bottom-3 left-0 right-0 text-center">
                                    <span className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        Scanning...
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Recent Scans */}
                {recentScans.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xs font-bold text-gray-700">Scan Terakhir</h3>
                            <span className="text-[10px] text-gray-400 ml-auto">{recentScans.length} tamu</span>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                            {recentScans.map((scan, i) => (
                                <div key={i} className="px-3 py-2 flex items-center gap-2.5">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${scan.already ? 'bg-amber-400' : 'bg-emerald-500'}`}>
                                        {scan.already ? '!' : '✓'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-gray-800 truncate">{scan.name}</div>
                                        {scan.group_name && <div className="text-[10px] text-gray-400">{scan.group_name}</div>}
                                    </div>
                                    <div className="text-[10px] text-gray-400">{scan.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        <div className="text-xs text-blue-700">
                            <div className="font-semibold mb-0.5">Cara Pakai</div>
                            <ol className="list-decimal ml-3 space-y-0.5 text-blue-600">
                                <li>Kirim undangan via WhatsApp ke tamu (berisi link QR)</li>
                                <li>Tamu buka undangan → muncul QR Code mereka</li>
                                <li>Scan QR di halaman ini untuk check-in tamu</li>
                                <li>Nama tamu muncul otomatis di layar Live Tamu</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
