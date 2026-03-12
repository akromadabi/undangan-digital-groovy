import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

const SvgIcon = ({ d, className = '' }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

const menuItems = [
    { label: 'Dashboard', href: '/super-admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'Reseller', href: '/super-admin/resellers', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
    { label: 'Paket', href: '/super-admin/plans', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Tema', href: '/super-admin/themes', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01' },

    { label: 'Musik', href: '/super-admin/music', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { label: 'Kutipan', href: '/super-admin/quotes', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'Settings', href: '/super-admin/settings', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
];

export default function SuperAdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [avatarOpen, setAvatarOpen] = useState(false);
    const avatarRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isActive = (href) => currentPath === href || (href !== '/super-admin' && currentPath.startsWith(href));

    return (
        <div className="min-h-screen bg-[#f8f7f4] flex">
            {/* ═══ Desktop Sidebar ═══ */}
            <aside className="hidden lg:flex sticky top-0 h-screen w-[240px] bg-white flex-col shadow-[1px_0_0_0_#e8e5e0]">
                {/* Logo */}
                <div className="h-16 flex items-center px-5">
                    <Link href="/super-admin" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E5654B] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">G</div>
                        <div>
                            <div className="font-bold text-[#1a1a1a] text-[15px] leading-tight">Groovy</div>
                            <div className="text-[11px] text-[#999] font-medium tracking-wide">SUPER ADMIN</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <div className="px-3 py-2 text-[11px] font-semibold text-[#999] tracking-[0.08em]">MANAJEMEN</div>
                    {menuItems.map(item => (
                        <Link key={item.href} href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 ${isActive(item.href)
                                ? 'bg-[#E5654B] text-white font-medium shadow-sm'
                                : 'text-[#555] hover:bg-[#f5f3f0] hover:text-[#1a1a1a]'
                                }`}>
                            <SvgIcon d={item.icon} className={isActive(item.href) ? 'text-white' : 'text-[#999]'} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Bottom */}
                <div className="border-t border-[#f0ede8] p-3 space-y-1">
                    <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#999] hover:text-[#E5654B] rounded-xl hover:bg-[#fef2f0] transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Admin Panel
                    </Link>
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-[#E5654B] flex items-center justify-center text-white text-xs font-bold">
                            {auth.user?.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#333] truncate">{auth.user?.name}</div>
                            <div className="text-[10px] text-[#999]">Super Admin</div>
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
                        <Link href="/super-admin" className="lg:hidden flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#E5654B] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">G</div>
                            <span className="font-bold text-[#1a1a1a] text-sm">Groovy</span>
                        </Link>
                        {title && <h1 className="hidden lg:block text-lg font-bold text-[#1a1a1a]">{title}</h1>}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2 text-sm text-[#999]">
                            <span>Super Admin:</span>
                            <span className="font-medium text-[#555]">{auth.user?.name}</span>
                        </div>

                        <div className="relative" ref={avatarRef}>
                            <button
                                onClick={() => setAvatarOpen(!avatarOpen)}
                                className="w-9 h-9 rounded-full bg-[#E5654B] flex items-center justify-center text-white text-sm font-bold shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#E5654B]/30 focus:ring-offset-2"
                            >
                                {auth.user?.name?.charAt(0)?.toUpperCase() || 'S'}
                            </button>

                            {avatarOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e8e5e0] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-3 border-b border-[#f0ede8]">
                                        <div className="text-sm font-semibold text-[#333]">{auth.user?.name}</div>
                                        <div className="text-xs text-[#999] mt-0.5">{auth.user?.email || 'Super Admin'}</div>
                                    </div>
                                    <div className="py-1">
                                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#f5f3f0] transition-colors"
                                            onClick={() => setAvatarOpen(false)}>
                                            <SvgIcon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-4 h-4 text-[#999]" />
                                            Admin Panel
                                        </Link>
                                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#f5f3f0] transition-colors"
                                            onClick={() => setAvatarOpen(false)}>
                                            <SvgIcon d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" className="w-4 h-4 text-[#999]" />
                                            User Dashboard
                                        </Link>
                                    </div>
                                    <div className="border-t border-[#f0ede8] pt-1">
                                        <Link href={route('logout')} method="post" as="button"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                                            <SvgIcon d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" className="w-4 h-4" />
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8 overflow-x-hidden page-enter">
                    <div className="stagger-children">
                        {children}
                    </div>
                </main>
            </div>

            {/* ═══ Mobile Bottom Navigation ═══ */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e8e5e0] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-16 px-1">
                    {menuItems.slice(0, 5).map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${active ? 'text-[#E5654B]' : 'text-[#999]'}`}>
                                <div className="relative">
                                    {active && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#E5654B] rounded-full" />}
                                    <SvgIcon d={item.icon} className={`w-5 h-5 ${active ? 'text-[#E5654B]' : 'text-[#bbb]'}`} />
                                </div>
                                <span className={`text-[10px] leading-tight ${active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
                <div className="h-[env(safe-area-inset-bottom)]" />
            </nav>
        </div>
    );
}
