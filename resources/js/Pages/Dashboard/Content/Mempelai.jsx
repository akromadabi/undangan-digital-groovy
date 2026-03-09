import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Instagram, Youtube, Facebook, Twitter, Plus, X as XIcon, Globe } from 'lucide-react';

const SOCMED_OPTIONS = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@username atau link', color: 'text-pink-500' },
    { key: 'tiktok', label: 'TikTok', icon: Globe, placeholder: '@username atau link', color: 'text-gray-800' },
    { key: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: '@username atau link', color: 'text-sky-500' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'Username atau link', color: 'text-blue-600' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'Link channel', color: 'text-red-500' },
];

const emptyBrideGroom = {
    full_name: '', nickname: '', father_name: '', mother_name: '',
    gender: 'wanita', photo: '', bio: '', instagram: '', tiktok: '', twitter: '', facebook: '', youtube: '', child_order: '',
};

export default function Mempelai({ brideGrooms }) {
    const { flash } = usePage().props;

    const initial = brideGrooms?.length === 2
        ? brideGrooms
        : [{ ...emptyBrideGroom, gender: 'wanita' }, { ...emptyBrideGroom, gender: 'pria' }];

    const { data, setData, post, processing, errors } = useForm({
        bride_grooms: initial,
    });

    const [uploading, setUploading] = useState([false, false]);

    // Track which social media fields are visible per person
    const [visibleSocmed, setVisibleSocmed] = useState(() =>
        initial.map(bg => SOCMED_OPTIONS.filter(opt => bg[opt.key]).map(opt => opt.key))
    );
    const [showSocmedPicker, setShowSocmedPicker] = useState([false, false]);

    const update = (index, field, value) => {
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
        update(personIndex, key, '');
    };

    const getAvailableSocmed = (personIndex) =>
        SOCMED_OPTIONS.filter(opt => !visibleSocmed[personIndex].includes(opt.key));

    const handlePhotoUpload = async (index, file) => {
        if (!file) return;
        const u = [...uploading]; u[index] = true; setUploading(u);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'mempelai');

        try {
            const res = await fetch(route('upload'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData,
            });
            const result = await res.json();
            update(index, 'photo', result.url);
        } catch (e) {
            console.error(e);
        }
        const u2 = [...uploading]; u2[index] = false; setUploading(u2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('content.mempelai.save'));
    };

    return (
        <DashboardLayout title="Mempelai">
            <Head title="Mempelai" />
            <div className="max-w-4xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Data Mempelai</div>
                        <div className="text-blue-600 text-xs mt-0.5">Isi data kedua mempelai. Data ini akan ditampilkan di section mempelai pada undangan.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[0, 1].map((idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">{data.bride_grooms[idx].gender === 'wanita' ? '👰' : '🤵'}</span>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {data.bride_grooms[idx].gender === 'wanita' ? 'Mempelai Wanita' : 'Mempelai Pria'}
                                    </h3>
                                </div>

                                {/* Photo */}
                                <div className="text-center">
                                    <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 mb-3">
                                        {data.bride_grooms[idx].photo ? (
                                            <img src={data.bride_grooms[idx].photo} alt="Foto" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                                                {data.bride_grooms[idx].gender === 'wanita' ? '👰' : '🤵'}
                                            </div>
                                        )}
                                    </div>
                                    <label className="inline-block px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 cursor-pointer transition-colors">
                                        {uploading[idx] ? 'Uploading...' : '📷 Upload Foto'}
                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={(e) => handlePhotoUpload(idx, e.target.files[0])} />
                                    </label>
                                </div>

                                {/* Name fields */}
                                <Field label="Nama Lengkap *" value={data.bride_grooms[idx].full_name}
                                    onChange={(v) => update(idx, 'full_name', v)} required />
                                <Field label="Nama Panggilan" value={data.bride_grooms[idx].nickname}
                                    onChange={(v) => update(idx, 'nickname', v)} />

                                {/* Gender toggle */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Jenis Kelamin</label>
                                    <div className="flex gap-2">
                                        {['pria', 'wanita'].map((g) => (
                                            <button key={g} type="button" onClick={() => update(idx, 'gender', g)}
                                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${data.bride_grooms[idx].gender === g
                                                    ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}>{g === 'pria' ? '🤵 Pria' : '👰 Wanita'}</button>
                                        ))}
                                    </div>
                                </div>

                                <Field label="Putra/Putri ke-" value={data.bride_grooms[idx].child_order}
                                    onChange={(v) => update(idx, 'child_order', v)} placeholder="Contoh: Pertama" />
                                <Field label="Nama Ayah" value={data.bride_grooms[idx].father_name}
                                    onChange={(v) => update(idx, 'father_name', v)} />
                                <Field label="Nama Ibu" value={data.bride_grooms[idx].mother_name}
                                    onChange={(v) => update(idx, 'mother_name', v)} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Bio Singkat</label>
                                    <textarea value={data.bride_grooms[idx].bio || ''}
                                        onChange={(e) => update(idx, 'bio', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none"
                                        rows={2} placeholder="Sedikit tentang diri Anda..." />
                                </div>

                                {/* Social Media with + button */}
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Sosial Media</p>

                                    <div className="space-y-2">
                                        {visibleSocmed[idx].map(key => {
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
                                                        value={data.bride_grooms[idx][key] || ''}
                                                        onChange={(e) => update(idx, key, e.target.value)}
                                                        placeholder={opt.placeholder}
                                                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                                                    />
                                                    <button type="button" onClick={() => removeSocmed(idx, key)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <XIcon size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {getAvailableSocmed(idx).length > 0 && (
                                        <div className="relative mt-2">
                                            <button type="button"
                                                onClick={() => {
                                                    const updated = [...showSocmedPicker];
                                                    updated[idx] = !updated[idx];
                                                    setShowSocmedPicker(updated);
                                                }}
                                                className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold hover:text-emerald-700 py-1.5">
                                                <Plus size={14} /> Tambah Media Sosial
                                            </button>

                                            {showSocmedPicker[idx] && (
                                                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-[200px]">
                                                    {getAvailableSocmed(idx).map(opt => {
                                                        const Icon = opt.icon;
                                                        return (
                                                            <button key={opt.key} type="button"
                                                                onClick={() => addSocmed(idx, opt.key)}
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
                        ))}
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : '💾 Simpan Data Mempelai'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}

function Field({ label, value, onChange, required, placeholder, small }) {
    return (
        <div>
            <label className={`block font-medium text-gray-600 mb-1 ${small ? 'text-xs' : 'text-sm'}`}>{label}</label>
            <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} required={required}
                placeholder={placeholder}
                className={`w-full border border-gray-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 ${small ? 'py-2' : 'py-2.5'}`} />
        </div>
    );
}
