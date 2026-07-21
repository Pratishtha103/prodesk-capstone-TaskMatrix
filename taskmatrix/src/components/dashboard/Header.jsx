import { useState, useRef, useEffect } from "react";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";

export default function Header({ user, onLogout, onLogoClick, onToggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-secondary p-4 bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
          className="p-2 -ml-2 rounded-md text-text-main hover:bg-gray-100 transition-all flex items-center justify-center cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

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
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-650 shadow-sm border border-secondary shrink-0 hover:bg-indigo-100 transition-colors cursor-pointer select-none"
            title="View Profile Details"
          >
            {(user?.name || "U").charAt(0).toUpperCase()}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-secondary bg-white p-4 shadow-md z-50 text-left">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">User Profile</p>
              <p className="text-sm font-semibold text-text-main truncate" title={user?.name}>
                {user?.name || "No Username"}
              </p>
              <p className="text-xs text-text-muted truncate mt-0.5" title={user?.email}>
                {user?.email || "No Email"}
              </p>
              <div className="mt-3 pt-3 border-t border-secondary flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block w-fit">
                  Role: {user?.role || "Member"}
                </span>
              </div>
            </div>
          )}
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