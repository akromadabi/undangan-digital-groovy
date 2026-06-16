import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';;
import DressCodeBlock from '@/Components/DressCodeBlock';
import { useForm } from '@inertiajs/react';
import './style.css';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';


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
        coverHeader: isEn ? 'Special Event' : 'Acara Spesial',
        coverFooter: isEn ? `Official Invitation of ${coupleName}` : `Undangan Resmi ${coupleName}`,
        
        chatTitle: isEn ? `Event of ${coupleName}` : `Acara ${coupleName}`,
        
        openingUserPrompt: isEn ? `Hi AI, show me the details of ${coupleName}.` : `Halo AI, tampilkan berkas detail ${coupleName}.`,
        openingAiResponse: isEn ? `Hello! I'm ViteGPT, your virtual assistant for the event of **${coupleName}** 🌟. Let's start with a beautiful visual capture:` : `Halo! Saya ViteGPT, asisten virtual untuk acara **${coupleName}** 🌟. Mari kita lihat potret kebahagiaan terlebih dahulu:`,
        openingPhotoCaption: isEn ? `Generated sandbox capture for ${coupleName}.` : `Potret sandbox hasil tangkapan visual ${coupleName}.`,
        openingCardHeader: invitation?.opening_title || (isEn ? 'GREETINGS' : 'ASSALAMU\'ALAIKUM WR. WB.'),
        openingText: invitation?.opening_text || (isEn ? `With all our hearts and joy, we invite you to be part of our historic moment.` : `Dengan segala kerendahan hati dan rasa bahagia, kami mengundang Anda untuk menjadi bagian dari momen bersejarah kami.`),
        openingParamPrompt: isEn ? `Lastly, here is the verified schedule parameter logs from the database:` : `Terakhir, berikut adalah berkas parameter jadwal yang terverifikasi di sistem:`,
        
        paramHostLabel1: isEn ? 'Host Name' : 'Nama Penyelenggara',
        paramHostLabel2: null, // Only used for wedding/anniversary
        
        brideGroomUserPrompt: isEn ? `Who is the host of this event?` : `Siapa profil penyelenggara acara ini?`,
        brideGroomAiResponse: isEn ? `Here is the detailed profile compiled from the system database:` : `Berikut adalah rincian biografi yang berhasil saya kumpulkan:`,
        
        countdownUserPrompt: isEn ? "Generate a live countdown until the event!" : "Tampilkan hitung mundur waktu acara!",
        countdownAiResponse: isEn ? `Here is the countdown timer until our special day:` : `Berikut adalah hitung mundur waktu menuju hari bahagia kami:`,
        
        loveStoryUserPrompt: isEn ? "Explain the prompt parameters of their journey." : "Bagaimana kronologi perjalanan kisahnya?",
        loveStoryAiResponse: isEn ? `Here is the timeline logs of our journey:` : `Berikut adalah catatan lini masa perjalanan kami:`,
        
        eventUserPrompt: isEn ? "When and where are the event ceremonies?" : "Kapan dan di mana agenda acara dilangsungkan?",
        eventAiResponse: isEn ? `Here are the location coordinate logs and schedules for the events:` : `Berikut adalah log koordinat lokasi dan jadwal acara yang terverifikasi:`,
        
        livestreamUserPrompt: isEn ? "Is there a virtual live stream link?" : "Apakah ada tautan siaran virtual langsung?",
        livestreamAiResponse: isEn ? `Here is the virtual broadcast streaming log:` : `Berikut adalah log siaran langsung virtual:`,
        
        galleryUserPrompt: isEn ? "Generate visual captures of the host." : "Tampilkan galeri tangkapan visual galeri foto.",
        galleryAiResponse: isEn ? `Here is the image database log for the memories:` : `Berikut adalah log basis data foto kenangan kami:`,
        
        bankUserPrompt: isEn ? "How can I send a digital gift?" : "Bagaimana cara mengirimkan amplop atau kado digital?",
        bankAiResponse: isEn ? `Here is the payment gateway log for sending digital gifts:` : `Berikut adalah log gerbang pembayaran untuk mengirimkan kado digital:`,
        
        rsvpUserPrompt: isEn ? "Open the RSVP form and list congratulatory messages." : "Buka konfirmasi kehadiran dan daftarkan ucapan selamat.",
        rsvpAiResponse: isEn ? `Here is the interactive RSVP panel:` : `Berikut adalah panel RSVP interaktif:`,
        
        wishesUserPrompt: isEn ? "Open wishes feed." : "Tampilkan dengung ucapan tamu.",
        wishesAiResponse: isEn ? `Here are the latest logs of wishes from guests:` : `Berikut adalah log ucapan terbaru dari para tamu:`,
        
        closingUserPrompt: isEn ? "Execute closing remarks." : "Tampilkan bait penutup undangan.",
        closingAiResponse: isEn ? `Here is the concluding announcement from the host and family:` : `Berikut adalah pernyataan penutup dari kami dan keluarga:`,
        
        sidebarRecents: isEn ? 'RECENTS' : 'RIWAYAT OBROLAN',
        sidebarNewChat: isEn ? 'New Chat' : 'Obrolan Baru',
        
        searchChats: isEn ? 'Search chats...' : 'Cari obrolan...',
        askFollowUp: isEn ? 'Ask follow up question...' : 'Kirim pertanyaan lanjutan...',
    };

    if (t === 'wedding') {
        labels.coverHeader = isEn ? 'Wedding of' : 'Pernikahan';
        labels.coverFooter = isEn ? `The Wedding Invitation of ${coupleName}` : `Undangan Pernikahan Resmi ${coupleName}`;
        labels.chatTitle = isEn ? `Wedding of ${coupleName}` : `Pernikahan ${coupleName}`;
        
        labels.openingUserPrompt = isEn ? `Hi AI, show me the wedding details of ${coupleName}.` : `Halo AI, tampilkan berkas detail pernikahan ${coupleName}.`;
        labels.openingAiResponse = isEn ? `Hello! I'm ViteGPT, your virtual assistant for the wedding of **${coupleName}** 🌟. I'm absolutely delighted to welcome you here! Let's start with a beautiful visual capture of the happy couple:` : `Halo! Saya ViteGPT, asisten virtual untuk pernikahan **${coupleName}** 🌟. Senang sekali bisa menyambut Anda di sini! Mari kita lihat potret kebahagiaan kedua mempelai terlebih dahulu:`;
        labels.openingPhotoCaption = isEn ? `Generated sandbox prewedding capture for ${coupleName}.` : `Potret prewedding sandbox hasil tangkapan visual ${coupleName}.`;
        labels.openingCardHeader = invitation?.opening_title || (isEn ? 'WEDDING ANNOUNCEMENT' : "ASSALAMU'ALAIKUM WR. WB.");
        labels.openingText = invitation?.opening_text || (isEn 
            ? `With all our hearts and joy, we invite you to be part of our historic moment. We apologize if there are any shortcomings in this digital invitation prompt. Your presence and blessings are the most beautiful gifts for the new chapter of our love journey.` 
            : `Dengan segala kerendahan hati dan rasa bahagia, kami mengundang Anda untuk menjadi bagian dari momen bersejarah kami. Mohon dimaafkan apabila terdapat kekurangan dalam penyusunan prompt undangan digital ini. Kehadiran dan doa restu Anda adalah berkah terindah bagi lembaran baru perjalanan cinta kami.`);
        labels.openingParamPrompt = isEn ? `Lastly, here is the verified schedule parameter logs from the database:` : `Terakhir, berikut adalah berkas parameter jadwal pernikahan yang terverifikasi di sistem:`;
        
        labels.paramHostLabel1 = isEn ? 'Mempelai Pria' : 'Mempelai Pria';
        labels.paramHostLabel2 = isEn ? 'Mempelai Wanita' : 'Mempelai Wanita';
        
        labels.brideGroomUserPrompt = isEn ? "Who are the groom and bride?" : "Siapa profil kedua mempelai?";
        labels.brideGroomAiResponse = isEn ? `Here are the detailed profiles of the bride & groom compiled from the system database:` : `Berikut adalah rincian biografi pengantin pria dan wanita yang berhasil saya kumpulkan:`;
        
        labels.countdownUserPrompt = isEn ? "Generate a live countdown until the wedding!" : "Tampilkan hitung mundur waktu acara pernikahan!";
        labels.countdownAiResponse = isEn ? `Here is the countdown timer until our happy day:` : `Berikut adalah hitung mundur waktu menuju hari bahagia kami:`;
        
        labels.loveStoryUserPrompt = isEn ? "Explain the prompt parameters of their love journey." : "Bagaimana kronologi perjalanan cinta mereka?";
        labels.loveStoryAiResponse = isEn ? `Here is the timeline logs of our love journey:` : `Berikut adalah catatan lini masa perjalanan cinta kami:`;
        
        labels.eventUserPrompt = isEn ? "When and where are the wedding ceremonies?" : "Kapan dan di mana agenda akad serta resepsi dilangsungkan?";
        labels.eventAiResponse = isEn ? `Here are the location coordinate logs and schedules for the wedding ceremonies:` : `Berikut adalah log koordinat lokasi dan jadwal acara akad serta resepsi yang terverifikasi:`;
        
        labels.livestreamUserPrompt = isEn ? "Is there a virtual live stream link?" : "Apakah ada tautan siaran virtual langsung?";
        labels.livestreamAiResponse = isEn ? `Here is the virtual broadcast streaming log for the wedding:` : `Berikut adalah log siaran langsung virtual pernikahan kami:`;
        
        labels.galleryUserPrompt = isEn ? "Generate prewedding visual captures of the couple." : "Tampilkan galeri tangkapan visual prewedding mempelai.";
        labels.galleryAiResponse = isEn ? `Here is the image database log for the prewedding gallery:` : `Berikut adalah log basis data foto prewedding kami:`;
        
        labels.bankUserPrompt = isEn ? "How can I send a digital wedding gift?" : "Bagaimana cara mengirimkan amplop atau kado digital?";
        labels.bankAiResponse = isEn ? `Here is the payment gateway log for sending digital wedding gifts:` : `Berikut adalah log gerbang pembayaran untuk mengirimkan kado pernikahan:`;
        
        labels.askFollowUp = isEn ? "Ask follow up wedding question..." : "Kirim pertanyaan lanjutan tentang pernikahan...";
        
    } else if (t === 'anniversary') {
        labels.coverHeader = isEn ? 'Anniversary of' : 'Anniversary';
        labels.coverFooter = isEn ? `The Anniversary Invitation of ${coupleName}` : `Undangan Anniversary Resmi ${coupleName}`;
        labels.chatTitle = isEn ? `Anniversary of ${coupleName}` : `Anniversary ${coupleName}`;
        
        labels.openingUserPrompt = isEn ? `Hi AI, show me the anniversary details of ${coupleName}.` : `Halo AI, tampilkan berkas detail anniversary ${coupleName}.`;
        labels.openingAiResponse = isEn ? `Hello! I'm ViteGPT, your virtual assistant for the anniversary of **${coupleName}** 🌟. Let's start with a beautiful visual capture of the happy couple:` : `Halo! Saya ViteGPT, asisten virtual untuk anniversary **${coupleName}** 🌟. Mari kita lihat potret kebahagiaan pasangan terlebih dahulu:`;
        labels.openingPhotoCaption = isEn ? `Generated sandbox capture for ${coupleName}.` : `Potret sandbox hasil tangkapan visual ${coupleName}.`;
        labels.openingCardHeader = invitation?.opening_title || (isEn ? 'ANNIVERSARY ANNOUNCEMENT' : "ASSALAMU'ALAIKUM WR. WB.");
        labels.openingText = invitation?.opening_text || (isEn 
            ? `With all our hearts and joy, we invite you to be part of our historic anniversary moment.` 
            : `Dengan segala kerendahan hati dan rasa bahagia, kami mengundang Anda untuk menjadi bagian dari momen bersejarah perayaan anniversary kami.`);
        labels.openingParamPrompt = isEn ? `Lastly, here is the verified schedule parameter logs from the database:` : `Terakhir, berikut adalah berkas parameter jadwal anniversary yang terverifikasi di sistem:`;
        
        labels.paramHostLabel1 = isEn ? 'Suami' : 'Suami';
        labels.paramHostLabel2 = isEn ? 'Istri' : 'Istri';
        
        labels.brideGroomUserPrompt = isEn ? "Who are the couple?" : "Siapa profil pasangan?";
        labels.brideGroomAiResponse = isEn ? `Here are the detailed profiles of the couple compiled from the system database:` : `Berikut adalah rincian biografi pasangan yang berhasil saya kumpulkan:`;
        
        labels.countdownUserPrompt = isEn ? "Generate a live countdown until the anniversary!" : "Tampilkan hitung mundur waktu acara anniversary!";
        labels.countdownAiResponse = isEn ? `Here is the countdown timer until our anniversary day:` : `Berikut adalah hitung mundur waktu menuju hari anniversary kami:`;
        
        labels.loveStoryUserPrompt = isEn ? "Explain the prompt parameters of their journey." : "Bagaimana kronologi perjalanan cinta mereka?";
        labels.loveStoryAiResponse = isEn ? `Here is the timeline logs of our journey:` : `Berikut adalah catatan lini masa perjalanan cinta kami:`;
        
        labels.eventUserPrompt = isEn ? "When and where are the ceremonies?" : "Kapan dan di mana agenda acara dilangsungkan?";
        labels.eventAiResponse = isEn ? `Here are the location coordinate logs and schedules for the anniversary events:` : `Berikut adalah log koordinat lokasi dan jadwal acara yang terverifikasi:`;
        
        labels.livestreamUserPrompt = isEn ? "Is there a virtual live stream link?" : "Apakah ada tautan siaran virtual langsung?";
        labels.livestreamAiResponse = isEn ? `Here is the virtual broadcast streaming log:` : `Berikut adalah log siaran langsung virtual kami:`;
        
        labels.galleryUserPrompt = isEn ? "Generate visual captures of the couple." : "Tampilkan galeri tangkapan visual pasangan.";
        labels.galleryAiResponse = isEn ? `Here is the image database log for the gallery:` : `Berikut adalah log basis data foto kenangan kami:`;
        
        labels.bankUserPrompt = isEn ? "How can I send a digital gift?" : "Bagaimana cara mengirimkan amplop atau kado digital?";
        labels.bankAiResponse = isEn ? `Here is the payment gateway log for sending digital gifts:` : `Berikut adalah log gerbang pembayaran untuk mengirimkan kado:`;
        
        labels.askFollowUp = isEn ? "Ask follow up anniversary question..." : "Kirim pertanyaan lanjutan tentang anniversary...";
        
    } else if (t === 'graduation') {
        labels.coverHeader = isEn ? 'Graduation of' : 'Wisuda';
        labels.coverFooter = isEn ? `The Graduation Invitation of ${coupleName}` : `Undangan Wisuda Resmi ${coupleName}`;
        labels.chatTitle = isEn ? `Graduation of ${coupleName}` : `Wisuda ${coupleName}`;
        
        labels.openingUserPrompt = isEn ? `Hi AI, show me the graduation details of ${coupleName}.` : `Halo AI, tampilkan berkas detail kelulusan ${coupleName}.`;
        labels.openingAiResponse = isEn ? `Hello! I'm ViteGPT, your virtual assistant for the graduation of **${coupleName}** 🎓. Let's start with a beautiful visual capture of the graduate:` : `Halo! Saya ViteGPT, asisten virtual untuk kelulusan **${coupleName}** 🎓. Mari kita lihat potret kebahagiaan wisudawan terlebih dahulu:`;
        labels.openingPhotoCaption = isEn ? `Generated sandbox capture for ${coupleName}.` : `Potret sandbox hasil tangkapan visual kelulusan ${coupleName}.`;
        labels.openingCardHeader = invitation?.opening_title || (isEn ? 'GRADUATION ANNOUNCEMENT' : "ASSALAMU'ALAIKUM WR. WB.");
        labels.openingText = invitation?.opening_text || (isEn 
            ? `With all our hearts and joy, we invite you to be part of our historic graduation moment.` 
            : `Dengan segala kerendahan hati dan rasa bahagia, kami mengundang Anda untuk menjadi bagian dari momen syukuran kelulusan kami.`);
        labels.openingParamPrompt = isEn ? `Lastly, here is the verified schedule parameter logs from the database:` : `Terakhir, berikut adalah berkas parameter jadwal kelulusan yang terverifikasi di sistem:`;
        
        labels.paramHostLabel1 = isEn ? 'Wisudawan' : 'Wisudawan/wati';
        
        labels.brideGroomUserPrompt = isEn ? "Who is the graduate?" : "Siapa profil wisudawan/wati?";
        labels.brideGroomAiResponse = isEn ? `Here is the detailed profile of the graduate compiled from the system database:` : `Berikut adalah rincian biografi wisudawan/wati yang berhasil saya kumpulkan:`;
        
        labels.countdownUserPrompt = isEn ? "Generate a live countdown until the graduation!" : "Tampilkan hitung mundur waktu acara wisuda!";
        labels.countdownAiResponse = isEn ? `Here is the countdown timer until our graduation day:` : `Berikut adalah hitung mundur waktu menuju hari syukuran kelulusan kami:`;
        
        labels.loveStoryUserPrompt = isEn ? "Explain the study journey." : "Bagaimana kronologi perjalanan studi mereka?";
        labels.loveStoryAiResponse = isEn ? `Here is the timeline logs of our academic journey:` : `Berikut adalah catatan lini masa perjalanan studi kami:`;
        
        labels.eventUserPrompt = isEn ? "When and where are the celebration ceremonies?" : "Kapan dan di mana agenda syukuran dilangsungkan?";
        labels.eventAiResponse = isEn ? `Here are the location coordinate logs and schedules for the graduation celebration:` : `Berikut adalah log koordinat lokasi dan jadwal acara syukuran yang terverifikasi:`;
        
        labels.livestreamUserPrompt = isEn ? "Is there a virtual live stream link?" : "Apakah ada tautan siaran virtual langsung?";
        labels.livestreamAiResponse = isEn ? `Here is the virtual broadcast streaming log:` : `Berikut adalah log siaran langsung virtual:`;
        
        labels.galleryUserPrompt = isEn ? "Generate visual captures of the graduate." : "Tampilkan galeri tangkapan visual wisuda.";
        labels.galleryAiResponse = isEn ? `Here is the image database log for the gallery:` : `Berikut adalah log basis data foto perjuangan kami:`;
        
        labels.bankUserPrompt = isEn ? "How can I send a digital graduation gift?" : "Bagaimana cara mengirimkan amplop atau kado digital?";
        labels.bankAiResponse = isEn ? `Here is the payment gateway log for sending digital gifts:` : `Berikut adalah log gerbang pembayaran untuk mengirimkan kado kelulusan:`;
        
        labels.askFollowUp = isEn ? "Ask follow up graduation question..." : "Kirim pertanyaan lanjutan tentang wisuda...";
        
    } else if (t === 'birthday') {
        labels.coverHeader = isEn ? 'Birthday of' : 'Ulang Tahun';
        labels.coverFooter = isEn ? `The Birthday Invitation of ${coupleName}` : `Undangan Ulang Tahun Resmi ${coupleName}`;
        labels.chatTitle = isEn ? `Birthday of ${coupleName}` : `Ulang Tahun ${coupleName}`;
        
        labels.openingUserPrompt = isEn ? `Hi AI, show me the birthday details of ${coupleName}.` : `Halo AI, tampilkan berkas detail ulang tahun ${coupleName}.`;
        labels.openingAiResponse = isEn ? `Hello! I'm ViteGPT, your virtual assistant for the birthday of **${coupleName}** 🎂. Let's start with a beautiful visual capture:` : `Halo! Saya ViteGPT, asisten virtual untuk ulang tahun **${coupleName}** 🎂. Mari kita lihat potret kebahagiaan terlebih dahulu:`;
        labels.openingPhotoCaption = isEn ? `Generated sandbox capture for ${coupleName}.` : `Potret sandbox hasil tangkapan visual ulang tahun ${coupleName}.`;
        labels.openingCardHeader = invitation?.opening_title || (isEn ? 'BIRTHDAY ANNOUNCEMENT' : "ASSALAMU'ALAIKUM WR. WB.");
        labels.openingText = invitation?.opening_text || (isEn 
            ? `With all our hearts and joy, we invite you to be part of our birthday celebration.` 
            : `Dengan segala kerendahan hati dan rasa bahagia, kami mengundang Anda untuk menjadi bagian dari momen perayaan hari ulang tahun kami.`);
        labels.openingParamPrompt = isEn ? `Lastly, here is the verified schedule parameter logs from the database:` : `Terakhir, berikut adalah berkas parameter jadwal ulang tahun yang terverifikasi di sistem:`;
        
        labels.paramHostLabel1 = isEn ? 'Celebrant' : 'Penyelenggara';
        
        labels.brideGroomUserPrompt = isEn ? "Who is celebrating?" : "Siapa yang berulang tahun?";
        labels.brideGroomAiResponse = isEn ? `Here is the detailed profile of the celebrant compiled from the system database:` : `Berikut adalah rincian biografi yang berulang tahun yang berhasil saya kumpulkan:`;
        
        labels.countdownUserPrompt = isEn ? "Generate a live countdown until the birthday!" : "Tampilkan hitung mundur waktu acara ulang tahun!";
        labels.countdownAiResponse = isEn ? `Here is the countdown timer until our birthday party:` : `Berikut adalah hitung mundur waktu menuju hari pesta ulang tahun kami:`;
        
        labels.loveStoryUserPrompt = isEn ? "Explain the milestones." : "Bagaimana kronologi perjalanan hidup?";
        labels.loveStoryAiResponse = isEn ? `Here is the timeline logs of our life milestones:` : `Berikut adalah catatan lini masa perjalanan usia kami:`;
        
        labels.eventUserPrompt = isEn ? "When and where are the celebration ceremonies?" : "Kapan dan di mana agenda pesta dilangsungkan?";
        labels.eventAiResponse = isEn ? `Here are the location coordinate logs and schedules for the birthday party:` : `Berikut adalah log koordinat lokasi dan jadwal acara pesta yang terverifikasi:`;
        
        labels.livestreamUserPrompt = isEn ? "Is there a virtual live stream link?" : "Apakah ada tautan siaran virtual langsung?";
        labels.livestreamAiResponse = isEn ? `Here is the virtual broadcast streaming log:` : `Berikut adalah log siaran langsung virtual:`;
        
        labels.galleryUserPrompt = isEn ? "Generate visual captures." : "Tampilkan galeri tangkapan visual.";
        labels.galleryAiResponse = isEn ? `Here is the image database log for the gallery:` : `Berikut adalah log basis data foto kenangan kami:`;
        
        labels.bankUserPrompt = isEn ? "How can I send a digital gift?" : "Bagaimana cara mengirimkan kado digital?";
        labels.bankAiResponse = isEn ? `Here is the payment gateway log for sending digital gifts:` : `Berikut adalah log gerbang pembayaran untuk mengirimkan kado:`;
        
        labels.askFollowUp = isEn ? "Ask follow up birthday question..." : "Kirim pertanyaan lanjutan tentang ulang tahun...";
        
    } else if (t === 'aqiqah') {
        labels.coverHeader = isEn ? 'Aqiqah of' : 'Aqiqah';
        labels.coverFooter = isEn ? `The Aqiqah Invitation of ${coupleName}` : `Undangan Aqiqah Resmi ${coupleName}`;
        labels.chatTitle = isEn ? `Aqiqah of ${coupleName}` : `Aqiqah ${coupleName}`;
        
        labels.openingUserPrompt = isEn ? `Hi AI, show me the aqiqah details of ${coupleName}.` : `Halo AI, tampilkan berkas detail aqiqah ${coupleName}.`;
        labels.openingAiResponse = isEn ? `Hello! I'm ViteGPT, your virtual assistant for the aqiqah of **${coupleName}** 👶. Let's start with a beautiful visual capture:` : `Halo! Saya ViteGPT, asisten virtual untuk aqiqah **${coupleName}** 👶. Mari kita lihat potret kebahagiaan buah hati terlebih dahulu:`;
        labels.openingPhotoCaption = isEn ? `Generated sandbox capture for ${coupleName}.` : `Potret sandbox hasil tangkapan visual aqiqah ${coupleName}.`;
        labels.openingCardHeader = invitation?.opening_title || (isEn ? 'AQIQAH ANNOUNCEMENT' : "ASSALAMU'ALAIKUM WR. WB.");
        labels.openingText = invitation?.opening_text || (isEn 
            ? `With all our hearts and joy, we invite you to be part of our aqiqah celebration.` 
            : `Dengan segala kerendahan hati dan rasa bahagia, kami mengundang Anda untuk menjadi bagian dari momen syukuran aqiqah buah hati kami.`);
        labels.openingParamPrompt = isEn ? `Lastly, here is the verified schedule parameter logs from the database:` : `Terakhir, berikut adalah berkas parameter jadwal aqiqah yang terverifikasi di sistem:`;
        
        labels.paramHostLabel1 = isEn ? 'Child' : 'Buah Hati';
        
        labels.brideGroomUserPrompt = isEn ? "Who is the child?" : "Siapa profil buah hati?";
        labels.brideGroomAiResponse = isEn ? `Here is the detailed profile of the child compiled from the system database:` : `Berikut adalah rincian biografi anak tercinta yang berhasil saya kumpulkan:`;
        
        labels.countdownUserPrompt = isEn ? "Generate a live countdown until the aqiqah!" : "Tampilkan hitung mundur waktu acara aqiqah!";
        labels.countdownAiResponse = isEn ? `Here is the countdown timer until our aqiqah celebration:` : `Berikut adalah hitung mundur waktu menuju hari syukuran aqiqah:`;
        
        labels.loveStoryUserPrompt = isEn ? "Explain the milestones." : "Bagaimana kronologi tumbuh kembang?";
        labels.loveStoryAiResponse = isEn ? `Here is the timeline logs of our baby growth:` : `Berikut adalah catatan lini masa tumbuh kembang buah hati kami:`;
        
        labels.eventUserPrompt = isEn ? "When and where are the celebration ceremonies?" : "Kapan dan di mana agenda syukuran dilangsungkan?";
        labels.eventAiResponse = isEn ? `Here are the location coordinate logs and schedules for the aqiqah celebration:` : `Berikut adalah log koordinat lokasi dan jadwal acara syukuran aqiqah yang terverifikasi:`;
        
        labels.livestreamUserPrompt = isEn ? "Is there a virtual live stream link?" : "Apakah ada tautan siaran virtual langsung?";
        labels.livestreamAiResponse = isEn ? `Here is the virtual broadcast streaming log:` : `Berikut adalah log siaran langsung virtual:`;
        
        labels.galleryUserPrompt = isEn ? "Generate visual captures." : "Tampilkan galeri tangkapan visual.";
        labels.galleryAiResponse = isEn ? `Here is the image database log for the gallery:` : `Berikut adalah log basis data foto tumbuh kembang buah hati kami:`;
        
        labels.bankUserPrompt = isEn ? "How can I send a digital gift?" : "Bagaimana cara mengirimkan kado digital?";
        labels.bankAiResponse = isEn ? `Here is the payment gateway log for sending digital gifts:` : `Berikut adalah log gerbang pembayaran untuk mengirimkan kado:`;
        
        labels.askFollowUp = isEn ? "Ask follow up aqiqah question..." : "Kirim pertanyaan lanjutan tentang aqiqah...";
        
    } else if (t === 'circumcision') {
        labels.coverHeader = isEn ? 'Circumcision of' : 'Khitanan';
        labels.coverFooter = isEn ? `The Circumcision Invitation of ${coupleName}` : `Undangan Khitanan Resmi ${coupleName}`;
        labels.chatTitle = isEn ? `Circumcision of ${coupleName}` : `Khitanan ${coupleName}`;
        
        labels.openingUserPrompt = isEn ? `Hi AI, show me the circumcision details of ${coupleName}.` : `Halo AI, tampilkan berkas detail khitanan ${coupleName}.`;
        labels.openingAiResponse = isEn ? `Hello! I'm ViteGPT, your virtual assistant for the circumcision of **${coupleName}** 👦. Let's start with a beautiful visual capture:` : `Halo! Saya ViteGPT, asisten virtual untuk khitanan **${coupleName}** 👦. Mari kita lihat potret kebahagiaan putra kami terlebih dahulu:`;
        labels.openingPhotoCaption = isEn ? `Generated sandbox capture for ${coupleName}.` : `Potret sandbox hasil tangkapan visual khitanan ${coupleName}.`;
        labels.openingCardHeader = invitation?.opening_title || (isEn ? 'CIRCUMCISION ANNOUNCEMENT' : "ASSALAMU'ALAIKUM WR. WB.");
        labels.openingText = invitation?.opening_text || (isEn 
            ? `With all our hearts and joy, we invite you to be part of our circumcision celebration.` 
            : `Dengan segala kerendahan hati dan rasa bahagia, kami mengundang Anda untuk menjadi bagian dari momen syukuran khitanan putra kami.`);
        labels.openingParamPrompt = isEn ? `Lastly, here is the verified schedule parameter logs from the database:` : `Terakhir, berikut adalah berkas parameter jadwal khitanan yang terverifikasi di sistem:`;
        
        labels.paramHostLabel1 = isEn ? 'Child' : 'Buah Hati';
        
        labels.brideGroomUserPrompt = isEn ? "Who is the child?" : "Siapa profil anak?";
        labels.brideGroomAiResponse = isEn ? `Here is the detailed profile of the child compiled from the system database:` : `Berikut adalah rincian biografi anak tercinta yang berhasil saya kumpulkan:`;
        
        labels.countdownUserPrompt = isEn ? "Generate a live countdown until the circumcision!" : "Tampilkan hitung mundur waktu acara khitanan!";
        labels.countdownAiResponse = isEn ? `Here is the countdown timer until our circumcision celebration:` : `Berikut adalah hitung mundur waktu menuju hari syukuran khitanan:`;
        
        labels.loveStoryUserPrompt = isEn ? "Explain the milestones." : "Bagaimana kronologi tumbuh kembang?";
        labels.loveStoryAiResponse = isEn ? `Here is the timeline logs of our boy's growth:` : `Berikut adalah catatan lini masa tumbuh kembang putra kami:`;
        
        labels.eventUserPrompt = isEn ? "When and where are the celebration ceremonies?" : "Kapan dan di mana agenda syukuran dilangsungkan?";
        labels.eventAiResponse = isEn ? `Here are the location coordinate logs and schedules for the circumcision celebration:` : `Berikut adalah log koordinat lokasi dan jadwal acara syukuran khitanan yang terverifikasi:`;
        
        labels.livestreamUserPrompt = isEn ? "Is there a virtual live stream link?" : "Apakah ada tautan siaran virtual langsung?";
        labels.livestreamAiResponse = isEn ? `Here is the virtual broadcast streaming log:` : `Berikut adalah log siaran langsung virtual:`;
        
        labels.galleryUserPrompt = isEn ? "Generate visual captures." : "Tampilkan galeri tangkapan visual.";
        labels.galleryAiResponse = isEn ? `Here is the image database log for the gallery:` : `Berikut adalah log basis data foto tumbuh kembang putra kami:`;
        
        labels.bankUserPrompt = isEn ? "How can I send a digital gift?" : "Bagaimana cara mengirimkan kado digital?";
        labels.bankAiResponse = isEn ? `Here is the payment gateway log for sending digital gifts:` : `Berikut adalah log gerbang pembayaran untuk mengirimkan kado:`;
        
        labels.askFollowUp = isEn ? "Ask follow up circumcision question..." : "Kirim pertanyaan lanjutan tentang khitanan...";
    }

    return {
        coupleName,
        isSingleHost,
        labels
    };
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDate(d, locale = 'id') {
    if (!d) return '';
    const loc = String(locale).toLowerCase() === 'en' ? 'en-US' : 'id-ID';
    // Safe parsing: T12:00:00 prevents UTC midnight timezone offset bug
    const safe = String(d).substring(0, 10) + 'T12:00:00';
    const date = new Date(safe);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

function parseEventDate(dateString, locale = 'id') {
    if (!dateString) return { dayNum: '', dayName: '', monthName: '', year: '' };
    // Safe parsing: T12:00:00 prevents UTC midnight timezone offset bug
    const d = parseSafeDate(dateString);
    if (isNaN(d.getTime())) return { dayNum: '', dayName: '', monthName: '', year: '' };
    const loc = locale === 'en' ? 'en-US' : 'id-ID';
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dayName = d.toLocaleDateString(loc, { weekday: 'long' });
    const monthName = d.toLocaleDateString(loc, { month: 'long' });
    const year = d.getFullYear();
    
    return { dayNum, dayName, monthName, year };
}

function getStorageUrl(url, fallback) {
    if (!url || url === 'null' || url === 'undefined' || url === '/storage/' || url === 'storage/') return fallback;
    if (typeof url === 'string' && url.includes(',')) {
        url = url.split(',')[0];
    }
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.startsWith('themes/') || cleanUrl.startsWith('/themes/')) {
        return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/storage/')) {
        if (cleanUrl === '/storage/' || cleanUrl === '/storage/null' || cleanUrl === '/storage/undefined') return fallback;
        return cleanUrl;
    }
    if (cleanUrl.startsWith('storage/')) {
        if (cleanUrl === 'storage/' || cleanUrl === 'storage/null' || cleanUrl === 'storage/undefined') return fallback;
        return '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/')) return cleanUrl;
    return `/storage/${cleanUrl}`;
}

const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 24, color: '#ececf1', background: '#212121', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ color: '#10a37f', fontSize: '1.5rem', marginBottom: 12 }}>Oops! Chat session encountered an error.</h2>
                <p style={{ color: '#8e8ea0', fontSize: '0.85rem', marginBottom: 20 }}>Gagal memuat visualisasi asisten chat ViteGPT.</p>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#ff4d4d', background: '#2f2f2f', padding: 16, borderRadius: 8, border: '1px solid #4d4d4d', maxWidth: '100%', textAlign: 'left' }}>
                    {this.state.error?.toString()}
                </pre>
            </div>
        );
        return this.props.children;
    }
}

let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL COMPONENT
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);

    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setVisible(true);
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            ref={ref}
            className={`${className} gpt-reveal ${visible ? 'is-visible' : ''}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENAI LOGO COMPONENT
   ═══════════════════════════════════════ */
function OpenAILogo({ size = 36, color = '#10a37f' }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.4s ease' }}>
                {/* Speech bubble */}
                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L3 22l4.31-1.3C8.94 21.36 10.42 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill={color} />
                {/* White Heart inside */}
                <path d="M12 17.5l-1.25-1.13C6.3 12.33 3.33 9.68 3.33 6.37c0-2.73 2.14-4.87 4.87-4.87c1.54 0 3.02.72 3.98 1.85c.96-1.13 2.44-1.85 3.98-1.85c2.73 0 4.87 2.14 4.87 4.87c0 3.31-2.97 5.96-7.42 10.01L12 17.5z" fill="#FFF" transform="translate(6, 6) scale(0.5)" />
            </svg>
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION (Simulated ViteGPT Welcome Landing Screen)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, language, fallbackPhoto, themeConfig }) {
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = themeConfig?.coupleName || 'Randi & Mira';
    const isEn = language === 'en';

    const guestInitials = (guestName || 'Tamu')
        .split(' ')
        .map(word => word.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const guestEmail = (guestName || 'tamu')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') + '@gmail.com';

    return (
        <div className={`gpt-cover${isOpened ? ' is-opened' : ''}`}>
            <div className="gpt-cover-backdrop">
                <div className="gpt-auth-modal">


                    {/* Logo/Icon on top */}
                    <div style={{ marginBottom: '24px', display: 'inline-block' }}>
                        <OpenAILogo size={36} color="#10a37f" />
                    </div>

                    <h2 className="gpt-auth-title" style={{ fontSize: '1.8rem', lineHeight: '1.2', margin: '0' }}>{themeConfig?.labels?.coverHeader || (isEn ? 'Wedding of' : 'Pernikahan')}</h2>
                    <h3 className="gpt-auth-couple-title" style={{ fontSize: '1.5rem', color: '#10a37f', fontWeight: 700, margin: '6px 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{coupleName}</h3>
                    
                    <div className="gpt-auth-to-label" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8e8ea0', fontWeight: 700, marginBottom: '8px' }}>
                        {isEn ? 'Dear Honored Guest, Yth.' : 'Kepada Yth. Bapak/Ibu/Saudara/i:'}
                    </div>

                    {/* Guest Account Selector Capsule */}
                    <div className="gpt-auth-account-row" onClick={onOpen} style={{ marginBottom: '16px' }}>
                        <div className="gpt-auth-avatar">
                            {guestInitials}
                        </div>
                        <div className="gpt-auth-user-info">
                            <strong>{guestName}</strong>
                            <span>{guestEmail}</span>
                        </div>

                    </div>

                    <div className="gpt-auth-apology" style={{ fontSize: '0.68rem', color: '#8e8ea0', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
                        {isEn 
                            ? '*We apologize for any errors in the spelling of names/titles.' 
                            : '*Mohon maaf apabila terdapat kesalahan dalam penulisan nama/gelar.'}
                    </div>

                    {/* Single Buka Undangan Pill Button */}
                    <button type="button" className="gpt-auth-pill-btn gpt-auth-btn-primary" onClick={onOpen}>
                        {isEn ? 'Open Invitation' : 'Buka Undangan'}
                    </button>
                </div>

                <div className="gpt-cover-footer-text" style={{ color: '#8e8ea0', marginTop: '24px', position: 'absolute', bottom: '24px', fontSize: '11px', fontWeight: 600 }}>
                    {themeConfig?.labels?.coverFooter || (isEn 
                        ? `The Wedding Invitation of ${coupleName}` 
                        : `Undangan Pernikahan Resmi ${coupleName}`)}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   STORIES TRAY (Styled as ViteGPT Top Navigation / Scrollspy links)
   ═══════════════════════════════════════ */
function StoriesTray({ resolvedSections, activeSectionId, isSlideMode, activeSlideIdx, onJump, language, sidebarOpen, themeConfig }) {
    const isEn = language === 'en';
    const isSingleHost = themeConfig?.isSingleHost;
    const containerRef = useRef(null);

    const sectionLabels = {
        opening: isEn ? 'Intro' : 'Intro',
        bride_groom: isSingleHost ? (isEn ? 'Profile' : 'Profil') : (isEn ? 'Couple' : 'Mempelai'),
        countdown: isEn ? 'Save The Date' : 'Save The Date',
        love_story: isEn ? 'Story' : 'Kisah',
        event: isEn ? 'Event' : 'Acara',
        livestream: 'Live',
        gallery: isEn ? 'Gallery' : 'Galeri',
        bank: isEn ? 'Gift' : 'Kado',
        rsvp: 'RSVP',
        wishes: isEn ? 'Wishes' : 'Doa',
        closing: isEn ? 'Outro' : 'Penutup'
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        // Wait briefly for CSS transitions / drawer slide-outs to settle
        const timer = setTimeout(() => {
            const activeEl = container.querySelector('.gpt-top-tab-btn.is-active');
            if (activeEl) {
                const containerRect = container.getBoundingClientRect();
                const activeRect = activeEl.getBoundingClientRect();
                const relativeLeft = activeRect.left - containerRect.left + container.scrollLeft;
                const targetScrollLeft = relativeLeft - (containerRect.width / 2) + (activeRect.width / 2);
                container.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth'
                });
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [activeSectionId, activeSlideIdx, resolvedSections, sidebarOpen]);

    return (
        <div ref={containerRef} className="gpt-top-tabs-row">
            {resolvedSections.map((s, idx) => {
                const label = sectionLabels[s.section_key] || s.section_name;
                const isActive = isSlideMode ? idx === activeSlideIdx : activeSectionId === s.section_key;

                return (
                    <button
                        key={s.section_key}
                        type="button"
                        className={`gpt-top-tab-btn ${isActive ? 'is-active' : ''}`}
                        onClick={() => onJump(idx, s.section_key)}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════
   CHAT BUBBLE WRAPPERS (Authentic User vs ViteGPT Balon Chat)
   ═══════════════════════════════════════ */
function ChatBubble({ sender = 'ai', guestName = 'Guest', children, isTyping = false }) {
    const isAi = sender === 'ai';
    return (
        <div className={`gpt-chat-row ${isAi ? 'gpt-chat-row--ai' : 'gpt-chat-row--user'}`}>
            <div className="gpt-avatar-container">
                {isAi ? (
                    <div className="gpt-avatar gpt-avatar--ai">
                        <OpenAILogo size={18} color="#fff" />
                    </div>
                ) : (
                    <div className="gpt-avatar gpt-avatar--user">
                        <span>{guestName.charAt(0).toUpperCase()}</span>
                    </div>
                )}
            </div>
            <div className="gpt-chat-bubble-content">
                <span className="gpt-sender-label">
                    {isAi ? 'ViteGPT' : guestName}
                </span>
                <div className="gpt-bubble-body" style={isTyping ? { display: 'inline-flex', padding: '10px 16px' } : undefined}>
                    {isTyping ? (
                        <div className="gpt-typing-dots">
                            <span className="gpt-dot" />
                            <span className="gpt-dot" />
                            <span className="gpt-dot" />
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION (ViteGPT Introduction reply)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, events, language, guest, fallbackPhoto, isTyping, themeConfig }) {
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const coupleName = themeConfig?.coupleName || 'Randi & Mira';
    const isSingleHost = themeConfig?.isSingleHost;
    const guestName = guest?.name || 'Tamu Undangan';
    const isEn = language === 'en';

    const snapshotImages = useMemo(() => {
        const rawSource = invitation?.opening_image || invitation?.cover_image;
        if (!rawSource) return [fallbackPhoto];
        return rawSource.split(',').map(url => getStorageUrl(url, fallbackPhoto)).filter(Boolean);
    }, [invitation?.opening_image, invitation?.cover_image, fallbackPhoto]);

    const isIdenticalQuote = invitation?.opening_ayat && invitation?.opening_ayat_translation &&
        invitation.opening_ayat.trim().toLowerCase() === invitation.opening_ayat_translation.trim().toLowerCase();

    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const eventDateStr = primaryEvent?.event_date ? formatDate(primaryEvent.event_date, language) : '';
    const venueName = primaryEvent?.venue_name || '';

    return (
        <div id="opening" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{themeConfig?.labels?.openingUserPrompt || (isEn ? `Hi AI, show me the wedding details of ${coupleName}.` : `Halo AI, tampilkan berkas detail pernikahan ${coupleName}.`)}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>
                    {themeConfig?.labels?.openingAiResponse || (isEn 
                        ? `Hello! I'm ViteGPT, your virtual assistant for the wedding of **${coupleName}** 🌟. I'm absolutely delighted to welcome you here! Let's start with a beautiful visual capture of the happy couple:` 
                        : `Halo! Saya ViteGPT, asisten virtual untuk pernikahan **${coupleName}** 🌟. Senang sekali bisa menyambut Anda di sini! Mari kita lihat potret kebahagiaan kedua mempelai terlebih dahulu:`)}
                </p>

                {/* Prewedding Snapshot Card - Rendered first! */}
                {globalShowPhotos && (
                    <Reveal className="gpt-card gpt-opening-photo-card" delay={100}>
                        <div className="gpt-card-header-badge">{isSingleHost ? '#HOST_SNAPSHOT' : '#COUPLE_SNAPSHOT'}</div>
                        <div className="gpt-opening-photo-wrap relative overflow-hidden">
                            <PremiumSlideshow
                                images={snapshotImages}
                                positionX={invitation?.cover_position_x}
                                positionY={invitation?.cover_position_y}
                                zoom={invitation?.cover_zoom}
                                className="absolute inset-0 w-full h-full z-0"
                                imgClassName="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="gpt-opening-photo-caption">
                            <i className="fas fa-magic" style={{ color: '#10a37f', marginRight: '6px' }} />
                            {themeConfig?.labels?.openingPhotoCaption || (isEn 
                                ? `Generated sandbox prewedding capture for ${coupleName}.` 
                                : `Potret prewedding sandbox hasil tangkapan visual ${coupleName}.`)}
                        </div>
                    </Reveal>
                )}

                <p style={{ marginTop: '20px' }}>
                    {isEn 
                        ? `Next, here is the solemn greeting and warm invitation announcement from the couple and family:` 
                        : `Berikutnya, berikut adalah bait salam hangat dan maklumat suci dari kedua mempelai:`}
                </p>

                {/* Greetings Card */}
                <Reveal className="gpt-card gpt-opening-card" delay={150}>
                    <div className="gpt-card-header-badge">#SYSTEM_GREETINGS</div>
                    
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10a37f', marginBottom: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {themeConfig?.labels?.openingCardHeader || (isEn ? 'WEDDING ANNOUNCEMENT' : "ASSALAMU'ALAIKUM WR. WB.")}
                    </h3>

                    {invitation?.opening_ayat && (
                        <div className="gpt-quran-box">
                            <p className="gpt-quran-arabic" dir="rtl">{invitation.opening_ayat}</p>
                            {invitation?.opening_ayat_translation && !isIdenticalQuote && (
                                <p className="gpt-quran-translation">"{invitation.opening_ayat_translation}"</p>
                            )}
                            {invitation?.opening_ayat_source && (
                                <span className="gpt-quran-source">&mdash; Q.S. {invitation.opening_ayat_source}</span>
                            )}
                        </div>
                    )}

                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#ececf1', marginTop: '12px' }}>
                        {themeConfig?.labels?.openingText || (isEn 
                            ? `With all our hearts and joy, we invite you to be part of our historic moment. We apologize if there are any shortcomings in this digital invitation prompt. Your presence and blessings are the most beautiful gifts for the new chapter of our love journey.` 
                            : `Dengan segala kerendahan hati dan rasa bahagia, kami mengundang Anda untuk menjadi bagian dari momen bersejarah kami. Mohon dimaafkan apabila terdapat kekurangan dalam penyusunan prompt undangan digital ini. Kehadiran dan doa restu Anda adalah berkah terindah bagi lembaran baru perjalanan cinta kami.`)}
                    </p>
                </Reveal>

                <p style={{ marginTop: '20px' }}>
                    {themeConfig?.labels?.openingParamPrompt || (isEn 
                        ? `Lastly, here is the verified schedule parameter logs from the database:` 
                        : `Terakhir, berikut adalah berkas parameter jadwal pernikahan yang terverifikasi di sistem:`)}
                </p>

                {/* Parameter Specifications Table Card */}
                <Reveal className="gpt-card gpt-opening-table-card" delay={200}>
                    <div className="gpt-card-header-badge">#PARAMETER_SPECIFICATIONS</div>
                    <div className="gpt-opening-table-container">
                        <table className="gpt-opening-summary-table">
                            <thead>
                                <tr>
                                    <th>{isEn ? 'Parameter' : 'Parameter'}</th>
                                    <th>{isEn ? 'System Value' : 'Nilai Sistem'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isSingleHost ? (
                                    <tr>
                                        <td><strong>{themeConfig?.labels?.paramHostLabel1 || (isEn ? 'Host Name' : 'Penyelenggara')}</strong></td>
                                        <td>{groom.full_name || groom.nickname || 'Host'}</td>
                                    </tr>
                                ) : (
                                    <>
                                        <tr>
                                            <td><strong>{themeConfig?.labels?.paramHostLabel1 || (isEn ? 'Mempelai Pria' : 'Mempelai Pria')}</strong></td>
                                            <td>{groom.full_name || 'Randi Setiawan'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>{themeConfig?.labels?.paramHostLabel2 || (isEn ? 'Mempelai Wanita' : 'Mempelai Wanita')}</strong></td>
                                            <td>{bride.full_name || 'Amira Lestari'}</td>
                                        </tr>
                                    </>
                                )}
                                {eventDateStr && (
                                    <tr>
                                        <td><strong>{isEn ? 'Event Date' : 'Tanggal Acara'}</strong></td>
                                        <td>{eventDateStr}</td>
                                    </tr>
                                )}
                                {venueName && (
                                    <tr>
                                        <td><strong>{isEn ? 'Venue Location' : 'Lokasi Acara'}</strong></td>
                                        <td>{venueName}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td><strong>{isEn ? 'Status' : 'Status'}</strong></td>
                                    <td>
                                        <span className="gpt-status-badge">
                                            <span className="gpt-pulse-green" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} />
                                            {isEn ? 'VERIFIED_OK' : 'TERVERIFIKASI'}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Reveal>
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   MEMPELAI SECTION (ViteGPT Bride & Groom Profiles)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, language, guest, isTyping, themeConfig }) {
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const isSingleHost = themeConfig?.isSingleHost;
    const couples = safeArr(brideGrooms);
    
    // User prompt & AI response
    const userPrompt = themeConfig?.labels?.brideGroomUserPrompt || (isEn ? "Who are the groom and bride?" : "Siapa profil kedua mempelai?");
    const aiResponse = themeConfig?.labels?.brideGroomAiResponse || (isEn ? "Here are the detailed profiles of the bride & groom compiled from the system database:" : "Berikut adalah rincian biografi pengantin pria dan wanita yang berhasil saya kumpulkan:");

    const translateOrder = (order, gender) => {
        if (!order) return '';
        const clean = String(order).toLowerCase();
        let label = order;
        if (clean.includes('pertama') || clean.includes('1') || clean.includes('first')) label = isEn ? 'first' : 'pertama';
        else if (clean.includes('kedua') || clean.includes('2') || clean.includes('second')) label = isEn ? 'second' : 'kedua';
        else if (clean.includes('ketiga') || clean.includes('3') || clean.includes('third')) label = isEn ? 'third' : 'ketiga';
        else if (clean.includes('keempat') || clean.includes('4') || clean.includes('fourth')) label = isEn ? 'fourth' : 'keempat';
        else if (clean.includes('bungsu') || clean.includes('last')) label = isEn ? 'youngest' : 'bungsu';
        else if (clean.includes('tunggal') || clean.includes('only')) label = isEn ? 'only' : 'tunggal';

        const isFemale = ['wanita', 'female'].includes(String(gender).toLowerCase());
        if (isEn) {
            const noun = isFemale ? 'daughter' : 'son';
            return `${label} ${noun} of`;
        } else {
            const noun = isFemale ? 'putri' : 'putra';
            return `${noun} ${label} dari`;
        }
    };

    if (isSingleHost) {
        const host = couples[0] || {};
        const hostPhoto = getStorageUrl(host.photo, null);
        return (
            <div id="bride_groom" className="gpt-section">
                <ChatBubble sender="user" guestName={guestName}>
                    <p>{userPrompt}</p>
                </ChatBubble>

                <ChatBubble sender="ai" isTyping={isTyping}>
                    <p>{aiResponse}</p>

                    <div className="gpt-couple-container" style={{ display: 'flex', justifyContent: 'center' }}>
                        {host?.full_name && (
                            <Reveal className="gpt-card gpt-couple-card" delay={100} style={{ maxWidth: '320px', width: '100%' }}>
                                <div className="gpt-couple-avatar-wrap">
                                    {globalShowPhotos && hostPhoto ? (
                                        <img 
                                            src={hostPhoto} 
                                            alt={host.nickname} 
                                            className="gpt-couple-photo" 
                                            style={{
                                                objectPosition: `${host.photo_position_x ?? 50}% ${host.photo_position_y ?? 50}%`,
                                                transform: `scale(${host.photo_zoom ?? 1.0})`,
                                            }}
                                        />
                                    ) : (
                                        <div className="gpt-couple-monogram">{host.nickname?.charAt(0) || 'H'}</div>
                                    )}
                                </div>
                                <div style={{ padding: '16px', textAlign: 'center' }}>
                                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10a37f' }}>{host.full_name}</h4>
                                    <span style={{ fontSize: '0.78rem', color: '#8e8ea0', fontWeight: 600 }}>@{host.nickname?.toLowerCase()}</span>
                                    
                                    {(host.father_name || host.mother_name) && (
                                        <div className="gpt-couple-parent-box">
                                            <span style={{ fontSize: '0.72rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#b4b4b4', fontWeight: 700 }}>
                                                {translateOrder(host.child_order, host.gender || 'pria')}
                                            </span>
                                            <p style={{ fontSize: '0.8rem', color: '#ececf1', fontWeight: 600, marginTop: '2px' }}>
                                                {host.father_name} {host.mother_name ? `& ${host.mother_name}` : ''}
                                            </p>
                                        </div>
                                    )}
                                    <p style={{ fontSize: '0.78rem', color: '#8e8ea0', lineHeight: 1.4, margin: '8px 0' }}>
                                        {host.bio || 'Blessed & happy.'}
                                    </p>
                                    {host.instagram && (
                                        <a href={`https://instagram.com/${host.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="gpt-btn-action">
                                            <i className="fab fa-instagram" /> Instagram
                                        </a>
                                    )}
                                </div>
                            </Reveal>
                        )}
                    </div>
                </ChatBubble>
            </div>
        );
    }

    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || {};

    const groomPhoto = getStorageUrl(groom.photo, null);
    const bridePhoto = getStorageUrl(bride.photo, null);

    return (
        <div id="bride_groom" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{userPrompt}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>{aiResponse}</p>

                <div className="gpt-couple-container">
                    {/* Groom Card */}
                    {groom?.full_name && (
                        <Reveal className="gpt-card gpt-couple-card" delay={100}>
                            <div className="gpt-couple-avatar-wrap">
                                {globalShowPhotos && groomPhoto ? (
                                    <img 
                                        src={groomPhoto} 
                                        alt={groom.nickname} 
                                        className="gpt-couple-photo" 
                                        style={{
                                            objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                            transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                        }}
                                    />
                                ) : (
                                    <div className="gpt-couple-monogram">{groom.nickname?.charAt(0) || 'G'}</div>
                                )}
                            </div>
                            <div style={{ padding: '16px', textAlign: 'center' }}>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10a37f' }}>{groom.full_name}</h4>
                                <span style={{ fontSize: '0.78rem', color: '#8e8ea0', fontWeight: 600 }}>@{groom.nickname?.toLowerCase()}</span>
                                
                                <div className="gpt-couple-parent-box">
                                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#b4b4b4', fontWeight: 700 }}>
                                        {translateOrder(groom.child_order, 'pria')}
                                    </span>
                                    <p style={{ fontSize: '0.8rem', color: '#ececf1', fontWeight: 600, marginTop: '2px' }}>
                                        {groom.father_name} & {groom.mother_name}
                                    </p>
                                </div>
                                <p style={{ fontSize: '0.78rem', color: '#8e8ea0', lineHeight: 1.4, margin: '8px 0' }}>
                                    {groom.bio || 'Blessed & happy.'}
                                </p>
                                {groom.instagram && (
                                    <a href={`https://instagram.com/${groom.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="gpt-btn-action">
                                        <i className="fab fa-instagram" /> Instagram
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    )}

                    {/* Bride Card */}
                    {bride?.full_name && (
                        <Reveal className="gpt-card gpt-couple-card" delay={200}>
                            <div className="gpt-couple-avatar-wrap">
                                {globalShowPhotos && bridePhoto ? (
                                    <img 
                                        src={bridePhoto} 
                                        alt={bride.nickname} 
                                        className="gpt-couple-photo" 
                                        style={{
                                            objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                            transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                        }}
                                    />
                                ) : (
                                    <div className="gpt-couple-monogram">{bride.nickname?.charAt(0) || 'B'}</div>
                                )}
                            </div>
                            <div style={{ padding: '16px', textAlign: 'center' }}>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10a37f' }}>{bride.full_name}</h4>
                                <span style={{ fontSize: '0.78rem', color: '#8e8ea0', fontWeight: 600 }}>@{bride.nickname?.toLowerCase()}</span>
                                
                                <div className="gpt-couple-parent-box">
                                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#b4b4b4', fontWeight: 700 }}>
                                        {translateOrder(bride.child_order, 'wanita')}
                                    </span>
                                    <p style={{ fontSize: '0.8rem', color: '#ececf1', fontWeight: 600, marginTop: '2px' }}>
                                        {bride.father_name} & {bride.mother_name}
                                    </p>
                                </div>
                                <p style={{ fontSize: '0.78rem', color: '#8e8ea0', lineHeight: 1.4, margin: '8px 0' }}>
                                    {bride.bio || 'Thankful & excited.'}
                                </p>
                                {bride.instagram && (
                                    <a href={`https://instagram.com/${bride.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="gpt-btn-action">
                                        <i className="fab fa-instagram" /> Instagram
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    )}
                </div>
            </ChatBubble>
        </div>
    );
}

// Internal binding helper so ChatBubble handles its own content spacing
const BubbleWrapper = ChatBubble;

/* ═══════════════════════════════════════
   SAVE THE DATE & COUNTDOWN (ViteGPT Python Code Execution block)
   ═══════════════════════════════════════ */

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

function CountdownSection({ invitation, events, language, guest, isTyping, themeConfig }) {
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const targetDate = primaryEvent?.event_date || invitation?.countdown_target_date;

    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const ds = String(targetDate).substring(0, 10);
        const timeStr = primaryEvent?.start_time ? String(primaryEvent.start_time).substring(0, 5) : '08:00';
        const target = parseSafeDate(targetDate, primaryEvent?.start_time);
        if (isNaN(target.getTime())) return;

        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCd({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setCd({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000)
            });
        };

        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);
    }, [targetDate, primaryEvent?.start_time]);

    return (
        <div id="countdown" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{themeConfig?.labels?.countdownUserPrompt || (isEn ? "Generate a live countdown until the wedding!" : "Tampilkan hitung mundur waktu acara pernikahan!")}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>
                    {themeConfig?.labels?.countdownAiResponse || (isEn 
                        ? `Here is the countdown timer until our happy day:` 
                        : `Berikut adalah hitung mundur waktu menuju hari bahagia kami:`)}
                </p>

                {/* Simulated Program Output Box */}
                <div className="gpt-terminal-output-box">
                    <span className="gpt-terminal-lbl">OUTPUT CONSOLE:</span>
                    <div className="gpt-terminal-grid">
                        <div className="gpt-terminal-cell">
                            <span className="gpt-terminal-val">{pad2(cd.d)}</span>
                            <span className="gpt-terminal-tag">{isEn ? 'Days' : 'Hari'}</span>
                        </div>
                        <div className="gpt-terminal-cell">
                            <span className="gpt-terminal-val">{pad2(cd.h)}</span>
                            <span className="gpt-terminal-tag">{isEn ? 'Hours' : 'Jam'}</span>
                        </div>
                        <div className="gpt-terminal-cell">
                            <span className="gpt-terminal-val">{pad2(cd.m)}</span>
                            <span className="gpt-terminal-tag">{isEn ? 'Mins' : 'Menit'}</span>
                        </div>
                        <div className="gpt-terminal-cell">
                            <span className="gpt-terminal-val">{pad2(cd.s)}</span>
                            <span className="gpt-terminal-tag">{isEn ? 'Secs' : 'Detik'}</span>
                        </div>
                    </div>
                </div>
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION (ViteGPT Timeline history logs)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, language, guest, isTyping, themeConfig }) {
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const stories = safeArr(loveStories).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    if (stories.length === 0) return null;

    return (
        <div id="love_story" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{themeConfig?.labels?.loveStoryUserPrompt || (isEn ? "Explain the prompt parameters of their love journey." : "Bagaimana kronologi perjalanan cinta mereka?")}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>
                    {themeConfig?.labels?.loveStoryAiResponse || (isEn 
                        ? `Parsing log files... I found ${stories.length} key romantic checkpoints in their repository:` 
                        : `Menganalisis berkas log riwayat... Saya menemukan ${stories.length} titik temu romantis dalam repositori cinta mereka:`)}
                </p>

                <div className="gpt-timeline-container">
                    {stories.map((story, idx) => (
                        <Reveal key={story.id || idx} className="gpt-timeline-node" delay={idx * 100}>
                            <div className="gpt-timeline-pin-swirl">
                                <OpenAILogo size={14} color="#10a37f" />
                            </div>
                            <div className="gpt-timeline-bubble">
                                <span className="gpt-timeline-date">{formatDate(story.story_date, language)}</span>
                                <h4 className="gpt-timeline-title">{story.title}</h4>
                                <p className="gpt-timeline-desc">{story.description}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   ACARA SECTION (ViteGPT Plugin location cards)
   ═══════════════════════════════════════ */
function EventSection({ events, invitation, language, guest, isTyping, themeConfig }) {
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const safeEvents = safeArr(events);

    const getCalUrl = (evt) => {
        if (!evt?.event_date) return '#';
        const ds = String(evt.event_date).substring(0, 10).replace(/-/g, '');
        const st = (evt.start_time || '08:00').substring(0, 5).replace(':', '') + '00';
        const names = themeConfig?.coupleName || 'Randi & Mira';
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((evt.event_name || '') + ' - ' + names)}&dates=${ds}T${st}/${ds}T${st}&location=${encodeURIComponent([evt.venue_name, evt.venue_address].filter(Boolean).join(', '))}&sf=true&output=xml`;
    };

    return (
        <div id="event" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{themeConfig?.labels?.eventUserPrompt || (isEn ? "When and where are the wedding ceremonies?" : "Kapan dan di mana agenda akad serta resepsi dilangsungkan?")}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>
                    {themeConfig?.labels?.eventAiResponse || (isEn 
                        ? `Here are the official verified scheduling structures and coordinates mapped from the system:` 
                        : `Berikut adalah struktur penjadwalan dan koordinat peta resmi yang berhasil diverifikasi oleh sistem:`)}
                </p>

                <div className="gpt-events-grid">
                    {safeEvents.map((ev, idx) => {
                        const { dayNum, dayName, monthName, year } = parseEventDate(ev.event_date || ev.date);
                        const formattedTime = ev.start_time ? `${formatTime(ev.start_time)} ${ev.timezone || 'WIB'}` : '';

                        return (
                            <Reveal key={ev.id || idx} className="gpt-card gpt-event-card" delay={idx * 150}>
                                <div className="gpt-event-header">
                                    <i className="far fa-calendar-check" />
                                    <span>{ev.event_name || 'Event'}</span>
                                </div>
                                <div className="gpt-event-body">
                                    <h4 className="gpt-event-date">{dayName}, {dayNum} {monthName} {year}</h4>
                                    
                                    <div className="gpt-event-detail-item">
                                        <i className="far fa-clock" />
                                        <span>{formattedTime} {ev.end_time ? `- ${formatTime(ev.end_time)}` : (isEn ? '- Finished' : '- Selesai')}</span>
                                    </div>

                                    <div className="gpt-event-detail-item">
                                        <i className="fas fa-map-marker-alt" />
                                        <strong style={{ color: '#10a37f' }}>{ev.venue_name}</strong>
                                    </div>

                                    <p className="gpt-event-address">{ev.venue_address}</p>

                                    <div className="gpt-event-actions-row">
                                        {ev.gmaps_link && (
                                            <a href={ev.gmaps_link} target="_blank" rel="noopener noreferrer" className="gpt-btn-action primary">
                                                <i className="fas fa-directions" /> {isEn ? 'Google Maps' : 'Petunjuk Arah'}
                                            </a>
                                        )}
                                        <a href={getCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="gpt-btn-action">
                                            <i className="far fa-calendar-alt" /> {isEn ? 'Save Date' : 'Simpan Acara'}
                                        </a>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}

                                {/* Compact standalone Dress Code box below event list */}
                                {safeEvents?.filter(ev => ev.show_dress_code).map((ev, idx) => (
                                    <div key={`dc-${idx}`} className="gpt-card w-full mt-4">
                                        <DressCodeBlock event={ev} colors={{ primary: '#10a37f', text: '#ececf1' }} fonts={{ heading: 'inherit' }} variant="app" plain={true} />
                                    </div>
                                ))}

                </div>
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   LIVE STREAMING SECTION (ViteGPT Virtual Stream link)
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, language, guest, isTyping, themeConfig }) {
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    
    const streamsList = useMemo(() => {
        const list = [];
        if (primaryEvent?.streaming_url) {
            list.push({ platform: primaryEvent.streaming_platform || 'Live', url: primaryEvent.streaming_url });
        }
        if (Array.isArray(primaryEvent?.streamings)) {
            primaryEvent.streamings.forEach(s => {
                if (s.url && !list.some(item => item.url === s.url)) {
                    list.push({ platform: s.platform || 'Live', url: s.url });
                }
            });
        }
        return list;
    }, [primaryEvent]);

    if (streamsList.length === 0) return null;

    return (
        <div id="livestream" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{themeConfig?.labels?.livestreamUserPrompt || (isEn ? "Is there a virtual live stream link?" : "Apakah ada tautan siaran virtual langsung?")}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>
                    {themeConfig?.labels?.livestreamAiResponse || (isEn 
                        ? `Yes. Tapping the dynamic plugin button below will redirect you to the virtual live broadcast channel:` 
                        : `Ya. Menekan tombol modul dinamis di bawah ini akan mengarahkan Anda ke saluran siaran virtual langsung:`)}
                </p>

                <Reveal className="gpt-card gpt-stream-card" delay={100}>
                    <i className="fas fa-video gpt-stream-icon" />
                    <h5 style={{ fontSize: '1rem', fontWeight: 800, color: '#10a37f', margin: '10px 0 5px' }}>
                        {isEn ? 'Virtual Broadcast Room' : 'Saluran Siaran Virtual'}
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: '#8e8ea0', lineHeight: 1.4, marginBottom: '14px' }}>
                        {isEn ? 'Click the stream buttons to attend the virtual stream.' : 'Saksikan siaran virtual kami dengan menekan tombol di bawah ini.'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {streamsList.map((stream, idx) => (
                            <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="gpt-btn-action primary" style={{ width: '100%' }}>
                                <i className="fas fa-external-link-alt" /> {isEn ? 'Join Virtual Stream' : 'Gabung Siaran'} ({stream.platform.toUpperCase()})
                            </button>
                        ))}
                    </div>
                </Reveal>
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   GALERI SECTION (ViteGPT Image Generation mockup Grid)
   ═══════════════════════════════════════ */
function GallerySection({ galleries, language, guest, isTyping, themeConfig }) {
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const safeGalleries = safeArr(galleries);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    if (safeGalleries.length === 0 || !globalShowPhotos) return null;

    return (
        <div id="gallery" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{themeConfig?.labels?.galleryUserPrompt || (isEn ? "Generate prewedding visual captures of the couple." : "Tampilkan galeri tangkapan visual prewedding mempelai.")}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>
                    {themeConfig?.labels?.galleryAiResponse || (isEn 
                        ? `Generating high-fidelity visual cards... Displaying love story grid captures:` 
                        : `Mempersiapkan visualisasi beresolusi tinggi... Menampilkan kisi-kisi potret kisah cinta:`)}
                </p>

                <div className="gpt-gallery-grid">
                    {safeGalleries.map((g, idx) => {
                        const src = getStorageUrl(g.image_url);
                        return (
                            <Reveal key={g.id || idx} className="gpt-gallery-item" delay={(idx % 3) * 80}>
                                <div className="gpt-gallery-img-box" onClick={() => setSelectedPhoto({ ...g, src })}>
                                    <img src={src} alt={g.caption || 'Gallery'} loading="lazy" />
                                    <div className="gpt-gallery-hover-overlay">
                                        <i className="fas fa-expand" />
                                        <span>{isEn ? 'Expand' : 'Perbesar'}</span>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>

                {/* ViteGPT photo zoom modal overlay */}
                {selectedPhoto && (
                    <div className="gpt-modal-overlay" onClick={() => setSelectedPhoto(null)}>
                        <div className="gpt-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="gpt-modal-header-row">
                                <span style={{ fontSize: '11px', color: '#8e8ea0', fontWeight: 600 }}>DALL-E 3 Generation</span>
                                <button type="button" onClick={() => setSelectedPhoto(null)} style={{ border: 'none', background: 'transparent', color: '#ececf1', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fas fa-times" /></button>
                            </div>
                            <div className="gpt-modal-photo-wrap">
                                <img src={selectedPhoto.src} alt={selectedPhoto.caption} />
                            </div>
                            {selectedPhoto.caption && (
                                <p style={{ fontSize: '0.8rem', color: '#ececf1', padding: '12px 16px', margin: 0, borderTop: '1px solid #4d4d4d', lineHeight: 1.4 }}>
                                    {selectedPhoto.caption}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   KADO SECTION (ViteGPT Code-block Copy Wallet cards)
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, language, guest, isTyping, themeConfig }) {
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const accounts = safeArr(bankAccounts);
    const [copiedIdx, setCopiedIdx] = useState(null);

    if (accounts.length === 0) return null;

    const copyText = (text, idx) => {
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
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2000);
        } catch (e) {}
        document.body.removeChild(ta);
    };

    return (
        <div id="bank" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{themeConfig?.labels?.bankUserPrompt || (isEn ? "How can I send a digital wedding gift?" : "Bagaimana cara mengirimkan amplop atau kado digital?")}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>
                    {themeConfig?.labels?.bankAiResponse || (isEn 
                        ? `Digital gift registry and virtual wallet targets are logged below. You can copy the account details directly:` 
                        : `Repositori dompet virtual dan pendaftaran kado tercatat di bawah ini. Anda dapat menyalin data rekening langsung:`)}
                </p>

                <div className="gpt-bank-grid">
                    {accounts.map((acc, idx) => (
                        <Reveal key={acc.id || idx} className="gpt-card gpt-bank-card" delay={idx * 100}>
                            <div className="gpt-bank-header">
                                <i className="fas fa-wallet" />
                                <span>{acc.bank_name}</span>
                            </div>
                            <div className="gpt-bank-body">
                                {/* Account Number formatted as a code-block row with copy function */}
                                <div className="gpt-bank-code-row">
                                    <code>{acc.account_number}</code>
                                    <button
                                        type="button"
                                        onClick={() => copyText(acc.account_number, idx)}
                                        className="gpt-bank-copy-btn"
                                    >
                                        {copiedIdx === idx ? (
                                            <span style={{ color: '#10a37f' }}><i className="fas fa-check" /> {isEn ? 'Copied' : 'Salin Sukses'}</span>
                                        ) : (
                                            <span><i className="far fa-copy" /> {isEn ? 'Copy' : 'Salin'}</span>
                                        )}
                                    </button>
                                </div>
                                <span className="gpt-bank-holder">a/n {acc.account_name}</span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   RSVP & UCAPAN TERPADU SECTION (ViteGPT comments box)
   ═══════════════════════════════════════ */
function UnifiedFormSection({ invitation, wishes, guest, enableRsvp, enableWishes, language, isTyping, themeConfig }) {
    const wishesInputRef = React.useRef(null);
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const guestNameFromUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;
    const defaultSenderName = guest?.name || guestNameFromUrl || '';

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_id: guest?.id || '',
        sender_name: defaultSenderName,
        attendance: 'hadir',
        number_of_guests: 1,
        message: '',
    });

    const [formStatus, setFormStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus(null);
        post(route('invitation.submit_rsvp', { slug: invitation.slug }), {
            preserveScroll: true,
            onSuccess: () => {
                if (data.message && enableWishes) {
                    post(route('invitation.submit_wish', { slug: invitation.slug }), {
                        preserveScroll: true,
                        onSuccess: () => {
                            setFormStatus('success');
                            reset('message');
                        }
                    });
                } else {
                    setFormStatus('success');
                }
            },
            onError: () => setFormStatus('error')
        });
    };

    const activeWishes = safeArr(wishes);

    return (
        <div id="rsvp" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{themeConfig?.labels?.rsvpUserPrompt || (isEn ? "Open the RSVP form and list congratulatory messages." : "Buka konfirmasi kehadiran dan daftarkan ucapan selamat.")}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>
                    {themeConfig?.labels?.rsvpAiResponse || (isEn 
                        ? `RSVP compiler module loaded. Please fill out the form, and view what other guests have posted:` 
                        : `Modul konfirmasi kehadiran berhasil dimuat. Silakan isi data RSVP, dan saksikan ucapan tamu lainnya:`)}
                </p>

                {enableRsvp && (
                    <Reveal className="gpt-card gpt-rsvp-card" delay={100}>
                        <div className="gpt-rsvp-header">
                            <i className="far fa-edit" />
                            <span>{isEn ? 'Submit RSVP & Wish' : 'Kirim RSVP & Doa Restu'}</span>
                        </div>

                        {formStatus === 'success' && (
                            <div className="gpt-alert-box success">
                                <i className="fas fa-check-circle" /> {isEn ? 'RSVP and wishes submitted successfully!' : 'Kehadiran dan ucapan berhasil disimpan!'}
                            </div>
                        )}
                        {formStatus === 'error' && (
                            <div className="gpt-alert-box error">
                                <i className="fas fa-exclamation-circle" /> {isEn ? 'Failed to submit. Check form entries.' : 'Gagal mengirim. Mohon periksa kembali formulir.'}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="gpt-rsvp-form">
                            <div className="gpt-form-group">
                                <label>{isEn ? 'Your Full Name' : 'Nama Lengkap'}</label>
                                <input
                                    type="text"
                                    value={data.sender_name}
                                    onChange={(e) => setData('sender_name', e.target.value)}
                                    className="gpt-form-input"
                                    placeholder={isEn ? 'Enter name' : 'Masukkan nama Anda'}
                                    required
                                />
                                {errors.sender_name && <span className="gpt-form-error">{errors.sender_name}</span>}
                            </div>

                            <div className="gpt-form-group">
                                <label>{isEn ? 'Attendance Confirmation' : 'Kehadiran'}</label>
                                <select
                                    value={data.attendance}
                                    onChange={(e) => setData('attendance', e.target.value)}
                                    className="gpt-form-select"
                                >
                                    <option value="hadir">{isEn ? 'Attending' : 'Hadir'}</option>
                                    <option value="tidak_hadir">{isEn ? 'Not Attending' : 'Tidak Hadir'}</option>
                                    <option value="belum_pasti">{isEn ? 'Uncertain / Maybe' : 'Belum Pasti'}</option>
                                </select>
                            </div>

                            {data.attendance === 'hadir' && (
                                <div className="gpt-form-group">
                                    <label>{isEn ? 'Number of Guests' : 'Jumlah Orang'}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={data.number_of_guests}
                                        onChange={(e) => setData('number_of_guests', parseInt(e.target.value) || 1)}
                                        className="gpt-form-input"
                                    />
                                </div>
                            )}

                            {enableWishes && (
                                <div className="gpt-form-group">
                                    <label>{isEn ? 'Your Blessings / Comment' : 'Tulis Ucapan & Doa'}</label>
                                    <WishesEmojiPicker
                                    value={data.message}
                                    onChange={(newValue) => setData('message', newValue)}
                                    inputRef={wishesInputRef}
                                    isDark={true}
                                >
                                    <textarea
                                    ref={wishesInputRef}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="gpt-form-textarea"
                                        placeholder={isEn ? 'Write warm blessings...' : 'Tulis ucapan selamat dan doa terbaik...'}
                                        rows="3"
                                        required
                                    />
                                </WishesEmojiPicker>
                                </div>
                            )}

                            <button type="submit" disabled={processing} className="gpt-form-submit">
                                {processing ? (isEn ? 'Posting...' : 'Mengirim...') : (isEn ? 'Post Message' : 'Kirim Ucapan')}
                            </button>
                        </form>
                    </Reveal>
                )}

                {/* Wishes Comment thread list */}
                <div className="gpt-comments-thread-box">
                    <span className="gpt-comments-title">{isEn ? 'CONGRATULATIONS FEED' : 'DENGUNG UCAPAN TAMU'} ({activeWishes.length})</span>
                    <div className="gpt-comments-scroll-area">
                        {activeWishes.map((wish, idx) => (
                            <div key={wish.id || idx} className="gpt-comment-node">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <div className="gpt-comment-avatar">
                                        {wish.sender_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="gpt-comment-author">{wish.sender_name}</span>
                                    <span style={{ fontSize: '10px', color: '#8e8ea0', marginLeft: 'auto' }}>Verified ✓</span>
                                </div>
                                <p className="gpt-comment-text">{wish.message}</p>
                            </div>
                        ))}
                        {activeWishes.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#8e8ea0', fontSize: '0.8rem', padding: '16px 0' }}>
                                {isEn ? 'No comments yet. Write one above!' : 'Belum ada ucapan. Jadilah yang pertama memberikan doa!'}
                            </div>
                        )}
                    </div>
                </div>
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION (Formal Footer UI)
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, language, guest, isTyping, themeConfig }) {
    const isEn = language === 'en';
    const guestName = guest?.name || 'Tamu Undangan';
    const isSingleHost = themeConfig?.isSingleHost;
    const bgs = safeArr(brideGrooms);
    
    const userPrompt = themeConfig?.labels?.closingUserPrompt || (isEn ? "Execute closing remarks." : "Tampilkan bait penutup undangan.");
    const aiResponse = themeConfig?.labels?.closingAiResponse || (isEn ? "Compiling final remarks... Thank you for exploring. Here is the formal family sign-off:" : "Menyusun bait akhir penutup... Terima kasih telah berkunjung. Berikut adalah tanda kasih keluarga besar:");

    const host = bgs[0] || {};
    const hostFather = host.father_name || '';
    const hostMother = host.mother_name || '';
    const hasHostParents = hostFather || hostMother;

    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const groomFather = groom.father_name || '';
    const groomMother = groom.mother_name || '';
    const brideFather = bride.father_name || '';
    const brideMother = bride.mother_name || '';

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <div id="closing" className="gpt-section">
            <ChatBubble sender="user" guestName={guestName}>
                <p>{userPrompt}</p>
            </ChatBubble>

            <ChatBubble sender="ai" isTyping={isTyping}>
                <p>{aiResponse}</p>

                <Reveal className="gpt-card gpt-closing-card" delay={100}>
                    <i className="fas fa-heart" style={{ fontSize: '1.8rem', color: '#10a37f', animation: 'gpt-pulse 2s infinite' }} />
                    
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10a37f', margin: '14px 0 10px' }}>
                        {invitation?.closing_title || (isEn ? 'THANK YOU' : 'TERIMA KASIH')}
                    </h4>
                    
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#ececf1', marginBottom: '20px' }}>
                        {invitation?.closing_text || (isEn ? 'It is an honor and a happiness for us if you are willing to attend our happy day.' : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.')}
                    </p>

                    <div className="gpt-closing-families">
                        {isSingleHost ? (
                            hasHostParents && (
                                <div className="gpt-closing-family-block">
                                    <span style={{ color: '#8e8ea0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isEn ? 'Family' : 'Keluarga'}</span>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ececf1', marginTop: '2px' }}>
                                        {isEn ? `Mr. ${hostFather} & Mrs. ${hostMother}` : `Bapak ${hostFather} & Ibu ${hostMother}`}
                                    </p>
                                </div>
                            )
                        ) : (
                            <>
                                {hasGroomParents && (
                                    <div className="gpt-closing-family-block">
                                        <span style={{ color: '#8e8ea0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isEn ? 'Groom Family' : 'Keluarga Pria'}</span>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ececf1', marginTop: '2px' }}>
                                            {isEn ? `Mr. ${groomFather} & Mrs. ${groomMother}` : `Bapak ${groomFather} & Ibu ${groomMother}`}
                                        </p>
                                    </div>
                                )}
                                {hasBrideParents && (
                                    <div className="gpt-closing-family-block" style={{ marginTop: '12px' }}>
                                        <span style={{ color: '#8e8ea0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isEn ? 'Bride Family' : 'Keluarga Wanita'}</span>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ececf1', marginTop: '2px' }}>
                                            {isEn ? `Mr. ${brideFather} & Mrs. ${brideMother}` : `Bapak ${brideFather} & Ibu ${brideMother}`}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="gpt-watermark-row">
                        <p>Made with ❤️ by {brandName}</p>
                    </div>
                </Reveal>
            </ChatBubble>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN THEME EXPORT
   ═══════════════════════════════════════ */
function ViteGptThemeContent({ invitation, sections, brideGrooms, events, wishes, galleries, loveStories, bankAccounts, guest }) {
    const bgs = safeArr(brideGrooms);
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const isEn = activeLanguage === 'en';

    const themeConfig = useMemo(() => {
        return getThemeLabels(invitation?.type || 'wedding', activeLanguage, brideGrooms, invitation);
    }, [invitation?.type, activeLanguage, brideGrooms, invitation]);

    const coupleName = themeConfig.coupleName;

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSectionId, setActiveSectionId] = useState('opening');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
    const slideContainerRef = useRef(null);
    const viewportRef = useRef(null);

    const enableQr = parseBool(invitation?.enable_qr ?? true) && parseBool(invitation?.show_qr_code ?? true);
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    globalShowPhotos = parseBool(invitation?.show_photos ?? true) && !parseBool(invitation?.hide_photos ?? false);
    globalShowAnimations = parseBool(invitation?.show_animations ?? true);

    const enableRsvp = parseBool(invitation?.enable_rsvp ?? true);
    const enableWishes = parseBool(invitation?.enable_wishes ?? true);

    const resolvedSections = useMemo(() => {
        let list = safeArr(sections);
        list = list.filter(s => s.section_key !== 'cover');
        if (!globalShowPhotos) {
            list = list.filter(s => s.section_key !== 'gallery');
        }
        if (!parseBool(invitation?.show_countdown, true)) {
            list = list.filter(s => s.section_key !== 'countdown');
        }
        const hasRsvp = list.some(s => s.section_key === 'rsvp');
        if (hasRsvp) {
            list = list.filter(s => s.section_key !== 'wishes');
        }
        return list.sort((a, b) => {
            if (a.section_key === 'opening') return -1;
            if (b.section_key === 'opening') return 1;
            return (a.sort_order || 0) - (b.sort_order || 0);
        });
    }, [sections, invitation]);

    const randomGalleryPhoto = useMemo(() => {
        const list = safeArr(galleries);
        if (list.length > 0) return getStorageUrl(list[0].image_url);
        return '/images/demo/korea-11-768x512.jpg';
    }, [galleries]);

    const isSlideMode = useMemo(() => {
        const mode = invitation?.layout_mode || 'scroll';
        return ['slide', 'slide-h', 'slide-v'].includes(mode);
    }, [invitation?.layout_mode]);


    const [revealedSections, setRevealedSections] = useState([]);
    const [typingText, setTypingText] = useState('');
    const [isTypingUser, setIsTypingUser] = useState(false);
    const [isTypingAi, setIsTypingAi] = useState(false);
    const typingTimerRef = useRef(null);
    const typingSectionKeyRef = useRef(null);
    const revealedSectionsRef = useRef(revealedSections);

    useEffect(() => {
        revealedSectionsRef.current = revealedSections;
    }, [revealedSections]);

    const typeQuestion = useCallback((sectionKey, callback) => {
        if (typingSectionKeyRef.current === sectionKey) return;
        typingSectionKeyRef.current = sectionKey;

        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        
        const getQuestion = (key) => {
            const questions = {
                opening: themeConfig?.labels?.openingUserPrompt,
                bride_groom: themeConfig?.labels?.brideGroomUserPrompt,
                countdown: themeConfig?.labels?.countdownUserPrompt,
                love_story: themeConfig?.labels?.loveStoryUserPrompt,
                event: themeConfig?.labels?.eventUserPrompt,
                livestream: themeConfig?.labels?.livestreamUserPrompt,
                gallery: themeConfig?.labels?.galleryUserPrompt,
                bank: themeConfig?.labels?.bankUserPrompt,
                rsvp: themeConfig?.labels?.rsvpUserPrompt,
                wishes: themeConfig?.labels?.wishesUserPrompt,
                closing: themeConfig?.labels?.closingUserPrompt
            };
            return questions[key] || '';
        };

        const text = getQuestion(sectionKey);
        if (!text) {
            setRevealedSections(prev => prev.includes(sectionKey) ? prev : [...prev, sectionKey]);
            typingSectionKeyRef.current = null;
            if (callback) callback();
            return;
        }

        let currentIdx = 0;
        setIsTypingUser(true);
        setTypingText('');

        typingTimerRef.current = setInterval(() => {
            currentIdx++;
            setTypingText(text.substring(0, currentIdx));
            if (currentIdx >= text.length) {
                clearInterval(typingTimerRef.current);
                setTimeout(() => {
                    setTypingText('');
                    setIsTypingUser(false);
                    setRevealedSections(prev => {
                        if (prev.includes(sectionKey)) return prev;
                        return [...prev, sectionKey];
                    });
                    setIsTypingAi(true);
                    setTimeout(() => {
                        setIsTypingAi(false);
                        typingSectionKeyRef.current = null;
                        if (callback) callback();
                    }, 1200);
                }, 400);
            }
        }, 30);
    }, [themeConfig]);

    // Cleanup typing timer on unmount
    useEffect(() => {
        return () => {
            if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        };
    }, []);



    // Initial typing trigger
    useEffect(() => {
        if (!isOpened) return;
        if (revealedSections.length === 0 && !isTypingUser && !isTypingAi) {
            const firstSection = resolvedSections[0];
            if (firstSection) {
                typeQuestion(firstSection.section_key);
            }
        }
    }, [isOpened, revealedSections.length, resolvedSections, isTypingUser, isTypingAi, typeQuestion]);



    const layoutMode = invitation?.layout_mode || 'scroll';

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, [isPlaying]);

    const handleOpen = () => {
        setIsOpened(true);
        setAutoScrollEnabled(true);
        if (invitation?.music_autoplay !== false) {
            const audio = audioRef.current;
            if (audio) {
                audio.play().then(() => setIsPlaying(true)).catch(() => {});
            }
        }
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    // Pause auto scroll on user manual scroll/swipe
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
                e.target.closest('input') ||
                e.target.closest('textarea') ||
                e.target.closest('select') ||
                e.target.closest('.gpt-floating-actions') ||
                e.target.closest('.gpt-sidebar-drawer') ||
                e.target.closest('.gpt-top-navbar') ||
                e.target.closest('.gpt-stories-tray')
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

    // Auto Scroll logic
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled || isTypingUser || isTypingAi) return;
        let timer = null;

        if (isSlideMode) {
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) return 0;
                    return prev + 1;
                });
            }, 3000);
        } else {
            const viewport = viewportRef.current;
            if (viewport) {
                timer = setInterval(() => {
                    const prevScrollTop = viewport.scrollTop;
                    viewport.scrollTop += 1.5; // Slightly faster for smoother visual glide
                    
                    // If scrollTop did not change, we have reached the bottom or it cannot scroll
                    if (Math.abs(viewport.scrollTop - prevScrollTop) < 0.1) {
                        const isBottom = viewport.scrollHeight - viewport.scrollTop <= viewport.clientHeight + 25;
                        if (isBottom) {
                            const isLastSectionRevealed = revealedSections.includes(resolvedSections[resolvedSections.length - 1]?.section_key);
                            if (isLastSectionRevealed) {
                                setAutoScrollEnabled(false);
                            } else if (!isTypingUser && !isTypingAi && !typingSectionKeyRef.current) {
                                // Trigger typing the next section immediately when hit the bottom of currently revealed sections!
                                const lastKey = revealedSections[revealedSections.length - 1];
                                const lastIdx = resolvedSections.findIndex(s => s.section_key === lastKey);
                                if (lastIdx !== -1 && lastIdx < resolvedSections.length - 1) {
                                    const nextSection = resolvedSections[lastIdx + 1];
                                    typeQuestion(nextSection.section_key);
                                }
                            }
                        }
                    }
                }, 25);
            }
        }

        return () => { if (timer) clearInterval(timer); };
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections, isTypingUser, isTypingAi, revealedSections, typeQuestion]);

    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

    const scrollToKey = useCallback((key) => {
        const viewport = viewportRef.current;
        const el = viewport?.querySelector(`#${key}`);
        if (viewport && el) {
            const topPos = el.offsetTop - 120;
            viewport.scrollTo({
                top: topPos,
                behavior: 'smooth'
            });
        }
    }, []);

    // Scroll viewport to top of the latest section on new updates
    useEffect(() => {
        if (!isOpened) return;
        const latestKey = revealedSections[revealedSections.length - 1];
        if (latestKey) {
            scrollToKey(latestKey);
        }
    }, [revealedSections.length, isOpened, scrollToKey]);

    const jumpToSection = (idx, key) => {
        setSidebarOpen(false); // Auto close sidebar
        setAutoScrollEnabled(false);

        if (isSlideMode) {
            setActiveSlideIdx(idx);
            return;
        }

        // Scroll mode typing action
        if (revealedSections.includes(key)) {
            scrollToKey(key);
            return;
        }

        // Instantly reveal all sections prior to clicked key
        setRevealedSections(prev => {
            const nextList = [...prev];
            for (let i = 0; i < idx; i++) {
                const sKey = resolvedSections[i].section_key;
                if (!nextList.includes(sKey)) nextList.push(sKey);
            }
            return nextList;
        });

        // Cancel running typing animations
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTypingUser(false);
        setIsTypingAi(false);
        setTypingText('');
        typingSectionKeyRef.current = null;

        // Trigger typing flow for requested key and scroll to it when loaded
        typeQuestion(key, () => {
            setTimeout(() => scrollToKey(key), 100);
        });
    };

    // Scrollspy setup for bottom navigation in scroll mode
    // Scrollspy setup for bottom navigation and scroll-triggered progression in scroll mode
    useEffect(() => {
        if (!isOpened || isSlideMode) return;
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleScroll = () => {
            // 1. Scrollspy active section detection
            const keys = resolvedSections.map(s => s.section_key);
            let currentActive = keys[0] || 'opening';

            for (let i = 0; i < keys.length; i++) {
                const el = viewport.querySelector(`#${keys[i]}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // Detect if the section top has scrolled near the top edge of screen
                    if (rect.top <= 250) {
                        currentActive = keys[i];
                    }
                }
            }
            setActiveSectionId(currentActive);

            // 2. Scroll-triggered next section typing trigger
            if (revealedSections.length === 0 || isTypingUser || isTypingAi || typingSectionKeyRef.current) return;

            const lastKey = revealedSections[revealedSections.length - 1];
            const lastIdx = resolvedSections.findIndex(s => s.section_key === lastKey);

            if (lastIdx !== -1 && lastIdx < resolvedSections.length - 1) {
                const remainingScroll = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
                if (remainingScroll <= 280) { // Trigger when scrolled near the end (280px threshold)
                    const nextSection = resolvedSections[lastIdx + 1];
                    typeQuestion(nextSection.section_key);
                }
            }
        };

        viewport.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections, revealedSections, isTypingUser, isTypingAi, typeQuestion]);

    // Swipe gestures inside slide layouts
    const touchStartRef = useRef(null);
    const handleTouchStart = (e) => {
        if (!isSlideMode) return;
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        if (!isSlideMode || !touchStartRef.current) return;
        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (layoutMode === 'slide-h' || layoutMode === 'slide') {
                if (deltaX < 0) nextSlide();
                else prevSlide();
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
            if (layoutMode === 'slide-v') {
                if (deltaY < 0) nextSlide();
                else prevSlide();
            }
        }
        touchStartRef.current = null;
    };

    // Sync slide index with activeSectionId
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            setActiveSectionId(resolvedSections[activeSlideIdx].section_key);
        }
    }, [activeSlideIdx, isSlideMode, resolvedSections]);

    // Trigger typing automatically on slide index change for slide mode
    useEffect(() => {
        if (!isOpened || !isSlideMode) return;
        const currentSection = resolvedSections[activeSlideIdx];
        if (!currentSection) return;

        const key = currentSection.section_key;

        // If this section is not revealed yet, trigger typing animation!
        if (!revealedSectionsRef.current.includes(key)) {
            // Cancel running typing animations
            if (typingTimerRef.current) clearInterval(typingTimerRef.current);
            setIsTypingUser(false);
            setIsTypingAi(false);
            setTypingText('');
            typingSectionKeyRef.current = null;

            // Set preceding sections to revealed immediately so navigation is correct
            setRevealedSections(prev => {
                const nextList = [...prev];
                for (let i = 0; i < activeSlideIdx; i++) {
                    const sKey = resolvedSections[i].section_key;
                    if (!nextList.includes(sKey)) nextList.push(sKey);
                }
                return nextList;
            });

            // Start typing
            typeQuestion(key);
        }
    }, [activeSlideIdx, isSlideMode, resolvedSections, isOpened, typeQuestion]);

    const renderSection = (key) => {
        const isLatest = revealedSections[revealedSections.length - 1] === key;
        const isTyping = isLatest && isTypingAi;
        const props = { invitation, brideGrooms, events, wishes, galleries, loveStories, bankAccounts, guest, enableRsvp, enableWishes, language: activeLanguage, fallbackPhoto: randomGalleryPhoto, isTyping, themeConfig };
        switch (key) {
            case 'opening': return <OpeningSection key={key} {...props} />;
            case 'bride_groom': return <BrideGroomSection key={key} {...props} />;
            case 'countdown': return <CountdownSection key={key} {...props} />;
            case 'love_story': return <LoveStorySection key={key} {...props} />;
            case 'event': return <EventSection key={key} {...props} />;
            case 'livestream': return <LiveStreamingSection key={key} {...props} />;
            case 'gallery': return <GallerySection key={key} {...props} />;
            case 'bank': return <BankSection key={key} {...props} />;
            case 'rsvp':
            case 'wishes': return <UnifiedFormSection key={key} {...props} />;
            case 'closing': return <ClosingSection key={key} {...props} />;
            default: return null;
        }
    };

    const googleFontLink = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Great+Vibes&display=swap';

    // Side chat topic logs mapping
    const recentChatTopics = {
        opening: isEn ? 'Greetings Log' : 'Bait Salam & Greetings',
        bride_groom: themeConfig.isSingleHost ? (isEn ? 'Host Profile Log' : 'Profil Penyelenggara') : (isEn ? 'Groom & Bride bio' : 'Profil Mempelai Pengantin'),
        countdown: isEn ? 'Countdown parameters' : 'Hitung Mundur Acara',
        love_story: themeConfig.isSingleHost ? (isEn ? 'Journey prompt parameters' : 'Kronologi Perjalanan') : (isEn ? 'Love prompt parameters' : 'Kronologi Pertemuan'),
        event: isEn ? 'Event Koordinat' : 'Detail Agenda Acara',
        livestream: isEn ? 'Virtual broadcast stream' : 'Saluran Siaran Virtual',
        gallery: themeConfig.isSingleHost ? (isEn ? 'Photo assets' : 'Galeri Foto') : (isEn ? 'Photo generation assets' : 'Galeri Potret Prewedding'),
        rsvp: isEn ? 'Guest RSVP check-in' : 'Konfirmasi RSVP Kehadiran',
        bank: isEn ? 'Gift registry logs' : 'Dompet Kado & Rekening',
        closing: isEn ? 'Concluding remarks' : 'Terima Kasih & Penutup'
    };

    return (
        <ErrorBoundary>
            <link href={googleFontLink} rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />

            {/* Audio background player */}
            {invitation?.music_url && (
                <audio ref={audioRef} src={invitation.music_url} loop />
            )}

            <div className={`gpt-main-wrapper ${!globalShowAnimations ? 'gpt-no-animations' : ''}`}>
                {/* ══════ COVER PANEL ══════ */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    language={activeLanguage}
                    fallbackPhoto={randomGalleryPhoto}
                    themeConfig={themeConfig}
                />

                {/* ══════ CHAT WORKSPACE (OPENED) ══════ */}
                {isOpened && (
                    <div className="gpt-app-container">
                        {/* Simulated ViteGPT Side Navigation Drawer */}
                        <div className={`gpt-sidebar-drawer ${sidebarOpen ? 'is-open' : ''}`}>
                            <div className="gpt-sidebar-header">
                                <button type="button" className="gpt-sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                                    <i className="fas fa-times" />
                                </button>
                                <button type="button" className="gpt-new-chat-btn" onClick={() => jumpToSection(0, 'opening')}>
                                    <i className="far fa-edit" />
                                    <span>{themeConfig?.labels?.sidebarNewChat || (isEn ? 'New Chat' : 'Obrolan Baru')}</span>
                                </button>
                            </div>

                            {/* Search Chats Input */}
                            <div className="gpt-sidebar-search">
                                <i className="fas fa-search" />
                                <input type="text" placeholder={themeConfig?.labels?.searchChats || (isEn ? "Search chats..." : "Cari obrolan...")} disabled />
                            </div>

                            {/* Sidebar links lists */}
                            <div className="gpt-sidebar-menu">
                                {/* Dynamic Recents Chat lists linked to Sections! */}
                                <div className="gpt-sidebar-divider" style={{ marginTop: '4px' }}>{themeConfig?.labels?.sidebarRecents || (isEn ? 'RECENTS' : 'RIWAYAT OBROLAN')}</div>
                                <div className="gpt-sidebar-scroll">
                                    {resolvedSections.map((s, idx) => {
                                        const topic = recentChatTopics[s.section_key] || s.section_name;
                                        const isTabActive = activeSectionId === s.section_key;
                                        return (
                                            <div
                                                key={s.section_key}
                                                className={`gpt-sidebar-chat-link ${isTabActive ? 'is-active' : ''}`}
                                                onClick={() => jumpToSection(idx, s.section_key)}
                                            >
                                                <i className="far fa-comment-alt" />
                                                <span>{topic}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sidebar bottom guest account profile card */}
                            <div className="gpt-sidebar-footer">
                                <div className="gpt-sidebar-user-avatar">
                                    {activeGuest.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="gpt-sidebar-user-info">
                                    <strong>{activeGuest.name}</strong>

                                </div>
                            </div>
                        </div>

                        {/* Sidebar overlay dimmer on mobile */}
                        {sidebarOpen && (
                            <div className="gpt-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
                        )}

                        {/* Main workspace frame */}
                        <div className="gpt-workspace-frame">
                            {/* ViteGPT Top Navigation Bar */}
                            <div className="gpt-top-navbar">
                                <button type="button" className="gpt-hamburger-btn" onClick={() => setSidebarOpen(true)}>
                                    <i className="fas fa-bars" />
                                </button>

                                <div className="gpt-model-selector-row">
                                    <strong>{themeConfig?.labels?.chatTitle || `${isEn ? 'Event of' : 'Acara'} ${coupleName}`}</strong>
                                </div>

                                <div className="gpt-top-nav-actions" style={{ marginLeft: 'auto' }}>
                                    {/* Upgrade buttons removed */}
                                </div>
                            </div>

                            {/* Quick Tabs Stories Tray */}
                            <StoriesTray
                                resolvedSections={resolvedSections}
                                activeSectionId={activeSectionId}
                                isSlideMode={isSlideMode}
                                activeSlideIdx={activeSlideIdx}
                                onJump={jumpToSection}
                                language={activeLanguage}
                                sidebarOpen={sidebarOpen}
                                themeConfig={themeConfig}
                            />

                            {/* Floating control buttons */}
                            <div className="gpt-floating-actions">
                                <button type="button" className="gpt-btn-float" onClick={toggleFullscreen} title="Toggle Fullscreen">
                                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                                </button>
                                <button type="button" className={`gpt-btn-float ${autoScrollEnabled ? 'active' : ''}`} onClick={() => setAutoScrollEnabled(!autoScrollEnabled)} title="Auto Scroll">
                                    <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-arrow-down"} />
                                </button>
                                {invitation?.music_url && (
                                    <button type="button" className={`gpt-btn-float gpt-music-btn-float ${isPlaying ? 'playing' : ''}`} onClick={toggleMusic} title="Toggle Music">
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
                                )}
                                {enableQr && activeGuest && (
                                    <button type="button" className="gpt-btn-float" onClick={() => setShowQr(true)} title="QR Code Check-in">
                                        <i className="fas fa-qrcode" />
                                    </button>
                                )}
                            </div>

                            {/* Main Chat Flow scroll area */}
                            <div ref={viewportRef} className="gpt-chat-scroller-viewport">
                                {isSlideMode ? (
                                    <div
                                        ref={slideContainerRef}
                                        className={`gpt-slide-container layout-${layoutMode}`}
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                        style={{ height: '100%' }}
                                    >
                                        {resolvedSections.map((s, idx) => {
                                            const isActive = idx === activeSlideIdx;
                                            const isRevealed = revealedSections.includes(s.section_key);
                                            return (
                                                <div
                                                    key={s.section_key}
                                                    className={`gpt-slide-item ${isActive ? 'is-active' : ''}`}
                                                >
                                                    <div className="gpt-slide-scroll-box" style={{ paddingBottom: '80px' }}>
                                                        {isRevealed ? renderSection(s.section_key) : null}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="gpt-scroll-container" style={{ paddingBottom: '100px' }}>
                                        {resolvedSections
                                            .filter(s => revealedSections.includes(s.section_key))
                                            .map(s => renderSection(s.section_key))}
                                    </div>
                                )}
                            </div>

                            {/* Simulated static bottom chat input */}
                            <div className="gpt-bottom-input-bar">
                                <div className="gpt-bottom-input-row-sim">
                                    <i className="fas fa-plus" style={{ opacity: 0.5 }} />
                                    <div className={`gpt-input-field-sim ${isTypingUser ? 'is-typing' : ''}`}>
                                        {isTypingUser ? (
                                            <>
                                                {typingText}
                                                <span className="gpt-cursor">|</span>
                                            </>
                                        ) : (
                                            themeConfig?.labels?.askFollowUp || (isEn ? "Ask follow up wedding question..." : "Kirim pertanyaan lanjutan tentang pernikahan...")
                                        )}
                                    </div>
                                    <div className="gpt-input-actions-right">
                                        <i className="fas fa-microphone" style={{ opacity: 0.5, fontSize: 13 }} />
                                        <div className="gpt-circular-audio-wave">
                                            <i className="fas fa-volume-up" style={{ color: '#1f1f1f', fontSize: 11 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic QR Code Modal */}
                        {enableQr && showQr && activeGuest && (
                            <div className="gpt-modal-overlay" onClick={() => setShowQr(false)}>
                                <div className="gpt-modal-content" style={{ maxWidth: '340px', padding: '24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ececf1' }}>QR Check-in</h3>
                                        <button type="button" onClick={() => setShowQr(false)} style={{ border: 'none', background: 'transparent', color: '#ececf1', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fas fa-times" /></button>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#8e8ea0', lineHeight: 1.4, marginBottom: '16px' }}>
                                        {isEn 
                                            ? 'Show this QR Code to the organizing committee to record your attendance at the venue.' 
                                            : 'Tunjukkan QR Code ini kepada panitia untuk mencatat presensi kehadiran Anda di lokasi acara.'}
                                    </p>
                                    <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px' }}>
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=10a37f&data=${encodeURIComponent(route('invitation.checkin', { slug: invitation.slug, to: activeGuest.slug }))}`}
                                            alt="QR Code Presensi"
                                            style={{ display: 'block', width: '200px', height: '200px' }}
                                        />
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ececf1' }}>{activeGuest.name}</h4>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}

export default function ViteGptTheme(props) {
    return <ViteGptThemeContent {...props} />;
}
