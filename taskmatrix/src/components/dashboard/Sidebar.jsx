"use client";

import { useState } from "react";

export default function Sidebar({ currentView, onViewChange, isOpen, onClose, teamMembers = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNavClick = (view) => {
    if (onViewChange) onViewChange(view);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      if (onClose) onClose();
    }
  };

  return (
    <aside className={`fixed md:relative inset-y-0 left-0 z-40 md:z-auto h-full overflow-y-auto border-r border-secondary bg-surface flex flex-col justify-between transition-all duration-300 ease-in-out ${
      isOpen
        ? "w-64 p-4 translate-x-0"
        : "-translate-x-full md:translate-x-0 w-0 p-0 border-none overflow-hidden"
    }`}>
      <div className="space-y-6">
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between md:hidden pb-4 border-b border-secondary">
          <div className="flex items-center gap-2">
            <img src="/Logo.png" alt="TaskMatrix Logo" className="w-6 h-6 object-contain" />
            <span className="text-lg font-semibold text-primary">TaskMatrix</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-surface-muted text-text-muted cursor-pointer"
            title="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => handleNavClick("board")}
            className={`text-left px-4 py-2.5 rounded-md font-medium transition-colors text-sm cursor-pointer ${
              currentView === "board"
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "text-text-muted hover:bg-surface-muted"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick("analytics")}
            className={`text-left px-4 py-2.5 rounded-md font-medium transition-colors text-sm cursor-pointer ${
              currentView === "analytics"
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "text-text-muted hover:bg-surface-muted"
            }`}
          >
            Analytics Panel
          </button>
          <button
            onClick={() => handleNavClick("activity")}
            className={`text-left px-4 py-2.5 rounded-md font-medium transition-colors text-sm cursor-pointer ${
              currentView === "activity"
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "text-text-muted hover:bg-surface-muted"
            }`}
          >
            Activity Feed
          </button>
        </nav>

        <div className="pt-4 border-t border-secondary">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full px-4 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 hover:text-text-main transition-colors cursor-pointer"
          >
            <span>Team Members</span>
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded && (
            <div className="flex flex-col gap-2 px-4 transition-all duration-300">
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2.5 py-1 text-sm text-text-main">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300 shadow-sm border border-secondary">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate font-medium">{member.name}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-text-muted italic">No registered members</span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}