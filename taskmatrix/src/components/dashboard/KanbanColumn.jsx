"use client";

import { useDroppable } from "@dnd-kit/core";
import DraggableTaskCard from "./DraggableTaskCard";

export default function KanbanColumn({ id, title, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border p-4 min-h-[350px] transition-colors duration-200 ${
        isOver ? "bg-indigo-50/50 border-indigo-200" : "bg-white border-secondary"
      }`}
    >
      <h3 className="mb-4 text-lg font-semibold text-text-main flex items-center justify-between">
        <span>{title}</span>
        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
          {tasks.length}
        </span>
      </h3>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-200 p-8 text-center bg-white">
            <p className="text-sm text-gray-400">No tasks</p>
          </div>
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