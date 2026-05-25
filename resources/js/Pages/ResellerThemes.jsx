import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import AnimatedLikeButton from '@/Components/AnimatedLikeButton';

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
    const [activeCategory, setActiveCategory] = useState('Semua');

    // Likes State
    const [likes, setLikes] = useState({});
    const [likedThemes, setLikedThemes] = useState({});

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
        const cats = themes.map(t => t.category).filter(Boolean);
        return ['Semua', ...new Set(cats)];
    }, [themes]);

    // Filter themes
    const filteredThemes = useMemo(() => {
        if (activeCategory === 'Semua') return themes;
        return themes.filter(t => t.category === activeCategory);
    }, [themes, activeCategory]);

    const siteTitle = `Semua Tema — ${reseller.brand_name}`;
    const siteMotto = reseller.site_motto || 'Pilih dari berbagai desain premium yang disesuaikan dengan kebutuhan acara Anda.';

    const registerUrl = `${reseller.reseller_url || ''}/register?ref=${reseller.ref}`;
    const loginUrl = `${reseller.reseller_url || ''}/login`;

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

                {/* Categories Filter */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(cat)}
                            className="rl-btn"
                            style={{
                                background: activeCategory === cat ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))' : 'var(--card-bg)',
                                border: activeCategory === cat ? 'none' : '1px solid var(--card-border)',
                                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                                boxShadow: activeCategory === cat ? '0 4px 15px rgba(var(--accent-rgb), 0.3)' : 'none',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '100px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Themes Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredThemes.map((theme) => (
                        <div key={theme.id} className="rl-theme-card" style={{ width: 'auto' }}>
                            <div className="rl-theme-card__img-wrap">
                                {theme.thumbnail ? (
                                    <img src={getThumbnailUrl(theme.thumbnail)} alt={theme.name} className="rl-theme-card__img" />
                                ) : (
                                    <div className="rl-theme-card__img-placeholder">
                                        <Icon d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" className="w-10 h-10 text-gray-400" />
                                    </div>
                                )}
                                <div className="rl-theme-card__overlay">
                                    <a href={theme.preview_url || '#'} target="_blank" rel="noreferrer" className="rl-theme-card__action-btn">
                                        <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                        Preview
                                    </a>
                                    <a href={`${reseller.reseller_url || ''}/register?ref=${reseller.ref}&theme=${theme.slug}`} className="rl-theme-card__action-btn rl-theme-card__action-btn--accent">
                                        <Icon d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" className="w-4 h-4" />
                                        Pakai Tema
                                    </a>
                                </div>
                                <span className={`rl-theme-card__badge ${theme.is_premium ? 'rl-theme-card__badge--premium' : 'rl-theme-card__badge--free'}`}>
                                    {theme.is_premium ? 'PREMIUM' : 'GRATIS'}
                                </span>
                            </div>
                            <div className="rl-theme-card__info">
                                <div className="rl-theme-card__name-row">
                                    <h4 className="rl-theme-card__name">{theme.name}</h4>
                                    <AnimatedLikeButton
                                        count={likes[theme.id] ?? getLikesCount(theme)}
                                        liked={!!likedThemes[theme.id]}
                                        onClick={() => handleLike(theme)}
                                    />
                                </div>
                                <span className="rl-theme-card__cat">{theme.category || 'Umum'}</span>
                            </div>
                        </div>
                    ))}

                    {filteredThemes.length === 0 && (
                        <div className="col-span-full py-20 text-center" style={{ color: 'var(--text-secondary)' }}>
                            Belum ada tema dalam kategori ini.
                        </div>
                    )}
                </div>
            </main>

            {/* ═══ FOOTER ═══ */}
            <footer className="rl-footer">
                <div className="rl-footer__inner">
                    <div className="rl-footer__brand">
                        {reseller.brand_logo ? (
                            <img src={reseller.brand_logo} alt={reseller.brand_name} style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain' }} />
                        ) : (
                            <div className="rl-footer__logo-placeholder">{reseller.brand_name?.charAt(0)}</div>
                        )}
                        <div>
                            <div className="rl-footer__brand-name">{reseller.brand_name}</div>
                            <div className="rl-footer__brand-tagline">Undangan Digital Premium</div>
                        </div>
                    </div>
                    <div className="rl-footer__links">
                        <Link href={`/r/${reseller.ref}/themes`} className="rl-footer__link">Katalog Tema</Link>
                        <a href={registerUrl} className="rl-footer__link">Daftar Gratis</a>
                        <a href={loginUrl} className="rl-footer__link">Masuk</a>
                    </div>
                    <div className="rl-footer__copy">
                        © {new Date().getFullYear()} {reseller.brand_name}. Powered by <strong style={{ color: 'var(--accent)' }}>Groovy</strong>.
                    </div>
                </div>
            </footer>
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
.rl-footer { background: var(--footer-bg); padding: 2.5rem 0; border-top: 1px solid rgba(255,255,255,0.05); }
.rl-footer__inner {
    max-width: 1280px; margin: 0 auto; padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
}
.rl-footer__brand { display: flex; align-items: center; gap: 0.75rem; }
.rl-footer__logo-placeholder {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 15px; color: #fff;
}
.rl-footer__brand-name { font-size: 0.9375rem; font-weight: 700; color: rgba(255,255,255,0.8); }
.rl-footer__brand-tagline { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
.rl-footer__links { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.rl-footer__link { font-size: 0.875rem; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
.rl-footer__link:hover { color: var(--accent); }
.rl-footer__copy { font-size: 0.8125rem; color: rgba(255,255,255,0.3); }

@media (max-width: 768px) {
    .rl-nav__inner { padding: 0.875rem 1.25rem; }
    .rl-footer__inner { flex-direction: column; align-items: flex-start; }
}
`;
