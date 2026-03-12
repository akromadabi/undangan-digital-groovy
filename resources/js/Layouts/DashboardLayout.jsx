import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

const menuItems = [
    {
        group: 'OVERVIEW',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', feature: null },
            { label: 'Upgrade', href: '/pricing', icon: 'M13 10V3L4 14h7v7l9-11h-7z', feature: null },
        ],
    },
    {
        group: 'KONTEN UNDANGAN',
        items: [
            { label: 'Teks & Sambutan', href: '/content/teks-sambutan', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', feature: 'opening' },
            { label: 'Mempelai', href: '/content/mempelai', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v-1', feature: 'bride_groom' },
            { label: 'Acara', href: '/content/acara', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', feature: 'event' },
            { label: 'Galeri', href: '/content/galeri', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', feature: 'gallery' },
            { label: 'Kisah Cinta', href: '/content/kisah', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', feature: 'love_story' },
            { label: 'Amplop Digital', href: '/content/bank', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', feature: 'bank' },
        ],
    },
    {
        group: 'PENGATURAN',
        items: [
            { label: 'Desain & Tema', href: '/theme', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01', feature: 'cover' },
            { label: 'Tamu & RSVP', href: '/settings/tamu', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', feature: 'guest' },
            { label: 'Musik', href: '/settings/musik', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', feature: 'music' },
            { label: 'Pengaturan', href: '/settings/pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', feature: null },
        ],
    },
];


// Bottom nav items (5 items: Dashboard, Tema, [Menu], Tamu, Setting)
const bottomNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Tema', href: '/theme', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01', matchPrefix: '/theme' },
    { label: 'Menu', isCenter: true },
    { label: 'Tamu', href: '/settings/tamu', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', matchPrefix: '/settings/tamu' },
    { label: 'Setting', href: '/settings/pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', matchPrefix: '/settings', excludePrefix: ['/settings/tamu'] },
];

// Slide-up menu items (inside center Menu button sheet)
const menuSheetItems = [
    { label: 'Sambutan', href: '/content/teks-sambutan', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', color: 'bg-rose-100 text-rose-600' },
    { label: 'Mempelai', href: '/content/mempelai', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v-1', color: 'bg-blue-100 text-blue-600' },
    { label: 'Acara', href: '/content/acara', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-amber-100 text-amber-600' },
    { label: 'Galeri', href: '/content/galeri', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-teal-100 text-teal-600' },
    { label: 'Kisah', href: '/content/kisah', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'bg-pink-100 text-pink-600' },
    { label: 'Amplop', href: '/content/bank', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Musik', href: '/settings/musik', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', color: 'bg-purple-100 text-purple-600' },
    { label: 'Upgrade', href: '/pricing', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'bg-yellow-100 text-yellow-600' },
];

const SvgIcon = ({ d, className = '' }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        {typeof d === 'string' && d.includes('M15 12a3') ? (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d={d.split('M15 12')[0].trim()} />
                <path strokeLinecap="round" strokeLinejoin="round" d={`M15 12${d.split('M15 12')[1]}`} />
            </>
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        )}
    </svg>
);

export default function DashboardLayout({ children, title }) {
    const { auth, features, subscription, appName } = usePage().props;
    const [openGroups, setOpenGroups] = useState({ 'OVERVIEW': true, 'KONTEN UNDANGAN': true, 'PENGATURAN': true });
    const [avatarOpen, setAvatarOpen] = useState(false);
    const [menuSheetOpen, setMenuSheetOpen] = useState(false);
    const avatarRef = useRef(null);

    const toggleGroup = (group) => {
        setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    };

    const isLocked = (featureSlug) => {
        if (!featureSlug) return false;
        return features?.[featureSlug] === false;
    };

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Close avatar dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isBottomActive = (item) => {
        if (item.isCenter) return menuSheetOpen;
        if (item.matchPrefix) {
            if (item.excludePrefix?.some(p => currentPath.startsWith(p))) return false;
            return currentPath.startsWith(item.matchPrefix);
        }
        return currentPath === item.href;
    };

    const [upgradePopup, setUpgradePopup] = useState(null); // { label, x, y }
    const upgradePopupRef = useRef(null);

    // Close upgrade popup on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (upgradePopupRef.current && !upgradePopupRef.current.contains(e.target)) setUpgradePopup(null);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLockedClick = (e, label) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setUpgradePopup({ label, x: rect.right + 12, y: rect.top + rect.height / 2 });
    };

    return (
        <div className="min-h-screen bg-[#f8f7f4] flex">
            {/* ═══ Desktop Sidebar (hidden on mobile) ═══ */}
            <aside className="hidden lg:flex sticky top-0 h-screen w-[260px] bg-white flex-col shadow-[1px_0_0_0_#e8e5e0]">
                {/* Logo */}
                <div className="h-16 flex items-center px-5">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E5654B] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">G</div>
                        <div>
                            <div className="font-bold text-[#1a1a1a] text-[15px] leading-tight">{appName || 'Groovy'}</div>
                            <div className="text-[11px] text-[#999] font-medium tracking-wide">DASHBOARD</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-3 px-3">
                    {menuItems.map((group) => (
                        <div key={group.group} className="mb-1">
                            <button
                                onClick={() => toggleGroup(group.group)}
                                className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold text-[#999] tracking-[0.08em] hover:text-[#666]"
                            >
                                {group.group}
                                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openGroups[group.group] ? '' : '-rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openGroups[group.group] && (
                                <div className="space-y-0.5 mb-2">
                                    {group.items.map((item) => {
                                        const locked = isLocked(item.feature);
                                        const active = currentPath === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={locked ? '#' : item.href}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] transition-all duration-150 ${active
                                                    ? 'bg-[#E5654B] text-white font-medium shadow-sm'
                                                    : locked
                                                        ? 'text-[#ccc] cursor-not-allowed hover:bg-amber-50/50'
                                                        : 'text-[#555] hover:bg-[#f5f3f0] hover:text-[#1a1a1a]'
                                                    }`}
                                                onClick={locked ? (e) => handleLockedClick(e, item.label) : undefined}
                                            >
                                                <SvgIcon d={item.icon} className={active ? 'text-white' : locked ? 'text-[#ddd]' : 'text-[#999]'} />
                                                <span className="flex-1">{item.label}</span>
                                                {locked && (
                                                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Bottom */}
                <div className="border-t border-[#f0ede8] p-3 space-y-2">
                    {subscription && (
                        <div className={`px-3 py-2.5 rounded-xl text-xs font-medium ${subscription.plan?.slug === 'free'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                            <div className="flex items-center justify-between">
                                <span>Paket {subscription.plan?.name || 'Free'}</span>
                                {subscription.plan?.slug === 'free' && (
                                    <Link href="/pricing" className="text-[#E5654B] font-semibold hover:underline">Upgrade</Link>
                                )}
                            </div>
                            {subscription.expires_at && (
                                <div className="mt-1 text-[10px] opacity-60">s/d {new Date(subscription.expires_at).toLocaleDateString('id-ID')}</div>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-3 px-2 py-1.5">
                        <div className="w-8 h-8 rounded-full bg-[#E5654B] flex items-center justify-center text-white text-xs font-bold">
                            {auth.user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#333] truncate">{auth.user?.name}</div>
                        </div>
                        <Link href={route('logout')} method="post" as="button" className="p-1.5 rounded-lg hover:bg-red-50 text-[#bbb] hover:text-red-500 transition-colors" title="Logout">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ═══ Main Content ═══ */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                {/* Top Bar */}
                <header className="h-14 lg:h-16 bg-white flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-[0_1px_0_0_#e8e5e0]">
                    <div className="flex items-center gap-3">
                        {/* Mobile logo */}
                        <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#E5654B] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">G</div>
                            <span className="font-bold text-[#1a1a1a] text-sm">{appName || 'Groovy'}</span>
                        </Link>
                        {title && <h1 className="hidden lg:block text-lg font-bold text-[#1a1a1a]">{title}</h1>}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Desktop buttons */}
                        <Link
                            href={`/u/${auth.user?.invitation_slug || ''}`}
                            target="_blank"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#E5654B] bg-[#E5654B]/5 hover:bg-[#E5654B]/10 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Preview
                        </Link>
                        <Link href="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#777] hover:bg-[#f5f3f0] transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Account
                        </Link>

                        {/* Avatar dropdown */}
                        <div className="relative" ref={avatarRef}>
                            <button
                                onClick={() => setAvatarOpen(!avatarOpen)}
                                className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#E5654B] flex items-center justify-center text-white text-xs font-bold shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#E5654B]/30 focus:ring-offset-2"
                            >
                                {auth.user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </button>

                            {avatarOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e8e5e0] py-2 z-50">
                                    <div className="px-4 py-3 border-b border-[#f0ede8]">
                                    <div className="text-sm font-semibold text-[#333]">{auth.user?.name}</div>
                                    <div className="text-xs text-[#999] mt-0.5">{auth.user?.email || ''}</div>
                                    {subscription && (
                                        <div className="mt-2 flex items-center gap-1.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${subscription.plan?.slug === 'free' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {subscription.plan?.name || 'Free'}
                                            </span>
                                            {subscription.expires_at && (
                                                <span className="text-[10px] text-gray-400">s/d {new Date(subscription.expires_at).toLocaleDateString('id-ID')}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                    <div className="py-1">
                                        <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#f5f3f0] transition-colors"
                                            onClick={() => setAvatarOpen(false)}>
                                            <svg className="w-4 h-4 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                            Profil
                                        </Link>
                                        <a href={`/u/${auth.user?.invitation_slug || ''}`} target="_blank"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#f5f3f0] transition-colors"
                                            onClick={() => setAvatarOpen(false)}>
                                            <svg className="w-4 h-4 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Preview Undangan
                                        </a>
                                        <Link href="/pricing" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#f5f3f0] transition-colors"
                                            onClick={() => setAvatarOpen(false)}>
                                            <svg className="w-4 h-4 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                            </svg>
                                            Upgrade
                                        </Link>
                                    </div>
                                    <div className="border-t border-[#f0ede8] pt-1">
                                        <Link href={route('logout')} method="post" as="button"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                            </svg>
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content — bottom padding for mobile nav */}
                <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8 overflow-x-hidden page-enter">
                    <div className="stagger-children">
                        {children}
                    </div>
                </main>
            </div>

            {/* ═══ Mobile Bottom Navigation (5 icons w/ center Menu) ═══ */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e8e5e0] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-16 px-1">
                    {bottomNavItems.map(item => {
                        const active = isBottomActive(item);

                        // Center Menu FAB button
                        if (item.isCenter) {
                            return (
                                <button key="menu-center" onClick={() => setMenuSheetOpen(!menuSheetOpen)}
                                    className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                                        menuSheetOpen ? 'text-[#E5654B]' : 'text-[#999]'
                                    }`}>
                                    <div className="w-10 h-10 -mt-5 rounded-full bg-[#E5654B] flex items-center justify-center shadow-lg transition-transform duration-200"
                                        style={{ transform: menuSheetOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] leading-tight font-medium">{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link key={item.label} href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${active ? 'text-[#E5654B]' : 'text-[#999]'}`}>
                                <div className="relative">
                                    {active && (
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#E5654B] rounded-full" />
                                    )}
                                    <SvgIcon d={item.icon} className={`w-5 h-5 ${active ? 'text-[#E5654B]' : 'text-[#bbb]'}`} />
                                </div>
                                <span className={`text-[10px] leading-tight ${active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
                <div className="h-[env(safe-area-inset-bottom)]" />
            </nav>

            {/* ═══ Menu Sheet (slide-up from bottom) ═══ */}
            {menuSheetOpen && (
                <>
                    <div className="lg:hidden fixed inset-0 bg-black/30 z-[35] transition-opacity" style={{ bottom: '64px' }} onClick={() => setMenuSheetOpen(false)} />
                    <div className="lg:hidden fixed bottom-[64px] left-0 right-0 z-[38] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 p-4 pb-2 animate-in slide-in-from-bottom">
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

                        {/* Preview button */}
                        {auth.user?.invitation_slug && (
                            <a href={`/u/${auth.user.invitation_slug}`} target="_blank" onClick={() => setMenuSheetOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-[#E5654B]/5 border border-[#E5654B]/10 text-[#E5654B] text-sm font-medium">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Preview Undangan
                            </a>
                        )}

                        <div className="grid grid-cols-4 gap-2">
                            {menuSheetItems.map(item => (
                                <Link key={item.label} href={item.href} onClick={() => setMenuSheetOpen(false)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${
                                        currentPath === item.href || currentPath.startsWith(item.href)
                                            ? 'bg-[#E5654B]/10 ring-1 ring-[#E5654B]/20'
                                            : 'hover:bg-gray-50'
                                    }`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                        <SvgIcon d={item.icon} className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {/* ═══ Fixed Upgrade Popup (for locked sidebar items) ═══ */}
            {upgradePopup && (
                <div ref={upgradePopupRef}
                    className="fixed z-[9999] w-60 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-in"
                    style={{ left: upgradePopup.x, top: upgradePopup.y, transform: 'translateY(-50%)' }}>
                    {/* Arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-white drop-shadow-sm" />
                    <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                            <svg className="w-4.5 h-4.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <div>
                            <div className="text-[13px] font-bold text-gray-800">Fitur Premium</div>
                            <div className="text-[10px] text-gray-400">Upgrade untuk akses</div>
                        </div>
                    </div>
                    <p className="text-[11.5px] text-gray-500 mb-3 leading-relaxed">
                        <strong className="text-gray-700">{upgradePopup.label}</strong> tersedia di paket Premium. Upgrade sekarang untuk membuka fitur ini.
                    </p>
                    <Link href="/pricing" onClick={() => setUpgradePopup(null)}
                        className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:scale-[1.02] transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Upgrade Sekarang
                    </Link>
                </div>
            )}
        </div>
    );
}
