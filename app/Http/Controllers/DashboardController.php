<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TaskActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // All projects for sidebar
        $allProjects = Project::query()
            ->select(['id', 'name', 'code', 'color', 'icon'])
            ->withCount(['tasks' => function ($q) {
                $q->where('status', '!=', 'Completed');
            }])
            ->get();

        // Metrics eager loaded
        $totalProjects = Project::count();
        $totalTasks = Task::count();
        $completedTasks = Task::where('status', 'Completed')->count();
        $inProgressTasks = Task::where('status', 'On Progress')->count();

        // Tasks assigned to current user
        $myTasks = Task::where('assigned_to', $user->id)
            ->with(['project:id,name,color,code'])
            ->withCount(['comments', 'attachments'])
            ->latest()
            ->take(5)
            ->get();

        // Recent activity feed
        $recentActivities = TaskActivity::with(['user:id,name,initials', 'task:id,title,project_id'])
            ->latest()
            ->take(8)
            ->get();

        // Default redirect or project view: if user clicks demo, redirect to first project or show dashboard
        $firstProject = Project::first();

        return Inertia::render('Dashboard', [
            'allProjects' => $allProjects,
            'firstProjectId' => $firstProject?->id,
            'metrics' => [
                'totalProjects' => $totalProjects,
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'inProgressTasks' => $inProgressTasks,
            ],
            'myTasks' => $myTasks,
            'recentActivities' => $recentActivities,
        ]);
    }
}
