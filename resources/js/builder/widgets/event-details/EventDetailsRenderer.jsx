import React, { useState } from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';
import { Calendar, Clock, MapPin, Map, Database } from 'lucide-react';

export default function EventDetailsRenderer({ settings = {}, activeBreakpoint = 'desktop', events, globalSettings = {} }) {
    const layoutModel = settings.layoutModel || 'grid'; // 'grid' | 'stack' | 'tabs'
    const isDynamic = settings.sourceType === 'dynamic';

    // Fonts resolution
    let titleFontFamily = settings.titleFontFamily || 'default';
    if (titleFontFamily === 'default') {
        titleFontFamily = globalSettings?.fonts?.heading || 'Playfair Display';
    }

    let bodyFontFamily = settings.bodyFontFamily || 'default';
    if (bodyFontFamily === 'default') {
        bodyFontFamily = globalSettings?.fonts?.body || 'Inter';
    }

    const defaultEvents = [
        { id: '1', name: 'Akad Nikah', date: 'Kamis, 31 Desember 2026', time: '08:00 - 10:00 WIB', venueName: 'Masjid Agung Al-Hikmah', address: 'Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan', mapUrl: 'https://maps.google.com' },
        { id: '2', name: 'Resepsi Pernikahan', date: 'Kamis, 31 Desember 2026', time: '11:00 - 16:00 WIB', venueName: 'Gedung Serbaguna Jakarta', address: 'Jl. Jenderal Sudirman Kav. 21, Jakarta Pusat', mapUrl: 'https://maps.google.com' }
    ];

    // Normalize events list from DB or static settings
    const eventList = isDynamic && events && events.length > 0
        ? events.map((e, idx) => ({
            id: e.id || String(idx),
            name: e.event_name || 'Acara Baru',
            date: e.event_date || 'Tanggal Acara',
            time: `${e.start_time || ''} - ${e.end_time || 'Selesai'} ${e.timezone || ''}`,
            venueName: e.venue_name || '',
            address: e.venue_address || '',
            mapUrl: e.google_maps_link || '#'
        }))
        : (settings.events || defaultEvents);

    const [activeTabIdx, setActiveTabIdx] = useState(0);

    // Styling properties
    const primaryColor = settings.primaryColor || '#E5654B';
    const cardBg = settings.cardBg || '#ffffff';
    const textColor = settings.textColor || '#4b5563';
    const titleColor = settings.titleColor || '#1f2937';
    const buttonBg = settings.buttonBg || '#E5654B';
    const buttonTextColor = settings.buttonTextColor || '#ffffff';
    const borderRadius = settings.borderRadius || '16px';

    const renderEventCard = (evt) => {
        return (
            <div 
                className="p-6 border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md text-left"
                style={{ 
                    backgroundColor: cardBg, 
                    borderRadius: borderRadius,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
            >
                <div className="space-y-4">
                    {/* Header border accent */}
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <h4 
                            className="text-base font-extrabold tracking-tight" 
                            style={{ 
                                color: titleColor,
                                fontFamily: `"${titleFontFamily}", sans-serif`
                            }}
                        >
                            {evt.name}
                        </h4>
                    </div>

                    <div className="space-y-2.5 text-xs" style={{ fontFamily: `"${bodyFontFamily}", sans-serif` }}>
                        {/* Date */}
                        <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                            <span style={{ color: textColor }}>{evt.date}</span>
                        </div>
                        {/* Time */}
                        <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                            <span style={{ color: textColor }}>{evt.time}</span>
                        </div>
                        {/* Location */}
                        {(evt.venueName || evt.address) && (
                            <div className="flex items-start gap-2 border-t border-gray-50 pt-2 mt-2">
                                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                                <div>
                                    {evt.venueName && <p className="font-bold text-gray-800">{evt.venueName}</p>}
                                    {evt.address && <p className="text-[11px] mt-0.5" style={{ color: textColor }}>{evt.address}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {evt.mapUrl && evt.mapUrl !== '#' && (
                    <div className="mt-5">
                        <a 
                            href={evt.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
                            style={{ 
                                backgroundColor: buttonBg, 
                                color: buttonTextColor,
                                fontFamily: `"${bodyFontFamily}", sans-serif`
                            }}
                        >
                            <Map className="w-3.5 h-3.5" />
                            Petunjuk Lokasi (Maps)
                        </a>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full py-6 px-4 flex flex-col items-center">
            {isDynamic && !events && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-8 uppercase tracking-wider">
                    <Database className="w-3 h-3" /> Mode Dinamis (Pratinjau)
                </span>
            )}

            {layoutModel === 'tabs' ? (
                /* Interactive Tabs Layout */
                <div className="w-full max-w-lg space-y-4">
                    {/* Tabs navigation */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {eventList.map((evt, idx) => (
                            <button
                                key={evt.id || idx}
                                onClick={() => setActiveTabIdx(idx)}
                                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                                    activeTabIdx === idx 
                                        ? 'bg-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                style={{
                                    fontFamily: `"${bodyFontFamily}", sans-serif`,
                                    color: activeTabIdx === idx ? primaryColor : undefined
                                }}
                            >
                                {evt.name}
                            </button>
                        ))}
                    </div>
                    {/* Active card content */}
                    {eventList[activeTabIdx] && renderEventCard(eventList[activeTabIdx])}
                </div>
            ) : layoutModel === 'stack' ? (
                /* Vertical Stack Layout */
                <div className="w-full max-w-md flex flex-col gap-6">
                    {eventList.map((evt) => (
                        <React.Fragment key={evt.id}>
                            {renderEventCard(evt)}
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                /* Grid Layout (Columns) */
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                    {eventList.map((evt) => (
                        <React.Fragment key={evt.id}>
                            {renderEventCard(evt)}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}
