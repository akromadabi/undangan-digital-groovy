import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import AnimatedLikeButton from '@/Components/AnimatedLikeButton';

import ThemePreviewCard from '@/Components/ThemePreviewCard';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const THEMES_CFG = {
    default: {
        heroBg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        accent: '#f59e0b',
        accentDark: '#d97706',
        accentRgb: '245,158,11',
        navBg: 'rgba(15,23,42,0.85)',
        sectionAlt: '#0f172a',
        sectionBase: '#111827',
        cardBg: 'rgba(255,255,255,0.04)',
        cardBorder: 'rgba(255,255,255,0.08)',
        textPrimary: '#f1f5f9',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
        footerBg: '#080d18',
        tagBg: 'rgba(245,158,11,0.12)',
        tagColor: '#fcd34d',
        isDark: true,
    },
    elegant: {
        heroBg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
        accent: '#d97706',
        accentDark: '#b45309',
        accentRgb: '217,119,6',
        navBg: 'rgba(28,25,23,0.9)',
        sectionAlt: '#1c1917',
        sectionBase: '#231f1c',
        cardBg: 'rgba(255,255,255,0.04)',
        cardBorder: 'rgba(255,255,255,0.08)',
        textPrimary: '#fef3c7',
        textSecondary: '#d6d3d1',
        textMuted: '#78716c',
        footerBg: '#0c0a09',
        tagBg: 'rgba(217,119,6,0.12)',
        tagColor: '#fcd34d',
        isDark: true,
    },
    minimal: {
        heroBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
        accent: '#0ea5e9',
        accentDark: '#0284c7',
        accentRgb: '14,165,233',
        navBg: 'rgba(255,255,255,0.92)',
        sectionAlt: '#f8fafc',
        sectionBase: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
        footerBg: '#0f172a',
        tagBg: 'rgba(14,165,233,0.1)',
        tagColor: '#0284c7',
        isDark: false,
    },
    colorful: {
        heroBg: 'linear-gradient(135deg, #2d1b69 0%, #1a0038 50%, #2d1b69 100%)',
        accent: '#a855f7',
        accentDark: '#9333ea',
        accentRgb: '168,85,247',
        navBg: 'rgba(45,27,105,0.85)',
        sectionAlt: '#1a0038',
        sectionBase: '#200844',
        cardBg: 'rgba(255,255,255,0.05)',
        cardBorder: 'rgba(168,85,247,0.2)',
        textPrimary: '#f5f3ff',
        textSecondary: '#c4b5fd',
        textMuted: '#7c3aed',
        footerBg: '#0d001e',
        tagBg: 'rgba(168,85,247,0.15)',
        tagColor: '#d8b4fe',
        isDark: true,
    },
};

export default function ResellerThemes({ reseller, themes = [] }) {
    const T = THEMES_CFG[reseller.template] || THEMES_CFG.default;

    const getLikesCount = (theme) => {
        const base = Number(theme.base_likes || 0);
        const real = Number(theme.real_likes || 0);
        return base + real;
    };

    const getThumbnailUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) {
            return path;
        }
        return `/storage/${path}`;
    };

    const [scrolled, setScrolled] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortThemeKey, setSortThemeKey] = useState('terbaru');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const categoryDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    // Likes State
    const [likes, setLikes] = useState({});
    const [likedThemes, setLikedThemes] = useState({});
    const [showContactModal, setShowContactModal] = useState(false);

    const hasContact = !!(reseller.footer_whatsapp || reseller.footer_phone || reseller.footer_email || reseller.footer_instagram || reseller.footer_tiktok || reseller.footer_address);

    const getWhatsappLink = (number, text = 'Halo, saya ingin bertanya tentang undangan digital.') => {
        if (!number) return '#';
        let cleaned = number.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        } else if (cleaned.startsWith('8')) {
            cleaned = '62' + cleaned;
        }
        return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
    };

    const handleContactClick = () => {
        const contacts = [];
        if (reseller.footer_whatsapp) contacts.push({ type: 'wa', val: reseller.footer_whatsapp });
        if (reseller.footer_phone) contacts.push({ type: 'phone', val: reseller.footer_phone });
        if (reseller.footer_email) contacts.push({ type: 'email', val: reseller.footer_email });

        if (contacts.length === 1) {
            const c = contacts[0];
            if (c.type === 'wa') {
                window.open(getWhatsappLink(c.val), '_blank', 'noopener,noreferrer');
                return;
            } else if (c.type === 'phone') {
                window.location.href = `tel:${c.val}`;
                return;
            } else if (c.type === 'email') {
                window.location.href = `mailto:${c.val}`;
                return;
            }
        }
        setShowContactModal(true);
    };

    useEffect(() => {
        try {
            const localLikes = JSON.parse(localStorage.getItem('likedThemes') || '{}');
            setLikedThemes(localLikes);
        } catch(e) {}
    }, []);

    const handleLike = async (theme) => {
        const isLiked = likedThemes[theme.id];
        
        setLikedThemes(prev => {
            const next = { ...prev };
            if (isLiked) {
                delete next[theme.id];
            } else {
                next[theme.id] = true;
            }
            localStorage.setItem('likedThemes', JSON.stringify(next));
            return next;
        });
        
        setLikes(prev => {
            const currentLikes = prev[theme.id] ?? (theme.base_likes + theme.real_likes);
            return {
                ...prev,
                [theme.id]: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
            };
        });

        const endpoint = `/theme/${theme.id}/like`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ liked: !isLiked })
            });
            const data = await res.json();
            if (data.success) {
                setLikes(prev => ({ ...prev, [theme.id]: data.likes }));
            }
        } catch(e) { console.error('Like toggle failed', e); }
    };

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = themes.map(t => t.category ? t.category.trim().toLowerCase() : '').filter(Boolean);
        return [...new Set(cats)];
    }, [themes]);

    // Filter themes
    const filteredThemes = useMemo(() => {
        let list = [...(themes || [])];
        if (selectedCategories.length > 0) {
            list = list.filter(t => t.category && selectedCategories.includes(t.category.trim().toLowerCase()));
        }
        if (searchQuery.trim()) {
            list = list.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return list;
    }, [themes, selectedCategories, searchQuery]);

    const sortedThemes = useMemo(() => {
        const arr = [...filteredThemes];
        if (sortThemeKey === 'terbaru') return arr.sort((a, b) => (b.id || 0) - (a.id || 0));
        if (sortThemeKey === 'populer') return arr.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
        if (sortThemeKey === 'disukai') return arr.sort((a, b) => {
            const bL = likes[b.id] ?? ((b.base_likes || 0) + (b.real_likes || 0));
            const aL = likes[a.id] ?? ((a.base_likes || 0) + (a.real_likes || 0));
            return bL - aL;
        });
        return arr;
    }, [filteredThemes, sortThemeKey, likes]);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const clearCategories = () => setSelectedCategories([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const siteTitle = `Semua Tema — ${reseller.brand_name}`;
    const siteMotto = reseller.site_motto || 'Pilih dari berbagai desain premium yang disesuaikan dengan kebutuhan acara Anda.';

    const registerUrl = `${reseller.reseller_url || ''}/register?ref=${reseller.ref}`;
    const loginUrl = `${reseller.reseller_url || ''}/login`;

    const getFaqUrl = () => {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/r/')) return `/r/${reseller.ref}/faq`;
        return '/faq';
    };

    /* CSS variables injected inline */
    const cssVars = `
        :root {
            --accent: ${T.accent};
            --accent-dark: ${T.accentDark};
            --accent-rgb: ${T.accentRgb};
            --hero-bg: ${T.heroBg};
            --nav-bg: ${T.navBg};
            --section-alt: ${T.sectionAlt};
            --section-base: ${T.sectionBase};
            --card-bg: ${T.cardBg};
            --card-border: ${T.cardBorder};
            --text-primary: ${T.textPrimary};
            --text-secondary: ${T.textSecondary};
            --text-muted: ${T.textMuted};
            --footer-bg: ${T.footerBg};
            --tag-bg: ${T.tagBg};
            --tag-color: ${T.tagColor};
        }
    `;

    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="description" content={siteMotto} />
                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content={siteMotto} />
                {reseller.brand_logo && <meta property="og:image" content={reseller.brand_logo} />}
                <meta property="og:url" content={reseller.reseller_url + '/themes'} />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteMotto} />
                {reseller.brand_logo && <meta name="twitter:image" content={reseller.brand_logo} />}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
                <style>{cssVars}</style>
                <style>{landingStyles}</style>
            </Head>

            {/* Background orbs */}
            <div className="rl-hero__orb rl-hero__orb--1" />
            <div className="rl-hero__orb rl-hero__orb--2" />

            {/* ═══ NAVBAR ═══ */}
            <nav className={`rl-nav ${scrolled ? 'rl-nav--scrolled' : ''}`}>
                <div className="rl-nav__inner">
                    <Link href={`/r/${reseller.ref}`} className="rl-nav__brand">
                        {reseller.brand_logo ? (
                            <img src={reseller.brand_logo} alt={reseller.brand_name} className="rl-nav__logo-img" />
                        ) : (
                            <div className="rl-nav__logo-placeholder">
                                {reseller.brand_name?.charAt(0)}
                            </div>
                        )}
                        <span className="rl-nav__brand-name">{reseller.brand_name}</span>
                    </Link>
                    <div className="rl-nav__actions">
                        {hasContact && (
                            <button onClick={handleContactClick} className="rl-btn rl-btn--ghost rl-nav__contact-btn">
                                Hubungi Kami
                            </button>
                        )}
                        <a href={loginUrl} className="rl-btn rl-btn--ghost">
                            Masuk
                        </a>
                        <a href={registerUrl} className="rl-btn rl-btn--accent">
                            Buat Undangan
                        </a>
                    </div>
                </div>
            </nav>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-20" style={{ zIndex: 1, position: 'relative' }}>
                <div className="mb-10 text-center sm:text-left">
                    <Link href={`/r/${reseller.ref}`} className="inline-flex items-center gap-1.5 text-sm font-semibold mb-4 transition-colors" style={{ color: 'var(--accent)' }}>
                        <Icon d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-4 h-4" /> Kembali
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', Georgia, serif" }}>Koleksi Tema</h1>
                    <p className="mt-3 max-w-2xl text-sm" style={{ color: 'var(--text-secondary)' }}>Pilih dari berbagai desain premium yang disesuaikan dengan kebutuhan acara Anda.</p>
                </div>

                {/* Overhauled Filters & Search Bar */}
                {themes.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '2rem',
                        width: '100%'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            {/* Search Box */}
                            <div style={{
                                position: 'relative',
                                flex: '1',
                                minWidth: '240px'
                            }}>
                                <svg style={{
                                    position: 'absolute',
                                    left: '0.85rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '16px',
                                    height: '16px',
                                    color: 'var(--text-muted)'
                                }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Cari tema..."
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem 1rem 0.625rem 2.25rem',
                                        borderRadius: '100px',
                                        border: '1.5px solid var(--card-border)',
                                        fontSize: '0.8rem',
                                        background: 'var(--card-bg)',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
                                />
                            </div>

                            {/* Controls */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                {/* Category Select Dropdown */}
                                <div style={{ position: 'relative' }} ref={categoryDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        style={{
                                            padding: '0.625rem 1.15rem',
                                            borderRadius: '100px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em',
                                            border: '1.5px solid ' + (selectedCategories.length > 0 ? 'var(--accent)' : 'var(--card-border)'),
                                            background: selectedCategories.length > 0 ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                            color: selectedCategories.length > 0 ? 'var(--accent)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        <span>
                                            {selectedCategories.length === 0 ? 'Semua Kategori' : `Kategori (${selectedCategories.length})`}
                                        </span>
                                        <svg style={{
                                            width: '12px',
                                            height: '12px',
                                            transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.2s'
                                        }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isCategoryDropdownOpen && (
                                        <div style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: '100%',
                                            marginTop: '0.5rem',
                                            width: '220px',
                                            background: 'var(--card-bg)',
                                            border: '1.5px solid var(--card-border)',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                            zIndex: 99,
                                            padding: '0.5rem',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.25rem 0.5rem 0.5rem',
                                                borderBottom: '1px solid var(--card-border)'
                                            }}>
                                                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kategori</span>
                                                {selectedCategories.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={clearCategories}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 700,
                                                            color: 'var(--accent)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                            <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '0.25rem 0' }}>
                                                {categories.map(cat => {
                                                    const isChecked = selectedCategories.includes(cat);
                                                    return (
                                                        <label
                                                            key={cat}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                padding: '0.4rem 0.5rem',
                                                                borderRadius: '8px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                color: isChecked ? 'var(--accent)' : 'var(--text-secondary)',
                                                                cursor: 'pointer',
                                                                background: isChecked ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
                                                                transition: 'background 0.2s',
                                                                margin: '2px 0'
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => toggleCategory(cat)}
                                                                style={{
                                                                    accentColor: 'var(--accent)',
                                                                    width: '13px',
                                                                    height: '13px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            />
                                                            <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sort Dropdown */}
                                <div style={{ position: 'relative' }} ref={sortDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                        title="Urutkan Tema"
                                        style={{
                                            padding: '0.625rem',
                                            borderRadius: '100px',
                                            border: '1.5px solid ' + (isSortDropdownOpen ? 'var(--accent)' : 'var(--card-border)'),
                                            background: isSortDropdownOpen ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                            color: isSortDropdownOpen ? 'var(--accent)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s',
                                            width: '38px',
                                            height: '38px'
                                        }}
                                    >
                                        <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                    </button>

                                    {isSortDropdownOpen && (
                                        <div style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: '100%',
                                            marginTop: '0.5rem',
                                            width: '180px',
                                            background: 'var(--card-bg)',
                                            border: '1.5px solid var(--card-border)',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                            zIndex: 99,
                                            padding: '0.5rem',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)'
                                        }}>
                                            <div style={{
                                                padding: '0.25rem 0.5rem 0.5rem',
                                                borderBottom: '1px solid var(--card-border)'
                                            }}>
                                                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Urutkan</span>
                                            </div>
                                            <div style={{ padding: '0.25rem 0' }}>
                                                {[
                                                    { key: 'terbaru', label: 'Terbaru' },
                                                    { key: 'populer', label: 'Terpopuler' },
                                                    { key: 'disukai', label: 'Terfavorit' }
                                                ].map(opt => {
                                                    const isActive = sortThemeKey === opt.key;
                                                    return (
                                                        <button
                                                            key={opt.key}
                                                            type="button"
                                                            onClick={() => {
                                                                setSortThemeKey(opt.key);
                                                                setIsSortDropdownOpen(false);
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                padding: '0.4rem 0.5rem',
                                                                borderRadius: '8px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                background: isActive ? 'rgba(var(--accent-rgb), 0.08)' : 'transparent',
                                                                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                textAlign: 'left',
                                                                transition: 'all 0.2s',
                                                                margin: '2px 0'
                                                            }}
                                                        >
                                                            <span>{opt.label}</span>
                                                            {isActive && (
                                                                <svg style={{ width: '14px', height: '14px', color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Themes Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {sortedThemes.map((theme) => (
                        <ThemePreviewCard 
                            key={theme.id} 
                            theme={theme}
                            reseller={reseller}
                        />
                    ))}

                    {sortedThemes.length === 0 && (
                        <div className="col-span-full py-20 text-center" style={{ color: 'var(--text-secondary)' }}>
                            Belum ada tema dalam kategori ini atau tidak ada hasil pencarian yang cocok.
                        </div>
                    )}
                </div>
            </main>

            {/* ═══ FOOTER ═══ */}
            <footer className="rl-footer">
                <div className="rl-footer__inner">
                    <div className="rl-footer__grid">
                        {/* Column 1: Brand Info */}
                        <div className="rl-footer__col">
                            <div className="rl-footer__brand">
                                {reseller.brand_logo ? (
                                    <img src={reseller.brand_logo} alt={reseller.brand_name} style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'contain' }} />
                                ) : (
                                    <div className="rl-footer__logo-placeholder">{reseller.brand_name?.charAt(0)}</div>
                                )}
                                <div>
                                    <div className="rl-footer__brand-name">{reseller.brand_name}</div>
                                    <div className="rl-footer__brand-tagline">Undangan Digital Premium</div>
                                </div>
                            </div>
                            <p className="rl-footer__desc-text">
                                {reseller.footer_description || 'Platform pembuatan undangan digital pernikahan premium yang cepat, mudah, dan elegan.'}
                            </p>
                            <div className="rl-footer__socials">
                                {reseller.footer_instagram && (
                                    <a href={`https://instagram.com/${reseller.footer_instagram}`} target="_blank" rel="noopener noreferrer" className="rl-footer__social-link" title="Instagram">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
                                    </a>
                                )}
                                {reseller.footer_tiktok && (
                                    <a href={`https://tiktok.com/@${reseller.footer_tiktok}`} target="_blank" rel="noopener noreferrer" className="rl-footer__social-link" title="TikTok">
                                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.13V9.25A6.33 6.33 0 0 0 5 10.12a6.34 6.34 0 0 0 6.13 6.55 6.34 6.34 0 0 0 6.13-6.55V8.16a7.65 7.65 0 0 0 4.31 1.33V6.69z"/></svg>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="rl-footer__col">
                            <h4 className="rl-footer__title">Tautan Cepat</h4>
                            <div className="rl-footer__links-stack">
                                <Link href={`/r/${reseller.ref}`} className="rl-footer__link">Beranda</Link>
                                <a href={registerUrl} className="rl-footer__link">Daftar Gratis</a>
                                <a href={loginUrl} className="rl-footer__link">Masuk ke Akun</a>
                                <Link href={getFaqUrl()} className="rl-footer__link">FAQ & Panduan</Link>
                                {hasContact && (
                                    <button onClick={handleContactClick} className="rl-footer__link-btn">Hubungi Kami</button>
                                )}
                            </div>
                        </div>

                        {/* Column 3: Contact Info */}
                        {hasContact && (
                            <div className="rl-footer__col">
                                <h4 className="rl-footer__title">Hubungi Kami</h4>
                                <div className="rl-footer__contacts">
                                    {reseller.footer_whatsapp && (
                                        <a href={getWhatsappLink(reseller.footer_whatsapp)} target="_blank" rel="noopener noreferrer" className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" width="16" height="16" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                                            <span>WhatsApp: {reseller.footer_whatsapp}</span>
                                        </a>
                                    )}
                                    {reseller.footer_phone && (
                                        <a href={`tel:${reseller.footer_phone}`} className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                                            <span>Telepon: {reseller.footer_phone}</span>
                                        </a>
                                    )}
                                    {reseller.footer_email && (
                                        <a href={`mailto:${reseller.footer_email}`} className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                                            <span>Email: {reseller.footer_email}</span>
                                        </a>
                                    )}
                                    {reseller.footer_address && (
                                        <div className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"/></svg>
                                            <span>{reseller.footer_address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="rl-footer__bottom">
                        <div className="rl-footer__copy">
                            © {new Date().getFullYear()} {reseller.brand_name}. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Contact Button */}
            {hasContact && (
                <button className="rl-floating-contact" onClick={handleContactClick} title="Hubungi Kami">
                    <span className="rl-floating-contact__pulse" />
                    <span className="rl-floating-contact__icon">
                        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
                    </span>
                    <span className="rl-floating-contact__text">Hubungi Kami</span>
                </button>
            )}

            {/* Contact Modal */}
            {showContactModal && (
                <div className="rl-modal-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="rl-modal-card" onClick={e => e.stopPropagation()}>
                        <button className="rl-modal-close" onClick={() => setShowContactModal(false)}>×</button>
                        <div className="rl-modal-header">
                            {reseller.brand_logo ? (
                                <img src={reseller.brand_logo} alt={reseller.brand_name} className="rl-modal-logo" />
                            ) : (
                                <div className="rl-modal-logo-placeholder">
                                    {reseller.brand_name?.charAt(0)}
                                </div>
                            )}
                            <h3 className="rl-modal-title">Hubungi {reseller.brand_name}</h3>
                            <p className="rl-modal-desc">
                                {reseller.footer_description || 'Silakan hubungi kami untuk informasi lebih lanjut seputar pembuatan undangan digital.'}
                            </p>
                        </div>
                        <div className="rl-modal-body">
                            {reseller.footer_whatsapp && (
                                <a href={getWhatsappLink(reseller.footer_whatsapp)} target="_blank" rel="noopener noreferrer" className="rl-contact-row rl-contact-row--wa">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">WhatsApp Chat</span>
                                        <span className="rl-contact-value">{reseller.footer_whatsapp}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_phone && (
                                <a href={`tel:${reseller.footer_phone}`} className="rl-contact-row rl-contact-row--phone">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Telepon Dukungan</span>
                                        <span className="rl-contact-value">{reseller.footer_phone}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_email && (
                                <a href={`mailto:${reseller.footer_email}`} className="rl-contact-row rl-contact-row--email">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Email Dukungan</span>
                                        <span className="rl-contact-value">{reseller.footer_email}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_address && (
                                <div className="rl-contact-row rl-contact-row--address">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Alamat Kantor</span>
                                        <span className="rl-contact-value" style={{ whiteSpace: 'pre-wrap' }}>{reseller.footer_address}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(reseller.footer_instagram || reseller.footer_tiktok) && (
                            <div className="rl-modal-footer">
                                {reseller.footer_instagram && (
                                    <a href={`https://instagram.com/${reseller.footer_instagram}`} target="_blank" rel="noopener noreferrer" className="rl-social-icon" title="Instagram">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
                                    </a>
                                )}
                                {reseller.footer_tiktok && (
                                    <a href={`https://tiktok.com/@${reseller.footer_tiktok}`} target="_blank" rel="noopener noreferrer" className="rl-social-icon" title="TikTok">
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.13V9.25A6.33 6.33 0 0 0 5 10.12a6.34 6.34 0 0 0 6.13 6.55 6.34 6.34 0 0 0 6.13-6.55V8.16a7.65 7.65 0 0 0 4.31 1.33V6.69z"/></svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

const landingStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--section-base); color: var(--text-primary); }

/* ── NAVBAR ── */
.rl-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: transparent;
    transition: all 0.35s ease;
}
.rl-nav--scrolled {
    background: var(--nav-bg);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.2);
}
.rl-nav__inner {
    max-width: 1280px; margin: 0 auto; padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
}
.rl-nav__brand { display: flex; align-items: center; gap: 0.625rem; text-decoration: none; }
.rl-nav__logo-img { width: 40px; height: 40px; border-radius: 12px; object-fit: contain; }
.rl-nav__logo-placeholder {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #fff;
}
.rl-nav__brand-name { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); }
.rl-nav__actions { display: flex; align-items: center; gap: 0.75rem; }

/* ── BUTTONS ── */
.rl-btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease; border: none; cursor: pointer; }
.rl-btn--ghost { background: transparent; color: var(--text-secondary); }
.rl-btn--ghost:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
.rl-btn--accent { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff; box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3); }
.rl-btn--accent:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4); }
.rl-btn--accent-outline { background: transparent; color: var(--accent); border: 1.5px solid var(--accent); padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease; }
.rl-btn--accent-outline:hover { background: rgba(var(--accent-rgb), 0.1); }

/* ── ORBS ── */
.rl-hero__orb {
    position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
}
.rl-hero__orb--1 { width: 500px; height: 500px; background: rgba(var(--accent-rgb), 0.08); top: 0; left: -100px; }
.rl-hero__orb--2 { width: 400px; height: 400px; background: rgba(139,92,246,0.06); bottom: 0; right: -100px; }

/* ── THEME CARD ── */
.rl-theme-card {
    border-radius: 18px; overflow: hidden;
    background: var(--card-bg); border: 1px solid var(--card-border);
    transition: all 0.25s ease;
}
.rl-theme-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.25); }
.rl-theme-card__img-wrap { aspect-ratio: 3/4; position: relative; overflow: hidden; }
.rl-theme-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.rl-theme-card:hover .rl-theme-card__img { transform: scale(1.05); }
.rl-theme-card__img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); }
.rl-theme-card__overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.6);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.625rem;
    opacity: 0; transition: opacity 0.2s;
}
.rl-theme-card:hover .rl-theme-card__overlay { opacity: 1; }
.rl-theme-card__action-btn {
    display: inline-flex; align-items: center; gap: 0.375rem;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
    color: #fff; border: 1px solid rgba(255,255,255,0.2);
    padding: 0.5rem 1rem; border-radius: 100px; font-size: 0.8125rem; font-weight: 600;
    text-decoration: none; transition: background 0.2s; white-space: nowrap;
}
.rl-theme-card__action-btn--accent { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); border-color: transparent; }
.rl-theme-card__action-btn:hover { background: rgba(255,255,255,0.25); }
.rl-theme-card__action-btn--accent:hover { filter: brightness(1.1); }
.rl-theme-card__badge {
    position: absolute; top: 10px; left: 10px; z-index: 2;
    padding: 0.2rem 0.6rem; border-radius: 100px; font-size: 0.6875rem; font-weight: 800;
}
.rl-theme-card__badge--premium { background: rgba(245,158,11,0.9); color: #fff; }
.rl-theme-card__badge--free { background: rgba(74,222,128,0.9); color: #14532d; }
.rl-theme-card__info { padding: 0.875rem; }
.rl-theme-card__name-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem; }
.rl-theme-card__name { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.rl-theme-card__cat { font-size: 0.75rem; color: var(--text-muted); text-transform: capitalize; }

/* ── FOOTER ── */
.rl-footer { background: var(--footer-bg); padding: 4.5rem 0 2.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
.rl-footer__inner { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
.rl-footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 3.5rem; }
.rl-footer__col { display: flex; flex-direction: column; gap: 1.25rem; }
.rl-footer__brand { display: flex; align-items: center; gap: 0.75rem; }
.rl-footer__logo-placeholder {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #fff;
}
.rl-footer__brand-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.rl-footer__brand-tagline { font-size: 0.75rem; color: var(--text-muted); }
.rl-footer__desc-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; max-width: 320px; text-align: left; }
.rl-footer__socials { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
.rl-footer__social-link {
    width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--card-border);
    display: flex; align-items: center; justify-content: center; color: var(--text-secondary);
    transition: all 0.2s ease; background: var(--card-bg); text-decoration: none;
}
.rl-footer__social-link:hover { color: var(--accent); border-color: var(--accent); transform: translateY(-2px); }
.rl-footer__title { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; text-align: left; }
.rl-footer__links-stack { display: flex; flex-direction: column; gap: 0.75rem; }
.rl-footer__link { font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; text-align: left; }
.rl-footer__link:hover { color: var(--accent); }
.rl-footer__link-btn { font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; background: none; border: none; padding: 0; cursor: pointer; text-align: left; font-weight: inherit; font-family: inherit; }
.rl-footer__link-btn:hover { color: var(--accent); }
.rl-footer__contacts { display: flex; flex-direction: column; gap: 0.875rem; }
.rl-footer__contact-item { display: flex; align-items: flex-start; gap: 0.625rem; font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; text-align: left; }
.rl-footer__contact-item svg { flex-shrink: 0; margin-top: 0.15rem; }
.rl-footer__contact-item:hover { color: var(--text-primary); }
.rl-footer__bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; }
.rl-footer__copy { font-size: 0.8125rem; color: var(--text-muted); }

/* ── NAV HUBUNGI KAMI ── */
.rl-nav__contact-btn { display: inline-flex; }

/* ── FLOATING CONTACT ── */
.rl-floating-contact {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 90;
    display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem;
    background: #25d366; color: #fff; border: none; border-radius: 100px;
    font-weight: 700; font-size: 0.875rem; cursor: pointer;
    box-shadow: 0 8px 30px rgba(37,211,102,0.4); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.rl-floating-contact:hover {
    transform: translateY(-4px) scale(1.03); box-shadow: 0 12px 35px rgba(37,211,102,0.5);
}
.rl-floating-contact__pulse {
    position: absolute; inset: 0; border-radius: 100px;
    box-shadow: 0 0 0 0 rgba(37,211,102,0.6);
    animation: rl-pulse-wa 2s infinite; pointer-events: none;
}
@keyframes rl-pulse-wa {
    0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.7); }
    70% { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
}
.rl-floating-contact__icon { display: flex; align-items: center; justify-content: center; }
.rl-floating-contact__text { font-family: 'Plus Jakarta Sans', sans-serif; }

/* ── MODAL ── */
.rl-modal-overlay {
    position: fixed; inset: 0; z-index: 200; background: rgba(8,13,24,0.7);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center; padding: 1.5rem;
    animation: rl-fade-in 0.25s ease-out;
}
.rl-modal-card {
    background: #0f172a; border: 1px solid rgba(255,255,255,0.08);
    width: 100%; max-width: 440px; border-radius: 24px; padding: 2.25rem;
    position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    animation: rl-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    color: #f1f5f9;
}
.rl-modal-close {
    position: absolute; top: 1.25rem; right: 1.25rem; width: 32px; height: 32px;
    border-radius: 50%; background: rgba(255,255,255,0.05); border: none;
    color: #94a3b8; font-size: 20px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
}
.rl-modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(90deg); }
.rl-modal-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1.75rem; }
.rl-modal-logo { width: 56px; height: 56px; border-radius: 16px; object-fit: contain; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.1); padding: 4px; }
.rl-modal-logo-placeholder {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 24px; color: #fff; margin-bottom: 1rem;
}
.rl-modal-title { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
.rl-modal-desc { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; }
.rl-modal-body { display: flex; flex-direction: column; gap: 0.75rem; }
.rl-contact-row {
    display: flex; align-items: center; gap: 0.875rem; padding: 0.875rem 1.125rem;
    border-radius: 16px; text-decoration: none; border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02); transition: all 0.2s ease;
}
.rl-contact-row:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
.rl-contact-icon {
    width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.rl-contact-row--wa .rl-contact-icon { background: rgba(37,211,102,0.1); color: #25d366; }
.rl-contact-row--wa:hover { border-color: rgba(37,211,102,0.3); background: rgba(37,211,102,0.03); }
.rl-contact-row--phone .rl-contact-icon { background: rgba(56,189,248,0.1); color: #38bdf8; }
.rl-contact-row--phone:hover { border-color: rgba(56,189,248,0.3); background: rgba(56,189,248,0.03); }
.rl-contact-row--email .rl-contact-icon { background: rgba(129,140,248,0.1); color: #818cf8; }
.rl-contact-row--email:hover { border-color: rgba(129,140,248,0.3); background: rgba(129,140,248,0.03); }
.rl-contact-row--address { background: rgba(255,255,255,0.01); border-style: dashed; }
.rl-contact-row--address .rl-contact-icon { background: rgba(192,132,252,0.1); color: #c084fc; }
.rl-contact-info { display: flex; flex-direction: column; }
.rl-contact-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; }
.rl-contact-value { font-size: 0.9375rem; color: #f1f5f9; font-weight: 700; margin-top: 0.125rem; text-align: left; }
.rl-modal-footer { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.75rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.25rem; }
.rl-social-icon {
    width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center; color: #94a3b8;
    transition: all 0.2s; border: 1px solid rgba(255,255,255,0.04);
}
.rl-social-icon:hover { color: #fff; background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.1); transform: scale(1.05); }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
    .rl-nav__inner { padding: 0.875rem 1.25rem; }
    .rl-footer__grid { grid-template-columns: 1fr; gap: 2rem; }
    .rl-footer__col { align-items: center; text-align: center; }
    .rl-footer__links-stack { align-items: center; }
    .rl-footer__link-btn { text-align: center; }
    .rl-footer__contacts { align-items: center; }
    .rl-footer__contact-item { justify-content: center; }
    .rl-footer__desc-text { max-width: none; text-align: center; }
    .rl-footer__bottom { flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
    .rl-nav__contact-btn { display: none; }
}
`;
