import client from './client';
import { AuthResponse } from '../types/user.types';
import { ApiResponse } from '../types/api.types';

export const authApi = {
    login: (data: any) => client.post<any, ApiResponse<AuthResponse>>('/auth/login', data),
    register: (data: any) => client.post<any, ApiResponse<AuthResponse>>('/auth/register', data),
    logout: () => client.post('/auth/logout'),
    getProfile: () => client.get<any, ApiResponse<any>>('/auth/profile'),
    getSessions: () => client.get<any, ApiResponse<any[]>>('/auth/sessions'),
    revokeSession: (id: string) => client.delete(`/auth/sessions/${id}`),
};
