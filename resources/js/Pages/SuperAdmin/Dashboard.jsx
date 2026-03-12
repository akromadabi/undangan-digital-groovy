import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.5 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);

const MiniBar = ({ value, max, color }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="w-full h-1.5 rounded-full bg-gray-100 mt-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
    );
};

const RingChart = ({ value, max, color, size = 56 }) => {
    const pct = max > 0 ? (value / max) * 100 : 0;
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} stroke="#f3f4f6" strokeWidth={5} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={5} fill="none"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
    );
};

export default function Dashboard({ stats, recentResellers, recentPayments }) {
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

    const totalResellers = stats?.total_resellers || 0;
    const totalUsers = stats?.total_users || 0;
    const activeInvitations = stats?.active_invitations || 0;
    const totalRevenue = stats?.total_revenue || 0;
    const pendingPayments = stats?.pending_payments || 0;
    const paidPayments = (recentPayments || []).filter(p => p.status === 'paid').length;
    const totalPayments = (recentPayments || []).length;

    return (
        <SuperAdminLayout title="Dashboard Super Admin">
            <Head title="Super Admin Dashboard" />
            <div className="space-y-6">

                {/* ═══ Welcome Banner ═══ */}
                <div className="bg-gradient-to-br from-[#E5654B] via-[#d55a42] to-[#c44f38] rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-6 -right-16 w-48 h-48 rounded-full bg-white/5" />
                    <div className="absolute top-6 right-28 w-20 h-20 rounded-full bg-white/5" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                                <Icon d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Dashboard Super Admin</h2>
                                <p className="text-white/70 text-sm">Kelola seluruh platform & reseller</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5">
                                <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" className="w-3.5 h-3.5" />
                                {totalResellers} reseller
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5">
                                <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-3.5 h-3.5" />
                                {totalUsers} users terdaftar
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5">
                                <Icon d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-3.5 h-3.5" />
                                {activeInvitations} undangan aktif
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Stats Grid ═══ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Reseller */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Total Reseller</p>
                                <p className="text-3xl font-bold text-[#1a1a1a] mt-2">{totalResellers}</p>
                                <p className="text-xs text-[#999] mt-1.5">reseller terdaftar</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={totalResellers} max={Math.max(totalResellers, 5)} color="#8b5cf6" />
                    </div>

                    {/* Total Users */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Total Users</p>
                                <p className="text-3xl font-bold text-[#1a1a1a] mt-2">{totalUsers}</p>
                                <p className="text-xs text-[#999] mt-1.5">user terdaftar</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={totalUsers} max={Math.max(totalUsers, 10)} color="#3b82f6" />
                    </div>

                    {/* Revenue */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Revenue</p>
                                <p className="text-2xl font-bold text-[#1a1a1a] mt-2">{formatCurrency(totalRevenue)}</p>
                                <p className="text-xs text-[#999] mt-1.5">total pendapatan</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Icon d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Pending Payment */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Pending Payment</p>
                                <p className="text-3xl font-bold text-[#1a1a1a] mt-2">{pendingPayments}</p>
                                <p className="text-xs mt-1.5">
                                    {pendingPayments > 0 ? (
                                        <span className="text-amber-600 font-medium">perlu diproses</span>
                                    ) : (
                                        <span className="text-emerald-600 font-medium">semua clear</span>
                                    )}
                                </p>
                            </div>
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${pendingPayments > 0 ? 'from-amber-500 to-amber-600' : 'from-emerald-500 to-emerald-600'} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                <Icon d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={pendingPayments} max={Math.max(pendingPayments + paidPayments, 1)} color={pendingPayments > 0 ? '#f59e0b' : '#10b981'} />
                    </div>
                </div>

                {/* ═══ Overview Infographic Row ═══ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Conversion Rate */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <RingChart value={activeInvitations} max={Math.max(totalUsers, 1)} color="#10b981" size={60} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-[#1a1a1a]">{totalUsers > 0 ? Math.round((activeInvitations / totalUsers) * 100) : 0}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Konversi User</p>
                            <p className="text-sm font-bold text-[#1a1a1a] mt-1">{activeInvitations} dari {totalUsers}</p>
                            <p className="text-xs text-[#999] mt-0.5">user membuat undangan</p>
                        </div>
                    </div>

                    {/* Payment Success Rate */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <RingChart value={paidPayments} max={Math.max(totalPayments, 1)} color="#E5654B" size={60} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-[#1a1a1a]">{totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Sukses Bayar</p>
                            <p className="text-sm font-bold text-[#1a1a1a] mt-1">{paidPayments} dari {totalPayments}</p>
                            <p className="text-xs text-[#999] mt-0.5">pembayaran berhasil</p>
                        </div>
                    </div>

                    {/* Avg Revenue per User */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 flex items-center gap-4">
                        <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-[#E5654B]/10 to-orange-50 flex items-center justify-center flex-shrink-0">
                            <Icon d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" className="w-7 h-7 text-[#E5654B]" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Avg / User</p>
                            <p className="text-sm font-bold text-[#1a1a1a] mt-1">{formatCurrency(activeInvitations > 0 ? Math.round(totalRevenue / activeInvitations) : 0)}</p>
                            <p className="text-xs text-[#999] mt-0.5">rata-rata per undangan</p>
                        </div>
                    </div>
                </div>

                {/* ═══ Two Columns: Recent Resellers + Recent Payments ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Resellers */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" className="w-4 h-4 text-violet-600" />
                                </div>
                                <h3 className="font-bold text-[#1a1a1a] text-sm">Reseller Terbaru</h3>
                            </div>
                            <Link href="/super-admin/resellers" className="text-xs font-medium text-[#E5654B] hover:text-[#c94f3a] transition-colors inline-flex items-center gap-1">
                                Lihat Semua
                                <Icon d="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-[#f5f3f0]">
                            {(recentResellers || []).map((r, i) => (
                                <Link key={r.id} href={`/super-admin/resellers/${r.id}`} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#faf9f6] transition-colors block">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                            style={{ background: `hsl(${(i * 47 + 260) % 360}, 65%, 55%)` }}>
                                            {r.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-[#333]">{r.name}</div>
                                            <div className="text-xs text-[#999]">{r.email}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-[#f5f3f0] text-[#777] px-2 py-1 rounded-lg font-medium">
                                        {r.reseller_users_count || 0} users
                                    </span>
                                </Link>
                            ))}
                            {(!recentResellers || recentResellers.length === 0) && (
                                <div className="px-6 py-8 text-center">
                                    <Icon d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719" className="w-8 h-8 text-[#ddd] mx-auto mb-2" />
                                    <p className="text-[#999] text-sm">Belum ada reseller</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <Icon d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-4 h-4 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-[#1a1a1a] text-sm">Payment Terbaru</h3>
                            </div>
                            {pendingPayments > 0 && (
                                <span className="bg-amber-50 text-amber-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                                    {pendingPayments} pending
                                </span>
                            )}
                        </div>
                        <div className="divide-y divide-[#f5f3f0]">
                            {(recentPayments || []).map(p => (
                                <div key={p.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#faf9f6] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            <Icon d={p.status === 'paid' ? 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-[#333]">{p.user?.name || '-'}</div>
                                            <div className="text-xs text-[#999]">{p.plan?.name || '-'} · {formatCurrency(p.amount)}</div>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            ))}
                            {(!recentPayments || recentPayments.length === 0) && (
                                <div className="px-6 py-8 text-center">
                                    <Icon d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-8 h-8 text-[#ddd] mx-auto mb-2" />
                                    <p className="text-[#999] text-sm">Belum ada pembayaran</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ Quick Actions ═══ */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
                    <h3 className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Icon d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" className="w-4 h-4" />
                        Aksi Cepat
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Tambah Reseller', href: '/super-admin/resellers/create', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719', color: 'violet' },
                            { label: 'Kelola Paket', href: '/super-admin/plans', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9', color: 'blue' },
                            { label: 'Kelola Tema', href: '/super-admin/themes', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42', color: 'emerald' },
                            { label: 'Pengaturan', href: '/super-admin/settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'orange' },
                        ].map(action => {
                            const colorMap = { violet: 'bg-violet-50 text-violet-600 hover:bg-violet-100', blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100', emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100', orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100' };
                            return (
                                <Link key={action.label} href={action.href}
                                    className={`flex items-center gap-2.5 p-3 rounded-xl ${colorMap[action.color]} transition-all hover:-translate-y-0.5`}>
                                    <Icon d={action.icon} className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-xs font-semibold">{action.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
