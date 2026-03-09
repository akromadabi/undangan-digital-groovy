import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function LiveTamu({ invitations }) {
    const [selectedInv, setSelectedInv] = useState(invitations?.[0]?.id || '');
    const [guests, setGuests] = useState([]);
    const [stats, setStats] = useState({ checked_in: 0, total: 0 });
    const [newGuest, setNewGuest] = useState(null);
    const intervalRef = useRef(null);
    const prevCountRef = useRef(0);

    const fetchData = async () => {
        try {
            const url = selectedInv
                ? `/admin/live-tamu/data?invitation_id=${selectedInv}`
                : '/admin/live-tamu/data';
            const res = await fetch(url);
            const data = await res.json();

            // Detect new arrivals
            if (data.stats.checked_in > prevCountRef.current && prevCountRef.current > 0) {
                const latest = data.guests[0];
                if (latest) {
                    setNewGuest(latest);
                    setTimeout(() => setNewGuest(null), 4000);
                }
            }
            prevCountRef.current = data.stats.checked_in;

            setGuests(data.guests);
            setStats(data.stats);
        } catch (e) {
            console.error('Polling error:', e);
        }
    };

    useEffect(() => {
        fetchData();
        intervalRef.current = setInterval(fetchData, 3000);
        return () => clearInterval(intervalRef.current);
    }, [selectedInv]);

    const pct = stats.total > 0 ? Math.round((stats.checked_in / stats.total) * 100) : 0;

    return (
        <AdminLayout title="Live Tamu">
            <Head title="Live Tamu" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1a1a1a]">Live Tamu</h2>
                        <p className="text-sm text-[#999] mt-1">Monitor kehadiran tamu secara realtime</p>
                    </div>
                    {invitations?.length > 1 && (
                        <select value={selectedInv} onChange={e => setSelectedInv(e.target.value)}
                            className="px-4 py-2 bg-white border border-[#e8e5e0] rounded-xl text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]">
                            {invitations.map(inv => (
                                <option key={inv.id} value={inv.id}>{inv.slug} — {inv.user?.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 mx-auto flex items-center justify-center text-white mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-4xl font-bold text-[#1a1a1a]">{stats.checked_in}</div>
                        <div className="text-xs text-[#999] font-semibold uppercase tracking-wider mt-1">Hadir</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mx-auto flex items-center justify-center text-white mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                        </div>
                        <div className="text-4xl font-bold text-[#1a1a1a]">{stats.total}</div>
                        <div className="text-xs text-[#999] font-semibold uppercase tracking-wider mt-1">Total Tamu</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E5654B] to-orange-600 mx-auto flex items-center justify-center text-white mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                        </div>
                        <div className="text-4xl font-bold text-[#1a1a1a]">{pct}%</div>
                        <div className="text-xs text-[#999] font-semibold uppercase tracking-wider mt-1">Persentase</div>
                    </div>
                </div>

                {/* New Guest Toast */}
                {newGuest && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-emerald-800">{newGuest.name}</div>
                            <div className="text-sm text-emerald-600">baru saja hadir!</div>
                        </div>
                    </div>
                )}

                {/* Guest List */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-[#1a1a1a] text-sm">Tamu yang Hadir</h3>
                        <span className="text-xs text-[#999] ml-auto">Auto-refresh tiap 3 detik</span>
                    </div>
                    <div className="divide-y divide-[#f5f3f0]">
                        {guests.length === 0 && (
                            <div className="px-6 py-12 text-center">
                                <svg className="w-12 h-12 text-[#ddd] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                                <p className="text-[#999]">Belum ada tamu yang hadir</p>
                                <p className="text-xs text-[#ccc] mt-1">Tamu akan muncul otomatis saat scan QR Code</p>
                            </div>
                        )}
                        {guests.map((g, i) => (
                            <div key={g.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#faf9f6] transition-colors">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f3f0] text-xs font-bold text-[#999]">
                                    {i + 1}
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                    style={{ background: `hsl(${(i * 47 + 10) % 360}, 60%, 55%)` }}>
                                    {g.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-[#333] truncate">{g.name}</div>
                                    {g.group_name && <div className="text-xs text-[#999]">{g.group_name}</div>}
                                </div>
                                <div className="text-xs text-[#bbb] font-medium text-right">
                                    {g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
