import React, { useMemo } from 'react';
import couplePhoto from '../asset/couple-photo.webp';
import PremiumSlideshow from '@/Components/PremiumSlideshow';

function getStorageUrl(url, fallback) {
    if (!url || url === 'null' || url === 'undefined' || url === '/storage/' || url === 'storage/') return fallback;
    if (typeof url === 'string' && url.includes(',')) {
        url = url.split(',')[0];
    }
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.startsWith('/storage/')) return cleanUrl;
    if (cleanUrl.startsWith('storage/')) return '/' + cleanUrl;
    if (cleanUrl.startsWith('/')) return cleanUrl;
    return `/storage/${cleanUrl}`;
}

export default function LeftPanel({ brideGrooms, invitation }) {
    const coupleNames = brideGrooms?.length >= 2 
        ? `${brideGrooms[0].nickname || brideGrooms[0].full_name} & ${brideGrooms[1].nickname || brideGrooms[1].full_name}`
        : 'Tary & Fachrul';

    const images = useMemo(() => {
        const rawSource = invitation?.cover_image;
        if (!rawSource) return [couplePhoto];
        return rawSource.split(',').map(url => getStorageUrl(url, couplePhoto)).filter(Boolean);
    }, [invitation?.cover_image]);

    return (
        <div className="utary-main__left">
            {images.length > 0 && (
                <PremiumSlideshow
                    images={images}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="absolute inset-0 w-full h-full z-0"
                    imgClassName="utary-main__left-img"
                />
            )}
            <div className="utary-main__left-overlay">
                <div className="utary-main__left-pretitle">THE WEDDING OF</div>
                <div className="utary-main__left-title">{coupleNames.toUpperCase()}</div>
                <div className="utary-main__left-quote">
                    &ldquo;{invitation.closing_text || 'I love you, I am who I am because of you. You are every reason, every hope and every dream. I’ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.'}&rdquo;
                </div>
            </div>
        </div>
    );
}
