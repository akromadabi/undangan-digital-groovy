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
    const [isFiltering, setIsFiltering] = useState(false);
    
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

        router.get('/super-admin/logs', {
            search: searchVal,
            role: roleVal,
            category: categoryVal
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
                return <span className="px-2.5 py-0.5 text-[10px] font-bold bg-red-50 text-red-600 rounded-full border border-red-150 uppercase tracking-wide">Super Admin</span>;
            case 'reseller':
                return <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full border border-blue-150 uppercase tracking-wide">Reseller</span>;
            case 'user':
                return <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-150 uppercase tracking-wide">User</span>;
            case 'guest':
            default:
                return <span className="px-2.5 py-0.5 text-[10px] font-bold bg-gray-50 text-gray-600 rounded-full border border-gray-150 uppercase tracking-wide">Guest</span>;
        }
    };

    // Style helper for Activity Types
    const getActivityBadge = (type) => {
        switch (type) {
            case 'create':
                return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100/60 text-emerald-700 rounded-lg">TAMBAH</span>;
            case 'update':
                return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100/60 text-amber-700 rounded-lg">UBAH</span>;
            case 'delete':
                return <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100/60 text-rose-700 rounded-lg">HAPUS</span>;
            case 'login':
                return <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-100/60 text-indigo-700 rounded-lg">MASUK</span>;
            default:
                return <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded-lg">{type?.toUpperCase() || 'LAINNYA'}</span>;
        }
    };

    return (
        <SuperAdminLayout title="Log Aktifitas Sistem">
            <Head title="Log Aktifitas - Super Admin" />

            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
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
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                            <Database className="w-5 h-5 text-[#E5654B]" /> Riwayat Aktifitas Pengguna
                        </h2>
                        <p className="text-xs text-[#888] mt-1">Lacak seluruh aksi tambah, ubah, dan hapus data di seluruh platform secara real-time.</p>
                    </div>
                    <div className="text-xs font-semibold text-[#E5654B] bg-[#fdf5f3] border border-[#fcebe7] px-3.5 py-1.5 rounded-full shrink-0">
                        Total Catatan: {logs.total} entri
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 shadow-sm space-y-4">
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Text Search */}
                        <div className="relative md:col-span-2">
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari pelaku, kata kunci deskripsi log..."
                                className="w-full border border-[#e8e5e0] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all bg-[#faf9f6]/40"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                        </div>

                        {/* Filter Role */}
                        <div className="relative">
                            <select 
                                value={role}
                                onChange={(e) => { setRole(e.target.value); handleFilterChange({ role: e.target.value }); }}
                                className="w-full border border-[#e8e5e0] rounded-xl pl-3 pr-8 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all bg-[#faf9f6]/40 appearance-none font-medium text-gray-700"
                            >
                                <option value="all">Semua Peran (Role)</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="reseller">Reseller</option>
                                <option value="user">User biasa</option>
                                <option value="guest">Tamu Undangan (Guest)</option>
                            </select>
                            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>

                        {/* Filter Category */}
                        <div className="relative">
                            <select 
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); handleFilterChange({ category: e.target.value }); }}
                                className="w-full border border-[#e8e5e0] rounded-xl pl-3 pr-8 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all bg-[#faf9f6]/40 appearance-none font-medium text-gray-700"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>
                    </form>

                    <div className="flex items-center justify-between border-t border-[#f5f3f0] pt-4 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500">
                            {isFiltering && (
                                <span className="flex items-center gap-1.5 font-medium text-[#E5654B] animate-pulse">
                                    <RefreshCw className="w-3 h-3 animate-spin" /> Memfilter data log...
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleReset} 
                                className="text-gray-500 hover:text-gray-800 font-semibold px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                            >
                                Reset Filter
                            </button>
                            <button 
                                onClick={() => handleFilterChange()}
                                className="bg-[#E5654B] text-white hover:bg-[#d4523a] font-bold px-4 py-1.5 rounded-lg transition-colors shadow-sm"
                            >
                                Terapkan Pencarian
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-[#faf9f6] text-xs font-bold text-gray-500 border-b border-[#e8e5e0] uppercase tracking-wider">
                                    <th className="px-5 py-4">Waktu</th>
                                    <th className="px-5 py-4">Pelaku</th>
                                    <th className="px-5 py-4">Peran (Role)</th>
                                    <th className="px-5 py-4">Aktivitas</th>
                                    <th className="px-5 py-4">Kategori</th>
                                    <th className="px-5 py-4">Deskripsi</th>
                                    <th className="px-5 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f5f3f0] text-gray-700">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => {
                                        const isDelete = log.activity_type === 'delete';
                                        const hasPayload = log.payload !== null;
                                        
                                        return (
                                            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        {formatTime(log.created_at)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-[#e8e5e0]">
                                                            <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold block text-[13px] text-gray-800">
                                                                {log.user?.name ?? 'Tamu Publik'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 block -mt-0.5 truncate max-w-[150px]">
                                                                {log.user?.email ?? '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    {getRoleBadge(log.role)}
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    {getActivityBadge(log.activity_type)}
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-[11px] font-semibold text-gray-600 bg-gray-100 rounded-lg">
                                                        {categories.find(c => c.value === log.category)?.label || log.category}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-[13px] font-medium text-gray-800 leading-snug">
                                                    {log.description}
                                                </td>
                                                <td className="px-5 py-3.5 text-center whitespace-nowrap">
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

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="bg-[#faf9f6] border-t border-[#e8e5e0] px-5 py-4 flex items-center justify-between">
                            <div className="text-xs font-medium text-gray-500">
                                Menampilkan {logs.from ?? 0} - {logs.to ?? 0} dari {logs.total} data
                            </div>
                            <div className="flex gap-1.5">
                                {logs.links.map((link, idx) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => link.url && router.get(link.url, { search, role, category })}
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
                                                onClick={() => link.url && router.get(link.url, { search, role, category })}
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
                                            onClick={() => link.url && router.get(link.url, { search, role, category })}
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
