import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

// Mock wishes list for the builder preview
const MOCK_WISHES = [
    { name: 'Rian & Dita', message: 'Selamat menempuh hidup baru untuk kedua mempelai! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.' },
    { name: 'Budi Santoso', message: 'Happy wedding! Semoga cinta kalian terus bersemi hingga akhir hayat. Maaf belum bisa hadir langsung karena masih di luar kota.' },
    { name: 'Siti Rahma', message: 'Selamat yaa! Akhirnya hari bahagia ini tiba juga. Semoga acaranya lancar dan sukses selalu.' }
];

export default function WishesListRenderer({ settings = {}, activeBreakpoint = 'desktop', globalSettings = {} }) {
    const title = settings.title || 'Ucapan & Doa Restu';
    const description = settings.description || 'Berikan ucapan selamat dan doa restu terbaik Anda untuk kedua mempelai.';
    const placeholderName = settings.placeholderName || 'Nama Anda';
    const placeholderMessage = settings.placeholderMessage || 'Tulis ucapan dan doa...';
    const buttonText = settings.buttonText || 'Kirim Ucapan';
    const buttonBg = settings.buttonBg || '#E5654B';
    const buttonTextColor = settings.buttonTextColor || '#ffffff';
    
    // Styling resolution
    const cardBg = settings.cardBg || '#ffffff';
    const borderRadius = settings.borderRadius || '16px';
    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'center');

    // Fonts resolution
    let titleFontFamily = settings.titleFontFamily || 'default';
    if (titleFontFamily === 'default') {
        titleFontFamily = globalSettings?.fonts?.heading || 'Playfair Display';
    }

    let bodyFontFamily = settings.bodyFontFamily || 'default';
    if (bodyFontFamily === 'default') {
        bodyFontFamily = globalSettings?.fonts?.body || 'Inter';
    }

    const containerStyle = {
        backgroundColor: cardBg,
        borderRadius: borderRadius,
        padding: '24px',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        fontFamily: `"${bodyFontFamily}", sans-serif`,
        textAlign: alignment
    };

    return (
        <div style={containerStyle} className="wishes-list-card border border-gray-100 text-left">
            {title && (
                <h3 
                    style={{ 
                        fontFamily: `"${titleFontFamily}", sans-serif`,
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: globalSettings?.colors?.primary || '#E5654B',
                        marginBottom: '8px',
                        textAlign: alignment
                    }}
                >
                    {title}
                </h3>
            )}
            
            {description && (
                <p 
                    style={{ textAlign: alignment }}
                    className="text-xs text-gray-500 mb-6 leading-relaxed"
                >
                    {description}
                </p>
            )}

            {/* Wishes Form Mockup */}
            <div className="space-y-3 mb-6 text-left">
                <div>
                    <input 
                        type="text" 
                        placeholder={placeholderName} 
                        style={{ fontFamily: `"${bodyFontFamily}", sans-serif` }}
                        className="w-full text-xs border border-gray-200 rounded-xl px-4 py-2.5 outline-none bg-gray-50/50 focus:border-indigo-500 focus:bg-white transition-all"
                        disabled 
                    />
                </div>
                
                <div className="relative">
                    <textarea 
                        placeholder={placeholderMessage} 
                        rows={3}
                        style={{ fontFamily: `"${bodyFontFamily}", sans-serif`, resize: 'none' }}
                        className="w-full text-xs border border-gray-200 rounded-xl px-4 py-2.5 outline-none bg-gray-50/50 focus:border-indigo-500 focus:bg-white transition-all"
                        disabled 
                    />
                </div>

                <button 
                    type="button"
                    style={{ 
                        backgroundColor: buttonBg, 
                        color: buttonTextColor,
                        fontFamily: `"${titleFontFamily}", sans-serif`,
                        borderRadius: '10px'
                    }}
                    className="w-full py-2.5 text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-not-allowed"
                >
                    {buttonText}
                </button>
            </div>

            {/* Wishes List Mockup */}
            <div className="border-t border-gray-100 pt-4 text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 block">Ucapan Tamu (Contoh Preview)</span>
                
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {MOCK_WISHES.map((w, index) => (
                        <div 
                            key={index} 
                            className="p-3 bg-gray-50/80 rounded-xl border border-gray-100/50"
                        >
                            <div 
                                style={{ 
                                    color: globalSettings?.colors?.primary || '#E5654B',
                                    fontFamily: `"${titleFontFamily}", sans-serif`
                                }}
                                className="font-bold text-xs"
                            >
                                {w.name}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {w.message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
