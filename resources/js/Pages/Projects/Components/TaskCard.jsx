import React from 'react';
import { 
    Paperclip, 
    MessageSquare, 
    Layout, 
    Smartphone, 
    Globe, 
    Database, 
    CheckCircle2, 
    MoreVertical 
} from 'lucide-react';
import Avatar from '@/Components/Avatar';

export default function TaskCard({ task, onOpenDetail, onStatusChange }) {
    // Category icon helper
    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'mobile app':
                return <Smartphone className="w-3 h-3 text-amber-500 mr-1" />;
            case 'backend':
            case 'database':
                return <Database className="w-3 h-3 text-cyan-500 mr-1" />;
            case 'website':
                return <Globe className="w-3 h-3 text-blue-500 mr-1" />;
            default:
                return <Layout className="w-3 h-3 text-indigo-500 mr-1" />;
        }
    };

    // Priority pill styling matching screenshot
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

    return (
        <div 
            onClick={() => onOpenDetail(task)}
            className="group bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer select-none relative"
        >
            {/* Top row: Category tag & Priority badge */}
            <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                    {getCategoryIcon(task.category)}
                    {task.category || 'Dashboard'}
                </span>

                <div className="flex items-center space-x-1.5">
                    {getPriorityBadge(task.priority)}
                </div>
            </div>

            {/* Task Title */}
            <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug mb-1.5 line-clamp-1">
                {task.title}
            </h4>

            {/* 1-line preview description */}
            <p className="text-xs text-slate-400 line-clamp-1 mb-4 leading-relaxed font-normal">
                {task.description || 'No description provided.'}
            </p>

            {/* Bottom Row: Assignee Avatar, Attachments, Comments */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-slate-400">
                {/* Assignee Avatar */}
                <div className="flex items-center -space-x-1.5">
                    {task.assignee ? (
                        <Avatar 
                            name={task.assignee.name} 
                            initials={task.assignee.initials} 
                            size="sm" 
                        />
                    ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Unassigned</span>
                    )}
                </div>

                {/* Attachments & Comments count (matching screenshot) */}
                <div className="flex items-center space-x-3 text-slate-400 text-xs">
                    <div className="flex items-center space-x-1 hover:text-slate-600 transition" title="Attachments">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">{task.attachments_count || 1}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-slate-600 transition" title="Comments">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">{task.comments_count || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
