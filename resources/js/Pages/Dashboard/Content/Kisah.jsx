import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Image as ImageIcon, UploadCloud, X as XIcon, Save, Heart, Info, Trash2, Check, GraduationCap, Cake, Baby, Smile } from 'lucide-react';

const emptyStory = { title: '', story_date: '', description: '', image_url: '' };

export default function Kisah({ stories, mediaAssets = [] }) {
    const { flash, auth } = usePage().props;
    const invitationType = auth?.user?.invitation_type || 'wedding';

    const getDefaultStories = (type) => {
        switch (type) {
            case 'graduation':
                return [
                    { ...emptyStory, title: 'Masuk Kuliah / Sekolah' },
                    { ...emptyStory, title: 'KKN / Magang / Organisasi' },
                    { ...emptyStory, title: 'Sidang Akhir / Yudisium' },
                ];
            case 'birthday':
                return [
                    { ...emptyStory, title: 'Masa Kecil' },
                    { ...emptyStory, title: 'Masa Sekolah' },
                    { ...emptyStory, title: 'Pencapaian Berharga' },
                ];
            case 'aqiqah':
            case 'circumcision':
                return [
                    { ...emptyStory, title: 'Kelahiran / Awal Kehidupan' },
                    { ...emptyStory, title: 'Langkah Pertama / Tumbuh Kembang' },
                    { ...emptyStory, title: 'Momen Penting Buah Hati' },
                ];
            case 'anniversary':
                return [
                    { ...emptyStory, title: 'Pertama Bertemu' },
                    { ...emptyStory, title: 'Menikah' },
                    { ...emptyStory, title: 'Perjalanan Bersama' },
                ];
            default:
                return [
                    { ...emptyStory, title: 'Pertama Bertemu' },
                    { ...emptyStory, title: 'Mulai Menjalin Hubungan' },
                    { ...emptyStory, title: 'Lamaran' },
                ];
        }
    };

    const initial = stories?.length > 0 ? stories : getDefaultStories(invitationType);

    const { data, setData, post, processing } = useForm({ stories: initial });

    // Picker states
    const [pickerStoryIndex, setPickerStoryIndex] = useState(null); // null or index
    const [pickerTab, setPickerTab] = useState('album'); // 'album' or 'upload'
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    // Freeze body scroll when picker modal is active
    useEffect(() => {
        if (pickerStoryIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [pickerStoryIndex]);

    const updateStory = (index, field, value) => {
        const updated = [...data.stories];
        updated[index] = { ...updated[index], [field]: value };
        setData('stories', updated);
    };

    const addStory = () => setData('stories', [...data.stories, { ...emptyStory }]);

    const removeStory = (index) => {
        if (data.stories.length <= 1) return;
        setData('stories', data.stories.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('content.kisah.save'));
    };

    // Open Picker Modal
    const openPhotoPicker = (index) => {
        setPickerStoryIndex(index);
        setPickerTab('album');
        setSelectedPhotoUrl(data.stories[index].image_url || '');
    };

    // Confirm Photo Selection from Picker
    const confirmPhotoSelection = () => {
        if (pickerStoryIndex !== null) {
            updateStory(pickerStoryIndex, 'image_url', selectedPhotoUrl);
            setPickerStoryIndex(null);
        }
    };

    // Handle Upload from within Kisah Media Picker Modal
    const handlePickerUpload = async (files) => {
        if (!files || files.length === 0) return;
        const file = files[0];

        setUploadingMedia(true);
        setUploadStatus('Mengunggah ke album...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(route('theme.media.upload'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            // Set the uploaded photo URL as selected
            const url = response.data.url;
            setSelectedPhotoUrl(url);
            
            // Auto confirm and reload parent album list props
            updateStory(pickerStoryIndex, 'image_url', url);
            setPickerStoryIndex(null);
            
            router.reload({ 
                only: ['mediaAssets'],
                preserveState: true,
                preserveScroll: true 
            });
        } catch (e) {
            console.error('Picker upload error:', e);
            alert('Gagal mengunggah foto. Silakan periksa ukuran file (max 10MB).');
        } finally {
            setUploadingMedia(false);
            setUploadStatus('');
        }
    };

    // Dynamic config mapping based on event type
    const config = {
        wedding: {
            title: 'Kisah Cinta',
            bannerTitle: 'Kisah Cinta / Timeline Perjalanan',
            bannerDesc: 'Ceritakan kembali momen-momen indah perjalanan cinta Anda berdua. Tambahkan foto pendukung dari album untuk setiap momen agar undangan terasa lebih romantis.',
            titlePlaceholder: 'Contoh: Pertama Bertemu',
            descPlaceholder: 'Ceritakan momen ini secara singkat dan romantis...',
            fotoLabel: 'Foto Momen Kisah Cinta',
            saveBtn: 'Simpan Kisah Cinta',
            icon: Heart,
            iconClass: 'text-pink-500 fill-pink-500',
            bannerClass: 'bg-pink-50 border-pink-100',
            bannerTitleClass: 'text-pink-800',
            bannerDescClass: 'text-pink-600',
            accentClass: 'focus:ring-pink-300 focus:border-pink-400',
            badgeBg: 'bg-pink-500',
            btnGradient: 'from-pink-500 to-rose-500',
            pickerBorder: 'border-pink-200',
            textClass: 'text-pink-500',
            pickerText: 'bg-pink-50 hover:bg-pink-100/80 border-pink-100 text-pink-700'
        },
        graduation: {
            title: 'Perjalanan Studi',
            bannerTitle: 'Perjalanan Studi / Timeline Akademik',
            bannerDesc: 'Ceritakan kembali momen-momen penting dan perjuangan studi Anda selama menempuh pendidikan. Tambahkan foto pendukung dari album untuk setiap momen agar kenangan terasa lebih berkesan.',
            titlePlaceholder: 'Contoh: Masuk Kuliah',
            descPlaceholder: 'Ceritakan kisah perjuangan atau kenangan indah pada momen ini secara singkat...',
            fotoLabel: 'Foto Momen Perjalanan Studi',
            saveBtn: 'Simpan Perjalanan Studi',
            icon: GraduationCap,
            iconClass: 'text-blue-500',
            bannerClass: 'bg-blue-50 border-blue-100',
            bannerTitleClass: 'text-blue-800',
            bannerDescClass: 'text-blue-600',
            accentClass: 'focus:ring-blue-300 focus:border-blue-400',
            badgeBg: 'bg-blue-500',
            btnGradient: 'from-blue-500 to-indigo-500',
            pickerBorder: 'border-blue-200',
            textClass: 'text-blue-500',
            pickerText: 'bg-blue-50 hover:bg-blue-100/80 border-blue-100 text-blue-700'
        },
        birthday: {
            title: 'Milestone & Kisah',
            bannerTitle: 'Milestone & Kisah / Perjalanan Hidup',
            bannerDesc: 'Ceritakan kembali momen-momen indah, tumbuh kembang, dan pencapaian berharga dalam kehidupan Anda. Tambahkan foto pendukung dari album untuk setiap momen penting tersebut.',
            titlePlaceholder: 'Contoh: Masa Kecil',
            descPlaceholder: 'Ceritakan kisah indah pada momen ini secara singkat...',
            fotoLabel: 'Foto Momen Milestone',
            saveBtn: 'Simpan Milestone & Kisah',
            icon: Cake,
            iconClass: 'text-amber-500',
            bannerClass: 'bg-amber-50 border-amber-100',
            bannerTitleClass: 'text-amber-800',
            bannerDescClass: 'text-amber-600',
            accentClass: 'focus:ring-amber-300 focus:border-amber-400',
            badgeBg: 'bg-amber-500',
            btnGradient: 'from-amber-500 to-orange-500',
            pickerBorder: 'border-amber-200',
            textClass: 'text-amber-500',
            pickerText: 'bg-amber-50 hover:bg-amber-100/80 border-amber-100 text-amber-700'
        },
        aqiqah: {
            title: 'Kisah Anak',
            bannerTitle: 'Kisah Anak / Perkembangan Buah Hati',
            bannerDesc: 'Ceritakan kembali perjalanan kehamilan, kelahiran, hingga momen aqiqah buah hati tercinta Anda. Tambahkan foto pendukung dari album untuk melengkapi kisah bahagianya.',
            titlePlaceholder: 'Contoh: Kelahiran Buah Hati',
            descPlaceholder: 'Ceritakan kisah indah pada momen ini secara singkat...',
            fotoLabel: 'Foto Momen Kisah Anak',
            saveBtn: 'Simpan Kisah Anak',
            icon: Baby,
            iconClass: 'text-teal-500',
            bannerClass: 'bg-teal-50 border-teal-100',
            bannerTitleClass: 'text-teal-800',
            bannerDescClass: 'text-teal-600',
            accentClass: 'focus:ring-teal-300 focus:border-teal-400',
            badgeBg: 'bg-teal-500',
            btnGradient: 'from-teal-500 to-emerald-500',
            pickerBorder: 'border-teal-200',
            textClass: 'text-teal-500',
            pickerText: 'bg-teal-50 hover:bg-teal-100/80 border-teal-100 text-teal-700'
        },
        circumcision: {
            title: 'Kisah Anak',
            bannerTitle: 'Kisah Anak / Tumbuh Kembang',
            bannerDesc: 'Ceritakan kembali tumbuh kembang anak Anda dari masa kecil hingga momen khitanan ini. Tambahkan foto pendukung dari album untuk melengkapi kisah bahagianya.',
            titlePlaceholder: 'Contoh: Masa Kecil',
            descPlaceholder: 'Ceritakan kisah indah pada momen ini secara singkat...',
            fotoLabel: 'Foto Momen Kisah Anak',
            saveBtn: 'Simpan Kisah Anak',
            icon: Smile,
            iconClass: 'text-emerald-500',
            bannerClass: 'bg-emerald-50 border-emerald-100',
            bannerTitleClass: 'text-emerald-800',
            bannerDescClass: 'text-emerald-600',
            accentClass: 'focus:ring-emerald-300 focus:border-emerald-400',
            badgeBg: 'bg-emerald-500',
            btnGradient: 'from-emerald-500 to-teal-500',
            pickerBorder: 'border-emerald-200',
            textClass: 'text-emerald-500',
            pickerText: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-100 text-emerald-700'
        },
        anniversary: {
            title: 'Kisah Kebersamaan',
            bannerTitle: 'Kisah Kebersamaan / Linimasa Pernikahan',
            bannerDesc: 'Ceritakan kembali perjalanan kebersamaan Anda berdua dari awal bertemu hingga merayakan hari jadi pernikahan ini. Tambahkan foto pendukung dari album agar linimasa terasa lebih romantis.',
            titlePlaceholder: 'Contoh: Pertama Bertemu',
            descPlaceholder: 'Ceritakan momen ini secara singkat dan romantis...',
            fotoLabel: 'Foto Momen Kisah Kebersamaan',
            saveBtn: 'Simpan Kisah Kebersamaan',
            icon: Heart,
            iconClass: 'text-rose-500 fill-rose-500',
            bannerClass: 'bg-rose-50 border-rose-100',
            bannerTitleClass: 'text-rose-800',
            bannerDescClass: 'text-rose-600',
            accentClass: 'focus:ring-rose-300 focus:border-rose-400',
            badgeBg: 'bg-rose-500',
            btnGradient: 'from-rose-500 to-red-500',
            pickerBorder: 'border-rose-200',
            textClass: 'text-rose-500',
            pickerText: 'bg-rose-50 hover:bg-rose-100/80 border-rose-100 text-rose-700'
        }
    };

    const selectedConfig = config[invitationType] || config.wedding;
    const BannerIcon = selectedConfig.icon;

    return (
        <DashboardLayout title={selectedConfig.title}>
            <Head title={selectedConfig.title} />
            <div className="max-w-3xl mx-auto space-y-6 px-2 sm:px-4">
                {flash?.success && (
                    <div className="bg-orange-50 border border-orange-200 text-[#b03a24] px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in shadow-sm">
                        <svg className="w-4 h-4 text-[#E5654B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                <div className={`${selectedConfig.bannerClass} border rounded-3xl p-5 flex items-start gap-4 shadow-sm`}>
                    <div className={`${invitationType === 'wedding' || invitationType === 'anniversary' ? 'bg-pink-100/60' : 'bg-gray-100'} p-2.5 rounded-2xl flex-shrink-0`}>
                        <BannerIcon size={20} className={selectedConfig.iconClass} />
                    </div>
                    <div>
                        <div className={`font-bold ${selectedConfig.bannerTitleClass} text-sm`}>{selectedConfig.bannerTitle}</div>
                        <div className={`${selectedConfig.bannerDescClass} text-xs mt-1`}>
                            {selectedConfig.bannerDesc}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {data.stories.map((story, index) => (
                        <div key={index} className="bg-white rounded-3xl border border-gray-200 p-6 relative shadow-sm">
                            {/* Timeline dot */}
                            <div className={`absolute -left-3 top-8 w-6 h-6 ${selectedConfig.badgeBg} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border border-white`}>
                                {index + 1}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-gray-700">Momen #{index + 1}</h4>
                                {data.stories.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeStory(index)}
                                        className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={12} />
                                        <span>Hapus</span>
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Judul Momen *</label>
                                    <input type="text" value={story.title} onChange={(e) => updateStory(index, 'title', e.target.value)}
                                        placeholder={selectedConfig.titlePlaceholder}
                                        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 ${selectedConfig.accentClass}`} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Tanggal</label>
                                    <input type="date" value={story.story_date?.split('T')[0] || ''}
                                        onChange={(e) => updateStory(index, 'story_date', e.target.value)}
                                        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 ${selectedConfig.accentClass}`} />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Cerita</label>
                                <textarea value={story.description || ''} onChange={(e) => updateStory(index, 'description', e.target.value)}
                                    placeholder={selectedConfig.descPlaceholder}
                                    className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 ${selectedConfig.accentClass} resize-none shadow-inner bg-gray-50/20`} rows={3} />
                            </div>

                            {/* Premium Photo Selector for each Story Moment */}
                            <div className="mt-4 border-t border-gray-50 pt-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                                <div className="w-full md:w-32 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-inner relative">
                                    {story.image_url ? (
                                        <img src={story.image_url} alt="Foto Momen" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-300 flex flex-col items-center justify-center">
                                            <ImageIcon size={20} className="text-gray-300" />
                                            <span className="text-[9px] font-bold mt-1.5 text-gray-400 uppercase">Tanpa Foto</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1.5 w-full">
                                    <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                        <ImageIcon size={13} className={`${selectedConfig.textClass} flex-shrink-0`} />
                                        <span>{selectedConfig.fotoLabel}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openPhotoPicker(index)}
                                        className={`w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 ${selectedConfig.pickerText} rounded-lg text-[11px] font-bold transition-all active:scale-[0.98] border`}
                                    >
                                        <ImageIcon size={12} />
                                        {story.image_url ? 'Ganti Foto Momen' : 'Pilih Foto dari Album'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addStory}
                        className={`w-full py-3.5 border-2 border-dashed ${selectedConfig.pickerBorder} rounded-2xl ${selectedConfig.textClass} hover:border-current transition-all text-xs font-bold`}>
                        + Tambah Momen Baru
                    </button>

                    <button type="submit" disabled={processing}
                        className={`w-full py-3.5 bg-gradient-to-r ${selectedConfig.btnGradient} text-white rounded-2xl text-sm font-bold hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-1.5`}
                    >
                        {processing ? (
                            <span>Menyimpan...</span>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>{selectedConfig.saveBtn}</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* ═══ PREMIUM CENTRED MEDIA PICKER MODAL POPUP ═══ */}
            {pickerStoryIndex !== null && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">Pilih Foto Momen</h3>
                                <p className="text-[10px] text-gray-400">Hubungkan foto album ke momen "{data.stories[pickerStoryIndex].title || selectedConfig.title}"</p>
                            </div>
                            <button 
                                onClick={() => setPickerStoryIndex(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                <XIcon size={14} />
                            </button>
                        </div>

                        {/* Tab Bar Picker */}
                        <div className="p-3 border-b border-gray-50 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPickerTab('album')}
                                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                    pickerTab === 'album' 
                                        ? 'bg-orange-50 text-orange-700 border border-orange-100 shadow-inner' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                <ImageIcon size={13} />
                                Album Foto Anda
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setPickerTab('upload')}
                                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                    pickerTab === 'upload' 
                                        ? 'bg-orange-50 text-orange-700 border border-orange-100 shadow-inner' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                <UploadCloud size={13} />
                                Unggah Baru
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-grow overflow-y-auto p-4 min-h-[250px]">
                            {pickerTab === 'album' ? (
                                /* Tab 1: Select from Album */
                                mediaAssets?.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {mediaAssets.map((asset) => {
                                            const url = '/storage/' + asset.file_path;
                                            const isSelected = selectedPhotoUrl === url;
                                            return (
                                                <div 
                                                    key={asset.id}
                                                    onClick={() => setSelectedPhotoUrl(url)}
                                                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer relative transition-all border-2 flex flex-col justify-end bg-gray-50 group hover:scale-[1.03] ${
                                                        isSelected 
                                                            ? 'border-orange-500 ring-4 ring-orange-50 shadow-md' 
                                                            : 'border-transparent hover:border-gray-200'
                                                    }`}
                                                >
                                                    <img src={url} alt={asset.file_name} className="w-full h-full object-cover" />
                                                    
                                                    {isSelected && (
                                                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border border-white text-white z-10 shadow-sm">
                                                            <Check size={10} className="stroke-[3]" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <ImageIcon size={36} className="text-gray-300 mb-2" />
                                        <div className="text-xs text-gray-500 font-bold">Album masih kosong</div>
                                        <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">Silakan beralih ke tab "Unggah Baru" untuk memasukkan foto pertama Anda.</p>
                                    </div>
                                )
                            ) : (
                                /* Tab 2: Upload New Photo (Auto adds to album) */
                                <label className="block cursor-pointer">
                                    <div 
                                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                        onDragLeave={() => setIsDragOver(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragOver(false);
                                            if (e.dataTransfer.files?.length > 0) {
                                                handlePickerUpload(e.dataTransfer.files);
                                            }
                                        }}
                                        className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                                            isDragOver 
                                                ? 'border-[#E5654B] bg-orange-50 scale-[1.01]' 
                                                : 'border-gray-200 hover:border-[#e87058] hover:bg-orange-50/10'
                                        }`}
                                    >
                                        {uploadingMedia ? (
                                            <div className="text-[#E5654B] font-semibold flex flex-col items-center justify-center gap-2">
                                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span className="text-xs">{uploadStatus || 'Mengunggah...'}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-3xl text-gray-300 flex justify-center mb-2">
                                                    <UploadCloud size={32} className="text-orange-500/60" />
                                                </div>
                                                <div className="text-xs font-bold text-gray-600">Klik / Seret foto ke area ini</div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP • Max 10MB</div>
                                                <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-[9px] font-bold mt-3">
                                                    <Info size={11} className="text-orange-600 flex-shrink-0" />
                                                    <span>Otomatis Tersimpan & Masuk Album Pustaka</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="hidden"
                                        onChange={(e) => handlePickerUpload(e.target.files)} disabled={uploadingMedia} />
                                </label>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 flex gap-2.5 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setPickerStoryIndex(null)}
                                className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all"
                            >
                                Batal
                            </button>
                            
                            <button
                                type="button"
                                onClick={confirmPhotoSelection}
                                disabled={!selectedPhotoUrl}
                                className="flex-1 py-2.5 px-4 bg-[#E5654B] text-white hover:bg-[#b03a24] rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/10"
                            >
                                Pilih Foto Ini
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </DashboardLayout>
    );
}
