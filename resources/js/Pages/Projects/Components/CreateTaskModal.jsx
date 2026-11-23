import React from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function CreateTaskModal({ 
    show = false, 
    onClose, 
    projectId, 
    teamMembers = [], 
    defaultStatus = 'To-do' 
}) {
    const { data, setData, post, processing, reset, errors } = useForm({
        project_id: projectId,
        title: '',
        description: '',
        category: 'Dashboard',
        priority: 'Medium',
        status: defaultStatus,
        assigned_to: teamMembers[0]?.id || '',
        due_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} title="Create New Task" maxWidth="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Task Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Employee Details or Darkmode version"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    />
                    {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Category
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                        >
                            <option value="Dashboard">Dashboard</option>
                            <option value="Mobile app">Mobile app</option>
                            <option value="Website">Website</option>
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="Design">Design</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Priority
                        </label>
                        <select
                            value={data.priority}
                            onChange={(e) => setData('priority', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>

                {/* Status & Assignee */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                        >
                            <option value="To-do">To-do</option>
                            <option value="On Progress">On Progress</option>
                            <option value="In Review">In Review</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Assignee
                        </label>
                        <select
                            value={data.assigned_to}
                            onChange={(e) => setData('assigned_to', e.target.value)}
                            className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                        >
                            <option value="">Unassigned</option>
                            {teamMembers.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.role_title || 'Member'})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Brief summary of requirements..."
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    />
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={data.due_date}
                        onChange={(e) => setData('due_date', e.target.value)}
                        className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs disabled:opacity-50"
                    >
                        {processing ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
