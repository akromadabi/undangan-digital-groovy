import React from 'react';
import { Head } from '@inertiajs/react';
import { AlertTriangle, ShieldAlert, ArrowRight, Phone } from 'lucide-react';

export default function Expired({ brand_name = 'Groovy', brand_url = '#', title = 'Undangan Digital' }) {
    const containerStyle = {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #020617 100%)', // premium deep navy/indigo gradient
        fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
        padding: '24px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
    };

    // Glow effects
    const glow1 = {
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(236, 72, 153, 0.1)', // pink glow
        filter: 'blur(100px)',
        zIndex: 0,
    };

    const glow2 = {
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(168, 85, 247, 0.1)', // purple glow
        filter: 'blur(100px)',
        zIndex: 0,
    };

    const cardStyle = {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(30, 41, 59, 0.45)', // slate-800 backdrop
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box',
    };

    const iconContainerStyle = {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.1)', // amber
        border: '1px solid rgba(245, 158, 11, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px auto',
        boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)',
    };

    const titleStyle = {
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '12px',
        letterSpacing: '-0.02em',
    };

    const subtitleStyle = {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '13px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '20px',
    };

    const descriptionStyle = {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '32px',
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', // Premium gradient
        color: '#ffffff',
        border: 'none',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)',
        boxSizing: 'border-box',
    };

    const secondaryButtonStyle = {
        display: 'block',
        width: '100%',
        padding: '12px 24px',
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.5)',
        border: 'none',
        borderRadius: '16px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        textDecoration: 'none',
        marginTop: '16px',
        transition: 'color 0.3s',
        boxSizing: 'border-box',
    };

    const [isBtnHovered, setIsBtnHovered] = React.useState(false);
    const [isSecBtnHovered, setIsSecBtnHovered] = React.useState(false);

    const activeButtonStyle = isBtnHovered 
        ? {
            ...buttonStyle,
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 30px rgba(168, 85, 247, 0.45)',
          }
        : buttonStyle;

    const activeSecondaryButtonStyle = isSecBtnHovered
        ? {
            ...secondaryButtonStyle,
            color: '#ffffff',
          }
        : secondaryButtonStyle;

    return (
        <div style={containerStyle}>
            <Head title="Undangan Nonaktif - Masa Aktif Habis" />
            <div style={glow1} />
            <div style={glow2} />

            <div style={cardStyle}>
                <div style={iconContainerStyle}>
                    <ShieldAlert size={36} color="#f59e0b" />
                </div>

                <div style={subtitleStyle}>{title}</div>
                <h1 style={titleStyle}>Masa Aktif Undangan Habis</h1>
                
                <p style={descriptionStyle}>
                    Undangan digital ini telah dinonaktifkan karena telah melewati batas masa aktif 
                    uji coba paket <strong>Free</strong> selama 5 hari.
                    <br /><br />
                    Jika Anda pemilik undangan ini, silakan masuk ke dashboard untuk melakukan upgrade, 
                    atau hubungi layanan pelanggan <strong>{brand_name}</strong> untuk informasi aktivasi kembali.
                </p>

                <a 
                    href={brand_url}
                    style={activeButtonStyle}
                    onMouseEnter={() => setIsBtnHovered(true)}
                    onMouseLeave={() => setIsBtnHovered(false)}
                >
                    <Phone size={16} />
                    Hubungi Layanan Aktifasi
                    <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                </a>

                <a 
                    href="/login"
                    style={activeSecondaryButtonStyle}
                    onMouseEnter={() => setIsSecBtnHovered(true)}
                    onMouseLeave={() => setIsSecBtnHovered(false)}
                >
                    Masuk ke Akun Saya
                </a>
            </div>
        </div>
    );
}
