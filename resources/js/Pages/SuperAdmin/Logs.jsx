import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    RefreshCw, 
    Database, 
    User as UserIcon, 
    Shield, 
    Trash2, 
    RotateCcw,
    Calendar,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Info,
    AlertTriangle,
    X
} from 'lucide-react';

export default function LogsPage({ logs, filters, categories }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');
    const [category, setCategory] = useState(filters.category || 'all');
    const [activityType, setActivityType] = useState(filters.activity_type || 'all');
    const [isFiltering, setIsFiltering] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(
        (filters.role && filters.role !== 'all') || 
        (filters.category && filters.category !== 'all') ||
        (filters.activity_type && filters.activity_type !== 'all')
    );
    
    // Restore modal states
    const [restoringLog, setRestoringLog] = useState(null);
    const [restoring, setRestoring] = useState(false);
    const [toast, setToast] = useState(null);

    // Apply filters
    const handleFilterChange = (newFilters = {}) => {
        setIsFiltering(true);
        const searchVal = newFilters.hasOwnProperty('search') ? newFilters.search : search;
        const roleVal = newFilters.hasOwnProperty('role') ? newFilters.role : role;
        const categoryVal = newFilters.hasOwnProperty('category') ? newFilters.category : category;
        const activityTypeVal = newFilters.hasOwnProperty('activity_type') ? newFilters.activity_type : activityType;

        router.get('/super-admin/logs', {
            search: searchVal,
            role: roleVal,
            category: categoryVal,
            activity_type: activityTypeVal
        }, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsFiltering(false)
        });
    };

    // Debounced search trigger or manual search
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange();
    };

    // Reset filters
    const handleReset = () => {
        setSearch('');
        setRole('all');
        setCategory('all');
        setActivityType('all');
        setShowAdvancedFilters(false);
        setIsFiltering(true);
        router.get('/super-admin/logs', {}, {
            preserveState: false,
            onFinish: () => setIsFiltering(false)
        });
    };

    // Trigger restore
    const handleRestoreSubmit = () => {
        if (!restoringLog) return;
        setRestoring(true);
        router.post(`/super-admin/logs/${restoringLog.id}/restore`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('success', 'Data berhasil dipulihkan!');
                setRestoringLog(null);
            },
            onError: (err) => {
                const msg = err.error || 'Gagal memulihkan data. Kemungkinan data penunjang sudah tidak ada.';
                showToast('error', msg);
            },
            onFinish: () => setRestoring(false)
        });
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 5000);
    };

    // Format local date string
    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        const d = new Date(timeStr);
        return d.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Style helper for Roles
    const getRoleBadge = (role) => {
        switch (role) {
            case 'super_admin':
                return <span className="px-2 py-0.5 text-[9px] font-bold bg-red-50 text-red-600 rounded border border-red-150 uppercase tracking-wide">Super Admin</span>;
            case 'reseller':
                return <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 rounded border border-blue-150 uppercase tracking-wide">Reseller</span>;
            case 'user':
                return <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-600 rounded border border-emerald-150 uppercase tracking-wide">User</span>;
            case 'guest':
            default:
                return <span className="px-2 py-0.5 text-[9px] font-bold bg-gray-50 text-gray-600 rounded border border-gray-150 uppercase tracking-wide">Guest</span>;
        }
    };

    // Style helper for Activity Types
    const getActivityBadge = (type) => {
        switch (type) {
            case 'create':
                return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-700 rounded">TAMBAH</span>;
            case 'update':
                return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 rounded">EDIT</span>;
            case 'delete':
                return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-700 rounded">HAPUS</span>;
            case 'login':
                return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-700 rounded">MASUK</span>;
            default:
                return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-gray-100 text-gray-700 rounded">{type?.toUpperCase() || 'LAINNYA'}</span>;
        }
    };

    return (
        <SuperAdminLayout title="Log Aktifitas Sistem">
            <Head title="Log Aktifitas - Super Admin" />

            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                {/* Toast Notification */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 rounded-2xl p-4 flex items-start gap-3 shadow-lg border max-w-sm animate-in slide-in-from-top-4 ${
                        toast.type === 'error'
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                        {toast.type === 'error' ? <XCircle className="w-5 h-5 text-red-600 shrink-0" /> : <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                        <div className="flex-1 text-sm font-medium">{toast.message}</div>
                        <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Top Info Bar */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                            <Database className="w-4.5 h-4.5 text-[#E5654B]" /> Riwayat Aktifitas Pengguna
                        </h2>
                        <p className="text-[11px] text-[#888] mt-0.5">Lacak seluruh aksi tambah, ubah, dan hapus data secara real-time.</p>
                    </div>
                    <div className="text-[11px] font-semibold text-[#E5654B] bg-[#fdf5f3] border border-[#fcebe7] px-3 py-1 rounded-full shrink-0 flex items-center justify-center">
                        {isFiltering ? (
                            <span className="flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Memfilter...
                            </span>
                        ) : (
                            `Total: ${logs.total} entri`
                        )}
                    </div>
                </div>

                {/* Filters Section */}
                <div className="space-y-3">
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-3 sm:p-4 shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            {/* Text Search */}
                            <form onSubmit={handleSearchSubmit} className="relative flex-1">
                                <input 
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari pelaku, deskripsi log..."
                                    className="w-full border border-[#e8e5e0] rounded-xl pl-10 pr-20 py-2 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all bg-[#faf9f6]/40"
                                />
                                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                
                                <button 
                                    type="submit"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#E5654B] text-white hover:bg-[#d4523a] text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                >
                                    Cari
                                </button>
                            </form>

                            <div className="flex gap-2 shrink-0">
                                <button 
                                    type="button"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 text-xs font-bold rounded-xl transition-all border ${
                                        showAdvancedFilters 
                                            ? 'bg-[#fdf5f3] border-[#fcebe7] text-[#E5654B]' 
                                            : 'bg-white border-[#e8e5e0] text-gray-600 hover:bg-[#faf9f6]'
                                    }`}
                                >
                                    <Filter className="w-3.5 h-3.5" />
                                    <span>Filter Peran, Kategori & Tindakan</span>
                                    {(role !== 'all' || category !== 'all' || activityType !== 'all') && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#E5654B]" />
                                    )}
                                </button>

                                {(search || role !== 'all' || category !== 'all' || activityType !== 'all') && (
                                    <button 
                                        type="button"
                                        onClick={handleReset}
                                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3.5 py-2.5 sm:py-2 rounded-xl transition-colors hover:bg-gray-100"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Collapsible Advanced Filters */}
                        {showAdvancedFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#f5f3f0] transition-all duration-300 ease-in-out">
                                {/* Filter Peran/Role */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Peran Pengguna</label>
                                    <div className="relative">
                                        <select 
                                            value={role}
                                            onChange={(e) => { setRole(e.target.value); handleFilterChange({ role: e.target.value }); }}
                                            className="w-full border border-[#e8e5e0] rounded-xl pl-3 pr-8 py-2 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all bg-[#faf9f6]/40 appearance-none font-medium text-gray-700"
                                        >
                                            <option value="all">Semua Peran (Role)</option>
                                            <option value="super_admin">Super Admin</option>
                                            <option value="reseller">Reseller</option>
                                            <option value="user">User</option>
                                            <option value="guest">Guest</option>
                                        </select>
                                        <Filter className="w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Filter Kategori */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kategori Aktivitas</label>
                                    <div className="relative">
                                        <select 
                                            value={category}
                                            onChange={(e) => { setCategory(e.target.value); handleFilterChange({ category: e.target.value }); }}
                                            className="w-full border border-[#e8e5e0] rounded-xl pl-3 pr-8 py-2 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all bg-[#faf9f6]/40 appearance-none font-medium text-gray-700"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                        <Filter className="w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Filter Tindakan */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tindakan</label>
                                    <div className="relative">
                                        <select 
                                            value={activityType}
                                            onChange={(e) => { setActivityType(e.target.value); handleFilterChange({ activity_type: e.target.value }); }}
                                            className="w-full border border-[#e8e5e0] rounded-xl pl-3 pr-8 py-2 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all bg-[#faf9f6]/40 appearance-none font-medium text-gray-700"
                                        >
                                            <option value="all">Semua Tindakan</option>
                                            <option value="create">Tambah</option>
                                            <option value="update">Edit</option>
                                            <option value="delete">Hapus</option>
                                            <option value="login">Masuk (Login)</option>
                                        </select>
                                        <Filter className="w-3 h-3 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Logs Data Container (Desktop Table / Mobile Cards) */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] shadow-sm overflow-hidden">
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-[#faf9f6] text-xs font-bold text-gray-500 border-b border-[#e8e5e0] uppercase tracking-wider">
                                    <th className="px-4 py-3">Waktu</th>
                                    <th className="px-4 py-3">Pelaku</th>
                                    <th className="px-4 py-3">Peran (Role)</th>
                                    <th className="px-4 py-3">Aktivitas</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Deskripsi</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f5f3f0] text-gray-700">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => {
                                        const isDelete = log.activity_type === 'delete';
                                        const hasPayload = log.payload !== null;
                                        
                                        return (
                                            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        {formatTime(log.created_at)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-[#e8e5e0]">
                                                            <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold block text-[13px] text-gray-800 leading-none">
                                                                {log.user?.name ?? 'Tamu Publik'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 block mt-0.5 truncate max-w-[150px]">
                                                                {log.user?.email ?? '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5 whitespace-nowrap">
                                                    {getRoleBadge(log.role)}
                                                </td>
                                                <td className="px-4 py-2.5 whitespace-nowrap">
                                                    {getActivityBadge(log.activity_type)}
                                                </td>
                                                <td className="px-4 py-2.5 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-[11px] font-semibold text-gray-600 bg-gray-100 rounded-lg">
                                                        {categories.find(c => c.value === log.category)?.label || log.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-[13px] font-medium text-gray-850 leading-snug">
                                                    {log.description}
                                                </td>
                                                <td className="px-4 py-2.5 text-center whitespace-nowrap">
                                                    {isDelete ? (
                                                        hasPayload ? (
                                                            <button
                                                                onClick={() => setRestoringLog(log)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#E5654B] hover:bg-[#d4523a] rounded-xl shadow-sm transition-colors"
                                                                title="Restore / Pulihkan data yang terhapus"
                                                            >
                                                                <RotateCcw className="w-3 h-3" /> Restore
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 font-medium italic select-none">No Payload</span>
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-gray-300 select-none">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-gray-400 text-xs font-medium">
                                            <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                            Tidak ada riwayat aktifitas ditemukan untuk kriteria ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="block md:hidden divide-y divide-[#f5f3f0]">
                        {logs.data.length > 0 ? (
                            logs.data.map((log) => {
                                const isDelete = log.activity_type === 'delete';
                                const hasPayload = log.payload !== null;
                                
                                return (
                                    <div key={log.id} className="p-4 hover:bg-gray-50/50 transition-colors space-y-2.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex flex-wrap gap-1.5 items-center">
                                                {getActivityBadge(log.activity_type)}
                                                <span className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 bg-gray-100 rounded-lg">
                                                    {categories.find(c => c.value === log.category)?.label || log.category}
                                                </span>
                                                {getRoleBadge(log.role)}
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 shrink-0">
                                                <Calendar className="w-3 h-3" />
                                                {formatTime(log.created_at)}
                                            </span>
                                        </div>
                                        
                                        <p className="text-[12.5px] font-medium text-gray-800 leading-snug">
                                            {log.description}
                                        </p>
                                        
                                        <div className="flex justify-between items-center pt-2.5 border-t border-[#f5f3f0]/65">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-[#e8e5e0]">
                                                    <UserIcon className="w-3 h-3 text-gray-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-xs text-gray-700 leading-none">
                                                        {log.user?.name ?? 'Tamu Publik'}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 leading-none mt-0.5 max-w-[150px] truncate">
                                                        {log.user?.email ?? '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {isDelete ? (
                                                hasPayload ? (
                                                    <button
                                                        onClick={() => setRestoringLog(log)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-[#E5654B] hover:bg-[#d4523a] rounded-xl shadow-sm transition-colors"
                                                    >
                                                        <RotateCcw className="w-2.5 h-2.5" /> Restore
                                                    </button>
                                                ) : (
                                                    <span className="text-[11px] text-gray-400 font-medium italic select-none">No Payload</span>
                                                )
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-12 text-center text-gray-400 text-xs font-medium">
                                <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                Tidak ada riwayat aktifitas ditemukan untuk kriteria ini.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="bg-[#faf9f6] border-t border-[#e8e5e0] px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs font-medium text-gray-500">
                                Menampilkan {logs.from ?? 0} - {logs.to ?? 0} dari {logs.total} data
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {logs.links.map((link, idx) => {
                                    const clickHandler = () => {
                                        if (link.url) {
                                            router.get(link.url, { 
                                                search, 
                                                role, 
                                                category, 
                                                activity_type: activityType 
                                            });
                                        }
                                    };
                                    
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={clickHandler}
                                                disabled={!link.url}
                                                className="px-2 py-1.5 text-xs font-bold bg-white rounded-lg border border-[#e8e5e0] hover:bg-[#f5f3f0] disabled:opacity-50 text-gray-600 transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={clickHandler}
                                                disabled={!link.url}
                                                className="px-2 py-1.5 text-xs font-bold bg-white rounded-lg border border-[#e8e5e0] hover:bg-[#f5f3f0] disabled:opacity-50 text-gray-600 transition-colors"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={idx}
                                            onClick={clickHandler}
                                            disabled={link.active}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                                link.active 
                                                    ? 'bg-[#E5654B] text-white shadow-sm ring-1 ring-[#E5654B]/20' 
                                                    : 'bg-white text-gray-600 hover:bg-[#f5f3f0] border border-[#e8e5e0]'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Restore Confirmation Modal */}
            {restoringLog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200 text-left space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-[#E5654B]">
                                <RotateCcw className="w-6 h-6 animate-pulse" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">Konfirmasi Pemulihan Data</h3>
                                <p className="text-xs text-gray-500">Anda akan memulihkan data yang sebelumnya telah dihapus.</p>
                            </div>
                        </div>

                        <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl text-xs space-y-2 text-gray-700">
                            <div>
                                <strong className="text-gray-900">Aksi Log:</strong>
                                <p className="font-medium mt-0.5">{restoringLog.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-orange-100/50 text-[11px]">
                                <div>
                                    <span className="text-gray-400 block font-medium">Model Data</span>
                                    <span className="font-semibold text-gray-800">{restoringLog.subject_type?.split('\\').pop() || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block font-medium">ID Record</span>
                                    <span className="font-semibold text-gray-800">#{restoringLog.subject_id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-[10px] text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-normal">
                            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <span>
                                Data ini akan ditulis kembali ke database dengan ID dan seluruh nilai atribut persis seperti saat dihapus. Hubungan foreign key yang hilang mungkin akan tergabung secara otomatis.
                            </span>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleRestoreSubmit}
                                disabled={restoring}
                                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                                {restoring ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" /> Memulihkan...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" /> Pulihkan Data
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setRestoringLog(null)}
                                disabled={restoring}
                                className="px-5 py-2.5 bg-gray-150 hover:bg-gray-250 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
