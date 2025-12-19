import React from 'react';
import { clsx } from 'clsx';
import { TaskPriority } from '../../types/task.types';
import { ChevronUp, ChevronDown, ChevronsUp, Minus } from 'lucide-react';

interface PriorityIndicatorProps {
    priority: TaskPriority;
    showLabel?: boolean;
    className?: string;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: any }> = {
    [TaskPriority.LOW]: {
        label: 'Low',
        color: 'text-slate-500 bg-slate-50 border-slate-100',
        icon: ChevronDown,
    },
    [TaskPriority.MEDIUM]: {
        label: 'Medium',
        color: 'text-blue-600 bg-blue-50 border-blue-100',
        icon: Minus,
    },
    [TaskPriority.HIGH]: {
        label: 'High',
        color: 'text-orange-600 bg-orange-50 border-orange-100',
        icon: ChevronUp,
    },
    [TaskPriority.URGENT]: {
        label: 'Urgent',
        color: 'text-red-700 bg-red-50 border-red-100',
        icon: ChevronsUp,
    },
};

const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
    priority,
    showLabel = true,
    className
}) => {
    const config = priorityConfig[priority];
    const Icon = config.icon;

    return (
        <div className={clsx(
            "inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-tight",
            config.color,
            className
        )}>
            <Icon size={14} strokeWidth={3} />
            {showLabel && <span>{config.label}</span>}
        </div>
    );
};

export default PriorityIndicator;
