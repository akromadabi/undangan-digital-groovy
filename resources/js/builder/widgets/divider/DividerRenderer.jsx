import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function DividerRenderer({ settings = {}, activeBreakpoint = 'desktop' }) {
    const lineStyle = settings.lineStyle || 'solid';
    const color = settings.color || '#e5e7eb';
    const weight = settings.weight || '2px';
    const width = getResponsiveSetting(settings.width, activeBreakpoint, '100%');
    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'center');
    const gapTop = getResponsiveSetting(settings.gapTop, activeBreakpoint, '15');
    const gapBottom = getResponsiveSetting(settings.gapBottom, activeBreakpoint, '15');

    const containerStyle = {
        display: 'flex',
        justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        width: '100%',
        paddingTop: `${gapTop}px`,
        paddingBottom: `${gapBottom}px`
    };

    const dividerStyle = {
        borderTopWidth: lineStyle === 'double' ? '0px' : weight,
        borderTopStyle: lineStyle === 'double' ? 'none' : lineStyle,
        borderTopColor: lineStyle === 'double' ? 'transparent' : color,
        borderBottomWidth: lineStyle === 'double' ? weight : '0px',
        borderBottomStyle: lineStyle === 'double' ? 'double' : 'none',
        borderBottomColor: lineStyle === 'double' ? color : 'transparent',
        width: width,
        height: lineStyle === 'double' ? weight : '0px',
    };

    return (
        <div style={containerStyle}>
            <div style={dividerStyle} />
        </div>
    );
}
