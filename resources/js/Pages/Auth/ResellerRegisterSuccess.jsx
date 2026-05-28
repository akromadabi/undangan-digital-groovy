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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-12">
                {/* Stunning glow behind the success card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-lg relative z-10 text-center">
                    {/* Success Icon */}
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-8 animate-bounce duration-3000">
                        <CheckCircle2 size={56} className="text-emerald-400" />
                    </div>

                    {/* Card container */}
                    <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-left space-y-6">
                        
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-black text-white">Pendaftaran Reseller Berhasil!</h1>
                            <p className="text-xs font-bold text-[#E5654B] tracking-widest uppercase">Langkah Terakhir: Aktivasi Akun</p>
                        </div>

                        <p className="text-sm text-white/60 leading-relaxed text-center">
                            Selamat! Akun agensi reseller Anda telah berhasil dibuat. Demi keamanan dan verifikasi kemitraan, akun Anda saat ini dalam status **Menunggu Aktivasi** dari Super Admin.
                        </p>

                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3.5">
                            <h3 className="text-xs font-black text-white uppercase tracking-wider">Langkah selanjutnya:</h3>
                            <ul className="text-xs text-white/55 space-y-2 leading-relaxed">
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
                                className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Mail size={16} />
                                Kirim Email Admin
                            </button>
                        </div>

                        {/* Back to Home Link */}
                        <div className="text-center pt-4 border-t border-white/5">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white/40 hover:text-white transition-colors"
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
