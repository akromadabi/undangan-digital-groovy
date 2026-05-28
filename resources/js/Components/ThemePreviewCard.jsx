import React from 'react';
import { Link } from '@inertiajs/react';

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
    return `/storage/${path}`;
};

export default function ThemePreviewCard({ theme, reseller = null, isDemoLink = true, onlyMockup = false, aspectClass = 'aspect-[3/4]' }) {
    const isDynamic = theme.preview_template && theme.preview_template !== 'full-mockup' && theme.preview_images && theme.preview_images.length > 0;
    
    // Background Styles
    const bgStyles = {
        'gradient-indigo': 'bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]',
        'gradient-emerald': 'bg-gradient-to-br from-[#11998e] to-[#38ef7d]',
        'gradient-rose': 'bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#a1c4fd]',
        'luxury-gold': 'bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0a0a0a] border border-amber-500/10',
        'glassmorphism': 'bg-gradient-to-br from-gray-100 to-gray-200 border border-white/40',
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
                className={`phone-mockup relative ${widthClass} aspect-[9/18.5] bg-black border-[4px] sm:border-[5px] border-[#1a1a1a] rounded-[20px] sm:rounded-[24px] overflow-hidden transition-all duration-500 ${perspectiveClass} ${additionalClass}`}
                style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: isScaledDown 
                        ? '-8px 16px 24px -8px rgba(0,0,0,0.3), -2px 5px 10px -4px rgba(0,0,0,0.15)'
                        : '-12px 24px 32px -8px rgba(0,0,0,0.35), -3px 8px 16px -6px rgba(0,0,0,0.15)',
                }}
            >
                {/* Speaker/Camera Bar */}
                <div className="absolute top-[4px] sm:top-[6px] left-1/2 -translate-x-1/2 w-10 sm:w-14 h-2 sm:h-3.5 bg-black rounded-full z-30 flex items-center justify-center">
                    {/* Camera */}
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#222] rounded-full mr-1.5 sm:mr-2" />
                    {/* Speaker */}
                    <div className="w-4 sm:w-6 h-0.5 bg-[#333] rounded-full" />
                </div>
                
                {/* Screen Container */}
                <div className="w-full h-full overflow-hidden bg-gray-900 rounded-[15px] sm:rounded-[19px] relative group-hover:shadow-inner">
                    <img 
                        src={getImageUrl(imageSrc)} 
                        alt="Screen Preview"
                        className="w-full h-full object-cover object-top transition-[object-position] duration-[5s] ease-in-out group-hover:object-bottom"
                    />
                    {/* Glass glare overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-10" />
                    {/* Bezel inner highlight */}
                    <div className="absolute inset-0 border border-white/10 rounded-[15px] sm:rounded-[19px] pointer-events-none z-10" />
                </div>
            </div>
        );
    };

    // Render natural ambient occlusion / ground shadows underneath mockups
    const renderGroundShadow = (offsetClass = '', widthClass = 'w-[50%] max-w-[135px]', opacity = 'opacity-55', bottomClass = 'bottom-[12%]') => {
        return (
            <div 
                className={`absolute ${bottomClass} left-1/2 -translate-x-1/2 ${widthClass} h-2.5 bg-black/45 rounded-full blur-[6px] pointer-events-none select-none z-0 transform ${opacity} ${offsetClass}`}
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
        if (!isDynamic) {
            // Full Mockup Mode (Fallback)
            return (
                <div className={`${aspectClass} bg-gray-100 overflow-hidden relative w-full h-full`}>
                    {theme.thumbnail ? (
                        <img
                            src={getImageUrl(theme.thumbnail)}
                            alt={theme.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                        </div>
                    )}
                </div>
            );
        }

        const images = theme.preview_images || [];
        const template = theme.preview_template;

        if (template === 'single-phone') {
            return (
                <div className={`w-full h-full ${aspectClass} flex items-center justify-center p-3 sm:p-6 relative overflow-hidden`} style={{ perspective: '800px' }}>
                    {renderBackgroundDecorations(theme.preview_bg_style)}
                    
                    {/* Natural ambient ground shadow */}
                    {renderGroundShadow('translate-y-[80%]', 'w-[54%] max-w-[145px]', 'opacity-65')}
                    
                    <div className="relative z-10 animate-in fade-in zoom-in duration-300 w-[70%] max-w-[185px]">
                        {renderPhone(images[0])}
                    </div>
                </div>
            );
        }

        if (template === 'double-phone') {
            return (
                <div className={`w-full h-full ${aspectClass} flex items-center justify-center relative overflow-hidden p-2 sm:p-4`} style={{ perspective: '800px' }}>
                    {renderBackgroundDecorations(theme.preview_bg_style)}
                    
                    {/* Left phone ground shadow */}
                    {renderGroundShadow('-translate-x-[35%] rotate-[-5deg]', 'w-[55%] max-w-[150px]', 'opacity-50', 'bottom-[11%]')}
                    
                    {/* Right phone ground shadow */}
                    {renderGroundShadow('translate-x-[19%] rotate-[4deg]', 'w-[55%] max-w-[150px]', 'opacity-60', 'bottom-[7%]')}
                    
                    {/* Back Left Phone */}
                    <div className="absolute w-[55%] max-w-[150px] -translate-x-[35%] -translate-y-[2%] transform transition-transform duration-500 group-hover:-translate-x-[39%] z-10">
                        {renderPhone(images[1] || images[0], true, '', true, false)}
                    </div>
                    {/* Front Right Phone */}
                    <div className="absolute w-[55%] max-w-[150px] translate-x-[19%] translate-y-[6%] transform transition-transform duration-500 group-hover:translate-x-[23%] z-20">
                        {renderPhone(images[0], false, '', false, true)}
                    </div>
                </div>
            );
        }

        if (template === 'triple-phone') {
            return (
                <div className={`w-full h-full ${aspectClass} flex items-center justify-center relative overflow-hidden p-1 sm:p-2`} style={{ perspective: '800px' }}>
                    {renderBackgroundDecorations(theme.preview_bg_style)}
                    
                    {/* Left phone shadow */}
                    {renderGroundShadow('-translate-x-[45%] rotate-[-8deg]', 'w-[44%] max-w-[125px]', 'opacity-40', 'bottom-[11%]')}
                    
                    {/* Right phone shadow */}
                    {renderGroundShadow('translate-x-[45%] rotate-[8deg]', 'w-[44%] max-w-[125px]', 'opacity-40', 'bottom-[11%]')}
                    
                    {/* Center phone shadow */}
                    {renderGroundShadow('translate-x-[0%] rotate-[0deg]', 'w-[44%] max-w-[125px]', 'opacity-65', 'bottom-[7%]')}
                    
                    {/* Left Back Phone */}
                    <div className="absolute w-[44%] max-w-[125px] -translate-x-[45%] -translate-y-[2%] transform transition-transform duration-500 group-hover:-translate-x-[53%] z-10">
                        {renderPhone(images[1] || images[0], true, '', true, false)}
                    </div>
                    {/* Right Back Phone */}
                    <div className="absolute w-[44%] max-w-[125px] translate-x-[45%] -translate-y-[2%] transform transition-transform duration-500 group-hover:translate-x-[53%] z-10">
                        {renderPhone(images[2] || images[0], true, '', false, true)}
                    </div>
                    {/* Center Front Phone */}
                    <div className="absolute w-[44%] max-w-[125px] translate-y-[6%] z-20 transform transition-transform duration-500 group-hover:scale-[1.03] group-hover:translate-y-[4%]">
                        {renderPhone(images[0], false, '', false, false)}
                    </div>
                </div>
            );
        }

        return null;
    };

    // Render dynamic reseller watermark in the bottom-left empty space
    const renderWatermark = () => {
        if (!reseller) return null;

        const isLuxury = theme.preview_bg_style === 'luxury-gold';
        const textClass = isLuxury 
            ? 'text-amber-500/35 font-serif' 
            : 'text-white/25 font-sans';

        const logoFilter = isLuxury
            ? 'brightness(0) sepia(1) hue-rotate(15deg) saturate(3)'
            : 'brightness(0) invert(1)';
            
        const logoOpacity = isLuxury ? 0.35 : 0.25;

        return (
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
                <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest uppercase ${textClass}`}>
                    {reseller.brand_name}
                </span>
            </div>
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
                        <span className="text-[11px] text-gray-400 capitalize">{theme.category || 'Umum'}</span>
                        {theme.is_premium ? (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full tracking-wider">PREMIUM</span>
                        ) : (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full tracking-wider">GRATIS</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
