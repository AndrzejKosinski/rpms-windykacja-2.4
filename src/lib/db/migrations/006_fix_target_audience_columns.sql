-- Dodanie brakujących kolumn do target_audience_industries
ALTER TABLE target_audience_industries ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE target_audience_industries ADD COLUMN IF NOT EXISTS tag TEXT;

-- Odświeżenie schematu
NOTIFY pgrst, 'reload schema';
