/**
 * Lightweight page-level <title> and <meta name="description"> manager.
 *
 * React-helmet is overkill for a Vite SPA — we just set document.title
 * and update the description meta tag directly.
 *
 * Usage:
 *   import { usePageMeta } from '../utils/pageMeta'
 *   usePageMeta('Page Title', 'Page description for search engines and LLMs.')
 */
import { useEffect } from 'react'

const SITE_NAME = 'First Look'
const DEFAULT_DESCRIPTION = 'The simplest way to collect and share wedding photos. Guests scan a QR code, upload their shots, and your memories stay private.'

/**
 * Sets the page title and meta description on mount, resets on unmount.
 * @param {string} title  — Page-specific title (appended with " — First Look")
 * @param {string} [description] — Meta description (falls back to default)
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content')

    // Set title
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Private Photo Sharing for Your Wedding`

    // Set description
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description)
    }

    return () => {
      document.title = prevTitle
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc)
      }
    }
  }, [title, description])
}
