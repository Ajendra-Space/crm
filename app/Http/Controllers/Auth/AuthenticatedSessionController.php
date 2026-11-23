<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'demoUsers' => [
                [
                    'role' => 'Admin',
                    'email' => 'admin@manageko.com',
                    'password' => 'password',
                    'name' => 'Alexander Super Admin',
                    'badge' => 'Full System Access',
                    'badgeColor' => 'bg-purple-100 text-purple-700',
                ],
                [
                    'role' => 'Manager',
                    'email' => 'manager@manageko.com',
                    'password' => 'password',
                    'name' => 'David Taylor (DT)',
                    'badge' => 'Manage Projects & Team',
                    'badgeColor' => 'bg-blue-100 text-blue-700',
                ],
                [
                    'role' => 'Employee',
                    'email' => 'alex@manageko.com',
                    'password' => 'password',
                    'name' => 'Alex Lee (AL)',
                    'badge' => 'Assigned Tasks Only',
                    'badgeColor' => 'bg-emerald-100 text-emerald-700',
                ],
            ],
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        // Redirect to first project if exists, otherwise dashboard
        $firstProject = \App\Models\Project::first();
        if ($firstProject) {
            return redirect()->route('projects.show', $firstProject->id);
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Direct demo login for quick interview / test review.
     */
    public function demoLogin(Request $request, string $role): RedirectResponse
    {
        $emailMap = [
            'admin' => 'admin@manageko.com',
            'manager' => 'manager@manageko.com',
            'employee' => 'alex@manageko.com',
        ];

        $email = $emailMap[strtolower($role)] ?? 'admin@manageko.com';
        $user = User::where('email', $email)->first();

        if ($user) {
            Auth::login($user);
            $request->session()->regenerate();
            $firstProject = \App\Models\Project::first();
            if ($firstProject) {
                return redirect()->route('projects.show', $firstProject->id);
            }
            return redirect()->route('dashboard');
        }

        return redirect()->route('login')->withErrors(['email' => 'Demo user not seeded yet. Run php artisan migrate --seed.']);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
