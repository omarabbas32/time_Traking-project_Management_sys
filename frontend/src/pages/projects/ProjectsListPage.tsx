import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { type Project, ProjectStatus } from '../../types/project.types';
import { getProjectStatusColor } from '../../utils/helpers';
import { formatDate } from '../../utils/formatters';

const ProjectsListPage = () => {
    const [isLoading] = useState(false);

    const mockProjects: Project[] = [
        { id: '1', code: 'PRJ-001', name: 'Website Redesign', status: ProjectStatus.ACTIVE, startDate: '2024-01-10', memberCount: 5, managerId: 'u1', createdBy: 'u1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', code: 'PRJ-002', name: 'Mobile App Development', status: ProjectStatus.PLANNING, startDate: '2024-02-15', memberCount: 8, managerId: 'u2', createdBy: 'u1', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
        { id: '3', code: 'PRJ-003', name: 'Internal Audit v2', status: ProjectStatus.ON_HOLD, startDate: '2023-11-20', memberCount: 3, managerId: 'u1', createdBy: 'u1', createdAt: '2023-11-01', updatedAt: '2023-11-01' },
        { id: '4', code: 'PRJ-004', name: 'HR System Integration', status: ProjectStatus.COMPLETED, startDate: '2023-09-01', memberCount: 4, managerId: 'u3', createdBy: 'u1', createdAt: '2023-08-15', updatedAt: '2023-10-30' },
    ];

    const columns = [
        {
            header: 'Code',
            accessor: (p: Project) => <span className="font-bold text-slate-900">{p.code}</span>
        },
        {
            header: 'Project Name',
            accessor: (p: Project) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{p.name}</span>
                    <span className="text-xs text-slate-500 font-medium">Updated {formatDate(p.updatedAt)}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (p: Project) => (
                <span className={clsx(
                    "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border",
                    getProjectStatusColor(p.status)
                )}>
                    {p.status.replace('_', ' ')}
                </span>
            )
        },
        {
            header: 'Start Date',
            accessor: (p: Project) => <span className="text-slate-600 font-medium">{formatDate(p.startDate)}</span>
        },
        {
            header: 'Members',
            accessor: (p: Project) => (
                <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(p.memberCount, 4) }).map((_, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                    {p.memberCount > 4 && (
                        <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                            +{p.memberCount - 4}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: '',
            accessor: () => (
                <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                    <MoreVertical size={18} />
                </button>
            ),
            className: "w-10"
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage and track your team's workspace projects.</p>
                </div>
                <Button size="md" className="shadow-lg shadow-primary-500/20">
                    <Plus size={18} className="mr-2" />
                    Create Project
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm transition-all shadow-sm"
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Button variant="secondary" size="md" className="flex-1 md:flex-none">
                        <Filter size={18} className="mr-2" />
                        Filter
                    </Button>
                    <Button variant="secondary" size="md" className="flex-1 md:flex-none">
                        Export
                    </Button>
                </div>
            </div>

            <Card noPadding className="border-none shadow-xl shadow-slate-200/50">
                <Table
                    columns={columns}
                    data={mockProjects}
                    isLoading={isLoading}
                    onRowClick={(p) => console.log('Project clicked:', p.id)}
                />
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing 4 of 12 projects</span>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" disabled>Previous</Button>
                        <Button variant="ghost" size="sm">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default ProjectsListPage;
