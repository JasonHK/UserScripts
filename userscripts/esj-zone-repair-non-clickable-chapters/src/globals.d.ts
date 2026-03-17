/**
 * Retrieve the value of a given cookie.
 * 
 * @param name The name of a cookie
 * @returns The cookie value
 */
declare function getCookie(name: string): string | null;

/**
 * Convert a given text to a specific Chinese script (Traditional or Simplified).
 * 
 * @param text A text to convert
 * @returns The converted text
 */
declare function translateText(text: string): string;

/**
 * The name for the converting script type cookie.
 */
declare var targetEncodingCookie: string;
