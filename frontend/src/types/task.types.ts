export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    REVIEW = 'review',
    REVISIONS = 'revisions',
    APPROVED = 'approved',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

export enum TaskType {
    TASK = 'task',
    SUB_TASK = 'sub_task',
}

export interface Task {
    id: string;
    taskNumber: string;
    projectId: string;
    projectName?: string;
    parentTaskId?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    type: TaskType;
    dueDate?: string;
    assignedTo?: string;
    assignedUserName?: string;
    assignedUserAvatar?: string;
    estimatedHours?: number;
    totalProductiveMinutes: number;
    createdBy: string;
    createdUserName?: string;
    createdAt: string;
    updatedAt: string;
    subtaskCount: number;
    completedSubtaskCount: number;
    attachmentsCount: number;
    commentCount: number;
    isFlagged: boolean;
    tags?: string[];
}

export interface SubTask extends Task {
    // Inherits all task properties
}

export interface TaskComment {
    id: string;
    taskId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    replies?: TaskComment[];
    mentions?: string[];
}

export interface TimeLog {
    id: string;
    taskId: string;
    userId: string;
    startTime: string;
    endTime?: string;
    durationMinutes: number;
    activityType?: string;
    description?: string;
    createdAt: string;
}

export interface TaskActivity {
    id: string;
    taskId: string;
    userId: string;
    userName: string;
    action: string;
    entityType: string;
    oldValue?: any;
    newValue?: any;
    timestamp: string;
}

export interface TaskFilters {
    status?: TaskStatus[];
    priority?: TaskPriority[];
    type?: TaskType[];
    projectId?: string;
    assignedTo?: string;
    search?: string;
    isFlagged?: boolean;
    myTasksOnly?: boolean;
    dateRange?: {
        start?: string;
        end?: string;
    };
}
