import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { clsx } from 'clsx';

const Topbar = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects, tasks, or files..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm shadow-inner focus:shadow-none"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors group">
                    <Bell size={20} className="group-hover:text-primary-600 transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative h-10 border-l border-slate-200"></div>

                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center space-x-3 p-1 rounded-xl hover:bg-slate-50 transition-all group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200 group-hover:border-primary-300 shadow-sm">
                            {user?.firstName[0]}{user?.lastName[0]}
                        </div>
                        <div className="hidden md:block text-left pr-2">
                            <p className="text-sm font-semibold text-slate-800 leading-none">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 capitalize leading-none">
                                {user?.role}
                            </p>
                        </div>
                    </button>

                    {showProfileMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-20"
                                onClick={() => setShowProfileMenu(false)}
                            ></div>
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-30 animate-fade-in origin-top-right">
                                <div className="px-4 py-3 border-b border-slate-100 mb-2">
                                    <p className="text-sm font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                                <button className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                                    <UserIcon size={16} className="mr-3" />
                                    My Profile
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} className="mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
