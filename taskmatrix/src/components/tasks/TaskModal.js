"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, editTask, deleteTaskFromState } from "@/redux/features/taskSlice";
import { createTask, updateTask, deleteTask, getAllUsers } from "@/services/taskService";
import { isTaskOverdue } from "@/utils/date";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TaskModal({ isOpen, onClose, task }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "todo",
    dueDate: "",
    assigneeId: "",
    assigneeName: "",
    subtasks: [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [aiLoadingSubtasks, setAiLoadingSubtasks] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersList = await getAllUsers();
        setRegisteredUsers(usersList);
      } catch (err) {
        console.error("Failed to load registered users:", err);
      }
    }

    if (isOpen && user?.role === "Admin") {
      fetchUsers();
    }
  }, [isOpen, user?.role]);

  useEffect(() => {
    if (isOpen) {
      setSubmitting(false);
      setErrors({});
      setShowDeleteConfirm(false);
      if (task) {
        setFormData({
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "Medium",
          status: task.status || "todo",
          dueDate: task.dueDate || "",
          assigneeId: task.assigneeId || "",
          assigneeName: task.assigneeName || "",
          subtasks: task.subtasks || [],
        });
      } else if (user) {
        setFormData({
          title: "",
          description: "",
          priority: "Medium",
          status: "todo",
          dueDate: "",
          assigneeId: user.uid,
          assigneeName: user.name || user.email || "Me",
          subtasks: [],
        });
      }
    }
  }, [isOpen, task, user]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function handleAssigneeChange(e) {
    const selectedId = e.target.value;
    let name = "User";
    if (user && selectedId === user.uid) {
      name = user.name || user.email || "Me";
    } else {
      const member = registeredUsers.find((m) => m.id === selectedId);
      if (member) {
        name = member.name;
      }
    }
    setFormData((prev) => ({
      ...prev,
      assigneeId: selectedId,
      assigneeName: name,
    }));
    if (errors.assigneeId) {
      setErrors((prev) => ({
        ...prev,
        assigneeId: "",
      }));
    }
  }

  function validate() {
    const tempErrors = {};
    if (!formData.title.trim()) {
      tempErrors.title = "Task title is required.";
    }
    if (!formData.dueDate) {
      tempErrors.dueDate = "Due date is required.";
    }
    if (!formData.assigneeId) {
      tempErrors.assigneeId = "Assignee is required.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function handleGenerateSubsteps() {
    if (!formData.title.trim()) {
      const msg = "Please enter a task title first to generate sub-steps.";
      setErrors((prev) => ({ ...prev, title: msg }));
      toast.error(msg);
      return;
    }

    try {
      setAiLoadingSubtasks(true);
      
      const response = await fetch("/api/ai/task-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate subtasks");
      }

      const data = await response.json();
      const generated = (data.subtasks || []).map((text) => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
      }));

      setFormData((prev) => ({
        ...prev,
        subtasks: [...prev.subtasks, ...generated],
      }));
      toast.success("Sub-steps generated");
    } catch (err) {
      console.error("Failed to generate AI subtasks:", err);
      toast.error("Failed to auto-generate sub-steps. Please try again.");
    } finally {
      setAiLoadingSubtasks(false);
    }
  }

  function handleAddSubtask() {
    if (!newSubtaskText.trim()) return;
    const newSubtask = {
      id: crypto.randomUUID(),
      text: newSubtaskText.trim(),
      completed: false,
    };
    setFormData((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask],
    }));
    setNewSubtaskText("");
  }

  function handleDeleteSubtask(subtaskId) {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((s) => s.id !== subtaskId),
    }));
  }

  function handleToggleSubtask(subtaskId) {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      ),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (!user?.uid) {
      toast.error("User not found.");
      return;
    }

    try {
      setSubmitting(true);

      if (task) {
        // Edit flow
        const updatedTask = await updateTask(task.id, {
          ...formData,
          createdAt: task.createdAt,
          createdBy: task.createdBy,
        }, user, task);
        dispatch(editTask(updatedTask));
        toast.success("Task updated successfully");
      } else {
        // Create flow
        const newTask = await createTask(formData, user);
        dispatch(addTask(newTask));
        toast.success("Task created successfully");
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error(task ? "Failed to update task." : "Failed to create task.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDeleteClick() {
    setShowDeleteConfirm(true);
  }

  async function confirmDeleteAction() {
    if (!task) return;
    try {
      setSubmitting(true);
      await deleteTask(task.id, task, user);
      dispatch(deleteTaskFromState(task.id));
      toast.success("Task deleted successfully");
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface p-4 sm:p-6 shadow-lg max-h-[95vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-semibold">
          {task ? "Edit Task" : "Create Task"}
        </h2>

        {task && isTaskOverdue(task.dueDate, task.status) && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-800 text-sm">
            <svg className="w-5 h-5 text-amber-500 fill-current shrink-0" viewBox="0 0 20 20">
              <path d="M8.219 2.068a1 1 0 011.562 0l7.354 10.366A1 1 0 0116.326 14H3.674a1 1 0 01-.781-1.566l7.326-10.366zM9 5v4a1 1 0 102 0V5a1 1 0 10-2 0zm1 7a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <span className="font-medium">Alert: This task is overdue! Please update its status or adjust the due date.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={formData.title}
              disabled={user?.role !== "Admin"}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 text-text-main bg-surface disabled:bg-surface-muted disabled:text-text-muted ${
                errors.title ? "border-red-500 focus:ring-red-500/20" : "border-secondary"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1 pl-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              disabled={user?.role !== "Admin"}
              onChange={handleChange}
              className="w-full rounded-md border border-secondary px-3 py-2 text-text-main bg-surface disabled:bg-surface-muted disabled:text-text-muted"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                disabled={user?.role !== "Admin"}
                onChange={handleChange}
                className="w-full rounded-md border border-secondary px-3 py-2 text-text-main bg-surface disabled:bg-surface-muted disabled:text-text-muted"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-secondary px-3 py-2 text-text-main bg-surface"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                name="assigneeId"
                value={formData.assigneeId}
                disabled={user?.role !== "Admin"}
                onChange={handleAssigneeChange}
                className={`w-full rounded-md border px-3 py-2 text-text-main bg-surface disabled:bg-surface-muted disabled:text-text-muted ${
                  errors.assigneeId ? "border-red-500 focus:ring-red-500/20" : "border-secondary"
                }`}
              >
                <option value="">Select Assignee</option>
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
              {errors.assigneeId && (
                <p className="text-xs text-red-500 mt-1 pl-1">{errors.assigneeId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                disabled={user?.role !== "Admin"}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-text-main bg-surface disabled:bg-surface-muted disabled:text-text-muted ${
                  errors.dueDate ? "border-red-500 focus:ring-red-500/20" : "border-secondary"
                }`}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-500 mt-1 pl-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="pt-1 sm:pt-2">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                Subtasks / Checklist
              </label>
              {user?.role === "Admin" && (
                <button
                  type="button"
                  onClick={handleGenerateSubsteps}
                  disabled={aiLoadingSubtasks}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  {aiLoadingSubtasks ? "Generating..." : "Auto-generate Sub-steps"}
                </button>
              )}
            </div>

            {/* List of subtasks */}
            <div className="space-y-1 mb-2 border border-secondary rounded-lg p-1.5 sm:p-2 bg-surface-muted">
              {formData.subtasks && formData.subtasks.length > 0 ? (
                formData.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-start justify-between gap-2 p-0.5 sm:p-1 rounded hover:bg-surface transition-colors">
                    <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none text-text-main flex-1">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id)}
                        className="mt-0.5 rounded border-secondary text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer shrink-0"
                      />
                      <span className={subtask.completed ? "line-through text-text-muted text-xs font-medium" : "text-text-main text-xs font-medium"}>
                        {subtask.text}
                      </span>
                    </label>
                    {user?.role === "Admin" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        className="text-text-muted hover:text-red-600 p-1 rounded hover:bg-surface-muted transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted italic py-1 text-center">No sub-steps added yet.</p>
              )}
            </div>

            {/* Add new subtask input (Admins only) */}
            {user?.role === "Admin" && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a step manually..."
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  className="flex-1 rounded-md border border-secondary px-3 py-1.5 text-xs text-text-main bg-surface"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="border border-secondary p-1.5 rounded-md text-text-main hover:bg-surface-muted transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-secondary">
            {task && user?.role === "Admin" && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={submitting}
                className="w-full sm:w-auto rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors mr-auto"
              >
                Delete
              </button>
            )}

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto text-center rounded-md border border-secondary px-4 py-2 hover:bg-surface-muted transition-colors text-text-main cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto text-center rounded-md bg-black px-4 py-2 text-white hover:bg-black/90 transition-colors cursor-pointer"
              >
                {submitting
                  ? task
                    ? "Saving..."
                    : "Creating..."
                  : task
                  ? "Save Changes"
                  : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-xl border border-secondary space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-bold">Delete Task</h3>
            </div>
            <p className="text-sm text-text-muted">
              Are you sure you want to delete <strong>"{formData.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-md border border-secondary px-4 py-2 hover:bg-surface-muted transition-colors text-sm text-text-main"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                disabled={submitting}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}