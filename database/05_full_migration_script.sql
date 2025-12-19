CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE users (
    id uuid NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    role text NOT NULL,
    avatar_url text,
    phone text,
    department text,
    is_active boolean NOT NULL,
    email_verified boolean NOT NULL,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_users" PRIMARY KEY (id)
);

CREATE TABLE audit_logs (
    id uuid NOT NULL,
    user_id uuid,
    action integer NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    old_values text,
    new_values text,
    ip_address text,
    user_agent text,
    session_id uuid,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_audit_logs" PRIMARY KEY (id),
    CONSTRAINT "FK_audit_logs_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE notifications (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    type integer NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean NOT NULL,
    read_at timestamp with time zone,
    reference_type text,
    reference_id uuid,
    action_url text,
    metadata jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_notifications" PRIMARY KEY (id),
    CONSTRAINT "FK_notifications_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE projects (
    id uuid NOT NULL,
    name text NOT NULL,
    description text,
    status text NOT NULL,
    owner_id uuid NOT NULL,
    start_date timestamp with time zone,
    target_end_date timestamp with time zone,
    actual_end_date timestamp with time zone,
    budget numeric(15,2),
    is_archived boolean NOT NULL,
    metadata jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_projects" PRIMARY KEY (id),
    CONSTRAINT "FK_projects_users_owner_id" FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE RESTRICT
);

CREATE TABLE user_sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    refresh_token_hash text,
    device_info jsonb,
    ip_address text,
    user_agent text,
    is_valid boolean NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    refresh_expires_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    last_used_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_user_sessions" PRIMARY KEY (id),
    CONSTRAINT "FK_user_sessions_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE productivity_metrics (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid,
    metric_date timestamp with time zone NOT NULL,
    total_tasks_completed integer NOT NULL,
    total_productive_minutes integer NOT NULL,
    total_tasks_assigned integer NOT NULL,
    average_task_completion_hours numeric(8,2),
    on_time_completion_rate numeric(5,2),
    revision_count integer NOT NULL,
    metadata jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_productivity_metrics" PRIMARY KEY (id),
    CONSTRAINT "FK_productivity_metrics_projects_project_id" FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT "FK_productivity_metrics_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE project_members (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamp with time zone NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_project_members" PRIMARY KEY (id),
    CONSTRAINT "FK_project_members_projects_project_id" FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT "FK_project_members_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE project_permissions (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    can_view boolean NOT NULL,
    can_edit_project boolean NOT NULL,
    can_create_tasks boolean NOT NULL,
    can_assign_tasks boolean NOT NULL,
    can_upload_files boolean NOT NULL,
    can_manage_members boolean NOT NULL,
    granted_by uuid,
    granted_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_project_permissions" PRIMARY KEY (id),
    CONSTRAINT "FK_project_permissions_projects_project_id" FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT "FK_project_permissions_users_granted_by" FOREIGN KEY (granted_by) REFERENCES users (id),
    CONSTRAINT "FK_project_permissions_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    parent_task_id uuid,
    title text NOT NULL,
    description text,
    status text NOT NULL,
    priority text NOT NULL,
    assigned_to uuid,
    created_by uuid NOT NULL,
    estimated_hours numeric(8,2),
    actual_hours numeric(8,2),
    start_date timestamp with time zone,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    order_index integer NOT NULL,
    tags text[] NOT NULL,
    metadata jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_tasks" PRIMARY KEY (id),
    CONSTRAINT "FK_tasks_projects_project_id" FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT "FK_tasks_tasks_parent_task_id" FOREIGN KEY (parent_task_id) REFERENCES tasks (id),
    CONSTRAINT "FK_tasks_users_assigned_to" FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT "FK_tasks_users_created_by" FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT
);

CREATE TABLE activity_flags (
    id uuid NOT NULL,
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    flag_type text NOT NULL,
    reason text,
    is_resolved boolean NOT NULL,
    resolved_by uuid,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_activity_flags" PRIMARY KEY (id),
    CONSTRAINT "FK_activity_flags_tasks_task_id" FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    CONSTRAINT "FK_activity_flags_users_resolved_by" FOREIGN KEY (resolved_by) REFERENCES users (id),
    CONSTRAINT "FK_activity_flags_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id uuid NOT NULL,
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_comment_id uuid,
    content text NOT NULL,
    is_edited boolean NOT NULL,
    edited_at timestamp with time zone,
    mentions uuid[] NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_comments" PRIMARY KEY (id),
    CONSTRAINT "FK_comments_comments_parent_comment_id" FOREIGN KEY (parent_comment_id) REFERENCES comments (id),
    CONSTRAINT "FK_comments_tasks_task_id" FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    CONSTRAINT "FK_comments_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE files (
    id uuid NOT NULL,
    project_id uuid NOT NULL,
    task_id uuid,
    uploaded_by uuid NOT NULL,
    file_name text NOT NULL,
    original_name text NOT NULL,
    file_path text NOT NULL,
    file_size bigint NOT NULL,
    mime_type text NOT NULL,
    file_extension text,
    checksum text,
    is_public boolean NOT NULL,
    version integer NOT NULL,
    parent_file_id uuid,
    metadata jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_files" PRIMARY KEY (id),
    CONSTRAINT "FK_files_projects_project_id" FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT "FK_files_tasks_task_id" FOREIGN KEY (task_id) REFERENCES tasks (id),
    CONSTRAINT "FK_files_users_uploaded_by" FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE task_status_logs (
    id uuid NOT NULL,
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    previous_status text,
    new_status text NOT NULL,
    started_at timestamp with time zone NOT NULL,
    ended_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_task_status_logs" PRIMARY KEY (id),
    CONSTRAINT "FK_task_status_logs_tasks_task_id" FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    CONSTRAINT "FK_task_status_logs_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX "IX_activity_flags_resolved_by" ON activity_flags (resolved_by);

CREATE INDEX "IX_activity_flags_task_id" ON activity_flags (task_id);

CREATE INDEX "IX_activity_flags_user_id" ON activity_flags (user_id);

CREATE INDEX "IX_audit_logs_user_id" ON audit_logs (user_id);

CREATE INDEX "IX_comments_parent_comment_id" ON comments (parent_comment_id);

CREATE INDEX "IX_comments_task_id" ON comments (task_id);

CREATE INDEX "IX_comments_user_id" ON comments (user_id);

CREATE INDEX "IX_files_project_id" ON files (project_id);

CREATE INDEX "IX_files_task_id" ON files (task_id);

CREATE INDEX "IX_files_uploaded_by" ON files (uploaded_by);

CREATE INDEX "IX_notifications_user_id" ON notifications (user_id);

CREATE INDEX "IX_productivity_metrics_project_id" ON productivity_metrics (project_id);

CREATE INDEX "IX_productivity_metrics_user_id" ON productivity_metrics (user_id);

CREATE INDEX "IX_project_members_project_id" ON project_members (project_id);

CREATE INDEX "IX_project_members_user_id" ON project_members (user_id);

CREATE INDEX "IX_project_permissions_granted_by" ON project_permissions (granted_by);

CREATE INDEX "IX_project_permissions_project_id" ON project_permissions (project_id);

CREATE INDEX "IX_project_permissions_user_id" ON project_permissions (user_id);

CREATE INDEX "IX_projects_owner_id" ON projects (owner_id);

CREATE INDEX "IX_task_status_logs_task_id" ON task_status_logs (task_id);

CREATE INDEX "IX_task_status_logs_user_id" ON task_status_logs (user_id);

CREATE INDEX "IX_tasks_assigned_to" ON tasks (assigned_to);

CREATE INDEX "IX_tasks_created_by" ON tasks (created_by);

CREATE INDEX "IX_tasks_parent_task_id" ON tasks (parent_task_id);

CREATE INDEX "IX_tasks_project_id" ON tasks (project_id);

CREATE INDEX "IX_user_sessions_user_id" ON user_sessions (user_id);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251219185206_InitialCreate', '9.0.0');

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251219210624_intial', '9.0.0');

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251219210941_intiall', '9.0.0');

COMMIT;


-- ============================================================================
-- APPENDED: Fix Permissions for EMS Admin
-- ============================================================================

-- Grant usage on public schema
GRANT ALL ON SCHEMA public TO ems_admin;

-- Grant permissions on all newly created tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ems_admin;

-- Grant permissions on all sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ems_admin;

-- Grant permissions on all functions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO ems_admin;

-- Ensure future tables created by users also give permissions to ems_admin
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ems_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ems_admin;
