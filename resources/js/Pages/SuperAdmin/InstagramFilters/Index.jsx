import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Camera, Plus, Check, Power, Trash2, Edit2, ExternalLink } from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.8 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);

export default function InstagramFiltersIndex({ filters = [] }) {
    const { flash } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    const handleToggle = (id) => {
        setTogglingId(id);
        router.post(`/super-admin/instagram-filters/${id}/toggle-active`, {}, {
            onFinish: () => setTogglingId(null),
            preserveScroll: true,
        });
    };

    const handleDelete = (id, name) => {
        if (!confirm(`Hapus filter "${name}" dari katalog? Tindakan ini tidak bisa dibatalkan.`)) return;
        setDeletingId(id);
        router.delete(`/super-admin/instagram-filters/${id}`, {
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <SuperAdminLayout title="Katalog Filter Instagram">
            <Head title="Katalog Filter Instagram - Super Admin" />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Katalog Filter Instagram</h2>
                        <p className="text-sm text-[#999] mt-0.5">
                            Kelola pilihan filter Instagram AR generik yang dapat langsung dipasang tamu undangan.
                            <span className="ml-1.5 font-semibold text-[#E5654B]">{filters.length} filter aktif</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/super-admin/instagram-filters/create"
                            className="inline-flex items-center gap-2 px-5 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Tambah Filter
                        </Link>
                    </div>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Empty State */}
                {filters.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#E5654B]">
                            <Camera className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-700 mb-1">Belum ada filter</h3>
                        <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
                            Tambahkan filter Instagram pertama Anda agar pengguna dapat memilihnya langsung di dashboard.
                        </p>
                        <Link
                            href="/super-admin/instagram-filters/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5654B] text-white text-sm font-semibold rounded-xl hover:bg-[#c24b33] transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Tambah Filter Pertama
                        </Link>
                    </div>
                )}

                {/* Grid Katalog */}
                {filters.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filters.map(filter => (
                            <div
                                key={filter.id}
                                className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col ${
                                    filter.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
                                }`}
                            >
                                {/* Thumbnail */}
                                <div className="h-40 relative overflow-hidden bg-stone-900 flex items-center justify-center">
                                    {filter.preview_image || filter.thumbnail ? (
                                        <img
                                            src={filter.preview_image || filter.thumbnail}
                                            alt={filter.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Camera className="w-10 h-10 mx-auto text-white/40 mb-2" />
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{filter.slug}</span>
                                        </div>
                                    )}

                                    {/* Order Badge */}
                                    <div className="absolute top-3 left-3 bg-black/40 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                        Urutan: #{filter.sort_order || 0}
                                    </div>

                                    {/* Active Badge */}
                                    <div className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                        filter.is_active
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-stone-200 text-stone-500'
                                    }`}>
                                        {filter.is_active ? 'Aktif' : 'Nonaktif'}
                                    </div>
                                </div>

                                {/* Detail */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-stone-800 truncate" title={filter.name}>
                                            {filter.name}
                                        </h3>
                                        <p className="text-[10px] text-stone-400 font-mono">{filter.slug}</p>
                                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed pt-1">
                                            {filter.description || 'Tidak ada deskripsi.'}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        {/* Link filter */}
                                        <a
                                            href={filter.filter_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 transition-all truncate"
                                            title="Uji coba filter di Instagram"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span className="truncate">Coba Filter</span>
                                        </a>

                                        <div className="flex gap-1.5 pt-1 border-t border-stone-50">
                                            {/* Edit */}
                                            <Link
                                                href={`/super-admin/instagram-filters/${filter.id}/edit`}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-all"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>

                                            {/* Toggle Active */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(filter.id)}
                                                disabled={togglingId === filter.id}
                                                className={`p-2 rounded-xl transition-all disabled:opacity-50 ${
                                                    filter.is_active
                                                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                                }`}
                                                title={filter.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            >
                                                <Power className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(filter.id, filter.name)}
                                                disabled={deletingId === filter.id}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all disabled:opacity-50"
                                                title="Hapus dari katalog"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
