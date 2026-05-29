import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';


/* ─── Standardized Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function parseBool(val, defaultVal = true) {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

import PremiumSlideshow from '@/Components/PremiumSlideshow';

function getStorageUrl(url, fallback = '') {
    if (!url) return fallback;
    if (typeof url === 'string' && url.includes(',')) {
        url = url.split(',')[0];
    }
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.startsWith('themes/') || cleanUrl.startsWith('/themes/')) {
        return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/storage/')) return cleanUrl;
    if (cleanUrl.startsWith('storage/')) return '/' + cleanUrl;
    if (cleanUrl.startsWith('/')) return cleanUrl;
    return `/storage/${cleanUrl}`;
}

function getThemeLabels(type, locale = 'id', brideGrooms = [], invitation = {}) {
    const t = type || 'wedding';
    const isEn = String(locale).toLowerCase() === 'en';
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    
    let mainName = '';
    let initials = '';
    let isSingleHost = false;
    
    if (['wedding', 'anniversary'].includes(t)) {
        const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
        const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
        mainName = groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : 'Bride & Groom';
        initials = `${groom.nickname?.charAt(0) || 'B'}${bride.nickname?.charAt(0) || 'R'}`;
        isSingleHost = false;
    } else {
        mainName = host.nickname || host.full_name || 'Host';
        initials = mainName.charAt(0) || 'H';
        isSingleHost = true;
    }

    let labels = {
        brandText: 'wedding',
        brandSubtext: 'of',
        coverTitle: invitation?.cover_title || mainName,
        profileHeader: isEn ? 'PROFILES OF THE COUPLE' : 'PROFIL KEDUA MEMPELAI',
        profileBadge: isEn ? 'The Couple' : 'Mempelai',
        shortcutProfile: isEn ? 'The Couple' : 'Mempelai',
        searchPlaceholder: isEn ? 'Search blessings...' : 'Cari doa restu...',
        writeBlessingPlaceholder: isEn ? 'Write your blessings...' : 'Tulis doa & ucapan terbaik...',
        bannerLabels: isEn ? [
            "FREE SHIPPING PHYSICAL PRESENCE",
            "VOUCHER BLESSINGS MIN. TRANSACTION RP0",
            "SPECIAL LIVE STREAMING HAPPY MOMENT"
        ] : [
            "GRATIS ONGKIR KEHADIRAN KE PELAMINAN",
            "VOUCHER DOA RESTU MINIMAL BELANJA RP0",
            "SPESIAL LIVE STREAMING HARI BAHAGIA"
        ]
    };

    if (t === 'wedding') {
        labels.brandText = 'wedding';
        labels.brandSubtext = 'of';
        labels.profileHeader = isEn ? 'PROFILES OF THE COUPLE' : 'PROFIL KEDUA MEMPELAI';
        labels.profileBadge = isEn ? 'Groom & Bride' : 'Mempelai';
        labels.shortcutProfile = isEn ? 'Groom & Bride' : 'Mempelai';
        labels.searchPlaceholder = isEn ? 'Search wedding blessings...' : 'Cari doa restu di hari bahagia...';
        labels.writeBlessingPlaceholder = isEn ? 'Write your wedding blessings...' : 'Tulis doa & ucapan terbaik untuk kedua mempelai...';
    } else if (t === 'anniversary') {
        labels.brandText = 'anniversary';
        labels.brandSubtext = 'of';
        labels.profileHeader = isEn ? 'PROFILES OF THE COUPLE' : 'PROFIL KEDUA MEMPELAI';
        labels.profileBadge = isEn ? 'Couple' : 'Pasangan';
        labels.shortcutProfile = isEn ? 'Couple' : 'Pasangan';
        labels.searchPlaceholder = isEn ? 'Search anniversary blessings...' : 'Cari doa restu anniversary...';
        labels.writeBlessingPlaceholder = isEn ? 'Write your anniversary blessings...' : 'Tulis doa & ucapan terbaik untuk pasangan...';
    } else if (t === 'graduation') {
        labels.brandText = 'graduation';
        labels.brandSubtext = 'of';
        labels.profileHeader = isEn ? 'GRADUATE PROFILE' : 'PROFIL WISUDAWAN';
        labels.profileBadge = isEn ? 'Graduate' : 'Wisudawan';
        labels.shortcutProfile = isEn ? 'Graduate' : 'Wisudawan';
        labels.searchPlaceholder = isEn ? 'Search graduation blessings...' : 'Cari doa restu kelulusan...';
        labels.writeBlessingPlaceholder = isEn ? 'Write your graduation blessings...' : 'Tulis doa & ucapan terbaik untuk wisudawan...';
        labels.bannerLabels = isEn ? [
            "FREE SHIPPING CELEBRATION PRESENCE",
            "VOUCHER BLESSINGS MIN. TRANSACTION RP0",
            "SPECIAL LIVE STREAMING GRADUATION DAY"
        ] : [
            "GRATIS ONGKIR KEHADIRAN SYUKURAN",
            "VOUCHER DOA RESTU KELULUSAN RP0",
            "SPESIAL LIVE STREAMING HARI WISUDA"
        ];
    } else if (t === 'birthday') {
        labels.brandText = 'birthday';
        labels.brandSubtext = 'of';
        labels.profileHeader = isEn ? 'CELEBRANT PROFILE' : 'PROFIL YANG BERULANG TAHUN';
        labels.profileBadge = isEn ? 'Celebrant' : 'Ulang Tahun';
        labels.shortcutProfile = isEn ? 'Celebrant' : 'Ulang Tahun';
        labels.searchPlaceholder = isEn ? 'Search birthday blessings...' : 'Cari doa restu ulang tahun...';
        labels.writeBlessingPlaceholder = isEn ? 'Write your birthday blessings...' : 'Tulis doa & ucapan terbaik untuk yang berulang tahun...';
        labels.bannerLabels = isEn ? [
            "FREE SHIPPING PARTY PRESENCE",
            "VOUCHER BLESSINGS MIN. TRANSACTION RP0",
            "SPECIAL LIVE STREAMING BIRTHDAY PARTY"
        ] : [
            "GRATIS ONGKIR KEHADIRAN PESTA",
            "VOUCHER DOA RESTU PERTAMBAHAN USIA RP0",
            "SPESIAL LIVE STREAMING TIUP LILIN"
        ];
    } else if (t === 'aqiqah') {
        labels.brandText = 'aqiqah';
        labels.brandSubtext = 'of';
        labels.profileHeader = isEn ? 'BABY PROFILE' : 'PROFIL BUAH HATI';
        labels.profileBadge = isEn ? 'Baby' : 'Buah Hati';
        labels.shortcutProfile = isEn ? 'Baby' : 'Buah Hati';
        labels.searchPlaceholder = isEn ? 'Search aqiqah blessings...' : 'Cari doa restu aqiqah...';
        labels.writeBlessingPlaceholder = isEn ? 'Write your aqiqah blessings...' : 'Tulis doa & ucapan terbaik untuk buah hati...';
        labels.bannerLabels = isEn ? [
            "FREE SHIPPING AQIQAH PRESENCE",
            "VOUCHER BLESSINGS MIN. TRANSACTION RP0",
            "SPECIAL LIVE STREAMING AQIQAH CELEBRATION"
        ] : [
            "GRATIS ONGKIR KEHADIRAN AQIQAH",
            "VOUCHER DOA RESTU BUAH HATI RP0",
            "SPESIAL LIVE STREAMING SYUKURAN AQIQAH"
        ];
    } else if (t === 'circumcision') {
        labels.brandText = 'khitanan';
        labels.brandSubtext = 'of';
        labels.profileHeader = isEn ? 'CHILD PROFILE' : 'PROFIL PUTRA KHITAN';
        labels.profileBadge = isEn ? 'Child' : 'Putra Khitan';
        labels.shortcutProfile = isEn ? 'Child' : 'Putra Khitan';
        labels.searchPlaceholder = isEn ? 'Search circumcision blessings...' : 'Cari doa restu khitanan...';
        labels.writeBlessingPlaceholder = isEn ? 'Write your circumcision blessings...' : 'Tulis doa & ucapan terbaik untuk putra khitan...';
        labels.bannerLabels = isEn ? [
            "FREE SHIPPING CIRCUMCISION PRESENCE",
            "VOUCHER BLESSINGS MIN. TRANSACTION RP0",
            "SPECIAL LIVE STREAMING CIRCUMCISION DAY"
        ] : [
            "GRATIS ONGKIR KEHADIRAN KHITANAN",
            "VOUCHER DOA RESTU ANAK SHOLEH RP0",
            "SPESIAL LIVE STREAMING HARI KHITAN"
        ];
    }

    return {
        mainName,
        initials,
        isSingleHost,
        labels
    };
}

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(e) {
        return { hasError: true, error: e };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '24px', color: '#ee4d2d', background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', textAlign: 'center' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '16px' }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>Terjadi Kesalahan Visual</h2>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 16px 0', maxWidth: '300px' }}>Mohon maaf, terjadi kegagalan rendering saat memuat tema Shopinvity.</p>
                    <pre style={{ fontSize: '0.75rem', color: '#999', background: '#f5f5f5', padding: '12px', borderRadius: '6px', whiteSpace: 'pre-wrap', textAlign: 'left', maxWidth: '100%', overflowX: 'auto' }}>
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

/* ═══════════════════════════════════════
   PIXEL-PERFECT INLINE SVG ICONS (SHOPEE STYLE)
   ═══════════════════════════════════════ */
const ICONS = {
    search: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    qrScan: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#888888', cursor: 'pointer' }}>
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
            <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
    ),
    cart: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
    ),
    chat: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    
    // Bottom Navigation Icons (100% Shopinvity App Style)
    homeActive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff5722">
            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
        </svg>
    ),
    homeInactive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#95a5a6">
            <path d="M12 5.56L5.56 12H8v6h3v-4h2v4h3v-6h2.44L12 5.56M12 3l9 9h-3v8H6v-8H3l9-9z"/>
        </svg>
    ),
    
    videoActive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff5722">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM10 15.2V8.8L15 12l-5 3.2z"/>
        </svg>
    ),
    videoInactive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#95a5a6">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8zm-5-2.2l3-1.8-3-1.8v3.6z"/>
        </svg>
    ),
    liveActive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff5722">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            <circle cx="10" cy="12" r="3" fill="#ffffff"/>
        </svg>
    ),
    liveInactive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#95a5a6">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8z"/>
        </svg>
    ),
    
    bellActive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff5722">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
    ),
    bellInactive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#95a5a6">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
        </svg>
    ),
    
    profileActive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff5722">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
    ),
    profileInactive: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#95a5a6">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm-6 5c.22-1.35 3.12-2.1 6-2.1s5.78.75 6 2.1H6zM12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
        </svg>
    ),

    // Video Player Actions
    share: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    ),
    heartOutline: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    ),
    heartFilled: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ee4d2d' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    ),
    comment: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    ),

    // Menu Cepat (Highly Styled UI Icons)
    mempelaiMenu: (
        <svg viewBox="0 0 64 64" width="28" height="28" fill="none">
            <rect width="64" height="64" rx="20" fill="url(#gradMempelai)" />
            <path d="M32 14c-6.627 0-12 5.373-12 12 0 5.3 3.438 9.8 8.205 11.39l-3.205 8.61h14l-3.205-8.61C40.562 35.8 44 31.3 44 26c0-6.627-5.373-12-12-12zm0 4c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm-5 18c0-1.105.895-2 2-2h6c1.105 0 2 .895 2 2v2H27v-2z" fill="#ffffff" />
            <defs>
                <linearGradient id="gradMempelai" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff7a45" />
                    <stop offset="1" stopColor="#ff4d4f" />
                </linearGradient>
            </defs>
        </svg>
    ),
    akadMenu: (
        <svg viewBox="0 0 64 64" width="28" height="28" fill="none">
            <rect width="64" height="64" rx="20" fill="url(#gradAkad)" />
            <path d="M22 20h20v24H22V20zm3 5v3h14v-3H25zm0 6v3h14v-3H25zm0 6v3h8v-3h-8zm19-17h3v5h-3v-5zm0 8h3v5h-3V32zm0 8h3v5h-3v-5z" fill="#ffffff" />
            <defs>
                <linearGradient id="gradAkad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffc069" />
                    <stop offset="1" stopColor="#ffa940" />
                </linearGradient>
            </defs>
        </svg>
    ),
    kisahMenu: (
        <svg viewBox="0 0 64 64" width="28" height="28" fill="none">
            <rect width="64" height="64" rx="20" fill="url(#gradKisah)" />
            <path d="M42 16H22c-2.209 0-4 1.791-4 4v24c0 2.209 1.791 4 4 4h20c2.209 0 4-1.791 4-4V20c0-2.209-1.791-4-4-4zm-10 7c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6zm0 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" fill="#ffffff" />
            <defs>
                <linearGradient id="gradKisah" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#36cfc9" />
                    <stop offset="1" stopColor="#13c2c2" />
                </linearGradient>
            </defs>
        </svg>
    ),
    mapMenu: (
        <svg viewBox="0 0 64 64" width="28" height="28" fill="none">
            <rect width="64" height="64" rx="20" fill="url(#gradMap)" />
            <path d="M32 14c-6.627 0-12 5.373-12 12 0 7.375 9.778 21.674 11.205 23.688.397.56.193.56.59 0C36.222 47.674 46 33.375 46 26c0-6.627-5.373-12-12-12zm0 16c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="#ffffff" />
            <defs>
                <linearGradient id="gradMap" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#40a9ff" />
                    <stop offset="1" stopColor="#096dd9" />
                </linearGradient>
            </defs>
        </svg>
    )
};

/* ═══════════════════════════════════════
   COVER COMPONENT (RE-DESIGNED FOR MAX SHOPEE EXPRESS ACCURACY & DYNAMIC LANGUAGE)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, showGuestName }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', invitation?.language || 'id', brideGrooms, invitation);
    
    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = invitation?.cover_title || themeConfig.labels.coverTitle;

    const heroImg = getStorageUrl(invitation?.cover_image, '');

    // Dynamic translation check based on current active language configuration
    const isEn = invitation?.language === 'en';
    const receiverText = isEn ? "RECEIVER (DEAR GUEST):" : "KEPADA YTH. TAMU KEHORMATAN:";
    const openBtnText = isEn ? "Open Invitation" : "Buka Surat Undangan";
    // Apology note at bottom of cover
    const sorryText = isEn
        ? "We sincerely apologize if there are any errors in writing or the list of invitees."
        : "Mohon maaf apabila ada kesalahan penulisan nama atau gelar dalam undangan ini.";
    
    const footerText = isEn 
        ? `Checked by ${themeConfig.labels.profileBadge} Blessing Customs &bull; 100% Sealed Forever` 
        : `Telah Diperiksa Oleh Penjaga Pintu Restu &bull; Segel 100% Abadi`;

    return (
        <div className={`sp-cover${isOpened ? ' is-opened' : ''}`}>
            {invitation?.cover_image && (
                <PremiumSlideshow
                    images={invitation.cover_image.split(',')}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="sp-cover-bg"
                    imgClassName="absolute inset-0 w-full h-full object-cover"
                />
            )}
            <div className="sp-cover-gradient" />
            
            <div className="sp-cover-body">
                {/* 100% Text & Custom SVG Shopinvity Express logo style */}
                <div className="sp-cover-header-brand">
                    <svg className="sp-shopinvity-logo-svg" viewBox="0 0 24 24" width="30" height="30" fill="none">
                        <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9-1a2 2 0 0 1 4 0v1h-4V6z" fill="#ee4d2d"/>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ffffff" transform="translate(6, 9.5) scale(0.5)" />
                    </svg>
                    <span className="sp-brand-shopinvity">{themeConfig.labels.brandText}</span>
                    <span className="sp-brand-express">{themeConfig.labels.brandSubtext}</span>
                </div>

                <div className="sp-cover-package">
                    <h1 className="sp-package-couple">{coupleName}</h1>
                    
                    {showGuestName && guest && (
                        <div className="sp-package-guest-box">
                            <p className="sp-guest-label">{receiverText}</p>
                            <p className="sp-guest-name">{guestName}</p>
                        </div>
                    )}

                    <p className="sp-cover-sorry-note">{sorryText}</p>

                    <button onClick={onOpen} className="sp-open-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        {openBtnText}
                    </button>
                </div>
            </div>

            <div className="sp-cover-footer" dangerouslySetInnerHTML={{ __html: footerText }} />
        </div>
    );
}

/* ═══════════════════════════════════════
   TAB 1: BERANDA (HOME) COMPONENT
   ═══════════════════════════════════════ */
function HomeTab({ invitation, brideGrooms, events, loveStories, setActiveTab, formatCountdown, showCountdown }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', invitation?.language || 'id', brideGrooms, invitation);
    
    const groom = bgs.find(b => b.gender === 'pria' || b.gender === 'male' || String(b.gender).toLowerCase() === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita' || b.gender === 'female' || String(b.gender).toLowerCase() === 'wanita') || bgs[1] || {};

    const [activeBannerIdx, setActiveBannerIdx] = useState(0);
    const showPhotos = parseBool(invitation?.show_photos, true);

    const banners = safeArr(invitation?.galleries || []).slice(0, 3).map(g => getStorageUrl(g.image_url));
    if (banners.length === 0) {
        if (invitation?.opening_image) {
            banners.push(getStorageUrl(invitation.opening_image));
        } else if (invitation?.cover_image) {
            banners.push(getStorageUrl(invitation.cover_image));
        }
    }
    if (banners.length === 0) {
        banners.push('https://picsum.photos/450/200');
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBannerIdx(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0] || {};

    const isEn = invitation?.language === 'en';
    const bannerLabels = themeConfig.labels.bannerLabels;

    const shortcuts = [
        { label: themeConfig.labels.shortcutProfile, icon: ICONS.mempelaiMenu, action: () => { const el = document.getElementById('sp-mempelai-sec'); el?.scrollIntoView({ behavior: 'smooth' }); } },
        { label: isEn ? "Event Schedule" : "Acara", icon: ICONS.akadMenu, action: () => { setActiveTab('event'); } },
        { label: isEn ? "Wishes & RSVP" : "Ucapan & Doa", icon: ICONS.kisahMenu, action: () => { setActiveTab('notification'); } },
        { label: "Google Map", icon: ICONS.mapMenu, action: () => { setActiveTab('event'); } }
    ];

    const showPhotosState = showPhotos ? '' : 'sp-no-photo-mode';

    return (
        <div className={`sp-home-scroll ${showPhotosState}`}>
            {/* Banner Slider */}
            <div className="sp-banner-slider">
                {showPhotos && (
                    <img src={banners[activeBannerIdx]} alt="Event Banner" className="sp-banner-image" />
                )}
                {!showPhotos && (
                    <div className="sp-photo-placeholder" style={{ width: '100%', height: '100%' }}>Foto Dinonaktifkan</div>
                )}
                <div className="sp-banner-overlay">
                    <span className="sp-banner-badge">{bannerLabels[activeBannerIdx % bannerLabels.length]}</span>
                    <p className="sp-banner-text">{themeConfig.mainName}</p>
                </div>
                <div className="sp-banner-indicators">
                    {banners.map((_, idx) => (
                        <div key={idx} className={`sp-indicator-dot ${idx === activeBannerIdx ? 'is-active' : ''}`} />
                    ))}
                </div>
            </div>

            {/* WeddingPay Bar */}
            <div className="sp-wallet-bar">
                <div className="sp-wallet-info">
                    <div className="sp-pay-logo">
                        <span className="sp-pay-icon" style={{ color: '#ee4d2d' }}>{ICONS.shopinvityPay}</span>
                        <span className="sp-pay-brand" style={{ color: '#ee4d2d' }}>GiftPay</span>
                    </div>
                    <div className="sp-pay-details">
                        <span className="sp-wallet-label" style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>
                            {isEn ? "Transfer Gifts & Digital Envelopes" : "Transfer Hadiah & Kado Digital"}
                        </span>
                    </div>
                </div>
                <button className="sp-wallet-action" onClick={() => setActiveTab('profile')}>
                    {isEn ? "Send Gift" : "Kirim Kado"}
                </button>
            </div>

            {/* Shortcut Grid */}
            <div className="sp-grid-shortcuts">
                {shortcuts.map((s, idx) => (
                    <button key={idx} className="sp-shortcut-item" onClick={s.action}>
                        <div style={{ marginBottom: '6px' }}>
                            {s.icon}
                        </div>
                        <span className="sp-shortcut-label">{s.label}</span>
                    </button>
                ))}
            </div>

            {/* Shopinvity Mall Mempelai Profile - PROFIL DULU sebelum acara */}
            <div className="sp-mall-section" id="sp-mempelai-sec">
                <div className="sp-mall-header">
                    <span className="sp-mall-badge" style={{ background: '#ee4d2d' }}>{themeConfig.labels.profileBadge}</span>
                    <span className="sp-mall-title">{themeConfig.labels.profileHeader}</span>
                </div>

                <div className={`sp-mall-couple-grid ${themeConfig.isSingleHost ? 'sp-single-host-grid' : ''}`}>
                    {themeConfig.isSingleHost ? (
                        bgs[0] && (
                            <div className="sp-couple-card sp-single-host-card">
                                <div className="sp-couple-photo-wrap">
                                    {showPhotos && bgs[0].photo ? (
                                        <img src={getStorageUrl(bgs[0].photo)} alt={bgs[0].full_name} className="sp-couple-photo" />
                                    ) : (
                                        <div className="sp-photo-placeholder" style={{ width: '100%', height: '100%' }}>Foto Profil</div>
                                    )}
                                </div>
                                <div className="sp-couple-info">
                                    <div className="sp-couple-tag-row">
                                        <span className="sp-couple-label">{themeConfig.labels.profileBadge}</span>
                                    </div>
                                    <h4 className="sp-couple-fullname">{bgs[0].full_name}</h4>
                                    <p className="sp-couple-son-daughter">
                                        {isEn 
                                            ? `${bgs[0].gender === 'pria' || bgs[0].gender === 'male' ? 'Son' : 'Daughter'} number ${bgs[0].child_order || '1'} of Mr. ${bgs[0].father_name || '...'} & Mrs. ${bgs[0].mother_name || '...'}`
                                            : `${bgs[0].gender === 'pria' || bgs[0].gender === 'male' ? 'Putra' : 'Putri'} ${bgs[0].child_order || 'Pertama'} dari Bapak ${bgs[0].father_name || '...'} & Ibu ${bgs[0].mother_name || '...'}`}
                                    </p>
                                    {bgs[0].instagram && (
                                        <a href={`https://instagram.com/${bgs[0].instagram}`} target="_blank" rel="noreferrer" className="sp-couple-ig">
                                            {isEn ? "Instagram >" : "Kunjungi IG >"}
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    ) : (
                        <>
                            {groom.full_name && (
                                <div className="sp-couple-card">
                                    <div className="sp-couple-photo-wrap">
                                        {showPhotos && groom.photo ? (
                                            <img src={getStorageUrl(groom.photo)} alt={groom.full_name} className="sp-couple-photo" />
                                        ) : (
                                            <div className="sp-photo-placeholder" style={{ width: '100%', height: '100%' }}>Pria Terganteng</div>
                                        )}
                                    </div>
                                    <div className="sp-couple-info">
                                        <div className="sp-couple-tag-row">
                                            <span className="sp-couple-label">{isEn ? "GROOM" : "PRIA"}</span>
                                        </div>
                                        <h4 className="sp-couple-fullname">{groom.full_name}</h4>
                                        <p className="sp-couple-son-daughter">
                                            {isEn ? `Son number ${groom.child_order || '1'} of Mr. ${groom.father_name || '...'} & Mrs. ${groom.mother_name || '...'}` : `Putra ${groom.child_order || 'Pertama'} dari Bapak ${groom.father_name || '...'} & Ibu ${groom.mother_name || '...'}`}
                                        </p>
                                        {groom.instagram && (
                                            <a href={`https://instagram.com/${groom.instagram}`} target="_blank" rel="noreferrer" className="sp-couple-ig">
                                                {isEn ? "Instagram >" : "Kunjungi IG >"}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {bride.full_name && (
                                <div className="sp-couple-card">
                                    <div className="sp-couple-photo-wrap">
                                        {showPhotos && bride.photo ? (
                                            <img src={getStorageUrl(bride.photo)} alt={bride.full_name} className="sp-couple-photo" />
                                        ) : (
                                            <div className="sp-photo-placeholder" style={{ width: '100%', height: '100%' }}>Wanita Tercantik</div>
                                        )}
                                    </div>
                                    <div className="sp-couple-info">
                                        <div className="sp-couple-tag-row">
                                            <span className="sp-couple-label">{isEn ? "BRIDE" : "WANITA"}</span>
                                        </div>
                                        <h4 className="sp-couple-fullname">{bride.full_name}</h4>
                                        <p className="sp-couple-son-daughter">
                                            {isEn ? `Daughter number ${bride.child_order || '1'} of Mr. ${bride.father_name || '...'} & Mrs. ${bride.mother_name || '...'}` : `Putri ${bride.child_order || 'Pertama'} dari Bapak ${bride.father_name || '...'} & Ibu ${bride.mother_name || '...'}`}
                                        </p>
                                        {bride.instagram && (
                                            <a href={`https://instagram.com/${bride.instagram}`} target="_blank" rel="noreferrer" className="sp-couple-ig">
                                                {isEn ? "Instagram >" : "Kunjungi IG >"}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Rangkaian Acara - Flash Sale (setelah profil mempelai) */}
            {primaryEvent.event_date && (
                <div className="sp-flash-sale-box">
                    <div className="sp-flash-sale-header">
                        <div className="sp-flash-left">
                            <span style={{ fontSize: '1rem', fontWeight: '900', color: '#ee4d2d', letterSpacing: '0.5px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                FLASH SALE
                            </span>
                            {showCountdown && (
                                <div className="sp-flash-timer">
                                    <span className="sp-time-unit">{formatCountdown.d} {isEn ? "Days" : "Hari"}</span>
                                    <span className="sp-timer-colon">:</span>
                                    <span className="sp-time-unit">{formatCountdown.h} {isEn ? "Hours" : "Jam"}</span>
                                    <span className="sp-timer-colon">:</span>
                                    <span className="sp-time-unit">{formatCountdown.m} {isEn ? "Mins" : "Menit"}</span>
                                </div>
                            )}
                        </div>
                        <div className="sp-flash-right" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('event')}>
                            {isEn ? "View Schedule" : "Lihat Jadwal"} &gt;
                        </div>
                    </div>

                    <div className="sp-flash-sale-body">
                        {safeArr(events).map((e, idx) => {
                            return (
                                <div key={idx} className="sp-flash-product-card">
                                    <div className="sp-product-img-wrap">
                                        {showPhotos && e.image ? (
                                            <img src={getStorageUrl(e.image)} alt={e.event_name} className="sp-product-image" />
                                        ) : showPhotos && banners[0] ? (
                                            <img src={banners[0]} alt={e.event_name} className="sp-product-image" />
                                        ) : (
                                            <div className="sp-photo-placeholder" style={{ width: '100%', height: '100%' }}>Foto Acara</div>
                                        )}
                                        <div className="sp-product-label">100% HALAL</div>
                                    </div>
                                    <div className="sp-product-info">
                                        <span className="sp-product-price" style={{ fontSize: '0.75rem', color: '#ee4d2d' }}>{e.event_name}</span>
                                        <p style={{ fontSize: '0.65rem', color: '#7f8c8d', margin: '2px 0' }}>{formatDate(e.event_date)}</p>
                                        <div className="sp-product-bar-wrap">
                                            <div className="sp-product-bar" style={{ width: '100%' }}></div>
                                            <span className="sp-product-bar-text">{isEn ? "COMING SOON" : "SEGERA HADIR"}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Lembaran Kisah Cinta */}
            {loveStories?.length > 0 && (
                <div className="sp-reviews-box" id="sp-reviews">
                    <div className="sp-reviews-header">
                        <span className="sp-reviews-title">{isEn ? "OUR DIARY LOVE STORY" : "CATATAN KISAH CINTA KAMI"}</span>
                        <div className="sp-reviews-stats">
                            <span>❤️ 5.0 / 5.0</span>
                            <span style={{ fontSize: '0.72rem', color: '#888', fontWeight: 'normal' }}>({loveStories.length} {isEn ? "Chapters" : "Bab"})</span>
                        </div>
                    </div>

                    <div className="sp-reviews-list">
                        {safeArr(loveStories).map((s, idx) => (
                            <div key={idx} className="sp-review-card">
                                <div className="sp-review-user-row">
                                    <div className="sp-review-avatar">💑</div>
                                    <div className="sp-review-user-info">
                                        <span className="sp-review-username">{isEn ? "Chapter" : "Bab"} {idx + 1}: {s.title}</span>
                                        <div className="sp-review-stars">❤️❤️❤️❤️❤️</div>
                                    </div>
                                </div>
                                <div className="sp-review-meta">{isEn ? "Variation: Eternal Loyalty | Deep Love Rating" : "Variasi: Kesetiaan Abadi | Penilaian Hati Mendalam"}</div>
                                <h5 className="sp-review-title">{isEn ? "Act" : "Babak"} {s.title}</h5>
                                <p className="sp-review-body">{s.description || s.story}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Watermark/Branding Footer */}
            <div className="sp-watermark-footer" style={{
                padding: '40px 16px 80px',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #f4f5f6',
                color: '#888888',
                fontSize: '0.75rem',
            }}>
                Made with ❤️ by {invitation?.user?.reseller_settings?.brand_name || invitation?.user?.reseller?.reseller_settings?.brand_name || 'TrueLove Invitation'}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   TAB 2: GALLERY (SHOPEE VIDEO STYLE)
   ═══════════════════════════════════════ */
function VideoTab({ invitation, galleries, setActiveTab }) {
    const showPhotos = parseBool(invitation?.show_photos, true);
    const safeGalleries = safeArr(galleries);

    const [likes, setLikes] = useState({});
    const toggleLike = (idx) => {
        setLikes(prev => {
            const current = !!prev[idx];
            return {
                ...prev,
                [idx]: !current
            };
        });
    };

    const isEn = invitation?.language === 'en';

    const slides = safeGalleries.length > 0 ? safeGalleries : [
        { image_url: invitation?.cover_image, caption: "Selamat menempuh hidup baru suci!" }
    ];

    return (
        <div className="sp-video-tab">
            <div className="sp-video-header">
                <button className="sp-video-top-tab is-active">{isEn ? "Gallery" : "Galeri"}</button>
                <button className="sp-video-top-tab" onClick={() => setActiveTab('notification')}>
                    <span className="sp-live-badge-glow">💌 {isEn ? "RSVP & Wishes" : "RSVP & Ucapan"}</span>
                </button>
            </div>

            <div className="sp-video-scroller">
                {slides.map((s, idx) => {
                    const isLiked = !!likes[idx];
                    const likeCount = isLiked ? 501 : 500;
                    return (
                        <div key={idx} className="sp-video-slide">
                            <div className="sp-video-media-wrap">
                                {showPhotos && s.image_url ? (
                                    <img src={getStorageUrl(s.image_url)} alt="Video Slide" className="sp-video-img" />
                                ) : (
                                    <div className="sp-photo-placeholder" style={{ width: '100%', height: '100%', color: '#fff', background: '#111' }}>
                                        Mode Foto Dinonaktifkan
                                    </div>
                                )}
                            </div>
                            
                            <div className="sp-video-overlay-dark" />

                            <div className="sp-video-actions-sidebar">
                                <button className={`sp-v-action-btn ${isLiked ? 'is-liked' : ''}`} onClick={() => toggleLike(idx)}>
                                    <div className="sp-v-action-icon-wrap">
                                        {isLiked ? ICONS.heartFilled : ICONS.heartOutline}
                                    </div>
                                    <span className="sp-v-action-label">{likeCount}</span>
                                </button>

                                <button className="sp-v-action-btn" onClick={() => setActiveTab('notification')}>
                                    <div className="sp-v-action-icon-wrap">
                                        {ICONS.comment}
                                    </div>
                                    <span className="sp-v-action-label">{isEn ? "Wishes" : "Ucapan"}</span>
                                </button>

                                <button className="sp-v-action-btn" onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ title: 'Undangan Pernikahan', url: window.location.href });
                                    } else {
                                        alert('Link undangan berhasil disalin!');
                                    }
                                }}>
                                    <div className="sp-v-action-icon-wrap">
                                        {ICONS.share}
                                    </div>
                                    <span className="sp-v-action-label">{isEn ? "Share" : "Bagikan"}</span>
                                </button>
                            </div>

                            <div className="sp-video-desc-box">
                                <p className="sp-v-author">
                                    @{invitation?.slug || 'mempelai_bahagia'}
                                    <span className="sp-v-author-tag">{isEn ? "Couple" : "Mempelai"}</span>
                                </p>
                                <p className="sp-v-caption">
                                    {s.caption || s.description || "Kami mengundang Anda untuk merayakan kebahagiaan suci sakral pernikahan kami."}
                                </p>
                                <p className="sp-v-hashtags">#PreweddingDay #HalalCircle #ShopinvityWedding</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   TAB 3: ACARA (EVENTS & GOOGLE MAPS - SHOPEE LIVE STYLE)
   ═══════════════════════════════════════ */
function LiveTab({ invitation, events }) {
    const safeEvents = safeArr(events);
    const isEn = invitation?.language === 'en';
    const heroImg = getStorageUrl(invitation?.opening_image || invitation?.cover_image, '');

    // Floating hearts simulation
    const [hearts, setHearts] = useState([]);
    const addHeart = () => {
        const id = Date.now() + Math.random();
        setHearts(prev => [...prev, { id, left: Math.random() * 80 + 10 }]);
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== id));
        }, 2000);
    };

    // Auto add floating hearts on live stream
    useEffect(() => {
        const iv = setInterval(addHeart, 800);
        return () => clearInterval(iv);
    }, []);

    const comments = isEn ? [
        { user: "r*****a", text: "Wishing you a lifetime of love and happiness! ❤️" },
        { user: "j*****n", text: "So beautiful! Happy Wedding! 🎉" },
        { user: "a*****i", text: "Can't wait to see you guys on the stage! 😍" },
        { user: "d*****o", text: "Claiming the maps now! 🚗" }
    ] : [
        { user: "a*****d", text: "Barakallah! Semoga sakinah mawaddah warahmah ya! ❤️" },
        { user: "s*****i", text: "Cantik banget dekorasinya! Happy Wedding! 🎉" },
        { user: "r*****o", text: "Otw lokasi nih, maps-nya akurat banget! 🚗" },
        { user: "m*****a", text: "Selamat menempuh hidup baru mempelai bahagia! 😍" }
    ];

    return (
        <div className="sp-live-tab">
            {/* Simulated Live Stream Player */}
            <div className="sp-live-player-box relative overflow-hidden">
                {invitation?.opening_image || invitation?.cover_image ? (
                    <PremiumSlideshow
                        images={invitation?.opening_image ? invitation.opening_image.split(',') : (invitation?.cover_image ? invitation.cover_image.split(',') : [])}
                        positionX={invitation?.opening_position_x ?? invitation?.cover_position_x}
                        positionY={invitation?.opening_position_y ?? invitation?.cover_position_y}
                        zoom={invitation?.opening_zoom ?? invitation?.cover_zoom}
                        className="absolute inset-0 w-full h-full z-0"
                        imgClassName="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="sp-photo-placeholder" style={{ width: '100%', height: '100%', background: '#111' }}>Live Frame</div>
                )}
                
                {/* Live Overlays */}
                <div className="sp-live-badge-overlay">
                    <span className="sp-live-red-dot">●</span>
                    <span className="sp-live-text-label">LIVE</span>
                    <span className="sp-live-views">👁️ 9.9K</span>
                </div>

                <div className="sp-live-host-tag">
                    <div className="sp-host-avatar">💑</div>
                    <div className="sp-host-name">
                        <span className="sp-host-title">@{invitation?.slug || 'mempelai_bahagia'}</span>
                        <span className="sp-host-status">{isEn ? "Streaming Live" : "Sedang Siaran"}</span>
                    </div>
                </div>

                {/* Floating Hearts Container */}
                <div className="sp-live-hearts-container">
                    {hearts.map(h => (
                        <div key={h.id} className="sp-floating-heart" style={{ left: `${h.left}%` }}>
                            ❤️
                        </div>
                    ))}
                </div>

                {/* Floating Comments Overlay */}
                <div className="sp-live-comments-box">
                    {comments.map((c, idx) => (
                        <div key={idx} className="sp-live-comment-item">
                            <span className="sp-comment-user">{c.user}</span>
                            <span className="sp-comment-text">{c.text}</span>
                        </div>
                    ))}
                </div>

                {/* Simulated Interaction Button */}
                <button className="sp-live-like-btn" onClick={addHeart}>
                    💖
                </button>
            </div>

            {/* Live Shopping Cart Section */}
            <div className="sp-live-cart-section">
                <div className="sp-cart-header">
                    <span className="sp-cart-icon">🛒</span>
                    <span className="sp-cart-title">{isEn ? "Wedding Event Tickets" : "Keranjang Belanja Tiket Acara"}</span>
                </div>

                <div className="sp-cart-list">
                    {safeEvents.map((ev, idx) => {
                        const isMapsActive = ev.gmaps_link || ev.map_url;
                        return (
                            <div key={idx} className="sp-cart-product-item">
                                <div className="sp-cart-prod-num">{idx + 1}</div>
                                <div className="sp-cart-prod-details">
                                    <h4 className="sp-cart-prod-title">⭐ {ev.event_name || 'Rangkaian Acara'}</h4>
                                    <p className="sp-cart-prod-desc">{ev.venue_name}</p>
                                    <div className="sp-cart-price-row">
                                        <span className="sp-cart-price-discount">{isEn ? "FREE VIP ENTRY" : "TIKET GRATIS VIP"}</span>
                                        <span className="sp-cart-price-original">Rp 150.000</span>
                                    </div>
                                    <div className="sp-cart-prod-meta">
                                        📅 {formatDate(ev.event_date)} | ⏰ {formatTime(ev.start_time)} WIB
                                    </div>
                                </div>
                                {isMapsActive && (
                                    <a href={ev.gmaps_link || ev.map_url} target="_blank" rel="noreferrer" className="sp-cart-claim-btn">
                                        {isEn ? "Claim Maps" : "Klaim Maps"}
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Alamat Pengiriman Alamat Penerima Visual */}
            {safeEvents.map((ev, idx) => (
                <div key={idx} className="sp-live-address-card">
                    <div className="sp-address-header">
                        <span className="sp-address-icon">🚚</span>
                        <span className="sp-address-title">{isEn ? "SHIPPING VENUE DETAILS" : "RINCIAN ALAMAT LOKASI ACARA"}</span>
                    </div>
                    <div className="sp-address-body">
                        <p className="sp-address-name">Penerima Restu: {ev.event_name || 'Acara'}</p>
                        <p className="sp-address-phone">Jasa Kirim: Shopinvity Express Wedding</p>
                        <p className="sp-address-detail">
                            <strong>{ev.venue_name}</strong> - {ev.venue_address}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   TAB 4: UCAPAN & RSVP (SHOPEE CHECKOUT / FORM ORDER STYLE)
   ═══════════════════════════════════════ */
function NotifTab({ invitation, wishes, guest, enableRsvp, enableWishes }) {
    const activeGuest = guest || { name: '', id: null };

    const [sharedName, setSharedName] = useState(activeGuest.name || '');
    const [attendance, setAttendance] = useState('hadir');
    const [numGuests, setNumGuests] = useState(1);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [rating, setRating] = useState(5); // Default 5 Stars!

    const rsvpForm = useForm({
        sender_name: activeGuest.name || '',
        attendance: 'hadir',
        number_of_guests: 1,
        guest_id: activeGuest.id || null,
    });

    const wishForm = useForm({
        sender_name: activeGuest.name || '',
        message: '',
        guest_id: activeGuest.id || null,
    });

    const isEn = invitation?.language === 'en';

    const handleSubmit = (e) => {
        e.preventDefault();
        rsvpForm.setData('sender_name', sharedName);
        rsvpForm.setData('attendance', attendance);
        rsvpForm.setData('number_of_guests', numGuests);
        
        wishForm.setData('sender_name', sharedName);
        wishForm.setData('message', message);

        const doWishSubmit = () => {
            if (enableWishes && message.trim()) {
                wishForm.post(route('invitation.wish', invitation.slug), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setMessage('');
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 5000);
                    }
                });
            } else {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
            }
        };

        if (enableRsvp) {
            rsvpForm.post(route('invitation.rsvp', invitation.slug), {
                preserveScroll: true,
                onSuccess: doWishSubmit,
            });
        } else {
            doWishSubmit();
        }
    };

    const isSubmitting = rsvpForm.processing || wishForm.processing;
    const recentWishes = safeArr(wishes);

    return (
        <div className="sp-notif-tab">
            {/* Shopinvity-style Order/Checkout Header */}
            <div className="sp-rsvp-checkout-header">
                <div className="sp-checkout-store-row">
                    <span className="sp-checkout-store-badge">🎉</span>
                    <span className="sp-checkout-store-name">{invitation?.type === 'wedding' ? (isEn ? "Wedding Ceremony" : "Pernikahan") : (isEn ? "Event Celebration" : "Perayaan Acara")}</span>
                    <span className="sp-checkout-preferred">Preferred</span>
                </div>
                <div className="sp-checkout-item-row">
                    <div className="sp-checkout-item-img">💌</div>
                    <div className="sp-checkout-item-desc">
                        <p className="sp-checkout-item-name">{isEn ? "Blessing Package (RSVP)" : "Paket Doa Restu & Konfirmasi Hadir"}</p>
                        <p className="sp-checkout-item-variant">{isEn ? "Variation: Attend & Send Blessing" : "Variasi: Hadir & Kirim Doa"}</p>
                    </div>
                    <span className="sp-checkout-item-qty">x1</span>
                </div>
            </div>

            {(enableRsvp || enableWishes) && (
                <div className="sp-rsvp-box">
                    <div className="sp-rsvp-title-row">
                        <span className="sp-rsvp-heading">📝 {isEn ? "Complete Your Order" : "Lengkapi Pesanan Anda"}</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Shopinvity-style name field */}
                        <div className="sp-checkout-field-group">
                            <div className="sp-checkout-field-label">{isEn ? "Buyer Name" : "Nama Pembeli"}</div>
                            <input
                                type="text"
                                className="sp-input-text"
                                placeholder={isEn ? "Enter your name..." : "Masukkan nama Anda..."}
                                required
                                readOnly={!!activeGuest.name}
                                value={sharedName}
                                onChange={e => setSharedName(e.target.value)}
                            />
                        </div>

                        {enableRsvp && (
                            <div className="sp-checkout-field-group">
                                <div className="sp-checkout-field-label">{isEn ? "Select Variation" : "Pilih Variasi"}</div>
                                <div className="sp-rsvp-options">
                                    {[
                                        { key: 'hadir', emoji: '✅', label: isEn ? 'Hadir' : 'Hadir' },
                                        { key: 'tidak_hadir', emoji: '❌', label: isEn ? 'Tidak Hadir' : 'Tidak Hadir' },
                                        { key: 'masih_ragu', emoji: '🤔', label: isEn ? 'Masih Ragu' : 'Masih Ragu' }
                                    ].map(opt => (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            className={`sp-rsvp-opt-btn ${attendance === opt.key ? 'is-active' : ''}`}
                                            onClick={() => setAttendance(opt.key)}
                                        >
                                            {opt.emoji} {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {enableRsvp && attendance === 'hadir' && (
                            <div className="sp-checkout-field-group">
                                <div className="sp-checkout-field-label">{isEn ? "Number of Guests (Qty)" : "Jumlah Tamu (Qty)"}</div>
                                <div className="sp-qty-control">
                                    <button type="button" className="sp-qty-btn" onClick={() => setNumGuests(Math.max(1, numGuests - 1))}>−</button>
                                    <span className="sp-qty-value">{numGuests}</span>
                                    <button type="button" className="sp-qty-btn" onClick={() => setNumGuests(Math.min(10, numGuests + 1))}>+</button>
                                </div>
                            </div>
                        )}

                        {enableWishes && (
                            <div className="sp-checkout-field-group">
                                <div className="sp-checkout-field-label">{isEn ? "Message / Blessing" : "Pesan / Ucapan Doa"}</div>
                                <textarea
                                    className="sp-input-text"
                                    placeholder={invitation?.type === 'wedding' ? (isEn ? "Write your wedding blessings..." : "Tulis doa & ucapan terbaik untuk kedua mempelai...") : (isEn ? "Write your blessings..." : "Tulis doa & ucapan terbaik...")}
                                    rows="3"
                                    required={!enableRsvp}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Order Summary */}
                        <div className="sp-checkout-summary">
                            <div className="sp-checkout-summary-row">
                                <span>{isEn ? "Merchandise Subtotal" : "Subtotal Produk"}</span>
                                <span style={{ color: '#ee4d2d', fontWeight: 'bold' }}>Rp 0</span>
                            </div>
                            <div className="sp-checkout-summary-row">
                                <span>{isEn ? "Shipping" : "Ongkos Kirim"}</span>
                                <span style={{ color: '#27ae60', fontWeight: 'bold' }}>{isEn ? "FREE" : "GRATIS"}</span>
                            </div>
                            <div className="sp-checkout-summary-row sp-checkout-total">
                                <span>{isEn ? "Order Total" : "Total Pesanan"}</span>
                                <span style={{ color: '#ee4d2d', fontWeight: 'bold', fontSize: '1rem' }}>Rp 0</span>
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="sp-form-submit">
                            {isSubmitting 
                                ? (isEn ? "⏳ PLACING ORDER..." : "⏳ MEMPROSES PESANAN...")
                                : (isEn ? "🛒 PLACE ORDER (SEND BLESSING)" : "🛒 BUAT PESANAN (KIRIM DOA)")}
                        </button>

                        {success && (
                            <div className="sp-form-success">
                                ✅ {isEn ? "Order placed! Your blessings have been sent successfully!" : "Pesanan berhasil! Doa & ucapan Anda telah terkirim!"}
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Daftar Ucapan / Reviews */}
            {enableWishes && recentWishes.length > 0 && (
                <div className="sp-chat-list-box">
                    <div className="sp-checkout-reviews-header">
                        <span className="sp-reviews-count-badge">{recentWishes.length}</span>
                        <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700' }}>
                            {isEn ? "Buyer Reviews" : "Ulasan Pembeli"}
                        </h3>
                        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#ff5722', fontWeight: 'bold' }}>⭐ 5.0</span>
                    </div>

                    <div className="sp-chat-scroller">
                        {recentWishes.map((w, idx) => {
                            const rawName = w.sender_name || w.name || 'Tamu Undangan';
                            let maskedName = rawName;
                            if (rawName.length > 2) {
                                maskedName = rawName.charAt(0) + "*****" + rawName.charAt(rawName.length - 1);
                            }
                            return (
                                <div key={idx} className="sp-review-card-shopinvity">
                                    <div className="sp-chat-item">
                                        <div className="sp-chat-avatar">
                                            {rawName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="sp-chat-body">
                                            <div className="sp-chat-sender">
                                                <span>{maskedName}</span>
                                                <span className="sp-chat-tag">✓ {isEn ? "Verified" : "Terverifikasi"}</span>
                                            </div>
                                            <div className="sp-review-stars-row">⭐⭐⭐⭐⭐</div>
                                            <div className="sp-review-variation-text">
                                                {isEn ? "Variation: Attend & Bless" : "Variasi: Hadir & Kirim Doa"}
                                            </div>
                                            <p className="sp-chat-msg">{w.message}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════
   TAB 5: SAYA / KADO (GUEST PROFILE & E-WALLET / REKENING PERNIKAHAN)
   ═══════════════════════════════════════ */
function ProfileTab({ invitation, bankAccounts, guest }) {
    const accounts = safeArr(bankAccounts);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const isEn = invitation?.language === 'en';

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const copyToClipboard = (text, idx) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2500);
            }).catch(() => {
                fallbackCopy(text, idx);
            });
        } else {
            fallbackCopy(text, idx);
        }
    };

    const fallbackCopy = (text, idx) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);

        try {
            const successful = document.execCommand('copy');
            selection.removeAllRanges();
            document.body.removeChild(textArea);
            if (successful) {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2500);
            }
        } catch (err) {
            console.error('Fallback copy failed', err);
            selection.removeAllRanges();
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="sp-profile-tab">
            {/* Shopinvity Style Profile Header */}
            <div className="sp-profile-card">
                <div className="sp-profile-pattern" />
                <div className="sp-profile-avatar-circle">
                    👤
                </div>
                <div className="sp-profile-details">
                    <h3 className="sp-profile-username">{guestName}</h3>
                    <div className="sp-profile-tier">
                        👑 {isEn ? "Platinum Member" : "Anggota VIP Platinum"}
                    </div>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
                        {isEn ? "Followers: 999 | Following: 99" : "Pengikut: 999 | Mengikuti: 99"}
                    </span>
                </div>
            </div>

            {/* WeddingPay, Koin Cinta, & SPayLater grid */}
            <div className="sp-profile-pay-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: '#ffffff', padding: '12px', textAlign: 'center', borderBottom: '1px solid #f1f2f6', marginBottom: '10px' }}>
                <div style={{ borderRight: '1px solid #f1f2f6' }}>
                    <p style={{ margin: 0, fontSize: '0.62rem', color: '#888' }}>WeddingPay</p>
                    <h4 style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#ff5722', fontWeight: 'bold' }}>Rp ∞</h4>
                </div>
                <div style={{ borderRight: '1px solid #f1f2f6' }}>
                    <p style={{ margin: 0, fontSize: '0.62rem', color: '#888' }}>Koin Cinta</p>
                    <h4 style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#ffb300', fontWeight: 'bold' }}>999K</h4>
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: '0.62rem', color: '#888' }}>SPayLater</p>
                    <h4 style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#2ecc71', fontWeight: 'bold' }}>{isEn ? "Active" : "Aktif"}</h4>
                </div>
            </div>

            {/* SeaBank / Wallet digital gift card (Metode Pembayaran Tersimpan) */}
            {accounts.length > 0 && (
                <div className="sp-seabank-gift-box">
                    <div className="sp-wallet-card-header">
                        <div className="sp-wallet-header-left">
                            💳 {isEn ? "Saved Payment Cards (Wedding Gift)" : "Kartu Metode Pembayaran (Hadiah Digital)"}
                        </div>
                    </div>
                    <div className="sp-wallet-card-body">
                        {accounts.map((acc, idx) => (
                            <div key={idx} className="sp-gift-account-item" style={{ background: '#fcfcfc', border: '1px solid #f1f2f6', borderRadius: '8px', padding: '14px', marginBottom: '12px' }}>
                                <span className="sp-bank-badge" style={{ background: '#3498db', fontSize: '0.65rem' }}>{acc.bank_name || 'E-Wallet'}</span>
                                <p className="sp-account-number" style={{ fontSize: '1.15rem', margin: '6px 0', fontWeight: '800' }}>{acc.account_number}</p>
                                <p className="sp-account-holder" style={{ margin: 0 }}>a.n. {acc.account_holder || acc.account_name}</p>
                                <button className="sp-copy-btn" onClick={() => copyToClipboard(acc.account_number, idx)}>
                                    {copiedIdx === idx ? (isEn ? "✓ Copied" : "✓ Berhasil Disalin") : (isEn ? "Copy Card Number" : "Salin No. Rekening")}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN THEME EXPORT COMPONENT (PURE VIEWPORT HEIGHT SCROLL ISOLATION)
   ═══════════════════════════════════════ */
function ShopinvityThemeContent({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const [isOpened, setIsOpened] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(invitation?.enable_auto_scroll !== false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);

    const musicUrl = invitation?.music_url || null;
    const musicAutoplay = parseBool(invitation?.music_autoplay);

        const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };
    const isEn = invitation?.language === 'en';

    const themeConfig = getThemeLabels(invitation?.type || 'wedding', invitation?.language || 'id', brideGrooms, invitation);

    useEffect(() => {
        if (themeConfig.mainName) {
            document.title = themeConfig.mainName + (invitation?.type ? ` - ${themeConfig.labels.profileBadge}` : '');
        }
    }, [themeConfig, invitation]);

    const showGuestName = parseBool(invitation?.show_guest_name, true);
    const showCountdown = parseBool(invitation?.show_countdown, true);
    const showAnimations = parseBool(invitation?.show_animations, true);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    const [showQr, setShowQr] = useState(false);

    const handleOpen = useCallback(() => {
        setIsOpened(true);
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (audioRef.current && musicAutoplay) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, [musicAutoplay]);

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, [isPlaying]);

    // Countdown Timer
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0 });

    useEffect(() => {
        if (!primaryEvent?.event_date) return;
        const ds = String(primaryEvent.event_date).substring(0, 10);
        const timeStr = primaryEvent.start_time ? primaryEvent.start_time.substring(0, 5) : '08:00';
        const target = new Date(`${ds}T${timeStr}:00`);
        if (isNaN(target.getTime())) return;

        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) {
                setCountdown({ d: 0, h: 0, m: 0 });
                return;
            }
            setCountdown({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000)
            });
        };

        tick();
        const iv = setInterval(tick, 60000); 
        return () => clearInterval(iv);
    }, [primaryEvent]);

    // Auto Scroll simulated in Beranda
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled || activeTab !== 'home') return;
        
        const scrollContainer = document.getElementById('sp-home-viewport-scroller');
        if (!scrollContainer) return;

        const interval = setInterval(() => {
            scrollContainer.scrollBy(0, 1);
            const isBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 5;
            if (isBottom) {
                setAutoScrollEnabled(false);
            }
        }, 35);

        return () => clearInterval(interval);
    }, [isOpened, autoScrollEnabled, activeTab]);

    return (
        <ErrorBoundary>
            <div className={`sp-theme-wrapper${!showAnimations ? ' sp-no-animations' : ''}`}>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

                {musicUrl && (
                    <audio ref={audioRef} loop preload="auto" playsInline src={musicUrl} />
                )}

                <div className="sp-mobile-container">
                    {/* 1. Cover Section overlay (resets to absolute fill, blocks interaction before opening) */}
                    <CoverSection
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        guest={guest}
                        isOpened={isOpened}
                        onOpen={handleOpen}
                        showGuestName={showGuestName}
                    />

                    {/* 2. FIXED HEADER (Always rendered in background to prevent layout shift) */}
                    <div className="sp-fake-header">
                        <div className="sp-header-row">
                            <div className="sp-search-bar" style={{ justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                    <span className="sp-search-icon">{ICONS.search}</span>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {themeConfig.labels.searchPlaceholder}
                                    </span>
                                </div>
                                {enableQr && activeGuest && (
                                    <span
                                        className="sp-search-qr-btn"
                                        onClick={() => isOpened && setShowQr(true)}
                                        title={isEn ? "Show QR Code" : "Tampilkan QR Presensi"}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        {ICONS.qrScan}
                                    </span>
                                )}
                            </div>
                            <div className="sp-header-actions">
                                <span style={{ cursor: 'pointer' }} onClick={() => isOpened && setActiveTab('profile')}>{ICONS.cart}</span>
                                <span style={{ cursor: 'pointer' }} onClick={() => isOpened && setActiveTab('notification')}>{ICONS.chat}</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Floating Buttons (Music & Auto Scroll) */}
                    {isOpened && (
                        <>
                            {activeTab === 'home' && (
                                <div className="sp-float-fullscreen">
                                    <button
                                        className={`sp-float-fullscreen-btn ${isFullscreen ? 'is-active' : ''}`}
                                        onClick={toggleFullscreen}
                                        title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            {isFullscreen ? (
                                                <path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4" />
                                            ) : (
                                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {invitation?.enable_auto_scroll !== false && activeTab === 'home' && (
                                <div className="sp-float-autoscroll">
                                    <button
                                        className={`sp-float-autoscroll-btn ${autoScrollEnabled ? 'is-active' : ''}`}
                                        onClick={() => setAutoScrollEnabled(p => !p)}
                                        title={autoScrollEnabled ? "Matikan Auto Scroll" : "Aktifkan Auto Scroll"}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M12 5v14M19 12l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {musicUrl && (
                                <div className="sp-float-audio">
                                    <button className="sp-float-audio-btn" onClick={toggleMusic} title="Toggle Musik" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {isPlaying ? (
                                            <div className="global-music-waves">
                                                <span />
                                                <span />
                                                <span />
                                            </div>
                                        ) : (
                                            <i className="fas fa-volume-mute" style={{ fontSize: 13 }} />
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* 4. SCROLLABLE TAB VIEWPORT (Always rendered to maintain layout sizing) */}
                    <div id="sp-home-viewport-scroller" className="sp-tab-content-viewport">
                        {isOpened && activeTab === 'home' && (
                            <HomeTab
                                invitation={invitation}
                                brideGrooms={brideGrooms}
                                events={events}
                                loveStories={loveStories}
                                setActiveTab={setActiveTab}
                                formatCountdown={countdown}
                                showCountdown={showCountdown}
                            />
                        )}

                        {isOpened && activeTab === 'live' && (
                            <VideoTab
                                invitation={invitation}
                                galleries={galleries}
                                setActiveTab={setActiveTab}
                            />
                        )}

                        {isOpened && activeTab === 'event' && (
                            <LiveTab
                                invitation={invitation}
                                events={events}
                            />
                        )}

                        {isOpened && activeTab === 'notification' && (
                            <NotifTab
                                invitation={invitation}
                                wishes={wishes}
                                guest={guest}
                                enableRsvp={enableRsvp}
                                enableWishes={enableWishes}
                            />
                        )}

                        {isOpened && activeTab === 'profile' && (
                            <ProfileTab
                                invitation={invitation}
                                bankAccounts={bankAccounts}
                                guest={guest}
                            />
                        )}
                    </div>

                    {/* QR Code Check-in Modal */}
                    {enableQr && showQr && activeGuest && (
                        <div className="sp-qr-modal-overlay" onClick={() => setShowQr(false)}>
                            <div className="sp-qr-modal-card" onClick={e => e.stopPropagation()}>
                                <h3 className="sp-qr-modal-title">{isEn ? "QR Code Check-in" : "QR Code Presensi"}</h3>
                                <p className="sp-qr-modal-guest-name">{activeGuest.name}</p>
                                <div className="sp-qr-code-box">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=ee4d2d&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                        alt="QR Code"
                                        className="sp-qr-code-image"
                                    />
                                </div>
                                <p className="sp-qr-modal-footer">
                                    {isEn ? "Show this QR code to the event crew to check in" : "Tunjukkan kode QR ini ke petugas penerima tamu"}
                                </p>
                                <button onClick={() => setShowQr(false)} className="sp-qr-close-btn">
                                    {isEn ? "Close" : "Tutup"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 5. FIXED FOOTER TAB BAR (Always rendered in background to prevent layout shift) */}
                    <div className="sp-tab-bar">
                        <button className={`sp-tab-item ${activeTab === 'home' && isOpened ? 'is-active' : ''}`} onClick={() => isOpened && setActiveTab('home')}>
                            <span className="sp-tab-icon">
                                {activeTab === 'home' && isOpened ? ICONS.homeActive : ICONS.homeInactive}
                            </span>
                            <span className="sp-tab-label">{isEn ? "Beranda" : "Beranda"}</span>
                        </button>

                        <button className={`sp-tab-item ${activeTab === 'live' && isOpened ? 'is-active' : ''}`} onClick={() => isOpened && setActiveTab('live')}>
                            <span className="sp-tab-icon">
                                {activeTab === 'live' && isOpened ? ICONS.videoActive : ICONS.videoInactive}
                            </span>
                            <span className="sp-tab-label">{isEn ? "Gallery" : "Galeri"}</span>
                        </button>

                        <button className={`sp-tab-item ${activeTab === 'event' && isOpened ? 'is-active' : ''}`} onClick={() => isOpened && setActiveTab('event')}>
                            <span className="sp-tab-icon">
                                {activeTab === 'event' && isOpened ? ICONS.liveActive : ICONS.liveInactive}
                            </span>
                            <span className="sp-tab-label">{isEn ? "Events" : "Acara"}</span>
                        </button>

                        <button className={`sp-tab-item ${activeTab === 'notification' && isOpened ? 'is-active' : ''}`} onClick={() => isOpened && setActiveTab('notification')}>
                            <span className="sp-tab-icon">
                                {activeTab === 'notification' && isOpened ? ICONS.bellActive : ICONS.bellInactive}
                            </span>
                            <span className="sp-tab-label">{isEn ? "RSVP" : "RSVP"}</span>
                            <span className="sp-tab-badge">!</span>
                        </button>

                        <button className={`sp-tab-item ${activeTab === 'profile' && isOpened ? 'is-active' : ''}`} onClick={() => isOpened && setActiveTab('profile')}>
                            <span className="sp-tab-icon">
                                {activeTab === 'profile' && isOpened ? ICONS.profileActive : ICONS.profileInactive}
                            </span>
                            <span className="sp-tab-label">{isEn ? "Gift" : "Kado"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}

/* ═══════════════════════════════════════
   EXPORT DEFAULT
   ═══════════════════════════════════════ */
export default function ShopinvityTheme(props) {
    return (
        <ErrorBoundary>
            <ShopinvityThemeContent {...props} />
        </ErrorBoundary>
    );
}
