import { LogOut } from "lucide-react";
import Link from "next/link";

export default function Header({ user, onLogout, onLogoClick }) {
  return (
    <header className="flex items-center justify-between border-b border-secondary p-4 bg-white">
      <Link 
        href="/dashboard"
        onClick={(e) => {
          if (onLogoClick) onLogoClick();
        }}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity select-none"
      >
        <img src="/Logo.png" alt="TaskMatrix Logo" className="w-8 h-8 object-contain" />
        <h1 className="text-2xl font-semibold text-primary">TaskMatrix</h1>
      </Link>

      <div className="flex items-center gap-4">
        <div 
          className="flex items-center gap-2 select-none cursor-help"
          title={user?.email}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-650 shadow-sm border border-secondary flex-shrink-0">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Logout"
          className="p-2 rounded-md text-text-main hover:bg-red-50 hover:text-red-650 transition-all flex items-center justify-center cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}