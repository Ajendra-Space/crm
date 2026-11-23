<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Eager load creator and counts to avoid N+1 queries
        $projects = Project::query()
            ->with(['creator:id,name,email,avatar,initials'])
            ->withCount(['tasks', 'members'])
            ->latest()
            ->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Display the specified project with full Kanban and List views.
     */
    public function show(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        // Sidebar dynamic projects list: eager loaded with tasks_count
        $allProjects = Project::query()
            ->select(['id', 'name', 'code', 'color', 'icon'])
            ->withCount(['tasks' => function ($q) {
                $q->where('status', '!=', 'Completed');
            }])
            ->get();

        // Eager load project relations: members, creator, and tasks with assignee & counts
        $project->load([
            'creator:id,name,email,avatar,initials',
            'members:id,name,email,avatar,initials,role_title',
        ]);

        // Tasks query with eager loading to prevent N+1 queries
        $tasksQuery = $project->tasks()
            ->with([
                'assignee:id,name,email,avatar,initials,role_title',
                'creator:id,name',
            ])
            ->withCount(['comments', 'attachments'])
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        // Search filter
        if ($search = $request->input('search')) {
            $tasksQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Priority filter
        if ($priority = $request->input('priority')) {
            $tasksQuery->where('priority', $priority);
        }

        // Status filter (for list view)
        if ($status = $request->input('status')) {
            $tasksQuery->where('status', $status);
        }

        $tasks = $tasksQuery->get();

        // Get all assignable users
        $teamMembers = User::select(['id', 'name', 'email', 'avatar', 'initials', 'role_title'])->get();

        // Current user permissions for the project
        $permissions = [
            'canCreateTask' => $request->user()->can('create', \App\Models\Task::class),
            'canDeleteProject' => $request->user()->can('delete', $project),
            'canUpdateProject' => $request->user()->can('update', $project),
        ];

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'tasks' => $tasks,
            'allProjects' => $allProjects,
            'teamMembers' => $teamMembers,
            'filters' => $request->only(['search', 'priority', 'status']),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;

        // Auto assign initials code if not provided
        if (empty($validated['code'])) {
            $words = explode(' ', $validated['name']);
            $code = '';
            foreach ($words as $w) {
                $code .= strtoupper(substr($w, 0, 1));
            }
            $validated['code'] = substr($code, 0, 4);
        }

        $project = Project::create($validated);

        // Attach creator as manager member
        $project->members()->attach($request->user()->id, ['role' => 'manager']);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project created successfully!');
    }

    /**
     * Update the specified project in storage.
     */
    public function update(StoreProjectRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return redirect()->back()->with('success', 'Project updated successfully!');
    }

    /**
     * Remove the specified project from storage (Strictly Admin only).
     */
    public function destroy(Request $request, Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('dashboard')->with('success', 'Project deleted successfully!');
    }
}
