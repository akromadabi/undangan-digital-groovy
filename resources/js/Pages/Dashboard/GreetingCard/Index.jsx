import { Head, Link, router } from '@inertiajs/react';
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
import DashboardLayout from '@/Layouts/DashboardLayout';

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

const templateGradients = {
    stillwithyou:   'from-[#0d0915] via-[#1b102b] to-[#09090b]',
    giftforanita:   'from-[#1e050d] via-[#4c1125] to-[#07060a]',
    oceanbreeze:    'from-[#05161e] via-[#0b2b3c] to-[#040a0f]',
    cosmicdrift:    'from-[#0b0c10] via-[#1f2833] to-[#0b0c10]',
    retroarcade:    'from-[#0f0726] via-[#1a0f3d] to-[#04020d]',
    cyberpunk:      'from-[#030712] via-[#0f172a] to-[#020617]',
    bioluminescent: 'from-[#021526] via-[#033043] to-[#020e17]',
    mysticforest:   'from-[#06130b] via-[#0d1c10] to-[#020704]',
    balloonpop:     'from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]',
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
    balloonpop:     Sparkles,
};

export default function GreetingCardIndex({ cards }) {
    const [deletingId, setDeletingId] = useState(null);
    const [copyId, setCopyId] = useState(null);

    const handleDelete = (id) => {
        if (!confirm('Hapus kartu ucapan ini?')) return;
        setDeletingId(id);
        router.delete(`/greeting-card/${id}`, {
            onFinish: () => setDeletingId(null),
        });
    };

    const handleCopy = (url, id) => {
        navigator.clipboard.writeText(url).then(() => {
            setCopyId(id);
            setTimeout(() => setCopyId(null), 2000);
        });
    };

    return (
        <DashboardLayout title="Kartu Ucapan">
            <Head title="Kartu Ucapan" />

            <div className="space-y-5">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Kartu Ucapan</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Buat dan kelola kartu ucapan interaktif dengan tampilan premium.</p>
                    </div>
                    <Link
                        href="/greeting-card/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5654B] hover:bg-[#c24b33] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                        <Icon d="M12 4v16m8-8H4" className="w-4 h-4" strokeWidth={2.5} />
                        Buat Kartu Baru
                    </Link>
                </div>

                {/* ── Empty State ── */}
                {cards.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#E5654B]">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-700 mb-1">Belum ada kartu ucapan</h3>
                        <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
                            Buat kartu ucapan interaktif premium dengan efek kembang api atau buku 3D flip!
                        </p>
                        <Link
                            href="/greeting-card/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5654B] text-white text-sm font-semibold rounded-xl hover:bg-[#c24b33] transition-all shadow-sm"
                        >
                            <Icon d="M12 4v16m8-8H4" className="w-4 h-4" strokeWidth={2.5} />
                            Buat Kartu Pertama
                        </Link>
                    </div>
                )}

                {/* ── Cards Grid ── */}
                {cards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map(card => (
                            <div
                                key={card.id}
                                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                            >
                                {/* Thumbnail */}
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
                                        <div className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em]">
                                            {card.template_label}
                                        </div>
                                    </div>

                                    {/* Type badge */}
                                    <div className={`absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full border ${typeColors[card.type] || 'bg-gray-100 text-gray-600'}`}>
                                        {card.type_label}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 truncate">{card.title}</h3>
                                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                                            <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-3.5 h-3.5" />
                                            <span>Kepada: <strong className="text-gray-700">{card.recipient_name}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                            <Icon d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" className="w-3.5 h-3.5" />
                                            <span>Dari: <strong className="text-gray-700">{card.sender_name}</strong></span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-2">{card.created_at}</div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 space-y-2">
                                        {/* Share link */}
                                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg p-2">
                                            <Icon d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-6.364-6.364L4.5 8.5" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <span className="text-[10px] text-gray-500 truncate flex-1">/card/{card.custom_url}</span>
                                            <button
                                                onClick={() => handleCopy(card.share_url, card.id)}
                                                className="text-[10px] font-semibold text-[#E5654B] hover:text-[#c24b33] flex-shrink-0 transition-colors"
                                            >
                                                {copyId === card.id ? '✓ Disalin' : 'Salin'}
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <a
                                                href={card.share_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1a1a1a] text-white text-xs font-semibold rounded-xl hover:bg-[#E5654B] transition-all"
                                            >
                                                <Icon d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-3.5 h-3.5" />
                                                Preview
                                            </a>
                                            {card.can_edit ? (
                                                <Link
                                                    href={`/greeting-card/${card.id}/edit`}
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
                                                >
                                                    <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" className="w-3.5 h-3.5" />
                                                    Edit
                                                </Link>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-400 text-xs font-semibold rounded-xl cursor-not-allowed border border-gray-100"
                                                    title="Masa edit telah berakhir (3 hari sejak diaktifkan). Hubungi reseller/admin jika ingin mengubah."
                                                >
                                                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Terkunci
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(card.id)}
                                                disabled={deletingId === card.id}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all disabled:opacity-50"
                                            >
                                                <Icon d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
