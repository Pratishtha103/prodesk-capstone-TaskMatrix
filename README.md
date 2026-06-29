# PRD (Product Requirements Document)

## Project Name: TaskMatrix

Description: TaskMatrix is a frontend task management application designed for a single software project with multiple team members. It focuses on Kanban-based task tracking, assignment, prioritization, and collaboration through a modern, responsive interface.

## Track

Frontend

## Tech Stack

* Next.js 15 (App Router)

* React

* Tailwind CSS

* Redux Toolkit

* dnd-kit

* React Hook Form

* localStorage

* db.json (mock data)

## Prioritized Core Features

### Priority 1: Sprint 14 - MVP

Objective: Build a functional task management interface.

#### Authentication

* Login UI

* Register UI

* Protected Dashboard (Frontend only)

#### Dashboard

* Responsive Dashboard Layout

* Sidebar Navigation

* Top Navigation Bar

#### Kanban Board

* Display Kanban Board (To Do, In Progress, Done)

* Display Task Cards using Mock Data

#### Task Management

* View Task Details

* Create New Task

### Priority 2: Sprint 15 - Feature Completion

Objective: Complete all core task management features.

#### Task Management

* Edit Existing Tasks

* Delete Tasks

* Drag-and-Drop Kanban Board

* Task Assignment (Mock Team Members)

* Priority Tagging

* Due Date Management

#### Search & Filters

* Search Tasks

* Filter by Status

* Filter by Priority

#### Data Persistence

* Redux Toolkit State Management

* Persist Data with LocalStorage

### Priority 3: Sprint 16 - AI & UX Polish

Objective: Enhance usability and user experience.

#### AI Feature

* AI-generated Task Description Suggestions

#### User Experience

* Dark/Light Theme

* Toast Notifications

* Form Validation

* Loading & Empty States

* Fully Responsive Mobile UI

#### Activity Feed

* Frontend Activity Log (Create, Edit, Delete, Move)

### Priority 4: Sprint 17 – Deployment

Objective: Prepare the application for production.

#### Finalization

* Performance Optimization

* Code Refactoring

* Final UI Polish

* Deploy on Vercel

* Update README with Screenshots & Live Demo

## Public Figma Wireframe Link

## State Tree Diagram

## Mock API endpoints

### Authentication

* POST   /api/auth/login

* POST   /api/auth/register

* GET    /api/auth/me

### Tasks

* GET    /api/tasks

* GET    /api/tasks/:id

* POST   /api/tasks

* PUT    /api/tasks/:id

* DELETE /api/tasks/:id

### Users

* GET    /api/users

### Activity

* GET   /api/activity

### AI

* POST   /api/ai/task-suggestion
