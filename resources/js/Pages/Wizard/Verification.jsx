import { Head, useForm, router } from '@inertiajs/react';
import WizardLayout from '@/Layouts/WizardLayout';
import { ShieldCheck } from 'lucide-react';

export default function Verification({ step, isVerified }) {
    const { post, processing } = useForm();

    const handleContinue = () => {
        post(route('wizard.verification.complete'));
    };

    return (
        <WizardLayout currentStep={step} title="Verifikasi Akun">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <ShieldCheck size={40} className="text-emerald-500" />
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">Verifikasi Akun</h2>

                {isVerified ? (
                    <>
                        <p className="text-gray-500 text-sm mb-6">Nomor Anda telah terverifikasi. Lanjutkan ke langkah berikutnya.</p>
                        <button
                            onClick={handleContinue}
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Lanjutkan →
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-gray-500 text-sm mb-6">Silakan verifikasi nomor WhatsApp Anda terlebih dahulu.</p>
                        <button
                            onClick={() => router.visit(route('verification.otp.show'))}
                            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                        >
                            Verifikasi via WhatsApp
                        </button>
                    </>
                )}
            </div>
        </WizardLayout>
    );
}
