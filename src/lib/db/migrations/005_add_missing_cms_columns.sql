-- Dodanie brakujących kolumn do blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_alt TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- Dodanie brakujących kolumn do pages
ALTER TABLE pages ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Odświeżenie schematu
NOTIFY pgrst, 'reload schema';
