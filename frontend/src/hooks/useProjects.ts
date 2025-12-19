import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects.api';
import { toast } from 'react-hot-toast';

export const useProjects = (params?: any) => {
    return useQuery({
        queryKey: ['projects', params],
        queryFn: () => projectsApi.getProjects(params),
    });
};

export const useProject = (id: string) => {
    return useQuery({
        queryKey: ['projects', id],
        queryFn: () => projectsApi.getProject(id),
        enabled: !!id,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project created successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create project');
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => projectsApi.updateProject(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
            toast.success('Project updated successfully');
        },
    });
};
