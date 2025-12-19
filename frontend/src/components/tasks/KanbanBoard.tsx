import React, { useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from '../../types/task.types';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';
import Button from '../common/Button';
import { useUpdateTaskStatus } from '../../hooks/useTasks';

interface KanbanColumnProps {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    onTaskClick?: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, onTaskClick }) => {
    const { setNodeRef } = useSortable({
        id,
        data: {
            type: 'Column',
            columnId: id,
        },
    });

    return (
        <div className="flex flex-col w-80 min-w-[320px] bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden h-full">
            <div className="p-4 flex items-center justify-between bg-white border-b border-slate-100">
                <div className="flex items-center space-x-3">
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">{title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black border border-slate-200">
                        {tasks.length}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                        <Plus size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar"
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </SortableContext>

                <button className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-primary-300 hover:text-primary-500 hover:bg-white transition-all flex items-center justify-center group">
                    <Plus size={14} className="mr-2 group-hover:scale-110 transition-transform" />
                    Add Task
                </button>
            </div>
        </div>
    );
};

const SortableTaskCard = ({ task, onClick }: { task: Task; onClick?: (id: string) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} onClick={onClick} />
        </div>
    );
};

interface KanbanBoardProps {
    tasks: Task[];
    onTaskClick?: (id: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskClick }) => {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const updateStatus = useUpdateTaskStatus();

    const columns: { id: TaskStatus; title: string }[] = [
        { id: TaskStatus.TODO, title: 'To Do' },
        { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
        { id: TaskStatus.REVIEW, title: 'Review' },
        { id: TaskStatus.REVISIONS, title: 'Revisions' },
        { id: TaskStatus.APPROVED, title: 'Approved' },
    ];

    const tasksMap = useMemo(() => {
        const map = new Map<TaskStatus, Task[]>();
        columns.forEach(col => map.set(col.id, []));
        tasks.forEach(task => {
            const colTasks = map.get(task.status) || [];
            colTasks.push(task);
            map.set(task.status, colTasks);
        });
        return map;
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as TaskStatus;

        const activeTask = tasks.find(t => t.id === activeId);
        if (activeTask && activeTask.status !== overId) {
            updateStatus.mutate({ id: activeId, status: overId });
        }

        setActiveTask(null);
    };

    return (
        <div className="h-full w-full overflow-x-auto pb-4 custom-scrollbar">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 h-full min-h-[600px]">
                    {columns.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            tasks={tasksMap.get(column.id) || []}
                            onTaskClick={onTaskClick}
                        />
                    ))}
                </div>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activeTask ? (
                        <div className="rotate-2 scale-105 shadow-2xl">
                            <TaskCard task={activeTask} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
