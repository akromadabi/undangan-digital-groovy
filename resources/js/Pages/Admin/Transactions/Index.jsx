import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

const statusMap = {
    pending_manual: { label: 'Menunggu Upload', color: 'bg-amber-100 text-amber-700' },
    waiting_review: { label: 'Menunggu Review', color: 'bg-blue-100 text-blue-700' },
    paid:           { label: 'Lunas', color: 'bg-emerald-100 text-emerald-700' },
    rejected:       { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
    cancelled:      { label: 'Dibatalkan', color: 'bg-gray-100 text-gray-500' },
    pending:        { label: 'Pending (Xendit)', color: 'bg-amber-50 text-amber-600' },
    expired:        { label: 'Kedaluwarsa', color: 'bg-gray-100 text-gray-500' },
    failed:         { label: 'Gagal', color: 'bg-red-100 text-red-600' },
};

const methodMap = {
    manual:   { label: 'Transfer Manual', icon: '🏦' },
    xendit:   { label: 'Xendit', icon: '💳' },
    midtrans: { label: 'Midtrans', icon: '💳' },
    tripay:   { label: 'Tripay', icon: '💳' },
    siapppay: { label: 'SiappPay', icon: '💳' },
    BCA:      { label: 'BCA', icon: '🏦' },
    QRIS:     { label: 'QRIS', icon: '📱' },
};

const formatCurrency = a => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);
const formatDate = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function TransactionsIndex({ payments, pendingCount, filters }) {
    const { adminRoutePrefix, flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [method, setMethod] = useState(filters?.method || 'all');

    const applyFilter = (overrides = {}) => {
        router.get(`${adminRoutePrefix}/transactions`, {
            search: overrides.search ?? search,
            status: overrides.status ?? status,
            method: overrides.method ?? method,
        }, { preserveState: true, replace: true });
    };

    const data = payments?.data || [];

    return (
        <DynamicAdminLayout title="Semua Transaksi">
            <Head title="Transaksi" />
            <div className="space-y-5">

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{flash.error}</div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Semua Transaksi</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Online Gateway &amp; Transfer Manual</p>
                    </div>
                    {pendingCount > 0 && (
                        <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-2 rounded-xl">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            {pendingCount} menunggu konfirmasi
                        </span>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col md:flex-row gap-3">
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilter()}
                        placeholder="Cari nama / email..."
                        className="w-full md:flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E5654B] focus:border-[#E5654B]" />
                    <div className="grid grid-cols-2 md:flex md:flex-row gap-3">
                        <select value={status} onChange={e => { setStatus(e.target.value); applyFilter({ status: e.target.value }); }}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E5654B]">
                            <option value="all">Semua Status</option>
                            <option value="waiting_review">Menunggu Review</option>
                            <option value="pending_manual">Pending Manual</option>
                            <option value="paid">Lunas</option>
                            <option value="rejected">Ditolak</option>
                            <option value="pending">Pending Xendit</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                        <select value={method} onChange={e => { setMethod(e.target.value); applyFilter({ method: e.target.value }); }}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#E5654B]">
                            <option value="all">Semua Metode</option>
                            <option value="manual">Transfer Manual</option>
                            <option value="xendit">Xendit</option>
                            <option value="midtrans">Midtrans</option>
                            <option value="tripay">Tripay</option>
                            <option value="siapppay">SiappPay</option>
                        </select>
                    </div>
                    <button onClick={() => applyFilter()}
                        className="w-full md:w-auto px-5 py-2 bg-[#E5654B] text-white rounded-xl text-sm font-medium hover:bg-[#c94f3a]">Cari</button>
                </div>

                {/* Table (Desktop) */}
                <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {['#', 'User', 'Paket', 'Jumlah', 'Metode', 'Status', 'Tanggal', 'Aksi'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.length === 0 && (
                                    <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">Tidak ada transaksi ditemukan</td></tr>
                                )}
                                {data.map(p => {
                                    const st = statusMap[p.status] || { label: p.status, color: 'bg-gray-100 text-gray-500' };
                                    const mt = methodMap[p.payment_gateway] || { label: p.payment_gateway, icon: '💰' };
                                    const isManualPending = ['waiting_review', 'pending_manual'].includes(p.status);
                                    return (
                                        <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${isManualPending ? 'bg-amber-50/30' : ''}`}>
                                            <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{p.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{p.user?.name}</div>
                                                <div className="text-xs text-gray-400">{p.user?.email}</div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-700">{p.plan?.name || '-'}</td>
                                            <td className="px-4 py-3 font-bold text-gray-800">{formatCurrency(p.amount)}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                                                    {mt.icon} {mt.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.color}`}>
                                                    {isManualPending && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-400">{formatDate(p.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <Link href={`${adminRoutePrefix}/transactions/${p.id}`}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isManualPending
                                                        ? 'bg-[#E5654B] text-white hover:bg-[#c94f3a]'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}>
                                                    {isManualPending ? 'Review ›' : 'Detail ›'}
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Cards (Mobile) */}
                <div className="block sm:hidden space-y-3">
                    {data.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
                            Tidak ada transaksi ditemukan
                        </div>
                    )}
                    {data.map(p => {
                        const st = statusMap[p.status] || { label: p.status, color: 'bg-gray-100 text-gray-500' };
                        const mt = methodMap[p.payment_gateway] || { label: p.payment_gateway, icon: '💰' };
                        const isManualPending = ['waiting_review', 'pending_manual'].includes(p.status);
                        return (
                            <div key={p.id} className={`bg-white rounded-2xl border p-4 space-y-3 transition-colors ${isManualPending ? 'border-amber-300 bg-amber-50/10' : 'border-gray-200'}`}>
                                {/* Header: ID & Status */}
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-gray-400">#{p.id}</span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${st.color}`}>
                                        {isManualPending && <span className="w-1 h-1 rounded-full bg-current animate-pulse" />}
                                        {st.label}
                                    </span>
                                </div>

                                {/* User & Plan Details */}
                                <div>
                                    <div className="font-semibold text-gray-800 text-sm">{p.user?.name}</div>
                                    <div className="text-xs text-gray-400">{p.user?.email}</div>
                                    <div className="mt-2 text-xs text-gray-600">
                                        Paket: <span className="font-semibold text-gray-800">{p.plan?.name || '-'}</span>
                                    </div>
                                </div>

                                {/* Amount, Method & Date */}
                                <div className="flex justify-between items-end pt-2 border-t border-gray-100">
                                    <div>
                                        <div className="text-[10px] text-gray-400">{formatDate(p.created_at)}</div>
                                        <div className="text-xs font-medium text-gray-600 mt-0.5">
                                            {mt.icon} {mt.label}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-extrabold text-gray-800">{formatCurrency(p.amount)}</div>
                                    </div>
                                </div>

                                {/* Action button */}
                                <div className="pt-1">
                                    <Link href={`${adminRoutePrefix}/transactions/${p.id}`}
                                        className={`block w-full text-center py-2 rounded-xl text-xs font-semibold transition-colors ${isManualPending
                                            ? 'bg-[#E5654B] text-white hover:bg-[#c94f3a]'
                                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                                        }`}>
                                        {isManualPending ? 'Review Transaksi ›' : 'Lihat Detail ›'}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {payments?.links?.length > 3 && (
                    <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex flex-wrap gap-1">
                        {payments.links.map((link, i) => (
                            <button key={i} disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-[#E5654B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </DynamicAdminLayout>
    );
}
