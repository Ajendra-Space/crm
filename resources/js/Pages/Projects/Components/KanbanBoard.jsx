import React from 'react';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ 
    tasks = [], 
    onOpenDetail, 
    onQuickAdd, 
    onStatusChange 
}) {
    const columns = [
        { id: 'To-do', name: 'To-do' },
        { id: 'On Progress', name: 'On Progress' },
        { id: 'In Review', name: 'In Review' },
        { id: 'Completed', name: 'Completed' },
    ];

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start">
            {columns.map((column) => {
                const columnTasks = tasks.filter((t) => t.status === column.name);
                return (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        tasks={columnTasks}
                        onOpenDetail={onOpenDetail}
                        onQuickAdd={onQuickAdd}
                        onStatusChange={onStatusChange}
                    />
                );
            })}
        </div>
    );
}
