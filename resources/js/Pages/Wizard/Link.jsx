import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Info } from 'lucide-react';
import WizardLayout from '@/Layouts/WizardLayout';

export default function LinkStep({ step, currentSlug }) {
    const { data, setData, post, processing, errors } = useForm({
        slug: currentSlug || '',
    });
    
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState(null);

    // Slug tidak berubah dari currentSlug yang sudah disimpan = link milik sendiri
    const isUnchanged = data.slug === currentSlug && !!currentSlug;
    // Tombol aktif hanya jika: link milik sendiri, atau sudah dicek dan tersedia
    const canSubmit = isUnchanged || available === true;

    const doCheck = async (slugValue) => {
        setChecking(true);
        try {
            const res = await axios.post(route('wizard.link.check', undefined, false), {
                slug: slugValue,
            });
            setAvailable(res.data.available);
            return res.data.available;
        } catch (e) {
            console.error('Failed to check link availability:', e);
            setAvailable(null);
            return null;
        } finally {
            setChecking(false);
        }
    };

    // Auto check availability as user types (debounced 500ms)
    useEffect(() => {
        if (isUnchanged) { setAvailable(null); return; }
        if (data.slug.length < 3) { setAvailable(null); return; }

        const timer = setTimeout(() => doCheck(data.slug), 500);
        return () => clearTimeout(timer);
    }, [data.slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.slug.length < 3 || processing) return;

        if (isUnchanged) { post(route('wizard.link.save', undefined, false)); return; }

        if (available === null) {
            const ok = await doCheck(data.slug);
            if (ok) post(route('wizard.link.save', undefined, false));
        } else if (available) {
            post(route('wizard.link.save', undefined, false));
        }
    };

    // Tentukan warna border input berdasarkan status
    const borderClass = checking
        ? 'border-gray-300'
        : isUnchanged || available === true
            ? 'border-orange-400 focus-within:border-[#E5654B]'
            : available === false
                ? 'border-red-400 focus-within:border-red-500'
                : 'border-gray-200 focus-within:border-orange-400';

    // Buat saran nama alternatif jika tidak tersedia
    const makeSuggestion = (slug) => {
        const suffix = Math.floor(Math.random() * 900 + 100);
        return `${slug}-${suffix}`;
    };

    return (
        <WizardLayout currentStep={step} title="Pilih Link">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-lg mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Pilih Link Undangan</h2>
                    <p className="text-gray-400 text-sm mt-1">Isi seperti contoh ini: "MiraRandi" atau "Mira-Randi"</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors ${borderClass}`}>
                        <span className="bg-gray-50 px-4 py-3 text-sm text-gray-400 border-r whitespace-nowrap">
                            {typeof window !== 'undefined' ? window.location.origin.replace(/https?:\/\//, '') : 'undangan-digital.test'}/u/
                        </span>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => {
                                const cleanValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                setData('slug', cleanValue);
                                setAvailable(null);
                            }}
                            placeholder="nama-pasangan"
                            className="flex-1 px-4 py-3 text-sm outline-none border-none focus:ring-0"
                            required
                        />
                    </div>

                    {/* Status ketersediaan */}
                    <div className="min-h-[44px] mt-2 px-1">
                        {/* Minimal 3 karakter */}
                        {!checking && data.slug.length > 0 && data.slug.length < 3 && (
                            <p className="text-xs text-amber-600 font-medium">⚠ Link minimal 3 karakter</p>
                        )}
                        {/* Sedang memeriksa */}
                        {checking && (
                            <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block"></span>
                                Memeriksa ketersediaan...
                            </p>
                        )}
                        {/* Link milik sendiri */}
                        {!checking && isUnchanged && (
                            <p className="text-xs text-orange-600 font-medium">✓ Ini link undangan Anda saat ini</p>
                        )}
                        {/* Tersedia */}
                        {!checking && !isUnchanged && available === true && (
                            <p className="text-xs text-orange-600 font-medium">✓ Link tersedia! Klik Lanjutkan untuk menggunakannya.</p>
                        )}
                        {/* Tidak tersedia */}
                        {!checking && !isUnchanged && available === false && (
                            <div className="space-y-1">
                                <p className="text-xs text-red-500 font-medium">
                                    ✗ Link <strong>"{data.slug}"</strong> sudah digunakan. Silakan pilih nama lain.
                                </p>
                                <p className="text-xs text-gray-400">
                                    Coba misalnya: <button
                                        type="button"
                                        onClick={() => { setData('slug', makeSuggestion(data.slug)); setAvailable(null); }}
                                        className="text-orange-600 font-semibold hover:underline"
                                    >{makeSuggestion(data.slug)}</button>
                                </p>
                            </div>
                        )}
                        {/* Belum dicek (sudah 3+ karakter tapi masih waiting) */}
                        {!checking && !isUnchanged && available === null && data.slug.length >= 3 && (
                            <p className="text-xs text-gray-300">Menunggu pengecekan...</p>
                        )}
                        {errors.slug && (
                            <p className="text-xs text-red-500 font-medium mt-1">✗ {errors.slug}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || checking || data.slug.length < 3 || !canSubmit}
                        className="w-full mt-2 py-3 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? 'Menyimpan...' : checking ? 'Memeriksa...' : 'Lanjutkan →'}
                    </button>

                    <div className="mt-5 p-3.5 bg-orange-50/60 rounded-xl border border-orange-100/60 text-left text-xs text-[#b03a24] leading-relaxed">
                        <p className="font-semibold flex items-center gap-1.5 mb-1"><Info className="w-3.5 h-3.5" /> Info</p>
                        <p>Anda bisa mengubah nama link ini nanti di dashboard. Anda juga bisa mengubah dengan domain nama Anda sendiri.</p>
                    </div>
                </form>
            </div>
        </WizardLayout>
    );
}
