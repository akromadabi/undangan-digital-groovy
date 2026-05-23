import React, { useState } from 'react';

export default function CustomDomainTutorialModal({ isOpen, onClose, centralHost = 'undangan.com' }) {
    if (!isOpen) return null;

    const [copiedField, setCopiedField] = useState(null);

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-300"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl border border-[#e8e5e0] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ede8] bg-[#faf9f6]">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </span>
                        <h3 className="text-base font-bold text-[#1a1a1a]">Tutorial Setup Custom Domain</h3>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="text-[#999] hover:text-[#555] p-1.5 rounded-lg hover:bg-[#f5f3f0] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6 max-h-[calc(90vh-120px)]">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Ikuti langkah-langkah berikut untuk menghubungkan domain kustom Anda ke sistem kami:
                    </p>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm flex items-center justify-center border border-emerald-100">
                                1
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-[#1a1a1a]">Login Ke DNS Manager</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Masuk ke akun registrar tempat Anda membeli domain (seperti Cloudflare, Niagahoster, Rumahweb, Namecheap, dll).
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm flex items-center justify-center border border-emerald-100">
                                2
                            </div>
                            <div className="space-y-2 w-full">
                                <h4 className="text-sm font-bold text-[#1a1a1a]">Tambahkan DNS Record Baru</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-2">
                                    Buat record DNS baru dengan tipe <strong>CNAME</strong> dan arahkan ke server kami:
                                </p>

                                <div className="bg-[#faf9f6] border border-[#e8e5e0] rounded-xl p-4 space-y-3 font-mono text-xs w-full max-w-sm">
                                    <div className="flex items-center justify-between border-b border-[#f0ede8] pb-2">
                                        <span className="text-gray-400">Type</span>
                                        <span className="font-bold text-[#1a1a1a]">CNAME</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-[#f0ede8] pb-2">
                                        <span className="text-gray-400">Name</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-[#1a1a1a]">@</span>
                                            <span className="text-[10px] text-gray-400 font-sans">(atau subdomain)</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Target</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-emerald-600">{centralHost}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleCopy(centralHost, 'target')}
                                                className="px-2 py-0.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-[10px] font-sans font-medium transition-colors"
                                            >
                                                {copiedField === 'target' ? 'Tersalin!' : 'Salin'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm flex items-center justify-center border border-emerald-100">
                                3
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-[#1a1a1a]">Tunggu Propagasi DNS</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Proses propagasi DNS biasanya memerlukan waktu sekitar <strong>5 - 30 menit</strong> tergantung provider domain Anda.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm flex items-center justify-center border border-emerald-100">
                                4
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-[#1a1a1a]">Simpan Perubahan</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Setelah DNS aktif, masukkan nama domain kustom Anda di kolom input yang disediakan (contoh: <code>domainanda.com</code> atau <code>undangan.domainanda.com</code>) lalu klik Simpan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#f0ede8] bg-[#faf9f6] flex justify-end">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-5 py-2 bg-[#E5654B] text-white hover:bg-[#d55a42] rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                        Saya Mengerti
                    </button>
                </div>
            </div>
        </div>
    );
}
