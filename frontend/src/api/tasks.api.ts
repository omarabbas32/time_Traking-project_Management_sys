import client from './client';
import type { Task, TaskComment, TimeLog, TaskActivity } from '../types/task.types';
import type { PaginatedResponse, ApiResponse } from '../types/api.types';

export const tasksApi = {
    getTasks: (params?: any) =>
        client.get<any, PaginatedResponse<Task>>('/tasks', { params }),

    getTask: (id: string) =>
        client.get<any, ApiResponse<Task>>(`/tasks/${id}`),

    createTask: (data: any) =>
        client.post<any, ApiResponse<Task>>('/tasks', data),

    updateTask: (id: string, data: any) =>
        client.put<any, ApiResponse<Task>>(`/tasks/${id}`, data),

    deleteTask: (id: string) =>
        client.delete(`/tasks/${id}`),

    updateStatus: (id: string, status: string) =>
        client.patch<any, ApiResponse<Task>>(`/tasks/${id}/status`, { status }),

    assignTask: (id: string, userId: string) =>
        client.post<any, ApiResponse<Task>>(`/tasks/${id}/assign`, { userId }),

    // Sub-tasks
    getSubTasks: (taskId: string) =>
        client.get<any, ApiResponse<Task[]>>(`/tasks/${taskId}/subtasks`),

    // Comments
    getComments: (taskId: string) =>
        client.get<any, ApiResponse<TaskComment[]>>(`/tasks/${taskId}/comments`),

    addComment: (taskId: string, content: string, mentions?: string[]) =>
        client.post<any, ApiResponse<TaskComment>>(`/tasks/${taskId}/comments`, { content, mentions }),

    // Time Tracking
    startTimeLog: (taskId: string) =>
        client.post<any, ApiResponse<TimeLog>>(`/tasks/${taskId}/timer/start`),

    stopTimeLog: (taskId: string, description?: string) =>
        client.post<any, ApiResponse<TimeLog>>(`/tasks/${taskId}/timer/stop`, { description }),

    getTimeLogs: (taskId: string) =>
        client.get<any, ApiResponse<TimeLog[]>>(`/tasks/${taskId}/timer/logs`),

    // Activity
    getActivity: (taskId: string) =>
        client.get<any, ApiResponse<TaskActivity[]>>(`/tasks/${taskId}/activity`),
};
