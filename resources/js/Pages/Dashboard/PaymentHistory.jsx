import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function PaymentHistory({ payments }) {
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);
    const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const statusBadge = (status) => ({
        paid: { text: '✅ Berhasil', cls: 'bg-emerald-100 text-emerald-700' },
        pending: { text: '⏳ Menunggu', cls: 'bg-amber-100 text-amber-700' },
        failed: { text: '❌ Gagal', cls: 'bg-red-100 text-red-700' },
        expired: { text: '⏰ Expired', cls: 'bg-gray-100 text-gray-500' },
    })[status] || { text: status, cls: 'bg-gray-100 text-gray-500' };

    const payList = payments?.data || [];

    return (
        <DashboardLayout title="Riwayat Pembayaran">
            <Head title="Riwayat Pembayaran" />
            <div className="max-w-3xl mx-auto space-y-6">
                {payList.length > 0 ? (
                    <div className="space-y-3">
                        {payList.map(p => {
                            const badge = statusBadge(p.status);
                            return (
                                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-800">Paket {p.plan?.name || '-'}</div>
                                        <div className="text-xs text-gray-400 mt-1">{formatDate(p.created_at)}</div>
                                        {p.payment_method && <div className="text-xs text-gray-400">via {p.payment_method}</div>}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-800">{formatCurrency(p.amount)}</div>
                                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.cls}`}>{badge.text}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="text-5xl mb-3">💳</div>
                        <div className="text-gray-500 font-medium">Belum ada riwayat pembayaran</div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
