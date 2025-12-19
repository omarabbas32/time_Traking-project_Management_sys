import React from 'react';
import {
    Search,
    Filter,
    X,
    Check,
    ChevronDown,
    User,
    Briefcase,
    AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { TaskStatus, TaskPriority, TaskType } from '../../types/task.types';
import Button from '../common/Button';

interface TaskFiltersProps {
    onFilterChange: (filters: any) => void;
    activeFilters: any;
    projects?: any[];
    users?: any[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
    onFilterChange,
    activeFilters,
    projects = [],
    users = []
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleFilter = (key: string, value: any) => {
        const current = activeFilters[key] || [];
        const updated = current.includes(value)
            ? current.filter((v: any) => v !== value)
            : [...current, value];
        onFilterChange({ ...activeFilters, [key]: updated });
    };

    const clearFilters = () => {
        onFilterChange({});
    };

    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by task number, title, or tags..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm transition-all shadow-sm"
                        onChange={(e) => onFilterChange({ ...activeFilters, search: e.target.value })}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant={isOpen ? 'primary' : 'secondary'}
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative"
                    >
                        <Filter size={18} className="mr-2" />
                        Filters
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                !
                            </span>
                        )}
                    </Button>

                    <Button variant="secondary" onClick={() => onFilterChange({ ...activeFilters, myTasksOnly: !activeFilters.myTasksOnly })}>
                        <User size={18} className={clsx("mr-2", activeFilters.myTasksOnly && "text-primary-600")} />
                        My Tasks
                    </Button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors px-2"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl animate-fade-in space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Status Filter */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(TaskStatus).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => toggleFilter('status', status)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                                            activeFilters.status?.includes(status)
                                                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority Filter */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(TaskPriority).map((priority) => (
                                    <button
                                        key={priority}
                                        onClick={() => toggleFilter('priority', priority)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                                            activeFilters.priority?.includes(priority)
                                                ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/20"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        {priority}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Project Filter */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-700 focus:bg-white transition-all appearance-none"
                                    onChange={(e) => onFilterChange({ ...activeFilters, projectId: e.target.value })}
                                    value={activeFilters.projectId || ''}
                                >
                                    <option value="">All Projects</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center space-x-4">
                            <label className="relative flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={activeFilters.isFlagged || false}
                                    onChange={(e) => onFilterChange({ ...activeFilters, isFlagged: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                <span className="ml-3 text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">Flagged Only</span>
                            </label>
                        </div>
                        <Button size="sm" onClick={() => setIsOpen(false)}>Apply Filters</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskFilters;
