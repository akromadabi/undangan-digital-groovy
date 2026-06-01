import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import AnimatedLikeButton from './AnimatedLikeButton';

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
    return `/storage/${path}`;
};

export default function GreetingCardPreviewCard({ theme, reseller = null, onlyMockup = false, aspectClass = 'aspect-[3/4]', onUse, typeOptions = {} }) {
    const isDynamic = theme.preview_template && theme.preview_template !== 'full-mockup' && theme.preview_images && theme.preview_images.length > 0;
    
    // Likes internal state for greeting card templates
    const [liked, setLiked] = useState(() => {
        try {
            const key1 = localStorage.getItem('likedGreetingCards');
            if (key1) {
                const parsed = JSON.parse(key1);
                if (Array.isArray(parsed)) {
                    if (parsed.includes(theme.id) || parsed.includes(String(theme.id))) return true;
                } else if (parsed && typeof parsed === 'object') {
                    if (parsed[theme.id]) return true;
                }
            }
            const key2 = localStorage.getItem('liked_greeting_cards');
            if (key2) {
                const parsed = JSON.parse(key2);
                if (Array.isArray(parsed) && (parsed.includes(theme.id) || parsed.includes(String(theme.id)))) return true;
            }
        } catch {}
        return false;
    });

    const [count, setCount] = useState(() => {
        return Number(theme.base_likes || 0);
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
            const key1Raw = localStorage.getItem('likedGreetingCards');
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
            localStorage.setItem('likedGreetingCards', JSON.stringify(key1Val));
            
            let key2Val = [];
            const key2Raw = localStorage.getItem('liked_greeting_cards');
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
            localStorage.setItem('liked_greeting_cards', JSON.stringify(key2Val));
        } catch {}
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch(`/greeting-card-template/${theme.id}/like`, {
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

    // Render single phone mockup
    const renderPhone = (imageSrc, isScaledDown = false, additionalClass = '', isLeftSkew = false, isRightSkew = false, widthClass = 'w-full') => {
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
                className={`phone-mockup relative ${widthClass} aspect-[9/18.5] bg-black border-[2px] sm:border-[5px] border-[#1a1a1a] rounded-[12px] sm:rounded-[24px] overflow-hidden transition-all duration-500 ${perspectiveClass} ${isScaledDown ? 'phone-back' : 'phone-front'} ${additionalClass}`}
                style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: isScaledDown 
                        ? '-8px 16px 24px -8px rgba(0,0,0,0.3), -2px 5px 10px -4px rgba(0,0,0,0.15)'
                        : '-12px 24px 32px -8px rgba(0,0,0,0.35), -3px 8px 16px -6px rgba(0,0,0,0.15)',
                }}
            >
                {/* Speaker/Camera Bar */}
                <div className="absolute top-[2.5px] sm:top-[6px] left-1/2 -translate-x-1/2 w-6 sm:w-9 h-1 sm:h-2 bg-black rounded-full z-30 flex items-center justify-center">
                    <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#111] rounded-full mr-0.5 sm:mr-1.5" />
                    <div className="w-2 sm:w-4 h-0.5 bg-[#222] rounded-full" />
                </div>
                
                {/* Screen Container */}
                <div className="w-full h-full overflow-hidden bg-gray-900 rounded-[9px] sm:rounded-[19px] relative group-hover:shadow-inner">
                    <img 
                        src={getImageUrl(imageSrc)} 
                        alt="Screen Preview"
                        className="w-full h-full object-cover object-top transition-[object-position] duration-[5s] ease-in-out group-hover:object-bottom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-10" />
                    <div className="absolute inset-0 border border-white/10 rounded-[9px] sm:rounded-[19px] pointer-events-none z-10" />
                </div>
            </div>
        );
    };

    // Render ground shadows
    const renderGroundShadow = (offsetClass = '', widthClass = 'w-[50%] max-w-[135px]', opacity = 'opacity-55', bottomClass = 'bottom-[12%]') => {
        return (
            <div 
                className={`absolute ${bottomClass} left-1/2 -translate-x-1/2 ${widthClass} h-3.5 bg-black/30 rounded-full blur-md pointer-events-none select-none z-0 transform ${opacity} ${offsetClass}`}
            />
        );
    };

    // Render background decorations
    const renderBackgroundDecorations = (bgStyle) => {
        const selectedStyle = bgStyle || 'gradient-indigo';
        
        switch (selectedStyle) {
            case 'gradient-indigo':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:18px_18px]" />
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[75px]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                );
            case 'gradient-emerald':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#011c15]">
                        <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-emerald-500/5 blur-2xl" />
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.03)_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-[80px]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
                    </div>
                );
            case 'gradient-rose':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#bf6c54]">
                        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/10 blur-[80px]" />
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
                    </div>
                );
            case 'luxury-gold':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-gradient-to-b from-[#111111] via-[#1c1917] to-[#0c0a09] border border-amber-500/15">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(217,119,6,0.012)_25%,transparent_25%,transparent_50%,rgba(217,119,6,0.012)_50%,rgba(217,119,6,0.012)_75%,transparent_75%,transparent)] bg-[size:48px_48px]" />
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/8 blur-[70px]" />
                        <div className="absolute top-[25%] left-[20%] text-amber-500/20 text-xs animate-pulse">✦</div>
                        <div className="absolute bottom-[35%] right-[22%] text-amber-500/20 text-[10px] animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                );
            case 'studio-split':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#bf6c54] overflow-hidden">
                        <div className="absolute inset-y-0 -left-[15%] w-[68%] bg-[#1b2421] transform skew-x-[-15deg] origin-top shadow-[15px_0_45px_rgba(0,0,0,0.45)] border-r border-white/5" />
                        <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-white/5 blur-[65px]" />
                        <div className="absolute top-[40%] right-[10%] w-72 h-72 rounded-full bg-white/10 blur-[80px]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                    </div>
                );
            case 'studio-clay-sand':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#e8dcd3] overflow-hidden">
                        <div className="absolute inset-y-0 -left-[20%] w-[70%] bg-[#a3563f] transform skew-x-[-12deg] origin-top shadow-[12px_0_35px_rgba(0,0,0,0.3)] border-r border-white/5" />
                        <div className="absolute top-[15%] left-[20%] w-60 h-60 rounded-full bg-white/5 blur-[70px]" />
                        <div className="absolute top-[35%] right-[10%] w-64 h-64 rounded-full bg-white/20 blur-[60px]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
                    </div>
                );
            case 'studio-velvet-rose':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#dcb3a6] overflow-hidden">
                        <div className="absolute inset-y-0 -left-[18%] w-[68%] bg-[#231f30] transform skew-x-[-18deg] origin-top shadow-[20px_0_50px_rgba(0,0,0,0.45)] border-r border-white/5" />
                        <div className="absolute top-[20%] left-[25%] w-72 h-72 rounded-full bg-[#dcb3a6]/10 blur-[85px]" />
                        <div className="absolute top-[30%] right-[15%] w-60 h-60 rounded-full bg-white/15 blur-[65px]" />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                    </div>
                );
            case 'studio-sage-cream':
                return (
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#ece7df] overflow-hidden">
                        <div className="absolute inset-y-0 -left-[15%] w-[65%] bg-[#5f7065] transform skew-x-[-15deg] origin-top shadow-[15px_0_40px_rgba(0,0,0,0.25)] border-r border-white/5" />
                        <div className="absolute top-[25%] left-[20%] w-60 h-60 rounded-full bg-white/5 blur-[70px]" />
                        <div className="absolute top-[35%] right-[15%] w-64 h-64 rounded-full bg-white/25 blur-[75px]" />
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
                    <div className="absolute inset-0 z-0 select-none pointer-events-none bg-[#9e9590]">
                        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/15 blur-[70px]" />
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                    </div>
                );
        }
    };

    // Render mockup preview
    const renderPreviewContent = () => {
        if (!isDynamic) {
            return (
                <div className="absolute inset-0 bg-gray-100 overflow-hidden">
                    {theme.thumbnail ? (
                        <img
                            src={getImageUrl(theme.thumbnail)}
                            alt={theme.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 relative">
                            <div className="absolute inset-0 opacity-20" style={{
                                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,101,163,0.5) 0%, transparent 60%), radial-gradient(circle at 70% 20%, rgba(100,60,200,0.4) 0%, transparent 50%)'
                            }} />
                            <div className="relative flex flex-col items-center justify-center text-center">
                                <svg className="w-10 h-10 text-white/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em]">{theme.slug}</span>
                            </div>
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
                    {renderGroundShadow('translate-y-[80%]', 'w-[54%] max-w-[145px]', 'opacity-65')}
                    <div className="relative z-10 animate-in fade-in zoom-in duration-300 w-[82%] sm:w-[70%] max-w-[185px]">
                        {renderPhone(images[0])}
                    </div>
                </div>
            );
        }

        if (template === 'double-phone') {
            return (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-1 sm:p-3" style={{ perspective: '800px' }}>
                    {renderBackgroundDecorations(theme.preview_bg_style)}
                    {renderGroundShadow('-translate-x-[35%] rotate-[-5deg]', 'w-[55%] max-w-[150px]', 'opacity-50', 'bottom-[11%]')}
                    {renderGroundShadow('translate-x-[19%] rotate-[4deg]', 'w-[55%] max-w-[150px]', 'opacity-60', 'bottom-[7%]')}
                    
                    <div className="absolute w-[62%] sm:w-[55%] max-w-[150px] -translate-x-[32%] -translate-y-[2%] transform transition-transform duration-500 group-hover:-translate-x-[36%] z-10">
                        {renderPhone(images[1] || images[0], true, '', true, false)}
                    </div>
                    <div className="absolute w-[62%] sm:w-[55%] max-w-[150px] translate-x-[16%] translate-y-[6%] transform transition-transform duration-500 group-hover:translate-x-[20%] z-20">
                        {renderPhone(images[0], false, '', false, true)}
                    </div>
                </div>
            );
        }

        if (template === 'triple-phone') {
            return (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-1 sm:p-2 triple-phone-layout" style={{ perspective: '800px' }}>
                    {renderBackgroundDecorations(theme.preview_bg_style)}
                    {renderGroundShadow('-translate-x-[46%] rotate-[0deg]', 'w-[46%] max-w-[130px]', 'opacity-25', 'bottom-[10%]')}
                    {renderGroundShadow('translate-x-[46%] rotate-[0deg]', 'w-[46%] max-w-[130px]', 'opacity-25', 'bottom-[10%]')}
                    {renderGroundShadow('translate-x-[0%] rotate-[0deg]', 'w-[46%] max-w-[130px]', 'opacity-50', 'bottom-[7%]')}
                    
                    <div className="absolute w-[52%] sm:w-[46%] max-w-[130px] -translate-x-[42%] -translate-y-[4%] transform transition-transform duration-500 group-hover:-translate-x-[48%] z-10">
                        {renderPhone(images[1] || images[0], true, '', true, false)}
                    </div>
                    <div className="absolute w-[52%] sm:w-[46%] max-w-[130px] translate-x-[42%] -translate-y-[4%] transform transition-transform duration-500 group-hover:translate-x-[48%] z-10">
                        {renderPhone(images[2] || images[0], true, '', false, true)}
                    </div>
                    <div className="absolute w-[52%] sm:w-[46%] max-w-[130px] translate-y-[5%] z-20 transform transition-transform duration-500 group-hover:scale-[1.03] group-hover:translate-y-[3%]">
                        {renderPhone(images[0], false, '', false, false)}
                    </div>
                </div>
            );
        }

        return null;
    };

    // Render watermark branding for resellers
    const renderWatermark = () => {
        if (!reseller) return null;

        const isLuxury = theme.preview_bg_style === 'luxury-gold';
        const diagonalTextClass = isLuxury ? 'text-amber-500/15 font-serif' : 'text-white/10 font-sans';
        const cornerTextClass = isLuxury ? 'text-amber-500/35 font-serif' : 'text-white/25 font-sans';
        const logoFilter = isLuxury ? 'brightness(0) sepia(1) hue-rotate(15deg) saturate(3)' : 'brightness(0) invert(1)';
        const logoOpacity = isLuxury ? 0.35 : 0.25;

        return (
            <>
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

    const actionUrl = `/demo-kartu/${theme.slug}`;

    return (
        <div className="group theme-card relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            {/* Aspect container for the main preview area */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                {renderPreviewContent()}
                {isDynamic && renderWatermark()}
                
                {/* Overlay Action Buttons on Hover */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col gap-2.5 items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                    <button
                        type="button"
                        onClick={() => onUse?.(theme.slug)}
                        className="px-5 py-2 bg-[#E5654B] text-white rounded-full text-xs font-bold hover:bg-[#d4523a] transition-all transform scale-90 group-hover:scale-100 shadow-lg shadow-[#E5654B]/25"
                    >
                        Buat Kartu
                    </button>
                    <a
                        href={actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2 bg-white/20 backdrop-blur-md text-white border border-white/25 rounded-full text-xs font-bold hover:bg-white hover:text-gray-800 transition-all transform scale-90 group-hover:scale-100"
                    >
                        Lihat Demo
                    </a>
                </div>
            </div>

            {/* Bottom Card Meta Details */}
            <div className="p-3.5 flex-1 flex flex-col justify-between border-t border-gray-50">
                <div>
                    <h4 className="font-semibold text-sm text-[#1a1a1a] truncate group-hover:text-[#E5654B] transition-colors" title={theme.name}>
                        {theme.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1.5">
                        <div className="flex flex-wrap gap-1 max-w-[70%]">
                            {(theme.type || []).slice(0, 2).map(t => (
                                <span key={t} className="text-[9.5px] font-bold bg-[#E5654B]/5 text-[#E5654B] border border-[#E5654B]/10 px-2 py-0.5 rounded-full tracking-wider truncate max-w-[90px]">
                                    {typeOptions[t] || t}
                                </span>
                            ))}
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
