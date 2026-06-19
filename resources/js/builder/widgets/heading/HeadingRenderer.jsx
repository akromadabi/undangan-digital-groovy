import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function HeadingRenderer({ settings = {}, activeBreakpoint = 'desktop', globalSettings = {} }) {
    // Resolve responsive settings
    const text = settings.text || 'Masukkan Judul Baru';
    const Tag = settings.tag || 'h2';
    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'center');
    const textColor = settings.textColor || 'inherit';
    const fontSize = getResponsiveSetting(settings.fontSize, activeBreakpoint, '32px');
    const fontWeight = settings.fontWeight || 'bold';
    const lineHeight = settings.lineHeight || '1.2';
    
    // Resolve fontFamily (use global font settings if default)
    let fontFamily = settings.fontFamily || 'default';
    if (fontFamily === 'default') {
        fontFamily = globalSettings?.fonts?.primary || 'Playfair Display';
    }

    const style = {
        textAlign: alignment,
        color: textColor,
        fontSize: fontSize,
        fontWeight: fontWeight,
        lineHeight: lineHeight,
        fontFamily: `"${fontFamily}", sans-serif`,
        margin: 0,
        padding: 0
    };

    return <Tag style={style}>{text}</Tag>;
}
