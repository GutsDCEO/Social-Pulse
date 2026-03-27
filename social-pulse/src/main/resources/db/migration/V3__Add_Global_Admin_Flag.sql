-- ============================================================
-- V3__Add_Global_Admin_Flag.sql
-- Adds the is_admin (Super Admin) flag to the users table.
--
-- This flag decouples system-level privileges (e.g. creating cabinets)
-- from cabinet-specific roles (ADMIN|CM|AVOCAT stored in user_cabinets).
-- A user with is_admin=TRUE can manage the platform before any cabinet exists.
-- ============================================================

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Ensure the first registered user (system bootstrap) is a super-admin.
-- In production this should be set via a dedicated seed migration or env-var driven setup.
-- Create index for fast lookups when checking admin status.
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
