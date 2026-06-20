import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function MapRenderer({ settings = {}, activeBreakpoint = 'desktop' }) {
    const address = settings.address || 'Jakarta, Indonesia';
    const height = getResponsiveSetting(settings.height, activeBreakpoint, '300');
    const zoom = settings.zoom || 14;

    const encodedAddress = encodeURIComponent(address);
    const iframeSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

    const containerStyle = {
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        border: '1px solid #f3f4f6',
        height: `${height}px`
    };

    return (
        <div style={containerStyle}>
            {address ? (
                <iframe
                    width="100%"
                    height="100%"
                    id="gmap_canvas"
                    src={iframeSrc}
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    title="Google Maps"
                />
            ) : (
                <div className="bg-gray-100 flex flex-col items-center justify-center p-8 text-center text-xs text-gray-400 h-full">
                    <svg className="w-8 h-8 text-gray-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Masukkan Alamat Lokasi di Panel Kanan
                </div>
            )}
        </div>
    );
}
