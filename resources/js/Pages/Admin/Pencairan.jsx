import { Head, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
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

const tabs = [
    { key: 'saldo', label: 'Saldo & Pencairan', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' },
    { key: 'riwayat', label: 'Riwayat Pencairan', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'rekening', label: 'Info Rekening', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
];

export default function Pencairan({ balance, withdrawals, bankInfo }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('saldo');

    // Withdrawal request form
    const withdrawForm = useForm({ amount: '' });

    // Bank info form
    const bankForm = useForm({
        bank_name: bankInfo.bank_name || '',
        bank_account: bankInfo.bank_account || '',
        bank_holder: bankInfo.bank_holder || '',
    });

    const handleWithdraw = (e) => {
        e.preventDefault();
        withdrawForm.post('/admin/pencairan/request', { preserveScroll: true, onSuccess: () => withdrawForm.reset() });
    };

    const handleSaveBank = (e) => {
        e.preventDefault();
        bankForm.post('/admin/pencairan/bank', { preserveScroll: true });
    };

    const hasBankInfo = bankInfo.bank_name && bankInfo.bank_account && bankInfo.bank_holder;

    return (
        <AdminLayout title="Pencairan">
            <Head title="Pencairan" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Pencairan Dana</h2>
                    <p className="text-[#999] text-sm mt-1">Kelola saldo profit dan ajukan pencairan dana Anda</p>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                        {flash.success}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-[#f0ede8] p-1 rounded-xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                                activeTab === tab.key
                                    ? 'bg-white text-[#1a1a1a] shadow-sm'
                                    : 'text-[#999] hover:text-[#666]'
                            }`}
                        >
                            <Icon d={tab.icon} className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* ═══ Tab: Saldo & Pencairan ═══ */}
                {activeTab === 'saldo' && (
                    <div className="space-y-5">
                        {/* Balance Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Total Profit</p>
                                <p className="text-2xl font-bold text-[#1a1a1a] mt-2">{formatCurrency(balance.total_profit)}</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Sudah Dicairkan</p>
                                <p className="text-2xl font-bold text-[#999] mt-2">{formatCurrency(balance.total_withdrawn)}</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
                                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">Dalam Proses</p>
                                <p className="text-2xl font-bold text-amber-600 mt-2">{formatCurrency(balance.pending)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
                                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Saldo Tersedia</p>
                                <p className="text-2xl font-bold mt-2">{formatCurrency(balance.available)}</p>
                            </div>
                        </div>

                        {/* Withdrawal form */}
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6">
                            <h3 className="font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                <Icon d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-emerald-500" />
                                Ajukan Pencairan
                            </h3>

                            {!hasBankInfo && (
                                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                                    <Icon d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" className="w-4 h-4 flex-shrink-0" />
                                    Lengkapi info rekening bank di tab "Info Rekening" sebelum mengajukan pencairan.
                                </div>
                            )}

                            <form onSubmit={handleWithdraw} className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-sm">Rp</span>
                                        <input
                                            type="number"
                                            min="10000"
                                            step="1000"
                                            max={balance.available}
                                            value={withdrawForm.data.amount}
                                            onChange={e => withdrawForm.setData('amount', e.target.value)}
                                            placeholder="Masukkan jumlah pencairan (min. Rp 10.000)"
                                            className="w-full border border-[#e8e5e0] rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:border-[#E5654B] focus:ring-[#E5654B]"
                                            disabled={!hasBankInfo || balance.available <= 0}
                                        />
                                    </div>
                                    {withdrawForm.errors.amount && (
                                        <p className="text-xs text-red-500 mt-1">{withdrawForm.errors.amount}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={withdrawForm.processing || !hasBankInfo || balance.available <= 0}
                                    className="px-6 py-3 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#d4523a] disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Icon d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-4 h-4" />
                                    {withdrawForm.processing ? 'Mengirim...' : 'Ajukan Pencairan'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ═══ Tab: Riwayat Pencairan ═══ */}
                {activeTab === 'riwayat' && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                            <h3 className="font-bold text-[#1a1a1a] text-sm flex items-center gap-2">
                                <Icon d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[#E5654B]" />
                                Riwayat Pencairan
                            </h3>
                            <span className="text-xs text-[#999]">{withdrawals.length} total</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#f0ede8]">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">Tanggal</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase">Jumlah</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-[#999] uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">Catatan</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase">Ditransfer</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f5f3f0]">
                                    {withdrawals.map(w => (
                                        <tr key={w.id} className="hover:bg-[#faf9f6] transition-colors">
                                            <td className="px-6 py-3 text-sm text-[#333]">{w.created_at}</td>
                                            <td className="px-6 py-3 text-right text-sm font-semibold text-[#1a1a1a]">{formatCurrency(w.amount)}</td>
                                            <td className="px-6 py-3 text-center"><StatusBadge status={w.status} /></td>
                                            <td className="px-6 py-3 text-sm text-[#666] max-w-[200px] truncate">{w.admin_notes || '-'}</td>
                                            <td className="px-6 py-3 text-right text-xs text-[#999]">{w.transferred_at || '-'}</td>
                                        </tr>
                                    ))}
                                    {withdrawals.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-[#999]">
                                                <Icon d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75" className="w-8 h-8 text-[#ddd] mx-auto mb-2" />
                                                <p className="text-sm">Belum ada riwayat pencairan</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ═══ Tab: Info Rekening ═══ */}
                {activeTab === 'rekening' && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 max-w-lg">
                        <h3 className="font-bold text-[#1a1a1a] mb-1 flex items-center gap-2">
                            <Icon d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-5 h-5 text-blue-500" />
                            Info Rekening Bank
                        </h3>
                        <p className="text-[#999] text-sm mb-5">Data ini digunakan untuk proses transfer pencairan dana.</p>

                        <form onSubmit={handleSaveBank} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#666] mb-1.5">Nama Bank</label>
                                <input
                                    type="text"
                                    value={bankForm.data.bank_name}
                                    onChange={e => bankForm.setData('bank_name', e.target.value)}
                                    placeholder="Contoh: BCA, BRI, Mandiri, BNI"
                                    className="w-full border border-[#e8e5e0] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:border-[#E5654B] focus:ring-[#E5654B]"
                                />
                                {bankForm.errors.bank_name && <p className="text-xs text-red-500 mt-1">{bankForm.errors.bank_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#666] mb-1.5">Nomor Rekening</label>
                                <input
                                    type="text"
                                    value={bankForm.data.bank_account}
                                    onChange={e => bankForm.setData('bank_account', e.target.value)}
                                    placeholder="Masukkan nomor rekening"
                                    className="w-full border border-[#e8e5e0] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:border-[#E5654B] focus:ring-[#E5654B]"
                                />
                                {bankForm.errors.bank_account && <p className="text-xs text-red-500 mt-1">{bankForm.errors.bank_account}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#666] mb-1.5">Nama Pemilik Rekening</label>
                                <input
                                    type="text"
                                    value={bankForm.data.bank_holder}
                                    onChange={e => bankForm.setData('bank_holder', e.target.value)}
                                    placeholder="Nama sesuai buku rekening"
                                    className="w-full border border-[#e8e5e0] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:border-[#E5654B] focus:ring-[#E5654B]"
                                />
                                {bankForm.errors.bank_holder && <p className="text-xs text-red-500 mt-1">{bankForm.errors.bank_holder}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={bankForm.processing}
                                className="px-6 py-3 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#d4523a] disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                <Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4" />
                                {bankForm.processing ? 'Menyimpan...' : 'Simpan Info Rekening'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
