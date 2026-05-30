import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Trash2, Save, Settings, Check, Sparkles, Loader2, Info, Link as LinkIcon, Maximize2, Minimize2, Smile, RotateCcw } from 'lucide-react';

export default function Galeri({ 
    galleries: initialGalleries, 
    maxGalleries, 
    mediaAssets = [], 
    invitation: initialInvitation, 
    brideGrooms: initialBrideGrooms,
    can_use_video_album = false
}) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('photos');
    
    // Sync props to local states for immediate fluid UI updates
    const [localInvitation, setLocalInvitation] = useState(initialInvitation || {});
    const [localBrideGrooms, setLocalBrideGrooms] = useState(initialBrideGrooms || []);
    const [localGalleries, setLocalGalleries] = useState(initialGalleries || []);

    // YouTube Video settings states
    const [videoUrl, setVideoUrl] = useState(initialInvitation?.video_url || '');
    const [coverVideoUrl, setCoverVideoUrl] = useState(initialInvitation?.cover_video_url || '');
    const [openingVideoUrl, setOpeningVideoUrl] = useState(initialInvitation?.opening_video_url || '');
    const [videoPlayback, setVideoPlayback] = useState(initialInvitation?.video_playback || 'gallery');
    const [savingVideo, setSavingVideo] = useState(false);
    
    // Unified YouTube Video List states
    const [videoList, setVideoList] = useState(initialInvitation?.video_list || []);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [savingVideoList, setSavingVideoList] = useState(false);
    
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    
    // Side-over drawer state
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [activeCropTarget, setActiveCropTarget] = useState(null); // 'cover', 'opening', 'groom', 'bride'
    
    // Bulk select prewedding gallery mode states
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkSelectedIds, setBulkSelectedIds] = useState([]);
    const [savingBulk, setSavingBulk] = useState(false);
    const [togglingAssetId, setTogglingAssetId] = useState(null);

    // Freeze body scroll when setting modal is open
    useEffect(() => {
        if (selectedAsset) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selectedAsset]);

    // Focal point adjustment states
    const [posX, setPosX] = useState(50);
    const [posY, setPosY] = useState(50);
    const [zoom, setZoom] = useState(1.0);
    const [savingPosition, setSavingPosition] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 50, posY: 50 });
    const previewContainerRef = useRef(null);

    // Sync state when props change
    useEffect(() => {
        if (initialInvitation) {
            setLocalInvitation(initialInvitation);
            setVideoUrl(initialInvitation.video_url || '');
            setVideoPlayback(initialInvitation.video_playback || 'gallery');
            setVideoList(initialInvitation.video_list || []);
            setCoverVideoUrl(initialInvitation.cover_video_url || '');
            setOpeningVideoUrl(initialInvitation.opening_video_url || '');
        }
        if (initialBrideGrooms) setLocalBrideGrooms(initialBrideGrooms);
        if (initialGalleries) setLocalGalleries(initialGalleries);
    }, [initialInvitation, initialBrideGrooms, initialGalleries]);

    const handleAddVideo = async (e) => {
        e.preventDefault();
        if (!newVideoUrl.trim()) return;

        if (!newVideoUrl.includes('youtube.com') && !newVideoUrl.includes('youtu.be')) {
            alert('Masukkan link YouTube yang valid!');
            return;
        }

        setSavingVideoList(true);
        const updatedList = [...videoList, newVideoUrl.trim()];
        try {
            const response = await axios.post(route('theme.video_list.save'), {
                video_list: updatedList
            });
            if (response.data.success) {
                const list = response.data.video_list || updatedList;
                setVideoList(list);
                setNewVideoUrl('');
                alert('Video berhasil ditambahkan ke album!');
                
                // Set as primary video automatically if none was set
                if (!videoUrl) {
                    await handleSelectPrimaryVideo(newVideoUrl.trim(), list);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Gagal menambahkan video.');
        } finally {
            setSavingVideoList(false);
        }
    };

    const handleDeleteVideo = async (e, videoUrlToDelete) => {
        e.stopPropagation();
        if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return;

        setSavingVideoList(true);
        const updatedList = videoList.filter(url => url !== videoUrlToDelete);
        try {
            const response = await axios.post(route('theme.video_list.save'), {
                video_list: updatedList
            });
            if (response.data.success) {
                const list = response.data.video_list || updatedList;
                setVideoList(list);
                
                // If primary video was deleted, set next available or empty
                if (videoUrl === videoUrlToDelete) {
                    const newPrimary = list.length > 0 ? list[0] : '';
                    await handleSelectPrimaryVideo(newPrimary, list);
                } else {
                    // Update local invitation state to reflect list
                    setLocalInvitation(prev => ({
                        ...prev,
                        video_list: list
                    }));
                }
            }
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus video.');
        } finally {
            setSavingVideoList(false);
        }
    };

    const handleSelectPrimaryVideo = async (url, currentList = videoList) => {
        setSavingVideo(true);
        try {
            const response = await axios.post(route('content.galeri.video'), {
                video_url: url,
                video_playback: videoPlayback
            });
            if (response.data.success) {
                setVideoUrl(url);
                setLocalInvitation(prev => ({
                    ...prev,
                    video_url: url,
                    video_list: currentList
                }));
                alert('Video utama berhasil diperbarui!');
            }
        } catch (error) {
            console.error(error);
            alert('Gagal mengubah video utama.');
        } finally {
            setSavingVideo(false);
        }
    };

    const handleToggleCoverVideo = async (url, isActive) => {
        try {
            await axios.post(route('settings.cover.save'), {
                cover_video_url: isActive ? '' : url,
                cover_image: isActive ? localInvitation.cover_image : '',
            });
            setCoverVideoUrl(isActive ? '' : url);
            setLocalInvitation(prev => ({
                ...prev,
                cover_video_url: isActive ? '' : url,
                cover_image: isActive ? prev.cover_image : ''
            }));
            alert(isActive ? 'Video cover dinonaktifkan!' : 'Video cover berhasil diaktifkan!');
        } catch (error) {
            console.error(error);
            alert('Gagal mengubah video cover.');
        }
    };

    const handleToggleOpeningVideo = async (url, isActive) => {
        try {
            await axios.post(route('content.opening.save'), {
                opening_video_url: isActive ? '' : url,
                opening_image: isActive ? localInvitation.opening_image : '',
            });
            setOpeningVideoUrl(isActive ? '' : url);
            setLocalInvitation(prev => ({
                ...prev,
                opening_video_url: isActive ? '' : url,
                opening_image: isActive ? prev.opening_image : ''
            }));
            alert(isActive ? 'Video opening dinonaktifkan!' : 'Video opening berhasil diaktifkan!');
        } catch (error) {
            console.error(error);
            alert('Gagal mengubah video opening.');
        }
    };

    const handleSaveVideoSettings = async (e) => {
        e.preventDefault();
        setSavingVideo(true);
        try {
            const response = await axios.post(route('content.galeri.video'), {
                video_url: videoUrl,
                video_playback: videoPlayback
            });
            if (response.data.success) {
                alert('Pengaturan gaya pemutaran video berhasil disimpan!');
                setLocalInvitation(prev => ({
                    ...prev,
                    video_playback: videoPlayback
                }));
            }
        } catch (error) {
            console.error('Save video settings error:', error);
            const msg = error.response?.data?.message || 'Gagal menyimpan pengaturan video.';
            alert(msg);
        } finally {
            setSavingVideo(false);
        }
    };

    // Update uploader remaining count
    const remaining = maxGalleries - (localGalleries?.length || 0);

    // Check where a photo is active
    const getPhotoUsages = (path) => {
        const usages = [];
        const coverImages = localInvitation.cover_image ? localInvitation.cover_image.split(',').filter(Boolean) : [];
        const openingImages = localInvitation.opening_image ? localInvitation.opening_image.split(',').filter(Boolean) : [];

        if (coverImages.includes(path)) usages.push({ type: 'cover', label: 'Sampul', color: 'bg-orange-500 text-white' });
        if (openingImages.includes(path)) usages.push({ type: 'opening', label: 'Pembuka', color: 'bg-blue-500 text-white' });
        
        const groom = localBrideGrooms.find(bg => bg.gender === 'pria');
        const bride = localBrideGrooms.find(bg => bg.gender === 'wanita');
        
        if (groom && groom.photo === path) usages.push({ type: 'groom', label: 'Mempelai Pria', color: 'bg-emerald-600 text-white' });
        if (bride && bride.photo === path) usages.push({ type: 'bride', label: 'Mempelai Wanita', color: 'bg-rose-500 text-white' });
        
        const inGallery = localGalleries.some(g => g.image_url === path);
        if (inGallery) usages.push({ type: 'gallery', label: 'Galeri', color: 'bg-teal-500 text-white' });
        
        return usages;
    };

    // Bulk manage mode helpers
    const startBulkMode = () => {
        const initialIds = mediaAssets
            .filter(asset => {
                const url = '/storage/' + asset.file_path;
                return localGalleries.some(g => g.image_url === url);
            })
            .map(asset => asset.id);
        setBulkSelectedIds(initialIds);
        setBulkMode(true);
    };

    const toggleBulkSelect = (id) => {
        if (bulkSelectedIds.includes(id)) {
            setBulkSelectedIds(prev => prev.filter(x => x !== id));
        } else {
            if (bulkSelectedIds.length >= maxGalleries) {
                alert(`Oops! Batas kuota galeri Anda adalah ${maxGalleries} foto. Kurangi pilihan lain terlebih dahulu.`);
                return;
            }
            setBulkSelectedIds(prev => [...prev, id]);
        }
    };

    const handleSaveBulk = async () => {
        setSavingBulk(true);
        try {
            const response = await axios.post(route('theme.media.sync-gallery'), {
                asset_ids: bulkSelectedIds
            });
            if (response.data.success) {
                setLocalGalleries(response.data.galleries);
                setBulkMode(false);
                alert('Galeri prewedding berhasil diperbarui secara masal!');
            }
        } catch (e) {
            console.error('Bulk gallery save error:', e);
            alert('Gagal menyinkronkan galeri secara masal.');
        } finally {
            setSavingBulk(false);
        }
    };

    // Triggered when clicking a photo card to open Slide-Over Drawer
    const handleSelectAsset = (asset) => {
        const url = '/storage/' .concat(asset.file_path);
        setSelectedAsset(asset);
        
        // Find which usage targets are currently active for this photo
        const usages = getPhotoUsages(url);
        const coordinateUsages = usages.filter(u => ['cover', 'opening', 'groom', 'bride'].includes(u.type));
        
        // Set the active crop target to the first active usage, or default to first available
        if (coordinateUsages.length > 0) {
            setActiveCropTarget(coordinateUsages[0].type);
        } else {
            setActiveCropTarget('cover');
        }
    };

    // Load active crop target coordinates into sliders
    useEffect(() => {
        if (!selectedAsset) return;
        const url = '/storage/' .concat(selectedAsset.file_path);
        
        if (activeCropTarget === 'cover') {
            setPosX(localInvitation.cover_position_x ?? 50);
            setPosY(localInvitation.cover_position_y ?? 50);
            setZoom(Number(localInvitation.cover_zoom ?? 1.0));
        } else if (activeCropTarget === 'opening') {
            setPosX(localInvitation.opening_position_x ?? 50);
            setPosY(localInvitation.opening_position_y ?? 50);
            setZoom(Number(localInvitation.opening_zoom ?? 1.0));
        } else if (activeCropTarget === 'groom') {
            const groom = localBrideGrooms.find(bg => bg.gender === 'pria');
            setPosX(groom?.photo_position_x ?? 50);
            setPosY(groom?.photo_position_y ?? 50);
            setZoom(Number(groom?.photo_zoom ?? 1.0));
        } else if (activeCropTarget === 'bride') {
            const bride = localBrideGrooms.find(bg => bg.gender === 'wanita');
            setPosX(bride?.photo_position_x ?? 50);
            setPosY(bride?.photo_position_y ?? 50);
            setZoom(Number(bride?.photo_zoom ?? 1.0));
        }
    }, [selectedAsset, activeCropTarget, localInvitation, localBrideGrooms]);

    // Handle Drag & Drop Uploader
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    const handleUpload = async (files) => {
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files);

        setUploading(true);
        let successCount = 0;

        for (let i = 0; i < fileArray.length; i++) {
            setUploadStatus(`Mengunggah ${i + 1} dari ${fileArray.length} foto...`);
            const file = fileArray[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                await axios.post(route('theme.media.upload'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                successCount++;
            } catch (e) {
                console.error(`Gagal mengunggah file ke-${i + 1}:`, e);
                const errMsg = e.response?.data?.error || 'Gagal mengunggah beberapa berkas.';
                alert(errMsg);
            }
        }

        setUploadStatus('Sinkronisasi album...');
        router.reload({
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                setUploadStatus('');
                if (successCount > 0) {
                    alert(`${successCount} foto berhasil ditambahkan ke Album.`);
                }
            }
        });
    };

    // Toggle photo usage status (Cover, Opening, Groom, Bride, Gallery)
    const handleToggleUsage = async (target, currentValue) => {
        if (!selectedAsset) return;
        
        const newValue = !currentValue;
        
        // Quota safety validation for Gallery
        if (target === 'gallery' && newValue && remaining <= 0) {
            alert(`Oops! Batas kuota galeri Anda adalah ${maxGalleries} foto. Hapus foto galeri lain terlebih dahulu.`);
            return;
        }

        try {
            const response = await axios.post(route('theme.media.toggle-usage'), {
                asset_id: selectedAsset.id,
                target: target,
                active: newValue
            });

            if (response.data.success) {
                // Update local states immediately for instant UI feedback
                if (response.data.invitation) {
                    setLocalInvitation(prev => ({ ...prev, ...response.data.invitation }));
                }
                if (response.data.brideGrooms) {
                    setLocalBrideGrooms(response.data.brideGrooms);
                }
                if (response.data.galleries) {
                    setLocalGalleries(response.data.galleries);
                }

                // If we activated a coordinate-based usage, focus on it for cropping
                if (newValue && ['cover', 'opening', 'groom', 'bride'].includes(target)) {
                    setActiveCropTarget(target);
                }
            }
        } catch (e) {
            console.error('Usage toggle error:', e);
            const msg = e.response?.data?.error || 'Gagal merubah status penggunaan foto.';
            alert(msg);
        }
    };

    // Quick-toggle prewedding gallery checkbox on grid card
    const handleQuickToggleGallery = async (asset, currentValue) => {
        const newValue = !currentValue;
        
        // Quota safety validation
        if (newValue && remaining <= 0) {
            alert(`Oops! Batas kuota galeri Anda adalah ${maxGalleries} foto. Hapus foto galeri lain terlebih dahulu.`);
            return;
        }

        setTogglingAssetId(asset.id);
        try {
            const response = await axios.post(route('theme.media.toggle-usage'), {
                asset_id: asset.id,
                target: 'gallery',
                active: newValue
            });

            if (response.data.success) {
                if (response.data.galleries) {
                    setLocalGalleries(response.data.galleries);
                }
            }
        } catch (e) {
            console.error('Quick toggle error:', e);
            const msg = e.response?.data?.error || 'Gagal merubah status galeri.';
            alert(msg);
        } finally {
            setTogglingAssetId(null);
        }
    };

    // Save visual crop / zoom values to server database
    const handleSavePosition = async () => {
        if (!selectedAsset || !activeCropTarget) return;

        setSavingPosition(true);
        try {
            const response = await axios.post(route('theme.media.save-position'), {
                target: activeCropTarget,
                position_x: posX,
                position_y: posY,
                zoom: zoom
            });

            if (response.data.success) {
                if (response.data.invitation) {
                    setLocalInvitation(prev => ({ ...prev, ...response.data.invitation }));
                }
                if (response.data.brideGrooms) {
                    setLocalBrideGrooms(response.data.brideGrooms);
                }
                alert('Fokus visual & perbesaran berhasil disimpan!');
            }
        } catch (e) {
            console.error('Position save error:', e);
            alert('Gagal menyimpan posisi foto.');
        } finally {
            setSavingPosition(false);
        }
    };

    // Drag-to-pan implementation inside visual preview canvas
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY, posX: posX, posY: posY });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        
        // Multiplier controls drag speed sensitivity inside the container
        let newX = dragStart.posX - Math.round(dx / 2.5);
        let newY = dragStart.posY - Math.round(dy / 2.5);
        
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));
        
        setPosX(newX);
        setPosY(newY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    // Handle Asset Deletion
    const handleDeleteAsset = async () => {
        if (!selectedAsset) return;
        if (!confirm('Apakah Anda yakin ingin menghapus foto ini dari album? Tindakan ini akan menghapusnya dari semua posisi undangan Anda.')) return;

        try {
            const response = await axios.delete(route('theme.media.destroy', selectedAsset.id));
            if (response.data.success) {
                setSelectedAsset(null);
                // Force Inertia reload to sync everything cleanly
                router.reload({
                    preserveScroll: true,
                    onFinish: () => {
                        alert('Foto berhasil dihapus secara permanen.');
                    }
                });
            }
        } catch (e) {
            console.error('Delete asset error:', e);
            alert('Gagal menghapus foto.');
        }
    };


    return (
        <DashboardLayout title="Pustaka Media & Album Foto Terpadu">
            <Head title="Pustaka Media Terpadu" />
            <div className="max-w-5xl mx-auto space-y-6 px-2 sm:px-4">
                
                {/* Global Success Notification */}
                {flash?.success && (
                    <div className="bg-orange-50 border border-orange-200 text-[#b03a24] px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in shadow-sm">
                        <svg className="w-4 h-4 text-[#E5654B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg> 
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Modern Unified Media Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 bg-[#E5654B]/10 text-[#b03a24] px-3.5 py-1 rounded-full text-xs font-semibold">
                            <Sparkles size={12} className="text-[#E5654B]" />
                            <span>Sistem Foto Terpadu V2</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Pustaka Media & Album Foto</h2>
                        <p className="text-xs text-gray-500 max-w-xl">
                            Upload seluruh foto Anda sekali saja di sini. Anda bisa menghubungkan foto yang sama ke <strong>Sampul, Pembuka, Foto Mempelai,</strong> maupun <strong>Galeri</strong> sekaligus secara dinamis!
                        </p>
                    </div>
                    
                    {/* Active Usages Summary Badge Widget */}
                    <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-4 flex gap-4 text-center shadow-sm">
                        <div className="px-2">
                            <div className="text-xs text-gray-400 font-medium">Isi Galeri</div>
                            <div className="text-lg font-bold text-gray-700">{localGalleries?.length || 0}<span className="text-xs text-gray-400 font-normal">/{maxGalleries}</span></div>
                        </div>
                        <div className="w-px bg-gray-200 self-stretch"></div>
                        <div className="px-2">
                            <div className="text-xs text-gray-400 font-medium">Total Album</div>
                            <div className="text-lg font-bold text-orange-600">{mediaAssets?.length || 0}</div>
                        </div>
                    </div>
                </div>

                {/* Modern Segmented Navigation Tabs */}
                <div className="flex justify-center md:justify-start">
                    <div className="bg-gray-100 border border-gray-200/50 rounded-2xl p-1.5 flex gap-1 shadow-xs w-full max-w-sm">
                        <button
                            type="button"
                            onClick={() => setActiveTab('photos')}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                activeTab === 'photos'
                                    ? 'bg-[#E5654B] text-white shadow-xs'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Galeri Foto</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('videos')}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                activeTab === 'videos'
                                    ? 'bg-[#E5654B] text-white shadow-xs'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v8a2 2 0 00-2 2z" />
                            </svg>
                            <span>Album Video</span>
                        </button>
                    </div>
                </div>


                {activeTab === 'photos' && (
                    <>
                        {/* Upload Area */}
                        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-gray-700">Unggah Foto Baru ke Album</h4>
                                <span className="text-xs text-gray-400">Unggah sekaligus banyak didukung (multi-upload)</span>
                            </div>
                            <div className="space-y-3">
                                <label className="block cursor-pointer">
                                    <div 
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                                            isDragOver 
                                                ? 'border-[#E5654B] bg-orange-50/50 scale-[1.01]' 
                                                : 'border-gray-200 hover:border-[#e87058] hover:bg-orange-50/10'
                                        }`}
                                    >
                                        {uploading ? (
                                            <div className="text-[#E5654B] font-semibold flex flex-col items-center justify-center gap-2 py-4">
                                                <svg className="w-6 h-6 animate-spin text-[#E5654B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span className="text-sm font-medium">{uploadStatus || 'Sedang memproses...'}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-4xl mb-2 text-gray-300 flex justify-center">
                                                    <svg className="w-12 h-12 text-[#E5654B]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="text-sm font-semibold text-gray-600">Pilih atau Drag & Drop foto di sini</div>
                                                <div className="text-xs text-gray-400 mt-1">Mendukung format JPG, PNG, WEBP • Maks 10MB per file</div>
                                                <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-[10px] font-medium mt-3">
                                                    <Info size={11} className="text-orange-600 flex-shrink-0" />
                                                    <span>Baru diunggah otomatis diaktifkan di Galeri jika kuota masih ada</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" multiple
                                        onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'videos' && (
                    <>
                        {/* YouTube Video Settings Card */}
                        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.502 9.387.502 9.387.502s7.517 0 9.387-.502a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">Video Prewedding YouTube</h4>
                                    <p className="text-xs text-gray-400">Hubungkan video YouTube Anda sebagai latar belakang undangan atau di dalam galeri.</p>
                                </div>
                            </div>

                            {!can_use_video_album ? (
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50/40 via-red-50/20 to-amber-50/30 border border-orange-100 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                                    
                                    <div className="w-12 h-12 rounded-2xl bg-orange-100/80 flex items-center justify-center text-[#E5654B] animate-pulse">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    
                                    <div className="space-y-1.5 max-w-md">
                                        <h5 className="text-sm font-bold text-gray-800">Fitur Album Video YouTube Dikunci</h5>
                                        <p className="text-xs text-gray-500 leading-relaxed font-sans">
                                            Hubungkan video YouTube indah sebagai album visual prewedding di tema Anda (Netflix, TikTok, Spotify, Instagram, YouTube dll) secara tak terbatas. Upgrade paket Anda sekarang untuk membuka fitur premium ini!
                                        </p>
                                    </div>

                                    <a
                                        href="/pricing"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E5654B] to-[#c94f3a] text-white rounded-2xl text-xs font-bold transition-all hover:shadow-md hover:shadow-orange-500/20 active:scale-[0.98]"
                                    >
                                        <Sparkles size={14} />
                                        <span>Upgrade Sekarang</span>
                                    </a>
                                </div>
                            ) : (
                                <form onSubmit={handleSaveVideoSettings} className="space-y-5">
                                    <div className="space-y-4">
                                        {/* URL Field to add video */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold text-gray-700 font-sans">Tambah Video YouTube ke Album</label>
                                            <div className="flex gap-2 relative rounded-2xl">
                                                <input
                                                    type="text"
                                                    value={newVideoUrl}
                                                    onChange={(e) => setNewVideoUrl(e.target.value)}
                                                    placeholder="Contoh: https://www.youtube.com/watch?v=ncaok-mSlro atau https://youtu.be/..."
                                                    className="block flex-1 pl-4 pr-4 py-3 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E5654B] focus:border-[#E5654B] transition-all bg-gray-50/30"
                                                    disabled={savingVideoList}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddVideo}
                                                    disabled={savingVideoList || !newVideoUrl}
                                                    className="px-5 py-2.5 bg-[#E5654B] hover:bg-[#b03a24] text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-orange-500/10 active:scale-[0.98] min-w-[80px] justify-center cursor-pointer"
                                                >
                                                    {savingVideoList ? '...' : 'Tambah'}
                                                </button>
                                            </div>
                                        </div>                                        {/* List of Videos in Album */}
                                        {videoList.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-700 font-sans">Daftar Album Video YouTube Anda</label>
                                                <p className="text-[10px] text-gray-400 -mt-1 font-sans">Pilih peran dan penempatan fungsional untuk masing-masing video YouTube di bawah ini.</p>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                        const isPrimary = videoUrl === videoUrlItem;
                                                        const isCoverVideo = coverVideoUrl === videoUrlItem;
                                                        const isOpeningVideo = openingVideoUrl === videoUrlItem;

                                                        return (
                                                            <div key={idx} className="flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-sm transition-all">
                                                                <div
                                                                    className="relative aspect-[16/10] group transition-all"
                                                                >
                                                                    <img src={thumbUrl} alt="YouTube Video Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                                    
                                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                                                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                                                                            <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                                        </div>
                                                                    </div>

                                                                    {/* Trash/Delete Button */}
                                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
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
                                                                
                                                                {/* Functional Placement Switcher - Direct Sync! */}
                                                                <div className="p-3 bg-gray-50 border-t border-gray-100 space-y-2 flex-grow flex flex-col justify-between">
                                                                    <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Hubungkan Video Sebagai:</p>
                                                                    <div className="grid grid-cols-3 gap-1">
                                                                        {/* Primary Video Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleSelectPrimaryVideo(videoUrlItem)}
                                                                            className={`py-1.5 rounded-xl text-[9px] font-extrabold uppercase transition-all tracking-wide ${
                                                                                isPrimary 
                                                                                    ? 'bg-orange-500 text-white shadow-xs' 
                                                                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'
                                                                            }`}
                                                                        >
                                                                            {isPrimary ? '✓ Utama' : 'Utama'}
                                                                        </button>

                                                                        {/* Cover Video Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleToggleCoverVideo(videoUrlItem, isCoverVideo)}
                                                                            className={`py-1.5 rounded-xl text-[9px] font-extrabold uppercase transition-all tracking-wide ${
                                                                                isCoverVideo 
                                                                                    ? 'bg-orange-500 text-white shadow-xs' 
                                                                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'
                                                                            }`}
                                                                        >
                                                                            {isCoverVideo ? '✓ Sampul' : 'Sampul'}
                                                                        </button>

                                                                        {/* Opening Video Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleToggleOpeningVideo(videoUrlItem, isOpeningVideo)}
                                                                            className={`py-1.5 rounded-xl text-[9px] font-extrabold uppercase transition-all tracking-wide ${
                                                                                isOpeningVideo 
                                                                                    ? 'bg-orange-500 text-white shadow-xs' 
                                                                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'
                                                                            }`}
                                                                        >
                                                                            {isOpeningVideo ? '✓ Pembuka' : 'Pembuka'}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}  )}
                                    </div>

                                    {/* Playback Mode */}
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-700">Gaya & Penempatan Pemutaran Video</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {/* Mode 1: Background */}
                                            <div
                                                onClick={() => setVideoPlayback('background')}
                                                className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between h-28 ${
                                                    videoPlayback === 'background'
                                                        ? 'border-[#E5654B] bg-orange-50/30 shadow-sm ring-1 ring-[#E5654B]/20'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                        videoPlayback === 'background' ? 'bg-[#E5654B] text-white' : 'bg-gray-100 text-gray-400'
                                                    }`}>1</span>
                                                    <svg className={`w-5 h-5 ${videoPlayback === 'background' ? 'text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-800">Latar Belakang Saja (Muted)</div>
                                                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Video diputar otomatis senyap di latar belakang pembuka.</p>
                                                </div>
                                            </div>

                                            {/* Mode 2: Gallery */}
                                            <div
                                                onClick={() => setVideoPlayback('gallery')}
                                                className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between h-28 ${
                                                    videoPlayback === 'gallery'
                                                        ? 'border-[#E5654B] bg-orange-50/30 shadow-sm ring-1 ring-[#E5654B]/20'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                        videoPlayback === 'gallery' ? 'bg-[#E5654B] text-white' : 'bg-gray-100 text-gray-400'
                                                    }`}>2</span>
                                                    <svg className={`w-5 h-5 ${videoPlayback === 'gallery' ? 'text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-800">Di Dalam Galeri Saja (Suara)</div>
                                                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Video muncul di galeri dengan tombol putar bersuara.</p>
                                                </div>
                                            </div>

                                            {/* Mode 3: Both */}
                                            <div
                                                onClick={() => setVideoPlayback('both')}
                                                className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between h-28 ${
                                                    videoPlayback === 'both'
                                                        ? 'border-[#E5654B] bg-orange-50/30 shadow-sm ring-1 ring-[#E5654B]/20'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                        videoPlayback === 'both' ? 'bg-[#E5654B] text-white' : 'bg-gray-100 text-gray-400'
                                                    }`}>3</span>
                                                    <svg className={`w-5 h-5 ${videoPlayback === 'both' ? 'text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-800">Keduanya (Sangat Mewah)</div>
                                                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Latar belakang senyap + pemutar di galeri bersuara.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end border-t border-gray-100 pt-4">
                                        <button
                                            type="submit"
                                            disabled={savingVideo}
                                            className="px-5 py-2.5 bg-[#E5654B] hover:bg-[#b03a24] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-orange-500/10 active:scale-[0.98]"
                                        >
                                            {savingVideo ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                                    <span>Menyimpan...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-3.5 h-3.5" />
                                                    <span>Simpan Pengaturan Video</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </>
                )}



                {activeTab === 'photos' && (
                    <>
                        {/* Unified Photo Grid */}
                        <div className="space-y-3">
                    <div className="flex items-center justify-between bg-orange-50/10 border border-orange-100/50 p-4 rounded-2xl">
                        <div>
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-950">
                                {bulkMode ? 'Mode Pilihan Masal Galeri Prewedding' : 'Semua Foto Album'}
                            </h3>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                                {bulkMode 
                                    ? `Ketuk foto untuk menceklis. Batas kuota: ${bulkSelectedIds.length}/${maxGalleries} foto terpilih.` 
                                    : 'Ketuk pada foto untuk mengatur reposisi visual atau pemakaian cover, mempelai, dll.'}
                            </p>
                        </div>
                        
                        {mediaAssets?.length > 0 && (
                            <div className="flex-shrink-0">
                                {bulkMode ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setBulkMode(false)}
                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveBulk}
                                            disabled={savingBulk}
                                            className="px-3 py-1.5 bg-[#E5654B] hover:bg-[#b03a24] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-orange-500/10 active:scale-[0.98]"
                                        >
                                            {savingBulk ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                            ) : (
                                                <Check className="w-3.5 h-3.5" />
                                            )}
                                            <span>Terapkan Masal</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={startBulkMode}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100/80 border border-orange-100 rounded-xl text-xs font-bold text-orange-700 transition-all active:scale-[0.98]"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                                        <span>Kelola Galeri Masal</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {mediaAssets?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {mediaAssets.map((asset) => {
                                const url = '/storage/' .concat(asset.file_path);
                                const usages = getPhotoUsages(url);
                                const isBulkSelected = bulkSelectedIds.includes(asset.id);
                                const isGalleryUsed = usages.some(u => u.type === 'gallery');
                                
                                return (
                                    <div 
                                        key={asset.id} 
                                        onClick={() => bulkMode ? toggleBulkSelect(asset.id) : handleSelectAsset(asset)}
                                        className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] flex flex-col ${
                                            bulkMode
                                                ? (isBulkSelected ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-200 opacity-80 hover:opacity-100')
                                                : (selectedAsset?.id === asset.id 
                                                    ? 'border-[#E5654B] ring-2 ring-orange-100' 
                                                    : 'border-gray-200')
                                        }`}
                                    >
                                        <div className="aspect-square w-full overflow-hidden bg-gray-50 relative">
                                            <img 
                                                src={url} 
                                                alt={asset.file_name} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                            />
                                            
                                            {/* Custom Hover/Selection states depending on bulkMode */}
                                            {bulkMode ? (
                                                /* Selection Checkbox overlays for Bulk Mode */
                                                isBulkSelected ? (
                                                    <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center z-10 shadow-inner">
                                                        <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white text-white font-extrabold shadow-lg animate-scale-in">
                                                            ✓
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center border border-gray-300 z-10 shadow-sm">
                                                        <span className="text-[10px] text-gray-400 font-bold">+</span>
                                                    </div>
                                                )
                                            ) : (
                                                <>
                                                    {/* Standard Hover Zoom & Eye Icon overlay */}
                                                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                                        <div className="bg-white/90 backdrop-blur text-gray-800 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                            <Settings className="w-3.5 h-3.5" />
                                                            <span>Atur Foto</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Quick Gallery Toggle Checkbox (Instant add/remove) */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevents opening modal
                                                            handleQuickToggleGallery(asset, isGalleryUsed);
                                                        }}
                                                        className={`absolute top-2.5 right-2.5 z-25 w-7 h-7 rounded-full flex items-center justify-center border transition-all shadow-md hover:scale-110 active:scale-95 ${
                                                            isGalleryUsed 
                                                                ? 'bg-teal-600 border-teal-600 text-white font-extrabold' 
                                                                : 'bg-white/90 backdrop-blur border-gray-300 text-gray-400 group-hover:border-teal-500 opacity-60 group-hover:opacity-100 hover:text-teal-600'
                                                        }`}
                                                        title={isGalleryUsed ? 'Hapus dari Galeri Prewedding' : 'Aktifkan ke Galeri Prewedding'}
                                                    >
                                                        {togglingAssetId === asset.id ? (
                                                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: isGalleryUsed ? '#ffffff' : '#0d9488' }}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-[12px] leading-none">✓</span>
                                                        )}
                                                    </button>
                                                </>
                                            )}

                                            {/* Active Usage Badges Overlays */}
                                            {usages.length > 0 && !bulkMode && (
                                                <div className="absolute top-2 left-2 max-w-[calc(100%-36px)] flex flex-wrap gap-1 z-20 pointer-events-none">
                                                    {usages.map((u, idx) => (
                                                        <span 
                                                            key={idx} 
                                                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm tracking-wide uppercase ${u.color}`}
                                                        >
                                                            {u.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex flex-col justify-between flex-grow">
                                            <p className="text-[11px] font-medium text-gray-500 truncate" title={asset.file_name}>
                                                {asset.file_name}
                                            </p>
                                            <div className="text-[10px] text-gray-400 mt-0.5 flex justify-between">
                                                <span>{(asset.file_size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
                            <div className="text-5xl mb-3 flex justify-center">
                                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-gray-500 font-bold text-base">Belum Ada Foto di Album</div>
                            <p className="text-gray-400 text-xs mt-1 max-w-sm mx-auto">
                                Silakan unggah foto-foto prewedding atau profil mempelai Anda menggunakan kolom uploader di atas.
                            </p>
                        </div>
                    )}
                </div>
                    </>
                )}
            </div>

            {/* ═══ PREMIUM CENTRED MEDIA SETTINGS MODAL POPUP ═══ */}
            {selectedAsset && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
                        
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">Pengaturan Penggunaan Foto</h3>
                                <p className="text-[10px] text-gray-400 truncate max-w-[280px]" title={selectedAsset.file_name}>
                                    {selectedAsset.file_name}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedAsset(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Scrollable Content */}
                        <div className="flex-grow overflow-y-auto p-5 space-y-6">
                            
                            {/* Selected Photo Thumbnail */}
                            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-900 flex items-center justify-center relative">
                                <img 
                                    src={'/storage/' .concat(selectedAsset.file_path)} 
                                    alt="Selected" 
                                    className="w-full h-full object-contain" 
                                />
                            </div>

                            {/* Section 1: Usage Switcher Dashboard (Toggles) */}
                            <div className="bg-orange-50/20 border border-orange-100/50 rounded-2xl p-4 space-y-3">
                                <h4 className="text-xs font-extrabold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                                    <LinkIcon size={12} className="text-orange-600" />
                                    <span>Hubungkan Foto Ke Halaman:</span>
                                </h4>
                                
                                <div className="space-y-2.5 mt-2">
                                    {/* Cover Switch */}
                                    <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                        <div>
                                            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                                                Sampul Undangan (Cover)
                                            </span>
                                            <p className="text-[10px] text-gray-400">Muncul di layar pertama undangan dibuka</p>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleUsage('cover', localInvitation.cover_image?.split(',').filter(Boolean).includes('/storage/' .concat(selectedAsset.file_path)))}
                                            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                localInvitation.cover_image?.split(',').filter(Boolean).includes('/storage/' .concat(selectedAsset.file_path)) ? 'bg-orange-500' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                localInvitation.cover_image?.split(',').filter(Boolean).includes('/storage/' .concat(selectedAsset.file_path)) ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>

                                    {/* Opening Switch */}
                                    <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                        <div>
                                            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                                                Gambar Pembuka (Opening)
                                            </span>
                                            <p className="text-[10px] text-gray-400">Muncul sebagai foto selamat datang utama</p>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleUsage('opening', localInvitation.opening_image?.split(',').filter(Boolean).includes('/storage/' .concat(selectedAsset.file_path)))}
                                            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                localInvitation.opening_image?.split(',').filter(Boolean).includes('/storage/' .concat(selectedAsset.file_path)) ? 'bg-blue-500' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                localInvitation.opening_image?.split(',').filter(Boolean).includes('/storage/' .concat(selectedAsset.file_path)) ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>

                                    {/* Groom Switch */}
                                    <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                        <div>
                                            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                                                Profil Mempelai Pria
                                            </span>
                                            <p className="text-[10px] text-gray-400">Diatur di bingkai profil pria</p>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleUsage('groom', localBrideGrooms.find(bg => bg.gender === 'pria')?.photo === '/storage/' .concat(selectedAsset.file_path))}
                                            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                localBrideGrooms.find(bg => bg.gender === 'pria')?.photo === '/storage/' .concat(selectedAsset.file_path) ? 'bg-emerald-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                localBrideGrooms.find(bg => bg.gender === 'pria')?.photo === '/storage/' .concat(selectedAsset.file_path) ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>

                                    {/* Bride Switch */}
                                    <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                        <div>
                                            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                                                Profil Mempelai Wanita
                                            </span>
                                            <p className="text-[10px] text-gray-400">Diatur di bingkai profil wanita</p>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleUsage('bride', localBrideGrooms.find(bg => bg.gender === 'wanita')?.photo === '/storage/' .concat(selectedAsset.file_path))}
                                            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                localBrideGrooms.find(bg => bg.gender === 'wanita')?.photo === '/storage/' .concat(selectedAsset.file_path) ? 'bg-rose-500' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                localBrideGrooms.find(bg => bg.gender === 'wanita')?.photo === '/storage/' .concat(selectedAsset.file_path) ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>

                                    {/* Gallery Switch */}
                                    <div className="flex items-center justify-between py-1.5">
                                        <div>
                                            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></span>
                                                Galeri Foto Prewedding
                                            </span>
                                            <p className="text-[10px] text-gray-400">Masuk ke slider/grid prewedding</p>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleUsage('gallery', localGalleries.some(g => g.image_url === '/storage/' .concat(selectedAsset.file_path)))}
                                            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                localGalleries.some(g => g.image_url === '/storage/' .concat(selectedAsset.file_path)) ? 'bg-teal-500' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                localGalleries.some(g => g.image_url === '/storage/' .concat(selectedAsset.file_path)) ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Non-destructive Cropping Workspace (Focal Point Visualizer) */}
                            {getPhotoUsages('/storage/' .concat(selectedAsset.file_path)).some(u => ['cover', 'opening', 'groom', 'bride'].includes(u.type)) && (
                                <div className="border border-gray-200 rounded-3xl p-5 space-y-4 bg-gray-50 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <Settings size={12} className="text-orange-500" />
                                            <span>Workspace Reposisi Visual</span>
                                        </h4>
                                    </div>

                                    {/* Sub-tabs for Selecting Active Usage to Position */}
                                    <div className="flex flex-wrap gap-1.5 bg-gray-200/50 p-1 rounded-xl">
                                        {['cover', 'opening', 'groom', 'bride'].map((tab) => {
                                            const url = '/storage/' .concat(selectedAsset.file_path);
                                            const isActive = activeCropTarget === tab;
                                            
                                            // Only show the tab if the photo is actually active for that usage target
                                            const isLinked = (tab === 'cover' && localInvitation.cover_image?.split(',').filter(Boolean).includes(url)) ||
                                                             (tab === 'opening' && localInvitation.opening_image?.split(',').filter(Boolean).includes(url)) ||
                                                             (tab === 'groom' && localBrideGrooms.find(bg => bg.gender === 'pria')?.photo === url) ||
                                                             (tab === 'bride' && localBrideGrooms.find(bg => bg.gender === 'wanita')?.photo === url);

                                            if (!isLinked) return null;

                                            const labels = { cover: 'Sampul', opening: 'Pembuka', groom: 'Pria', bride: 'Wanita' };

                                            return (
                                                <button
                                                    key={tab}
                                                    type="button"
                                                    onClick={() => setActiveCropTarget(tab)}
                                                    className={`flex-grow px-2 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                                                        isActive 
                                                            ? 'bg-[#E5654B] text-white shadow-sm' 
                                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                                    }`}
                                                >
                                                    {labels[tab]}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Preview Mask Container */}
                                    <div className="flex flex-col items-center py-2">
                                        {['groom', 'bride'].includes(activeCropTarget) ? (
                                            /* Circle Mask Frame for BrideGrooms */
                                            <div 
                                                ref={previewContainerRef}
                                                onMouseDown={handleMouseDown}
                                                className="w-36 h-36 rounded-full overflow-hidden border-4 border-orange-100 bg-gray-200 relative shadow-inner cursor-move select-none"
                                                title="Geser langsung gambar di dalam lingkaran untuk reposisi"
                                            >
                                                <img 
                                                    src={'/storage/' .concat(selectedAsset.file_path)} 
                                                    alt="Circle Preview" 
                                                    draggable={false}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        objectPosition: `${posX}% ${posY}%`,
                                                        transform: `scale(${zoom})`,
                                                        transformOrigin: 'center'
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            /* Vertical Mobile Frame for Cover / Opening (Portrait 9:16) */
                                            <div 
                                                ref={previewContainerRef}
                                                onMouseDown={handleMouseDown}
                                                className="w-48 h-80 rounded-[2.2rem] overflow-hidden border-[8px] border-gray-800 bg-gray-200 relative shadow-2xl cursor-move select-none flex items-center justify-center"
                                                title="Geser langsung gambar di dalam bingkai HP untuk reposisi"
                                            >
                                                {/* Simulated camera notch / Dynamic Island inside crop mask */}
                                                <div className="absolute top-2.5 w-14 h-3.5 bg-black rounded-full z-10 pointer-events-none opacity-85" />
                                                
                                                <img 
                                                    src={'/storage/' .concat(selectedAsset.file_path)} 
                                                    alt="Rect Preview" 
                                                    draggable={false}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        objectPosition: `${posX}% ${posY}%`,
                                                        transform: `scale(${zoom})`,
                                                        transformOrigin: 'center'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <span className="text-[10px] text-gray-400 font-medium mt-2 flex items-center justify-center gap-1 text-center w-full">
                                            Geser foto di atas atau atur menggunakan slider di bawah
                                        </span>
                                    </div>

                                    {/* Quick Preset Buttons (Edit Cepat) */}
                                    <div className="bg-gray-100/60 p-3 rounded-2xl border border-gray-200/50 space-y-2">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                                            Penyesuaian Cepat (Presets)
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => { setZoom(1.0); setPosX(50); setPosY(50); }}
                                                className="px-2 py-1.5 border border-gray-200 hover:border-[#E5654B] hover:text-[#E5654B] bg-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                                                title="Tampilkan seluruh foto tanpa perbesaran"
                                            >
                                                <Minimize2 size={10} />
                                                <span>Sesuaikan</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setZoom(1.15); setPosX(50); setPosY(20); }}
                                                className="px-2 py-1.5 border border-gray-200 hover:border-[#E5654B] hover:text-[#E5654B] bg-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                                                title="Fokus ke bagian atas gambar (wajah mempelai)"
                                            >
                                                <Smile size={10} />
                                                <span>Fokus Wajah</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setZoom(1.4); setPosX(50); setPosY(50); }}
                                                className="px-2 py-1.5 border border-gray-200 hover:border-[#E5654B] hover:text-[#E5654B] bg-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                                                title="Perbesar gambar untuk memenuhi lebar horizontal"
                                            >
                                                <Maximize2 size={10} />
                                                <span>Penuhi Lebar</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setZoom(1.2); setPosX(50); setPosY(30); }}
                                                className="px-2 py-1.5 border border-gray-200 hover:border-[#E5654B] hover:text-[#E5654B] bg-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                                                title="Perbesar gambar untuk memenuhi tinggi vertikal"
                                            >
                                                <Maximize2 size={10} />
                                                <span>Penuhi Tinggi</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setZoom(1.6); setPosX(50); setPosY(35); }}
                                                className="px-2 py-1.5 border border-gray-200 hover:border-[#E5654B] hover:text-[#E5654B] bg-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                                                title="Perbesar penuh untuk foto dekat"
                                            >
                                                <Maximize2 size={10} />
                                                <span>Close-up</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setZoom(1.0); setPosX(50); setPosY(50); }}
                                                className="px-2 py-1.5 border border-gray-200 hover:border-red-400 hover:text-red-500 bg-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                                                title="Kembalikan ke posisi awal"
                                            >
                                                <RotateCcw size={10} />
                                                <span>Reset</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Range Sliders Controls */}
                                    <div className="space-y-3.5 pt-2">
                                        {/* Slider X */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[11px] font-bold text-gray-600">
                                                <span>Fokus Horizontal (X)</span>
                                                <span className="text-orange-600 font-mono">{posX}%</span>
                                            </div>
                                            <input 
                                                type="range" min="0" max="100" value={posX}
                                                onChange={(e) => setPosX(Number(e.target.value))}
                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E5654B]"
                                            />
                                        </div>

                                        {/* Slider Y */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[11px] font-bold text-gray-600">
                                                <span>Fokus Vertikal (Y)</span>
                                                <span className="text-orange-600 font-mono">{posY}%</span>
                                            </div>
                                            <input 
                                                type="range" min="0" max="100" value={posY}
                                                onChange={(e) => setPosY(Number(e.target.value))}
                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E5654B]"
                                            />
                                        </div>

                                        {/* Slider Zoom */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[11px] font-bold text-gray-600">
                                                <span>Pembesaran (Zoom)</span>
                                                <span className="text-orange-600 font-mono">{zoom.toFixed(2)}x</span>
                                            </div>
                                            <input 
                                                type="range" min="1.0" max="3.0" step="0.05" value={zoom}
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E5654B]"
                                            />
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        type="button"
                                        onClick={handleSavePosition}
                                        disabled={savingPosition}
                                        className="w-full py-2.5 px-4 bg-[#E5654B] text-white rounded-xl text-xs font-bold hover:bg-[#b03a24] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10"
                                    >
                                        {savingPosition ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-3.5 h-3.5" />
                                                <span>Simpan Posisi & Perbesaran</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <button
                                type="button"
                                onClick={handleDeleteAsset}
                                className="py-2 px-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus Permanen</span>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setSelectedAsset(null)}
                                className="py-2 px-4 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-gray-700 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </DashboardLayout>
    );
}
