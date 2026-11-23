import React from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function CreateProjectModal({ show = false, onClose }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        code: '',
        description: '',
        color: '#4f46e5',
        icon: 'folder',
    });

    const colors = [
        '#4f46e5', // indigo
        '#0f172a', // slate
        '#ea580c', // orange
        '#2563eb', // blue
        '#7c3aed', // purple
        '#059669', // emerald
        '#e11d48', // rose
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} title="Create New Project" maxWidth="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Project Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Visionary Tasks"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    />
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Project Code (Optional, 2-4 letters)
                    </label>
                    <input
                        type="text"
                        maxLength={4}
                        placeholder="e.g. VT"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 uppercase"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Description
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Brief summary of the project..."
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Theme Color
                    </label>
                    <div className="flex items-center space-x-2">
                        {colors.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setData('color', c)}
                                className={`w-7 h-7 rounded-full transition-transform ${data.color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-105'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

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
                        {processing ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
