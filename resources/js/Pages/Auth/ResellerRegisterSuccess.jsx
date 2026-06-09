import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Phone, Mail, ArrowRight } from 'lucide-react';

export default function ResellerRegisterSuccess({ adminWhatsapp = '6283132211830', adminEmail = 'admin@groovy.com' }) {
    
    const handleWhatsAppRedirect = () => {
        const message = encodeURIComponent(
            'Halo Admin,\nSaya baru saja mendaftar sebagai partner reseller di platform Anda. Mohon bantuan untuk aktivasi akun agensi saya.\n\nTerima kasih!'
        );
        window.open(`https://wa.me/${adminWhatsapp}?text=${message}`, '_blank');
    };

    const handleEmailRedirect = () => {
        const subject = encodeURIComponent('Aktivasi Akun Reseller Baru');
        const body = encodeURIComponent('Halo Admin,\nSaya baru saja mendaftar sebagai partner reseller. Mohon bantuannya untuk melakukan aktivasi akun agensi saya.\n\nTerima kasih.');
        window.open(`mailto:${adminEmail}?subject=${subject}&body=${body}`, '_blank');
    };

    return (
        <>
            <Head title="Pendaftaran Berhasil" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5EE] via-[#FFF0E8] to-[#FEE8D6] px-4 py-12 relative overflow-hidden">
                {/* Stunning glow behind the success card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-lg relative z-10 text-center">
                    {/* Success Icon */}
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 mb-8 animate-bounce duration-3000">
                        <CheckCircle2 size={56} className="text-emerald-500" />
                    </div>

                    {/* Card container */}
                    <div className="bg-white/95 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-8 shadow-xl text-left space-y-6">
                        
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-black text-gray-900">Pendaftaran Reseller Berhasil!</h1>
                            <p className="text-xs font-bold text-[#E5654B] tracking-widest uppercase">Langkah Terakhir: Aktivasi Akun</p>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed text-center font-medium">
                            Selamat! Akun agensi reseller Anda telah berhasil dibuat. Demi keamanan dan verifikasi kemitraan, akun Anda saat ini dalam status **Menunggu Aktivasi** dari Super Admin.
                        </p>

                        <div className="bg-orange-50/50 border border-orange-100/60 rounded-2xl p-5 space-y-3.5">
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">Langkah selanjutnya:</h3>
                            <ul className="text-xs text-gray-500 space-y-2 leading-relaxed font-semibold">
                                <li className="flex items-start gap-2">
                                    <span className="w-4.5 h-4.5 rounded-full bg-[#E5654B]/20 text-[#E5654B] flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
                                    <span>Tunggu dalam waktu 1x24 jam untuk tim kami melakukan tinjauan dan aktivasi akun Anda.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-4.5 h-4.5 rounded-full bg-[#E5654B]/20 text-[#E5654B] flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
                                    <span>Untuk mempercepat aktivasi, Anda dapat langsung menghubungi administrator utama kami secara langsung melalui kontak di bawah.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                            <button
                                onClick={handleWhatsAppRedirect}
                                className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Phone size={16} />
                                Hubungi WhatsApp
                            </button>
                            <button
                                onClick={handleEmailRedirect}
                                className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Mail size={16} />
                                Kirim Email Admin
                            </button>
                        </div>

                        {/* Back to Home Link */}
                        <div className="text-center pt-4 border-t border-orange-100/50">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-gray-400 hover:text-gray-650 transition-colors"
                            >
                                Kembali ke Beranda
                                <ArrowRight size={12} />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
