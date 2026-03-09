import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Music, Play, Pause, Upload, Volume2, Heart, Moon, Mic, Piano, Theater,
    CheckCircle, FolderOpen, Link as LinkIcon, Save, AlertCircle, XCircle
} from 'lucide-react';

const ICON_MAP = { Heart, Moon, Mic, Piano, Theater, Music };
function CatIcon({ name, size = 14, className = '' }) {
    const Comp = ICON_MAP[name] || Music;
    return <Comp size={size} className={className} />;
}

const CATEGORIES = [
    { value: 'all', label: 'Semua', icon: 'Music' },
    { value: 'romantis', label: 'Romantis', icon: 'Heart' },
    { value: 'islami', label: 'Islami', icon: 'Moon' },
    { value: 'pop', label: 'Pop', icon: 'Mic' },
    { value: 'instrumental', label: 'Instrumental', icon: 'Piano' },
];

const ALLOWED_AUDIO = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/x-m4a', 'audio/mp4'];
const MAX_SIZE_MB = 20;

export default function Musik({ invitation, platformMusic = [] }) {
    const { flash } = usePage().props;
    const [uploading, setUploading] = useState(false);
    const [tab, setTab] = useState('platform');
    const [filter, setFilter] = useState('all');
    const [playingId, setPlayingId] = useState(null);
    const [uploadNotif, setUploadNotif] = useState(null); // { type: 'error'|'success', message }
    const [previewKey, setPreviewKey] = useState(0);
    const audioRef = useRef(null);

    const { data, setData, post, processing } = useForm({
        music_url: invitation?.music_url || '',
        music_autoplay: invitation?.music_autoplay ?? true,
    });

    const showNotif = (type, message) => {
        setUploadNotif({ type, message });
        if (type === 'success') setTimeout(() => setUploadNotif(null), 4000);
    };

    const handleMusicUpload = async (file) => {
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
            const res = await fetch(route('upload'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData,
            });
            if (!res.ok) {
                const errText = await res.text();
                // Parse Laravel validation errors
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
            setData('music_url', result.url);
            setPreviewKey(k => k + 1);
            showNotif('success', `File "${file.name}" berhasil diupload!`);
        } catch (e) {
            console.error(e);
            showNotif('error', `Upload gagal: ${e.message}`);
        }
        setUploading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.musik.save'));
    };

    const selectPlatformMusic = (track) => {
        setData('music_url', track.url);
        setPreviewKey(k => k + 1);
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

    const filtered = filter === 'all' ? platformMusic : platformMusic.filter(t => t.category === filter);

    return (
        <DashboardLayout title="Musik">
            <Head title="Musik" />
            <div className="max-w-2xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <CheckCircle size={16} /> {flash.success}
                    </div>
                )}

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
                    <Music size={20} className="text-purple-500 mt-0.5" />
                    <div>
                        <div className="font-medium text-purple-800 text-sm">Pengaturan Musik</div>
                        <div className="text-purple-600 text-xs mt-0.5">Pilih dari koleksi musik kami atau upload musik sendiri.</div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                    <button onClick={() => setTab('platform')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${tab === 'platform' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'}`}>
                        <Music size={14} /> Koleksi Musik
                    </button>
                    <button onClick={() => setTab('custom')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${tab === 'custom' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500'}`}>
                        <FolderOpen size={14} /> Musik Sendiri
                    </button>
                </div>

                {/* Platform Music Tab */}
                {tab === 'platform' && (
                    <div className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            {CATEGORIES.map(c => (
                                <button key={c.value} onClick={() => setFilter(c.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filter === c.value ? 'bg-purple-500 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-purple-50'}`}>
                                    <CatIcon name={c.icon} size={12} /> {c.label}
                                </button>
                            ))}
                        </div>

                        {filtered.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                                <Music size={40} className="text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">Belum ada musik tersedia</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-50">
                                {filtered.map((track) => {
                                    const isSelected = data.music_url === track.url;
                                    return (
                                        <div key={track.id} className={`px-4 py-3 flex items-center gap-3 transition-all ${isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : 'hover:bg-gray-50'}`}>
                                            <button onClick={() => togglePlay(track.id, track.url)}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${playingId === track.id ? 'bg-purple-500 text-white scale-110' : 'bg-gray-100 text-gray-400 hover:bg-purple-500 hover:text-white'}`}>
                                                {playingId === track.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-gray-800 truncate">{track.title}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    {track.artist && <span>{track.artist} &bull; </span>}
                                                    <CatIcon name={CATEGORIES.find(c => c.value === track.category)?.icon} size={11} />
                                                    <span className="capitalize">{track.category}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => selectPlatformMusic(track)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-purple-100 hover:text-purple-600'}`}>
                                                {isSelected ? <><CheckCircle size={12} /> Dipilih</> : 'Pilih'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Save section on platform tab */}
                {tab === 'platform' && data.music_url && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
                            <Volume2 size={20} className="text-purple-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-purple-800">Musik dipilih</p>
                                <audio controls className="w-full mt-2" key={`platform-${previewKey}-${data.music_url}`} src={data.music_url}></audio>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-gray-700 text-sm">Autoplay</div>
                                    <div className="text-xs text-gray-400 mt-0.5">Musik otomatis diputar saat undangan dibuka</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={data.music_autoplay}
                                        onChange={(e) => setData('music_autoplay', e.target.checked)}
                                        className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>
                            </div>
                        </div>
                        <button type="submit" disabled={processing}
                            className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Musik'}
                        </button>
                    </form>
                )}

                {/* Custom Music Tab */}
                {tab === 'custom' && (
                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><LinkIcon size={14} /> URL Musik</label>
                            <input type="text" value={data.music_url} onChange={(e) => { setData('music_url', e.target.value); setPreviewKey(k => k + 1); }}
                                placeholder="https://example.com/music.mp3"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
                            <p className="text-xs text-gray-400 mt-2">Paste URL file MP3 atau upload file di bawah</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5"><Upload size={14} /> Upload File Musik</label>
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                                    {uploading ? (
                                        <p className="text-purple-500 font-medium">Uploading...</p>
                                    ) : (
                                        <>
                                            <Upload size={32} className="text-purple-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600 font-medium">Klik untuk upload file MP3</p>
                                            <p className="text-xs text-gray-400 mt-1">Max {MAX_SIZE_MB}MB &bull; Format: MP3, WAV, OGG, AAC, M4A</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" accept=".mp3,.wav,.ogg,.aac,.m4a,audio/*" className="hidden"
                                    onChange={(e) => { handleMusicUpload(e.target.files[0]); e.target.value = ''; }} disabled={uploading} />
                            </label>
                        </div>

                        {data.music_url && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-1.5"><Volume2 size={14} /> Preview</h4>
                                <audio controls className="w-full" key={`custom-${previewKey}-${data.music_url}`} src={data.music_url}></audio>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-gray-700 text-sm">Autoplay</div>
                                    <div className="text-xs text-gray-400 mt-0.5">Musik akan langsung diputar saat undangan dibuka</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={data.music_autoplay}
                                        onChange={(e) => setData('music_autoplay', e.target.checked)}
                                        className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>
                            </div>
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Musik'}
                        </button>
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
}
