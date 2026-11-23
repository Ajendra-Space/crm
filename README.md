# 🚀 Corporate Task Management System (Manageko CRM)

A clean, modern SaaS task management application designed for corporate product and engineering teams. Built with **Laravel 11**, **MySQL**, **Spatie Laravel Permission**, **React + Inertia.js (Laravel Breeze starter kit)**, and **Tailwind CSS**.

---

## 🎯 Tech Stack (Strict Requirements)

* **Backend:** Laravel 11.x, MySQL, Spatie Laravel Permission
* **Frontend:** React 18, Inertia.js v2, Tailwind CSS 3, Lucide Icons, Headless UI
* **State Management:** Pure Inertia.js (`router`, `useForm`, server-side props) — **No separate REST API or Redux overhead**.
* **Database Optimization:** Composite indexing on `project_id`, `assigned_to`, and `status`.

---

## 📸 UI & Design Architecture

Designed to strictly mirror modern productivity SaaS tools (Craftboard Project / Manageko UI):
* **Left Sidebar:**
  * Workspace header: `Manageko.` branding & account email
  * Main Menu: `Search`, `Notification` (with `99+` badge pill), `Calendar`, `Settings`
  * Dynamic Projects List (`Craftboard Project`, `Visionary Tasks`, `Demotion Project`, `Angular Studio`, `Cudemo Project` + `+ Create New` modal button)
  * Two-Step Verification upgrade card
* **Project Page Header:**
  * Breadcrumb navigation (`My Pages / Craftboard Project`)
  * Team avatars (`AL`, `DT`, etc.) with `+ Invite` button
  * Multi-view Tabs: **Kanban Board** & **List View** (fully interactive)
  * Real-time search query filter & Priority filter dropdown
  * `+ New Task` primary action button
* **4-Column Kanban Board:**
  * Columns: `To-do`, `On Progress`, `In Review`, `Completed`
  * Header indicator dot, column name, live task counter badge, and quick `+` add button
* **Task Card:**
  * Category badge (`Dashboard`, `Mobile app`, `Backend`, `Database`)
  * Priority pill with indicator dot (`High` / `Medium` / `Low`)
  * Title & 1-line description
  * Assignee avatar circle
  * Attachment count (`📎`) and Comment count (`💬`)
* **Task Detail Modal:**
  * Status switcher dropdown (instant update via Inertia `router.patch`)
  * Assignee selector
  * Interactive **Comments** thread with instant posting
  * Chronological **Activity Log** (records who created, moved status, or commented)

---

## 🛡️ Role-Based Access Control (RBAC) & Policies

Implemented using **Spatie Laravel Permission** and **Laravel Policies**:

| Capability | Admin | Manager | Employee | Policy Logic |
| :--- | :---: | :---: | :---: | :--- |
| **View Projects** | ✅ | ✅ | ✅ | Project members or assigned tasks |
| **Create Projects** | ✅ | ✅ | ❌ | `ProjectPolicy@create` |
| **Update Projects** | ✅ | ✅ | ❌ | Admin or Manager created |
| **Delete Projects** | ✅ | ❌ | ❌ | **Strictly Admin Only** (`ProjectPolicy@delete`) |
| **Create Tasks** | ✅ | ✅ | ❌ | `TaskPolicy@create` |
| **Update Assigned Task** | ✅ | ✅ | ✅ | `TaskPolicy@update` (Employee can update only assigned) |
| **Update Any Task** | ✅ | ✅ | ❌ | `TaskPolicy@update` |
| **Delete Tasks** | ✅ | ✅ | ❌ | `TaskPolicy@delete` |

---

## ⚡ Performance & Clean Code Practices

1. **Database Indexing:**
   ```php
   $table->index('project_id');
   $table->index('assigned_to');
   $table->index('status');
   $table->index(['project_id', 'status']);
   ```
2. **Preventing N+1 Queries (Eager Loading & Aggregates):**
   ```php
   // ProjectController.php
   $project->load([
       'creator:id,name,email,avatar,initials',
       'members:id,name,email,avatar,initials,role_title',
   ]);

   $project->tasks()
       ->with(['assignee:id,name,email,avatar,initials,role_title', 'creator:id,name'])
       ->withCount(['comments', 'attachments'])
       ->orderBy('order', 'asc');
   ```
3. **Form Requests:**
   * All mutations validated via dedicated Form Requests (`StoreTaskRequest`, `UpdateTaskRequest`, `UpdateTaskStatusRequest`, `StoreProjectRequest`, `StoreCommentRequest`).

---

## 🔑 Demo Login Credentials

The login page features **1-Click Demo Login buttons** for instant testing:

| Role | Email | Password | Permissions Summary |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@manageko.com` | `password` | Complete access, can delete projects & manage users |
| **Manager** | `manager@manageko.com` | `password` | Can manage projects, create/assign tasks, view logs |
| **Employee** | `alex@manageko.com` | `password` | Can view assigned tasks, update task status, add comments |
| **Employee 2** | `sarah@manageko.com` | `password` | Second engineer profile for team testing |

---

## 💻 Local Setup Instructions

### 1. Clone & Enter Directory
```bash
git clone <your-repository-url>
cd corporate-task-management
```

### 2. Install Dependencies
```bash
composer install
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

Configure your database credentials in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=manageko_crm
DB_USERNAME=root
DB_PASSWORD=
```
*(Alternatively, you can use SQLite: `DB_CONNECTION=sqlite` and create `database/database.sqlite`)*

### 4. Run Migrations & Seeders
```bash
php artisan migrate --seed
```
*This populates the database with roles, users, 5 projects, and 15+ realistic tasks matching the Craftboard screenshot.*

### 5. Build Assets & Start Servers
Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
php artisan serve
```

Visit: `http://localhost:8000`

---

## 🎓 Interview Quick Reference Guide

Jab aap interview me is project ko explain karein:

1. **Why Inertia.js instead of REST API + Redux?**
   * *Answer:* Inertia.js eliminates the boilerplate of duplicate state management, endpoint versioning, and client-side token management. Server-side Laravel handles routing, authorization, and validation, while React renders a blazing-fast SPA using server props.
2. **How did you prevent N+1 query bottlenecks?**
   * *Answer:* Eager loading using `.with(['assignee', 'creator'])` and database aggregates using `.withCount(['comments', 'attachments'])` ensure the entire Kanban board with 4 columns loads in just 2 optimized SQL queries instead of `2 * N + 1`.
3. **How is Security & RBAC implemented?**
   * *Answer:* Dual-layer security. First, **Spatie Laravel Permission** assigns roles (`Admin`, `Manager`, `Employee`). Second, **Laravel Policies** (`TaskPolicy`, `ProjectPolicy`) enforce fine-grained authorization at controller boundaries—ensuring employees can never delete projects or update tasks not assigned to them.
