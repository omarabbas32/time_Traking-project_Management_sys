-- ============================================================================
-- Employee Management System - Rollback Script
-- Version: 1.0.0
-- Description: Complete cleanup script to remove all database objects
-- WARNING: This will delete ALL data and cannot be undone!
-- ============================================================================

-- ============================================================================
-- SECTION 1: DROP VIEWS
-- ============================================================================

DROP VIEW IF EXISTS user_tasks_view CASCADE;
DROP VIEW IF EXISTS project_overview CASCADE;

-- ============================================================================
-- SECTION 2: DROP TRIGGERS
-- ============================================================================

DO $$
DECLARE
    t text;
BEGIN
    -- Drop all updated_at triggers
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_update_%I_updated_at ON %I;', t, t);
    END LOOP;
END $$;

DROP TRIGGER IF EXISTS trigger_log_task_status_change ON tasks;

-- ============================================================================
-- SECTION 3: DROP FUNCTIONS
-- ============================================================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS log_task_status_change() CASCADE;

-- ============================================================================
-- SECTION 4: DROP TABLES (in correct dependency order)
-- ============================================================================

-- First drop tables with no dependencies on them
DROP TABLE IF EXISTS productivity_metrics CASCADE;
DROP TABLE IF EXISTS activity_flags CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS task_status_logs CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_permissions CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- SECTION 5: DROP ENUM TYPES
-- ============================================================================

DROP TYPE IF EXISTS audit_action CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ============================================================================
-- SECTION 6: DROP EXTENSIONS (Optional - may affect other databases)
-- ============================================================================

-- Uncomment if you want to remove extensions as well
-- Note: These may be used by other applications, so be careful

-- DROP EXTENSION IF EXISTS pg_stat_statements;
-- DROP EXTENSION IF EXISTS pg_trgm;
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION 7: REVOKE PERMISSIONS
-- ============================================================================

-- Revoke all privileges from ems_admin on the current database
DO $$
BEGIN
    EXECUTE format('REVOKE ALL PRIVILEGES ON DATABASE %I FROM ems_admin', current_database());
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not revoke database privileges: %', SQLERRM;
END $$;

REVOKE ALL PRIVILEGES ON SCHEMA public FROM ems_admin;
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM ems_admin;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM ems_admin;
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM ems_admin;

-- ============================================================================
-- SECTION 8: DROP USER (Optional - run as superuser)
-- ============================================================================

-- Uncomment to drop the user as well
-- Must be run as a superuser and requires no active connections

-- DO $$
-- BEGIN
--     IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'ems_admin') THEN
--         DROP OWNED BY ems_admin;
--         DROP USER ems_admin;
--     END IF;
-- END $$;

-- ============================================================================
-- SECTION 9: DROP DATABASE (Optional - run from different database)
-- ============================================================================

-- To drop the entire database, run this from a different database (e.g., postgres):
-- 
-- -- Terminate all connections
-- SELECT pg_terminate_backend(pg_stat_activity.pid)
-- FROM pg_stat_activity
-- WHERE pg_stat_activity.datname = 'employee_management_db'
-- AND pid <> pg_backend_pid();
--
-- -- Drop database
-- DROP DATABASE IF EXISTS employee_management_db;

-- ============================================================================
-- VERIFICATION: Check remaining objects
-- ============================================================================

DO $$
DECLARE
    table_count INTEGER;
    type_count INTEGER;
    func_count INTEGER;
BEGIN
    -- Count remaining tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    -- Count remaining custom types
    SELECT COUNT(*) INTO type_count
    FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public'
    AND t.typtype = 'e';
    
    -- Count remaining functions
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prokind = 'f';
    
    RAISE NOTICE '=== Rollback Verification ===';
    RAISE NOTICE 'Remaining tables in public schema: %', table_count;
    RAISE NOTICE 'Remaining enum types: %', type_count;
    RAISE NOTICE 'Remaining functions: %', func_count;
    
    IF table_count = 0 AND type_count = 0 THEN
        RAISE NOTICE 'Rollback completed successfully!';
    ELSE
        RAISE NOTICE 'Some objects may still remain. Please verify manually.';
    END IF;
END $$;

-- ============================================================================
-- ROLLBACK COMPLETE
-- ============================================================================

SELECT 'Rollback completed. Employee Management System objects have been removed.' AS result;
