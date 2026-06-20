import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function GuestNameRenderer({ settings = {}, activeBreakpoint = 'desktop', guest, globalSettings = {} }) {
    const prefix = settings.prefix || 'Kepada Yth. Bapak/Ibu/Saudara/i:';
    const suffix = settings.suffix || 'Di Tempat';
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

    // Guest Name Resolution
    const guestName = guest?.name || settings.placeholderName || 'Nama Tamu Undangan';

    // Styling
    const textColor = settings.textColor || '#1f2937';
    const prefixColor = settings.prefixColor || '#6b7280';
    const nameFontSize = getResponsiveSetting(settings.nameFontSize, activeBreakpoint, '24px');
    const labelFontSize = getResponsiveSetting(settings.labelFontSize, activeBreakpoint, '14px');
    const fontWeight = settings.fontWeight || 'bold';

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        textAlign: alignment,
        width: '100%',
        padding: '20px',
        backgroundColor: settings.cardBg || 'rgba(0, 0, 0, 0.02)',
        borderRadius: settings.borderRadius || '12px',
        border: settings.border ? `1px solid ${settings.borderColor || '#e5e7eb'}` : 'none'
    };

    return (
        <div style={containerStyle} className="guest-greeting-card">
            {prefix && (
                <span 
                    style={{ 
                        color: prefixColor, 
                        fontSize: labelFontSize, 
                        marginBottom: '8px',
                        fontWeight: '500',
                        fontFamily: `"${bodyFontFamily}", sans-serif`
                    }}
                >
                    {prefix}
                </span>
            )}
            <h3 
                style={{ 
                    color: textColor, 
                    fontSize: nameFontSize, 
                    fontWeight: fontWeight,
                    margin: '4px 0',
                    lineHeight: '1.2',
                    fontFamily: `"${titleFontFamily}", sans-serif`
                }}
            >
                {guestName}
            </h3>
            {suffix && (
                <span 
                    style={{ 
                        color: prefixColor, 
                        fontSize: labelFontSize, 
                        marginTop: '8px',
                        fontWeight: '500',
                        fontFamily: `"${bodyFontFamily}", sans-serif`
                    }}
                >
                    {suffix}
                </span>
            )}
        </div>
    );
}
