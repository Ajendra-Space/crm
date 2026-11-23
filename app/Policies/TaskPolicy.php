<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Admin')) {
            return true;
        }

        return null;
    }

    public function view(User $user, Task $task): bool
    {
        if ($user->hasRole('Manager')) {
            return true;
        }

        // Employee can view if assigned to the task or part of the project
        return $task->assigned_to === $user->id 
            || $task->project->members()->where('user_id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Manager']);
    }

    /**
     * Manager can update any task in their projects.
     * Employee can ONLY update if task is assigned to them!
     */
    public function update(User $user, Task $task): bool
    {
        if ($user->hasRole('Manager')) {
            return true;
        }

        if ($user->hasRole('Employee')) {
            return $task->assigned_to === $user->id;
        }

        return false;
    }

    public function delete(User $user, Task $task): bool
    {
        return $user->hasAnyRole(['Admin', 'Manager']);
    }
}
