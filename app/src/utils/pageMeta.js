/**
 * Lightweight page-level <title>, <meta>, and Open Graph tag manager.
 *
 * React-helmet is overkill for a Vite SPA — we just set document.title
 * and update meta tags directly in the DOM.
 *
 * Usage:
 *   import { usePageMeta } from '../utils/pageMeta'
 *   usePageMeta('Page Title', 'Page description for search engines and LLMs.')
 */
import { useEffect } from 'react'

const SITE_NAME = 'First Look'
const SITE_URL = 'https://firstlook.love'
const DEFAULT_DESCRIPTION = 'The simplest way to collect and share wedding photos. Guests scan a QR code, upload their shots, and your memories stay private.'

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector)
  if (el && value) el.setAttribute(attr, value)
}

function getMeta(selector, attr) {
  const el = document.querySelector(selector)
  return el?.getAttribute(attr) || null
}

/**
 * Sets the page title, meta description, and OG tags on mount, resets on unmount.
 * @param {string} title  — Page-specific title (appended with " — First Look")
 * @param {string} [description] — Meta description (falls back to default)
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    const prevDesc = getMeta('meta[name="description"]', 'content')
    const prevOgTitle = getMeta('meta[property="og:title"]', 'content')
    const prevOgDesc = getMeta('meta[property="og:description"]', 'content')
    const prevOgUrl = getMeta('meta[property="og:url"]', 'content')
    const prevTwTitle = getMeta('meta[name="twitter:title"]', 'content')
    const prevTwDesc = getMeta('meta[name="twitter:description"]', 'content')

    const fullTitle = title
      ? `${title} — ${SITE_NAME}`
      : `${SITE_NAME} — Private Photo Sharing for Your Wedding`
    const desc = description || DEFAULT_DESCRIPTION
    const url = SITE_URL + window.location.pathname

    // Set title
    document.title = fullTitle

    // Set meta description
    setMeta('meta[name="description"]', 'content', desc)

    // Set Open Graph tags
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:url"]', 'content', url)

    // Set Twitter tags
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)

    return () => {
      document.title = prevTitle
      setMeta('meta[name="description"]', 'content', prevDesc)
      setMeta('meta[property="og:title"]', 'content', prevOgTitle)
      setMeta('meta[property="og:description"]', 'content', prevOgDesc)
      setMeta('meta[property="og:url"]', 'content', prevOgUrl)
      setMeta('meta[name="twitter:title"]', 'content', prevTwTitle)
      setMeta('meta[name="twitter:description"]', 'content', prevTwDesc)
    }
  }, [title, description])
}
