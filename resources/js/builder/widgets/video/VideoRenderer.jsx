import React from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';

export default function VideoRenderer({ settings = {}, activeBreakpoint = 'desktop' }) {
    const videoType = settings.videoType || 'youtube'; // 'youtube' | 'vimeo' | 'hosted'
    const rawUrl = settings.url || '';
    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'center');
    const width = getResponsiveSetting(settings.width, activeBreakpoint, '100%');
    const aspectRatio = settings.aspectRatio || '16/9'; // '16/9' | '4/3' | '1/1'

    // Helper to get embed URL for YouTube
    const getEmbedUrl = (url) => {
        if (!url) return '';
        
        if (videoType === 'youtube') {
            // Check if it's already an embed URL
            if (url.includes('youtube.com/embed/')) return url;
            
            // Check watch URL (youtube.com/watch?v=ID)
            let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            let match = url.match(regExp);
            if (match && match[2].length === 11) {
                return `https://www.youtube.com/embed/${match[2]}`;
            }
        }

        if (videoType === 'vimeo') {
            if (url.includes('player.vimeo.com/video/')) return url;
            let regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/;
            let match = url.match(regExp);
            if (match && match[1]) {
                return `https://player.vimeo.com/video/${match[1]}`;
            }
        }

        return url;
    };

    const embedUrl = getEmbedUrl(rawUrl);

    // Padding bottom trick for responsive aspect ratio
    const getAspectRatioPadding = () => {
        if (aspectRatio === '4/3') return '75%';
        if (aspectRatio === '1/1') return '100%';
        return '56.25%'; // 16:9
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        width: '100%'
    };

    const videoWrapperStyle = {
        width: width,
        maxWidth: '100%',
        position: 'relative',
        paddingBottom: videoType !== 'hosted' ? getAspectRatioPadding() : '0px',
        height: videoType !== 'hosted' ? '0px' : 'auto',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        border: '1px solid #f3f4f6'
    };

    const iframeStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0
    };

    return (
        <div style={containerStyle}>
            <div style={videoWrapperStyle}>
                {!rawUrl ? (
                    <div className="bg-gray-100 flex flex-col items-center justify-center p-8 text-center text-xs text-gray-400 min-h-[180px]">
                        <svg className="w-8 h-8 text-gray-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Masukkan URL Video di Panel Kanan
                    </div>
                ) : videoType === 'hosted' ? (
                    <video 
                        src={rawUrl} 
                        controls 
                        className="w-full h-auto rounded-xl"
                        style={{ display: 'block', maxWidth: '100%' }}
                    />
                ) : (
                    <iframe
                        src={embedUrl}
                        title="Embedded Video"
                        style={iframeStyle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </div>
        </div>
    );
}
