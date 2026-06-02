import React from 'react';
import PromoCountdown from './PromoCountdown';

export default function PromoTextRenderer({ text = '', showCountdown = true, durationHours = 19, resellerRef = 'default' }) {
    if (!showCountdown) {
        // If countdown is disabled, clean up the placeholder and render text
        const cleanedText = text.replace(/{countdown}/g, '').trim();
        return <span>{cleanedText}</span>;
    }

    // Check if the placeholder is present in the text
    const placeholder = '{countdown}';
    if (!text.includes(placeholder)) {
        // If placeholder is not found, append countdown to the end of the text
        return (
            <span className="inline-flex items-center flex-wrap justify-center gap-1">
                <span>{text}</span>
                <PromoCountdown durationHours={durationHours} resellerRef={resellerRef} />
            </span>
        );
    }

    // Split text by placeholder to insert the countdown in between
    const parts = text.split(placeholder);

    return (
        <span className="inline-flex items-center flex-wrap justify-center gap-1">
            {parts.map((part, index) => (
                <React.Fragment key={index}>
                    {part}
                    {index < parts.length - 1 && (
                        <PromoCountdown durationHours={durationHours} resellerRef={resellerRef} />
                    )}
                </React.Fragment>
            ))}
        </span>
    );
}
