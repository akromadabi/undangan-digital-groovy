import { createEmptyDocument } from './schema';

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
        content: documentJson.content || []
    };

    // We can add version-specific migration steps here in the future
    // e.g. if (migrated.version === '1.0.0') { migrated.version = '1.1.0'; ... }

    return migrated;
}
