import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import RoleSwitcher from '../Components/RoleSwitcher';

const SvgIcon = ({ d, className = '' }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'Users', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v-1' },
    { label: 'Katalog Tema', href: '/admin/themes', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Katalog Kartu', href: '/admin/greeting-card-catalog', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
    // { label: 'Live Tamu', href: '/admin/live-tamu', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { label: 'Landing Page', href: '/admin/landing-page', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' },
    { label: 'Bio Link', href: '/admin/bio', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' },
    { label: 'Pendapatan', href: '/admin/pendapatan', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
    { label: 'Harga Paket', href: '/admin/pricing', icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z' },
    { label: 'Harga Kartu', href: '/admin/greeting-card-pricing', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    {
        label: 'Pengaturan',
        href: '/admin/branding',
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
        children: [
            { label: 'Identitas Brand', href: '/admin/branding?tab=brand' },
            { label: 'Rekening Pembayaran', href: '/admin/branding?tab=payment' },
            { label: 'Kontak & Sosmed', href: '/admin/branding?tab=social' },
            { label: 'Undangan Demo', href: '/admin/branding?tab=demo' }
        ]
    },
    // { label: 'Pencairan', href: '/admin/pencairan', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
    { label: 'FAQ & Panduan', href: '/admin/faq', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' },
];

const bottomNavItems = [
    { label: 'Dashboard', href: '/admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'User', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v-1', matchPrefix: '/admin/users' },
    { label: 'Menu', isCenter: true },
    { label: 'Tema', href: '/admin/themes', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', matchPrefix: '/admin/themes' },
    { label: 'Harga Paket', href: '/admin/pricing', icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z', matchPrefix: '/admin/pricing' },
];

const menuSheetItems = [
    // { label: 'Live Tamu', href: '/admin/live-tamu', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Pengaturan', href: '/admin/branding', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'bg-rose-50 text-rose-600' },
    { label: 'Landing Page', href: '/admin/landing-page', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418', color: 'bg-orange-50 text-[#c24b33]' },
    { label: 'Bio Link', href: '/admin/bio', icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244', color: 'bg-violet-50 text-violet-600' },
    { label: 'Katalog Kartu', href: '/admin/greeting-card-catalog', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z', color: 'bg-pink-50 text-pink-600' },
    { label: 'Pendapatan', href: '/admin/pendapatan', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', color: 'bg-amber-50 text-amber-600' },
    { label: 'Harga Kartu', href: '/admin/greeting-card-pricing', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-teal-50 text-teal-600' },
    // { label: 'Pencairan', href: '/admin/pencairan', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', color: 'bg-teal-50 text-[#c24b33]' },
    { label: 'FAQ & Panduan', href: '/admin/faq', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z', color: 'bg-orange-50 text-[#c24b33]' },
];

export default function AdminLayout({ children, title }) {
    const { url } = usePage();
    const { auth, resellerSubdomain, resellerCustomDomain, appUrl, appName, brandLogo } = usePage().props;
    const currentPath = url || '';
    const [avatarOpen, setAvatarOpen] = useState(false);
    const [menuSheetOpen, setMenuSheetOpen] = useState(false);
    const avatarRef = useRef(null);
    const [expandedMenus, setExpandedMenus] = useState({});

    useEffect(() => {
        if (currentPath.startsWith('/admin/branding')) {
            setExpandedMenus(prev => ({ ...prev, '/admin/branding': true }));
        }
    }, [currentPath]);

    // Notification Dropdown state
    const [notifications, setNotifications] = useState([]);
    const [notifCount, setNotifCount] = useState(0);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef(null);

    // Fetch notifications from the backend
    const fetchNotifications = async () => {
        try {
            const lastViewed = localStorage.getItem('notifications_viewed_at') || '';
            const response = await fetch(`/admin/notifications-data?last_viewed_at=${encodeURIComponent(lastViewed)}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setNotifCount(data.count || 0);
            }
        } catch (e) {
            console.error('Failed to fetch notifications:', e);
        }
    };

    const handleOpenNotif = () => {
        setNotifOpen(!notifOpen);
        if (!notifOpen) {
            setNotifCount(0);
            localStorage.setItem('notifications_viewed_at', new Date().toISOString());
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for dynamic updates
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const getPreviewUrl = () => {
        if (resellerCustomDomain) {
            return resellerCustomDomain.startsWith('http') ? resellerCustomDomain : `http://${resellerCustomDomain}`;
        }
        if (resellerSubdomain && appUrl) {
            try {
                const url = new URL(appUrl);
                return `${url.protocol}//${resellerSubdomain}.${url.host}`;
            } catch (e) {
                return `/r/${resellerSubdomain}`;
            }
        }
        return '#';
    };

    // Close avatar dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Auto-close mobile menu sheet on desktop view resizing
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMenuSheetOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Run on mount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isActive = (href) => {
        if (href.includes('?')) {
            if (currentPath === href) return true;
            if (href.endsWith('?tab=brand') && currentPath === '/admin/branding') return true;
            return false;
        }
        return currentPath === href || (href !== '/admin' && currentPath.startsWith(href) && !currentPath.startsWith('/admin/branding'));
    };

    const isBottomActive = (item) => {
        if (item.isCenter) return menuSheetOpen;
        if (item.matchPrefix) {
            return currentPath.startsWith(item.matchPrefix);
        }
        return currentPath === item.href;
    };

    return (
        <div className="min-h-screen bg-[#f8f7f4] flex">
            {/* ═══ Desktop Sidebar (hidden on mobile) ═══ */}
            <aside className="hidden lg:flex sticky top-0 h-screen w-[240px] bg-white flex-col shadow-[1px_0_0_0_#e8e5e0]">
                {/* Logo */}
                <div className="h-16 flex items-center px-5">
                    <Link href="/admin" className="flex items-center gap-3 w-full">
                        {brandLogo ? (
                            <img src={brandLogo} alt="Logo" className="w-9 h-9 object-contain flex-shrink-0" />
                        ) : (
                            <div className="w-9 h-9 bg-[#E5654B] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                                {(appName || 'G').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="font-bold text-[#1a1a1a] text-[15px] leading-tight truncate">{appName || 'Groovy'}</div>
                            <div className="text-[11px] text-[#999] font-medium tracking-wide">ADMIN PANEL</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <div className="px-3 py-2 text-[11px] font-semibold text-[#999] tracking-[0.08em]">MANAJEMEN</div>
                    {menuItems.map(item => {
                        const hasChildren = !!item.children;
                        const isExpanded = !!expandedMenus[item.href || ''];
                        const isAnyChildActive = hasChildren && item.children.some(child => isActive(child.href));

                        if (hasChildren) {
                            return (
                                <div key={item.label} className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() => setExpandedMenus(prev => ({ ...prev, [item.href]: !prev[item.href] }))}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 ${
                                            isAnyChildActive
                                                ? 'bg-[#E5654B]/5 text-[#E5654B] font-semibold'
                                                : 'text-[#555] hover:bg-[#f5f3f0] hover:text-[#1a1a1a]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <SvgIcon d={item.icon} className={isAnyChildActive ? 'text-[#E5654B]' : 'text-[#999]'} />
                                            <span>{item.label}</span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isExpanded && (
                                        <div className="pl-9 pr-2 py-1 space-y-1 border-l-2 border-[#f0ede8] ml-5 animate-in slide-in-from-top-1 duration-150">
                                            {item.children.map(child => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={`flex items-center py-1.5 rounded-lg text-[12.5px] transition-all duration-150 ${
                                                        isActive(child.href)
                                                            ? 'text-[#E5654B] font-bold'
                                                            : 'text-[#666] hover:text-[#1a1a1a]'
                                                    }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 ${isActive(item.href)
                                    ? 'bg-[#E5654B] text-white font-medium shadow-sm'
                                    : 'text-[#555] hover:bg-[#f5f3f0] hover:text-[#1a1a1a]'
                                    }`}>
                                <SvgIcon d={item.icon} className={isActive(item.href) ? 'text-white' : 'text-[#999]'} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Bottom */}
                <div className="border-t border-[#f0ede8] p-3 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-[#E5654B] flex items-center justify-center text-white text-xs font-bold">
                            {auth.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-[#333] truncate">{auth.user?.name}</div>
                            <div className="text-[10px] text-[#999]">Administrator</div>
                        </div>
                        <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg hover:bg-red-50 text-[#bbb] hover:text-red-500 transition-colors" title="Logout">
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
                            {brandLogo ? (
                                    <img src={brandLogo} alt="Logo" className="w-7 h-7 object-contain flex-shrink-0" />
                            ) : (
                                <div className="w-7 h-7 bg-[#E5654B] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                                    {(appName || 'G').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="font-bold text-[#1a1a1a] text-sm truncate max-w-[120px]">{appName || 'Groovy'}</span>
                        </Link>
                        {title && <h1 className="hidden lg:block text-lg font-bold text-[#1a1a1a]">{title}</h1>}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <RoleSwitcher auth={auth} />
                        </div>
                        <div className="hidden lg:flex items-center gap-2 text-sm text-[#999]">
                            <span>Admin:</span>
                            <span className="font-medium text-[#555]">{auth.user?.name}</span>
                        </div>

                        {/* Preview Landing Page */}
                        {resellerSubdomain && (
                            <a href={getPreviewUrl()} target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-xl hover:bg-[#fef2f0] text-[#999] hover:text-[#E5654B] transition-colors" title="Preview Landing Page">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </a>
                        )}

                        {/* ═══ Notification Bell Dropdown ═══ */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={handleOpenNotif}
                                className="relative p-2 rounded-xl text-gray-500 hover:text-[#E5654B] hover:bg-gray-50 transition-colors focus:outline-none"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                                {notifCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                                        {notifCount}
                                    </span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#e8e5e0] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-2.5 border-b border-[#f0ede8] flex items-center justify-between">
                                        <span className="font-bold text-sm text-[#1a1a1a]">Notifikasi</span>
                                        {notifCount > 0 && (
                                            <span className="text-xs bg-[#E5654B]/10 text-[#E5654B] font-bold px-2 py-0.5 rounded-full">
                                                {notifCount} baru
                                            </span>
                                        )}
                                    </div>

                                    <div className="max-h-64 overflow-y-auto divide-y divide-[#f0ede8]">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <a
                                                    key={notif.id}
                                                    href={notif.action_url}
                                                    className={`block p-4 hover:bg-gray-50/80 transition-colors text-left ${
                                                        notif.is_unread ? 'bg-orange-50/10' : ''
                                                    }`}
                                                    onClick={() => setNotifOpen(false)}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                                            {notif.badge}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                                                    </div>
                                                    <div className="text-xs font-semibold text-gray-800 mt-1.5 leading-snug">
                                                        {notif.title}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 mt-1 leading-normal">
                                                        {notif.message}
                                                    </div>
                                                    <div className="text-[10px] text-[#E5654B] font-bold mt-2 flex items-center gap-1">
                                                        Tindak Lanjut →
                                                    </div>
                                                </a>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-gray-400 text-xs">
                                                Tidak ada notifikasi baru
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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

                                    {/* Switch role on mobile only */}
                                    <div className="sm:hidden px-4 py-2 border-b border-[#f0ede8] bg-gray-50/50">
                                        <div className="text-[9px] font-bold text-[#999] tracking-wider mb-1.5 uppercase">Switch Role</div>
                                        <RoleSwitcher auth={auth} />
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

                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-[#f0ede8] pt-1">
                                        <Link href="/logout" method="post" as="button"
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
                <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8 overflow-x-clip page-enter" style={{ overflowX: 'clip' }}>
                    <div className="stagger-children">
                        {children}
                    </div>
                </main>
            </div>

            {/* ═══ Mobile Bottom Navigation (5 icons w/ center Menu FAB) ═══ */}
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
                        <div className="grid grid-cols-3 gap-2">
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
        </div>
    );
}
