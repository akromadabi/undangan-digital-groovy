import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.8 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);

export default function AiPromo({ queues, themes, features, apiToken }) {
    const [activeTab, setActiveTab] = useState('pending');
    const [editingPost, setEditingPost] = useState(null);
    const [showToken, setShowToken] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Form for generating new AI posts
    const { data: genData, setData: setGenData, post: postGen, processing: genProcessing } = useForm({
        count: 7,
        platforms: ['fb', 'ig', 'tiktok'],
        start_date: '',
    });

    // Form for editing an existing post
    const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing } = useForm({
        caption: '',
        scheduled_at: '',
        platforms: [],
        status: 'pending',
    });

    const handleGenerate = (e) => {
        e.preventDefault();
        postGen(route('super-admin.ai-promo.generate'), {
            onSuccess: () => {
                // Reset form or show notification
            }
        });
    };

    const handleEditClick = (post) => {
        setEditingPost(post);
        // Format date to datetime-local input compatibility (YYYY-MM-DDTHH:MM)
        const dateStr = new Date(post.scheduled_at).toISOString().slice(0, 16);
        setEditData({
            caption: post.caption,
            scheduled_at: dateStr,
            platforms: post.platforms || [],
            status: post.status,
        });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        putEdit(route('super-admin.ai-promo.update', editingPost.id), {
            onSuccess: () => setEditingPost(null),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus rencana postingan promosi ini dari antrean?')) {
            router.delete(route('super-admin.ai-promo.destroy', id));
        }
    };

    const handleCopyToken = () => {
        navigator.clipboard.writeText(apiToken);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const togglePlatformSelection = (platform) => {
        const current = [...genData.platforms];
        const index = current.indexOf(platform);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(platform);
        }
        setGenData('platforms', current);
    };

    const toggleEditPlatformSelection = (platform) => {
        const current = [...editData.platforms];
        const index = current.indexOf(platform);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(platform);
        }
        setEditData('platforms', current);
    };

    const getTopicLabel = (type, refKey) => {
        if (type === 'template') {
            const th = themes.find(t => t.slug === refKey);
            return `Template: ${th ? th.name : refKey}`;
        }
        if (type === 'feature') {
            const ft = features.find(f => f.slug === refKey);
            return `Fitur: ${ft ? ft.name : refKey}`;
        }
        if (type === 'reseller') return 'Reseller Opportunity';
        return 'Promosi Platform';
    };

    // Group posts by status for tab counters
    const pendingPosts = queues.data.filter(q => q.status === 'pending' || q.status === 'posting');
    const historyPosts = queues.data.filter(q => q.status === 'posted' || q.status === 'failed');

    return (
        <SuperAdminLayout title="AI Promotion Agent">
            <Head title="AI Promotion - Super Admin" />

            <div className="space-y-6">
                {/* ═══ Header Section ═══ */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl border border-indigo-900 p-6 shadow-md text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    AI Agent Mode
                                </span>
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs text-emerald-400 font-semibold">Active & Secured</span>
                            </div>
                            <h2 className="text-2xl font-bold mt-2">Promosi Otomatis Platform</h2>
                            <p className="text-sm text-indigo-200/80 mt-1 max-w-2xl">
                                Mengotomatiskan kampanye pemasaran web Anda. AI akan merumuskan teks copywriting persuasif (Gemini) dan mengambil screenshot visual secara berkala untuk diposting ke FB, Instagram, dan TikTok via n8n.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="#api-setup"
                                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 transition-all"
                            >
                                API Setup n8n
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ═══ Left Column: Controls & Configuration ═══ */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Generate AI Content Card */}
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 shadow-sm">
                            <h3 className="text-base font-bold text-gray-950 mb-4 flex items-center gap-2">
                                <Icon d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" className="text-[#E5654B] w-5 h-5" />
                                ✨ Generator Postingan AI
                            </h3>

                            <form onSubmit={handleGenerate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Jumlah Postingan (Hari)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="1"
                                            max="14"
                                            value={genData.count}
                                            onChange={e => setGenData('count', parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E5654B]"
                                        />
                                        <span className="text-sm font-bold bg-[#E5654B]/10 text-[#E5654B] px-3 py-1 rounded-full w-12 text-center">
                                            {genData.count}d
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Target Media Sosial
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['fb', 'ig', 'tiktok'].map(plat => (
                                            <button
                                                key={plat}
                                                type="button"
                                                onClick={() => togglePlatformSelection(plat)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all uppercase ${
                                                    genData.platforms.includes(plat)
                                                        ? 'bg-[#E5654B] text-white border-[#E5654B] shadow-sm'
                                                        : 'bg-white text-gray-600 border-[#e8e5e0] hover:bg-gray-50'
                                                }`}
                                            >
                                                {plat === 'fb' ? 'Facebook' : plat === 'ig' ? 'Instagram' : 'TikTok'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Tanggal Awal Postingan (Opsional)
                                    </label>
                                    <input
                                        type="date"
                                        value={genData.start_date}
                                        onChange={e => setGenData('start_date', e.target.value)}
                                        className="w-full bg-white border border-[#e8e5e0] rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-[#E5654B]"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Secara default akan menjadwalkan otomatis setelah postingan terakhir.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={genProcessing || genData.platforms.length === 0}
                                    className="w-full bg-[#E5654B] text-white hover:bg-[#d4543a] disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    {genProcessing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Membuat Konten & Screenshot...
                                        </>
                                    ) : (
                                        <>
                                            <Icon d="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4" />
                                            Buat Antrean Promosi AI
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Integration Settings Card */}
                        <div id="api-setup" className="bg-white rounded-2xl border border-[#e8e5e0] p-6 shadow-sm">
                            <h3 className="text-base font-bold text-gray-950 mb-3 flex items-center gap-2">
                                <Icon d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.905 0-5.64-.783-8.006-2.148M12 10.5a11.953 11.953 0 018.157-2.148M12 10.5a11.953 11.953 0 00-8.157-2.148" className="text-indigo-600 w-5 h-5" />
                                🔗 Pengaturan API n8n
                            </h3>
                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                Gunakan URL berikut di n8n untuk mengintegrasikan pengunggahan terjadwal otomatis.
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Token Rahasia</span>
                                    <div className="flex items-center gap-1 mt-1 bg-gray-50 border border-gray-100 p-2 rounded-xl">
                                        <input
                                            type={showToken ? 'text' : 'password'}
                                            readOnly
                                            value={apiToken}
                                            className="bg-transparent border-none text-xs text-gray-700 w-full focus:outline-none focus:ring-0 font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowToken(!showToken)}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                            title="Tampilkan Token"
                                        >
                                            <Icon d={showToken ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" : "M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"} className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCopyToken}
                                            className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                                                isCopied ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {isCopied ? 'Tersalin' : 'Salin'}
                                        </button>
                                    </div>
                                </div>

                                <div className="text-[11px] text-gray-600 space-y-2 border-t border-gray-100 pt-3">
                                    <div>
                                        <span className="font-bold text-gray-700 block">1. Fetch Postingan Terjadwal</span>
                                        <code className="block bg-gray-50 p-1 rounded border border-gray-100 text-[9px] font-mono break-all text-indigo-700 select-all">
                                            {window.location.origin}/api/admin/ai-promo/next?token={apiToken}
                                        </code>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-700 block">2. Tandai Sukses Post</span>
                                        <code className="block bg-gray-50 p-1 rounded border border-gray-100 text-[9px] font-mono break-all text-indigo-700 select-all">
                                            {window.location.origin}/api/admin/ai-promo/&#123;id&#125;/success?token={apiToken}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {/* Gemini status reminder */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mt-4 text-[11px] text-amber-800 leading-relaxed">
                                <span className="font-bold block">💡 Info Pengaturan AI:</span>
                                Jika <code>GEMINI_API_KEY</code> belum dipasang di file <code>.env</code>, sistem akan otomatis menggunakan template copy manual bawaan agar sistem tidak eror saat diuji.
                            </div>
                        </div>
                    </div>

                    {/* ═══ Right Column: Queue & History Lists ═══ */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Tab Switcher */}
                        <div className="flex border-b border-[#e8e5e0] gap-8">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`pb-4 text-[14.5px] font-semibold transition-all relative ${
                                    activeTab === 'pending' ? 'text-[#E5654B]' : 'text-[#777] hover:text-[#1a1a1a]'
                                }`}
                            >
                                {activeTab === 'pending' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5654B] rounded-full" />
                                )}
                                <span className="flex items-center gap-2">
                                    <Icon d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                                    Antrean Postingan
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
                                        activeTab === 'pending' ? 'bg-[#E5654B]/10 text-[#E5654B]' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {pendingPosts.length}
                                    </span>
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab('history')}
                                className={`pb-4 text-[14.5px] font-semibold transition-all relative ${
                                    activeTab === 'history' ? 'text-[#E5654B]' : 'text-[#777] hover:text-[#1a1a1a]'
                                }`}
                            >
                                {activeTab === 'history' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5654B] rounded-full" />
                                )}
                                <span className="flex items-center gap-2">
                                    <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" className="w-4 h-4" />
                                    Riwayat Publikasi
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
                                        activeTab === 'history' ? 'bg-[#E5654B]/10 text-[#E5654B]' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {historyPosts.length}
                                    </span>
                                </span>
                            </button>
                        </div>

                        {/* List rendering */}
                        <div className="space-y-4">
                            {activeTab === 'pending' ? (
                                pendingPosts.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-12 text-center text-gray-400">
                                        <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm font-semibold">Tidak ada postingan dalam antrean.</p>
                                        <p className="text-xs mt-1">Gunakan Generator AI di kolom sebelah kiri untuk membuat postingan baru.</p>
                                    </div>
                                ) : (
                                    pendingPosts.map(post => (
                                        <div key={post.id} className="bg-white rounded-2xl border border-[#e8e5e0] p-5 shadow-sm hover:shadow transition-shadow flex flex-col md:flex-row gap-5">
                                            {/* Image Preview */}
                                            <div className="w-full md:w-36 h-48 md:h-36 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 relative group">
                                                {post.image_path ? (
                                                    <img
                                                        src={`/storage/${post.image_path}`}
                                                        alt="Visual capture"
                                                        className="w-full h-full object-cover object-top"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                                                        <Icon d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" className="w-6 h-6 mb-1 opacity-50" />
                                                        No Image
                                                    </div>
                                                )}
                                                {post.status === 'posting' && (
                                                    <div className="absolute inset-0 bg-indigo-950/70 flex flex-col items-center justify-center text-white text-[10px] font-bold">
                                                        <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-ping mb-1.5" />
                                                        SEDANG DIPOSTING...
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-gray-800">
                                                                {getTopicLabel(post.type, post.reference_key)}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">•</span>
                                                            <span className="text-[11px] font-medium text-gray-500">
                                                                🕒 {new Date(post.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {post.platforms && post.platforms.map(plat => (
                                                                <span key={plat} className="text-[9px] font-bold bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded uppercase">
                                                                    {plat}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed mt-3 max-h-24 overflow-y-auto">
                                                        {post.caption}
                                                    </p>
                                                </div>

                                                <div className="border-t border-gray-50 pt-3 mt-4 flex items-center justify-between">
                                                    <span className={`text-[10px] font-bold uppercase ${
                                                        post.status === 'posting' ? 'text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full' : 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full'
                                                    }`}>
                                                        {post.status}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(post)}
                                                            className="flex items-center gap-1 text-[#E5654B] hover:bg-[#E5654B]/5 border border-transparent hover:border-[#E5654B]/20 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                                                        >
                                                            <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-3.5 h-3.5" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="flex items-center gap-1 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                                                        >
                                                            <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" />
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            ) : (
                                historyPosts.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-12 text-center text-gray-400">
                                        <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm font-semibold">Tidak ada riwayat publikasi.</p>
                                        <p className="text-xs mt-1">Postingan yang dikirim oleh n8n akan tercatat di tab ini.</p>
                                    </div>
                                ) : (
                                    historyPosts.map(post => (
                                        <div key={post.id} className="bg-white rounded-2xl border border-[#e8e5e0] p-5 shadow-sm hover:shadow transition-shadow flex flex-col md:flex-row gap-5">
                                            {/* Image Preview */}
                                            <div className="w-full md:w-32 h-44 md:h-32 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                {post.image_path ? (
                                                    <img
                                                        src={`/storage/${post.image_path}`}
                                                        alt="Visual capture"
                                                        className="w-full h-full object-cover object-top"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-gray-800">
                                                                {getTopicLabel(post.type, post.reference_key)}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">•</span>
                                                            <span className="text-[11px] font-medium text-gray-500">
                                                                📅 {post.posted_at ? new Date(post.posted_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : new Date(post.scheduled_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {post.platforms && post.platforms.map(plat => (
                                                                <span key={plat} className="text-[9px] font-bold bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded uppercase">
                                                                    {plat}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed mt-3 max-h-24 overflow-y-auto">
                                                        {post.caption}
                                                    </p>

                                                    {/* Error Message if failed */}
                                                    {post.status === 'failed' && post.error_message && (
                                                        <div className="bg-red-50 border border-red-150 rounded-xl p-3.5 mt-3 text-[11px] text-red-800 font-mono">
                                                            <strong>⚠️ Error:</strong> {post.error_message}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="border-t border-gray-50 pt-3 mt-4 flex items-center justify-between">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                        post.status === 'posted' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                                                    }`}>
                                                        {post.status === 'posted' ? '✓ Berhasil' : '✗ Gagal'}
                                                    </span>
                                                    
                                                    {/* Post Link details from n8n */}
                                                    {post.status === 'posted' && post.post_links && Object.keys(post.post_links).length > 0 && (
                                                        <div className="flex gap-2">
                                                            {Object.entries(post.post_links).map(([platform, link]) => (
                                                                <a
                                                                    key={platform}
                                                                    href={link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs font-bold text-[#E5654B] hover:underline flex items-center gap-0.5"
                                                                >
                                                                    Lihat {platform.toUpperCase()} ↗
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}

                            {/* Pagination info */}
                            {queues.links && queues.data.length > 0 && (
                                <div className="flex justify-between items-center bg-white border border-[#e8e5e0] p-4 rounded-2xl shadow-sm text-xs text-gray-500">
                                    <span>Menampilkan {queues.from} - {queues.to} dari {queues.total} postingan</span>
                                    <div className="flex gap-1.5">
                                        {queues.links.map((link, idx) => (
                                            <button
                                                key={idx}
                                                disabled={!link.url || link.active}
                                                onClick={() => router.get(link.url)}
                                                className={`px-3 py-1.5 rounded-xl border text-xs transition-colors ${
                                                    link.active
                                                        ? 'bg-[#E5654B] text-white border-[#E5654B] font-bold'
                                                        : link.url
                                                            ? 'bg-white text-gray-700 border-[#e8e5e0] hover:bg-gray-50'
                                                            : 'bg-gray-50 text-gray-300 border-[#e8e5e0] cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Edit Post Modal ═══ */}
            {editingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gray-50 border-b border-[#e8e5e0] p-5 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900">Edit Rencana Postingan</h3>
                            <button
                                type="button"
                                onClick={() => setEditingPost(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <Icon d="M6 18L18 6M6 6l12 12" className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Topik Promosi</span>
                                    <span className="text-sm font-semibold text-gray-800 block mt-1">
                                        {getTopicLabel(editingPost.type, editingPost.reference_key)}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Isi Caption Copywriting (AI)
                                    </label>
                                    <textarea
                                        rows="6"
                                        value={editData.caption}
                                        onChange={e => setEditData('caption', e.target.value)}
                                        className="w-full bg-white border border-[#e8e5e0] rounded-xl text-xs p-3.5 focus:outline-none focus:border-[#E5654B] leading-relaxed"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                            Waktu Publikasi Terjadwal
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={editData.scheduled_at}
                                            onChange={e => setEditData('scheduled_at', e.target.value)}
                                            className="w-full bg-white border border-[#e8e5e0] rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-[#E5654B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                            Status Postingan
                                        </label>
                                        <select
                                            value={editData.status}
                                            onChange={e => setEditData('status', e.target.value)}
                                            className="w-full bg-white border border-[#e8e5e0] rounded-xl text-xs px-3 py-2.5 focus:outline-none focus:border-[#E5654B]"
                                        >
                                            <option value="pending">Pending (Dalam Antrean)</option>
                                            <option value="posting">Posting (Sedang Diproses)</option>
                                            <option value="posted">Posted (Sudah Tayang)</option>
                                            <option value="failed">Failed (Gagal Tayang)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Target Platform
                                    </label>
                                    <div className="flex gap-2">
                                        {['fb', 'ig', 'tiktok'].map(plat => (
                                            <button
                                                key={plat}
                                                type="button"
                                                onClick={() => toggleEditPlatformSelection(plat)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all uppercase ${
                                                    editData.platforms.includes(plat)
                                                        ? 'bg-[#E5654B] text-white border-[#E5654B] shadow-sm'
                                                        : 'bg-white text-gray-600 border-[#e8e5e0] hover:bg-gray-50'
                                                }`}
                                            >
                                                {plat === 'fb' ? 'Facebook' : plat === 'ig' ? 'Instagram' : 'TikTok'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50 border-t border-[#e8e5e0] p-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                    className="bg-white hover:bg-gray-50 text-gray-700 border border-[#e8e5e0] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing || editData.platforms.length === 0}
                                    className="bg-[#E5654B] hover:bg-[#d4543a] disabled:bg-gray-300 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow transition-colors"
                                >
                                    {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
