import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { ShieldCheck, LogIn, Lock, Mail, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword, demoUsers = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleQuickDemoLogin = (roleKey) => {
        router.post(route('demo.login', roleKey.toLowerCase()));
    };

    return (
        <div className="min-h-screen bg-[#f1f3f9] flex items-center justify-center p-4 antialiased text-slate-800 font-sans">
            <Head title="Sign In - Manageko" />

            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                
                {/* Left Side: Brand & 1-Click Demo Logins */}
                <div className="bg-[#f8f9fc] p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between">
                    <div>
                        {/* Logo */}
                        <div className="flex items-center space-x-2.5 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-extrabold shadow-xs">
                                <span className="text-indigo-400">M</span>
                            </div>
                            <span className="text-base font-bold text-slate-900 tracking-tight">Manageko.</span>
                        </div>

                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                            Corporate Task Management
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                            Clean Kanban boards, Spatie role-based policies, and eager-loaded performance.
                        </p>

                        {/* Demo Accounts Box */}
                        <div className="space-y-3">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                🚀 Instant Demo Logins (1-Click)
                            </div>

                            {demoUsers.length > 0 ? (
                                demoUsers.map((user) => (
                                    <button
                                        key={user.role}
                                        type="button"
                                        onClick={() => handleQuickDemoLogin(user.role)}
                                        className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-xs transition group flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                                                    {user.name}
                                                </span>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${user.badgeColor}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                                            <div className="text-[10px] text-slate-500 italic mt-0.5">{user.badge}</div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                                    </button>
                                ))
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => handleQuickDemoLogin('admin')}
                                        className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold hover:border-indigo-500 transition"
                                    >
                                        Log in as Admin (admin@manageko.com)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickDemoLogin('manager')}
                                        className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold hover:border-indigo-500 transition"
                                    >
                                        Log in as Manager (manager@manageko.com)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickDemoLogin('employee')}
                                        className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold hover:border-indigo-500 transition"
                                    >
                                        Log in as Employee (alex@manageko.com)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center space-x-2 text-[11px] text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        <span>Spatie Laravel Permission & Policies Active</span>
                    </div>
                </div>

                {/* Right Side: Standard Login Form */}
                <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Sign in to your account</h3>
                    <p className="text-xs text-slate-400 mb-6">Enter your email and password below</p>

                    {status && (
                        <div className="mb-4 text-xs font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@manageko.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-2xs"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-2xs"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>Remember me</span>
                            </label>

                            <span className="text-xs text-slate-400">Default password: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">password</code></span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>{processing ? 'Signing in...' : 'Sign In'}</span>
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
