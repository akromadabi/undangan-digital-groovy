import React from 'react';
import flowerLeft from '../asset/flower-left.webp';
import flowerRight from '../asset/flower-right.webp';
import eventFrameTop from '../asset/event-frame-top.webp';
import eventFrameBottom from '../asset/event-frame-bottom.webp';
import { CountdownDiamondFrame } from './Ornaments';

export default function EventSection({ RevealDiv, events, countdown, invitation, formatDate, formatTime }) {
    if (!events || events.length === 0) return null;

    return (
        <section className="utary-section utary-section--padded" id="event">
            <img src={flowerLeft} alt="" className="utary-ornament utary-ornament--flower-left" />
            <img src={flowerRight} alt="" className="utary-ornament utary-ornament--flower-right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-event__title">Save The Date</h2>
                </RevealDiv>

                <RevealDiv>
                    <div className="utary-event__quote">
                        &ldquo;{invitation.opening_ayat || 'Pernikahan adalah ibadah, dan setiap ibadah bermuara pada cinta-Nya sebagai tujuan. Sudah sewajarnya setiap upaya meraih cinta-Nya dilakukan dengan sukacita.'}&rdquo;
                    </div>
                </RevealDiv>

                {invitation.show_countdown && (
                    <RevealDiv>
                        <div className="utary-countdown utary-countdown--diamond">
                            {[
                                { val: countdown.d, label: 'Hari' },
                                { val: countdown.h, label: 'Jam' },
                                { val: countdown.m, label: 'Menit' },
                                { val: countdown.s, label: 'Detik' },
                            ].map((item, i) => (
                                <div key={i} className="utary-countdown__item utary-countdown__item--diamond">
                                    <div className="utary-countdown__diamond-wrap">
                                        <CountdownDiamondFrame />
                                        <div className="utary-countdown__num">{item.val}</div>
                                    </div>
                                    <div className="utary-countdown__label">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </RevealDiv>
                )}

                <RevealDiv>
                    <button className="utary-event__save-btn" onClick={() => window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+${invitation.title}&dates=20261220T010000Z%2F20261220T070000Z`, '_blank')}>
                        Simpan Tanggal
                    </button>
                </RevealDiv>

                <RevealDiv>
                    <div className="utary-event__subtitle">Date &amp; Place</div>
                </RevealDiv>

                <RevealDiv>
                    <img src={eventFrameTop} alt="" style={{ width: '100%', marginBottom: '-1px' }} />
                </RevealDiv>

                {events.map((evt, index) => (
                    <RevealDiv key={evt.id || index}>
                        <div className="utary-event__card" style={{ borderRadius: 0, marginBottom: index === events.length - 1 ? 0 : '1px' }}>
                            <div className="utary-event__card-title">{evt.event_name?.toUpperCase()}</div>
                            <div className="utary-event__card-detail">{formatDate(evt.event_date)?.toUpperCase()}</div>
                            <div className="utary-event__card-detail">{formatTime(evt.start_time)} - {formatTime(evt.end_time) || 'SELESAI'} {evt.timezone}</div>
                            <div className="utary-event__card-venue">{evt.venue_name?.toUpperCase()}</div>
                            <div className="utary-event__card-address">{evt.venue_address}</div>
                            {evt.gmaps_link && (
                                <button className="utary-event__map-btn" onClick={() => window.open(evt.gmaps_link, '_blank')}>
                                    GOOGLE MAPS
                                </button>
                            )}
                        </div>
                    </RevealDiv>
                ))}

                <RevealDiv>
                    <img src={eventFrameBottom} alt="" style={{ width: '100%', marginTop: '-1px' }} />
                </RevealDiv>
            </div>
        </section>
    );
}
