import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KanbanBoard from './Components/KanbanBoard';
import ListView from './Components/ListView';
import TaskDetailModal from './Components/TaskDetailModal';
import CreateTaskModal from './Components/CreateTaskModal';
import Avatar from '@/Components/Avatar';
import { 
    Kanban, 
    Table as TableIcon, 
    List, 
    CalendarDays, 
    Search, 
    Filter, 
    Plus, 
    UserPlus,
    X
} from 'lucide-react';

export default function Show({ 
    project, 
    tasks = [], 
    allProjects = [], 
    teamMembers = [], 
    filters = {}, 
    permissions = {} 
}) {
    const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'list' | 'table' | 'timeline'
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedPriority, setSelectedPriority] = useState(filters.priority || '');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    
    // Modals
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [quickAddStatus, setQuickAddStatus] = useState('To-do');

    // Filter tasks locally or via search input
    const filteredTasks = tasks.filter((t) => {
        const matchesSearch = searchQuery 
            ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
        
        const matchesPriority = selectedPriority ? t.priority === selectedPriority : true;

        return matchesSearch && matchesPriority;
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('projects.show', project.id), {
            search: searchQuery,
            priority: selectedPriority,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (task, newStatus) => {
        router.patch(route('tasks.updateStatus', task.id), {
            status: newStatus,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (selectedTask && selectedTask.id === task.id) {
                    setSelectedTask(prev => ({ ...prev, status: newStatus }));
                }
            }
        });
    };

    const handleOpenDetail = (task) => {
        setSelectedTask(task);
        setShowDetailModal(true);
    };

    const handleQuickAdd = (status) => {
        setQuickAddStatus(status);
        setShowCreateTaskModal(true);
    };

    return (
        <AuthenticatedLayout currentProjectId={project.id} allProjects={allProjects}>
            <Head title={project.name} />

            <div className="space-y-6">
                
                {/* PROJECT HEADER (Matching screenshot) */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                        <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-sm"
                            style={{ backgroundColor: project.color || '#4f46e5' }}
                        >
                            {project.code?.slice(0, 1) || project.name.slice(0, 1)}
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                {project.name}
                            </h1>
                        </div>
                    </div>

                    {/* Team Avatars & Invite button */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center -space-x-2">
                            <Avatar name="Alex Lee" initials="AL" size="md" className="ring-2 ring-white" />
                            <Avatar name="David Taylor" initials="DT" size="md" className="ring-2 ring-white" />
                            <Avatar name="Sarah Connor" initials="SC" size="md" className="ring-2 ring-white" />
                        </div>

                        <button 
                            type="button"
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
                        >
                            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                            <span>Invite</span>
                        </button>
                    </div>
                </div>

                {/* VIEW TABS & TOOLBAR */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    
                    {/* View Tabs */}
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('kanban')}
                            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                activeTab === 'kanban'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                            }`}
                        >
                            <Kanban className="w-3.5 h-3.5" />
                            <span>Kanban</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('table')}
                            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                activeTab === 'table'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                            }`}
                        >
                            <TableIcon className="w-3.5 h-3.5" />
                            <span>Table</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('list')}
                            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                activeTab === 'list'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                            }`}
                        >
                            <List className="w-3.5 h-3.5" />
                            <span>List</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('timeline')}
                            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                activeTab === 'timeline'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                            }`}
                        >
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>Timeline</span>
                        </button>
                    </div>

                    {/* Right Tools: Search, Filter, + New Task */}
                    <div className="flex items-center space-x-2.5">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-3 py-1.5 w-44 sm:w-56 text-xs bg-white border border-slate-200/90 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 shadow-2xs placeholder:text-slate-400 text-slate-700"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </form>

                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shadow-2xs ${
                                    selectedPriority 
                                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700' 
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Filter {selectedPriority && `(${selectedPriority})`}</span>
                            </button>

                            {showFilterDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95">
                                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                                        Filter by Priority
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedPriority(''); setShowFilterDropdown(false); }}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${selectedPriority === '' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        All Priorities
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedPriority('High'); setShowFilterDropdown(false); }}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${selectedPriority === 'High' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        High Priority
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedPriority('Medium'); setShowFilterDropdown(false); }}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${selectedPriority === 'Medium' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        Medium Priority
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedPriority('Low'); setShowFilterDropdown(false); }}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${selectedPriority === 'Low' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        Low Priority
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* + New Task Button (Strictly styled like screenshot) */}
                        <button
                            type="button"
                            onClick={() => {
                                setQuickAddStatus('To-do');
                                setShowCreateTaskModal(true);
                            }}
                            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>New Task</span>
                        </button>
                    </div>
                </div>

                {/* MAIN VIEW CONTENT */}
                <div>
                    {activeTab === 'kanban' && (
                        <KanbanBoard
                            tasks={filteredTasks}
                            onOpenDetail={handleOpenDetail}
                            onQuickAdd={handleQuickAdd}
                            onStatusChange={handleStatusChange}
                        />
                    )}

                    {(activeTab === 'list' || activeTab === 'table') && (
                        <ListView
                            tasks={filteredTasks}
                            onOpenDetail={handleOpenDetail}
                            onStatusChange={handleStatusChange}
                        />
                    )}

                    {activeTab === 'timeline' && (
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-xs">
                            <CalendarDays className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-slate-800">Timeline & Milestone View</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                All tasks organized along sprint intervals and expected delivery deadlines.
                            </p>
                            <div className="mt-6 max-w-lg mx-auto space-y-2 text-left">
                                {filteredTasks.slice(0, 4).map((t, idx) => (
                                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center space-x-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                            <span className="text-xs font-semibold text-slate-800">{t.title}</span>
                                        </div>
                                        <span className="text-[11px] text-slate-500 font-medium">Sprint Week {idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Task Detail Modal */}
            <TaskDetailModal
                task={selectedTask}
                show={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedTask(null);
                }}
                teamMembers={teamMembers}
                onStatusChange={handleStatusChange}
            />

            {/* Create Task Modal */}
            <CreateTaskModal
                show={showCreateTaskModal}
                onClose={() => setShowCreateTaskModal(false)}
                projectId={project.id}
                teamMembers={teamMembers}
                defaultStatus={quickAddStatus}
            />
        </AuthenticatedLayout>
    );
}
