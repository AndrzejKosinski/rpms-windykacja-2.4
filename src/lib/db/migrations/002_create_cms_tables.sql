-- 1. Tabela global_settings
CREATE TABLE IF NOT EXISTS global_settings (
    id INTEGER PRIMARY KEY,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela pages
CREATE TABLE IF NOT EXISTS pages (
    slug TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
    slug TEXT PRIMARY KEY,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela blog_faqs
CREATE TABLE IF NOT EXISTS blog_faqs (
    id TEXT PRIMARY KEY,
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela modals
CREATE TABLE IF NOT EXISTS modals (
    id TEXT PRIMARY KEY,
    internal_name TEXT,
    title TEXT,
    subtitle TEXT,
    icon TEXT,
    image_url TEXT,
    benefit TEXT,
    standard TEXT,
    points JSONB DEFAULT '[]',
    is_visible_in_carousel BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela why_us_cards
CREATE TABLE IF NOT EXISTS why_us_cards (
    id TEXT PRIMARY KEY,
    icon TEXT,
    title TEXT,
    description TEXT,
    assigned_modal_id TEXT REFERENCES modals(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela target_audience_industries
CREATE TABLE IF NOT EXISTS target_audience_industries (
    id TEXT PRIMARY KEY,
    icon TEXT,
    title TEXT,
    description TEXT,
    assigned_modal_id TEXT REFERENCES modals(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabela dds_config
CREATE TABLE IF NOT EXISTS dds_config (
    id TEXT PRIMARY KEY,
    version INTEGER,
    theme_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabela footer_columns
CREATE TABLE IF NOT EXISTS footer_columns (
    id TEXT PRIMARY KEY,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabela footer_links
CREATE TABLE IF NOT EXISTS footer_links (
    id TEXT PRIMARY KEY,
    column_id TEXT REFERENCES footer_columns(id),
    label TEXT,
    url TEXT,
    is_external BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Wyłączenie RLS (Row Level Security) dla ułatwienia migracji i testów
-- (W środowisku produkcyjnym z logowaniem użytkowników należałoby włączyć RLS i dodać polityki)
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE modals DISABLE ROW LEVEL SECURITY;
ALTER TABLE why_us_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE target_audience_industries DISABLE ROW LEVEL SECURITY;
ALTER TABLE dds_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE footer_columns DISABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links DISABLE ROW LEVEL SECURITY;
