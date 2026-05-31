import React, { useState, useEffect } from 'react';

export default function FreeInvitationBadge({ brandName = 'Groovy', brandUrl = '#', trialExpiresAt = 0, adminWhatsappUrl = '#' }) {
    const [remainingText, setRemainingText] = useState('');

    useEffect(() => {
        if (!trialExpiresAt) return;

        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const difference = trialExpiresAt - now;

            if (difference <= 0) {
                setRemainingText('Expired');
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
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        width: '100%',
        maxWidth: '440px',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxSizing: 'border-box',
        userSelect: 'none',
        pointerEvents: 'auto',
    };

    const pillStyle = {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.95)',
        color: '#1f2937',
        border: '1px solid rgba(229, 231, 235, 0.8)',
        borderRadius: '9999px',
        padding: '10px 20px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
    };

    const dotWrapperStyle = {
        display: 'flex',
        height: '10px',
        width: '10px',
        position: 'relative',
        marginRight: '10px',
        flexShrink: 0,
    };

    const pingStyle = {
        position: 'absolute',
        display: 'inline-flex',
        height: '100%',
        width: '100%',
        borderRadius: '50%',
        backgroundColor: '#34d399',
        opacity: 0.75,
        animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
    };

    const dotStyle = {
        position: 'relative',
        display: 'inline-flex',
        borderRadius: '50%',
        height: '10px',
        width: '10px',
        backgroundColor: '#10b981',
    };

    const textGroupStyle = {
        textAlign: 'left',
        flexGrow: 1,
    };

    const labelStyle = {
        fontSize: '9px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#6b7280',
        fontWeight: '800',
        margin: 0,
        lineHeight: 1,
    };

    const infoStyle = {
        fontSize: '11px',
        fontWeight: '800',
        color: '#059669',
        margin: '2px 0 0 0',
        lineHeight: 1,
    };

    const buttonStyle = {
        fontSize: '10px',
        backgroundColor: '#10b981',
        color: '#ffffff',
        borderRadius: '9999px',
        padding: '6px 14px',
        fontWeight: '700',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    };

    return (
        <div style={containerStyle}>
            <div style={pillStyle}>
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <span style={dotWrapperStyle}>
                        <span style={pingStyle}></span>
                        <span style={dotStyle}></span>
                    </span>
                    <div style={textGroupStyle}>
                        <p style={labelStyle}>Masa Coba Gratis</p>
                        <p style={infoStyle}>Tersisa {remainingText}</p>
                    </div>
                </div>
                
                <a 
                    href={adminWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                    Aktifkan Tema
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{ marginLeft: '4px' }}>
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-11.597c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.174.2-.298.3-.496.103-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                    </svg>
                </a>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}} />
        </div>
    );
}
