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
 *   'custom'        — custom labels (user enters their own)
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

/**
 * Get all role labels for a couple type.
 * Falls back to bride-groom if type is unknown.
 */
export function getRoleLabels(coupleType) {
  return ROLE_LABELS[coupleType] || ROLE_LABELS[DEFAULT_TYPE]
}

/**
 * Get a human-readable "helper list" string for setup guides.
 * e.g., "best man, maid of honor, DJ, or venue coordinator"
 */
export function getHelperList(coupleType) {
  const labels = getRoleLabels(coupleType)
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
