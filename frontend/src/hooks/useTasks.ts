import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { toast } from 'react-hot-toast';
import type { TaskFilters } from '../types/task.types';

export const useTasks = (filters?: TaskFilters) => {
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: () => tasksApi.getTasks(filters),
    });
};

export const useTask = (id: string) => {
    return useQuery({
        queryKey: ['tasks', id],
        queryFn: () => tasksApi.getTask(id),
        enabled: !!id,
    });
};

export const useSubTasks = (taskId: string) => {
    return useQuery({
        queryKey: ['tasks', taskId, 'subtasks'],
        queryFn: () => tasksApi.getSubTasks(taskId),
        enabled: !!taskId,
    });
};

export const useTaskComments = (taskId: string) => {
    return useQuery({
        queryKey: ['tasks', taskId, 'comments'],
        queryFn: () => tasksApi.getComments(taskId),
        enabled: !!taskId,
    });
};

export const useTaskActivity = (taskId: string) => {
    return useQuery({
        queryKey: ['tasks', taskId, 'activity'],
        queryFn: () => tasksApi.getActivity(taskId),
        enabled: !!taskId,
    });
};

// Mutations
export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            tasksApi.updateStatus(id, status),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
            toast.success(`Status updated to ${variables.status.replace('_', ' ')}`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update status');
        }
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tasksApi.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task created successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create task');
        }
    });
};

export const useAddComment = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: string) => tasksApi.addComment(taskId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] });
            toast.success('Comment added');
        },
    });
};

// Timer Mutations
export const useTimer = (taskId: string) => {
    const queryClient = useQueryClient();

    const startTimer = useMutation({
        mutationFn: () => tasksApi.startTimeLog(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
            queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'logs'] });
            toast.success('Timer started');
        }
    });

    const stopTimer = useMutation({
        mutationFn: (description?: string) => tasksApi.stopTimeLog(taskId, description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
            queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'logs'] });
            toast.success('Timer stopped and time logged');
        }
    });

    return { startTimer, stopTimer };
};
