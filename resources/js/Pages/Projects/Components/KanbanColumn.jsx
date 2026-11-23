import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ 
    column, 
    tasks = [], 
    onOpenDetail, 
    onQuickAdd, 
    onStatusChange 
}) {
    // Column status circle colors matching screenshot
    const statusDotColors = {
        'To-do': 'border-slate-400 text-slate-400',
        'On Progress': 'border-blue-500 text-blue-500',
        'In Review': 'border-amber-500 text-amber-500',
        'Completed': 'border-emerald-500 text-emerald-500',
    };

    return (
        <div className="flex-1 min-w-[270px] max-w-[340px] flex flex-col bg-[#f8f9fc]/90 rounded-2xl p-3 border border-slate-100">
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-2 mb-3">
                <div className="flex items-center space-x-2">
                    <span className={`w-3.5 h-3.5 rounded-full border-2 inline-block ${statusDotColors[column.name] || 'border-slate-400'}`} />
                    <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                        {column.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200/80 px-2 py-0.2 rounded-full shadow-2xs">
                        {tasks.length}
                    </span>
                </div>

                {/* Quick Add Button */}
                <button
                    type="button"
                    onClick={() => onQuickAdd(column.name)}
                    title={`Add task to ${column.name}`}
                    className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white hover:shadow-2xs flex items-center justify-center transition"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Tasks list */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onOpenDetail={onOpenDetail}
                            onStatusChange={onStatusChange}
                        />
                    ))
                ) : (
                    <div className="h-28 rounded-xl border-2 border-dashed border-slate-200/80 flex flex-col items-center justify-center text-center p-3">
                        <p className="text-xs text-slate-400 font-medium">No tasks yet</p>
                        <button
                            onClick={() => onQuickAdd(column.name)}
                            className="mt-1 text-[11px] text-indigo-600 font-semibold hover:underline"
                        >
                            + Add a task
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
