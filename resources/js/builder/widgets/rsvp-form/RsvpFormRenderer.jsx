import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

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
        </div>
    );
}
