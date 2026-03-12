import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Fullscreen({ invitation, colors }) {
    const [guests, setGuests] = useState([]);
    const [stats, setStats] = useState({ checked_in: 0, total: 0 });
    const [newGuest, setNewGuest] = useState(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const prevCountRef = useRef(0);
    const delay = (invitation?.live_delay || 3) * 1000;
    const showCounter = invitation?.live_counter !== false;
    const template = invitation?.live_template || 'elegant';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/live/${invitation.slug}/data`);
                const d = await res.json();
                if (d.stats.checked_in > prevCountRef.current && prevCountRef.current > 0) {
                    const latest = d.guests[0];
                    if (latest) {
                        setShowWelcome(true);
                        setNewGuest(latest);
                        setTimeout(() => { setShowWelcome(false); }, delay + 2000);
                        setTimeout(() => { setNewGuest(null); }, delay + 3000);
                    }
                }
                prevCountRef.current = d.stats.checked_in;
                setGuests(d.guests);
                setStats(d.stats);
            } catch (e) { console.error(e); }
        };
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const pct = stats.total > 0 ? Math.round((stats.checked_in / stats.total) * 100) : 0;
    const isElegant = template === 'elegant';

    const bg = isElegant
        ? 'bg-gradient-to-br from-[#0f0c29] via-[#1a1a2e] to-[#16213e]'
        : 'bg-gradient-to-br from-[#E5654B] via-[#ff6b5e] to-[#ff8f7e]';
    const accent = isElegant ? colors.primary || '#B76E79' : '#ffffff';
    const textMain = isElegant ? 'text-white' : 'text-white';
    const textSub = isElegant ? 'text-white/40' : 'text-white/60';

    return (
        <>
            <Head title={`Live Tamu — ${invitation.slug}`} />
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&display=swap');
                body { margin:0; overflow:hidden; }
                @keyframes slideInUp { from { opacity:0; transform:translateY(60px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
                @keyframes slideInLeft { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
                @keyframes fadeInScale { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
                @keyframes shimmer { from { background-position:-200% 0; } to { background-position:200% 0; } }
                @keyframes confetti1 { 0% { transform:translateY(0) rotate(0); opacity:1; } 100% { transform:translateY(-120vh) rotate(720deg); opacity:0; } }
                .welcome-enter { animation: slideInUp 0.8s cubic-bezier(0.22,1,0.36,1) both; }
                .guest-enter { animation: slideInLeft 0.5s cubic-bezier(0.22,1,0.36,1) both; }
                .counter-pop { animation: fadeInScale 0.4s cubic-bezier(0.22,1,0.36,1) both; }
                .shimmer-text { background: linear-gradient(90deg, ${accent}88 25%, ${accent} 50%, ${accent}88 75%);
                    background-size: 200% auto; animation: shimmer 3s linear infinite; -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
            `}} />

            <div className={`${bg} min-h-screen flex flex-col`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                {/* ═══ Header ═══ */}
                <header className="p-6 sm:p-10 flex items-center justify-between">
                    <div>
                        <h1 className={`text-2xl sm:text-3xl font-bold ${textMain}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                            Live Tamu
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className={`text-xs font-medium ${textSub}`}>Realtime • {invitation.slug}</span>
                        </div>
                    </div>
                    {showCounter && (
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="text-center">
                                <div className={`text-4xl sm:text-5xl font-black ${textMain} counter-pop`} key={stats.checked_in}>
                                    {stats.checked_in}
                                </div>
                                <div className={`text-[10px] uppercase tracking-[0.2em] font-semibold mt-1 ${textSub}`}>Hadir</div>
                            </div>
                            <div className={`w-px h-12 ${isElegant ? 'bg-white/10' : 'bg-white/20'}`} />
                            <div className="text-center">
                                <div className={`text-4xl sm:text-5xl font-black ${textMain}`}>{stats.total}</div>
                                <div className={`text-[10px] uppercase tracking-[0.2em] font-semibold mt-1 ${textSub}`}>Total</div>
                            </div>
                            <div className={`w-px h-12 ${isElegant ? 'bg-white/10' : 'bg-white/20'}`} />
                            <div className="text-center">
                                <div className={`text-4xl sm:text-5xl font-black ${textMain}`}>{pct}%</div>
                                <div className={`text-[10px] uppercase tracking-[0.2em] font-semibold mt-1 ${textSub}`}>Persentase</div>
                            </div>
                        </div>
                    )}
                </header>

                {/* ═══ Welcome Overlay ═══ */}
                {showWelcome && newGuest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="welcome-enter text-center px-6">
                            {/* Confetti particles for celebration template */}
                            {!isElegant && (
                                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="absolute bottom-0 w-3 h-3 rounded-full"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                backgroundColor: ['#FFD700', '#ff6b5e', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa'][i % 6],
                                                animation: `confetti1 ${2 + Math.random() * 3}s ease-out ${Math.random() * 0.5}s both`,
                                            }} />
                                    ))}
                                </div>
                            )}
                            <div className={`text-xs uppercase tracking-[0.3em] font-semibold mb-4 ${isElegant ? 'text-white/50' : 'text-white/70'}`}>
                                Selamat Datang
                            </div>
                            <div className="shimmer-text text-5xl sm:text-7xl md:text-8xl font-black mb-4"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                {newGuest.name}
                            </div>
                            {newGuest.group_name && (
                                <div className="text-white/40 text-sm sm:text-base font-medium">{newGuest.group_name}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══ Guest List ═══ */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-10 pb-6">
                    {/* Progress Bar */}
                    {showCounter && (
                        <div className="mb-6">
                            <div className={`h-1.5 rounded-full overflow-hidden ${isElegant ? 'bg-white/5' : 'bg-white/20'}`}>
                                <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${pct}%`, backgroundColor: isElegant ? accent : '#ffffff' }} />
                            </div>
                        </div>
                    )}

                    {guests.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                            <div className="text-6xl mb-4"><svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                            <div className={`text-xl font-semibold ${textMain}`}>Menunggu tamu...</div>
                            <div className={`text-sm mt-2 ${textSub}`}>Tamu akan muncul otomatis saat scan QR Code</div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {guests.map((g, i) => (
                            <div key={g.id} className={`guest-enter flex items-center gap-3 p-4 rounded-xl transition-all ${isElegant ? 'bg-white/5 hover:bg-white/10 border border-white/5' : 'bg-white/15 hover:bg-white/25 border border-white/10'}`}
                                style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                    style={{ background: isElegant ? `hsl(${(i * 47 + 10) % 360}, 50%, 45%)` : `hsl(${(i * 47 + 10) % 360}, 70%, 60%)` }}>
                                    {g.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-semibold truncate ${textMain}`}>{g.name}</div>
                                    {g.group_name && <div className={`text-xs ${textSub}`}>{g.group_name}</div>}
                                </div>
                                <div className={`text-[10px] font-medium ${textSub}`}>
                                    {g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className={`text-center py-4 text-xs ${textSub}`}>
                    Powered by Undangan Digital Groovy
                </footer>
            </div>
        </>
    );
}
