import React, { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Plus,
    MoreVertical,
    CheckCircle2,
    Circle
} from 'lucide-react';
import type { Task } from '../../types/task.types';
import { TaskStatus } from '../../types/task.types';
import { clsx } from 'clsx';
import TaskStatusBadge from './TaskStatusBadge';
import { useUpdateTaskStatus } from '../../hooks/useTasks';

interface SubTaskItemProps {
    task: Task;
    depth: number;
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({ task, depth }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const updateStatus = useUpdateTaskStatus();

    const handleToggleStatus = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
        updateStatus.mutate({ id: task.id, status: newStatus });
    };

    return (
        <div className="flex flex-col">
            <div
                className={clsx(
                    "flex items-center group py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer",
                    task.status === TaskStatus.COMPLETED && "opacity-60"
                )}
                style={{ marginLeft: `${depth * 20}px` }}
            >
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={clsx(
                        "p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors mr-1",
                        task.subtaskCount === 0 && "invisible"
                    )}
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                <button
                    onClick={handleToggleStatus}
                    className={clsx(
                        "p-1 rounded-lg transition-colors mr-3",
                        task.status === TaskStatus.COMPLETED ? "text-green-500" : "text-slate-300 hover:text-slate-500"
                    )}
                >
                    {task.status === TaskStatus.COMPLETED ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>

                <div className="flex-1 min-w-0 flex items-center space-x-3">
                    <span className={clsx(
                        "text-sm font-bold text-slate-800 truncate uppercase tracking-tight",
                        task.status === TaskStatus.COMPLETED && "line-through text-slate-400"
                    )}>
                        {task.title}
                    </span>
                    <TaskStatusBadge status={task.status} size="sm" />
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                        <Plus size={16} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            {isExpanded && task.subtaskCount > 0 && (
                <div className="mt-1">
                    {/* Note: In a real app we would fetch children here using the task id */}
                    {/* For now we just show a placeholder to indicate structure */}
                </div>
            )}
        </div>
    );
};

interface SubTaskTreeProps {
    tasks: Task[];
}

const SubTaskTree: React.FC<SubTaskTreeProps> = ({ tasks }) => {
    return (
        <div className="space-y-1">
            {tasks.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No sub-tasks found</p>
                    <button className="mt-2 text-primary-600 text-xs font-black uppercase hover:underline">Add first sub-task</button>
                </div>
            ) : (
                tasks.map(task => (
                    <SubTaskItem key={task.id} task={task} depth={0} />
                ))
            )}
        </div>
    );
};

export default SubTaskTree;
