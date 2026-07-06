export default function Header({ user, onLogout }) {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div>
        <h1 className="text-2xl font-semibold">TaskMatrix</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">{user?.email}</span>
        <button
          onClick={onLogout}
          className="border px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}