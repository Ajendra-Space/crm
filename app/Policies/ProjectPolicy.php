<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    /**
     * Admin has god-mode bypass if desired, or explicit checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Project $project): bool
    {
        if ($user->hasRole('Manager')) {
            return true;
        }

        // Employee can only view if they are a member or have an assigned task in this project
        return $project->members()->where('user_id', $user->id)->exists()
            || $project->tasks()->where('assigned_to', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Manager']);
    }

    public function update(User $user, Project $project): bool
    {
        if ($user->hasRole('Manager')) {
            return $project->created_by === $user->id 
                || $project->members()->where('user_id', $user->id)->where('project_user.role', 'manager')->exists();
        }

        return false;
    }

    /**
     * Strictly Admin only can delete projects as required.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->hasRole('Admin');
    }
}
