import React, { useState } from 'react';

export default function WishesEmojiPicker({ 
    value, 
    onChange, 
    inputRef, 
    isDark = false,
    pickerStyle = {},
    children
}) {
    const [showEmoji, setShowEmoji] = useState(false);
    const emojis = ['😊', '😂', '❤️', '👍', '🎉', '😍', '🙏', '😭', '😜', '😎', '🌹', '💍', '👩‍❤️‍👨', '🎂', '🥂', '🤵', '👰', '👏', '✨', '🥳', '💝', '🌸', '🎈', '💌', '💖', '🤗', '🤩', '🔥'];

    const handleEmojiClick = (emoji) => {
        if (inputRef && inputRef.current) {
            const input = inputRef.current;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = input.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            const newValue = before + emoji + after;
            onChange(newValue);
            
            setTimeout(() => {
                input.focus();
                input.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        } else {
            onChange((value || '') + emoji);
        }
    };

    const defaultPickerStyle = {
        position: 'absolute',
        bottom: '44px',
        right: '4px',
        width: '280px',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '6px',
        backgroundColor: isDark ? '#262626' : '#ffffff',
        padding: '10px',
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#404040' : '#e5e7eb'}`,
        boxShadow: isDark 
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)' 
            : '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        maxHeight: '140px',
        overflowY: 'auto',
        boxSizing: 'border-box',
        zIndex: 9999,
        ...pickerStyle
    };

    // Safely wrap the textarea child and inject right padding so text doesn't overlap the smiley button
    let styledChild = children;
    try {
        if (React.isValidElement(children)) {
            const child = React.Children.only(children);
            styledChild = React.cloneElement(child, {
                style: {
                    ...(child.props.style || {}),
                    paddingRight: '40px',
                    boxSizing: 'border-box'
                }
            });
        }
    } catch (e) {
        console.error("WishesEmojiPicker: children must be a single valid React element (textarea)", e);
    }

    return (
        <div className="wishes-emoji-picker-wrapper select-none" style={{ position: 'relative', display: 'block', width: '100%' }}>
            {styledChild}
            
            {/* Elegant smiley face absolute button in bottom-right corner */}
            <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    opacity: showEmoji ? 1 : 0.65,
                    transition: 'all 0.2s',
                    zIndex: 10,
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none'
                }}
                className="hover:scale-110 active:scale-95 hover:opacity-100"
            >
                😊
            </button>
            
            {showEmoji && (
                <>
                    {/* Backdrop to close the popup on clicking outside */}
                    <div 
                        onClick={() => setShowEmoji(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9998,
                            background: 'transparent'
                        }}
                    />
                    
                    {/* Floating Popover panel */}
                    <div style={defaultPickerStyle} className="animate-in fade-in zoom-in-95 duration-200">
                        {emojis.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleEmojiClick(emoji)}
                                style={{
                                    fontSize: '1.3rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s'
                                }}
                                className={isDark ? "hover:bg-white/10 active:bg-white/20" : "hover:bg-black/5 active:bg-black/10"}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
