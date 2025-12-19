import React from 'react';
import { clsx } from 'clsx';
import { TaskStatus } from '../../types/task.types';

interface TaskStatusBadgeProps {
    status: TaskStatus;
    className?: string;
    size?: 'sm' | 'md';
}

const statusConfig: Record<TaskStatus, { label: string; classes: string }> = {
    [TaskStatus.TODO]: {
        label: 'To Do',
        classes: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    [TaskStatus.IN_PROGRESS]: {
        label: 'In Progress',
        classes: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    [TaskStatus.REVIEW]: {
        label: 'In Review',
        classes: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    [TaskStatus.REVISIONS]: {
        label: 'Revisions',
        classes: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    [TaskStatus.APPROVED]: {
        label: 'Approved',
        classes: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    [TaskStatus.COMPLETED]: {
        label: 'Completed',
        classes: 'bg-green-100 text-green-700 border-green-200',
    },
    [TaskStatus.CANCELLED]: {
        label: 'Cancelled',
        classes: 'bg-red-100 text-red-700 border-red-200',
    },
};

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
    status,
    className,
    size = 'sm'
}) => {
    const config = statusConfig[status] || statusConfig[TaskStatus.TODO];

    return (
        <span className={clsx(
            "inline-flex items-center font-bold uppercase tracking-wider border rounded-full",
            size === 'sm' ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
            config.classes,
            className
        )}>
            {config.label}
        </span>
    );
};

export default TaskStatusBadge;
