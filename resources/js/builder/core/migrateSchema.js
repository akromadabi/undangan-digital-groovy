import { createEmptyDocument } from './schema';

/**
 * Helper to map custom/WeddingPress widget types to native builder widgets
 */
function mapWidgetType(node) {
    let type = node.type;
    let settings = { ...node.settings };

    // Standard font size parser
    const mapFontSize = (val) => {
        if (!val || typeof val !== 'object') return undefined;
        if (val.size === undefined || val.size === '') return undefined;
        return val.size + (val.unit || 'px');
    };

    // Standard FontAwesome to Emoji parser for lists/icons
    const getEmojiForIcon = (faIcon) => {
        if (!faIcon) return '';
        const name = faIcon.toLowerCase();
        if (name.includes('calendar')) return '📅';
        if (name.includes('clock')) return '⏰';
        if (name.includes('map-marker') || name.includes('map-pin')) return '📍';
        if (name.includes('heart')) return '❤️';
        if (name.includes('envelope')) return '✉️';
        if (name.includes('phone')) return '📞';
        if (name.includes('music')) return '🎵';
        if (name.includes('gift')) return '🎁';
        if (name.includes('copy')) return '📋';
        return '•';
    };

    // 1. Standard Elementor heading
    if (type === 'heading') {
        settings.text = settings.title || '';
        settings.tag = settings.header_size || 'h2';
        
        // Alignment
        const align = settings.align || 'center';
        settings.alignment = {
            desktop: align,
            tablet: settings.align_tablet || align,
            mobile: settings.align_mobile || align
        };
        
        // Text Color
        settings.textColor = settings.title_color || settings.text_color || '#1f2937';
        
        // Typography
        settings.fontSize = {
            desktop: mapFontSize(settings.typography_font_size) || '32px',
            tablet: mapFontSize(settings.typography_font_size_tablet),
            mobile: mapFontSize(settings.typography_font_size_mobile)
        };
        settings.fontFamily = settings.typography_font_family || 'default';
        settings.fontWeight = settings.typography_font_weight || 'bold';
        settings.lineHeight = settings.typography_line_height?.size || '1.2';
    } 
    // 2. Standard Elementor button
    else if (type === 'button') {
        settings.text = settings.text || 'Klik di Sini';
        settings.url = settings.link?.url || '#';
        
        const align = settings.align || 'center';
        settings.alignment = {
            desktop: align,
            tablet: settings.align_tablet || align,
            mobile: settings.align_mobile || align
        };
        
        settings.backgroundColor = settings.background_color || '#E5654B';
        settings.textColor = settings.button_text_color || '#ffffff';
        
        if (settings.border_radius) {
            settings.borderRadius = settings.border_radius.size + (settings.border_radius.unit || 'px');
        }
        
        const fSize = mapFontSize(settings.typography_font_size);
        if (fSize) {
            settings.fontSize = fSize;
        }
    }
    // 3. Standard Elementor spacer
    else if (type === 'spacer') {
        const space = settings.space?.size || '30';
        settings.height = {
            desktop: space,
            tablet: settings.space_tablet?.size || space,
            mobile: settings.space_mobile?.size || space
        };
    }
    // 4. Standard Elementor divider
    else if (type === 'divider') {
        settings.lineStyle = settings.style || 'solid';
        settings.color = settings.color || '#e5e7eb';
        if (settings.weight) {
            settings.weight = settings.weight.size + (settings.weight.unit || 'px');
        }
        if (settings.width) {
            settings.width = settings.width.size + (settings.width.unit || '%');
        }
        settings.alignment = settings.align || 'center';
    }
    // 5. Standard Elementor icon
    else if (type === 'icon') {
        const iconName = settings.selected_icon?.value;
        const mappedName = (faIcon) => {
            if (!faIcon) return 'Heart';
            const name = faIcon.toLowerCase();
            if (name.includes('heart')) return 'Heart';
            if (name.includes('calendar')) return 'Calendar';
            if (name.includes('clock')) return 'Clock';
            if (name.includes('map-marker') || name.includes('map-pin')) return 'MapPin';
            if (name.includes('expand')) return 'Expand';
            if (name.includes('copy')) return 'Copy';
            if (name.includes('envelope')) return 'Mail';
            if (name.includes('phone')) return 'Phone';
            if (name.includes('music')) return 'Music';
            if (name.includes('play')) return 'Play';
            if (name.includes('pause')) return 'Pause';
            return 'Heart';
        };
        settings.icon = mappedName(iconName);
        settings.alignment = settings.align || 'center';
        settings.color = settings.primary_color || '#E5654B';
        settings.size = settings.size?.size ? String(settings.size.size) : '32';
    }
    // 6. Elementor icon-list (maps to text-editor with formatted list items)
    else if (type === 'icon-list') {
        type = 'text-editor';
        const align = settings.align || 'center';
        let htmlContent = `<div style="display: flex; flex-direction: column; gap: 10px; align-items: ${align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'}; justify-content: ${align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'}; width: 100%; margin: 10px 0;">`;
        if (settings.icon_list && Array.isArray(settings.icon_list)) {
            settings.icon_list.forEach(item => {
                const emoji = getEmojiForIcon(item.selected_icon?.value);
                htmlContent += `
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: ${settings.text_color || '#4b5563'};">
                        <span style="font-size: 16px;">${emoji}</span>
                        <span>${item.text || ''}</span>
                    </div>
                `;
            });
        }
        htmlContent += '</div>';
        settings.text = htmlContent;
    }
    // 7. WeddingPress countdown
    else if (type === 'weddingpress-countdown') {
        type = 'countdown';
        if (settings.wpkoi_elements_countdown_due_time) {
            settings.targetDate = settings.wpkoi_elements_countdown_due_time.replace(' ', 'T');
        }
    } 
    // 8. WeddingPress audio
    else if (type === 'weddingpress-audio') {
        type = 'music-player';
        if (settings.external_link) {
            settings.audioUrl = settings.external_link;
        } else if (settings.self_hosted_url?.url) {
            settings.audioUrl = settings.self_hosted_url.url;
        } else if (settings.audio_upload?.url) {
            settings.audioUrl = settings.audio_upload.url;
        }
        settings.playerType = 'floating';
    } 
    // 9. WeddingPress wellcome (Cover / Greeting Card)
    else if (type === 'weddingpress-wellcome') {
        type = 'guest-name';
        settings.prefix = settings.text_dear || 'Kpd Bpk/Ibu/Saudara/i:';
        settings.placeholderName = 'Nama Tamu Undangan';
        settings.suffix = 'Di Tempat';
    } 
    // 10. Elementor media-carousel -> gallery
    else if (type === 'media-carousel') {
        type = 'gallery';
        if (settings.slides) {
            settings.images = settings.slides.map((s, idx) => ({
                id: String(idx + 1),
                url: s.image?.url || '',
                caption: s.caption || ''
            }));
        }
    } 
    // 11. WeddingPress modal popup
    else if (type === 'weddingpress-modal-popup') {
        type = 'button';
        settings.text = settings.exad_modal_btn_text || settings.text_open || 'Buka Undangan';
    } 
    // 12. WeddingPress kit2 (Wishes / guest book) -> wishes-list
    else if (type === 'weddingpress-kit2') {
        type = 'wishes-list';
        settings.title = settings.title || 'Ucapan & Doa Restu';
        settings.description = settings.description || 'Berikan ucapan selamat dan doa restu terbaik Anda untuk kedua mempelai.';
        settings.buttonText = settings.button_text || 'Kirim Ucapan';
    } 
    // 13. Elementor icon-box
    else if (type === 'icon-box') {
        type = 'text-editor';
        const emoji = getEmojiForIcon(settings.selected_icon?.value) || '🎁';
        settings.text = `<div style="text-align: center; font-size: 16px; margin: 15px 0;"><div style="font-size: 24px; margin-bottom: 8px;">${emoji}</div><p><strong>${settings.title_text || ''}</strong></p><p style="font-size: 14px; color: #4b5563; line-height: 1.6;">${settings.description_text || ''}</p></div>`;
    } 
    // 14. Standard HTML
    else if (type === 'html') {
        type = 'text-editor';
        settings.text = settings.html || '';
    } 
    // 15. WeddingPress copy-text (cashless gift account display)
    else if (type === 'weddingpress-copy-text') {
        type = 'text-editor';
        const head = settings.head || '';
        const number = settings.dce_clipboard_text || '';
        const btnText = settings.text || 'Salin';
        
        settings.text = `
            <div style="text-align: center; border: 1px dashed #DDC8B1; padding: 15px; border-radius: 8px; background: #faf9f6; margin: 15px 0; width: 100%;">
                <p style="margin-bottom: 8px; font-weight: 500; font-size: 14px; color: #4b5563;">${head}</p>
                <p style="font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 1px; color: #1f2937; margin: 8px 0; user-select: all; -webkit-user-select: all;">${number}</p>
                <div style="margin-top: 10px;">
                    <button style="background-color: #DDC8B1; color: #4B4B4B; border: none; padding: 6px 16px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 500; pointer-events: none;">
                        ${btnText}
                    </button>
                </div>
            </div>
        `;
    }

    return { type, settings };
}

/**
 * Helper to recursively map nodes from elements (Elementor format) to columns/widgets (native format)
 */
function mapNode(node) {
    if (!node) return null;

    let type = node.type;
    if (!type && node.elType) {
        if (node.elType === 'section') {
            type = 'section';
        } else if (node.elType === 'column') {
            type = 'column';
        } else if (node.elType === 'widget') {
            type = node.widgetType;
        }
    }

    // Map custom widget types to native counterparts
    let settings = node.settings || {};
    if (node.elType === 'widget' || (type && type !== 'section' && type !== 'column')) {
        const mappedWidget = mapWidgetType({ type, settings });
        type = mappedWidget.type;
        settings = mappedWidget.settings;
    }

    const mapped = {
        ...node,
        type: type,
        settings: settings,
        advanced: node.advanced || {},
    };

    if (type === 'section') {
        const rawColumns = node.columns || node.elements || [];
        mapped.columns = rawColumns.map(mapNode).filter(Boolean);
        delete mapped.elements;
    } else if (type === 'column') {
        const rawWidgets = node.widgets || node.elements || [];
        const mappedWidgets = [];
        rawWidgets.forEach(w => {
            const mappedW = mapNode(w);
            if (!mappedW) return;
            if (mappedW.type === 'section') {
                // Flatten inner section's columns & widgets directly into this column
                (mappedW.columns || []).forEach(col => {
                    (col.widgets || []).forEach(widget => {
                        mappedWidgets.push(widget);
                    });
                });
            } else {
                mappedWidgets.push(mappedW);
            }
        });
        mapped.widgets = mappedWidgets;
        delete mapped.elements;
    }

    return mapped;
}

/**
 * Migrates a builder document to the latest schema version if needed.
 * @param {Object} documentJson 
 * @returns {Object} Migrated document
 */
export function migrateSchema(documentJson) {
    if (!documentJson) {
        return createEmptyDocument();
    }

    const defaultDoc = createEmptyDocument();

    // Ensure basic structure exists
    const migrated = {
        version: documentJson.version || '1.0.0',
        meta: {
            ...defaultDoc.meta,
            ...(documentJson.meta || {})
        },
        globalSettings: {
            colors: {
                ...defaultDoc.globalSettings.colors,
                ...(documentJson.globalSettings?.colors || {})
            },
            fonts: {
                ...defaultDoc.globalSettings.fonts,
                ...(documentJson.globalSettings?.fonts || {})
            },
            customCss: documentJson.globalSettings?.customCss || ''
        },
        content: (documentJson.content || []).map(mapNode).filter(Boolean)
    };

    // We can add version-specific migration steps here in the future
    // e.g. if (migrated.version === '1.0.0') { migrated.version = '1.1.0'; ... }

    return migrated;
}
