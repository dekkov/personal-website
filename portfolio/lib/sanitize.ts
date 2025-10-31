/**
 * HTML sanitization utilities to prevent XSS attacks
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param unsafe - The unsafe string that may contain HTML
 * @returns Escaped string safe for HTML output
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes text for safe display in HTML while preserving line breaks
 * @param text - The text to sanitize
 * @returns Sanitized text with <br> tags for line breaks
 */
export function sanitizeTextWithBreaks(text: string): string {
  const escaped = escapeHtml(text);
  return escaped.replace(/\n/g, '<br>');
}
