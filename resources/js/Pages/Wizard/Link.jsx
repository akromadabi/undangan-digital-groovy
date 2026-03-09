import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import WizardLayout from '@/Layouts/WizardLayout';

export default function LinkStep({ step, currentSlug, domain }) {
    const [slug, setSlug] = useState(currentSlug || '');
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState(null);

    const { post, processing } = useForm();

    const checkAvailability = async () => {
        if (slug.length < 3) return;
        setChecking(true);
        try {
            const res = await fetch(route('wizard.link.check'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: JSON.stringify({ slug }),
            });
            const data = await res.json();
            setAvailable(data.available);
            setSlug(data.slug);
        } catch (e) {
            setAvailable(null);
        }
        setChecking(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!available && available !== null) return;

        const form = useForm({ slug });
        form.post(route('wizard.link.save'));
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
                            {window.location.origin.replace(/https?:\/\//, '')}/u/
                        </span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => { setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setAvailable(null); }}
                            placeholder="nama-pasangan"
                            className="flex-1 px-4 py-3 text-sm outline-none border-none focus:ring-0"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={checkAvailability}
                        disabled={checking || slug.length < 3}
                        className="w-full mt-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                        {checking ? 'Mengecek...' : 'Check Link'}
                    </button>

                    {available !== null && (
                        <p className={`mt-3 text-sm font-medium ${available ? 'text-emerald-600' : 'text-red-500'}`}>
                            {available ? '✅ Link is available' : '❌ Link sudah dipakai'}
                        </p>
                    )}

                    {available && (
                        <button
                            type="button"
                            onClick={() => {
                                const formEl = document.createElement('form');
                                formEl.method = 'POST';
                                formEl.action = route('wizard.link.save');
                                const csrf = document.createElement('input');
                                csrf.type = 'hidden';
                                csrf.name = '_token';
                                csrf.value = document.querySelector('meta[name="csrf-token"]')?.content;
                                const slugInput = document.createElement('input');
                                slugInput.type = 'hidden';
                                slugInput.name = 'slug';
                                slugInput.value = slug;
                                formEl.appendChild(csrf);
                                formEl.appendChild(slugInput);
                                document.body.appendChild(formEl);
                                formEl.submit();
                            }}
                            className="w-full mt-3 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            Buat Undangan <span>→</span>
                        </button>
                    )}
                </form>
            </div>
        </WizardLayout>
    );
}
