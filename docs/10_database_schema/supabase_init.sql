-- SUPABASE INITIALIZATION SCRIPT FOR RPMS CMS
-- This script sets up the relational database schema for CMS migration.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. UTILITY FUNCTIONS
-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. TABLES DEFINITIONS

-- Pages Table
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    is_published BOOLEAN DEFAULT false,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url VARCHAR(512),
    image_alt VARCHAR(255),
    category VARCHAR(100),
    author VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    published_at TIMESTAMPTZ,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    json_ld JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Blog FAQs Table
CREATE TABLE IF NOT EXISTS blog_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Modals Table
CREATE TABLE IF NOT EXISTS modals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section VARCHAR(50),
    internal_name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    icon VARCHAR(100),
    image_url VARCHAR(512),
    benefit TEXT,
    standard TEXT,
    points TEXT[],
    is_visible_in_carousel BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_modals_updated_at BEFORE UPDATE ON modals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Why Us Cards Table
CREATE TABLE IF NOT EXISTS why_us_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_modal_id UUID REFERENCES modals(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0
);

-- Target Audience Industries Table
CREATE TABLE IF NOT EXISTS target_audience_industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_modal_id UUID REFERENCES modals(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0
);

-- Footer Columns Table
CREATE TABLE IF NOT EXISTS footer_columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Footer Links Table
CREATE TABLE IF NOT EXISTS footer_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    column_id UUID REFERENCES footer_columns(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    is_external BOOLEAN DEFAULT false,
    page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0
);

-- Global Settings Table (Singleton-like settings)
CREATE TABLE IF NOT EXISTS global_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_global_settings_updated_at BEFORE UPDATE ON global_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- DDS Config Table
CREATE TABLE IF NOT EXISTS dds_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version INTEGER DEFAULT 1,
    theme_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SECURITY (RLS)
-- By default, everything is readable by everyone, but only authenticated admins can write.

-- Enable RLS
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
CREATE POLICY "Allow public read access on pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read access on blog_posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access on blog_faqs" ON blog_faqs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on modals" ON modals FOR SELECT USING (true);
CREATE POLICY "Allow public read access on why_us_cards" ON why_us_cards FOR SELECT USING (true);
CREATE POLICY "Allow public read access on target_audience_industries" ON target_audience_industries FOR SELECT USING (true);
CREATE POLICY "Allow public read access on footer_columns" ON footer_columns FOR SELECT USING (true);
CREATE POLICY "Allow public read access on footer_links" ON footer_links FOR SELECT USING (true);
CREATE POLICY "Allow public read access on global_settings" ON global_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on dds_config" ON dds_config FOR SELECT USING (is_active = true);

-- Admin Write Access Policies (Assuming an 'admin' role or specific UID check)
-- For Supabase, we usually check if the user is authenticated.
CREATE POLICY "Allow admin full access on pages" ON pages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on blog_posts" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on blog_faqs" ON blog_faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on modals" ON modals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on why_us_cards" ON why_us_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on target_audience_industries" ON target_audience_industries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on footer_columns" ON footer_columns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on footer_links" ON footer_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on global_settings" ON global_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on dds_config" ON dds_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
