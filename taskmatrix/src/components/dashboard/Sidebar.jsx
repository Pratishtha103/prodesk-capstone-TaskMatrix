export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r p-4">
      <nav className="flex flex-col gap-3">
        <button className="text-left">Dashboard</button>
        <button className="text-left">Team</button>
        <button className="text-left">Activity Feed</button>
      </nav>
    </aside>
  );
}