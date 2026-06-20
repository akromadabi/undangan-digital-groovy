import React, { useState } from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';
import { ChevronLeft, ChevronRight, Database } from 'lucide-react';

export default function GalleryRenderer({ settings = {}, activeBreakpoint = 'desktop', galleries }) {
    const layout = settings.layout || 'grid';
    const rawColumns = settings.columns || { desktop: 3, tablet: 2, mobile: 1 };
    const columns = parseInt(getResponsiveSetting(rawColumns, activeBreakpoint, 3), 10);
    const gap = getResponsiveSetting(settings.gap || { desktop: '16px', tablet: '12px', mobile: '8px' }, activeBreakpoint, '16px');
    const borderRadius = settings.borderRadius || '8px';
    const aspectRatio = settings.aspectRatio || 'square'; // 'square', 'video', 'portrait', 'auto'
    
    const isDynamic = settings.sourceType === 'dynamic';

    // Normalize images list from either DB props or settings
    const images = isDynamic && galleries && galleries.length > 0
        ? galleries.map((p, idx) => ({
            id: p.id || String(idx),
            url: p.image_url || p.image || '',
            caption: p.caption || ''
        }))
        : (settings.images || [
            { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', caption: 'Moment Indah' },
            { id: '2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', caption: 'Kebersamaan Kita' },
            { id: '3', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', caption: 'Janji Suci' },
            { id: '4', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800', caption: 'Kisah Kasih' }
        ]);

    const [carouselIndex, setCarouselIndex] = useState(0);

    const getAspectStyle = () => {
        switch (aspectRatio) {
            case 'square': return 'aspect-square object-cover';
            case 'video': return 'aspect-video object-cover';
            case 'portrait': return 'aspect-[3/4] object-cover';
            case 'auto':
            default: return 'h-auto object-contain';
        }
    };

    if (!images || images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                <span className="text-sm text-gray-500 font-medium">Galeri Foto Kosong</span>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            {isDynamic && !galleries && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-6 uppercase tracking-wider">
                    <Database className="w-3 h-3" /> Mode Dinamis (Pratinjau)
                </span>
            )}

            {layout === 'carousel' ? (
                /* Carousel Layout */
                <div className="relative w-full overflow-hidden group rounded-lg shadow-sm" style={{ borderRadius }}>
                    <div 
                        className="relative flex items-center justify-center bg-gray-950 transition-all duration-300"
                        style={{ 
                            aspectRatio: aspectRatio === 'square' ? '1/1' : aspectRatio === 'video' ? '16/9' : aspectRatio === 'portrait' ? '3/4' : 'auto',
                            minHeight: aspectRatio === 'auto' ? '300px' : 'auto'
                        }}
                    >
                        <img 
                            src={images[carouselIndex]?.url} 
                            alt={images[carouselIndex]?.caption || 'Gallery Image'} 
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        
                        {images[carouselIndex]?.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-center">
                                <p className="text-sm font-semibold tracking-wide drop-shadow-sm">{images[carouselIndex]?.caption}</p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <button 
                            onClick={() => setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                            className="absolute left-3 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-80 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                            className="absolute right-3 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-80 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Dots indicator */}
                    <div className="flex justify-center gap-1.5 py-3 bg-white/50 dark:bg-black/10 backdrop-blur-sm w-full">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCarouselIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    idx === carouselIndex ? 'bg-indigo-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            ) : layout === 'masonry' ? (
                /* Masonry Layout */
                <div 
                    style={{ 
                        columnCount: columns, 
                        columnGap: gap 
                    }} 
                    className="w-full"
                >
                    {images.map((img, idx) => (
                        <div 
                            key={img.id || idx} 
                            className="break-inside-avoid overflow-hidden group relative mb-4 shadow-sm hover:shadow-md transition-shadow"
                            style={{ 
                                borderRadius,
                                marginBottom: gap
                            }}
                        >
                            <img 
                                src={img.url} 
                                alt={img.caption || `Gallery ${idx + 1}`} 
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                            />
                            {img.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-xs font-semibold">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                /* Default Grid Layout */
                <div 
                    style={{ 
                        display: 'grid',
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gap: gap
                    }}
                    className="w-full"
                >
                    {images.map((img, idx) => (
                        <div 
                            key={img.id || idx} 
                            className="relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                            style={{ borderRadius }}
                        >
                            <div className="w-full h-full overflow-hidden">
                                <img 
                                    src={img.url} 
                                    alt={img.caption || `Gallery ${idx + 1}`} 
                                    className={`w-full h-full hover:scale-105 transition-transform duration-500 ${getAspectStyle()}`}
                                />
                            </div>
                            {img.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-xs font-semibold">{img.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
