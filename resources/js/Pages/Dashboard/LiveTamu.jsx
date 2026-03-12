import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function LiveTamu({ invitation, liveUrl }) {
    const { flash } = usePage().props;
    const [guests, setGuests] = useState([]);
    const [stats, setStats] = useState({ checked_in: 0, total: 0 });
    const [newGuest, setNewGuest] = useState(null);
    const prevCountRef = useRef(0);

    const { data, setData, post, processing } = useForm({
        live_delay: invitation?.live_delay ?? 3,
        live_counter: invitation?.live_counter ?? true,
        live_template: invitation?.live_template ?? 'elegant',
    });

    // Polling
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(route('live-tamu.data'));
                const d = await res.json();
                if (d.stats.checked_in > prevCountRef.current && prevCountRef.current > 0) {
                    const latest = d.guests[0];
                    if (latest) { setNewGuest(latest); setTimeout(() => setNewGuest(null), 4000); }
                }
                prevCountRef.current = d.stats.checked_in;
                setGuests(d.guests);
                setStats(d.stats);
            } catch (e) { console.error(e); }
        };
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        post(route('live-tamu.save'), { preserveScroll: true });
    };

    const pct = stats.total > 0 ? Math.round((stats.checked_in / stats.total) * 100) : 0;

    const templates = [
        {
            value: 'elegant',
            label: 'Elegant',
            desc: 'Minimalis dan elegan',
            preview: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]',
        },
        {
            value: 'celebration',
            label: 'Celebration',
            desc: 'Warna-warni dan meriah',
            preview: 'bg-gradient-to-br from-[#E5654B] to-[#ff7b5e]',
        },
    ];

    return (
        <DashboardLayout title="Live Tamu">
            <Head title="Live Tamu" />
            <div className="max-w-3xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}</div>
                )}

                {/* ═══ Live Link ═══ */}
                <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold">Halaman Live Tamu</h3>
                            <p className="text-white/50 text-sm mt-1">Buka halaman fullscreen untuk menampilkan tamu yang hadir secara realtime</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-emerald-300 font-semibold">Live</span>
                        </div>
                    </div>
                    {liveUrl && (
                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                            <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white/70 truncate border border-white/10 min-w-0">
                                {liveUrl}
                            </div>
                            <button onClick={() => { navigator.clipboard.writeText(liveUrl); }}
                                className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-all border border-white/10">
                                Salin
                            </button>
                            <Link href="/qr-scanner"
                                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/25 whitespace-nowrap inline-flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                </svg>
                                Scan QR
                            </Link>
                            <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                                className="px-5 py-3 bg-[#E5654B] hover:bg-[#d4523a] rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#E5654B]/25 whitespace-nowrap">
                                Fullscreen →
                            </a>
                        </div>
                    )}
                </div>

                {/* ═══ Settings ═══ */}
                <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-gray-800">Pengaturan Live Tamu</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Atur tampilan halaman live tamu</p>
                    </div>

                    {/* Delay */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Delay Tampilan Nama (detik)</label>
                        <p className="text-xs text-gray-400 mt-0.5 mb-2">Berapa detik nama tamu baru ditampilkan di layar</p>
                        <div className="flex items-center gap-3">
                            <input type="range" min={1} max={15} value={data.live_delay}
                                onChange={(e) => setData('live_delay', parseInt(e.target.value))}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E5654B]" />
                            <div className="w-14 text-center py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-700">
                                {data.live_delay}s
                            </div>
                        </div>
                    </div>

                    {/* Counter */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Tampilkan Counter</label>
                            <p className="text-xs text-gray-400 mt-0.5">Menampilkan jumlah tamu yang sudah hadir</p>
                        </div>
                        <button type="button" onClick={() => setData('live_counter', !data.live_counter)}
                            className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${data.live_counter ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${data.live_counter ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Template Selection */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Tampilan Halaman</label>
                        <p className="text-xs text-gray-400 mt-0.5 mb-3">Pilih tema tampilan halaman live tamu</p>
                        <div className="grid grid-cols-2 gap-3">
                            {templates.map((t) => (
                                <button key={t.value} type="button" onClick={() => setData('live_template', t.value)}
                                    className={`relative rounded-xl border-2 overflow-hidden transition-all ${data.live_template === t.value ? 'border-[#E5654B] shadow-lg shadow-[#E5654B]/10' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <div className={`${t.preview} h-24 flex items-center justify-center`}>
                                        <div className="text-white/80 text-xs font-bold bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                            {t.label}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white">
                                        <div className={`text-xs font-bold ${data.live_template === t.value ? 'text-[#E5654B]' : 'text-gray-600'}`}>{t.label}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">{t.desc}</div>
                                    </div>
                                    {data.live_template === t.value && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#E5654B] rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full py-3 bg-[#E5654B] hover:bg-[#d4523a] text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </form>

                {/* ═══ Stats Cards ═══ */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                        <div className="text-3xl font-bold text-[#1a1a1a]">{stats.checked_in}</div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Hadir</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                        <div className="text-3xl font-bold text-[#1a1a1a]">{stats.total}</div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Total</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                        <div className="text-3xl font-bold text-[#1a1a1a]">{pct}%</div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Persentase</div>
                    </div>
                </div>

                {/* New Guest Toast */}
                {newGuest && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">✓</div>
                        <div>
                            <div className="text-lg font-bold text-emerald-800">{newGuest.name}</div>
                            <div className="text-sm text-emerald-600">baru saja hadir!</div>
                        </div>
                    </div>
                )}

                {/* Guest List */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-gray-800 text-sm">Tamu yang Hadir</h3>
                        <span className="text-xs text-gray-400 ml-auto">Auto-refresh tiap 3 detik</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {guests.length === 0 && (
                            <div className="px-6 py-12 text-center">
                                <div className="text-5xl mb-3"><svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
                                <p className="text-gray-400 font-medium">Belum ada tamu yang hadir</p>
                                <p className="text-xs text-gray-300 mt-1">Tamu akan muncul otomatis saat scan QR Code</p>
                            </div>
                        )}
                        {guests.map((g, i) => (
                            <div key={g.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs font-bold text-gray-400">
                                    {i + 1}
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                    style={{ background: `hsl(${(i * 47 + 10) % 360}, 60%, 55%)` }}>
                                    {g.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-800 truncate">{g.name}</div>
                                    {g.group_name && <div className="text-xs text-gray-400">{g.group_name}</div>}
                                </div>
                                <div className="text-xs text-gray-400 font-medium text-right">
                                    {g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
