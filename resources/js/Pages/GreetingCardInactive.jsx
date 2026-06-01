import { Head, Link } from '@inertiajs/react';
import { Mail, Sparkles, AlertCircle } from 'lucide-react';

export default function GreetingCardInactive({ recipient_name, sender_name, type_label, appName, bg_gradient }) {
    return (
        <div className={`min-h-screen bg-gradient-to-br ${bg_gradient || 'from-[#0d0915] via-[#1b102b] to-[#09090b]'} text-white flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans`}>
            
            {/* Premium backdrop glowing orb */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-r from-[#E5654B]/30 to-purple-500/20 rounded-full blur-[100px] pointer-events-none z-0" />
            
            {/* Header */}
            <header className="w-full max-w-lg flex justify-between items-center z-10 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-sm">
                        <Mail className="w-4 h-4 text-[#E5654B]" />
                    </div>
                    <span className="font-bold tracking-wide text-white/90 text-sm">{appName}</span>
                </div>
            </header>

            {/* Main Content Card */}
            <main className="w-full max-w-md my-auto z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden">
                    
                    {/* HSL premium glow effect borders */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/[0.02] pointer-events-none" />
                    
                    {/* Glowing Envelope Icon */}
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#E5654B]/20 to-purple-500/20 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner group">
                        <div className="absolute inset-0 bg-[#E5654B]/10 rounded-[24px] blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                        <Mail className="w-8 h-8 text-[#E5654B] relative z-10" />
                    </div>

                    {/* Card Title */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#E5654B] uppercase tracking-[0.2em] mb-4">
                        <Sparkles className="w-3 h-3 text-[#E5654B]" />
                        {type_label || 'Kartu Ucapan'}
                    </div>

                    {/* Main Alert Message */}
                    <h2 className="text-xl font-black tracking-tight text-white mb-2 leading-tight">
                        Kartu Ucapan Belum Aktif
                    </h2>
                    
                    <p className="text-white/60 text-xs leading-relaxed mb-6 px-2">
                        Hai! Kartu ucapan spesial dari <strong className="text-white font-semibold">{sender_name}</strong> untuk <strong className="text-white font-semibold">{recipient_name}</strong> ini baru saja dibuat dan saat ini sedang menunggu proses aktivasi atau penyelesaian pembayaran.
                    </p>

                    {/* Status Info Box */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex gap-3 text-left items-start mb-6">
                        <AlertCircle className="w-5 h-5 text-[#E5654B] shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-white/95 block">Bagi Pemilik Kartu:</span>
                            <span className="text-[10px] text-white/50 leading-relaxed block">
                                Silakan masuk ke dasbor akun Anda dan selesaikan pembayaran untuk mengaktifkan kartu ucapan ini agar dapat diakses secara publik.
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link
                        href="/login"
                        className="w-full py-3.5 bg-gradient-to-r from-[#E5654B] to-[#c24b33] hover:shadow-lg hover:shadow-orange-950/20 text-white rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-white/10"
                    >
                        Masuk ke Dasbor
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full text-center py-6 text-[10px] text-white/40 z-10 tracking-wider">
                © {new Date().getFullYear()} {appName}. Dibuat Dengan Cinta.
            </footer>
        </div>
    );
}
