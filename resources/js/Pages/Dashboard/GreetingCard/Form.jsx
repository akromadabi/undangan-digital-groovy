import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useCallback, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import axios from 'axios';

const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.8 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
);

/* ─────────────────────────────────────
   PREVIEW COMPONENTS
───────────────────────────────────── */

function StillWithYouPreview({ data }) {
    const { recipientName, senderName, type, messages, photoUrl } = data;
    const typeMap = {
        anniversary: 'Happy Anniversary 💑',
        birthday:    'Happy Birthday 🎂',
        graduation:  'Selamat Wisuda 🎓',
        wedding:     'Selamat Menikah 💍',
    };
    const greeting = typeMap[type] || 'Selamat 💫';

    return (
        <div className="relative w-full h-full overflow-hidden rounded-xl" style={{
            background: 'linear-gradient(135deg, #0d0915 0%, #1b102b 50%, #09090b 100%)',
            minHeight: '480px',
        }}>
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(circle at 50% 30%, rgba(255,101,163,0.12) 0%, transparent 70%)',
            }} />

            {/* Floating hearts animation */}
            {['💗', '💖', '✨', '💕', '🌸'].map((h, i) => (
                <div key={i} className="absolute text-xl pointer-events-none select-none" style={{
                    left: `${15 + i * 18}%`,
                    top: `${Math.sin(i) * 15 + 10}%`,
                    opacity: 0.35,
                    transform: `scale(${0.7 + i * 0.1})`,
                    animation: `float${i} 4s ease-in-out infinite`,
                    animationDelay: `${i * 0.7}s`,
                }}>{h}</div>
            ))}

            {/* Photo */}
            {photoUrl && (
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full overflow-hidden border-2 border-[#ff65a3]/40 shadow-lg shadow-pink-900/30">
                    <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-8 text-center" style={{ minHeight: '480px' }}>
                {/* Greeting type */}
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff65a3]/70 mb-3">
                    {greeting}
                </div>

                {/* Recipient */}
                <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(1.8rem,5vw,2.6rem)', color: '#ffd1e1' }}
                    className="mb-2 drop-shadow-[0_0_10px_rgba(255,101,163,0.5)]">
                    To: {recipientName || 'Nama Penerima'} 💗
                </h2>

                {/* Messages */}
                <div className="my-4 space-y-3 max-w-xs">
                    {(messages?.length ? messages : ['Pesan spesial untuk orang tersayang...']).filter(Boolean).map((msg, i) => (
                        <p key={i} style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem', color: '#ffd1e1', lineHeight: 1.7 }}
                            className="opacity-90">
                            "{msg}"
                        </p>
                    ))}
                </div>

                {/* Firework dots decoration */}
                <div className="flex gap-2 my-3">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="rounded-full" style={{
                            width: i === 3 ? '8px' : '4px',
                            height: i === 3 ? '8px' : '4px',
                            background: `hsl(${320 + i * 8}, 100%, 70%)`,
                            boxShadow: `0 0 6px hsl(${320 + i * 8}, 100%, 70%)`,
                        }} />
                    ))}
                </div>

                {/* Sender */}
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff65a3]/60">
                    With love from
                </div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.3rem', color: '#ffb3cf', fontWeight: 600 }}
                    className="mt-1">
                    {senderName || 'Nama Pengirim'}
                </div>

                {/* Pulse heart bottom */}
                <div className="mt-6 text-2xl" style={{ animation: 'pulse 1.5s infinite alternate' }}>
                    ❤️
                </div>
            </div>

            <style>{`
                @keyframes float0 { 0%,100% { transform: translateY(0) scale(0.7); } 50% { transform: translateY(-12px) scale(0.75); } }
                @keyframes float1 { 0%,100% { transform: translateY(0) scale(0.8); } 50% { transform: translateY(-15px) scale(0.85); } }
                @keyframes float2 { 0%,100% { transform: translateY(0) scale(0.9); } 50% { transform: translateY(-10px) scale(0.95); } }
                @keyframes float3 { 0%,100% { transform: translateY(0) scale(0.75); } 50% { transform: translateY(-18px) scale(0.8); } }
                @keyframes float4 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.05); } }
            `}</style>
        </div>
    );
}

function GiftForAnitaPreview({ data }) {
    const { recipientName, senderName, type, messages, photoUrl } = data;
    const [flipped, setFlipped] = useState(false);

    const typeMap = {
        anniversary: '🎊 Aniversari',
        birthday:    '🎂 Ulang Tahun',
        graduation:  '🎓 Wisuda',
        wedding:     '💍 Pernikahan',
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl flex flex-col items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #07060a 0%, #1e050d 60%, #07060a 100%)', minHeight: '480px' }}>

            {/* Matrix rain effect (simplified dots) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute text-[10px] font-mono text-pink-400" style={{
                        left: `${i * 8.5}%`,
                        top: 0,
                        animation: `matrixDrop 3s linear infinite`,
                        animationDelay: `${i * 0.25}s`,
                        opacity: 0.6,
                    }}>
                        {['♥', '✦', '★', '◆'][i % 4]}
                    </div>
                ))}
            </div>

            {/* 3D Book */}
            <div className="relative z-10 w-full max-w-[280px]" style={{ perspective: '1000px' }}>
                <div
                    className="relative w-full cursor-pointer select-none"
                    style={{
                        height: '340px',
                        transformStyle: 'preserve-3d',
                        transform: flipped ? 'rotateY(-12deg)' : 'rotateY(0deg)',
                        transition: 'transform 0.6s ease',
                    }}
                    onClick={() => setFlipped(!flipped)}
                >
                    {/* Book cover */}
                    <div className="absolute inset-0 rounded-lg p-6 flex flex-col items-center justify-center text-center"
                        style={{
                            background: 'linear-gradient(135deg, #4c1125 0%, #1e050d 100%)',
                            border: '2px solid rgba(255,77,128,0.3)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.5)',
                        }}>
                        {photoUrl && (
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ff4d80]/40 shadow-lg mb-3">
                                <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                        {!photoUrl && (
                            <div className="text-4xl mb-3" style={{ animation: 'pulseBeat 1.5s infinite alternate' }}>❤️</div>
                        )}
                        <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.8rem', color: '#ffb8d2' }}
                            className="mb-1">
                            {recipientName || 'Nama Penerima'} 💗
                        </h2>
                        <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                            {typeMap[type] || 'Special Gift'}
                        </p>
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', marginTop: '1.5rem', display: 'block' }}>
                            Ketuk untuk membuka
                        </span>
                    </div>
                </div>

                {/* Pages preview below when flipped hint */}
                {flipped && (
                    <div className="absolute inset-0 rounded-lg p-5 flex flex-col justify-between"
                        style={{
                            background: '#fffaf0',
                            color: '#2c1810',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        }}>
                        <div className="text-[10px] uppercase tracking-widest text-[#8b5a42] border-b border-[#8b5a42]/20 pb-2">
                            Pesan Istimewa 💕
                        </div>
                        <div className="flex-1 flex flex-col justify-center space-y-2 py-3">
                            {(messages?.length ? messages : ['Pesan spesial untuk orang tersayang...']).filter(Boolean).slice(0, 3).map((msg, i) => (
                                <p key={i} style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1rem', lineHeight: 1.7 }}>
                                    "{msg}"
                                </p>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-[#9c7b6c] border-t border-[#8b5a42]/15 pt-2">
                            <span>Dari: {senderName || 'Pengirim'}</span>
                            <span>Ketuk kembali</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-3 text-[10px] text-white/30 uppercase tracking-widest text-center">
                Ketuk buku untuk membuka halaman
            </div>

            <style>{`
                @keyframes pulseBeat { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
                @keyframes matrixDrop { 0% { transform: translateY(-20px); opacity: 0; } 20% { opacity: 0.6; } 80% { opacity: 0.6; } 100% { transform: translateY(480px); opacity: 0; } }
            `}</style>
        </div>
    );
}

/* ─────────────────────────────────────
   MAIN FORM PAGE
───────────────────────────────────── */
export default function GreetingCardForm({ card, types, templates }) {
    const isEdit = !!card;
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        title:          card?.title ?? 'Kartu Ucapan',
        template:       card?.template ?? 'stillwithyou',
        type:           card?.type ?? 'anniversary',
        recipient_name: card?.recipient_name ?? '',
        sender_name:    card?.sender_name ?? '',
        photo_url:      card?.photo_url ?? '',
        photos:         card?.photos ?? (card?.photo_url ? [card.photo_url] : []),
        messages:       card?.messages?.length ? card.messages : [''],
    });

    // Messages helpers
    const addMessage = () => setData('messages', [...data.messages, '']);
    const removeMessage = (i) => setData('messages', data.messages.filter((_, idx) => idx !== i));
    const updateMessage = (i, val) => {
        const msgs = [...data.messages];
        msgs[i] = val;
        setData('messages', msgs);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handlePhotoUpload(e.dataTransfer.files);
        }
    };

    // Photo upload massal dengan axios
    const handlePhotoUpload = async (files) => {
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files);
        setUploading(true);
        const uploaded = [];

        for (let i = 0; i < fileArray.length; i++) {
            setUploadProgress(`Mengupload ${i + 1} dari ${fileArray.length} foto...`);
            const file = fileArray[i];
            const fd = new FormData();
            fd.append('file', file);
            fd.append('folder', 'greeting-cards');
            try {
                const res = await axios.post(route('upload'), fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (res.data && res.data.url) {
                    uploaded.push(res.data.url);
                }
            } catch (err) {
                console.error('Gagal upload foto ke-' + (i + 1), err);
            }
        }

        if (uploaded.length > 0) {
            const nextPhotos = [...(data.photos || []), ...uploaded];
            setData({
                ...data,
                photos: nextPhotos,
                photo_url: data.photo_url || uploaded[0]
            });
        }
        setUploading(false);
        setUploadProgress('');
    };

    const handleRemovePhoto = (urlToRemove, e) => {
        e.stopPropagation();
        const nextPhotos = (data.photos || []).filter(url => url !== urlToRemove);
        const nextActiveUrl = data.photo_url === urlToRemove 
            ? (nextPhotos.length > 0 ? nextPhotos[0] : '') 
            : data.photo_url;
        
        setData({
            ...data,
            photos: nextPhotos,
            photo_url: nextActiveUrl
        });
    };

    const handleSelectPhoto = (url) => {
        setData('photo_url', url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/greeting-card/${card.id}`);
        } else {
            post('/greeting-card');
        }
    };

    // Live preview data
    const previewData = {
        recipientName: data.recipient_name,
        senderName:    data.sender_name,
        type:          data.type,
        messages:      data.messages.filter(Boolean),
        photoUrl:      data.photo_url,
    };

    return (
        <DashboardLayout title={isEdit ? 'Edit Kartu Ucapan' : 'Buat Kartu Ucapan'}>
            <Head title={isEdit ? 'Edit Kartu Ucapan' : 'Buat Kartu Ucapan'} />

            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                    <Link href="/greeting-card" className="hover:text-[#E5654B] transition-colors">Kartu Ucapan</Link>
                    <Icon d="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-3.5 h-3.5" />
                    <span className="text-gray-800 font-medium">{isEdit ? 'Edit' : 'Buat Baru'}</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* ─── LEFT PANEL: Form Input ─── */}
                        <div className="space-y-5">

                            {/* Template Selector */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Icon d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" className="w-4 h-4 text-[#E5654B]" />
                                    Pilih Template
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(templates).map(([key, label]) => {
                                        const gradients = {
                                            stillwithyou: 'from-[#0d0915] to-[#1b102b]',
                                            giftforanita:  'from-[#1e050d] to-[#4c1125]',
                                        };
                                        const icons = { stillwithyou: '🎆', giftforanita: '🎁' };
                                        const selected = data.template === key;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setData('template', key)}
                                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${selected ? 'border-[#E5654B] shadow-md shadow-orange-100' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <div className={`h-20 bg-gradient-to-br ${gradients[key]} flex items-center justify-center`}>
                                                    <span className="text-3xl">{icons[key]}</span>
                                                </div>
                                                <div className="p-2 text-center bg-white">
                                                    <div className="text-[11px] font-semibold text-gray-700 leading-tight">{label}</div>
                                                </div>
                                                {selected && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#E5654B] rounded-full flex items-center justify-center">
                                                        <Icon d="M4.5 12.75l6 6 9-13.5" className="w-3 h-3 text-white" strokeWidth={2.5} />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Jenis Ucapan */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Icon d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z" className="w-4 h-4 text-[#E5654B]" />
                                    Jenis Ucapan
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(types).map(([key, label]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setData('type', key)}
                                            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${data.type === key
                                                ? 'bg-[#E5654B]/10 border-[#E5654B]/40 text-[#E5654B]'
                                                : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Names */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-4 h-4 text-[#E5654B]" />
                                    Nama
                                </h3>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Penerima *</label>
                                    <input
                                        type="text"
                                        value={data.recipient_name}
                                        onChange={e => setData('recipient_name', e.target.value)}
                                        placeholder="cth: Anita, Budi, Rini..."
                                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#E5654B]/30 ${errors.recipient_name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-[#E5654B]/50'}`}
                                    />
                                    {errors.recipient_name && <p className="text-red-500 text-xs mt-1">{errors.recipient_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Pengirim *</label>
                                    <input
                                        type="text"
                                        value={data.sender_name}
                                        onChange={e => setData('sender_name', e.target.value)}
                                        placeholder="cth: Dari sayang, Dari keluarga..."
                                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#E5654B]/30 ${errors.sender_name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-[#E5654B]/50'}`}
                                    />
                                    {errors.sender_name && <p className="text-red-500 text-xs mt-1">{errors.sender_name}</p>}
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Icon d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25z" className="w-4 h-4 text-[#E5654B]" />
                                    Foto (Opsional)
                                </h3>
                                
                                <input 
                                    ref={fileRef} 
                                    type="file" 
                                    accept="image/*" 
                                    multiple 
                                    onChange={e => handlePhotoUpload(e.target.files)} 
                                    className="hidden" 
                                />

                                {/* Drop Zone */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileRef.current?.click()}
                                    className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                        isDragOver 
                                            ? 'border-[#E5654B] bg-[#E5654B]/5' 
                                            : 'border-gray-200 hover:border-[#E5654B]/40 bg-gray-50/50 hover:bg-white'
                                    }`}
                                >
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 rounded-full border-2 border-[#E5654B] border-t-transparent animate-spin" />
                                            <span className="text-xs font-semibold text-gray-600">{uploadProgress || 'Mengupload...'}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-3 bg-white rounded-full shadow-sm text-gray-400 group-hover:text-[#E5654B] transition-colors">
                                                <Icon d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" className="w-6 h-6 text-[#E5654B]" />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700">Tarik & lepas foto ke sini, atau klik untuk memilih</span>
                                            <span className="text-[10px] text-gray-400">Mendukung multi-select. JPG, PNG, WEBP maks. 20MB</span>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnail Grid */}
                                {data.photos?.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-gray-700">Pilih Foto Utama:</span>
                                            <span className="text-[10px] text-gray-400">Klik foto untuk ditampilkan di kartu</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {data.photos.map((url, index) => {
                                                const isActive = data.photo_url === url;
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleSelectPhoto(url)}
                                                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${
                                                            isActive 
                                                                ? 'border-[#E5654B] ring-2 ring-[#E5654B]/20 shadow-sm scale-95' 
                                                                : 'border-gray-100 hover:border-[#E5654B]/30'
                                                        }`}
                                                    >
                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                        
                                                        {/* Active Checkmark & Label */}
                                                        {isActive && (
                                                            <div className="absolute top-1 left-1 bg-[#E5654B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                                                <Icon d="M4.5 12.75l6 6 9-13.5" className="w-2.5 h-2.5" strokeWidth={3} />
                                                                Utama
                                                            </div>
                                                        )}

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleRemovePhoto(url, e)}
                                                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow"
                                                        >
                                                            <Icon d="M6 18L18 6M6 6l12 12" className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Messages */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <Icon d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" className="w-4 h-4 text-[#E5654B]" />
                                        Pesan-Pesan
                                    </h3>
                                    {data.messages.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={addMessage}
                                            className="text-xs font-semibold text-[#E5654B] hover:text-[#c24b33] flex items-center gap-1 transition-colors"
                                        >
                                            <Icon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            Tambah Pesan
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2.5">
                                    {data.messages.map((msg, i) => (
                                        <div key={i} className="flex gap-2 items-start">
                                            <div className="flex-1">
                                                <textarea
                                                    rows={2}
                                                    value={msg}
                                                    onChange={e => updateMessage(i, e.target.value)}
                                                    placeholder={`Pesan ${i + 1} — cth: "Kamu adalah segalanya bagiku..."`}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B]/50 transition-colors"
                                                />
                                            </div>
                                            {data.messages.length > 1 && (
                                                <button type="button" onClick={() => removeMessage(i)}
                                                    className="mt-1 p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors flex-shrink-0">
                                                    <Icon d="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul Kartu (Opsional)</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="cth: Untuk Anita Tercinta"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B]/50 transition-colors"
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3">
                                <Link
                                    href="/greeting-card"
                                    className="flex-1 text-center px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || uploading}
                                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#E5654B] hover:bg-[#c24b33] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
                                >
                                    {processing ? (
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    ) : (
                                        <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                                    )}
                                    {isEdit ? 'Simpan Perubahan' : 'Buat Kartu'}
                                </button>
                            </div>
                        </div>

                        {/* ─── RIGHT PANEL: Live Preview ─── */}
                        <div className="lg:sticky lg:top-20 self-start">
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <h3 className="text-sm font-bold text-gray-800">Live Preview</h3>
                                    <span className="text-[10px] text-gray-400 ml-auto">Diperbarui otomatis</span>
                                </div>
                                <div className="rounded-xl overflow-hidden ring-1 ring-gray-100 shadow-inner">
                                    {data.template === 'stillwithyou' ? (
                                        <StillWithYouPreview data={previewData} />
                                    ) : (
                                        <GiftForAnitaPreview data={previewData} />
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 text-center mt-3">
                                    Preview ini adalah gambaran. Tampilan final lebih interaktif dengan animasi penuh.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
