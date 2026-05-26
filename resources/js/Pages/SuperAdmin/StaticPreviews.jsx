import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.8 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);

export default function StaticPreviews() {
    const [activeTab, setActiveTab] = useState('greeting');

    const greetingCards = [
        {
            id: 'cosmicdrift',
            title: 'Cosmic Drift 🌌',
            description: 'Kartu ucapan premium bertema luar angkasa — nebula parallax multi-lapis, konstelasi bintang yang tergambar sendiri, pesan cinta mengambang dari bintang ke bintang, roket peluncuran ke orbit, soundscape deep space dari Web Audio API, dan easter egg shooting star.',
            category: 'Greeting Card',
            status: 'Ready',
            previewUrl: '/cosmicdrift/index.html',
            badges: ['Nebula Parallax', 'Constellation', 'Rocket Launch', 'Space Audio'],
            bgGradient: 'from-[#020817] via-[#0a1628] to-[#050b1a]',
            glowColor: 'shadow-[0_0_25px_rgba(96,165,250,0.15)]',
            borderColor: 'border-[#60a5fa]/30',
        },
        {
            id: 'stillwithyou',
            title: 'Still With You 💗',
            description: 'Kartu ucapan interaktif bertema romantis yang dilengkapi dengan simulasi kembang api modern berbasis HSL, audio synthesizer mandiri (bebas eror IDM), musik latar belakang, ucapan mengapung 3D, serta pendeteksi orientasi kemiringan ponsel.',
            category: 'Greeting Card',
            status: 'Ready',
            previewUrl: '/stillwithyou/index.html',
            badges: ['Interactive', 'HSL Fireworks', 'Browser Synth'],
            bgGradient: 'from-[#0d0915] via-[#1b102b] to-[#09090b]',
            glowColor: 'shadow-[0_0_25px_rgba(255,101,163,0.15)]',
            borderColor: 'border-[#ff65a3]/30',
        },
        {
            id: 'giftforanita',
            title: 'Gift For Anita 🎁',
            description: 'Kartu ucapan interaktif mewah dengan konsep 3D Memory Book yang dapat dibalik secara interaktif, efek hujan huruf menyala (Letter Matrix Rain), gelembung cinta mengambang, serta spanduk pengetikan kata romantis (Typewriter).',
            category: 'Greeting Card',
            status: 'Ready',
            previewUrl: '/giftforanita/index.html',
            badges: ['3D Book Flip', 'Matrix Rain', 'Typewriter'],
            bgGradient: 'from-[#1e050d] via-[#4c1125] to-[#07060a]',
            glowColor: 'shadow-[0_0_25px_rgba(255,77,128,0.15)]',
            borderColor: 'border-[#ff4d80]/30',
        }
    ];

    const invitations = [
        {
            id: 'dusk-mosque',
            title: 'Tema Dusk Mosque 🌙',
            description: 'Template undangan pernikahan Islami premium dengan gradasi warna dusk yang mewah, ornamen kurma, burung merpati, siluet pasangan, kubah masjid keemasan 3D Parallax, hitung mundur, konfirmasi RSVP, buku tamu, kado digital, dan musik latar belakang.',
            category: 'Undangan Pernikahan',
            status: 'Ready',
            previewUrl: '/dusk-mosque/index.html',
            badges: ['3D Parallax', 'Islamic', 'Premium', 'RSVP & Guestbook'],
            bgGradient: 'from-[#2a1f17] via-[#4a3826] to-[#120c08]',
            glowColor: 'shadow-[0_0_25px_rgba(115,91,63,0.15)]',
            borderColor: 'border-[#735b3f]/30',
        },
        {
            id: 'coming_soon_1',
            title: 'Tema Klasik - Elegant Gold',
            description: 'Template undangan pernikahan bertema klasik dengan dominasi warna emas premium, ornamen sulur mewah, dan pembuka amplop lilin segel lilin digital.',
            category: 'Undangan Pernikahan',
            status: 'Segera Hadir',
            badges: ['Elegant', 'Gold', 'Classic'],
            bgGradient: 'from-amber-950/20 via-yellow-950/10 to-stone-900/40',
            glowColor: 'shadow-none',
            borderColor: 'border-dashed border-gray-300',
        },
        {
            id: 'coming_soon_2',
            title: 'Tema Modern - Clean Minimalist',
            description: 'Undangan bergaya minimalis kontemporer yang menekankan pada kekuatan tipografi modis sans-serif, galeri foto grid estetik, dan transisi seksi.',
            category: 'Undangan Pernikahan',
            status: 'Segera Hadir',
            badges: ['Modern', 'Minimalist', 'Clean'],
            bgGradient: 'from-gray-900/10 via-slate-900/5 to-zinc-900/30',
            glowColor: 'shadow-none',
            borderColor: 'border-dashed border-gray-300',
        }
    ];

    return (
        <SuperAdminLayout title="Bahan Statis (Preview)">
            <Head title="Preview Statis - Super Admin" />

            <div className="space-y-6">
                {/* ═══ Header Section ═══ */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#1a1a1a]">Koleksi Bahan Statis</h2>
                            <p className="text-xs text-[#999] mt-1">Wadah uji coba dan pratinjau bahan statis (HTML/CSS/JS) sebelum diintegrasikan secara dinamis ke dalam tema Groovy.</p>
                        </div>
                        <div className="flex items-center gap-1.5 self-start md:self-center bg-[#f5f3f0] p-1 rounded-xl">
                            <span className="text-[11px] font-semibold text-[#666] px-2.5 py-1">Mode Pengembang</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                        </div>
                    </div>
                </div>

                {/* ═══ Navigation Tabs ═══ */}
                <div className="flex border-b border-[#e8e5e0] gap-8">
                    <button
                        onClick={() => setActiveTab('greeting')}
                        className={`pb-4 text-[14.5px] font-semibold transition-all relative ${
                            activeTab === 'greeting' ? 'text-[#E5654B]' : 'text-[#777] hover:text-[#1a1a1a]'
                        }`}
                    >
                        {activeTab === 'greeting' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5654B] rounded-full animate-in fade-in" />
                        )}
                        <span className="flex items-center gap-2">
                            <Icon d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" className="w-4 h-4" />
                            Kartu Ucapan
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
                                activeTab === 'greeting' ? 'bg-[#E5654B]/10 text-[#E5654B]' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {greetingCards.length}
                            </span>
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('invitation')}
                        className={`pb-4 text-[14.5px] font-semibold transition-all relative ${
                            activeTab === 'invitation' ? 'text-[#E5654B]' : 'text-[#777] hover:text-[#1a1a1a]'
                        }`}
                    >
                        {activeTab === 'invitation' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5654B] rounded-full animate-in fade-in" />
                        )}
                        <span className="flex items-center gap-2">
                            <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-4 h-4" />
                            Undangan
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
                                activeTab === 'invitation' ? 'bg-[#E5654B]/10 text-[#E5654B]' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {invitations.length}
                            </span>
                        </span>
                    </button>
                </div>

                {/* ═══ Content Grid ═══ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'greeting' && greetingCards.map(card => (
                        <div
                            key={card.id}
                            className={`bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${card.glowColor}`}
                        >
                            {/* Card Thumbnail Visual (High Premium CSS Decoration) */}
                            <div className={`h-40 bg-gradient-to-br ${card.bgGradient} relative overflow-hidden flex items-center justify-center border-b border-[#e8e5e0] p-4 group`}>
                                {/* Animated glow sparkles and shapes */}
                                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/5 blur-sm" />
                                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-pink-500/10 blur-md group-hover:scale-125 transition-transform duration-1000" />
                                
                                {/* Fireworks aesthetic center visual */}
                                <div className="relative flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-[#ff65a3]/20 flex items-center justify-center border border-[#ff65a3]/40 shadow-[0_0_15px_rgba(255,101,163,0.3)] animate-pulse">
                                        <Icon d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" className="w-6 h-6 text-[#ff65a3] fill-[#ff65a3]" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-[0.2em] mt-3">Interactive Demo</span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold text-[#E5654B] bg-[#E5654B]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {card.category}
                                        </span>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                                            {card.status}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-[#1a1a1a] mt-3">{card.title}</h3>
                                    <p className="text-xs text-[#666] leading-relaxed mt-2 line-clamp-4">{card.description}</p>
                                    
                                    {/* Tech Badges */}
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {card.badges.map(badge => (
                                            <span key={badge} className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview Button */}
                                <div className="border-t border-gray-100 pt-4 mt-5 flex justify-end">
                                    <a
                                        href={card.previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-[#1a1a1a] text-white hover:bg-[#E5654B] hover:shadow-md text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
                                    >
                                        <Icon d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                        Pratinjau
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'invitation' && invitations.map(item => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl border ${item.borderColor} overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${item.glowColor}`}
                        >
                            {/* Card Thumbnail Visual */}
                            <div className={`h-40 bg-gradient-to-br ${item.bgGradient} relative overflow-hidden flex items-center justify-center p-4 border-b border-[#e8e5e0] group`}>
                                {item.status === 'Ready' ? (
                                    <>
                                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/5 blur-sm" />
                                        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-amber-500/10 blur-md group-hover:scale-125 transition-transform duration-1000" />
                                        
                                        {/* Mosque-like visual icon */}
                                        <div className="relative flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
                                                <Icon d="M12 2L2 22h20L12 2zm0 3.99L19.53 19H4.47L12 5.99z" className="w-6 h-6 text-amber-500 fill-amber-500/30" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-white/50 tracking-[0.2em] mt-3">Interactive Demo</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <Icon d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
                                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">Bahan Draft</span>
                                    </div>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                            item.status === 'Ready' ? 'text-[#E5654B] bg-[#E5654B]/10' : 'text-gray-500 bg-gray-100'
                                        }`}>
                                            {item.category}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                            item.status === 'Ready' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <h3 className={`text-base font-bold mt-3 ${item.status === 'Ready' ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>{item.title}</h3>
                                    <p className={`text-xs leading-relaxed mt-2 line-clamp-4 ${item.status === 'Ready' ? 'text-[#666]' : 'text-gray-400'}`}>{item.description}</p>
                                    
                                    {/* Tech Badges */}
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {item.badges.map(badge => (
                                            <span key={badge} className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                                                item.status === 'Ready' ? 'text-gray-500 bg-gray-100' : 'text-gray-300 bg-gray-50'
                                            }`}>
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview Button */}
                                <div className="border-t border-gray-100 pt-4 mt-5 flex justify-end">
                                    {item.status === 'Ready' ? (
                                        <a
                                            href={item.previewUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-[#1a1a1a] text-white hover:bg-[#E5654B] hover:shadow-md text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
                                        >
                                            <Icon d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                            Pratinjau
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="flex items-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200"
                                        >
                                            <Icon d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                            Belum Tersedia
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
