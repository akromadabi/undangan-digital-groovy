import { Head, Link, router, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { Plus, Edit2, Trash2, CreditCard, Clock, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function Index({ plans }) {
    const { adminRoutePrefix } = usePage().props;
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus paket kartu ucapan ini?')) {
            router.delete(`${adminRoutePrefix}/greeting-card-plans/${id}`);
        }
    };

    return (
        <DynamicAdminLayout title="Manajemen Paket Kartu Ucapan">
            <Head title="Super Admin - Paket Kartu Ucapan" />
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Daftar Paket Kartu Ucapan</h2>
                        <p className="text-sm text-gray-500">Kelola paket (kelas/tingkat) berlangganan dan batasan fitur untuk kartu ucapan.</p>
                    </div>
                    <Link
                        href={`${adminRoutePrefix}/greeting-card-plans/create`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#E5654B] to-[#ff7d63] hover:from-[#c94f3a] hover:to-[#e05b41] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E5654B]/50"
                    >
                        <Plus size={16} />
                        Tambah Paket Kartu
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans && plans.length > 0 ? (
                        plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="relative bg-white rounded-3xl border border-[#e8e5e0] p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-gray-300 group overflow-hidden"
                            >
                                {/* Decorative gradient blur behind active/premium templates */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#E5654B]/5 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E5654B]/10 text-[#E5654B]">
                                                <Sparkles size={10} />
                                                Slug: {plan.slug}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900 mt-1">{plan.name}</h3>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-xl">
                                            {plan.subscriptions_count || 0} Pengguna
                                        </span>
                                    </div>

                                    <div className="space-y-1 pt-2">
                                        <div className="text-xs font-medium text-gray-400">Harga Dasar</div>
                                        <div className="text-3xl font-extrabold text-[#E5654B]">
                                            {formatCurrency(plan.price)}
                                        </div>
                                        {plan.suggested_price && (
                                            <div className="text-xs text-gray-500 font-medium">
                                                Saran Jual Reseller: <span className="text-gray-700 font-semibold">{formatCurrency(plan.suggested_price)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {plan.description && (
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                            {plan.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#f0ede8]">
                                        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                            <Clock size={14} className="text-gray-400" />
                                            <span>{plan.duration_days} Hari Aktif</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                            <ImageIcon size={14} className="text-gray-400" />
                                            <span>Max {plan.max_galleries} Galeri</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-5 mt-5 border-t border-[#f0ede8] relative z-10">
                                    <Link
                                        href={`${adminRoutePrefix}/greeting-card-plans/${plan.id}/edit`}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-[#E5654B]/10 text-gray-700 hover:text-[#E5654B] border border-gray-200 hover:border-[#E5654B]/30 rounded-xl text-xs font-semibold transition-all duration-200"
                                    >
                                        <Edit2 size={12} />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(plan.id)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-red-500 hover:text-red-700 border border-gray-200 hover:border-red-200 rounded-xl text-xs font-semibold transition-all duration-200"
                                    >
                                        <Trash2 size={12} />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-3xl border border-[#e8e5e0] p-12 text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                                <CreditCard size={24} />
                            </div>
                            <h3 className="font-bold text-gray-800">Belum ada paket kartu ucapan</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">Mulai dengan menambahkan paket kartu ucapan baru untuk pelanggan atau reseller.</p>
                        </div>
                    )}
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
