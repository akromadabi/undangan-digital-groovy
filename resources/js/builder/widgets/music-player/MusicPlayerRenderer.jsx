import React, { useState, useEffect, useRef } from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';
import { Play, Pause, Music } from 'lucide-react';

export default function MusicPlayerRenderer({ settings = {}, globalSettings = {} }) {
    const audioUrl = settings.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    const songTitle = settings.songTitle || 'Beautiful Wedding Piano';
    const autoplay = settings.autoplay || false;
    const playerType = settings.playerType || 'floating'; // 'floating' or 'inline'
    const floatPosition = settings.floatPosition || 'bottom-right';
    
    // Fonts resolution
    let bodyFontFamily = settings.bodyFontFamily || 'default';
    if (bodyFontFamily === 'default') {
        bodyFontFamily = globalSettings?.fonts?.body || 'Inter';
    }

    const primaryColor = settings.primaryColor || '#E5654B';
    const iconColor = settings.iconColor || '#ffffff';

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Handle audio play/pause
    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch((err) => {
                console.log("Autoplay blocked by browser policy:", err);
            });
        }
    };

    // Autoplay trigger on load if enabled
    useEffect(() => {
        if (autoplay && audioRef.current) {
            const playAudio = () => {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(() => {
                    // Browser block standard
                });
            };
            
            // Add interaction triggers to start autoplay if blocked
            window.addEventListener('click', playAudio, { once: true });
            window.addEventListener('touchstart', playAudio, { once: true });

            return () => {
                window.removeEventListener('click', playAudio);
                window.removeEventListener('touchstart', playAudio);
            };
        }
    }, [autoplay, audioUrl]);

    // Handle source url change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            }
        }
    }, [audioUrl]);

    // Positions for floating player
    const getFloatStyles = () => {
        if (playerType === 'inline') {
            return {};
        }

        const base = {
            position: 'fixed',
            zIndex: 9999,
            bottom: '24px',
            right: '24px',
        };

        if (floatPosition === 'bottom-left') {
            base.right = 'auto';
            base.left = '24px';
        } else if (floatPosition === 'top-right') {
            base.bottom = 'auto';
            base.top = '24px';
        } else if (floatPosition === 'top-left') {
            base.bottom = 'auto';
            base.top = '24px';
            base.right = 'auto';
            base.left = '24px';
        }

        return base;
    };

    const isFloating = playerType === 'floating';

    return (
        <div 
            className={`${
                isFloating 
                    ? 'shadow-lg transition-transform hover:scale-105 duration-300' 
                    : 'w-full p-4 border border-gray-100 rounded-xl shadow-sm flex items-center justify-between gap-4'
            }`}
            style={{ 
                ...getFloatStyles(),
                backgroundColor: isFloating ? 'transparent' : '#ffffff'
            }}
        >
            {/* Hidden Audio Tag */}
            <audio ref={audioRef} loop src={audioUrl} />

            {isFloating ? (
                /* Floating Disc Player */
                <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500 shadow-md group focus:outline-none"
                    style={{ backgroundColor: primaryColor }}
                >
                    {/* Rotating Disk Background when playing */}
                    <div 
                        className={`absolute inset-1 rounded-full border-2 border-dashed border-white/30 ${
                            isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                        }`}
                    />
                    
                    {isPlaying ? (
                        <Pause className="w-6 h-6 relative z-10 animate-pulse" style={{ color: iconColor }} />
                    ) : (
                        <Play className="w-6 h-6 relative z-10 ml-0.5" style={{ color: iconColor }} />
                    )}

                    {/* Soundwave animation (dots) if playing */}
                    {isPlaying && (
                        <div className="absolute bottom-2 flex gap-0.5 justify-center w-full z-10">
                            <span className="w-0.5 h-2 bg-white rounded-full animate-[soundwave_0.8s_ease-in-out_infinite_alternate]" />
                            <span className="w-0.5 h-3 bg-white rounded-full animate-[soundwave_0.8s_ease-in-out_0.2s_infinite_alternate]" />
                            <span className="w-0.5 h-2 bg-white rounded-full animate-[soundwave_0.8s_ease-in-out_0.4s_infinite_alternate]" />
                        </div>
                    )}
                </button>
            ) : (
                /* Inline Bar Player */
                <>
                    <div className="flex items-center gap-3">
                        <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden ${
                                isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                            }`}
                            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                        >
                            <Music className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 
                                className="text-xs font-bold text-gray-800 line-clamp-1"
                                style={{ fontFamily: `"${bodyFontFamily}", sans-serif` }}
                            >
                                {songTitle}
                            </h4>
                            <p 
                                className="text-[10px] text-gray-400 font-medium"
                                style={{ fontFamily: `"${bodyFontFamily}", sans-serif` }}
                            >
                                {isPlaying ? 'Playing Background Music' : 'Music Paused'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:opacity-90 active:scale-95 transition-all"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4" style={{ color: iconColor }} />
                        ) : (
                            <Play className="w-4 h-4 ml-0.5" style={{ color: iconColor }} />
                        )}
                    </button>
                </>
            )}

            {/* Custom keyframes injected via inline style tag for custom soundwave/spin */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes soundwave {
                    0% { height: 4px; }
                    100% { height: 12px; }
                }
            `}} />
        </div>
    );
}
