import { Head, useForm, usePage, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { useState } from 'react';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

const statusConfig = {
    pending: { label: 'Menunggu', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    approved: { label: 'Disetujui', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    transferred: { label: 'Ditransfer', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    rejected: { label: 'Ditolak', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

const filterTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Pending' },
    { key: 'transferred', label: 'Selesai' },
];

export default function Withdrawals({ withdrawals, stats, filters }) {
    const { flash } = usePage().props;
    const [actionModal, setActionModal] = useState(null);
    const activeFilter = filters?.status || 'all';

    const actionForm = useForm({
        status: '',
        admin_notes: '',
    });

    const openAction = (withdrawal, status) => {
        setActionModal(withdrawal);
        actionForm.setData({ status, admin_notes: '' });
    };

    const handleAction = (e) => {
        e.preventDefault();
        actionForm.post(`/super-admin/withdrawals/${actionModal.id}`, {
            preserveScroll: true,
            onSuccess: () => setActionModal(null),
        });
    };

    const handleFilter = (status) => {
        router.get('/super-admin/withdrawals', status === 'all' ? {} : { status }, { preserveState: true });
    };

    return (
        <SuperAdminLayout title="Kelola Pencairan">
            <Head title="Kelola Pencairan" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Kelola Pencairan</h2>
                    <p className="text-[#999] text-sm mt-1">Review dan proses permohonan pencairan dari reseller</p>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                        {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
                        <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Pending</p>
                        <p className="text-2xl font-bold text-amber-600 mt-2">{stats.pending_count}</p>
                        <p className="text-xs text-[#999] mt-1">{formatCurrency(stats.pending_amount)}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
                        <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Sudah Ditransfer</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-2">{stats.transferred_count}</p>
                        <p className="text-xs text-[#999] mt-1">{formatCurrency(stats.transferred_amount)}</p>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => handleFilter(tab.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                activeFilter === tab.key
                                    ? 'bg-[#E5654B] text-white shadow-sm'
                                    : 'bg-white border border-[#e8e5e0] text-[#666] hover:border-[#E5654B] hover:text-[#E5654B]'
                            }`}
                        >
                            {tab.label}
                            {tab.key === 'pending' && stats.pending_count > 0 && (
                                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{stats.pending_count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#f0ede8]">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">Reseller</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase">Jumlah</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">Rekening</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#999] uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#999] uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f5f3f0]">
                                {(withdrawals.data || []).map(w => (
                                    <tr key={w.id} className="hover:bg-[#faf9f6] transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-medium text-[#333]">{w.reseller_name}</div>
                                            <div className="text-xs text-[#999]">{w.reseller_email}</div>
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm font-bold text-[#1a1a1a]">{formatCurrency(w.amount)}</td>
                                        <td className="px-6 py-3">
                                            <div className="text-sm text-[#333]">{w.bank_name}</div>
                                            <div className="text-xs text-[#999]">{w.bank_account} · {w.bank_holder}</div>
                                        </td>
                                        <td className="px-6 py-3 text-center"><StatusBadge status={w.status} /></td>
                                        <td className="px-6 py-3">
                                            <div className="text-xs text-[#666]">{w.created_at}</div>
                                            {w.transferred_at && <div className="text-[10px] text-emerald-600 mt-0.5">Transfer: {w.transferred_at}</div>}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {w.status === 'pending' && (
                                                <div className="flex items-center gap-1 justify-center">
                                                    <button onClick={() => openAction(w, 'transferred')}
                                                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
                                                        title="Transfer">
                                                        Transfer
                                                    </button>
                                                    <button onClick={() => openAction(w, 'rejected')}
                                                        className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                                                        title="Tolak">
                                                        Tolak
                                                    </button>
                                                </div>
                                            )}
                                            {w.status !== 'pending' && (
                                                <span className="text-xs text-[#999]">
                                                    {w.admin_notes || '-'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!withdrawals.data || withdrawals.data.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[#999]">
                                            <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[#ddd] mx-auto mb-2" />
                                            <p className="text-sm">Tidak ada permohonan pencairan</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Modal */}
                {actionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setActionModal(null)}>
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <h3 className="font-bold text-[#1a1a1a] text-lg mb-1">
                                {actionForm.data.status === 'transferred' ? '✅ Konfirmasi Transfer' : '❌ Tolak Pencairan'}
                            </h3>
                            <p className="text-sm text-[#999] mb-4">
                                {actionForm.data.status === 'transferred'
                                    ? `Tandai pencairan ${formatCurrency(actionModal.amount)} untuk ${actionModal.reseller_name} sebagai sudah ditransfer?`
                                    : `Tolak pencairan ${formatCurrency(actionModal.amount)} dari ${actionModal.reseller_name}?`
                                }
                            </p>

                            <form onSubmit={handleAction} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#666] mb-1.5">
                                        Catatan {actionForm.data.status === 'rejected' ? '(alasan penolakan)' : '(opsional)'}
                                    </label>
                                    <textarea
                                        value={actionForm.data.admin_notes}
                                        onChange={e => actionForm.setData('admin_notes', e.target.value)}
                                        placeholder={actionForm.data.status === 'transferred' ? 'Misal: Ditransfer via BCA' : 'Alasan penolakan...'}
                                        className="w-full border border-[#e8e5e0] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:border-[#E5654B] focus:ring-[#E5654B] resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setActionModal(null)}
                                        className="flex-1 px-4 py-2.5 border border-[#e8e5e0] text-[#666] rounded-xl text-sm font-medium hover:bg-[#f5f3f0] transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={actionForm.processing}
                                        className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors ${
                                            actionForm.data.status === 'transferred'
                                                ? 'bg-emerald-500 hover:bg-emerald-600'
                                                : 'bg-red-500 hover:bg-red-600'
                                        }`}>
                                        {actionForm.processing ? 'Memproses...' :
                                            actionForm.data.status === 'transferred' ? 'Konfirmasi Transfer' : 'Tolak Pencairan'
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
