import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';
import { Instagram, Heart, Database } from 'lucide-react';

export default function BrideGroomRenderer({ settings = {}, activeBreakpoint = 'desktop', brideGrooms, globalSettings = {} }) {
    const layoutModel = settings.layoutModel || 'columns'; // 'vertical' | 'columns' | 'circle'
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

    // Default static fallback values
    const defaultGroom = {
        nickname: 'Ahmad',
        full_name: 'Ahmad Rafli, S.Kom.',
        father_name: 'Heri Susanto',
        mother_name: 'Sri Wahyuni',
        instagram: 'ahmad.rafli',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    };

    const defaultBride = {
        nickname: 'Siti',
        full_name: 'Siti Aminah, S.E.',
        father_name: 'M. Yusuf',
        mother_name: 'Nur Aini',
        instagram: 'siti.aminah',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    };

    // Parse data based on source
    let groom = defaultGroom;
    let bride = defaultBride;

    if (isDynamic && brideGrooms && brideGrooms.length >= 1) {
        const first = brideGrooms[0];
        const second = brideGrooms[1] || defaultBride;

        const firstIsWanita = first.gender === 'wanita' || first.gender === 'female' || String(first.gender).toLowerCase().includes('wanita');
        
        if (firstIsWanita) {
            bride = first;
            groom = second;
        } else {
            groom = first;
            bride = second;
        }
    } else if (!isDynamic) {
        groom = settings.groom || defaultGroom;
        bride = settings.bride || defaultBride;
    }

    // Styles
    const primaryColor = settings.primaryColor || '#E5654B';
    const textColor = settings.textColor || '#374151';
    const nameColor = settings.nameColor || '#1f2937';
    const parentColor = settings.parentColor || '#6b7280';
    const cardBg = settings.cardBg || '#ffffff';
    const borderRadius = settings.borderRadius || '16px';

    const renderCard = (person, role) => {
        const isCircle = layoutModel === 'circle';
        
        return (
            <div 
                className="flex flex-col items-center p-6 text-center transition-all duration-300 hover:shadow-sm flex-1"
                style={{ 
                    backgroundColor: cardBg, 
                    borderRadius: borderRadius,
                    border: '1px solid #f3f4f6'
                }}
            >
                {person.photo && (
                    <div 
                        className={`overflow-hidden shadow-md mb-4 border-2`}
                        style={{ 
                            borderColor: primaryColor,
                            width: '130px',
                            height: '130px',
                            borderRadius: isCircle ? '50%' : '16px'
                        }}
                    >
                        <img 
                            src={person.photo} 
                            alt={person.full_name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                )}
                
                <span 
                    className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-2"
                    style={{ fontFamily: bodyFontFamily }}
                >
                    {role === 'groom' ? 'Mempelai Pria' : 'Mempelai Wanita'}
                </span>
                
                <h4 
                    className="text-lg font-bold tracking-tight mb-1"
                    style={{ 
                        color: nameColor,
                        fontFamily: `"${titleFontFamily}", sans-serif`
                    }}
                >
                    {person.full_name}
                </h4>

                <p 
                    className="text-xs leading-relaxed max-w-[220px]"
                    style={{ 
                        color: parentColor,
                        fontFamily: `"${bodyFontFamily}", sans-serif`
                    }}
                >
                    {role === 'groom' ? 'Putra dari:' : 'Putri dari:'} <br />
                    <strong style={{ color: textColor }}>
                        Bapak {person.father_name} & Ibu {person.mother_name}
                    </strong>
                </p>

                {person.instagram && (
                    <a 
                        href={`https://instagram.com/${person.instagram}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-4 text-xs font-semibold hover:opacity-80 transition-opacity"
                        style={{ 
                            color: primaryColor,
                            fontFamily: `"${bodyFontFamily}", sans-serif`
                        }}
                    >
                        <Instagram className="w-3.5 h-3.5" />
                        @{person.instagram}
                    </a>
                )}
            </div>
        );
    };

    return (
        <div className="w-full py-8 px-4 flex flex-col items-center">
            {isDynamic && !brideGrooms && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-8 uppercase tracking-wider">
                    <Database className="w-3 h-3" /> Mode Dinamis (Pratinjau)
                </span>
            )}

            {/* Alternating Layout Styles */}
            {layoutModel === 'vertical' ? (
                <div className="w-full max-w-sm flex flex-col gap-8 items-center">
                    {renderCard(groom, 'groom')}
                    <Heart className="w-8 h-8 animate-pulse" style={{ color: primaryColor }} />
                    {renderCard(bride, 'bride')}
                </div>
            ) : (
                <div className="w-full max-w-2xl flex flex-col md:flex-row gap-6 items-stretch md:items-center">
                    {renderCard(groom, 'groom')}
                    <div className="flex items-center justify-center py-2">
                        <Heart className="w-8 h-8 animate-pulse shrink-0" style={{ color: primaryColor }} />
                    </div>
                    {renderCard(bride, 'bride')}
                </div>
            )}
        </div>
    );
}
