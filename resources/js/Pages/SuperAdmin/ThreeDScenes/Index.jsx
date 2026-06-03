import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Layers, Plus, Check, Power, Trash2, Edit2, ExternalLink } from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

export default function ThreeDScenesIndex({ scenes = [] }) {
    const { flash } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    const handleToggle = (id) => {
        setTogglingId(id);
        router.post(`/super-admin/three-d-scenes/${id}/toggle-active`, {}, {
            onFinish: () => setTogglingId(null),
            preserveScroll: true,
        });
    };

    const handleDelete = (id, name) => {
        if (!confirm(`Hapus scene 3D "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        setDeletingId(id);
        router.delete(`/super-admin/three-d-scenes/${id}`, {
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <SuperAdminLayout title="Template 3D Parallax Canvas">
            <Head title="3D Parallax Canvas - Super Admin" />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Template 3D Parallax Canvas</h2>
                        <p className="text-sm text-[#999] mt-0.5">
                            Kelola template animasi 3D flythrough (Mental Canvas) untuk diintegrasikan pada tema undangan.
                            <span className="ml-1.5 font-semibold text-[#E5654B]">{scenes.length} scene terdaftar</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/super-admin/three-d-scenes/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5654B] hover:bg-[#c24b33] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Buat Scene Baru
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
                {scenes.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#E5654B]">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-700 mb-1">Belum ada scene 3D</h3>
                        <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
                            Buat template 3D canvas pertama Anda untuk menyusun gambar 2D dalam ruang parallax 3D.
                        </p>
                        <Link
                            href="/super-admin/three-d-scenes/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5654B] text-white text-sm font-semibold rounded-xl hover:bg-[#c24b33] transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Buat Scene Pertama
                        </Link>
                    </div>
                )}

                {/* Grid Katalog */}
                {scenes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {scenes.map(scene => (
                            <div
                                key={scene.id}
                                className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col ${
                                    scene.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
                                }`}
                            >
                                {/* Thumbnail */}
                                <div className="h-40 relative overflow-hidden bg-stone-900 flex items-center justify-center">
                                    {scene.thumbnail ? (
                                        <img
                                            src={scene.thumbnail}
                                            alt={scene.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Layers className="w-10 h-10 mx-auto text-white/40 mb-2" />
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{scene.slug}</span>
                                        </div>
                                    )}

                                    {/* Active Badge */}
                                    <div className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                        scene.is_active
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-stone-200 text-stone-500'
                                    }`}>
                                        {scene.is_active ? 'Aktif' : 'Nonaktif'}
                                    </div>
                                </div>

                                {/* Detail */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-stone-800 truncate" title={scene.name}>
                                            {scene.name}
                                        </h3>
                                        <p className="text-[10px] text-stone-400 font-mono">{scene.slug}</p>
                                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed pt-1">
                                            Layers: {scene.config?.layers?.length || 0} items | Keyframes: {scene.config?.keyframes?.length || 0} positions
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        <div className="flex gap-1.5 pt-1 border-t border-stone-50">
                                            {/* Edit */}
                                            <Link
                                                href={`/super-admin/three-d-scenes/${scene.id}/edit`}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-all"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                Edit Scene
                                            </Link>

                                            {/* Toggle Active */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(scene.id)}
                                                disabled={togglingId === scene.id}
                                                className={`p-2 rounded-xl transition-all disabled:opacity-50 ${
                                                    scene.is_active
                                                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                                }`}
                                                title={scene.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            >
                                                <Power className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(scene.id, scene.name)}
                                                disabled={deletingId === scene.id}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all disabled:opacity-50"
                                                title="Hapus scene"
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
