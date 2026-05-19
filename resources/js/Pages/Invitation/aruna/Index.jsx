import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import './style.css';

// Asset imports
import ornamentLeft from './asset/Aruna-Tree-6-1-150x150.webp';
import ornamentRight from './asset/Aruna-Tree-6-1-150x150.webp';
import dividerPattern from './asset/Aruna-Engraving.webp';
import frameProfile from './asset/aa252722-1997-4918-b3f8-382d7ec74f62-768x768.webp';
import couplePhoto from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import maskProfile from './asset/mask-profile.webp'; // Kept as fallback or need Aruna specific mask
import flowerLeft from './asset/Aruna-Bunga-7-1-188x300.webp';
import flowerRight from './asset/Aruna-Bunga-300x287.webp';
import eventFrameTop from './asset/Aruna-LACE-2-1-768x1137.webp';
import eventFrameBottom from './asset/Aruna-LACE-2-1-768x1137.webp';
import aruna1 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna2 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';
import aruna3 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna4 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';
import aruna5 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna6 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';

/* ─────────────────────────────────────────────
   SVG Monogram Shield (gold outline, TF inside)
   Extracted from original demo
   ───────────────────────────────────────────── */
function MonogramShield({ width = 134, height = 200 }) {
    return (
        <div className="aruna-cover__monogram" style={{ width, height }}>
            <svg
                className="aruna-cover__monogram-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 145.39 216.259"
                style={{ color: '#ccba82' }}
            >
                {/* Outer frame - stroke only */}
                <path fill="none" stroke="currentColor" strokeWidth="1.5" d="m72.695,0C60.326,0,48.46,5.461,40.137,14.984c-3.082,3.527-7.524,5.432-12.188,5.227l-.077-.004c-7.28-.322-14.371,2.629-19.449,8.094C2.966,34.176.387,42.202,1.346,50.319c1.561,13.195,2.595,26.733,3.076,40.238.003.099.002.204.002.306,0,7.497-1.18,12.936-3.508,16.171-.303.422-.611.786-.916,1.099,2.181,2.259,4.445,7.117,4.424,17.506,0,.021,0,.042-.001.063-.481,13.505-1.516,27.043-3.076,40.238-.957,8.117,1.62,16.143,7.077,22.018,5.077,5.465,12.168,8.415,19.455,8.093l.07-.003c4.664-.205,9.107,1.7,12.189,5.227,8.322,9.523,20.189,14.984,32.558,14.984s24.236-5.461,32.558-14.984c3.082-3.527,7.525-5.432,12.189-5.227l.07.003c7.287.322,14.377-2.628,19.455-8.093,5.458-5.874,8.038-13.897,7.077-22.018-1.56-13.188-2.595-26.726-3.076-40.237-.002-.104-.001-.205-.002-.307,0-7.496,1.18-12.936,3.508-16.171.303-.422.611-.786.916-1.099-2.164-2.241-4.424-7.034-4.424-17.269,0-.1-.001-.199.002-.3.481-13.511,1.517-27.049,3.076-40.237.96-8.116-1.619-16.143-7.076-22.017-5.077-5.465-12.168-8.416-19.455-8.094l-.063.003c-4.671.205-9.114-1.7-12.196-5.226C96.931,5.461,85.064,0,72.695,0Z" />
                {/* Inner frame */}
                <path fill="none" stroke="currentColor" strokeWidth="1" d="m72.695,208.264c-10.061,0-19.733-4.465-26.538-12.25-4.43-5.069-10.817-7.976-17.525-7.976-.344,0-.687.007-1.014.022-.341.015-.593.02-.844.02-4.336,0-8.502-1.701-11.73-4.789-4.329-4.143-6.481-10.278-5.757-16.412,1.585-13.408,2.637-27.167,3.126-40.893l.007-.605c0-7.009-.91-12.526-2.782-16.854l-.172-.397.172-.397c1.872-4.326,2.782-9.861,2.782-16.922l-.008-.563c-.488-13.702-1.54-27.459-3.125-40.868-.725-6.133,1.428-12.268,5.758-16.412,3.229-3.088,7.393-4.79,11.728-4.79.249,0,.499.005.815.019.367.016.714.023,1.058.023,6.699,0,13.082-2.907,17.513-7.977,6.804-7.785,16.476-12.25,26.537-12.25s19.734,4.465,26.539,12.25c4.429,5.069,10.815,7.977,17.521,7.977.346,0,.691-.007,1.032-.022.349-.015.598-.021.847-.021,4.324,0,8.484,1.702,11.713,4.791,4.33,4.143,6.481,10.278,5.757,16.412-1.586,13.417-2.638,27.175-3.126,40.893l-.007.605c0,7.012.91,12.528,2.782,16.854l.172.397-.172.397c-1.872,4.326-2.782,9.861-2.782,16.921l.008.564c.487,13.694,1.539,27.451,3.125,40.869.726,6.131-1.426,12.266-5.757,16.411-3.229,3.089-7.395,4.79-11.73,4.79-.249,0-.497-.005-.826-.02-7.104-.324-13.9,2.625-18.557,7.953-6.806,7.785-16.479,12.25-26.539,12.25Z" />
            </svg>
            {/* Text overlaid on top of the SVG */}
            <div className="aruna-cover__monogram-inner">
                <span className="aruna-cover__monogram-year-top">20</span>
                <span className="aruna-cover__monogram-initials">T<sub className="aruna-cover__monogram-initial-sub">F</sub></span>
                <span className="aruna-cover__monogram-year-bottom">26</span>
            </div>
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
                <div className="aruna-cover__guest-label">Tamu Undangan</div>
                <div className="aruna-cover__guest-name">{guestName || 'Tamu Undangan'}</div>
            </div>
            <div className="aruna-cover__desc">
                Kami mengundang Anda untuk menghadiri<br />acara pernikahan kami.
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
            <img src={dividerPattern} alt="" className="aruna-divider__img" />
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
                    <div className="aruna-profile__frame-wrap">
                        <img src={frameProfile} alt="" className="aruna-profile__frame" />
                        <img 
                            src={aruna1} 
                            alt="Aruna Adhita" 
                            className="aruna-profile__photo" 
                            style={{
                                WebkitMaskImage: `url(${maskProfile})`,
                                maskImage: `url(${maskProfile})`,
                                WebkitMaskSize: 'cover',
                                maskSize: 'cover',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat'
                            }}
                        />
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
                    <div className="aruna-profile__frame-wrap">
                        <img src={frameProfile} alt="" className="aruna-profile__frame" />
                        <img 
                            src={aruna2} 
                            alt="Fachrul Rozi" 
                            className="aruna-profile__photo" 
                            style={{
                                WebkitMaskImage: `url(${maskProfile})`,
                                maskImage: `url(${maskProfile})`,
                                WebkitMaskSize: 'cover',
                                maskSize: 'cover',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat'
                            }}
                        />
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
                                <div className="aruna-rsvp__radio-group">
                                    <label className="aruna-rsvp__radio-label">
                                        <input type="radio" name="attendance" value="hadir"
                                            checked={form.attendance === 'hadir'} onChange={e => setForm({ ...form, attendance: e.target.value })} />
                                        Hadir
                                    </label>
                                    <label className="aruna-rsvp__radio-label">
                                        <input type="radio" name="attendance" value="tidak"
                                            checked={form.attendance === 'tidak'} onChange={e => setForm({ ...form, attendance: e.target.value })} />
                                        Tidak Hadir
                                    </label>
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
