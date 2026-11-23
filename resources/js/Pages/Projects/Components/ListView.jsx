import React from 'react';
import { MessageSquare, Paperclip, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Avatar from '@/Components/Avatar';

export default function ListView({ tasks = [], onOpenDetail, onStatusChange }) {
    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'High':
                return (
                    <span className="inline-flex items-center text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1"></span>
                        High
                    </span>
                );
            case 'Low':
                return (
                    <span className="inline-flex items-center text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1"></span>
                        Low
                    </span>
                );
            case 'Medium':
            default:
                return (
                    <span className="inline-flex items-center text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
                        Medium
                    </span>
                );
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            'To-do': 'bg-slate-100 text-slate-700 border-slate-200',
            'On Progress': 'bg-blue-50 text-blue-700 border-blue-200',
            'In Review': 'bg-amber-50 text-amber-700 border-amber-200',
            'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
        return (
            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${map[status] || 'bg-slate-50 text-slate-600'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-[#f8f9fc] text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                        <tr>
                            <th className="py-3 px-4">Task Title</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Priority</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Assignee</th>
                            <th className="py-3 px-4 text-center">Activity</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {tasks.map((task) => (
                            <tr 
                                key={task.id} 
                                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                onClick={() => onOpenDetail(task)}
                            >
                                <td className="py-3.5 px-4 font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    <div className="max-w-md truncate">{task.title}</div>
                                    <div className="text-xs text-slate-400 font-normal truncate mt-0.5">{task.description}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {task.category || 'Dashboard'}
                                    </span>
                                </td>
                                <td className="py-3.5 px-4">
                                    {getPriorityBadge(task.priority)}
                                </td>
                                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                    <select
                                        value={task.status}
                                        onChange={(e) => onStatusChange(task, e.target.value)}
                                        className="text-xs font-semibold py-1 px-2.5 rounded-lg border-slate-200 bg-slate-50 text-slate-700 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                                    >
                                        <option value="To-do">To-do</option>
                                        <option value="On Progress">On Progress</option>
                                        <option value="In Review">In Review</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center space-x-2">
                                        {task.assignee ? (
                                            <>
                                                <Avatar name={task.assignee.name} initials={task.assignee.initials} size="sm" />
                                                <span className="text-xs font-medium text-slate-700">{task.assignee.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Unassigned</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                    <div className="inline-flex items-center space-x-3 text-xs text-slate-400">
                                        <span className="inline-flex items-center space-x-1" title="Attachments">
                                            <Paperclip className="w-3.5 h-3.5" />
                                            <span>{task.attachments_count || 1}</span>
                                        </span>
                                        <span className="inline-flex items-center space-x-1" title="Comments">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>{task.comments_count || 0}</span>
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => onOpenDetail(task)}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
