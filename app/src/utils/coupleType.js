/**
 * Couple-type customization utility.
 *
 * During album creation, the couple selects their couple type.
 * This determines how role language is displayed throughout the app
 * (e.g., "best man" vs "best woman", "maid of honor" vs "man of honor").
 *
 * Couple types:
 *   'bride-groom'   — traditional (man + woman, bride perspective)
 *   'groom-bride'   — traditional (man + woman, groom perspective)
 *   'bride-bride'   — two brides
 *   'groom-groom'   — two grooms
 *   'custom'        — custom labels (user enters their own — stored on album.customLabels)
 *   null/undefined  — defaults to traditional bride-groom
 */

const ROLE_LABELS = {
  'bride-groom': {
    partner1: 'Bride',
    partner2: 'Groom',
    bestPerson1: 'Maid of Honor',
    bestPerson2: 'Best Man',
    attendants1: 'Bridesmaids',
    attendants2: 'Groomsmen',
    parents1: 'Parents of the Bride',
    parents2: 'Parents of the Groom',
  },
  'groom-bride': {
    partner1: 'Groom',
    partner2: 'Bride',
    bestPerson1: 'Best Man',
    bestPerson2: 'Maid of Honor',
    attendants1: 'Groomsmen',
    attendants2: 'Bridesmaids',
    parents1: 'Parents of the Groom',
    parents2: 'Parents of the Bride',
  },
  'bride-bride': {
    partner1: 'Bride',
    partner2: 'Bride',
    bestPerson1: 'Maid of Honor',
    bestPerson2: 'Maid of Honor',
    attendants1: 'Bridesmaids',
    attendants2: 'Bridesmaids',
    parents1: "Parents of the Bride",
    parents2: "Parents of the Bride",
  },
  'groom-groom': {
    partner1: 'Groom',
    partner2: 'Groom',
    bestPerson1: 'Best Man',
    bestPerson2: 'Best Man',
    attendants1: 'Groomsmen',
    attendants2: 'Groomsmen',
    parents1: "Parents of the Groom",
    parents2: "Parents of the Groom",
  },
}

// Default when no couple type is set
const DEFAULT_TYPE = 'bride-groom'

// Default placeholder labels shown for Custom mode (also used as fallbacks
// for any custom fields the user leaves blank).
export const CUSTOM_DEFAULT_LABELS = {
  partner1: 'Partner',
  partner2: 'Partner',
  bestPerson1: 'Best Person',
  bestPerson2: 'Best Person',
  attendants1: 'Wedding Party',
  attendants2: 'Wedding Party',
  parents1: 'Parents of Partner 1',
  parents2: 'Parents of Partner 2',
}

/**
 * Get all role labels for a couple type.
 *
 * Accepts either:
 *   getRoleLabels('bride-groom')
 *   getRoleLabels(albumObject)   — reads album.coupleType and album.customLabels
 *
 * For 'custom' couple type, merges album.customLabels over CUSTOM_DEFAULT_LABELS
 * so any blank custom fields fall back to sensible defaults.
 *
 * Falls back to bride-groom if type is unknown or null/undefined.
 */
export function getRoleLabels(coupleTypeOrAlbum) {
  // Support passing the full album object — this is the preferred call site
  // pattern because it lets us read customLabels without a second argument.
  if (coupleTypeOrAlbum && typeof coupleTypeOrAlbum === 'object') {
    const album = coupleTypeOrAlbum
    if (album.coupleType === 'custom') {
      return { ...CUSTOM_DEFAULT_LABELS, ...(album.customLabels || {}) }
    }
    return ROLE_LABELS[album.coupleType] || ROLE_LABELS[DEFAULT_TYPE]
  }

  const coupleType = coupleTypeOrAlbum
  if (coupleType === 'custom') {
    // No custom labels provided — return the neutral defaults
    return { ...CUSTOM_DEFAULT_LABELS }
  }
  return ROLE_LABELS[coupleType] || ROLE_LABELS[DEFAULT_TYPE]
}

/**
 * Get a human-readable "helper list" string for setup guides.
 * e.g., "best man, maid of honor, DJ, or venue coordinator"
 *
 * Accepts either a coupleType string or the full album object.
 */
export function getHelperList(coupleTypeOrAlbum) {
  const labels = getRoleLabels(coupleTypeOrAlbum)
  const people = [labels.bestPerson1, labels.bestPerson2]
  // Deduplicate (e.g., two "Best Man" for groom-groom)
  const unique = [...new Set(people)]
  return [...unique, 'DJ', 'venue coordinator'].join(', ').replace(/,([^,]*)$/, ', or$1')
}

/**
 * Couple type options for the selector UI.
 */
export const COUPLE_TYPE_OPTIONS = [
  { value: 'bride-groom', label: 'Bride & Groom' },
  { value: 'groom-bride', label: 'Groom & Bride' },
  { value: 'bride-bride', label: 'Bride & Bride' },
  { value: 'groom-groom', label: 'Groom & Groom' },
  { value: 'custom', label: 'Custom' },
]

/**
 * Fields that the user can override when using 'custom' couple type.
 * Used to render the custom-labels form on NewAlbum.
 */
export const CUSTOM_LABEL_FIELDS = [
  { key: 'partner1', label: 'Partner 1 title', placeholder: 'Bride / Groom / Spouse / Nonbinary title' },
  { key: 'partner2', label: 'Partner 2 title', placeholder: 'Bride / Groom / Spouse / Nonbinary title' },
  { key: 'bestPerson1', label: "Partner 1's honor attendant", placeholder: 'Maid of Honor / Best Person / Person of Honor' },
  { key: 'bestPerson2', label: "Partner 2's honor attendant", placeholder: 'Best Man / Best Person / Person of Honor' },
  { key: 'attendants1', label: "Partner 1's wedding party", placeholder: 'Bridesmaids / Groomsmen / Wedding Party' },
  { key: 'attendants2', label: "Partner 2's wedding party", placeholder: 'Groomsmen / Bridesmaids / Wedding Party' },
]
