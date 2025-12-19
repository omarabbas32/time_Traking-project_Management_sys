-- ============================================================================
-- Employee Management System - Complete Schema
-- Version: 1.0.0
-- Description: Complete PostgreSQL schema for employee management with
--              projects, tasks, sub-tasks, and granular permissions
-- ============================================================================

-- ============================================================================
-- SECTION 1: DATABASE AND USER SETUP
-- Run this section as postgres superuser
-- ============================================================================

-- Create database with UTF8 encoding
-- Note: Must be run outside of a transaction block
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'employee_management_db') THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE employee_management_db WITH ENCODING ''UTF8'' LC_COLLATE ''en_US.UTF-8'' LC_CTYPE ''en_US.UTF-8'' TEMPLATE template0');
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Database may already exist or dblink not available. Please create manually if needed.';
END $$;

-- Create user with secure password
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ems_admin') THEN
        CREATE USER ems_admin WITH PASSWORD 'EMS_Secure_P@ssw0rd_2024!';
    END IF;
END $$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE employee_management_db TO ems_admin;

-- ============================================================================
-- SECTION 2: CONNECT TO DATABASE AND ENABLE EXTENSIONS
-- Run the following after connecting to employee_management_db
-- ============================================================================

\c employee_management_db

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram matching for fuzzy search
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Query performance tracking

-- Grant schema usage to ems_admin
GRANT ALL ON SCHEMA public TO ems_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ems_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ems_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO ems_admin;

-- ============================================================================
-- SECTION 3: ENUM TYPES
-- ============================================================================

-- User roles enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'admin',
            'manager',
            'content_creator',
            'designer',
            'video_editor',
            'media_buyer'
        );
    END IF;
END $$;

-- Project status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM (
            'planning',
            'active',
            'on_hold',
            'completed',
            'archived'
        );
    END IF;
END $$;

-- Task status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM (
            'pending',
            'in_progress',
            'on_hold',
            'in_review',
            'revisions',
            'completed',
            'cancelled'
        );
    END IF;
END $$;

-- Task priority enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE task_priority AS ENUM (
            'low',
            'medium',
            'high',
            'urgent'
        );
    END IF;
END $$;

-- Notification type enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM (
            'task_assigned',
            'task_updated',
            'task_completed',
            'comment_added',
            'mention',
            'deadline_reminder',
            'project_update',
            'permission_granted',
            'file_uploaded'
        );
    END IF;
END $$;

-- Audit action enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') THEN
        CREATE TYPE audit_action AS ENUM (
            'create',
            'update',
            'delete',
            'login',
            'logout',
            'permission_change',
            'status_change',
            'file_upload',
            'file_delete'
        );
    END IF;
END $$;

-- ============================================================================
-- SECTION 4: TABLES
-- ============================================================================

-- -----------------------------------------------------------------------------
-- Users Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'content_creator',
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    department VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'System users with role-based access control';
COMMENT ON COLUMN users.role IS 'User role: admin, manager, content_creator, designer, video_editor, media_buyer';

-- -----------------------------------------------------------------------------
-- User Sessions Table (JWT Management)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_sessions IS 'Active user sessions for JWT token management';

-- -----------------------------------------------------------------------------
-- Projects Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status NOT NULL DEFAULT 'planning',
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    start_date DATE,
    target_end_date DATE,
    actual_end_date DATE,
    budget DECIMAL(15, 2),
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE projects IS 'Projects with status tracking and ownership';

-- -----------------------------------------------------------------------------
-- Project Members Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

COMMENT ON TABLE project_members IS 'User membership in projects';

-- -----------------------------------------------------------------------------
-- Project Permissions Table (Granular Access Control)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    can_view BOOLEAN NOT NULL DEFAULT TRUE,
    can_edit_project BOOLEAN NOT NULL DEFAULT FALSE,
    can_create_tasks BOOLEAN NOT NULL DEFAULT FALSE,
    can_assign_tasks BOOLEAN NOT NULL DEFAULT FALSE,
    can_upload_files BOOLEAN NOT NULL DEFAULT FALSE,
    can_manage_members BOOLEAN NOT NULL DEFAULT FALSE,
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

COMMENT ON TABLE project_permissions IS 'Granular permission control for project access';
COMMENT ON COLUMN project_permissions.can_view IS 'Permission to view project and its contents';
COMMENT ON COLUMN project_permissions.can_edit_project IS 'Permission to edit project details';
COMMENT ON COLUMN project_permissions.can_create_tasks IS 'Permission to create new tasks';
COMMENT ON COLUMN project_permissions.can_assign_tasks IS 'Permission to assign tasks to users';
COMMENT ON COLUMN project_permissions.can_upload_files IS 'Permission to upload files';
COMMENT ON COLUMN project_permissions.can_manage_members IS 'Permission to add/remove project members';

-- -----------------------------------------------------------------------------
-- Tasks Table (with support for sub-tasks and sub-sub-tasks)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'pending',
    priority task_priority NOT NULL DEFAULT 'medium',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    estimated_hours DECIMAL(8, 2),
    actual_hours DECIMAL(8, 2),
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    order_index INTEGER NOT NULL DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tasks IS 'Tasks with hierarchical structure supporting sub-tasks and sub-sub-tasks';
COMMENT ON COLUMN tasks.parent_task_id IS 'Reference to parent task for creating sub-task hierarchy';

-- -----------------------------------------------------------------------------
-- Task Status Logs Table (Time Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    previous_status task_status,
    new_status task_status NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN ended_at IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (ended_at - started_at)) / 60
            ELSE NULL
        END
    ) STORED,
    is_productive BOOLEAN GENERATED ALWAYS AS (
        new_status IN ('in_progress', 'revisions')
    ) STORED,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE task_status_logs IS 'Time tracking logs for task status changes';
COMMENT ON COLUMN task_status_logs.is_productive IS 'Only in_progress and revisions count as productive time';

-- -----------------------------------------------------------------------------
-- Files Table (Project-level and Task-level)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    file_name VARCHAR(500) NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    file_extension VARCHAR(50),
    checksum VARCHAR(64),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    parent_file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE files IS 'File attachments for both projects and tasks';
COMMENT ON COLUMN files.task_id IS 'NULL for project-level files, set for task-level files';

-- -----------------------------------------------------------------------------
-- Comments Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    mentions UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE comments IS 'Comments on tasks with threading support';

-- -----------------------------------------------------------------------------
-- Notifications Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    reference_type VARCHAR(50),
    reference_id UUID,
    action_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notifications IS 'User notifications for various system events';

-- -----------------------------------------------------------------------------
-- Audit Logs Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all system actions';

-- -----------------------------------------------------------------------------
-- Activity Flags Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flag_type VARCHAR(50) NOT NULL,
    reason TEXT,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE activity_flags IS 'Flags for task activities requiring attention';

-- -----------------------------------------------------------------------------
-- Productivity Metrics Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productivity_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    total_tasks_completed INTEGER NOT NULL DEFAULT 0,
    total_productive_minutes INTEGER NOT NULL DEFAULT 0,
    total_tasks_assigned INTEGER NOT NULL DEFAULT 0,
    average_task_completion_hours DECIMAL(8, 2),
    on_time_completion_rate DECIMAL(5, 2),
    revision_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, project_id, metric_date)
);

COMMENT ON TABLE productivity_metrics IS 'Aggregated productivity metrics per user per project per day';

-- ============================================================================
-- SECTION 5: INDEXES
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email_trgm ON users USING gin(email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_name_trgm ON users USING gin((first_name || ' ' || last_name) gin_trgm_ops);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_valid ON user_sessions(is_valid);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_archived ON projects(is_archived);
CREATE INDEX IF NOT EXISTS idx_projects_name_trgm ON projects USING gin(name gin_trgm_ops);

-- Project members indexes
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_is_active ON project_members(is_active);

-- Project permissions indexes
CREATE INDEX IF NOT EXISTS idx_project_permissions_project_id ON project_permissions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_permissions_user_id ON project_permissions(user_id);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_title_trgm ON tasks USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING gin(tags);

-- Task status logs indexes
CREATE INDEX IF NOT EXISTS idx_task_status_logs_task_id ON task_status_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_task_status_logs_user_id ON task_status_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_task_status_logs_started_at ON task_status_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_task_status_logs_is_productive ON task_status_logs(is_productive);

-- Files indexes
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_task_id ON files(task_id);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_files_mime_type ON files(mime_type);
CREATE INDEX IF NOT EXISTS idx_files_file_name_trgm ON files USING gin(file_name gin_trgm_ops);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Activity flags indexes
CREATE INDEX IF NOT EXISTS idx_activity_flags_task_id ON activity_flags(task_id);
CREATE INDEX IF NOT EXISTS idx_activity_flags_user_id ON activity_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_flags_is_resolved ON activity_flags(is_resolved);

-- Productivity metrics indexes
CREATE INDEX IF NOT EXISTS idx_productivity_metrics_user_id ON productivity_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_productivity_metrics_project_id ON productivity_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_productivity_metrics_metric_date ON productivity_metrics(metric_date);

-- ============================================================================
-- SECTION 6: TRIGGERS
-- ============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
        AND table_name NOT IN ('task_status_logs', 'audit_logs', 'notifications')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trigger_update_%I_updated_at ON %I;
            CREATE TRIGGER trigger_update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END $$;

-- Function to track task status changes
CREATE OR REPLACE FUNCTION log_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- End the previous status log
        UPDATE task_status_logs 
        SET ended_at = CURRENT_TIMESTAMP
        WHERE task_id = NEW.id 
        AND ended_at IS NULL;
        
        -- Create new status log
        INSERT INTO task_status_logs (task_id, user_id, previous_status, new_status)
        VALUES (NEW.id, COALESCE(NEW.assigned_to, NEW.created_by), OLD.status, NEW.status);
    END IF;
    
    -- Set completed_at when task is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_task_status_change ON tasks;
CREATE TRIGGER trigger_log_task_status_change
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION log_task_status_change();

-- ============================================================================
-- SECTION 7: VIEWS
-- ============================================================================

-- Project Overview View
CREATE OR REPLACE VIEW project_overview AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.status,
    p.start_date,
    p.target_end_date,
    p.actual_end_date,
    p.budget,
    p.is_archived,
    p.created_at,
    p.updated_at,
    u.id AS owner_id,
    u.first_name || ' ' || u.last_name AS owner_name,
    u.email AS owner_email,
    COALESCE(task_counts.total_tasks, 0) AS total_tasks,
    COALESCE(task_counts.pending_tasks, 0) AS pending_tasks,
    COALESCE(task_counts.in_progress_tasks, 0) AS in_progress_tasks,
    COALESCE(task_counts.completed_tasks, 0) AS completed_tasks,
    COALESCE(task_counts.overdue_tasks, 0) AS overdue_tasks,
    COALESCE(member_counts.team_size, 0) AS team_size,
    CASE 
        WHEN COALESCE(task_counts.total_tasks, 0) > 0 
        THEN ROUND((COALESCE(task_counts.completed_tasks, 0)::DECIMAL / task_counts.total_tasks) * 100, 2)
        ELSE 0 
    END AS completion_percentage
FROM projects p
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN (
    SELECT 
        project_id,
        COUNT(*) AS total_tasks,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending_tasks,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_tasks,
        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status NOT IN ('completed', 'cancelled')) AS overdue_tasks
    FROM tasks
    GROUP BY project_id
) task_counts ON p.id = task_counts.project_id
LEFT JOIN (
    SELECT 
        project_id,
        COUNT(DISTINCT user_id) AS team_size
    FROM project_members
    WHERE is_active = TRUE
    GROUP BY project_id
) member_counts ON p.id = member_counts.project_id;

COMMENT ON VIEW project_overview IS 'Comprehensive project view with task counts and team size';

-- User Tasks View
CREATE OR REPLACE VIEW user_tasks_view AS
SELECT 
    t.id AS task_id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.due_date,
    t.start_date,
    t.estimated_hours,
    t.actual_hours,
    t.order_index,
    t.tags,
    t.created_at AS task_created_at,
    t.completed_at,
    t.parent_task_id,
    -- Assigned user info
    assigned.id AS assigned_to_id,
    assigned.first_name || ' ' || assigned.last_name AS assigned_to_name,
    assigned.email AS assigned_to_email,
    assigned.role AS assigned_to_role,
    -- Creator info
    creator.id AS created_by_id,
    creator.first_name || ' ' || creator.last_name AS created_by_name,
    -- Project info
    p.id AS project_id,
    p.name AS project_name,
    p.status AS project_status,
    -- Parent task info
    parent.title AS parent_task_title,
    -- Subtask count
    COALESCE(subtask_counts.subtask_count, 0) AS subtask_count,
    -- Time tracking
    COALESCE(time_tracking.productive_minutes, 0) AS productive_minutes,
    -- Comments count
    COALESCE(comment_counts.comment_count, 0) AS comment_count,
    -- Is overdue flag
    CASE 
        WHEN t.due_date < CURRENT_DATE AND t.status NOT IN ('completed', 'cancelled') 
        THEN TRUE 
        ELSE FALSE 
    END AS is_overdue,
    -- Task depth (0 = main task, 1 = sub-task, 2+ = sub-sub-task)
    (
        WITH RECURSIVE task_hierarchy AS (
            SELECT t.id, t.parent_task_id, 0 AS depth
            UNION ALL
            SELECT th.id, pt.parent_task_id, th.depth + 1
            FROM task_hierarchy th
            JOIN tasks pt ON th.parent_task_id = pt.id
        )
        SELECT MAX(depth) FROM task_hierarchy
    ) AS task_depth
FROM tasks t
LEFT JOIN users assigned ON t.assigned_to = assigned.id
LEFT JOIN users creator ON t.created_by = creator.id
LEFT JOIN projects p ON t.project_id = p.id
LEFT JOIN tasks parent ON t.parent_task_id = parent.id
LEFT JOIN (
    SELECT parent_task_id, COUNT(*) AS subtask_count
    FROM tasks
    WHERE parent_task_id IS NOT NULL
    GROUP BY parent_task_id
) subtask_counts ON t.id = subtask_counts.parent_task_id
LEFT JOIN (
    SELECT task_id, SUM(COALESCE(duration_minutes, 0)) AS productive_minutes
    FROM task_status_logs
    WHERE is_productive = TRUE
    GROUP BY task_id
) time_tracking ON t.id = time_tracking.task_id
LEFT JOIN (
    SELECT task_id, COUNT(*) AS comment_count
    FROM comments
    GROUP BY task_id
) comment_counts ON t.id = comment_counts.task_id;

COMMENT ON VIEW user_tasks_view IS 'Detailed task view with project info, time tracking, and hierarchical data';

-- ============================================================================
-- SECTION 8: GRANTS
-- ============================================================================

-- Grant permissions to ems_admin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ems_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ems_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO ems_admin;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
