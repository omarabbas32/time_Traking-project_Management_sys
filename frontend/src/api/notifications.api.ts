import client from './client';
import type { ApiResponse, PaginatedResponse } from '../types/api.types';

export const notificationsApi = {
    getNotifications: (params?: any) =>
        client.get<any, PaginatedResponse<any>>('/notifications', { params }),

    markAsRead: (id: string) =>
        client.patch<any, ApiResponse<any>>(`/notifications/${id}/read`),

    markAllAsRead: () =>
        client.patch<any, ApiResponse<any>>('/notifications/read-all'),

    getPreferences: () =>
        client.get<any, ApiResponse<any>>('/notifications/preferences'),

    updatePreferences: (data: any) =>
        client.put<any, ApiResponse<any>>('/notifications/preferences', data),
};
