export default function KanbanColumn({ title, tasks }) {
  return (
    <div className="rounded-lg border p-4 bg-white min-h-[300px]">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="rounded-md border p-3 shadow-sm">
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-sm text-gray-500">{task.priority}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}