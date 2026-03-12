import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

const SvgIcon = ({ d, className = '' }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'Users', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v-1' },
    { label: 'Live Tamu', href: '/admin/live-tamu', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { label: 'Branding', href: '/admin/branding', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
    { label: 'Landing Page', href: '/admin/landing-page', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' },
    { label: 'Pendapatan', href: '/admin/pendapatan', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
    { label: 'Domain', href: '/admin/domain', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-6.364-6.364L4.757 8.25a4.5 4.5 0 003.182 7.682' },
];

export default function AdminLayout({ children, title }) {
    const { auth, resellerSubdomain } = usePage().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [avatarOpen, setAvatarOpen] = useState(false);
    const avatarRef = useRef(null);

    // Close avatar dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isActive = (href) => currentPath === href || (href !== '/admin' && currentPath.startsWith(href));

    return (
        <div className="min-h-screen bg-[#f8f7f4] flex">
            {/* ═══ Desktop Sidebar (hidden on mobile) ═══ */}
            <aside className="hidden lg:flex sticky top-0 h-screen w-[240px] bg-white flex-col shadow-[1px_0_0_0_#e8e5e0]">
                {/* Logo */}
                <div className="h-16 flex items-center px-5">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E5654B] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">G</div>
                        <div>
                            <div className="font-bold text-[#1a1a1a] text-[15px] leading-tight">Groovy</div>
                            <div className="text-[11px] text-[#999] font-medium tracking-wide">ADMIN PANEL</div>
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
                    {auth.user?.role === 'super_admin' && (
                        <Link href="/super-admin" className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-violet-600 hover:text-violet-700 rounded-xl hover:bg-violet-50 transition-colors font-medium">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                            </svg>
                            Super Admin Panel
                        </Link>
                    )}
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#999] hover:text-[#E5654B] rounded-xl hover:bg-[#fef2f0] transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        User Dashboard
                    </Link>
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-[#E5654B] flex items-center justify-center text-white text-xs font-bold">
                            {auth.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#333] truncate">{auth.user?.name}</div>
                            <div className="text-[10px] text-[#999]">Administrator</div>
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
                        <Link href="/admin" className="lg:hidden flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#E5654B] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">G</div>
                            <span className="font-bold text-[#1a1a1a] text-sm">Groovy</span>
                        </Link>
                        {title && <h1 className="hidden lg:block text-lg font-bold text-[#1a1a1a]">{title}</h1>}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2 text-sm text-[#999]">
                            <span>Admin:</span>
                            <span className="font-medium text-[#555]">{auth.user?.name}</span>
                        </div>

                        {/* Preview Landing Page */}
                        {resellerSubdomain && (
                            <a href={`/r/${resellerSubdomain}`} target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-xl hover:bg-[#fef2f0] text-[#999] hover:text-[#E5654B] transition-colors" title="Preview Landing Page">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </a>
                        )}

                        {/* Avatar dropdown (visible on both, mainly for mobile) */}
                        <div className="relative" ref={avatarRef}>
                            <button
                                onClick={() => setAvatarOpen(!avatarOpen)}
                                className="w-9 h-9 rounded-full bg-[#E5654B] flex items-center justify-center text-white text-sm font-bold shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#E5654B]/30 focus:ring-offset-2"
                            >
                                {auth.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </button>

                            {avatarOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e8e5e0] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-[#f0ede8]">
                                        <div className="text-sm font-semibold text-[#333]">{auth.user?.name}</div>
                                        <div className="text-xs text-[#999] mt-0.5">{auth.user?.email || 'Administrator'}</div>
                                    </div>

                                    {/* Menu items */}
                                    <div className="py-1">
                                        <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#f5f3f0] transition-colors"
                                            onClick={() => setAvatarOpen(false)}>
                                            <svg className="w-4 h-4 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                            Profil
                                        </Link>
                                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#f5f3f0] transition-colors"
                                            onClick={() => setAvatarOpen(false)}>
                                            <svg className="w-4 h-4 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                            </svg>
                                            User Dashboard
                                        </Link>
                                    </div>

                                    {/* Logout */}
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

                {/* Page Content - add bottom padding on mobile for bottom nav */}
                <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8 overflow-x-hidden page-enter">
                    <div className="stagger-children">
                        {children}
                    </div>
                </main>
            </div>

            {/* ═══ Mobile Bottom Navigation ═══ */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e8e5e0] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-16 px-1">
                    {menuItems.map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${active ? 'text-[#E5654B]' : 'text-[#999]'}`}>
                                <div className={`relative ${active ? '' : ''}`}>
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
                {/* Safe area padding for notched phones */}
                <div className="h-[env(safe-area-inset-bottom)]" />
            </nav>
        </div>
    );
}
