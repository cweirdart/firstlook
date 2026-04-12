/**
 * Lightweight analytics event tracking via Plausible.
 *
 * Plausible is privacy-friendly (no cookies, GDPR-compliant).
 * Events only fire if the Plausible script is loaded.
 *
 * Usage:
 *   import { trackEvent } from '../utils/analytics'
 *   trackEvent('CTA Clicked', { page: 'how-it-works', button: 'get-started' })
 *
 * Custom goals to set up in Plausible dashboard:
 *   - Album Created
 *   - Photo Uploaded
 *   - Checkout Started
 *   - Setup Guide Shared
 *   - QR Sign Generated
 *   - Share Link Copied
 *   - Slideshow Opened
 *   - TV Display Opened
 *   - CTA Clicked
 */

/**
 * Track a custom event via Plausible.
 * Silently no-ops if Plausible isn't loaded.
 *
 * @param {string} eventName — The event name (e.g., 'Album Created')
 * @param {Object} [props] — Optional properties (e.g., { page: 'dashboard' })
 */
export function trackEvent(eventName, props = {}) {
  try {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { props })
    }
  } catch (e) {
    // Silently fail — analytics should never break the app
  }
}
