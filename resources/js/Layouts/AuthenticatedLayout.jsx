import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    Search, 
    Bell, 
    Calendar, 
    Settings, 
    ChevronDown, 
    ChevronRight, 
    Plus, 
    ShieldCheck, 
    X, 
    ChevronLeft, 
    Star, 
    Share2, 
    MoreHorizontal,
    LogOut,
    User as UserIcon,
    Layers
} from 'lucide-react';
import Avatar from '@/Components/Avatar';
import CreateProjectModal from '@/Pages/Projects/Components/CreateProjectModal';

export default function AuthenticatedLayout({ children, currentProjectId = null, allProjects = [] }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    
    const [isMyPagesOpen, setIsMyPagesOpen] = useState(true);
    const [showSecurityCard, setShowSecurityCard] = useState(true);
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    // Fallback projects if none passed directly
    const projectsList = allProjects.length > 0 ? allProjects : [
        { id: 1, name: 'Craftboard Project', code: 'CP', color: '#4f46e5', icon: 'C' },
        { id: 2, name: 'Visionary Tasks', code: 'VT', color: '#0f172a', icon: 'V' },
        { id: 3, name: 'Demotion Project', code: 'DP', color: '#ea580c', icon: 'D' },
        { id: 4, name: 'Angular Studio', code: 'AS', color: '#2563eb', icon: 'A', tasks_count: 10 },
        { id: 5, name: 'Cudemo Project', code: 'CD', color: '#7c3aed', icon: 'C' },
    ];

    const currentProject = projectsList.find(p => p.id === currentProjectId) || projectsList[0];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-[#eef1f6] p-2 sm:p-4 lg:p-6 flex items-center justify-center font-sans antialiased text-slate-800">
            {/* Outer Container with macOS Styled Card */}
            <div className="w-full max-w-[1550px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden flex flex-col min-h-[92vh]">
                
                <div className="flex flex-1 overflow-hidden">
                    {/* LEFT SIDEBAR */}
                    <aside className="w-64 border-r border-slate-100 bg-white flex flex-col justify-between shrink-0 select-none">
                        <div className="p-5 flex-1 overflow-y-auto">
                            
                            {/* Window Traffic Lights & Collapse */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] inline-block"></span>
                                    <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] inline-block"></span>
                                    <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] inline-block"></span>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 transition p-1">
                                    <span className="text-xs font-mono">«</span>
                                </button>
                            </div>

                            {/* Workspace Header */}
                            <div className="relative mb-6">
                                <div 
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center justify-between p-2 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition"
                                >
                                    <div className="flex items-center space-x-3 truncate">
                                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                                            <Layers className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div className="truncate text-left">
                                            <h4 className="text-sm font-bold text-slate-900 leading-tight">Manageko.</h4>
                                            <p className="text-xs text-slate-400 truncate">{user?.email || 'manage@mail.com'}</p>
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                </div>

                                {/* User Dropdown */}
                                {userDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-3 py-2 border-b border-slate-100">
                                            <div className="font-semibold text-xs text-slate-900">{user?.name}</div>
                                            <div className="text-[11px] text-indigo-600 font-medium">
                                                Role: {user?.roles?.[0] || 'Member'}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition mt-1"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* MAIN MENU */}
                            <div className="mb-6">
                                <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-2 px-2">
                                    Main Menu
                                </p>
                                <nav className="space-y-1">
                                    <Link 
                                        href={route('dashboard')}
                                        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition"
                                    >
                                        <Search className="w-4 h-4 text-slate-400" />
                                        <span>Search</span>
                                    </Link>
                                    <div className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <Bell className="w-4 h-4 text-slate-400" />
                                            <span>Notification</span>
                                        </div>
                                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">
                                            99+
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition cursor-pointer">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>Calendar</span>
                                    </div>
                                    <div className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition cursor-pointer">
                                        <Settings className="w-4 h-4 text-slate-400" />
                                        <span>Settings</span>
                                    </div>
                                </nav>
                            </div>

                            {/* MY PAGES */}
                            <div>
                                <div 
                                    onClick={() => setIsMyPagesOpen(!isMyPagesOpen)}
                                    className="flex items-center justify-between px-2 mb-2 cursor-pointer text-slate-400 hover:text-slate-600"
                                >
                                    <p className="text-[11px] font-semibold tracking-wider uppercase">
                                        My Pages
                                    </p>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMyPagesOpen ? '' : '-rotate-90'}`} />
                                </div>

                                {isMyPagesOpen && (
                                    <div className="space-y-1">
                                        {projectsList.map((project) => {
                                            const isActive = project.id === currentProjectId;
                                            return (
                                                <Link
                                                    key={project.id}
                                                    href={route('projects.show', project.id)}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                                                        isActive 
                                                            ? 'bg-slate-50 text-slate-900 font-semibold' 
                                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-2.5 truncate">
                                                        <div 
                                                            className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-2xs"
                                                            style={{ backgroundColor: project.color || '#4f46e5' }}
                                                        >
                                                            {project.code?.slice(0, 1) || project.name.slice(0, 1)}
                                                        </div>
                                                        <span className="truncate">{project.name}</span>
                                                    </div>
                                                    {project.tasks_count > 0 && (
                                                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full">
                                                            {project.tasks_count}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}

                                        {/* Create New Project Button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateProjectModal(true)}
                                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 text-xs font-medium transition mt-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Create New</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BOTTOM SECURITY CARD (from screenshot) */}
                        {showSecurityCard && (
                            <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-indigo-50/70 to-blue-50/40 border border-indigo-100/70 relative">
                                <button
                                    onClick={() => setShowSecurityCard(false)}
                                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-0.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-xs shadow-indigo-300">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h5 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                                    Add an extra security to your account.
                                </h5>
                                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                                    Add a secondary method of verification used during login.
                                </p>
                                <button className="w-full py-1.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs mb-1">
                                    Enable 2-step verification
                                </button>
                                <button className="w-full py-1 text-center text-[11px] text-slate-500 hover:text-slate-700 font-medium">
                                    Learn more
                                </button>
                            </div>
                        )}
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col bg-[#fafafc] overflow-y-auto">
                        
                        {/* Top Breadcrumb Navigation Bar */}
                        <header className="h-14 border-b border-slate-100 bg-white/70 backdrop-blur-xs px-6 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 text-slate-400">
                                    <button className="p-1 hover:text-slate-600 transition"><ChevronLeft className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-slate-600 transition"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                                <div className="text-xs text-slate-400 flex items-center space-x-1.5 font-medium">
                                    <span>My Pages</span>
                                    <span>/</span>
                                    <span className="text-slate-800 font-semibold">{currentProject?.name || 'Project'}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 text-slate-400">
                                <button className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition">
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>New Tab</span>
                                </button>
                                <button className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                                    <Star className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </header>

                        {/* Flash notifications */}
                        {flash?.success && (
                            <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
                                <span>{flash.success}</span>
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
                                <span>{flash.error}</span>
                            </div>
                        )}

                        {/* View Content */}
                        <div className="flex-1 p-6 overflow-x-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Create Project Modal */}
            <CreateProjectModal
                show={showCreateProjectModal}
                onClose={() => setShowCreateProjectModal(false)}
            />
        </div>
    );
}
