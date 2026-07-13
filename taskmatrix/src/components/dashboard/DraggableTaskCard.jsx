"use client";

import { useDraggable } from "@dnd-kit/core";
import { isTaskOverdue } from "@/utils/date";
export default function DraggableTaskCard({ task, onTaskClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High":
        return {
          border: "border-2 border-red-500",
        };
      case "Medium":
        return {
          border: "border-2 border-amber-500",
        };
      case "Low":
      default:
        return {
          border: "border-2 border-emerald-500",
        };
    }
  };

  const styles = getPriorityStyles(task.priority);

  // Apply translation styling when dragging
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.4 : 1,
        cursor: "grabbing",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        // Prevent click if we were dragging, although dnd-kit sensor usually handles it
        onTaskClick && onTaskClick(task);
      }}
      className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-grab active:cursor-grabbing ${styles.border}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-text-main leading-snug">
          {task.title}
        </h4>
      </div>

      {task.description && (
        <p className="text-sm text-text-muted line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary">
        <div className={`flex items-center gap-1.5 text-xs ${
          isTaskOverdue(task.dueDate, task.status) ? "text-amber-600 font-semibold" : "text-text-muted"
        }`}>
          {isTaskOverdue(task.dueDate, task.status) ? (
            <svg className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 20 20" title="Overdue!">
              <path d="M8.219 2.068a1 1 0 011.562 0l7.354 10.366A1 1 0 0116.326 14H3.674a1 1 0 01-.781-1.566l7.326-10.366zM9 5v4a1 1 0 102 0V5a1 1 0 10-2 0zm1 7a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
          <span>{task.dueDate}</span>
        </div>

        {task.assigneeName && (
          <div className="flex items-center gap-1.5 max-w-[150px] select-none" title={task.assigneeName}>
            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-650 shadow-sm border border-secondary flex-shrink-0">
              {task.assigneeName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-medium text-text-main truncate max-w-[100px]">
              {task.assigneeName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
