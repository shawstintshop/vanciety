-- =============================================================
-- Vanciety Member Research Collections
-- =============================================================
-- Purpose:
-- - Let members save a topic into a personal page.
-- - Group videos, guides, forum posts, products, tools, tips, and links.
-- - Support automatic re-attachment of new related items later.
-- - Keep saved pages member-only and privacy-safe.
--
-- Notes:
-- - Does not drop existing tables.
-- - Does not require secrets.
-- - Intended to work alongside profiles, auth, vendors, forum, and videos.
-- =============================================================

-- -------------------------------------------------------------
-- Helper functions
-- -------------------------------------------------------------

CREATE OR REPLACE FUNCTION vanciety_normalize_topic_text(p_value TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(
    NULLIF(
      regexp_replace(
        regexp_replace(lower(trim(p_value)), '[^a-z0-9]+', '-', 'g'),
        '(^-|-$)',
        '',
        'g'
      ),
      ''
    ),
    'topic'
  );
$$;

CREATE OR REPLACE FUNCTION vanciety_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- -------------------------------------------------------------
-- Member saved topic pages
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS member_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  query_text TEXT,
  canonical_topic TEXT NOT NULL,
  topic_category TEXT,
  topic_aliases TEXT[] DEFAULT '{}'::TEXT[],
  vehicle_context JSONB DEFAULT '{}'::jsonb,
  summary TEXT,
  item_count INTEGER NOT NULL DEFAULT 0 CHECK (item_count >= 0),
  new_item_count INTEGER NOT NULL DEFAULT 0 CHECK (new_item_count >= 0),
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  refresh_status TEXT NOT NULL DEFAULT 'idle' CHECK (refresh_status IN ('idle', 'refreshing', 'error')),
  last_refreshed_at TIMESTAMPTZ,
  last_new_item_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_member_collections_user_id ON member_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_member_collections_topic ON member_collections(canonical_topic);
CREATE INDEX IF NOT EXISTS idx_member_collections_category ON member_collections(topic_category);
CREATE INDEX IF NOT EXISTS idx_member_collections_archived ON member_collections(is_archived, is_pinned);

DROP TRIGGER IF EXISTS member_collections_updated_at ON member_collections;
CREATE TRIGGER member_collections_updated_at
  BEFORE UPDATE ON member_collections
  FOR EACH ROW
  EXECUTE FUNCTION vanciety_touch_updated_at();

CREATE OR REPLACE FUNCTION vanciety_member_collection_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := vanciety_normalize_topic_text(COALESCE(NEW.title, NEW.canonical_topic));
    NEW.slug := base_slug;
  ELSE
    NEW.slug := vanciety_normalize_topic_text(NEW.slug);
  END IF;

  IF NEW.canonical_topic IS NOT NULL AND NEW.canonical_topic <> '' THEN
    NEW.canonical_topic := trim(NEW.canonical_topic);
  END IF;

  IF EXISTS (
    SELECT 1
    FROM member_collections mc
    WHERE mc.user_id = NEW.user_id
      AND mc.slug = NEW.slug
      AND mc.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    NEW.slug := NEW.slug || '-' || substr(gen_random_uuid()::text, 1, 8);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS member_collections_slug_trigger ON member_collections;
CREATE TRIGGER member_collections_slug_trigger
  BEFORE INSERT OR UPDATE ON member_collections
  FOR EACH ROW
  EXECUTE FUNCTION vanciety_member_collection_slug();

-- -------------------------------------------------------------
-- Items attached to a saved topic page
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES member_collections(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN (
    'resource',
    'video',
    'forum_post',
    'product',
    'vendor',
    'tool',
    'tip',
    'image',
    'link',
    'note'
  )),
  source_table TEXT,
  source_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image_url TEXT,
  publisher TEXT,
  source_badge TEXT NOT NULL DEFAULT 'UNKNOWN',
  topic_key TEXT NOT NULL,
  topic_label TEXT,
  topic_score NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (collection_id, source_table, source_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_topic_key ON collection_items(topic_key);
CREATE INDEX IF NOT EXISTS idx_collection_items_new ON collection_items(collection_id, is_new, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_items_item_type ON collection_items(item_type);

DROP TRIGGER IF EXISTS collection_items_updated_at ON collection_items;
CREATE TRIGGER collection_items_updated_at
  BEFORE UPDATE ON collection_items
  FOR EACH ROW
  EXECUTE FUNCTION vanciety_touch_updated_at();

CREATE OR REPLACE FUNCTION vanciety_sync_collection_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE member_collections
    SET
      item_count = item_count + 1,
      new_item_count = CASE WHEN NEW.is_new THEN new_item_count + 1 ELSE new_item_count END,
      last_new_item_at = CASE WHEN NEW.is_new THEN NOW() ELSE last_new_item_at END,
      last_refreshed_at = NOW(),
      updated_at = NOW()
    WHERE id = NEW.collection_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE member_collections
    SET
      item_count = GREATEST(item_count - 1, 0),
      new_item_count = CASE WHEN OLD.is_new THEN GREATEST(new_item_count - 1, 0) ELSE new_item_count END,
      updated_at = NOW()
    WHERE id = OLD.collection_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.collection_id <> NEW.collection_id THEN
      UPDATE member_collections
      SET
        item_count = GREATEST(item_count - 1, 0),
        new_item_count = CASE WHEN OLD.is_new THEN GREATEST(new_item_count - 1, 0) ELSE new_item_count END,
        updated_at = NOW()
      WHERE id = OLD.collection_id;

      UPDATE member_collections
      SET
        item_count = item_count + 1,
        new_item_count = CASE WHEN NEW.is_new THEN new_item_count + 1 ELSE new_item_count END,
        last_new_item_at = CASE WHEN NEW.is_new THEN NOW() ELSE last_new_item_at END,
        last_refreshed_at = NOW(),
        updated_at = NOW()
      WHERE id = NEW.collection_id;
    ELSE
      UPDATE member_collections
      SET
        new_item_count = CASE
          WHEN OLD.is_new = FALSE AND NEW.is_new = TRUE THEN new_item_count + 1
          WHEN OLD.is_new = TRUE AND NEW.is_new = FALSE THEN GREATEST(new_item_count - 1, 0)
          ELSE new_item_count
        END,
        last_new_item_at = CASE WHEN NEW.is_new THEN NOW() ELSE last_new_item_at END,
        last_refreshed_at = NOW(),
        updated_at = NOW()
      WHERE id = NEW.collection_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS collection_items_count_trigger ON collection_items;
CREATE TRIGGER collection_items_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON collection_items
  FOR EACH ROW
  EXECUTE FUNCTION vanciety_sync_collection_counts();

-- -------------------------------------------------------------
-- Topic alias registry for auto-matching
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS topic_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_topic TEXT NOT NULL,
  alias TEXT NOT NULL,
  alias_normalized TEXT NOT NULL,
  topic_category TEXT,
  priority INTEGER NOT NULL DEFAULT 0 CHECK (priority >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (canonical_topic, alias_normalized)
);

CREATE INDEX IF NOT EXISTS idx_topic_aliases_normalized ON topic_aliases(alias_normalized);
CREATE INDEX IF NOT EXISTS idx_topic_aliases_topic ON topic_aliases(canonical_topic);
CREATE INDEX IF NOT EXISTS idx_topic_aliases_category ON topic_aliases(topic_category);

DROP TRIGGER IF EXISTS topic_aliases_updated_at ON topic_aliases;
CREATE TRIGGER topic_aliases_updated_at
  BEFORE UPDATE ON topic_aliases
  FOR EACH ROW
  EXECUTE FUNCTION vanciety_touch_updated_at();

CREATE OR REPLACE FUNCTION vanciety_topic_alias_normalize()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.alias = trim(NEW.alias);
  NEW.canonical_topic = trim(NEW.canonical_topic);
  NEW.alias_normalized = vanciety_normalize_topic_text(NEW.alias);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS topic_aliases_normalize_trigger ON topic_aliases;
CREATE TRIGGER topic_aliases_normalize_trigger
  BEFORE INSERT OR UPDATE ON topic_aliases
  FOR EACH ROW
  EXECUTE FUNCTION vanciety_topic_alias_normalize();

-- -------------------------------------------------------------
-- Internal source-topic matches for the refresh pipeline
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS content_topic_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table TEXT NOT NULL,
  source_id TEXT NOT NULL,
  canonical_topic TEXT NOT NULL,
  match_type TEXT NOT NULL DEFAULT 'auto' CHECK (match_type IN ('auto', 'manual')),
  match_score NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_table, source_id, canonical_topic)
);

CREATE INDEX IF NOT EXISTS idx_content_topic_matches_topic ON content_topic_matches(canonical_topic);
CREATE INDEX IF NOT EXISTS idx_content_topic_matches_source ON content_topic_matches(source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_content_topic_matches_new ON content_topic_matches(is_new, last_checked_at DESC);

DROP TRIGGER IF EXISTS content_topic_matches_updated_at ON content_topic_matches;
CREATE TRIGGER content_topic_matches_updated_at
  BEFORE UPDATE ON content_topic_matches
  FOR EACH ROW
  EXECUTE FUNCTION vanciety_touch_updated_at();

-- -------------------------------------------------------------
-- RLS policies
-- -------------------------------------------------------------

ALTER TABLE member_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_topic_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view their own collections" ON member_collections;
CREATE POLICY "Members can view their own collections"
  ON member_collections FOR SELECT
  USING (auth.uid() = user_id OR has_role('admin'));

DROP POLICY IF EXISTS "Members can create their own collections" ON member_collections;
CREATE POLICY "Members can create their own collections"
  ON member_collections FOR INSERT
  WITH CHECK (auth.uid() = user_id OR has_role('admin'));

DROP POLICY IF EXISTS "Members can update their own collections" ON member_collections;
CREATE POLICY "Members can update their own collections"
  ON member_collections FOR UPDATE
  USING (auth.uid() = user_id OR has_role('admin'))
  WITH CHECK (auth.uid() = user_id OR has_role('admin'));

DROP POLICY IF EXISTS "Members can delete their own collections" ON member_collections;
CREATE POLICY "Members can delete their own collections"
  ON member_collections FOR DELETE
  USING (auth.uid() = user_id OR has_role('admin'));

DROP POLICY IF EXISTS "Members can view items in their own collections" ON collection_items;
CREATE POLICY "Members can view items in their own collections"
  ON collection_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM member_collections mc
      WHERE mc.id = collection_items.collection_id
        AND (mc.user_id = auth.uid() OR has_role('admin'))
    )
  );

DROP POLICY IF EXISTS "Members can insert items into their own collections" ON collection_items;
CREATE POLICY "Members can insert items into their own collections"
  ON collection_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM member_collections mc
      WHERE mc.id = collection_items.collection_id
        AND (mc.user_id = auth.uid() OR has_role('admin'))
    )
  );

DROP POLICY IF EXISTS "Members can update items in their own collections" ON collection_items;
CREATE POLICY "Members can update items in their own collections"
  ON collection_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM member_collections mc
      WHERE mc.id = collection_items.collection_id
        AND (mc.user_id = auth.uid() OR has_role('admin'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM member_collections mc
      WHERE mc.id = collection_items.collection_id
        AND (mc.user_id = auth.uid() OR has_role('admin'))
    )
  );

DROP POLICY IF EXISTS "Members can delete items in their own collections" ON collection_items;
CREATE POLICY "Members can delete items in their own collections"
  ON collection_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM member_collections mc
      WHERE mc.id = collection_items.collection_id
        AND (mc.user_id = auth.uid() OR has_role('admin'))
    )
  );

DROP POLICY IF EXISTS "Authenticated users can view topic aliases" ON topic_aliases;
CREATE POLICY "Authenticated users can view topic aliases"
  ON topic_aliases FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage topic aliases" ON topic_aliases;
CREATE POLICY "Admins can manage topic aliases"
  ON topic_aliases FOR ALL
  USING (has_role('admin'))
  WITH CHECK (has_role('admin'));

-- content_topic_matches is internal. Service role can access without policies.

COMMENT ON TABLE member_collections IS 'Saved member research pages, one per topic or guide path';
COMMENT ON TABLE collection_items IS 'Items attached to a saved member research page';
COMMENT ON TABLE topic_aliases IS 'Topic aliases used to match similar search terms to a canonical topic';
COMMENT ON TABLE content_topic_matches IS 'Internal topic matching feed for auto-attaching new related content';
