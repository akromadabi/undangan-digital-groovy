import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useRef } from 'react';
import axios from 'axios';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

const ICONS = {
    link:      'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
    grid:      'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
    tag:       'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z',
    star:      'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
    chat:      'M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
    phone:     'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
    video:     'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
    globe:     'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    mail:      'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    external:  'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25',
    trash:     'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
    plus:      'M12 4.5v15m7.5-7.5h-15',
    save:      'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z',
    drag:      'M3.75 9h16.5m-16.5 6.75h16.5',
    eye:       'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    eyeOff:    'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88',
    chevronUp: 'M4.5 15.75l7.5-7.5 7.5 7.5',
    chevronDn: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
    pencil:    'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125',
    x:         'M6 18L18 6M6 6l12 12',
    check:     'M4.5 12.75l6 6 9-13.5',
};

// ─── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES = [
    { id: 'modern-glow',   name: 'Modern Glow',    emoji: '✨', desc: 'Glassmorphism dark + neon glow',   preview: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' },
    { id: 'clean-elegant', name: 'Clean Elegant',  emoji: '🤍', desc: 'Soft cream + serif typography',    preview: 'linear-gradient(135deg,#fdf6ec,#f5e9d7)' },
    { id: 'cyberpunk',     name: 'Cyberpunk Tech', emoji: '⚡', desc: 'Neon retro-futuristic dark',       preview: 'linear-gradient(135deg,#0d0d0d,#1a0033)' },
    { id: 'organic-leaf',  name: 'Organic Leaf',   emoji: '🌿', desc: 'Forest sage botanical feel',       preview: 'linear-gradient(135deg,#1a3c34,#2d5a4b)' },
    { id: 'minimal-card',  name: 'Minimal Card',   emoji: '🃏', desc: 'Floating card on blurred gradient', preview: 'linear-gradient(135deg,#667eea,#764ba2)' },
];

// ─── Animations ────────────────────────────────────────────────────────────────
const ANIMATIONS = [
    { id: 'none',    label: 'Statis' },
    { id: 'glow',    label: 'Glow' },
    { id: 'pulse',   label: 'Pulse' },
    { id: 'bounce',  label: 'Bounce' },
    { id: 'shimmer', label: 'Shimmer' },
];

const PREDEFINED_LINKS = [
    { value: '/register', label: 'Daftar Akun Gratis (Register)' },
    { value: '/', label: 'Halaman Utama (Home / Landing Page)' },
    { value: '#themes', label: 'Katalog Tema Undangan' },
    { value: '#plans', label: 'Daftar Harga & Paket' },
    { value: '/faq', label: 'Tanya Jawab (FAQ)' },
    { value: '/login', label: 'Halaman Login' },
    { value: '/buat-kartu', label: 'Buat Kartu Ucapan' },
    { value: 'custom', label: '⚡ URL Kustom (Ketik Manual)' }
];

const ICON_LIST = Object.keys(ICONS).filter(k =>
    !['trash','plus','save','drag','chevronUp','chevronDn','pencil','check','x','eye','eyeOff'].includes(k)
);

// ─── Section Definitions ──────────────────────────────────────────────────────
const SECTION_DEFS = {
    header: {
        name: 'Header',
        icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z',
        variants: [
            { id: 'centered', name: 'Centered',   desc: 'Avatar + nama di tengah' },
            { id: 'split',    name: 'Split',      desc: 'Avatar kiri, teks kanan' },
            { id: 'minimal',  name: 'Minimal',    desc: 'Nama saja tanpa avatar' },
            { id: 'banner',   name: 'Banner',     desc: 'Header bertingkat dengan backdrop' },
        ],
    },
    bio: {
        name: 'Bio / Deskripsi',
        icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12',
        variants: [
            { id: 'simple',      name: 'Simple',      desc: 'Teks biasa, bersih' },
            { id: 'card',        name: 'Card',         desc: 'Teks dalam card frosted' },
            { id: 'highlighted', name: 'Highlighted',  desc: 'Border aksen kiri' },
            { id: 'quote',       name: 'Quote',        desc: 'Gaya kutipan besar' },
        ],
    },
    buttons: {
        name: 'Tombol / Link',
        icon: ICONS.link,
        variants: [
            { id: 'default',  name: 'Default',      desc: 'Full lebar, disusun vertikal' },
            { id: 'grid',     name: 'Grid 2 Kolom', desc: 'Dua kolom berdampingan' },
            { id: 'compact',  name: 'Compact',      desc: 'Lebih kecil dan rapat' },
        ],
    },
    sosmed: {
        name: 'Media Sosial',
        icon: 'M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z',
        variants: [
            { id: 'icon-row', name: 'Icon Row',  desc: 'Ikon bulat berjajar horizontal' },
            { id: 'labeled',  name: 'Labeled',   desc: 'Ikon + nama platform di grid' },
            { id: 'chip',     name: 'Chip',      desc: 'Chip pill dengan nama platform' },
        ],
    },
    footer: {
        name: 'Footer',
        icon: 'M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12',
        variants: [
            { id: 'minimal',   name: 'Minimal',    desc: 'Nama brand saja' },
            { id: 'tagline',   name: 'Tagline',    desc: 'Nama + tagline brand' },
            { id: 'copyright', name: 'Copyright',  desc: '© tahun + nama brand' },
        ],
    },
};

const DEFAULT_SECTIONS = [
    { id: 'header',  type: 'header',  active: true,  order: 0, variant: 'centered' },
    { id: 'bio',     type: 'bio',     active: true,  order: 1, variant: 'simple' },
    { id: 'buttons', type: 'buttons', active: true,  order: 2, variant: 'default' },
    { id: 'sosmed',  type: 'sosmed',  active: true,  order: 3, variant: 'icon-row' },
    { id: 'footer',  type: 'footer',  active: false, order: 4, variant: 'minimal' },
];

// ─── Inline preview helpers ────────────────────────────────────────────────────
function getPreviewBg(template) {
    const map = {
        'clean-elegant': 'linear-gradient(145deg,#fdf6ec,#f5e9d7)',
        'cyberpunk':     'linear-gradient(160deg,#0d0d0d,#1a0033)',
        'organic-leaf':  'linear-gradient(160deg,#1a3c34,#2d5a4b)',
        'minimal-card':  'linear-gradient(135deg,#667eea,#764ba2)',
    };
    return map[template] || 'linear-gradient(160deg,#0f0c29,#302b63,#24243e)';
}

function getPreviewHeading(template) {
    const map = {
        'clean-elegant': 'text-stone-800 font-serif',
        'cyberpunk':     'text-fuchsia-400 font-mono uppercase tracking-wide',
        'organic-leaf':  'text-emerald-100',
        'minimal-card':  'text-white font-extrabold',
    };
    return map[template] || 'text-white font-extrabold';
}

function getPreviewDesc(template) {
    const map = {
        'clean-elegant': 'text-stone-500',
        'cyberpunk':     'text-cyan-300 font-mono',
        'organic-leaf':  'text-emerald-200/80',
        'minimal-card':  'text-white/80',
    };
    return map[template] || 'text-violet-200/80';
}

function getPreviewBtn(template) {
    const map = {
        'clean-elegant': 'bg-white text-stone-700 border border-stone-200',
        'cyberpunk':     'bg-transparent border-2 border-fuchsia-500 text-fuchsia-300 font-mono uppercase text-[9px]',
        'organic-leaf':  'bg-emerald-700/60 text-emerald-100 border border-emerald-400/40 rounded-full',
        'minimal-card':  'bg-white/20 text-white border border-white/30 backdrop-blur',
    };
    return (map[template] || 'bg-white/10 text-white border border-violet-400/30') + ' flex items-center justify-center text-[10px] font-semibold rounded-xl py-2 px-3 w-full';
}

function getPreviewSocial(template) {
    const map = {
        'clean-elegant': 'bg-white border border-stone-200 text-stone-600',
        'cyberpunk':     'bg-fuchsia-900/60 border border-fuchsia-500/50 text-fuchsia-300',
        'organic-leaf':  'bg-emerald-800/50 border border-emerald-500/30',
        'minimal-card':  'bg-white/25 border border-white/40',
    };
    return (map[template] || 'bg-white/10 border border-violet-400/25') + ' w-7 h-7 rounded-full flex items-center justify-center text-xs';
}

function getPreviewAvatarBorder(template) {
    const map = {
        'clean-elegant': 'border-amber-200',
        'cyberpunk':     'border-fuchsia-500',
        'organic-leaf':  'border-emerald-400',
        'minimal-card':  'border-white/70',
    };
    return map[template] || 'border-violet-400';
}

// ─── Live mini preview panel ──────────────────────────────────────────────────
function BioPreview({ config, settings }) {
    const { template = 'modern-glow', buttons = [], social = {}, sections } = config;
    const activeSections = [...(sections || DEFAULT_SECTIONS)]
        .filter(s => s.active)
        .sort((a, b) => a.order - b.order);
    const activeButtons = buttons.filter(b => b.active);
    const socialEntries = Object.entries(social).filter(([, v]) => v);
    const brandLogo = settings?.brand_logo ? `/storage/${settings.brand_logo}` : null;
    const brandName = settings?.brand_name || 'Brand';
    const brandDesc = settings?.site_motto || settings?.footer_description || '';

    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative" style={{ background: getPreviewBg(template) }}>
            {/* Watermark */}
            {brandLogo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                    <img src={brandLogo} alt="" style={{ width: '60%', opacity: 0.06, filter: 'grayscale(1) blur(1px)', transform: 'rotate(-10deg)' }} />
                </div>
            )}
            <div className="relative z-10 flex flex-col items-center w-full px-4 py-5 gap-3">
                {activeSections.map(sec => {
                    if (sec.type === 'header') {
                        if (sec.variant === 'minimal') {
                            return (
                                <div key={sec.id} className="text-center w-full">
                                    <p className={`font-bold text-sm ${getPreviewHeading(template)}`}>{brandName}</p>
                                </div>
                            );
                        }
                        if (sec.variant === 'split') {
                            return (
                                <div key={sec.id} className="flex items-center gap-3 w-full">
                                    <div className={`w-10 h-10 rounded-full border-2 flex-shrink-0 overflow-hidden ${getPreviewAvatarBorder(template)}`}>
                                        {brandLogo
                                            ? <img src={brandLogo} alt="" className="w-full h-full object-cover" />
                                            : <div className="w-full h-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">{brandName[0]}</div>
                                        }
                                    </div>
                                    <p className={`font-bold text-sm ${getPreviewHeading(template)}`}>{brandName}</p>
                                </div>
                            );
                        }
                        if (sec.variant === 'banner') {
                            return (
                                <div key={sec.id} className="w-full flex flex-col items-center relative mb-4">
                                    <div className="w-full h-12 rounded-lg bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 border border-white/5 relative z-0 flex items-center justify-center">
                                        {brandLogo && (
                                            <img src={brandLogo} alt="" className="w-full h-full object-cover opacity-10 filter blur-xs" />
                                        )}
                                    </div>
                                    <div className={`w-10 h-10 rounded-full border-2 overflow-hidden -mt-5 relative z-10 ${getPreviewAvatarBorder(template)}`}>
                                        {brandLogo
                                            ? <img src={brandLogo} alt="" className="w-full h-full object-cover" />
                                            : <div className="w-full h-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">{brandName[0]}</div>
                                        }
                                    </div>
                                    <p className={`font-bold text-sm ${getPreviewHeading(template)} mt-1`}>{brandName}</p>
                                </div>
                            );
                        }
                        return (
                            <div key={sec.id} className="flex flex-col items-center text-center gap-1.5 w-full">
                                <div className={`w-14 h-14 rounded-full border-2 overflow-hidden ${getPreviewAvatarBorder(template)}`}>
                                    {brandLogo
                                        ? <img src={brandLogo} alt="" className="w-full h-full object-cover" />
                                        : <div className="w-full h-full bg-violet-600 flex items-center justify-center text-white text-lg font-bold">{brandName[0]}</div>
                                    }
                                </div>
                                <p className={`font-bold text-sm ${getPreviewHeading(template)}`}>{brandName}</p>
                            </div>
                        );
                    }
                    if (sec.type === 'bio' && brandDesc) {
                        if (sec.variant === 'card') {
                            return (
                                <div key={sec.id} className="w-full rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                                    <p className={`text-[9px] text-center ${getPreviewDesc(template)}`}>{brandDesc.substring(0, 60)}…</p>
                                </div>
                            );
                        }
                        if (sec.variant === 'highlighted') {
                            return (
                                <div key={sec.id} className="w-full border-l-2 pl-2 border-violet-400">
                                    <p className={`text-[9px] ${getPreviewDesc(template)}`}>{brandDesc.substring(0, 60)}…</p>
                                </div>
                            );
                        }
                        if (sec.variant === 'quote') {
                            return (
                                <div key={sec.id} className="w-full text-center relative py-1">
                                    <p className={`text-[9px] italic ${getPreviewDesc(template)}`}>“{brandDesc.substring(0, 50)}…”</p>
                                </div>
                            );
                        }
                        return (
                            <p key={sec.id} className={`text-[9px] text-center ${getPreviewDesc(template)}`}>{brandDesc.substring(0, 60)}…</p>
                        );
                    }
                    if (sec.type === 'buttons' && activeButtons.length > 0) {
                        if (sec.variant === 'grid') {
                            return (
                                <div key={sec.id} className="grid grid-cols-2 gap-1.5 w-full">
                                    {activeButtons.slice(0, 4).map(btn => (
                                        <div key={btn.id} className={getPreviewBtn(template)}>{btn.label?.substring(0, 12)}</div>
                                    ))}
                                </div>
                            );
                        }
                        return (
                            <div key={sec.id} className="flex flex-col gap-1.5 w-full">
                                {activeButtons.slice(0, 3).map(btn => (
                                    <div key={btn.id} className={getPreviewBtn(template)}>{btn.label?.substring(0, 20)}</div>
                                ))}
                            </div>
                        );
                    }
                    if (sec.type === 'sosmed' && socialEntries.length > 0) {
                        if (sec.variant === 'chip') {
                            return (
                                <div key={sec.id} className="flex flex-wrap justify-center gap-1 w-full">
                                    {socialEntries.slice(0, 4).map(([p]) => (
                                        <div key={p} className={getPreviewSocial(template) + ' px-2 rounded-full text-[8px]'}>
                                            {({ whatsapp:'💬', instagram:'📸', tiktok:'🎵', facebook:'f', youtube:'▶', telegram:'✈', email:'📧', website:'🌐' }[p] || '🔗')} {p}
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                        return (
                            <div key={sec.id} className="flex flex-wrap justify-center gap-1.5 w-full">
                                {socialEntries.slice(0, 5).map(([p]) => (
                                    <div key={p} className={getPreviewSocial(template)}>
                                        {({ whatsapp:'💬', instagram:'📸', tiktok:'🎵', facebook:'f', youtube:'▶', telegram:'✈', email:'📧', website:'🌐' }[p] || '🔗')}
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    if (sec.type === 'footer') {
                        return (
                            <div key={sec.id} className={`text-[8px] text-center opacity-40 ${getPreviewHeading(template)}`}>
                                — {brandName} —
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
export default function BioLinkEditor({ settings, bioConfig }) {
    const [config, setConfig] = useState(bioConfig);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('design');
    const [toast, setToast] = useState(null);
    const [activeModalSection, setActiveModalSection] = useState(null);
    const dragIndex = useRef(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

    // ── Sections helpers ──────────────────────────────────────────────────────
    const getSections = () =>
        [...(config.sections || DEFAULT_SECTIONS)].sort((a, b) => a.order - b.order);

    const updateSection = (id, field, value) => {
        const current = config.sections || DEFAULT_SECTIONS;
        updateConfig('sections', current.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    // Drag & Drop (HTML5)
    const handleDragStart = (index) => { dragIndex.current = index; };

    const handleDragOver = (e) => { e.preventDefault(); };

    const handleDrop = (targetIndex) => {
        const sourceIndex = dragIndex.current;
        if (sourceIndex === null || sourceIndex === targetIndex) return;
        const sorted = getSections();
        const [moved] = sorted.splice(sourceIndex, 1);
        sorted.splice(targetIndex, 0, moved);
        updateConfig('sections', sorted.map((s, i) => ({ ...s, order: i })));
        dragIndex.current = null;
    };

    // ── Save ──────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/admin/bio', config, {
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            });
            setSaved(true);
            showToast('Bio link berhasil disimpan! ✅');
            setTimeout(() => setSaved(false), 2500);
        } catch {
            showToast('Gagal menyimpan. Coba lagi.', 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Button helpers ────────────────────────────────────────────────────────
    const addButton = () => {
        const newBtn = { id: Date.now().toString(), label: 'Tombol Baru', url: '', icon: 'link', active: true, animation: 'none' };
        updateConfig('buttons', [...(config.buttons || []), newBtn]);
    };

    const updateButton = (id, field, value) =>
        updateConfig('buttons', (config.buttons || []).map(b => b.id === id ? { ...b, [field]: value } : b));

    const removeButton = (id) =>
        updateConfig('buttons', (config.buttons || []).filter(b => b.id !== id));

    const moveButton = (id, dir) => {
        const btns = [...(config.buttons || [])];
        const idx  = btns.findIndex(b => b.id === id);
        const to   = idx + dir;
        if (to < 0 || to >= btns.length) return;
        [btns[idx], btns[to]] = [btns[to], btns[idx]];
        updateConfig('buttons', btns);
    };

    const updateSocial = (key, value) =>
        updateConfig('social', { ...(config.social || {}), [key]: value });

    const subdomain = settings?.subdomain;
    const publicUrl = subdomain ? `/r/${subdomain}/bio` : null;

    const TABS = [
        { id: 'design',   label: 'Desain',   icon: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z' },
        { id: 'sections', label: 'Section',   icon: 'M9 4.5v15m6-15v15M3.75 4.5v15c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125v-15c0-.621-.504-1.125-1.125-1.125H4.875c-.621 0-1.125.504-1.125 1.125z' },
    ];

    return (
        <AdminLayout title="Bio Link Editor">
            <Head title="Bio Link Editor" />

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {toast.msg}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

                {/* ── Editor Panel ─────────────────────────────────────────── */}
                <div className="xl:col-span-3 flex flex-col gap-4">

                    {/* Header */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0ede8]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-[#1a1a1a]">Bio Link</h2>
                                <p className="text-sm text-[#999] mt-0.5">Kelola halaman bio link reseller kamu</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {publicUrl && (
                                    <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e0ddd8] text-[#555] text-sm hover:bg-[#f5f3f0] transition-colors">
                                        <Icon d={ICONS.external} className="w-4 h-4" />
                                        <span className="hidden sm:inline">Lihat Bio</span>
                                    </a>
                                )}
                                <button onClick={handleSave} disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5654B] text-white text-sm font-semibold hover:bg-[#d4573f] transition-colors disabled:opacity-70 shadow-sm">
                                    <Icon d={ICONS.save} className="w-4 h-4" />
                                    {saving ? 'Menyimpan…' : saved ? 'Tersimpan ✓' : 'Simpan'}
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 mt-4 bg-[#f5f3f0] rounded-xl p-1">
                            {TABS.map(t => (
                                <button key={t.id} onClick={() => setActiveTab(t.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${activeTab === t.id ? 'bg-white text-[#E5654B] shadow-sm' : 'text-[#888] hover:text-[#555]'}`}>
                                    <svg className="w-3.5 h-3.5 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                                    </svg>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0ede8]">

                        {/* ── DESAIN tab ─────────────────────────────────────── */}
                        {activeTab === 'design' && (
                            <div className="space-y-5">
                                <div>
                                    <h3 className="font-semibold text-[#1a1a1a] mb-1">Pilih Template</h3>
                                    <p className="text-xs text-[#999]">Profil & avatar otomatis mengikuti pengaturan brand kamu.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {TEMPLATES.map(t => (
                                        <button key={t.id} onClick={() => updateConfig('template', t.id)}
                                            className={`relative p-3 rounded-xl border-2 text-left transition-all ${config.template === t.id ? 'border-[#E5654B] bg-[#fef2f0]' : 'border-[#e0ddd8] hover:border-[#E5654B]/50 hover:bg-[#fdf9f8]'}`}>
                                            <div className="w-full h-16 rounded-lg mb-2 shadow-inner" style={{ background: t.preview }} />
                                            <div className="text-sm font-semibold text-[#1a1a1a]">{t.emoji} {t.name}</div>
                                            <div className="text-xs text-[#888] mt-0.5">{t.desc}</div>
                                            {config.template === t.id && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E5654B] flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Info box */}
                                <div className="rounded-xl bg-[#f5f3f0] border border-[#e0ddd8] p-4 flex gap-3 items-start">
                                    <span className="text-xl flex-shrink-0">🎨</span>
                                    <div>
                                        <p className="text-xs font-semibold text-[#444]">Background otomatis dari logo brand</p>
                                        <p className="text-xs text-[#999] mt-0.5">Logo brand kamu akan tampil sebagai watermark transparan di belakang konten secara otomatis. Tidak perlu upload background terpisah.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── SECTIONS tab ───────────────────────────────────── */}
                        {activeTab === 'sections' && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-[#1a1a1a]">Struktur & Section</h3>
                                    <p className="text-xs text-[#999] mt-0.5">Tarik ☰ untuk mengurutkan. Pilih variasi per section.</p>
                                </div>

                                <div className="space-y-2">
                                    {getSections().map((section, idx) => {
                                        const def = SECTION_DEFS[section.type];
                                        return (
                                            <div key={section.id}
                                                draggable
                                                onDragStart={() => handleDragStart(idx)}
                                                onDragOver={handleDragOver}
                                                onDrop={() => handleDrop(idx)}
                                                className={`border rounded-xl transition-all ${section.active ? 'border-[#e0ddd8] bg-white' : 'border-dashed border-[#e0ddd8] bg-[#fafaf9] opacity-60'}`}>

                                                {/* Section row */}
                                                <div className="flex items-center gap-3 p-3.5">
                                                    {/* Drag handle */}
                                                    <button className="text-[#ccc] hover:text-[#888] cursor-grab active:cursor-grabbing flex-shrink-0 p-0.5" title="Tarik untuk memindahkan">
                                                        <Icon d={ICONS.drag} className="w-4 h-4" />
                                                    </button>

                                                    {/* Icon */}
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${section.active ? 'bg-[#fef2f0]' : 'bg-[#f5f3f0]'}`}>
                                                        <svg className={`w-4 h-4 ${section.active ? 'text-[#E5654B]' : 'text-[#aaa]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d={def?.icon || ICONS.link} />
                                                        </svg>
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-bold text-[#1a1a1a]">{def?.name || section.type}</div>
                                                        <div className="text-[10px] text-[#999] mt-0.5 capitalize">
                                                            {def?.variants?.find(v => v.id === section.variant)?.name || section.variant}
                                                        </div>
                                                    </div>

                                                    {/* Edit variant button */}
                                                    <button onClick={() => setActiveModalSection(section.id)}
                                                        className="p-1.5 rounded-lg text-[#E5654B] hover:bg-[#fef2f0] transition-colors"
                                                        title="Buka Pengaturan">
                                                        <Icon d={ICONS.pencil} className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Toggle active */}
                                                    <button onClick={() => updateSection(section.id, 'active', !section.active)}
                                                        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${section.active ? 'bg-[#E5654B]' : 'bg-[#ddd]'}`}
                                                        style={{ width: '40px', height: '22px' }}>
                                                        <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${section.active ? 'translate-x-5' : 'translate-x-0.5'}`}
                                                            style={{ width: '18px', height: '18px', top: '2px' }} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Preview Panel ─────────────────────────────────────────── */}
                <div className="xl:col-span-2">
                    <div className="sticky top-20">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0ede8]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-[#1a1a1a] text-sm">Preview Live</h3>
                                {publicUrl && (
                                    <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                                        className="text-xs text-[#E5654B] hover:underline flex items-center gap-1">
                                        <Icon d={ICONS.external} className="w-3 h-3" /> Buka
                                    </a>
                                )}
                            </div>

                            {/* Phone mockup */}
                            <div className="flex justify-center">
                                <div className="relative w-[195px] h-[420px]">
                                    {/* Phone frame */}
                                    <div className="absolute inset-0 bg-zinc-900 rounded-[2.2rem] border-[6px] border-zinc-800 shadow-2xl overflow-hidden">
                                        {/* Dynamic island */}
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-20" />
                                        {/* Screen */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <BioPreview config={config} settings={settings} />
                                        </div>
                                    </div>
                                    {/* Side buttons */}
                                    <div className="absolute right-[-8px] top-20 w-1 h-8 bg-zinc-700 rounded-r" />
                                    <div className="absolute left-[-8px] top-16 w-1 h-6 bg-zinc-700 rounded-l" />
                                    <div className="absolute left-[-8px] top-24 w-1 h-6 bg-zinc-700 rounded-l" />
                                </div>
                            </div>

                            <p className="text-center text-[10px] text-[#bbb] mt-4">Preview real-time — simpan untuk menerapkan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal/Popup Settings ──────────────────────────────────────── */}
            {activeModalSection && (() => {
                const section = getSections().find(s => s.id === activeModalSection);
                if (!section) return null;
                const def = SECTION_DEFS[section.type];
                return (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                        <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#f0ede8] flex flex-col scale-100 transition-all">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ede8]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#fef2f0] flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#E5654B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={def?.icon || ICONS.link} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1a1a1a] text-base">Pengaturan {def?.name || section.type}</h3>
                                        <p className="text-[10px] text-[#999] mt-0.5">Atur variasi tampilan dan konten untuk section ini</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveModalSection(null)} className="p-1.5 rounded-xl hover:bg-[#f5f3f0] text-[#888] hover:text-[#555] transition-colors">
                                    <Icon d={ICONS.x} className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                {/* Variasi Picker (for all sections) */}
                                {def?.variants && (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Pilih Variasi Tampilan</label>
                                        <select
                                            value={section.variant}
                                            onChange={e => updateSection(section.id, 'variant', e.target.value)}
                                            className="w-full border border-[#e0ddd8] bg-white rounded-xl px-3 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#E5654B]/30 focus:border-[#E5654B]"
                                        >
                                            {def.variants.map(v => (
                                                <option key={v.id} value={v.id}>
                                                    {v.name} ({v.desc})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Section-specific manager: Tombol / Link */}
                                {section.type === 'buttons' && (
                                    <div className="space-y-4 pt-4 border-t border-[#f0ede8]">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Kelola Daftar Tombol</label>
                                            <button onClick={addButton}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5654B] text-white text-xs font-semibold hover:bg-[#d4573f] transition-colors shadow-sm">
                                                <Icon d={ICONS.plus} className="w-4 h-4" />
                                                Tambah Tombol
                                            </button>
                                        </div>

                                        {(config.buttons || []).length === 0 ? (
                                            <div className="py-8 text-center text-[#bbb] text-sm border-2 border-dashed border-[#e0ddd8] rounded-2xl bg-[#fafaf9]">
                                                Belum ada tombol. Klik "Tambah Tombol" untuk memulai.
                                            </div>
                                        ) : (
                                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                                {(config.buttons || []).map((btn, idx) => (
                                                    <div key={btn.id} className={`border rounded-xl p-3.5 space-y-2.5 transition-all bg-[#fafaf9] ${btn.active ? 'border-[#e0ddd8]' : 'border-[#f0ede8] opacity-60'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col gap-0.5">
                                                                <button onClick={() => moveButton(btn.id, -1)} disabled={idx === 0}
                                                                    className="p-0.5 text-[#bbb] hover:text-[#555] disabled:opacity-30">
                                                                    <Icon d={ICONS.chevronUp} className="w-3 h-3" />
                                                                </button>
                                                                <button onClick={() => moveButton(btn.id, 1)} disabled={idx === (config.buttons || []).length - 1}
                                                                    className="p-0.5 text-[#bbb] hover:text-[#555] disabled:opacity-30">
                                                                    <Icon d={ICONS.chevronDn} className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <input type="text" value={btn.label} onChange={e => updateButton(btn.id, 'label', e.target.value)}
                                                                placeholder="Label tombol" maxLength={80}
                                                                className="flex-1 border border-[#e0ddd8] bg-white rounded-lg px-2.5 py-1.5 text-xs text-[#1a1a1a] focus:outline-none" />
                                                            <button onClick={() => updateButton(btn.id, 'active', !btn.active)}
                                                                className={`p-1.5 rounded-lg ${btn.active ? 'text-[#E5654B] bg-[#fef2f0]' : 'text-[#bbb]'}`}>
                                                                <Icon d={btn.active ? ICONS.eye : ICONS.eyeOff} className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => removeButton(btn.id)}
                                                                className="p-1.5 rounded-lg text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors">
                                                                <Icon d={ICONS.trash} className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {(() => {
                                                            const isPredefined = PREDEFINED_LINKS.some(opt => opt.value !== 'custom' && opt.value === btn.url);
                                                            const selectValue = isPredefined ? btn.url : 'custom';
                                                            return (
                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-semibold text-[#888] mb-0.5">Tujuan Link</label>
                                                                        <select
                                                                            value={selectValue}
                                                                            onChange={e => {
                                                                                const val = e.target.value;
                                                                                if (val === 'custom') {
                                                                                    updateButton(btn.id, 'url', 'https://');
                                                                                } else {
                                                                                    updateButton(btn.id, 'url', val);
                                                                                }
                                                                            }}
                                                                            className="w-full border border-[#e0ddd8] bg-white rounded-lg px-2 py-1 text-xs text-[#1a1a1a] focus:outline-none"
                                                                        >
                                                                            {PREDEFINED_LINKS.map(opt => (
                                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    {selectValue === 'custom' && (
                                                                        <input
                                                                            type="text"
                                                                            value={btn.url || ''}
                                                                            onChange={e => updateButton(btn.id, 'url', e.target.value)}
                                                                            placeholder="Contoh: https://wa.me/62..."
                                                                            className="w-full border border-[#e0ddd8] bg-white rounded-lg px-2.5 py-1.5 text-xs text-[#1a1a1a] focus:outline-none"
                                                                        />
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}

                                                        <div className="flex gap-2">
                                                            <div className="flex-1">
                                                                <label className="block text-[9px] font-semibold text-[#888] mb-1">Ikon</label>
                                                                <select value={btn.icon || 'link'} onChange={e => updateButton(btn.id, 'icon', e.target.value)}
                                                                    className="w-full border border-[#e0ddd8] bg-white rounded-lg px-2 py-1 text-[10px] text-[#1a1a1a] focus:outline-none">
                                                                    {ICON_LIST.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="block text-[9px] font-semibold text-[#888] mb-1">Animasi</label>
                                                                <select value={btn.animation || 'none'} onChange={e => updateButton(btn.id, 'animation', e.target.value)}
                                                                    className="w-full border border-[#e0ddd8] bg-white rounded-lg px-2 py-1 text-[10px] text-[#1a1a1a] focus:outline-none">
                                                                    {ANIMATIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Section-specific manager: Media Sosial */}
                                {section.type === 'sosmed' && (
                                    <div className="space-y-4 pt-4 border-t border-[#f0ede8]">
                                        <label className="block text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Isi Link Media Sosial</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                                            {[
                                                { key: 'whatsapp',  label: 'WhatsApp',  placeholder: '628123456789', emoji: '💬' },
                                                { key: 'instagram', label: 'Instagram', placeholder: 'username', emoji: '📸' },
                                                { key: 'tiktok',    label: 'TikTok',    placeholder: '@username', emoji: '🎵' },
                                                { key: 'facebook',  label: 'Facebook',  placeholder: 'username', emoji: '👤' },
                                                { key: 'youtube',   label: 'YouTube',   placeholder: '@channel', emoji: '▶️' },
                                                { key: 'telegram',  label: 'Telegram',  placeholder: 'username', emoji: '✈️' },
                                                { key: 'email',     label: 'Email',     placeholder: 'email@domain.com', emoji: '📧' },
                                                { key: 'website',   label: 'Website',   placeholder: 'https://website.com', emoji: '🌐' },
                                            ].map(s => (
                                                <div key={s.key} className="flex items-center gap-3 border border-[#f0ede8] p-2.5 rounded-xl bg-[#fafaf9]">
                                                    <div className="w-8 h-8 rounded-lg bg-[#f5f3f0] flex items-center justify-center text-sm flex-shrink-0">
                                                        {s.emoji}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <label className="block text-[9px] font-semibold text-[#888] mb-0.5">{s.label}</label>
                                                        <input type="text" value={(config.social || {})[s.key] || ''}
                                                            onChange={e => updateSocial(s.key, e.target.value)}
                                                            placeholder={s.placeholder}
                                                            className="w-full border border-[#e0ddd8] bg-white rounded-lg px-2.5 py-1 text-xs text-[#1a1a1a] focus:outline-none" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#f0ede8] bg-[#fafaf9]">
                                <button onClick={() => setActiveModalSection(null)}
                                    className="px-5 py-2.5 rounded-xl bg-[#E5654B] text-white text-sm font-semibold hover:bg-[#d4573f] transition-colors shadow-sm">
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </AdminLayout>
    );
}
