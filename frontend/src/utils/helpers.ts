import { ProjectStatus } from '../types/project.types';
import { TaskStatus, TaskPriority } from '../types/task.types';

export const getProjectStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.PLANNING: return 'bg-blue-100 text-blue-700 border-blue-200';
        case ProjectStatus.ACTIVE: return 'bg-green-100 text-green-700 border-green-200';
        case ProjectStatus.ON_HOLD: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case ProjectStatus.COMPLETED: return 'bg-gray-100 text-gray-700 border-gray-200';
        case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

export const getTaskStatusColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.TODO: return 'bg-slate-100 text-slate-700 border-slate-200';
        case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
        case TaskStatus.REVIEW: return 'bg-purple-100 text-purple-700 border-purple-200';
        case TaskStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
        case TaskStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

export const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
        case TaskPriority.LOW: return 'bg-slate-50 text-slate-600 border-slate-100';
        case TaskPriority.MEDIUM: return 'bg-blue-50 text-blue-600 border-blue-100';
        case TaskPriority.HIGH: return 'bg-orange-50 text-orange-600 border-orange-100';
        case TaskPriority.URGENT: return 'bg-red-50 text-red-600 border-red-100';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
};

export const hasPermission = (user: any, permission: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    // This would normally check a list of permissions from user or project
    return true;
};
