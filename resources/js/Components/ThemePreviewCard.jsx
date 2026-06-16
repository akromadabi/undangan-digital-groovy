import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import AnimatedLikeButton from './AnimatedLikeButton';

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
    return `/storage/${path}`;
};

export default function ThemePreviewCard({ theme, reseller = null, isDemoLink = true, onlyMockup = false, aspectClass = 'aspect-[3/4]' }) {
    const isDynamic = theme.preview_template && theme.preview_template !== 'full-mockup' && theme.preview_images && theme.preview_images.length > 0;
    
    // Likes internal state
    const [liked, setLiked] = useState(() => {
        try {
            const key1 = localStorage.getItem('likedThemes');
            if (key1) {
                const parsed = JSON.parse(key1);
                if (Array.isArray(parsed)) {
                    if (parsed.includes(theme.id) || parsed.includes(String(theme.id))) return true;
                } else if (parsed && typeof parsed === 'object') {
                    if (parsed[theme.id]) return true;
                }
            }
            const key2 = localStorage.getItem('liked_themes');
            if (key2) {
                const parsed = JSON.parse(key2);
                if (Array.isArray(parsed) && (parsed.includes(theme.id) || parsed.includes(String(theme.id)))) return true;
            }
        } catch {}
        return false;
    });

    const [imgErr, setImgErr] = useState(false);

    const [count, setCount] = useState(() => {
        const base = Number(theme.base_likes || 0);
        const real = Number(theme.real_likes || 0);
        return base + real;
    });

    const handleLikeClick = async (e) => {
        if (e) {
            e.preventDefault?.();
            e.stopPropagation?.();
        }
        
        const nextLiked = !liked;
        setLiked(nextLiked);
        setCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));
        
        try {
            let key1Val = {};
            const key1Raw = localStorage.getItem('likedThemes');
            if (key1Raw) {
                try {
                    const parsed = JSON.parse(key1Raw);
                    if (parsed && typeof parsed === 'object') key1Val = parsed;
                } catch {}
            }
            if (Array.isArray(key1Val)) {
                if (nextLiked) {
                    if (!key1Val.includes(theme.id)) key1Val.push(theme.id);
                } else {
                    key1Val = key1Val.filter(x => x !== theme.id && x !== String(theme.id));
                }
            } else {
                if (nextLiked) key1Val[theme.id] = true;
                else delete key1Val[theme.id];
            }
            localStorage.setItem('likedThemes', JSON.stringify(key1Val));
            
            let key2Val = [];
            const key2Raw = localStorage.getItem('liked_themes');
            if (key2Raw) {
                try {
                    const parsed = JSON.parse(key2Raw);
                    if (Array.isArray(parsed)) key2Val = parsed;
                } catch {}
            }
            if (nextLiked) {
                if (!key2Val.includes(theme.id)) key2Val.push(theme.id);
            } else {
                key2Val = key2Val.filter(x => x !== theme.id && x !== String(theme.id));
            }
            localStorage.setItem('liked_themes', JSON.stringify(key2Val));
        } catch {}
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch(`/theme/${theme.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ liked: nextLiked })
            });
            const result = await response.json();
            if (result.success) {
                setCount(result.likes);
            }
        } catch (err) {
            console.error('Like request failed:', err);
        }
    };
    
    // Background Styles
    const bgStyles = {
        'gradient-indigo':  'bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]',
        'gradient-emerald': 'bg-gradient-to-br from-[#11998e] to-[#38ef7d]',
        'gradient-rose':    'bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#a1c4fd]',
        'gradient-purple':  'bg-gradient-to-br from-[#667eea] to-[#764ba2]',
        'gradient-pink':    'bg-gradient-to-br from-[#f093fb] to-[#f5576c]',
        'gradient-dark':    'bg-gradient-to-br from-[#0d0915] via-[#1b102b] to-[#09090b]',
        'luxury-gold':      'bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0a0a0a] border border-amber-500/10',
        'glassmorphism':    'bg-gradient-to-br from-gray-100 to-gray-200 border border-white/40',
        'studio-split':     'bg-[#bf6c54] overflow-hidden border border-white/10',
        'studio-clay-sand': 'bg-[#e8dcd3] overflow-hidden border border-white/10',
        'studio-velvet-rose': 'bg-[#dcb3a6] overflow-hidden border border-white/10',
        'studio-sage-cream': 'bg-[#ece7df] overflow-hidden border border-white/10',
    };

    const activeBg = bgStyles[theme.preview_bg_style || 'gradient-indigo'] || bgStyles['gradient-indigo'];

    // Render single phone mockup with natural 3D drop-shadows and premium styling
    const renderPhone = (imageSrc, isScaledDown = false, additionalClass = '', isLeftSkew = false, isRightSkew = false, widthClass = 'w-full') => {
        // Build 3D perspective classes based on role
        let perspectiveClass = 'phone-rotate-default';
        if (isLeftSkew) {
            perspectiveClass = 'phone-rotate-left';
        } else if (isRightSkew) {
            perspectiveClass = 'phone-rotate-right';
        } else if (isScaledDown) {
            perspectiveClass = 'phone-rotate-scaled';
        }

        return (
            <div 
                className={`phone-mockup relative ${widthClass} aspect-[9/17.8] bg-black border-[2px] sm:border-[3.2px] border-[#1a1a1a] rounded-[13px] sm:rounded-[22px] overflow-hidden transition-all duration-500 ${perspectiveClass} ${isScaledDown ? 'phone-back' : 'phone-front'} ${additionalClass}`}
                style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: isScaledDown 
                        ? '-8px 16px 24px -8px rgba(0,0,0,0.3), -2px 5px 10px -4px rgba(0,0,0,0.15)'
                        : '-12px 24px 32px -8px rgba(0,0,0,0.35), -3px 8px 16px -6px rgba(0,0,0,0.15)',
                }}
            >
                {/* Speaker/Camera Bar */}
                <div className="absolute top-[2.5px] sm:top-[6px] left-1/2 -translate-x-1/2 w-6 sm:w-9 h-1 sm:h-2 bg-black rounded-full z-30 flex items-center justify-center">
                    {/* Camera */}
                    <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#111] rounded-full mr-0.5 sm:mr-1.5" />
                    {/* Speaker */}
                    <div className="w-2 sm:w-4 h-0.5 bg-[#222] rounded-full" />
                </div>
                
                {/* Screen Container */}
                <div className="w-full h-full overflow-hidden bg-gray-900 rounded-[11px] sm:rounded-[19px] relative group-hover:shadow-inner">
                    <img 
                        src={getImageUrl(imageSrc)} 
                        alt="Screen Preview"
                        className="w-full h-full object-cover object-top transition-[object-position] duration-[5s] ease-in-out group-hover:object-bottom"
                    />
                    {/* Glass glare overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-10" />
                    {/* Bezel inner highlight */}
                    <div className="absolute inset-0 border border-white/10 rounded-[11px] sm:rounded-[19px] pointer-events-none z-10" />
                </div>
            </div>
        );
    };

    // Render natural ambient occlusion / ground shadows underneath mockups
    const renderGroundShadow = (offsetClass = '', widthClass = 'w-[50%] max-w-[135px]', opacity = 'opacity-55', bottomClass = 'bottom-[12%]') => {
        return (
            <div 
                className={`absolute ${bottomClass} left-1/2 -translate-x-1/2 ${widthClass} h-3.5 bg-black/30 rounded-full blur-md pointer-events-none select-none z-0 transform ${opacity} ${offsetClass}`}
            />
        );
    };

    // Render premium dynamic background decorations (professional studio theme backdrops)
    const renderBackgroundDecorations = (bgStyle) => {
        const selectedStyle = bgStyle || 'gradient-indigo';
        
        switch (selectedStyle) {
            case 'gradient-indigo':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]">
                        {/* Subtle professional grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:18px_18px]" />
                        {/* Smooth radial glow spotlight directly behind the mockups */}
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[75px]" />
                        {/* Studio floor shadow gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                );
            case 'gradient-emerald':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#011c15]">
                        {/* Abstract organic plant shadow overlays */}
                        <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-emerald-500/5 blur-2xl" />
                        {/* Subtle dot matrix pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.03)_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />
                        {/* Soft emerald studio backlighting */}
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-[80px]" />
                        {/* Studio floor shadow gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
                    </div>
                );
            case 'gradient-rose':
                return (
                    // Terracotta studio clay backdrop from reference image
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#bf6c54]">
                        {/* Soft circular studio ambient lighting */}
                        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/10 blur-[80px]" />
                        {/* Smooth floor depth shadow transition */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
                    </div>
                );
            case 'luxury-gold':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-b from-[#111111] via-[#1c1917] to-[#0c0a09] border border-amber-500/15">
                        {/* Elegant premium gold diagonal stripes */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(217,119,6,0.012)_25%,transparent_25%,transparent_50%,rgba(217,119,6,0.012)_50%,rgba(217,119,6,0.012)_75%,transparent_75%,transparent)] bg-[size:48px_48px]" />
                        {/* Soft golden spotlight behind mockups */}
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/8 blur-[70px]" />
                        {/* Luxury glowing stars */}
                        <div className="absolute top-[25%] left-[20%] text-amber-500/20 text-xs animate-pulse">✦</div>
                        <div className="absolute bottom-[35%] right-[22%] text-amber-500/20 text-[10px] animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
                        {/* Dark ground depth shadow */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                );
            case 'studio-split':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#bf6c54] overflow-hidden">
                        {/* Diagonal Left Split Panel (Deep Charcoal Green/Grey) */}
                        <div 
                            className="absolute inset-y-0 -left-[15%] w-[68%] bg-[#1b2421] transform skew-x-[-15deg] origin-top shadow-[15px_0_45px_rgba(0,0,0,0.45)] border-r border-white/5"
                        />
                        {/* Soft white spotlights for depth */}
                        {/* Light source on left panel */}
                        <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-white/5 blur-[65px]" />
                        {/* Light source on right panel */}
                        <div className="absolute top-[40%] right-[10%] w-72 h-72 rounded-full bg-white/10 blur-[80px]" />
                        {/* Ambient room shadow bottom overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                    </div>
                );
            case 'studio-clay-sand':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#e8dcd3] overflow-hidden">
                        {/* Skewed Left Panel: Organic Terracotta Clay */}
                        <div 
                            className="absolute inset-y-0 -left-[20%] w-[70%] bg-[#a3563f] transform skew-x-[-12deg] origin-top shadow-[12px_0_35px_rgba(0,0,0,0.3)] border-r border-white/5"
                        />
                        {/* Spotlights */}
                        <div className="absolute top-[15%] left-[20%] w-60 h-60 rounded-full bg-white/5 blur-[70px]" />
                        <div className="absolute top-[35%] right-[10%] w-64 h-64 rounded-full bg-white/20 blur-[60px]" />
                        {/* Ground Ambient shadow */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
                    </div>
                );
            case 'studio-velvet-rose':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#dcb3a6] overflow-hidden">
                        {/* Skewed Left Panel: Deep Velvet Slate */}
                        <div 
                            className="absolute inset-y-0 -left-[18%] w-[68%] bg-[#231f30] transform skew-x-[-18deg] origin-top shadow-[20px_0_50px_rgba(0,0,0,0.45)] border-r border-white/5"
                        />
                        {/* Spotlights */}
                        <div className="absolute top-[20%] left-[25%] w-72 h-72 rounded-full bg-[#dcb3a6]/10 blur-[85px]" />
                        <div className="absolute top-[30%] right-[15%] w-60 h-60 rounded-full bg-white/15 blur-[65px]" />
                        {/* Ground Ambient shadow */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                    </div>
                );
            case 'studio-sage-cream':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#ece7df] overflow-hidden">
                        {/* Skewed Left Panel: Nordic Sage Green */}
                        <div 
                            className="absolute inset-y-0 -left-[15%] w-[65%] bg-[#5f7065] transform skew-x-[-15deg] origin-top shadow-[15px_0_40px_rgba(0,0,0,0.25)] border-r border-white/5"
                        />
                        {/* Spotlights */}
                        <div className="absolute top-[25%] left-[20%] w-60 h-60 rounded-full bg-white/5 blur-[70px]" />
                        <div className="absolute top-[35%] right-[15%] w-64 h-64 rounded-full bg-white/25 blur-[75px]" />
                        {/* Ground Ambient shadow */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                    </div>
                );
            case 'gradient-purple':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-br from-[#2d1b69] via-[#11998e]/30 to-[#2d1b69]">
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(102,126,234,0.15)_1.5px,transparent_1.5px)] bg-[size:20px_20px]" />
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-purple-500/15 blur-[80px]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                );
            case 'gradient-pink':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-br from-[#6b0f3a] via-[#a8134e] to-[#4a0728]">
                        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-500/20 blur-[75px]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                );
            case 'gradient-dark':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-br from-[#0d0915] via-[#1b102b] to-[#09090b]">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(180,100,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(180,100,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-700/10 blur-[90px]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                );
            case 'glassmorphism':
            default:
                return (
                    // Minimal professional studio grey/beige backdrop from reference image
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#9e9590]">
                        {/* Soft studio light ring */}
                        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/15 blur-[70px]" />
                        {/* Clean studio base divider */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                    </div>
                );
        }
    };

    // Render theme content based on layout
    const renderPreviewContent = () => {
        if (!isDynamic || imgErr) {
            // Full Mockup Mode (Fallback)
            return (
                <div className="absolute inset-0 bg-gray-100 overflow-hidden">
                    {theme.thumbnail && !imgErr ? (
                        <img
                            src={getImageUrl(theme.thumbnail)}
                            alt={theme.name}
                            onError={() => setImgErr(true)}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative">
                            {/* Premium abstract card design */}
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[size:24px_24px] pointer-events-none" />
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 shadow-lg relative z-10">
                                <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.518 1.358L12 12.75v3m-3-12.75l.041-.02a.75.75 0 11.518 1.358L9 4.25v3M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                                </svg>
                            </div>
                            <span className="text-[9px] uppercase tracking-[0.25em] text-rose-400 font-bold mb-1.5 relative z-10">Premium Template</span>
                            <span className="font-semibold text-center text-xs px-2 text-slate-200 relative z-10">{theme.name}</span>
                        </div>
                    )}
                </div>
            );
        }

        const images = theme.preview_images || [];
        const template = theme.preview_template;

        if (template === 'single-phone') {
            return (
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 overflow-hidden" style={{ perspective: '800px' }}>
                    {renderBackgroundDecorations(theme.preview_bg_style)}
                    
                    {/* Natural ambient ground shadow */}
                    {renderGroundShadow('translate-y-[80%]', 'w-[54%] max-w-[145px]', 'opacity-65')}
                    
                    <div className="relative z-10 animate-in fade-in zoom-in duration-300 w-[65%] sm:w-[70%] max-w-[185px]">
                        {renderPhone(images[0])}
                    </div>
                </div>
            );
        }

        if (template === 'double-phone') {
            return (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-1 sm:p-3" style={{ perspective: '800px' }}>
                    {renderBackgroundDecorations(theme.preview_bg_style)}
                    
                    {/* Left phone ground shadow */}
                    {renderGroundShadow('-translate-x-[35%] rotate-[-5deg]', 'w-[45%] max-w-[150px]', 'opacity-50', 'bottom-[11%]')}
                    
                    {/* Right phone ground shadow */}
                    {renderGroundShadow('translate-x-[19%] rotate-[4deg]', 'w-[45%] max-w-[150px]', 'opacity-60', 'bottom-[7%]')}
                    
                    {/* Back Left Phone */}
                    <div className="absolute w-[50%] sm:w-[55%] max-w-[150px] -translate-x-[28%] -translate-y-[2%] transform transition-transform duration-500 group-hover:-translate-x-[32%] z-10">
                        {renderPhone(images[1] || images[0], true, '', true, false)}
                    </div>
                    {/* Front Right Phone */}
                    <div className="absolute w-[50%] sm:w-[55%] max-w-[150px] translate-x-[14%] translate-y-[6%] transform transition-transform duration-500 group-hover:translate-x-[18%] z-20">
                        {renderPhone(images[0], false, '', false, true)}
                    </div>
                </div>
            );
        }

        if (template === 'triple-phone') {
            return (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-1 sm:p-2 triple-phone-layout" style={{ perspective: '800px' }}>
                    {renderBackgroundDecorations(theme.preview_bg_style)}
                    
                    {/* Left phone shadow */}
                    {renderGroundShadow('-translate-x-[46%] rotate-[0deg]', 'w-[38%] max-w-[130px]', 'opacity-25', 'bottom-[10%]')}
                    
                    {/* Right phone shadow */}
                    {renderGroundShadow('translate-x-[46%] rotate-[0deg]', 'w-[38%] max-w-[130px]', 'opacity-25', 'bottom-[10%]')}
                    
                    {/* Center phone shadow */}
                    {renderGroundShadow('translate-x-[0%] rotate-[0deg]', 'w-[38%] max-w-[130px]', 'opacity-50', 'bottom-[7%]')}
                    
                    {/* Left Back Phone */}
                    <div className="absolute w-[42%] sm:w-[46%] max-w-[130px] -translate-x-[40%] -translate-y-[4%] transform transition-transform duration-500 group-hover:-translate-x-[45%] z-10">
                        {renderPhone(images[1] || images[0], true, '', true, false)}
                    </div>
                    {/* Right Back Phone */}
                    <div className="absolute w-[42%] sm:w-[46%] max-w-[130px] translate-x-[40%] -translate-y-[4%] transform transition-transform duration-500 group-hover:translate-x-[45%] z-10">
                        {renderPhone(images[2] || images[0], true, '', false, true)}
                    </div>
                    {/* Center Front Phone */}
                    <div className="absolute w-[42%] sm:w-[46%] max-w-[130px] translate-y-[5%] z-20 transform transition-transform duration-500 group-hover:scale-[1.03] group-hover:translate-y-[3%]">
                        {renderPhone(images[0], false, '', false, false)}
                    </div>
                </div>
            );
        }

        return null;
    };

    // Render dynamic reseller watermark (both diagonal texture behind and clean bottom-left branding)
    const renderWatermark = () => {
        if (!reseller) return null;

        const isLuxury = theme.preview_bg_style === 'luxury-gold';
        
        // 1. Styling for diagonal background watermark
        const diagonalTextClass = isLuxury 
            ? 'text-amber-500/15 font-serif' 
            : 'text-white/10 font-sans';
            
        // 2. Styling for bottom-left branding watermark
        const cornerTextClass = isLuxury 
            ? 'text-amber-500/35 font-serif' 
            : 'text-white/25 font-sans';

        const logoFilter = isLuxury
            ? 'brightness(0) sepia(1) hue-rotate(15deg) saturate(3)'
            : 'brightness(0) invert(1)';
            
        const logoOpacity = isLuxury ? 0.35 : 0.25;

        return (
            <>
                {/* Diagonal Multi-line Watermark Texture behind mockups */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
                    <div className="flex flex-col gap-3 sm:gap-5 rotate-[-25deg] opacity-60">
                        <span className={`text-[14px] sm:text-[16px] uppercase font-black tracking-[0.2em] whitespace-nowrap translate-x-[-15%] ${diagonalTextClass}`}>
                            {reseller.brand_name}
                        </span>
                        <span className={`text-[18px] sm:text-[20px] uppercase font-black tracking-[0.2em] whitespace-nowrap ${diagonalTextClass}`}>
                            {reseller.brand_name}
                        </span>
                        <span className={`text-[14px] sm:text-[16px] uppercase font-black tracking-[0.2em] whitespace-nowrap translate-x-[15%] ${diagonalTextClass}`}>
                            {reseller.brand_name}
                        </span>
                    </div>
                </div>

                {/* Bottom-left clean branding watermark */}
                <div className="absolute bottom-3.5 left-3.5 z-20 pointer-events-none select-none flex items-center gap-1.5">
                    {reseller.brand_logo && (
                        <img 
                            src={reseller.brand_logo} 
                            alt="" 
                            className="h-3 sm:h-3.5 w-auto object-contain max-w-[45px]"
                            style={{ filter: logoFilter, opacity: logoOpacity }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    )}
                    <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest uppercase ${cornerTextClass}`}>
                        {reseller.brand_name}
                    </span>
                </div>
            </>
        );
    };

    if (onlyMockup) {
        return (
            <div className="group relative w-full h-full overflow-hidden bg-gray-50 flex items-center justify-center">
                {renderPreviewContent()}
                {isDynamic && renderWatermark()}
            </div>
        );
    }

    const actionUrl = theme.preview_url || route('demo.theme', { slug: theme.slug });

    return (
        <div className="group theme-card relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            
            {/* Aspect container for the main preview area */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                {renderPreviewContent()}
                {isDynamic && renderWatermark()}
                
                {/* Overlay Action Buttons on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
                    {isDemoLink ? (
                        <a
                            href={actionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-[#E5654B] text-white rounded-full text-xs font-bold hover:bg-[#d4523a] transition-all transform scale-90 group-hover:scale-100 shadow-lg shadow-[#E5654B]/20"
                        >
                            Lihat Demo
                        </a>
                    ) : (
                        <span className="px-4 py-2 bg-white/95 text-gray-800 rounded-full text-xs font-bold shadow-md">
                            Live Preview
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom Card Meta Details */}
            <div className="p-3.5 flex-1 flex flex-col justify-between border-t border-gray-50">
                <div>
                    <h4 className="font-semibold text-sm text-[#1a1a1a] truncate group-hover:text-[#E5654B] transition-colors" title={theme.name}>
                        {theme.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-gray-400 capitalize">{theme.category || 'Umum'}</span>
                            {theme.is_premium ? (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full tracking-wider">PREMIUM</span>
                            ) : (
                                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full tracking-wider">GRATIS</span>
                            )}
                        </div>

                        {/* Like Button in bottom right */}
                        <div className="relative z-30 select-none">
                            <AnimatedLikeButton 
                                count={count}
                                liked={liked}
                                onClick={handleLikeClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
