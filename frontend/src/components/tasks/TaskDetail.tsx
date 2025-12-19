import React, { useState } from 'react';
import {
    ArrowLeft,
    Edit2,
    Trash2,
    MoreVertical,
    Share2,
    Link as LinkIcon,
    MessageSquare,
    Layers,
    Paperclip,
    Activity,
    Plus
} from 'lucide-react';
import type { Task } from '../../types/task.types';
import { TaskStatus } from '../../types/task.types';
import TaskStatusBadge from './TaskStatusBadge';
import PriorityIndicator from './PriorityIndicator';
import TaskTimer from './TaskTimer';
import SubTaskTree from './SubTaskTree';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatDate } from '../../utils/formatters';
import { clsx } from 'clsx';

interface TaskDetailProps {
    task: Task;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
    subtasks: Task[];
    comments: any[];
    activity: any[];
}

const TaskDetail: React.FC<TaskDetailProps> = ({
    task,
    onBack,
    onEdit,
    onDelete,
    subtasks,
    comments,
    activity
}) => {
    const [activeTab, setActiveTab] = useState('details');

    const tabs = [
        { id: 'details', label: 'Overview', icon: LinkIcon },
        { id: 'subtasks', label: 'Sub-tasks', icon: Layers, count: subtasks.length },
        { id: 'comments', label: 'Comments', icon: MessageSquare, count: comments.length },
        { id: 'activity', label: 'Activity Log', icon: Activity },
        { id: 'files', label: 'Attachments', icon: Paperclip, count: task.attachmentsCount },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Top Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-slate-500 hover:text-primary-600 transition-colors group"
                >
                    <div className="p-2 rounded-xl group-hover:bg-primary-50 transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest">Back to Tasks</span>
                </button>

                <div className="flex items-center space-x-3">
                    <Button variant="secondary" size="md" onClick={onEdit}>
                        <Edit2 size={16} className="mr-2" />
                        Edit
                    </Button>
                    <Button variant="danger" size="md" onClick={onDelete}>
                        <Trash2 size={16} className="mr-2" />
                        Delete
                    </Button>
                    <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Priority, Title, Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-black text-primary-500 uppercase tracking-[0.2em]">{task.taskNumber}</span>
                            <PriorityIndicator priority={task.priority} />
                            <TaskStatusBadge status={task.status} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                            {task.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-slate-500 font-medium text-sm">
                            <span className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-slate-200 mr-2 border border-white" />
                                Created by <strong className="text-slate-900 ml-1">{task.createdUserName || 'System'}</strong>
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{formatDate(task.createdAt, 'MMM d, yyyy')}</span>
                        </div>
                    </div>

                    <div className="sticky top-4 z-10">
                        <TaskTimer
                            taskId={task.id}
                            isAssignedToMe={true}
                            status={task.status}
                            initialProductiveMinutes={task.totalProductiveMinutes}
                        />
                    </div>

                    <Card title="Detailed Description" className="border-none shadow-xl shadow-slate-200/50">
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                            {task.description || "No description provided for this task."}
                        </div>
                        {task.tags && task.tags.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-2">
                                {task.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Card>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto custom-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        "flex items-center space-x-2 px-6 py-4 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "text-primary-600"
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    <tab.icon size={16} />
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span className={clsx(
                                            "ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black",
                                            activeTab === tab.id ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-400"
                                        )}>
                                            {tab.count}
                                        </span>
                                    )}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full shadow-[0_-2px_8px_rgba(14,165,233,0.4)]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[300px] transition-all">
                            {activeTab === 'subtasks' && (
                                <Card noPadding title="Sub-Tasks Hierarchy">
                                    <div className="p-4">
                                        <SubTaskTree tasks={subtasks} />
                                        <Button variant="ghost" className="w-full mt-4 justify-start text-[10px] font-black uppercase tracking-widest">
                                            <Plus size={16} className="mr-2" />
                                            Create new sub-task
                                        </Button>
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'details' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card title="Project Context" subtitle="Workspace association">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{task.projectName || 'Default Project'}</span>
                                            <Share2 size={16} className="text-slate-400" />
                                        </div>
                                    </Card>
                                    <Card title="Deadline" subtitle="Time sensitivity">
                                        <span className="text-sm font-black text-slate-800 uppercase tracking-widest">
                                            {task.dueDate ? formatDate(task.dueDate) : 'No Deadline'}
                                        </span>
                                    </Card>
                                </div>
                            )}

                            {activeTab === 'comments' && (
                                <Card title="Discussion" className="divide-y divide-slate-100">
                                    <div className="py-12 text-center">
                                        <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No comments yet</p>
                                    </div>
                                    <div className="pt-6">
                                        <textarea
                                            placeholder="Write a comment..."
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-primary-500 transition-all text-sm font-medium"
                                        />
                                        <div className="mt-3 flex justify-end">
                                            <Button size="sm">Post Comment</Button>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'activity' && (
                                <Card title="Chronological Activity">
                                    <div className="space-y-6">
                                        {activity.map((item, i) => (
                                            <div key={i} className="flex items-start space-x-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                                    <Activity size={12} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800"><span className="text-primary-600 uppercase tracking-tight">{item.userName}</span> {item.action}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{formatDate(item.timestamp, 'MMM d, HH:mm A')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta Info & Assignees */}
                <div className="space-y-8">
                    <Card title="Assigned To" subtitle="Responsible member">
                        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-500/20">
                                {task.assignedUserName?.substring(0, 2).toUpperCase() || 'JD'}
                            </div>
                            <div>
                                <span className="block text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                                    {task.assignedUserName || 'John Doe'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Team Member</span>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-white">Reassign Task</Button>
                    </Card>

                    <Card title="Time Statistics" subtitle="Productivity overview">
                        <div className="space-y-6">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Estimated vs Actual</span>
                                <div className="flex items-end space-x-2">
                                    <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">{Math.floor(task.totalProductiveMinutes / 60)}h {task.totalProductiveMinutes % 60}m</span>
                                    <span className="text-xs font-bold text-slate-400 pb-1 mb-0.5">/ {task.estimatedHours || 0}h est.</span>
                                </div>
                            </div>

                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.3)] transition-all duration-500"
                                    style={{ width: `${Math.min((task.totalProductiveMinutes / 60) / (task.estimatedHours || 1) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
