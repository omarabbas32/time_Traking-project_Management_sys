import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../../components/tasks/TaskForm';
import { useCreateTask } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { usersApi } from '../../api/users.api';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';

const CreateTaskPage = () => {
    const navigate = useNavigate();
    const createTask = useCreateTask();
    const { data: projectsResponse } = useProjects();
    const { data: usersResponse } = useQuery({ queryKey: ['users'], queryFn: () => usersApi.getUsers() });

    const projects = projectsResponse?.data || [];
    const users = usersResponse?.data || [];

    const handleBack = () => navigate('/tasks');

    const handleSubmit = async (data: any, createAnother: boolean) => {
        try {
            await createTask.mutateAsync(data);
            if (!createAnother) {
                navigate('/tasks');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleBack}
                    className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">New Task</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Add a new work item to your workspace.</p>
                </div>
            </div>

            <TaskForm
                projects={projects}
                users={users}
                onSubmit={handleSubmit}
                isLoading={createTask.isPending}
                onCancel={handleBack}
            />
        </div>
    );
};

export default CreateTaskPage;
