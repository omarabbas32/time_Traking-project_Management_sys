import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Briefcase,
    Layers,
    Type,
    AlertTriangle,
    User,
    Clock,
    Calendar,
    Save
} from 'lucide-react';
import { clsx } from 'clsx';
import { TaskType, TaskPriority } from '../../types/task.types';
import type { Task } from '../../types/task.types';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const taskSchema = z.object({
    projectId: z.string().min(1, 'Project is required'),
    parentTaskId: z.string().optional(),
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().optional(),
    type: z.nativeEnum(TaskType),
    priority: z.nativeEnum(TaskPriority),
    assignedTo: z.string().optional(),
    estimatedHours: z.number().min(0).optional(),
    dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
    initialData?: Partial<Task>;
    projects: any[];
    tasks?: any[];
    users: any[];
    onSubmit: (data: TaskFormValues, createAnother: boolean) => void;
    isLoading?: boolean;
    onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
    initialData,
    projects,
    tasks = [],
    users,
    onSubmit,
    isLoading,
    onCancel
}) => {
    const [createAnother, setCreateAnother] = React.useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            type: TaskType.TASK,
            priority: TaskPriority.MEDIUM,
            ...initialData,
        },
    });

    const selectedProjectId = watch('projectId');

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data, createAnother))} className="space-y-8 animate-fade-in">
            <Card title={initialData?.id ? "Edit Task" : "Create New Task"} subtitle="Fill in the details below to manage your work items.">
                <div className="space-y-6">
                    {/* Project & Parent Task */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Briefcase size={14} className="mr-2" />
                                Project *
                            </label>
                            <select
                                {...register('projectId')}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold transition-all appearance-none"
                            >
                                <option value="">Select Project</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            {errors.projectId && <p className="text-xs font-bold text-red-500">{errors.projectId.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Layers size={14} className="mr-2" />
                                Parent Task
                            </label>
                            <select
                                {...register('parentTaskId')}
                                disabled={!selectedProjectId}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                            >
                                <option value="">No Parent (Root Task)</option>
                                {tasks.filter(t => t.projectId === selectedProjectId).map(t => (
                                    <option key={t.id} value={t.id}>{t.taskNumber} - {t.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Title */}
                    <Input
                        label="Task Title *"
                        placeholder="e.g. Implement User Authentication"
                        error={errors.title?.message}
                        {...register('title')}
                    />

                    {/* Description - Simplified TextArea for now */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            placeholder="Provide a detailed description of the task..."
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm transition-all shadow-sm"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Type */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Type size={14} className="mr-2" />
                                Type
                            </label>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {Object.values(TaskType).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setValue('type', type)}
                                        className={clsx(
                                            "flex-1 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all",
                                            watch('type') === type ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {type.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <AlertTriangle size={14} className="mr-2" />
                                Priority
                            </label>
                            <select
                                {...register('priority')}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold transition-all"
                            >
                                {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                            </select>
                        </div>

                        {/* Assignee */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <User size={14} className="mr-2" />
                                Assignee
                            </label>
                            <select
                                {...register('assignedTo')}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold transition-all"
                            >
                                <option value="">Unassigned</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Est Hours */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Clock size={14} className="mr-2" />
                                Estimated Hours
                            </label>
                            <input
                                type="number"
                                {...register('estimatedHours', { valueAsNumber: true })}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold transition-all shadow-sm"
                            />
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Calendar size={14} className="mr-2" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                {...register('dueDate')}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={createAnother}
                        onChange={(e) => setCreateAnother(e.target.checked)}
                        className="w-5 h-5 border-2 border-slate-200 rounded-md text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors uppercase tracking-tight">Create another task</span>
                </label>

                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={onCancel}
                        className="flex-1 md:flex-none uppercase tracking-widest text-[10px] font-black"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="flex-1 md:min-w-[160px] shadow-lg shadow-primary-500/20 uppercase tracking-widest text-[10px] font-black"
                    >
                        <Save size={16} className="mr-2" />
                        {initialData?.id ? "Update Task" : "Create Task"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default TaskForm;
