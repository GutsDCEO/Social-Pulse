-- =============================================
-- V1__Initial_Schema.sql
-- SocialPulse — Master ERD Baseline Migration
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ──
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       VARCHAR(255)    NOT NULL,
    username        VARCHAR(255)    NOT NULL UNIQUE,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    mfa_enabled     BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    last_login      TIMESTAMPTZ
);

-- ── Cabinets (Law Firms) ──
CREATE TABLE IF NOT EXISTS cabinets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255)    NOT NULL,
    barreau         VARCHAR(255),
    email           VARCHAR(255)    UNIQUE,
    phone           VARCHAR(50),
    address         VARCHAR(500),
    city            VARCHAR(100),
    postal_code     VARCHAR(20),
    website         VARCHAR(255),
    pack            VARCHAR(100),
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIF',
    payment_status  VARCHAR(20)     DEFAULT 'TRIAL',
    specializations TEXT,
    risk_score      INTEGER         DEFAULT 0
);

-- ── User ↔ Cabinet (Join Table with Role) ──
CREATE TABLE IF NOT EXISTS user_cabinets (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cabinet_id  UUID        NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL,
    UNIQUE(user_id, cabinet_id)
);

-- ── Posts ──
CREATE TABLE IF NOT EXISTS posts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cabinet_id      UUID            NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
    created_by      UUID            NOT NULL REFERENCES users(id),
    content         TEXT,
    status          VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    target_networks VARCHAR(255),
    scheduled_at    TIMESTAMPTZ,
    published_at    TIMESTAMPTZ,
    ai_source       VARCHAR(255),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

-- ── Media (S3 assets) ──
CREATE TABLE IF NOT EXISTS media (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cabinet_id      UUID            NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
    file_name       VARCHAR(255)    NOT NULL,
    s3_key          VARCHAR(500),
    content_type    VARCHAR(100),
    size_bytes      BIGINT,
    legal_theme     VARCHAR(255),
    is_validated    BOOLEAN         NOT NULL DEFAULT FALSE
);

-- ── Post ↔ Media (Join Table) ──
CREATE TABLE IF NOT EXISTS post_media (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id         UUID            NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    media_id        UUID            NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    display_order   INTEGER         DEFAULT 0,
    UNIQUE(post_id, media_id)
);

-- ── Audit Log (Immutable — append only) ──
CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id         UUID            REFERENCES posts(id) ON DELETE SET NULL,
    actor_id        UUID            NOT NULL,
    action          VARCHAR(20)     NOT NULL,
    comment         TEXT,
    performed_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Indexes for common query patterns ──
CREATE INDEX IF NOT EXISTS idx_posts_cabinet_id ON posts(cabinet_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_by ON posts(created_by);
CREATE INDEX IF NOT EXISTS idx_user_cabinets_user_id ON user_cabinets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cabinets_cabinet_id ON user_cabinets(cabinet_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_post_id ON audit_logs(post_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_media_cabinet_id ON media(cabinet_id);
