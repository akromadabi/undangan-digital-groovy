import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function LivestreamRenderer({ settings = {}, activeBreakpoint = 'desktop', globalSettings = {} }) {
    const title = settings.title || 'Siaran Langsung';
    const description = settings.description || 'Saksikan prosesi pernikahan kami secara virtual melalui siaran langsung.';
    const platform = settings.platform || 'youtube'; // youtube | zoom | meet | instagram | facebook
    const date = settings.date || 'Kamis, 31 Desember 2026';
    const time = settings.time || '08:00 WIB - Selesai';
    const buttonText = settings.buttonText || 'Nonton Live Streaming';
    const buttonBg = settings.buttonBg || '#E5654B';
    const buttonTextColor = settings.buttonTextColor || '#ffffff';
    
    // Style settings
    const cardBg = settings.cardBg || '#ffffff';
    const borderRadius = settings.borderRadius || '16px';
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
        padding: '28px 24px',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        fontFamily: `"${bodyFontFamily}", sans-serif`,
        textAlign: alignment
    };

    // Platform display helper
    const getPlatformDisplay = () => {
        switch (platform) {
            case 'youtube':
                return { name: 'YouTube Live', color: 'bg-red-50 text-red-600 border-red-100' };
            case 'zoom':
                return { name: 'Zoom Meeting', color: 'bg-blue-50 text-blue-600 border-blue-100' };
            case 'meet':
                return { name: 'Google Meet', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
            case 'instagram':
                return { name: 'Instagram Live', color: 'bg-pink-50 text-pink-600 border-pink-100' };
            default:
                return { name: 'Live Stream', color: 'bg-gray-50 text-gray-600 border-gray-100' };
        }
    };

    const plat = getPlatformDisplay();

    return (
        <div style={containerStyle} className="livestream-card border border-gray-100 relative overflow-hidden text-center">
            {/* Header Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">LIVE BROADCAST</span>
            </div>

            {title && (
                <h3 
                    style={{ 
                        fontFamily: `"${titleFontFamily}", sans-serif`,
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: globalSettings?.colors?.primary || '#E5654B',
                        marginBottom: '8px'
                    }}
                >
                    {title}
                </h3>
            )}

            {description && (
                <p className="text-xs text-gray-500 mb-5 leading-relaxed max-w-sm mx-auto">
                    {description}
                </p>
            )}

            {/* Event Details Card */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 mb-5 text-left inline-block w-full">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Saluran Penyiaran</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${plat.color}`}>
                        {plat.name}
                    </span>
                </div>
                <div className="space-y-1 text-gray-700">
                    <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-gray-400 w-16 flex-shrink-0">Tanggal:</span>
                        <span className="text-xs font-medium">{date}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-gray-400 w-16 flex-shrink-0">Waktu:</span>
                        <span className="text-xs font-medium">{time}</span>
                    </div>
                </div>
            </div>

            {/* Watch Button Mockup */}
            <button 
                type="button"
                style={{ 
                    backgroundColor: buttonBg, 
                    color: buttonTextColor,
                    fontFamily: `"${titleFontFamily}", sans-serif`,
                    borderRadius: '12px'
                }}
                className="w-full py-3 text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-not-allowed uppercase tracking-wider"
            >
                {buttonText}
            </button>
        </div>
    );
}
