import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

// Mock wishes list for the builder preview
const MOCK_WISHES = [
    { name: 'Rian & Dita', message: 'Selamat menempuh hidup baru untuk kedua mempelai! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.' },
    { name: 'Budi Santoso', message: 'Happy wedding! Semoga cinta kalian terus bersemi hingga akhir hayat. Maaf belum bisa hadir langsung karena masih di luar kota.' },
    { name: 'Siti Rahma', message: 'Selamat yaa! Akhirnya hari bahagia ini tiba juga. Semoga acaranya lancar dan sukses selalu.' }
];

export default function RsvpFormRenderer({ settings = {}, activeBreakpoint = 'desktop', globalSettings = {} }) {
    const layoutModel = settings.layoutModel || 'card'; // 'card' | 'minimal' | 'inline'
    
    // Fonts resolution
    let titleFontFamily = settings.titleFontFamily || 'default';
    if (titleFontFamily === 'default') {
        titleFontFamily = globalSettings?.fonts?.heading || 'Playfair Display';
    }

    let bodyFontFamily = settings.bodyFontFamily || 'default';
    if (bodyFontFamily === 'default') {
        bodyFontFamily = globalSettings?.fonts?.body || 'Inter';
    }

    const buttonText = settings.buttonText || 'Kirim Konfirmasi Kehadiran';
    const buttonBg = settings.buttonBg || '#E5654B';
    const buttonTextColor = settings.buttonTextColor || '#ffffff';
    
    // Label and card styling
    const labelColor = settings.labelColor || '#374151';
    const formBg = settings.formBg || '#ffffff';
    const formBorderColor = settings.formBorderColor || '#e5e7eb';
    const borderRadius = settings.borderRadius || '16px';
    const padding = getResponsiveSetting(settings.padding, activeBreakpoint, '20');

    const isCard = layoutModel === 'card';
    const isMinimal = layoutModel === 'minimal';
    const isInline = layoutModel === 'inline';

    const cardStyle = {
        backgroundColor: isCard ? formBg : 'transparent',
        border: isCard ? `1px solid ${formBorderColor}` : 'none',
        borderRadius: isCard ? borderRadius : '0px',
        padding: isCard ? `${padding}px` : '0px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
        boxShadow: isCard ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' : 'none'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        fontWeight: '700',
        color: labelColor,
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontFamily: `"${titleFontFamily}", sans-serif`
    };

    const getInputStyle = () => {
        const base = {
            width: '100%',
            padding: '10px 12px',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            outline: 'none',
            marginBottom: '16px',
            color: '#1f2937',
            transition: 'all 0.2s',
            fontFamily: `"${bodyFontFamily}", sans-serif`
        };

        if (isInline) {
            return {
                ...base,
                borderWidth: '0 0 2px 0',
                borderColor: '#e5e7eb',
                borderRadius: '0px',
                paddingLeft: '4px',
                paddingRight: '4px',
                backgroundColor: 'transparent'
            };
        }

        return {
            ...base,
            border: '1px solid #d1d5db',
            borderRadius: '8px'
        };
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        fontSize: '13px',
        fontWeight: 'bold',
        color: buttonTextColor,
        backgroundColor: buttonBg,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        fontFamily: `"${titleFontFamily}", sans-serif`
    };

    return (
        <div style={cardStyle} className="rsvp-form-card">
            {/* Name field */}
            <div>
                <label style={labelStyle}>Nama Tamu</label>
                <input 
                    type="text" 
                    placeholder="Masukkan nama Anda..." 
                    style={getInputStyle()}
                    disabled 
                />
            </div>

            {/* Attendance field */}
            <div>
                <label style={labelStyle}>Konfirmasi Kehadiran</label>
                <select style={getInputStyle()} disabled defaultValue="hadir">
                    <option value="hadir">Ya, Saya Akan Hadir</option>
                    <option value="tidak_hadir">Maaf, Saya Tidak Bisa Hadir</option>
                    <option value="ragu">Masih Ragu-Ragu</option>
                </select>
            </div>

            {/* Wishes/Comments field */}
            <div>
                <label style={labelStyle}>Ucapan & Doa Restu</label>
                <textarea 
                    placeholder="Tulis ucapan selamat & doa restu Anda..." 
                    rows={4} 
                    style={{ ...getInputStyle(), resize: 'none' }}
                    disabled
                />
            </div>

            {/* Submit Button Mockup */}
            <button type="button" style={buttonStyle}>
                {buttonText}
            </button>

            {/* Wishes List Mockup (Combined inside RSVP form widget) */}
            <div className="border-t border-gray-100 pt-4 mt-6 text-left w-full">
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
