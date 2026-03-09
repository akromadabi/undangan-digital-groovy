import { Head, usePage, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

// Locked sections — always visible, cannot be reordered
const LOCKED_KEYS = ['cover', 'opening', 'closing'];

export default function ThemeSettings({ invitation, currentTheme, themes, sections, previewData }) {
    const [layoutMode, setLayoutMode] = useState(invitation?.layout_mode || 'scroll');
    const [showSideMenu, setShowSideMenu] = useState(invitation?.show_side_menu ?? false);
    const [selectedThemeId, setSelectedThemeId] = useState(invitation?.theme_id);
    const [sectionList, setSectionList] = useState(sections || []);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [showThemePanel, setShowThemePanel] = useState(false);
    const [activePreviewIdx, setActivePreviewIdx] = useState(0);
    const [showCover, setShowCover] = useState(false);

    // Cover state
    const [coverImage, setCoverImage] = useState(invitation?.cover_image || '');
    const [coverTitle, setCoverTitle] = useState(invitation?.cover_title || 'The Wedding Of');
    const [coverSubtitle, setCoverSubtitle] = useState(invitation?.cover_subtitle || '');
    const [coverPrivate, setCoverPrivate] = useState(invitation?.is_private ?? false);
    const [coverQr, setCoverQr] = useState(invitation?.enable_qr ?? true);
    const [coverHidePhotos, setCoverHidePhotos] = useState(invitation?.hide_photos ?? false);
    const [coverUploading, setCoverUploading] = useState(false);
    const [coverSaving, setCoverSaving] = useState(false);

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
            await fetch(route('theme.layout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ layout_mode: mode }),
            });
        } catch (e) { console.error(e); }
    }, []);

    // Toggle side menu
    const handleSideMenuToggle = useCallback(async (val) => {
        setShowSideMenu(val);
        try {
            await fetch(route('theme.layout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ show_side_menu: val }),
            });
        } catch (e) { console.error(e); }
    }, []);

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
                <div className="w-full lg:w-1/2 xl:w-[45%] overflow-y-auto space-y-4 pr-2">

                    {/* Cover Editor */}
                    <div className="bg-white rounded-2xl border border-gray-200">
                        <button onClick={() => setShowCover(!showCover)}
                            className="w-full p-5 flex items-center justify-between text-left">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">🎨</span>
                                Cover Undangan
                            </h3>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${showCover ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showCover && (
                            <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                                {/* Cover Image Preview */}
                                <div className="relative aspect-[9/16] max-w-[200px] mx-auto rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    {coverImage ? (
                                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <div className="text-4xl mb-1">📸</div>
                                            <div className="text-xs">Belum ada gambar</div>
                                        </div>
                                    )}
                                    {coverImage && (
                                        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                                            <p className="text-[10px] uppercase tracking-widest opacity-80">{coverTitle}</p>
                                            <p className="text-sm font-bold font-serif mt-0.5">{coverSubtitle || 'Nama & Nama'}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <label className="inline-block px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors">
                                        {coverUploading ? '⏳ Uploading...' : '📷 Upload Cover'}
                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={(e) => handleCoverImageUpload(e.target.files[0])} disabled={coverUploading} />
                                    </label>
                                </div>

                                {/* Title & Subtitle */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Teks Atas Cover</label>
                                    <input type="text" value={coverTitle} onChange={(e) => setCoverTitle(e.target.value)}
                                        placeholder="The Wedding Of"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama Pasangan</label>
                                    <input type="text" value={coverSubtitle} onChange={(e) => setCoverSubtitle(e.target.value)}
                                        placeholder="Mira & Randi"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300" />
                                </div>

                                {/* Toggles */}
                                <div className="divide-y divide-gray-100 text-sm">
                                    {[
                                        { label: 'Privasi', desc: 'Undangan tidak muncul di Google', checked: coverPrivate, set: setCoverPrivate },
                                        { label: 'QR Code', desc: 'Tampilkan QR Code check-in', checked: coverQr, set: setCoverQr },
                                        { label: 'Tanpa Foto', desc: 'Mode undangan tanpa foto', checked: coverHidePhotos, set: setCoverHidePhotos },
                                    ].map(t => (
                                        <div key={t.label} className="flex items-center justify-between py-2.5">
                                            <div>
                                                <div className="font-medium text-gray-700 text-xs">{t.label}</div>
                                                <div className="text-[10px] text-gray-400">{t.desc}</div>
                                            </div>
                                            <button type="button" onClick={() => t.set(!t.checked)}
                                                className={`relative w-9 h-5 rounded-full transition-colors ${t.checked ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${t.checked ? 'translate-x-4' : ''}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Save */}
                                <button onClick={saveCover} disabled={coverSaving}
                                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                                    {coverSaving ? 'Menyimpan...' : '💾 Simpan Cover'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Layout Mode */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </span>
                            Model Transisi
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { mode: 'scroll', label: 'Scroll', desc: 'Gulir atas-bawah', Icon: () => <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg> },
                                { mode: 'slide', label: 'Slide', desc: 'Geser kiri-kanan', Icon: () => <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12m-12 5h12M4 7h.01M4 12h.01M4 17h.01" /></svg> },
                                { mode: 'tab', label: 'Tab', desc: 'Menu navigasi', Icon: () => <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg> },
                            ].map(({ mode, label, desc, Icon }) => (
                                <button key={mode} onClick={() => handleLayoutChange(mode)}
                                    className={`p-4 rounded-xl text-center transition-all ${layoutMode === mode
                                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm'
                                        : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                                        }`}>
                                    <div className="mb-1"><Icon /></div>
                                    <div className="text-sm font-semibold">{label}</div>
                                    <div className="text-[10px] opacity-70">{desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Side Menu Toggle */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>
                                </span>
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm">Menu Samping</h3>
                                    <p className="text-xs text-gray-400">Tampilkan navigasi icon di sisi kiri undangan</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSideMenuToggle(!showSideMenu)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${showSideMenu ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${showSideMenu ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Theme Selector */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                </span>
                                Tema Aktif
                            </h3>
                            <button onClick={() => setShowThemePanel(!showThemePanel)}
                                className="text-sm text-emerald-600 hover:underline font-medium">
                                {showThemePanel ? 'Tutup' : 'Ganti Tema'}
                            </button>
                        </div>
                        {activeTheme && (
                            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: colors.primary + '12' }}>
                                <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ border: `2px solid ${colors.primary}30` }}>
                                    {activeTheme.thumbnail
                                        ? <img src={activeTheme.thumbnail} className="w-full h-full object-cover" alt="" />
                                        : <div className="w-full h-full flex items-center justify-center bg-gray-100"><svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                    }
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-gray-800">{activeTheme.name}</div>
                                    <div className="text-xs text-gray-500">{activeTheme.category}</div>
                                    <div className="flex gap-1 mt-1">
                                        {Object.entries(colors).map(([key, val]) => (
                                            <div key={key} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: val }} title={key} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {showThemePanel && (
                            <div className="mt-3 grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                                {themes?.map(theme => (
                                    <button key={theme.id} onClick={() => handleThemeChange(theme.id)}
                                        className={`rounded-xl overflow-hidden transition-all ${selectedThemeId === theme.id
                                            ? 'ring-2 ring-emerald-500 shadow-md scale-[1.02]'
                                            : 'border border-gray-200 hover:shadow-sm'
                                            }`}>
                                        <div className="aspect-[9/16] bg-gray-100">
                                            {theme.thumbnail
                                                ? <img src={theme.thumbnail} className="w-full h-full object-cover" alt="" />
                                                : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme.color_scheme?.bg || '#f5f5f5' }}>
                                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            }
                                        </div>
                                        <div className="p-1.5 text-[10px] font-medium text-center truncate">{theme.name}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section Manager */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                </span>
                                Urutan Section
                            </h3>
                            <div className="flex items-center gap-2">
                                {saveMsg && (
                                    <span className={`text-xs font-medium ${saveMsg === 'Tersimpan!' ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {saveMsg === 'Tersimpan!' && <svg className="w-3.5 h-3.5 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                        {saveMsg !== 'Tersimpan!' && <svg className="w-3.5 h-3.5 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                                        {saveMsg}
                                    </span>
                                )}
                                <button onClick={saveSections} disabled={saving}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-sm hover:shadow flex items-center gap-1.5">
                                    {saving ? (
                                        <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Menyimpan...</>
                                    ) : (
                                        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> Simpan</>
                                    )}
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            Section <strong>Cover</strong>, <strong>Opening</strong>, dan <strong>Penutup</strong> terkunci pada posisinya.
                        </p>

                        <div className="space-y-1.5">
                            {sectionList.map((section, index) => {
                                const locked = isLocked(section.section_key);
                                return (
                                    <div key={section.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all ${locked
                                            ? 'bg-gray-100/80 border border-gray-200'
                                            : section.is_visible
                                                ? 'bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                                                : 'bg-gray-50/50 border border-dashed border-gray-200 opacity-50'
                                            }`}>
                                        {/* Arrows or Lock */}
                                        <div className="flex flex-col gap-0.5 w-4">
                                            {locked ? (
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            ) : (
                                                <>
                                                    <button onClick={() => moveSection(index, 'up')}
                                                        disabled={index === 0 || isLocked(sectionList[index - 1]?.section_key)}
                                                        className="text-gray-400 hover:text-emerald-600 disabled:opacity-20 text-[10px] transition-colors leading-none">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                    </button>
                                                    <button onClick={() => moveSection(index, 'down')}
                                                        disabled={index === sectionList.length - 1 || isLocked(sectionList[index + 1]?.section_key)}
                                                        className="text-gray-400 hover:text-emerald-600 disabled:opacity-20 text-[10px] transition-colors leading-none">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <span className={`flex-1 font-medium ${locked ? 'text-gray-500' : 'text-gray-700'}`}>
                                            {section.section_name}
                                            {locked && <span className="ml-1 text-[10px] text-gray-400 font-normal">(terkunci)</span>}
                                        </span>

                                        {/* Toggle */}
                                        {locked ? (
                                            <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Selalu aktif</span>
                                        ) : (
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={!!section.is_visible}
                                                    onChange={() => toggleSection(section.id, section.section_key)}
                                                    className="sr-only peer" />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                            </label>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Phone Preview */}
                <div className="hidden lg:flex flex-1 items-start justify-center">
                    <div className="sticky top-4">
                        <div className="w-[360px] h-[680px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-gray-800 overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10" />
                            <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: colors.bg }}>
                                <ThemePreview
                                    layoutMode={layoutMode}
                                    sections={visibleForPreview}
                                    theme={activeTheme}
                                    colors={colors}
                                    fonts={fonts}
                                    isJawa={isJawa}
                                    previewData={previewData}
                                    activeIdx={activePreviewIdx}
                                    setActiveIdx={setActivePreviewIdx}
                                />
                            </div>
                        </div>
                        <div className="text-center mt-3 text-xs text-gray-400">
                            Preview Mode: <span className="font-semibold text-gray-600 capitalize">{layoutMode}</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// ═══ Theme-aware Preview ═══
function ThemePreview({ layoutMode, sections, theme, colors, fonts, isJawa, previewData, activeIdx, setActiveIdx }) {
    const inv = previewData?.invitation;

    if (layoutMode === 'slide') {
        const current = sections[activeIdx] || sections[0];
        return (
            <div className="h-full flex flex-col" style={{ fontFamily: fonts.body }}>
                <div className="flex-1 overflow-y-auto">
                    {current && <SectionCard section={current} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} />}
                </div>
                <div className="flex justify-center gap-1.5 py-3" style={{ backgroundColor: colors.bg }}>
                    {sections.map((s, i) => (
                        <button key={s.id} onClick={() => setActiveIdx(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIdx ? 'scale-125' : 'opacity-30'}`}
                            style={{ backgroundColor: colors.primary }} />
                    ))}
                </div>
            </div>
        );
    }

    if (layoutMode === 'tab') {
        const current = sections[activeIdx] || sections[0];
        return (
            <div className="h-full flex flex-col" style={{ fontFamily: fonts.body }}>
                <div className="flex-1 overflow-y-auto">
                    {current && <SectionCard section={current} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} />}
                </div>
                <nav className="flex border-t" style={{ borderColor: colors.primary + '30', backgroundColor: colors.bg }}>
                    {sections.slice(0, 5).map((s, i) => (
                        <button key={s.id} onClick={() => setActiveIdx(i)}
                            className="flex-1 py-2.5 text-center text-[9px] font-medium transition-colors"
                            style={{ color: i === activeIdx ? colors.primary : colors.text + '70' }}>
                            {s.section_name}
                        </button>
                    ))}
                </nav>
            </div>
        );
    }

    // Default: scroll
    return (
        <div style={{ fontFamily: fonts.body }}>
            {sections.map((section) => (
                <SectionCard key={section.id} section={section} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} />
            ))}
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
