CREATE TABLE IF NOT EXISTS gallery_photos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_gallery_display_order ON gallery_photos(display_order DESC, created_at DESC);