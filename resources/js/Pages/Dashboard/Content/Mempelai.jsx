import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Instagram, Youtube, Facebook, Twitter, Plus, X as XIcon, Globe, Image as ImageIcon, UploadCloud, Save, Trash2, Heart, AlertTriangle, Info, User, GraduationCap, Calendar, Cake, ShieldCheck, Smile, ArrowLeftRight } from 'lucide-react';

const SOCMED_OPTIONS = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@username atau link', color: 'text-pink-500' },
    { key: 'tiktok', label: 'TikTok', icon: Globe, placeholder: '@username atau link', color: 'text-gray-800' },
    { key: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: '@username atau link', color: 'text-sky-500' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'Username atau link', color: 'text-blue-600' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'Link channel', color: 'text-red-500' },
];

const emptyBrideGroom = {
    full_name: '', nickname: '', father_name: '', mother_name: '',
    gender: 'pria', photo: '', bio: '', instagram: '', tiktok: '', twitter: '', facebook: '', youtube: '', child_order: '',
};

export default function Mempelai({ brideGrooms, mediaAssets = [], eventType = 'wedding' }) {
    const { flash } = usePage().props;
    const isSingleSubject = !['wedding', 'anniversary'].includes(eventType);
    const size = isSingleSubject ? 1 : 2;

    const [activeTab, setActiveTab] = useState(0);

    const initial = brideGrooms?.length === size
        ? brideGrooms
        : (isSingleSubject 
            ? [{ ...emptyBrideGroom, gender: 'pria' }]
            : [{ ...emptyBrideGroom, gender: 'wanita' }, { ...emptyBrideGroom, gender: 'pria' }]);

    const { data, setData, post, processing, errors } = useForm({
        bride_grooms: initial,
    });

    const [visibleSocmed, setVisibleSocmed] = useState(() =>
        initial.map(bg => SOCMED_OPTIONS.filter(opt => bg[opt.key]).map(opt => opt.key))
    );
    const [showSocmedPicker, setShowSocmedPicker] = useState(() => Array(size).fill(false));

    // Media library picker states
    const [showPickerForIndex, setShowPickerForIndex] = useState(null);
    const [pickerTab, setPickerTab] = useState('album'); // 'album' or 'upload'
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('');
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    // Freeze body scroll when picker modal is active
    useEffect(() => {
        if (showPickerForIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showPickerForIndex]);

    const update = (index, field, value) => {
        const updated = [...data.bride_grooms];
        updated[index] = { ...updated[index], [field]: value };
        
        // Enforce opposite gender if eventType allows (wedding/anniversary)
        if (field === 'gender' && !isSingleSubject) {
            const otherIndex = 1 - index;
            const otherGender = value === 'pria' ? 'wanita' : 'pria';
            updated[otherIndex] = { ...updated[otherIndex], gender: otherGender };
        }

        setData('bride_grooms', updated);
    };

    const swapPositions = () => {
        if (isSingleSubject) return;

        const updated = [...data.bride_grooms];
        const temp = updated[0];
        updated[0] = updated[1];
        updated[1] = temp;
        setData('bride_grooms', updated);

        const updatedSocmed = [...visibleSocmed];
        const tempSocmed = updatedSocmed[0];
        updatedSocmed[0] = updatedSocmed[1];
        updatedSocmed[1] = tempSocmed;
        setVisibleSocmed(updatedSocmed);

        setShowSocmedPicker(Array(size).fill(false));
    };

    const addSocmed = (personIndex, key) => {
        const updated = [...visibleSocmed];
        if (!updated[personIndex].includes(key)) {
            updated[personIndex] = [...updated[personIndex], key];
        }
        setVisibleSocmed(updated);
        setShowSocmedPicker(prev => {
            const next = [...prev];
            next[personIndex] = false;
            return next;
        });
    };

    const removeSocmed = (personIndex, key) => {
        const updated = [...visibleSocmed];
        updated[personIndex] = updated[personIndex].filter(k => k !== key);
        setVisibleSocmed(updated);
        update(personIndex, key, '');
    };

    const getAvailableSocmed = (personIndex) =>
        SOCMED_OPTIONS.filter(opt => !visibleSocmed[personIndex].includes(opt.key));

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('content.mempelai.save'));
    };

    // Open Picker Modal
    const openPhotoPicker = (index) => {
        setShowPickerForIndex(index);
        setPickerTab('album');
        setSelectedPhotoUrl(data.bride_grooms[index].photo || '');
    };

    // Confirm Photo Selection from Picker
    const confirmPhotoSelection = () => {
        if (showPickerForIndex !== null) {
            update(showPickerForIndex, 'photo', selectedPhotoUrl);
            setShowPickerForIndex(null);
        }
    };

    // Handle Upload from within Mempelai Media Picker Modal
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
            
            const url = response.data.url;
            setSelectedPhotoUrl(url);
            
            update(showPickerForIndex, 'photo', url);
            setShowPickerForIndex(null);
            
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

    const getTabsConfig = () => {
        if (eventType === 'wedding') {
            const gender1 = data.bride_grooms[0]?.gender === 'wanita' ? 'Wanita' : 'Pria';
            const gender2 = data.bride_grooms[1]?.gender === 'wanita' ? 'Wanita' : 'Pria';
            return [
                { idx: 0, label: `Mempelai 1 (${gender1})`, icon: Heart },
                { idx: 1, label: `Mempelai 2 (${gender2})`, icon: Heart },
            ];
        }
        if (eventType === 'anniversary') {
            return [
                { idx: 0, label: 'Pasangan 1', icon: Heart },
                { idx: 1, label: 'Pasangan 2', icon: Heart },
            ];
        }
        if (eventType === 'graduation') {
            return [{ idx: 0, label: 'Wisudawan / Wisudawati', icon: GraduationCap }];
        }
        if (eventType === 'birthday') {
            return [{ idx: 0, label: 'Ulang Tahun', icon: Cake }];
        }
        if (eventType === 'aqiqah') {
            return [{ idx: 0, label: 'Anak / Bayi', icon: Smile }];
        }
        if (eventType === 'circumcision') {
            return [{ idx: 0, label: 'Anak Khitan', icon: ShieldCheck }];
        }
        return [{ idx: 0, label: 'Detail Acara / Subjek', icon: Calendar }];
    };

    const tabs = getTabsConfig();
    const idx = activeTab;

    const getFieldLabels = () => {
        if (eventType === 'wedding') {
            return {
                title: 'Data Mempelai Pernikahan',
                photo: 'Foto Profil Mempelai',
                full_name: 'Nama Lengkap Mempelai *',
                nickname: 'Nama Panggilan',
            };
        }
        if (eventType === 'anniversary') {
            return {
                title: 'Data Pasangan Syukuran',
                photo: 'Foto Profil Pasangan',
                full_name: 'Nama Lengkap *',
                nickname: 'Nama Panggilan',
            };
        }
        if (eventType === 'graduation') {
            return {
                title: 'Data Wisudawan / Wisudawati',
                photo: 'Foto Profil Wisudawan',
                full_name: 'Nama Lengkap Wisudawan *',
                nickname: 'Nama Panggilan / Gelar',
            };
        }
        if (eventType === 'birthday') {
            return {
                title: 'Data Yang Berulang Tahun',
                photo: 'Foto Profil',
                full_name: 'Nama Lengkap *',
                nickname: 'Nama Panggilan',
            };
        }
        return {
            title: 'Data Pemilik Acara',
            photo: 'Foto Profil',
            full_name: 'Nama Lengkap *',
            nickname: 'Nama Panggilan',
        };
    };

    const labels = getFieldLabels();

    return (
        <DashboardLayout title={isSingleSubject ? 'Data Pemilik Acara' : 'Mempelai'}>
            <Head title={isSingleSubject ? 'Data Pemilik Acara' : 'Mempelai'} />
            <div className="max-w-2xl mx-auto space-y-3">
                {flash?.success && (
                    <div className="bg-orange-50 border border-orange-200 text-[#b03a24] px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 animate-fade-in">
                        <svg className="w-3.5 h-3.5 text-[#E5654B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {flash.success}
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-xs flex items-start gap-1.5 shadow-sm animate-fade-in">
                        <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold text-red-800">Gagal menyimpan data. Silakan periksa kembali:</div>
                            <ul className="list-disc list-inside text-[11px] mt-1 text-red-600 space-y-0.5">
                                {Object.entries(errors).map(([key, val]) => (
                                    <li key={key}>{val}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Tab Bar (only render if multiple tabs exist) */}
                {!isSingleSubject && (
                    <div className="flex items-stretch gap-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-1 flex-1 flex gap-0.5 shadow-sm">
                            {tabs.map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button key={tab.idx} type="button"
                                        onClick={() => setActiveTab(tab.idx)}
                                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.idx
                                            ? 'bg-[#E5654B] text-white shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50'
                                        }`}>
                                        <TabIcon size={14} className="flex-shrink-0" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            onClick={swapPositions}
                            title="Tukar Posisi Mempelai"
                            className="bg-white hover:bg-orange-50 hover:text-[#c24b33] hover:border-orange-200 border border-gray-200 text-gray-500 px-3.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-sm flex-shrink-0"
                        >
                            <ArrowLeftRight size={13} className="text-[#E5654B]" />
                            <span className="hidden sm:inline">Tukar Letak</span>
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm">
                        {/* Premium Integrated Photo Selector */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex-shrink-0 relative shadow-inner">
                                {data.bride_grooms[idx].photo ? (
                                    <img src={data.bride_grooms[idx].photo} alt="Foto Profil" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-orange-50/20">
                                        <User size={28} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                    <ImageIcon size={13} className="text-orange-500 flex-shrink-0" />
                                    <span>{labels.photo}</span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => openPhotoPicker(idx)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100/80 border border-orange-100 rounded-lg text-[11px] font-bold text-orange-700 transition-all active:scale-[0.98]"
                                >
                                    <ImageIcon size={12} />
                                    {data.bride_grooms[idx].photo ? 'Ganti dari Album / Upload' : 'Pilih Foto dari Album'}
                                </button>
                                {errors[`bride_grooms.${idx}.photo`] && (
                                    <p className="text-[10px] text-red-500 mt-1">{errors[`bride_grooms.${idx}.photo`]}</p>
                                )}
                            </div>
                        </div>

                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-2">
                            <Field label={labels.full_name} value={data.bride_grooms[idx].full_name}
                                onChange={(v) => update(idx, 'full_name', v)} required
                                error={errors[`bride_grooms.${idx}.full_name`]} />
                            <Field label={labels.nickname} value={data.bride_grooms[idx].nickname}
                                onChange={(v) => update(idx, 'nickname', v)}
                                error={errors[`bride_grooms.${idx}.nickname`]} />
                        </div>

                        {/* Gender toggle */}
                        {!isSingleSubject && (
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Kelamin</label>
                                <div className="flex gap-1.5">
                                    {['pria', 'wanita'].map((g) => (
                                        <button key={g} type="button" onClick={() => update(idx, 'gender', g)}
                                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${data.bride_grooms[idx].gender === g
                                                ? 'bg-[#E5654B] text-white shadow-sm shadow-orange-500/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}>{g === 'pria' ? 'Pria' : 'Wanita'}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Parent info */}
                        <div className="grid grid-cols-3 gap-2">
                            <Field label="Putra/Putri ke-" value={data.bride_grooms[idx].child_order}
                                onChange={(v) => update(idx, 'child_order', v)} placeholder="Pertama"
                                error={errors[`bride_grooms.${idx}.child_order`]} />
                            <Field label="Nama Ayah" value={data.bride_grooms[idx].father_name}
                                onChange={(v) => update(idx, 'father_name', v)}
                                error={errors[`bride_grooms.${idx}.father_name`]} />
                            <Field label="Nama Ibu" value={data.bride_grooms[idx].mother_name}
                                onChange={(v) => update(idx, 'mother_name', v)}
                                error={errors[`bride_grooms.${idx}.mother_name`]} />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Bio Singkat</label>
                            <textarea value={data.bride_grooms[idx].bio || ''}
                                onChange={(e) => update(idx, 'bio', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-orange-300 focus:border-[#e87058] resize-none shadow-inner bg-gray-50/20"
                                rows={2} placeholder="Sedikit tentang diri Anda..." />
                        </div>

                        {/* Social Media */}
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Sosial Media</p>

                            <div className="space-y-1.5">
                                {visibleSocmed[idx].map(key => {
                                    const opt = SOCMED_OPTIONS.find(o => o.key === key);
                                    if (!opt) return null;
                                    const Icon = opt.icon;
                                    return (
                                        <div key={key} className="flex items-center gap-1.5 animate-scale-in">
                                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-100 ${opt.color}`}>
                                                <Icon size={14} />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.bride_grooms[idx][key] || ''}
                                                onChange={(e) => update(idx, key, e.target.value)}
                                                placeholder={opt.placeholder}
                                                className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-orange-300 focus:border-[#e87058]"
                                            />
                                            <button type="button" onClick={() => removeSocmed(idx, key)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors">
                                                <XIcon size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {getAvailableSocmed(idx).length > 0 && (
                                <div className="relative mt-1.5">
                                    <button type="button"
                                        onClick={() => {
                                            setShowSocmedPicker(prev => {
                                                const next = [...prev];
                                                next[idx] = !next[idx];
                                                return next;
                                            });
                                        }}
                                        className="flex items-center gap-1 text-[11px] text-[#c24b33] font-bold hover:text-[#b03a24] py-1 transition-colors">
                                        <Plus size={12} /> Tambah Sosmed
                                    </button>

                                    {showSocmedPicker[idx] && (
                                        <div className="absolute left-0 top-full mt-0.5 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1.5 min-w-[180px] animate-scale-in">
                                            {getAvailableSocmed(idx).map(opt => {
                                                const Icon = opt.icon;
                                                return (
                                                    <button key={opt.key} type="button"
                                                        onClick={() => addSocmed(idx, opt.key)}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left transition-colors">
                                                        <Icon size={14} className={opt.color} />
                                                        <span className="text-xs text-gray-700 font-medium">{opt.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full mt-3 py-3 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                        {processing ? (
                            <span>Menyimpan...</span>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Simpan Data</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* ═══ PREMIUM CENTRED MEDIA PICKER MODAL POPUP ═══ */}
            {showPickerForIndex !== null && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">Pilih Foto</h3>
                                <p className="text-[10px] text-gray-400">Pilih dari album yang ada atau unggah foto baru</p>
                            </div>
                            <button 
                                onClick={() => setShowPickerForIndex(null)}
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
                                                            <span className="text-[10px]">✓</span>
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
                                onClick={() => setShowPickerForIndex(null)}
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

function Field({ label, value, onChange, required, placeholder, error }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
            <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} required={required}
                placeholder={placeholder}
                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 ${error ? 'border-red-300 focus:ring-red-300 focus:border-red-400' : 'border-gray-200 focus:ring-orange-300 focus:border-[#e87058]'}`} />
            {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        </div>
    );
}
