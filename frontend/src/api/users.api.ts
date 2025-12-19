import client from './client';
import type { User } from '../types/user.types';
import type { ApiResponse, PaginatedResponse } from '../types/api.types';

export const usersApi = {
    getUsers: (params?: any) =>
        client.get<any, PaginatedResponse<User>>('/users', { params }),

    getUser: (id: string) =>
        client.get<any, ApiResponse<User>>(`/users/${id}`),

    updateUser: (id: string, data: any) =>
        client.put<any, ApiResponse<User>>(`/users/${id}`, data),

    deleteUser: (id: string) =>
        client.delete(`/users/${id}`),

    updateRole: (id: string, role: string) =>
        client.patch<any, ApiResponse<User>>(`/users/${id}/role`, { role }),
};
