import React from 'react';
import dividerPattern from '../asset/divider-pattern.webp';

export function DividerSection() {
    return (
        <div className="utary-divider">
            <img src={dividerPattern} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
    );
}

export function DressCodeSection({ RevealDiv, invitation }) {
    if (!invitation.show_dress_code) return null;
    return (
        <section className="utary-section utary-section--padded" id="dresscode">
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-event__title" style={{ fontSize: '24px' }}>Dress Code</h2>
                    <p className="utary-gift__desc">
                        {invitation.dress_code_text || 'Tamu undangan diharapkan mengenakan pakaian bernuansa Putih atau Pastel.'}
                    </p>
                </RevealDiv>
            </div>
        </section>
    );
}

export function LiveStreamingSection({ RevealDiv, invitation }) {
    if (!invitation.show_live_streaming) return null;
    return (
        <section className="utary-section utary-section--padded" id="live">
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-event__title" style={{ fontSize: '24px' }}>Live Streaming</h2>
                    <p className="utary-gift__desc">
                        Saksikan prosesi pernikahan kami secara virtual melalui kanal berikut:
                    </p>
                    <button className="utary-event__map-btn" onClick={() => window.open(invitation.live_streaming_url, '_blank')}>
                        WATCH LIVE
                    </button>
                </RevealDiv>
            </div>
        </section>
    );
}

export function VideoSection({ RevealDiv, invitation }) {
    if (!invitation.video_url) return null;
    return (
        <section className="utary-section utary-section--padded" id="video">
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-event__title" style={{ fontSize: '24px' }}>Wedding Video</h2>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '15px' }}>
                        <iframe 
                            src={invitation.video_url.replace('watch?v=', 'embed/')} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        />
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}

export function WeddingFrameSection({ RevealDiv, brideGrooms }) {
    return (
        <section className="utary-section utary-section--padded" id="frame">
            <div className="utary-section__inner">
                <RevealDiv>
                    <div style={{ border: '2px solid #c8b680', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                        <h2 className="utary-event__title" style={{ fontSize: '24px', marginBottom: '10px' }}>The Wedding</h2>
                        <div style={{ fontSize: '18px', fontFamily: 'var(--utary-font-display)', color: '#c8b680' }}>
                           {(brideGrooms?.[0]?.nickname || 'Bride').toUpperCase()} &amp; {(brideGrooms?.[1]?.nickname || 'Groom').toUpperCase()}
                        </div>
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}
