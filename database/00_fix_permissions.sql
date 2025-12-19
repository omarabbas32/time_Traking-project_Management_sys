-- ============================================================================
-- Fix Permissions for EMS Admin
-- Run this script as a SUPERUSER (e.g., 'postgres')
-- ============================================================================

-- Grant usage on public schema
GRANT ALL ON SCHEMA public TO ems_admin;

-- Grant permissions on all existing tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ems_admin;

-- Grant permissions on all sequences (for auto-increment IDs)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ems_admin;

-- Grant permissions on all functions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO ems_admin;

-- Ensure future tables created by users also give permissions to ems_admin (optional but recommended)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ems_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ems_admin;
