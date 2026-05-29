import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function FreeInvitationBadge({ brandName = 'Groovy', brandUrl = '#', trialExpiresAt = 0 }) {
    const [remainingText, setRemainingText] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!trialExpiresAt) return;

        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const difference = trialExpiresAt - now;

            if (difference <= 0) {
                setRemainingText('0 detik');
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const textParts = [];
            if (days > 0) textParts.push(`${days} hari`);
            if (hours > 0 || days > 0) textParts.push(`${hours} jam`);
            if (minutes > 0 || hours > 0 || days > 0) textParts.push(`${minutes} menit`);
            textParts.push(`${seconds} detik`);

            setRemainingText(textParts.join(' '));
        };

        calculateTimeRemaining();
        const intervalId = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(intervalId);
    }, [trialExpiresAt]);

    const containerStyle = {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 999999,
        pointerEvents: 'auto',
        maxWidth: 'calc(100vw - 40px)',
    };

    const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(15, 23, 42, 0.85)', // slate-900 with opacity
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        borderRadius: '9999px',
        padding: '10px 20px',
        textDecoration: 'none',
        fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
        fontSize: '11px',
        smFontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        boxSizing: 'border-box',
        letterSpacing: '0.01em',
    };

    const textStyle = {
        color: 'rgba(255, 255, 255, 0.95)',
        lineHeight: '1.4',
        textAlign: 'left',
    };

    const brandStyle = {
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', // premium gradient
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: '700',
        marginLeft: '4px',
        marginRight: '4px',
    };

    const countdownStyle = {
        color: '#f59e0b', // amber-500 warning color
        fontWeight: '700',
        marginLeft: '4px',
        display: 'inline-block',
    };

    const activeLinkStyle = isHovered 
        ? {
            ...linkStyle,
            background: 'rgba(15, 23, 42, 0.95)',
            transform: 'translateY(-3px) scale(1.02)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            boxShadow: '0 12px 40px rgba(236, 72, 153, 0.25)', // glowing shadow matching pink accent
          }
        : linkStyle;

    return (
        <div style={containerStyle}>
            <a 
                href={brandUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={activeLinkStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Heart 
                    size={14} 
                    fill={isHovered ? '#ec4899' : 'transparent'} 
                    color={isHovered ? '#ec4899' : '#a855f7'}
                    style={{ transition: 'all 0.3s ease', flexShrink: 0 }}
                />
                <span style={textStyle}>
                    Undangan Dibuat secara Gratis di 
                    <span style={brandStyle}>{brandName}</span>. 
                    Undangan akan nonaktif dalam 
                    <span style={countdownStyle}>{remainingText}</span>
                </span>
            </a>
        </div>
    );
}
