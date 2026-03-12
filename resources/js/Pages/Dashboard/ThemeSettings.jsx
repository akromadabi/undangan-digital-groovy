import { Head, usePage, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { PARTICLE_MAP } from '@/Components/ParticleEffect';

// Locked sections — always visible, cannot be reordered
const LOCKED_KEYS = ['cover', 'opening', 'closing'];

// SVG icon components for particle selector
const PIcons = {
    snow: (c) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="5.6" y2="18.4"/></svg>,
    sakura: (c) => <svg className={c} viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="3.5" ry="6" fill="#f5abc6" transform="rotate(0 12 12)"/><ellipse cx="12" cy="6" rx="3.5" ry="6" fill="#f097b4" transform="rotate(72 12 12)"/><ellipse cx="12" cy="6" rx="3.5" ry="6" fill="#f5abc6" transform="rotate(144 12 12)"/><ellipse cx="12" cy="6" rx="3.5" ry="6" fill="#f097b4" transform="rotate(216 12 12)"/><ellipse cx="12" cy="6" rx="3.5" ry="6" fill="#f5abc6" transform="rotate(288 12 12)"/><circle cx="12" cy="12" r="2.5" fill="#dc7896"/></svg>,
    leaves: (c) => <svg className={c} viewBox="0 0 24 24" fill="none"><path d="M4 20S4 9 12 4c8 5 8 16 8 16" stroke="#6aad50" strokeWidth="1.5"/><path d="M4 20S6 11 12 7c6 4 8 13 8 13" fill="#78c850" opacity=".6"/><line x1="12" y1="7" x2="12" y2="20" stroke="#5a8c3c" strokeWidth="1"/></svg>,
    rose: (c) => <svg className={c} viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5" fill="#dc3c3c"/><circle cx="9" cy="12" r="3.2" fill="#c83232"/><circle cx="15" cy="12" r="3.2" fill="#e64646"/><circle cx="12" cy="14" r="3" fill="#d23737"/><path d="M12 17l-1.2 4.5c.8.8 1.6.8 2.4 0z" fill="#508c3c"/></svg>,
    stars: (c) => <svg className={c} viewBox="0 0 24 24"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" fill="#f0c830"/></svg>,
    hearts: (c) => <svg className={c} viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" fill="#e84393"/></svg>,
    confetti: (c) => <svg className={c} viewBox="0 0 24 24"><rect x="2" y="8" width="6" height="4" rx="1" fill="#ff6b6b" transform="rotate(-15 5 10)"/><rect x="10" y="4" width="6" height="4" rx="1" fill="#4d96ff" transform="rotate(10 13 6)"/><rect x="16" y="10" width="6" height="4" rx="1" fill="#ffd93d" transform="rotate(-20 19 12)"/><rect x="6" y="15" width="6" height="4" rx="1" fill="#6bcb77" transform="rotate(12 9 17)"/><rect x="14" y="16" width="5" height="3.5" rx="1" fill="#ff6bcb" transform="rotate(-8 16.5 17.75)"/></svg>,
    butterfly: (c) => <svg className={c} viewBox="0 0 24 24"><path d="M12 12c-3-5-8-6-9-4s1 6 3.5 8c1.2 1 4 1.5 5.5 0" fill="#a29bfe"/><path d="M12 12c3-5 8-6 9-4s-1 6-3.5 8c-1.2 1-4 1.5-5.5 0" fill="#7c6fef"/><line x1="12" y1="7" x2="12" y2="20" stroke="#6050c0" strokeWidth="1"/></svg>,
    flower: (c) => <svg className={c} viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="3.5" ry="5.5" fill="#fd79a8"/><ellipse cx="18" cy="12" rx="5.5" ry="3.5" fill="#f890b8"/><ellipse cx="12" cy="18.5" rx="3.5" ry="5.5" fill="#fd79a8"/><ellipse cx="6" cy="12" rx="5.5" ry="3.5" fill="#f890b8"/><circle cx="12" cy="12" r="3" fill="#ffc83c"/></svg>,
    sparkle: (c) => <svg className={c} viewBox="0 0 24 24"><path d="M12 2L14 9L21 12L14 15L12 22L10 15L3 12L10 9Z" fill="#ffd700"/></svg>,
};

const PARTICLE_OPTIONS = [
    { key: 'snow', label: 'Salju' },
    { key: 'sakura', label: 'Sakura' },
    { key: 'leaves', label: 'Daun' },
    { key: 'rose', label: 'Mawar' },
    { key: 'stars', label: 'Bintang' },
    { key: 'hearts', label: 'Hati' },
    { key: 'confetti', label: 'Confetti' },
    { key: 'butterfly', label: 'Kupu-kupu' },
    { key: 'flower', label: 'Bunga' },
    { key: 'sparkle', label: 'Sparkle' },
];

export default function ThemeSettings({ invitation, currentTheme, themes, sections, previewData }) {
    const [layoutMode, setLayoutMode] = useState(invitation?.layout_mode || 'scroll');
    const [menuPosition, setMenuPosition] = useState(invitation?.menu_position || 'none');
    const [selectedThemeId, setSelectedThemeId] = useState(invitation?.theme_id);
    const [sectionList, setSectionList] = useState(sections || []);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [showThemePanel, setShowThemePanel] = useState(false);
    const [activePreviewIdx, setActivePreviewIdx] = useState(0);
    const [showCover, setShowCover] = useState(false);
    const [showParticle, setShowParticle] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: '' }
    const [previewKey, setPreviewKey] = useState(0);
    const [activeTab, setActiveTab] = useState('tampilan');

    const showToast = useCallback((type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 2000);
    }, []);

    // Cover state
    const [coverImage, setCoverImage] = useState(invitation?.cover_image || '');
    const [coverTitle, setCoverTitle] = useState(invitation?.cover_title || 'The Wedding Of');
    const [coverSubtitle, setCoverSubtitle] = useState(invitation?.cover_subtitle || '');
    const [coverPrivate, setCoverPrivate] = useState(invitation?.is_private ?? false);
    const [coverQr, setCoverQr] = useState(invitation?.enable_qr ?? true);
    const [coverHidePhotos, setCoverHidePhotos] = useState(invitation?.hide_photos ?? false);
    const [coverUploading, setCoverUploading] = useState(false);
    const [coverSaving, setCoverSaving] = useState(false);

    // Particle state
    const [particleType, setParticleType] = useState(invitation?.particle_type || null);
    const [particleCount, setParticleCount] = useState(invitation?.particle_count ?? 30);
    const [particleSpeed, setParticleSpeed] = useState(invitation?.particle_speed || 'normal');

    const handleCoverImageUpload = async (file) => {
        if (!file) return;
        setCoverUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'covers');
        try {
            const res = await fetch(route('upload'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData,
            });
            const result = await res.json();
            setCoverImage(result.url);
        } catch (e) { console.error(e); }
        setCoverUploading(false);
    };

    const saveCover = async () => {
        setCoverSaving(true);
        try {
            await fetch(route('settings.cover.save'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    cover_image: coverImage,
                    cover_title: coverTitle,
                    cover_subtitle: coverSubtitle,
                    is_private: coverPrivate,
                    enable_qr: coverQr,
                    hide_photos: coverHidePhotos,
                }),
            });
            setSaveMsg('Cover tersimpan!');
        } catch (e) { console.error(e); setSaveMsg('Gagal menyimpan cover'); }
        setCoverSaving(false);
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const isLocked = (key) => LOCKED_KEYS.includes(key);

    // Real-time layout mode change
    const handleLayoutChange = useCallback(async (mode) => {
        setLayoutMode(mode);
        try {
            const res = await fetch(route('theme.layout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ layout_mode: mode }),
            });
            if (res.ok) {
                showToast('success', 'Tersimpan');
                setTimeout(() => setPreviewKey(k => k + 1), 800);
            } else {
                showToast('error', 'Gagal menyimpan');
                setLayoutMode(invitation?.layout_mode || 'scroll');
            }
        } catch (e) {
            console.error(e);
            showToast('error', 'Gagal menyimpan');
            setLayoutMode(invitation?.layout_mode || 'scroll');
        }
    }, [showToast, invitation]);

    // Menu position change
    const handleMenuPositionChange = useCallback(async (pos) => {
        setMenuPosition(pos);
        try {
            const res = await fetch(route('theme.layout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ menu_position: pos }),
            });
            if (res.ok) {
                showToast('success', 'Tersimpan');
                setTimeout(() => setPreviewKey(k => k + 1), 800);
            } else {
                showToast('error', 'Gagal menyimpan');
                setMenuPosition(invitation?.menu_position || 'none');
            }
        } catch (e) {
            console.error(e);
            showToast('error', 'Gagal menyimpan');
            setMenuPosition(invitation?.menu_position || 'none');
        }
    }, [showToast, invitation]);

    // Save particle settings
    const handleParticleSave = useCallback(async (data) => {
        const payload = {
            particle_type: data.type ?? particleType,
            particle_count: data.count ?? particleCount,
            particle_speed: data.speed ?? particleSpeed,
        };
        try {
            await fetch(route('theme.layout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });
        } catch (e) { console.error(e); }
    }, [particleType, particleCount, particleSpeed]);

    // Change theme
    const handleThemeChange = useCallback(async (themeId) => {
        setSelectedThemeId(themeId);
        try {
            const res = await fetch(route('theme.change'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ theme_id: themeId }),
            });
            const data = await res.json();
            if (data.sections) setSectionList(data.sections);
            setShowThemePanel(false);
        } catch (e) { console.error(e); }
    }, []);

    // Toggle section visibility (only non-locked)
    const toggleSection = useCallback((sectionId, sectionKey) => {
        if (isLocked(sectionKey)) return;
        setSectionList(prev => prev.map(s =>
            s.id === sectionId ? { ...s, is_visible: !s.is_visible } : s
        ));
    }, []);

    // Move section (only non-locked, skip locked)
    const moveSection = useCallback((index, direction) => {
        setSectionList(prev => {
            const arr = [...prev];
            const current = arr[index];
            if (isLocked(current.section_key)) return arr;

            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= arr.length) return arr;
            if (isLocked(arr[targetIndex].section_key)) return arr;

            [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
            return arr.map((s, i) => ({ ...s, sort_order: i }));
        });
    }, []);

    // Save sections
    const saveSections = useCallback(async () => {
        setSaving(true);
        setSaveMsg('');
        try {
            const payload = {
                sections: sectionList.map((s, i) => ({
                    id: s.id,
                    sort_order: i,
                    is_visible: Boolean(s.is_visible),
                })),
            };
            const res = await fetch(route('theme.sections'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error('Save failed:', res.status, errText);
                setSaveMsg('Gagal menyimpan');
                setSaving(false);
                setTimeout(() => setSaveMsg(''), 3000);
                return;
            }

            const data = await res.json();
            if (data.success) {
                setSaveMsg('Tersimpan!');
                if (data.sections) setSectionList(data.sections);
            } else {
                setSaveMsg('Gagal menyimpan');
            }
        } catch (e) {
            console.error('Save error:', e);
            setSaveMsg('Terjadi kesalahan');
        }
        setSaving(false);
        setTimeout(() => setSaveMsg(''), 3000);
    }, [sectionList]);

    const activeTheme = themes?.find(t => t.id === selectedThemeId) || currentTheme;
    const colors = activeTheme?.color_scheme || { primary: '#B76E79', secondary: '#D4A373', bg: '#FFF9F5', text: '#2D2D2D' };
    const fonts = activeTheme?.font_config || { heading: 'serif', body: 'sans-serif', script: 'cursive' };
    const isJawa = activeTheme?.slug === 'adat-jawa';

    const visibleForPreview = sectionList.filter(s => s.is_visible);

    return (
        <DashboardLayout title="Pengaturan Tema">
            <Head title="Pengaturan Tema" />

            <div className="flex gap-6 h-[calc(100vh-8rem)]">
                {/* Left Panel */}
                <div className="w-full lg:w-1/2 xl:w-[45%] overflow-y-auto pr-2">
                    {/* Segmented Tab Control */}
                    <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md pb-2 pt-1">
                        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                            {[
                                { key: 'tampilan', label: 'Tampilan', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                                { key: 'konten', label: 'Konten', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
                            ].map(tab => (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.key
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}>
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* â•â•â• TAB: Tampilan â•â•â• */}
                    {activeTab === 'tampilan' && (
                        <div className="space-y-3">
                            {/* 1. Cover */}
                            <div className="bg-white rounded-2xl border border-gray-200">
                                <button onClick={() => setShowCover(!showCover)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>
                                        Cover Undangan
                                    </h3>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCover ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {showCover && (
                                    <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                                        <div className="relative aspect-[9/16] max-w-[160px] mx-auto rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                            {coverImage ? <img src={coverImage} alt="Cover" className="w-full h-full object-cover" /> : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    <div className="text-[10px] mt-1">Belum ada gambar</div>
                                                </div>
                                            )}
                                            {coverImage && (
                                                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                                                    <p className="text-[9px] uppercase tracking-widest opacity-80">{coverTitle}</p>
                                                    <p className="text-xs font-bold font-serif mt-0.5">{coverSubtitle || 'Nama & Nama'}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <label className="inline-block px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors">
                                                {coverUploading ? 'Uploading...' : 'Upload Cover'}
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverImageUpload(e.target.files[0])} disabled={coverUploading} />
                                            </label>
                                        </div>
                                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Teks Atas Cover</label><input type="text" value={coverTitle} onChange={(e) => setCoverTitle(e.target.value)} placeholder="The Wedding Of" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-300" /></div>
                                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Nama Pasangan</label><input type="text" value={coverSubtitle} onChange={(e) => setCoverSubtitle(e.target.value)} placeholder="Mira & Randi" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-300" /></div>
                                        <div className="divide-y divide-gray-100 text-sm">
                                            {[
                                                { label: 'Privasi', desc: 'Tidak muncul di Google', checked: coverPrivate, set: setCoverPrivate },
                                                { label: 'QR Code', desc: 'QR Code check-in', checked: coverQr, set: setCoverQr },
                                                { label: 'Tanpa Foto', desc: 'Mode tanpa foto', checked: coverHidePhotos, set: setCoverHidePhotos },
                                            ].map(t => (
                                                <div key={t.label} className="flex items-center justify-between py-2">
                                                    <div><div className="font-medium text-gray-700 text-xs">{t.label}</div><div className="text-[10px] text-gray-400">{t.desc}</div></div>
                                                    <button type="button" onClick={() => t.set(!t.checked)} className={`relative w-9 h-5 rounded-full transition-colors ${t.checked ? 'bg-emerald-500' : 'bg-gray-300'}`}><span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${t.checked ? 'translate-x-4' : ''}`} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={saveCover} disabled={coverSaving} className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">{coverSaving ? 'Menyimpan...' : 'Simpan Cover'}</button>
                                    </div>
                                )}
                            </div>

                            {/* 2. Tema Aktif */}
                            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg></span>
                                        Tema Aktif
                                    </h3>
                                    <button onClick={() => setShowThemePanel(!showThemePanel)} className="text-xs text-emerald-600 hover:underline font-medium">{showThemePanel ? 'Tutup' : 'Ganti Tema'}</button>
                                </div>
                                {activeTheme && (
                                    <div className="flex items-center gap-3 p-2.5 rounded-xl" style={{ backgroundColor: colors.primary + '12' }}>
                                        <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ border: `2px solid ${colors.primary}30` }}>
                                            {activeTheme.thumbnail ? <img src={activeTheme.thumbnail} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-800">{activeTheme.name}</div>
                                            <div className="text-xs text-gray-500">{activeTheme.category}</div>
                                            <div className="flex gap-1 mt-1">{Object.entries(colors).map(([key, val]) => <div key={key} className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: val }} title={key} />)}</div>
                                        </div>
                                    </div>
                                )}
                                {showThemePanel && (
                                    <div className="mt-2 grid grid-cols-3 gap-1.5 max-h-56 overflow-y-auto p-1">
                                        {themes?.map(theme => (
                                            <button key={theme.id} onClick={() => handleThemeChange(theme.id)}
                                                className={`rounded-xl overflow-hidden transition-all ${selectedThemeId === theme.id ? 'ring-2 ring-emerald-500 shadow-md scale-[1.02]' : 'border border-gray-200 hover:shadow-sm'}`}>
                                                <div className="aspect-[9/16] bg-gray-100">
                                                    {theme.thumbnail ? <img src={theme.thumbnail} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme.color_scheme?.bg || '#f5f5f5' }}><svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
                                                </div>
                                                <div className="p-1 text-[10px] font-medium text-center truncate">{theme.name}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 3. Model Transisi */}
                            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3">
                                <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </span>
                                    Model Transisi
                                </h3>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { mode: 'scroll', label: 'Scroll', desc: 'Gulir biasa', Icon: () => <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg> },
                                        { mode: 'slide-h', label: 'Horizontal', desc: 'Kiri-kanan', Icon: () => <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg> },
                                        { mode: 'slide-v', label: 'Vertikal', desc: 'Atas-bawah', Icon: () => <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg> },
                                    ].map(({ mode, label, desc, Icon }) => (
                                        <button key={mode} onClick={() => handleLayoutChange(mode)}
                                            className={`p-3 rounded-xl text-center transition-all ${layoutMode === mode
                                                ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm'
                                                : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                                            }`}>
                                            <div className="mb-0.5"><Icon /></div>
                                            <div className="text-xs font-semibold">{label}</div>
                                            <div className="text-[9px] opacity-70">{desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Menu Navigasi */}
                            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3">
                                <h3 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>
                                    </span>
                                    Menu Navigasi
                                </h3>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {[
                                        { pos: 'none', label: 'Tanpa', Icon: () => <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> },
                                        { pos: 'bottom', label: 'Bawah', Icon: () => <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="18" x2="21" y2="18" /></svg> },
                                        { pos: 'left', label: 'Kiri', Icon: () => <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="8" y1="3" x2="8" y2="21" /></svg> },
                                        { pos: 'right', label: 'Kanan', Icon: () => <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="16" y1="3" x2="16" y2="21" /></svg> },
                                    ].map(({ pos, label, Icon }) => (
                                        <button key={pos} onClick={() => handleMenuPositionChange(pos)}
                                            className={`p-2.5 rounded-xl text-center transition-all ${menuPosition === pos
                                                ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700 shadow-sm'
                                                : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                                            }`}>
                                            <div className="mb-0.5"><Icon /></div>
                                            <div className="text-[10px] font-semibold">{label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 5. Efek Partikel */}
                            <div className="bg-white rounded-2xl border border-gray-200">
                                <button onClick={() => setShowParticle(!showParticle)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-cyan-100 flex items-center justify-center text-xs">âœ¨</span>
                                        Efek Partikel
                                        {particleType && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">{PARTICLE_OPTIONS.find(p => p.key === particleType)?.label || particleType}</span>}
                                    </h3>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showParticle ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {showParticle && (
                                    <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                                        <div><label className="block text-xs font-medium text-gray-600 mb-1.5">Jenis Partikel</label>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {PARTICLE_OPTIONS.map(p => (
                                                    <button key={p.key} onClick={() => { setParticleType(p.key); handleParticleSave({ type: p.key }); }}
                                                        className={`p-2 rounded-xl text-center transition-all ${particleType === p.key ? 'bg-emerald-50 border-2 border-emerald-500 shadow-sm scale-[1.05]' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'}`}>
                                                        <div className="flex justify-center mb-0.5">{PIcons[p.key]?.('w-5 h-5')}</div>
                                                        <div className="text-[8px] font-medium text-gray-600 leading-tight">{p.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1"><label className="text-xs font-medium text-gray-600">Jumlah</label><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{particleCount}</span></div>
                                            <input type="range" min="5" max="80" step="5" value={particleCount} onChange={(e) => setParticleCount(parseInt(e.target.value))} onMouseUp={(e) => handleParticleSave({ count: parseInt(e.target.value) })} onTouchEnd={(e) => handleParticleSave({ count: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500" />
                                        </div>
                                        <div><label className="block text-xs font-medium text-gray-600 mb-1.5">Kecepatan</label>
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {[
                                                    { val: 'slow', label: 'Lambat', icon: <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                                                    { val: 'normal', label: 'Normal', icon: <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> },
                                                    { val: 'fast', label: 'Cepat', icon: <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
                                                ].map(s => (
                                                    <button key={s.val} onClick={() => { setParticleSpeed(s.val); handleParticleSave({ speed: s.val }); }}
                                                        className={`p-2 rounded-xl text-center transition-all ${particleSpeed === s.val ? 'bg-emerald-50 border-2 border-emerald-500' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'}`}>
                                                        <div className="mb-0.5">{s.icon}</div>
                                                        <div className="text-[9px] font-medium text-gray-600">{s.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {particleType && (
                                            <button onClick={() => { setParticleType(null); handleParticleSave({ type: null }); }}
                                                className="w-full py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                Nonaktifkan
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* â•â•â• TAB: Konten â•â•â• */}
                    {activeTab === 'konten' && (
                        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></span>
                                    Urutan Section
                                </h3>
                                <div className="flex items-center gap-2">
                                    {saveMsg && <span className={`text-xs font-medium ${saveMsg === 'Tersimpan!' ? 'text-emerald-600' : 'text-red-500'}`}>{saveMsg}</span>}
                                    <button onClick={saveSections} disabled={saving} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-sm flex items-center gap-1">
                                        {saving ? <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Simpan...</> : <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> Simpan</>}
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-2 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <strong>Cover</strong>, <strong>Opening</strong>, <strong>Penutup</strong> terkunci.
                            </p>
                            <div className="space-y-1">
                                {sectionList.map((section, index) => {
                                    const locked = isLocked(section.section_key);
                                    return (
                                        <div key={section.id} className={`flex items-center gap-2 p-2.5 rounded-xl text-sm transition-all ${locked ? 'bg-gray-100/80 border border-gray-200' : section.is_visible ? 'bg-white border border-gray-200 hover:border-emerald-300' : 'bg-gray-50/50 border border-dashed border-gray-200 opacity-50'}`}>
                                            <div className="flex flex-col gap-0.5 w-4">
                                                {locked ? <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> : (
                                                    <>
                                                        <button onClick={() => moveSection(index, 'up')} disabled={index === 0 || isLocked(sectionList[index - 1]?.section_key)} className="text-gray-400 hover:text-emerald-600 disabled:opacity-20 transition-colors leading-none"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                                                        <button onClick={() => moveSection(index, 'down')} disabled={index === sectionList.length - 1 || isLocked(sectionList[index + 1]?.section_key)} className="text-gray-400 hover:text-emerald-600 disabled:opacity-20 transition-colors leading-none"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                                                    </>
                                                )}
                                            </div>
                                            <span className={`flex-1 font-medium text-xs ${locked ? 'text-gray-500' : 'text-gray-700'}`}>
                                                {section.section_name}
                                                {locked && <span className="ml-1 text-[9px] text-gray-400 font-normal">(terkunci)</span>}
                                            </span>
                                            {locked ? <span className="text-[9px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">Aktif</span> : (
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={!!section.is_visible} onChange={() => toggleSection(section.id, section.section_key)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                                </label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                {/* Right Panel: Phone Preview (Real iframe) */}
                <div className="hidden lg:flex flex-1 items-start justify-center">
                    <div className="sticky top-4">
                        <div className="w-[360px] h-[680px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-gray-800 overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10" />
                            <div className="w-full h-full overflow-hidden relative">
                                <iframe
                                    key={previewKey}
                                    src={`/u/${invitation?.slug || ''}?preview=1`}
                                    className="absolute top-0 left-0 border-0"
                                    style={{
                                        width: '430px',
                                        height: '932px',
                                        transform: 'scale(0.8)',
                                        transformOrigin: 'top left',
                                    }}
                                    title="Preview Undangan"
                                />
                            </div>
                        </div>
                        <div className="text-center mt-3 flex items-center justify-center gap-2">
                            <span className="text-xs text-gray-400">
                                <span className="font-semibold text-gray-600 capitalize">{layoutMode === 'slide-h' ? 'Horizontal' : layoutMode === 'slide-v' ? 'Vertikal' : 'Scroll'}</span>
                                {menuPosition !== 'none' && <> · Menu <span className="font-semibold text-gray-600 capitalize">{menuPosition === 'bottom' ? 'Bawah' : menuPosition === 'left' ? 'Kiri' : 'Kanan'}</span></>}
                            </span>
                            <button onClick={() => setPreviewKey(k => k + 1)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                title="Refresh Preview">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast notification */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium text-white animate-[slideUp_0.3s_ease] ${
                    toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                    {toast.msg}
                </div>
            )}
            <style>{`@keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
        </DashboardLayout>
    );
}

// ═══ Theme-aware Preview ═══
function ThemePreview({ layoutMode, menuPosition, sections, theme, colors, fonts, isJawa, previewData, activeIdx, setActiveIdx }) {
    const inv = previewData?.invitation;
    const menuPos = menuPosition || 'none';

    // Mini menu indicator component
    const MenuIndicator = () => {
        if (menuPos === 'none') return null;
        const dotCount = Math.min(sections.length, 6);
        const dots = Array.from({ length: dotCount }, (_, i) => i);

        if (menuPos === 'bottom') {
            return (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 px-2 py-1 rounded-full" style={{ backgroundColor: '#ffffffe6', boxShadow: '0 1px 6px rgba(0,0,0,0.1)' }}>
                    {dots.map(i => (
                        <div key={i} className={`w-[6px] h-[6px] rounded-full transition-all ${i === activeIdx ? '' : 'opacity-30'}`}
                            style={{ backgroundColor: colors.primary }} />
                    ))}
                </div>
            );
        }

        const side = menuPos === 'right' ? 'right-1.5' : 'left-1.5';
        return (
            <div className={`absolute ${side} top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-full`} style={{ backgroundColor: '#ffffffe6', boxShadow: '0 1px 6px rgba(0,0,0,0.1)' }}>
                {dots.map(i => (
                    <div key={i} className={`w-[5px] h-[5px] rounded-full transition-all ${i === activeIdx ? '' : 'opacity-30'}`}
                        style={{ backgroundColor: colors.primary }} />
                ))}
            </div>
        );
    };

    if (layoutMode === 'slide-h') {
        const current = sections[activeIdx] || sections[0];
        return (
            <div className="h-full relative" style={{ fontFamily: fonts.body }}>
                <div className="h-full overflow-y-auto">
                    {current && <SectionCard section={current} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} />}
                </div>
                {/* Slide dots at bottom */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1" style={{ zIndex: 5 }}>
                    {sections.map((s, i) => (
                        <button key={s.id} onClick={() => setActiveIdx(i)}
                            className={`rounded-full transition-all ${i === activeIdx ? 'w-4 h-1.5' : 'w-1.5 h-1.5 opacity-30'}`}
                            style={{ backgroundColor: colors.primary }} />
                    ))}
                </div>
                <MenuIndicator />
            </div>
        );
    }

    if (layoutMode === 'slide-v') {
        const current = sections[activeIdx] || sections[0];
        const dotSide = menuPos === 'right' ? 'left-1.5' : 'right-1.5';
        return (
            <div className="h-full relative" style={{ fontFamily: fonts.body }}>
                <div className="h-full overflow-y-auto">
                    {current && <SectionCard section={current} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} />}
                </div>
                {/* Slide dots on side */}
                <div className={`absolute ${dotSide} top-1/2 -translate-y-1/2 flex flex-col gap-1`} style={{ zIndex: 5 }}>
                    {sections.map((s, i) => (
                        <button key={s.id} onClick={() => setActiveIdx(i)}
                            className={`rounded-full transition-all ${i === activeIdx ? 'h-4 w-1.5' : 'h-1.5 w-1.5 opacity-30'}`}
                            style={{ backgroundColor: colors.primary }} />
                    ))}
                </div>
                <MenuIndicator />
            </div>
        );
    }

    // Default: scroll
    return (
        <div className="relative" style={{ fontFamily: fonts.body }}>
            {sections.map((section) => (
                <SectionCard key={section.id} section={section} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} />
            ))}
            <MenuIndicator />
        </div>
    );
}

// ═══ Preview Card per section ═══
function SectionCard({ section, colors, fonts, isJawa, inv }) {
    const key = section.section_key;

    const OrnamentTop = () => isJawa ? <img src="/themes/adat-jawa/ornamen-bunga.png" alt="" className="w-full h-auto" style={{ opacity: 0.85 }} /> : null;
    const OrnamentBottom = () => isJawa ? <img src="/themes/adat-jawa/ornamen-wayang.png" alt="" className="w-full h-auto" style={{ opacity: 0.7 }} /> : null;
    const SwirlDiv = () => isJawa ? (
        <div className="flex items-center justify-center gap-0 my-2">
            <img src="/themes/adat-jawa/swirl-divider-left.png" alt="" className="w-16 h-auto opacity-60" />
            <img src="/themes/adat-jawa/swirl-divider-right.png" alt="" className="w-16 h-auto opacity-60" />
        </div>
    ) : null;

    if (key === 'cover') {
        return (
            <div className="text-center relative" style={{ backgroundColor: colors.bg }}>
                {isJawa && <OrnamentTop />}
                <div className="px-4 py-8">
                    {isJawa && <img src="/themes/adat-jawa/the-wedding.png" alt="" className="w-28 mx-auto mb-2 opacity-80" />}
                    <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: colors.primary }}>The Wedding Of</p>
                    <h2 className="text-xl font-bold" style={{ fontFamily: fonts.script, color: colors.primary }}>
                        {inv?.bride_grooms?.[0]?.nickname || 'Mempelai'} & {inv?.bride_grooms?.[1]?.nickname || 'Mempelai'}
                    </h2>
                    <SwirlDiv />
                    <p className="text-[10px] mt-1 opacity-60">Kepada Yth. Tamu Undangan</p>
                    <div className="mt-3">
                        <span className="px-5 py-2 rounded-full text-[10px] text-white font-semibold inline-flex items-center gap-1" style={{ backgroundColor: colors.primary }}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Buka Undangan
                        </span>
                    </div>
                </div>
                {isJawa && <OrnamentBottom />}
            </div>
        );
    }

    if (key === 'opening') {
        return (
            <div className="text-center" style={{ backgroundColor: colors.bg }}>
                {isJawa && <OrnamentTop />}
                <div className="px-4 py-4">
                    {isJawa && <p className="text-xs font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>Bismillahirrahmanirrahim</p>}
                    <SwirlDiv />
                    <p className="text-[10px] opacity-60 leading-relaxed my-2">{inv?.opening_ayat?.substring(0, 80) || '"Ayat Al-Quran..."'}...</p>
                    <h3 className="text-sm font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>{inv?.opening_title || 'Assalamualaikum'}</h3>
                    <SwirlDiv />
                </div>
            </div>
        );
    }

    if (key === 'bride_groom') {
        return (
            <div className="text-center" style={{ backgroundColor: colors.bg }}>
                {isJawa && <OrnamentTop />}
                <div className="px-4 py-4">
                    <SwirlDiv />
                    <h3 className="text-[10px] uppercase tracking-widest mb-2" style={{ color: colors.primary }}>Mempelai</h3>
                    <SwirlDiv />
                    {[0, 1].map(i => (
                        <div key={i} className="mb-3">
                            <div className="w-14 h-14 mx-auto rounded-full mb-1 overflow-hidden" style={{ border: `2px solid ${colors.primary}` }}>
                                {inv?.bride_grooms?.[i]?.photo
                                    ? <img src={inv.bride_grooms[i].photo} className="w-full h-full object-cover" alt="" />
                                    : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                                        <svg className="w-6 h-6" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                }
                            </div>
                            <p className="text-base font-bold" style={{ fontFamily: fonts.script, color: colors.primary }}>
                                {inv?.bride_grooms?.[i]?.full_name || (i === 0 ? 'Mempelai Wanita' : 'Mempelai Pria')}
                            </p>
                            <p className="text-[9px] opacity-50 mt-0.5">
                                {inv?.bride_grooms?.[i]?.father_name
                                    ? `Putri/Putra dari Bpk. ${inv.bride_grooms[i].father_name} & Ibu ${inv.bride_grooms[i].mother_name}`
                                    : 'Putra/Putri dari Bapak ... & Ibu ...'}
                            </p>
                            {i === 0 && <SwirlDiv />}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (key === 'event') {
        return (
            <div className="text-center" style={{ backgroundColor: colors.bg }}>
                {isJawa && <OrnamentTop />}
                <div className="px-4 py-4">
                    <SwirlDiv />
                    <h3 className="text-[10px] uppercase tracking-widest mb-2" style={{ color: colors.primary }}>Acara</h3>
                    <SwirlDiv />
                    <div className="flex justify-center gap-2 mb-3">
                        {['Hari', 'Jam', 'Mnt', 'Dtk'].map(l => (
                            <div key={l} className="w-10 h-10 rounded-lg flex flex-col items-center justify-center border text-[9px]"
                                style={{ backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }}>
                                <span className="text-sm font-bold" style={{ color: colors.primary }}>00</span>
                                <span className="opacity-50" style={{ fontSize: '7px' }}>{l}</span>
                            </div>
                        ))}
                    </div>
                    {(inv?.events || [{ event_name: 'Akad Nikah' }, { event_name: 'Resepsi' }]).map((evt, i) => (
                        <div key={i} className="p-3 rounded-xl border mb-2 text-left"
                            style={{ backgroundColor: colors.primary + '08', borderColor: colors.primary + '20' }}>
                            <p className="text-xs font-bold" style={{ color: colors.primary }}>{evt.event_name}</p>
                            <p className="text-[9px] opacity-60 mt-0.5">{evt.venue_name || 'Nama Venue'}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (key === 'gallery') {
        return (
            <div className="text-center" style={{ backgroundColor: colors.bg }}>
                {isJawa && <OrnamentTop />}
                <div className="px-4 py-4">
                    <SwirlDiv />
                    <h3 className="text-[10px] uppercase tracking-widest mb-2" style={{ color: colors.primary }}>Galeri</h3>
                    <SwirlDiv />
                    <div className="grid grid-cols-2 gap-1.5">
                        {(inv?.galleries?.slice(0, 4) || Array(4).fill(null)).map((g, i) => (
                            <div key={i} className={`rounded-lg overflow-hidden border ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                                style={{ borderColor: colors.primary + '20' }}>
                                {g?.image_url
                                    ? <img src={g.image_url} className="w-full h-full object-cover" alt="" />
                                    : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '10' }}>
                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (key === 'closing') {
        return (
            <div className="text-center" style={{ backgroundColor: colors.bg }}>
                {isJawa && <OrnamentTop />}
                <div className="px-4 py-4">
                    <SwirlDiv />
                    <h3 className="text-sm font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>{inv?.closing_title || 'Terima Kasih'}</h3>
                    <p className="text-[10px] opacity-60 mt-2 leading-relaxed">{inv?.closing_text?.substring(0, 100) || 'Merupakan suatu kebahagiaan...'}</p>
                    <SwirlDiv />
                    <p className="text-base mt-2" style={{ fontFamily: fonts.script, color: colors.primary }}>
                        {inv?.bride_grooms?.[0]?.nickname || 'Mempelai'} & {inv?.bride_grooms?.[1]?.nickname || 'Mempelai'}
                    </p>
                </div>
                {isJawa && <OrnamentBottom />}
            </div>
        );
    }

    // Fallback for other sections (bank, wishes, rsvp, etc.)
    return (
        <div className="text-center" style={{ backgroundColor: colors.bg }}>
            {isJawa && <OrnamentTop />}
            <div className="px-4 py-6">
                <SwirlDiv />
                <p className="text-[10px] uppercase tracking-widest" style={{ color: colors.primary }}>{section.section_name}</p>
                <SwirlDiv />
                <p className="text-[9px] opacity-40 mt-2">Preview section</p>
            </div>
        </div>
    );
}
