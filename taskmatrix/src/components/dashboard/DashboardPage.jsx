"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { clearUser } from "@/redux/features/authSlice";
import Sidebar from "./Sidebar";
import Header from "./Header";
import KanbanColumn from "./KanbanColumn";

const mockTasks = [
  { id: 1, title: "Design login page", priority: "High", status: "todo" },
  { id: 2, title: "Connect Firebase auth", priority: "Medium", status: "inprogress" },
  { id: 3, title: "Build dashboard layout", priority: "Low", status: "done" },
  { id: 4, title: "Prepare Kanban board UI", priority: "High", status: "todo" },
];

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isAuthReady } = useSelector(
    (state) => state.auth
  );

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

  if (!isAuthReady) return <p>Checking authentication...</p>;
  if (!isAuthenticated) return null;

  const todoTasks = mockTasks.filter((task) => task.status === "todo");
  const inProgressTasks = mockTasks.filter((task) => task.status === "inprogress");
  const doneTasks = mockTasks.filter((task) => task.status === "done");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
     
      <Header user={user} onLogout={handleLogout} />

      <div className="flex">
        <Sidebar />      

        <main className="p-6 space-y-8 w-full">
          <section className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Project Overview</h2>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name || "User"}
              </p>
            </div>

            <button className="rounded-md border px-4 py-2">
              + Create Task
            </button>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Kanban Board</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <KanbanColumn title="To Do" tasks={todoTasks} />
              <KanbanColumn title="In Progress" tasks={inProgressTasks} />
              <KanbanColumn title="Done" tasks={doneTasks} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}