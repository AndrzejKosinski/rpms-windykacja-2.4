-- Usuwamy tabele, które miały zły typ klucza głównego (UUID zamiast TEXT) lub problemy z cache
DROP TABLE IF EXISTS global_settings CASCADE;
DROP TABLE IF EXISTS dds_config CASCADE;
DROP TABLE IF EXISTS blog_faqs CASCADE;
DROP TABLE IF EXISTS footer_links CASCADE;
DROP TABLE IF EXISTS footer_columns CASCADE;
DROP TABLE IF EXISTS why_us_cards CASCADE;
DROP TABLE IF EXISTS target_audience_industries CASCADE;

-- 1. Tabela global_settings
CREATE TABLE global_settings (
    id INTEGER PRIMARY KEY,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela blog_faqs
CREATE TABLE blog_faqs (
    id TEXT PRIMARY KEY,
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela why_us_cards
CREATE TABLE why_us_cards (
    id TEXT PRIMARY KEY,
    icon TEXT,
    title TEXT,
    description TEXT,
    assigned_modal_id TEXT REFERENCES modals(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela target_audience_industries
CREATE TABLE target_audience_industries (
    id TEXT PRIMARY KEY,
    icon TEXT,
    title TEXT,
    description TEXT,
    assigned_modal_id TEXT REFERENCES modals(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela dds_config
CREATE TABLE dds_config (
    id TEXT PRIMARY KEY,
    version INTEGER,
    theme_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela footer_columns
CREATE TABLE footer_columns (
    id TEXT PRIMARY KEY,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela footer_links
CREATE TABLE footer_links (
    id TEXT PRIMARY KEY,
    column_id TEXT REFERENCES footer_columns(id) ON DELETE CASCADE,
    label TEXT,
    url TEXT,
    is_external BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wyłączenie RLS dla nowych tabel
ALTER TABLE global_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE why_us_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE target_audience_industries DISABLE ROW LEVEL SECURITY;
ALTER TABLE dds_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE footer_columns DISABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links DISABLE ROW LEVEL SECURITY;

-- Wymuszenie odświeżenia cache'u API Supabase (naprawia błąd "Could not find the 'config' column")
NOTIFY pgrst, 'reload schema';
