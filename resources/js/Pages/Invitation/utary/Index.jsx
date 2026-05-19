import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import './style.css';

// Asset imports
import ornamentLeft from './asset/ornament-left.webp';
import ornamentRight from './asset/ornament-right.webp';
import dividerPattern from './asset/divider-pattern.webp';
import frameProfile from './asset/frame-profile.webp';
import couplePhoto from './asset/couple-photo.webp';
import flowerLeft from './asset/flower-left.webp';
import flowerRight from './asset/flower-right.webp';
import eventFrameTop from './asset/event-frame-top.webp';
import eventFrameBottom from './asset/event-frame-bottom.webp';
import souvenirCard from './asset/souvenir-card.webp';

/* ─────────────────────────────────────────────
   SVG Monogram Shield (gold outline, TF inside)
   Extracted from original demo
   ───────────────────────────────────────────── */
function MonogramShield({ width = 134, height = 200 }) {
    return (
        <div className="utary-cover__monogram" style={{ width, height }}>
            <svg
                className="utary-cover__monogram-svg"
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
            <div className="utary-cover__monogram-inner">
                <span className="utary-cover__monogram-year-top">20</span>
                <span className="utary-cover__monogram-initials">T<sub className="utary-cover__monogram-initial-sub">F</sub></span>
                <span className="utary-cover__monogram-year-bottom">26</span>
            </div>
        </div>
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

    return <canvas ref={canvasRef} className="utary-particles" />;
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
    const cls = variant ? `utary-reveal--${variant}` : 'utary-reveal';
    return <div ref={ref} className={`${cls} ${className}`}>{children}</div>;
}

/* ═══════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════ */

/* ── Cover ── */
function CoverSection({ onOpen, guestName }) {
    return (
        <div className="utary-cover" id="utary-cover">
            <MonogramShield />
            <div className="utary-cover__names">Tary &amp; Fachrul</div>
            <div className="utary-cover__date">May 2025</div>
            <div className="utary-cover__guest-box">
                <div className="utary-cover__guest-label">Tamu Undangan</div>
                <div className="utary-cover__guest-name">{guestName || 'Tamu Undangan'}</div>
            </div>
            <div className="utary-cover__desc">
                Kami mengundang Anda untuk menghadiri<br />acara pernikahan kami.
            </div>
            <button className="utary-cover__btn" onClick={onOpen}>
                BUKA UNDANGAN
            </button>
        </div>
    );
}

/* ── Hero ── */
function HeroSection() {
    return (
        <section className="utary-section utary-hero" id="home">
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <div className="utary-hero__pretitle">The Wedding of</div>
                </RevealDiv>
                <RevealDiv>
                    <h1 className="utary-hero__title">
                        Tary &amp;<br />Fachrul
                    </h1>
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-hero__date-text">Desember 2026</div>
                    <div className="utary-hero__venue">Club House Jakarta Garden City</div>
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-hero__verse">
                        <p>&ldquo;Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).&rdquo;</p>
                        <cite>Adz-Dzariyat: 49</cite>
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

/* ── Divider ── */
function DividerSection() {
    return (
        <RevealDiv variant="zoom" className="utary-divider">
            <img src={dividerPattern} alt="" className="utary-divider__img" />
        </RevealDiv>
    );
}

/* ── Couple ── */
function CoupleSection() {
    return (
        <section className="utary-section utary-section--padded" id="couple">
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv className="utary-couple__header">
                    <h2 className="utary-couple__title">Bride &amp; Groom</h2>
                    <p className="utary-couple__desc">
                        Dengan segala puji bagi Allah yang telah menciptakan mahluk-Nya berpasang-pasangan, Ya Allah izinkanlah kami merangkai cinta yang Engkau berikan dalam ikatan pernikahan.
                    </p>
                </RevealDiv>

                {/* Bride */}
                <RevealDiv className="utary-profile">
                    <div className="utary-profile__frame-wrap">
                        <img src={frameProfile} alt="" className="utary-profile__frame" />
                        <div className="utary-profile__photo" style={{ background: 'linear-gradient(135deg, var(--utary-bg-secondary), var(--utary-bg-dark))' }} />
                    </div>
                    <h3 className="utary-profile__name">Utary Adhita</h3>
                    <p className="utary-profile__role">Putri Kedua dari</p>
                    <p className="utary-profile__parents">
                        Bapak Nama_Bapak<br />&amp; Ibu Nama_Ibu
                    </p>
                    <a href="https://www.instagram.com/" className="utary-profile__social" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram" /> username
                    </a>
                </RevealDiv>

                {/* Ampersand */}
                <RevealDiv variant="zoom" className="utary-ampersand">
                    <div className="utary-ampersand__line" />
                    <span className="utary-ampersand__symbol">&amp;</span>
                    <div className="utary-ampersand__line" />
                </RevealDiv>

                {/* Groom */}
                <RevealDiv className="utary-profile">
                    <div className="utary-profile__frame-wrap">
                        <img src={frameProfile} alt="" className="utary-profile__frame" />
                        <div className="utary-profile__photo" style={{ background: 'linear-gradient(135deg, var(--utary-bg-secondary), var(--utary-bg-dark))' }} />
                    </div>
                    <h3 className="utary-profile__name">Fachrul Rozi</h3>
                    <p className="utary-profile__role">Putra Kedua dari</p>
                    <p className="utary-profile__parents">
                        Bapak Nama_Bapak<br />&amp; Ibu Nama_Ibu
                    </p>
                    <a href="https://www.instagram.com/" className="utary-profile__social" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram" /> username
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
        <section className="utary-section utary-section--padded" id="story">
            <img src={flowerLeft} alt="" className="utary-ornament utary-ornament--flower-left" />
            <img src={flowerRight} alt="" className="utary-ornament utary-ornament--flower-right" />
            <div className="utary-section__inner">
                <RevealDiv className="utary-timeline__header">
                    <div className="utary-timeline__pretitle">A story of</div>
                    <h2 className="utary-timeline__title">Journey of Love</h2>
                    <p className="utary-timeline__desc">
                        &ldquo;Marriage is not a race, it&rsquo;s not about fast or slow.
                        But, who is ready to carry out a great mandate.&rdquo;
                    </p>
                </RevealDiv>

                <div className="utary-timeline__track">
                    <div className="utary-timeline__line" />
                    {stories.map((s, i) => (
                        <RevealDiv key={i} className="utary-timeline__item">
                            <div className="utary-timeline__dot" />
                            <div className="utary-timeline__card">
                                <div className="utary-timeline__card-title">{s.title}</div>
                                <div className="utary-timeline__card-text">{s.text}</div>
                            </div>
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Event ── */
function EventSection() {
    const countdown = useCountdown('2026-12-20T08:00:00');

    return (
        <section className="utary-section utary-section--padded" id="event">
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-event__title">Save The Date</h2>
                </RevealDiv>

                <RevealDiv>
                    <img src={eventFrameTop} alt="" style={{ width: '100%', marginBottom: '-1px' }} />
                </RevealDiv>

                <RevealDiv>
                    <div className="utary-event__card" style={{ borderRadius: 0 }}>
                        <div className="utary-event__card-title">Akad Nikah</div>
                        <div className="utary-event__card-item">
                            <span className="utary-event__card-icon"><i className="fas fa-calendar-alt" /></span>
                            <span className="utary-event__card-label">Sabtu, 20 Desember 2026</span>
                        </div>
                        <div className="utary-event__card-item">
                            <span className="utary-event__card-icon"><i className="fas fa-clock" /></span>
                            <span className="utary-event__card-label">Pukul 08:00 - 10:00 WIB</span>
                        </div>
                        <div className="utary-event__card-item">
                            <span className="utary-event__card-icon"><i className="fas fa-map-marker-alt" /></span>
                            <span className="utary-event__card-label">Club House Jakarta Garden City, Jl. Jakarta Garden City, Cakung</span>
                        </div>
                        <button className="utary-event__map-btn" onClick={() => window.open('https://maps.google.com', '_blank')}>
                            <i className="fas fa-map" /> Lihat Lokasi
                        </button>
                    </div>
                </RevealDiv>

                <RevealDiv>
                    <div className="utary-event__card" style={{ borderRadius: 0, marginBottom: 0 }}>
                        <div className="utary-event__card-title">Resepsi</div>
                        <div className="utary-event__card-item">
                            <span className="utary-event__card-icon"><i className="fas fa-calendar-alt" /></span>
                            <span className="utary-event__card-label">Sabtu, 20 Desember 2026</span>
                        </div>
                        <div className="utary-event__card-item">
                            <span className="utary-event__card-icon"><i className="fas fa-clock" /></span>
                            <span className="utary-event__card-label">Pukul 11:00 - 14:00 WIB</span>
                        </div>
                        <div className="utary-event__card-item">
                            <span className="utary-event__card-icon"><i className="fas fa-map-marker-alt" /></span>
                            <span className="utary-event__card-label">Club House Jakarta Garden City, Jl. Jakarta Garden City, Cakung</span>
                        </div>
                        <button className="utary-event__map-btn" onClick={() => window.open('https://maps.google.com', '_blank')}>
                            <i className="fas fa-map" /> Lihat Lokasi
                        </button>
                    </div>
                </RevealDiv>

                <RevealDiv>
                    <img src={eventFrameBottom} alt="" style={{ width: '100%', marginTop: '-1px' }} />
                </RevealDiv>

                {/* Countdown */}
                <RevealDiv>
                    <div className="utary-countdown">
                        <div className="utary-countdown__item">
                            <div className="utary-countdown__num">{countdown.days}</div>
                            <div className="utary-countdown__label">Hari</div>
                        </div>
                        <div className="utary-countdown__item">
                            <div className="utary-countdown__num">{countdown.hours}</div>
                            <div className="utary-countdown__label">Jam</div>
                        </div>
                        <div className="utary-countdown__item">
                            <div className="utary-countdown__num">{countdown.minutes}</div>
                            <div className="utary-countdown__label">Menit</div>
                        </div>
                        <div className="utary-countdown__item">
                            <div className="utary-countdown__num">{countdown.seconds}</div>
                            <div className="utary-countdown__label">Detik</div>
                        </div>
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Gallery ── */
function GallerySection() {
    return (
        <section className="utary-section utary-section--padded" id="gallery">
            <img src={flowerLeft} alt="" className="utary-ornament utary-ornament--flower-left" />
            <img src={flowerRight} alt="" className="utary-ornament utary-ornament--flower-right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-gallery__title">Wedding Frame</h2>
                </RevealDiv>
                <RevealDiv className="utary-gallery__grid">
                    {[couplePhoto, couplePhoto, couplePhoto, couplePhoto].map((src, i) => (
                        <div key={i} className="utary-gallery__item">
                            <img src={src} alt={`Gallery ${i + 1}`} />
                        </div>
                    ))}
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Gift ── */
function GiftSection() {
    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <section className="utary-section utary-section--padded" id="gift">
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-gift__title">Wedding Gift</h2>
                    <p className="utary-gift__desc">
                        Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
                    </p>
                </RevealDiv>

                <RevealDiv>
                    <img src={souvenirCard} alt="Souvenir" style={{ width: '100%', borderRadius: '4px', marginBottom: '24px' }} />
                </RevealDiv>

                <RevealDiv>
                    <div className="utary-gift__card">
                        <div className="utary-gift__bank-name">Bank BCA</div>
                        <div className="utary-gift__account">1234 5678 9012</div>
                        <div className="utary-gift__holder">a/n Utary Adhita</div>
                        <button className="utary-gift__copy-btn" onClick={() => copyToClipboard('123456789012', 'bca')}>
                            <i className={copied === 'bca' ? 'fas fa-check' : 'fas fa-copy'} />
                            {copied === 'bca' ? 'Tersalin!' : 'Salin Rekening'}
                        </button>
                    </div>
                </RevealDiv>

                <RevealDiv>
                    <div className="utary-gift__card">
                        <div className="utary-gift__bank-name">Bank Mandiri</div>
                        <div className="utary-gift__account">9876 5432 1098</div>
                        <div className="utary-gift__holder">a/n Fachrul Rozi</div>
                        <button className="utary-gift__copy-btn" onClick={() => copyToClipboard('987654321098', 'mandiri')}>
                            <i className={copied === 'mandiri' ? 'fas fa-check' : 'fas fa-copy'} />
                            {copied === 'mandiri' ? 'Tersalin!' : 'Salin Rekening'}
                        </button>
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── RSVP ── */
function RsvpSection() {
    const [form, setForm] = useState({ name: '', attendance: 'hadir', guests: '1', message: '' });
    const [wishes, setWishes] = useState([
        { name: 'Ahmad', text: 'Selamat menempuh hidup baru! Barakallahu lakuma.', time: '2 jam lalu' },
        { name: 'Siti', text: 'Happy wedding Tary & Fachrul! Semoga menjadi keluarga sakinah mawaddah warahmah.', time: '5 jam lalu' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.name && form.message) {
            setWishes(prev => [{ name: form.name, text: form.message, time: 'Baru saja' }, ...prev]);
            setForm({ name: '', attendance: 'hadir', guests: '1', message: '' });
        }
    };

    return (
        <section className="utary-section utary-section--padded" id="rsvp">
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-rsvp__title">RSVP &amp; Wishes</h2>
                </RevealDiv>

                <RevealDiv>
                    <form className="utary-rsvp__form" onSubmit={handleSubmit}>
                        <div className="utary-rsvp__field">
                            <label className="utary-rsvp__label">Nama</label>
                            <input className="utary-rsvp__input" type="text" placeholder="Masukkan nama Anda"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="utary-rsvp__field">
                            <label className="utary-rsvp__label">Konfirmasi Kehadiran</label>
                            <div className="utary-rsvp__radio-group">
                                <label className="utary-rsvp__radio-label">
                                    <input type="radio" name="attendance" value="hadir"
                                        checked={form.attendance === 'hadir'} onChange={e => setForm({ ...form, attendance: e.target.value })} />
                                    Hadir
                                </label>
                                <label className="utary-rsvp__radio-label">
                                    <input type="radio" name="attendance" value="tidak"
                                        checked={form.attendance === 'tidak'} onChange={e => setForm({ ...form, attendance: e.target.value })} />
                                    Tidak Hadir
                                </label>
                            </div>
                        </div>
                        <div className="utary-rsvp__field">
                            <label className="utary-rsvp__label">Jumlah Tamu</label>
                            <select className="utary-rsvp__select" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                                <option value="1">1 Orang</option>
                                <option value="2">2 Orang</option>
                                <option value="3">3 Orang</option>
                            </select>
                        </div>
                        <div className="utary-rsvp__field">
                            <label className="utary-rsvp__label">Ucapan &amp; Doa</label>
                            <textarea className="utary-rsvp__textarea" placeholder="Tulis ucapan untuk kedua mempelai..."
                                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                        </div>
                        <button type="submit" className="utary-rsvp__submit">Kirim Konfirmasi</button>
                    </form>
                </RevealDiv>

                <div style={{ marginTop: '32px' }}>
                    {wishes.map((w, i) => (
                        <RevealDiv key={i}>
                            <div className="utary-wish">
                                <div className="utary-wish__name">{w.name}</div>
                                <div className="utary-wish__text">{w.text}</div>
                                <div className="utary-wish__time">{w.time}</div>
                            </div>
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Footer ── */
function FooterSection() {
    return (
        <footer className="utary-footer">
            <RevealDiv>
                <DividerSection />
                <div className="utary-footer__initial">T &amp; F</div>
                <div className="utary-footer__hashtag">#TaryFachrulWedding</div>
                <div className="utary-footer__thankyou">Thank You</div>
                <div className="utary-footer__credit">Powered by Groovy Digital</div>
            </RevealDiv>
        </footer>
    );
}

/* ── Floating Controls ── */
function FloatingControls({ isPlaying, onToggleMusic }) {
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="utary-floating">
            <button className={`utary-floating__btn ${isPlaying ? 'is-playing' : ''}`} onClick={onToggleMusic} title="Music">
                <i className={isPlaying ? 'fas fa-music' : 'fas fa-volume-mute'} />
            </button>
            <button className="utary-floating__btn" onClick={() => scrollToSection('rsvp')} title="RSVP">
                <i className="fas fa-envelope" />
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function Utary() {
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const guestName = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('to') || 'Tamu Undangan'
        : 'Tamu Undangan';

    const handleOpen = useCallback(() => {
        setIsOpened(true);
        document.getElementById('utary-cover')?.classList.add('is-opened');
        // Auto play music
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, []);

    const toggleMusic = useCallback(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, [isPlaying]);

    return (
        <div className="utary-page">
            <Head>
                <title>DEMO: Heritage Series - Utary</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            <ParticleCanvas />

            {/* Background Music (silent default) */}
            <audio ref={audioRef} loop preload="auto">
                <source src="https://attarivitation.com/wp-content/uploads/2024/10/backsound-attari-1.mp3" type="audio/mpeg" />
            </audio>

            {/* Cover */}
            <CoverSection onOpen={handleOpen} guestName={guestName} />

            {/* Main Split Layout */}
            <div className="utary-main">
                {/* Left Fixed Panel */}
                <div className="utary-main__left">
                    <img src={couplePhoto} alt="Tary & Fachrul" className="utary-main__left-img" />
                    <div className="utary-main__left-overlay">
                        <div className="utary-main__left-pretitle">The Wedding Of</div>
                        <div className="utary-main__left-title">Tary &amp; Fachrul</div>
                        <div className="utary-main__left-quote">
                            &ldquo;I love you, I am who I am because of you. You are every reason, every hope and every dream I&rsquo;ve ever had.&rdquo;
                        </div>
                    </div>
                </div>

                {/* Right Scrollable Panel */}
                <div className="utary-main__right">
                    <HeroSection />
                    <DividerSection />
                    <CoupleSection />
                    <DividerSection />
                    <TimelineSection />
                    <DividerSection />
                    <EventSection />
                    <DividerSection />
                    <GallerySection />
                    <DividerSection />
                    <GiftSection />
                    <DividerSection />
                    <RsvpSection />
                    <FooterSection />
                </div>
            </div>

            {/* Floating Controls */}
            {isOpened && <FloatingControls isPlaying={isPlaying} onToggleMusic={toggleMusic} />}
        </div>
    );
}
