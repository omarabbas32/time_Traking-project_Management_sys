export enum ProjectStatus {
    PLANNING = 'planning',
    ACTIVE = 'active',
    ON_HOLD = 'on_hold',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export interface Project {
    id: string;
    code: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate: string;
    endDate?: string;
    budget?: number;
    managerId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    memberCount: number;
}
