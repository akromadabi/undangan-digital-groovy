import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

const statusMap = {
    pending_manual: { label: 'Menunggu Upload Bukti', color: 'bg-amber-100 text-amber-700' },
    waiting_review: { label: 'Menunggu Review', color: 'bg-blue-100 text-blue-700' },
    paid:           { label: 'Lunas', color: 'bg-emerald-100 text-emerald-700' },
    rejected:       { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
    cancelled:      { label: 'Dibatalkan', color: 'bg-gray-100 text-gray-500' },
    pending:        { label: 'Pending (Xendit)', color: 'bg-amber-50 text-amber-600' },
};

const formatCurrency = a => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);
const formatDate = d => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function TransactionDetail({ payment }) {
    const { adminRoutePrefix, flash } = usePage().props;
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [approveNotes, setApproveNotes] = useState('');
    const [rejectNotes, setRejectNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    const status = statusMap[payment.status] || { label: payment.status, color: 'bg-gray-100 text-gray-500' };
    const isReviewable = ['waiting_review', 'pending_manual'].includes(payment.status);

    const handleApprove = () => {
        setProcessing(true);
        router.post(`${adminRoutePrefix}/transactions/${payment.id}/approve`,
            { notes: approveNotes },
            { onFinish: () => { setProcessing(false); setShowApprove(false); } }
        );
    };

    const handleReject = () => {
        if (!rejectNotes.trim()) return;
        setProcessing(true);
        router.post(`${adminRoutePrefix}/transactions/${payment.id}/reject`,
            { notes: rejectNotes },
            { onFinish: () => { setProcessing(false); setShowReject(false); } }
        );
    };

    return (
        <DynamicAdminLayout title="Detail Transaksi">
            <Head title="Detail Transaksi" />
            <div className="max-w-3xl space-y-5">
                <Link href={`${adminRoutePrefix}/transactions`} className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium">← Kembali ke Transaksi</Link>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{flash.error}</div>
                )}

                {/* Status + Actions */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="text-xs text-gray-400 font-mono">ID #{payment.id}</div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${status.color}`}>
                            {payment.status === 'waiting_review' && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                            {status.label}
                        </span>
                    </div>

                    {isReviewable && (
                        <div className="flex gap-2">
                            <button onClick={() => setShowApprove(true)}
                                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Setujui
                            </button>
                            <button onClick={() => setShowReject(true)}
                                className="px-5 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                Tolak
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* User Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                        <h3 className="font-bold text-gray-800 text-sm">Informasi User</h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Nama', value: payment.user?.name },
                                { label: 'Email', value: payment.user?.email },
                            ].map(r => (
                                <div key={r.label} className="flex justify-between text-sm">
                                    <span className="text-gray-400">{r.label}</span>
                                    <span className="font-medium text-gray-700">{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                        <h3 className="font-bold text-gray-800 text-sm">Informasi Pembayaran</h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Paket', value: payment.plan?.name },
                                { label: 'Jumlah', value: formatCurrency(payment.amount) },
                                { label: 'Metode', value: payment.payment_gateway === 'manual' ? 'Transfer Bank Manual' : 'Xendit' },
                                { label: 'Tanggal', value: formatDate(payment.created_at) },
                            ].map(r => (
                                <div key={r.label} className="flex justify-between text-sm">
                                    <span className="text-gray-400">{r.label}</span>
                                    <span className="font-medium text-gray-700">{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Proof Image */}
                {payment.proof_image && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                        <h3 className="font-bold text-gray-800 text-sm">Bukti Transfer</h3>
                        <a href={`/storage/${payment.proof_image}`} target="_blank" rel="noopener noreferrer"
                            className="block">
                            <img src={`/storage/${payment.proof_image}`} alt="Bukti Transfer"
                                className="max-h-96 mx-auto rounded-xl border border-gray-200 object-contain hover:opacity-90 transition-opacity cursor-zoom-in" />
                        </a>
                        <p className="text-xs text-gray-400 text-center">Klik gambar untuk memperbesar</p>
                    </div>
                )}

                {!payment.proof_image && payment.payment_gateway === 'manual' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                        <p className="text-amber-700 font-medium text-sm">User belum mengupload bukti transfer</p>
                    </div>
                )}

                {/* Admin Notes */}
                {payment.admin_notes && (
                    <div className={`rounded-2xl border p-4 ${payment.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Catatan Admin</p>
                        <p className="text-sm text-gray-700">{payment.admin_notes}</p>
                    </div>
                )}

                {/* Subscription Info */}
                {payment.subscription && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
                        <h3 className="font-bold text-emerald-800 text-sm">✅ Langganan Aktif</h3>
                        <div className="text-sm text-emerald-700 space-y-1">
                            <div>Mulai: {formatDate(payment.subscription.starts_at)}</div>
                            <div>Berakhir: {formatDate(payment.subscription.expires_at)}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Approve Modal */}
            {showApprove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target === e.currentTarget && setShowApprove(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <h3 className="font-bold text-gray-800 text-lg">Setujui Pembayaran</h3>
                        <p className="text-sm text-gray-500">Menyetujui pembayaran ini akan mengaktifkan langganan <strong>{payment.user?.name}</strong> untuk paket <strong>{payment.plan?.name}</strong>.</p>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Catatan (opsional)</label>
                            <textarea value={approveNotes} onChange={e => setApproveNotes(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm resize-none" rows={3}
                                placeholder="Tambahkan catatan jika perlu..." />
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button onClick={handleApprove} disabled={processing}
                                className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50 text-sm">
                                {processing ? 'Menyetujui...' : '✅ Ya, Setujui'}
                            </button>
                            <button onClick={() => setShowApprove(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200">Batal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showReject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target === e.currentTarget && setShowReject(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <h3 className="font-bold text-gray-800 text-lg">Tolak Pembayaran</h3>
                        <p className="text-sm text-gray-500">Berikan alasan penolakan. User akan melihat catatan ini.</p>
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Alasan Penolakan <span className="text-red-500">*</span></label>
                            <textarea value={rejectNotes} onChange={e => setRejectNotes(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm resize-none focus:ring-2 focus:ring-red-300" rows={3}
                                placeholder="Contoh: Bukti transfer tidak jelas, nomor rekening tidak sesuai..." required />
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button onClick={handleReject} disabled={processing || !rejectNotes.trim()}
                                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 text-sm">
                                {processing ? 'Menolak...' : '❌ Ya, Tolak'}
                            </button>
                            <button onClick={() => setShowReject(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200">Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </DynamicAdminLayout>
    );
}
