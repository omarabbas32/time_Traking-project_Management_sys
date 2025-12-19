-- ============================================================================
-- Employee Management System - Seed Data
-- Version: 1.0.0
-- Description: Realistic sample data for testing and development
-- ============================================================================

-- Start transaction
BEGIN;

-- ============================================================================
-- SECTION 1: USERS (11 total: 1 admin, 2 managers, 8 employees)
-- ============================================================================

-- Note: Password hash is for 'Password123!' using bcrypt
-- In production, use proper password hashing

INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone, department, is_active, email_verified)
VALUES
    -- Admin
    ('a0000001-0000-0000-0000-000000000001', 'admin@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'System', 'Administrator', 'admin', '+1-555-0100', 'IT', TRUE, TRUE),
    
    -- Managers
    ('a0000001-0000-0000-0000-000000000002', 'sarah.johnson@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'Sarah', 'Johnson', 'manager', '+1-555-0101', 'Marketing', TRUE, TRUE),
    ('a0000001-0000-0000-0000-000000000003', 'michael.chen@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'Michael', 'Chen', 'manager', '+1-555-0102', 'Creative', TRUE, TRUE),
    
    -- Content Creators
    ('a0000001-0000-0000-0000-000000000004', 'emily.davis@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'Emily', 'Davis', 'content_creator', '+1-555-0103', 'Content', TRUE, TRUE),
    ('a0000001-0000-0000-0000-000000000005', 'james.wilson@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'James', 'Wilson', 'content_creator', '+1-555-0104', 'Content', TRUE, TRUE),
    
    -- Designers
    ('a0000001-0000-0000-0000-000000000006', 'olivia.martinez@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'Olivia', 'Martinez', 'designer', '+1-555-0105', 'Design', TRUE, TRUE),
    ('a0000001-0000-0000-0000-000000000007', 'william.brown@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'William', 'Brown', 'designer', '+1-555-0106', 'Design', TRUE, TRUE),
    
    -- Video Editors
    ('a0000001-0000-0000-0000-000000000008', 'sophia.garcia@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'Sophia', 'Garcia', 'video_editor', '+1-555-0107', 'Video', TRUE, TRUE),
    ('a0000001-0000-0000-0000-000000000009', 'benjamin.lee@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'Benjamin', 'Lee', 'video_editor', '+1-555-0108', 'Video', TRUE, TRUE),
    
    -- Media Buyers
    ('a0000001-0000-0000-0000-000000000010', 'ava.thompson@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'Ava', 'Thompson', 'media_buyer', '+1-555-0109', 'Media', TRUE, TRUE),
    ('a0000001-0000-0000-0000-000000000011', 'ethan.wright@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.rYMg0eiPJqGXyq', 'Ethan', 'Wright', 'media_buyer', '+1-555-0110', 'Media', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Update last_login for some users
UPDATE users SET last_login_at = NOW() - INTERVAL '1 hour' WHERE email = 'admin@company.com';
UPDATE users SET last_login_at = NOW() - INTERVAL '2 hours' WHERE email = 'sarah.johnson@company.com';
UPDATE users SET last_login_at = NOW() - INTERVAL '30 minutes' WHERE email = 'michael.chen@company.com';

-- ============================================================================
-- SECTION 2: PROJECTS (3 with different statuses)
-- ============================================================================

INSERT INTO projects (id, name, description, status, owner_id, start_date, target_end_date, budget)
VALUES
    -- Active Project
    (
        'b0000001-0000-0000-0000-000000000001',
        'Q1 Marketing Campaign',
        'Comprehensive marketing campaign for Q1 2025 including social media, video content, and paid advertising across multiple platforms.',
        'active',
        'a0000001-0000-0000-0000-000000000002', -- Sarah Johnson (Manager)
        '2025-01-01',
        '2025-03-31',
        75000.00
    ),
    -- Planning Project
    (
        'b0000001-0000-0000-0000-000000000002',
        'Website Redesign 2025',
        'Complete overhaul of the company website with modern design, improved UX, and enhanced mobile responsiveness.',
        'planning',
        'a0000001-0000-0000-0000-000000000003', -- Michael Chen (Manager)
        '2025-02-01',
        '2025-05-31',
        120000.00
    ),
    -- Completed Project
    (
        'b0000001-0000-0000-0000-000000000003',
        'Holiday Season Promotion',
        'End of year promotional campaign including special offers, themed content, and targeted advertising.',
        'completed',
        'a0000001-0000-0000-0000-000000000002', -- Sarah Johnson (Manager)
        '2024-11-01',
        '2024-12-31',
        50000.00
    )
ON CONFLICT (id) DO NOTHING;

-- Update actual_end_date for completed project
UPDATE projects SET actual_end_date = '2024-12-28' WHERE id = 'b0000001-0000-0000-0000-000000000003';

-- ============================================================================
-- SECTION 3: PROJECT MEMBERS
-- ============================================================================

INSERT INTO project_members (project_id, user_id, is_active)
VALUES
    -- Q1 Marketing Campaign team
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002', TRUE), -- Sarah (Owner)
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', TRUE), -- Emily (Content)
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000006', TRUE), -- Olivia (Designer)
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000008', TRUE), -- Sophia (Video)
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000010', TRUE), -- Ava (Media)
    
    -- Website Redesign team
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000003', TRUE), -- Michael (Owner)
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000006', TRUE), -- Olivia (Designer)
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000007', TRUE), -- William (Designer)
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000005', TRUE), -- James (Content)
    
    -- Holiday Promotion team (completed)
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000002', TRUE), -- Sarah (Owner)
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004', TRUE), -- Emily (Content)
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000009', TRUE), -- Benjamin (Video)
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000011', TRUE)  -- Ethan (Media)
ON CONFLICT (project_id, user_id) DO NOTHING;

-- ============================================================================
-- SECTION 4: PROJECT PERMISSIONS
-- ============================================================================

INSERT INTO project_permissions (project_id, user_id, can_view, can_edit_project, can_create_tasks, can_assign_tasks, can_upload_files, can_manage_members, granted_by)
VALUES
    -- Q1 Marketing Campaign permissions
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 'a0000001-0000-0000-0000-000000000001'), -- Sarah (Full)
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000002'), -- Emily
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000006', TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000002'), -- Olivia
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000008', TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000002'), -- Sophia
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000010', TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000002'), -- Ava
    
    -- Website Redesign permissions
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000003', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 'a0000001-0000-0000-0000-000000000001'), -- Michael (Full)
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000006', TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000003'), -- Olivia
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000007', TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000003'), -- William
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000005', TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000003'), -- James
    
    -- Holiday Promotion permissions
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000002', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 'a0000001-0000-0000-0000-000000000001'), -- Sarah (Full)
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004', TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000002'), -- Emily
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000009', TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, 'a0000001-0000-0000-0000-000000000002'), -- Benjamin
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000011', TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, 'a0000001-0000-0000-0000-000000000002')  -- Ethan
ON CONFLICT (project_id, user_id) DO NOTHING;

-- ============================================================================
-- SECTION 5: TASKS (15 tasks including main tasks, sub-tasks, sub-sub-tasks)
-- ============================================================================

-- Project 1: Q1 Marketing Campaign - Main Tasks
INSERT INTO tasks (id, project_id, parent_task_id, title, description, status, priority, assigned_to, created_by, estimated_hours, start_date, due_date, order_index, tags)
VALUES
    -- Main Task 1: Social Media Strategy
    (
        'c0000001-0000-0000-0000-000000000001',
        'b0000001-0000-0000-0000-000000000001',
        NULL,
        'Develop Social Media Strategy',
        'Create comprehensive social media strategy for Q1 including content calendar, platform focus, and engagement goals.',
        'in_progress',
        'high',
        'a0000001-0000-0000-0000-000000000004', -- Emily
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        40.00,
        '2025-01-02',
        '2025-01-20',
        1,
        ARRAY['strategy', 'social-media', 'q1']
    ),
    
    -- Sub-task 1.1: Platform Analysis
    (
        'c0000001-0000-0000-0000-000000000002',
        'b0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000001', -- Parent: Social Media Strategy
        'Analyze Current Platform Performance',
        'Review metrics from existing social media platforms and identify areas for improvement.',
        'completed',
        'medium',
        'a0000001-0000-0000-0000-000000000004', -- Emily
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        8.00,
        '2025-01-02',
        '2025-01-05',
        1,
        ARRAY['analytics', 'research']
    ),
    
    -- Sub-task 1.2: Content Calendar Creation
    (
        'c0000001-0000-0000-0000-000000000003',
        'b0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000001', -- Parent: Social Media Strategy
        'Create Q1 Content Calendar',
        'Develop detailed content calendar with posting schedule, themes, and key dates.',
        'in_progress',
        'high',
        'a0000001-0000-0000-0000-000000000004', -- Emily
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        16.00,
        '2025-01-06',
        '2025-01-15',
        2,
        ARRAY['content', 'planning']
    ),
    
    -- Sub-sub-task 1.2.1: Weekly Theme Definition
    (
        'c0000001-0000-0000-0000-000000000004',
        'b0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000003', -- Parent: Content Calendar
        'Define Weekly Themes',
        'Establish thematic focus for each week of Q1.',
        'completed',
        'medium',
        'a0000001-0000-0000-0000-000000000004', -- Emily
        'a0000001-0000-0000-0000-000000000004', -- Emily
        4.00,
        '2025-01-06',
        '2025-01-08',
        1,
        ARRAY['themes', 'planning']
    ),
    
    -- Main Task 2: Design Assets
    (
        'c0000001-0000-0000-0000-000000000005',
        'b0000001-0000-0000-0000-000000000001',
        NULL,
        'Create Campaign Design Assets',
        'Design all visual assets needed for the marketing campaign including banners, social graphics, and email templates.',
        'pending',
        'high',
        'a0000001-0000-0000-0000-000000000006', -- Olivia
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        60.00,
        '2025-01-15',
        '2025-02-15',
        2,
        ARRAY['design', 'assets', 'graphics']
    ),
    
    -- Sub-task 2.1: Brand Guidelines Review
    (
        'c0000001-0000-0000-0000-000000000006',
        'b0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000005', -- Parent: Design Assets
        'Review and Update Brand Guidelines',
        'Ensure all new designs align with current brand guidelines and update if necessary.',
        'pending',
        'medium',
        'a0000001-0000-0000-0000-000000000006', -- Olivia
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        8.00,
        '2025-01-15',
        '2025-01-20',
        1,
        ARRAY['brand', 'guidelines']
    ),
    
    -- Main Task 3: Video Production
    (
        'c0000001-0000-0000-0000-000000000007',
        'b0000001-0000-0000-0000-000000000001',
        NULL,
        'Produce Campaign Video Content',
        'Create video content for social media and advertising including short-form and long-form videos.',
        'pending',
        'urgent',
        'a0000001-0000-0000-0000-000000000008', -- Sophia
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        80.00,
        '2025-01-20',
        '2025-03-01',
        3,
        ARRAY['video', 'production', 'content']
    ),
    
    -- Main Task 4: Ad Campaign Setup
    (
        'c0000001-0000-0000-0000-000000000008',
        'b0000001-0000-0000-0000-000000000001',
        NULL,
        'Setup Paid Advertising Campaigns',
        'Configure and launch paid advertising campaigns across Meta, Google, and TikTok platforms.',
        'pending',
        'high',
        'a0000001-0000-0000-0000-000000000010', -- Ava
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        30.00,
        '2025-02-01',
        '2025-02-20',
        4,
        ARRAY['advertising', 'paid-media', 'setup']
    ),

-- Project 2: Website Redesign - Tasks
    -- Main Task 5: UX Research
    (
        'c0000001-0000-0000-0000-000000000009',
        'b0000001-0000-0000-0000-000000000002',
        NULL,
        'Conduct UX Research',
        'Perform user research including surveys, interviews, and usability testing of current website.',
        'in_progress',
        'high',
        'a0000001-0000-0000-0000-000000000007', -- William
        'a0000001-0000-0000-0000-000000000003', -- Michael
        50.00,
        '2025-02-01',
        '2025-02-28',
        1,
        ARRAY['ux', 'research', 'user-testing']
    ),
    
    -- Sub-task 5.1: User Surveys
    (
        'c0000001-0000-0000-0000-000000000010',
        'b0000001-0000-0000-0000-000000000002',
        'c0000001-0000-0000-0000-000000000009', -- Parent: UX Research
        'Create and Distribute User Surveys',
        'Design surveys and collect feedback from current website users.',
        'in_review',
        'medium',
        'a0000001-0000-0000-0000-000000000007', -- William
        'a0000001-0000-0000-0000-000000000003', -- Michael
        12.00,
        '2025-02-01',
        '2025-02-10',
        1,
        ARRAY['survey', 'feedback']
    ),
    
    -- Main Task 6: Design Wireframes
    (
        'c0000001-0000-0000-0000-000000000011',
        'b0000001-0000-0000-0000-000000000002',
        NULL,
        'Create Website Wireframes',
        'Design low-fidelity wireframes for all main pages of the new website.',
        'pending',
        'high',
        'a0000001-0000-0000-0000-000000000006', -- Olivia
        'a0000001-0000-0000-0000-000000000003', -- Michael
        40.00,
        '2025-03-01',
        '2025-03-20',
        2,
        ARRAY['wireframes', 'design', 'layout']
    ),

-- Project 3: Holiday Promotion (Completed) - Tasks
    -- Main Task 7: Holiday Content Creation
    (
        'c0000001-0000-0000-0000-000000000012',
        'b0000001-0000-0000-0000-000000000003',
        NULL,
        'Create Holiday Themed Content',
        'Develop all holiday-themed content including posts, graphics, and promotional copy.',
        'completed',
        'high',
        'a0000001-0000-0000-0000-000000000004', -- Emily
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        35.00,
        '2024-11-01',
        '2024-11-30',
        1,
        ARRAY['holiday', 'content', 'promotion']
    ),
    
    -- Main Task 8: Holiday Video Ads
    (
        'c0000001-0000-0000-0000-000000000013',
        'b0000001-0000-0000-0000-000000000003',
        NULL,
        'Produce Holiday Video Advertisements',
        'Create video advertisements for holiday promotional campaign.',
        'completed',
        'urgent',
        'a0000001-0000-0000-0000-000000000009', -- Benjamin
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        50.00,
        '2024-11-15',
        '2024-12-10',
        2,
        ARRAY['video', 'holiday', 'advertising']
    ),
    
    -- Main Task 9: Holiday Media Buying
    (
        'c0000001-0000-0000-0000-000000000014',
        'b0000001-0000-0000-0000-000000000003',
        NULL,
        'Execute Holiday Media Buying Strategy',
        'Plan and execute paid media strategy for holiday promotions.',
        'completed',
        'high',
        'a0000001-0000-0000-0000-000000000011', -- Ethan
        'a0000001-0000-0000-0000-000000000002', -- Sarah
        40.00,
        '2024-11-20',
        '2024-12-25',
        3,
        ARRAY['media-buying', 'advertising', 'holiday']
    ),
    
    -- Sub-task 9.1: Budget Allocation
    (
        'c0000001-0000-0000-0000-000000000015',
        'b0000001-0000-0000-0000-000000000003',
        'c0000001-0000-0000-0000-000000000014', -- Parent: Media Buying
        'Allocate Campaign Budget Across Platforms',
        'Distribute advertising budget across Meta, Google, and TikTok based on performance data.',
        'completed',
        'high',
        'a0000001-0000-0000-0000-000000000011', -- Ethan
        'a0000001-0000-0000-0000-000000000011', -- Ethan
        6.00,
        '2024-11-20',
        '2024-11-25',
        1,
        ARRAY['budget', 'planning']
    )
ON CONFLICT (id) DO NOTHING;

-- Update completed tasks with completed_at and actual_hours
UPDATE tasks SET completed_at = '2025-01-05 16:30:00+00', actual_hours = 7.5 WHERE id = 'c0000001-0000-0000-0000-000000000002';
UPDATE tasks SET completed_at = '2025-01-07 14:00:00+00', actual_hours = 3.5 WHERE id = 'c0000001-0000-0000-0000-000000000004';
UPDATE tasks SET completed_at = '2024-11-28 17:00:00+00', actual_hours = 32.0 WHERE id = 'c0000001-0000-0000-0000-000000000012';
UPDATE tasks SET completed_at = '2024-12-08 12:00:00+00', actual_hours = 48.0 WHERE id = 'c0000001-0000-0000-0000-000000000013';
UPDATE tasks SET completed_at = '2024-12-24 18:00:00+00', actual_hours = 38.0 WHERE id = 'c0000001-0000-0000-0000-000000000014';
UPDATE tasks SET completed_at = '2024-11-24 11:00:00+00', actual_hours = 5.0 WHERE id = 'c0000001-0000-0000-0000-000000000015';

-- ============================================================================
-- SECTION 6: TASK STATUS LOGS (Time Tracking)
-- ============================================================================

INSERT INTO task_status_logs (task_id, user_id, previous_status, new_status, started_at, ended_at, notes)
VALUES
    -- Task 1: Social Media Strategy
    ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', NULL, 'pending', '2025-01-02 09:00:00+00', '2025-01-02 10:00:00+00', 'Task created'),
    ('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', 'pending', 'in_progress', '2025-01-02 10:00:00+00', NULL, 'Started working on strategy'),
    
    -- Task 2: Platform Analysis (Completed)
    ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004', NULL, 'pending', '2025-01-02 09:00:00+00', '2025-01-02 11:00:00+00', NULL),
    ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004', 'pending', 'in_progress', '2025-01-02 11:00:00+00', '2025-01-03 16:00:00+00', 'Analyzing platform metrics'),
    ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004', 'in_progress', 'in_review', '2025-01-03 16:00:00+00', '2025-01-04 10:00:00+00', 'Submitted for review'),
    ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004', 'in_review', 'revisions', '2025-01-04 10:00:00+00', '2025-01-04 14:00:00+00', 'Minor revisions requested'),
    ('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004', 'revisions', 'completed', '2025-01-04 14:00:00+00', '2025-01-05 16:30:00+00', 'Analysis completed and approved'),
    
    -- Task 3: Content Calendar Creation
    ('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004', NULL, 'pending', '2025-01-06 09:00:00+00', '2025-01-06 10:00:00+00', NULL),
    ('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004', 'pending', 'in_progress', '2025-01-06 10:00:00+00', NULL, 'Working on content calendar'),
    
    -- Task 4: Weekly Theme Definition (Completed)
    ('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', NULL, 'pending', '2025-01-06 09:30:00+00', '2025-01-06 11:00:00+00', NULL),
    ('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'pending', 'in_progress', '2025-01-06 11:00:00+00', '2025-01-07 12:00:00+00', 'Defining themes'),
    ('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'in_progress', 'completed', '2025-01-07 12:00:00+00', '2025-01-07 14:00:00+00', 'Themes approved'),
    
    -- Task 9: UX Research
    ('c0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000007', NULL, 'pending', '2025-02-01 09:00:00+00', '2025-02-01 14:00:00+00', NULL),
    ('c0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000007', 'pending', 'in_progress', '2025-02-01 14:00:00+00', NULL, 'Started UX research'),
    
    -- Task 10: User Surveys
    ('c0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000007', NULL, 'pending', '2025-02-01 09:00:00+00', '2025-02-02 09:00:00+00', NULL),
    ('c0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000007', 'pending', 'in_progress', '2025-02-02 09:00:00+00', '2025-02-08 17:00:00+00', 'Creating survey'),
    ('c0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000007', 'in_progress', 'in_review', '2025-02-08 17:00:00+00', NULL, 'Survey submitted for review'),
    
    -- Holiday campaign completed tasks
    ('c0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000004', NULL, 'pending', '2024-11-01 09:00:00+00', '2024-11-01 10:00:00+00', NULL),
    ('c0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000004', 'pending', 'in_progress', '2024-11-01 10:00:00+00', '2024-11-25 17:00:00+00', 'Creating holiday content'),
    ('c0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000004', 'in_progress', 'in_review', '2024-11-25 17:00:00+00', '2024-11-27 10:00:00+00', 'Content submitted'),
    ('c0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000004', 'in_review', 'completed', '2024-11-27 10:00:00+00', '2024-11-28 17:00:00+00', 'Content approved')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 7: FILES
-- ============================================================================

INSERT INTO files (id, project_id, task_id, uploaded_by, file_name, original_name, file_path, file_size, mime_type, file_extension, checksum)
VALUES
    -- Project-level files
    (
        'd0000001-0000-0000-0000-000000000001',
        'b0000001-0000-0000-0000-000000000001',
        NULL,
        'a0000001-0000-0000-0000-000000000002',
        'q1_campaign_brief_v1.pdf',
        'Q1 Campaign Brief.pdf',
        '/uploads/projects/b0000001-0000-0000-0000-000000000001/q1_campaign_brief_v1.pdf',
        2456789,
        'application/pdf',
        'pdf',
        'a1b2c3d4e5f6789012345678901234567890abcd'
    ),
    (
        'd0000001-0000-0000-0000-000000000002',
        'b0000001-0000-0000-0000-000000000001',
        NULL,
        'a0000001-0000-0000-0000-000000000002',
        'brand_guidelines_2025.pdf',
        'Brand Guidelines 2025.pdf',
        '/uploads/projects/b0000001-0000-0000-0000-000000000001/brand_guidelines_2025.pdf',
        8945672,
        'application/pdf',
        'pdf',
        'b2c3d4e5f67890123456789012345678901abcde'
    ),
    
    -- Task-level files
    (
        'd0000001-0000-0000-0000-000000000003',
        'b0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000002',
        'a0000001-0000-0000-0000-000000000004',
        'platform_analysis_report.xlsx',
        'Platform Analysis Report.xlsx',
        '/uploads/projects/b0000001-0000-0000-0000-000000000001/tasks/c0000001-0000-0000-0000-000000000002/platform_analysis_report.xlsx',
        1234567,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xlsx',
        'c3d4e5f678901234567890123456789012abcdef'
    ),
    (
        'd0000001-0000-0000-0000-000000000004',
        'b0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000003',
        'a0000001-0000-0000-0000-000000000004',
        'content_calendar_q1.xlsx',
        'Content Calendar Q1.xlsx',
        '/uploads/projects/b0000001-0000-0000-0000-000000000001/tasks/c0000001-0000-0000-0000-000000000003/content_calendar_q1.xlsx',
        567890,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xlsx',
        'd4e5f6789012345678901234567890123abcdefg'
    ),
    (
        'd0000001-0000-0000-0000-000000000005',
        'b0000001-0000-0000-0000-000000000002',
        'c0000001-0000-0000-0000-000000000010',
        'a0000001-0000-0000-0000-000000000007',
        'user_survey_draft.docx',
        'User Survey Draft.docx',
        '/uploads/projects/b0000001-0000-0000-0000-000000000002/tasks/c0000001-0000-0000-0000-000000000010/user_survey_draft.docx',
        345678,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'docx',
        'e5f67890123456789012345678901234abcdefgh'
    ),
    (
        'd0000001-0000-0000-0000-000000000006',
        'b0000001-0000-0000-0000-000000000003',
        'c0000001-0000-0000-0000-000000000013',
        'a0000001-0000-0000-0000-000000000009',
        'holiday_ad_final.mp4',
        'Holiday Ad Final.mp4',
        '/uploads/projects/b0000001-0000-0000-0000-000000000003/tasks/c0000001-0000-0000-0000-000000000013/holiday_ad_final.mp4',
        156789012,
        'video/mp4',
        'mp4',
        'f6789012345678901234567890123456abcdefghi'
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SECTION 8: COMMENTS
-- ============================================================================

INSERT INTO comments (id, task_id, user_id, parent_comment_id, content, mentions)
VALUES
    (
        'e0000001-0000-0000-0000-000000000001',
        'c0000001-0000-0000-0000-000000000001',
        'a0000001-0000-0000-0000-000000000002',
        NULL,
        'Great progress on the strategy! Make sure to include TikTok as a primary focus this quarter.',
        ARRAY['a0000001-0000-0000-0000-000000000004']::UUID[]
    ),
    (
        'e0000001-0000-0000-0000-000000000002',
        'c0000001-0000-0000-0000-000000000001',
        'a0000001-0000-0000-0000-000000000004',
        'e0000001-0000-0000-0000-000000000001',
        'Absolutely! I''ve added TikTok specific goals and content types in the updated draft.',
        '{}' 
    ),
    (
        'e0000001-0000-0000-0000-000000000003',
        'c0000001-0000-0000-0000-000000000009',
        'a0000001-0000-0000-0000-000000000003',
        NULL,
        'Please prioritize mobile user experience in the research. Our analytics show 65% mobile traffic.',
        ARRAY['a0000001-0000-0000-0000-000000000007']::UUID[]
    ),
    (
        'e0000001-0000-0000-0000-000000000004',
        'c0000001-0000-0000-0000-000000000010',
        'a0000001-0000-0000-0000-000000000007',
        NULL,
        'Survey is ready for review. Included questions about mobile navigation and checkout flow.',
        '{}' 
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SECTION 9: NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (id, user_id, type, title, message, is_read, reference_type, reference_id, action_url)
VALUES
    (
        'f0000001-0000-0000-0000-000000000001',
        'a0000001-0000-0000-0000-000000000004',
        'task_assigned',
        'New Task Assigned',
        'You have been assigned to "Develop Social Media Strategy" in Q1 Marketing Campaign.',
        TRUE,
        'task',
        'c0000001-0000-0000-0000-000000000001',
        '/projects/b0000001-0000-0000-0000-000000000001/tasks/c0000001-0000-0000-0000-000000000001'
    ),
    (
        'f0000001-0000-0000-0000-000000000002',
        'a0000001-0000-0000-0000-000000000004',
        'mention',
        'You were mentioned',
        'Sarah Johnson mentioned you in a comment on "Develop Social Media Strategy".',
        FALSE,
        'comment',
        'e0000001-0000-0000-0000-000000000001',
        '/projects/b0000001-0000-0000-0000-000000000001/tasks/c0000001-0000-0000-0000-000000000001#comments'
    ),
    (
        'f0000001-0000-0000-0000-000000000003',
        'a0000001-0000-0000-0000-000000000007',
        'task_assigned',
        'New Task Assigned',
        'You have been assigned to "Conduct UX Research" in Website Redesign 2025.',
        TRUE,
        'task',
        'c0000001-0000-0000-0000-000000000009',
        '/projects/b0000001-0000-0000-0000-000000000002/tasks/c0000001-0000-0000-0000-000000000009'
    ),
    (
        'f0000001-0000-0000-0000-000000000004',
        'a0000001-0000-0000-0000-000000000002',
        'task_completed',
        'Task Completed',
        'Emily Davis completed "Analyze Current Platform Performance".',
        FALSE,
        'task',
        'c0000001-0000-0000-0000-000000000002',
        '/projects/b0000001-0000-0000-0000-000000000001/tasks/c0000001-0000-0000-0000-000000000002'
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SECTION 10: AUDIT LOGS
-- ============================================================================

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address)
VALUES
    (
        'a0000001-0000-0000-0000-000000000001',
        'create',
        'user',
        'a0000001-0000-0000-0000-000000000002',
        NULL,
        '{"email": "sarah.johnson@company.com", "role": "manager"}',
        '192.168.1.100'
    ),
    (
        'a0000001-0000-0000-0000-000000000002',
        'create',
        'project',
        'b0000001-0000-0000-0000-000000000001',
        NULL,
        '{"name": "Q1 Marketing Campaign", "status": "planning"}',
        '192.168.1.101'
    ),
    (
        'a0000001-0000-0000-0000-000000000002',
        'status_change',
        'project',
        'b0000001-0000-0000-0000-000000000001',
        '{"status": "planning"}',
        '{"status": "active"}',
        '192.168.1.101'
    ),
    (
        'a0000001-0000-0000-0000-000000000002',
        'create',
        'task',
        'c0000001-0000-0000-0000-000000000001',
        NULL,
        '{"title": "Develop Social Media Strategy", "assigned_to": "emily.davis@company.com"}',
        '192.168.1.101'
    ),
    (
        'a0000001-0000-0000-0000-000000000004',
        'file_upload',
        'file',
        'd0000001-0000-0000-0000-000000000003',
        NULL,
        '{"file_name": "platform_analysis_report.xlsx", "task_id": "c0000001-0000-0000-0000-000000000002"}',
        '192.168.1.103'
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 11: PRODUCTIVITY METRICS
-- ============================================================================

INSERT INTO productivity_metrics (user_id, project_id, metric_date, total_tasks_completed, total_productive_minutes, total_tasks_assigned, average_task_completion_hours, on_time_completion_rate, revision_count)
VALUES
    -- Emily's productivity for Q1 Campaign
    ('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', '2025-01-02', 0, 120, 4, NULL, NULL, 0),
    ('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', '2025-01-03', 0, 300, 4, NULL, NULL, 0),
    ('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', '2025-01-04', 0, 240, 4, NULL, NULL, 1),
    ('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', '2025-01-05', 1, 180, 3, 7.50, 100.00, 0),
    ('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', '2025-01-06', 0, 240, 3, NULL, NULL, 0),
    ('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', '2025-01-07', 1, 180, 2, 3.50, 100.00, 0),
    
    -- William's productivity for Website Redesign
    ('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000002', '2025-02-01', 0, 300, 2, NULL, NULL, 0),
    ('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000002', '2025-02-02', 0, 420, 2, NULL, NULL, 0),
    ('a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000002', '2025-02-03', 0, 360, 2, NULL, NULL, 0),
    
    -- Emily's productivity for Holiday Campaign (completed)
    ('a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000003', '2024-11-28', 1, 300, 0, 32.00, 100.00, 0),
    
    -- Benjamin's productivity for Holiday Campaign
    ('a0000001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000003', '2024-12-08', 1, 480, 0, 48.00, 100.00, 0),
    
    -- Ethan's productivity for Holiday Campaign
    ('a0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000003', '2024-12-24', 2, 420, 0, 21.50, 100.00, 0)
ON CONFLICT (user_id, project_id, metric_date) DO NOTHING;

-- ============================================================================
-- SECTION 12: USER SESSIONS (Sample JWT Sessions)
-- ============================================================================

INSERT INTO user_sessions (id, user_id, token_hash, refresh_token_hash, device_info, ip_address, user_agent, is_valid, expires_at, refresh_expires_at)
VALUES
    (
        'g0000001-0000-0000-0000-000000000001',
        'a0000001-0000-0000-0000-000000000001',
        'token_hash_admin_session_1',
        'refresh_token_hash_admin_session_1',
        '{"os": "Windows 11", "browser": "Chrome 120", "device": "Desktop"}',
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        TRUE,
        NOW() + INTERVAL '24 hours',
        NOW() + INTERVAL '7 days'
    ),
    (
        'g0000001-0000-0000-0000-000000000002',
        'a0000001-0000-0000-0000-000000000002',
        'token_hash_sarah_session_1',
        'refresh_token_hash_sarah_session_1',
        '{"os": "macOS 14", "browser": "Safari 17", "device": "Desktop"}',
        '192.168.1.101',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
        TRUE,
        NOW() + INTERVAL '24 hours',
        NOW() + INTERVAL '7 days'
    ),
    (
        'g0000001-0000-0000-0000-000000000003',
        'a0000001-0000-0000-0000-000000000004',
        'token_hash_emily_mobile_session',
        'refresh_token_hash_emily_mobile_session',
        '{"os": "iOS 17", "browser": "Safari Mobile", "device": "iPhone 15"}',
        '192.168.1.150',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        TRUE,
        NOW() + INTERVAL '24 hours',
        NOW() + INTERVAL '7 days'
    )
ON CONFLICT (id) DO NOTHING;

-- Commit transaction
COMMIT;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
