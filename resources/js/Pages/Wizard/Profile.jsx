import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import WizardLayout from '@/Layouts/WizardLayout';
import { Instagram, Youtube, Facebook, Twitter, Plus, X, Globe } from 'lucide-react';

const SOCMED_OPTIONS = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@username atau link', color: 'text-pink-500' },
    { key: 'tiktok', label: 'TikTok', icon: Globe, placeholder: '@username atau link', color: 'text-gray-800' },
    { key: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: '@username atau link', color: 'text-sky-500' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'Username atau link', color: 'text-blue-600' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'Link channel', color: 'text-red-500' },
];

const defaultBrideGroom = {
    full_name: '', nickname: '', father_name: '', mother_name: '',
    gender: 'pria', instagram: '', tiktok: '', twitter: '', facebook: '', youtube: '', child_order: '',
};

export default function Profile({ step, brideGrooms, eventType = 'wedding' }) {
    const isSingleSubject = !['wedding', 'anniversary'].includes(eventType);
    const size = isSingleSubject ? 1 : 2;

    const initial = brideGrooms?.length === size
        ? brideGrooms
        : (isSingleSubject 
            ? [{ ...defaultBrideGroom, gender: 'pria' }]
            : [{ ...defaultBrideGroom, gender: 'wanita' }, { ...defaultBrideGroom, gender: 'pria' }]);

    const { data, setData, post, processing, errors } = useForm({
        bride_grooms: initial,
    });

    // Track which social media fields are visible per person
    const [visibleSocmed, setVisibleSocmed] = useState(() =>
        initial.map(bg => SOCMED_OPTIONS.filter(opt => bg[opt.key]).map(opt => opt.key))
    );

    const [showSocmedPicker, setShowSocmedPicker] = useState(() => Array(size).fill(false));

    const updateField = (index, field, value) => {
        const updated = [...data.bride_grooms];
        updated[index] = { ...updated[index], [field]: value };
        setData('bride_grooms', updated);
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
        updateField(personIndex, key, '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('wizard.profile.save', undefined, false));
    };

    const getAvailableSocmed = (personIndex) =>
        SOCMED_OPTIONS.filter(opt => !visibleSocmed[personIndex].includes(opt.key));

    const getCardTitle = (index) => {
        if (eventType === 'wedding') {
            return `Calon Mempelai ${index + 1}`;
        }
        if (eventType === 'anniversary') {
            return `Pasangan ${index + 1}`;
        }
        if (eventType === 'graduation') {
            return 'Data Wisudawan / Wisudawati';
        }
        if (eventType === 'birthday') {
            return 'Data Yang Berulang Tahun';
        }
        if (eventType === 'aqiqah') {
            return 'Data Bayi / Anak Tercinta';
        }
        if (eventType === 'circumcision') {
            return 'Data Anak yang Dikhitan';
        }
        return 'Data Objek Acara';
    };

    const getLayoutClasses = () => {
        if (isSingleSubject) {
            return 'max-w-xl mx-auto grid grid-cols-1 gap-6';
        }
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    };

    return (
        <WizardLayout currentStep={step} title={isSingleSubject ? 'Data Pemilik Acara' : 'Data Mempelai'}>
            <form onSubmit={handleSubmit}>
                {/* Global Error Banner */}
                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs font-semibold">
                        Gagal menyimpan profil! Silakan periksa kolom input Anda di bawah.
                    </div>
                )}

                <div className={getLayoutClasses()}>
                    {Array.from({ length: size }).map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{getCardTitle(index)}</h3>

                            <div className="space-y-4">
                                <InputField 
                                    label="Nama Lengkap" 
                                    value={data.bride_grooms[index].full_name}
                                    onChange={(v) => updateField(index, 'full_name', v)} 
                                    required
                                    error={errors[`bride_grooms.${index}.full_name`]}
                                />
                                <InputField 
                                    label="Nama Panggilan" 
                                    value={data.bride_grooms[index].nickname}
                                    onChange={(v) => updateField(index, 'nickname', v)}
                                    error={errors[`bride_grooms.${index}.nickname`]}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <InputField 
                                        label="Putra/Putri ke-" 
                                        value={data.bride_grooms[index].child_order}
                                        placeholder="Pertama" 
                                        onChange={(v) => updateField(index, 'child_order', v)}
                                        error={errors[`bride_grooms.${index}.child_order`]}
                                    />
                                    <InputField 
                                        label="Nama Ayah" 
                                        value={data.bride_grooms[index].father_name}
                                        placeholder="Nama Ayah" 
                                        onChange={(v) => updateField(index, 'father_name', v)}
                                        error={errors[`bride_grooms.${index}.father_name`]}
                                    />
                                    <InputField 
                                        label="Nama Ibu" 
                                        value={data.bride_grooms[index].mother_name}
                                        placeholder="Nama Ibu" 
                                        onChange={(v) => updateField(index, 'mother_name', v)}
                                        error={errors[`bride_grooms.${index}.mother_name`]}
                                    />
                                </div>

                                {!isSingleSubject && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Jenis Kelamin</label>
                                        <div className="flex gap-2">
                                            {['pria', 'wanita'].map((g) => (
                                                <button key={g} type="button"
                                                    onClick={() => updateField(index, 'gender', g)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${data.bride_grooms[index].gender === g
                                                        ? 'bg-[#E5654B] text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}>
                                                    {g === 'pria' ? 'Pria' : 'Wanita'}
                                                </button>
                                            ))}
                                        </div>
                                        {errors[`bride_grooms.${index}.gender`] && (
                                            <p className="text-red-500 text-[10px] mt-1 font-medium">{errors[`bride_grooms.${index}.gender`]}</p>
                                        )}
                                    </div>
                                )}

                                {/* Social Media Section */}
                                <div className="pt-2 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 mb-3">Media Sosial (tidak wajib)</p>

                                    <div className="space-y-2">
                                        {visibleSocmed[index].map(key => {
                                            const opt = SOCMED_OPTIONS.find(o => o.key === key);
                                            if (!opt) return null;
                                            const Icon = opt.icon;
                                            return (
                                                <div key={key} className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 ${opt.color}`}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={data.bride_grooms[index][key] || ''}
                                                        onChange={(e) => updateField(index, key, e.target.value)}
                                                        placeholder={opt.placeholder}
                                                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:border-[#E5654B]"
                                                    />
                                                    <button type="button" onClick={() => removeSocmed(index, key)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Add Social Media Button */}
                                    {getAvailableSocmed(index).length > 0 && (
                                        <div className="relative mt-2">
                                            <button type="button"
                                                onClick={() => {
                                                    setShowSocmedPicker(prev => {
                                                        const next = [...prev];
                                                        next[index] = !next[index];
                                                        return next;
                                                    });
                                                }}
                                                className="flex items-center gap-1.5 text-xs text-[#E5654B] font-semibold hover:text-[#c24b33] py-1.5">
                                                <Plus size={14} /> Tambah Media Sosial
                                            </button>

                                            {showSocmedPicker[index] && (
                                                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-[200px]">
                                                    {getAvailableSocmed(index).map(opt => {
                                                        const Icon = opt.icon;
                                                        return (
                                                            <button key={opt.key} type="button"
                                                                onClick={() => addSocmed(index, opt.key)}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors">
                                                                <Icon size={16} className={opt.color} />
                                                                <span className="text-sm text-gray-700">{opt.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 mt-6 max-w-xl mx-auto sm:max-w-none">
                    <button type="button" onClick={() => router.visit(route('wizard.link', undefined, false))}
                        className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-all text-center">
                        ← Kembali
                    </button>
                    <button type="submit" disabled={processing}
                        className="flex-[2] py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50">
                        Lanjutkan →
                    </button>
                </div>
            </form>
        </WizardLayout>
    );
}

function InputField({ label, value, onChange, required, small, placeholder, error }) {
    return (
        <div>
            <label className={`block font-medium text-gray-600 mb-1 ${small ? 'text-xs' : 'text-sm'}`}>{label}</label>
            <input 
                type="text" 
                value={value || ''} 
                onChange={(e) => onChange(e.target.value)} 
                required={required} 
                placeholder={placeholder || ''}
                className={`w-full border rounded-xl px-4 text-sm focus:ring-2 focus:ring-orange-300 focus:border-[#E5654B] ${small ? 'py-2' : 'py-2.5'} ${
                    error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`} 
            />
            {error && <p className="text-red-500 text-[10px] mt-1 font-medium">{error}</p>}
        </div>
    );
}
