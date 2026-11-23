import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Avatar from '@/Components/Avatar';
import { 
    Layers, 
    CheckCircle2, 
    Clock, 
    ArrowUpRight, 
    Activity, 
    FolderKanban,
    Sparkles
} from 'lucide-react';

export default function Dashboard({ 
    allProjects = [], 
    firstProjectId = null, 
    metrics = {}, 
    myTasks = [], 
    recentActivities = [] 
}) {
    return (
        <AuthenticatedLayout currentProjectId={firstProjectId} allProjects={allProjects}>
            <Head title="Dashboard Overview" />

            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Workspace Active</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Corporate Task Management System</h1>
                        <p className="text-xs text-slate-300 max-w-xl">
                            Real-time Kanban boards, strict role-based access control, and comprehensive audit logs.
                        </p>
                    </div>

                    {firstProjectId && (
                        <Link
                            href={route('projects.show', firstProjectId)}
                            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition shadow-xs"
                        >
                            <span>Open Craftboard Project</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Total Projects</span>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <FolderKanban className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{metrics.totalProjects || 5}</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Total Tasks</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Layers className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{metrics.totalTasks || 20}</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">In Progress</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{metrics.inProgressTasks || 10}</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Completed</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{metrics.completedTasks || 20}</div>
                    </div>
                </div>

                {/* Split Row: My Tasks & Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Projects */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
                        <h3 className="text-sm font-bold text-slate-900 mb-4">Workspace Projects</h3>
                        <div className="space-y-3">
                            {allProjects.map((p) => (
                                <Link
                                    key={p.id}
                                    href={route('projects.show', p.id)}
                                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div 
                                            className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center"
                                            style={{ backgroundColor: p.color || '#4f46e5' }}
                                        >
                                            {p.code?.slice(0, 1) || p.name.slice(0, 1)}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800">{p.name}</div>
                                            <div className="text-[11px] text-slate-400">{p.tasks_count || 0} active tasks</div>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
                        <div className="flex items-center space-x-2 mb-4">
                            <Activity className="w-4 h-4 text-indigo-600" />
                            <h3 className="text-sm font-bold text-slate-900">Recent Workspace Activity</h3>
                        </div>
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                            {recentActivities.length > 0 ? (
                                recentActivities.map((act) => (
                                    <div key={act.id} className="flex items-start space-x-3 text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100/60">
                                        <Avatar name={act.user?.name} initials={act.user?.initials} size="xs" className="mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-slate-800 font-medium">{act.description}</p>
                                            <span className="text-[10px] text-slate-400">{new Date(act.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic text-center py-4">No recent activity recorded.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
