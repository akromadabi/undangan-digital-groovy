import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import axios from 'axios';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import {
    Music, Play, Pause, Plus, X, Trash2, Pencil, Tag,
    Upload, CheckCircle, XCircle, Heart, Moon, Mic, Piano,
    Theater, Save, FolderOpen, Link as LinkIcon, Power, AlertCircle
} from 'lucide-react';

const ALLOWED_AUDIO = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/x-m4a', 'audio/mp4'];
const MAX_SIZE_MB = 20;

const CAT_ICONS = {
    romantis: Heart, islami: Moon, pop: Mic, instrumental: Piano, adat: Theater,
};
const DEFAULT_CATEGORIES = [
    { value: 'romantis', label: 'Romantis', icon: 'Heart' },
    { value: 'islami', label: 'Islami', icon: 'Moon' },
    { value: 'pop', label: 'Pop', icon: 'Mic' },
    { value: 'instrumental', label: 'Instrumental', icon: 'Piano' },
    { value: 'adat', label: 'Adat/Tradisional', icon: 'Theater' },
];

const ICON_MAP = { Heart, Moon, Mic, Piano, Theater, Music, Tag };

function CatIcon({ name, size = 14, className = '' }) {
    const Comp = ICON_MAP[name] || Music;
    return <Comp size={size} className={className} />;
}

export default function MusicPage({ tracks, categories: serverCategories = [], customSongs = [] }) {
    const { flash, adminRoutePrefix } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [converting, setConverting] = useState(false);
    const [filter, setFilter] = useState('all');
    const [playingId, setPlayingId] = useState(null);
    const [uploadNotif, setUploadNotif] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('library');
    const [claimingSong, setClaimingSong] = useState(null);
    const [claimData, setClaimData] = useState({ title: '', artist: '', category: 'romantis', url: '' });
    
    // Audio manipulation states for Admin Library Form
    const [cropOpen, setCropOpen] = useState(false);
    const [cropStart, setCropStart] = useState(0);
    const [cropEnd, setCropEnd] = useState(60);
    const [audioDuration, setAudioDuration] = useState(0);
    const [cropping, setCropping] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [uploadSize, setUploadSize] = useState(null);

    // Audio manipulation states for Claim/Tarik Form
    const [claimCropOpen, setClaimCropOpen] = useState(false);
    const [claimCropStart, setClaimCropStart] = useState(0);
    const [claimCropEnd, setClaimCropEnd] = useState(60);
    const [claimAudioDuration, setClaimAudioDuration] = useState(0);
    const [claimCropping, setClaimCropping] = useState(false);
    const [claimCompressing, setClaimCompressing] = useState(false);
    const [claimUploadSize, setClaimUploadSize] = useState(null);

    const audioRef = useRef(null);

    const showNotif = (type, message) => {
        setUploadNotif({ type, message });
        if (type === 'success') setTimeout(() => setUploadNotif(null), 4000);
    };

    const handleYoutubeConvert = async (url) => {
        if (!url) return;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const matches = url.match(regExp);
        if (!matches || matches[2].length !== 11) {
            return;
        }

        setConverting(true);
        setUploadNotif(null);

        try {
            const response = await axios.post(`${adminRoutePrefix}/music/convert-youtube`, { url });
            if (response.data.success && response.data.url) {
                setData({
                    ...data,
                    url: response.data.url,
                    source_type: 'url',
                    title: response.data.title || data.title || '',
                    artist: response.data.artist || data.artist || '',
                });
                if (response.data.size) {
                    setUploadSize(response.data.size);
                }
                showNotif('success', 'Link YouTube berhasil dikonversi ke MP3!');
            }
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || 'Konversi gagal';
            showNotif('error', `Gagal mengonversi YouTube ke MP3: ${msg}`);
        } finally {
            setConverting(false);
        }
    };

    const handleOpenClaim = (song) => {
        let parsedTitle = '';
        if (song.music_url) {
            const fileName = song.music_url.split('/').pop();
            parsedTitle = fileName
                .replace(/^youtube_/, '')
                .replace(/\.mp3$/, '')
                .replace(/_[0-9]+$/, '')
                .replace(/_/g, ' ')
                .trim();
            parsedTitle = parsedTitle.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        
        setClaimData({
            title: parsedTitle || 'Lagu Baru',
            artist: '',
            category: 'romantis',
            url: song.music_url
        });
        setClaimingSong(song);

        // Reset claim audio states
        setClaimCropOpen(false);
        setClaimCropStart(0);
        setClaimCropEnd(60);
        setClaimAudioDuration(0);
        setClaimUploadSize(null);

        // Fetch file size dynamically via HEAD request
        if (song.music_url) {
            axios.head(song.music_url).then(res => {
                const len = res.headers['content-length'];
                if (len) {
                    const mb = (parseInt(len) / 1024 / 1024).toFixed(1);
                    setClaimUploadSize(`${mb} MB`);
                }
            }).catch(err => console.log('Failed to fetch size via HEAD', err));
        }
    };

    const handleClaimCrop = async () => {
        if (!claimData.url) return;
        setClaimCropping(true);
        setUploadNotif(null);
        try {
            const response = await axios.post(`${adminRoutePrefix}/music/crop`, {
                url: claimData.url,
                start: claimCropStart,
                end: claimCropEnd
            });
            if (response.data.success && response.data.url) {
                setClaimData({ ...claimData, url: response.data.url });
                setClaimUploadSize(null); // Will be reloaded
                showNotif('success', 'Musik kustom berhasil dipotong!');
                setClaimCropOpen(false);
            }
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || 'Gagal memotong musik';
            showNotif('error', msg);
        } finally {
            setClaimCropping(false);
        }
    };

    const handleClaimCompress = async () => {
        if (!claimData.url) return;
        setClaimCompressing(true);
        setUploadNotif(null);
        try {
            const response = await axios.post(`${adminRoutePrefix}/music/compress`, {
                url: claimData.url
            });
            if (response.data.success && response.data.url) {
                setClaimData({ ...claimData, url: response.data.url });
                
                if (response.data.stats) {
                    const { before, after, savings_pct } = response.data.stats;
                    const bMB = (before / 1024 / 1024).toFixed(1);
                    const aMB = (after / 1024 / 1024).toFixed(1);
                    setClaimUploadSize(`${aMB} MB`);
                    showNotif('success', `Musik kustom berhasil dikompres dari ${bMB} MB menjadi ${aMB} MB (Hemat ${savings_pct}%!)`);
                } else {
                    showNotif('success', 'Musik kustom berhasil dikompres!');
                }
            }
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || 'Gagal mengompres musik';
            showNotif('error', msg);
        } finally {
            setClaimCompressing(false);
        }
    };

    const handleClaimSubmit = (e) => {
        e.preventDefault();
        router.post(`${adminRoutePrefix}/music/claim`, claimData, {
            preserveScroll: true,
            onSuccess: () => {
                setClaimingSong(null);
            }
        });
    };

    const [categories, setCategories] = useState(() => {
        if (serverCategories.length > 0) return serverCategories;
        return DEFAULT_CATEGORIES;
    });
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [newCat, setNewCat] = useState({ value: '', label: '', icon: 'Music' });

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '', artist: '', category: 'romantis', url: '', source_type: 'url',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            router.put(`${adminRoutePrefix}/music/${editId}`, data, {
                preserveScroll: true,
                onSuccess: () => { resetForm(); },
            });
        } else {
            post(`${adminRoutePrefix}/music`, {
                preserveScroll: true,
                onSuccess: () => { resetForm(); },
            });
        }
    };

    const resetForm = () => {
        reset(); setShowForm(false); setEditId(null);
    };

    const handleEdit = (track) => {
        setData({ title: track.title, artist: track.artist || '', category: track.category, url: track.url, source_type: track.source_type });
        setEditId(track.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (confirmDeleteId === id) {
            // Second click — actually delete
            router.delete(`${adminRoutePrefix}/music/${id}`, {
                preserveScroll: true,
                onSuccess: () => { setConfirmDeleteId(null); },
                onError: (err) => { console.error('Delete error:', err); setConfirmDeleteId(null); },
            });
        } else {
            // First click — show confirmation
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
        }
    };

    const handleToggle = (id) => {
        router.post(`${adminRoutePrefix}/music/${id}/toggle`, {}, { preserveScroll: true });
    };

    const handleUpload = async (file) => {
        if (!file) return;
        setUploadNotif(null);

        // Validate file type
        if (!ALLOWED_AUDIO.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|aac|m4a)$/i)) {
            showNotif('error', `Format file "${file.name}" tidak didukung. Gunakan format: MP3, WAV, OGG, AAC, atau M4A.`);
            return;
        }
        // Validate file size
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(1);
            showNotif('error', `File terlalu besar (${sizeMB}MB). Maksimum ${MAX_SIZE_MB}MB.`);
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'music');

        try {
            // Gunakan axios (sudah dikonfigurasi Laravel untuk handle X-XSRF-TOKEN cookie otomatis)
            const response = await axios.post(`${adminRoutePrefix}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setData({
                ...data,
                url: response.data.url,
                source_type: 'upload',
                title: data.title || file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            });
            const sizeMB = (file.size / 1024 / 1024).toFixed(1);
            setUploadSize(`${sizeMB} MB`);
            showNotif('success', `File "${file.name}" (${sizeMB} MB) berhasil diupload!`);
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.errors
                ? Object.values(e.response.data.errors).flat().join(', ')
                : e.response?.data?.message || e.message || 'Upload gagal';
            showNotif('error', `Upload gagal: ${msg}`);
        }
        setUploading(false);
    };

    const handleCrop = async () => {
        if (!data.url) return;
        setCropping(true);
        setUploadNotif(null);
        try {
            const response = await axios.post(`${adminRoutePrefix}/music/crop`, {
                url: data.url,
                start: cropStart,
                end: cropEnd
            });
            if (response.data.success && response.data.url) {
                setData('url', response.data.url);
                setUploadSize(null); // Will be reloaded
                showNotif('success', 'Musik berhasil dipotong!');
                setCropOpen(false);
            }
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || 'Gagal memotong musik';
            showNotif('error', msg);
        } finally {
            setCropping(false);
        }
    };

    const handleCompress = async () => {
        if (!data.url) return;
        setCompressing(true);
        setUploadNotif(null);
        try {
            const response = await axios.post(`${adminRoutePrefix}/music/compress`, {
                url: data.url
            });
            if (response.data.success && response.data.url) {
                setData('url', response.data.url);
                
                if (response.data.stats) {
                    const { before, after, savings_pct } = response.data.stats;
                    const bMB = (before / 1024 / 1024).toFixed(1);
                    const aMB = (after / 1024 / 1024).toFixed(1);
                    setUploadSize(`${aMB} MB`);
                    showNotif('success', `Musik berhasil dikompres dari ${bMB} MB menjadi ${aMB} MB (Hemat ${savings_pct}%!)`);
                } else {
                    showNotif('success', 'Musik berhasil dikompres!');
                }
            }
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || 'Gagal mengompres musik';
            showNotif('error', msg);
        } finally {
            setCompressing(false);
        }
    };

    const togglePlay = (id, url) => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; audioRef.current = null; }
        if (playingId === id) { setPlayingId(null); return; }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { setPlayingId(null); audioRef.current = null; };
        audio.onerror = () => { setPlayingId(null); audioRef.current = null; };
        audio.play().catch(() => { setPlayingId(null); audioRef.current = null; });
        setPlayingId(id);
    };

    const handleAddCategory = () => {
        if (!newCat.label) return;
        const slug = newCat.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (categories.find(c => c.value === slug)) { alert('Kategori sudah ada!'); return; }
        const updated = [...categories, { value: slug, label: newCat.label, icon: newCat.icon }];
        setCategories(updated);
        router.post(`${adminRoutePrefix}/music/categories`, { categories: updated }, {
            preserveScroll: true,
            onSuccess: () => { setNewCat({ value: '', label: '', icon: 'Music' }); setShowCategoryForm(false); },
        });
    };

    const handleDeleteCategory = (val) => {
        if (!confirm(`Hapus kategori "${val}"?`)) return;
        const updated = categories.filter(c => c.value !== val);
        setCategories(updated);
        router.post(`${adminRoutePrefix}/music/categories`, { categories: updated }, { preserveScroll: true });
    };

    const filtered = tracks.filter(track => {
        const matchesCategory = filter === 'all' || track.category === filter;
        const matchesSearch = searchQuery === '' || 
            (track.title && track.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (track.artist && track.artist.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });
    const ICON_OPTIONS = ['Heart', 'Moon', 'Mic', 'Piano', 'Theater', 'Music', 'Tag'];

    return (
        <DynamicAdminLayout title="Musik">
            <Head title="Musik — Admin" />
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <CheckCircle size={16} /> {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
                            <Music size={24} className="text-[#E5654B]" /> Library Musik
                        </h2>
                        <p className="text-sm text-[#999] mt-1">Kelola koleksi musik platform untuk undangan</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowCategoryForm(!showCategoryForm)}
                            className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-1.5">
                            {showCategoryForm ? <X size={14} /> : <Tag size={14} />}
                            {showCategoryForm ? 'Tutup' : 'Kategori'}
                        </button>
                        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
                            className="px-5 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#d4523a] transition-colors shadow-sm flex items-center gap-1.5">
                            {showForm ? <X size={14} /> : <Plus size={14} />}
                            {showForm ? 'Tutup' : 'Tambah Musik'}
                        </button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-[#f5f3f0] border border-[#e8e5e0] rounded-2xl p-1">
                    <button 
                        type="button"
                        onClick={() => setActiveTab('library')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'library' ? 'bg-white text-[#E5654B] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <Music size={16} /> Koleksi Platform ({tracks.length})
                    </button>
                    <button 
                        type="button"
                        onClick={() => setActiveTab('custom_claim')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 relative ${activeTab === 'custom_claim' ? 'bg-white text-[#E5654B] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <FolderOpen size={16} /> Klaim Musik User
                        {customSongs.length > 0 && (
                            <span className="bg-[#E5654B] text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                                {customSongs.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Category Management */}
                {showCategoryForm && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4">
                        <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2"><Tag size={16} /> Kelola Kategori Genre</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(c => (
                                <div key={c.value} className="flex items-center gap-1.5 bg-[#f5f3f0] rounded-xl px-3 py-2 text-sm group">
                                    <CatIcon name={c.icon} size={14} /> {c.label}
                                    <button onClick={() => handleDeleteCategory(c.value)}
                                        className="ml-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#999] mb-1">Ikon</label>
                                <div className="flex gap-1">
                                    {ICON_OPTIONS.map(ic => (
                                        <button key={ic} type="button" onClick={() => setNewCat({ ...newCat, icon: ic })}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${newCat.icon === ic ? 'bg-blue-500 text-white scale-110' : 'bg-[#f5f3f0] text-[#666] hover:bg-[#e8e5e0]'}`}>
                                            <CatIcon name={ic} size={14} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-[#999] mb-1">Nama Kategori</label>
                                <input type="text" value={newCat.label}
                                    onChange={e => setNewCat({ ...newCat, label: e.target.value })}
                                    placeholder="Contoh: Dangdut" className="w-full border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            </div>
                            <button onClick={handleAddCategory} disabled={!newCat.label}
                                className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors whitespace-nowrap flex items-center gap-1.5">
                                <Plus size={14} /> Tambah
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab: Platform Library */}
                {activeTab === 'library' && (
                    <>
                        {/* Search Input Bar */}
                        <div className="relative">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari lagu atau artis di koleksi platform..."
                                className="w-full border border-[#e8e5e0] rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] bg-white shadow-sm"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchQuery && (
                                <button 
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle size={16} />
                                </button>
                            )}
                        </div>

                        {/* Add/Edit Form */}
                        {showForm && (
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4">
                                <h3 className="font-bold text-[#1a1a1a]">{editId ? 'Edit Musik' : 'Tambah Musik Baru'}</h3>
                                {/* Upload Notification */}
                                {uploadNotif && (
                                    <div className={`rounded-xl p-4 flex items-start gap-3 text-sm ${uploadNotif.type === 'error'
                                        ? 'bg-red-50 border border-red-200 text-red-700'
                                        : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
                                        {uploadNotif.type === 'error' ? <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> : <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />}
                                        <div className="flex-1">{uploadNotif.message}</div>
                                        <button type="button" onClick={() => setUploadNotif(null)} className="flex-shrink-0 opacity-50 hover:opacity-100">
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                )}
                                {converting && (
                                    <div className="bg-orange-50 border border-orange-200 text-[#b03a24] rounded-xl p-4 flex items-center gap-3 text-sm animate-pulse">
                                        <div className="w-4 h-4 border-2 border-[#E5654B] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                        <div className="flex-1 font-medium">Sedang mendeteksi & mengonversi video YouTube ke MP3... Mohon tunggu sebentar.</div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#666] mb-1">Judul Lagu *</label>
                                        <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Contoh: Perfect" required
                                            className="w-full border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#666] mb-1">Artis</label>
                                        <input type="text" value={data.artist} onChange={(e) => setData('artist', e.target.value)}
                                            placeholder="Contoh: Ed Sheeran"
                                            className="w-full border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666] mb-2">Kategori</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {categories.map(c => (
                                            <button key={c.value} type="button" onClick={() => setData('category', c.value)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${data.category === c.value ? 'bg-[#E5654B] text-white shadow-sm' : 'bg-[#f5f3f0] text-[#666] hover:bg-[#ebe8e3]'}`}>
                                                <CatIcon name={c.icon} size={14} /> {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666] mb-1 flex items-center gap-1.5"><LinkIcon size={14} /> URL / Link Musik *</label>
                                    <input type="text" value={data.url} 
                                        onChange={(e) => { 
                                            const val = e.target.value;
                                            setData('url', val); 
                                            setData('source_type', 'url'); 
                                            handleYoutubeConvert(val);
                                        }}
                                        disabled={converting}
                                        placeholder="https://example.com/music.mp3" required
                                        className="w-full border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] disabled:opacity-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666] mb-2 flex items-center gap-1.5"><Upload size={14} /> Atau Upload File MP3</label>
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-[#e8e5e0] rounded-xl p-4 text-center hover:border-[#E5654B] transition-colors">
                                            {uploading ? (
                                                <p className="text-[#E5654B] font-medium text-sm">Uploading...</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-[#999]">Klik untuk upload file MP3 (Max {MAX_SIZE_MB}MB)</p>
                                                    <p className="text-xs text-[#ccc] mt-1">Format: MP3, WAV, OGG, AAC, M4A</p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" accept=".mp3,.wav,.ogg,.aac,.m4a,audio/*" className="hidden"
                                            onChange={(e) => { handleUpload(e.target.files[0]); e.target.value = ''; }} disabled={uploading} />
                                    </label>
                                </div>
                                {data.url && (
                                    <div className="bg-[#f5f3f0] rounded-xl p-4 border border-[#e8e5e0] space-y-3">
                                        <div className="flex items-center justify-between border-b border-[#e8e5e0] pb-2">
                                            <p className="text-xs text-[#999] font-bold flex items-center gap-1.5">
                                                <span>Preview:</span>
                                                {uploadSize && <span className="text-xs font-semibold text-[#E5654B] bg-[#fdf5f3] px-2 py-0.5 rounded-full">Ukuran: {uploadSize}</span>}
                                            </p>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setCropOpen(!cropOpen)}
                                                    className="text-xs bg-[#fdf5f3] text-[#E5654B] px-2.5 py-1.5 rounded-lg hover:bg-[#fcebe7] transition-all font-semibold">
                                                    {cropOpen ? 'Tutup Potong' : 'Potong Musik'}
                                                </button>
                                                <button type="button" onClick={handleCompress} disabled={compressing}
                                                    className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-all font-semibold disabled:opacity-50">
                                                    {compressing ? 'Mengompres...' : 'Kompres File'}
                                                </button>
                                            </div>
                                        </div>
                                        <audio controls className="w-full" key={data.url} src={data.url}
                                            onLoadedMetadata={(e) => {
                                                const dur = Math.round(e.target.duration);
                                                setAudioDuration(dur);
                                                setCropEnd(prev => prev > dur || prev === 60 ? dur : prev);
                                            }}></audio>

                                        {cropOpen && (
                                            <div className="bg-white rounded-xl p-3 border border-[#e8e5e0] space-y-3 animate-[fadeIn_0.2s_ease-out]">
                                                <div className="text-xs font-bold text-gray-700">Tentukan Rentang Potong (Total: {audioDuration} detik)</div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Mulai (Detik)</label>
                                                        <input type="number" min="0" max={cropEnd - 1} value={cropStart}
                                                            onChange={e => setCropStart(Math.max(0, parseInt(e.target.value) || 0))}
                                                            className="w-full border border-[#e8e5e0] rounded-lg px-3 py-1.5 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Selesai (Detik)</label>
                                                        <input type="number" min={cropStart + 1} max={audioDuration} value={cropEnd}
                                                            onChange={e => setCropEnd(Math.min(audioDuration, parseInt(e.target.value) || audioDuration))}
                                                            className="w-full border border-[#e8e5e0] rounded-lg px-3 py-1.5 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" />
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-gray-400">Pilih durasi musik yang diinginkan (misal detik ke 10 hingga 80). Ini akan memotong berkas fisik di server dan memperkecil ukurannya secara signifikan.</div>
                                                <button type="button" onClick={handleCrop} disabled={cropping}
                                                    className="w-full py-2 bg-[#E5654B] text-white rounded-lg text-xs font-semibold hover:bg-[#d4523a] disabled:opacity-50">
                                                    {cropping ? 'Memproses Potong...' : 'Terapkan Potongan'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button type="submit" disabled={processing}
                                        className="px-6 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#d4523a] disabled:opacity-50 flex items-center gap-1.5">
                                        <Save size={14} /> {processing ? 'Menyimpan...' : editId ? 'Update' : 'Simpan'}
                                    </button>
                                    <button type="button" onClick={resetForm}
                                        className="px-6 py-2.5 bg-[#f5f3f0] text-[#666] rounded-xl text-sm font-medium hover:bg-[#ebe8e3]">Batal</button>
                                </div>
                            </form>
                        )}

                        {/* Filter tabs */}
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${filter === 'all' ? 'bg-[#1a1a1a] text-white shadow-sm' : 'bg-white border border-[#e8e5e0] text-[#666] hover:bg-[#f5f3f0]'}`}>
                                <Music size={14} /> Semua ({tracks.length})
                            </button>
                            {categories.map(c => {
                                const count = tracks.filter(t => t.category === c.value).length;
                                return (
                                    <button key={c.value} onClick={() => setFilter(c.value)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${filter === c.value ? 'bg-[#1a1a1a] text-white shadow-sm' : 'bg-white border border-[#e8e5e0] text-[#666] hover:bg-[#f5f3f0]'}`}>
                                        <CatIcon name={c.icon} size={14} /> {c.label} ({count})
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tracks List */}
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden shadow-sm">
                            {filtered.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <Music size={48} className="text-[#e8e5e0] mx-auto mb-3" />
                                    <p className="text-[#999] font-medium font-semibold">Lagu tidak ditemukan</p>
                                    <p className="text-xs text-[#ccc] mt-1">Coba kata kunci pencarian atau kategori lain</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#f5f3f0]">
                                    {filtered.map((track) => (
                                        <div key={track.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#faf9f6] transition-colors">
                                            {/* Play button */}
                                            <button onClick={() => togglePlay(track.id, track.url)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${playingId === track.id ? 'bg-[#E5654B] text-white scale-110 shadow-md' : 'bg-[#f5f3f0] text-[#999] hover:bg-[#E5654B] hover:text-white'}`}>
                                                {playingId === track.id ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                                            </button>
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-[#1a1a1a] truncate">{track.title}</div>
                                                <div className="text-xs text-[#999] flex items-center gap-1.5">
                                                    {track.artist && <span>{track.artist} &bull; </span>}
                                                    <CatIcon name={categories.find(c => c.value === track.category)?.icon} size={12} />
                                                    <span className="capitalize">{track.category}</span>
                                                    <span className="text-[#ccc]">&bull;</span>
                                                    {track.source_type === 'upload' ? <FolderOpen size={12} className="text-[#ccc]" /> : <LinkIcon size={12} className="text-[#ccc]" />}
                                                    <span className="text-[#ccc]">{track.source_type === 'upload' ? 'Upload' : 'URL'}</span>
                                                </div>
                                            </div>
                                            {/* Status */}
                                            <button onClick={() => handleToggle(track.id)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${track.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {track.is_active ? <><CheckCircle size={12} /> Aktif</> : <><XCircle size={12} /> Nonaktif</>}
                                            </button>
                                            {/* Actions */}
                                            <div className="flex gap-1">
                                                <button type="button" onClick={() => handleEdit(track)}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                                                    <Pencil size={16} />
                                                </button>
                                                <button type="button" onClick={() => handleDelete(track.id)}
                                                    className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${confirmDeleteId === track.id ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-red-50 text-red-500'}`}
                                                    title={confirmDeleteId === track.id ? 'Klik lagi untuk hapus' : 'Hapus'}>
                                                    <Trash2 size={16} />
                                                    {confirmDeleteId === track.id && <span className="text-xs font-semibold pr-1">Yakin?</span>}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Tab: Claim Custom User Music */}
                {activeTab === 'custom_claim' && (
                    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                        {/* Claim Form Card */}
                        {claimingSong && (
                            <form onSubmit={handleClaimSubmit} className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4 shadow-md">
                                <div className="flex items-center justify-between border-b border-[#f5f3f0] pb-3">
                                    <h3 className="font-bold text-[#1a1a1a] flex items-center gap-1.5 text-base">
                                        <CheckCircle size={18} className="text-emerald-500" /> Tarik Lagu Kustom ke Koleksi Resmi
                                    </h3>
                                    <button 
                                        type="button" 
                                        onClick={() => setClaimingSong(null)}
                                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="bg-[#faf9f6] p-3 rounded-xl border border-[#e8e5e0] text-xs space-y-1 text-gray-600">
                                    <div className="truncate"><strong>URL File:</strong> {claimData.url}</div>
                                    <div><strong>Sampel Undangan:</strong> {claimingSong.invitation_title}</div>
                                    <div><strong>Total Pengguna:</strong> {claimingSong.use_count} Undangan</div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#666] mb-1">Judul Lagu Resmi *</label>
                                        <input 
                                            type="text" 
                                            value={claimData.title} 
                                            onChange={(e) => setClaimData({ ...claimData, title: e.target.value })}
                                            placeholder="Contoh: A Thousand Years" 
                                            required
                                            className="w-full border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#666] mb-1">Artis</label>
                                        <input 
                                            type="text" 
                                            value={claimData.artist} 
                                            onChange={(e) => setClaimData({ ...claimData, artist: e.target.value })}
                                            placeholder="Contoh: Christina Perri"
                                            className="w-full border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#666] mb-2">Kategori Genre</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {categories.map(c => (
                                            <button 
                                                key={c.value} 
                                                type="button" 
                                                onClick={() => setClaimData({ ...claimData, category: c.value })}
                                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${claimData.category === c.value ? 'bg-[#E5654B] text-white shadow-sm' : 'bg-[#f5f3f0] text-[#666] hover:bg-[#ebe8e3]'}`}
                                            >
                                                <CatIcon name={c.icon} size={14} /> {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {claimData.url && (
                                    <div className="bg-[#f5f3f0] rounded-xl p-4 border border-[#e8e5e0] space-y-3">
                                        <div className="flex items-center justify-between border-b border-[#e8e5e0] pb-2">
                                            <p className="text-xs text-[#999] font-bold flex items-center gap-1.5">
                                                <span>Preview & Optimasi:</span>
                                                {claimUploadSize && <span className="text-xs font-semibold text-[#E5654B] bg-[#fdf5f3] px-2 py-0.5 rounded-full">Ukuran: {claimUploadSize}</span>}
                                            </p>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setClaimCropOpen(!claimCropOpen)}
                                                    className="text-xs bg-[#fdf5f3] text-[#E5654B] px-2.5 py-1.5 rounded-lg hover:bg-[#fcebe7] transition-all font-semibold">
                                                    {claimCropOpen ? 'Tutup Potong' : 'Potong Musik'}
                                                </button>
                                                <button type="button" onClick={handleClaimCompress} disabled={claimCompressing}
                                                    className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-all font-semibold disabled:opacity-50">
                                                    {claimCompressing ? 'Mengompres...' : 'Kompres File'}
                                                </button>
                                            </div>
                                        </div>
                                        <audio controls className="w-full" key={claimData.url} src={claimData.url}
                                            onLoadedMetadata={(e) => {
                                                const dur = Math.round(e.target.duration);
                                                setClaimAudioDuration(dur);
                                                setClaimCropEnd(prev => prev > dur || prev === 60 ? dur : prev);
                                            }}></audio>

                                        {claimCropOpen && (
                                            <div className="bg-white rounded-xl p-3 border border-[#e8e5e0] space-y-3 animate-[fadeIn_0.2s_ease-out]">
                                                <div className="text-xs font-bold text-gray-700">Tentukan Rentang Potong (Total: {claimAudioDuration} detik)</div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Mulai (Detik)</label>
                                                        <input type="number" min="0" max={claimCropEnd - 1} value={claimCropStart}
                                                            onChange={e => setClaimCropStart(Math.max(0, parseInt(e.target.value) || 0))}
                                                            className="w-full border border-[#e8e5e0] rounded-lg px-3 py-1.5 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Selesai (Detik)</label>
                                                        <input type="number" min={claimCropStart + 1} max={claimAudioDuration} value={claimCropEnd}
                                                            onChange={e => setClaimCropEnd(Math.min(claimAudioDuration, parseInt(e.target.value) || claimAudioDuration))}
                                                            className="w-full border border-[#e8e5e0] rounded-lg px-3 py-1.5 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" />
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-gray-400">Pilih durasi musik yang diinginkan. Ini akan memotong berkas fisik di server dan memperkecil ukurannya secara signifikan.</div>
                                                <button type="button" onClick={handleClaimCrop} disabled={claimCropping}
                                                    className="w-full py-2 bg-[#E5654B] text-white rounded-lg text-xs font-semibold hover:bg-[#d4523a] disabled:opacity-50">
                                                    {claimCropping ? 'Memproses Potong...' : 'Terapkan Potongan'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
                                    >
                                        <CheckCircle size={14} /> Masukkan ke Koleksi Platform & Resync
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setClaimingSong(null)}
                                        className="px-6 py-2.5 bg-[#f5f3f0] text-[#666] rounded-xl text-sm font-medium hover:bg-[#ebe8e3]"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* List of custom songs */}
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden shadow-sm">
                            {customSongs.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <CheckCircle size={48} className="text-emerald-400 mx-auto mb-3" />
                                    <p className="text-gray-700 font-bold text-sm">Semua Terkendali!</p>
                                    <p className="text-xs text-[#999] mt-1">Tidak ada musik kustom user baru yang perlu ditarik ke Koleksi Resmi.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#f5f3f0]">
                                    {customSongs.map((song, i) => {
                                        const isPlaying = playingId === `custom-${i}`;
                                        return (
                                            <div key={i} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf9f6] transition-colors">
                                                {/* Left Part: Play + Song Info */}
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    {/* Play preview */}
                                                    <button 
                                                        onClick={() => togglePlay(`custom-${i}`, song.music_url)}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isPlaying ? 'bg-[#E5654B] text-white scale-110 shadow-md' : 'bg-[#f5f3f0] text-[#999] hover:bg-[#E5654B] hover:text-white'}`}
                                                    >
                                                        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                                                    </button>
                                                    
                                                    {/* Info */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-bold text-[#1a1a1a] truncate" title={song.music_url.split('/').pop()}>
                                                            {song.music_url.split('/').pop()}
                                                        </div>
                                                        <div className="text-xs text-[#999] flex flex-wrap items-center gap-1.5 mt-1">
                                                            <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-semibold text-[10px] whitespace-nowrap">
                                                                {song.music_url.includes('youtube_') ? 'YouTube Convert' : 'Custom Upload'}
                                                            </span>
                                                            <span className="hidden xs:inline text-[#ccc]">&bull;</span>
                                                            <span className="truncate">Digunakan di: <strong className="text-gray-700">{song.invitation_title}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Right Part: Stats + Action Button */}
                                                <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-[#f5f3f0] pt-3 sm:border-0 sm:pt-0">
                                                    {/* Use Count Badge */}
                                                    <div className="text-left sm:text-right">
                                                        <div className="text-xs font-bold text-[#E5654B] whitespace-nowrap">{song.use_count} Pengguna</div>
                                                        <div className="text-[10px] text-gray-400 whitespace-nowrap">Total Undangan</div>
                                                    </div>
                                                    
                                                    {/* Claim trigger */}
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleOpenClaim(song)}
                                                        className="px-4 py-2 bg-[#ecfdf5] text-emerald-600 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-1 whitespace-nowrap"
                                                    >
                                                        <Plus size={12} /> Tarik ke Koleksi
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </DynamicAdminLayout>
    );
}
