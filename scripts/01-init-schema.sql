-- Create links table for URL shortener
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on short_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);
