-- ============================================================
-- V4__Add_Post_Target_Networks_And_Title.sql
--
-- This migration resolves two entity-to-schema mismatches found
-- in Post.java:
--
-- 1. `title` column (VARCHAR 200) — exists in entity, missing from DB.
-- 2. `targetNetworks` — entity uses @ElementCollection mapped to a
--    dedicated join table `post_target_networks`, but the DB only has
--    a flat `target_networks VARCHAR(255)` column on the posts table.
--
-- Strategy:
--   a) Add the missing `title` column.
--   b) Create the `post_target_networks` join table.
--   c) Migrate any existing comma-separated network data from
--      `posts.target_networks` into the new join table rows.
--   d) Drop the now-redundant `posts.target_networks` column.
-- ============================================================

-- 1. Add the missing `title` column to posts
ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS title VARCHAR(200);

-- 2. Create the join table required by @ElementCollection targetNetworks
CREATE TABLE IF NOT EXISTS post_target_networks (
    post_id UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    network VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_post_target_networks_post_id
    ON post_target_networks(post_id);

-- 3. Migrate existing comma-separated network values into the new table.
--    This handles rows like: target_networks = 'LINKEDIN,TWITTER'
--    Each comma-separated value becomes a separate row in the join table.
--    Only migrates non-NULL, non-empty rows to avoid inserting blank rows.
INSERT INTO post_target_networks (post_id, network)
SELECT
    p.id                AS post_id,
    TRIM(network_value) AS network
FROM posts p
-- unnest splits 'LINKEDIN,TWITTER' → 'LINKEDIN', 'TWITTER'
CROSS JOIN LATERAL unnest(string_to_array(p.target_networks, ',')) AS network_value
WHERE p.target_networks IS NOT NULL
  AND p.target_networks <> '';

-- 4. Drop the now-redundant column (data is safe in post_target_networks)
ALTER TABLE posts
    DROP COLUMN IF EXISTS target_networks;
