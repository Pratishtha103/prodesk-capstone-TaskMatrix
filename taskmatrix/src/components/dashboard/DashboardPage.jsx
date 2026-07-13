"use client";


import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { clearUser } from "@/redux/features/authSlice";
import Sidebar from "./Sidebar";
import Header from "./Header";
import KanbanColumn from "./KanbanColumn";
import AnalyticsPanel from "./AnalyticsPanel";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  setTasks,
  setTasksLoading,
  setTasksError,
  editTask,
} from "@/redux/features/taskSlice";
import { getTasksByUser, updateTask, getAllUsers } from "@/services/taskService";
import TaskModal from "@/components/tasks/TaskModal";
import { isTaskOverdue } from "@/utils/date";

const mockTasks = [
  { id: 1, title: "Design login page", priority: "High", status: "todo" },
  { id: 2, title: "Connect Firebase auth", priority: "Medium", status: "inprogress" },
  { id: 3, title: "Build dashboard layout", priority: "Low", status: "done" },
  { id: 4, title: "Prepare Kanban board UI", priority: "High", status: "todo" },
];

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [activeView, setActiveView] = useState("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { user, isAuthenticated, isAuthReady } = useSelector(
    (state) => state.auth
  );

  const { items: tasks, loading, error } = useSelector(
    (state) => state.tasks
  );

  const overdueTasks = useMemo(() => {
    return tasks.filter((task) => isTaskOverdue(task.dueDate, task.status));
  }, [tasks]);

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthReady, isAuthenticated, router]);

  async function handleLogout() {
    try {
      await signOut(auth);
      dispatch(clearUser());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function handleTaskClick(task) {
    setActiveTask(task);
    setIsTaskModalOpen(true);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // 'todo', 'inprogress', 'done'

    const taskToMove = tasks.find((t) => t.id === taskId);
    if (!taskToMove || taskToMove.status === newStatus) return;

    const updatedTask = {
      ...taskToMove,
      status: newStatus,
    };

    // Optimistically update
    dispatch(editTask(updatedTask));

    try {
      await updateTask(taskId, updatedTask);
    } catch (err) {
      console.error("Failed to update status on drag and drop:", err);
      // Revert status on failure
      dispatch(editTask(taskToMove));
    }
  }

  useEffect(() => {
    async function fetchTasks() {
      if (!user?.uid) return;

      try {
        dispatch(setTasksLoading(true));
        dispatch(setTasksError(null));

        const userTasks = await getTasksByUser(user.uid, user.role);
        dispatch(setTasks(userTasks));
      } catch (err) {
        dispatch(setTasksError("Failed to load tasks."));
        console.error(err);
      } finally {
        dispatch(setTasksLoading(false));
      }
    }

    if (isAuthReady && isAuthenticated && user?.uid) {
      fetchTasks();
    }
  }, [dispatch, isAuthReady, isAuthenticated, user?.uid, user?.role]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersList = await getAllUsers();
        setRegisteredUsers(usersList);
      } catch (err) {
        console.error("Failed to load registered users:", err);
      }
    }
    if (isAuthReady && isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthReady, isAuthenticated]);

  if (!isAuthReady) return <p>Checking authentication...</p>;
  if (!isAuthenticated) return null;
  

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    const matchesAssignee =
      assigneeFilter === "All" || task.assigneeId === assigneeFilter;

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const todoTasks = filteredTasks.filter((task) => task.status === "todo");
  const inProgressTasks = filteredTasks.filter((task) => task.status === "inprogress");
  const doneTasks = filteredTasks.filter((task) => task.status === "done");

  if (loading) {
    return <p>Loading tasks...</p>;
  }
  {error && <p className="text-red-500">{error}</p>}

  const uniqueTeamMembers = [];
  const seenEmails = new Set();

  if (user) {
    seenEmails.add(user.email.toLowerCase());
    uniqueTeamMembers.push({
      id: user.uid,
      name: `${user.name || "User"} (Me)`,
      email: user.email,
    });
  }

  registeredUsers.forEach((u) => {
    const emailLower = u.email ? u.email.toLowerCase() : "";
    if (emailLower && !seenEmails.has(emailLower)) {
      seenEmails.add(emailLower);
      uniqueTeamMembers.push(u);
    }
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
     
      <Header user={user} onLogout={handleLogout} onLogoClick={() => setActiveView("board")} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={activeView} onViewChange={setActiveView} teamMembers={uniqueTeamMembers} />      

        <main className="flex-1 p-6 space-y-8 overflow-y-auto h-full">
          <section className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-main">
                {activeView === "board" ? "Project Overview" : "Analytics Dashboard"}
              </h2>
              <p className="text-sm text-text-muted">
                {activeView === "board"
                  ? `Welcome back, ${user?.name || "User"}`
                  : "Aggregate task metrics and performance charts."}
              </p>
            </div>

            {activeView === "board" && user?.role === "Admin" && (
              <button
                onClick={() => {
                  setActiveTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="rounded-md border bg-black text-white hover:bg-black/90 px-4 py-2 text-sm font-semibold transition-colors shadow-sm"
              >
                + Create Task
              </button>
            )}
          </section>

          {activeView === "board" && overdueTasks.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm text-sm text-amber-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M8.219 2.068a1 1 0 011.562 0l7.354 10.366A1 1 0 0116.326 14H3.674a1 1 0 01-.781-1.566l7.326-10.366zM9 5v4a1 1 0 102 0V5a1 1 0 10-2 0zm1 7a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-amber-900">Overdue Tasks Alert</p>
                  <p className="text-xs text-amber-700">
                    You have <span className="font-bold text-amber-800">{overdueTasks.length}</span> overdue task(s) active on your board. Please update their status to "Done" or modify their due dates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeView === "board" && (
            <section className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-secondary shadow-sm">
              <div className="flex-1 w-full relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary rounded-md text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-md border border-secondary px-3 py-2 text-sm text-text-main bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>

                {user?.role === "Admin" && (
                  <select
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                    className="rounded-md border border-secondary px-3 py-2 text-sm text-text-main bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="All">All Assignees</option>
                    {user && (
                      <option value={user.uid}>
                        Me ({user.name || user.email || "User"})
                      </option>
                    )}
                    {registeredUsers
                      .filter((member) => member.id !== user?.uid && member.email !== user?.email)
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                  </select>
                )}

                {(searchQuery || priorityFilter !== "All" || assigneeFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setPriorityFilter("All");
                      setAssigneeFilter("All");
                    }}
                    className="text-xs text-red-600 hover:text-red-755 font-semibold px-2 py-1 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </section>
          )}

          {activeView === "board" ? (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-text-main">Kanban Board</h2>
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="grid gap-4 md:grid-cols-3 items-start">
                  <KanbanColumn
                    id="todo"
                    title="To Do"
                    tasks={todoTasks}
                    onTaskClick={handleTaskClick}
                  />
                  <KanbanColumn
                    id="inprogress"
                    title="In Progress"
                    tasks={inProgressTasks}
                    onTaskClick={handleTaskClick}
                  />
                  <KanbanColumn
                    id="done"
                    title="Done"
                    tasks={doneTasks}
                    onTaskClick={handleTaskClick}
                  />
                </div>
              </DndContext>
            </section>
          ) : (
            <AnalyticsPanel tasks={tasks} />
          )}
        </main>
      </div>
      <TaskModal
        isOpen={isTaskModalOpen}
        task={activeTask}
        onClose={() => {
          setIsTaskModalOpen(false);
          setActiveTask(null);
        }}
      />
    </div>
  );
}