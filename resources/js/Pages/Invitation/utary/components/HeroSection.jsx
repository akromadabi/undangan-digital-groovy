import React from 'react';
import ornamentLeft from '../asset/ornament-left.webp';
import ornamentRight from '../asset/ornament-right.webp';

export default function HeroSection({ RevealDiv, brideGrooms, invitation, events }) {
    const coupleNames = brideGrooms?.length >= 2 
        ? <>{brideGrooms[0].nickname || brideGrooms[0].full_name} &amp;<br />{brideGrooms[1].nickname || brideGrooms[1].full_name}</>
        : <>Tary &amp;<br />Fachrul</>;

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
