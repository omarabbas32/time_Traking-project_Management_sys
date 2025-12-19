import client from './client';
import type { ApiResponse } from '../types/api.types';

export const reportsApi = {
    getUserProductivity: (userId: string, params: any) =>
        client.get<any, ApiResponse<any>>(`/reports/productivity/user/${userId}`, { params }),

    getTeamProductivity: (params: any) =>
        client.get<any, ApiResponse<any[]>>('/reports/productivity/team', { params }),

    getTasksOverview: (params: any) =>
        client.get<any, ApiResponse<any>>('/reports/tasks/overview', { params }),

    getDashboardMetrics: () =>
        client.get<any, ApiResponse<any>>('/dashboard/metrics'),

    exportReport: (data: any) =>
        client.post('/reports/export', data, { responseType: 'blob' }),
};
