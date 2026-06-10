import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// ─── Default Section definition ────────────────────────────────────────────────
const DEFAULT_SECTIONS = [
    { id: 'header',  type: 'header',  active: true,  order: 0, variant: 'centered' },
    { id: 'bio',     type: 'bio',     active: true,  order: 1, variant: 'simple' },
    { id: 'buttons', type: 'buttons', active: true,  order: 2, variant: 'default' },
    { id: 'sosmed',  type: 'sosmed',  active: true,  order: 3, variant: 'icon-row' },
    { id: 'footer',  type: 'footer',  active: false, order: 4, variant: 'minimal' },
];

// ─── Themes & Styles System ───────────────────────────────────────────────────
const THEMES = {
    'modern-glow': {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        font: 'font-sans',
        textTitle: 'text-white font-extrabold tracking-tight drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]',
        textBody: 'text-violet-200/80',
        avatarBorder: 'border-2 border-violet-400/60 shadow-[0_0_30px_rgba(167,139,250,0.4)] ring-4 ring-violet-500/20',
        cardBg: 'bg-white/5 border border-violet-400/20 backdrop-blur-md',
        btnBase: 'bg-white/10 text-white border border-violet-400/30 backdrop-blur-sm rounded-2xl hover:shadow-[0_0_15px_rgba(167,139,250,0.4)]',
        btnPrimary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none rounded-2xl hover:shadow-[0_0_20px_rgba(167,139,250,0.6)]',
        socialIcon: 'bg-white/5 border border-violet-400/25 text-violet-200 hover:shadow-[0_0_15px_rgba(167,139,250,0.5)]',
        accentBorder: 'border-violet-400',
    },
    'clean-elegant': {
        bg: 'linear-gradient(135deg, #07090b 0%, #15181c 50%, #07090b 100%)',
        font: 'font-serif',
        textTitle: 'text-amber-100 font-bold tracking-tight drop-shadow-md',
        textBody: 'text-stone-400 font-sans',
        avatarBorder: 'border-4 border-amber-500/80 shadow-xl ring-4 ring-amber-500/10',
        cardBg: 'bg-stone-900/60 border border-stone-800/80 shadow-md rounded-2xl',
        btnBase: 'bg-stone-900 text-stone-200 border border-stone-700/80 rounded-xl hover:border-amber-500/50 hover:text-amber-400',
        btnPrimary: 'bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 text-stone-900 font-bold border-none rounded-xl hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]',
        socialIcon: 'bg-stone-900 border border-stone-800 text-stone-400 hover:border-amber-500/50 hover:text-amber-400 shadow-sm rounded-xl',
        accentBorder: 'border-amber-500',
    },
    'cyberpunk': {
        bg: 'linear-gradient(160deg, #0d0d0d 0%, #1a0033 50%, #0d0d0d 100%)',
        font: 'font-mono uppercase tracking-wide',
        textTitle: 'text-fuchsia-400 font-black tracking-widest neon-text',
        textBody: 'text-cyan-300/80 tracking-normal normal-case font-mono',
        avatarBorder: 'border-2 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]',
        cardBg: 'bg-black/60 border border-cyan-500/30 backdrop-blur-md rounded-none',
        btnBase: 'bg-transparent border-2 border-cyan-400 text-cyan-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.4)] rounded-none',
        btnPrimary: 'bg-transparent border-2 border-fuchsia-500 text-fuchsia-400 hover:shadow-[0_0_10px_rgba(255,0,222,0.4)] rounded-none',
        socialIcon: 'bg-cyan-950/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] rounded-none',
        accentBorder: 'border-fuchsia-500',
    },
    'organic-leaf': {
        bg: 'linear-gradient(135deg, #051a11 0%, #0c3624 50%, #051a11 100%)',
        font: 'font-sans',
        textTitle: 'text-emerald-100 font-bold tracking-tight',
        textBody: 'text-emerald-200/70',
        avatarBorder: 'border-4 border-emerald-400/40 shadow-2xl ring-8 ring-emerald-800/30',
        cardBg: 'bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-md rounded-2xl',
        btnBase: 'bg-white/10 text-emerald-100 border border-emerald-500/30 backdrop-blur-sm rounded-full hover:bg-white/20',
        btnPrimary: 'bg-emerald-400 text-emerald-950 border border-emerald-300/50 rounded-full hover:bg-emerald-300 shadow-lg shadow-emerald-950/20',
        socialIcon: 'bg-white/10 border border-emerald-500/30 text-emerald-200 hover:bg-white/25 rounded-full',
        accentBorder: 'border-emerald-400',
    },
    'minimal-card': {
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        font: 'font-sans',
        textTitle: 'text-white font-extrabold tracking-tight drop-shadow-md',
        textBody: 'text-white/80',
        avatarBorder: 'border-4 border-white/60 shadow-xl',
        cardBg: 'bg-white/15 border border-white/30 backdrop-blur-md rounded-3xl shadow-2xl',
        btnBase: 'bg-white/15 text-white border border-white/40 backdrop-blur-sm rounded-xl hover:bg-white/25',
        btnPrimary: 'bg-white text-violet-700 shadow-lg border-none rounded-xl hover:bg-white/95',
        socialIcon: 'bg-white/20 border border-white/40 text-white hover:bg-white/30 rounded-xl',
        accentBorder: 'border-white',
    },
    'soft-bloom': {
        bg: 'linear-gradient(135deg, #fff0f2 0%, #fffcfc 50%, #fff0f2 100%)',
        font: 'font-serif',
        textTitle: 'text-stone-800 font-bold tracking-tight',
        textBody: 'text-stone-500 font-sans',
        avatarBorder: 'border-4 border-rose-200/80 shadow-lg ring-4 ring-rose-100/30',
        cardBg: 'bg-white/60 border border-rose-200/30 shadow-sm rounded-2xl',
        btnBase: 'bg-white text-rose-700 border border-rose-200/80 shadow-sm rounded-full hover:border-rose-400 hover:text-rose-800',
        btnPrimary: 'bg-gradient-to-r from-rose-400 to-pink-500 text-white border-none rounded-full hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]',
        socialIcon: 'bg-white border border-rose-100/80 text-rose-500 hover:border-rose-300 hover:text-rose-700 shadow-sm rounded-full',
        accentBorder: 'border-rose-400',
    },
    'modern-split': {
        bg: 'linear-gradient(135deg, #d31124 0%, #e11d48 100%)',
        font: 'font-sans',
        textTitle: 'text-white font-extrabold tracking-tight drop-shadow-md',
        textBody: 'text-white/90',
        avatarBorder: 'border-4 border-white/80 shadow-xl ring-4 ring-white/10',
        cardBg: 'bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl',
        btnBase: 'bg-white/10 text-white border border-white/20 hover:bg-white/25 rounded-xl',
        btnPrimary: 'bg-white text-rose-700 font-bold border-none rounded-xl hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]',
        socialIcon: 'bg-white/15 border border-white/20 text-white hover:bg-white/25 rounded-xl',
        accentBorder: 'border-white',
    },
};

const resolveTemplate = (template, landingPageTheme) => {
    if (template === 'follow-landing' || !template) {
        const mapping = {
            'galaxy': 'modern-glow',
            'luxury': 'clean-elegant',
            'forest': 'organic-leaf',
            'bloom': 'soft-bloom',
            'modern-split': 'modern-split'
        };
        return mapping[landingPageTheme] || 'modern-glow';
    }
    return template;
};

// ─── SVG Brand Social Icons ──────────────────────────────────────────────────
const SOCIAL_ICONS = {
    whatsapp: (className) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.258 1.875 13.785 1.057 11.14 1.055 5.705 1.055 1.284 5.474 1.282 10.91c-.001 1.708.452 3.375 1.312 4.86l-.86 3.128 3.202-.844zM16.5 13.5c-.3-.15-1.765-.87-2.035-.97-.27-.1-.465-.15-.66.15-.2.3-.765.97-.94 1.17-.175.2-.35.225-.65.075-.3-.15-1.265-.465-2.41-1.485-.89-.795-1.49-1.78-1.665-2.08-.175-.3-.02-.46.13-.61.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.66-1.59-.9-2.175-.24-.575-.48-.5-.66-.51h-.56c-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.225 5.115 4.525.715.31 1.275.495 1.71.635.72.23 1.375.2 1.89.12.575-.085 1.765-.72 2.015-1.415.25-.7.25-1.3 0-1.425-.05-.125-.2-.2-.5-.35z" />
        </svg>
    ),
    instagram: (className) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    tiktok: (className) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.07c-.1 1.71-.57 3.45-1.56 4.85-1.54 2.22-4.14 3.73-6.89 3.82-2.58.1-5.22-.88-6.97-2.79-1.92-2.04-2.67-5.06-1.95-7.79.67-2.62 2.76-4.8 5.41-5.32 1.34-.28 2.76-.13 4 .37V8.55c-1.63-.49-3.4-.49-5 .09-2.02.72-3.72 2.28-4.47 4.26-.78 2.01-.64 4.39.39 6.25 1.05 1.9 3.03 3.26 5.2 3.52 2.14.28 4.41-.39 5.86-2.04 1.34-1.48 1.9-3.56 1.77-5.58V.02h.01z" />
        </svg>
    ),
    facebook: (className) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    youtube: (className) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    telegram: (className) => (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.18l-1.91 9c-.14.65-.53.81-1.08.5L9.7 15.42l-1.4 1.35c-.15.15-.28.27-.58.27l.21-2.97 5.4-4.88c.23-.21-.05-.32-.36-.12L6.3 13.3 3.42 12.4c-.63-.2-0.64-.63.13-.93l11.24-4.33c.52-.19.98.12.77.94z" />
        </svg>
    ),
    email: (className) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    website: (className) => (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    ),
};

const SocialIconSvg = ({ platform, className }) => {
    const fn = SOCIAL_ICONS[platform];
    if (!fn) return <span className="text-sm">{getSocialEmoji(platform)}</span>;
    return fn(className);
};

function getLinkSubtitle(url, label) {
    const lowerUrl = (url || '').toLowerCase();
    const lowerLabel = (label || '').toLowerCase();
    if (lowerUrl.includes('register') || lowerLabel.includes('buat') || lowerLabel.includes('daftar')) {
        return 'Buat undangan digital dalam 5 menit, gratis!';
    }
    if (lowerUrl.includes('themes') || lowerLabel.includes('tema') || lowerLabel.includes('desain') || lowerLabel.includes('katalog')) {
        return 'Lihat koleksi desain premium terpopuler';
    }
    if (lowerUrl.includes('plans') || lowerLabel.includes('harga') || lowerLabel.includes('paket')) {
        return 'Pilihan paket fitur lengkap & terjangkau';
    }
    if (lowerUrl.includes('faq') || lowerLabel.includes('tanya') || lowerLabel.includes('bantuan')) {
        return 'Pertanyaan yang sering ditanyakan reseller';
    }
    if (lowerUrl.includes('buat-kartu') || lowerLabel.includes('kartu') || lowerLabel.includes('ucapan')) {
        return 'Kirim kartu ucapan digital ke kerabat';
    }
    if (lowerUrl.includes('login') || lowerLabel.includes('masuk')) {
        return 'Masuk ke dashboard reseller Anda';
    }
    return null;
}

// ─── Social platform helpers ──────────────────────────────────────────────────
function getSocialUrl(platform, value) {
    if (!value) return null;
    switch (platform) {
        case 'whatsapp':  return `https://wa.me/${value.replace(/\D/g, '')}`;
        case 'instagram': return value.startsWith('http') ? value : `https://instagram.com/${value.replace('@', '')}`;
        case 'tiktok':    return value.startsWith('http') ? value : `https://tiktok.com/@${value.replace('@', '')}`;
        case 'facebook':  return value.startsWith('http') ? value : `https://facebook.com/${value}`;
        case 'youtube':   return value.startsWith('http') ? value : `https://youtube.com/${value}`;
        case 'telegram':  return value.startsWith('http') ? value : `https://t.me/${value.replace('@', '')}`;
        case 'email':     return `mailto:${value}`;
        case 'website':   return value.startsWith('http') ? value : `https://${value}`;
        default:          return value;
    }
}

function getSocialEmoji(platform) {
    const map = { whatsapp: '💬', instagram: '📸', tiktok: '🎵', facebook: '📘', youtube: '▶️', telegram: '✈️', email: '📧', website: '🌐' };
    return map[platform] || '🔗';
}

function getSocialLabel(platform) {
    const labels = { whatsapp: 'WhatsApp', instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', youtube: 'YouTube', telegram: 'Telegram', email: 'Email', website: 'Website' };
    return labels[platform] || platform;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
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
    external:  'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-105 6L21 3m0 0h-5.25M21 3v5.25',
};

function BtnIcon({ name, className = 'w-4 h-4' }) {
    const d = ICONS[name];
    if (!d) return null;
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
}

// ─── Button micro-animations ───────────────────────────────────────────────
function getAnimClass(animation) {
    switch (animation) {
        case 'glow':    return 'hover:shadow-[0_0_22px_rgba(167,139,250,0.65)] hover:scale-[1.015] transition-all duration-300';
        case 'pulse':   return 'animate-pulse hover:animate-none hover:scale-[1.015] transition-all';
        case 'bounce':  return 'hover:translate-y-[-3px] hover:shadow-md transition-transform duration-200';
        case 'shimmer': return 'relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:translate-x-[-200%] hover:after:translate-x-[200%] after:transition-transform after:duration-700 hover:scale-[1.015] transition-transform';
        default:        return 'hover:-translate-y-0.5 transition-all duration-200';
    }
}

// ─── Decorative background templates ───────────────────────────────────────────
function BackgroundDecorations({ template }) {
    if (template === 'modern-glow') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute rounded-full opacity-20 animate-pulse"
                        style={{
                            width: `${100 + i * 80}px`, height: `${100 + i * 80}px`,
                            background: i % 2 === 0 ? 'radial-gradient(circle, #7c3aed, transparent 70%)' : 'radial-gradient(circle, #4f46e5, transparent 70%)',
                            top: `${10 + i * 15}%`, left: `${5 + i * 16}%`,
                            animationDelay: `${i * 0.4}s`, animationDuration: `${3 + i}s`,
                        }}
                    />
                ))}
            </div>
        );
    }
    if (template === 'cyberpunk') {
        return (
            <>
                {/* Grid Overlay */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-0" style={{
                    backgroundImage: 'linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />
                {/* Scanline Effect */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
                        style={{ animation: 'scanline 5s linear infinite', position: 'absolute' }} />
                </div>
            </>
        );
    }
    if (template === 'organic-leaf') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
                <div className="absolute text-9xl opacity-[0.07] rotate-12" style={{ top: '5%', left: '-50px', fontSize: '180px' }}>🌿</div>
                <div className="absolute text-9xl opacity-[0.07] -rotate-12" style={{ bottom: '5%', right: '-50px', fontSize: '180px' }}>🌿</div>
                <div className="absolute opacity-[0.05] text-8xl rotate-45" style={{ top: '45%', right: '-40px', fontSize: '120px' }}>🍃</div>
                <div className="absolute opacity-[0.04] text-7xl -rotate-45" style={{ top: '65%', left: '-30px', fontSize: '100px' }}>🌱</div>
            </div>
        );
    }
    if (template === 'minimal-card') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute w-[350px] h-[350px] rounded-full opacity-35 blur-3xl"
                    style={{ background: 'rgba(139,92,246,0.5)', top: '-10%', left: '-10%' }} />
                <div className="absolute w-[300px] h-[300px] rounded-full opacity-35 blur-3xl"
                    style={{ background: 'rgba(236,72,153,0.4)', bottom: '-8%', right: '-8%' }} />
            </div>
        );
    }
    if (template === 'soft-bloom') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
                <div className="absolute text-9xl opacity-[0.05] rotate-12" style={{ top: '5%', left: '-50px', fontSize: '180px' }}>🌸</div>
                <div className="absolute text-9xl opacity-[0.05] -rotate-12" style={{ bottom: '5%', right: '-50px', fontSize: '180px' }}>🌸</div>
                <div className="absolute opacity-[0.04] text-8xl rotate-45" style={{ top: '45%', right: '-40px', fontSize: '120px' }}>💮</div>
                <div className="absolute opacity-[0.04] text-7xl -rotate-45" style={{ top: '65%', left: '-30px', fontSize: '100px' }}>🌺</div>
            </div>
        );
    }
    if (template === 'modern-split') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute w-[300px] h-[300px] rounded-full opacity-15 blur-3xl"
                    style={{ background: 'rgba(255,255,255,0.4)', top: '-5%', right: '-5%' }} />
                <div className="absolute w-[250px] h-[250px] rounded-full opacity-10 blur-3xl"
                    style={{ background: 'rgba(255,255,255,0.3)', bottom: '-5%', left: '-5%' }} />
            </div>
        );
    }
    return null;
}

// ─── Main Page Export ─────────────────────────────────────────────────────────
// ─── Preloader Themes ─────────────────────────────────────────────────────────
const BIOLINK_PRELOADER_THEME = {
    'modern-glow': {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        accent: '#8b5cf6',
        accentDark: '#7c3aed',
        isDark: true,
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.7)'
    },
    'clean-elegant': {
        bg: 'linear-gradient(135deg, #07090b 0%, #15181c 50%, #07090b 100%)',
        accent: '#d97706',
        accentDark: '#b45309',
        isDark: true,
        textPrimary: '#f5f5f7',
        textSecondary: '#a0a5b0'
    },
    'cyberpunk': {
        bg: 'linear-gradient(160deg, #0d0d0d 0%, #1a0033 50%, #0d0d0d 100%)',
        accent: '#d946ef',
        accentDark: '#c084fc',
        isDark: true,
        textPrimary: '#f5f3ff',
        textSecondary: '#c4b5fd'
    },
    'organic-leaf': {
        bg: 'linear-gradient(135deg, #051a11 0%, #0c3624 50%, #051a11 100%)',
        accent: '#10b981',
        accentDark: '#047857',
        isDark: true,
        textPrimary: '#ecfdf5',
        textSecondary: '#a7f3d0'
    },
    'minimal-card': {
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        accent: '#ffffff',
        accentDark: '#f3e8ff',
        isDark: true,
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.8)'
    },
    'soft-bloom': {
        bg: 'linear-gradient(135deg, #fff0f2 0%, #fffcfc 50%, #fff0f2 100%)',
        accent: '#e06b86',
        accentDark: '#bf4b66',
        isDark: false,
        textPrimary: '#4a2c3a',
        textSecondary: '#826270'
    },
    'modern-split': {
        bg: 'linear-gradient(135deg, #d31124 0%, #e11d48 100%)',
        accent: '#d31124',
        accentDark: '#b91c1c',
        isDark: false,
        textPrimary: '#1f2937',
        textSecondary: '#4b5563'
    }
};

// ─── Main Page Export ─────────────────────────────────────────────────────────
export default function BioLink({ bio, brandName, brandLogo, resellerUrl, subdomain, landingPageTheme, loading_style = 'pulse', sections = [] }) {
    const template = resolveTemplate('follow-landing', landingPageTheme);
    const PT = BIOLINK_PRELOADER_THEME[template] || BIOLINK_PRELOADER_THEME['modern-glow'];

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    const activeSectionsList = sections || [];
    const loadingScreenSection = activeSectionsList.find(s => s.key === 'loading_screen');
    const showLoadingScreen = loadingScreenSection ? loadingScreenSection.active : true;
    const activeLoadingStyle = loadingScreenSection?.config?.style || loading_style || 'pulse';

    const preloaderStyles = `
        @keyframes rl-pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes rl-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes rl-spin-reverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
        }
        @keyframes rl-shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: 200px 0; }
        }
        @keyframes rl-fade-breath {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        @keyframes rl-envelope-open {
            0% { transform: rotateX(0deg); z-index: 4; }
            50% { transform: rotateX(90deg); z-index: 1; }
            100% { transform: rotateX(180deg); z-index: 1; }
        }
        @keyframes rl-card-slide-up {
            0% { transform: translateY(0); }
            50% { transform: translateY(0); }
            100% { transform: translateY(-40px); }
        }
        @keyframes rl-progress-sweep {
            0% { left: -30%; width: 30%; }
            50% { left: 30%; width: 40%; }
            100% { left: 100%; width: 30%; }
        }
    `;

    const renderPreloaderContent = () => {
        const brandChar = brandName?.charAt(0) || 'U';
        const accentColor = PT.accent || '#8b5cf6';
        const isDark = PT.isDark;
        const textPrimaryColor = PT.textPrimary || (isDark ? '#ffffff' : '#333333');
        const textSecondaryColor = PT.textSecondary || (isDark ? 'rgba(255,255,255,0.7)' : '#666666');

        switch (activeLoadingStyle) {
            case 'glass':
                return (
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.65)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        maxWidth: '320px',
                        width: '90%',
                    }}>
                        <div style={{
                            position: 'absolute',
                            width: '120px',
                            height: '120px',
                            background: accentColor,
                            borderRadius: '50%',
                            filter: 'blur(40px)',
                            opacity: isDark ? 0.3 : 0.15,
                            zIndex: -1,
                        }} />
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            background: `linear-gradient(135deg, ${accentColor}, ${PT.accentDark || accentColor})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 20px ${accentColor}30`,
                            animation: 'rl-pulse 2s ease-in-out infinite',
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '28px',
                            marginBottom: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}>
                            {brandChar}
                        </div>
                        <h4 style={{
                            color: textPrimaryColor,
                            fontSize: '16px',
                            fontWeight: '700',
                            margin: '0 0 16px 0',
                            textAlign: 'center',
                        }}>
                            {brandName}
                        </h4>
                        <div style={{
                            width: '120px',
                            height: '4px',
                            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '100%',
                                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                                animation: 'rl-shimmer 1.5s infinite',
                                backgroundSize: '200px 100%',
                            }} />
                        </div>
                    </div>
                );

            case 'rings':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            position: 'relative',
                            width: '90px',
                            height: '90px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '90px',
                                height: '90px',
                                border: '2.5px solid transparent',
                                borderTopColor: accentColor,
                                borderBottomColor: accentColor,
                                borderRadius: '50%',
                                animation: 'rl-spin 1.5s cubic-bezier(0.53, 0.21, 0.29, 0.67) infinite'
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '70px',
                                height: '70px',
                                border: '2.5px solid transparent',
                                borderLeftColor: isDark ? '#ffffff' : '#333333',
                                borderRightColor: isDark ? '#ffffff' : '#333333',
                                borderRadius: '50%',
                                opacity: 0.8,
                                animation: 'rl-spin-reverse 1.2s cubic-bezier(0.53, 0.21, 0.29, 0.67) infinite'
                            }} />
                            <div style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '50%',
                                background: isDark ? '#ffffff' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isDark ? `0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px ${accentColor}` : `0 4px 15px rgba(0, 0, 0, 0.05), 0 0 20px ${accentColor}40`,
                                color: accentColor,
                                fontWeight: '800',
                                fontSize: '20px',
                                textShadow: `0 1px 2px rgba(0,0,0,0.1)`
                            }}>
                                {brandChar}
                            </div>
                        </div>
                        <h4 style={{
                            color: textPrimaryColor,
                            fontSize: '18px',
                            fontWeight: '700',
                            margin: '0 0 6px 0',
                            animation: 'rl-fade-breath 2s ease-in-out infinite',
                        }}>
                            {brandName}
                        </h4>
                        <p style={{
                            color: textSecondaryColor,
                            fontSize: '11px',
                            margin: 0,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontWeight: '600'
                        }}>
                            Memuat Halaman...
                        </p>
                    </div>
                );

            case 'bar':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '3.5px',
                            width: '100%',
                            background: 'rgba(0,0,0,0.05)',
                            zIndex: 1000000
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                height: '100%',
                                background: `linear-gradient(90deg, ${accentColor}, ${isDark ? '#ffffff' : accentColor}, ${accentColor})`,
                                boxShadow: `0 0 10px ${accentColor}`,
                                animation: 'rl-progress-sweep 2s ease-in-out infinite',
                                width: '30%'
                            }} />
                        </div>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: isDark ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.05)',
                            borderTopColor: accentColor,
                            borderRadius: '50%',
                            animation: 'rl-spin 0.8s linear infinite',
                            marginBottom: '20px'
                        }} />
                        <h4 style={{
                            color: textPrimaryColor,
                            fontSize: '20px',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            margin: '0 0 4px 0',
                            opacity: 0.95
                        }}>
                            {brandName}
                        </h4>
                        <p style={{
                            color: textSecondaryColor,
                            fontSize: '11px',
                            margin: 0,
                            letterSpacing: '1px'
                        }}>
                            Memuat Halaman...
                        </p>
                    </div>
                );

            case 'envelope':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            position: 'relative',
                            width: '100px',
                            height: '75px',
                            background: `linear-gradient(135deg, ${accentColor}, ${PT.accentDark || accentColor})`,
                            borderRadius: '0 0 8px 8px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                            marginBottom: '35px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: '37.5px 0 37.5px 50px',
                                borderColor: 'transparent transparent rgba(255, 255, 255, 0.15) rgba(255, 255, 255, 0.1)',
                                borderRadius: '0 0 0 8px',
                                zIndex: 3
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: '37.5px 50px 37.5px 0',
                                borderColor: 'transparent rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0.15) transparent',
                                borderRadius: '0 0 8px 0',
                                zIndex: 3
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: '38px 50px 0 50px',
                                borderColor: `${accentColor} transparent transparent transparent`,
                                transformOrigin: 'top center',
                                animation: 'rl-envelope-open 1.8s ease-in-out infinite alternate',
                                zIndex: 3,
                            }} />
                            <div style={{
                                position: 'absolute',
                                width: '80px',
                                height: '70px',
                                background: '#ffffff',
                                borderRadius: '4px',
                                bottom: '5px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                                animation: 'rl-card-slide-up 1.8s ease-in-out infinite alternate',
                                zIndex: 2,
                                border: '1px solid rgba(0,0,0,0.05)',
                                padding: '4px'
                            }}>
                                <span style={{
                                    fontSize: '18px',
                                    animation: 'rl-pulse 1s infinite',
                                    display: 'inline-block'
                                }}>❤️</span>
                                <span style={{
                                    fontSize: '8px',
                                    color: '#4b5563',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    marginTop: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Love Ticket</span>
                            </div>
                        </div>
                        <h4 style={{
                            color: textPrimaryColor,
                            fontSize: '16px',
                            fontWeight: '600',
                            margin: '0 0 6px 0',
                        }}>
                            {brandName}
                        </h4>
                        <p style={{
                            color: textSecondaryColor,
                            fontSize: '11px',
                            margin: 0,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontWeight: '500'
                        }}>
                            Membuka Undangan...
                        </p>
                    </div>
                );

            case 'pulse':
            default:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            position: 'relative',
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                border: `3px solid ${accentColor}20`,
                                borderTop: `3px solid ${accentColor}`,
                                borderRadius: '50%',
                                animation: 'rl-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
                            }} />
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: accentColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 0 20px ${accentColor}`,
                                animation: 'rl-pulse 2s ease-in-out infinite',
                                color: isDark ? '#000' : '#fff',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                {brandChar}
                            </div>
                        </div>
                        <h3 style={{
                            color: textPrimaryColor,
                            fontSize: '18px',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            margin: '0 0 8px 0',
                            textAlign: 'center',
                            animation: 'rl-pulse 2s ease-in-out infinite'
                        }}>
                            {brandName}
                        </h3>
                        <p style={{
                            color: textSecondaryColor,
                            fontSize: '12px',
                            margin: 0,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            opacity: 0.9,
                            fontWeight: '500',
                            textAlign: 'center'
                        }}>
                            Memuat Halaman...
                        </p>
                    </div>
                );
        }
    };

    const pageTitle = bio?.title || brandName || 'Bio Link';
    const description = bio?.description || `Kunjungi halaman bio resmi dari ${pageTitle}`;

    const activeSections = [...(bio?.sections || DEFAULT_SECTIONS)]
        .filter(s => s.active)
        .sort((a, b) => a.order - b.order);

    const activeButtons = (bio?.buttons || []).filter(b => b.active).map(btn => {
        let url = btn.url || '#';
        const isPathBased = typeof window !== 'undefined' && window.location.pathname.startsWith('/r/');

        if (url === '/register' || url === 'register') {
            url = isPathBased ? `/register?ref=${subdomain}` : '/register';
        } else if (url === '#themes' || url === '/themes' || url === 'themes') {
            url = isPathBased ? `/r/${subdomain}/themes` : '/katalog-tema';
        } else if (url === '#plans' || url === '/plans' || url === 'plans') {
            url = isPathBased ? `/r/${subdomain}#plans` : '/#plans';
        } else if (url === '/faq' || url === 'faq') {
            url = isPathBased ? `/r/${subdomain}/faq` : '/faq';
        } else if (url === '/' || url === 'home') {
            url = isPathBased ? `/r/${subdomain}` : '/';
        } else if (url === '/login' || url === 'login') {
            url = '/login';
        } else if (url === '/buat-kartu' || url === 'buat-kartu') {
            url = isPathBased ? `/buat-kartu?ref=${subdomain}` : '/buat-kartu';
        }
        return { ...btn, url };
    });

    const social = bio?.social || {};
    const socialEntries = Object.entries(social).filter(([, v]) => v);

    const theme = THEMES[template] || THEMES['modern-glow'];

    // Render Section Function
    const renderSection = (sec) => {
        switch (sec.type) {
            case 'header':
                if (sec.variant === 'minimal') {
                    return (
                        <div key={sec.id} className="text-center w-full py-3">
                            <h1 className={`text-2xl md:text-3xl font-extrabold ${theme.textTitle}`}>{brandName}</h1>
                        </div>
                    );
                }
                if (sec.variant === 'split') {
                    return (
                        <div key={sec.id} className="flex items-center gap-4 w-full justify-center text-left py-2.5">
                            <div className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ${theme.avatarBorder}`}>
                                {brandLogo ? (
                                    <img src={brandLogo} alt={brandName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-white font-bold text-xl">
                                        {brandName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h1 className={`text-xl md:text-2xl font-bold ${theme.textTitle}`}>{brandName}</h1>
                        </div>
                    );
                }
                if (sec.variant === 'banner') {
                    return (
                        <div key={sec.id} className="w-full flex flex-col items-center relative mb-4">
                            <div className="w-full h-24 md:h-28 rounded-2xl overflow-hidden bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 border border-white/5 relative z-0 flex items-center justify-center">
                                {brandLogo && (
                                    <img src={brandLogo} alt="" className="w-full h-full object-cover opacity-15 filter blur-sm" />
                                )}
                            </div>
                            <div className={`w-18 h-18 rounded-full overflow-hidden flex-shrink-0 -mt-9 border-4 relative z-10 ${theme.avatarBorder}`}>
                                {brandLogo ? (
                                    <img src={brandLogo} alt={brandName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-white font-bold text-xl">
                                        {brandName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h1 className={`text-lg md:text-xl font-bold ${theme.textTitle} mt-2.5 text-center`}>{brandName}</h1>
                        </div>
                    );
                }
                // Default: centered
                return (
                    <div key={sec.id} className="flex flex-col items-center text-center gap-4.5 w-full">
                        <div className={`w-24 h-24 rounded-full overflow-hidden flex-shrink-0 ${theme.avatarBorder}`}>
                            {brandLogo ? (
                                <img src={brandLogo} alt={brandName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-white font-bold text-3xl">
                                    {brandName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-extrabold ${theme.textTitle}`}>{brandName}</h1>
                    </div>
                );

            case 'bio':
                const descText = description;
                if (sec.variant === 'card') {
                    return (
                        <div key={sec.id} className={`w-full p-4 rounded-2xl shadow-sm text-center ${theme.cardBg}`}>
                            <p className={`text-sm leading-relaxed ${theme.textBody}`}>{descText}</p>
                        </div>
                    );
                }
                if (sec.variant === 'highlighted') {
                    return (
                        <div key={sec.id} className={`w-full border-l-4 ${theme.accentBorder} pl-4 py-1 text-left`}>
                            <p className={`text-sm leading-relaxed ${theme.textBody}`}>{descText}</p>
                        </div>
                    );
                }
                if (sec.variant === 'quote') {
                    return (
                        <div key={sec.id} className="w-full text-center py-2.5 relative">
                            <span className={`absolute -top-3 left-2 text-4xl md:text-5xl opacity-25 font-serif ${theme.textTitle}`}>“</span>
                            <p className={`text-sm italic leading-relaxed px-7 ${theme.textBody}`}>{descText}</p>
                            <span className={`absolute -bottom-6 right-2 text-4xl md:text-5xl opacity-25 font-serif ${theme.textTitle}`}>”</span>
                        </div>
                    );
                }
                // Default: simple
                return (
                    <div key={sec.id} className="w-full text-center">
                        <p className={`text-sm leading-relaxed ${theme.textBody}`}>{descText}</p>
                    </div>
                );

            case 'buttons':
                if (activeButtons.length === 0) return null;
                if (sec.variant === 'grid') {
                    return (
                        <div key={sec.id} className="w-full grid grid-cols-2 gap-3.5">
                            {activeButtons.map((btn, i) => (
                                <a key={btn.id} href={btn.url} target="_blank" rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center text-center gap-1.5 py-4 px-3 text-xs font-semibold ${getAnimClass(btn.animation)} ${i === 0 ? theme.btnPrimary : theme.btnBase}`}>
                                    {btn.icon && <BtnIcon name={btn.icon} className="w-5 h-5 mb-0.5" />}
                                    <span>{btn.label}</span>
                                </a>
                            ))}
                        </div>
                    );
                }
                if (sec.variant === 'compact') {
                    return (
                        <div key={sec.id} className="w-full flex flex-col gap-2.5">
                            {activeButtons.map((btn, i) => (
                                <a key={btn.id} href={btn.url} target="_blank" rel="noopener noreferrer"
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold ${getAnimClass(btn.animation)} ${i === 0 ? theme.btnPrimary : theme.btnBase}`}>
                                    {btn.icon && <BtnIcon name={btn.icon} className="w-3.5 h-3.5" />}
                                    <span>{btn.label}</span>
                                </a>
                            ))}
                        </div>
                    );
                }
                // Default: default (stacked full-width) with premium layout, subtitles & chevron
                return (
                    <div key={sec.id} className="w-full flex flex-col gap-3.5">
                        {activeButtons.map((btn, i) => {
                            const sub = getLinkSubtitle(btn.url, btn.label);
                            const isPrimary = i === 0;
                            // Dynamic icon bg based on template & primary state for perfect contrast
                            let iconBg = isPrimary ? 'bg-white/20 text-white' : 'bg-black/5 text-current';
                            if (template === 'modern-split' && isPrimary) {
                                iconBg = 'bg-rose-500/10 text-rose-600';
                            } else if (template === 'clean-elegant' && isPrimary) {
                                iconBg = 'bg-stone-950/20 text-stone-900';
                            } else if (template === 'organic-leaf' && isPrimary) {
                                iconBg = 'bg-emerald-900/10 text-emerald-900';
                            } else if (template === 'soft-bloom' && !isPrimary) {
                                iconBg = 'bg-rose-500/5 text-rose-600';
                            }

                            return (
                                <a key={btn.id} href={btn.url} target="_blank" rel="noopener noreferrer"
                                    className={`w-full flex items-center gap-3.5 py-3.5 px-4 text-left transition-all duration-200 shadow-sm border ${getAnimClass(btn.animation)} ${isPrimary ? theme.btnPrimary : theme.btnBase}`}>
                                    {btn.icon && (
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                                            <BtnIcon name={btn.icon} className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold truncate leading-tight">{btn.label}</div>
                                        {sub && <div className={`text-[10px] truncate mt-0.5 leading-none ${isPrimary ? 'opacity-85' : 'opacity-60'}`}>{sub}</div>}
                                    </div>
                                    <svg className="w-4 h-4 opacity-40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            );
                        })}
                    </div>
                );

            case 'sosmed':
                if (socialEntries.length === 0) return null;
                if (sec.variant === 'labeled') {
                    return (
                        <div key={sec.id} className="w-full grid grid-cols-2 gap-2.5 py-1">
                            {socialEntries.map(([platform, value]) => (
                                <a key={platform} href={getSocialUrl(platform, value)} target="_blank" rel="noopener noreferrer"
                                    className={`flex items-center gap-2.5 py-2.5 px-3.5 text-xs font-medium rounded-xl transition-all duration-200 hover:scale-[1.015] ${theme.socialIcon}`}
                                    title={getSocialLabel(platform)}>
                                    <SocialIconSvg platform={platform} className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{getSocialLabel(platform)}</span>
                                </a>
                            ))}
                        </div>
                    );
                }
                if (sec.variant === 'chip') {
                    return (
                        <div key={sec.id} className="flex flex-wrap justify-center gap-2.5 py-1">
                            {socialEntries.map(([platform, value]) => (
                                <a key={platform} href={getSocialUrl(platform, value)} target="_blank" rel="noopener noreferrer"
                                    className={`flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-medium transition-all duration-200 hover:scale-105 ${theme.socialIcon}`}
                                    title={getSocialLabel(platform)}>
                                    <SocialIconSvg platform={platform} className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{getSocialLabel(platform)}</span>
                                </a>
                            ))}
                        </div>
                    );
                }
                // Default: icon-row
                return (
                    <div key={sec.id} className="flex flex-wrap justify-center gap-3 py-1">
                        {socialEntries.map(([platform, value]) => (
                            <a key={platform} href={getSocialUrl(platform, value)} target="_blank" rel="noopener noreferrer"
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${theme.socialIcon}`}
                                title={getSocialLabel(platform)}>
                                <SocialIconSvg platform={platform} className="w-4.5 h-4.5 flex-shrink-0" />
                            </a>
                        ))}
                    </div>
                );

            case 'footer':
                if (sec.variant === 'tagline') {
                    return (
                        <div key={sec.id} className="w-full text-center py-5 mt-auto flex flex-col gap-1 z-10">
                            <p className={`text-xs opacity-65 font-medium ${theme.textBody}`}>
                                Powered by <span className="font-semibold">{brandName}</span>
                            </p>
                            <p className={`text-[10px] opacity-45 italic ${theme.textBody}`}>
                                Platform Undangan Digital Terbaik & Terpercaya
                            </p>
                        </div>
                    );
                }
                if (sec.variant === 'copyright') {
                    return (
                        <div key={sec.id} className="w-full text-center py-5 mt-auto z-10">
                            <p className={`text-[10px] opacity-50 ${theme.textBody}`}>
                                &copy; {new Date().getFullYear()} <span className="font-semibold">{brandName}</span>. All rights reserved.
                            </p>
                        </div>
                    );
                }
                // Default: minimal
                return (
                    <div key={sec.id} className="w-full text-center py-5 mt-auto z-10">
                        <p className={`text-xs opacity-60 font-medium ${theme.textBody}`}>
                            Powered by <span className="font-semibold">{brandName}</span>
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
                <style>{`
                    * { box-sizing: border-box; }
                    body { margin: 0; padding: 0; }
                    html, body { min-height: 100%; }
                    a { text-decoration: none; transition: all 0.2s ease-in-out; }
                    img { max-width: 100%; height: auto; }
                    
                    /* Cyberpunk theme elements */
                    @keyframes scanline { 0% { top: -2%; } 100% { top: 102%; } }
                    @keyframes neon-pulse { 
                        0%, 100% { text-shadow: 0 0 8px rgba(240, 70, 239, 0.8), 0 0 20px rgba(240, 70, 239, 0.4); } 
                        50% { text-shadow: 0 0 4px rgba(240, 70, 239, 0.6), 0 0 10px rgba(240, 70, 239, 0.2); } 
                    }
                    .neon-text { animation: neon-pulse 2s ease-in-out infinite; }
                    
                    /* Font family fallbacks */
                    .font-serif { font-family: 'Playfair Display', Georgia, serif; }
                    .font-sans { font-family: 'Outfit', sans-serif; }
                    .font-mono { font-family: 'Share Tech Mono', monospace; }
                `}</style>
            </Head>

            {/* Elegant Preloader overlay */}
            {showLoadingScreen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: PT.bg || '#0f172a',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999999,
                    opacity: isLoaded ? 0 : 1,
                    visibility: isLoaded ? 'hidden' : 'visible',
                    transition: 'opacity 0.4s ease-in-out, visibility 0.4s ease-in-out',
                    pointerEvents: 'none'
                }}>
                    <style dangerouslySetInnerHTML={{ __html: preloaderStyles }} />
                    {renderPreloaderContent()}
                </div>
            )}

            <div className={`min-h-screen relative overflow-x-hidden flex items-center justify-center ${theme.font} transition-all duration-500 py-10 px-4`}
                style={{ 
                    background: theme.bg,
                    opacity: (!showLoadingScreen || isLoaded) ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out, background 0.5s ease-in-out'
                }}>
                
                {/* Background themed elements */}
                <BackgroundDecorations template={template} />

                {/* Brand Logo Watermark */}
                {brandLogo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
                        <img 
                            src={brandLogo} 
                            alt="" 
                            className="w-[70%] max-w-[280px] md:max-w-[380px] opacity-[0.06] grayscale filter blur-[2px] transform rotate-[-12deg] transition-all"
                        />
                    </div>
                )}

                {/* Layout container (Glassmorphism Card Wrapper) */}
                <div className={`w-full max-w-md p-6 md:p-10 flex flex-col items-center gap-6 shadow-2xl z-10 transition-all duration-300 ${theme.cardBg}`}>
                    {activeSections.map(sec => renderSection(sec))}
                </div>
            </div>
        </>
    );
}
