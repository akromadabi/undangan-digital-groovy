import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import './style.css';

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}
const parseBool = (val, def = true) => {
    if (val === undefined || val === null) return def;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};
function getStorageUrl(url) {
    if (!url) return '';
    if (typeof url === 'string' && url.includes(',')) url = url.split(',')[0];
    let clean = String(url).replace(/\\/g, '/');
    if (clean.startsWith('http') || clean.startsWith('data:') || clean.startsWith('/themes/') || clean.startsWith('/images/')) return clean;
    if (clean.startsWith('storage/')) return '/' + clean;
    if (clean.startsWith('/')) return clean;
    return `/storage/${clean}`;
}
function fmtDate(d) {
    if (!d) return '';
    try {
        const obj = parseSafeDate(d);
        return isNaN(obj.getTime()) ? d : obj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return d; }
}
function fmtTime(t) { return !t || t === 'Selesai' ? (t || '') : String(t).substring(0, 5); }
function fmtStoryDate(d) {
    if (!d) return '';
    try { const o = parseSafeDate(d); return isNaN(o.getTime()) ? d : o.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return d; }
}
function translateChildOrder(childOrder, gender) {
    if (!childOrder) return '';
    const raw = String(childOrder).trim().toLowerCase();
    const map = { '1': 'Pertama', '2': 'Kedua', '3': 'Ketiga', '4': 'Keempat', '5': 'Kelima', '6': 'Keenam', '7': 'Ketujuh', '8': 'Kedelapan', '9': 'Kesembilan', '10': 'Kesepuluh', 'bungsu': 'Bungsu', 'tunggal': 'Tunggal' };
    let key = null;
    if (raw.includes('tunggal') || raw.includes('only')) key = 'tunggal';
    else if (raw.includes('bungsu') || raw.includes('youngest')) key = 'bungsu';
    else for (let i = 10; i >= 1; i--) { if (raw.includes(String(i))) { key = String(i); break; } }
    const ord = map[key] || childOrder;
    const isF = ['wanita', 'female'].includes(String(gender).toLowerCase());
    if (ord.toLowerCase() === 'tunggal') return `${isF ? 'Putri' : 'Putra'} Tunggal dari`;
    return `${isF ? 'Putri' : 'Putra'} ${ord} dari`;
}

/* ─── Countdown ─── */

// Safe date parsing helper for cross-browser local time countdowns
function parseSafeDate(dateStr, timeStr = '') {
    if (!dateStr) return null;
    let datePart = String(dateStr).substring(0, 10);
    let timePart = '08:00:00';
    
    if (timeStr) {
        timePart = String(timeStr).substring(0, 5) + ':00';
    } else if (String(dateStr).length > 10) {
        let parts = String(dateStr).trim().split(/\s+/);
        if (parts[1]) {
            timePart = parts[1].substring(0, 5);
            if (timePart.length === 5) {
                timePart += ':00';
            }
        }
    }
    
    let isoStr = `${datePart}T${timePart}`;
    let d = new Date(isoStr);
    if (!isNaN(d.getTime())) {
        return d;
    }
    
    const dateParts = datePart.split('-');
    const timeParts = timePart.split(':');
    return new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2], 10),
        parseInt(timeParts[0], 10) || 0,
        parseInt(timeParts[1], 10) || 0,
        parseInt(timeParts[2], 10) || 0
    );
}

function useCountdown(targetDate, startTime) {
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        if (!targetDate) return;
        const target = parseSafeDate(targetDate, startTime);
        if (isNaN(target.getTime())) return;
        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCd({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setCd({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
        };
        tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
    }, [targetDate, startTime]);
    return cd;
}

/* ─── Modal Component ─── */
function RjModal({ icon, title, onClose, children }) {
    useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
    return (
        <>
            <div className="rj-modal-backdrop" onClick={onClose} />
            <div className="rj-modal">
                <div className="rj-modal__handle" />
                <div className="rj-modal__header">
                    <div className="rj-modal__title">
                        <span className="rj-modal__title-icon">{icon}</span>
                        <span className="rj-modal__title-text">{title}</span>
                    </div>
                    <button className="rj-modal__close" onClick={onClose}>✕</button>
                </div>
                <div className="rj-modal__body">{children}</div>
            </div>
        </>
    );
}

/* ─── Divider ─── */
const RjDivider = () => (
    <div className="rj-section-divider">
        <div className="rj-section-divider__line" />
        <div className="rj-section-divider__gem" />
        <div className="rj-section-divider__line" />
    </div>
);

/* ════════════════════════════════════════════
   MODAL CONTENTS
   ════════════════════════════════════════════ */

function AboutUsContent({ invitation, brideGrooms }) {
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria','male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita','female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};
    const openingImgs = (invitation?.opening_image || '').split(',').map(u => getStorageUrl(u.trim())).filter(Boolean);
    return (
        <div>
            {openingImgs.length > 0 && (
                <div style={{ width:'100%', aspectRatio:'4/3', borderRadius:'16px', overflow:'hidden', marginBottom:'20px', border:'2px solid rgba(201,162,39,0.35)' }}>
                    <PremiumSlideshow images={openingImgs} positionX={invitation?.opening_position_x} positionY={invitation?.opening_position_y} zoom={invitation?.opening_zoom} />
                </div>
            )}
            <div className="rj-about__couple">
                {[groom, bride].filter(p => p?.full_name || p?.nickname).map((person, i) => (
                    <div key={i} className="rj-person-card">
                        {person.photo ? (
                            <img src={getStorageUrl(person.photo)} alt={person.full_name} className="rj-person-card__photo" />
                        ) : (
                            <div className="rj-person-card__photo-placeholder">{(person.nickname || person.full_name || 'R').charAt(0)}</div>
                        )}
                        <div className="rj-person-card__name">{person.nickname || person.full_name}</div>
                        {((person.father_name && person.father_name.trim() !== '') || (person.mother_name && person.mother_name.trim() !== '')) && (
                            <>
                                {person.child_order && <div className="rj-person-card__order">{translateChildOrder(person.child_order, person.gender)}</div>}
                                <div className="rj-person-card__parents">
                                    {person.father_name && person.mother_name ? (
                                        <>Bapak {person.father_name}<br />&amp; Ibu {person.mother_name}</>
                                    ) : person.father_name ? (
                                        <>Bapak {person.father_name}</>
                                    ) : (
                                        <>Ibu {person.mother_name}</>
                                    )}
                                </div>
                            </>
                        )}
                        {person.instagram && (
                            <a href={`https://instagram.com/${person.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="rj-person-card__ig">
                                <i className="fab fa-instagram" /> @{person.instagram.replace('@','')}
                            </a>
                        )}
                    </div>
                ))}
            </div>
            {invitation?.opening_title && <><RjDivider /><p style={{ fontFamily:'var(--rj-font-b)', fontSize:'1rem', fontWeight:600, color:'var(--rj-cream)', textAlign:'center', marginBottom:'8px' }}>{invitation.opening_title}</p></>}
            {invitation?.opening_text && <p style={{ fontFamily:'var(--rj-font-b)', fontSize:'13px', color:'var(--rj-cream)', opacity:0.75, lineHeight:1.7, textAlign:'center', whiteSpace:'pre-line' }}>{invitation.opening_text}</p>}
        </div>
    );
}

function LoveStoryContent({ loveStories }) {
    const stories = safeArr(loveStories).sort((a,b) => a.sort_order - b.sort_order);
    if (!stories.length) return <p style={{ textAlign:'center', opacity:0.5, fontFamily:'var(--rj-font-b)', padding:'20px 0' }}>Belum ada kisah cinta.</p>;
    return (
        <div className="rj-timeline">
            {stories.map((s, i) => (
                <div key={s.id||i} className="rj-timeline-item">
                    <div className="rj-timeline-date">{fmtStoryDate(s.story_date)}</div>
                    <div className="rj-timeline-title">{s.title}</div>
                    {s.description && <div className="rj-timeline-desc">{s.description}</div>}
                </div>
            ))}
        </div>
    );
}

function DateVenueContent({ events, invitation }) {
    const evList = safeArr(events).sort((a,b) => a.sort_order - b.sort_order);
    const primary = evList.find(e => e.is_primary) || evList[0];
    const cd = useCountdown(primary?.event_date, primary?.start_time);
    return (
        <div>
            {parseBool(invitation?.show_countdown) && primary?.event_date && (
                <>
                    <p style={{ fontFamily:'var(--rj-font-h)', fontSize:'9px', letterSpacing:'0.3em', color:'var(--rj-gold)', textAlign:'center', marginBottom:'10px', textTransform:'uppercase' }}>Hitung Mundur</p>
                    <div className="rj-countdown">
                        {[['d','Hari'],['h','Jam'],['m','Menit'],['s','Detik']].map(([k,l]) => (
                            <div key={k} className="rj-countdown__box"><span className="rj-countdown__num">{cd[k]}</span><span className="rj-countdown__lbl">{l}</span></div>
                        ))}
                    </div>
                    <RjDivider />
                </>
            )}
            {evList.map((evt, i) => (
                <div key={evt.id||i} className="rj-event-card">
                    <div className="rj-event-card__name">{evt.event_name || 'Acara'}</div>
                    <div className="rj-event-card__date">{fmtDate(evt.event_date)}</div>
                    <div className="rj-event-card__time-row">
                        <div><span className="rj-event-card__time-val">{fmtTime(evt.start_time)}</span><span className="rj-event-card__time-lbl">Mulai</span></div>
                        <div><span className="rj-event-card__time-val">{evt.end_time ? fmtTime(evt.end_time) : 'Selesai'}</span><span className="rj-event-card__time-lbl">Selesai</span></div>
                        <div><span className="rj-event-card__time-val">{evt.timezone||'WIB'}</span><span className="rj-event-card__time-lbl">Zona</span></div>
                    </div>
                    {evt.venue_name && <div className="rj-event-card__venue">{evt.venue_name}</div>}
                    {evt.venue_address && <div className="rj-event-card__address">{evt.venue_address}</div>}
                    {evt.gmaps_link && <a href={evt.gmaps_link} target="_blank" rel="noopener noreferrer" className="rj-maps-btn"><i className="fas fa-map-marker-alt" /> Buka Google Maps</a>}
                </div>
            ))}
        </div>
    );
}

function GalleryContent({ galleries }) {
    const items = safeArr(galleries).sort((a,b) => a.sort_order - b.sort_order);
    const [lb, setLb] = useState(null);
    if (!items.length) return <p style={{ textAlign:'center', opacity:0.5, fontFamily:'var(--rj-font-b)', padding:'20px 0' }}>Belum ada foto.</p>;
    return (
        <>
            <div className="rj-gallery-grid">
                {items.map((g, i) => (
                    <div key={g.id||i} className="rj-gallery-item" onClick={() => setLb(i)}>
                        <img src={getStorageUrl(g.image_url || g.image)} alt={g.caption||''} />
                    </div>
                ))}
            </div>
            {lb !== null && (
                <div style={{ position:'fixed',inset:0,zIndex:100,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center' }} onClick={() => setLb(null)}>
                    <img src={getStorageUrl(items[lb]?.image_url||items[lb]?.image)} alt="" style={{ maxWidth:'90vw',maxHeight:'85dvh',borderRadius:'12px',objectFit:'contain' }} />
                    <button onClick={() => setLb(null)} style={{ position:'absolute',top:16,right:16,background:'rgba(255,255,255,0.1)',border:'none',color:'white',width:36,height:36,borderRadius:'50%',cursor:'pointer',fontSize:16 }}>✕</button>
                </div>
            )}
        </>
    );
}

function DressCodeContent({ invitation }) {
    return (
        <div className="rj-dresscode-box">
            <span className="rj-dresscode-emoji">👗</span>
            <p className="rj-dresscode-text">{invitation?.dress_code_text || 'Tamu undangan diharapkan mengenakan pakaian bernuansa formal atau sesuai tema acara.'}</p>
        </div>
    );
}

function GiftContent({ bankAccounts }) {
    const [copiedIdx, setCopied] = useState(null);
    const accounts = safeArr(bankAccounts).sort((a,b) => a.sort_order - b.sort_order);
    const copy = (txt, idx) => { navigator.clipboard.writeText(txt).catch(() => {}); setCopied(idx); setTimeout(() => setCopied(null), 2000); };
    if (!accounts.length) return <p style={{ textAlign:'center', opacity:0.5, fontFamily:'var(--rj-font-b)', padding:'20px 0' }}>Belum ada rekening.</p>;
    return (
        <>
            <p style={{ fontFamily:'var(--rj-font-b)', fontSize:'13px', color:'var(--rj-cream)', opacity:0.7, textAlign:'center', marginBottom:'16px', lineHeight:1.6 }}>Doa restu Anda adalah hadiah terindah. Jika berkenan memberi tanda kasih:</p>
            {accounts.map((acc, i) => (
                <div key={acc.id||i} className="rj-bank-card">
                    <div className="rj-bank-card__name">{acc.bank_name}</div>
                    <div className="rj-bank-card__holder">{acc.account_name}</div>
                    <div className="rj-bank-card__number-row">
                        <span className="rj-bank-card__number">{acc.account_number}</span>
                        <button className={`rj-copy-btn ${copiedIdx===i?'copied':''}`} onClick={() => copy(acc.account_number, i)}>
                            <i className={`fas ${copiedIdx===i?'fa-check':'fa-copy'}`} /> {copiedIdx===i?'Tersalin!':'Salin'}
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}

function RsvpContent({ invitation, guest }) {
    const form = useForm({ sender_name: guest?.name||'', guest_id: guest?.id||null, attendance:'hadir', number_of_guests:1 });
    const [done, setDone] = useState(false);
    const submit = (e) => { e.preventDefault(); form.post(route('invitation.rsvp', invitation.slug), { onSuccess: () => setDone(true) }); };
    if (done) return (
        <div style={{ textAlign:'center', padding:'30px 0' }}>
            <div style={{ fontSize:'3rem', marginBottom:'12px' }}>✅</div>
            <p style={{ fontFamily:'var(--rj-font-h)', fontSize:'13px', color:'var(--rj-gold)', letterSpacing:'0.1em' }}>KONFIRMASI BERHASIL</p>
            <p style={{ fontFamily:'var(--rj-font-b)', fontSize:'14px', color:'var(--rj-cream)', opacity:0.7, marginTop:'8px', lineHeight:1.6 }}>Terima kasih, kami menantikan kehadiran Anda.</p>
        </div>
    );
    return (
        <form className="rj-rsvp-form" onSubmit={submit}>
            <p style={{ fontFamily:'var(--rj-font-b)', fontSize:'13px', color:'var(--rj-cream)', opacity:0.7, textAlign:'center', lineHeight:1.6, marginBottom:'4px' }}>Mohon konfirmasi kehadiran Anda.</p>
            <input className="rj-input" placeholder="Nama Lengkap" value={form.data.sender_name} onChange={e => form.setData('sender_name', e.target.value)} required />
            <select className="rj-input rj-select" value={form.data.attendance} onChange={e => form.setData('attendance', e.target.value)}>
                <option value="hadir">✅ Hadir</option>
                <option value="tidak_hadir">❌ Tidak Hadir</option>
                <option value="belum_pasti">🤔 Belum Pasti</option>
            </select>
            {form.data.attendance === 'hadir' && (
                <select className="rj-input rj-select" value={form.data.number_of_guests} onChange={e => form.setData('number_of_guests', Number(e.target.value))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Orang</option>)}
                </select>
            )}
            <button type="submit" className="rj-submit-btn" disabled={form.processing}>{form.processing ? 'Mengirim...' : '✉ Kirim Konfirmasi'}</button>
        </form>
    );
}

function LiveContent({ invitation }) {
    return (
        <div className="rj-live-box">
            <span className="rj-live-icon">📺</span>
            <p className="rj-live-desc">Saksikan prosesi pernikahan kami secara virtual melalui kanal live streaming berikut:</p>
            <a href={invitation?.live_streaming_url} target="_blank" rel="noopener noreferrer" className="rj-live-btn"><i className="fas fa-play-circle" /> Watch Live</a>
        </div>
    );
}

function QRContent({ invitation, guest }) {
    if (!guest?.slug) return <p style={{ textAlign:'center', opacity:0.5, fontFamily:'var(--rj-font-b)', padding:'20px 0' }}>QR hanya tersedia untuk undangan personal.</p>;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=1a1108&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`;
    return (
        <div className="rj-qr-box">
            <img src={qrUrl} alt="QR Check-in" className="rj-qr-img" />
            <div className="rj-qr-name">{guest.name}</div>
            <div className="rj-qr-desc">Tunjukkan QR ini kepada panitia untuk konfirmasi kehadiran</div>
        </div>
    );
}

function QuoteContent({ invitation }) {
    return (
        <div className="rj-quote-box">
            {invitation?.opening_ayat ? (
                <>
                    <p className="rj-quote-ayat">&ldquo;{invitation.opening_ayat}&rdquo;</p>
                    {invitation?.opening_ayat_translation && (
                        <p className="rj-quote-translation">"{invitation.opening_ayat_translation}"</p>
                    )}
                    {invitation?.opening_ayat_source && (
                        <p className="rj-quote-source">&mdash; {invitation.opening_ayat_source}</p>
                    )}
                </>
            ) : (
                <p style={{ textAlign: 'center', opacity: 0.5, fontFamily: 'var(--rj-font-b)' }}>Belum ada kutipan atau ayat.</p>
            )}
        </div>
    );
}

function WishesContent({ invitation, guest, wishes: initWishes }) {
    const [wishes, setWishes] = useState(safeArr(initWishes));
    const form = useForm({ sender_name: guest?.name||'', message:'', guest_id: guest?.id||null });
    const [sent, setSent] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        form.post(route('invitation.wish', invitation.slug), {
            onSuccess: () => { setWishes(p => [{ sender_name: form.data.sender_name, message: form.data.message }, ...p]); form.reset('message'); setSent(true); setTimeout(() => setSent(false), 3000); }
        });
    };
    return (
        <div>
            {parseBool(invitation?.enable_wishes) && (
                <form className="rj-wishes-form" onSubmit={submit}>
                    <p style={{ fontFamily:'var(--rj-font-h)', fontSize:'10px', letterSpacing:'0.2em', color:'var(--rj-gold)', textTransform:'uppercase', marginBottom:'4px' }}>Kirim Ucapan</p>
                    <input className="rj-input" placeholder="Nama Anda" value={form.data.sender_name} onChange={e => form.setData('sender_name', e.target.value)} required />
                    <textarea className="rj-input" placeholder="Tuliskan ucapan terbaik Anda..." rows={3} value={form.data.message} onChange={e => form.setData('message', e.target.value)} style={{ resize:'none' }} required />
                    {sent && <p style={{ color:'var(--rj-gold)', fontFamily:'var(--rj-font-b)', fontSize:'13px', textAlign:'center' }}>✨ Ucapan terkirim!</p>}
                    <button type="submit" className="rj-submit-btn" disabled={form.processing}>{form.processing ? 'Mengirim...' : '💌 Kirim Ucapan'}</button>
                </form>
            )}
            <RjDivider />
            <div>
                {!wishes.length && <p style={{ textAlign:'center', opacity:0.5, fontFamily:'var(--rj-font-b)', padding:'20px 0' }}>Belum ada ucapan.</p>}
                {wishes.map((w, i) => (
                    <div key={w.id||i} className="rj-wish-item">
                        <div className="rj-wish-item__name">{w.sender_name}</div>
                        <div className="rj-wish-item__msg">{w.message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════
   ROOM OBJECT COMPONENT
   ════════════════════════════════════════════ */
function RoomObject({ src, label, style, onClick, className = '' }) {
    return (
        <div className={`rj-room-obj ${className}`} style={style} onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
            <img src={src} alt={label} className="rj-room-obj__img" draggable={false} />
            <div className="rj-room-obj__tag">{label}</div>
        </div>
    );
}

/* ════════════════════════════════════════════
   COVER SCREEN
   ════════════════════════════════════════════ */
function CoverScreen({ invitation, brideGrooms, guest, onOpen }) {
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria','male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita','female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    return (
        <div className="rj-cover">
            <img src="/themes/room-jogja/cover-bg.png" alt="Cover" className="rj-cover__bg" />
            <div className="rj-cover__overlay" />
            <div className="rj-cover__content">
                <div className="rj-cover__wedding-of">The Wedding Of</div>
                <div className="rj-cover__names">
                    {groom.nickname || groom.full_name || 'Bimo'} &amp; {bride.nickname || bride.full_name || 'Raras'}
                </div>
                <div className="rj-cover__divider">
                    <div className="rj-cover__divider-line" />
                    <div className="rj-cover__divider-gem" />
                    <div className="rj-cover__divider-line" />
                </div>
                {invitation?.opening_ayat && <p className="rj-cover__ayat">&ldquo;{invitation.opening_ayat}&rdquo;</p>}
                {invitation?.opening_ayat_source && <p className="rj-cover__ayat-source">&mdash; {invitation.opening_ayat_source}</p>}
                {guest?.name && (
                    <div className="rj-cover__guest-box">
                        <div className="rj-cover__guest-label">Kepada Yth.</div>
                        <div className="rj-cover__guest-name">{guest.name}</div>
                    </div>
                )}
                <button type="button" className="rj-cover__btn" onClick={onOpen}>
                    <i className="fas fa-envelope-open-text" /> Buka Undangan
                </button>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════
   ROOM VIEW — Illustrated Objects Layout
   ════════════════════════════════════════════ */
function RoomView({ invitation, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest, musicPlaying, toggleMusic }) {
    const [activeModal, setActiveModal] = useState(null);
    const open = (id) => setActiveModal(id);
    const close = () => setActiveModal(null);

    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria','male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita','female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const enableQr = parseBool(invitation?.enable_qr) && parseBool(invitation?.show_qr_code) && !!guest?.slug;
    const showLive = parseBool(invitation?.show_live_streaming) && !!invitation?.live_streaming_url;
    const showDressCode = parseBool(invitation?.show_dress_code) || !!invitation?.dress_code_text;
    const hasGallery = safeArr(galleries).length > 0;
    const hasLoveStory = safeArr(loveStories).length > 0;
    const hasBankAccounts = safeArr(bankAccounts).length > 0;
    const allWishes = safeArr(wishes);
    const doubledWishes = allWishes.length > 0 ? [...allWishes, ...allWishes] : [];

    const MODALS = {
        about_us:   { icon:'👑', title:'About Us',            content: <AboutUsContent invitation={invitation} brideGrooms={brideGrooms} /> },
        love_story: { icon:'🏮', title:'Love Story',          content: <LoveStoryContent loveStories={loveStories} /> },
        date_venue: { icon:'📅', title:'Date & Venue',        content: <DateVenueContent events={events} invitation={invitation} /> },
        gallery:    { icon:'🖼️', title:'Gallery',             content: <GalleryContent galleries={galleries} /> },
        dress_code: { icon:'👗', title:'Dress Code',          content: <DressCodeContent invitation={invitation} /> },
        rsvp:       { icon:'💌', title:'Konfirmasi Kehadiran',content: <RsvpContent invitation={invitation} guest={guest} /> },
        gift:       { icon:'🎁', title:'Kirim Kado',          content: <GiftContent bankAccounts={bankAccounts} /> },
        live:       { icon:'📺', title:'Live Streaming',      content: <LiveContent invitation={invitation} /> },
        qr:         { icon:'🔲', title:'QR Check-in',         content: <QRContent invitation={invitation} guest={guest} /> },
        wishes:     { icon:'💬', title:'Ucapan & Doa',        content: <WishesContent invitation={invitation} guest={guest} wishes={wishes} /> },
        quote:      { icon:'📜', title:'Kutipan / Ayat',      content: <QuoteContent invitation={invitation} /> },
    };

    const modal = activeModal ? MODALS[activeModal] : null;

    return (
        <div className="rj-room">
            {/* Background */}
            <img src="/themes/room-jogja/room-bg.png" alt="" className="rj-room__bg" />
            <div className="rj-room__bg-overlay" />

            {/* Room stage — all objects positioned absolutely inside here */}
            <div className="rj-stage">

                {/* ── Header names ── */}
                <div className="rj-stage__header">
                    <div className="rj-stage__header-sub">The Wedding Of</div>
                    <div className="rj-stage__header-name">
                        {groom.nickname || groom.full_name || 'Bimo'} &amp; {bride.nickname || bride.full_name || 'Raras'}
                    </div>
                </div>

                {/* ── Lantern top center (decorative) ── */}
                <img src="/themes/room-jogja/lantern.png" alt="" className="rj-obj-lantern" draggable={false} />

                {/* ── LOVE STORY — birds top-left area ── */}
                {hasLoveStory && (
                    <RoomObject
                        src="/themes/room-jogja/love-birds.png"
                        label="Love Story"
                        className="rj-obj-love-story"
                        onClick={() => open('love_story')}
                    />
                )}

                {/* ── DATE & VENUE — calendar top-right ── */}
                <RoomObject
                    src="/themes/room-jogja/calendar.png"
                    label="Date & Venue"
                    className="rj-obj-date-venue"
                    onClick={() => open('date_venue')}
                />

                {/* ── GALLERY — photo frame left wall ── */}
                {hasGallery && (
                    <RoomObject
                        src="/themes/room-jogja/photo-frame.png"
                        label="Gallery"
                        className="rj-obj-gallery"
                        onClick={() => open('gallery')}
                    />
                )}

                {/* ── DRESS CODE — clothes right side ── */}
                {showDressCode && (
                    <RoomObject
                        src="/themes/room-jogja/dress-code.png"
                        label="Dress Code"
                        className="rj-obj-dress-code"
                        onClick={() => open('dress_code')}
                    />
                )}

                {/* ── ABOUT US — couple center stage ── */}
                <RoomObject
                    src="/themes/room-jogja/couple.png"
                    label="About Us"
                    className="rj-obj-about-us rj-obj--center"
                    onClick={() => open('about_us')}
                />

                {/* ── RSVP — tray bottom center ── */}
                {enableRsvp && (
                    <RoomObject
                        src="/themes/room-jogja/rsvp-tray.png"
                        label="RSVP"
                        className="rj-obj-rsvp"
                        onClick={() => open('rsvp')}
                    />
                )}

                {/* ── GIFT — box bottom right ── */}
                {hasBankAccounts && (
                    <RoomObject
                        src="/themes/room-jogja/gift-box.png"
                        label="Gift"
                        className="rj-obj-gift"
                        onClick={() => open('gift')}
                    />
                )}

                {/* ── QUOTE — scroll bottom left ── */}
                {invitation?.opening_ayat && (
                    <RoomObject
                        src="/themes/room-jogja/quote.png"
                        label="Kutipan"
                        className="rj-obj-quote"
                        onClick={() => open('quote')}
                    />
                )}

                {/* ── LIVE STREAMING — bottom left ── */}
                {showLive && (
                    <div className="rj-obj-live rj-obj-tag-only" onClick={() => open('live')}>
                        <span className="rj-tag-bubble rj-tag-live">📺 Live</span>
                    </div>
                )}

                {/* ── QR CODE — floating tag ── */}
                {enableQr && (
                    <div className="rj-obj-qr rj-obj-tag-only" onClick={() => open('qr')}>
                        <span className="rj-tag-bubble">🔲 QR Code</span>
                    </div>
                )}

                {/* ── UCAPAN — bottom tag ── */}
                {enableWishes && (
                    <div className="rj-obj-wishes rj-obj-tag-only" onClick={() => open('wishes')}>
                        <span className="rj-tag-bubble">💬 Ucapan</span>
                    </div>
                )}

            </div>{/* end rj-stage */}

            {/* ── Floating Controls ── */}
            <div className="rj-float-controls">
                {invitation?.music_url && (
                    <button className={`rj-float-btn ${musicPlaying ? 'is-playing' : ''}`} onClick={toggleMusic} title={musicPlaying ? 'Pause Musik' : 'Play Musik'}>
                        <i className={`fas ${musicPlaying ? 'fa-music' : 'fa-volume-mute'}`} />
                    </button>
                )}
            </div>

            {/* ── Wishes Bar ── */}
            <div className="rj-wishes-bar">
                <div className="rj-wishes-bar__header">
                    <span className="rj-wishes-bar__title">💬 Ucapan &amp; Doa</span>
                    {enableWishes && <button className="rj-wishes-bar__add-btn" onClick={() => open('wishes')}><i className="fas fa-plus" /> Kirim</button>}
                </div>
                {doubledWishes.length > 0 ? (
                    <div className="rj-wishes-marquee">
                        <div className="rj-wishes-marquee__track">
                            {doubledWishes.map((w, i) => (
                                <div key={i} className="rj-wish-chip">
                                    <div className="rj-wish-chip__name">{w.sender_name}</div>
                                    <div className="rj-wish-chip__msg">{w.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p style={{ fontFamily:'var(--rj-font-b)', fontSize:'12px', color:'var(--rj-cream)', opacity:0.4, margin:0, paddingTop:'4px' }}>Jadilah yang pertama mengucapkan selamat...</p>
                )}
            </div>

            {/* ── Modal ── */}
            {modal && <RjModal icon={modal.icon} title={modal.title} onClose={close}>{modal.content}</RjModal>}
        </div>
    );
}

/* ════════════════════════════════════════════
   ROOT
   ════════════════════════════════════════════ */
export default function RoomJogjaTheme({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const [isOpen, setIsOpen] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, musicPlaying, setMusicPlaying);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
        if (invitation?.music_url && parseBool(invitation?.music_autoplay) && audioRef.current) {
            audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
        }
        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    }, [invitation]);

    const toggleMusic = useCallback(() => {
        if (!audioRef.current) return;
        if (musicPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
        setMusicPlaying(p => !p);
    }, [musicPlaying]);

    const couples = safeArr(brideGrooms);
    const g = couples.find(b => ['pria','male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const b2 = couples.find(b => ['wanita','female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    return (
        <>
            <Head title={invitation?.title || `${g.nickname||'Bimo'} & ${b2.nickname||'Raras'} | Undangan Pernikahan`} />
            {invitation?.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}
            <div className="rj-root">
                {!isOpen && <CoverScreen invitation={invitation} brideGrooms={brideGrooms} guest={guest} onOpen={handleOpen} />}
                {isOpen && <RoomView invitation={invitation} brideGrooms={brideGrooms} events={events} galleries={galleries} loveStories={loveStories} bankAccounts={bankAccounts} wishes={wishes} guest={guest} sections={sections} musicPlaying={musicPlaying} toggleMusic={toggleMusic} />}
            </div>
        </>
    );
}
