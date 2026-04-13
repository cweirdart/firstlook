-- Migration 005: Add custom_labels for couple_type = 'custom'
--
-- When couples select the "Custom" couple type during album creation,
-- they can supply their own labels (e.g., partner1/partner2 titles,
-- honor attendant names, wedding party names). These labels are stored
-- as a JSONB object on the album row and read by the getRoleLabels()
-- utility to render throughout the UI.
--
-- Shape of custom_labels:
-- {
--   "partner1": "Bride",
--   "partner2": "Spouse",
--   "bestPerson1": "Maid of Honor",
--   "bestPerson2": "Best Person",
--   "attendants1": "Bridesmaids",
--   "attendants2": "Wedding Party"
-- }
--
-- All keys are optional. Missing keys fall back to neutral defaults
-- (see CUSTOM_DEFAULT_LABELS in app/src/utils/coupleType.js).

ALTER TABLE albums ADD COLUMN IF NOT EXISTS custom_labels jsonb;

-- No index needed — this is read alongside the album row, never queried on.
