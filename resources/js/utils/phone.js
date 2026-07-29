/**
 * Clean and sanitize phone number inputs automatically.
 * 
 * Rules:
 * - Removes hyphens (-), spaces, plus signs (+), and all other non-digit characters.
 * - Converts leading '62' or '+62' to '0'.
 * 
 * Examples:
 * - '6285-641-647-478' => '085641647478'
 * - '+6285641647478'   => '085641647478'
 * - '62' (at start)    => '0'
 * - '+62' (at start)   => '0'
 * - '08123-01293'      => '0812301293'
 */
export function sanitizePhoneNumber(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);

    // Remove all non-digit characters
    let cleaned = str.replace(/\D/g, '');

    // Replace leading '62' with '0'
    if (cleaned.startsWith('62')) {
        cleaned = '0' + cleaned.slice(2);
    }

    return cleaned;
}

export default sanitizePhoneNumber;
