import React from 'react';
import HeadingRenderer from './heading/HeadingRenderer';
import HeadingEditor from './heading/HeadingEditor';
import ImageRenderer from './image/ImageRenderer';
import ImageEditor from './image/ImageEditor';
import ButtonRenderer from './button/ButtonRenderer';
import ButtonEditor from './button/ButtonEditor';

// New Basic Widgets
import TextEditorRenderer from './text-editor/TextEditorRenderer';
import TextEditorEditor from './text-editor/TextEditorEditor';
import DividerRenderer from './divider/DividerRenderer';
import DividerEditor from './divider/DividerEditor';
import SpacerRenderer from './spacer/SpacerRenderer';
import SpacerEditor from './spacer/SpacerEditor';
import IconRenderer from './icon/IconRenderer';
import IconEditor from './icon/IconEditor';
import VideoRenderer from './video/VideoRenderer';
import VideoEditor from './video/VideoEditor';
import MapRenderer from './map/MapRenderer';
import MapEditor from './map/MapEditor';

// New Invitation-specific Custom Widgets
import GuestNameRenderer from './guest-name/GuestNameRenderer';
import GuestNameEditor from './guest-name/GuestNameEditor';
import CountdownRenderer from './countdown/CountdownRenderer';
import CountdownEditor from './countdown/CountdownEditor';
import RsvpFormRenderer from './rsvp-form/RsvpFormRenderer';
import RsvpFormEditor from './rsvp-form/RsvpFormEditor';
import GalleryRenderer from './gallery/GalleryRenderer';
import GalleryEditor from './gallery/GalleryEditor';
import DigitalEnvelopeRenderer from './digital-envelope/DigitalEnvelopeRenderer';
import DigitalEnvelopeEditor from './digital-envelope/DigitalEnvelopeEditor';
import LoveStoryRenderer from './love-story/LoveStoryRenderer';
import LoveStoryEditor from './love-story/LoveStoryEditor';
import MusicPlayerRenderer from './music-player/MusicPlayerRenderer';
import MusicPlayerEditor from './music-player/MusicPlayerEditor';
import BrideGroomRenderer from './bride-groom/BrideGroomRenderer';
import BrideGroomEditor from './bride-groom/BrideGroomEditor';
import EventDetailsRenderer from './event-details/EventDetailsRenderer';
import EventDetailsEditor from './event-details/EventDetailsEditor';

// New custom widgets (1, 2, 3, 5)
import WishesListRenderer from './wishes-list/WishesListRenderer';
import WishesListEditor from './wishes-list/WishesListEditor';
import LivestreamRenderer from './livestream/LivestreamRenderer';
import LivestreamEditor from './livestream/LivestreamEditor';
import DresscodeRenderer from './dresscode/DresscodeRenderer';
import DresscodeEditor from './dresscode/DresscodeEditor';
import TurutMengundangRenderer from './turut-mengundang/TurutMengundangRenderer';
import TurutMengundangEditor from './turut-mengundang/TurutMengundangEditor';


// Registry containing metadata, renderers, and editor panels for all widgets
export const widgetRegistry = {
    heading: {
        type: 'heading',
        name: 'Heading / Judul',
        icon: 'Heading',
        category: 'basic',
        defaultSettings: {
            text: 'Masukkan Judul Baru',
            tag: 'h2',
            alignment: 'center',
            textColor: '#1f2937',
            fontSize: '32px',
            fontFamily: 'default',
            fontWeight: 'bold',
            lineHeight: '1.2'
        },
        Renderer: HeadingRenderer,
        Editor: HeadingEditor
    },
    image: {
        type: 'image',
        name: 'Gambar',
        icon: 'Image',
        category: 'basic',
        defaultSettings: {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
            alt: 'Wedding Image',
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            alignment: 'center'
        },
        Renderer: ImageRenderer,
        Editor: ImageEditor
    },
    button: {
        type: 'button',
        name: 'Tombol',
        icon: 'MousePointerClick',
        category: 'basic',
        defaultSettings: {
            text: 'Klik di Sini',
            url: '#',
            alignment: 'center',
            backgroundColor: '#E5654B',
            textColor: '#ffffff',
            borderRadius: '8px',
            paddingX: '24px',
            paddingY: '12px',
            fontSize: '14px',
            isExternal: false
        },
        Renderer: ButtonRenderer,
        Editor: ButtonEditor
    },
    'text-editor': {
        type: 'text-editor',
        name: 'Paragraph / Editor Teks',
        icon: 'TextEditor',
        category: 'basic',
        defaultSettings: {
            text: '<p style="text-align: center;">Tulis paragraf kustom di sini. Tambahkan detail informasi acara Anda secara lengkap.</p>',
            alignment: 'center',
            textColor: '#4b5563',
            fontSize: '16px',
            fontWeight: 'normal',
            lineHeight: '1.6'
        },
        Renderer: TextEditorRenderer,
        Editor: TextEditorEditor
    },
    divider: {
        type: 'divider',
        name: 'Divider / Garis Pemisah',
        icon: 'Divider',
        category: 'basic',
        defaultSettings: {
            lineStyle: 'solid',
            color: '#e5e7eb',
            weight: '2px',
            width: '100%',
            alignment: 'center',
            gapTop: '15',
            gapBottom: '15'
        },
        Renderer: DividerRenderer,
        Editor: DividerEditor
    },
    spacer: {
        type: 'spacer',
        name: 'Spacer / Jarak Kosong',
        icon: 'Spacer',
        category: 'basic',
        defaultSettings: {
            height: '30'
        },
        Renderer: SpacerRenderer,
        Editor: SpacerEditor
    },
    icon: {
        type: 'icon',
        name: 'Ikon',
        icon: 'Icon',
        category: 'basic',
        defaultSettings: {
            icon: 'Heart',
            alignment: 'center',
            color: '#E5654B',
            size: '32',
            bgType: 'none',
            bgColor: 'transparent',
            padding: '10'
        },
        Renderer: IconRenderer,
        Editor: IconEditor
    },
    video: {
        type: 'video',
        name: 'Video Sematan',
        icon: 'Video',
        category: 'basic',
        defaultSettings: {
            videoType: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            alignment: 'center',
            width: '100%',
            aspectRatio: '16/9'
        },
        Renderer: VideoRenderer,
        Editor: VideoEditor
    },
    map: {
        type: 'map',
        name: 'Peta Lokasi (Maps)',
        icon: 'Map',
        category: 'basic',
        defaultSettings: {
            address: 'Jakarta, Indonesia',
            height: '300',
            zoom: 14
        },
        Renderer: MapRenderer,
        Editor: MapEditor
    },
    'guest-name': {
        type: 'guest-name',
        name: 'Nama Tamu Undangan',
        icon: 'GuestName',
        category: 'custom',
        defaultSettings: {
            prefix: 'Kepada Yth. Bapak/Ibu/Saudara/i:',
            suffix: 'Di Tempat',
            placeholderName: 'Nama Tamu Undangan',
            alignment: 'center',
            textColor: '#1f2937',
            prefixColor: '#6b7280',
            nameFontSize: '24px',
            labelFontSize: '14px',
            fontWeight: 'bold',
            cardBg: 'rgba(0, 0, 0, 0.02)',
            border: false,
            borderColor: '#e5e7eb',
            borderRadius: '12px'
        },
        Renderer: GuestNameRenderer,
        Editor: GuestNameEditor
    },
    countdown: {
        type: 'countdown',
        name: 'Hitung Mundur Acara',
        icon: 'Countdown',
        category: 'custom',
        defaultSettings: {
            targetDate: '2026-12-31T23:59:59',
            alignment: 'center',
            numberColor: '#E5654B',
            labelColor: '#4b5563',
            boxBg: '#faf9f6',
            boxBorderColor: '#e5e7eb',
            borderRadius: '12px'
        },
        Renderer: CountdownRenderer,
        Editor: CountdownEditor
    },
    'rsvp-form': {
        type: 'rsvp-form',
        name: 'Formulir Kehadiran RSVP',
        icon: 'RsvpForm',
        category: 'custom',
        defaultSettings: {
            buttonText: 'Kirim Konfirmasi Kehadiran',
            buttonBg: '#E5654B',
            buttonTextColor: '#ffffff',
            labelColor: '#374151',
            formBg: '#ffffff',
            formBorderColor: '#e5e7eb',
            borderRadius: '16px',
            padding: '20'
        },
        Renderer: RsvpFormRenderer,
        Editor: RsvpFormEditor
    },
    gallery: {
        type: 'gallery',
        name: 'Galeri Foto prewedding',
        icon: 'Gallery',
        category: 'custom',
        defaultSettings: {
            layout: 'grid',
            columns: { desktop: 3, tablet: 2, mobile: 1 },
            gap: { desktop: '16px', tablet: '12px', mobile: '8px' },
            borderRadius: '8px',
            aspectRatio: 'square',
            images: [
                { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', caption: 'Moment Indah' },
                { id: '2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', caption: 'Kebersamaan Kita' },
                { id: '3', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', caption: 'Janji Suci' },
                { id: '4', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800', caption: 'Kisah Kasih' }
            ]
        },
        Renderer: GalleryRenderer,
        Editor: GalleryEditor
    },
    'digital-envelope': {
        type: 'digital-envelope',
        name: 'Kado / Amplop Digital',
        icon: 'DigitalEnvelope',
        category: 'custom',
        defaultSettings: {
            title: 'Kado Digital / Amplop Digital',
            description: 'Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, silakan melalui rekening/dompet digital berikut:',
            accounts: [
                { id: '1', provider: 'Bank BCA', number: '7141234567', holder: 'Ahmad Rafli', qrUrl: '' },
                { id: '2', provider: 'Bank Mandiri', number: '1440012345678', holder: 'Siti Aminah', qrUrl: '' }
            ],
            alignment: 'center',
            containerBg: '#f9fafb',
            cardBg: '#ffffff',
            cardTextColor: '#1f2937',
            cardBorderColor: '#e5e7eb',
            buttonBg: '#E5654B',
            buttonTextColor: '#ffffff',
            borderRadius: '16px'
        },
        Renderer: DigitalEnvelopeRenderer,
        Editor: DigitalEnvelopeEditor
    },
    'love-story': {
        type: 'love-story',
        name: 'Timeline Kisah Cinta',
        icon: 'LoveStory',
        category: 'custom',
        defaultSettings: {
            title: 'Kisah Cinta Kami',
            stories: [
                { id: '1', date: '15 Januari 2020', title: 'Pertama Bertemu', desc: 'Awal mula pertemuan kami yang tidak disengaja di sebuah kedai kopi. Tatap mata pertama yang menumbuhkan rasa ketertarikan.', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500' },
                { id: '2', date: '20 Agustus 2022', title: 'Menjalin Komitmen', desc: 'Setelah sekian lama saling mengenal, kami memutuskan untuk berkomitmen melangkah bersama dalam ikatan kasih yang lebih serius.', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500' },
                { id: '3', date: '12 Desember 2025', title: 'Lamaran (Engagement)', desc: 'Dengan restu kedua orang tua, kami mengikat janji suci pertunangan untuk bersiap melangkah ke jenjang pernikahan.', imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500' }
            ],
            headerColor: '#1f2937',
            timelineColor: '#E5654B',
            nodeBg: '#ffffff',
            cardBg: '#ffffff',
            textColor: '#374151',
            dateColor: '#E5654B',
            titleColor: '#1f2937'
        },
        Renderer: LoveStoryRenderer,
        Editor: LoveStoryEditor
    },
    'music-player': {
        type: 'music-player',
        name: 'Pemutar Musik Latar',
        icon: 'MusicPlayer',
        category: 'custom',
        defaultSettings: {
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            songTitle: 'Beautiful Wedding Piano',
            autoplay: false,
            playerType: 'floating',
            floatPosition: 'bottom-right',
            primaryColor: '#E5654B',
            iconColor: '#ffffff'
        },
        Renderer: MusicPlayerRenderer,
        Editor: MusicPlayerEditor
    },
    'bride-groom': {
        type: 'bride-groom',
        name: 'Kedua Mempelai',
        icon: 'BrideGroom',
        category: 'custom',
        defaultSettings: {
            sourceType: 'static',
            layoutModel: 'columns',
            primaryColor: '#E5654B',
            nameColor: '#1f2937',
            parentColor: '#6b7280',
            textColor: '#374151',
            cardBg: '#ffffff',
            borderRadius: '16px',
            groom: {
                nickname: 'Ahmad',
                full_name: 'Ahmad Rafli, S.Kom.',
                father_name: 'Heri Susanto',
                mother_name: 'Sri Wahyuni',
                instagram: 'ahmad.rafli',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
            },
            bride: {
                nickname: 'Siti',
                full_name: 'Siti Aminah, S.E.',
                father_name: 'M. Yusuf',
                mother_name: 'Nur Aini',
                instagram: 'siti.aminah',
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
            }
        },
        Renderer: BrideGroomRenderer,
        Editor: BrideGroomEditor
    },
    'event-details': {
        type: 'event-details',
        name: 'Rangkaian Acara',
        icon: 'EventDetails',
        category: 'custom',
        defaultSettings: {
            sourceType: 'static',
            layoutModel: 'grid',
            primaryColor: '#E5654B',
            cardBg: '#ffffff',
            titleColor: '#1f2937',
            textColor: '#4b5563',
            buttonBg: '#E5654B',
            buttonTextColor: '#ffffff',
            borderRadius: '16px',
            events: [
                { id: '1', name: 'Akad Nikah', date: 'Kamis, 31 Desember 2026', time: '08:00 - 10:00 WIB', venueName: 'Masjid Agung Al-Hikmah', address: 'Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan', mapUrl: 'https://maps.google.com' },
                { id: '2', name: 'Resepsi Pernikahan', date: 'Kamis, 31 Desember 2026', time: '11:00 - 16:00 WIB', venueName: 'Gedung Serbaguna Jakarta', address: 'Jl. Jenderal Sudirman Kav. 21, Jakarta Pusat', mapUrl: 'https://maps.google.com' }
            ]
        },
        Renderer: EventDetailsRenderer,
        Editor: EventDetailsEditor
    },
    'wishes-list': {
        type: 'wishes-list',
        name: 'Buku Tamu / Ucapan',
        icon: 'WishesList',
        category: 'custom',
        defaultSettings: {
            title: 'Ucapan & Doa Restu',
            description: 'Berikan ucapan selamat dan doa restu terbaik Anda untuk kedua mempelai.',
            placeholderName: 'Nama Anda',
            placeholderMessage: 'Tulis ucapan dan doa...',
            buttonText: 'Kirim Ucapan',
            buttonBg: '#E5654B',
            buttonTextColor: '#ffffff',
            cardBg: '#ffffff',
            borderRadius: '16px'
        },
        Renderer: WishesListRenderer,
        Editor: WishesListEditor
    },
    'livestream': {
        type: 'livestream',
        name: 'Siaran Langsung (Live)',
        icon: 'Livestream',
        category: 'custom',
        defaultSettings: {
            title: 'Siaran Langsung',
            description: 'Saksikan prosesi pernikahan kami secara virtual melalui siaran langsung.',
            platform: 'youtube',
            url: 'https://youtube.com',
            date: 'Kamis, 31 Desember 2026',
            time: '08:00 WIB - Selesai',
            buttonText: 'Nonton Live Streaming',
            buttonBg: '#E5654B',
            buttonTextColor: '#ffffff',
            cardBg: '#ffffff',
            borderRadius: '16px'
        },
        Renderer: LivestreamRenderer,
        Editor: LivestreamEditor
    },
    'dresscode': {
        type: 'dresscode',
        name: 'Panduan Dresscode',
        icon: 'Dresscode',
        category: 'custom',
        defaultSettings: {
            title: 'Dresscode / Tata Busana',
            description: 'Demi kenyamanan bersama, para tamu undangan dihimbau untuk mengenakan pakaian yang sopan dengan nuansa warna berikut:',
            colors: ['#F5EBE0', '#D6CCC2', '#E3D5CA', '#D5BDAF', '#4A3E3D'],
            alignment: 'center',
            cardBg: '#faf9f6',
            borderRadius: '12px'
        },
        Renderer: DresscodeRenderer,
        Editor: DresscodeEditor
    },
    'turut-mengundang': {
        type: 'turut-mengundang',
        name: 'Turut Mengundang',
        icon: 'TurutMengundang',
        category: 'custom',
        defaultSettings: {
            title: 'Turut Mengundang',
            names: 'Keluarga Besar Bpk. Ahmad (Jakarta)\nKeluarga Besar Ibu Siti (Bandung)\nSahabat & Rekan Kerja',
            alignment: 'center',
            textColor: '#4b5563',
            titleColor: '#1f2937'
        },
        Renderer: TurutMengundangRenderer,
        Editor: TurutMengundangEditor
    }
};

export const getWidgetMeta = (type) => widgetRegistry[type] || null;

