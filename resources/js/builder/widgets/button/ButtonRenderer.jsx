import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function ButtonRenderer({ settings = {}, activeBreakpoint = 'desktop' }) {
    const text = settings.text || 'Klik di Sini';
    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'center');
    const backgroundColor = settings.backgroundColor || '#E5654B';
    const textColor = settings.textColor || '#ffffff';
    const borderRadius = settings.borderRadius || '8px';
    const paddingX = settings.paddingX || '24px';
    const paddingY = settings.paddingY || '12px';
    const fontSize = settings.fontSize || '14px';

    const containerStyle = {
        display: 'flex',
        justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        width: '100%',
    };

    const buttonStyle = {
        backgroundColor: backgroundColor,
        color: textColor,
        borderRadius: borderRadius,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        fontSize: fontSize,
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        textDecoration: 'none'
    };

    return (
        <div style={containerStyle}>
            <span style={buttonStyle}>{text}</span>
        </div>
    );
}
