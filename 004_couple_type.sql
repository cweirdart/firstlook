-- Add couple_type and wedding_date columns to albums table
-- couple_type values: 'bride-groom', 'groom-bride', 'bride-bride', 'groom-groom', 'custom'
-- Default: 'bride-groom' (traditional)
ALTER TABLE albums ADD COLUMN IF NOT EXISTS couple_type text DEFAULT 'bride-groom';
ALTER TABLE albums ADD COLUMN IF NOT EXISTS wedding_date date;
