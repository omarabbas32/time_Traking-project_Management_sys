import React from 'react';
import { clsx } from 'clsx';
import {
    Clock,
    MessageSquare,
    Paperclip,
    Layers,
    Flag,
    MoreVertical,
    Calendar
} from 'lucide-react';
import { Task } from '../../types/task.types';
import TaskStatusBadge from './TaskStatusBadge';
import PriorityIndicator from './PriorityIndicator';
import { formatDate } from '../../utils/formatters';
import Card from '../common/Card';

interface TaskCardProps {
    task: Task;
    onClick?: (id: string) => void;
    className?: string;
    isDraggable?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onClick,
    className,
    isDraggable = false
}) => {
    const progress = task.subtaskCount > 0
        ? Math.round((task.completedSubtaskCount / task.subtaskCount) * 100)
        : 0;

    return (
        <Card
            onClick={() => onClick?.(task.id)}
            className={clsx(
                "group relative hover:border-primary-300 transition-all cursor-pointer select-none",
                task.isFlagged && "border-red-200 bg-red-50/10",
                className
            )}
            noPadding
        >
            <div className="p-4 space-y-3">
                {/* Header: Task ID & Flags */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{task.taskNumber}</span>
                        {task.isFlagged && <Flag size={12} className="text-red-500 fill-red-500" />}
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                    </button>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-primary-600 transition-colors uppercase tracking-tight line-clamp-2">
                    {task.title}
                </h3>

                {/* Status & Priority */}
                <div className="flex flex-wrap gap-2">
                    <TaskStatusBadge status={task.status} />
                    <PriorityIndicator priority={task.priority} />
                </div>

                {/* Progress Bar (if subtasks exist) */}
                {task.subtaskCount > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 tracking-wider">
                            <span>PROGRESS</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Footer info: Metadata & User */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-slate-400">
                            <MessageSquare size={13} />
                            <span className="text-[10px] font-bold">{task.commentCount}</span>
                        </div>
                        {task.subtaskCount > 0 && (
                            <div className="flex items-center space-x-1 text-slate-400">
                                <Layers size={13} />
                                <span className="text-[10px] font-bold">{task.completedSubtaskCount}/{task.subtaskCount}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-1 text-slate-400">
                            <Clock size={13} />
                            <span className="text-[10px] font-bold">
                                {Math.floor(task.totalProductiveMinutes / 60)}h
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {task.dueDate && (
                            <div className="mr-3 flex items-center space-x-1 text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                <Calendar size={11} />
                                <span className="text-[9px] font-black uppercase">{formatDate(task.dueDate, 'MMM d')}</span>
                            </div>
                        )}
                        <div className="w-6 h-6 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-[9px] font-black text-primary-700 shadow-sm overflow-hidden">
                            {task.assignedUserAvatar ? (
                                <img src={task.assignedUserAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span>{task.assignedUserName?.substring(0, 2).toUpperCase() || '??'}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TaskCard;
