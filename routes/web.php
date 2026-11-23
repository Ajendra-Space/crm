<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        $firstProject = \App\Models\Project::first();
        if ($firstProject) {
            return redirect()->route('projects.show', $firstProject->id);
        }
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Demo Login Shortcut for interviews/testing
Route::post('/demo-login/{role}', [AuthenticatedSessionController::class, 'demoLogin'])->name('demo.login');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Projects resource
    Route::resource('projects', ProjectController::class);

    // Tasks routes
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.updateStatus');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::post('/tasks/{task}/comments', [TaskController::class, 'addComment'])->name('tasks.comments.store');
});

require __DIR__.'/auth.php';
