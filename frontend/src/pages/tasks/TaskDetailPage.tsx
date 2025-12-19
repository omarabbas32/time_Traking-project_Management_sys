import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask, useSubTasks, useTaskComments, useTaskActivity } from '../../hooks/useTasks';
import TaskDetail from '../../components/tasks/TaskDetail';
import { Loader2 } from 'lucide-react';
import { TaskStatus, TaskPriority, TaskType, Task } from '../../types/task.types';

const TaskDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Real hooks would fetch data here
    // For demo, we use the hooks but they will return skeletons if API is not ready
    const { data: taskResponse, isLoading } = useTask(id!);
    const { data: subtasksResponse } = useSubTasks(id!);
    const { data: commentsResponse } = useTaskComments(id!);
    const { data: activityResponse } = useTaskActivity(id!);

    // Mock data for immediate preview if API is not fully seeded
    const mockTask: Task = {
        id: id || '1',
        taskNumber: 'TSK-1234',
        title: 'Implement Auth Interceptors and JWT Refresh Logic',
        description: 'We need to implement a robust security layer on the frontend. This includes axios interceptors for adding the Bearer token to every request and handling 401 Unauthorized responses by attempting a token refresh using the stored refresh token. If refresh fails, redirect to login.\n\nKey requirements:\n- Axios interceptors\n- Token refresh logic\n- Unauthorized redirection\n- Persistent storage management',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        type: TaskType.TASK,
        projectId: 'p1',
        projectName: 'Website Redesign v2',
        totalProductiveMinutes: 245,
        estimatedHours: 8,
        createdBy: 'u1',
        createdUserName: 'Sarah Wilson',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-12T15:30:00Z',
        subtaskCount: 3,
        completedSubtaskCount: 1,
        attachmentsCount: 2,
        commentCount: 4,
        isFlagged: false,
        dueDate: '2024-02-15',
        assignedUserName: 'Jane Doe',
        tags: ['Security', 'Backend-Integration', 'Critical']
    };

    const mockSubtasks: Task[] = [
        { id: 's1', taskNumber: 'TSK-1234.1', title: 'Setup Axios Request Interceptor', status: TaskStatus.COMPLETED, priority: TaskPriority.MEDIUM, type: TaskType.SUB_TASK, projectId: 'p1', totalProductiveMinutes: 60, createdBy: 'u1', createdAt: '2024-01-10', updatedAt: '2024-01-10', subtaskCount: 0, completedSubtaskCount: 0, attachmentsCount: 0, commentCount: 0, isFlagged: false, dueDate: '2023-12-30' },
        { id: 's2', taskNumber: 'TSK-1234.2', title: 'Implement Token Refresh Flow', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, type: TaskType.SUB_TASK, projectId: 'p1', totalProductiveMinutes: 180, createdBy: 'u1', createdAt: '2024-01-10', updatedAt: '2024-01-10', subtaskCount: 0, completedSubtaskCount: 0, attachmentsCount: 0, commentCount: 0, isFlagged: false, dueDate: '2024-01-10' },
    ];

    const mockActivity = [
        { userName: 'Sarah Wilson', action: 'moved task to In Progress', timestamp: '2024-01-12T15:30:00Z' },
        { userName: 'System', action: 'auto-scaled priority to HIGH', timestamp: '2024-01-11T09:00:00Z' },
        { userName: 'Jane Doe', action: 'added 2 sub-tasks', timestamp: '2024-01-10T11:20:00Z' },
    ];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 size={48} className="text-primary-500 animate-spin" />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading task data...</p>
                </div>
            </div>
        );
    }

    // Use real data if available, otherwise mock for preview
    const task = taskResponse?.data || mockTask;
    const subtasks = subtasksResponse?.data || mockSubtasks;
    const activity = activityResponse?.data || mockActivity;

    return (
        <TaskDetail
            task={task}
            onBack={() => navigate('/tasks')}
            onEdit={() => navigate(`/tasks/${id}/edit`)}
            onDelete={() => {
                if (window.confirm('Are you sure?')) {
                    navigate('/tasks');
                }
            }}
            subtasks={subtasks}
            comments={commentsResponse?.data || []}
            activity={activity}
        />
    );
};

export default TaskDetailPage;
