-- Add couple_type column to albums table
-- Values: 'bride-groom', 'groom-bride', 'bride-bride', 'groom-groom', 'custom'
-- Default: 'bride-groom' (traditional)
ALTER TABLE albums ADD COLUMN IF NOT EXISTS couple_type text DEFAULT 'bride-groom';
