import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Hadiah({ gifts }) {
    const { flash } = usePage().props;

    const giftList = gifts?.data || gifts || [];
    const pagination = gifts?.links;

    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const totalAmount = giftList.filter(g => g.gift_type === 'uang').reduce((sum, g) => sum + parseFloat(g.amount || 0), 0);

    return (
        <DashboardLayout title="Hadiah">
            <Head title="Hadiah" />
            <div className="max-w-3xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">🎁</span>
                    <div>
                        <div className="font-medium text-amber-800 text-sm">Tracking Hadiah</div>
                        <div className="text-amber-600 text-xs mt-0.5">Pantau hadiah yang diterima dari tamu. Data ini bersifat privat dan hanya bisa dilihat oleh Anda.</div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                        <div className="text-3xl font-bold text-amber-600">{giftList.length}</div>
                        <div className="text-xs text-gray-500 mt-1">Total Hadiah</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-center text-white">
                        <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
                        <div className="text-xs mt-1 opacity-80">Hadiah Uang</div>
                    </div>
                </div>

                {/* Gift List */}
                {giftList.length > 0 ? (
                    <div className="space-y-3">
                        {giftList.map((gift) => (
                            <div key={gift.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${gift.gift_type === 'uang' ? 'bg-emerald-100' : 'bg-amber-100'
                                    }`}>
                                    {gift.gift_type === 'uang' ? '💰' : '📦'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold text-gray-800 text-sm">{gift.sender_name}</div>
                                        {gift.confirmed && (
                                            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">✅ Dikonfirmasi</span>
                                        )}
                                    </div>
                                    {gift.gift_type === 'uang' ? (
                                        <div className="text-lg font-bold text-emerald-600 mt-1">{formatCurrency(gift.amount)}</div>
                                    ) : (
                                        <div className="text-sm text-gray-600 mt-1">{gift.item_name}</div>
                                    )}
                                    {gift.message && (
                                        <p className="text-xs text-gray-400 mt-1">"{gift.message}"</p>
                                    )}
                                    <div className="text-xs text-gray-300 mt-1">{formatDate(gift.created_at)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="text-5xl mb-3">🎁</div>
                        <div className="text-gray-500 font-medium">Belum ada hadiah</div>
                        <div className="text-gray-400 text-sm mt-1">Data hadiah akan muncul saat tamu memberikan hadiah</div>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {pagination.map((link, i) => (
                            <button key={i}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                disabled={!link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
