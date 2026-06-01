import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Mail, 
    PenTool, 
    Link2, 
    Sparkles, 
    User, 
    Gift, 
    Heart, 
    Waves, 
    Gamepad2, 
    Cpu, 
    Lightbulb, 
    TreePine, 
    Eye, 
    Lock, 
    ChevronLeft,
    ChevronDown,
    Info,
    Image,
    Check
} from 'lucide-react';

/* ─── Step bar ─── */
const STEPS = [
    { number: 1, label: 'Pilih Template', icon: Mail },
    { number: 2, label: 'Isi Detail & Tautan', icon: PenTool },
    { number: 3, label: 'Unggah Foto', icon: Image },
];

const typeColors = {
    anniversary: 'border-pink-400 bg-pink-50 text-pink-700',
    birthday:    'border-amber-400 bg-amber-50 text-amber-700',
    graduation:  'border-blue-400 bg-blue-50 text-blue-700',
    wedding:     'border-purple-400 bg-purple-50 text-purple-700',
};

const templateGradients = {
    stillwithyou:     'from-[#0d0915] via-[#1b102b] to-[#09090b]',
    giftforanita:     'from-[#1e050d] via-[#4c1125] to-[#07060a]',
    cosmicdrift:      'from-[#0b0c10] via-[#1f2833] to-[#0b0c10]',
    etherealwhispers: 'from-[#fdf8f5] via-[#faebf0] to-[#f5dae2]',
};

const templateIcons = {
    stillwithyou:     Sparkles,
    giftforanita:     Gift,
    cosmicdrift:      Sparkles,
    etherealwhispers: Heart,
};

const DRAFT_KEY = 'buat_kartu_draft';

/* ─── Layout ─── */
function CardWizardLayout({ step, children, appName }) {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <Head title={`Buat Kartu Ucapan — Langkah ${step}`} />

            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/katalog-kartu" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#E5654B] to-[#c24b33] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            <Mail className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800 hidden sm:block">{appName}</span>
                    </Link>
                    <Link href="/katalog-kartu" className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" />
                        Kembali ke Katalog
                    </Link>
                </div>
            </header>

            {/* Stepper */}
            <div className="bg-white border-b border-gray-200 py-6">
                <div className="max-w-xl mx-auto px-6 relative z-0">
                    {/* Background line */}
                    <div className="absolute top-5 left-[44px] right-[44px] h-[3px] bg-gray-100 z-0 rounded-full" />
                    {/* Active line progress */}
                    <div 
                        className="absolute top-5 left-[44px] right-[44px] h-[3px] bg-gradient-to-r from-[#E5654B] to-[#c24b33] transition-all duration-500 z-0 rounded-full origin-left" 
                        style={{ transform: `scaleX(${(step - 1) / (STEPS.length - 1)})` }}
                    />
                    
                    <div className="relative flex justify-between z-10">
                        {STEPS.map((s) => {
                            const isActive = step === s.number;
                            const isCompleted = step > s.number;
                            const IconComponent = s.icon;
                            return (
                                <div key={s.number} className="flex flex-col items-center flex-1 relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isCompleted 
                                            ? 'bg-[#E5654B] text-white shadow-[0_0_10px_rgba(229,101,75,0.25)]' 
                                            : isActive 
                                                ? 'bg-[#E5654B] text-white ring-4 ring-orange-100/90 font-bold shadow-[0_0_12px_rgba(229,101,75,0.35)]' 
                                                : 'bg-white border-2 border-gray-200 text-gray-400'
                                    }`}>
                                        {isCompleted ? (
                                            <Check className="w-5 h-5 text-white stroke-[3px]" />
                                        ) : (
                                            <IconComponent className="w-4 h-4" />
                                        )}
                                    </div>
                                    <span className={`mt-2.5 text-[11px] font-bold transition-colors tracking-wide ${
                                        isActive || isCompleted ? 'text-[#c24b33]' : 'text-gray-400'
                                    }`}>
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="text-center py-6 text-xs text-gray-400">
                © {new Date().getFullYear()} Undangan Digital {appName}. All rights reserved.
            </footer>
        </div>
    );
}

/* ─── Step 1: Pilih Template ─── */
function Step1Template({ templates, value, onChange, onNext }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-orange-50 text-[#E5654B] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Pilih Template Kartu</h2>
                <p className="text-gray-400 text-sm mt-1">Pilih tampilan yang cocok untuk momen spesialmu</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {templates.map(tpl => {
                    const thumbnail = tpl.thumbnail
                        ? (tpl.thumbnail.startsWith('http') || tpl.thumbnail.startsWith('/') ? tpl.thumbnail : `/storage/${tpl.thumbnail}`)
                        : null;
                    const isSelected = value === tpl.slug;
                    return (
                        <button
                            key={tpl.slug}
                            type="button"
                            onClick={() => onChange(tpl.slug)}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 text-left group ${
                                isSelected
                                    ? 'border-[#E5654B] shadow-lg shadow-orange-100 scale-[1.02]'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                        >
                            {/* Thumbnail */}
                            <div className={`h-24 ${thumbnail ? '' : `bg-gradient-to-br ${templateGradients[tpl.slug] || 'from-gray-900 to-gray-700'}`} relative overflow-hidden flex items-center justify-center`}>
                                {thumbnail ? (
                                    <img src={thumbnail} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    (() => {
                                        const IconComp = templateIcons[tpl.slug] || Mail;
                                        return <IconComp className="w-8 h-8 text-white/50" />;
                                    })()
                                )}
                                {isSelected && (
                                    <div className="absolute inset-0 bg-[#E5654B]/20 flex items-center justify-center">
                                        <div className="w-6 h-6 bg-[#E5654B] rounded-full flex items-center justify-center text-white">
                                            ✓
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-2">
                                <p className="text-xs font-bold text-gray-800 truncate">{tpl.name}</p>
                                <div className="flex flex-wrap gap-0.5 mt-1">
                                    {(tpl.type || []).slice(0, 2).map(t => (
                                        <span key={t} className="text-[8px] font-semibold px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded-full">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={onNext}
                disabled={!value}
                className="w-full py-3 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Lanjutkan →
            </button>
        </div>
    );
}

/* ─── Step 2: Data, Pesan & Link ─── */
function Step2Content({ types, data, onChange, onBack, onNext, appName }) {
    const messages = data.messages;
    
    // States for custom url check
    const [customUrl, setCustomUrl] = useState(data.custom_url || '');
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState(null);

    const addMsg  = () => messages.length < 5 && onChange('messages', [...messages, '']);
    const removeMsg = i => onChange('messages', messages.filter((_, idx) => idx !== i));
    const updateMsg = (i, val) => { const m = [...messages]; m[i] = val; onChange('messages', m); };

    // Auto-suggest custom URL based on recipient name (only if URL is empty)
    useEffect(() => {
        if (!data.custom_url && data.recipient_name) {
            const suggested = data.recipient_name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
                .slice(0, 30);
            setCustomUrl(suggested);
            onChange('custom_url', suggested);
        }
    }, [data.recipient_name]);

    // Sync custom URL back to parent state
    const handleUrlChange = (val) => {
        const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setCustomUrl(clean);
        setAvailable(null);
        onChange('custom_url', clean);
    };

    // Debounce check for custom URL availability
    useEffect(() => {
        if (customUrl.length < 3) { setAvailable(null); return; }
        const t = setTimeout(async () => {
            setChecking(true);
            try {
                const res = await axios.get(`/api/check-card-url?url=${customUrl}`);
                setAvailable(res.data.available);
            } catch {
                setAvailable(null);
            } finally {
                setChecking(false);
            }
        }, 500);
        return () => clearTimeout(t);
    }, [customUrl]);

    const valid = data.recipient_name.trim().length >= 2 && 
                  data.sender_name.trim().length >= 2 && 
                  messages.some(m => m.trim().length > 0) &&
                  customUrl.length >= 3 &&
                  available === true;

    const borderClass = checking ? 'border-gray-200'
        : available === true ? 'border-[#E5654B] focus-within:border-[#c24b33]'
        : available === false ? 'border-red-400 focus-within:border-red-500'
        : customUrl.length >= 3 ? 'border-gray-300'
        : 'border-gray-200';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-orange-50 text-[#E5654B] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <PenTool className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Isi Data & Tautan Kartu</h2>
                <p className="text-gray-400 text-sm mt-1">Lengkapi data pengirim, penerima, pesan, serta alamat link unik kartu Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column: Recipient, Sender, Dropdown, Link */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 border-b pb-2 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gray-500" /> Informasi Kartu & Tautan
                    </h3>
                    
                    {/* Type Dropdown */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Jenis Ucapan</label>
                        <div className="relative">
                            <select
                                value={data.type}
                                onChange={e => onChange('type', e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#E5654B] focus:ring-2 focus:ring-orange-100 outline-none transition-all appearance-none bg-white font-medium text-gray-700"
                            >
                                {Object.entries(types).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Recipient */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Nama Penerima <span className="text-[#E5654B]">*</span></label>
                        <input
                            type="text"
                            value={data.recipient_name}
                            onChange={e => onChange('recipient_name', e.target.value)}
                            placeholder="Contoh: Bunda Tersayang, Kakak Anisa..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#E5654B] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        />
                    </div>

                    {/* Sender */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Nama Pengirim <span className="text-[#E5654B]">*</span></label>
                        <input
                            type="text"
                            value={data.sender_name}
                            onChange={e => onChange('sender_name', e.target.value)}
                            placeholder="Contoh: Dari Anak-anak Tercinta..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#E5654B] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        />
                    </div>

                    {/* Custom URL */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Alamat Link Kartu <span className="text-[#E5654B]">*</span></label>
                        <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors ${borderClass}`}>
                            <span className="bg-gray-50 px-3 py-2.5 text-xs text-gray-400 border-r whitespace-nowrap">
                                {typeof window !== 'undefined' ? window.location.origin.replace(/https?:\/\//, '') : 'groovy'}/card/
                            </span>
                            <input
                                type="text"
                                value={customUrl}
                                onChange={e => handleUrlChange(e.target.value)}
                                placeholder="nama-penerima"
                                className="flex-1 px-3 py-2.5 text-sm outline-none border-none focus:ring-0"
                            />
                        </div>
                        <div className="min-h-[24px] mt-1 px-1 text-[11px]">
                            {checking && <span className="text-gray-400 flex items-center gap-1"><span className="w-2.5 h-2.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin inline-block" />Memeriksa...</span>}
                            {!checking && available === true && <span className="text-emerald-600 font-semibold">✓ Link tersedia!</span>}
                            {!checking && available === false && <span className="text-red-500 font-semibold">✗ Link sudah dipakai, coba yang lain</span>}
                            {!checking && customUrl.length > 0 && customUrl.length < 3 && <span className="text-amber-500">⚠ Minimal 3 karakter</span>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Messages */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 border-b pb-2 flex items-center gap-1.5">
                        <PenTool className="w-4 h-4 text-gray-500" /> Isi Pesan Ucapan
                    </h3>
                    
                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                        {messages.map((msg, i) => (
                            <div key={i} className="relative group">
                                <textarea
                                    value={msg}
                                    onChange={e => updateMsg(i, e.target.value)}
                                    placeholder={`Pesan ${i + 1}... (mis: "Selamat bertambah usia ya!")`}
                                    rows={2}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-[#E5654B] focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                                />
                                {messages.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMsg(i)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-red-50 hover:bg-red-100 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {messages.length < 5 && (
                        <button type="button" onClick={addMsg} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:border-[#E5654B] hover:text-[#E5654B] transition-all flex items-center justify-center gap-1.5">
                            Tambah Pesan
                        </button>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <button type="button" onClick={onBack} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm">
                    ← Kembali
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!valid}
                    className="flex-1 py-3 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                >
                    <span>Lanjutkan →</span>
                </button>
            </div>
        </div>
    );
}

/* ─── Step 3: Unggah Foto ─── */
function Step3Upload({ data, onChange, onBack, onSubmit, submitting, error }) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    const handlePhotoUpload = async (files) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadProgress('Mengunggah foto...');
        
        const file = files[0];
        const fd = new FormData();
        fd.append('photo', file);

        try {
            const res = await axios.post(route('upload'), fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.url) {
                onChange('photo_url', res.data.url);
                onChange('photos', [res.data.url]);
            }
        } catch (err) {
            console.error('Failed to upload photo:', err);
            alert('Gagal mengunggah foto. Silakan coba lagi.');
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
    };

    const handleRemovePhoto = () => {
        onChange('photo_url', '');
        onChange('photos', []);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 max-w-lg mx-auto">
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-orange-50 text-[#E5654B] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Image className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Unggah Foto (Opsional)</h2>
                <p className="text-gray-400 text-sm mt-1">Tambahkan foto kenangan atau visual pendukung untuk mempercantik kartu</p>
            </div>

            {/* Upload Area */}
            <div className="mb-6">
                {data.photo_url ? (
                    <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border border-orange-100 shadow-md group">
                        <img src={data.photo_url} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                        >
                            <span>Hapus Foto</span>
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#E5654B] hover:bg-orange-50/10 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="w-10 h-10 bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-[#E5654B] rounded-xl flex items-center justify-center mb-3 transition-colors">
                                <Image className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 group-hover:text-gray-700">
                                {uploading ? uploadProgress : 'Pilih atau Seret Foto'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Format JPG, PNG, atau WEBP (Maks. 2MB)</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => handlePhotoUpload(e.target.files)}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                )}
            </div>

            {/* Professional Notice */}
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100/60 text-xs text-[#b03a24] mb-6 flex items-start gap-2.5 leading-relaxed">
                <Info className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-sm">✨ Informasi Penting</p>
                    <p className="mt-1">
                        Seluruh data yang Anda masukkan saat ini (termasuk pilihan template, nama penerima/pengirim, isi ucapan, foto, dan tautan unik) bersifat fleksibel. Anda dapat memperbarui, melengkapi, atau menyunting kembali seluruh informasi ini kapan saja secara bebas melalui <strong>Dasbor Akun</strong> Anda setelah proses pembuatan selesai.
                    </p>
                </div>
            </div>

            {error && <p className="text-red-500 text-xs font-semibold mb-4 text-center">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-3">
                <button type="button" onClick={onBack} disabled={submitting || uploading} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm disabled:opacity-50">
                    ← Kembali
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting || uploading}
                    className="flex-1 py-3 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                >
                    {submitting ? (
                        'Menyimpan...'
                    ) : (
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>Buat Kartu Sekarang</span>
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

/* ─── Main Wizard ─── */
export default function BuatKartu({ templates = [], typeOptions = {}, appName = 'Groovy', defaultTemplate = '' }) {
    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState({
        template:       defaultTemplate || (templates[0]?.slug ?? 'stillwithyou'),
        type:           'anniversary',
        recipient_name: '',
        sender_name:    '',
        custom_url:     '',
        messages:       [''],
        photo_url:      '',
        photos:         [],
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const setField = (key, val) => setDraft(prev => ({ ...prev, [key]: val }));

    // Restore draft from localStorage if coming back from login
    useEffect(() => {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setDraft(prev => ({ ...prev, ...parsed }));
                setStep(2); // Jump to data & link step (step 2)
            } catch {}
        }
    }, []);

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');

        try {
            const res = await axios.post('/greeting-card', {
                ...draft,
                title: `Kartu untuk ${draft.recipient_name}`,
            });
            // Clear draft on successful save
            localStorage.removeItem(DRAFT_KEY);
            
            if (res.data?.redirect) {
                window.location.href = res.data.redirect;
            } else {
                window.location.href = '/greeting-card';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan kartu. Coba lagi.');
            setSubmitting(false);
        }
    };

    return (
        <CardWizardLayout step={step} appName={appName}>
            {step === 1 && (
                <Step1Template
                    templates={templates}
                    value={draft.template}
                    onChange={val => setField('template', val)}
                    onNext={() => setStep(2)}
                />
            )}
            {step === 2 && (
                <Step2Content
                    types={typeOptions}
                    data={draft}
                    onChange={setField}
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                    appName={appName}
                />
            )}
            {step === 3 && (
                <Step3Upload
                    data={draft}
                    onChange={setField}
                    onBack={() => setStep(2)}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    error={error}
                />
            )}
        </CardWizardLayout>
    );
}
