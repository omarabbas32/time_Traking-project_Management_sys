import { useState } from 'react';
import {
    Plus,
    LayoutGrid,
    List as ListIcon,
    Calendar as CalendarIcon,
    Download
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TaskFilters from '../../components/tasks/TaskFilters';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import TaskCard from '../../components/tasks/TaskCard';
import { TaskStatus, TaskPriority, TaskType } from '../../types/task.types';
import type { Task } from '../../types/task.types';
import { useNavigate } from 'react-router-dom';

const TasksListPage = () => {
    const [view, setView] = useState<'list' | 'kanban' | 'calendar'>('kanban');
    const [filters, setFilters] = useState<any>({});
    const navigate = useNavigate();

    const mockTasks: Task[] = [
        {
            id: '1',
            taskNumber: 'TSK-1234',
            title: 'Implement Auth Interceptors',
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.HIGH,
            type: TaskType.TASK,
            projectId: 'p1',
            projectName: 'Website v2',
            totalProductiveMinutes: 120,
            createdBy: 'u1',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            subtaskCount: 5,
            completedSubtaskCount: 2,
            attachmentsCount: 3,
            commentCount: 8,
            isFlagged: false,
            dueDate: '2024-02-01',
            assignedUserName: 'Jane Doe'
        },
        {
            id: '2',
            taskNumber: 'TSK-1235',
            title: 'Design System Documentation',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            type: TaskType.TASK,
            projectId: 'p1',
            projectName: 'Website v2',
            totalProductiveMinutes: 0,
            createdBy: 'u1',
            createdAt: '2024-01-02',
            updatedAt: '2024-01-02',
            subtaskCount: 0,
            completedSubtaskCount: 0,
            attachmentsCount: 0,
            commentCount: 2,
            isFlagged: true,
            dueDate: '2024-02-05',
            assignedUserName: 'Mike Ross'
        },
        {
            id: '3',
            taskNumber: 'TSK-1236',
            title: 'Fix API Connection Leak',
            status: TaskStatus.REVIEW,
            priority: TaskPriority.URGENT,
            type: TaskType.TASK,
            projectId: 'p2',
            projectName: 'Mobile App',
            totalProductiveMinutes: 450,
            createdBy: 'u2',
            createdAt: '2024-01-03',
            updatedAt: '2024-01-03',
            subtaskCount: 1,
            completedSubtaskCount: 1,
            attachmentsCount: 1,
            commentCount: 5,
            isFlagged: false,
            dueDate: '2024-01-20',
            assignedUserName: 'John Doe'
        },
        {
            id: '4',
            taskNumber: 'TSK-1237',
            title: 'Data Migration to R2',
            status: TaskStatus.APPROVED,
            priority: TaskPriority.HIGH,
            type: TaskType.TASK,
            projectId: 'p3',
            projectName: 'Internal Tools',
            totalProductiveMinutes: 800,
            createdBy: 'u1',
            createdAt: '2023-12-15',
            updatedAt: '2023-12-28',
            subtaskCount: 0,
            completedSubtaskCount: 0,
            attachmentsCount: 12,
            commentCount: 15,
            isFlagged: false,
            dueDate: '2023-12-25',
            assignedUserName: 'Jane Doe'
        },
        {
            id: '5',
            taskNumber: 'TSK-1238',
            title: 'User Testing Session #4',
            status: TaskStatus.REVISIONS,
            priority: TaskPriority.LOW,
            type: TaskType.TASK,
            projectId: 'p1',
            projectName: 'Website v2',
            totalProductiveMinutes: 1200,
            createdBy: 'u3',
            createdAt: '2024-01-10',
            updatedAt: '2024-01-15',
            subtaskCount: 0,
            completedSubtaskCount: 0,
            attachmentsCount: 2,
            commentCount: 1,
            isFlagged: false,
            dueDate: '2024-01-15',
            assignedUserName: 'Mike Ross'
        },
    ];

    const handleTaskClick = (id: string) => {
        navigate(`/tasks/${id}`);
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in pr-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Task Management</h1>
                    <p className="text-slate-500 mt-1 font-bold text-sm tracking-wide">Manage, track, and optimize your team's productivity workflows.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="secondary" size="md">
                        <Download size={18} className="mr-2" />
                        Export
                    </Button>
                    <Button size="md" className="shadow-lg shadow-primary-500/20" onClick={() => navigate('/tasks/new')}>
                        <Plus size={18} className="mr-2" />
                        Create Task
                    </Button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex-1">
                    <TaskFilters
                        activeFilters={filters}
                        onFilterChange={setFilters}
                        projects={[{ id: 'p1', name: 'Website v2' }, { id: 'p2', name: 'Mobile App' }]}
                    />
                </div>

                <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto">
                    {[
                        { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
                        { id: 'list', label: 'List View', icon: ListIcon },
                        { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as any)}
                            className={item.id === view
                                ? "flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white text-primary-600 shadow-md shadow-primary-500/5 border border-slate-100"
                                : "flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-slate-400 hover:text-slate-600"
                            }
                        >
                            <item.icon size={16} />
                            <span className="hidden sm:inline">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {view === 'kanban' ? (
                    <KanbanBoard tasks={mockTasks} onTaskClick={handleTaskClick} />
                ) : view === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xxl:grid-cols-3 gap-6">
                        {mockTasks.map(task => (
                            <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                        ))}
                    </div>
                ) : (
                    <Card className="h-full flex items-center justify-center border-none shadow-xl shadow-slate-200/50">
                        <div className="text-center">
                            <CalendarIcon size={64} className="mx-auto text-slate-200 mb-6" />
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Calendar View</h3>
                            <p className="text-slate-500 font-bold mt-2">Coming soon in the next update.</p>
                            <Button variant="secondary" className="mt-8" onClick={() => setView('kanban')}>Switch back to Kanban</Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TasksListPage;
