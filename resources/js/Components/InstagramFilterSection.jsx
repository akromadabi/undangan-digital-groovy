import React, { useState, useEffect } from 'react';

export default function InstagramFilterSection({ section, invitation, brideGrooms: passedBrideGrooms }) {
    const { custom_config = {} } = section;
    
    // Fallback values
    const filterUrl = custom_config.filter_url || '';
    const hashtag = custom_config.hashtag || 'HappyWedding';
    const instagramUsername = custom_config.instagram_username || 'ourwedding';
    const previewImage = custom_config.preview_image || null;
    const name = custom_config.name || 'Custom Instagram Filter';
    
    const [isMobile, setIsMobile] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
 
    // Resolve couple names from invitation
    const brideGrooms = passedBrideGrooms || invitation?.bride_grooms || invitation?.bride_grooms_data || [];
    const groom = brideGrooms.find(b => b.gender === 'pria');
    const bride = brideGrooms.find(b => b.gender === 'wanita');
    const coupleText = groom && bride 
        ? `${groom.nickname || groom.full_name} & ${bride.nickname || bride.full_name}`
        : invitation?.title || 'Pengantin';

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    if (!filterUrl) return null;

    const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(filterUrl)}&size=300&margin=1&ecLevel=H`;

    const handleActionClick = (e) => {
        if (!isMobile) {
            e.preventDefault();
            setShowQrModal(true);
        }
    };

    return (
        <div className="relative overflow-hidden py-16 px-4 bg-transparent w-full flex flex-col items-center">
            {/* Background elements */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-100/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 relative z-10 w-full">
                
                {/* Mockup Smartphone */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-56 h-[390px] bg-stone-950 rounded-[36px] p-2.5 shadow-2xl border-4 border-stone-800 transition-transform duration-500 hover:rotate-1">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900 rounded-b-xl z-20 flex items-center justify-center">
                            <div className="w-8 h-[2px] bg-stone-700 rounded-full mb-1" />
                        </div>
                        
                        {/* Screen */}
                        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-stone-900 flex flex-col justify-between">
                            {previewImage ? (
                                <img src={previewImage} alt="IG Filter Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-950 flex flex-col justify-center items-center text-center p-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                        <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316A2.192 2.192 0 0014.512 3.75H9.488c-.69 0-1.328.327-1.748.883l-.823 1.316zM12 9.75a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.5a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Kamera Instagram</span>
                                </div>
                            )}
                            
                            {/* Instagram UI overlay */}
                            <div className="absolute inset-0 flex flex-col justify-between p-3.5 bg-gradient-to-b from-black/40 via-transparent to-black/70 z-10">
                                <div className="flex items-center gap-2 mt-5">
                                    <div className="w-6 h-6 rounded-full border border-white/50 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-[8px] font-bold">
                                        IG
                                    </div>
                                    <div className="text-white text-[9px] font-semibold tracking-wide">@{instagramUsername.toLowerCase()}</div>
                                </div>
                                
                                <div className="flex flex-col items-center gap-2 mb-2 w-full">
                                    <div className="text-white text-[8.5px] bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-full font-serif italic border border-white/5 max-w-[90%] truncate">
                                        ✨ Wedding of {coupleText}
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-4 border-white flex items-center justify-center bg-transparent">
                                        <div className="w-7 h-7 rounded-full bg-white/95" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content info */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-bold uppercase tracking-widest">
                        📷 Instagram AR Filter
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-serif text-stone-800 leading-tight">
                        Bagikan Momen Bahagia Kami
                    </h3>
                    
                    <p className="text-stone-600 text-xs leading-relaxed max-w-sm mx-auto md:mx-0">
                        Abadikan momen kehadiran Anda menggunakan kamera Instagram dengan filter khusus pernikahan kami.
                    </p>

                    {/* Step instructions */}
                    <div className="space-y-2.5 text-stone-700 text-xs text-left max-w-xs mx-auto md:mx-0 pt-1">
                        <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                            <span>{isMobile ? 'Klik tombol di bawah untuk membuka kamera.' : 'Klik tombol untuk melihat QR Code, lalu scan dengan HP.'}</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                            <span>Ambil foto/video terbaik dengan filter custom kami.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                            <span>Posting ke Story, tag <strong className="text-stone-900">@{instagramUsername}</strong> & tagar <strong className="text-stone-900">#{hashtag}</strong>.</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <a 
                            href={filterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleActionClick}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-xs"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                            {isMobile ? 'Buka Kamera Instagram' : 'Scan QR di Layar HP'}
                        </a>
                    </div>
                </div>
            </div>

            {/* Desktop QR Modal overlay */}
            {showQrModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-[320px] w-full text-center relative border border-stone-100 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button 
                            onClick={() => setShowQrModal(false)}
                            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors text-base font-bold select-none"
                        >
                            &times;
                        </button>
                        
                        <div className="space-y-4 pt-2">
                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Scan QR Code</h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                Pindai kode ini menggunakan kamera smartphone untuk menggunakan filter Instagram pernikahan kami secara langsung.
                            </p>
                            
                            <div className="bg-stone-50 p-3 rounded-2xl inline-block border border-stone-100 shadow-inner">
                                <img src={qrCodeUrl} alt="QR Code Link Filter" className="w-40 h-40 mx-auto rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
