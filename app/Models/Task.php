<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'category',
        'priority',
        'status',
        'assigned_to',
        'created_by',
        'order',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
        'order' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();
    }

    public function activities()
    {
        return $this->hasMany(TaskActivity::class)->latest();
    }

    public function attachments()
    {
        return $this->hasMany(TaskAttachment::class);
    }
}
