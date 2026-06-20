import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function TurutMengundangRenderer({ settings = {}, activeBreakpoint = 'desktop', globalSettings = {} }) {
    const title = settings.title || 'Turut Mengundang';
    const namesText = settings.names || 'Keluarga Besar Bpk. Ahmad (Jakarta)\nKeluarga Besar Ibu Siti (Bandung)\nSahabat & Rekan Kerja';
    
    // Style settings
    const textColor = settings.textColor || '#4b5563';
    const titleColor = settings.titleColor || '#1f2937';
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
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '16px',
        fontFamily: `"${bodyFontFamily}", sans-serif`,
        textAlign: alignment
    };

    // Split text into array of lines for rendering
    const nameLines = namesText.split('\n').filter(line => line.trim() !== '');

    return (
        <div style={containerStyle} className="turut-mengundang-container">
            {title && (
                <h3 
                    style={{ 
                        fontFamily: `"${titleFontFamily}", sans-serif`,
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: titleColor,
                        marginBottom: '16px',
                        letterSpacing: '0.05em',
                        textAlign: alignment
                    }}
                    className="uppercase"
                >
                    {title}
                </h3>
            )}

            {nameLines.length > 0 ? (
                <div 
                    style={{ 
                        color: textColor,
                        textAlign: alignment
                    }}
                    className="space-y-2 text-sm leading-relaxed font-medium"
                >
                    {nameLines.map((line, index) => (
                        <div key={index} className="animate-fadeIn">
                            {line}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-400 italic">Belum ada nama yang dimasukkan.</p>
            )}
        </div>
    );
}
