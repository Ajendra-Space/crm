<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Store a newly created task.
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;

        // Auto assign order within column
        $maxOrder = Task::where('project_id', $validated['project_id'])
            ->where('status', $validated['status'])
            ->max('order') ?? 0;
        $validated['order'] = $maxOrder + 1;

        $task = Task::create($validated);

        // Activity log
        TaskActivity::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
            'action' => 'created',
            'new_value' => $task->status,
            'description' => "{$request->user()->name} created task '{$task->title}'",
        ]);

        return redirect()->back()->with('success', 'Task created successfully!');
    }

    /**
     * Display task details with comments and activity log.
     */
    public function show(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        $task->load([
            'project:id,name,color,code',
            'assignee:id,name,email,avatar,initials,role_title',
            'creator:id,name,email,avatar,initials',
            'comments.user:id,name,email,avatar,initials',
            'activities.user:id,name,initials',
            'attachments',
        ]);

        return response()->json([
            'task' => $task,
        ]);
    }

    /**
     * Update task information.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $oldStatus = $task->status;
        $oldAssignee = $task->assigned_to;

        $task->update($request->validated());

        // Check for status change
        if ($oldStatus !== $task->status) {
            TaskActivity::create([
                'task_id' => $task->id,
                'user_id' => $request->user()->id,
                'action' => 'status_changed',
                'old_value' => $oldStatus,
                'new_value' => $task->status,
                'description' => "{$request->user()->name} changed status from '{$oldStatus}' to '{$task->status}'",
            ]);
        }

        // Check for assignee change
        if ($oldAssignee !== $task->assigned_to) {
            $newAssigneeName = $task->assignee ? $task->assignee->name : 'Unassigned';
            TaskActivity::create([
                'task_id' => $task->id,
                'user_id' => $request->user()->id,
                'action' => 'assigned',
                'new_value' => $newAssigneeName,
                'description' => "{$request->user()->name} assigned task to {$newAssigneeName}",
            ]);
        }

        return redirect()->back()->with('success', 'Task updated successfully!');
    }

    /**
     * Quick status update (for Kanban drop or fast status change).
     */
    public function updateStatus(UpdateTaskStatusRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $oldStatus = $task->status;
        $newStatus = $request->input('status');

        $task->status = $newStatus;
        if ($request->has('order')) {
            $task->order = $request->input('order');
        }
        $task->save();

        if ($oldStatus !== $newStatus) {
            TaskActivity::create([
                'task_id' => $task->id,
                'user_id' => $request->user()->id,
                'action' => 'status_changed',
                'old_value' => $oldStatus,
                'new_value' => $newStatus,
                'description' => "{$request->user()->name} moved task to {$newStatus}",
            ]);
        }

        return redirect()->back()->with('success', "Task moved to {$newStatus}");
    }

    /**
     * Add comment to task.
     */
    public function addComment(StoreCommentRequest $request, Task $task)
    {
        $this->authorize('view', $task);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $request->input('comment'),
        ]);

        TaskActivity::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
            'action' => 'commented',
            'description' => "{$request->user()->name} added a comment",
        ]);

        return redirect()->back()->with('success', 'Comment added.');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Request $request, Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->back()->with('success', 'Task deleted.');
    }
}
