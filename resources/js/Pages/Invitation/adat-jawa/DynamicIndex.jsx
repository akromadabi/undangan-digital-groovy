import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';;
import DressCodeBlock from '@/Components/DressCodeBlock';
import { useForm, Head, router } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';


// Import theme assets via Vite
import logoDana from './asset/1200px-Logo_dana_blue.svg-1-2-1-1.png';
import logoBca from './asset/BCA_logo_Bank_Central_Asia-1-3-2048x650-1-1-1-1-1.png';
import chipAtm from './asset/chip-atm-1-2-1-1-1-3.png';
import heartSvg from './asset/2764.svg';
import moroccanCoverBlank from './asset/moroccan_cover_blank.png';

const ASSETS = {
    dana: logoDana,
    bca: logoBca,
    chip: chipAtm,
    heart: heartSvg,
    coverBlank: moroccanCoverBlank,
};

/* ─── Error Boundary Baku ─── */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="theme-error-boundary" style={{ padding: '40px', textAlign: 'center', background: '#121E2A', color: '#F4EAE1' }}>
                <h2>Terjadi kesalahan pada rendering tema.</h2>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px', fontSize: '12px' }}>{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

/* ─── Vector Javanese SVG Components (Pure Vector, No Pixelation) ─── */
export function JavaneseGunungan({ className, width = 200, height = 280, color = 'var(--aj-primary)', ...props }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 200 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M 100,10 C 130,50 185,130 185,195 C 185,245 147,270 100,270 C 53,270 15,245 15,195 C 15,130 70,50 100,10 Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M 100,20 C 125,57 175,132 175,192 C 175,237 141,260 100,260 C 59,260 25,237 25,192 C 25,132 75,57 100,20 Z"
                stroke={color}
                strokeWidth="0.75"
                strokeDasharray="3,3"
                opacity="0.8"
            />
            <path
                d="M 100,260 L 100,80"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.9"
            />
            <path
                d="M 100,90 C 115,85 125,75 125,65 C 125,52 110,48 100,60 C 90,48 75,52 75,65 C 75,75 85,85 100,90 Z"
                fill={color}
                fillOpacity="0.15"
                stroke={color}
                strokeWidth="1.2"
            />
            <path
                d="M 100,115 C 120,110 135,95 135,85 C 135,75 120,70 115,80 C 110,90 120,95 110,100"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M 100,115 C 80,110 65,95 65,85 C 65,75 80,70 85,80 C 90,90 80,95 90,100"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M 100,150 C 130,145 150,125 150,110 C 150,95 130,90 122,105 C 115,120 130,125 118,132"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M 100,150 C 70,145 50,125 50,110 C 50,95 70,90 78,105 C 85,120 70,125 82,132"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M 100,190 C 140,185 165,160 165,140 C 165,120 140,115 130,135 C 120,155 140,160 125,170"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M 100,190 C 60,185 35,160 35,140 C 35,120 60,115 70,135 C 80,155 60,160 75,170"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M 55,260 L 145,260 L 140,245 L 60,245 Z"
                fill={color}
                fillOpacity="0.2"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M 68,245 L 68,210 L 78,210 L 78,245 Z"
                fill={color}
                fillOpacity="0.3"
                stroke={color}
                strokeWidth="1.2"
            />
            <path
                d="M 122,245 L 122,210 L 132,210 L 132,245 Z"
                fill={color}
                fillOpacity="0.3"
                stroke={color}
                strokeWidth="1.2"
            />
            <path
                d="M 62,210 L 100,180 L 138,210 Z"
                fill={color}
                fillOpacity="0.4"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M 100,180 L 100,170"
                stroke={color}
                strokeWidth="1.5"
            />
            <path
                d="M 85,245 L 85,220 C 85,215 115,215 115,220 L 115,245 Z"
                fill={color}
                fillOpacity="0.5"
                stroke={color}
                strokeWidth="1.2"
            />
            <path
                d="M 100,220 L 100,245"
                stroke={color}
                strokeWidth="0.75"
            />
            <path
                d="M 45,240 C 40,220 50,200 60,205 C 55,215 48,225 52,235"
                stroke={color}
                strokeWidth="1"
                strokeLinecap="round"
            />
            <path
                d="M 155,240 C 160,220 150,200 140,205 C 145,215 152,225 148,235"
                stroke={color}
                strokeWidth="1"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function JavaneseCornerOrnament({ className, width = 60, height = 60, color = 'var(--aj-primary)', flipped = false, ...props }) {
    const transformStr = flipped ? "scale(-1, 1) translate(-100, 0)" : "";
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <g transform={transformStr}>
                <path
                    d="M 0,0 C 20,5 45,15 55,35 C 65,55 55,80 35,85 C 15,90 5,75 10,60 C 15,45 35,45 40,55 C 45,65 35,75 30,70"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M 25,10 C 45,15 65,30 70,55 C 75,80 60,95 45,95 C 30,95 25,85 30,75 C 35,65 50,70 50,80"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M 10,5 C 20,15 22,30 15,40"
                    stroke={color}
                    strokeWidth="1"
                />
                <path
                    d="M 40,20 C 55,25 60,40 55,50"
                    stroke={color}
                    strokeWidth="1"
                />
                <path
                    d="M 5,20 C 15,22 18,35 12,45"
                    stroke={color}
                    strokeWidth="1"
                />
                <path
                    d="M 50,5 C 70,12 85,25 90,45"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    d="M 70,15 C 80,22 90,35 95,50"
                    stroke={color}
                    strokeWidth="1"
                />
                <circle cx="35" cy="55" r="1.5" fill={color} />
                <circle cx="50" cy="80" r="1.5" fill={color} />
                <circle cx="30" cy="70" r="1" fill={color} />
            </g>
        </svg>
    );
}

export function JavaneseSwirlDivider({ className, height = 24, color = 'var(--aj-primary)', ...props }) {
    return (
        <div className={`aj-divider-decor flex items-center justify-center ${className || ''}`} {...props}>
            <svg
                width="240"
                height={height}
                viewBox="0 0 240 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
            >
                <path
                    d="M 120,4 L 128,12 L 120,20 L 112,12 Z"
                    fill={color}
                    stroke={color}
                    strokeWidth="1"
                />
                <circle cx="120" cy="12" r="2" fill="var(--aj-accent)" />
                <path
                    d="M 112,12 C 100,12 90,6 80,12 C 70,18 60,18 50,12 C 40,6 30,12 20,12 C 15,12 10,8 12,6 C 14,4 18,6 18,8"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M 95,12 C 85,12 80,18 70,12"
                    stroke={color}
                    strokeWidth="1"
                    strokeLinecap="round"
                />
                <path
                    d="M 65,12 C 55,12 50,6 40,12"
                    stroke={color}
                    strokeWidth="1"
                    strokeLinecap="round"
                />
                <g transform="scale(-1, 1) translate(-240, 0)">
                    <path
                        d="M 112,12 C 100,12 90,6 80,12 C 70,18 60,18 50,12 C 40,6 30,12 20,12 C 15,12 10,8 12,6 C 14,4 18,6 18,8"
                        stroke={color}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M 95,12 C 85,12 80,18 70,12"
                        stroke={color}
                        strokeWidth="1"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 65,12 C 55,12 50,6 40,12"
                        stroke={color}
                        strokeWidth="1"
                        strokeLinecap="round"
                    />
                </g>
                <circle cx="10" cy="12" r="1.5" fill={color} />
                <circle cx="230" cy="12" r="1.5" fill={color} />
            </svg>
        </div>
    );
}

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function getThemeLabels(type, locale = 'id', brideGrooms = [], invitation = {}) {
    const t = type || 'wedding';
    const isEn = String(locale).toLowerCase() === 'en';
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    
    let coupleName = '';
    let isSingleHost = false;
    
    if (['wedding', 'anniversary'].includes(t)) {
        const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
        const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
        coupleName = groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : 'Bride & Groom';
        isSingleHost = false;
    } else {
        coupleName = host.nickname || host.full_name || 'Host';
        isSingleHost = true;
    }

    let labels = {
        circleLogoText: isEn ? `• CELEBRATION OF ${coupleName.toUpperCase()} •` : `• PERAYAAN BAHAGIA ${coupleName.toUpperCase()} •`,
        heroBadge: isEn ? 'SPECIAL CELEBRATION' : 'PERAYAAN SPESIAL',
        heroDateLabel: isEn ? 'SAVE THE DATE' : 'SIMPAN TANGGAL',
        
        coupleTitle: isEn ? 'Profile' : 'Profil Utama',
        coupleSubtitle: isEn ? 'Penyelenggara' : 'Penyelenggara',
        
        storyTitle: isEn ? 'OUR STORY' : 'KISAH PERJALANAN',
        storySubtitle: isEn ? 'Love Story' : 'Kisah Kasih',
        
        eventTitle: isEn ? 'SPECIAL EVENT' : 'ACARA SPESIAL',
        eventSubtitle: isEn ? 'Event Schedule' : 'Agenda Acara',
        
        streamTitle: isEn ? 'Virtual Celebration' : 'Siaran Langsung',
        streamSubtitle: 'Live Streaming',
        streamDesc: isEn 
            ? 'We invite you to attend our special event virtually through the platforms below.'
            : 'Kami mengundang Anda untuk menyaksikan momen bahagia prosesi acara kami secara virtual melalui platform berikut.',
            
        closingQuote: invitation?.closing_text || (isEn 
            ? 'It is an honor and a happiness for us if you are willing to attend and give your blessings to our event.' 
            : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.'),
            
        signatureTitle: isEn ? 'We Who Are Joyful,' : 'Kami Yang Berbahagia,',
        signatureFamilies: isEn ? 'Big Family' : 'Keluarga Besar',
    };

    if (t === 'wedding') {
        labels.circleLogoText = isEn ? `• THE WEDDING OF ${coupleName.toUpperCase()} •` : `• PERNIKAHAN ${coupleName.toUpperCase()} •`;
        labels.heroBadge = isEn ? 'THE WEDDING OF' : 'PERNIKAHAN';
        labels.coupleTitle = isEn ? 'THE BRIDE & GROOM' : 'MEMPELAI';
        labels.coupleSubtitle = isEn ? 'The Couple' : 'Mempelai';
        labels.storyTitle = isEn ? 'LOVE STORY' : 'KISAH CINTA';
        labels.storySubtitle = isEn ? 'Our Love Journey' : 'Kisah Perjalanan';
        labels.eventTitle = isEn ? 'SAVE THE DATE' : 'SAVE THE DATE';
        labels.eventSubtitle = isEn ? 'Wedding Event' : 'Jadwal Acara';
        labels.streamTitle = isEn ? 'Virtual Celebration' : 'Siaran Langsung';
        labels.streamDesc = isEn 
            ? 'We will broadcast the happy moments of our wedding procession virtually through the following platforms.'
            : 'Kami mengundang Anda untuk menyaksikan momen bahagia prosesi pernikahan kami secara virtual melalui platform berikut.';
        labels.closingQuote = invitation?.closing_text || (isEn 
            ? 'It is an honor and a happiness for us if you are willing to attend and give your blessings to the newlyweds.' 
            : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.');
    } else if (t === 'anniversary') {
        labels.circleLogoText = isEn ? `• ANNIVERSARY OF ${coupleName.toUpperCase()} •` : `• ANNIVERSARY ${coupleName.toUpperCase()} •`;
        labels.heroBadge = isEn ? 'ANNIVERSARY OF' : 'ANNIVERSARY';
        labels.coupleTitle = isEn ? 'THE COUPLE' : 'PASANGAN';
        labels.coupleSubtitle = isEn ? 'The Couple' : 'Pasangan';
        labels.storyTitle = isEn ? 'LOVE STORY' : 'KISAH CINTA';
        labels.storySubtitle = isEn ? 'Our Love Journey' : 'Kisah Perjalanan';
        labels.eventTitle = isEn ? 'SAVE THE DATE' : 'SAVE THE DATE';
        labels.eventSubtitle = isEn ? 'Anniversary Tour' : 'Jadwal Perayaan';
        labels.streamTitle = isEn ? 'Virtual Celebration' : 'Siaran Langsung';
        labels.streamDesc = isEn 
            ? 'We will broadcast the happy moments of our anniversary procession virtually through the following platforms.'
            : 'Kami mengundang Anda untuk menyaksikan momen bahagia prosesi anniversary kami secara virtual melalui platform berikut.';
    } else if (t === 'graduation') {
        labels.circleLogoText = isEn ? `• GRADUATION OF ${coupleName.toUpperCase()} •` : `• WISUDA ${coupleName.toUpperCase()} •`;
        labels.heroBadge = isEn ? 'GRADUATION OF' : 'WISUDA';
        labels.coupleTitle = isEn ? 'GRADUATE PROFILE' : 'PROFIL WISUDAWAN';
        labels.coupleSubtitle = isEn ? 'Graduate' : 'Wisudawan/wati';
        labels.storyTitle = isEn ? 'STUDY JOURNEY' : 'PERJALANAN STUDI';
        labels.storySubtitle = isEn ? 'My Academic Journey' : 'Perjalanan Studi';
        labels.eventTitle = isEn ? 'GRADUATION TOUR' : 'JADWAL ACARA';
        labels.eventSubtitle = isEn ? 'Graduation Event' : 'Jadwal Syukuran';
        labels.streamDesc = isEn 
            ? 'We will broadcast the happy moments of our graduation procession virtually through the following platforms.'
            : 'Kami mengundang Anda untuk menyaksikan momen bahagia prosesi kelulusan kami secara virtual melalui platform berikut.';
    } else if (t === 'birthday') {
        labels.circleLogoText = isEn ? `• BIRTHDAY OF ${coupleName.toUpperCase()} •` : `• ULANG TAHUN ${coupleName.toUpperCase()} •`;
        labels.heroBadge = isEn ? 'THE BIRTHDAY OF' : 'ULANG TAHUN';
        labels.coupleTitle = isEn ? 'CELEBRANT PROFILE' : 'PROFIL UTAMA';
        labels.coupleSubtitle = isEn ? 'Celebrant' : 'Ulang Tahun';
        labels.storyTitle = isEn ? 'LIFE TIMELINE' : 'PERJALANAN HIDUP';
        labels.storySubtitle = isEn ? 'My Milestones' : 'Perjalanan Usia';
        labels.eventTitle = isEn ? 'BIRTHDAY PARTY' : 'JADWAL PESTA';
        labels.eventSubtitle = isEn ? 'Birthday Event' : 'Jadwal Perayaan';
        labels.streamDesc = isEn 
            ? 'We will broadcast the happy moments of our birthday party virtually through the following platforms.'
            : 'Kami mengundang Anda untuk menyaksikan momen bahagia pesta ulang tahun kami secara virtual melalui platform berikut.';
    } else if (t === 'aqiqah') {
        labels.circleLogoText = isEn ? `• AQIQAH OF ${coupleName.toUpperCase()} •` : `• AQIQAH ${coupleName.toUpperCase()} •`;
        labels.heroBadge = isEn ? 'AQIQAH OF' : 'AQIQAH';
        labels.coupleTitle = isEn ? 'BABY PROFILE' : 'PROFIL ANAK';
        labels.coupleSubtitle = isEn ? 'Child' : 'Buah Hati';
        labels.storyTitle = isEn ? 'BABY TIMELINE' : 'TUMBUH KEMBANG';
        labels.storySubtitle = isEn ? 'Growth Milestones' : 'Tumbuh Kembang';
        labels.eventTitle = isEn ? 'AQIQAH CELEBRATION' : 'JADWAL SYUKURAN';
        labels.eventSubtitle = isEn ? 'Aqiqah Event' : 'Jadwal Acara';
        labels.streamDesc = isEn 
            ? 'We will broadcast the happy moments of our baby aqiqah virtually through the following platforms.'
            : 'Kami mengundang Anda untuk menyaksikan momen bahagia aqiqah anak kami secara virtual melalui platform berikut.';
    } else if (t === 'circumcision') {
        labels.circleLogoText = isEn ? `• CIRCUMCISION OF ${coupleName.toUpperCase()} •` : `• KHITANAN ${coupleName.toUpperCase()} •`;
        labels.heroBadge = isEn ? 'CIRCUMCISION OF' : 'KHITANAN';
        labels.coupleTitle = isEn ? 'CHILD PROFILE' : 'PROFIL ANAK';
        labels.coupleSubtitle = isEn ? 'Child' : 'Buah Hati';
        labels.storyTitle = isEn ? 'GROWTH TIMELINE' : 'TUMBUH KEMBANG';
        labels.storySubtitle = isEn ? 'Growth Milestones' : 'Tumbuh Kembang';
        labels.eventTitle = isEn ? 'CIRCUMCISION TOUR' : 'JADWAL SYUKURAN';
        labels.eventSubtitle = isEn ? 'Circumcision Event' : 'Jadwal Acara';
        labels.streamDesc = isEn 
            ? 'We will broadcast the happy moments of our circumcision virtually through the following platforms.'
            : 'Kami mengundang Anda untuk menyaksikan momen bahagia khitanan putra kami secara virtual melalui platform berikut.';
    }

    return {
        coupleName,
        isSingleHost,
        labels
    };
}

const isArabicText = (text) => {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicPattern.test(text);
};

function formatDate(dateStr, lang = 'id') {
    if (!dateStr) return '';
    // Safe parsing: append T12:00:00 to prevent UTC midnight offset bug
    const safe = String(dateStr).substring(0, 10) + 'T12:00:00';
    const date = new Date(safe);
    if (isNaN(date.getTime())) {
        return String(dateStr).toUpperCase();
    }
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return date.toLocaleDateString(locale, {
        day: 'numeric', month: 'long', year: 'numeric'
    }).toUpperCase();
}

const translateChildOrder = (childOrder, gender, isEn = false) => {
    if (!childOrder) return '';
    const raw = String(childOrder).trim().toLowerCase();
    let matchedKey = null;

    if (raw.includes('tunggal') || raw.includes('only'))        matchedKey = 'tunggal';
    else if (raw.includes('bungsu') || raw.includes('youngest')) matchedKey = 'bungsu';
    else if (raw.includes('10') || raw.includes('kesepuluh'))   matchedKey = '10';
    else if (raw.includes('9') || raw.includes('kesembilan'))   matchedKey = '9';
    else if (raw.includes('8') || raw.includes('kedelapan'))    matchedKey = '8';
    else if (raw.includes('7') || raw.includes('ketujuh'))      matchedKey = '7';
    else if (raw.includes('6') || raw.includes('keenam'))       matchedKey = '6';
    else if (raw.includes('5') || raw.includes('kelima'))       matchedKey = '5';
    else if (raw.includes('4') || raw.includes('keempat'))      matchedKey = '4';
    else if (raw.includes('3') || raw.includes('ketiga'))       matchedKey = '3';
    else if (raw.includes('2') || raw.includes('kedua'))        matchedKey = '2';
    else if (raw.includes('1') || raw.includes('pertama'))      matchedKey = '1';

    const ordinalMap = {
        '1': { id: 'Pertama', en: 'First' }, '2': { id: 'Kedua', en: 'Second' },
        '3': { id: 'Ketiga', en: 'Third' },  '4': { id: 'Keempat', en: 'Fourth' },
        '5': { id: 'Kelima', en: 'Fifth' },  '6': { id: 'Keenam', en: 'Sixth' },
        '7': { id: 'Ketujuh', en: 'Seventh' },'8': { id: 'Kedelapan', en: 'Eighth' },
        '9': { id: 'Kesembilan', en: 'Ninth' },'10': { id: 'Kesepuluh', en: 'Tenth' },
        'bungsu': { id: 'Bungsu', en: 'Youngest' },
        'tunggal': { id: 'Tunggal', en: 'Only' },
    };

    const match = ordinalMap[matchedKey] || { id: childOrder, en: childOrder };
    const isWanita = String(gender).toLowerCase() === 'wanita' || String(gender).toLowerCase() === 'female';

    if (isEn) {
        const noun = isWanita ? 'Daughter' : 'Son';
        return match.en.toLowerCase() === 'only'
            ? `ONLY ${noun.toUpperCase()} OF`
            : `${String(match.en).toUpperCase()} ${noun.toUpperCase()} OF`;
    } else {
        const noun = isWanita ? 'Putri' : 'Putra';
        return match.id.toLowerCase() === 'tunggal'
            ? `${noun.toUpperCase()} TUNGGAL DARI`
            : `${noun.toUpperCase()} ${String(match.id).toUpperCase()} DARI`;
    }
};

const getStorageUrl = (url, fallback) => {
    if (!url || url === 'null' || url === 'undefined' || url === '/storage/' || url === 'storage/') return fallback;
    if (typeof url === 'string' && url.includes(',')) {
        url = url.split(',')[0];
    }
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.startsWith('themes/') || cleanUrl.startsWith('/themes/')) {
        return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/storage/')) return cleanUrl;
    if (cleanUrl.startsWith('storage/')) return '/' + cleanUrl;
    if (cleanUrl.startsWith('/')) return cleanUrl;
    return `/storage/${cleanUrl}`;
};

const getThemeAssetUrl = (url, fallback) => {
    if (!url) return fallback;
    return getStorageUrl(url, fallback);
};

const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

// Global flags
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL WRAPPER
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);

    useEffect(() => {
        if (!globalShowAnimations) {
            setVisible(true);
            return;
        }
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            setVisible(e.isIntersecting);
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let baseClass = 'aj-reveal--up';
    if (variant === 'zoom') baseClass = 'aj-reveal--zoom';
    else if (variant === 'left') baseClass = 'aj-reveal--left';
    else if (variant === 'right') baseClass = 'aj-reveal--right';
    else if (variant === 'down') baseClass = 'aj-reveal--down';

    return (
        <div
            ref={ref}
            className={`${className} ${baseClass} ${visible ? 'is-visible' : ''}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   SUB COMPONENTS
   ═══════════════════════════════════════ */

// 1. Cover / Sampul Section
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, themeConfig }) {
    const isEn = invitation?.language === 'en';
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };
    const coupleName = themeConfig?.coupleName || 'Bimo & Raras';

    const coverImages = useMemo(() => {
        if (!invitation?.cover_image) return [];
        return invitation.cover_image.split(',').map(url => getThemeAssetUrl(url, null)).filter(Boolean);
    }, [invitation?.cover_image]);

    const hasPhoto = globalShowPhotos && coverImages.length > 0;

    return (
        <div className={`aj-cover${isOpened ? ' aj-slide--hidden' : ''}`}>
            {/* Majestic Cover background layer: full-screen photo slideshow if exists, otherwise centered Gunungan silhouette watermark */}
            {hasPhoto ? (
                <div className="aj-cover-bg-image absolute inset-0 w-full h-full overflow-hidden">
                    <PremiumSlideshow
                        images={coverImages}
                        positionX={invitation?.cover_position_x}
                        positionY={invitation?.cover_position_y}
                        zoom={invitation?.cover_zoom}
                        className="w-full h-full"
                        imgClassName="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="aj-cover-bg-image absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                    <JavaneseGunungan className="opacity-10 pointer-events-none z-0" width={280} height={392} />
                </div>
            )}
            
            <div className={`aj-cover-dark-overlay${hasPhoto ? ' has-photo' : ''}`} />
            
            {/* Javanese wood-carving corner flourishes on top left and right */}
            <div className="aj-cover-lanterns-overlay" style={{ display: 'flex', justifyContent: 'space-between', padding: '0', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
                <JavaneseCornerOrnament className="aj-cover-lantern-left" style={{ width: '60px', height: 'auto' }} />
                <JavaneseCornerOrnament className="aj-cover-lantern-right" flipped style={{ width: '60px', height: 'auto' }} />
            </div>

            {/* Elegant outer gold border frame */}
            <div className="aj-cover-border-frame" />

            <div className="aj-cover-wrapper">
                {/* Javanese Gunungan logo header (Smaller badge if full background photo, larger monogram if no photo) */}
                <div className="aj-cover-kubah-icon-container" style={hasPhoto ? { marginBottom: '16px' } : undefined}>
                    <JavaneseGunungan className="aj-cover-kubah-icon" style={{ width: hasPhoto ? '80px' : '100px', height: 'auto', color: 'var(--aj-accent)', opacity: hasPhoto ? 0.9 : 1 }} />
                </div>

                {/* Text content blocks */}
                <div className="aj-cover-content-block">
                    <div className="aj-cover-badge">{themeConfig?.labels?.heroBadge || 'THE WEDDING OF'}</div>
                    <h1 className="aj-cover-couple">{coupleName}</h1>
                    
                    {invitation?.countdown_target_date && (
                        <div className="aj-cover-date">
                            {formatDate(invitation.countdown_target_date, invitation?.language)}
                        </div>
                    )}

                    <div className="aj-cover-dear-box">
                        <div className="aj-cover-dear">{isEn ? 'To:' : 'Kepada Yth:'}</div>
                        <div className="aj-cover-guest">{activeGuest.name}</div>
                        <p className="aj-cover-apology">{isEn ? '*We apologize for any spelling errors in names/titles' : '*Mohon maaf apabila terdapat kesalahan penulisan nama/gelar'}</p>
                    </div>

                    <button type="button" onClick={onOpen} id="tombol-buka" className="aj-btn-primary aj-btn-cover-buka">
                        <i className="fas fa-envelope-open" /> {isEn ? 'Open Invitation' : 'Buka Undangan'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// 2. Opening Section
function OpeningSection({ invitation, brideGrooms, language, themeConfig }) {
    const openingImages = useMemo(() => {
        const rawSource = invitation?.opening_image || invitation?.cover_image;
        if (!rawSource) return [];
        return rawSource.split(',').map(url => getThemeAssetUrl(url, null)).filter(Boolean);
    }, [invitation?.opening_image, invitation?.cover_image]);

    const coupleName = themeConfig?.coupleName || 'Bimo & Raras';
    const targetDate = invitation?.countdown_target_date || '';
    const countdown = useCountdown(targetDate);

    const getDotDateFormat = (dateStr) => {
        if (!dateStr) return '';
        const cleanDate = String(dateStr).substring(0, 10);
        const parts = cleanDate.split('-');
        if (parts.length < 3) return '';
        return `${parts[2]} . ${parts[1]} . ${parts[0]}`;
    };

    const formattedDate = getDotDateFormat(targetDate);

    return (
        <section id="opening" className="aj-opening-section-hero">
            {/* Subtle background texture */}
            <div className="aj-opening-bg-texture" />
            
            <div className="aj-opening-hero-block">
                {/* Top Javanese wood-carving flourishes decor */}
                <div className="aj-lantern-header-decor" style={{ display: 'flex', justifyContent: 'space-between', padding: '0', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
                    <JavaneseCornerOrnament className="aj-decor-lantern-left" style={{ width: '60px', height: 'auto' }} />
                    <JavaneseCornerOrnament className="aj-decor-lantern-right" flipped style={{ width: '60px', height: 'auto' }} />
                </div>

                <Reveal delay={100}>
                    <span className="aj-opening-hero-subtitle">
                        {themeConfig?.labels?.heroBadge || 'THE WEDDING OF'}
                    </span>
                </Reveal>

                {/* Breathtaking Javanese Palace Photo Window with Double Golden Border */}
                {globalShowPhotos && openingImages.length > 0 ? (
                    <Reveal className="aj-opening-photo-window-container" variant="zoom" delay={200}>
                        <div className="aj-opening-photo-window">
                            <PremiumSlideshow
                                images={openingImages}
                                positionX={invitation?.opening_position_x ?? invitation?.cover_position_x}
                                positionY={invitation?.opening_position_y ?? invitation?.cover_position_y}
                                zoom={invitation?.opening_zoom ?? invitation?.cover_zoom}
                                className="w-full h-full"
                                imgClassName="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="aj-opening-photo-window-overlay" />
                        </div>
                    </Reveal>
                ) : (
                    <Reveal className="aj-opening-photo-window-container" variant="zoom" delay={200}>
                        <div className="aj-opening-kubah-placeholder flex items-center justify-center">
                            <JavaneseGunungan style={{ width: '100px', height: 'auto', color: 'var(--aj-accent)' }} />
                        </div>
                    </Reveal>
                )}

                <Reveal delay={300}>
                    <h1 className="aj-opening-hero-couple">{coupleName}</h1>
                </Reveal>
                {formattedDate && (
                    <Reveal delay={500}>
                        <span className="aj-opening-hero-date">
                            {themeConfig?.labels?.heroDateLabel || 'SAVE THE DATE'} | {formattedDate}
                        </span>
                    </Reveal>
                )}

                {/* Countdown Row */}
                {targetDate && (
                    <Reveal className="aj-opening-countdown-row" variant="zoom" delay={700}>
                        <div className="aj-opening-countdown-item">
                            <span className="aj-opening-countdown-value">{String(countdown.days).padStart(2, '0')}</span>
                            <span className="aj-opening-countdown-label">{language === 'en' ? 'Days' : 'Hari'}</span>
                        </div>
                        <div className="aj-opening-countdown-item">
                            <span className="aj-opening-countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                            <span className="aj-opening-countdown-label">{language === 'en' ? 'Hours' : 'Jam'}</span>
                        </div>
                        <div className="aj-opening-countdown-item">
                            <span className="aj-opening-countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                            <span className="aj-opening-countdown-label">{language === 'en' ? 'Mins' : 'Menit'}</span>
                        </div>
                        <div className="aj-opening-countdown-item">
                            <span className="aj-opening-countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
                            <span className="aj-opening-countdown-label">{language === 'en' ? 'Secs' : 'Detik'}</span>
                        </div>
                    </Reveal>
                )}
            </div>

            <div className="aj-opening-content">
                {/* Javanese Gunungan Silhouette Divider */}
                <Reveal className="aj-opening-lantern-divider" variant="zoom">
                    <JavaneseGunungan className="mx-auto opacity-60" width={100} height={140} style={{ color: 'var(--aj-primary)' }} />
                </Reveal>

                {/* Text block with clean background and high contrast */}
                <Reveal className="aj-opening-text-block">
                    <h2 className="aj-opening-basmalah">{invitation?.religion === 'islam' ? 'Bismillahirrahmanirrahim' : (language === 'en' ? 'Welcome' : 'Selamat Datang')}</h2>
                    <div className="aj-opening-salut">
                        {invitation?.opening_text ? (
                            <p style={{ whiteSpace: 'pre-line' }}>{invitation.opening_text}</p>
                        ) : (
                            <p>{language === 'en' ? 'With love and blessings, we invite you to attend our celebration.' : 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan kami.'}</p>
                        )}
                    </div>
                </Reveal>

                {invitation?.opening_ayat && (
                    <Reveal className="aj-quote-box" variant="zoom" delay={200}>
                        <div className={`aj-quote-arabic${isArabicText(invitation.opening_ayat) ? ' is-arabic' : ''}`}>
                            {invitation.opening_ayat}
                        </div>
                        {invitation.opening_ayat_translation && 
                         invitation.opening_ayat_translation.trim() !== invitation.opening_ayat.trim() && (
                            <div className="aj-quote-translation">
                                "{invitation.opening_ayat_translation}"
                            </div>
                        )}
                        {invitation.opening_ayat_source && (
                            <div className="aj-quote-source">
                                — {invitation.opening_ayat_source}
                            </div>
                        )}
                    </Reveal>
                )}

                <JavaneseSwirlDivider />
            </div>
        </section>
    );
}

// 3. Couple / Mempelai Section
function CoupleSection({ brideGrooms, language, id, themeConfig }) {
    const couples = safeArr(brideGrooms);
    const isEn = language === 'en';

    const bride = couples.find(b => b.gender === 'wanita' || String(b.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(b => b.gender === 'pria' || String(b.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};

    const renderMempelai = (m, genderLabel) => {
        if (!m.full_name) return null;

        return (
            <div className="aj-couple-card">
                {globalShowPhotos && m.photo ? (
                    <Reveal className="aj-profile-frame-wrap" variant="zoom">
                        <div className="aj-profile-arch-frame">
                            <img 
                                src={getThemeAssetUrl(m.photo, '')} 
                                className="aj-profile-photo" 
                                alt={m.full_name} 
                                style={{
                                    objectPosition: `${m.photo_position_x ?? 50}% ${m.photo_position_y ?? 50}%`,
                                    transform: `scale(${m.photo_zoom ?? 1.0})`,
                                    transformOrigin: 'center'
                                }}
                            />
                        </div>
                        <JavaneseGunungan className="aj-profile-lantern-decor" style={{ width: '32px', height: 'auto', top: '-15px', color: 'var(--aj-accent)' }} />
                    </Reveal>
                ) : (
                    <Reveal className="aj-profile-frame-wrap" variant="zoom">
                        <div className="aj-profile-arch-frame aj-profile-monogram-frame">
                            <div className="aj-profile-monogram-initial">
                                {String(m.nickname || m.full_name || '?').charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <JavaneseGunungan className="aj-profile-lantern-decor" style={{ width: '32px', height: 'auto', top: '-15px', color: 'var(--aj-accent)' }} />
                    </Reveal>
                )}
                <Reveal variant="up" delay={100}>
                    <h3 className="aj-profile-name">{m.full_name}</h3>
                </Reveal>
                <Reveal variant="up" delay={200}>
                    <div className="aj-profile-child-order">
                        {translateChildOrder(m.child_order, m.gender, isEn)}
                    </div>
                </Reveal>
                <Reveal variant="up" delay={300}>
                    <div className="aj-profile-parents">
                        {isEn ? 'Beloved offspring of:' : 'Putra/Putri tercinta dari Bapak & Ibu:'} <br />
                        <strong>{m.father_name || '...'}</strong> &amp; <strong>{m.mother_name || '...'}</strong>
                    </div>
                </Reveal>
                {(m.instagram || m.instagram_username) && (
                    <Reveal variant="zoom" delay={400}>
                        <a
                            href={`https://instagram.com/${(m.instagram || m.instagram_username).replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aj-profile-instagram"
                        >
                            <i className="fab fa-instagram" /> @{(m.instagram || m.instagram_username).replace('@', '')}
                        </a>
                    </Reveal>
                )}
            </div>
        );
    };

    const isSingleHost = themeConfig?.isSingleHost;
    const coupleTitle = themeConfig?.labels?.coupleTitle || 'MEMPELAI';
    const coupleSubtitle = themeConfig?.labels?.coupleSubtitle || 'Profil';

    return (
        <section id={id || "couple"} className="aj-section">
            <Reveal>
                <h4 className="aj-section-subtitle">{coupleSubtitle}</h4>
                <h2 className="aj-section-title">{coupleTitle}</h2>
            </Reveal>

            {isSingleHost ? (
                renderMempelai(couples[0] || {}, 'host')
            ) : (
                <div className="aj-couples-grid">
                    {renderMempelai(groom, 'groom')}
                    {groom.full_name && bride.full_name && (
                        <div className="aj-couple-ampersand">&amp;</div>
                    )}
                    {renderMempelai(bride, 'bride')}
                </div>
            )}

            <JavaneseSwirlDivider />
        </section>
    );
}

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

// 4. Countdown Hook
function useCountdown(targetDate, targetTime = '') {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        if (!targetDate) return;
        const tick = () => {
            const target = parseSafeDate(targetDate, targetTime);
            if (!target) return;
            const diff = target.getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate, targetTime]);
    return timeLeft;
}

// 5. Event Section & Countdown
function EventSection({ events, invitation, sections, language, themeConfig }) {
    // Gunakan event_date dari primary event sebagai sumber countdown utama
    // fallback ke countdown_target_date jika tidak ada primary event
    const listEvents = safeArr(events);
    const primaryEvent = listEvents.find(e => e.is_primary) || listEvents[0];
    const countdownTargetDate = primaryEvent?.event_date || invitation?.countdown_target_date || '';
    const countdownTargetTime = primaryEvent?.start_time || '08:00';
    const countdown = useCountdown(countdownTargetDate, countdownTargetTime);

    const eventTitle = themeConfig?.labels?.eventTitle || 'SAVE THE DATE';
    const eventSubtitle = themeConfig?.labels?.eventSubtitle || 'Agenda Acara';

    const showCountdown = parseBool(invitation?.show_countdown, true);
    const showCountdownInEvent = useMemo(() => {
        const primaryEvent = listEvents.find(e => e.is_primary) || listEvents[0];
        if (!primaryEvent?.event_date || !showCountdown) return false;
        
        const safeSections = safeArr(sections);
        if (safeSections.length > 0) {
            const cSection = safeSections.find(s => s.section_key === 'countdown');
            return cSection ? !!cSection.is_visible : false;
        }
        return true;
    }, [sections, events, showCountdown]);

    return (
        <section id="event" className="aj-section">
            <Reveal>
                <h4 className="aj-section-subtitle">{eventSubtitle}</h4>
                <h2 className="aj-section-title">{eventTitle}</h2>
            </Reveal>

            {/* Countdown widget */}
            {showCountdownInEvent && countdownTargetDate && (
                <Reveal className="aj-countdown-row" variant="zoom">
                    <div className="aj-countdown-item">
                        <span className="aj-countdown-value">{String(countdown.days).padStart(2, '0')}</span>
                        <span className="aj-countdown-label">{language === 'en' ? 'Days' : 'Hari'}</span>
                    </div>
                    <div className="aj-countdown-item">
                        <span className="aj-countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                        <span className="aj-countdown-label">{language === 'en' ? 'Hours' : 'Jam'}</span>
                    </div>
                    <div className="aj-countdown-item">
                        <span className="aj-countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                        <span className="aj-countdown-label">{language === 'en' ? 'Mins' : 'Menit'}</span>
                    </div>
                    <div className="aj-countdown-item">
                        <span className="aj-countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
                        <span className="aj-countdown-label">{language === 'en' ? 'Secs' : 'Detik'}</span>
                    </div>
                </Reveal>
            )}

            {/* Events Cards */}
            <div className="aj-events-list">
                {listEvents.map((ev, idx) => {
                    return (
                        <Reveal className="aj-event-card" variant={idx % 2 === 0 ? 'left' : 'right'} key={idx}>
                            <div className="aj-event-card-topper">
                                <JavaneseGunungan className="aj-event-card-lantern-topper" style={{ color: 'var(--aj-accent)' }} />
                            </div>
                            <div className="aj-event-card-header">
                                <div className="aj-event-name">{ev.event_name}</div>
                            </div>
                            
                            <div className="aj-event-date-box">
                                <div className="aj-event-date">{formatDate(ev.event_date, language)}</div>
                                <div className="aj-event-time">
                                    {ev.start_time} - {ev.end_time || 'Selesai'} {ev.timezone || 'WIB'}
                                </div>
                            </div>

                            <div className="aj-event-venue">{ev.venue_name}</div>
                            <p className="aj-event-address">{ev.venue_address}</p>

                            {ev.gmaps_link && (
                                <div className="aj-event-actions">
                                    <a href={ev.gmaps_link} target="_blank" rel="noopener noreferrer" className="aj-btn-secondary">
                                        <i className="fas fa-map-marker-alt" /> GOOGLE MAPS
                                    </a>
                                </div>
                            )}
                        </Reveal>
                    );
                })}

                                {/* Compact standalone Dress Code box below event list */}
                                {listEvents?.filter(ev => ev.show_dress_code).map((ev, idx) => (
                                    <div key={`dc-${idx}`} className="aj-event-card w-full mt-4" style={{ padding: '24px' }}>
                                        <DressCodeBlock event={ev} colors={{ primary: '#c49a45', text: '#2d2d2d' }} fonts={{ heading: 'inherit' }} variant="classic" plain={true} />
                                    </div>
                                ))}

                                {/* Compact standalone Dress Code box below event list */}
                                {listEvents?.filter(ev => ev.show_dress_code).map((ev, idx) => (
                                    <div key={`dc-${idx}`} className="w-full max-w-md mx-auto mt-4 px-4 pb-2">
                                    </div>
                                ))}
            </div>

            <JavaneseSwirlDivider />
        </section>
    );
}

// 5.1 Live Streaming Section
function LiveStreamingSection({ events, invitation, language, themeConfig }) {
    const eventList = safeArr(events);
    const primaryEvent = eventList.find(e => e.is_primary) || eventList[0];
    
    const streamsList = [];
    if (primaryEvent?.streaming_url) {
        streamsList.push({ platform: primaryEvent.streaming_platform || 'Live', url: primaryEvent.streaming_url });
    }
    if (Array.isArray(primaryEvent?.streamings)) {
        primaryEvent.streamings.forEach(s => {
            if (s.url && !streamsList.some(item => item.url === s.url)) {
                streamsList.push({ platform: s.platform || 'Live', url: s.url });
            }
        });
    }
    
    if (streamsList.length === 0) return null;
    
    const isEn = language === 'en';
    const streamTitle = themeConfig?.labels?.streamTitle || (isEn ? 'Virtual Celebration' : 'Siaran Langsung');
    const streamSubtitle = themeConfig?.labels?.streamSubtitle || 'Live Streaming';
    const streamDesc = themeConfig?.labels?.streamDesc || (isEn 
        ? 'We will broadcast the happy moments virtually through the following platforms.'
        : 'Kami mengundang Anda untuk menyaksikan momen bahagia secara virtual melalui platform berikut.');
    
    return (
        <section id="livestream" className="aj-section aj-livestream-section">
            <Reveal>
                <h4 className="aj-section-subtitle">{streamSubtitle}</h4>
                <h2 className="aj-section-title">{streamTitle}</h2>
            </Reveal>

            <Reveal className="aj-moroccan-arch-container">
                {/* Decorative Javanese Gunungan on top of the arch container */}
                <div className="aj-arch-topper">
                    <JavaneseGunungan className="aj-arch-topper-lantern" style={{ width: '40px', height: 'auto', color: 'var(--aj-accent)' }} />
                </div>
                <div className="aj-arch-inner-content">
                    <h3 className="aj-livestream-date">
                        {formatDate(primaryEvent?.event_date, language)}
                    </h3>
                    <p className="aj-livestream-time">
                        {primaryEvent?.start_time} - {primaryEvent?.end_time === '23:59:00' ? 'Selesai' : primaryEvent?.end_time} {primaryEvent?.timezone || 'WIB'}
                    </p>
                    <p className="aj-livestream-text">
                        {streamDesc}
                    </p>
                    <div className="aj-livestream-buttons">
                        {streamsList.map((stream, idx) => (
                            <a 
                                key={idx}
                                href={stream.url}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="aj-btn-primary"
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '240px', gap: '8px', margin: '6px auto' }}
                            >
                                <i className="fas fa-video" /> JOIN {stream.platform.toUpperCase()}
                            </a>
                        ))}
                    </div>
                </div>
            </Reveal>

            <JavaneseSwirlDivider />
        </section>
    );
}

// 6. Story / Timeline Card
function TimelineCard({ story, language }) {
    const ref = useRef(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsActive(entry.isIntersecting);
        }, {
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`aj-timeline-card ${isActive ? 'is-active' : ''}`}>
            <div className="aj-timeline-dot flex items-center justify-center">
                <JavaneseGunungan className="aj-timeline-lantern-icon" style={{ width: '18px', height: 'auto' }} />
            </div>
            {story.story_date && (
                <div className="aj-timeline-date">{formatDate(story.story_date, language)}</div>
            )}
            <h3 className="aj-timeline-title">{story.title}</h3>
            {story.description && (
                <p className="aj-timeline-desc">{story.description}</p>
            )}
        </div>
    );
}

// 6.1 Love Story / Kisah Cinta Section
function LoveStorySection({ loveStories, language, themeConfig }) {
    const listStories = safeArr(loveStories).sort((a, b) => a.sort_order - b.sort_order);
    if (listStories.length === 0) return null;

    const storyTitle = themeConfig?.labels?.storyTitle || 'KISAH CINTA';
    const storySubtitle = themeConfig?.labels?.storySubtitle || 'Our Journey';

    return (
        <section id="love_story" className="aj-section">
            <Reveal>
                <h4 className="aj-section-subtitle">{storySubtitle}</h4>
                <h2 className="aj-section-title">{storyTitle}</h2>
            </Reveal>

            <div className="aj-timeline">
                <div className="aj-timeline-line" />
                {listStories.map((story, idx) => (
                    <TimelineCard story={story} language={language} key={idx} />
                ))}
            </div>

            <JavaneseSwirlDivider />
        </section>
    );
}

// 7. Gallery Section
function GallerySection({ galleries, language }) {
    const listGalleries = safeArr(galleries).sort((a, b) => a.sort_order - b.sort_order);
    if (listGalleries.length === 0) return null;

    const [lightbox, setLightbox] = useState({ open: false, index: 0 });

    const openLightbox = (idx) => {
        setLightbox({ open: true, index: idx });
    };
    const closeLightbox = () => {
        setLightbox(prev => ({ ...prev, open: false }));
    };
    const nextImage = (e) => {
        e.stopPropagation();
        setLightbox(prev => ({ ...prev, index: (prev.index + 1) % listGalleries.length }));
    };
    const prevImage = (e) => {
        e.stopPropagation();
        setLightbox(prev => ({ ...prev, index: (prev.index - 1 + listGalleries.length) % listGalleries.length }));
    };

    return (
        <section id="gallery" className="aj-section">
            <Reveal>
                <h4 className="aj-section-subtitle">Momen Bahagia</h4>
                <h2 className="aj-section-title">{language === 'en' ? 'GALLERY' : 'GALERI FOTO'}</h2>
            </Reveal>

            <div className="aj-gallery-grid">
                {listGalleries.map((g, idx) => {
                    const finalImg = getThemeAssetUrl(g.image_url, '');
                    return (
                        <Reveal className="aj-gallery-item" variant="zoom" delay={idx * 100} key={idx}>
                            <div className="aj-gallery-frame" onClick={() => openLightbox(idx)}>
                                <img src={finalImg} className="aj-gallery-photo" alt={g.caption || 'Galeri'} />
                                <div className="aj-gallery-hover-overlay">
                                    <i className="fas fa-search-plus" />
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>

            {/* Lightbox Modal */}
            {lightbox.open && (
                <div className="aj-lightbox" onClick={closeLightbox}>
                    <button type="button" className="aj-lightbox-close" onClick={closeLightbox}>&times;</button>
                    <button type="button" className="aj-lightbox-arrow aj-lightbox-arrow--left" onClick={prevImage}>
                        <i className="fas fa-chevron-left" />
                    </button>
                    
                    <div className="aj-lightbox-content" onClick={e => e.stopPropagation()}>
                        <img 
                            src={getThemeAssetUrl(listGalleries[lightbox.index]?.image_url, '')} 
                            className="aj-lightbox-img" 
                            alt="Lightbox" 
                        />
                        {listGalleries[lightbox.index]?.caption && (
                            <p className="aj-lightbox-caption">{listGalleries[lightbox.index].caption}</p>
                        )}
                    </div>

                    <button type="button" className="aj-lightbox-arrow aj-lightbox-arrow--right" onClick={nextImage}>
                        <i className="fas fa-chevron-right" />
                    </button>
                </div>
            )}

            <JavaneseSwirlDivider />
        </section>
    );
}

// 8. E-Wallet / Amplop Digital Section
function BankSection({ bankAccounts, language }) {
    const listAccounts = safeArr(bankAccounts);
    if (listAccounts.length === 0) return null;

    const [copiedIdx, setCopiedIdx] = useState(null);

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

    const handleCopy = (text, idx) => {
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

    return (
        <section id="bank" className="aj-section">
            <Reveal>
                <h4 className="aj-section-subtitle">Kirim Kado</h4>
                <h2 className="aj-section-title">{language === 'en' ? 'DIGITAL ENVELOPE' : 'AMPLOP DIGITAL'}</h2>
            </Reveal>

            <Reveal className="aj-bank-desc-wrap">
                <p className="aj-bank-desc">
                    {language === 'en' 
                        ? 'Your presence and blessings are the greatest gift for us. However, if you wish to send a token of love digitally, you may do so through:'
                        : 'Doa restu Anda merupakan karunia terindah bagi kami. Namun, apabila Anda ingin mengirimkan tanda kasih secara cashless, silakan melalui rekening berikut:'}
                </p>
            </Reveal>

            <div className="aj-bank-cards-list">
                {listAccounts.map((acc, idx) => {
                    const bankName = String(acc.bank_name).toUpperCase();
                    let isBca = bankName.includes('BCA') || bankName.includes('CENTRAL ASIA');
                    let isDana = bankName.includes('DANA');

                    return (
                        <Reveal className="aj-credit-card" variant="zoom" delay={idx * 150} key={idx}>
                            <div className="aj-card-inner">
                                <div className="aj-card-shine" />
                                <div className="aj-card-header">
                                    <span className="aj-card-label">Digital Envelope</span>
                                    {isBca && <img src={ASSETS.bca} className="aj-card-bank-logo" alt="BCA" />}
                                    {isDana && <img src={ASSETS.dana} className="aj-card-bank-logo aj-card-bank-logo--dana" alt="DANA" />}
                                    {!isBca && !isDana && <span className="aj-card-bank-name">{acc.bank_name}</span>}
                                </div>

                                <div className="aj-card-chip-row">
                                    <img src={ASSETS.chip} className="aj-card-chip" alt="ATM Chip" />
                                    <JavaneseGunungan className="aj-card-lantern-monogram-decor" style={{ width: '30px', height: 'auto', color: 'var(--aj-accent)' }} />
                                </div>

                                <div className="aj-card-number">{acc.account_number}</div>

                                <div className="aj-card-footer">
                                    <div className="aj-card-holder">
                                        <span className="aj-holder-label">{language === 'en' ? 'ON BEHALF OF' : 'ATAS NAMA'}</span>
                                        <span className="aj-holder-name">{acc.account_name}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleCopy(acc.account_number, idx)}
                                        className="aj-card-btn-copy"
                                    >
                                        {copiedIdx === idx ? (
                                            <>
                                                <i className="fas fa-check" /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-copy" /> Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>

            <JavaneseSwirlDivider />
        </section>
    );
}

// 9. Unified RSVP & Wishes Section
function UnifiedRsvpWishes({ invitation, wishes, guest, language, enableRsvp, enableWishes }) {
    const wishesInputRef = React.useRef(null);
    const isEn = language === 'en';
    const activeGuest = guest || { name: '', id: null };
    const guestName = activeGuest.name || new URLSearchParams(window.location.search).get('to') || '';

    const [sharedName, setSharedName] = useState(guestName || '');
    const [attendance, setAttendance] = useState('hadir');
    const [numGuests, setNumGuests] = useState(1);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const rsvpPayload = {
            sender_name: sharedName,
            attendance: attendance,
            number_of_guests: numGuests,
            guest_id: activeGuest.id || null,
        };

        const wishPayload = {
            sender_name: sharedName,
            message: message,
            guest_id: activeGuest.id || null,
        };

        const submitWish = () => {
            if (enableWishes && message.trim()) {
                router.post(route('invitation.wish', invitation.slug), wishPayload, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setMessage('');
                        setSuccess(true);
                        setIsSubmitting(false);
                        setTimeout(() => setSuccess(false), 5000);
                    },
                    onError: () => setIsSubmitting(false)
                });
            } else {
                setSuccess(true);
                setIsSubmitting(false);
                setTimeout(() => setSuccess(false), 5000);
            }
        };

        if (enableRsvp) {
            router.post(route('invitation.rsvp', invitation.slug), rsvpPayload, {
                preserveScroll: true,
                onSuccess: submitWish,
                onError: () => setIsSubmitting(false)
            });
        } else {
            submitWish();
        }
    };

    const wishList = safeArr(wishes);
    const recentWishes = wishList.slice(0, 5);

    const sectionTitle = enableRsvp && enableWishes
        ? (isEn ? 'RSVP & WISHES' : 'KEHADIRAN & UCAPAN')
        : enableRsvp
            ? (isEn ? 'RSVP' : 'KEHADIRAN')
            : (isEn ? 'WISHES' : 'KIRIM UCAPAN');

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id="rsvp" className="aj-section">
            <Reveal>
                <h4 className="aj-section-subtitle">{isEn ? 'Confirmation' : 'Konfirmasi Kehadiran'}</h4>
                <h2 className="aj-section-title">{sectionTitle}</h2>
            </Reveal>

            <Reveal className="aj-rsvp-box-container">
                <div className="aj-rsvp-box-topper">
                    <JavaneseGunungan className="aj-rsvp-box-lantern-topper" style={{ color: 'var(--aj-accent)' }} />
                </div>
                <form onSubmit={handleSubmit} className="aj-rsvp-form">
                    {/* Name Input */}
                    <div className="aj-form-group">
                        <label className="aj-form-label" htmlFor="rsvp_name">{isEn ? 'Your Name' : 'Nama Lengkap'}</label>
                        <input
                            type="text"
                            id="rsvp_name"
                            value={sharedName}
                            onChange={e => setSharedName(e.target.value)}
                            readOnly={!!activeGuest.name && activeGuest.name !== 'Tamu Undangan'}
                            placeholder={isEn ? 'Your Name' : 'Nama Lengkap'}
                            className="aj-form-input"
                            required
                        />
                    </div>

                    {/* Attendance selection */}
                    {enableRsvp && (
                        <div className="aj-form-group">
                            <label className="aj-form-label">{isEn ? 'Attendance status' : 'Konfirmasi Kehadiran'}</label>
                            <div className="aj-rsvp-buttons-row">
                                {['hadir', 'tidak_hadir', 'belum_pasti'].map(opt => {
                                    const active = attendance === opt;
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setAttendance(opt)}
                                            className={`aj-rsvp-btn-option ${active ? 'is-active' : ''}`}
                                        >
                                            {opt === 'hadir' && (isEn ? 'Attend' : 'Hadir')}
                                            {opt === 'tidak_hadir' && (isEn ? 'Absent' : 'Absen')}
                                            {opt === 'belum_pasti' && (isEn ? 'Uncertain' : 'Ragu')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Number of guests */}
                    {enableRsvp && attendance === 'hadir' && (
                        <Reveal className="aj-form-group" variant="down">
                            <label className="aj-form-label" htmlFor="number_of_guests">
                                {isEn ? 'Number of guests' : 'Jumlah Orang'}
                            </label>
                            <select
                                id="number_of_guests"
                                value={numGuests}
                                onChange={e => setNumGuests(parseInt(e.target.value) || 1)}
                                className="aj-form-input"
                            >
                                {[1, 2, 3, 4, 5].map(n => (
                                    <option key={n} value={n}>{n} {isEn ? 'Person' : 'Orang'}</option>
                                ))}
                            </select>
                        </Reveal>
                    )}

                    {/* Wishes text */}
                    {enableWishes && (
                        <div className="aj-form-group">
                            <label className="aj-form-label" htmlFor="wish_message">{isEn ? 'Wishes & Prayers' : 'Pesan / Ucapan'}</label>
                            <WishesEmojiPicker
                                    value={message}
                                    onChange={setMessage}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                    ref={wishesInputRef}
                                id="wish_message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={isEn ? 'Write your warm wishes...' : 'Tulis ucapan selamat dan doa restu Anda di sini...'}
                                className="aj-form-input aj-form-input--textarea"
                                rows={4}
                                required={!enableRsvp}
                            />
                                </WishesEmojiPicker>
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="aj-btn-primary aj-btn-full">
                        {isSubmitting ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Send' : 'Kirim')}
                    </button>

                    {success && (
                        <p style={{ color: 'var(--aj-accent)', marginTop: '8px', fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                            ✓ {isEn ? 'Successfully sent!' : 'Berhasil dikirim!'}
                        </p>
                    )}
                </form>
            </Reveal>

            {/* Wishes scrollable feed */}
            {enableWishes && recentWishes.length > 0 && (
                <div className="aj-wishes-list-container" style={{ marginTop: '24px' }}>
                    {recentWishes.map((w, idx) => (
                        <Reveal className="aj-wish-bubble" variant="up" delay={idx * 50} key={idx}>
                            <div className="aj-wish-header">
                                <span className="aj-wish-sender">{w.sender_name || w.name}</span>
                                {w.attendance && (
                                    <span style={{ fontSize: '10px', color: 'var(--aj-primary)', border: '1px solid var(--aj-primary)', padding: '2px 8px', borderRadius: '12px' }}>
                                        {w.attendance === 'hadir' ? (isEn ? 'Attending' : 'Hadir') : (isEn ? 'Absent' : 'Tidak Hadir')}
                                    </span>
                                )}
                            </div>
                            <p className="aj-wish-message">{w.message}</p>
                        </Reveal>
                    ))}
                </div>
            )}

            <JavaneseSwirlDivider />
        </section>
    );
}

// 11. Closing / Penutup Section
function ClosingSection({ invitation, brideGrooms, language, themeConfig }) {
    const coupleName = themeConfig?.coupleName || 'Bimo & Raras';
    const isEn = language === 'en';

    const couples = safeArr(brideGrooms);
    const isSingleHost = themeConfig?.isSingleHost;
    
    let hasGroomParents = false;
    let hasBrideParents = false;
    let groomFather = '', groomMother = '', brideFather = '', brideMother = '';

    if (isSingleHost) {
        const celebrant = couples[0] || {};
        groomFather = celebrant.father_name || '';
        groomMother = celebrant.mother_name || '';
        hasGroomParents = !!(groomFather || groomMother);
    } else {
        const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
        const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};
        
        groomFather = groom.father_name || '';
        groomMother = groom.mother_name || '';
        brideFather = bride.father_name || '';
        brideMother = bride.mother_name || '';
        
        hasGroomParents = !!(groomFather || groomMother);
        hasBrideParents = !!(brideFather || brideMother);
    }

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'Undangan Digital Groovy';

    return (
        <section id="closing" className="aj-section aj-closing-section">
            {/* Top decorative Gunungan */}
            <div className="aj-closing-lantern-top">
                <JavaneseGunungan className="aj-closing-lantern-img mx-auto" style={{ width: '100px', height: 'auto', color: 'var(--aj-primary)' }} />
            </div>

            <div className="aj-closing-body">
                <Reveal className="aj-closing-text-block">
                    <h2 className="aj-closing-title">{invitation?.closing_title || 'THANK YOU'}</h2>
                    <p className="aj-closing-text">
                        {themeConfig?.labels?.closingQuote}
                    </p>
                </Reveal>

                <Reveal delay={200} className="aj-closing-signature">
                    <p className="aj-signature-label">{themeConfig?.labels?.signatureTitle || 'Kami yang berbahagia,'}</p>
                    <h3 className="aj-signature-couple">{coupleName}</h3>
                    
                    <div className="aj-signature-parents" style={{ fontSize: '12px', color: 'var(--aj-text-muted)', lineHeight: '1.8', marginBottom: '20px' }}>
                        {hasGroomParents && (
                            <div>
                                {isEn
                                    ? `Family of Mr. ${groomFather || '...'} & Mrs. ${groomMother || '...'}`
                                    : `Kel. Bapak ${groomFather || '...'} & Ibu ${groomMother || '...'}`
                                }
                            </div>
                        )}
                        {hasBrideParents && (
                            <div>
                                {isEn
                                    ? `Family of Mr. ${brideFather || '...'} & Mrs. ${brideMother || '...'}`
                                    : `Kel. Bapak ${brideFather || '...'} & Ibu ${brideMother || '...'}`
                                }
                            </div>
                        )}
                    </div>

                    {invitation?.turut_mengundang_text && (
                        <div className="aj-signature-turut">
                            <span className="aj-turut-label">{themeConfig?.labels?.signatureFamilies || 'Keluarga Besar:'}</span>
                            <p className="aj-turut-text" style={{ whiteSpace: 'pre-line' }}>{invitation.turut_mengundang_text}</p>
                        </div>
                    )}
                </Reveal>
            </div>

            <Reveal className="aj-closing-watermark">
                <p>Made with ❤️ by {brandName}</p>
            </Reveal>

            <div className="aj-closing-lantern-decor">
                <JavaneseGunungan className="aj-decor-lantern-bottom mx-auto" style={{ width: '100px', height: 'auto', color: 'var(--aj-primary)' }} />
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   PREMIUM NAVIGATION MENU (Bottom Dock & Float ala Luxury 2)
   ═══════════════════════════════════════ */
function NavigationMenu({
    invitation,
    guest,
    isOpened,
    isPlaying,
    onToggleMusic,
    scrollToSection,
    activeMenuId,
    resolvedSections,
    enableRsvp,
    enableWishes,
    autoScrollEnabled,
    setAutoScrollEnabled,
    isFullscreen,
    toggleFullscreen,
    setShowQr
}) {
    const { t } = useTranslation(invitation?.language || 'id');
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    // Auto scroll current active menu into center on narrow viewports
    useEffect(() => {
        if (!activeMenuId) return;
        const activeEl = document.querySelector(`.aj-nav-menu button[data-id="${activeMenuId}"]`);
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeMenuId]);

    const menuItems = useMemo(() => {
        const items = [];
        const validKeys = resolvedSections.map(s => s.section_key);

        resolvedSections.forEach(s => {
            const key = s.section_key;
            if (key === 'cover') return;

            if (key === 'opening') {
                items.push({ id: 'opening', label: t('nav.opening'), icon: 'fas fa-home' });
            } else if (key === 'bride_groom') {
                items.push({ id: 'bride_groom', label: t('nav.mempelai'), icon: 'fas fa-heart' });
            } else if (key === 'love_story') {
                items.push({ id: 'love_story', label: t('nav.kisah'), icon: 'fas fa-book' });
            } else if (key === 'event') {
                items.push({ id: 'event', label: t('nav.acara'), icon: 'far fa-calendar-alt' });
            } else if (key === 'livestream') {
                items.push({ id: 'livestream', label: 'Live', icon: 'fas fa-video' });
            } else if (key === 'gallery') {
                items.push({ id: 'gallery', label: t('nav.galeri'), icon: 'far fa-image' });
            } else if (key === 'rsvp') {
                const hasWishes = validKeys.includes('wishes') || enableWishes;
                items.push({ id: 'rsvp', label: hasWishes ? t('nav.rsvp') : t('nav.rsvp'), icon: 'fas fa-envelope' });
            } else if (key === 'wishes') {
                const hasRsvp = validKeys.includes('rsvp') || enableRsvp;
                if (!hasRsvp) {
                    items.push({ id: 'wishes', label: t('invitation.wishes_title'), icon: 'fas fa-envelope' });
                }
            } else if (key === 'bank') {
                items.push({ id: 'bank', label: t('nav.hadiah'), icon: 'fas fa-gift' });
            } else if (key === 'closing') {
                items.push({ id: 'closing', label: t('nav.penutup'), icon: 'fas fa-flag' });
            }
        });

        return items;
    }, [resolvedSections, enableRsvp, enableWishes, t]);

    if (!isOpened) return null;

    return (
        <>
            {/* Dock Menu Bawah */}
            <div className="aj-nav-menu">
                <div className="aj-nav-menu__inner--row">
                    {menuItems.map((item) => {
                        const isActive = activeMenuId === item.id;
                        return (
                            <button
                                key={item.id}
                                data-id={item.id}
                                type="button"
                                onClick={() => scrollToSection(item.id, resolvedSections.findIndex(s => s.section_key === item.id))}
                                className={`aj-nav-menu__item ${isActive ? 'active' : ''}`}
                                title={item.label}
                            >
                                <i className={item.icon} />
                                <span className="aj-nav-item-text">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Floating Controls area on the bottom right */}
            <div className="aj-floating-btns">
                {enableQr && guest && (
                    <button
                        type="button"
                        className="aj-floating-btn"
                        onClick={() => setShowQr(true)}
                        title="QR Code Check-in"
                    >
                        <i className="fas fa-qrcode" />
                    </button>
                )}

                <button
                    type="button"
                    className="aj-floating-btn"
                    onClick={toggleFullscreen}
                    style={isFullscreen ? { backgroundColor: 'var(--aj-accent, #E9C46A)', color: 'var(--aj-bg)', boxShadow: '0 0 12px var(--aj-accent)' } : {}}
                    title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                >
                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                </button>

                {invitation?.enable_auto_scroll !== false && (
                    <button
                        type="button"
                        className="aj-floating-btn"
                        onClick={() => setAutoScrollEnabled(prev => !prev)}
                        style={autoScrollEnabled ? { backgroundColor: 'var(--aj-accent, #E9C46A)', color: 'var(--aj-bg)', boxShadow: '0 0 12px var(--aj-accent)' } : {}}
                        title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                    >
                        <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-play"} />
                    </button>
                )}

                <button
                    type="button"
                    className="aj-floating-btn"
                    onClick={onToggleMusic}
                    title="Musik Latar"
                >
                    {isPlaying ? (
                        <div className="global-music-waves">
                            <span />
                            <span />
                            <span />
                        </div>
                    ) : (
                        <i className="fas fa-volume-mute" />
                    )}
                </button>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════
   MAIN CONTAINER COMPONENT
   ═══════════════════════════════════════ */
export default function DynamicIndex({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest, isDemo = false }) {
    const lang = invitation?.language || 'id';
    const { t } = useTranslation(lang);
    const layoutMode = invitation?.layout_mode || 'scroll'; // 'scroll', 'slide', 'tab'
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide' || layoutMode === 'tab';

    // Config flags
    globalShowPhotos = parseBool(invitation?.show_photos, true);
    globalShowAnimations = parseBool(invitation?.show_animations, true);

    const [isOpened, setIsOpened] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeNav, setActiveNav] = useState('opening');
    const [showQr, setShowQr] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(invitation?.enable_auto_scroll !== false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, audioPlaying, setAudioPlaying);
    const containerRef = useRef(null);

    const enableRsvp = parseBool(invitation?.enable_rsvp, true);
    const enableWishes = parseBool(invitation?.enable_wishes, true);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    // Resolve labels dynamically
    const themeConfig = useMemo(() => {
        return getThemeLabels(invitation?.event_type, lang, brideGrooms, invitation);
    }, [invitation?.event_type, lang, brideGrooms, invitation]);

    // Filter and resolve sections strictly
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;

        const resolved = [];

        if (safeSections.length > 0) {
            const dbSorted = safeSections
                .filter(s => s.is_visible && validKeys.includes(s.section_key))
                .sort((a, b) => a.sort_order - b.sort_order);

            dbSorted.forEach(s => {
                if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return;
                if (s.section_key === 'gallery' && (!globalShowPhotos || !(galleries?.length > 0))) return;
                if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
                if (s.section_key === 'rsvp' && !enableRsvp) return;
                if (s.section_key === 'countdown') return; // integrated in event
                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return; // Skip wishes slide (integrated in RSVP)
                }
                if (s.section_key === 'livestream' && !hasStream) return;

                resolved.push(s);
            });
        } else {
            // Default fallback
            resolved.push({ section_key: 'opening' });
            resolved.push({ section_key: 'bride_groom' });
            resolved.push({ section_key: 'event' });
            if (hasStream) resolved.push({ section_key: 'livestream' });
            if (enableRsvp) resolved.push({ section_key: 'rsvp' });
            else if (enableWishes) resolved.push({ section_key: 'wishes' });
            resolved.push({ section_key: 'closing' });
        }
        return resolved;
    }, [sections, events, loveStories, galleries, bankAccounts, enableRsvp, enableWishes]);

    const activeSectionsWithoutCover = resolvedSections;

    // Handle open invitation
    const handleOpen = () => {
        setIsOpened(true);
        if (invitation?.music_url && audioRef.current) {
            audioRef.current.play()
                .then(() => setAudioPlaying(true))
                .catch(() => {});
        }
        // Auto fullscreen trigger
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (audioPlaying) {
            audioRef.current.pause();
            setAudioPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setAudioPlaying(true))
                .catch(() => {});
        }
    };

    // Fullscreen control
    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    // Slide navigation
    const goNext = useCallback(() => {
        setActiveSlideIdx(prev => Math.min(prev + 1, activeSectionsWithoutCover.length - 1));
    }, [activeSectionsWithoutCover.length]);

    const goPrev = useCallback(() => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    }, []);

    // Sync activeNav with activeSlideIdx in Slide Mode
    useEffect(() => {
        if (isSlideMode && activeSectionsWithoutCover[activeSlideIdx]) {
            let key = activeSectionsWithoutCover[activeSlideIdx].section_key;
            if (key === 'wishes' && enableRsvp) {
                key = 'rsvp';
            }
            setActiveNav(key);
        }
    }, [isSlideMode, activeSlideIdx, activeSectionsWithoutCover, enableRsvp]);

    // Touch & swipe gestures mapping
    const touchStart = useRef({ x: 0, y: 0, time: 0, atTop: false, atBottom: false });
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);

    const handlePointerDown = (clientX, clientY, target) => {
        isDragging.current = true;
        let atTop = false;
        let atBottom = false;

        if (target && typeof target.closest === 'function') {
            const scrollable = target.closest('.aj-slide-container');
            if (scrollable) {
                atTop = scrollable.scrollTop <= 5;
                atBottom = scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop <= 5;
            }
        }

        touchStart.current = { x: clientX, y: clientY, time: Date.now(), atTop, atBottom };
    };

    const handlePointerUp = (clientX, clientY, target) => {
        if (!isSlideMode || !isDragging.current) return;
        isDragging.current = false;

        const diffX = clientX - touchStart.current.x;
        const diffY = clientY - touchStart.current.y;
        const timeDiff = Date.now() - touchStart.current.time;
        const threshold = 50;
        const isFastSwipe = timeDiff < 300 && (Math.abs(diffX) > 30 || Math.abs(diffY) > 30);

        if (layoutMode === 'slide-h') {
            if ((Math.abs(diffX) > Math.abs(diffY)) && (Math.abs(diffX) > threshold || isFastSwipe)) {
                if (diffX < 0) goNext();
                else goPrev();
            }
        } else {
            // slide-v or legacy slide
            if ((Math.abs(diffY) > Math.abs(diffX)) && (Math.abs(diffY) > threshold || isFastSwipe)) {
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.aj-slide-container') : null;
                if (scrollable) {
                    const isAtTop = touchStart.current.atTop;
                    const isAtBottom = touchStart.current.atBottom;

                    if (diffY < 0 && isAtBottom) goNext();
                    else if (diffY > 0 && isAtTop) goPrev();
                } else {
                    if (diffY < 0) goNext();
                    else goPrev();
                }
            }
        }
    };

    const handleTouchStart = (e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
    const handleTouchEnd = (e) => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.target);
    const handleMouseDown = (e) => handlePointerDown(e.clientX, e.clientY, e.target);
    const handleMouseUp = (e) => handlePointerUp(e.clientX, e.clientY, e.target);
    const handleMouseLeave = () => { isDragging.current = false; };

    const handleWheel = (e) => {
        if (!isSlideMode) return;
        if (scrollTimeout.current) return;

        const target = e.target.closest('.aj-slide-container');
        if (target && target.scrollHeight > target.clientHeight) {
            const isAtTop = target.scrollTop <= 2;
            const isAtBottom = target.scrollHeight - target.clientHeight - target.scrollTop <= 2;

            if (e.deltaY > 0 && !isAtBottom) return;
            if (e.deltaY < 0 && !isAtTop) return;
        }

        scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
        }, 800);

        if (e.deltaY > 0) goNext();
        else goPrev();
    };

    // Scroll trigger menu active status (Scroll Mode)
    useEffect(() => {
        if (!isOpened || isSlideMode) return;
        const handleScroll = () => {
            const secs = document.querySelectorAll('[data-section]');
            let current = activeSectionsWithoutCover[0]?.section_key || 'opening';
            secs.forEach(sec => {
                if (sec.getBoundingClientRect().top <= 180) {
                    current = sec.dataset.section;
                }
            });
            setActiveNav(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, activeSectionsWithoutCover]);

    // Auto-scroll loop (supporting Auto-Scroll Piksel Terpadu in Slide mode)
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;
        let timer = null;
        let slideWaitMs = 0;

        if (isSlideMode) {
            timer = setInterval(() => {
                const activeEl = containerRef.current?.querySelector('.aj-slide-container.is-active');
                if (activeEl) {
                    const isScrollable = activeEl.scrollHeight > activeEl.clientHeight;
                    const isAtBottom = isScrollable ? (activeEl.scrollHeight - activeEl.clientHeight - activeEl.scrollTop <= 3) : true;
                    
                    if (isScrollable && !isAtBottom) {
                        activeEl.scrollTop += 1;
                        slideWaitMs = 0;
                    } else {
                        slideWaitMs += 30;
                        if (slideWaitMs >= 4000) {
                            slideWaitMs = 0;
                            setActiveSlideIdx(prev => {
                                const count = activeSectionsWithoutCover.length;
                                return prev >= count - 1 ? 0 : prev + 1;
                            });
                        }
                    }
                } else {
                    slideWaitMs += 30;
                    if (slideWaitMs >= 4000) {
                        slideWaitMs = 0;
                        setActiveSlideIdx(prev => {
                            const count = activeSectionsWithoutCover.length;
                            return prev >= count - 1 ? 0 : prev + 1;
                        });
                    }
                }
            }, 30);
        } else {
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6;
                if (isBottom) setAutoScrollEnabled(false);
            }, 30);
        }
        return () => { if (timer) clearInterval(timer); };
    }, [isOpened, autoScrollEnabled, isSlideMode, activeSectionsWithoutCover.length, activeSlideIdx]);

    // Pause auto scroll on user manual scroll/swipe
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
                e.target.closest('.aj-floating-btn') || 
                e.target.closest('.aj-nav-menu') || 
                e.target.closest('input') ||
                e.target.closest('textarea') ||
                e.target.closest('select')
            ) {
                return;
            }
            setAutoScrollEnabled(false);
        };

        window.addEventListener('wheel', handleUserInteraction, { passive: true });
        window.addEventListener('touchstart', handleUserInteraction, { passive: true });
        window.addEventListener('mousedown', handleUserInteraction, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
            window.removeEventListener('mousedown', handleUserInteraction);
        };
    }, [isOpened, autoScrollEnabled]);

    const scrollTo = useCallback((id, idx) => {
        setAutoScrollEnabled(false);
        if (!isSlideMode) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            setActiveSlideIdx(idx);
        }
    }, [isSlideMode]);

    return (
        <ErrorBoundary>
            <Head title={invitation?.title || 'Undangan Pernikahan'} />
            <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Montserrat:wght@200;300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

            {invitation?.music_url && (
                <audio ref={audioRef} src={invitation.music_url} loop />
            )}

            <div className={`aj-page ${!globalShowPhotos ? 'aj-no-photo-mode' : ''} ${!globalShowAnimations ? 'aj-no-animations' : ''}`} ref={containerRef}>
                {/* 1. Particle gold dust background */}
                {isOpened && invitation?.particle_type !== 'none' && (
                    <ParticleEffect type={invitation?.particle_type || 'gold-dust'} />
                )}

                {/* 2. Cover / Awal page */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    themeConfig={themeConfig}
                />

                {/* 3. Main content */}
                {isOpened && (
                    <div className="aj-container">
                        {/* Virtual Fixed Background (Menghentikan jitter/getaran saat auto scroll) */}
                        <div className="aj-container-bg flex items-center justify-center overflow-hidden">
                            <JavaneseGunungan className="opacity-5 pointer-events-none fixed" style={{ width: '85%', height: 'auto', maxWidth: '400px', top: '15%', transform: 'translateY(-10%)' }} />
                        </div>
                        
                        {/* Section wrappers - unified layout modes */}
                        <div 
                            className={`${isSlideMode ? 'aj-main-slide' : 'aj-scroll-container'} ${layoutMode === 'slide-h' ? 'aj-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'aj-main--slide-v' : ''}`}
                            onTouchStart={isSlideMode ? handleTouchStart : undefined}
                            onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                            onMouseDown={isSlideMode ? handleMouseDown : undefined}
                            onMouseUp={isSlideMode ? handleMouseUp : undefined}
                            onMouseLeave={isSlideMode ? handleMouseLeave : undefined}
                            onWheel={isSlideMode ? handleWheel : undefined}
                        >
                            {activeSectionsWithoutCover.map((section, idx) => {
                                const key = section.section_key;
                                let slideClass = '';
                                
                                if (isSlideMode) {
                                    slideClass = 'aj-slide-container';
                                    if (idx === activeSlideIdx) slideClass += ' is-active';
                                    else if (idx > activeSlideIdx) slideClass += ' is-next';
                                    else slideClass += ' is-prev';
                                } else {
                                    slideClass = 'aj-section-outer';
                                }

                                return (
                                    <div 
                                        key={section.id || key}
                                        id={`section-${key}`}
                                        data-section={key}
                                        className={slideClass}
                                        style={undefined}
                                    >
                                        {key === 'opening' && (
                                            <OpeningSection 
                                                invitation={invitation}
                                                brideGrooms={brideGrooms}
                                                language={lang}
                                                themeConfig={themeConfig}
                                            />
                                        )}

                                        {key === 'bride_groom' && (
                                            <CoupleSection 
                                                brideGrooms={brideGrooms}
                                                language={lang}
                                                themeConfig={themeConfig}
                                            />
                                        )}

                                        {key === 'event' && (
                                            <EventSection 
                                                events={events}
                                                invitation={invitation}
                                                sections={sections}
                                                language={lang}
                                                themeConfig={themeConfig}
                                            />
                                        )}

                                        {key === 'livestream' && (
                                            <LiveStreamingSection 
                                                events={events}
                                                invitation={invitation}
                                                language={lang}
                                                themeConfig={themeConfig}
                                            />
                                        )}

                                        {key === 'love_story' && (
                                            <LoveStorySection 
                                                loveStories={loveStories}
                                                language={lang}
                                                themeConfig={themeConfig}
                                            />
                                        )}

                                        {key === 'gallery' && (
                                            <GallerySection 
                                                galleries={galleries}
                                                language={lang}
                                            />
                                        )}

                                        {key === 'bank' && (
                                            <BankSection 
                                                bankAccounts={bankAccounts}
                                                language={lang}
                                            />
                                        )}

                                        {key === 'rsvp' && (
                                            <UnifiedRsvpWishes 
                                                invitation={invitation}
                                                wishes={wishes}
                                                guest={guest}
                                                language={lang}
                                                enableRsvp={enableRsvp}
                                                enableWishes={enableWishes}
                                            />
                                        )}

                                        {key === 'wishes' && (
                                            <UnifiedRsvpWishes 
                                                invitation={invitation}
                                                wishes={wishes}
                                                guest={guest}
                                                language={lang}
                                                enableRsvp={false}
                                                enableWishes={enableWishes}
                                            />
                                        )}

                                        {key === 'closing' && (
                                            <ClosingSection 
                                                invitation={invitation}
                                                brideGrooms={brideGrooms}
                                                language={lang}
                                                themeConfig={themeConfig}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Slide Layout Navigation Arrows */}
                        {isSlideMode && (
                            <>
                                {activeSlideIdx > 0 && (
                                    <button 
                                        type="button"
                                        onClick={goPrev}
                                        className="aj-slider-arrow aj-slider-arrow--left"
                                        style={{ color: 'var(--aj-primary)' }}
                                    >
                                        <i className="fas fa-chevron-left" />
                                    </button>
                                )}
                                {activeSlideIdx < activeSectionsWithoutCover.length - 1 && (
                                    <button 
                                        type="button"
                                        onClick={goNext}
                                        className="aj-slider-arrow aj-slider-arrow--right"
                                        style={{ color: 'var(--aj-primary)' }}
                                    >
                                        <i className="fas fa-chevron-right" />
                                    </button>
                                )}
                                <div className="aj-slider-dots-row">
                                    {activeSectionsWithoutCover.map((_, i) => (
                                        <button 
                                            type="button"
                                            key={i} 
                                            onClick={() => setActiveSlideIdx(i)}
                                            className={`aj-slider-dot ${i === activeSlideIdx ? 'is-active' : ''}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* QR checkin modal */}
                        {enableQr && showQr && guest && (
                            <div className="aj-qr-modal-overlay" onClick={() => setShowQr(false)}>
                                <div className="aj-qr-modal-body" onClick={e => e.stopPropagation()}>
                                    <h3 className="aj-qr-modal-title">QR CHECK-IN</h3>
                                    <p className="aj-qr-modal-subtitle">{guest.name}</p>
                                    <div className="aj-qr-modal-canvas-wrap">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=121E2A&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                            alt="QR" 
                                            className="aj-qr-canvas" 
                                        />
                                    </div>
                                    <p className="aj-qr-modal-tip">Tunjukkan QR Code ini kepada petugas penerima tamu</p>
                                    <button type="button" className="aj-btn-primary" onClick={() => setShowQr(false)}>
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer (scroll mode only) */}
                        {!isSlideMode && (
                            <footer className="aj-footer">
                                <p>Made with ❤️ by {invitation?.user?.reseller_settings?.brand_name || invitation?.user?.reseller?.reseller_settings?.brand_name || 'Undangan Digital Groovy'}</p>
                            </footer>
                        )}

                        {/* Navigation Menu (Bottom dock + floating buttons ala Luxury 2) */}
                        <NavigationMenu
                            invitation={invitation}
                            guest={guest}
                            isOpened={isOpened}
                            isPlaying={audioPlaying}
                            onToggleMusic={toggleAudio}
                            scrollToSection={scrollTo}
                            activeMenuId={activeNav}
                            resolvedSections={activeSectionsWithoutCover}
                            enableRsvp={enableRsvp}
                            enableWishes={enableWishes}
                            autoScrollEnabled={autoScrollEnabled}
                            setAutoScrollEnabled={setAutoScrollEnabled}
                            isFullscreen={isFullscreen}
                            toggleFullscreen={toggleFullscreen}
                            setShowQr={setShowQr}
                        />

                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
