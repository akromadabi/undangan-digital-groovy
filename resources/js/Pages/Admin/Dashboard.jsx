import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.5 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);

const iconPaths = {
    brand: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-9h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21',
    payment: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
    social: 'M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.074-.765 7.99 7.99 0 001.257-3.987C4.168 14.837 3 13.526 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
    pricing: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z',
    landing_page: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25',
    bio_link: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
    demo: 'M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488a2.25 2.25 0 01-2.178 0L5.433 11.887A2.25 2.25 0 014.25 9.906V9M21.75 9.75v8.25a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V9.75m19.5 0a2.25 2.25 0 00-2.25-2.25h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V9.75'
};

const iconColors = {
    brand: 'bg-indigo-50 text-indigo-600',
    payment: 'bg-blue-50 text-blue-600',
    social: 'bg-pink-50 text-pink-600',
    pricing: 'bg-emerald-50 text-emerald-600',
    landing_page: 'bg-orange-50 text-[#E5654B]',
    bio_link: 'bg-violet-50 text-violet-600',
    demo: 'bg-rose-50 text-rose-600'
};

const MiniBar = ({ value, max, color }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="w-full h-1.5 rounded-full bg-gray-100 mt-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
    );
};

const RingChart = ({ value, max, color, size = 56 }) => {
    const pct = max > 0 ? (value / max) * 100 : 0;
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} stroke="#f3f4f6" strokeWidth={5} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={5} fill="none"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
    );
};

export default function Dashboard({ stats, recentUsers, recentPayments, onboarding }) {
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

    const totalUsers = stats?.total_users || 0;
    const activeInvitations = stats?.active_invitations || 0;
    const totalRevenue = stats?.total_revenue || 0;
    const pendingPayments = stats?.pending_payments || 0;
    const totalViews = stats?.total_views || 0;
    const uniqueViews = stats?.unique_views || 0;
    const paidPayments = (recentPayments || []).filter(p => p.status === 'paid').length;
    const totalPayments = (recentPayments || []).length;

    const [isOnboardingCollapsed, setIsOnboardingCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('reseller_onboarding_collapsed') === 'true';
        }
        return false;
    });

    const [isOnboardingDismissed, setIsOnboardingDismissed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('reseller_onboarding_dismissed') === 'true';
        }
        return false;
    });

    const toggleOnboarding = () => {
        const nextState = !isOnboardingCollapsed;
        setIsOnboardingCollapsed(nextState);
        localStorage.setItem('reseller_onboarding_collapsed', nextState.toString());
    };

    const dismissOnboarding = () => {
        setIsOnboardingDismissed(true);
        localStorage.setItem('reseller_onboarding_dismissed', 'true');
    };

    const restoreOnboarding = () => {
        setIsOnboardingDismissed(false);
        localStorage.setItem('reseller_onboarding_dismissed', 'false');
    };

    const checklist = onboarding?.checklist || [];
    const statsOnboarding = onboarding?.stats || { completed_count: 0, total_count: 7, percentage: 0 };

    // Auto-collapse when 100% complete to save dashboard space
    const showOnboarding = checklist.length > 0 && !isOnboardingDismissed && statsOnboarding.percentage < 100;

    return (
        <AdminLayout title="Dashboard Admin">
            <Head title="Admin Dashboard" />
            <div className="space-y-6">

                {/* ═══ Welcome Banner ═══ */}
                <div className="bg-gradient-to-br from-[#E5654B] via-[#d55a42] to-[#c44f38] rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-6 -right-16 w-48 h-48 rounded-full bg-white/5" />
                    <div className="absolute top-6 right-28 w-20 h-20 rounded-full bg-white/5" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                                <Icon d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Dashboard Admin</h2>
                                <p className="text-white/70 text-sm">Ringkasan platform undangan digital</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5">
                                <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-3.5 h-3.5" />
                                {totalUsers} users terdaftar
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5">
                                <Icon d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-3.5 h-3.5" />
                                {activeInvitations} undangan aktif
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Onboarding Restoration Notice (If Dismissed and not 100% complete) ═══ */}
                {isOnboardingDismissed && statsOnboarding.percentage < 100 && (
                    <div className="bg-[#E5654B]/5 border border-[#E5654B]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-700">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5654B] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5654B]"></span>
                            </span>
                            <span>Setup brand Anda belum selesai <strong>({statsOnboarding.percentage}% Progres)</strong>. Selesaikan langkah setup untuk mulai berjualan.</span>
                        </div>
                        <button onClick={restoreOnboarding} className="font-bold text-[#E5654B] hover:text-[#c94f3a] underline self-end sm:self-auto transition-colors">
                            Tampilkan Panduan Setup
                        </button>
                    </div>
                )}

                {/* ═══ Onboarding Checklist ═══ */}
                {showOnboarding && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden shadow-sm transition-all duration-300">
                        {/* Header */}
                        <div className="p-5 border-b border-[#f0ede8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#E5654B]/10 text-[#E5654B] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                                        ONBOARDING
                                    </span>
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Panduan Setup & Aktivasi Brand Reseller</h3>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Lengkapi konfigurasi berikut untuk mengaktifkan brand dan mulai berjualan undangan digital Anda sendiri.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-900 block sm:inline mr-1">
                                        {statsOnboarding.completed_count} dari {statsOnboarding.total_count} Selesai
                                    </span>
                                    <span className="text-xs text-[#E5654B] font-semibold">
                                        ({statsOnboarding.percentage}% Progres)
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 border-l border-gray-200 pl-3">
                                    <button 
                                        onClick={toggleOnboarding}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                        title={isOnboardingCollapsed ? "Tampilkan Langkah" : "Sembunyikan Langkah"}
                                    >
                                        <svg className={`w-5 h-5 transition-transform duration-300 ${isOnboardingCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={dismissOnboarding}
                                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Sembunyikan Panduan Permanen"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-5 py-1.5 bg-gray-50/50 border-b border-[#f0ede8]">
                            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden relative">
                                <div 
                                    className="h-full rounded-full bg-gradient-to-r from-[#E5654B] to-emerald-500 transition-all duration-1000 ease-out" 
                                    style={{ width: `${statsOnboarding.percentage}%` }} 
                                />
                            </div>
                        </div>

                        {/* Steps Grid (2-column on mobile, 3-column on desktop) */}
                        {!isOnboardingCollapsed && (
                            <div className="p-3 sm:p-5 bg-[#faf9f6]/30 grid grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4">
                                {checklist.map((step, idx) => {
                                    const iconPath = iconPaths[step.key] || '';
                                    const colorClass = iconColors[step.key] || 'bg-gray-100 text-gray-600';
                                    
                                    return (
                                        <div 
                                            key={step.key} 
                                            className={`bg-white rounded-xl border p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 group ${
                                                step.is_completed 
                                                    ? 'border-emerald-100 shadow-sm hover:shadow-md' 
                                                    : 'border-[#e8e5e0] hover:border-[#E5654B]/30 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="space-y-2.5">
                                                {/* Icon & Status Badge */}
                                                <div className="flex items-center justify-between">
                                                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${colorClass} shadow-sm flex-shrink-0`}>
                                                        <Icon d={iconPath} className="w-4 h-4 sm:w-5 h-5" />
                                                    </div>
                                                    
                                                    {step.is_completed ? (
                                                        <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-emerald-50 text-emerald-700 text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ring-1 ring-emerald-600/10">
                                                            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span className="hidden xs:inline">Selesai</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-gray-100 text-gray-500 text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
                                                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="hidden xs:inline">Menunggu</span>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Title & Desc */}
                                                <div className="space-y-0.5">
                                                    <h4 className="text-[11px] sm:text-[13px] font-bold text-gray-900 leading-snug">
                                                        Langkah {idx + 1}: {step.title}
                                                    </h4>
                                                    <p className="text-[9px] sm:text-[11px] text-gray-500 leading-normal line-clamp-2 sm:line-clamp-none min-h-[28px] sm:min-h-[36px]">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions & Auto-detect Label */}
                                            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1">
                                                <Link 
                                                    href={step.href} 
                                                    className="text-[10px] sm:text-xs font-bold text-[#E5654B] hover:text-[#c94f3a] transition-all flex items-center gap-0.5 group-hover:translate-x-0.5 flex-shrink-0"
                                                >
                                                    Konfigurasi 
                                                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </Link>
                                                
                                                <span className="text-[7px] sm:text-[9px] text-gray-400 font-semibold tracking-wider uppercase flex items-center gap-0.5 truncate">
                                                    <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${step.is_completed ? 'bg-emerald-500' : 'bg-blue-500'} flex-shrink-0`} />
                                                    <span className="hidden sm:inline">Deteksi Sistem</span>
                                                    <span className="sm:hidden">Sistem</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ Stats Grid ═══ */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                    {/* Total Users */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider truncate">Total Users</p>
                                <p className="text-xl sm:text-3xl font-bold text-[#1a1a1a] mt-1 sm:mt-2">{totalUsers}</p>
                                <p className="text-[10px] sm:text-xs text-[#999] mt-1.5 flex items-center gap-1 truncate">
                                    <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-3 h-3 flex-shrink-0" />
                                    <span>user terdaftar</span>
                                </p>
                            </div>
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-4 h-4 sm:w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={totalUsers} max={Math.max(totalUsers, 10)} color="#3b82f6" />
                    </div>

                    {/* Undangan Aktif */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider truncate">Undangan Aktif</p>
                                <p className="text-xl sm:text-3xl font-bold text-[#1a1a1a] mt-1 sm:mt-2">{activeInvitations}</p>
                                <p className="text-[10px] sm:text-xs text-[#999] mt-1.5 flex items-center gap-1 truncate">
                                    {totalUsers > 0 ? (
                                        <span><strong className="text-emerald-600 font-semibold">{Math.round((activeInvitations / totalUsers) * 100)}%</strong> dari user</span>
                                    ) : <span>undangan dibuat</span>}
                                </p>
                            </div>
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                <Icon d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-4 h-4 sm:w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={activeInvitations} max={Math.max(totalUsers, 1)} color="#10b981" />
                    </div>

                    {/* Revenue */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider truncate">Revenue</p>
                                <p className="text-lg sm:text-2xl font-bold text-[#1a1a1a] mt-1 sm:mt-2 truncate">{formatCurrency(totalRevenue)}</p>
                                <p className="text-[10px] sm:text-xs text-[#999] mt-1.5 flex items-center gap-1 truncate">
                                    <Icon d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" className="w-3 h-3 flex-shrink-0" />
                                    <span>total pendapatan</span>
                                </p>
                            </div>
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                <Icon d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" className="w-4 h-4 sm:w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Pending Payment */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider truncate">Pending Payment</p>
                                <p className="text-xl sm:text-3xl font-bold text-[#1a1a1a] mt-1 sm:mt-2">{pendingPayments}</p>
                                <p className="text-[10px] sm:text-xs mt-1.5 truncate">
                                    {pendingPayments > 0 ? (
                                        <span className="text-amber-600 font-medium inline-flex items-center gap-1">
                                            <Icon d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" className="w-3 h-3 flex-shrink-0" />
                                            perlu diproses
                                        </span>
                                    ) : (
                                        <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                                            <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3 h-3 flex-shrink-0" />
                                            semua clear
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br ${pendingPayments > 0 ? 'from-amber-500 to-amber-600' : 'from-violet-500 to-violet-600'} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                                <Icon d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 sm:w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={pendingPayments} max={Math.max(pendingPayments + paidPayments, 1)} color={pendingPayments > 0 ? '#f59e0b' : '#8b5cf6'} />
                    </div>

                    {/* Website Dikunjungi */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3.5 sm:p-5 hover:shadow-md transition-all group col-span-2 lg:col-span-1 xl:col-span-1">
                        <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider truncate">Website Dikunjungi</p>
                                <p className="text-xl sm:text-3xl font-bold text-[#1a1a1a] mt-1 sm:mt-2">{totalViews}</p>
                                <p className="text-[10px] sm:text-xs text-[#999] mt-1.5 flex items-center gap-1 truncate">
                                    <Icon d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                                    <span><strong>{uniqueViews}</strong> pengunjung unik</span>
                                </p>
                            </div>
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4 sm:w-5 h-5 text-white" />
                            </div>
                        </div>
                        <MiniBar value={uniqueViews} max={Math.max(totalViews, 1)} color="#06b6d4" />
                    </div>
                </div>

                {/* ═══ Overview Infographic Row ═══ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {/* Conversion Rate */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3 sm:p-5 flex items-center gap-2 sm:gap-4">
                        <div className="relative flex-shrink-0">
                            <RingChart value={activeInvitations} max={Math.max(totalUsers, 1)} color="#10b981" size={48} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] sm:text-xs font-bold text-[#1a1a1a]">{totalUsers > 0 ? Math.round((activeInvitations / totalUsers) * 100) : 0}%</span>
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider truncate">Konversi User</p>
                            <p className="text-xs sm:text-sm font-bold text-[#1a1a1a] mt-0.5 sm:mt-1 truncate">{activeInvitations} dari {totalUsers}</p>
                            <p className="text-[9px] sm:text-xs text-[#999] mt-0.5 truncate">membuat undangan</p>
                        </div>
                    </div>

                    {/* Payment Success Rate */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3 sm:p-5 flex items-center gap-2 sm:gap-4">
                        <div className="relative flex-shrink-0">
                            <RingChart value={paidPayments} max={Math.max(totalPayments, 1)} color="#E5654B" size={48} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] sm:text-xs font-bold text-[#1a1a1a]">{totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0}%</span>
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider truncate">Sukses Bayar</p>
                            <p className="text-xs sm:text-sm font-bold text-[#1a1a1a] mt-0.5 sm:mt-1 truncate">{paidPayments} dari {totalPayments}</p>
                            <p className="text-[9px] sm:text-xs text-[#999] mt-0.5 truncate">pembayaran berhasil</p>
                        </div>
                    </div>

                    {/* Average Revenue per User */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3 sm:p-5 flex items-center gap-2 sm:gap-4 col-span-2 sm:col-span-1">
                        <div className="w-9.5 h-9.5 sm:w-[60px] sm:h-[60px] rounded-lg sm:rounded-xl bg-gradient-to-br from-[#E5654B]/10 to-orange-50 flex items-center justify-center flex-shrink-0">
                            <Icon d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" className="w-5 h-5 sm:w-7 sm:h-7 text-[#E5654B]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider truncate">Avg / User</p>
                            <p className="text-xs sm:text-sm font-bold text-[#1a1a1a] mt-0.5 sm:mt-1 truncate">{formatCurrency(activeInvitations > 0 ? Math.round(totalRevenue / activeInvitations) : 0)}</p>
                            <p className="text-[9px] sm:text-xs text-[#999] mt-0.5 truncate">rata-rata per undangan</p>
                        </div>
                    </div>
                </div>

                {/* ═══ Two Columns: Recent Users + Recent Payments ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-[#1a1a1a] text-sm">User Terbaru</h3>
                            </div>
                            <Link href="/admin/users" className="text-xs font-medium text-[#E5654B] hover:text-[#c94f3a] transition-colors inline-flex items-center gap-1">
                                Lihat Semua
                                <Icon d="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-[#f5f3f0]">
                            {(recentUsers || []).map((u, i) => (
                                <div key={u.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#faf9f6] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white`}
                                            style={{ background: `hsl(${(i * 47 + 10) % 360}, 65%, 55%)` }}>
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-[#333]">{u.name}</div>
                                            <div className="text-xs text-[#999]">{u.email}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-[#bbb] font-medium">{new Date(u.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                            ))}
                            {(!recentUsers || recentUsers.length === 0) && (
                                <div className="px-6 py-8 text-center">
                                    <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-8 h-8 text-[#ddd] mx-auto mb-2" />
                                    <p className="text-[#999] text-sm">Belum ada user</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <Icon d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-4 h-4 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-[#1a1a1a] text-sm">Payment Terbaru</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {pendingPayments > 0 && (
                                    <span className="bg-amber-50 text-amber-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                                        {pendingPayments} pending
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="divide-y divide-[#f5f3f0]">
                            {(recentPayments || []).map(p => (
                                <div key={p.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#faf9f6] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {p.status === 'paid' ? (
                                                <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" />
                                            ) : (
                                                <Icon d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-[#333]">{p.user?.name || '-'}</div>
                                            <div className="text-xs text-[#999]">{p.plan?.name || '-'} · {formatCurrency(p.amount)}</div>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            ))}
                            {(!recentPayments || recentPayments.length === 0) && (
                                <div className="px-6 py-8 text-center">
                                    <Icon d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-8 h-8 text-[#ddd] mx-auto mb-2" />
                                    <p className="text-[#999] text-sm">Belum ada pembayaran</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ Quick Actions ═══ */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
                    <h3 className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Icon d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" className="w-4 h-4" />
                        Aksi Cepat
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Kelola Users', href: '/admin/users', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', color: 'blue' },
                            { label: 'Kelola Paket', href: '/admin/plans', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9', color: 'emerald' },
                            { label: 'Kelola Tema', href: '/admin/themes', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42', color: 'violet' },
                            { label: 'Pengaturan', href: '/admin/settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'orange' },
                        ].map(action => {
                            const colorMap = { blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100', emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100', violet: 'bg-violet-50 text-violet-600 hover:bg-violet-100', orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100' };
                            return (
                                <Link key={action.label} href={action.href}
                                    className={`flex items-center gap-2.5 p-3 rounded-xl ${colorMap[action.color]} transition-all hover:-translate-y-0.5`}>
                                    <Icon d={action.icon} className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-xs font-semibold">{action.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
