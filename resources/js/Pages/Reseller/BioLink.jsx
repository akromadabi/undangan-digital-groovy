import { Head } from '@inertiajs/react';

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
        bg: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
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
        bg: 'linear-gradient(145deg, #fdf6ec 0%, #f5e9d7 50%, #fdf0e8 100%)',
        font: 'font-serif',
        textTitle: 'text-stone-800 font-bold tracking-tight',
        textBody: 'text-stone-500 font-sans',
        avatarBorder: 'border-4 border-amber-200/80 shadow-lg',
        cardBg: 'bg-white/60 border border-stone-200/80 shadow-sm rounded-2xl',
        btnBase: 'bg-white text-stone-700 border border-stone-200/80 shadow-sm rounded-xl hover:border-amber-300 hover:text-amber-700',
        btnPrimary: 'bg-gradient-to-r from-amber-100 to-amber-200 text-stone-800 border border-amber-300 shadow-sm rounded-xl hover:shadow hover:border-amber-400',
        socialIcon: 'bg-white border border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-700 shadow-sm',
        accentBorder: 'border-amber-400',
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
        bg: 'linear-gradient(160deg, #1a3c34 0%, #2d5a4b 50%, #1e4a3f 100%)',
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
};

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
    return null;
}

// ─── Main Page Export ─────────────────────────────────────────────────────────
export default function BioLink({ bio, brandName, brandLogo, resellerUrl, ref: subdomain }) {
    const template = bio?.template || 'modern-glow';
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
                // Default: default (stacked full-width)
                return (
                    <div key={sec.id} className="w-full flex flex-col gap-3">
                        {activeButtons.map((btn, i) => (
                            <a key={btn.id} href={btn.url} target="_blank" rel="noopener noreferrer"
                                className={`w-full flex items-center justify-center gap-3 py-3.5 px-5 text-sm font-semibold ${getAnimClass(btn.animation)} ${i === 0 ? theme.btnPrimary : theme.btnBase}`}>
                                {btn.icon && <BtnIcon name={btn.icon} />}
                                <span>{btn.label}</span>
                            </a>
                        ))}
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
                                    <span className="text-base flex-shrink-0">{getSocialEmoji(platform)}</span>
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
                                    <span className="text-sm">{getSocialEmoji(platform)}</span>
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
                                <span className="text-base">{getSocialEmoji(platform)}</span>
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

            <div className={`min-h-screen relative overflow-x-hidden flex items-center justify-center ${theme.font} transition-all duration-500`}
                style={{ background: theme.bg }}>
                
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

                {/* Layout container */}
                {template === 'minimal-card' ? (
                    <div className="w-full max-w-sm mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
                        <div className={`w-full flex flex-col items-center gap-5 p-6 md:p-8 ${theme.cardBg}`}>
                            {activeSections.map(sec => renderSection(sec))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-5 relative z-10 px-5 py-8 md:py-12 min-h-screen">
                        {activeSections.map(sec => renderSection(sec))}
                    </div>
                )}
            </div>
        </>
    );
}
