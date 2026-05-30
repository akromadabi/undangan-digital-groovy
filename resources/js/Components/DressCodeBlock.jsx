import React from 'react';

export default function DressCodeBlock({ event, colors, fonts, variant = 'modern', plain = false }) {
    if (!event?.show_dress_code) return null;

    const paletteList = Array.isArray(event.dress_code_colors) 
        ? event.dress_code_colors 
        : [];

    const primaryColor = colors?.primary || '#B76E79';
    const textColor = colors?.text || '#2D2D2D';
    const headingFont = fonts?.heading || 'inherit';

    // RENDER: NETFLIX THEME METADATA STYLE
    if (variant === 'netflix') {
        return (
            <div className="w-full bg-[#181818]/60 border border-white/5 rounded-xl p-4 text-left transition-all duration-300 shadow-lg backdrop-blur-xs">
                
                {/* Section Title with Hanger Icon */}
                <div className="flex items-center gap-2 mb-3.5">
                    <svg className="w-4 h-4 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 17a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3c0-2-1.5-3.5-3.5-3.5h-13C4.5 13.5 3 15 3 17z" />
                        <path d="M12 13.5V9a3.5 3.5 0 1 1 5 3" />
                    </svg>
                    <h5 className="text-[11px] font-extrabold text-white/90 uppercase tracking-widest" style={{ fontFamily: headingFont }}>
                        Dress Code {event.event_name ? `(${event.event_name})` : ''}
                    </h5>
                </div>

                {/* Synopsis-style Text Description */}
                {event.dress_code_text && (
                    <p className="text-xs text-white/70 leading-relaxed mb-4 whitespace-pre-line border-l-2 border-[#e50914]/60 pl-3">
                        {event.dress_code_text}
                    </p>
                )}

                {/* Grid Color Swatches */}
                {paletteList.length > 0 && (
                    <div className={event.dress_code_text ? "border-t border-white/5 pt-3.5" : ""}>
                        <div className="space-y-3.5">
                            {paletteList.map((group, gIdx) => (
                                <div key={gIdx} className="flex items-center gap-4 py-0.5">
                                    {group.label && (
                                        <div className="text-[10px] font-bold text-white/45 uppercase tracking-wider w-20 flex-shrink-0 select-none">
                                            {group.label}
                                        </div>
                                    )}
                                    <div className="flex gap-2.5 flex-wrap items-center">
                                        {Array.isArray(group.colors) && group.colors.map((color, cIdx) => (
                                            <div key={cIdx} className="relative group/color">
                                                <span className="w-6 h-6 rounded-full border-2 border-white/15 block shadow-md transition-all duration-250 hover:scale-115 hover:border-white/50 cursor-pointer" 
                                                    style={{ 
                                                        backgroundColor: color,
                                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4)'
                                                    }} 
                                                    title={color}
                                                />
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-0.5 bg-black/95 border border-white/10 rounded text-[9px] font-mono text-white opacity-0 pointer-events-none transition-opacity duration-200 group-hover/color:opacity-100 whitespace-nowrap z-25 shadow-2xl">
                                                    {color}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // RENDER: YOUTUBE STYLE
    if (variant === 'youtube') {
        return (
            <div className={plain ? "w-full text-left" : "w-full bg-[#1f1f1f] border border-[#2f2f2f] rounded-xl p-4 text-left transition-all duration-300 shadow-md"}
                style={plain ? {} : {}}>
                <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-[#2f2f2f]">
                    {/* Coat Hanger SVG Icon styled like a YouTube tab icon */}
                    <svg className="w-4 h-4 text-[#ff0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 17a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3c0-2-1.5-3.5-3.5-3.5h-13C4.5 13.5 3 15 3 17z" />
                        <path d="M12 13.5V9a3.5 3.5 0 1 1 5 3" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-white" 
                        style={{ fontFamily: headingFont }}>
                        Dress Code {event.event_name ? `(${event.event_name})` : ''}
                    </span>
                </div>

                {event.dress_code_text && (
                    <p className="text-[11px] sm:text-xs leading-relaxed mb-3.5 opacity-80 whitespace-pre-line text-left border-l-2 border-[#ff0000] pl-2 text-gray-300">
                        {event.dress_code_text}
                    </p>
                )}

                {paletteList.length > 0 && (
                    <div className="space-y-3 mt-2 text-left bg-[#161616] p-2.5 rounded-lg border border-[#2f2f2f]">
                        {paletteList.map((group, gIdx) => (
                            <div key={gIdx} className="flex flex-col">
                                {group.label && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider mb-1.5 opacity-60 text-gray-400">
                                        {group.label}
                                    </span>
                                )}
                                <div className="flex gap-2 flex-wrap">
                                    {Array.isArray(group.colors) && group.colors.map((color, cIdx) => (
                                        <div key={cIdx} className="flex items-center gap-1.5 bg-[#272727] hover:bg-[#3f3f3f] border border-transparent rounded-full px-2.5 py-1 shadow-sm transition-transform hover:scale-105">
                                            <span className="w-3.5 h-3.5 rounded-full border border-white/20 block" 
                                                style={{ backgroundColor: color }} 
                                            />
                                            <span className="text-[9px] font-mono tracking-wider uppercase opacity-85 text-white">
                                                {color}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // RENDER: PLATFORM/APP BUBBLE STYLE (WhatsApp, Netflix, Spotify, TikTok, dsb)
    if (variant === 'app') {
        return (
            <div className={plain ? "text-center w-full overflow-hidden" : "mt-4 p-4 rounded-xl border text-center transition-all duration-300 w-full overflow-hidden"}
                style={plain ? {} : { 
                    backgroundColor: 'rgba(255, 255, 255, 0.04)', 
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}>
                <div className="flex items-center justify-center gap-1.5 mb-2.5">
                    {/* Coat Hanger SVG Icon */}
                    <svg className="w-4 h-4" fill="none" stroke={primaryColor} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 17a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3c0-2-1.5-3.5-3.5-3.5h-13C4.5 13.5 3 15 3 17z" />
                        <path d="M12 13.5V9a3.5 3.5 0 1 1 5 3" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider" 
                        style={{ fontFamily: headingFont, color: primaryColor }}>
                        Dress Code {event.event_name ? `(${event.event_name})` : ''}
                    </span>
                </div>

                {event.dress_code_text && (
                    <p className="text-[11px] sm:text-xs leading-relaxed mb-3.5 opacity-80 whitespace-pre-line text-left border-l-2 pl-2"
                        style={{ borderColor: primaryColor + '60', color: textColor }}>
                        {event.dress_code_text}
                    </p>
                )}

                {paletteList.length > 0 && (
                    <div className="space-y-3 mt-2 text-left bg-black/5 dark:bg-white/5 p-2.5 rounded-lg">
                        {paletteList.map((group, gIdx) => (
                            <div key={gIdx} className="flex flex-col">
                                {group.label && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider mb-1.5 opacity-60"
                                        style={{ color: textColor }}>
                                        {group.label}
                                    </span>
                                )}
                                <div className="flex gap-2 flex-wrap">
                                    {Array.isArray(group.colors) && group.colors.map((color, cIdx) => (
                                        <div key={cIdx} className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full px-2 py-0.5 shadow-sm transition-transform hover:scale-105">
                                            <span className="w-3.5 h-3.5 rounded-full border border-black/10 block" 
                                                style={{ backgroundColor: color }} 
                                            />
                                            <span className="text-[8px] font-mono tracking-wider uppercase opacity-85" style={{ color: textColor }}>
                                                {color}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // RENDER: TRADITIONAL/CLASSIC ORNATE STYLE (Adat Jawa, Adat Sunda, Wayang, Moroccan)
    if (variant === 'classic') {
        return (
            <div className={plain ? "text-center w-full relative overflow-hidden" : "mt-5 p-5 rounded-2xl border-2 text-center transition-all duration-300 w-full relative overflow-hidden"}
                style={plain ? {} : { 
                    backgroundColor: primaryColor + '08', 
                    borderColor: primaryColor + '30',
                    backgroundImage: `radial-gradient(circle at 0% 0%, ${primaryColor}03 0%, transparent 50%), radial-gradient(circle at 100% 100%, ${primaryColor}03 0%, transparent 50%)`
                }}>
                
                {/* Traditional Ornate Flourish SVG */}
                <div className="w-full flex justify-center opacity-45 mb-1.5">
                    <svg className="w-12 h-3" viewBox="0 0 100 20" fill="none" stroke={primaryColor} strokeWidth="1.2" strokeLinecap="round">
                        <path d="M10,10 C25,0 35,20 50,10 C65,0 75,20 90,10" />
                        <circle cx="50" cy="10" r="1.5" fill={primaryColor} />
                    </svg>
                </div>

                <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-2" 
                    style={{ fontFamily: headingFont, color: primaryColor }}>
                    Dress Code {event.event_name ? `(${event.event_name})` : ''}
                </h4>

                {event.dress_code_text && (
                    <p className="text-xs sm:text-sm leading-relaxed mb-4 opacity-90 italic whitespace-pre-line"
                        style={{ color: textColor }}>
                        &ldquo;{event.dress_code_text}&rdquo;
                    </p>
                )}

                <div className="w-full flex justify-center opacity-30 my-2">
                    <div className="h-px w-24" style={{ backgroundColor: primaryColor }} />
                </div>

                {paletteList.length > 0 && (
                    <div className="space-y-4 mt-3">
                        {paletteList.map((group, gIdx) => (
                            <div key={gIdx} className="flex flex-col items-center">
                                {group.label && (
                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                                        style={{ color: primaryColor }}>
                                        {group.label}
                                    </span>
                                )}
                                <div className="flex gap-4 justify-center flex-wrap">
                                    {Array.isArray(group.colors) && group.colors.map((color, cIdx) => (
                                        <div key={cIdx} className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 duration-200">
                                            <span className="w-9 h-9 rounded-full border-2 shadow-md block relative" 
                                                style={{ 
                                                    backgroundColor: color, 
                                                    borderColor: '#ffffff',
                                                    boxShadow: `0 3px 6px ${primaryColor}20, inset 0 1px 0 rgba(255,255,255,0.2)`
                                                }}>
                                                <span className="absolute inset-0 rounded-full border border-black/5 pointer-events-none" />
                                            </span>
                                            <span className="text-[9px] opacity-75 font-mono tracking-widest uppercase font-semibold" style={{ color: textColor }}>
                                                {color}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // RENDER: CLEAN MODERN MINIMALIST STYLE (Default/Spesial/Luxury)
    return (
        <div className={plain ? "text-center w-full" : "mt-5 p-5 rounded-2xl border text-center transition-all duration-300 w-full"}
            style={plain ? {} : { 
                backgroundColor: primaryColor + '04', 
                borderColor: primaryColor + '15',
                boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
            }}>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] mb-2.5 flex items-center justify-center gap-1.5" 
                style={{ fontFamily: headingFont, color: primaryColor }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7a3 3 0 10-3-3m3 3h.01M12 7v3m-8 6.5A1.5 1.5 0 005.5 18h13a1.5 1.5 0 001.5-1.5c0-.62-.38-1.16-.95-1.37L12.5 12.8a1.5 1.5 0 00-1 0L4.95 15.13A1.5 1.5 0 004 16.5z" />
                </svg>
                Dress Code {event.event_name ? `(${event.event_name})` : ''}
            </h4>
            {event.dress_code_text && (
                <p className="text-xs sm:text-sm leading-relaxed mb-4 opacity-80 whitespace-pre-line"
                    style={{ color: textColor }}>
                    {event.dress_code_text}
                </p>
            )}
            
            {paletteList.length > 0 && (
                <div className="space-y-4 mt-2">
                    {paletteList.map((group, gIdx) => (
                        <div key={gIdx} className="flex flex-col items-center">
                            {group.label && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider mb-2 opacity-70"
                                    style={{ color: textColor }}>
                                    {group.label}
                                </span>
                            )}
                            <div className="flex gap-3.5 justify-center flex-wrap">
                                {Array.isArray(group.colors) && group.colors.map((color, cIdx) => (
                                    <div key={cIdx} className="flex flex-col items-center gap-1 transition-transform hover:scale-105">
                                        <span className="w-6 h-6 rounded-full border shadow-xs block relative" 
                                            style={{ backgroundColor: color, borderColor: primaryColor + '25' }}>
                                            <span className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
                                        </span>
                                        <span className="text-[9px] opacity-60 font-mono tracking-wider uppercase" style={{ color: textColor }}>
                                            {color}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
