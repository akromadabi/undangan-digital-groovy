/**
 * @typedef {Object} MarginPadding
 * @property {string} [top]
 * @property {string} [bottom]
 * @property {string} [left]
 * @property {string} [right]
 */

/**
 * @typedef {Object} ResponsiveValue
 * @property {any} [desktop]
 * @property {any} [tablet]
 * @property {any} [mobile]
 */

/**
 * @typedef {Object} CommonSettings
 * @property {MarginPadding|ResponsiveValue} [margin]
 * @property {MarginPadding|ResponsiveValue} [padding]
 * @property {string|ResponsiveValue} [backgroundColor]
 * @property {string|ResponsiveValue} [backgroundImage]
 * @property {string|ResponsiveValue} [backgroundPosition]
 * @property {string|ResponsiveValue} [backgroundRepeat]
 * @property {string|ResponsiveValue} [backgroundSize]
 * @property {string|ResponsiveValue} [borderType]
 * @property {string|ResponsiveValue} [borderColor]
 * @property {string|ResponsiveValue} [borderWidth]
 * @property {string|ResponsiveValue} [borderRadius]
 * @property {string|ResponsiveValue} [boxShadow]
 * @property {string|ResponsiveValue} [entranceAnimation]
 * @property {string|ResponsiveValue} [animationDuration]
 * @property {Object|ResponsiveValue} [visibility] - { desktop: boolean, tablet: boolean, mobile: boolean }
 * @property {string} [customCss]
 */

/**
 * @typedef {Object} WidgetNode
 * @property {string} id - Unique identifier (nanoid)
 * @property {string} type - 'heading' | 'image' | 'button' | 'text-editor' | 'divider' | 'spacer' | 'icon' | 'icon-list' | 'countdown' | 'rsvp-form' | 'map' | 'gallery' | 'music-player' | 'digital-envelope' | 'guest-name'
 * @property {Object} settings - Widget specific content and styling settings
 * @property {CommonSettings} [advanced] - Advanced layout and styling overrides
 */

/**
 * @typedef {Object} ColumnNode
 * @property {string} id - Unique identifier (nanoid)
 * @property {string} type - 'column'
 * @property {Object} settings - Column width and styles
 * @property {WidgetNode[]} widgets
 * @property {CommonSettings} [advanced]
 */

/**
 * @typedef {Object} SectionNode
 * @property {string} id - Unique identifier (nanoid)
 * @property {string} type - 'section'
 * @property {Object} settings - Section layout, background, border
 * @property {ColumnNode[]} columns
 * @property {CommonSettings} [advanced]
 */

/**
 * @typedef {Object} GlobalColors
 * @property {string} primary
 * @property {string} secondary
 * @property {string} text
 * @property {string} accent
 * @property {string} background
 */

/**
 * @typedef {Object} GlobalFonts
 * @property {string} primary
 * @property {string} secondary
 * @property {string} body
 */

/**
 * @typedef {Object} GlobalSettings
 * @property {GlobalColors} colors
 * @property {GlobalFonts} fonts
 * @property {string} [customCss]
 */

/**
 * @typedef {Object} DocumentMeta
 * @property {string} title
 * @property {string} description
 * @property {string} [thumbnail]
 */

/**
 * @typedef {Object} ThemeBuilderDocumentSchema
 * @property {string} version - Schema version (e.g. "1.0.0")
 * @property {DocumentMeta} meta
 * @property {GlobalSettings} globalSettings
 * @property {SectionNode[]} content - Sections list
 */

export const createEmptyDocument = (title = 'Untitled Template') => ({
    version: '1.0.0',
    meta: {
        title,
        description: 'Template dibangun menggunakan Groovy Theme Builder'
    },
    globalSettings: {
        colors: {
            primary: '#E5654B',
            secondary: '#1f2937',
            text: '#4b5563',
            accent: '#f59e0b',
            background: '#ffffff'
        },
        fonts: {
            primary: 'Playfair Display',
            secondary: 'Inter',
            body: 'Inter'
        }
    },
    content: []
});
