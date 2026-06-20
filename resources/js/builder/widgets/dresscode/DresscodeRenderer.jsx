import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function DresscodeRenderer({ settings = {}, activeBreakpoint = 'desktop', globalSettings = {} }) {
    const title = settings.title || 'Dresscode / Tata Busana';
    const description = settings.description || 'Demi kenyamanan bersama, para tamu undangan dihimbau untuk mengenakan pakaian yang sopan dengan nuansa warna berikut:';
    const colors = settings.colors || ['#F5EBE0', '#D6CCC2', '#E3D5CA', '#D5BDAF', '#4A3E3D'];
    
    // Style settings
    const cardBg = settings.cardBg || '#faf9f6';
    const borderRadius = settings.borderRadius || '12px';
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
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        fontFamily: `"${bodyFontFamily}", sans-serif`,
        textAlign: alignment
    };

    const flexAlign = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center';

    return (
        <div style={containerStyle} className="dresscode-card border border-gray-100 text-center">
            {/* Coat Hanger Icon */}
            <div className={`flex ${flexAlign} mb-3 text-[#E5654B]`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 17a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3c0-2-1.5-3.5-3.5-3.5h-13C4.5 13.5 3 15 3 17z" />
                    <path d="M12 13.5V9a3.5 3.5 0 1 1 5 3" />
                </svg>
            </div>

            {title && (
                <h3 
                    style={{ 
                        fontFamily: `"${titleFontFamily}", sans-serif`,
                        fontSize: '20px',
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
                    className="text-xs text-gray-500 mb-5 leading-relaxed"
                >
                    {description}
                </p>
            )}

            {/* Colors list */}
            {colors.length > 0 && (
                <div className={`flex flex-wrap items-center gap-3.5 ${flexAlign}`}>
                    {colors.map((color, index) => (
                        <div key={index} className="flex flex-col items-center gap-1 group/color">
                            <span 
                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm block transition-all duration-200 hover:scale-110 cursor-pointer" 
                                style={{ 
                                    backgroundColor: color,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                                title={color}
                            />
                            <span className="text-[9px] font-mono text-gray-400 group-hover/color:text-gray-600 transition-colors uppercase">
                                {color}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
