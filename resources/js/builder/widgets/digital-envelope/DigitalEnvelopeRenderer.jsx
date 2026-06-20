import React, { useState } from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';
import { Copy, Check, QrCode, CreditCard, Database } from 'lucide-react';

export default function DigitalEnvelopeRenderer({ settings = {}, activeBreakpoint = 'desktop', bankAccounts, globalSettings = {} }) {
    const title = settings.title || 'Kado Digital / Amplop Digital';
    const description = settings.description || 'Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, silakan melalui rekening/dompet digital berikut:';
    
    const isDynamic = settings.sourceType === 'dynamic';
    const layoutModel = settings.layoutModel || 'stack'; // 'stack' | 'grid' | 'slider'

    // Fonts resolution
    let titleFontFamily = settings.titleFontFamily || 'default';
    if (titleFontFamily === 'default') {
        titleFontFamily = globalSettings?.fonts?.heading || 'Playfair Display';
    }

    let bodyFontFamily = settings.bodyFontFamily || 'default';
    if (bodyFontFamily === 'default') {
        bodyFontFamily = globalSettings?.fonts?.body || 'Inter';
    }

    // Normalize accounts from either DB props or settings
    const accounts = isDynamic && bankAccounts && bankAccounts.length > 0
        ? bankAccounts.map((acc, idx) => ({
            id: acc.id || String(idx),
            provider: acc.bank_name || '',
            number: acc.account_number || '',
            holder: acc.account_name || '',
            qrUrl: acc.qr_code || acc.qr_code_url || ''
        }))
        : (settings.accounts || [
            { id: '1', provider: 'Bank BCA', number: '7141234567', holder: 'Ahmad Rafli', qrUrl: '' },
            { id: '2', provider: 'Bank Mandiri', number: '1440012345678', holder: 'Siti Aminah', qrUrl: '' }
        ]);

    const alignment = getResponsiveSetting(settings.alignment || 'center', activeBreakpoint, 'center');
    const cardBg = settings.cardBg || '#ffffff';
    const cardTextColor = settings.cardTextColor || '#1f2937';
    const cardBorderColor = settings.cardBorderColor || '#e5e7eb';
    const buttonBg = settings.buttonBg || '#E5654B';
    const buttonTextColor = settings.buttonTextColor || '#ffffff';
    const borderRadius = settings.borderRadius || '16px';

    const [copiedId, setCopiedId] = useState(null);
    const [activeQrId, setActiveQrId] = useState(null);

    const handleCopy = (number, id) => {
        navigator.clipboard.writeText(number).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const renderAccountCard = (acc, idx) => {
        return (
            <div 
                key={acc.id || idx}
                className="p-5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-4 w-full"
                style={{ 
                    backgroundColor: cardBg, 
                    borderColor: cardBorderColor,
                    color: cardTextColor,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
            >
                <div className="flex items-start justify-between">
                    <div className="space-y-1 text-left">
                        <span 
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md"
                            style={{ fontFamily: `"${titleFontFamily}", sans-serif` }}
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            {acc.provider || 'Bank Transfer'}
                        </span>
                        <h4 className="text-base font-bold font-mono tracking-wider mt-2">
                            {acc.number}
                        </h4>
                        <p 
                            className="text-xs text-gray-400 font-medium"
                            style={{ fontFamily: `"${bodyFontFamily}", sans-serif` }}
                        >
                            A.N. {acc.holder}
                        </p>
                    </div>

                    {acc.qrUrl && (
                        <button
                            onClick={() => setActiveQrId(activeQrId === acc.id ? null : acc.id)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Tampilkan QR Code"
                        >
                            <QrCode className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Copy button & state */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleCopy(acc.number, acc.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all"
                        style={{ 
                            backgroundColor: buttonBg, 
                            color: buttonTextColor,
                            fontFamily: `"${bodyFontFamily}", sans-serif`
                        }}
                    >
                        {copiedId === acc.id ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                Berhasil Disalin!
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                Salin No. Rekening
                            </>
                        )}
                    </button>
                </div>

                {/* QR Panel Drawer */}
                {acc.qrUrl && activeQrId === acc.id && (
                    <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col items-center justify-center animate-fadeIn">
                        <p 
                            className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2"
                            style={{ fontFamily: `"${bodyFontFamily}", sans-serif` }}
                        >
                            Scan QR Untuk Transfer
                        </p>
                        <div className="p-2 bg-white border border-gray-200 rounded-lg">
                            <img src={acc.qrUrl} alt="QR Code" className="w-36 h-36 object-contain" />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const getLayoutContainerClass = () => {
        if (layoutModel === 'grid') {
            return "w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4";
        }
        if (layoutModel === 'slider') {
            return "w-full flex overflow-x-auto gap-4 pb-4 px-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-200 max-w-lg justify-start";
        }
        return "w-full max-w-md space-y-4";
    };

    return (
        <div 
            className="w-full py-6 px-4 md:px-6 flex flex-col items-center"
            style={{ 
                backgroundColor: settings.containerBg || '#f9fafb',
                textAlign: alignment,
                borderRadius: borderRadius
            }}
        >
            {title && (
                <h3 
                    className="text-lg md:text-xl font-bold tracking-tight mb-2"
                    style={{ 
                        color: settings.titleColor || '#1f2937',
                        fontFamily: `"${titleFontFamily}", sans-serif`
                    }}
                >
                    {title}
                </h3>
            )}
            
            {description && (
                <p 
                    className="text-xs md:text-sm text-gray-500 leading-relaxed mb-4 max-w-md"
                    style={{ 
                        color: settings.descColor || '#6b7280',
                        fontFamily: `"${bodyFontFamily}", sans-serif`
                    }}
                >
                    {description}
                </p>
            )}

            {isDynamic && !bankAccounts && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-6 uppercase tracking-wider">
                    <Database className="w-3 h-3" /> Mode Dinamis (Pratinjau)
                </span>
            )}

            <div className={getLayoutContainerClass()}>
                {accounts.map((acc, idx) => (
                    <div 
                        key={acc.id || idx} 
                        className={layoutModel === 'slider' ? "w-[280px] shrink-0 snap-center" : "w-full"}
                    >
                        {renderAccountCard(acc, idx)}
                    </div>
                ))}
            </div>
        </div>
    );
}
