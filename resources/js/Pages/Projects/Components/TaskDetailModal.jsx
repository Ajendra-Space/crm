import React, { useState, useEffect } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import { 
    Clock, 
    Send, 
    User as UserIcon, 
    Calendar, 
    Trash2, 
    Tag, 
    CheckCircle2, 
    Paperclip, 
    MessageSquare,
    Activity as ActivityIcon
} from 'lucide-react';
import Modal from '@/Components/Modal';
import Avatar from '@/Components/Avatar';

export default function TaskDetailModal({ 
    task, 
    show = false, 
    onClose, 
    teamMembers = [], 
    onStatusChange 
}) {
    if (!task) return null;

    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'activities'
    const [fullTask, setFullTask] = useState(task);
    const [isLoading, setIsLoading] = useState(false);

    // Form for posting comments using Inertia
    const { data, setData, post, processing, reset, errors } = useForm({
        comment: '',
    });

    // Fetch full details with activities & comments
    useEffect(() => {
        if (show && task?.id) {
            setIsLoading(true);
            window.axios?.get(route('tasks.show', task.id))
                .then(res => {
                    setFullTask(res.data.task);
                })
                .catch(err => {
                    console.error("Could not fetch task detail:", err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [show, task?.id]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!data.comment.trim()) return;

        post(route('tasks.comments.store', task.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('comment');
                // Refresh local data
                window.axios?.get(route('tasks.show', task.id)).then(res => setFullTask(res.data.task));
            },
        });
    };

    const handleAssigneeChange = (userId) => {
        router.put(route('tasks.update', task.id), {
            assigned_to: userId || null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                window.axios?.get(route('tasks.show', task.id)).then(res => setFullTask(res.data.task));
            }
        });
    };

    const handleDeleteTask = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', task.id), {
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="3xl">
            <div className="space-y-6">
                {/* Header: Category, Priority, and Status dropdown */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {fullTask.category || 'Dashboard'}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                            {fullTask.priority} Priority
                        </span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <label className="text-xs text-slate-400 font-medium">Status:</label>
                        <select
                            value={fullTask.status}
                            onChange={(e) => onStatusChange(fullTask, e.target.value)}
                            className="text-xs font-bold py-1.5 px-3 rounded-xl border-slate-200 bg-white text-slate-800 shadow-2xs focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="To-do">To-do</option>
                            <option value="On Progress">On Progress</option>
                            <option value="In Review">In Review</option>
                            <option value="Completed">Completed</option>
                        </select>

                        {(auth.user.isAdmin || auth.user.isManager) && (
                            <button
                                onClick={handleDeleteTask}
                                title="Delete Task"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Title & Description */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-snug">
                        {fullTask.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {fullTask.description || 'No detailed description provided for this task.'}
                    </p>
                </div>

                {/* Metadata Row: Assignee, Creator, Due date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#f8f9fc] border border-slate-100">
                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Assignee
                        </div>
                        <div className="flex items-center space-x-2">
                            {fullTask.assignee ? (
                                <>
                                    <Avatar name={fullTask.assignee.name} initials={fullTask.assignee.initials} size="sm" />
                                    <span className="text-xs font-bold text-slate-800 truncate">{fullTask.assignee.name}</span>
                                </>
                            ) : (
                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Created By
                        </div>
                        <div className="text-xs font-medium text-slate-700">
                            {fullTask.creator?.name || 'Project Admin'}
                        </div>
                    </div>

                    <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Due Date
                        </div>
                        <div className="text-xs font-medium text-slate-700 flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{fullTask.due_date ? new Date(fullTask.due_date).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs: Comments vs Activity Log (Required by brief) */}
                <div>
                    <div className="flex items-center space-x-6 border-b border-slate-100 text-xs font-semibold text-slate-500">
                        <button
                            type="button"
                            onClick={() => setActiveTab('comments')}
                            className={`flex items-center space-x-2 py-2.5 border-b-2 transition ${
                                activeTab === 'comments'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent hover:text-slate-800'
                            }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Comments ({fullTask.comments?.length || 0})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('activities')}
                            className={`flex items-center space-x-2 py-2.5 border-b-2 transition ${
                                activeTab === 'activities'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent hover:text-slate-800'
                            }`}
                        >
                            <ActivityIcon className="w-3.5 h-3.5" />
                            <span>Activity Log ({fullTask.activities?.length || 0})</span>
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="pt-4">
                        {activeTab === 'comments' ? (
                            <div className="space-y-4">
                                {/* Comments list */}
                                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                                    {fullTask.comments && fullTask.comments.length > 0 ? (
                                        fullTask.comments.map((comm) => (
                                            <div key={comm.id} className="flex space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100/70">
                                                <Avatar name={comm.user?.name} initials={comm.user?.initials} size="sm" />
                                                <div className="flex-1 text-xs">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-bold text-slate-800">{comm.user?.name}</span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 leading-relaxed">{comm.comment}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 text-center py-4 italic">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>

                                {/* Post Comment Form */}
                                <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2">
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        className="flex-1 text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3.5"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing || !data.comment.trim()}
                                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Post</span>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* Activity Log Tab */
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {fullTask.activities && fullTask.activities.length > 0 ? (
                                    fullTask.activities.map((act) => (
                                        <div key={act.id} className="flex items-start space-x-3 text-xs py-2 border-b border-slate-50 last:border-0">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                                            <div className="flex-1">
                                                <p className="text-slate-800 font-medium">
                                                    {act.description}
                                                </p>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(act.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 text-center py-4 italic">No recorded activity yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
