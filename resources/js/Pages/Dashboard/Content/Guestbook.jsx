import { Head, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Guestbook({ wishes }) {
    const { flash } = usePage().props;

    const handleToggleVisibility = (wishId, currentVisible) => {
        // TODO: implement toggle visibility endpoint
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const wishList = wishes?.data || wishes || [];
    const pagination = wishes?.links;

    return (
        <DashboardLayout title="Guestbook">
            <Head title="Guestbook / Ucapan" />
            <div className="max-w-3xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">📖</span>
                    <div>
                        <div className="font-medium text-purple-800 text-sm">Guestbook / Ucapan</div>
                        <div className="text-purple-600 text-xs mt-0.5">
                            Semua ucapan dan doa dari tamu akan tampil di sini. Total: <strong>{wishList.length}</strong> ucapan.
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{wishList.length}</div>
                        <div className="text-xs text-gray-500 mt-1">Total Ucapan</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                            {wishList.filter(w => w.guest?.name).length}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Dari Tamu Terdaftar</div>
                    </div>
                </div>

                {/* Wishes List */}
                {wishList.length > 0 ? (
                    <div className="space-y-3">
                        {wishList.map((wish) => (
                            <div key={wish.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {(wish.sender_name || 'A').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm">{wish.sender_name}</div>
                                            <div className="text-xs text-gray-400">{formatDate(wish.created_at)}</div>
                                        </div>
                                    </div>
                                    {wish.guest?.name && (
                                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                                            Tamu Terdaftar
                                        </span>
                                    )}
                                </div>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {wish.message}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="text-5xl mb-3">💌</div>
                        <div className="text-gray-500 font-medium">Belum ada ucapan</div>
                        <div className="text-gray-400 text-sm mt-1">Ucapan dari tamu akan muncul di sini setelah undangan Anda dibuka</div>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {pagination.map((link, i) => (
                            <button key={i}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                disabled={!link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
