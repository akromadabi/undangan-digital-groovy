import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';
import { Calendar, Database } from 'lucide-react';

export default function LoveStoryRenderer({ settings = {}, activeBreakpoint = 'desktop', loveStories, globalSettings = {} }) {
    const title = settings.title || 'Kisah Cinta Kami';
    const isDynamic = settings.sourceType === 'dynamic';
    const layoutModel = settings.layoutModel || 'alternating'; // 'alternating' | 'left' | 'grid'

    // Fonts resolution
    let titleFontFamily = settings.titleFontFamily || 'default';
    if (titleFontFamily === 'default') {
        titleFontFamily = globalSettings?.fonts?.heading || 'Playfair Display';
    }

    let bodyFontFamily = settings.bodyFontFamily || 'default';
    if (bodyFontFamily === 'default') {
        bodyFontFamily = globalSettings?.fonts?.body || 'Inter';
    }

    // Normalize stories from either dynamic DB props or static settings
    const stories = isDynamic && loveStories && loveStories.length > 0
        ? loveStories.map((s, idx) => ({
            id: s.id || String(idx),
            date: s.story_date || '',
            title: s.title || '',
            desc: s.description || '',
            imageUrl: s.image_url || s.image || ''
        }))
        : (settings.stories || [
            { id: '1', date: '15 Januari 2020', title: 'Pertama Bertemu', desc: 'Awal mula pertemuan kami yang tidak disengaja di sebuah kedai kopi. Tatap mata pertama yang menumbuhkan rasa ketertarikan.', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500' },
            { id: '2', date: '20 Agustus 2022', title: 'Menjalin Komitmen', desc: 'Setelah sekian lama saling mengenal, kami memutuskan untuk berkomitmen melangkah bersama dalam ikatan kasih yang lebih serius.', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500' },
            { id: '3', date: '12 Desember 2025', title: 'Lamaran (Engagement)', desc: 'Dengan restu kedua orang tua, kami mengikat janji suci pertunangan untuk bersiap melangkah ke jenjang pernikahan.', imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500' }
        ]);

    const timelineColor = settings.timelineColor || '#E5654B';
    const nodeBg = settings.nodeBg || '#ffffff';
    const cardBg = settings.cardBg || '#ffffff';
    const textColor = settings.textColor || '#374151';
    const dateColor = settings.dateColor || '#E5654B';
    const titleColor = settings.titleColor || '#1f2937';

    const renderCardContent = (story) => {
        return (
            <div 
                className="p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md w-full"
                style={{ backgroundColor: cardBg }}
            >
                <span 
                    className="inline-flex items-center gap-1 text-xs font-bold mb-2 tracking-wide"
                    style={{ 
                        color: dateColor,
                        fontFamily: `"${bodyFontFamily}", sans-serif`
                    }}
                >
                    <Calendar className="w-3.5 h-3.5" />
                    {story.date}
                </span>
                <h4 
                    className="text-base font-bold mb-2"
                    style={{ 
                        color: titleColor,
                        fontFamily: `"${titleFontFamily}", sans-serif`
                    }}
                >
                    {story.title}
                </h4>
                {story.imageUrl && (
                    <img 
                        src={story.imageUrl} 
                        alt={story.title} 
                        className="w-full h-36 object-cover rounded-lg mb-3"
                    />
                )}
                <p 
                    className="text-xs md:text-sm leading-relaxed"
                    style={{ 
                        color: textColor,
                        fontFamily: `"${bodyFontFamily}", sans-serif`
                    }}
                >
                    {story.desc}
                </p>
            </div>
        );
    };

    return (
        <div className="w-full py-8 px-4 flex flex-col items-center">
            {title && (
                <h3 
                    className="text-2xl font-bold tracking-tight text-center mb-2"
                    style={{ 
                        color: settings.headerColor || '#1f2937',
                        fontFamily: `"${titleFontFamily}", sans-serif`
                    }}
                >
                    {title}
                </h3>
            )}

            {isDynamic && !loveStories && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-8 uppercase tracking-wider">
                    <Database className="w-3 h-3" /> Mode Dinamis (Pratinjau)
                </span>
            )}

            {layoutModel === 'grid' ? (
                /* Grid Layout (no timeline line) */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
                    {stories.map((story, idx) => (
                        <div key={story.id || idx} className="flex">
                            {renderCardContent(story)}
                        </div>
                    ))}
                </div>
            ) : (
                /* Timeline Layouts (Alternating vs Left-Aligned) */
                <div className="relative w-full max-w-3xl mt-8">
                    {/* Vertical Line */}
                    <div 
                        className={`absolute top-0 bottom-0 w-0.5 -translate-x-1/2 ${
                            layoutModel === 'left' ? 'left-4' : 'left-4 md:left-1/2'
                        }`}
                        style={{ backgroundColor: timelineColor }}
                    />

                    <div className="space-y-12 relative">
                        {stories.map((story, idx) => {
                            const isEven = idx % 2 === 0;
                            const isLeftLayout = layoutModel === 'left';
                            
                            return (
                                <div 
                                    key={story.id || idx}
                                    className={`flex flex-col relative items-start ${
                                        isLeftLayout ? 'pl-0' : 'md:flex-row md:items-center'
                                    }`}
                                >
                                    {/* Dot Marker */}
                                    <div 
                                        className={`absolute w-5 h-5 rounded-full border-4 -translate-x-1/2 z-10 shadow-sm transition-all ${
                                            isLeftLayout ? 'left-4' : 'left-4 md:left-1/2'
                                        }`}
                                        style={{ 
                                            borderColor: timelineColor, 
                                            backgroundColor: nodeBg 
                                        }}
                                    />

                                    {isLeftLayout ? (
                                        /* Left layout always aligns cards to the right of line */
                                        <div className="w-full pl-10 text-left">
                                            {renderCardContent(story)}
                                        </div>
                                    ) : (
                                        /* Alternating Layout */
                                        <>
                                            {/* Left Box (Even cards only) */}
                                            <div className={`w-full md:w-1/2 pl-12 md:pl-0 md:pr-10 text-left md:text-right ${isEven ? 'md:block' : 'md:hidden'}`}>
                                                {isEven && renderCardContent(story)}
                                            </div>

                                            {/* Right Box (Odd cards only) */}
                                            <div className={`w-full md:w-1/2 pl-12 md:pl-10 text-left ${!isEven ? 'md:block' : 'md:hidden md:w-1/2'}`}>
                                                {!isEven && renderCardContent(story)}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
