import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';

// Import assets via Vite to bundle them correctly
import netlogoWedding from './asset/NETLOGO-THEWEDDING.svg';
import eyesSvg from './asset/01-eyes.svg';
import mouthSvg from './asset/02-mouth.svg';
import dummyCover from './asset/dummy-cover.png';
import dummyPortrait from './asset/dummy-portrait.png';

const ASSETS = {
    logo: netlogoWedding,
    eyes: eyesSvg,
    mouth: mouthSvg,
    cover: dummyCover,
    portrait: dummyPortrait,
};

/* ─── Helper ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}
function pad2(n) { return String(n).padStart(2, '0'); }
function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}
function getStorageUrl(url, fallback) {
    if (!url) return fallback;
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.startsWith('themes/') || cleanUrl.startsWith('/themes/')) {
        return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/storage/')) return cleanUrl;
    if (cleanUrl.startsWith('storage/')) return '/' + cleanUrl;
    if (cleanUrl.startsWith('/')) return cleanUrl;
    return `/storage/${cleanUrl}`;
}


/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 20, color: '#fff', background: '#141414', minHeight: '100vh' }}>
                <h2 style={{ color: '#E50914' }}>Terjadi kesalahan.</h2>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#aaa' }}>
                    {this.state.error?.toString()}
                </pre>
            </div>
        );
        return this.props.children;
    }
}

/* ═══════════════════════════════════════
   SCROLL ANIMATION WRAPPER
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', delay = 0 }) {
    const { t } = useTranslation();
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className={`${className} ${visible ? 'nf-reveal--in' : 'nf-reveal--out'}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}>
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION  (Who's Watching?)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];
    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null);
    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'The Wedding');
    const heroImg = getStorageUrl(invitation?.cover_image, null);

    return (
        <div className={`nf-cover${isOpened ? ' is-opened' : ''}`}>
            <div className="nf-cover__bg" style={{ backgroundImage: `url(${heroImg})` }} />
            <div className="nf-cover__overlay" />
            <div className="nf-cover__content">
                <img src={ASSETS.logo} alt="THE WEDDING" className="nf-cover__logo" />
                <h1 className="nf-cover__title">{coupleName}</h1>

                {/* Who's Watching Profiles */}
                <div className="nf-profiles">
                    <div className="nf-profile nf-profile--blue" onClick={onOpen} title={groom?.nickname || 'Pengantin Pria'}>
                        <div className="nf-profile__face">
                            <img src={ASSETS.eyes} alt="" className="nf-profile__eyes" />
                            <img src={ASSETS.mouth} alt="" className="nf-profile__mouth nf-mouth--left" />
                        </div>
                        <p className="nf-profile__name">{groom?.nickname || 'Pria'}</p>
                    </div>
                    <div className="nf-profile nf-profile--pink" onClick={onOpen} title={bride?.nickname || 'Pengantin Wanita'}>
                        <div className="nf-profile__face">
                            <img src={ASSETS.eyes} alt="" className="nf-profile__eyes" />
                            <img src={ASSETS.mouth} alt="" className="nf-profile__mouth nf-mouth--right" />
                        </div>
                        <p className="nf-profile__name">{bride?.nickname || 'Wanita'}</p>
                    </div>
                </div>

                {/* Guest Info */}
                <div className="nf-cover__guest">
                    <p className="nf-cover__guest-label">{t('invitation.dear_guest')}</p>
                    <p className="nf-cover__guest-name">{guestName || 'Tamu Undangan'}</p>
                    <p className="nf-cover__guest-note">{t('invitation.dear_guest_desc')}</p>
                </div>

                <button onClick={onOpen} id="tombol-buka" className="nf-cover__open-btn">
                    <i className="far fa-envelope-open" />
                    {t('invitation.open')}
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, scrollToSection, loveStories, galleries, enableRsvp, enableWishes, bankAccounts }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];
    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'The Wedding');
    const heroImg = getStorageUrl(invitation?.cover_image, null);

    return (
        <section id="opening" className="nf-opening">
            <div className="nf-opening__bg" style={{ backgroundImage: `url(${heroImg})` }} />
            <div className="nf-opening__overlay" />
            <div className="nf-opening__content">
                <img src={ASSETS.logo} alt="THE WEDDING" className="nf-opening__logo" />
                <h1 className="nf-opening__couple">{coupleName}</h1>
                {invitation?.opening_ayat && (
                    <p className="nf-opening__ayat">&ldquo;{invitation.opening_ayat}&rdquo;</p>
                )}
                {invitation?.opening_ayat_source && (
                    <p className="nf-opening__ayat-src">&mdash; {invitation.opening_ayat_source}</p>
                )}
                <p className="nf-opening__text">
                    {invitation?.opening_text || 'Atas Karunia Tuhan Yang Maha Esa, perkenankanlah kami menyampaikan kabar bahagia kepada Bapak/Ibu/Saudara/i mengenai hari pernikahan kami.'}
                </p>

                {/* Nav buttons */}
                <div className="nf-nav">
                    {scrollToSection ? (
                        <>
                            <button type="button" onClick={() => scrollToSection('bride_groom')} className="nf-nav__btn">{t('nav.mempelai')}</button>
                            <button type="button" onClick={() => scrollToSection('event')} className="nf-nav__btn">{t('nav.acara')}</button>
                            {loveStories?.length > 0 && <button type="button" onClick={() => scrollToSection('love_story')} className="nf-nav__btn">{t('invitation.love_story')}</button>}
                            {galleries?.length > 0 && <button type="button" onClick={() => scrollToSection('gallery')} className="nf-nav__btn">{t('invitation.gallery')}</button>}
                            {enableRsvp && <button type="button" onClick={() => scrollToSection('rsvp')} className="nf-nav__btn">{t('nav.rsvp')}</button>}
                            {enableWishes && <button type="button" onClick={() => scrollToSection('wishes')} className="nf-nav__btn">{t('invitation.wishes_title')}</button>}
                            {bankAccounts?.length > 0 && <button type="button" onClick={() => scrollToSection('bank')} className="nf-nav__btn">{t('nav.hadiah')}</button>}
                        </>
                    ) : (
                        <>
                            <a href="#bride_groom" className="nf-nav__btn">{t('nav.mempelai')}</a>
                            <a href="#event" className="nf-nav__btn">{t('nav.acara')}</a>
                            <a href="#love_story" className="nf-nav__btn">{t('invitation.love_story')}</a>
                            <a href="#gallery" className="nf-nav__btn">{t('invitation.gallery')}</a>
                            <a href="#rsvp" className="nf-nav__btn">{t('nav.rsvp')}</a>
                            <a href="#wishes" className="nf-nav__btn">{t('invitation.wishes_title')}</a>
                            <a href="#bank" className="nf-nav__btn">{t('nav.hadiah')}</a>
                        </>
                    )}
                </div>

                {/* Video jika ada */}
                {invitation?.video_url && (
                    <div className="nf-opening__video">
                        <iframe
                            src={invitation.video_url.includes('watch?v=')
                                ? invitation.video_url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1'
                                : invitation.video_url}
                            title="Wedding Video" frameBorder="0"
                            allowFullScreen allow="autoplay; encrypted-media"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN  (inside bride_groom or standalone)
   ═══════════════════════════════════════ */
function CountdownTimer({ targetDate }) {
    const { t } = useTranslation();
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0 });
    useEffect(() => {
        if (!targetDate) return;
        const ds = String(targetDate).substring(0, 10);
        const target = new Date(`${ds}T08:00:00`);
        if (isNaN(target.getTime())) return;
        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCd({ d: 0, h: 0, m: 0 }); return; }
            setCd({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000)
            });
        };
        tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
    }, [targetDate]);

    return (
        <div className="nf-countdown">
            {[['d', t('invitation.days')], ['h', t('invitation.hours')], ['m', t('invitation.minutes')]].map(([k, lbl], idx) => (
                <React.Fragment key={k}>
                    {idx > 0 && <span className="nf-countdown__colon">:</span>}
                    <div className="nf-countdown__item">
                        <div className="nf-countdown__value">
                            <span className="nf-countdown__digit">{pad2(cd[k])[0]}</span>
                            <span className="nf-countdown__digit">{pad2(cd[k])[1]}</span>
                        </div>
                        <div className="nf-countdown__label">{lbl}</div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   BRIDE & GROOM SECTION
   ═══════════════════════════════════════ */
function BrideGroomSection({ invitation, brideGrooms, events }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];

    function Card({ person, side }) {
        if (!person) return null;
        const photo = getStorageUrl(person.photo, dummyPortrait);
        return (
            <Reveal className={`nf-couple__card nf-couple__card--${side}`} delay={side === 'left' ? 0 : 200}>
                <div className="nf-couple__photo-wrap">
                    <img src={photo} alt={person.full_name} className="nf-couple__photo" />
                </div>
                <p className="nf-couple__full-name">{person.full_name}</p>
                <p className="nf-couple__child-info">
                    {person.child_order 
                        ? `${person.child_order} ${t('invitation.of')}` 
                        : (person.gender === 'wanita' ? t('invitation.daughter_of') : t('invitation.son_of'))}
                </p>
                <p className="nf-couple__parents">
                    {[person.father_name, person.mother_name].filter(Boolean).join(' & ')
                        || person.parents_name || ''}
                </p>
                {person.instagram && (
                    <a href={`https://www.instagram.com/${person.instagram.replace('@','')}`}
                        target="_blank" rel="noreferrer" className="nf-couple__ig">
                        <i className="fab fa-instagram" /> {person.instagram}
                    </a>
                )}
            </Reveal>
        );
    }

    return (
        <section id="bride_groom" className="nf-couple">
            <Reveal>
                <div className="nf-section-header">
                    <p className="nf-section-header__quote">
                        &ldquo;Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu dapat ketenangan hati dan dijadikannya kasih sayang di antara kamu.&rdquo;
                    </p>
                    <p className="nf-section-header__source">
                        <span className="nf-badge">Qur&apos;an Surah</span> Ar-Rum: 21
                    </p>
                </div>
            </Reveal>

            <Reveal delay={100}>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Groom</span> &amp; Bride</> : <><span className="nf-badge">Kedua</span> Mempelai</>}
                </h3>
            </Reveal>

            <div className="nf-couple__row">
                <Card person={groom} side="left" />
                <div className="nf-couple__amp">&amp;</div>
                <Card person={bride} side="right" />
            </div>

            {/* Save The Date */}
            {primaryEvent?.event_date && (
                <Reveal delay={300}>
                    <div className="nf-save-the-date">
                        <div className="nf-save-the-date__badge-wrap">
                            <span className="nf-badge">{t('invitation.save_the_date') === 'Save The Date' ? 'SPECIAL EVENT' : 'ACARA SPESIAL'}</span>
                        </div>
                        <h3 className="nf-save-the-date__title">{t('invitation.save_the_date')}</h3>
                        {(() => {
                            const d = new Date(primaryEvent.event_date);
                            return (
                                <div className="nf-save-the-date__date">
                                    <span className="nf-std-day-label">{d.toLocaleDateString(t('invitation.save_the_date') === 'Save The Date' ? 'en-US' : 'id-ID', { weekday: 'long' })}</span>
                                    <span className="nf-std-main">
                                        {d.getDate()} {d.toLocaleDateString(t('invitation.save_the_date') === 'Save The Date' ? 'en-US' : 'id-ID', { month: 'long' }).toUpperCase()} {d.getFullYear()}
                                    </span>
                                </div>
                            );
                        })()}
                        <CountdownTimer targetDate={primaryEvent.event_date} />
                    </div>
                </Reveal>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   EVENT SECTION
   ═══════════════════════════════════════ */
function EventSection({ events, invitation, galleries }) {
    const { t } = useTranslation();
    const safeEvents = safeArr(events);
    if (safeEvents.length === 0) return null;

    const weddingImg = getStorageUrl(invitation?.cover_image, dummyCover);
    const safeGalleries = safeArr(galleries);

    const getCalUrl = (evt) => {
        if (!evt?.event_date) return '#';
        const ds = String(evt.event_date).substring(0, 10).replace(/-/g, '');
        const st = (evt.start_time || '08:00').substring(0, 5).replace(':', '') + '00';
        const bgs = safeArr(invitation?.brideGrooms || []);
        const names = bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((evt.event_name || '') + ' - ' + names)}&dates=${ds}T${st}/${ds}T${st}&location=${encodeURIComponent([evt.venue_name, evt.venue_address].filter(Boolean).join(', '))}&sf=true&output=xml`;
    };

    return (
        <section id="event" className="nf-events">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Wedding</span> Day</> : <><span className="nf-badge">Hari</span> Pernikahan</>}
                </h3>
                <p className="nf-section-subtitle">Yang akan dilaksanakan pada:</p>
            </Reveal>

            {safeEvents.map((ev, idx) => {
                const evDate = ev.event_date || ev.date;
                const d = evDate ? new Date(evDate) : null;
                
                const isAkad = ev.event_name?.toLowerCase().includes('akad');
                let eventImg = null;

                if (isAkad) {
                    if (safeGalleries.length > 0) {
                        const randomIdx = (ev.id ? ev.id : idx) % safeGalleries.length;
                        const randomGallery = safeGalleries[randomIdx];
                        eventImg = getStorageUrl(randomGallery.image_url);
                    } else {
                        eventImg = null;
                    }
                } else {
                    eventImg = getStorageUrl(ev.image, weddingImg);
                }

                return (
                    <Reveal key={idx} delay={idx * 100} className="nf-event-item">
                        <div className={`nf-event-item__inner${(idx % 2 !== 0 && eventImg) ? ' nf-event-item__inner--rev' : ''}`}>
                            {eventImg && (
                                <div className="nf-event-item__photo">
                                    <img src={eventImg} alt={ev.event_name} />
                                </div>
                            )}
                            <div className="nf-event-item__detail" style={!eventImg ? { padding: '32px 28px', textAlign: 'center' } : undefined}>

                                <p className="nf-event-item__type">
                                    <span className="nf-badge">Acara:</span>{ev.event_name || 'Pernikahan'}
                                </p>
                                {d && (
                                    <div className="nf-event-item__date-row">
                                        <span>{d.toLocaleDateString('id-ID', { weekday: 'long' })},</span>
                                        <span>{d.getDate()}</span>
                                        <span>{d.toLocaleDateString('id-ID', { month: 'long' })}</span>
                                        <span>{d.getFullYear()}</span>
                                    </div>
                                )}
                                {(ev.start_time) && (
                                    <p className="nf-event-item__time">
                                        {formatTime(ev.start_time)}
                                        {ev.end_time && ev.end_time !== 'Selesai' ? ` – ${formatTime(ev.end_time)}` : ''} WIB
                                    </p>
                                )}
                                {ev.venue_name && <p className="nf-event-item__venue">{ev.venue_name}</p>}
                                {ev.venue_address && <p className="nf-event-item__address">{ev.venue_address}</p>}
                                <div className="nf-event-item__actions">
                                    {(ev.gmaps_link || ev.map_url) && (
                                        <a href={ev.gmaps_link || ev.map_url} target="_blank" rel="noreferrer" className="nf-btn-map">
                                            <i className="fas fa-map-marker-alt" /> Lihat Peta
                                        </a>
                                    )}
                                    <a href={getCalUrl(ev)} target="_blank" rel="noreferrer" className="nf-btn-cal">
                                        <i className="far fa-calendar-check" /> Simpan di Kalender
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                );
            })}
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN SECTION  (standalone)
   ═══════════════════════════════════════ */
function CountdownSection({ events }) {
    const { t } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    if (!primaryEvent?.event_date) return null;
    return (
        <section id="countdown" className="nf-countdown-section">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Counting</span> Down</> : <><span className="nf-badge">Menuju</span> Hari Bahagia</>}
                </h3>
            </Reveal>
            <Reveal delay={200}>
                <CountdownTimer targetDate={primaryEvent.event_date} />
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const stories = safeArr(loveStories);
    if (stories.length === 0) return null;

    return (
        <section id="love_story" className="nf-lovestory">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Our Love</span> Story</> : <><span className="nf-badge">Kisah</span> Cinta Kami</>}
                </h3>
            </Reveal>

            {stories.map((s, idx) => {
                const isEven = idx % 2 === 0;
                return (
                    <Reveal key={idx} delay={idx * 80} className={`nf-story-item nf-story-item--${isEven ? 'left' : 'right'}`}>
                        <div className="nf-story-item__inner">
                            <div className="nf-story-item__text">
                                <p className="nf-story-item__part">
                                    <span className="nf-badge">Part {idx + 1}</span>{s.title}
                                </p>
                                {(s.story_date || s.date) && (
                                    <p className="nf-story-item__date">{s.story_date || s.date}</p>
                                )}
                                <p className="nf-story-item__desc">{s.description || s.story}</p>
                            </div>
                        </div>
                    </Reveal>
                );
            })}
        </section>
    );
}

/* ═══════════════════════════════════════
   GALLERY SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries }) {
    const { t } = useTranslation();
    const safeGalleries = safeArr(galleries);
    if (safeGalleries.length === 0) return null;

    return (
        <section id="gallery" className="nf-gallery">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Our</span> Gallery</> : <><span className="nf-badge">Galeri</span> Kami</>}
                </h3>
            </Reveal>
            <div className="nf-gallery__grid">
                {safeGalleries.map((g, idx) => {
                    const src = getStorageUrl(g.image_url, dummyPortrait);
                    return (
                        <Reveal key={idx} delay={(idx % 6) * 60} className="nf-gallery__item">
                            <img src={src} alt={`Foto ${idx + 1}`} loading="lazy" />
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   BANK / AMPLOP DIGITAL
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts }) {
    const { t } = useTranslation();
    const accounts = safeArr(bankAccounts);
    if (accounts.length === 0) return null;

    const [copiedIdx, setCopiedIdx] = useState(null);
    const copy = (text, idx) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2000);
            }).catch(() => {
                fallbackCopy(text, idx);
            });
        } else {
            fallbackCopy(text, idx);
        }
    };

    const fallbackCopy = (text, idx) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        // Extra range selection compatibility for iOS Safari / Instagram webview
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);

        try {
            const successful = document.execCommand('copy');
            selection.removeAllRanges();
            document.body.removeChild(textArea);
            if (successful) {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2000);
            }
        } catch (err) {
            console.error('Fallback copy failed', err);
            selection.removeAllRanges();
            document.body.removeChild(textArea);
        }
    };

    return (
        <section id="bank" className="nf-gift">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Digital</span> Envelope</> : <><span className="nf-badge">Amplop</span> Digital</>}
                </h3>
                <p className="nf-gift__desc">
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Bagi yang ingin memberikan hadiah, dapat melalui rekening berikut:
                </p>
            </Reveal>
            <div className="nf-gift__accounts">
                {accounts.map((acc, idx) => (
                    <Reveal key={idx} delay={idx * 120} className="nf-gift__account">
                        <p className="nf-gift__bank">{acc.bank_name}</p>
                        <p className="nf-gift__number">{acc.account_number}</p>
                        <p className="nf-gift__name">a.n. {acc.account_holder || acc.account_name}</p>
                        <button className="nf-gift__copy" onClick={() => copy(acc.account_number, idx)}>
                            {copiedIdx === idx ? '✓ Disalin!' : 'Salin Nomor'}
                        </button>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP SECTION
   ═══════════════════════════════════════ */
function RsvpSection({ invitation, guest }) {
    const { t } = useTranslation();
    const rsvpForm = useForm({ attendance: 'hadir', number_of_guests: 1, name: guest?.name || '' });
    const handleRsvp = (e) => {
        e.preventDefault();
        rsvpForm.post(route('invitation.rsvp', invitation.slug), {
            preserveScroll: true,
            onSuccess: () => rsvpForm.reset('number_of_guests'),
        });
    };

    const opts = [
        { value: 'hadir', label: 'Hadir' },
        { value: 'tidak_hadir', label: 'Tidak Hadir' },
        { value: 'masih_ragu', label: 'Masih Ragu' },
    ];

    return (
        <section id="rsvp" className="nf-rsvp">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">RSVP</span> Confirmation</> : <><span className="nf-badge">Konfirmasi</span> Kehadiran</>}
                </h3>
                <p className="nf-rsvp__desc">Mohon konfirmasi kehadiran Anda untuk memudahkan persiapan kami</p>
            </Reveal>
            <Reveal delay={150}>
                <form onSubmit={handleRsvp} className="nf-rsvp__form">
                    <input
                        className="nf-input" type="text"
                        placeholder={t('invitation.wishes_name')}
                        value={rsvpForm.data.name}
                        onChange={e => rsvpForm.setData('name', e.target.value)}
                    />
                    <div className="nf-rsvp__options">
                        {opts.map(o => (
                            <button key={o.value} type="button"
                                className={`nf-rsvp__option${rsvpForm.data.attendance === o.value ? ' active' : ''}`}
                                onClick={() => rsvpForm.setData('attendance', o.value)}>
                                {o.label}
                            </button>
                        ))}
                    </div>
                    {rsvpForm.data.attendance === 'hadir' && (
                        <div className="nf-rsvp__guests">
                            <label className="nf-label">Jumlah tamu yang hadir:</label>
                            <input className="nf-input" type="number" min={1} max={10}
                                value={rsvpForm.data.number_of_guests}
                                onChange={e => rsvpForm.setData('number_of_guests', parseInt(e.target.value) || 1)} />
                        </div>
                    )}
                    <button type="submit" disabled={rsvpForm.processing} className="nf-submit-btn">
                        {rsvpForm.processing ? t('common.saving') : t('invitation.send_rsvp')}
                    </button>
                    {rsvpForm.wasSuccessful && (
                        <p className="nf-success-msg">✓ {t('invitation.rsvp_success') || 'Konfirmasi berhasil dikirim!'}</p>
                    )}
                </form>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   WISHES SECTION
   ═══════════════════════════════════════ */
function WishesSection({ invitation, wishes, guest }) {
    const { t } = useTranslation();
    const safeWishes = safeArr(wishes);
    const wishForm = useForm({ sender_name: guest?.name || '', message: '' });
    const handleWish = (e) => {
        e.preventDefault();
        wishForm.post(route('invitation.wish', invitation.slug), {
            preserveScroll: true,
            onSuccess: () => wishForm.reset('message'),
        });
    };

    const attendanceLabel = (a) => {
        if (a === 'hadir') return '✓ Hadir';
        if (a === 'tidak_hadir' || a === 'tidak hadir') return '✗ Tidak Hadir';
        return '? Masih Ragu';
    };
    const attendanceClass = (a) => {
        if (a === 'hadir') return 'nf-attend--hadir';
        if (a === 'tidak_hadir' || a === 'tidak hadir') return 'nf-attend--tidak';
        return 'nf-attend--ragu';
    };

    return (
        <section id="wishes" className="nf-wishes">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Wishes</span> &amp; Prayers</> : <><span className="nf-badge">Ucapan</span> &amp; Do&apos;a</>}
                </h3>
            </Reveal>
            <Reveal delay={100}>
                <form onSubmit={handleWish} className="nf-wishes__form">
                    <input className="nf-input" type="text"
                        placeholder={t('invitation.wishes_name')}
                        value={wishForm.data.sender_name}
                        onChange={e => wishForm.setData('sender_name', e.target.value)}
                        required />
                    <textarea className="nf-input nf-wishes__textarea"
                        placeholder="Tulis ucapan & doa untuk mempelai..."
                        value={wishForm.data.message}
                        onChange={e => wishForm.setData('message', e.target.value)}
                        rows={3} required />
                    <button type="submit" disabled={wishForm.processing} className="nf-submit-btn">
                        {wishForm.processing ? t('common.saving') : t('invitation.send_wish')}
                    </button>
                    {wishForm.wasSuccessful && (
                        <p className="nf-success-msg">✓ {t('invitation.wishes_success') || 'Ucapan berhasil dikirim!'}</p>
                    )}
                </form>
            </Reveal>

            {safeWishes.length > 0 && (
                <div className="nf-wishes__list">
                    {safeWishes.map((w, idx) => (
                        <Reveal key={idx} delay={Math.min(idx * 50, 400)} className="nf-wishes__item">
                            <div className="nf-wishes__avatar"><i className="fas fa-user" /></div>
                            <div className="nf-wishes__body">
                                <p className="nf-wishes__name">{w.sender_name || w.name}</p>
                                <p className="nf-wishes__message">{w.message}</p>
                                {w.attendance && (
                                    <span className={`nf-attend ${attendanceClass(w.attendance)}`}>
                                        {attendanceLabel(w.attendance)}
                                    </span>
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms }) {
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];
    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'The Wedding');

    return (
        <section id="closing" className="nf-closing">
            <div className="nf-closing__content">
                <Reveal>
                    <img src={ASSETS.logo} alt="The Wedding" className="nf-closing__logo" />
                </Reveal>
                {invitation?.closing_title && (
                    <Reveal delay={100}>
                        <h3 className="nf-closing__title">{invitation.closing_title}</h3>
                    </Reveal>
                )}
                {invitation?.closing_text && (
                    <Reveal delay={200}>
                        <p className="nf-closing__text">{invitation.closing_text}</p>
                    </Reveal>
                )}
                <Reveal delay={300}>
                    <p className="nf-closing__couple">{coupleName}</p>
                    <p className="nf-closing__tagline">Powered by {invitation?.user?.reseller?.reseller_settings?.brand_name || 'TrueLove Invitation'}</p>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   MUSIC BUTTON
   ═══════════════════════════════════════ */
function MusicButton({ isPlaying, onToggle }) {
    return (
        <button className="nf-music-btn" onClick={onToggle} aria-label="Toggle musik">
            {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.73v2.06c2.89.86 5 3.54 5 6.67zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
            )}
        </button>
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
function NetflixThemeContent({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const { t } = useTranslation(invitation?.language || 'id');
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const audioRef = useRef(null);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(invitation?.enable_auto_scroll !== false);

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide';
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);

    // Robust boolean parser
    const parseBool = (val, defaultVal = true) => {
        if (val === undefined || val === null) return defaultVal;
        if (val === false || val === 0 || val === '0' || val === 'false') return false;
        return true;
    };

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const enableQr = parseBool(invitation?.enable_qr) && parseBool(invitation?.show_qr_code);
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };
    
    let menuPosition = invitation?.menu_position || 'none';
    if (isSlideMode && (menuPosition === 'none' || !menuPosition)) {
        menuPosition = 'bottom';
    }
    const showMenu = menuPosition !== 'none';
    const musicAutoplay = parseBool(invitation?.music_autoplay);

    // Track active section on scroll or slide
    const [activeSection, setActiveSection] = useState('opening');

    const safeSections = safeArr(sections);

    // Nav labels for menu
    const navLabels = {
        opening: t('nav.opening'), bride_groom: t('nav.mempelai'), event: t('nav.acara'),
        countdown: t('invitation.save_the_date') === 'Save The Date' ? 'Start' : 'Mulai', love_story: t('nav.kisah'), gallery: t('nav.galeri'), rsvp: t('nav.rsvp'),
        wishes: t('invitation.wishes_title'), bank: t('nav.hadiah'), closing: t('nav.penutup'),
    };

    const navIcons = {
        opening: 'fas fa-home',
        bride_groom: 'fas fa-user-friends',
        event: 'fas fa-calendar-alt',
        countdown: 'fas fa-clock',
        love_story: 'fas fa-heart',
        gallery: 'fas fa-images',
        bank: 'fas fa-gift',
        rsvp: 'fas fa-envelope',
        wishes: 'fas fa-comments',
        closing: 'fas fa-star',
    };

    const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing'];

    // Resolve active sections (prioritize DB sections, fallback to dynamic sections list if empty)
    const resolvedSections = [];
    if (safeSections.length > 0) {
        const dbSorted = safeSections
            .filter(s => s.is_visible && validKeys.includes(s.section_key))
            .sort((a, b) => a.sort_order - b.sort_order);

        dbSorted.forEach(s => {
            if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return;
            if (s.section_key === 'gallery' && !(galleries?.length > 0)) return;
            if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
            if (s.section_key === 'rsvp' && !enableRsvp) return;
            if (s.section_key === 'wishes' && !enableWishes) return;
            const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
            if (s.section_key === 'countdown' && !primaryEvent?.event_date) return;

            resolvedSections.push(s);
        });
    } else {
        const fallbacks = [
            { section_key: 'opening' },
            { section_key: 'bride_groom' },
            { section_key: 'event' },
        ];

        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        if (primaryEvent?.event_date) {
            fallbacks.push({ section_key: 'countdown' });
        }
        if (loveStories?.length > 0) {
            fallbacks.push({ section_key: 'love_story' });
        }
        if (galleries?.length > 0) {
            fallbacks.push({ section_key: 'gallery' });
        }
        if (enableRsvp) {
            fallbacks.push({ section_key: 'rsvp' });
        }
        if (enableWishes) {
            fallbacks.push({ section_key: 'wishes' });
        }
        if (bankAccounts?.length > 0) {
            fallbacks.push({ section_key: 'bank' });
        }
        fallbacks.push({ section_key: 'closing' });

        resolvedSections.push(...fallbacks);
    }

    // Build navigation sections dynamically: combine RSVP and Wishes under a single button if both are present
    const navSections = [];
    resolvedSections.forEach(s => {
        if (s.section_key === 'cover') return;
        
        if (s.section_key === 'rsvp') {
            const hasWishes = resolvedSections.some(x => x.section_key === 'wishes');
            navSections.push({
                ...s,
                section_name: hasWishes ? 'RSVP & Ucapan' : 'RSVP',
            });
        } else if (s.section_key === 'wishes') {
            const hasRsvp = resolvedSections.some(x => x.section_key === 'rsvp');
            if (!hasRsvp) {
                navSections.push(s);
            }
        } else {
            navSections.push(s);
        }
    });

    const scrollToSection = useCallback((key) => {
        setAutoScrollEnabled(false);
        if (!isSlideMode) {
            const el = document.getElementById(key);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // For slide/tab modes
            setActiveSection(key);
            const idx = resolvedSections.findIndex(s => s.section_key === key);
            if (idx >= 0) setActiveSlideIdx(idx);
        }
    }, [isSlideMode, resolvedSections, setAutoScrollEnabled]);

    /* ── Component Mapping ── */
    const componentMap = {
        'opening':    <OpeningSection    
                        key="opening"    
                        invitation={invitation} 
                        brideGrooms={brideGrooms}
                        scrollToSection={scrollToSection}
                        loveStories={loveStories}
                        galleries={galleries}
                        enableRsvp={enableRsvp}
                        enableWishes={enableWishes}
                        bankAccounts={bankAccounts}
                      />,
        'bride_groom':<BrideGroomSection key="bride_groom" invitation={invitation} brideGrooms={brideGrooms} events={events} />,
        'event':      <EventSection      key="event"      events={events} invitation={invitation} galleries={galleries} />,
        'countdown':  <CountdownSection  key="countdown"  events={events} />,
        'love_story': loveStories?.length > 0
            ? <LoveStorySection key="love_story" loveStories={loveStories} invitation={invitation} />
            : null,
        'gallery':    galleries?.length > 0
            ? <GallerySection   key="gallery"    galleries={galleries} />
            : null,
        'bank':       bankAccounts?.length > 0
            ? <BankSection      key="bank"       bankAccounts={bankAccounts} />
            : null,
        'rsvp':       enableRsvp
            ? <RsvpSection      key="rsvp"       invitation={invitation} guest={guest} />
            : null,
        'wishes':     enableWishes
            ? <WishesSection    key="wishes"     invitation={invitation} wishes={wishes} guest={guest} />
            : null,
        'closing':    <ClosingSection    key="closing"    invitation={invitation} brideGrooms={brideGrooms} />,
    };

    // Set document title
    useEffect(() => {
        const bgs = safeArr(brideGrooms);
        const names = bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
        document.title = (names ? `${names} - ` : '') + 'Undangan Pernikahan';
    }, [brideGrooms]);

    const handleOpen = useCallback(() => {
        setIsOpened(true);
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, []);

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current; if (!audio) return;
        if (isPlaying) { audio.pause(); setIsPlaying(false); }
        else { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
    }, [isPlaying]);

    // Track active section on scroll
    useEffect(() => {
        if (!isOpened || isSlideMode) return;
        const handleScroll = () => {
            const secs = document.querySelectorAll('[data-section]');
            let cur = 'opening';
            secs.forEach(s => { if (s.getBoundingClientRect().top <= 120) cur = s.dataset.section; });
            setActiveSection(cur);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode]);

    // Update activeSection when activeSlideIdx changes in slide mode
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            setActiveSection(resolvedSections[activeSlideIdx].section_key);
        }
    }, [activeSlideIdx, isSlideMode, resolvedSections]);

    // Auto scroll logic
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let timer = null;

        if (isSlideMode) {
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) {
                        return 0; // loop back to first slide
                    }
                    return prev + 1;
                });
            }, 4000);
        } else {
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
                if (isBottom) {
                    setAutoScrollEnabled(false);
                }
            }, 25);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections.length]);

    // ── Mouse & Touch Gesture Handlers for Swipe ──
    const touchStart = useRef({ x: 0, y: 0, time: 0 });
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);

    const nextSlide = useCallback(() => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    }, [resolvedSections.length]);

    const prevSlide = useCallback(() => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    }, []);

    const handlePointerDown = useCallback((clientX, clientY, target) => {
        if (!isSlideMode) return;
        isDragging.current = true;
        
        let atTop = false;
        let atBottom = false;
        
        if (target && typeof target.closest === 'function') {
            const scrollable = target.closest('.nf-slide-container');
            if (scrollable) {
                atTop = scrollable.scrollTop <= 5;
                atBottom = scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop <= 5;
            } else {
                atTop = true;
                atBottom = true;
            }
        } else {
            atTop = true;
            atBottom = true;
        }
        
        touchStart.current = { x: clientX, y: clientY, time: Date.now(), atTop, atBottom };
    }, [isSlideMode]);

    const handlePointerUp = useCallback((clientX, clientY, target) => {
        if (!isSlideMode || !isDragging.current) return;
        isDragging.current = false;
        
        const diffX = clientX - touchStart.current.x;
        const diffY = clientY - touchStart.current.y;
        const timeDiff = Date.now() - touchStart.current.time;
        const threshold = 50;

        // If it's a very fast swipe, lower the threshold
        const isFastSwipe = timeDiff < 300 && (Math.abs(diffX) > 30 || Math.abs(diffY) > 30);

        if (layoutMode === 'slide-h' || layoutMode === 'slide') {
            if ((Math.abs(diffX) > Math.abs(diffY)) && (Math.abs(diffX) > threshold || isFastSwipe)) {
                if (diffX < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        } else if (layoutMode === 'slide-v') {
            if ((Math.abs(diffY) > Math.abs(diffX)) && (Math.abs(diffY) > threshold || isFastSwipe)) {
                // Check if target is a scrollable element that hasn't reached its boundary
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.nf-slide-container') : null;
                if (scrollable) {
                    // Use the state from BEFORE the swipe started
                    const isAtTop = touchStart.current.atTop;
                    const isAtBottom = touchStart.current.atBottom;
                    
                    if (diffY < 0 && isAtBottom) {
                        nextSlide();
                    } else if (diffY > 0 && isAtTop) {
                        prevSlide();
                    }
                } else {
                    if (diffY < 0) nextSlide();
                    else prevSlide();
                }
            }
        }
    }, [isSlideMode, layoutMode, nextSlide, prevSlide]);

    // Touch Events
    const handleTouchStart = useCallback((e) => {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }, [handlePointerDown]);

    const handleTouchEnd = useCallback((e) => {
        handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.target);
    }, [handlePointerUp]);

    // Mouse Events for PC
    const handleMouseDown = useCallback((e) => {
        handlePointerDown(e.clientX, e.clientY, e.target);
    }, [handlePointerDown]);

    const handleMouseUp = useCallback((e) => {
        handlePointerUp(e.clientX, e.clientY, e.target);
    }, [handlePointerUp]);

    const handleMouseLeave = useCallback(() => {
        isDragging.current = false;
    }, []);

    // Wheel Event for PC (Debounced)
    const handleWheel = useCallback((e) => {
        if (!isSlideMode) return;
        
        // Ensure we aren't rapidly switching slides
        if (scrollTimeout.current) return;

        const target = e.target.closest('.nf-slide-container');
        
        // Let the internal scroll handle it first if there is content to scroll
        if (target && target.scrollHeight > target.clientHeight) {
            // Add a small buffer of 2px to account for fractional scrolling values
            const isAtTop = target.scrollTop <= 2;
            const isAtBottom = target.scrollHeight - target.clientHeight - target.scrollTop <= 2;
            
            if (e.deltaY > 0 && !isAtBottom) return; // Still scrolling down internally
            if (e.deltaY < 0 && !isAtTop) return; // Still scrolling up internally
        }

        scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
        }, 800); // 800ms cooldown between slide switches via wheel

        if (e.deltaY > 0) {
            nextSlide();
        } else if (e.deltaY < 0) {
            prevSlide();
        }
    }, [isSlideMode, nextSlide, prevSlide]);

    /* ── Audio ── */
    const musicUrl = invitation?.music_url || null;


    return (
        <div className="nf-container" id="main-scroll-container">
            {/* Partikel */}
            {invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect
                    type={invitation.particle_type}
                    count={invitation.particle_count || 30}
                    speed={invitation.particle_speed || 'normal'}
                />
            )}

            {/* Audio — gunakan invitation.music_url LANGSUNG (bukan /storage/) */}
            {musicUrl && (
                <audio ref={audioRef} loop preload="auto" playsInline src={musicUrl} />
            )}

            {/* QR Code Modal */}
            {enableQr && showQr && activeGuest && (
                <div className="nf-qr-overlay" onClick={() => setShowQr(false)}>
                    <div className="nf-qr-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="nf-qr-title">QR Code Check-in</h3>
                        <p className="nf-qr-guest">{activeGuest.name}</p>
                        <div className="nf-qr-img-wrap">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=E50914&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                alt="QR Code" className="nf-qr-img"
                            />
                        </div>
                        <p className="nf-qr-hint">Scan untuk konfirmasi kehadiran</p>
                        <button className="nf-qr-close" onClick={() => setShowQr(false)}>Tutup</button>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            {isOpened && showMenu && navSections.length > 0 && (
                <nav className={`nf-nav-menu nf-nav-menu--${menuPosition}`}>
                    {menuPosition === 'top' || menuPosition === 'bottom' ? (
                        <div className="nf-nav-menu__inner nf-nav-menu__inner--row">
                            {navSections.map(s => (
                                <button key={s.section_key}
                                    type="button"
                                    className={`nf-nav-menu__item${activeSection === s.section_key || (s.section_key === 'rsvp' && activeSection === 'wishes') ? ' active' : ''}`}
                                    onClick={() => scrollToSection(s.section_key)}
                                    title={s.section_name || navLabels[s.section_key] || s.section_key}>
                                    {navIcons[s.section_key] ? <i className={navIcons[s.section_key]} /> : (navLabels[s.section_key]?.charAt(0) || '•')}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="nf-nav-menu__inner nf-nav-menu__inner--col">
                            {navSections.map(s => (
                                <button key={s.section_key}
                                    type="button"
                                    className={`nf-nav-menu__item${activeSection === s.section_key || (s.section_key === 'rsvp' && activeSection === 'wishes') ? ' active' : ''}`}
                                    onClick={() => scrollToSection(s.section_key)}
                                    title={s.section_name || navLabels[s.section_key] || s.section_key}>
                                    {navIcons[s.section_key] ? <i className={navIcons[s.section_key]} /> : (navLabels[s.section_key]?.charAt(0) || '•')}
                                </button>
                            ))}
                        </div>
                    )}
                </nav>
            )}

            {/* Cover (Who's Watching) */}
            <CoverSection
                invitation={invitation}
                brideGrooms={brideGrooms}
                guest={guest}
                isOpened={isOpened}
                onOpen={handleOpen}
            />

            {/* Tombol Floating: Musik + QR */}
            {isOpened && (
                <div className={`nf-floating-btns${menuPosition === 'bottom' && showMenu ? ' nf-floating-btns--raised' : ''}`}>
                    {enableQr && activeGuest && (
                        <button type="button" className="nf-music-btn" onClick={() => setShowQr(true)} aria-label="QR Code">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 2h2v3h-2v-3zm3 3h2v2h-2v-2zm-3-1h1v1h-1v-1zm3-3h2v2h-2v-2z" />
                            </svg>
                        </button>
                    )}
                    {invitation?.enable_auto_scroll !== false && (
                    <button
                        type="button"
                        className="nf-music-btn"
                        onClick={() => setAutoScrollEnabled(prev => !prev)}
                        style={autoScrollEnabled ? { backgroundColor: '#E50914', color: '#fff', boxShadow: '0 0 10px #E50914' } : {}}
                        title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                    >
                        <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-scroll"} />
                    </button>
                    )}
                    {musicUrl && (
                        <MusicButton isPlaying={isPlaying} onToggle={toggleMusic} />
                    )}
                </div>
            )}

            {/* Konten Utama */}
            <div 
                className={`nf-main${isOpened ? ' nf-main--visible' : ''} ${isSlideMode ? 'nf-main--slide' : ''} ${layoutMode === 'slide-h' ? 'nf-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'nf-main--slide-v' : ''}`}
                onTouchStart={isSlideMode ? handleTouchStart : undefined}
                onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                onTouchCancel={isSlideMode ? handleTouchEnd : undefined}
                onMouseDown={isSlideMode ? handleMouseDown : undefined}
                onMouseUp={isSlideMode ? handleMouseUp : undefined}
                onMouseLeave={isSlideMode ? handleMouseLeave : undefined}
                onWheel={isSlideMode ? handleWheel : undefined}
            >
                {resolvedSections.map((s, idx) => {
                    if (isSlideMode) {
                        let slideClass = 'nf-slide-container';
                        if (idx === activeSlideIdx) {
                            slideClass += ' is-active';
                        } else if (idx > activeSlideIdx) {
                            slideClass += ' is-next';
                        } else {
                            slideClass += ' is-prev';
                        }

                        return (
                            <div 
                                key={s.section_key} 
                                className={slideClass}
                                id={s.section_key}
                                data-section={s.section_key}
                            >
                                {componentMap[s.section_key]}
                            </div>
                        );
                    }

                    return (
                        <div 
                            key={s.section_key} 
                            id={s.section_key}
                            data-section={s.section_key}
                        >
                            {componentMap[s.section_key]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   EXPORT DEFAULT
   ═══════════════════════════════════════ */
export default function NetflixTheme(props) {
    return (
        <ErrorBoundary>
            <NetflixThemeContent {...props} />
        </ErrorBoundary>
    );
}
