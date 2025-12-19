import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    CheckSquare,
    FileText,
    Users,
    Settings,
    ShieldCheck,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user.types';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: Briefcase },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Reports', path: '/reports', icon: FileText, roles: [UserRole.ADMIN, UserRole.MANAGER] },
        { name: 'Users', path: '/users', icon: Users, roles: [UserRole.ADMIN] },
        { name: 'Audit Logs', path: '/audit', icon: ShieldCheck, roles: [UserRole.ADMIN] },
    ];

    const filteredItems = navItems.filter(item =>
        !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <aside className={clsx(
            "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
                {!isCollapsed && (
                    <span className="text-xl font-bold text-primary-600 truncate">
                        {import.meta.env.VITE_APP_NAME || 'EMS'}
                    </span>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center px-4 py-3 rounded-xl transition-all duration-200",
                            isActive
                                ? "bg-primary-50 text-primary-700 font-medium shadow-sm"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon size={20} className={clsx(isCollapsed ? "mr-0" : "mr-3")} />
                        {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <NavLink
                    to="/settings"
                    className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
                >
                    <Settings size={20} className={clsx(isCollapsed ? "mr-0" : "mr-3")} />
                    {!isCollapsed && <span>Settings</span>}
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
