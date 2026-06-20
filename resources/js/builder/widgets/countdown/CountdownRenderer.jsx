import React, { useState, useEffect } from 'react';
import { getResponsiveSetting } from '../../core/deepMergeResponsive';
import { Database } from 'lucide-react';

export default function CountdownRenderer({ settings = {}, activeBreakpoint = 'desktop', invitation, globalSettings = {} }) {
    const isDynamic = settings.sourceType === 'dynamic';
    const layoutModel = settings.layoutModel || 'boxes'; // 'boxes' | 'circles' | 'simple'

    // Fonts resolution
    let titleFontFamily = settings.titleFontFamily || 'default';
    if (titleFontFamily === 'default') {
        titleFontFamily = globalSettings?.fonts?.heading || 'Playfair Display';
    }

    let bodyFontFamily = settings.bodyFontFamily || 'default';
    if (bodyFontFamily === 'default') {
        bodyFontFamily = globalSettings?.fonts?.body || 'Inter';
    }

    // Retrieve target date: dynamic (invitation event date) vs static setting
    const targetDateStr = isDynamic && invitation?.event_date 
        ? invitation.event_date 
        : (settings.targetDate || '2026-12-31T23:59:59');

    const alignment = getResponsiveSetting(settings.alignment, activeBreakpoint, 'center');
    
    // Colors
    const numberColor = settings.numberColor || '#E5654B';
    const labelColor = settings.labelColor || '#4b5563';
    const boxBg = settings.boxBg || '#faf9f6';
    const boxBorderColor = settings.boxBorderColor || '#e5e7eb';
    const borderRadius = settings.borderRadius || '12px';

    // State for calculated time left
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            // Replace space with T to make it ISO-compliant for Safari/Firefox
            const normalizedDateStr = String(targetDateStr).trim().replace(' ', 'T');
            const difference = +new Date(normalizedDateStr) - +new Date();
            let newTimeLeft = { days: '00', hours: '00', minutes: '00', seconds: '00' };

            if (difference > 0) {
                const d = Math.floor(difference / (1000 * 60 * 60 * 24));
                const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const m = Math.floor((difference / 1000 / 60) % 60);
                const s = Math.floor((difference / 1000) % 60);

                newTimeLeft = {
                    days: d.toString().padStart(2, '0'),
                    hours: h.toString().padStart(2, '0'),
                    minutes: m.toString().padStart(2, '0'),
                    seconds: s.toString().padStart(2, '0')
                };
            }
            setTimeLeft(newTimeLeft);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDateStr]);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        width: '100%',
        padding: '10px 0'
    };

    const flexStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: layoutModel === 'simple' ? '8px' : '12px',
        flexWrap: 'wrap'
    };

    const getBoxStyle = () => {
        if (layoutModel === 'simple') {
            return {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
            };
        }

        const isCircle = layoutModel === 'circles';

        return {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: isCircle ? '70px' : '60px',
            minHeight: isCircle ? '70px' : 'auto',
            padding: isCircle ? '12px' : '10px 8px',
            backgroundColor: boxBg,
            border: `1px solid ${boxBorderColor}`,
            borderRadius: isCircle ? '50%' : borderRadius,
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        };
    };

    const numberStyle = {
        fontSize: layoutModel === 'simple' ? '20px' : '24px',
        fontWeight: 'bold',
        color: numberColor,
        lineHeight: 1,
        fontFamily: `"${titleFontFamily}", sans-serif`
    };

    const labelStyle = {
        fontSize: '10px',
        fontWeight: '600',
        color: labelColor,
        marginTop: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontFamily: `"${bodyFontFamily}", sans-serif`
    };

    const timeBlocks = [
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds }
    ];

    return (
        <div style={containerStyle}>
            {isDynamic && !invitation && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider">
                    <Database className="w-2.5 h-2.5" /> Mode Dinamis (Pratinjau)
                </span>
            )}

            <div style={flexStyle}>
                {timeBlocks.map((block, i) => (
                    <React.Fragment key={i}>
                        <div style={getBoxStyle()}>
                            <span style={numberStyle}>{block.value}</span>
                            <span style={labelStyle}>{block.label}</span>
                        </div>
                        {layoutModel === 'simple' && i < timeBlocks.length - 1 && (
                            <span className="text-gray-400 font-bold self-center -mt-3 text-lg">:</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
