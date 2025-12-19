import client from './client';
import type { ApiResponse, PaginatedResponse } from '../types/api.types';

export const filesApi = {
    getUploadUrl: (data: { fileName: string; fileSize: number; contentType: string; category: string; projectId?: string; taskId?: string }) =>
        client.post<any, ApiResponse<any>>('/files/upload-url', data),

    confirmUpload: (fileId: string) =>
        client.post<any, ApiResponse<any>>(`/files/confirm/${fileId}`),

    getDownloadUrl: (fileId: string) =>
        client.get<any, ApiResponse<{ url: string }>>(`/files/download/${fileId}`),

    getProjectFiles: (projectId: string, params?: any) =>
        client.get<any, PaginatedResponse<any>>(`/projects/${projectId}/files`, { params }),

    deleteFile: (fileId: string) =>
        client.delete(`/files/${fileId}`),
};
