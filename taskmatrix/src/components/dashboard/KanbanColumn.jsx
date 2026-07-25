"use client";

import { useDroppable } from "@dnd-kit/core";
import { ClipboardList } from "lucide-react";
import DraggableTaskCard from "./DraggableTaskCard";
import EmptyState from "../common/EmptyState";

export default function KanbanColumn({ id, title, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border p-4 min-h-87.5 transition-colors duration-200 ${
        isOver
          ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
          : "bg-surface border-secondary"
      }`}
    >
      <h3 className="mb-4 text-lg font-semibold text-text-main flex items-center justify-between">
        <span>{title}</span>
        <span className="text-xs bg-secondary/60 text-text-muted px-2 py-0.5 rounded-full font-medium">
          {tasks.length}
        </span>
      </h3>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks"
            description="Drag or create a task here."
            icon={ClipboardList}
          />
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
}