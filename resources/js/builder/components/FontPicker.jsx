import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { FONT_LIST } from '../core/fonts';

export default function FontPicker({ value, onChange, label = 'Keluarga Font (Font Family)' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 50);
        }
    }, [isOpen]);

    // Find currently selected font details
    const activeFont = FONT_LIST.find(f => f.value === value);

    // Filter list based on search query
    const filteredFonts = FONT_LIST.filter(font => 
        font.label.toLowerCase().includes(search.toLowerCase()) ||
        font.value.toLowerCase().includes(search.toLowerCase())
    );

    // Categorized groups
    const categories = [
        { key: 'script', name: 'Script & Kaligrafi' },
        { key: 'serif', name: 'Serif (Elegan & Klasik)' },
        { key: 'sans-serif', name: 'Sans-serif (Modern & Bersih)' }
    ];

    const handleSelect = (fontVal) => {
        onChange(fontVal);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="space-y-1 relative" ref={containerRef}>
            {label && <label className="text-xs font-semibold text-gray-700">{label}</label>}
            
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg p-2.5 bg-white text-left text-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/20 transition-all focus:outline-none"
                style={{ fontFamily: value && value !== 'default' ? `'${value}', sans-serif` : 'inherit' }}
            >
                <span className="truncate">
                    {activeFont ? activeFont.label : 'Default Tema'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
            </button>

            {/* Dropdown Container */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[320px] animate-fadeIn">
                    
                    {/* Search Input Bar (Sticky at top) */}
                    <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-1.5 relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari font..."
                            className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                    </div>

                    {/* Scrollable Font List */}
                    <div className="flex-1 overflow-y-auto py-1">
                        
                        {/* Option for default font */}
                        <div
                            onClick={() => handleSelect('default')}
                            className={`px-3 py-2 text-xs font-semibold cursor-pointer transition-all hover:bg-gray-50 border-b border-gray-50 ${
                                value === 'default' || !value ? 'bg-indigo-50/50 text-indigo-700 font-bold' : 'text-gray-500'
                            }`}
                        >
                            Default Tema
                        </div>

                        {filteredFonts.length === 0 ? (
                            <div className="p-4 text-center text-xs text-gray-400 italic">
                                Font tidak ditemukan
                            </div>
                        ) : (
                            categories.map(cat => {
                                const fontsInCat = filteredFonts.filter(f => f.category === cat.key);
                                if (fontsInCat.length === 0) return null;

                                return (
                                    <div key={cat.key} className="space-y-0.5">
                                        {/* Category Header */}
                                        <div className="px-3 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 border-y border-gray-100/50">
                                            {cat.name}
                                        </div>

                                        {/* Font Options */}
                                        {fontsInCat.map(font => {
                                            const isSelected = value === font.value;
                                            return (
                                                <div
                                                    key={font.value}
                                                    onClick={() => handleSelect(font.value)}
                                                    className={`px-3 py-2 cursor-pointer transition-all hover:bg-indigo-50/30 flex items-center justify-between ${
                                                        isSelected 
                                                            ? 'bg-indigo-50 text-indigo-700 font-bold border-l-2 border-indigo-600 pl-2.5' 
                                                            : 'text-gray-700 hover:text-indigo-600'
                                                    }`}
                                                    style={{ fontFamily: `'${font.value}', sans-serif` }}
                                                >
                                                    <span className="text-base truncate">
                                                        {font.label}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-sans font-semibold">
                                                            Aktif
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
