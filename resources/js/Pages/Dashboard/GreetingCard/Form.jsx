import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
        anniversary: 'Happy Anniversary',
        birthday:    'Happy Birthday',
        graduation:  'Selamat Wisuda',
        wedding:     'Selamat Menikah',
    };
    const greeting = typeMap[type] || 'Selamat';

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
        anniversary: 'Aniversari',
        birthday:    'Ulang Tahun',
        graduation:  'Wisuda',
        wedding:     'Pernikahan',
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


function CyberpunkPreview({ data }) {
    const { recipientName, senderName, type } = data;
    const typeMap = {
        anniversary: 'DECRYPTION COMPLETE: ANNIVERSARY',
        birthday:    'DECRYPTION COMPLETE: HAPPY BIRTHDAY',
        graduation:  'SECURE LINK: GRADUATION SYSTEM',
        wedding:     'SECURE LINK: WEDDING NODE',
    };
    const connectionStatus = typeMap[type] || 'ENCRYPTED TRANSMISSION';

    return (
        <div className="relative w-full overflow-hidden rounded-xl flex flex-col items-center justify-center border border-cyan-500/20"
            style={{ background: 'linear-gradient(135deg, #030712 0%, #0f172a 100%)', minHeight: '480px' }}>

            {/* Glowing Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-10" style={{
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
                backgroundSize: '100% 6px'
            }} />
            
            {/* Tech grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }} />

            {/* Biometric Thumbprint Glow */}
            <div className="mb-5 text-4xl" style={{ 
                animation: 'cdCyberPulse 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 12px #22d3ee)'
            }}>
                👍
            </div>

            {/* Connection HUD */}
            <div style={{ fontFamily:'monospace', fontSize:'0.42rem', letterSpacing:'3px', textTransform:'uppercase', color:'#ec4899', opacity:0.85, marginBottom:'0.8rem', textShadow: '0 0 6px #ec4899' }}>
                {connectionStatus}
            </div>

            {/* Recipient Name */}
            <h2 style={{ fontFamily:'monospace', fontWeight: 900, fontSize:'1.35rem', color: '#22d3ee', textShadow: '0 0 8px #22d3ee', letterSpacing: '2px', lineHeight:1.2, marginBottom:'0.4rem', textTransform: 'uppercase' }}>
                {recipientName || 'Nama Penerima'}
            </h2>

            {/* Flashing "TOUCH TO SCAN" */}
            <div className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded text-[#22d3ee] mb-4" style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.48rem', 
                letterSpacing: '2px', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                boxShadow: '0 0 8px rgba(34, 211, 238, 0.2)',
                animation: 'cdFlashText 1.5s infinite'
            }}>
                [ TOUCH TO SCAN ]
            </div>

            {/* Tech details */}
            <div style={{ width:'60%', height:1, background:'linear-gradient(90deg, transparent, #22d3ee, transparent)', marginBottom:'0.8rem' }} />

            {/* Sender */}
            <div className="flex flex-col items-center gap-1">
                <span style={{ fontFamily:'monospace', fontSize:'0.38rem', letterSpacing:'2px', color:'rgba(255,255,255,0.4)' }}>SENDER ACCESS CODE:</span>
                <span style={{ fontFamily:'monospace', fontSize:'0.55rem', fontWeight: 700, letterSpacing:'2px', color:'#ec4899', textShadow: '0 0 6px #ec4899' }}>
                    {senderName || 'Nama Pengirim'}
                </span>
            </div>

            {/* Cyber Active Badge */}
            <div className="mt-5 px-3 py-1 rounded-full text-center border border-cyan-500/30 bg-cyan-500/10 text-cyan-400" style={{ fontFamily:'monospace', fontSize:'0.46rem', letterSpacing:'1.5px', textTransform:'uppercase', textShadow: '0 0 4px #22d3ee' }}>
                🤖 Biometric scan ready
            </div>

            <style>{`
                @keyframes cdCyberPulse {
                    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px #22d3ee) brightness(1); }
                    50% { transform: scale(1.08); filter: drop-shadow(0 0 15px #ec4899) brightness(1.2); }
                }
            `}</style>
        </div>
    );
}

function BioluminescentPreview({ data }) {
    const { recipientName, senderName, type } = data;
    const typeMap = {
        anniversary: 'DEEP DIVE: CELEBRATION',
        birthday:    'DEEP DIVE: BIRTHDAY WISHES',
        graduation:  'ARCHIVE FOUND: GRADUATION',
        wedding:     'ARCHIVE FOUND: WEDDING DAY',
    };
    const diveStatus = typeMap[type] || 'SUBMARINE VIEWPORT ACTIVE';

    return (
        <div className="relative w-full overflow-hidden rounded-xl flex flex-col items-center justify-center border border-cyan-500/20"
            style={{ background: 'linear-gradient(135deg, #021526 0%, #033043 100%)', minHeight: '480px' }}>

            {/* Glowing Water overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-20" style={{
                background: 'radial-gradient(circle at 50% 30%, rgba(34, 211, 238, 0.15) 0%, transparent 75%)',
            }} />
            
            {/* Viewport Frame */}
            <div className="absolute inset-4 rounded-full border-[8px] border-amber-800/40 pointer-events-none flex items-center justify-center" style={{
                boxShadow: '0 0 0 4px rgba(6, 182, 212, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.8)'
            }}>
                {/* Viewport Rivets */}
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 rounded-full bg-cyan-400/40" style={{
                        transform: `rotate(${i * 45}deg) translateY(-88px)`
                    }} />
                ))}
            </div>

            {/* Jellyfish Emoji Floating */}
            <div className="mb-4 text-4xl" style={{ 
                animation: 'cdJellyFloating 3.5s ease-in-out infinite',
                filter: 'drop-shadow(0 0 10px #06b6d4)'
            }}>
                🪼
            </div>

            {/* Sub HUD */}
            <div style={{ fontFamily:'monospace', fontSize:'0.42rem', letterSpacing:'3px', textTransform:'uppercase', color:'#2dd4bf', opacity:0.85, marginBottom:'0.8rem', textShadow: '0 0 5px #2dd4bf' }}>
                {diveStatus}
            </div>

            {/* Recipient Name */}
            <h2 style={{ fontFamily:'monospace', fontWeight: 900, fontSize:'1.35rem', color: '#38bdf8', textShadow: '0 0 8px #0284c7', letterSpacing: '2px', lineHeight:1.2, marginBottom:'0.4rem', textTransform: 'uppercase' }}>
                {recipientName || 'Nama Penerima'}
            </h2>

            {/* Flashing "OPEN CHEST" */}
            <div className="px-3 py-1 bg-[#021526]/80 border border-teal-500/30 rounded text-cyan-300 mb-4" style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.48rem', 
                letterSpacing: '2px', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                boxShadow: '0 0 8px rgba(6, 182, 212, 0.2)',
                animation: 'cdFlashText 2s infinite'
            }}>
                [ OPEN TREASURE ]
            </div>

            {/* Divider */}
            <div style={{ width:'50%', height:1, background:'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)', marginBottom:'0.8rem' }} />

            {/* Sender */}
            <div className="flex flex-col items-center gap-1">
                <span style={{ fontFamily:'monospace', fontSize:'0.38rem', letterSpacing:'2px', color:'rgba(255,255,255,0.4)' }}>RETRIEVED FROM:</span>
                <span style={{ fontFamily:'monospace', fontSize:'0.55rem', fontWeight: 700, letterSpacing:'2px', color:'#2dd4bf', textShadow: '0 0 6px #2dd4bf' }}>
                    {senderName || 'Nama Pengirim'}
                </span>
            </div>

            {/* Underwater active badge */}
            <div className="mt-5 px-3 py-1 rounded-full text-center border border-teal-500/30 bg-teal-500/10 text-teal-400" style={{ fontFamily:'monospace', fontSize:'0.46rem', letterSpacing:'1.5px', textTransform:'uppercase', textShadow: '0 0 4px #06b6d4' }}>
                🪼 Sonar & sea harp active
            </div>

            <style>{`
                @keyframes cdJellyFloating {
                    0%, 100% { transform: translateY(0) scaleY(1) rotate(0deg); }
                    50% { transform: translateY(-12px) scaleY(0.92) rotate(3deg); }
                }
            `}</style>
        </div>
    );
}

function MysticForestPreview({ data }) {
    const { recipientName, senderName, type } = data;
    const typeMap = {
        anniversary: 'MISTIK SCROLL: CELEBRATION',
        birthday:    'MISTIK SCROLL: BIRTHDAY WISHES',
        graduation:  'MISTIK SCROLL: GRADUATION',
        wedding:     'MISTIK SCROLL: WEDDING',
    };
    const scrollStatus = typeMap[type] || 'MAGICAL SCROLL ACTIVE';

    return (
        <div className="relative w-full overflow-hidden rounded-xl flex flex-col items-center justify-center border border-lime-500/20"
            style={{ background: 'linear-gradient(135deg, #030a05 0%, #0d1c10 100%)', minHeight: '480px' }}>

            <div className="absolute inset-0 pointer-events-none z-10 opacity-20" style={{
                background: 'radial-gradient(circle at 50% 30%, rgba(163, 230, 53, 0.15) 0%, transparent 75%)',
            }} />

            {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-lime-300" style={{
                    left: `${15 + (i * 12) + Math.random() * 5}%`,
                    top: `${20 + (i * 8) + Math.random() * 5}%`,
                    boxShadow: '0 0 6px #a3e635',
                    animation: `cdFlashText ${1.2 + Math.random() * 1.5}s infinite alternate`
                }} />
            ))}

            <div className="mb-4 text-4xl" style={{ 
                animation: 'cdScrollFloating 4s ease-in-out infinite',
                filter: 'drop-shadow(0 0 10px #a3e635)'
            }}>
                📜
            </div>

            <div style={{ fontFamily:'monospace', fontSize:'0.42rem', letterSpacing:'3px', textTransform:'uppercase', color:'#a3e635', opacity:0.85, marginBottom:'0.8rem', textShadow: '0 0 5px #a3e635' }}>
                {scrollStatus}
            </div>

            <h2 className="text-xl font-bold text-yellow-100 mb-2" style={{ fontFamily:'Georgia, serif', textShadow: '0 0 6px #d97706', letterSpacing: '1px' }}>
                {recipientName || 'Nama Penerima'}
            </h2>

            <div className="px-3 py-1 bg-[#0d1c10]/80 border border-lime-500/30 rounded text-[#d9f99d] mb-4" style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.48rem', 
                letterSpacing: '2px', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                boxShadow: '0 0 8px rgba(163, 230, 53, 0.2)',
                animation: 'cdFlashText 2s infinite'
            }}>
                [ UNROLL SCROLL ]
            </div>

            <div style={{ width:'50%', height:1, background:'linear-gradient(90deg, transparent, rgba(163, 230, 53, 0.3), transparent)', marginBottom:'0.8rem' }} />

            <div className="flex flex-col items-center gap-1">
                <span style={{ fontFamily:'monospace', fontSize:'0.38rem', letterSpacing:'2px', color:'rgba(255,255,255,0.4)' }}>SENT FROM FOREST:</span>
                <span style={{ fontFamily:'monospace', fontSize:'0.55rem', fontWeight: 700, letterSpacing:'2px', color:'#a3e635', textShadow: '0 0 6px #a3e635' }}>
                    {senderName || 'Nama Pengirim'}
                </span>
            </div>

            <div className="mt-5 px-3 py-1 rounded-full text-center border border-lime-500/30 bg-lime-500/10 text-lime-400" style={{ fontFamily:'monospace', fontSize:'0.46rem', letterSpacing:'1.5px', textTransform:'uppercase', textShadow: '0 0 4px #a3e635' }}>
                🌲 Forest Chimes Active
            </div>

            <style>{`
                @keyframes cdScrollFloating {
                    0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
                    50% { transform: translateY(-8px) scale(1.02) rotate(2deg); }
                }
            `}</style>
        </div>
    );
}

function RetroArcadePreview({ data }) {
    const { recipientName, senderName, type } = data;
    const typeMap = {
        anniversary: 'LEVEL UP: ANNIVERSARY!',
        birthday:    'LEVEL UP: HAPPY BIRTHDAY!',
        graduation:  'MISSION ACCOMPLISHED: GRADUATION!',
        wedding:     'PLAYER 1 & 2 JOINED THE GAME!',
    };
    const gameStatus = typeMap[type] || 'READY PLAYER ONE';

    return (
        <div className="relative w-full overflow-hidden rounded-xl flex flex-col items-center justify-center border border-purple-500/20"
            style={{ background: 'linear-gradient(135deg, #0d0726 0%, #04020d 100%)', minHeight: '480px' }}>

            {/* CRT Screen curve and scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-15" style={{
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 6px 100%'
            }} />
            
            {/* Retro Pixel Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)',
                backgroundSize: '16px 16px'
            }} />

            {/* Glowing Neon Bezel Brackets */}
            <div className="absolute inset-2 border border-purple-500/30 rounded-lg pointer-events-none" style={{
                boxShadow: 'inset 0 0 15px rgba(139, 92, 246, 0.15)'
            }} />

            {/* Cute Pixel Alien Floating */}
            <div className="mb-4 text-4xl" style={{ 
                animation: 'cdArcadeMonster 2.5s ease-in-out infinite',
                filter: 'drop-shadow(0 0 8px #a855f7)'
            }}>
                👾
            </div>

            {/* Game Stats HUD */}
            <div style={{ fontFamily:'monospace', fontSize:'0.42rem', letterSpacing:'4px', textTransform:'uppercase', color:'#10b981', opacity:0.85, marginBottom:'0.8rem', textShadow: '0 0 6px #10b981' }}>
                {gameStatus}
            </div>

            {/* Recipient Name in glowing pixel look */}
            <h2 style={{ fontFamily:'monospace', fontWeight: 900, fontSize:'1.4rem', color: '#fbbf24', textShadow: '0 0 10px #d97706, 0 0 20px rgba(217,119,6,0.3)', letterSpacing: '2px', lineHeight:1.2, marginBottom:'0.4rem', textTransform: 'uppercase' }}>
                {recipientName || 'Nama Penerima'}
            </h2>

            {/* Flashing "INSERT COIN" */}
            <div className="px-3 py-1 bg-purple-950/40 border border-pink-500/30 rounded text-[#f43f5e] mb-4" style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.5rem', 
                letterSpacing: '3px', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                boxShadow: '0 0 8px rgba(244, 63, 94, 0.2)',
                animation: 'cdFlashText 1.2s infinite'
            }}>
                [ INSERT COIN ]
            </div>

            {/* High score divider */}
            <div style={{ width:'60%', height:2, background:'repeating-linear-gradient(90deg, #ec4899, #ec4899 4px, transparent 4px, transparent 8px)', marginBottom:'0.8rem' }} />

            {/* Sender */}
            <div className="flex flex-col items-center gap-1">
                <span style={{ fontFamily:'monospace', fontSize:'0.4rem', letterSpacing:'2px', color:'rgba(255,255,255,0.4)' }}>SENT BY:</span>
                <span style={{ fontFamily:'monospace', fontSize:'0.58rem', fontWeight: 700, letterSpacing:'2px', color:'#22d3ee', textShadow: '0 0 8px #22d3ee' }}>
                    {senderName || 'Nama Pengirim'}
                </span>
            </div>

            {/* Retro Audio Active Badge */}
            <div className="mt-5 px-3 py-1 rounded-full text-center border border-pink-500/30 bg-pink-500/10 text-pink-400" style={{ fontFamily:'monospace', fontSize:'0.48rem', letterSpacing:'1.5px', textTransform:'uppercase', textShadow: '0 0 4px #ec4899' }}>
                👾 Retro 8-bit Audio Active
            </div>

            <style>{`
                @keyframes cdArcadeMonster {
                    0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
                    50% { transform: translateY(-8px) scale(1.05) rotate(4deg); }
                }
                @keyframes cdFlashText {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

function CosmicDriftPreview({ data }) {
    const { recipientName, senderName, type } = data;
    const typeMap = {
        anniversary: 'Selamat Aniversari',
        birthday:    'Selamat Ulang Tahun',
        graduation:  'Selamat Wisuda',
        wedding:     'Selamat Menikah',
    };
    const greeting = typeMap[type] || 'Pesan Spesial';

    return (
        <div className="relative w-full overflow-hidden rounded-xl flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #020817 0%, #0a1628 50%, #050d1f 100%)', minHeight: '480px' }}>

            {/* Animated stars */}
            {[...Array(30)].map((_, i) => (
                <div key={i} className="absolute rounded-full" style={{
                    width:  Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    left:   `${Math.random() * 100}%`,
                    top:    `${Math.random() * 100}%`,
                    background: ['#60a5fa','#a78bfa','#67e8f9','#fbbf24','white'][i % 5],
                    opacity: 0.3 + Math.random() * 0.7,
                    animation: `twinkle${i % 3} ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                }} />
            ))}

            {/* Nebula glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at 30% 30%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(168,85,247,0.09) 0%, transparent 60%)',
            }} />

            {/* HUD brackets */}
            <div className="absolute top-3 left-3" style={{ width:12, height:12, borderTop:'1.5px solid rgba(96,165,250,.35)', borderLeft:'1.5px solid rgba(96,165,250,.35)' }} />
            <div className="absolute top-3 right-3" style={{ width:12, height:12, borderTop:'1.5px solid rgba(96,165,250,.35)', borderRight:'1.5px solid rgba(96,165,250,.35)' }} />
            <div className="absolute bottom-3 left-3" style={{ width:12, height:12, borderBottom:'1.5px solid rgba(96,165,250,.35)', borderLeft:'1.5px solid rgba(96,165,250,.35)' }} />
            <div className="absolute bottom-3 right-3" style={{ width:12, height:12, borderBottom:'1.5px solid rgba(96,165,250,.35)', borderRight:'1.5px solid rgba(96,165,250,.35)' }} />

            {/* Planet */}
            <div className="mb-4" style={{ width:44, height:44, borderRadius:'50%', background:'radial-gradient(circle at 35% 35%, #4f8ef7, #1a3a8f 60%, #0a1a4a)', boxShadow:'0 0 20px rgba(59,130,246,.6)', animation:'cdPreviewPlanet 5s ease-in-out infinite' }} />

            {/* Eyebrow */}
            <div style={{ fontFamily:'monospace', fontSize:'0.42rem', letterSpacing:'5px', textTransform:'uppercase', color:'#22d3ee', opacity:0.65, marginBottom:'0.6rem' }}>✦ COSMIC DRIFT ✦</div>

            {/* Greeting */}
            <h2 style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.6rem', background:'linear-gradient(135deg,#60a5fa,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 0 8px rgba(96,165,250,.4))', lineHeight:1.2, marginBottom:'0.25rem' }}>
                {greeting}
            </h2>
            <p style={{ fontFamily:'monospace', fontSize:'0.52rem', letterSpacing:'3px', color:'rgba(196,181,253,.7)', marginBottom:'0.75rem' }}>
                {recipientName || 'Nama Penerima'}
            </p>

            {/* Divider */}
            <div style={{ width:'70%', height:1, background:'linear-gradient(90deg,transparent,rgba(96,165,250,.3),transparent)', marginBottom:'0.75rem' }} />

            {/* Constellation dots */}
            <div className="flex gap-1.5 mb-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ width: i===2?8:5, height: i===2?8:5, borderRadius:'50%', background:'rgba(96,165,250,0.7)', boxShadow:'0 0 6px rgba(96,165,250,0.8)' }} />
                ))}
            </div>

            {/* Sender */}
            <div style={{ fontFamily:'monospace', fontSize:'0.52rem', letterSpacing:'2px', color:'rgba(251,191,36,.75)' }}>
                — {senderName || 'Nama Pengirim'}
            </div>

            {/* Ambient audio indicator preview */}
            <div className="mt-5 px-4 py-1.5 rounded-full text-center border border-purple-500/30 bg-purple-500/10 text-purple-300" style={{ fontFamily:'monospace', fontSize:'0.52rem', letterSpacing:'1.5px', textTransform:'uppercase' }}>
                🌌 Space Ambient Audio Active
            </div>

            <style>{`
                @keyframes cdPreviewPlanet { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
                @keyframes twinkle0 { 0%,100%{opacity:0.3}50%{opacity:1} }
                @keyframes twinkle1 { 0%,100%{opacity:0.5}50%{opacity:0.2} }
                @keyframes twinkle2 { 0%,100%{opacity:0.8}50%{opacity:0.3} }
            `}</style>
        </div>
    );
}

/* ─────────────────────────────────────
   MAIN FORM PAGE
───────────────────────────────────── */
export default function GreetingCardForm({ card, types, templates, defaultTemplate = 'stillwithyou', defaultType = 'anniversary' }) {
    const isEdit = !!card;
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    // States for custom url availability check
    const [checkingUrl, setCheckingUrl] = useState(false);
    const [urlAvailable, setUrlAvailable] = useState(null);

    // Debounce check for custom URL availability
    useEffect(() => {
        const cleanUrl = data.custom_url ? data.custom_url.trim().toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '') : '';
        if (cleanUrl.length < 3) {
            setUrlAvailable(null);
            return;
        }

        // If in edit mode and the custom url is identical to original card URL, it's available
        if (isEdit && cleanUrl === card.custom_url?.trim().toLowerCase()) {
            setUrlAvailable(true);
            return;
        }

        const t = setTimeout(async () => {
            setCheckingUrl(true);
            try {
                const params = new URLSearchParams({ url: cleanUrl });
                if (isEdit && card?.id) {
                    params.append('exclude_id', card.id);
                }
                const res = await axios.get(`/api/check-card-url?${params.toString()}`);
                setUrlAvailable(res.data.available);
            } catch {
                setUrlAvailable(null);
            } finally {
                setCheckingUrl(false);
            }
        }, 500);
        return () => clearTimeout(t);
    }, [data.custom_url, isEdit, card]);

    const { data, setData, post, put, processing, errors } = useForm({
        title:          card?.title ?? 'Kartu Ucapan',
        template:       card?.template ?? defaultTemplate,
        type:           card?.type ?? defaultType,
        recipient_name: card?.recipient_name ?? '',
        sender_name:    card?.sender_name ?? '',
        photo_url:      card?.photo_url ?? '',
        photos:         card?.photos ?? (card?.photo_url ? [card.photo_url] : []),
        messages:       card?.messages?.length ? card.messages : [''],
        custom_url:     card?.custom_url ?? '',
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

    const [previewKey, setPreviewKey] = useState(0);

    const sendDataToIframe = useCallback(() => {
        const iframe = document.getElementById('preview-iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'UPDATE_GREETING_CARD_PREVIEW',
                card: {
                    title:          data.title,
                    template:       data.template,
                    type:           data.type,
                    recipient_name: data.recipient_name,
                    sender_name:    data.sender_name,
                    photo_url:      data.photo_url,
                    photos:         data.photos,
                    messages:       data.messages.filter(Boolean),
                }
            }, '*');
        }
    }, [data.title, data.template, data.type, data.recipient_name, data.sender_name, data.photo_url, data.photos, data.messages]);

    useEffect(() => {
        sendDataToIframe();
    }, [sendDataToIframe]);

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
                                            stillwithyou:     'from-[#0d0915] to-[#1b102b]',
                                            giftforanita:     'from-[#1e050d] to-[#4c1125]',
                                            oceanbreeze:      'from-[#082f49] to-[#0369a1]',
                                            cosmicdrift:      'from-[#020817] to-[#0a1628]',
                                            retroarcade:      'from-[#0d0726] to-[#04020d]',
                                            cyberpunk:        'from-[#030712] to-[#0f172a]',
                                            bioluminescent:   'from-[#021526] to-[#033043]',
                                            mysticforest:     'from-[#030a05] to-[#0d1c10]',
                                            etherealwhispers: 'from-[#fdf8f5] to-[#f5dae2]',
                                            balloonpop:       'from-[#e0f2fe] to-[#bae6fd]',
                                            lofilove:         'from-[#1b1517] to-[#352528]',
                                        };
                                        const icons = { stillwithyou: '🎆', giftforanita: '🎁', oceanbreeze: '🌊', cosmicdrift: '🌌', retroarcade: '👾', cyberpunk: '🤖', bioluminescent: '🪼', mysticforest: '🌲', etherealwhispers: '🌸', balloonpop: '🎈', lofilove: '📻' };
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

                            {/* Custom URL */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Link / URL Custom Kartu {isEdit ? '*' : '(Opsional)'}</label>
                                <div className="flex rounded-xl shadow-sm overflow-hidden">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-xs font-mono select-none">
                                        {typeof window !== 'undefined' ? window.location.origin : ''}/card/
                                    </span>
                                    <input
                                        type="text"
                                        value={data.custom_url}
                                        onChange={e => setData('custom_url', e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                                        placeholder={isEdit ? "Masukkan URL kustom" : "cth: ulang-tahun-rachel (kosongkan untuk acak)"}
                                        required={isEdit}
                                        className={`flex-1 min-w-0 block w-full px-3.5 py-2.5 rounded-r-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                                            errors.custom_url 
                                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30' 
                                                : checkingUrl
                                                    ? 'border-gray-200 bg-white focus:border-[#E5654B]/50 focus:ring-[#E5654B]/30'
                                                    : urlAvailable === true
                                                        ? 'border-emerald-300 bg-emerald-50/10 focus:border-emerald-500 focus:ring-emerald-500/30 text-emerald-900'
                                                        : urlAvailable === false
                                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/30'
                                                            : 'border-gray-200 bg-white focus:border-[#E5654B]/50 focus:ring-[#E5654B]/30'
                                        }`}
                                    />
                                </div>
                                <div className="min-h-[20px] mt-1.5 px-1 text-[11px]">
                                    {checkingUrl && (
                                        <span className="text-gray-400 flex items-center gap-1.5">
                                            <span className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin inline-block" />
                                            Memeriksa ketersediaan...
                                        </span>
                                    )}
                                    {!checkingUrl && urlAvailable === true && (
                                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                            ✓ Link tersedia!
                                        </span>
                                    )}
                                    {!checkingUrl && urlAvailable === false && (
                                        <span className="text-red-500 font-semibold flex items-center gap-1">
                                            ✗ Link sudah digunakan oleh kartu lain, silakan gunakan link lain.
                                        </span>
                                    )}
                                    {!checkingUrl && data.custom_url && data.custom_url.length > 0 && data.custom_url.length < 3 && (
                                        <span className="text-amber-500 flex items-center gap-1">
                                            ⚠ Minimal 3 karakter
                                        </span>
                                    )}
                                </div>
                                {errors.custom_url && <p className="text-red-500 text-xs mt-1">{errors.custom_url}</p>}
                                <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">
                                    Gunakan huruf, angka, tanda minus (-), dan garis bawah (_). {isEdit ? "Jika diubah, URL lama tidak akan bisa diakses lagi." : "Jika dikosongkan, URL acak unik akan dibuat otomatis."}
                                </p>
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
                                    disabled={processing || uploading || checkingUrl || (data.custom_url && urlAvailable === false) || (isEdit && (!data.custom_url || urlAvailable !== true))}
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

                        {/* ─── RIGHT PANEL: Live Preview (Smartphone Mockup with real interactive iframe) ─── */}
                        <div className="lg:sticky lg:top-20 self-start">
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <h3 className="text-sm font-bold text-gray-800">Live Preview</h3>
                                    <span className="text-[10px] text-gray-400 ml-auto">Diperbarui otomatis</span>
                                </div>
                                
                                <div className="flex justify-center items-center py-2">
                                    <div className="w-[310px] h-[656px] bg-zinc-950 rounded-[2.2rem] shadow-2xl border-[6px] border-gray-800 overflow-hidden relative">
                                        {/* Premium Dynamic Island */}
                                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[80px] h-5 bg-black rounded-full z-20 flex items-center justify-between px-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_1px_2px_rgba(0,0,0,0.4)] pointer-events-none border border-black/40">
                                            {/* Left camera lens dot */}
                                            <div className="w-2 h-2 rounded-full bg-[#0d0d12] flex items-center justify-center border border-gray-900/30">
                                                <div className="w-0.5 h-0.5 rounded-full bg-[#1c1c3c] opacity-60" />
                                            </div>
                                            {/* Right sensor indicator */}
                                            <div className="w-1 h-1 rounded-full bg-[#0d0d12] opacity-40" />
                                        </div>
                                        <div className="w-full h-full overflow-hidden relative">
                                            <iframe
                                                id="preview-iframe"
                                                key={`${data.template}-${previewKey}`}
                                                src={`/demo-kartu/${data.template}`}
                                                onLoad={sendDataToIframe}
                                                className="absolute top-0 left-0 border-0"
                                                style={{
                                                    width: '430px',
                                                    height: '932px',
                                                    transform: 'scale(0.693)',
                                                    transformOrigin: 'top left',
                                                }}
                                                title="Live Preview Kartu Ucapan"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-center mt-3 flex items-center justify-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => setPreviewKey(k => k + 1)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                                        title="Refresh Preview"
                                    >
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth={2.5} />
                                        </svg>
                                        <span>Refresh Preview</span>
                                    </button>
                                </div>
                                
                                <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                                    Preview ini adalah simulasi tampilan hp interaktif. Kamu dapat mengeklik tombol/fitur di dalam mockup untuk mencoba animasi secara langsung.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
