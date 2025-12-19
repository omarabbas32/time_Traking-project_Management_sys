import {
    Briefcase,
    CheckSquare,
    Clock,
    AlertTriangle,
    ArrowUpRight,
    Plus
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const data = [
    { name: 'Mon', tasks: 12, hours: 6.5 },
    { name: 'Tue', tasks: 19, hours: 8.2 },
    { name: 'Wed', tasks: 15, hours: 7.8 },
    { name: 'Thu', tasks: 22, hours: 9.1 },
    { name: 'Fri', tasks: 18, hours: 7.2 },
    { name: 'Sat', tasks: 5, hours: 2.1 },
    { name: 'Sun', tasks: 2, hours: 1.5 },
];

const DashboardPage = () => {
    const stats = [
        { title: 'Active Projects', value: '12', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50', trend: '+2 this month' },
        { title: 'My Open Tasks', value: '28', icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50', trend: '5 due today' },
        { title: 'Billable Hours', value: '164.5', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+12.5% vs last month' },
        { title: 'Overdue Tasks', value: '4', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', trend: '-2 vs last week' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="secondary" size="md">Download Report</Button>
                    <Button size="md" className="shadow-lg shadow-primary-500/20">
                        <Plus size={18} className="mr-2" />
                        New Project
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="group hover:border-primary-200 transition-all">
                        <div className="flex items-start justify-between">
                            <div className={stat.bg + " p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300"}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                                Real-time
                            </span>
                        </div>
                        <div className="mt-5">
                            <h3 className="text-sm font-semibold text-slate-500">{stat.title}</h3>
                            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
                            <div className="flex items-center mt-3 text-xs font-bold text-green-600">
                                <ArrowUpRight size={14} className="mr-1" />
                                {stat.trend}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card title="Productivity Overview" subtitle="Task completion and productive hours trend" className="lg:col-span-2">
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '600' }}
                                />
                                <Area type="monotone" dataKey="tasks" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Upcoming Deadlines" subtitle="Next 7 days" className="flex flex-col">
                    <div className="space-y-5 mt-4">
                        {[
                            { title: 'Homepage Redesign', project: 'Website v2', date: 'Today, 5:00 PM', priority: 'High' },
                            { title: 'API Integration', project: 'Mobile App', date: 'Tomorrow', priority: 'Urgent' },
                            { title: 'User Testing', project: 'Website v2', date: 'Oct 24, 2024', priority: 'Medium' },
                            { title: 'Database Migration', project: 'Internal Tools', date: 'Oct 26, 2024', priority: 'Low' },
                        ].map((task, i) => (
                            <div key={i} className="flex items-start space-x-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className={clsx(
                                    "w-1.5 h-10 rounded-full",
                                    task.priority === 'Urgent' ? 'bg-red-500' : task.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                                )}></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-primary-600 transition-colors uppercase tracking-tight">{task.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">{task.project}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{task.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-6 text-primary-600 font-bold hover:bg-primary-50">View all tasks</Button>
                </Card>
            </div>
        </div>
    );
};

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default DashboardPage;
