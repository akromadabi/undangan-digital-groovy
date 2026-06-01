import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Mail, 
    Sparkles, 
    Gift, 
    Waves, 
    Gamepad2, 
    Cpu, 
    Lightbulb, 
    TreePine 
} from 'lucide-react';

const templateIcons = {
    stillwithyou:   Sparkles,
    giftforanita:   Gift,
    oceanbreeze:    Waves,
    cosmicdrift:    Sparkles,
    retroarcade:    Gamepad2,
    cyberpunk:      Cpu,
    bioluminescent: Lightbulb,
    mysticforest:   TreePine,
};
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.8 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);

const typeColors = {
    anniversary: 'bg-pink-50 text-pink-600 border-pink-100',
    birthday:    'bg-amber-50 text-amber-600 border-amber-100',
    graduation:  'bg-blue-50 text-blue-600 border-blue-100',
    wedding:     'bg-purple-50 text-purple-600 border-purple-100',
};

export default function GreetingCardTemplatesIndex({ templates = [], typeOptions = {} }) {
    const { flash } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [makingDemoId, setMakingDemoId] = useState(null);


    const handleToggle = (id) => {
        setTogglingId(id);
        router.post(`/super-admin/greeting-card-templates/${id}/toggle-active`, {}, {
            onFinish: () => setTogglingId(null),
            preserveScroll: true,
        });
    };

    const handleDelete = (id, name) => {
        if (!confirm(`Hapus template "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        setDeletingId(id);
        router.delete(`/super-admin/greeting-card-templates/${id}`, {
            onFinish: () => setDeletingId(null),
        });
    };

    const handleMakeDemo = (tpl) => {
        setMakingDemoId(tpl.id);
        router.post('/super-admin/greeting-card-templates/make-demo', { slug: tpl.slug }, {
            onSuccess: () => {
                setMakingDemoId(null);
                window.open(`/demo-kartu/${tpl.slug}`, '_blank');
            },
            onError: () => setMakingDemoId(null),
            preserveScroll: true,
        });
    };


    return (
        <SuperAdminLayout title="Template Kartu Ucapan">
            <Head title="Template Kartu Ucapan - Super Admin" />

            <div className="space-y-5">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Template Kartu Ucapan</h2>
                        <p className="text-sm text-[#999] mt-0.5">
                            Kelola template kartu ucapan yang tampil di katalog publik.
                            <span className="ml-1.5 font-semibold text-[#E5654B]">{templates.length} template</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/katalog-kartu"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                        >
                            <Icon d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                            Lihat Katalog
                        </a>
                        <Link
                            href="/super-admin/greeting-card-templates/create"
                            className="inline-flex items-center gap-2 px-5 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                        >
                            <Icon d="M12 4v16m8-8H4" className="w-4 h-4" strokeWidth={2.5} />
                            Tambah Template
                        </Link>
                    </div>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                        <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 flex-shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* ── Empty State ── */}
                {templates.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#E5654B]">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-700 mb-1">Belum ada template</h3>
                        <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
                            Tambahkan template kartu ucapan pertama untuk tampil di katalog publik.
                        </p>
                        <Link
                            href="/super-admin/greeting-card-templates/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5654B] text-white text-sm font-semibold rounded-xl hover:bg-[#c24b33] transition-all shadow-sm"
                        >
                            <Icon d="M12 4v16m8-8H4" className="w-4 h-4" strokeWidth={2.5} />
                            Tambah Template Pertama
                        </Link>
                    </div>
                )}

                {/* ── Templates Grid ── */}
                {templates.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {templates.map(tpl => (
                            <div
                                key={tpl.id}
                                className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col ${
                                    tpl.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
                                }`}
                            >
                                {/* Thumbnail */}
                                <div className={`h-36 relative overflow-hidden flex items-center justify-center ${
                                    tpl.thumbnail ? '' : `bg-gradient-to-br ${tpl.bg_gradient || 'from-gray-900 to-gray-700'}`
                                }`}>
                                    {tpl.thumbnail ? (
                                        <img
                                            src={tpl.thumbnail.startsWith('http') || tpl.thumbnail.startsWith('/') ? tpl.thumbnail : `/storage/${tpl.thumbnail}`}
                                            alt={tpl.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 opacity-20" style={{
                                                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,101,163,0.4) 0%, transparent 60%)'
                                            }} />
                                            <div className="relative text-center">
                                                <div className="mb-2 text-white/70">
                                                    {(() => {
                                                        const IconComp = templateIcons[tpl.slug] || Mail;
                                                        return <IconComp className="w-8 h-8 mx-auto" />;
                                                    })()}
                                                </div>
                                                <div className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.15em]">
                                                    {tpl.slug}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Status badge */}
                                    <div className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                        tpl.is_active
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {tpl.is_active ? 'Aktif' : 'Nonaktif'}
                                    </div>

                                    {/* Sort order badge */}
                                    <div className="absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/30 text-white/80">
                                        #{tpl.sort_order || 0}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 truncate">{tpl.name}</h3>
                                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{tpl.slug}</p>

                                        {/* Types */}
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {(tpl.type || []).map(t => (
                                                <span key={t} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${typeColors[t] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                                    {typeOptions[t] || t}
                                                </span>
                                            ))}
                                        </div>


                                    </div>

                                    {/* Actions */}
                                    <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-gray-50">
                                        {/* Preview Demo */}
                                        <a
                                            href={`/demo-kartu/${tpl.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#E5654B]/10 hover:bg-[#E5654B]/20 text-[#E5654B] text-xs font-semibold rounded-xl transition-all"
                                            title="Buka preview demo"
                                        >
                                            <Icon d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-3.5 h-3.5" />
                                            Demo
                                        </a>
                                        <Link
                                            href={`/super-admin/greeting-card-templates/${tpl.id}/edit`}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
                                        >
                                            <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" className="w-3.5 h-3.5" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleToggle(tpl.id)}
                                            disabled={togglingId === tpl.id}
                                            title={tpl.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            className={`p-2 rounded-xl transition-all disabled:opacity-50 ${
                                                tpl.is_active
                                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                            }`}
                                        >
                                            <Icon d={tpl.is_active
                                                ? 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'
                                                : 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                            } className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tpl.id, tpl.name)}
                                            disabled={deletingId === tpl.id}
                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all disabled:opacity-50"
                                        >
                                            <Icon d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Buat Demo Button */}
                                    <button
                                        onClick={() => handleMakeDemo(tpl)}
                                        disabled={makingDemoId === tpl.id}
                                        className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-semibold rounded-xl transition-all disabled:opacity-60"
                                        title="Buat atau perbarui kartu demo untuk template ini"
                                    >
                                        {makingDemoId === tpl.id ? (
                                            <>
                                                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                                                Membuat demo...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.242 2.022l2.008 1.003M14.25 3.104c.251.023.501.05.75.082M19.5 9.25l-7.5 4.5-7.5-4.5" /></svg>
                                                Buat / Perbarui Demo
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
