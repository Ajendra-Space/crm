# 📘 Manageko CRM - Complete Documentation, Tech Stack & User Guide

> **Corporate Task Management System (Manageko CRM)**  
> Yeh guide is project ki complete technical details, use ki gayi technologies, database architecture aur application ko kaise chalana aur test karna hai, sab kuch step-by-step detail me explain karti hai.

---

## 📑 Table of Contents
1. [Project Overview (Yeh CRM kya hai?)](#1-project-overview)
2. [Complete Tech Stack (Kon-si technology use hui hai?)](#2-complete-tech-stack)
3. [Architecture & Design Pattern](#3-architecture--design-pattern)
4. [Database Schema & Tables (DB ka Role)](#4-database-schema--tables)
5. [Role-Based Access Control (RBAC Matrix)](#5-role-based-access-control-rbac)
6. [How to Use the CRM (Kaise Use Karein?)](#6-how-to-use-the-crm)
7. [How to Run Locally (Local Setup Guide)](#7-how-to-run-locally)
8. [Interview & Presentation Guide (Important Q&A)](#8-interview--presentation-guide)

---

## 1. Project Overview
**Manageko CRM** ek modern, high-performance SaaS corporate task management web application hai, jise corporate product aur engineering teams ke liye design kiya gaya hai. 
Yeh project popular productivity tools jaise **Jira**, **Linear**, aur **Trello** ke modern design pattern (Craftboard UI) ko strictly follow karta hai.

### 🌟 Key Highlights:
* **4-Column Dynamic Kanban Board** (`To-do`, `On Progress`, `In Review`, `Completed`).
* **Multi-View Modes**: Kanban Board View aur Tabular List View.
* **Instant 1-Click Demo Login** (Super Admin, Project Manager, Employee).
* **Interactive Task Modal**: Real-time status update, interactive comments thread aur automated audit trail activity log.
* **Strict Role-Based Access Control (RBAC)**: Laravel Policies ke zariye restricted actions.
* **Zero N+1 Query Optimization**: Sub-millisecond database queries.

---

## 2. Complete Tech Stack

| Category | Technology | Version | Purpose / Kaam |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | **Laravel** | 11.x | Robust routing, controllers, ORM, policies, validation. |
| **Backend Runtime** | **PHP** | 8.2+ | Server-side execution engine. |
| **Frontend Library** | **React** | 18.x | Component-based dynamic, interactive reactive user interface. |
| **SPA Bridge** | **Inertia.js** | 2.x | Connects Laravel and React into a Single-Page App **without** needing a separate REST API or Redux overhead. |
| **Styling & CSS** | **Tailwind CSS** | 3.4+ | Utility-first responsive modern design system. |
| **Icons** | **Lucide React** | 0.38+ | Crisp, scalable SVG UI icons. |
| **UI Components** | **Headless UI** | 2.x | Accessible dialogs, modals, and dropdown components. |
| **Database** | **MySQL** | 8.x (XAMPP) | Relational database for persistent storage. |
| **Role Authorization**| **Spatie Permission**| 6.x | Enterprise-grade Roles & Permissions system. |
| **Route Helper** | **Tighten Ziggy** | 2.7+ | Allows using Laravel named routes directly inside React components (`route('tasks.updateStatus')`). |
| **Build Tool & Bundler**| **Vite** | 5.x | Instant Hot Module Replacement (HMR) and production asset bundling. |

---

## 3. Architecture & Design Pattern

### Kyun Inertia.js use kiya (REST API + Redux ke badle)?
* **Traditional Approach (REST API + Redux):** Alag se 50+ API endpoints likhne padte hain, CORS configure karna padta hai, Redux slices/reducers banane padte hain aur auth token manage karna padta hai.
* **Inertia.js Modern Architecture:** Laravel controllers directly React components ko render karte hain aur data ko `props` ke roop me pass karte hain. Pure SPA experience milta hai bina page reload ke, jabki routing, authorization, aur validation ka full control backend ke paas rehta hai.

---

## 4. Database Schema & Tables

Aapke MySQL database (`crm`) ke andar total **10 core tables** hain:

1. **`users`**:
   * Team members ki details: Name, Email, Password (bcrypt hash), Initials (`AP`, `DT`, `AL`, `SC`), Role Title.
2. **`roles` & `permissions`** (Spatie):
   * System roles: `Admin`, `Manager`, `Employee`.
3. **`model_has_roles`**:
   * Mapping table jo batati hai ki kis user ko kaun sa role mila hai.
4. **`projects`**:
   * Dynamic projects list: `Craftboard Project`, `Visionary Tasks`, `Demotion Project`, `Angular Studio`, `Cudemo Project`. Color codes aur project lead IDs.
5. **`project_user`**:
   * Pivot table connecting projects with assigned team members.
6. **`tasks`**:
   * Board ke saare task cards: Title, Description, Priority (`High`, `Medium`, `Low`), Status (`To-do`, `On Progress`, `In Review`, `Completed`), Category (`Dashboard`, `Mobile app`, `Backend`, `Database`), Assignee ID, Creator ID, Due Date.
7. **`comments`**:
   * Task detail modal ke andar team members dwara ki gayi live discussions.
8. **`task_activities`**:
   * Automatic Audit Trail log: Kisne kab task banaya, kisne status change kiya (old value vs new value).
9. **`task_attachments`**:
   * Uploaded spec sheets aur files ki metadata.
10. **`cache` / `jobs`**:
    * Session, cache aur background jobs tables.

### ⚡ Performance & Database Optimization:
* **Compound Indexing**:
  ```php
  $table->index(['project_id', 'status']); // Kanban column grouping fast karne ke liye
  $table->index('assigned_to');            // User task filtering fast karne ke liye
  ```
* **Eager Loading (Zero N+1 Queries)**:
  `ProjectController` me `.with(['assignee', 'creator'])` aur `.withCount(['comments', 'attachments'])` lagaya gaya hai, jisse saare 15 tasks sirf **2 SQL queries** me fetch hote hain.

---

## 5. Role-Based Access Control (RBAC)

Laravel Policies (`TaskPolicy` & `ProjectPolicy`) dwara strictly enforced:

| Capability | 👑 Super Admin (`admin@manageko.com`) | 💼 Manager (`manager@manageko.com`) | 👤 Employee (`alex@manageko.com`) | Policy Method |
| :--- | :---: | :---: | :---: | :--- |
| **View Projects** | ✅ All Projects | ✅ Member/Managed Projects | ✅ Member Projects | `ProjectPolicy@view` |
| **Create Project** | ✅ Yes | ✅ Yes | ❌ Restricted | `ProjectPolicy@create` |
| **Delete Project** | ✅ Strictly Admin Only | ❌ Forbidden | ❌ Forbidden | `ProjectPolicy@delete` |
| **Create Tasks** | ✅ Yes | ✅ Yes | ❌ Restricted | `TaskPolicy@create` |
| **Update Any Task** | ✅ Yes | ✅ Yes (Within project) | ❌ Forbidden | `TaskPolicy@update` |
| **Update Assigned Task Status** | ✅ Yes | ✅ Yes | ✅ Yes (Apne task ka status badal sakta hai) | `TaskPolicy@update` |
| **Add Comments** | ✅ Yes | ✅ Yes | ✅ Yes | Authenticated users |

---

## 6. How to Use the CRM (Kaise Use Karein?)

### Step 1: Login Screen
1. Browser me `http://localhost:8000` open karein.
2. Login page par **1-Click Demo Login** buttons diye gaye hain:
   * **Super Admin**: Alexander Pierce (Full god-mode rights)
   * **Manager**: David Taylor (Can create projects and tasks)
   * **Employee**: Alex Lee (Can only update his assigned tasks)
3. Kisi bhi button par click karein, password automatically apply ho kar aap dashboard par chale jayenge.

### Step 2: Left Sidebar Navigation
* **Workspace Branding**: Manageko. branding with company status.
* **Quick Links**: `Search (⌘K)`, `Notification (99+)`, `Calendar`, `Settings`.
* **Projects Switcher**: Kisi bhi project par click karke uska dedicated Kanban board load karein (`Craftboard Project`, `Visionary Tasks`, etc.).
* **Active User Profile**: Bottom-left me current logged-in user aur role badge dikhta hai.

### Step 3: Top Navigation & Action Controls
* **Breadcrumb**: `My Pages / Craftboard Project`.
* **Team Stack**: Team member avatars (`AP`, `DT`, `AL`, `SC`) aur `+ Invite` button.
* **View Switcher Tabs**:
  * **Kanban Tab**: 4-column visual board view.
  * **List Tab**: Tabular structured list view.
* **Realtime Filters**:
  * **Search Box**: Task name, category ya description likhkar instant filter karein.
  * **Priority Dropdown**: Sirf `High`, `Medium`, ya `Low` tasks filter karein.
* **`+ New Task` Button**: Naya task add karne ke liye modal open karein (Manager & Admin only).

### Step 4: 4-Column Kanban Board
* Columns: `To-do`, `On Progress`, `In Review`, `Completed`.
* Har column ke top par colored dot, column name, live counter badge aur quick `+` add button hai.
* Task card par category badge (`Dashboard`, `Mobile app`, etc.), priority pill (`High 🔴`, `Medium 🟡`, `Low 🔵`), assignee avatar circle, attachments count (`📎`) aur comments count (`💬`) display hote hain.

### Step 5: Task Detail Modal
* Kisi bhi task card par click karein.
* **Status Dropdown**: Status change karein (jaise hi change karenge, database me update ho jayega).
* **Assignee Badge**: Kis team member ko assign hai uski photo aur role dikhta hai.
* **Discussion / Comments**: Naya comment type karke **Post** karein, wo turant thread me jud jata hai.
* **Activity Log**: Chronological audit history dikhata hai ki task kisne create kiya aur kab status badla.

---

## 7. How to Run Locally (Local Setup Guide)

### Prerequisites:
* **XAMPP** (Apache & MySQL start hone chahiye)
* **PHP 8.2+** (`C:\xampp\php`)
* **Composer** (`C:\ProgramData\ComposerSetup\bin`)
* **Node.js 18+ & npm**

### Steps:
```bash
# 1. Project Directory me jayein
cd d:\crm

# 2. Dependencies install karein (Agar pehli baar setup ho raha ho)
composer install
npm install

# 3. Environment configuration
# Ensure .env has: DB_DATABASE=crm, DB_USERNAME=root, DB_PASSWORD=

# 4. Database Migrate & Seed karein
php artisan migrate:fresh --seed

# 5. Production assets build karein
npm run build

# 6. Start the Local Server
php artisan serve
```
Ab browser me open karein: **`http://127.0.0.1:8000`**

*(Development mode me real-time frontend hot-reload ke liye dusre terminal me `npm run dev` chala sakte hain).*

---

## 8. Interview & Presentation Guide

Jab aap interview ya client presentation me is project ko present karein:

1. **"Inertia.js choose karne ka kya fayda hua?"**  
   *👉 Answer:* Inertia ne REST API aur client-side state management (Redux) ka duplicate boilerplate khatam kar diya. Backend Laravel routing aur authorization handle karta hai, jabki frontend React modern SPA speed deta hai.

2. **"Database query load ko kaise optimize kiya?"**  
   *👉 Answer:* Eager Loading (`with(['assignee', 'creator'])`) aur Database Aggregates (`withCount(['comments', 'attachments'])`) use karke N+1 query problem ko 100% eliminate kiya. Pura 4-column board sirf 2 SQL queries me execute hota hai. Saath hi compound indexes `(project_id, status)` queries ko instant banate hain.

3. **"Security aur authorization kaise enforce ki gayi hai?"**  
   *👉 Answer:* Dual-layer security. First, **Spatie Laravel Permission** roles assign karta hai. Second, **Laravel Policies** (`TaskPolicy`, `ProjectPolicy`) controller boundary par verify karte hain ki koi normal employee project delete na kar sake ya kisi aur ka assigned task edit na kare.
