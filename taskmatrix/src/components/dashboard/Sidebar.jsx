"use client";

import { useState } from "react";

export default function Sidebar({ currentView, onViewChange, teamMembers = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className="w-64 h-full overflow-y-auto border-r border-secondary p-4 bg-white flex flex-col justify-between">
      <div className="space-y-6">
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => onViewChange && onViewChange("board")}
            className={`text-left px-4 py-2.5 rounded-md font-medium transition-colors text-sm ${
              currentView === "board"
                ? "bg-indigo-50 text-indigo-700"
                : "text-text-muted hover:bg-gray-50"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onViewChange && onViewChange("analytics")}
            className={`text-left px-4 py-2.5 rounded-md font-medium transition-colors text-sm ${
              currentView === "analytics"
                ? "bg-indigo-50 text-indigo-700"
                : "text-text-muted hover:bg-gray-50"
            }`}
          >
            Analytics Panel
          </button>
          <button className="text-left px-4 py-2.5 rounded-md font-medium text-sm text-text-muted cursor-not-allowed opacity-50">
            Activity Feed (Coming Soon)
          </button>
        </nav>

        <div className="pt-4 border-t border-secondary">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full px-4 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 hover:text-text-main transition-colors"
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
                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-650 shadow-sm border border-secondary">
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