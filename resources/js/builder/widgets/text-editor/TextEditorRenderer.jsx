import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function TextEditorRenderer({ settings = {}, activeBreakpoint = 'desktop', globalSettings = {} }) {
    const text = settings.text || '<p>Tulis paragraf kustom di sini...</p>';
    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'left');
    const textColor = settings.textColor || 'inherit';
    const fontSize = getResponsiveSetting(settings.fontSize, activeBreakpoint, '16px');
    const fontWeight = settings.fontWeight || 'normal';
    const lineHeight = settings.lineHeight || '1.6';
    
    // Resolve fontFamily (use global body font settings if default)
    let fontFamily = settings.fontFamily || 'default';
    if (fontFamily === 'default') {
        fontFamily = globalSettings?.fonts?.body || 'Inter';
    }

    const style = {
        textAlign: alignment,
        color: textColor,
        fontSize: fontSize,
        fontWeight: fontWeight,
        lineHeight: lineHeight,
        fontFamily: `"${fontFamily}", sans-serif`,
        width: '100%'
    };

    return (
        <div 
            style={style} 
            className="prose max-w-none text-editor-content"
            dangerouslySetInnerHTML={{ __html: text }} 
        />
    );
}
