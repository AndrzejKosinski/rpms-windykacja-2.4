-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  module_id TEXT PRIMARY KEY,
  storage_type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO system_settings (module_id, storage_type, config) VALUES
('cms', 'apps-script', '{"url": ""}'),
('analytics', 'apps-script', '{"url": ""}'),
('cases', 'apps-script', '{"url": ""}')
ON CONFLICT (module_id) DO NOTHING;
