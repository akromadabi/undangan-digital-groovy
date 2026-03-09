import { Head, useForm } from '@inertiajs/react';
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
    gender: 'wanita', bio: '', instagram: '', tiktok: '', twitter: '', facebook: '', youtube: '',
};

export default function Profile({ step, brideGrooms }) {
    const initial = brideGrooms?.length === 2
        ? brideGrooms
        : [{ ...defaultBrideGroom, gender: 'wanita' }, { ...defaultBrideGroom, gender: 'pria' }];

    const { data, setData, post, processing, errors } = useForm({
        bride_grooms: initial,
    });

    // Track which social media fields are visible per person
    const [visibleSocmed, setVisibleSocmed] = useState(() =>
        initial.map(bg => SOCMED_OPTIONS.filter(opt => bg[opt.key]).map(opt => opt.key))
    );

    const [showSocmedPicker, setShowSocmedPicker] = useState([false, false]);

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
        setShowSocmedPicker([false, false]);
    };

    const removeSocmed = (personIndex, key) => {
        const updated = [...visibleSocmed];
        updated[personIndex] = updated[personIndex].filter(k => k !== key);
        setVisibleSocmed(updated);
        updateField(personIndex, key, '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('wizard.profile.save'));
    };

    const getAvailableSocmed = (personIndex) =>
        SOCMED_OPTIONS.filter(opt => !visibleSocmed[personIndex].includes(opt.key));

    return (
        <WizardLayout currentStep={step} title="Data Mempelai">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[0, 1].map((index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Calon Mempelai {index + 1}</h3>

                            <div className="space-y-4">
                                <InputField label="Nama Lengkap" value={data.bride_grooms[index].full_name}
                                    onChange={(v) => updateField(index, 'full_name', v)} required />
                                <InputField label="Nama Panggilan" value={data.bride_grooms[index].nickname}
                                    onChange={(v) => updateField(index, 'nickname', v)} />
                                <InputField label="Nama Ayah" value={data.bride_grooms[index].father_name}
                                    onChange={(v) => updateField(index, 'father_name', v)} />
                                <InputField label="Nama Ibu" value={data.bride_grooms[index].mother_name}
                                    onChange={(v) => updateField(index, 'mother_name', v)} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Jenis Kelamin</label>
                                    <div className="flex gap-2">
                                        {['pria', 'wanita'].map((g) => (
                                            <button key={g} type="button"
                                                onClick={() => updateField(index, 'gender', g)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${data.bride_grooms[index].gender === g
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}>
                                                {g === 'pria' ? 'Pria' : 'Wanita'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Bio</label>
                                    <textarea value={data.bride_grooms[index].bio || ''}
                                        onChange={(e) => updateField(index, 'bio', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none"
                                        rows={3} />
                                </div>

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
                                                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
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
                                                    const updated = [...showSocmedPicker];
                                                    updated[index] = !updated[index];
                                                    setShowSocmedPicker(updated);
                                                }}
                                                className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold hover:text-emerald-700 py-1.5">
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

                <button type="submit" disabled={processing}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50">
                    Kirim
                </button>
            </form>
        </WizardLayout>
    );
}

function InputField({ label, value, onChange, required, small }) {
    return (
        <div>
            <label className={`block font-medium text-gray-600 mb-1 ${small ? 'text-xs' : 'text-sm'}`}>{label}</label>
            <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} required={required}
                className={`w-full border border-gray-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 ${small ? 'py-2' : 'py-2.5'}`} />
        </div>
    );
}
