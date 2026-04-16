-- SUPABASE INITIALIZATION SCRIPT V2.0 FOR RPMS CMS
-- This script sets up the relational database schema with improved support for section-specific modals and data parity.
-- WARNING: This version drops existing CMS tables to ensure schema integrity for V2.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. UTILITY FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. CLEANUP (Ensure clean V2 state)
DROP TABLE IF EXISTS dds_config CASCADE;
DROP TABLE IF EXISTS global_settings CASCADE;
DROP TABLE IF EXISTS footer_links CASCADE;
DROP TABLE IF EXISTS footer_columns CASCADE;
DROP TABLE IF EXISTS target_audience_industries CASCADE;
DROP TABLE IF EXISTS why_us_cards CASCADE;
DROP TABLE IF EXISTS modals CASCADE;
DROP TABLE IF EXISTS blog_faqs CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS pages CASCADE;

-- 3. TABLES DEFINITIONS

-- Pages Table
CREATE TABLE pages (
    slug VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    is_published BOOLEAN DEFAULT true,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Blog Posts Table
CREATE TABLE blog_posts (
    slug VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    image_alt VARCHAR(255),
    category VARCHAR(100),
    author VARCHAR(100) DEFAULT 'Admin',
    status VARCHAR(20) DEFAULT 'published',
    published_at TIMESTAMPTZ,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Blog FAQs Table
CREATE TABLE blog_faqs (
    id VARCHAR(255) PRIMARY KEY,
    post_slug VARCHAR(255) REFERENCES blog_posts(slug) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Modals Table (V2: Added section_type and flexible ID)
CREATE TABLE modals (
    id VARCHAR(255) PRIMARY KEY,
    section_type VARCHAR(50) DEFAULT 'why_us', -- 'why_us' or 'target_audience'
    internal_name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    icon VARCHAR(100),
    image_url TEXT,
    benefit TEXT,
    standard TEXT,
    points TEXT[],
    is_visible_in_carousel BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_modals_updated_at BEFORE UPDATE ON modals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Why Us Cards Table
CREATE TABLE why_us_cards (
    id VARCHAR(255) PRIMARY KEY,
    icon VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_modal_id VARCHAR(255) REFERENCES modals(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0
);

-- Target Audience Industries Table (V2: Added subtitle, tag, and renamed name to title)
CREATE TABLE target_audience_industries (
    id VARCHAR(255) PRIMARY KEY,
    icon VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    tag VARCHAR(100),
    assigned_modal_id VARCHAR(255) REFERENCES modals(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0
);

-- Footer Columns Table
CREATE TABLE footer_columns (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Footer Links Table
CREATE TABLE footer_links (
    id VARCHAR(255) PRIMARY KEY,
    column_id VARCHAR(255) REFERENCES footer_columns(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    is_external BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0
);

-- Global Settings Table (V2: Matches MigrationManager logic with id/config)
CREATE TABLE global_settings (
    id INTEGER PRIMARY KEY,
    config JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_global_settings_updated_at BEFORE UPDATE ON global_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- DDS Config Table
CREATE TABLE dds_config (
    id VARCHAR(255) PRIMARY KEY,
    version INTEGER DEFAULT 1,
    theme_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SECURITY (RLS)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE modals ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_us_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_audience_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dds_config ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
DROP POLICY IF EXISTS "Allow public read access on pages" ON pages;
CREATE POLICY "Allow public read access on pages" ON pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on blog_posts" ON blog_posts;
CREATE POLICY "Allow public read access on blog_posts" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on blog_faqs" ON blog_faqs;
CREATE POLICY "Allow public read access on blog_faqs" ON blog_faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on modals" ON modals;
CREATE POLICY "Allow public read access on modals" ON modals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on why_us_cards" ON why_us_cards;
CREATE POLICY "Allow public read access on why_us_cards" ON why_us_cards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on target_audience_industries" ON target_audience_industries;
CREATE POLICY "Allow public read access on target_audience_industries" ON target_audience_industries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on footer_columns" ON footer_columns;
CREATE POLICY "Allow public read access on footer_columns" ON footer_columns FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on footer_links" ON footer_links;
CREATE POLICY "Allow public read access on footer_links" ON footer_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on global_settings" ON global_settings;
CREATE POLICY "Allow public read access on global_settings" ON global_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on dds_config" ON dds_config;
CREATE POLICY "Allow public read access on dds_config" ON dds_config FOR SELECT USING (true);

-- Admin Write Access Policies (Updated to allow anon for migration/CMS purposes)
DROP POLICY IF EXISTS "Allow admin full access on pages" ON pages;
CREATE POLICY "Allow admin full access on pages" ON pages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on blog_posts" ON blog_posts;
CREATE POLICY "Allow admin full access on blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on blog_faqs" ON blog_faqs;
CREATE POLICY "Allow admin full access on blog_faqs" ON blog_faqs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on modals" ON modals;
CREATE POLICY "Allow admin full access on modals" ON modals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on why_us_cards" ON why_us_cards;
CREATE POLICY "Allow admin full access on why_us_cards" ON why_us_cards FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on target_audience_industries" ON target_audience_industries;
CREATE POLICY "Allow admin full access on target_audience_industries" ON target_audience_industries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on footer_columns" ON footer_columns;
CREATE POLICY "Allow admin full access on footer_columns" ON footer_columns FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on footer_links" ON footer_links;
CREATE POLICY "Allow admin full access on footer_links" ON footer_links FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on global_settings" ON global_settings;
CREATE POLICY "Allow admin full access on global_settings" ON global_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on dds_config" ON dds_config;
CREATE POLICY "Allow admin full access on dds_config" ON dds_config FOR ALL USING (true) WITH CHECK (true);

-- 5. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
