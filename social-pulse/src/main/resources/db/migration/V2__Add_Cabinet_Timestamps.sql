-- ============================================================
-- V2__Add_Cabinet_Timestamps.sql
-- Adds created_at and updated_at audit columns to the cabinets table.
-- These are required by CabinetDTO and Cabinet.java (Hibernate annotations).
-- ============================================================

ALTER TABLE cabinets
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE cabinets
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Back-fill existing rows (created_at will be set to now by the DEFAULT above,
-- updated_at is intentionally null until the cabinet is first modified).
