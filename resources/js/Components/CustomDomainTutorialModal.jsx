import React, { useState } from 'react';

export default function CustomDomainTutorialModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [copiedField, setCopiedField] = useState(null);

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const serverIp = '157.20.159.47';

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div 
                className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100 page-enter"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAF9F6]">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-orange-100 rounded-lg text-[#c24b33]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </span>
                        <h3 className="text-base font-bold text-gray-800">Tutorial Setup Domain Kustom (aaPanel)</h3>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(90vh-120px)]">
                    
                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5654B]/10 text-[#E5654B] font-bold text-sm flex items-center justify-center border border-[#E5654B]/20">
                                1
                            </div>
                            <div className="space-y-2 w-full">
                                <h4 className="text-sm font-bold text-gray-800">Pastikan DNS sudah diarahkan ke server kami.</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Masuk ke DNS Manager provider domain Anda (seperti Cloudflare, Niagahoster, dll), lalu tambahkan record baru:
                                </p>
                                
                                <div className="bg-[#FAF9F6] border border-gray-100 rounded-xl p-4 space-y-3 font-mono text-xs w-full max-w-md">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400">Type</span>
                                        <span className="font-bold text-gray-800">A</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400">Name</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-gray-800">@</span>
                                            <span className="text-[10px] text-gray-400 font-sans">(atau subdomain)</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Value (IP Server)</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[#c24b33]">{serverIp}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleCopy(serverIp, 'ip')}
                                                className="px-2 py-0.5 bg-orange-50 text-[#c24b33] hover:bg-orange-100 rounded text-[10px] font-sans font-medium transition-colors"
                                            >
                                                {copiedField === 'ip' ? 'Tersalin!' : 'Salin'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-400 italic mt-1">
                                    Contoh: set A record <span className="font-semibold text-gray-600">sekolah.sch.id</span> &rarr; <span className="font-semibold text-gray-600">{serverIp}</span>
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5654B]/10 text-[#E5654B] font-bold text-sm flex items-center justify-center border border-[#E5654B]/20">
                                2
                            </div>
                            <div className="space-y-3 w-full">
                                <h4 className="text-sm font-bold text-gray-800">Create site untuk tenant dan masukan domain.</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Buka aaPanel &rarr; Website &rarr; Add site. Masukkan nama domain baru Anda.
                                </p>
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50 max-w-lg">
                                    <img 
                                        src="/images/tutorial/aapanel_step1.png" 
                                        alt="Add site aaPanel" 
                                        className="w-full h-auto object-contain max-h-48"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5654B]/10 text-[#E5654B] font-bold text-sm flex items-center justify-center border border-[#E5654B]/20">
                                3
                            </div>
                            <div className="space-y-3 w-full">
                                <h4 className="text-sm font-bold text-gray-800">Atur Directory ke /public.</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Site directory samakan dengan web utama. Running directory pilih <code className="bg-gray-100 text-[#E5654B] px-1 rounded">/public</code>. Centang <span className="font-semibold text-gray-700">Anti-XSS attack (open_basedir)</span> dan <span className="font-semibold text-gray-700">Write access log</span>.
                                </p>
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50 max-w-lg">
                                    <img 
                                        src="/images/tutorial/aapanel_step2.png" 
                                        alt="Setup directory aaPanel" 
                                        className="w-full h-auto object-contain max-h-56"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5654B]/10 text-[#E5654B] font-bold text-sm flex items-center justify-center border border-[#E5654B]/20">
                                4
                            </div>
                            <div className="space-y-3 w-full">
                                <h4 className="text-sm font-bold text-gray-800">Set URL rewrite ke laravel5.</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Buka pengaturan website Anda di aaPanel, pilih menu <span className="font-semibold text-gray-700">URL rewrite</span>, pilih opsi <code className="bg-gray-100 text-[#E5654B] px-1 rounded">laravel5</code> dari dropdown, lalu klik Save.
                                </p>
                                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50 max-w-lg">
                                    <img 
                                        src="/images/tutorial/aapanel_step3.png" 
                                        alt="URL rewrite aaPanel" 
                                        className="w-full h-auto object-contain max-h-56"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5654B]/10 text-[#E5654B] font-bold text-sm flex items-center justify-center border border-[#E5654B]/20">
                                5
                            </div>
                            <div className="space-y-2 w-full">
                                <h4 className="text-sm font-bold text-gray-800">Atau Buat config nginx manual (opsional)</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Jika Anda terbiasa menggunakan command line / SSH, Anda bisa mengedit konfigurasi Nginx manual via nano:
                                </p>
                                <div className="bg-gray-900 text-gray-200 border border-gray-800 rounded-xl p-3 font-mono text-xs w-full max-w-lg overflow-x-auto relative group">
                                    <div className="flex justify-between items-center text-[10px] text-gray-500 pb-1 mb-2 border-b border-gray-800">
                                        <span>TERMINAL CONFIG</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleCopy('nano /www/server/panel/vhost/nginx/domain.com.conf', 'terminal')}
                                            className="hover:text-white transition-colors"
                                        >
                                            {copiedField === 'terminal' ? 'Tersalin!' : 'Salin'}
                                        </button>
                                    </div>
                                    <code>nano /www/server/panel/vhost/nginx/domain.com.conf</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-[#FAF9F6] flex justify-end">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-5 py-2 bg-[#E5654B] text-white hover:bg-[#d55a42] rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
