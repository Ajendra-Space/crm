import React from 'react';

export default function Avatar({ name = '', initials = '', size = 'md', className = '' }) {
    const sizeClasses = {
        xs: 'w-5 h-5 text-[10px]',
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-xs',
        lg: 'w-10 h-10 text-sm font-medium',
    };

    const getInitials = () => {
        if (initials) return initials.toUpperCase().slice(0, 2);
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    // Deterministic pleasant avatar colors
    const colors = [
        'bg-indigo-100 text-indigo-700 border-indigo-200',
        'bg-emerald-100 text-emerald-700 border-emerald-200',
        'bg-amber-100 text-amber-700 border-amber-200',
        'bg-rose-100 text-rose-700 border-rose-200',
        'bg-cyan-100 text-cyan-700 border-cyan-200',
        'bg-purple-100 text-purple-700 border-purple-200',
    ];
    const charCode = (name || initials).charCodeAt(0) || 0;
    const colorClass = colors[charCode % colors.length];

    return (
        <div
            title={name}
            className={`inline-flex items-center justify-center font-semibold rounded-full border shadow-2xs select-none ${sizeClasses[size] || sizeClasses.md} ${colorClass} ${className}`}
        >
            {getInitials()}
        </div>
    );
}
