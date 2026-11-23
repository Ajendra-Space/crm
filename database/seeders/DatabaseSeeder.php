<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskActivity;
use App\Models\TaskAttachment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'web']);
        $employeeRole = Role::firstOrCreate(['name' => 'Employee', 'guard_name' => 'web']);

        // 2. Create Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@manageko.com'],
            [
                'name' => 'Alexander Pierce',
                'password' => Hash::make('password'),
                'initials' => 'AP',
                'role_title' => 'Super Administrator',
            ]
        );
        $admin->syncRoles([$adminRole]);

        $manager = User::firstOrCreate(
            ['email' => 'manager@manageko.com'],
            [
                'name' => 'David Taylor',
                'password' => Hash::make('password'),
                'initials' => 'DT',
                'role_title' => 'Project Manager',
            ]
        );
        $manager->syncRoles([$managerRole]);

        $employee1 = User::firstOrCreate(
            ['email' => 'alex@manageko.com'],
            [
                'name' => 'Alex Lee',
                'password' => Hash::make('password'),
                'initials' => 'AL',
                'role_title' => 'Product Designer',
            ]
        );
        $employee1->syncRoles([$employeeRole]);

        $employee2 = User::firstOrCreate(
            ['email' => 'sarah@manageko.com'],
            [
                'name' => 'Sarah Connor',
                'password' => Hash::make('password'),
                'initials' => 'SC',
                'role_title' => 'Frontend Engineer',
            ]
        );
        $employee2->syncRoles([$employeeRole]);

        // 3. Create Projects (matching screenshot)
        $p1 = Project::firstOrCreate(
            ['name' => 'Craftboard Project'],
            [
                'code' => 'CP',
                'description' => 'Modern task board and workspace management for product teams.',
                'color' => '#4f46e5', // indigo
                'icon' => 'C',
                'created_by' => $manager->id,
            ]
        );

        $p2 = Project::firstOrCreate(
            ['name' => 'Visionary Tasks'],
            [
                'code' => 'VT',
                'description' => 'High-level strategic roadmap and quarterly product milestones.',
                'color' => '#0f172a', // slate dark
                'icon' => 'V',
                'created_by' => $admin->id,
            ]
        );

        $p3 = Project::firstOrCreate(
            ['name' => 'Demotion Project'],
            [
                'code' => 'DP',
                'description' => 'System deprecation and legacy database migration workflows.',
                'color' => '#ea580c', // orange
                'icon' => 'D',
                'created_by' => $manager->id,
            ]
        );

        $p4 = Project::firstOrCreate(
            ['name' => 'Angular Studio'],
            [
                'code' => 'AS',
                'description' => 'Angular component library and micro-frontend integrations.',
                'color' => '#2563eb', // blue
                'icon' => 'A',
                'created_by' => $manager->id,
            ]
        );

        $p5 = Project::firstOrCreate(
            ['name' => 'Cudemo Project'],
            [
                'code' => 'CD',
                'description' => 'Customer demonstration sandbox and pilot testing platform.',
                'color' => '#7c3aed', // purple
                'icon' => 'C',
                'created_by' => $admin->id,
            ]
        );

        // Attach members to Craftboard Project
        $p1->members()->syncWithoutDetaching([
            $admin->id => ['role' => 'admin'],
            $manager->id => ['role' => 'manager'],
            $employee1->id => ['role' => 'member'],
            $employee2->id => ['role' => 'member'],
        ]);

        // 4. Create Realistic Tasks for Craftboard Project (Matching the Screenshot!)
        $tasksData = [
            // To-do column
            [
                'title' => 'Employee Details',
                'category' => 'Dashboard',
                'priority' => 'Medium',
                'status' => 'To-do',
                'assigned_to' => $employee1->id,
                'description' => 'Create a page where there is information about employee details, permissions, and department structure.',
                'comments_count' => 12,
                'attachments_count' => 3,
            ],
            [
                'title' => 'Darkmode version',
                'category' => 'Mobile app',
                'priority' => 'Low',
                'status' => 'To-do',
                'assigned_to' => $employee1->id,
                'description' => 'Darkmode version for all screens with theme toggle support and accessibility contrast checks.',
                'comments_count' => 10,
                'attachments_count' => 2,
            ],
            [
                'title' => 'Super Admin Role',
                'category' => 'Dashboard',
                'priority' => 'Medium',
                'status' => 'To-do',
                'assigned_to' => $employee1->id,
                'description' => 'Define permission matrix and multi-tenant security barriers for super admin controls.',
                'comments_count' => 5,
                'attachments_count' => 1,
            ],

            // On Progress column
            [
                'title' => 'Super Admin Role',
                'category' => 'Dashboard',
                'priority' => 'High',
                'status' => 'On Progress',
                'assigned_to' => $manager->id,
                'description' => 'Setup with relevant information such as permission guard hierarchy and role authorization middleware.',
                'comments_count' => 8,
                'attachments_count' => 2,
            ],
            [
                'title' => 'Settings page',
                'category' => 'Mobile app',
                'priority' => 'Medium',
                'status' => 'On Progress',
                'assigned_to' => $employee1->id,
                'description' => 'Settings page with security preferences, notification webhooks, and 2FA configuration.',
                'comments_count' => 45,
                'attachments_count' => 1,
            ],
            [
                'title' => 'KPI and Employee Statistics',
                'category' => 'Dashboard',
                'priority' => 'Medium',
                'status' => 'On Progress',
                'assigned_to' => $manager->id,
                'description' => 'Create a design that displays KPIs, department utilization, and quarterly velocity graphs.',
                'comments_count' => 3,
                'attachments_count' => 3,
            ],
            [
                'title' => 'API Rate Limiting & Audit Trail',
                'category' => 'Backend',
                'priority' => 'High',
                'status' => 'On Progress',
                'assigned_to' => $employee2->id,
                'description' => 'Implement token bucket throttling on sensitive API endpoints and log suspicious IP spikes.',
                'comments_count' => 6,
                'attachments_count' => 2,
            ],

            // In Review column
            [
                'title' => 'Customer Role',
                'category' => 'Dashboard',
                'priority' => 'Medium',
                'status' => 'In Review',
                'assigned_to' => $manager->id,
                'description' => 'Scoping and customer self-service views with read-only contract permissions.',
                'comments_count' => 10,
                'attachments_count' => 2,
            ],
            [
                'title' => 'Admin Role',
                'category' => 'Dashboard',
                'priority' => 'High',
                'status' => 'In Review',
                'assigned_to' => $employee1->id,
                'description' => 'Set up with relevant information system policies and tenant management capabilities.',
                'comments_count' => 12,
                'attachments_count' => 3,
            ],

            // Completed column
            [
                'title' => 'Design system & Style guide',
                'category' => 'Mobile app',
                'priority' => 'Low',
                'status' => 'Completed',
                'assigned_to' => $employee1->id,
                'description' => 'Atomic design system tokens, button variants, iconography, and responsive layouts.',
                'comments_count' => 12,
                'attachments_count' => 3,
            ],
            [
                'title' => 'Component & Color style',
                'category' => 'Dashboard',
                'priority' => 'Medium',
                'status' => 'Completed',
                'assigned_to' => $manager->id,
                'description' => 'Set up with relevant information system design tokens and Tailwind palette overrides.',
                'comments_count' => 3,
                'attachments_count' => 3,
            ],
            [
                'title' => 'Moodboarding and List style',
                'category' => 'Dashboard',
                'priority' => 'High',
                'status' => 'Completed',
                'assigned_to' => $employee1->id,
                'description' => 'Visual explorations for table density, hover actions, and quick status pills.',
                'comments_count' => 45,
                'attachments_count' => 1,
            ],
            [
                'title' => 'Super Admin Role',
                'category' => 'Dashboard',
                'priority' => 'Medium',
                'status' => 'Completed',
                'assigned_to' => $employee1->id,
                'description' => 'Baseline authentication scaffolding and session security implementation.',
                'comments_count' => 12,
                'attachments_count' => 3,
            ],
            [
                'title' => 'Database Migration & Indexing',
                'category' => 'Database',
                'priority' => 'High',
                'status' => 'Completed',
                'assigned_to' => $manager->id,
                'description' => 'Compound indexing on project_id and status to achieve sub-millisecond query latency.',
                'comments_count' => 7,
                'attachments_count' => 4,
            ],
        ];

        foreach ($tasksData as $index => $data) {
            $task = Task::create([
                'project_id' => $p1->id,
                'title' => $data['title'],
                'description' => $data['description'],
                'category' => $data['category'],
                'priority' => $data['priority'],
                'status' => $data['status'],
                'assigned_to' => $data['assigned_to'],
                'created_by' => $manager->id,
                'order' => $index + 1,
                'due_date' => now()->addDays(rand(3, 14)),
            ]);

            // Add realistic comments
            Comment::create([
                'task_id' => $task->id,
                'user_id' => $manager->id,
                'comment' => "Reviewed the specifications. Looks aligned with the client brief.",
                'created_at' => now()->subHours(rand(10, 36)),
            ]);

            Comment::create([
                'task_id' => $task->id,
                'user_id' => $employee1->id,
                'comment' => "Working on the mockups and edge case validations right now.",
                'created_at' => now()->subHours(rand(2, 8)),
            ]);

            // Add realistic activity log
            TaskActivity::create([
                'task_id' => $task->id,
                'user_id' => $manager->id,
                'action' => 'created',
                'new_value' => $task->status,
                'description' => "David Taylor created task '{$task->title}'",
                'created_at' => now()->subDays(rand(2, 5)),
            ]);

            if ($task->status !== 'To-do') {
                TaskActivity::create([
                    'task_id' => $task->id,
                    'user_id' => $task->assigned_to,
                    'action' => 'status_changed',
                    'old_value' => 'To-do',
                    'new_value' => $task->status,
                    'description' => ($task->assignee ? $task->assignee->name : 'User') . " changed status to {$task->status}",
                    'created_at' => now()->subHours(rand(4, 24)),
                ]);
            }

            // Add dummy attachments
            for ($a = 1; $a <= $data['attachments_count']; $a++) {
                TaskAttachment::create([
                    'task_id' => $task->id,
                    'user_id' => $task->assigned_to ?? $manager->id,
                    'file_name' => "spec_sheet_v{$a}.pdf",
                    'file_path' => "/uploads/spec_sheet_v{$a}.pdf",
                    'file_size' => rand(150, 2400),
                ]);
            }
        }
    }
}
