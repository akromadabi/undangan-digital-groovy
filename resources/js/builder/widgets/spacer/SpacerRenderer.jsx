import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function SpacerRenderer({ settings = {}, activeBreakpoint = 'desktop' }) {
    const height = getResponsiveSetting(settings.height, activeBreakpoint, '30');

    const style = {
        height: `${height}px`,
        width: '100%'
    };

    return <div style={style} className="spacer-widget-space" />;
}
