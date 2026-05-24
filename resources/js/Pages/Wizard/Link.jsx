import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import WizardLayout from '@/Layouts/WizardLayout';

export default function LinkStep({ step, currentSlug }) {
    const { data, setData, post, processing, errors } = useForm({
        slug: currentSlug || '',
    });
    
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState(null);

    // Auto check availability as user types
    useEffect(() => {
        if (data.slug.length < 3) {
            setAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setChecking(true);
            try {
                const res = await fetch(route('wizard.link.check'), {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content 
                    },
                    body: JSON.stringify({ slug: data.slug }),
                });
                const resData = await res.json();
                setAvailable(resData.available);
            } catch (e) {
                setAvailable(null);
            } finally {
                setChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [data.slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.slug.length < 3 || processing) return;

        // If not already verified as available, check now
        if (available === null) {
            setChecking(true);
            try {
                const res = await fetch(route('wizard.link.check'), {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content 
                    },
                    body: JSON.stringify({ slug: data.slug }),
                });
                const resData = await res.json();
                setAvailable(resData.available);
                if (resData.available) {
                    post(route('wizard.link.save'));
                }
            } catch (e) {
                setAvailable(false);
            } finally {
                setChecking(false);
            }
        } else if (available) {
            post(route('wizard.link.save'));
        }
    };

    return (
        <WizardLayout currentStep={step} title="Pilih Link">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-lg mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Pilih Link Undangan</h2>
                    <p className="text-gray-400 text-sm mt-1">Isi seperti contoh ini: "MiraRandi" atau "Mira-Randi"</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-emerald-400 transition-colors">
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

                    {/* Auto-check status info */}
                    <div className="min-h-[24px] mt-2 px-1">
                        {checking && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                                Memeriksa ketersediaan...
                            </p>
                        )}
                        {!checking && available === true && (
                            <p className="text-xs text-emerald-600 font-medium">✓ Link tersedia!</p>
                        )}
                        {!checking && available === false && (
                            <p className="text-xs text-red-500 font-medium">✗ Link sudah dipakai. Silakan gunakan kombinasi nama lain.</p>
                        )}
                        {errors.slug && (
                            <p className="text-xs text-red-500 font-medium">✗ {errors.slug}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || checking || data.slug.length < 3 || available === false}
                        className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {processing ? 'Menyimpan...' : checking ? 'Memeriksa...' : 'Lanjutkan →'}
                    </button>
                </form>
            </div>
        </WizardLayout>
    );
}
