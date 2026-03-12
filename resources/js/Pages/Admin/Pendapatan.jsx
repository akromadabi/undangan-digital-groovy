import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
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

export default function Pendapatan({ stats, transactions, monthlyStats }) {
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

    const totalRevenue = stats?.total_revenue || 0;
    const totalProfit = stats?.total_profit || 0;
    const totalTransactions = stats?.total_transactions || 0;
    const totalUsers = stats?.total_users || 0;

    return (
        <AdminLayout title="Pendapatan">
            <Head title="Pendapatan" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Dashboard Pendapatan</h2>
                    <p className="text-[#999] text-sm mt-1">Pantau revenue dan profit reseller Anda</p>
                </div>

                {/* ═══ Stats Grid ═══ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Total Revenue</p>
                                <p className="text-2xl font-bold text-[#1a1a1a] mt-2">{formatCurrency(totalRevenue)}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Icon d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75" className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Profit Bersih</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(totalProfit)}</p>
                                <p className="text-xs text-[#999] mt-1">selisih harga reseller - dasar</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Icon d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Transaksi</p>
                                <p className="text-3xl font-bold text-[#1a1a1a] mt-2">{totalTransactions}</p>
                                <p className="text-xs text-[#999] mt-1">pembayaran berhasil</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={totalTransactions} max={Math.max(totalTransactions, 5)} color="#f97316" />
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Total Users</p>
                                <p className="text-3xl font-bold text-[#1a1a1a] mt-2">{totalUsers}</p>
                                <p className="text-xs text-[#999] mt-1">user terdaftar</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={totalUsers} max={Math.max(totalUsers, 10)} color="#8b5cf6" />
                    </div>
                </div>

                {/* ═══ Monthly Stats ═══ */}
                {(monthlyStats || []).length > 0 && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6">
                        <h3 className="text-sm font-bold text-[#1a1a1a] mb-4">Statistik Bulanan</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {monthlyStats.map((m, i) => {
                                const maxRev = Math.max(...monthlyStats.map(s => s.revenue), 1);
                                const pct = (m.revenue / maxRev) * 100;
                                return (
                                    <div key={i} className="text-center">
                                        <div className="h-24 flex items-end justify-center mb-2">
                                            <div className="w-8 bg-gradient-to-t from-[#E5654B] to-[#E5654B]/60 rounded-t-lg transition-all duration-500" style={{ height: `${Math.max(pct, 8)}%` }} />
                                        </div>
                                        <div className="text-xs font-bold text-[#333]">{formatCurrency(m.revenue)}</div>
                                        <div className="text-[10px] text-[#999] mt-0.5">{m.month}</div>
                                        <div className="text-[10px] text-emerald-600 font-medium">{m.count} trx</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ═══ Transaction History ═══ */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                <Icon d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" className="w-4 h-4 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-[#1a1a1a] text-sm">Riwayat Transaksi</h3>
                        </div>
                        <span className="text-xs text-[#999]">{totalTransactions} total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#f0ede8]">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">Plan</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase">Harga Jual</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase">Harga Dasar</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase">Profit</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f5f3f0]">
                                {(transactions || []).map(t => (
                                    <tr key={t.id} className="hover:bg-[#faf9f6] transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-medium text-[#333]">{t.user_name}</div>
                                            <div className="text-xs text-[#999]">{t.user_email}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-xs bg-[#f5f3f0] text-[#777] px-2 py-1 rounded-lg">{t.plan_name}</span>
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm text-[#333] font-medium">{formatCurrency(t.reseller_price)}</td>
                                        <td className="px-6 py-3 text-right text-sm text-[#999]">{formatCurrency(t.base_price)}</td>
                                        <td className="px-6 py-3 text-right">
                                            <span className={`text-sm font-semibold ${t.profit > 0 ? 'text-emerald-600' : 'text-[#999]'}`}>
                                                {t.profit > 0 ? '+' : ''}{formatCurrency(t.profit)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right text-xs text-[#999]">{t.paid_at || t.created_at}</td>
                                    </tr>
                                ))}
                                {(!transactions || transactions.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[#999]">
                                            <Icon d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75" className="w-8 h-8 text-[#ddd] mx-auto mb-2" />
                                            <p className="text-sm">Belum ada transaksi</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
