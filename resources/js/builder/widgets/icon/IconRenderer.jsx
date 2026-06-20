import React from 'react';
import * as LucideIcons from 'lucide-react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function IconRenderer({ settings = {}, activeBreakpoint = 'desktop' }) {
    const iconName = settings.icon || 'Heart';
    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'center');
    const color = settings.color || '#E5654B';
    const size = getResponsiveSetting(settings.size, activeBreakpoint, '32');
    
    // Background options
    const bgType = settings.bgType || 'none'; // 'none' | 'circle' | 'square'
    const bgColor = settings.bgColor || 'transparent';
    const padding = getResponsiveSetting(settings.padding, activeBreakpoint, '10');

    // Dynamically retrieve the Lucide Icon component
    const IconComponent = LucideIcons[iconName] || LucideIcons.HelpCircle;

    const containerStyle = {
        display: 'flex',
        justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        width: '100%'
    };

    const wrapperStyle = bgType !== 'none' ? {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        padding: `${padding}px`,
        borderRadius: bgType === 'circle' ? '50%' : '8px',
        color: color,
        lineHeight: 1
    } : {
        color: color,
        display: 'inline-flex'
    };

    return (
        <div style={containerStyle}>
            <div style={wrapperStyle}>
                <IconComponent size={parseInt(size) || 32} strokeWidth={1.8} />
            </div>
        </div>
    );
}
