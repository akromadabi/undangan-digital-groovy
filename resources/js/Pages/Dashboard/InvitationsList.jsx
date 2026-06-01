import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
    Heart, Cake, Award, Baby, Shield, Calendar, Plus, 
    ExternalLink, Settings, CheckCircle, Mail, Copy, 
    Check, Trash2, Eye, Edit3, Sparkles, Gift, Waves, 
    Gamepad2, Cpu, Lightbulb, TreePine
} from 'lucide-react';

const typeColors = {
    anniversary: 'bg-pink-50 text-pink-600 border-pink-100',
    birthday:    'bg-amber-50 text-amber-600 border-amber-100',
    graduation:  'bg-blue-50 text-blue-600 border-blue-100',
    wedding:     'bg-purple-50 text-purple-600 border-purple-100',
};

const templateGradients = {
    stillwithyou: 'from-[#0d0915] via-[#1b102b] to-[#09090b]',
    giftforanita:  'from-[#1e050d] via-[#4c1125] to-[#07060a]',
    oceanbreeze:   'from-[#05161e] via-[#0b2b3c] to-[#040a0f]',
    cosmicdrift:   'from-[#0b0c10] via-[#1f2833] to-[#0b0c10]',
    retroarcade:   'from-[#0f0726] via-[#1a0f3d] to-[#04020d]',
    cyberpunk:     'from-[#030712] via-[#0f172a] to-[#020617]',
    bioluminescent: 'from-[#021526] via-[#033043] to-[#020e17]',
    mysticforest:  'from-[#06130b] via-[#0d1c10] to-[#020704]',
};

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

export default function InvitationsList({ invitations, activeInvitationId, greetingCards = [], initialTab = 'invitations' }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deletingCardId, setDeletingCardId] = useState(null);
    const [copyCardId, setCopyCardId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'wedding',
        title: '',
    });

    const eventIcons = {
        wedding: <Heart className="w-5 h-5 text-red-500" />,
        birthday: <Cake className="w-5 h-5 text-orange-500" />,
        graduation: <Award className="w-5 h-5 text-blue-500" />,
        aqiqah: <Baby className="w-5 h-5 text-purple-500" />,
        circumcision: <Shield className="w-5 h-5 text-emerald-500" />,
        anniversary: <Calendar className="w-5 h-5 text-pink-500" />,
    };

    const eventLabels = {
        wedding: 'Pernikahan',
        birthday: 'Ulang Tahun',
        graduation: 'Wisuda',
        aqiqah: 'Aqiqah',
        circumcision: 'Sunatan',
        anniversary: 'Anniversary',
    };

    const handleSelect = (id) => {
        router.post(route('dashboard.invitations.select', id));
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post(route('dashboard.invitations.create'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            }
        });
    };

    const handleDeleteCard = (id) => {
        if (!confirm('Hapus kartu ucapan ini?')) return;
        setDeletingCardId(id);
        router.delete(`/greeting-card/${id}`, {
            onFinish: () => setDeletingCardId(null),
        });
    };

    const handleCopyCard = (url, id) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopyCardId(id);
            setTimeout(() => setCopyCardId(null), 2000);
        });
    };

    return (
        <DashboardLayout title="Undangan Saya">
            <Head title="Undangan Saya" />

            <div className="space-y-6 max-w-5xl mx-auto">
                {/* ═══ Header Section ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {activeTab === 'invitations' ? 'Daftar Undangan Digital' : 'Daftar Kartu Ucapan'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {activeTab === 'invitations' 
                                ? 'Kelola semua undangan digital Anda dari satu akun pengelola.' 
                                : 'Buat dan kelola kartu ucapan interaktif premium dengan musik dan animasi.'}
                        </p>
                    </div>
                    {activeTab === 'invitations' ? (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 self-start sm:self-auto animate-in fade-in duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Buat Undangan Baru
                        </button>
                    ) : (
                        <Link
                            href="/greeting-card/create"
                            className="px-5 py-2.5 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 self-start sm:self-auto animate-in fade-in duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Buat Kartu Baru
                        </Link>
                    )}
                </div>

                {/* ═══ Tab Navigation ═══ */}
                <div className="flex border-b border-gray-100 pb-px">
                    <button
                        onClick={() => setActiveTab('invitations')}
                        className={`pb-3 text-sm font-semibold relative transition-all px-4 ${
                            activeTab === 'invitations'
                                ? 'text-[#E5654B]'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Undangan Digital
                        </span>
                        {activeTab === 'invitations' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5654B] rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('cards')}
                        className={`pb-3 text-sm font-semibold relative transition-all px-4 ${
                            activeTab === 'cards'
                                ? 'text-[#E5654B]'
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Kartu Ucapan
                        </span>
                        {activeTab === 'cards' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5654B] rounded-full" />
                        )}
                    </button>
                </div>

                {/* ═══ Tab Content: Invitations ═══ */}
                {activeTab === 'invitations' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                        {invitations.map((inv) => {
                            const isActive = inv.id === activeInvitationId;
                            const isFree = !inv.active_subscription;
                            const planName = inv.active_subscription?.plan?.name || 'Free';
                            const planColor = isFree ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-[#E5654B] border border-orange-100';

                            return (
                                <div
                                    key={inv.id}
                                    className={`bg-white rounded-2xl border transition-all relative overflow-hidden ${
                                        isActive
                                            ? 'border-[#E5654B] shadow-md shadow-orange-50'
                                            : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute top-0 right-0 bg-[#E5654B] text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Sedang Dikelola
                                        </div>
                                    )}

                                    <div className="p-5 space-y-4">
                                        {/* Icon & Plan Badge */}
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                                {eventIcons[inv.type] || <Calendar className="w-5 h-5 text-gray-500" />}
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${planColor}`}>
                                                Paket {planName}
                                            </span>
                                        </div>

                                        {/* Title & Slug */}
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-base line-clamp-1">{inv.title}</h3>
                                            <div className="text-xs text-gray-400 font-medium mt-0.5">Tipe Acara: {eventLabels[inv.type] || inv.type}</div>
                                            <a
                                                href={`/u/${inv.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-[#E5654B] hover:text-[#c24b33] hover:underline font-medium mt-2 inline-flex items-center gap-1"
                                            >
                                                {window.location.origin}/u/{inv.slug}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                            {isActive ? (
                                                <Link
                                                    href="/dashboard"
                                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#E5654B] to-[#c24b33] hover:shadow-md text-white rounded-lg text-xs font-semibold text-center transition-all inline-flex items-center justify-center gap-1.5"
                                                >
                                                    <Settings className="w-3.5 h-3.5" />
                                                    Edit Konten & Desain
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => handleSelect(inv.id)}
                                                    className="flex-1 px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold text-center transition-all inline-flex items-center justify-center gap-1.5"
                                                >
                                                    Kelola Undangan Ini
                                                </button>
                                            )}
                                            <a
                                                href={`/u/${inv.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-2 border border-gray-150 hover:bg-gray-50 text-gray-600 rounded-lg transition-all inline-flex items-center justify-center"
                                                title="Buka Undangan"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══ Tab Content: Greeting Cards ═══ */}
                {activeTab === 'cards' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {greetingCards.length === 0 ? (
                            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#E5654B]">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-700 mb-1 font-outfit">Belum ada kartu ucapan</h3>
                                <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
                                    Buat kartu ucapan interaktif premium dengan efek kembang api atau buku 3D flip!
                                </p>
                                <Link
                                    href="/greeting-card/create"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Buat Kartu Pertama
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {greetingCards.map(card => (
                                    <div
                                        key={card.id}
                                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                                    >
                                        {/* Thumbnail / Theme representation */}
                                        <div className={`h-32 bg-gradient-to-br ${templateGradients[card.template] || 'from-gray-900 to-gray-700'} relative overflow-hidden flex items-center justify-center`}>
                                            <div className="absolute inset-0 opacity-20" style={{
                                                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,101,163,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 20%, rgba(180,60,120,0.3) 0%, transparent 50%)'
                                            }} />
                                            <div className="relative text-center">
                                                <div className="mb-2 text-white/70">
                                                    {(() => {
                                                        const IconComp = templateIcons[card.template] || Mail;
                                                        return <IconComp className="w-8 h-8 mx-auto" />;
                                                    })()}
                                                </div>
                                                <div className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em] font-mono">
                                                    {card.template_label}
                                                </div>
                                            </div>

                                            {/* Type badge */}
                                            <div className={`absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full border ${typeColors[card.type] || 'bg-gray-100 text-gray-600'}`}>
                                                {card.type_label}
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-1.5">
                                                <h3 className="text-sm font-bold text-gray-800 truncate" title={card.title}>{card.title}</h3>
                                                <div className="text-xs text-gray-500 font-medium">
                                                    Kepada: <strong className="text-gray-700 font-semibold">{card.recipient_name}</strong>
                                                </div>
                                                <div className="text-xs text-gray-500 font-medium">
                                                    Dari: <strong className="text-gray-700 font-semibold">{card.sender_name}</strong>
                                                </div>
                                                <div className="text-[10px] text-gray-400">{card.created_at}</div>
                                            </div>

                                            {/* Actions */}
                                            <div className="space-y-2">
                                                {/* Share Link Input-like box */}
                                                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-150/60 rounded-lg p-2">
                                                    <span className="text-[10px] text-gray-500 truncate flex-1">/card/{card.custom_url}</span>
                                                    <button
                                                        onClick={() => handleCopyCard(card.share_url, card.id)}
                                                        className="text-[10px] font-bold text-[#E5654B] hover:text-[#c24b33] flex-shrink-0 transition-colors inline-flex items-center gap-0.5"
                                                    >
                                                        {copyCardId === card.id ? (
                                                            <>
                                                                <Check className="w-3 h-3" />
                                                                Disalin
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-3 h-3" />
                                                                Salin
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="flex gap-2">
                                                    <a
                                                        href={card.share_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-white text-xs font-semibold rounded-xl hover:bg-[#E5654B] transition-all"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Preview
                                                    </a>
                                                    <Link
                                                        href={`/greeting-card/${card.id}/edit`}
                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteCard(card.id)}
                                                        disabled={deletingCardId === card.id}
                                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all disabled:opacity-50 inline-flex items-center justify-center"
                                                        title="Hapus Kartu"
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
                )}

                {/* ═══ Modal Create ═══ */}
                {showCreateModal && createPortal(
                    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Buat Undangan Baru</h3>
                            <p className="text-xs text-gray-500 mb-4">Mulai rancang undangan digital Anda secara instan.</p>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Nama / Judul Acara</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Wisuda S1 Budi / Ultah Ara ke-5"
                                        className="w-full text-sm border-gray-200 focus:border-[#E5654B] focus:ring-[#E5654B] rounded-xl px-4 py-2.5 transition-all"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title}</p>}
                                </div>

                                {/* Type Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Kategori Acara</label>
                                    <select
                                        className="w-full text-sm border-gray-200 focus:border-[#E5654B] focus:ring-[#E5654B] rounded-xl px-4 py-2.5 transition-all"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        required
                                    >
                                        <option value="wedding">Pernikahan (Wedding)</option>
                                        <option value="birthday">Ulang Tahun (Birthday)</option>
                                        <option value="graduation">Wisuda (Graduation)</option>
                                        <option value="aqiqah">Aqiqah</option>
                                        <option value="circumcision">Sunatan (Khitanan)</option>
                                        <option value="anniversary">Anniversary / Syukuran</option>
                                    </select>
                                    {errors.type && <p className="text-red-500 text-[10px] mt-1">{errors.type}</p>}
                                </div>

                                {/* Modal Actions */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-xl transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white text-xs font-semibold rounded-xl hover:shadow-lg transition-all"
                                    >
                                        {processing ? 'Menyimpan...' : 'Mulai Buat'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </DashboardLayout>
    );
}
