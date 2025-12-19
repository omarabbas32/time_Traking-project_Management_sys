export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    timestamp: string;
}

export interface ApiError {
    statusCode: number;
    message: string;
    errors?: string[];
    timestamp: string;
    path: string;
    requestId?: string;
}
