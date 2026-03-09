import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
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

export default function MusicPage({ tracks, categories: serverCategories = [] }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [playingId, setPlayingId] = useState(null);
    const [uploadNotif, setUploadNotif] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const audioRef = useRef(null);

    const showNotif = (type, message) => {
        setUploadNotif({ type, message });
        if (type === 'success') setTimeout(() => setUploadNotif(null), 4000);
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
            router.put(route('admin.music.update', editId), data, {
                preserveScroll: true,
                onSuccess: () => { resetForm(); },
            });
        } else {
            post(route('admin.music.store'), {
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
            router.delete(route('admin.music.destroy', id), {
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
        router.post(route('admin.music.toggle', id), {}, { preserveScroll: true });
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
            const res = await fetch(route('admin.upload'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData,
            });
            if (!res.ok) {
                const errText = await res.text();
                try {
                    const errJson = JSON.parse(errText);
                    const msg = errJson.errors ? Object.values(errJson.errors).flat().join(', ') : errJson.message || 'Upload gagal';
                    throw new Error(msg);
                } catch (pe) {
                    if (pe.message !== 'Upload gagal') throw pe;
                    throw new Error(errText.substring(0, 200));
                }
            }
            const result = await res.json();
            setData('url', result.url);
            setData('source_type', 'upload');
            showNotif('success', `File "${file.name}" berhasil diupload!`);
        } catch (e) {
            console.error(e);
            showNotif('error', `Upload gagal: ${e.message}`);
        }
        setUploading(false);
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
        router.post(route('admin.music.saveCategories'), { categories: updated }, {
            preserveScroll: true,
            onSuccess: () => { setNewCat({ value: '', label: '', icon: 'Music' }); setShowCategoryForm(false); },
        });
    };

    const handleDeleteCategory = (val) => {
        if (!confirm(`Hapus kategori "${val}"?`)) return;
        const updated = categories.filter(c => c.value !== val);
        setCategories(updated);
        router.post(route('admin.music.saveCategories'), { categories: updated }, { preserveScroll: true });
    };

    const filtered = filter === 'all' ? tracks : tracks.filter(t => t.category === filter);
    const ICON_OPTIONS = ['Heart', 'Moon', 'Mic', 'Piano', 'Theater', 'Music', 'Tag'];

    return (
        <AdminLayout title="Musik">
            <Head title="Musik — Admin" />
            <div className="space-y-6">
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
                            <input type="text" value={data.url} onChange={(e) => { setData('url', e.target.value); setData('source_type', 'url'); }}
                                placeholder="https://example.com/music.mp3" required
                                className="w-full border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]" />
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
                            <div className="bg-[#f5f3f0] rounded-xl p-3">
                                <p className="text-xs text-[#999] mb-2">Preview:</p>
                                <audio controls className="w-full" key={data.url} src={data.url}></audio>
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
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${filter === 'all' ? 'bg-[#1a1a1a] text-white' : 'bg-white border border-[#e8e5e0] text-[#666] hover:bg-[#f5f3f0]'}`}>
                        <Music size={14} /> Semua ({tracks.length})
                    </button>
                    {categories.map(c => {
                        const count = tracks.filter(t => t.category === c.value).length;
                        return (
                            <button key={c.value} onClick={() => setFilter(c.value)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${filter === c.value ? 'bg-[#1a1a1a] text-white' : 'bg-white border border-[#e8e5e0] text-[#666] hover:bg-[#f5f3f0]'}`}>
                                <CatIcon name={c.icon} size={14} /> {c.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Tracks List */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Music size={48} className="text-[#e8e5e0] mx-auto mb-3" />
                            <p className="text-[#999] font-medium">Belum ada musik</p>
                            <p className="text-xs text-[#ccc] mt-1">Tambah musik pertama Anda di atas</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#f5f3f0]">
                            {filtered.map((track) => (
                                <div key={track.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#faf9f6] transition-colors">
                                    {/* Play button */}
                                    <button onClick={() => togglePlay(track.id, track.url)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${playingId === track.id ? 'bg-[#E5654B] text-white scale-110' : 'bg-[#f5f3f0] text-[#999] hover:bg-[#E5654B] hover:text-white'}`}>
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
                                    {/* Actions — always visible */}
                                    <div className="flex gap-1">
                                        <button type="button" onClick={() => handleEdit(track)}
                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button type="button" onClick={() => handleDelete(track.id)}
                                            className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${confirmDeleteId === track.id ? 'bg-red-500 text-white' : 'hover:bg-red-50 text-red-500'}`}
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
            </div>
        </AdminLayout>
    );
}
