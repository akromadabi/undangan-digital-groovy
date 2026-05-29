import React from 'react';

export default function DressCodeBlock({ event, colors, fonts }) {
    if (!event?.show_dress_code) return null;

    const paletteList = Array.isArray(event.dress_code_colors) 
        ? event.dress_code_colors 
        : [];

    return (
        <div className="mt-5 p-5 rounded-2xl border text-center transition-all duration-300 w-full"
            style={{ 
                backgroundColor: (colors?.primary || '#B76E79') + '08', 
                borderColor: (colors?.primary || '#B76E79') + '1c' 
            }}>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-2" 
                style={{ fontFamily: fonts?.heading || 'inherit', color: colors?.primary }}>
                Dress Code
            </h4>
            {event.dress_code_text && (
                <p className="text-xs sm:text-sm leading-relaxed mb-4 opacity-85 whitespace-pre-line">
                    {event.dress_code_text}
                </p>
            )}
            
            {paletteList.length > 0 && (
                <div className="space-y-4 mt-2">
                    {paletteList.map((group, gIdx) => (
                        <div key={gIdx} className="flex flex-col items-center">
                            {group.label && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider mb-2 opacity-70"
                                    style={{ color: colors?.text }}>
                                    {group.label}
                                </span>
                            )}
                            <div className="flex gap-3 justify-center flex-wrap">
                                {Array.isArray(group.colors) && group.colors.map((color, cIdx) => (
                                    <div key={cIdx} className="flex flex-col items-center gap-1 transition-transform hover:scale-105">
                                        <span className="w-8 h-8 rounded-full border shadow-sm block" 
                                            style={{ backgroundColor: color, borderColor: (colors?.primary || '#B76E79') + '30' }} 
                                        />
                                        <span className="text-[8px] opacity-60 font-mono tracking-wider uppercase">
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
