import { Head, usePage, router } from '@inertiajs/react';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import CustomDomainTutorialModal from '@/Components/CustomDomainTutorialModal';
import ThemePreviewCard from '@/Components/ThemePreviewCard';
import { Sparkles, X, ImageIcon } from 'lucide-react';
import { PARTICLE_MAP } from '@/Components/ParticleEffect';

// Locked sections — always visible, cannot be reordered
const LOCKED_KEYS = ['cover', 'opening', 'closing', 'mempelai'];

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
    birds: (c) => <svg className={c} viewBox="0 0 100 50" fill="currentColor"><path d="M 5,25 Q 25,5 45,25 Q 65,5 85,25 Q 65,15 45,25 Q 25,15 5,25 Z" /></svg>,
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
    { key: 'birds', label: 'Burung' },
];

const SORT_OPTIONS = [
    { key: 'terbaru', label: 'Terbaru' },
    { key: 'populer', label: 'Terpopuler' },
    { key: 'disukai', label: 'Terfavorit' },
];

const ToggleSwitch = ({ checked, onChange, label, desc, icon, disabled = false }) => (
    <div className={`flex items-center justify-between py-3 px-1 transition-opacity ${disabled ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && (
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center relative">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                    {disabled && (
                        <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </span>
            )}
            <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                    {label}
                    {disabled && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-bold border border-amber-100 shadow-xs">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Locked
                        </span>
                    )}
                </div>
                {desc && <div className="text-[10px] text-gray-400 mt-0.5">{desc}</div>}
            </div>
        </div>
        <button type="button" 
            disabled={disabled}
            onClick={disabled ? undefined : () => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                disabled ? 'bg-gray-200 cursor-not-allowed' : checked ? 'bg-[#E5654B]' : 'bg-gray-300'
            }`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
        </button>
    </div>
);

export default function ThemeSettings({ invitation, currentTheme, themes, sections, mediaAssets = [], previewData, centralHost = 'undangan.com' }) {
    const { auth, features, subscription } = usePage().props;
    const invitationType = invitation?.type || auth?.user?.invitation_type || 'wedding';

    const getDynamicLabel = (label) => {
        if (invitationType === 'wedding') return label;

        if (label === 'Mempelai') {
            switch (invitationType) {
                case 'graduation': return 'Profil Wisudawan';
                case 'birthday': return 'Profil Utama';
                case 'aqiqah': return 'Profil Anak';
                case 'circumcision': return 'Profil Anak';
                case 'anniversary': return 'Profil Pasangan';
                default: return 'Profil Utama';
            }
        }

        if (label === 'Kisah Cinta' || label === 'Kisah') {
            switch (invitationType) {
                case 'graduation': return 'Perjalanan Studi';
                case 'birthday': return 'Milestone & Kisah';
                case 'aqiqah': return 'Kisah Anak';
                case 'circumcision': return 'Kisah Anak';
                case 'anniversary': return 'Kisah Kebersamaan';
                default: return 'Cerita & Kisah';
            }
        }

        return label;
    };

    const isUserAdminOrSuper = auth.user?.role === 'admin' || auth.user?.role === 'super_admin';

    const isLockedByPlan = (featureSlug) => {
        if (isUserAdminOrSuper) return false;
        
        // Basic features are always unlocked for any plan
        const basicFeatures = ['opening', 'cover', 'event', 'bride_groom', 'bride_groom_detail', 'closing', 'music', 'dresscode', 'video_wedding'];
        if (basicFeatures.includes(featureSlug)) return false;
        
        if (!features) return true;
        return features[featureSlug] === false || features[featureSlug] === undefined;
    };

    const isThemeLocked = (themeItem) => {
        if (isUserAdminOrSuper) return false;
        if (isLockedByPlan('template')) return true;
        
        // Cek jika tema dibatasi untuk kelas paket tertentu
        if (themeItem.allowed_plans && themeItem.allowed_plans.length > 0) {
            const userPlanId = subscription?.plan?.id;
            if (!userPlanId) return true;
            return !themeItem.allowed_plans.includes(userPlanId);
        }
        return false;
    };

    const sectionKeyToFeatureSlug = {
        cover: 'cover',
        opening: 'opening',
        closing: 'closing',
        mempelai: 'bride_groom',
        countdown: 'save_the_date',
        love_story: 'love_story',
        event: 'event',
        gallery: 'gallery',
        rsvp: 'rsvp',
        wishes: 'guestbook',
        bank: 'bank',
        livestream: 'event',
    };

    const [layoutMode, setLayoutMode] = useState(invitation?.layout_mode || 'scroll');
    const [menuPosition, setMenuPosition] = useState(invitation?.menu_position || 'none');
    const [selectedThemeId, setSelectedThemeId] = useState(invitation?.theme_id);
    const [sectionList, setSectionList] = useState(sections || []);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [activePreviewIdx, setActivePreviewIdx] = useState(0);
    const [showCover, setShowCover] = useState(false);
    const [showParticle, setShowParticle] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: '' }
    const [previewKey, setPreviewKey] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortThemeKey, setSortThemeKey] = useState('terbaru');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const categoryDropdownRef = useRef(null);
    const typeDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
                setIsTypeDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Unique normalized categories list with counts
    const categories = useMemo(() => {
        const counts = {};
        themes?.forEach(t => {
            const cat = t.category ? t.category.trim().toLowerCase() : '';
            if (cat) {
                counts[cat] = (counts[cat] || 0) + 1;
            }
        });
        const uniqueCats = [...new Set(themes?.map(t => t.category ? t.category.trim().toLowerCase() : '').filter(Boolean) || [])];
        return uniqueCats.map(cat => ({
            name: cat,
            count: counts[cat] || 0
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [themes]);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const clearCategories = () => setSelectedCategories([]);

    // Memoize event types with theme counts
    const eventTypesWithCount = useMemo(() => {
        const list = [
            { key: 'wedding', label: 'Pernikahan' },
            { key: 'birthday', label: 'Ulang Tahun' },
            { key: 'graduation', label: 'Wisuda' },
            { key: 'aqiqah', label: 'Aqiqah' },
            { key: 'circumcision', label: 'Khitanan' },
            { key: 'anniversary', label: 'Anniversary' },
            { key: 'general', label: 'Umum / Semua Acara' }
        ];
        return list.map(opt => {
            const count = themes?.filter(t => {
                const types = Array.isArray(t.type) ? t.type : [];
                return types.includes(opt.key) || (opt.key !== 'general' && types.includes('general'));
            }).length || 0;
            return { ...opt, count };
        });
    }, [themes]);

    const toggleType = (typeKey) => {
        setSelectedTypes(prev =>
            prev.includes(typeKey) ? prev.filter(t => t !== typeKey) : [...prev, typeKey]
        );
    };

    const clearTypes = () => setSelectedTypes([]);

    // Sort helper for theme list
    const sortThemesFn = (arr, key) => {
        const copy = [...arr];
        if (key === 'terbaru') return copy.sort((a, b) => (b.id || 0) - (a.id || 0));
        if (key === 'populer') return copy.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
        if (key === 'disukai') return copy.sort((a, b) => ((b.base_likes || 0) + (b.real_likes || 0)) - ((a.base_likes || 0) + (a.real_likes || 0)));
        return copy;
    };

    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab');
            if (tabParam) return tabParam;

            const savedTab = localStorage.getItem('theme_active_tab');
            if (savedTab && ['tampilan', 'konten', 'pengaturan'].includes(savedTab)) {
                return savedTab;
            }
        }
        return 'tampilan';
    };
    const [activeTab, setActiveTab] = useState(getInitialTab);

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme_active_tab', tabKey);
            const url = new URL(window.location.href);
            if (tabKey === 'tampilan') {
                url.searchParams.delete('tab');
            } else {
                url.searchParams.set('tab', tabKey);
            }
            window.history.replaceState({}, '', url.toString());
        }
    };

    const showToast = useCallback((type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 2000);
    }, []);

    // Cover state
    const [coverImage, setCoverImage] = useState(invitation?.cover_image || '');
    const [coverTitle, setCoverTitle] = useState(invitation?.cover_title || 'The Wedding Of');
    const [coverSubtitle, setCoverSubtitle] = useState(invitation?.cover_subtitle || '');
    const [coverUploading, setCoverUploading] = useState(false);
    const [coverSaving, setCoverSaving] = useState(false);

    // Dynamic Cover & Opening Video selection states
    const [videoList, setVideoList] = useState(invitation?.video_list || []);
    const [coverVideoUrl, setCoverVideoUrl] = useState(invitation?.cover_video_url || '');
    const [openingVideoUrl, setOpeningVideoUrl] = useState(invitation?.opening_video_url || '');
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [savingVideoList, setSavingVideoList] = useState(false);

    // Particle state
    const [particleType, setParticleType] = useState(invitation?.particle_type || null);
    const [particleCount, setParticleCount] = useState(invitation?.particle_count ?? 30);
    const [particleSpeed, setParticleSpeed] = useState(invitation?.particle_speed || 'normal');

    // Consolidated Settings state
    const [showPhotos, setShowPhotos] = useState(invitation?.show_photos ?? true);
    const [showAnimations, setShowAnimations] = useState(invitation?.show_animations ?? true);
    const [showGuestName, setShowGuestName] = useState(invitation?.show_guest_name ?? true);
    const [showCountdown, setShowCountdown] = useState(invitation?.show_countdown ?? true);
    const [enableRsvp, setEnableRsvp] = useState(invitation?.enable_rsvp ?? true);
    const [enableWishes, setEnableWishes] = useState(invitation?.enable_wishes ?? true);
    const [musicAutoplay, setMusicAutoplay] = useState(invitation?.music_autoplay ?? true);
    const [enableAutoScroll, setEnableAutoScroll] = useState(invitation?.enable_auto_scroll ?? true);
    const [language, setLanguage] = useState(invitation?.language || 'id');
    const [religion, setReligion] = useState(invitation?.religion || 'islam');
    const [customDomain, setCustomDomain] = useState(invitation?.custom_domain || '');
    const [customDomainError, setCustomDomainError] = useState('');
    const [isPrivate, setIsPrivate] = useState(invitation?.is_private ?? false);
    const [enableQr, setEnableQr] = useState(invitation?.enable_qr ?? true);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [isParticleModalOpen, setIsParticleModalOpen] = useState(false);
    const [openingImage, setOpeningImage] = useState(invitation?.opening_image || '');
    const [settingsSaving, setSettingsSaving] = useState(false);

    // Media Library / Pustaka Media States & Functions
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerActiveTab, setPickerActiveTab] = useState('album'); // 'album' | 'video' | 'upload'
    const [pickerTarget, setPickerTarget] = useState('cover'); // 'cover' | 'opening'
    const [libraryAssets, setLibraryAssets] = useState(mediaAssets || []);
    const [uploadingFile, setUploadingFile] = useState(false);

    const openMediaPicker = (target) => {
        setPickerTarget(target);
        setPickerActiveTab('album');
        setIsPickerOpen(true);
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        if (!newVideoUrl.trim()) return;

        if (!newVideoUrl.includes('youtube.com') && !newVideoUrl.includes('youtu.be')) {
            showToast('error', 'Masukkan link YouTube yang valid!');
            return;
        }

        setSavingVideoList(true);
        const updatedList = [...videoList, newVideoUrl.trim()];
        try {
            const response = await axios.post(route('theme.video_list.save'), {
                video_list: updatedList
            });
            if (response.data.success) {
                setVideoList(response.data.video_list || updatedList);
                setNewVideoUrl('');
                showToast('success', 'Video berhasil ditambahkan ke album!');
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Gagal menambahkan video.');
        }
        setSavingVideoList(false);
    };

    const handleDeleteVideo = async (e, videoUrlToDelete) => {
        e.stopPropagation();
        if (!confirm('Apakah Anda yakin ingin menghapus video ini dari album?')) return;

        setSavingVideoList(true);
        const updatedList = videoList.filter(url => url !== videoUrlToDelete);
        try {
            const response = await axios.post(route('theme.video_list.save'), {
                video_list: updatedList
            });
            if (response.data.success) {
                setVideoList(response.data.video_list || updatedList);
                showToast('success', 'Video dihapus dari album.');
                
                // Reset selected video urls if they match
                if (coverVideoUrl === videoUrlToDelete) {
                    setCoverVideoUrl('');
                    await axios.post(route('settings.cover.save'), {
                        cover_image: coverImage,
                        cover_video_url: '',
                        cover_title: coverTitle,
                        cover_subtitle: coverSubtitle,
                    });
                }
                if (openingVideoUrl === videoUrlToDelete) {
                    setOpeningVideoUrl('');
                    await axios.post(route('content.opening.save'), {
                        opening_image: openingImage,
                        opening_video_url: '',
                    });
                }
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Gagal menghapus video.');
        }
        setSavingVideoList(false);
    };

    const handleMediaSelect = async (url, type = 'image') => {
        setIsPickerOpen(false);
        if (pickerTarget === 'cover') {
            if (type === 'video') {
                setCoverVideoUrl(url);
                try {
                    await axios.post(route('settings.cover.save'), {
                        cover_image: coverImage,
                        cover_video_url: url,
                        cover_title: coverTitle,
                        cover_subtitle: coverSubtitle,
                    });
                    showToast('success', 'Video Cover berhasil diubah!');
                    setTimeout(() => setPreviewKey(k => k + 1), 800);
                } catch (e) {
                    console.error(e);
                    showToast('error', 'Gagal menyimpan video cover');
                }
            } else {
                setCoverImage(url);
                try {
                    await axios.post(route('settings.cover.save'), {
                        cover_image: url,
                        cover_video_url: coverVideoUrl,
                        cover_title: coverTitle,
                        cover_subtitle: coverSubtitle,
                    });
                    showToast('success', 'Foto Cover berhasil diubah!');
                    setTimeout(() => setPreviewKey(k => k + 1), 800);
                } catch (e) {
                    console.error(e);
                    showToast('error', 'Gagal menyimpan foto cover');
                }
            }
        } else if (pickerTarget === 'opening') {
            if (type === 'video') {
                setOpeningVideoUrl(url);
                try {
                    await axios.post(route('content.opening.save'), {
                        opening_image: openingImage,
                        opening_video_url: url,
                    });
                    showToast('success', 'Video Opening berhasil diubah!');
                    setTimeout(() => setPreviewKey(k => k + 1), 800);
                } catch (e) {
                    console.error(e);
                    showToast('error', 'Gagal menyimpan video opening');
                }
            } else {
                setOpeningImage(url);
                try {
                    await axios.post(route('content.opening.save'), {
                        opening_image: url,
                        opening_video_url: openingVideoUrl,
                    });
                    showToast('success', 'Foto Opening berhasil diubah!');
                    setTimeout(() => setPreviewKey(k => k + 1), 800);
                } catch (e) {
                    console.error(e);
                    showToast('error', 'Gagal menyimpan foto opening');
                }
            }
        }
    };

    const handleLibraryUpload = async (file) => {
        if (!file) return;
        setUploadingFile(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(route('theme.media.upload'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                const newAsset = response.data.asset;
                setLibraryAssets(prev => [newAsset, ...prev]);
                handleMediaSelect('/storage/' + newAsset.file_path);
            }
        } catch (e) {
            console.error(e);
            showToast('error', 'Gagal mengunggah foto');
        }
        setUploadingFile(false);
    };

    const handleLibraryDelete = async (e, assetId) => {
        e.stopPropagation();
        if (!confirm('Apakah Anda yakin ingin menghapus foto ini dari album?')) return;
        try {
            const response = await axios.delete(route('theme.media.destroy', assetId));
            if (response.data.success) {
                setLibraryAssets(prev => prev.filter(a => a.id !== assetId));
                showToast('success', 'Foto dihapus dari album');
            }
        } catch (e) {
            console.error(e);
            showToast('error', 'Gagal menghapus foto');
        }
    };

    const SECTION_EDIT_ROUTES = {
        cover: '/settings/cover',
        opening: '/content/teks-sambutan',
        closing: '/content/teks-sambutan',
        mempelai: '/content/mempelai',
        countdown: '/content/teks-sambutan',
        love_story: '/content/kisah',
        event: '/content/acara',
        gallery: '/content/galeri',
        rsvp: '/settings/tamu',
        wishes: '/content/guestbook',
        bank: '/content/bank',
        livestream: '/content/acara',
    };

    const isPhotoSection = (key) => ['cover', 'opening', 'mempelai', 'gallery', 'love_story'].includes(key);

    const saveSetting = useCallback(async (key, val) => {
        try {
            const res = await axios.post(route('theme.settings.save'), { [key]: val });
            if (res.data.success) {
                showToast('success', 'Tersimpan');
                setTimeout(() => setPreviewKey(k => k + 1), 800);
            } else {
                throw new Error();
            }
        } catch (e) {
            console.error(e);
            showToast('error', 'Gagal menyimpan');
        }
    }, [showToast]);

    const saveCustomDomain = async () => {
        setSettingsSaving(true);
        setCustomDomainError('');
        try {
            const res = await axios.post(route('theme.settings.save'), { custom_domain: customDomain });
            if (res.data.success) {
                showToast('success', 'Domain kustom berhasil disimpan!');
                setTimeout(() => setPreviewKey(k => k + 1), 800);
            } else {
                throw new Error();
            }
        } catch (e) {
            console.error(e);
            if (e.response?.data?.errors?.custom_domain) {
                setCustomDomainError(e.response.data.errors.custom_domain[0]);
            } else {
                showToast('error', 'Gagal menyimpan domain');
            }
        }
        setSettingsSaving(false);
    };

    // Helper CSRF token dari cookie (fresh di Inertia SPA)
    const getCsrfToken = () => {
        const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        if (m) return decodeURIComponent(m[1]);
        return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
    };

    const handleCoverImageUpload = async (file) => {
        if (!file) return;
        setCoverUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'covers');
        try {
            // axios otomatis handle XSRF-TOKEN cookie
            const response = await axios.post(route('upload'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setCoverImage(response.data.url);
        } catch (e) { console.error(e); }
        setCoverUploading(false);
    };

    const saveCover = async () => {
        setCoverSaving(true);
        try {
            await axios.post(route('settings.cover.save'), {
                cover_image: coverImage,
                cover_title: coverTitle,
                cover_subtitle: coverSubtitle,
            });
            setSaveMsg('Cover tersimpan!');
            setTimeout(() => setPreviewKey(k => k + 1), 800);
        } catch (e) {
            console.error(e);
            setSaveMsg('Gagal menyimpan cover');
        }
        setCoverSaving(false);
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const handleOpeningImageUpload = async (file) => {
        if (!file) return;
        setOpeningUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'openings');
        try {
            const response = await axios.post(route('upload'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setOpeningImage(response.data.url);
        } catch (e) { console.error(e); }
        setOpeningUploading(false);
    };

    const saveOpening = async () => {
        setOpeningSaving(true);
        try {
            await axios.post(route('content.opening.save'), {
                opening_image: openingImage,
            });
            setSaveMsg('Opening tersimpan!');
            setTimeout(() => setPreviewKey(k => k + 1), 800);
        } catch (e) {
            console.error(e);
            setSaveMsg('Gagal menyimpan opening');
        }
        setOpeningSaving(false);
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const isLocked = (key) => LOCKED_KEYS.includes(key);

    // real-time layout mode change (bug fixed by Bhaktiaji Ilham)
    const handleLayoutChange = useCallback(async (mode) => {
        setLayoutMode(mode);
        try {
            const res = await axios.post(route('theme.layout'), { layout_mode: mode });
            if (res.status === 200) {
                showToast('success', 'Tersimpan');
                setTimeout(() => setPreviewKey(k => k + 1), 800);
            } else {
                throw new Error('Save failed');
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
            const res = await axios.post(route('theme.layout'), { menu_position: pos });
            if (res.status === 200) {
                showToast('success', 'Tersimpan');
                setTimeout(() => setPreviewKey(k => k + 1), 800);
            } else {
                throw new Error('Save failed');
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
            particle_type: data.type !== undefined ? data.type : particleType,
            particle_count: data.count ?? particleCount,
            particle_speed: data.speed ?? particleSpeed,
        };
        try {
            await axios.post(route('theme.layout'), payload);
        } catch (e) {
            console.error(e);
        }
    }, [particleType, particleCount, particleSpeed]);

    // Change theme
    const handleThemeChange = useCallback(async (themeId) => {
        setSelectedThemeId(themeId);
        try {
            const res = await axios.post(route('theme.change'), { theme_id: themeId });
            if (res.data.sections) {
                setSectionList(res.data.sections);
            }
            setPreviewKey(k => k + 1);
        } catch (e) {
            console.error(e);
            showToast('error', 'Gagal mengganti tema');
        }
    }, [showToast]);

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
            const res = await axios.post(route('theme.sections'), payload);

            if (res.data.success) {
                setSaveMsg('Tersimpan!');
                if (res.data.sections) setSectionList(res.data.sections);
            } else {
                setSaveMsg('Gagal menyimpan');
            }
        } catch (e) {
            console.error('Save error:', e);
            setSaveMsg('Gagal menyimpan');
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

            <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8rem)]">
                {/* Left Panel */}
                <div className="w-full lg:w-1/2 xl:w-[45%] lg:overflow-y-auto pr-2">
                    {/* Segmented Tab Control */}
                    <div className="sticky top-14 lg:top-0 z-10 bg-gray-50/80 backdrop-blur-md pb-2 pt-1">
                        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                            {[
                                { key: 'tampilan', label: 'Tampilan', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                                { key: 'konten', label: 'Urutan', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
                                { key: 'pengaturan', label: 'Pengaturan', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                            ].map(tab => (
                                <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${activeTab === tab.key
                                        ? 'bg-[#E5654B] text-white shadow-md shadow-orange-200 scale-[1.02]'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}>
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ═══ TAB: Tampilan ═══ */}
                    {activeTab === 'tampilan' && (
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4">
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                    </span>
                                    Pilih Tema Undangan
                                </h3>
                                <p className="text-[10px] text-gray-400 mt-1">Silakan pilih desain tema terbaik untuk undangan pernikahan digital Anda.</p>

                                {/* Filter Panel (Compact Single Line Layout) */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm flex flex-col sm:flex-row items-center gap-2 w-full mt-3">
                                    {/* Search Box */}
                                    <div className="relative w-full sm:flex-grow">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Cari tema..."
                                            style={{ paddingLeft: '2.25rem' }}
                                            className="w-full pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all text-gray-800"
                                        />
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
                                        {/* Categories Dropdown */}
                                        <div className="relative flex-1 sm:flex-initial" ref={categoryDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                                className={`w-full px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-between sm:justify-center gap-1.5 select-none h-[32px] ${
                                                    selectedCategories.length > 0
                                                        ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">
                                                        {selectedCategories.length === 0
                                                            ? 'Kategori'
                                                            : `Kat (${selectedCategories.length})`
                                                        }
                                                    </span>
                                                    <span className="sm:hidden">
                                                        {selectedCategories.length === 0
                                                            ? 'Kat'
                                                            : `Kat (${selectedCategories.length})`
                                                        }
                                                    </span>
                                                </div>
                                                <svg className={`w-3 h-3 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {isCategoryDropdownOpen && (
                                                <div className="absolute left-0 sm:right-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                                    <div className="px-2 py-1 border-b border-gray-100 flex items-center justify-between">
                                                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-semibold">Kategori</span>
                                                        {selectedCategories.length > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={clearCategories}
                                                                className="text-[9px] font-bold text-red-500 hover:underline"
                                                            >
                                                                Reset
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-40 overflow-y-auto py-0.5 scrollbar-thin">
                                                        {categories.map((cat) => {
                                                            const isChecked = selectedCategories.includes(cat.name);
                                                            return (
                                                                <label
                                                                    key={cat.name}
                                                                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors select-none text-[10px] font-semibold ${
                                                                        isChecked ? 'bg-[#E5654B]/5 text-[#E5654B]' : 'text-gray-700'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={() => toggleCategory(cat.name)}
                                                                            className="rounded text-[#E5654B] focus:ring-[#E5654B] border-gray-300 w-3 h-3 cursor-pointer accent-[#E5654B]"
                                                                        />
                                                                        <span className="capitalize">{cat.name}</span>
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
                                                                        {cat.count}
                                                                    </span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>


                                        {/* Sort Dropdown */}
                                        <div className="relative flex-shrink-0" ref={sortDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                                title="Urutkan Tema"
                                                className={`px-0 py-0 rounded-xl transition-all duration-200 border flex items-center justify-center select-none h-[32px] w-[32px] ${
                                                    isSortDropdownOpen
                                                        ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                                </svg>
                                            </button>

                                            {isSortDropdownOpen && (
                                                <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                                    <div className="px-2 py-1 border-b border-gray-100 mb-0.5">
                                                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-semibold">Urutkan</span>
                                                    </div>
                                                    {SORT_OPTIONS.map(opt => {
                                                        const isActive = sortThemeKey === opt.key;
                                                        return (
                                                            <button
                                                                key={opt.key}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSortThemeKey(opt.key);
                                                                    setIsSortDropdownOpen(false);
                                                                }}
                                                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[10px] font-bold transition-all ${
                                                                    isActive
                                                                        ? 'bg-[#E5654B]/10 text-[#E5654B]'
                                                                        : 'text-gray-600 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                <span>{opt.label}</span>
                                                                {isActive && (
                                                                    <svg className="w-3.5 h-3.5 text-[#E5654B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Theme Grid */}
                            <div className="grid grid-cols-2 gap-4 pb-4">
                                {(() => {
                                    let base = [...(themes || [])];
                                    if (selectedCategories.length > 0) {
                                        base = base.filter(t => t.category && selectedCategories.includes(t.category.trim().toLowerCase()));
                                    }
                                    if (invitationType) {
                                        base = base.filter(t => {
                                            const types = Array.isArray(t.type) ? t.type : [];
                                            return types.includes(invitationType) || types.includes('general');
                                        });
                                    }
                                    if (searchQuery.trim()) {
                                        base = base.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
                                    }
                                    const filteredThemes = sortThemesFn(base, sortThemeKey);
                                    return filteredThemes?.map(theme => {
                                        const isSelected = selectedThemeId === theme.id;
                                        return (
                                            <div key={theme.id} className="relative group/card">
                                                <div role="button" tabIndex={0}
                                                    onClick={isThemeLocked(theme) ? undefined : () => handleThemeChange(theme.id)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            if (!isThemeLocked(theme)) handleThemeChange(theme.id);
                                                        }
                                                    }}
                                                    className={`w-full group relative rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 focus:outline-none ${
                                                        isSelected 
                                                            ? 'border-[#E5654B] ring-4 ring-orange-100 shadow-xl scale-[1.01] cursor-pointer' 
                                                            : isThemeLocked(theme)
                                                                ? 'border-gray-200 cursor-not-allowed opacity-75'
                                                                : 'border-gray-200 hover:border-[#E5654B]/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                                                    }`}>
                                                    {/* Card Image */}
                                                    <div className={`aspect-[3/4] w-full bg-gray-50 overflow-hidden relative ${isThemeLocked(theme) ? 'opacity-65' : ''}`}>
                                                        <ThemePreviewCard onlyMockup={true} theme={theme} reseller={null} aspectClass="" />
                                                        {/* Category tag */}
                                                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded-full font-medium tracking-wide uppercase z-10">
                                                            {theme.category || 'Premium'}
                                                        </div>
                                                        {/* Selected overlay checkmark */}
                                                        {isSelected && (
                                                            <div className="absolute inset-0 bg-[#E5654B]/10 backdrop-blur-[1px] flex items-center justify-center z-10">
                                                                <div className="bg-[#E5654B] text-white rounded-full p-1.5 shadow-md transform scale-110">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* Premium Lock Overlay for Locked Plan */}
                                                        {isThemeLocked(theme) && !isSelected && (
                                                            <div className="absolute top-2 right-2 bg-amber-400 text-white rounded-full p-1 shadow-md z-10">
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Card Info */}
                                                    <div className="p-2.5 bg-white border-t border-gray-100 flex items-center justify-between">
                                                        <div className={`min-w-0 flex-1 ${isThemeLocked(theme) ? 'opacity-65' : ''}`}>
                                                            <div className="font-bold text-gray-800 text-xs truncate group-hover:text-[#E5654B] transition-colors" title={theme.name}>{theme.name}</div>
                                                            {/* Color Scheme Dots */}
                                                            <div className="flex gap-1 mt-1">
                                                                {theme.color_scheme && Object.entries(theme.color_scheme).slice(0, 4).map(([key, val]) => (
                                                                    <div key={key} className="w-2.5 h-2.5 rounded-full border border-white shadow-sm ring-1 ring-gray-100" style={{ backgroundColor: val }} title={key} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                            {/* Preview Eye Button */}
                                                            <a href={route('demo.theme', theme.slug)} target="_blank" rel="noopener noreferrer"
                                                                className="flex items-center justify-center p-1.5 rounded-full bg-[#E5654B] text-white hover:bg-[#d4523a] hover:scale-105 active:scale-95 transition-all duration-200 shadow-xs cursor-pointer"
                                                                title="Lihat Preview Demo">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                            </a>

                                                            {/* Instagram Like Button */}
                                                            <ThemeLikeButton theme={theme} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}

                    {/* ═══ TAB: Konten ═══ */}
                    {activeTab === 'konten' && (
                        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></span>
                                    Urutan Section
                                </h3>
                                <div className="flex items-center gap-2">
                                    {saveMsg && <span className={`text-xs font-medium ${saveMsg === 'Tersimpan!' ? 'text-[#c24b33]' : 'text-red-500'}`}>{saveMsg}</span>}
                                    <button onClick={saveSections} disabled={saving} className="px-3 py-1.5 bg-[#E5654B] text-white rounded-lg text-xs font-semibold hover:bg-[#c24b33] disabled:opacity-50 transition-all shadow-sm flex items-center gap-1">
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
                                    const layoutLocked = isLocked(section.section_key);
                                    const planLocked = isLockedByPlan(sectionKeyToFeatureSlug[section.section_key]);
                                    const locked = layoutLocked || planLocked;
                                    
                                    return (
                                        <div key={section.id} className={`flex items-center gap-2 p-2.5 rounded-xl text-sm transition-all ${locked ? 'bg-gray-100/80 border border-gray-200' : section.is_visible ? 'bg-white border border-gray-200 hover:border-orange-300' : 'bg-gray-50/50 border border-dashed border-gray-200 opacity-50'}`}>
                                            <div className="flex flex-col gap-0.5 w-4">
                                                {locked ? (
                                                    <svg className={`w-3.5 h-3.5 ${planLocked ? 'text-amber-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                ) : (
                                                    <>
                                                        <button onClick={() => moveSection(index, 'up')} disabled={index === 0 || isLocked(sectionList[index - 1]?.section_key) || isLockedByPlan(sectionKeyToFeatureSlug[sectionList[index - 1]?.section_key])} className="text-gray-400 hover:text-[#c24b33] disabled:opacity-20 transition-colors leading-none"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                                                        <button onClick={() => moveSection(index, 'down')} disabled={index === sectionList.length - 1 || isLocked(sectionList[index + 1]?.section_key) || isLockedByPlan(sectionKeyToFeatureSlug[sectionList[index + 1]?.section_key])} className="text-gray-400 hover:text-[#c24b33] disabled:opacity-20 transition-colors leading-none"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                                                    </>
                                                )}
                                            </div>
                                            <span className={`flex-1 font-medium text-xs flex flex-wrap items-center gap-1.5 ${locked ? 'text-gray-500' : 'text-gray-700'}`}>
                                                <span>{getDynamicLabel(section.section_name)}</span>
                                                {layoutLocked && <span className="text-[9px] text-gray-400 font-normal">(terkunci)</span>}
                                                {planLocked && <span className="text-[9px] text-amber-500 font-bold">(terkunci paket)</span>}
                                                
                                                {section.section_key === 'cover' && (coverVideoUrl ? (
                                                    <span className="inline-flex items-center gap-1 text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100 font-bold">
                                                        <span>🎥 Video</span>
                                                        <button
                                                            type="button"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (confirm('Reset background cover ke slideshow foto default?')) {
                                                                    setCoverVideoUrl('');
                                                                    await axios.post(route('settings.cover.save'), {
                                                                        cover_image: coverImage,
                                                                        cover_video_url: '',
                                                                        cover_title: coverTitle,
                                                                        cover_subtitle: coverSubtitle,
                                                                    });
                                                                    showToast('success', 'Cover direset ke Foto!');
                                                                    setTimeout(() => setPreviewKey(k => k + 1), 800);
                                                                }
                                                            }}
                                                            className="text-red-400 hover:text-red-600 ml-0.5 font-bold text-xs"
                                                            title="Ganti ke Foto"
                                                        >
                                                            &times;
                                                        </button>
                                                    </span>
                                                ) : coverImage ? (
                                                    <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">🖼️ Foto</span>
                                                ) : null)}

                                                {section.section_key === 'opening' && (openingVideoUrl ? (
                                                    <span className="inline-flex items-center gap-1 text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100 font-bold">
                                                        <span>🎥 Video</span>
                                                        <button
                                                            type="button"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (confirm('Reset background opening ke slideshow foto default?')) {
                                                                    setOpeningVideoUrl('');
                                                                    await axios.post(route('content.opening.save'), {
                                                                        opening_image: openingImage,
                                                                        opening_video_url: '',
                                                                    });
                                                                    showToast('success', 'Opening direset ke Foto!');
                                                                    setTimeout(() => setPreviewKey(k => k + 1), 800);
                                                                }
                                                            }}
                                                            className="text-red-400 hover:text-red-600 ml-0.5 font-bold text-xs"
                                                            title="Ganti ke Foto"
                                                        >
                                                            &times;
                                                        </button>
                                                    </span>
                                                ) : openingImage ? (
                                                    <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">🖼️ Foto</span>
                                                ) : null)}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {/* Button 1: Camera button specifically for cover and opening popup media picker */}
                                                {['cover', 'opening'].includes(section.section_key) && (
                                                    <button
                                                        onClick={() => openMediaPicker(section.section_key)}
                                                        type="button"
                                                        className="p-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#E5654B] hover:text-[#c24b33] transition-all duration-200"
                                                        title="Upload/Ubah Foto atau Video"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                                        </svg>
                                                    </button>
                                                )}

                                                {/* Button 2: Pencil/Edit button for all sections that have a route defined in SECTION_EDIT_ROUTES */}
                                                {!planLocked && SECTION_EDIT_ROUTES[section.section_key] && (
                                                    <button
                                                        onClick={() => router.visit(SECTION_EDIT_ROUTES[section.section_key])}
                                                        type="button"
                                                        className="p-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#E5654B] hover:text-[#c24b33] transition-all duration-200"
                                                        title="Edit Teks & Konten"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            {locked ? (
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${planLocked ? 'bg-amber-50 text-amber-600 border border-amber-100 shadow-xs' : 'bg-gray-200 text-gray-500'}`}>
                                                    {planLocked ? 'Locked' : 'Aktif'}
                                                </span>
                                            ) : (
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={!!section.is_visible} onChange={() => toggleSection(section.id, section.section_key)} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#E5654B] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                                </label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ═══ TAB: Pengaturan ═══ */}
                    {activeTab === 'pengaturan' && (
                        <div className="space-y-3">


                            {/* Efek Partikel */}
                            <div className={`bg-white rounded-2xl border border-gray-200 p-4 transition-opacity ${isLockedByPlan('partikel') ? 'opacity-60' : ''}`}>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center relative">
                                            <svg className="w-4 h-4 text-[#c24b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.904L9 9l.813 5.096L15 15l-5.187.904zM19.071 4.929l-.429 2.571-.429-2.571-2.571-.429 2.571-.429.429-2.571.429 2.571 2.571.429-2.571.429z" />
                                            </svg>
                                            {isLockedByPlan('partikel') && (
                                                <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm">
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </span>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                                                Efek Partikel Layar
                                                {isLockedByPlan('partikel') && (
                                                    <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-bold border border-amber-100">
                                                        Locked
                                                    </span>
                                                )}
                                                {!isLockedByPlan('partikel') && (
                                                    particleType ? (
                                                        <span className="text-[9px] bg-orange-100 text-[#c24b33] px-1.5 py-0.5 rounded-full font-medium">
                                                            {PARTICLE_OPTIONS.find(p => p.key === particleType)?.label || particleType}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full font-medium">
                                                            Nonaktif
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">Tambahkan efek partikel melayang yang indah</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isLockedByPlan('partikel')}
                                        onClick={() => setIsParticleModalOpen(true)}
                                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Atur
                                    </button>
                                </div>
                            </div>

                            {/* 2. Kontrol Elemen Desain */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" />
                                        </svg>
                                    </span>
                                    Kontrol Elemen Desain
                                </h3>
                                <div className="divide-y divide-gray-100">
                                    <ToggleSwitch
                                        icon="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                        label="Tampilkan Foto"
                                        desc="Tampilkan foto mempelai di undangan"
                                        checked={showPhotos}
                                        disabled={isLockedByPlan('show_photos')}
                                        onChange={(v) => { setShowPhotos(v); saveSetting('show_photos', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                                        label="Efek Animasi"
                                        desc="Animasi fade-in dan transisi saat scroll"
                                        checked={showAnimations}
                                        disabled={isLockedByPlan('animasi')}
                                        onChange={(v) => { setShowAnimations(v); saveSetting('show_animations', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        label="Nama Tamu di Cover"
                                        desc="Tampilkan nama penerima undangan di halaman cover"
                                        checked={showGuestName}
                                        disabled={isLockedByPlan('guest')}
                                        onChange={(v) => { setShowGuestName(v); saveSetting('show_guest_name', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        label="Countdown Timer"
                                        desc="Hitung mundur menuju hari acara"
                                        checked={showCountdown}
                                        disabled={isLockedByPlan('save_the_date')}
                                        onChange={(v) => { setShowCountdown(v); saveSetting('show_countdown', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                        label="Musik Autoplay"
                                        desc="Putar musik otomatis saat membuka undangan"
                                        checked={musicAutoplay}
                                        disabled={isLockedByPlan('music')}
                                        onChange={(v) => { setMusicAutoplay(v); saveSetting('music_autoplay', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        label="Tombol Auto Scroll"
                                        desc="Tampilkan tombol auto scroll di undangan"
                                        checked={enableAutoScroll}
                                        disabled={isLockedByPlan('auto_scroll')}
                                        onChange={(v) => { setEnableAutoScroll(v); saveSetting('enable_auto_scroll', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        label="Menu Navigasi"
                                        desc="Tampilkan menu navigasi melayang untuk berpindah halaman/section"
                                        checked={menuPosition !== 'none'}
                                        disabled={isLockedByPlan('template')}
                                        onChange={(checked) => handleMenuPositionChange(checked ? 'bottom' : 'none')}
                                    />
                                </div>
                            </div>

                            {/* 3. Privasi & Fitur Utama */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    Privasi & Fitur Utama
                                </h3>
                                <div className="divide-y divide-gray-100">
                                    <ToggleSwitch
                                        icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        label="Privasi Undangan"
                                        desc="Undangan tidak akan diindeks oleh mesin pencari Google"
                                        checked={isPrivate}
                                        disabled={isLockedByPlan('guest')}
                                        onChange={(v) => { setIsPrivate(v); saveSetting('is_private', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        label="QR Code check-in"
                                        desc="Tampilkan QR Code check-in instan untuk tamu"
                                        checked={enableQr}
                                        disabled={isLockedByPlan('qr_code')}
                                        onChange={(v) => { setEnableQr(v); saveSetting('enable_qr', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        label="Formulir RSVP"
                                        desc="Buka fitur konfirmasi kehadiran digital untuk tamu"
                                        checked={enableRsvp}
                                        disabled={isLockedByPlan('rsvp')}
                                        onChange={(v) => { setEnableRsvp(v); saveSetting('enable_rsvp', v); }}
                                    />
                                    <ToggleSwitch
                                        icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        label="Ucapan & Doa"
                                        desc="Aktifkan section ucapan/doa dari para tamu undangan"
                                        checked={enableWishes}
                                        disabled={isLockedByPlan('guestbook')}
                                        onChange={(v) => { setEnableWishes(v); saveSetting('enable_wishes', v); }}
                                    />

                                    <div className="pt-3.5 mt-1 border-t border-gray-100 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5c-.313 1.565-.953 3.051-1.859 4.378m4.548 4.378a17.96 17.96 0 01-3.69-3.688m3.69 3.688L14 17.25m-2.108-8.25a17.9 17.9 0 01-2.902 4.378M8 12.25L5.75 14.5" />
                                                </svg>
                                            </span>
                                            <div>
                                                <div className="text-xs font-semibold text-gray-800">Bahasa Undangan</div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">Pilih bahasa dasar teks undangan</div>
                                            </div>
                                        </div>
                                        <select value={language} onChange={(e) => { setLanguage(e.target.value); saveSetting('language', e.target.value); }}
                                            className="border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-orange-300 focus:border-[#e87058] bg-white outline-none">
                                            <option value="id">Indonesia</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Custom Domain */}
                            <div className={`bg-white rounded-2xl border border-gray-200 p-4 space-y-3 transition-opacity ${isLockedByPlan('template') ? 'opacity-60' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center relative">
                                            <svg className="w-3.5 h-3.5 text-[#c24b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                            {isLockedByPlan('template') && (
                                                <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm">
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </span>
                                        Domain Kustom (Custom Domain)
                                        {isLockedByPlan('template') && (
                                            <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-bold border border-amber-100">
                                                Locked
                                            </span>
                                        )}
                                    </h3>
                                    {!isLockedByPlan('template') && (
                                        <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">Opsional</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed font-normal">Gunakan domain kustom sendiri untuk nama website pernikahan Anda (misal: budi-ratih.wedding)</p>
                                
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        disabled={isLockedByPlan('template')}
                                        value={customDomain}
                                        onChange={e => setCustomDomain(e.target.value)}
                                        className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-300 focus:border-[#e87058] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="nama-pengantin.wedding"
                                    />
                                    <button
                                        type="button"
                                        disabled={settingsSaving || isLockedByPlan('template')}
                                        onClick={saveCustomDomain}
                                        className="px-4 py-2 bg-[#E5654B] hover:bg-[#c24b33] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:cursor-not-allowed"
                                    >
                                        {settingsSaving ? 'Saving...' : 'Simpan'}
                                    </button>
                                </div>
                                {customDomainError && <p className="text-[10px] text-red-500 mt-1 font-medium">{customDomainError}</p>}
                                
                                <div className="pt-1">
                                    <button 
                                        type="button" 
                                        disabled={isLockedByPlan('template')}
                                        onClick={() => setIsTutorialOpen(true)} 
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#c24b33] hover:text-[#b03a24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                        Lihat Tutorial Custom Domain
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
                {/* Right Panel: Phone Preview (Real iframe) */}
                <div className="hidden lg:flex flex-1 items-start justify-center">
                    <div className="sticky top-4">
                        <div className="w-[360px] h-[762px] bg-zinc-950 rounded-[2.5rem] shadow-2xl border-[8px] border-gray-800 overflow-hidden relative">
                            {/* Premium Dynamic Island */}
                            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[90px] h-6 bg-black rounded-full z-20 flex items-center justify-between px-2.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_1px_2px_rgba(0,0,0,0.4)] pointer-events-none border border-black/40">
                                {/* Left camera lens dot */}
                                <div className="w-2.5 h-2.5 rounded-full bg-[#0d0d12] flex items-center justify-center border border-gray-900/30">
                                    <div className="w-1 h-1 rounded-full bg-[#1c1c3c] opacity-60" />
                                </div>
                                {/* Right sensor indicator */}
                                <div className="w-1 h-1 rounded-full bg-[#0d0d12] opacity-40" />
                            </div>
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
                                {menuPosition !== 'none' && <> · Menu <span className="font-semibold text-gray-600">Aktif</span></>}
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

            {/* Modal Pengaturan Partikel (moved to root level to prevent clipping and rendered in a Portal) */}
            {isParticleModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-[scaleIn_0.2s_ease-out] border border-gray-100">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-[#c24b33]">
                                        <Sparkles size={14} />
                                    </span>
                                    Pengaturan Efek Partikel
                                </h3>
                                <p className="text-[10px] text-gray-400 mt-0.5">Pilih efek visual melayang di layar undangan digital</p>
                            </div>
                            <button 
                                onClick={() => setIsParticleModalOpen(false)}
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                                title="Tutup"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Jenis Partikel */}
                            <div>
                                <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wider">Pilih Jenis Partikel</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {PARTICLE_OPTIONS.map(p => {
                                        const isSelected = particleType === p.key;
                                        return (
                                            <button key={p.key} type="button" 
                                                onClick={() => { setParticleType(p.key); handleParticleSave({ type: p.key }); }}
                                                className={`p-2 rounded-xl text-center transition-all border ${isSelected ? 'bg-orange-50 border-[#E5654B] shadow-sm scale-[1.03]' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                                <div className="flex justify-center mb-1">{PIcons[p.key]?.('w-5 h-5')}</div>
                                                <div className="text-[8px] font-bold text-gray-600 leading-none truncate">{p.label}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Jumlah Partikel */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Jumlah Partikel</label>
                                    <span className="text-[10px] font-bold text-[#c24b33] bg-orange-50 px-2 py-0.5 rounded-full">{particleCount} pcs</span>
                                </div>
                                <input type="range" min="5" max="80" step="5" value={particleCount} onChange={(e) => setParticleCount(parseInt(e.target.value))} onMouseUp={(e) => handleParticleSave({ count: parseInt(e.target.value) })} onTouchEnd={(e) => handleParticleSave({ count: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E5654B]" />
                            </div>

                            {/* Kecepatan */}
                            <div className="pt-2">
                                <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wider">Kecepatan Gerakan</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { val: 'slow', label: 'Lambat', icon: <svg className="w-3.5 h-3.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                                        { val: 'normal', label: 'Normal', icon: <svg className="w-3.5 h-3.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> },
                                        { val: 'fast', label: 'Cepat', icon: <svg className="w-3.5 h-3.5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
                                    ].map(s => {
                                        const isSelected = particleSpeed === s.val;
                                        return (
                                            <button key={s.val} type="button" onClick={() => { setParticleSpeed(s.val); handleParticleSave({ speed: s.val }); }}
                                                className={`p-2 rounded-xl text-center transition-all border ${isSelected ? 'bg-orange-50 border-[#E5654B] font-bold' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                                <div className="mb-1">{s.icon}</div>
                                                <div className="text-[10px] text-gray-600 font-semibold">{s.label}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
                            {particleType && (
                                <button type="button" onClick={() => { setParticleType(null); handleParticleSave({ type: null }); }}
                                    className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                                    <X size={13} className="text-red-500" />
                                    <span>Nonaktifkan</span>
                                </button>
                            )}
                            <button 
                                onClick={() => setIsParticleModalOpen(false)}
                                className="flex-1 py-2 px-3 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-xl text-xs font-semibold shadow-md shadow-orange-100 transition-all text-center"
                            >
                                Simpan & Tutup
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Custom Domain Tutorial Modal (rendered correctly here) */}
            <CustomDomainTutorialModal
                isOpen={isTutorialOpen}
                onClose={() => setIsTutorialOpen(false)}
                centralHost={centralHost}
            />

            {/* Modal Pustaka Media / Album Foto Terpusat (rendered at root level using React Portal) */}
            {isPickerOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-[scaleIn_0.2s_ease-out] border border-gray-100 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-[#c24b33]">
                                        <ImageIcon size={14} />
                                    </span>
                                    {pickerTarget === 'cover' ? 'Pilih Foto Cover' : 'Pilih Foto Opening'}
                                </h3>
                                <p className="text-[10px] text-gray-400 mt-0.5">Pilih foto dari album Anda atau unggah foto baru</p>
                            </div>
                            <button 
                                onClick={() => setIsPickerOpen(false)}
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                                title="Tutup"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Tabs Selector */}
                        <div className="px-6 pt-3 border-b border-gray-100 flex gap-4 bg-gray-50/20">
                            <button 
                                onClick={() => setPickerActiveTab('album')}
                                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                                    pickerActiveTab === 'album' 
                                        ? 'border-[#E5654B] text-[#E5654B]' 
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Album Foto Anda
                            </button>
                            <button 
                                onClick={() => setPickerActiveTab('video')}
                                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                                    pickerActiveTab === 'video' 
                                        ? 'border-[#E5654B] text-[#E5654B]' 
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Album Video YouTube
                            </button>
                            <button 
                                onClick={() => setPickerActiveTab('upload')}
                                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                                    pickerActiveTab === 'upload' 
                                        ? 'border-[#E5654B] text-[#E5654B]' 
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Unggah Baru
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {pickerActiveTab === 'album' ? (
                                libraryAssets.length === 0 ? (
                                    <div className="py-12 text-center text-gray-400">
                                        <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-xs">Album Anda masih kosong</p>
                                        <button 
                                            type="button" 
                                            onClick={() => setPickerActiveTab('upload')} 
                                            className="mt-3 text-xs font-semibold text-[#E5654B] hover:underline"
                                        >
                                            Unggah foto pertama Anda
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3">
                                        {libraryAssets.map((asset) => {
                                            const assetUrl = '/storage/' + asset.file_path;
                                            const isActive = pickerTarget === 'cover' ? coverImage === assetUrl : openingImage === assetUrl;
                                            
                                            return (
                                                <div 
                                                    key={asset.id} 
                                                    onClick={() => handleMediaSelect(assetUrl, 'image')}
                                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer group shadow-xs transition-all ${
                                                        isActive ? 'border-[#E5654B] ring-2 ring-orange-100 scale-[0.98]' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <img src={assetUrl} alt={asset.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    
                                                    {/* Active Checkmark overlay */}
                                                    {isActive && (
                                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                            <span className="w-6 h-6 rounded-full bg-[#E5654B] text-white flex items-center justify-center shadow-md font-bold text-xs border border-white">✓</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Hover actions (Trash icon) */}
                                                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => handleLibraryDelete(e, asset.id)}
                                                            className="w-6 h-6 rounded-lg bg-white/95 hover:bg-red-50 text-gray-500 hover:text-red-500 shadow-sm flex items-center justify-center transition-colors"
                                                            title="Hapus foto dari album"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            ) : pickerActiveTab === 'video' ? (
                                <div className="space-y-4">
                                    <form onSubmit={handleAddVideo} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newVideoUrl}
                                            onChange={(e) => setNewVideoUrl(e.target.value)}
                                            placeholder="Tempel link video YouTube Anda di sini..."
                                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E5654B] focus:border-[#E5654B] transition-all bg-gray-50/50"
                                            disabled={savingVideoList}
                                        />
                                        <button
                                            type="submit"
                                            disabled={savingVideoList || !newVideoUrl}
                                            className="px-4 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center min-w-[70px]"
                                        >
                                            {savingVideoList ? '...' : 'Tambah'}
                                        </button>
                                    </form>

                                    {videoList.length === 0 ? (
                                        <div className="py-12 text-center text-gray-400">
                                            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-xs">Album video Anda masih kosong</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {videoList.map((videoUrlItem, idx) => {
                                                let id = '';
                                                if (videoUrlItem.includes('youtube.com/watch?v=')) {
                                                    id = videoUrlItem.split('v=')[1]?.split('&')[0];
                                                } else if (videoUrlItem.includes('youtu.be/')) {
                                                    id = videoUrlItem.split('youtu.be/')[1]?.split('?')[0];
                                                } else if (videoUrlItem.includes('youtube.com/embed/')) {
                                                    id = videoUrlItem.split('embed/')[1]?.split('?')[0];
                                                }
                                                const thumbUrl = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300';
                                                const isActive = pickerTarget === 'cover' ? coverVideoUrl === videoUrlItem : openingVideoUrl === videoUrlItem;

                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleMediaSelect(videoUrlItem, 'video')}
                                                        className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 cursor-pointer group shadow-xs transition-all ${
                                                            isActive ? 'border-[#E5654B] ring-2 ring-orange-100' : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <img src={thumbUrl} alt="YouTube Video Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                        
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                                                                <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                            </div>
                                                        </div>

                                                        {isActive && (
                                                            <div className="absolute top-2 left-2">
                                                                <span className="w-5 h-5 rounded-full bg-[#E5654B] text-white flex items-center justify-center shadow-md font-bold text-[10px] border border-white">✓</span>
                                                            </div>
                                                        )}

                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleDeleteVideo(e, videoUrlItem)}
                                                                className="w-5 h-5 rounded bg-white/95 hover:bg-red-50 text-gray-500 hover:text-red-500 shadow-sm flex items-center justify-center transition-colors"
                                                                title="Hapus video dari album"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 hover:border-[#E5654B] rounded-2xl p-8 text-center transition-colors cursor-pointer bg-gray-50/50 hover:bg-orange-50/20 relative group">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        disabled={uploadingFile}
                                        onChange={(e) => handleLibraryUpload(e.target.files[0])}
                                    />
                                    
                                    {uploadingFile ? (
                                        <div className="py-6 space-y-3">
                                            <div className="w-10 h-10 border-4 border-orange-200 border-t-[#E5654B] rounded-full animate-spin mx-auto" />
                                            <p className="text-xs text-gray-500 font-medium">Mengunggah dan mengoptimalkan gambar...</p>
                                        </div>
                                    ) : (
                                        <div className="py-4 space-y-2">
                                            <div className="w-12 h-12 bg-orange-100 text-[#E5654B] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75Z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-700">Tarik dan lepas gambar Anda di sini</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Atau klik untuk memilih file dari perangkat (Maks. 10MB)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setIsPickerOpen(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-semibold transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Toast notification */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100000] px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium text-white animate-[slideUp_0.3s_ease] ${
                    toast.type === 'success' ? 'bg-[#E5654B]' : 'bg-red-500'
                }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                    {toast.msg}
                </div>
            )}
            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes heartBeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.3); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.3); }
                    70% { transform: scale(1); }
                }
            `}</style>
        </DashboardLayout>
    );
}

function ThemeLikeButton({ theme }) {
    const [liked, setLiked] = useState(() => {
        if (typeof window !== 'undefined') {
            const likedList = JSON.parse(localStorage.getItem('liked_themes') || '[]');
            return likedList.includes(theme.id);
        }
        return false;
    });
    const [likesCount, setLikesCount] = useState((theme.base_likes || 0) + (theme.real_likes || 0));
    const [isAnimate, setIsAnimate] = useState(false);

    const handleLike = async (e) => {
        e.stopPropagation();
        const nextLikedState = !liked;
        setLiked(nextLikedState);
        setIsAnimate(true);
        setTimeout(() => setIsAnimate(false), 500);

        if (typeof window !== 'undefined') {
            const likedList = JSON.parse(localStorage.getItem('liked_themes') || '[]');
            if (nextLikedState) {
                if (!likedList.includes(theme.id)) likedList.push(theme.id);
            } else {
                const idx = likedList.indexOf(theme.id);
                if (idx > -1) likedList.splice(idx, 1);
            }
            localStorage.setItem('liked_themes', JSON.stringify(likedList));
        }

        setLikesCount(prev => nextLikedState ? prev + 1 : Math.max(0, prev - 1));

        try {
            const res = await axios.post(route('theme.like', theme.id), { liked: nextLikedState });
            if (res.data.success) {
                setLikesCount(res.data.likes);
            }
        } catch (e) {
            console.error(e);
            setLiked(liked);
            setLikesCount((theme.base_likes || 0) + (theme.real_likes || 0));
        }
    };

    return (
        <button type="button" onClick={handleLike} className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-colors duration-200" title="Sukai tema ini">
            <svg className={`w-3.5 h-3.5 transition-all duration-300 ${liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-400 hover:text-rose-500'} ${isAnimate ? 'animate-[heartBeat_0.4s_ease-in-out]' : ''}`} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className={`text-[9px] font-bold ${liked ? 'text-rose-500' : 'text-gray-500'}`}>{likesCount}</span>
        </button>
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
                    {current && <SectionCard section={current} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} getDynamicLabel={getDynamicLabel} />}
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
                    {current && <SectionCard section={current} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} getDynamicLabel={getDynamicLabel} />}
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
                <SectionCard key={section.id} section={section} colors={colors} fonts={fonts} isJawa={isJawa} inv={inv} getDynamicLabel={getDynamicLabel} />
            ))}
            <MenuIndicator />
        </div>
    );
}

// ═══ Preview Card per section ═══
function SectionCard({ section, colors, fonts, isJawa, inv, getDynamicLabel }) {
    const key = section.section_key;
    const invitationType = inv?.type || 'wedding';

    const getNicknameHeader = () => {
        const bg = inv?.bride_grooms || [];
        if (bg.length === 0) {
            if (invitationType === 'graduation') return 'Nama Wisudawan';
            if (invitationType === 'birthday') return 'Nama Penerima';
            if (invitationType === 'aqiqah' || invitationType === 'circumcision') return 'Nama Anak';
            return 'Nama Mempelai';
        }
        if (invitationType && ['wedding', 'anniversary'].includes(invitationType)) {
            return `${bg[0]?.nickname || 'Mempelai'} & ${bg[1]?.nickname || 'Mempelai'}`;
        }
        // Single subject
        return bg[0]?.nickname || 'Nama Penerima';
    };

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
                    <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: colors.primary }}>
                        {invitationType === 'wedding' ? 'The Wedding Of' :
                         invitationType === 'graduation' ? 'Happy Graduation' :
                         invitationType === 'birthday' ? 'Happy Birthday' :
                         invitationType === 'aqiqah' ? 'Walimatul Aqiqah' :
                         invitationType === 'circumcision' ? 'Walimatul Khitan' :
                         invitationType === 'anniversary' ? 'Happy Anniversary' : 'Acara Syukuran'}
                    </p>
                    <h2 className="text-xl font-bold" style={{ fontFamily: fonts.script, color: colors.primary }}>
                        {getNicknameHeader()}
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
                    <h3 className="text-[10px] uppercase tracking-widest mb-2" style={{ color: colors.primary }}>{getDynamicLabel('Mempelai')}</h3>
                    <SwirlDiv />
                    {(invitationType && ['wedding', 'anniversary'].includes(invitationType) ? [0, 1] : [0]).map(i => (
                        <div key={i} className="mb-3">
                            <div className="w-14 h-14 mx-auto rounded-full mb-1 overflow-hidden" style={{ border: `2px solid ${colors.primary}` }}>
                                {inv?.bride_grooms?.[i]?.photo
                                    ? <img 
                                        src={inv.bride_grooms[i].photo} 
                                        className="w-full h-full object-cover transition-all" 
                                        alt="" 
                                        style={{
                                            objectPosition: `${Number(inv.bride_grooms[i].photo_position_x ?? 50)}% ${Number(inv.bride_grooms[i].photo_position_y ?? 50)}%`,
                                            transform: `scale(${Number(inv.bride_grooms[i].photo_zoom ?? 1.0)}) translate(${(50 - Number(inv.bride_grooms[i].photo_position_x ?? 50)) * (1 - 1 / Number(inv.bride_grooms[i].photo_zoom ?? 1.0))}%, ${(50 - Number(inv.bride_grooms[i].photo_position_y ?? 50)) * (1 - 1 / Number(inv.bride_grooms[i].photo_zoom ?? 1.0))}%)`,
                                            transformOrigin: 'center',
                                        }}
                                    />
                                    : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                                        <svg className="w-6 h-6" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                }
                            </div>
                            <p className="text-base font-bold" style={{ fontFamily: fonts.script, color: colors.primary }}>
                                {inv?.bride_grooms?.[i]?.full_name || (
                                    invitationType === 'graduation' ? 'Nama Wisudawan' :
                                    invitationType === 'birthday' ? 'Nama Penerima' :
                                    invitationType === 'aqiqah' ? 'Nama Anak' :
                                    invitationType === 'circumcision' ? 'Nama Anak' :
                                    invitationType === 'anniversary' ? (i === 0 ? 'Pasangan Wanita' : 'Pasangan Pria') :
                                    (i === 0 ? 'Mempelai Wanita' : 'Mempelai Pria')
                                )}
                            </p>
                            <p className="text-[9px] opacity-50 mt-0.5">
                                {inv?.bride_grooms?.[i]?.father_name
                                    ? `Putra/Putri dari Bpk. ${inv.bride_grooms[i].father_name} & Ibu ${inv.bride_grooms[i].mother_name}`
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
                        {getNicknameHeader()}
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
                <p className="text-[10px] uppercase tracking-widest" style={{ color: colors.primary }}>{getDynamicLabel(section.section_name)}</p>
                <SwirlDiv />
                <p className="text-[9px] opacity-40 mt-2">Preview section</p>
            </div>
        </div>
    );
}
