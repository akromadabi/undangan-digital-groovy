import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import './style.css';

// Asset imports
import ornamentLeft from './asset/Aruna-Tree-6-1-150x150.webp';
import ornamentRight from './asset/Aruna-Tree-6-1-150x150.webp';
import dividerPattern from './asset/Aruna-Engraving.webp';
import frameProfile from './asset/Aruna-Frame-Mempelai.webp';
import couplePhoto from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import maskProfile from './asset/mask-profile.webp'; 
import flowerLeft from './asset/Aruna-Bunga-7-1-188x300.webp';
import flowerRight from './asset/Aruna-Bunga-300x287.webp';
import eventFrameTop from './asset/Aruna-LACE-2-1-768x1137.webp';
import eventFrameBottom from './asset/Aruna-LACE-2-1-768x1137.webp';
import waxSeal from './asset/Aruna-WAX-SEAL-3-1.webp';
import aruna1 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna2 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';
import aruna3 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna4 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';
import aruna5 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna6 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';
import rambatOrnament from './asset/Aruna-Rambat-1.webp';
import janurOrnament from './asset/Aruna-Janur-2.webp';

/* ─────────────────────────────────────────────
   Monogram Seal (Wax Seal)
   ───────────────────────────────────────────── */
function MonogramShield() {
    return (
        <div className="aruna-cover__monogram">
            <img src={waxSeal} alt="Wax Seal" className="aruna-cover__wax-seal" />
        </div>
    );
}

function StarDivider() {
    return (
        <div className="aruna-divider-star">
            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 200 200" width="40px" height="40px">
                <path fill="#847d4a" d="m63.275,107.786c2.14-11.952,4.129-17.968,5.965-6.016c1.688,11.008,1.488,4.122,2.029,5.707c0.588,0.582,1.035-1.53,5.459-4.312c9.135-7.418,12.347-3.032,3.318-7.619c4.421-11.522,6.497-3.903,2.077-7.868c4.066-11.895,5.961-12.855,5.296,5.115-13.036Z"/>
                <path fill="#847d4a" d="m136.725,92.214c-2.14,11.952-4.129,17.968-5.965,6.016c-1.688-11.008-1.488-4.122-2.029-5.707c-0.588-0.582-1.035,1.53-5.459,4.312c-9.135,7.418,12.347,3.032-3.318,7.619c-4.421,11.522-6.497,3.903-2.077,7.868c-4.066,11.895-5.961,12.855-5.296-5.115,13.036Z"/>
                <path fill="#847d4a" d="m107.786,136.725c-11.952-2.14-17.968-4.129-6.016-5.965c11.008-1.688,4.122-1.488,5.707-2.029c0.582-0.588-1.53-1.035-4.312-5.459c-7.418-9.135-3.032-12.347-7.619-3.318c-11.522-4.421-3.903-6.497-7.868-2.077c-11.895-4.066-12.855-5.961,5.115-5.296,13.036,13.036Z"/>
                <path fill="#847d4a" d="m92.214,63.275c11.952,2.14,17.968,4.129,6.016,5.965c-11.008,1.688-4.122,1.488-5.707,2.029c-0.582,0.588,1.53,1.035,4.312,5.459c7.418,9.135,3.032,12.347,7.619,3.318c11.522,4.421,3.903,6.497,7.868,2.077c11.895,4.066,12.855,5.961-5.115,5.296-13.036-13.036Z"/>
            </svg>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Ornament Guard SVG (for RSVP & Gift sections)
   Curved bracket/arch border from reference
   ───────────────────────────────────────────── */
function OrnamentGuardTop() {
    return (
        <div className="aruna-ornament-guard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.46 29.54" style={{ width: '100%', display: 'block' }}>
                <path fill="#c8b680" d="M2,29.54c14.94-.52,27-12.59,27.52-27.54h348.42c.52,14.95,12.58,27.02,27.52,27.54h2v-.98c0-.55-.45-1-1-1-14.63,0-26.54-11.91-26.54-26.56,0-.55-.45-1-1-1H28.54c-.55,0-1,.45-1,1,0,14.64-11.9,26.56-26.54,26.56-.55,0-1,.45-1,1v.98h2Z" />
            </svg>
        </div>
    );
}

function OrnamentGuardBottom() {
    return (
        <div className="aruna-ornament-guard aruna-ornament-guard--bottom">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.46 29.54" style={{ width: '100%', display: 'block', transform: 'scaleY(-1)' }}>
                <path fill="#c8b680" d="M2,29.54c14.94-.52,27-12.59,27.52-27.54h348.42c.52,14.95,12.58,27.02,27.52,27.54h2v-.98c0-.55-.45-1-1-1-14.63,0-26.54-11.91-26.54-26.56,0-.55-.45-1-1-1H28.54c-.55,0-1,.45-1,1,0,14.64-11.9,26.56-26.54,26.56-.55,0-1,.45-1,1v.98h2Z" />
            </svg>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Diamond Frame SVG for Countdown Items
   ───────────────────────────────────────────── */
function CountdownDiamondFrame() {
    return (
        <svg className="aruna-countdown__diamond" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 70" preserveAspectRatio="xMidYMid meet">
            <path fill="none" stroke="#cdbb83" strokeWidth="1"
                d="M55,2 C65,2,75,8,80,16 C85,8,95,2,105,7 L105,7 C100,18,98,30,98,35 C98,40,100,52,105,63 L105,63 C95,68,85,62,80,54 C75,62,65,68,55,68 C45,68,35,62,30,54 C25,62,15,68,5,63 L5,63 C10,52,12,40,12,35 C12,30,10,18,5,7 L5,7 C15,2,25,8,30,16 C35,8,45,2,55,2 Z" />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   Particle Canvas Component
   ───────────────────────────────────────────── */
function ParticleCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.life = Math.random() * 300 + 100;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;
                if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(197, 168, 128, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 40; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="aruna-particles" />;
}

/* ─────────────────────────────────────────────
   Countdown Hook
   ───────────────────────────────────────────── */
function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const tick = () => {
            const now = new Date().getTime();
            const diff = new Date(targetDate).getTime() - now;
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}

/* ─────────────────────────────────────────────
   Intersection Observer Hook for Reveal
   ───────────────────────────────────────────── */
function useReveal() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}

function RevealDiv({ children, className = '', variant = '' }) {
    const ref = useReveal();
    const cls = variant ? `aruna-reveal--${variant}` : 'aruna-reveal';
    return <div ref={ref} className={`${cls} ${className}`}>{children}</div>;
}

/* ═══════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════ */

/* ── Cover ── */
function CoverSection({ onOpen, guestName }) {
    return (
        <div className="aruna-cover" id="aruna-cover">
            <MonogramShield />
            <div className="aruna-cover__names">Ila &amp; Fachrul</div>
            <div className="aruna-cover__date">May 2025</div>
            <div className="aruna-cover__guest-box">
                <div className="aruna-cover__guest-label">Kepada Bapak/Ibu/Saudara/i</div>
                <div className="aruna-cover__guest-name">{guestName || 'Tamu Undangan'}</div>
            </div>
            <div className="aruna-cover__desc">
                Kami mengundang Anda untuk hadir di momen istimewa kami.
            </div>
            <button className="aruna-cover__btn" onClick={onOpen}>
                BUKA UNDANGAN
            </button>
        </div>
    );
}

/* ── Hero ── */
function HeroSection() {
    return (
        <section className="aruna-section aruna-hero" id="home">
            <img src={ornamentLeft} alt="" className="aruna-ornament aruna-ornament--left" />
            <img src={ornamentRight} alt="" className="aruna-ornament aruna-ornament--right" />
            <div className="aruna-section__inner">
                <RevealDiv>
                    <div className="aruna-hero__pretitle">The Wedding of</div>
                </RevealDiv>
                <RevealDiv>
                    <h1 className="aruna-hero__title">
                        Ila &amp;<br />Fachrul
                    </h1>
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-hero__date-text">Desember 2026</div>
                    <div className="aruna-hero__venue">Club House Jakarta Garden City</div>
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-hero__verse">
                        <p>&ldquo;Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).&rdquo;</p>
                        <cite>Adz-Dzariyat: 49</cite>
                    </div>
                </RevealDiv>
                <div className="aruna-scroll-indicator">
                    <div className="aruna-scroll-indicator__icon">
                        <div className="aruna-scroll-indicator__dot" />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Divider ── */
function DividerSection() {
    return (
        <RevealDiv variant="zoom" className="aruna-divider">
            <StarDivider />
        </RevealDiv>
    );
}

/* ── Couple ── */
function CoupleSection() {
    return (
        <section className="aruna-section aruna-section--padded" id="couple">
            <img src={ornamentLeft} alt="" className="aruna-ornament aruna-ornament--left" />
            <img src={ornamentRight} alt="" className="aruna-ornament aruna-ornament--right" />
            <div className="aruna-section__inner">
                <RevealDiv className="aruna-couple__header">
                    <h2 className="aruna-couple__title">Bride &amp; Groom</h2>
                    <p className="aruna-couple__desc">
                        Dengan segala puji bagi Allah yang telah menciptakan mahluk-Nya berpasang-pasangan, Ya Allah izinkanlah kami merangkai cinta yang Engkau berikan dalam ikatan pernikahan.
                    </p>
                </RevealDiv>

                {/* Bride */}
                <RevealDiv className="aruna-profile">
                    <div className="aruna-profile__frame-container">
                        <img src={frameProfile} alt="" className="aruna-profile__frame-bg" />
                        <div className="aruna-profile__photo-wrap">
                            <img src={aruna1} alt="Aruna Adhita" className="aruna-profile__photo-symmetric" />
                        </div>
                    </div>
                    <h3 className="aruna-profile__name">ARUNA ADHITA</h3>
                    <p className="aruna-profile__role">PUTRI KEDUA DARI</p>
                    <p className="aruna-profile__parents">
                        Bapak Nama_Bapak<br />&amp; Ibu Nama_Ibu
                    </p>
                    <a href="https://www.instagram.com/" className="aruna-profile__social" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram" /> USERNAME
                    </a>
                </RevealDiv>

                {/* Ampersand */}
                <RevealDiv variant="zoom" className="aruna-ampersand">
                    <div className="aruna-ampersand__line" />
                    <span className="aruna-ampersand__symbol">&amp;</span>
                    <div className="aruna-ampersand__line" />
                </RevealDiv>

                {/* Groom */}
                <RevealDiv className="aruna-profile">
                    <div className="aruna-profile__frame-container">
                        <img src={frameProfile} alt="" className="aruna-profile__frame-bg" />
                        <div className="aruna-profile__photo-wrap">
                            <img src={aruna2} alt="Fachrul Rozi" className="aruna-profile__photo-symmetric" />
                        </div>
                    </div>
                    <h3 className="aruna-profile__name">FACHRUL ROZI</h3>
                    <p className="aruna-profile__role">PUTRA KEDUA DARI</p>
                    <p className="aruna-profile__parents">
                        Bapak Nama_Bapak<br />&amp; Ibu Nama_Ibu
                    </p>
                    <a href="https://www.instagram.com/" className="aruna-profile__social" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram" /> USERNAME
                    </a>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Timeline ── */
function TimelineSection() {
    const stories = [
        { title: 'Chapter One: Awal Bertemu', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum.' },
        { title: 'Chapter Two: Menjalin Hubungan', text: 'Facilisis sed odio morbi quis commodo odio. Condimentum mattis pellentesque id nibh tortor id aliquet. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula.' },
        { title: 'Chapter Three: Bertunangan', text: 'Magna fermentum iaculis eu non. Pretium lectus quam id leo. Arcu vitae elementum curabitur vitae nunc sed.' },
        { title: 'Chapter Four: Hari Pernikahan', text: 'Augue lacus viverra vitae congue eu consequat. Eget nunc scelerisque viverra mauris in aliquam sem fringilla.' },
    ];

    return (
        <section className="aruna-section aruna-section--padded" id="story">
            <div className="aruna-section__inner">
                <RevealDiv className="aruna-timeline__header">
                    <div className="aruna-timeline__pretitle" style={{ fontFamily: 'var(--aruna-font-display)', fontSize: '18px', color: 'var(--aruna-gold)' }}>A Story of</div>
                    <h2 className="aruna-timeline__title">JOURNEY OF LOVE</h2>
                    <p className="aruna-timeline__desc" style={{ color: 'var(--aruna-gold)', fontStyle: 'italic', maxWidth: '340px', margin: '0 auto 40px', lineHeight: '2', fontWeight: '300' }}>
                        &ldquo;Marriage is not a race, it&rsquo;s not about fast or slow.<br/>
                        But, who is ready to carry out a great mandate.&rdquo;
                    </p>
                </RevealDiv>

                <div className="aruna-timeline__track--alt" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {stories.map((s, i) => (
                        <RevealDiv key={i} className={`aruna-timeline__item`} style={{ textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                            <div className="aruna-timeline__chapter" style={{ fontFamily: 'var(--aruna-font-display)', fontSize: '20px', color: 'var(--aruna-gold)', marginBottom: '8px' }}>{s.title}</div>
                            <div className="aruna-timeline__text" style={{ fontFamily: 'var(--aruna-font-body)', fontSize: '13px', color: 'var(--aruna-gold)', lineHeight: '1.9', fontWeight: '300' }}>{s.text}</div>
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Event (Save The Date) ── Reordered to match reference */
function EventSection() {
    const countdown = useCountdown('2026-12-20T08:00:00');

    return (
        <section className="aruna-section aruna-section--padded" id="event">
            <img src={flowerLeft} alt="" className="aruna-ornament aruna-ornament--flower-left" />
            <img src={flowerRight} alt="" className="aruna-ornament aruna-ornament--flower-right" />
            
            <img src={rambatOrnament} alt="" className="aruna-event-ornament aruna-event-ornament--rambat" />
            <img src={janurOrnament} alt="" className="aruna-event-ornament aruna-event-ornament--janur" />

            <div className="aruna-section__inner">
                <RevealDiv>
                    <h2 className="aruna-event__title">Save The Date</h2>
                </RevealDiv>

                <RevealDiv>
                    <div className="aruna-event__quote">
                        &ldquo;Pernikahan adalah ibadah, dan setiap ibadah bermuara pada cinta-Nya sebagai tujuan. Sudah sewajarnya setiap upaya meraih cinta-Nya dilakukan dengan sukacita.&rdquo;
                    </div>
                </RevealDiv>

                {/* Countdown with diamond frames - BEFORE save button per reference */}
                <RevealDiv>
                    <div className="aruna-countdown aruna-countdown--diamond">
                        {[
                            { val: countdown.days, label: 'Hari' },
                            { val: countdown.hours, label: 'Jam' },
                            { val: countdown.minutes, label: 'Menit' },
                            { val: countdown.seconds, label: 'Detik' },
                        ].map((item, i) => (
                            <div key={i} className="aruna-countdown__item aruna-countdown__item--diamond">
                                <div className="aruna-countdown__diamond-wrap">
                                    <CountdownDiamondFrame />
                                    <div className="aruna-countdown__num">{item.val}</div>
                                </div>
                                <div className="aruna-countdown__label">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </RevealDiv>

                <RevealDiv>
                    <button className="aruna-event__save-btn" onClick={() => window.open('https://www.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+Ila+%26+Fachrul&dates=20261220T010000Z%2F20261220T070000Z', '_blank')}>
                        Simpan Tanggal
                    </button>
                </RevealDiv>

                <RevealDiv>
                    <div className="aruna-event__subtitle">Date &amp; Place</div>
                </RevealDiv>

                <RevealDiv>
                    <img src={eventFrameTop} alt="" style={{ width: '100%', marginBottom: '-1px' }} />
                </RevealDiv>

                <RevealDiv>
                    <div className="aruna-event__card" style={{ borderRadius: 0 }}>
                        <div className="aruna-event__card-title">AKAD</div>
                        <div className="aruna-event__card-detail">SABTU, 20 DESEMBER 2026</div>
                        <div className="aruna-event__card-detail">08.00 - 10.00 WIB</div>
                        <div className="aruna-event__card-venue">VUE PALACE HOTEL</div>
                        <div className="aruna-event__card-address">Jl. Otto Iskandar Dinata No. 3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung</div>
                        <button className="aruna-event__map-btn" onClick={() => window.open('https://maps.app.goo.gl/', '_blank')}>
                            GOOGLE MAPS
                        </button>
                    </div>
                </RevealDiv>

                <RevealDiv>
                    <div className="aruna-event__card" style={{ borderRadius: 0, marginBottom: 0 }}>
                        <div className="aruna-event__card-title">RESEPSI</div>
                        <div className="aruna-event__card-detail">SABTU, 20 DESEMBER 2026</div>
                        <div className="aruna-event__card-detail">08.00 - 10.00 WIB</div>
                        <div className="aruna-event__card-venue">VUE PALACE HOTEL</div>
                        <div className="aruna-event__card-address">Jl. Otto Iskandar Dinata No. 3, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung</div>
                        <button className="aruna-event__map-btn" onClick={() => window.open('https://maps.app.goo.gl/', '_blank')}>
                            GOOGLE MAPS
                        </button>
                    </div>
                </RevealDiv>

                <RevealDiv>
                    <img src={eventFrameBottom} alt="" style={{ width: '100%', marginTop: '-1px' }} />
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Dress Code ── */
function DressCodeSection() {
    const colors = [
        { name: 'Sage Green', hex: '#8B9E7E' },
        { name: 'Dust Green', hex: '#6B7F6B' },
        { name: 'Mustard Gold', hex: '#C5A55A' },
        { name: 'Copper Brown', hex: '#9E6B4A' },
    ];
    return (
        <section className="aruna-section aruna-section--padded" id="dresscode">
            <div className="aruna-section__inner">
                <RevealDiv>
                    <h2 className="aruna-couple__title">A Guide To<br />Dress Codes</h2>
                    <p className="aruna-gift__desc">
                        Kami mengundang tamu undangan untuk mengenakan palet warna berikut untuk keseragaman foto:
                    </p>
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-dresscode__palette">
                        {colors.map((c, i) => (
                            <div key={i} className="aruna-dresscode__item">
                                <div className="aruna-dresscode__circle" style={{ backgroundColor: c.hex }} />
                            </div>
                        ))}
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Live Streaming ── */
function LiveStreamingSection() {
    return (
        <section className="aruna-section aruna-section--padded" id="livestream">
            <div className="aruna-section__inner">
                <RevealDiv>
                    <img src={couplePhoto} alt="Live Streaming" className="aruna-livestream__photo" />
                </RevealDiv>
                <RevealDiv>
                    <h2 className="aruna-couple__title">Join Our Wedding<br />Live Streaming</h2>
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-hero__date-text" style={{ marginBottom: '4px' }}>Sabtu, 20 Desember 2026</div>
                    <div className="aruna-hero__venue" style={{ marginBottom: '16px' }}>08.00 - 10.00 WIB</div>
                </RevealDiv>
                <RevealDiv>
                    <p className="aruna-gift__desc" style={{ marginBottom: '16px' }}>
                        Kami akan menyiarkan momen bahagia prosesi pernikahan kami secara virtual melalui platform berikut.
                    </p>
                </RevealDiv>
                <RevealDiv>
                    <button className="aruna-event__save-btn" onClick={() => window.open('https://www.instagram.com/', '_blank')}>
                        Join Live
                    </button>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Video YouTube ── */
function VideoSection() {
    return (
        <section className="aruna-section" id="video">
            <div className="aruna-section__inner" style={{ maxWidth: '100%', padding: '0 24px' }}>
                <RevealDiv>
                    <DividerSection />
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-video__wrapper">
                        <iframe
                            src="https://www.youtube.com/embed/ncaok-mSlro?autoplay=1&mute=1&loop=1&playlist=ncaok-mSlro&controls=1&playsinline=1"
                            title="Wedding Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </RevealDiv>
                <RevealDiv>
                    <DividerSection />
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Gallery ── */
function GallerySection() {
    const images = [aruna1, aruna2, aruna3, aruna4, aruna5, aruna6];
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(-1);
    const prevImage = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + images.length) % images.length); };
    const nextImage = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % images.length); };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };
        if (lightboxIndex >= 0) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex]);

    return (
        <section className="aruna-section aruna-section--padded" id="gallery">
            <img src={ornamentLeft} alt="" className="aruna-ornament aruna-ornament--left" />
            <img src={ornamentRight} alt="" className="aruna-ornament aruna-ornament--right" />
            <div className="aruna-section__inner">
                <RevealDiv>
                    <h2 className="aruna-gallery__title">Our Moment</h2>
                    <p className="aruna-gift__desc" style={{ fontStyle: 'italic' }}>
                        &ldquo;I was created in time to fill your time, and I use all the time in my life to love you.&rdquo;
                    </p>
                    <p className="aruna-hero__venue" style={{ marginBottom: '20px' }}>Photo Video by Ila &amp; Fachrul</p>
                </RevealDiv>
                <RevealDiv className="aruna-gallery__grid">
                    {images.map((src, i) => (
                        <div key={i} className="aruna-gallery__item" onClick={() => openLightbox(i)}>
                            <img src={src} alt={`Gallery ${i + 1}`} />
                            <div className="aruna-gallery__zoom-icon">
                                <i className="fas fa-search-plus" />
                            </div>
                        </div>
                    ))}
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-gallery__quote">
                        <p>&ldquo;I love you, I am who I am because of you. You are every reason, every hope and every dream. I&rsquo;ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.&rdquo;</p>
                        <p style={{ marginTop: '10px', fontWeight: '400' }}>ILA &amp; FACHRUL</p>
                    </div>
                </RevealDiv>
            </div>
            
            {/* Lightbox / Carousel Elementor Style */}
            {lightboxIndex >= 0 && (
                <div className="aruna-lightbox" onClick={closeLightbox}>
                    <button className="aruna-lightbox__close" onClick={closeLightbox} title="Close">
                        <i className="fas fa-times" />
                    </button>
                    <div className="aruna-lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <button className="aruna-lightbox__nav aruna-lightbox__nav--prev" onClick={prevImage}>
                            <i className="fas fa-chevron-left" />
                        </button>
                        <img 
                            src={images[lightboxIndex]} 
                            alt="Zoomed Gallery" 
                            className="aruna-lightbox__img" 
                        />
                        <button className="aruna-lightbox__nav aruna-lightbox__nav--next" onClick={nextImage}>
                            <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

/* ── Wedding Frame Section ── */
function WeddingFrameSection() {
    return (
        <section className="aruna-section aruna-section--padded" id="weddingframe">
            <div className="aruna-section__inner">
                <RevealDiv>
                    <div className="aruna-timeline__pretitle">Capture Your Moment</div>
                    <h2 className="aruna-gallery__title">WEDDING FRAME</h2>
                    <p className="aruna-gift__desc">
                        Unggah dan abadikan momen kamu saat menghadiri pernikahan kami dengan menggunakan Wedding Frame di bawah ini.
                    </p>
                </RevealDiv>
                <RevealDiv>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="aruna-event__save-btn" onClick={() => window.open('https://www.instagram.com/', '_blank')}>
                            <i className="fab fa-instagram" style={{ marginRight: '8px' }} /> Open Frame
                        </button>
                    </div>
                    <p className="aruna-gift__desc" style={{ marginTop: '16px', fontStyle: 'italic', fontSize: '11px' }}>
                        *Disarankan untuk memperbarui aplikasi Instagram ke versi terbaru.
                    </p>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Gift ── */
function GiftSection() {
    const [copied, setCopied] = useState(null);
    const [giftTab, setGiftTab] = useState('amplop');

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <section className="aruna-section aruna-section--padded" id="gift">
            <div className="aruna-section__inner">
                {/* Ornament Guard Top */}
                <OrnamentGuardTop />

                <div className="aruna-guard-content">
                    <RevealDiv>
                        <h2 className="aruna-gift__title">Wedding Gift</h2>
                        <p className="aruna-gift__desc">
                            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami akan senang hati menerimanya yang tentu akan semakin melengkapi kebahagiaan kami.
                        </p>
                    </RevealDiv>

                    <RevealDiv>
                        <div className="aruna-gift__tabs">
                            <button className={`aruna-gift__tab ${giftTab === 'amplop' ? 'is-active' : ''}`} onClick={() => setGiftTab('amplop')}>E-Amplop</button>
                            <button className={`aruna-gift__tab ${giftTab === 'registry' ? 'is-active' : ''}`} onClick={() => setGiftTab('registry')}>Gift Registry</button>
                        </div>
                    </RevealDiv>

                    {giftTab === 'amplop' && (
                        <>
                            <RevealDiv>
                                <div className="aruna-gift__card">
                                    <div className="aruna-gift__bank-name">BCA</div>
                                    <div className="aruna-gift__account">0123 456 789</div>
                                    <div className="aruna-gift__holder">Nama Penerima</div>
                                    <button className="aruna-gift__copy-btn" onClick={() => copyToClipboard('0123456789', 'bca')}>
                                        {copied === 'bca' ? 'Tersalin!' : 'Salin'}
                                    </button>
                                </div>
                            </RevealDiv>

                            <RevealDiv>
                                <div className="aruna-gift__card">
                                    <div className="aruna-gift__bank-name">GOPAY</div>
                                    <div className="aruna-gift__account">0123 456 789</div>
                                    <div className="aruna-gift__holder">Nama Penerima</div>
                                    <button className="aruna-gift__copy-btn" onClick={() => copyToClipboard('0123456789', 'gopay')}>
                                        {copied === 'gopay' ? 'Tersalin!' : 'Salin'}
                                    </button>
                                </div>
                            </RevealDiv>
                        </>
                    )}

                    {giftTab === 'registry' && (
                        <RevealDiv>
                            <div className="aruna-gift__card">
                                <div className="aruna-gift__bank-name">KIRIM KADO</div>
                                <div className="aruna-gift__holder" style={{ marginBottom: '8px' }}>Jl. Lorem Ipsum No. 01, RT01 RW01, Kel. Dolor, Kec. Sit Amet, Kota Bandung</div>
                                <button className="aruna-gift__copy-btn" onClick={() => copyToClipboard('Jl. Lorem Ipsum No. 01, RT01 RW01, Kel. Dolor, Kec. Sit Amet, Kota Bandung', 'address')}>
                                    {copied === 'address' ? 'Tersalin!' : 'Salin'}
                                </button>
                            </div>
                        </RevealDiv>
                    )}
                </div>

                {/* Ornament Guard Bottom */}
                <OrnamentGuardBottom />
            </div>
        </section>
    );
}

/* ── RSVP ── */
function RsvpSection() {
    const [form, setForm] = useState({ name: '', attendance: 'hadir', guests: '1', message: '' });
    const [wishes, setWishes] = useState([
        { name: 'Ahmad', text: 'Selamat menempuh hidup baru! Barakallahu lakuma.', time: '2 jam lalu' },
        { name: 'Siti', text: 'Happy wedding Ila & Fachrul! Semoga menjadi keluarga sakinah mawaddah warahmah.', time: '5 jam lalu' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.name && form.message) {
            setWishes(prev => [{ name: form.name, text: form.message, time: 'Baru saja' }, ...prev]);
            setForm({ name: '', attendance: 'hadir', guests: '1', message: '' });
        }
    };

    return (
        <section className="aruna-section aruna-section--padded" id="rsvp">
            <div className="aruna-section__inner">
                {/* Ornament Guard Top */}
                <OrnamentGuardTop />

                <div className="aruna-guard-content">
                    <RevealDiv>
                        <h2 className="aruna-rsvp__title">RSVP &amp; Wishes</h2>
                        <p className="aruna-gift__desc">
                            Bagi tamu undangan yang akan menghadiri acara pernikahan kami, mohon mengirimkan konfirmasi kehadiran dengan mengisi formulir berikut ini:
                        </p>
                    </RevealDiv>

                    <RevealDiv>
                        <form className="aruna-rsvp__form" onSubmit={handleSubmit}>
                            <div className="aruna-rsvp__field">
                                <label className="aruna-rsvp__label">Nama</label>
                                <input className="aruna-rsvp__input" type="text" placeholder="Masukkan nama Anda"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="aruna-rsvp__field">
                                <label className="aruna-rsvp__label">Konfirmasi Kehadiran</label>
                                <div className="aruna-rsvp__attendance-btns">
                                    <button 
                                        type="button" 
                                        className={`aruna-rsvp__attendance-btn ${form.attendance === 'hadir' ? 'is-active' : ''}`}
                                        onClick={() => setForm({ ...form, attendance: 'hadir' })}
                                    >
                                        Hadir
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`aruna-rsvp__attendance-btn ${form.attendance === 'tidak' ? 'is-active' : ''}`}
                                        onClick={() => setForm({ ...form, attendance: 'tidak' })}
                                    >
                                        Tidak Hadir
                                    </button>
                                </div>
                            </div>
                            <div className="aruna-rsvp__field">
                                <label className="aruna-rsvp__label">Jumlah Tamu</label>
                                <select className="aruna-rsvp__select" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                                    <option value="1">1 Orang</option>
                                    <option value="2">2 Orang</option>
                                    <option value="3">3 Orang</option>
                                </select>
                            </div>
                            <div className="aruna-rsvp__field">
                                <label className="aruna-rsvp__label">Ucapan &amp; Doa</label>
                                <textarea className="aruna-rsvp__textarea" placeholder="Tulis ucapan untuk kedua mempelai..."
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                            </div>
                            <button type="submit" className="aruna-rsvp__submit">Kirim Konfirmasi</button>
                        </form>
                    </RevealDiv>

                    <div style={{ marginTop: '32px' }}>
                        {wishes.map((w, i) => (
                            <RevealDiv key={i}>
                                <div className="aruna-wish">
                                    <div className="aruna-wish__name">{w.name}</div>
                                    <div className="aruna-wish__text">{w.text}</div>
                                    <div className="aruna-wish__time">{w.time}</div>
                                </div>
                            </RevealDiv>
                        ))}
                    </div>
                </div>

                {/* Ornament Guard Bottom */}
                <OrnamentGuardBottom />
            </div>
        </section>
    );
}

/* ── Footer ── */
function FooterSection() {
    return (
        <footer className="aruna-footer">
            <RevealDiv>
                <DividerSection />
                <MonogramShield width={120} height={180} />
                <div className="aruna-footer__initial">ILA &amp; FACHRUL</div>
                <div className="aruna-footer__thankyou">THANK YOU</div>
                <div className="aruna-footer__message">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.
                </div>
                <div className="aruna-footer__credit">Powered by Groovy Digital</div>
            </RevealDiv>
        </footer>
    );
}

/* ── Navigation Menu & Controls ── */
function Navigation({ isOpened, isPlaying, onToggleMusic }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const menuItems = [
        { id: 'home', label: 'Home' },
        { id: 'couple', label: 'Bride and Groom' },
        { id: 'event', label: 'Wedding Event' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'rsvp', label: 'RSVP' },
        { id: 'gift', label: 'Gift' },
        { id: 'gift', label: 'Souvenir Card' }
    ];

    const handleOpenMenu = () => {
        setIsClosing(false);
        setIsMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsClosing(false);
        }, 500);
    };

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        handleCloseMenu();
    };

    if (!isOpened) return null;

    return (
        <>
            {/* Overlay Navigation Menu */}
            <div className={`aruna-nav-drawer ${isMenuOpen ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`}>
                <div className="aruna-nav-drawer__top">
                    <button className="aruna-nav-drawer__close" onClick={handleCloseMenu} title="Close">
                        CLOSE
                    </button>
                </div>
                <ul className="aruna-nav-drawer__list">
                    {menuItems.map((item) => (
                        <li key={item.label} className="aruna-nav-drawer__item">
                            <button onClick={() => scrollToSection(item.id)}>{item.label}</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Top Right Hamburger with animation */}
            <div className={`aruna-top-nav ${isMenuOpen ? 'is-hidden' : ''}`}>
                <button className="aruna-nav-toggle" onClick={handleOpenMenu} title="Menu">
                    <span className="aruna-nav-toggle__line line-1" />
                    <span className="aruna-nav-toggle__line line-2" />
                    <span className="aruna-nav-toggle__line line-3" />
                </button>
            </div>

            {/* Bottom Controls */}
            <div className={`aruna-bottom-controls ${isMenuOpen ? 'is-hidden' : ''}`}>
                <div className="aruna-floating" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="aruna-floating__btn" onClick={() => scrollToSection('rsvp')} title="RSVP">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </button>
                    <button className="aruna-floating__btn" onClick={onToggleMusic} title="Music">
                        {isPlaying ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/>
                            </svg>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                                <line x1="23" y1="1" x2="1" y2="23" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function Aruna() {
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const guestName = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('to') || 'Tamu Undangan'
        : 'Tamu Undangan';

    const handleOpen = useCallback(() => {
        setIsOpened(true);
        document.getElementById('aruna-cover')?.classList.add('is-opened');
        // Auto play music
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, []);

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.muted = true;
            setIsPlaying(false);
        } else {
            audio.muted = false;
            // Handle if it hasn't actually started playing yet
            if (audio.paused) {
                audio.play().catch(() => {});
            }
            setIsPlaying(true);
        }
    }, [isPlaying]);

    return (
        <div className="aruna-page">
            <Head>
                <title>DEMO: Heritage Series - Aruna</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            <ParticleCanvas />

            {/* Background Music */}
            <audio ref={audioRef} loop preload="auto" playsInline>
                <source src="/audio/backsound.mp3" type="audio/mpeg" />
            </audio>

            {/* Cover */}
            <CoverSection onOpen={handleOpen} guestName={guestName} />

            {/* Main Split Layout */}
            <div className="aruna-main">
                {/* Left Fixed Panel */}
                <div className="aruna-main__left">
                    <img src={couplePhoto} alt="Ila & Fachrul" className="aruna-main__left-img" />
                    <div className="aruna-main__left-overlay">
                        <div className="aruna-main__left-pretitle">THE WEDDING OF</div>
                        <div className="aruna-main__left-title">ILA &amp; FACHRUL</div>
                        <div className="aruna-main__left-quote">
                            &ldquo;I love you, I am who I am because of you. You are every reason, every hope and every dream. I&rsquo;ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.&rdquo;
                        </div>
                    </div>
                </div>

                {/* Right Scrollable Panel */}
                <div className="aruna-main__right">
                    <HeroSection />
                    <DividerSection />
                    <CoupleSection />
                    <DividerSection />
                    <TimelineSection />
                    <DividerSection />
                    <EventSection />
                    <DressCodeSection />
                    <LiveStreamingSection />
                    <VideoSection />
                    <GallerySection />
                    <DividerSection />
                    <WeddingFrameSection />
                    <DividerSection />
                    <RsvpSection />
                    <DividerSection />
                    <GiftSection />
                    <FooterSection />
                </div>
            </div>

            {/* Navigation and Floating Controls */}
            <Navigation isOpened={isOpened} isPlaying={isPlaying} onToggleMusic={toggleMusic} />
        </div>
    );
}
