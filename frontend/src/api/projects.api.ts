import client from './client';
import { Project } from '../types/project.types';
import { PaginatedResponse, ApiResponse } from '../types/api.types';

export const projectsApi = {
    getProjects: (params?: any) =>
        client.get<any, PaginatedResponse<Project>>('/projects', { params }),

    getProject: (id: string) =>
        client.get<any, ApiResponse<Project>>(`/projects/${id}`),

    createProject: (data: any) =>
        client.post<any, ApiResponse<Project>>('/projects', data),

    updateProject: (id: string, data: any) =>
        client.put<any, ApiResponse<Project>>(`/projects/${id}`, data),

    deleteProject: (id: string) =>
        client.delete(`/projects/${id}`),

    getProjectStats: (id: string) =>
        client.get<any, ApiResponse<any>>(`/projects/${id}/stats`),
};
