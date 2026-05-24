import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, reseller = null }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#FAF6F4] p-4 sm:p-6 overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E5654B] opacity-[0.08] blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E5654B] opacity-[0.08] blur-[80px] pointer-events-none" />
            
            <div className="w-full max-w-md z-10 page-enter">
                {/* Logo and Brand Name */}
                <div className="flex flex-col items-center mb-6">
                    {reseller ? (
                        <>
                            {reseller.brand_logo ? (
                                <img src={reseller.brand_logo} alt={reseller.brand_name} className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105" />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5654B] to-[#d4523a] flex items-center justify-center shadow-lg shadow-[#E5654B]/20 transition-transform duration-300 hover:scale-105">
                                    <span className="text-white text-2xl font-bold">{reseller.brand_name.charAt(0)}</span>
                                </div>
                            )}
                            <h2 className="mt-4 text-2xl font-bold text-gray-800 tracking-tight font-sans">{reseller.brand_name}</h2>
                            <p className="text-sm text-gray-500 mt-1">Masuk untuk mengelola undangan Anda</p>
                        </>
                    ) : (
                        <>
                            <Link href="/" className="transition-transform duration-300 hover:scale-105">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5654B] to-[#d4523a] flex items-center justify-center shadow-lg shadow-[#E5654B]/20">
                                    <span className="text-white text-2xl font-bold font-serif">G</span>
                                </div>
                            </Link>
                            <h2 className="mt-4 text-2xl font-bold text-gray-800 tracking-tight font-sans">Groovy Invitation</h2>
                            <p className="text-sm text-gray-500 mt-1">Platform Undangan Digital Premium</p>
                        </>
                    )}
                </div>

                {/* Main Card */}
                <div className="w-full bg-white/90 backdrop-blur-xl border border-white/80 px-6 py-8 sm:px-8 rounded-3xl shadow-xl shadow-gray-200/50">
                    {children}
                </div>
                
                {/* Footer Credits */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} {reseller ? reseller.brand_name : 'Groovy Invitation'}. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
