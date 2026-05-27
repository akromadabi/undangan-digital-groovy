import React, { useMemo } from 'react';
import ornamentLeft from '../asset/ornament-left.webp';
import ornamentRight from '../asset/ornament-right.webp';
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

export default function HeroSection({ RevealDiv, brideGrooms, invitation, events }) {
    const coupleNames = brideGrooms?.length >= 2 
        ? <>{brideGrooms[0].nickname || brideGrooms[0].full_name} &amp;<br />{brideGrooms[1].nickname || brideGrooms[1].full_name}</>
        : <>Tary &amp;<br />Fachrul</>;

    const openingImages = useMemo(() => {
        const rawSource = invitation?.opening_image;
        if (!rawSource) return [];
        return rawSource.split(',').map(url => getStorageUrl(url, null)).filter(Boolean);
    }, [invitation?.opening_image]);

    return (
        <section className="utary-section utary-hero" id="home">
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <div className="utary-hero__pretitle">{invitation.opening_title || 'The Wedding of'}</div>
                </RevealDiv>
                <RevealDiv>
                    <h1 className="utary-hero__title">
                        {coupleNames}
                    </h1>
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-hero__date-text">{invitation.event_date_formatted || 'Desember 2026'}</div>
                    <div className="utary-hero__venue">{events?.[0]?.venue_name || 'Club House Jakarta Garden City'}</div>
                </RevealDiv>
                {openingImages.length > 0 && (
                    <RevealDiv>
                        <div className="utary-hero__photo-wrapper relative overflow-hidden" style={{ margin: '20px auto', width: '320px', height: '240px', borderRadius: '16px', border: '4px solid #fff', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                            <PremiumSlideshow
                                images={openingImages}
                                positionX={invitation?.opening_position_x ?? invitation?.cover_position_x}
                                positionY={invitation?.opening_position_y ?? invitation?.cover_position_y}
                                zoom={invitation?.opening_zoom ?? invitation?.cover_zoom}
                                className="absolute inset-0 w-full h-full z-0"
                                imgClassName="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </RevealDiv>
                )}
                <RevealDiv>
                    <div className="utary-hero__verse">
                        <p>&ldquo;{invitation.opening_ayat || 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).'}&rdquo;</p>
                        {invitation.opening_ayat_source && <cite>{invitation.opening_ayat_source}</cite>}
                    </div>
                </RevealDiv>
                <div className="utary-scroll-indicator">
                    <div className="utary-scroll-indicator__icon">
                        <div className="utary-scroll-indicator__dot" />
                    </div>
                </div>
            </div>
        </section>
    );
}
