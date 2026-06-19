import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function ImageRenderer({ settings = {}, activeBreakpoint = 'desktop' }) {
    const url = settings.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800';
    const alt = settings.alt || 'Wedding Image';
    const width = getResponsiveSetting(settings.width, activeBreakpoint, '100%');
    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'center');
    const borderRadius = settings.borderRadius || '8px';
    const borderType = settings.borderType || 'none';
    const borderColor = settings.borderColor || '#e5e7eb';
    const borderWidth = settings.borderWidth || '1px';

    const containerStyle = {
        display: 'flex',
        justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        width: '100%',
    };

    const imageStyle = {
        width: width,
        height: 'auto',
        borderRadius: borderRadius,
        borderStyle: borderType,
        borderColor: borderColor,
        borderWidth: borderType !== 'none' ? borderWidth : '0px',
        maxWidth: '100%',
        objectFit: 'cover'
    };

    return (
        <div style={containerStyle}>
            <img src={url} alt={alt} style={imageStyle} />
        </div>
    );
}
