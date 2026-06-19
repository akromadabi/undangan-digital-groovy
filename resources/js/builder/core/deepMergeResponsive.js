/**
 * Resolves a setting value based on the active breakpoint with desktop-down fallback.
 * Breakpoint order: mobile -> tablet -> desktop
 * 
 * @param {any} value - The setting value (could be a primitive, or a responsive object {desktop, tablet, mobile})
 * @param {string} breakpoint - 'desktop' | 'tablet' | 'mobile'
 * @param {any} defaultValue - Fallback value if resolved value is undefined
 * @returns {any} Resolved value
 */
export function getResponsiveSetting(value, breakpoint, defaultValue = undefined) {
    if (value === null || value === undefined) {
        return defaultValue;
    }

    // If it's a responsive object containing desktop/tablet/mobile keys
    if (typeof value === 'object' && ('desktop' in value || 'tablet' in value || 'mobile' in value)) {
        if (breakpoint === 'mobile') {
            if (value.mobile !== undefined && value.mobile !== '') return value.mobile;
            if (value.tablet !== undefined && value.tablet !== '') return value.tablet;
            return value.desktop !== undefined ? value.desktop : defaultValue;
        }
        
        if (breakpoint === 'tablet') {
            if (value.tablet !== undefined && value.tablet !== '') return value.tablet;
            return value.desktop !== undefined ? value.desktop : defaultValue;
        }
        
        return value.desktop !== undefined && value.desktop !== '' ? value.desktop : defaultValue;
    }

    // If it's a primitive value, it's global (applies to all breakpoints)
    return value;
}

/**
 * Updates a responsive setting value object for a specific breakpoint.
 * 
 * @param {any} currentValue - Existing setting value
 * @param {string} breakpoint - 'desktop' | 'tablet' | 'mobile'
 * @param {any} newValue - New value to set for the breakpoint
 * @returns {Object} Updated responsive object
 */
export function updateResponsiveSetting(currentValue, breakpoint, newValue) {
    let base = {};
    
    if (currentValue && typeof currentValue === 'object' && ('desktop' in currentValue || 'tablet' in currentValue || 'mobile' in currentValue)) {
        base = { ...currentValue };
    } else if (currentValue !== undefined && currentValue !== null) {
        // Convert existing primitive to responsive desktop base
        base = { desktop: currentValue };
    }

    base[breakpoint] = newValue;
    return base;
}
