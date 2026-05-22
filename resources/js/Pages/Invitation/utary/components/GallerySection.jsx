import React, { useState, useEffect } from 'react';
import ornamentLeft from '../asset/ornament-left.webp';
import ornamentRight from '../asset/ornament-right.webp';

export default function GallerySection({ RevealDiv, galleries, brideGrooms }) {
    if (!galleries || galleries.length === 0) return null;

    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const images = galleries.map(g => g.image_url);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(-1);
    const prevImage = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + images.length) % images.length); };
    const nextImage = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % images.length); };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };
        if (lightboxIndex >= 0) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex]);

    return (
        <section className="utary-section utary-section--padded" id="gallery">
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-gallery__title">Our Moment</h2>
                    <p className="utary-gift__desc" style={{ fontStyle: 'italic' }}>
                        &ldquo;I was created in time to fill your time, and I use all the time in my life to love you.&rdquo;
                    </p>
                    <p className="utary-hero__venue" style={{ marginBottom: '20px' }}>Photo Video by {brideGrooms?.[0]?.nickname} &amp; {brideGrooms?.[1]?.nickname}</p>
                </RevealDiv>
                <RevealDiv className="utary-gallery__grid">
                    {galleries.map((photo, i) => (
                        <div key={photo.id || i} className="utary-gallery__item" onClick={() => openLightbox(i)}>
                            <img src={photo.image_url} alt={photo.caption || ''} />
                            <div className="utary-gallery__zoom-icon">
                                <i className="fas fa-search-plus" />
                            </div>
                        </div>
                    ))}
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-gallery__quote">
                        <p>&ldquo;I love you, I am who I am because of you. You are every reason, every hope and every dream. I&rsquo;ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.&rdquo;</p>
                        <p style={{ marginTop: '10px', fontWeight: '400' }}>{(brideGrooms?.[0]?.nickname || 'BRIDE').toUpperCase()} &amp; {(brideGrooms?.[1]?.nickname || 'GROOM').toUpperCase()}</p>
                    </div>
                </RevealDiv>
            </div>
            
            {lightboxIndex >= 0 && (
                <div className="utary-lightbox" onClick={closeLightbox}>
                    <button className="utary-lightbox__close" onClick={closeLightbox} title="Close">
                        <i className="fas fa-times" />
                    </button>
                    <div className="utary-lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <button className="utary-lightbox__nav utary-lightbox__nav--prev" onClick={prevImage}>
                            <i className="fas fa-chevron-left" />
                        </button>
                        <img 
                            src={images[lightboxIndex]} 
                            alt="Zoomed Gallery" 
                            className="utary-lightbox__img" 
                        />
                        <button className="utary-lightbox__nav utary-lightbox__nav--next" onClick={nextImage}>
                            <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
