"use client";

import { useEffect, useState } from "react";
import { subscribeToActivityFeed } from "@/services/activityService";
import EmptyState from "@/components/common/EmptyState";

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActivityFeed((data) => {
      setActivities(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "edited":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "moved":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "deleted":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title="No Recent Activity"
          description="There hasn't been any task activity in the past 24 hours."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-2">
      
      <div className="relative border-l border-secondary ml-4 md:ml-6 space-y-8 pb-10">
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-6 sm:pl-8">
            {/* Timeline dot */}
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-secondary border-2 border-background"></div>
            
            <div className="bg-surface border border-secondary rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300 border border-secondary">
                  {activity.userName.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="text-sm text-text-main">
                  <span className="font-semibold">{activity.userName}</span>
                  <span className="text-text-muted">
                    {activity.action === "moved" ? " moved task " : ` ${activity.action} task `}
                  </span>
                  <span className="font-medium">"{activity.taskTitle}"</span>
                  {activity.action === "moved" && (
                    <span className="text-text-muted">
                      {" to "}
                      <span className="font-medium">
                        {activity.statusTo === "todo" ? "To Do" : activity.statusTo === "inprogress" ? "In Progress" : "Done"}
                      </span>
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-text-muted">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Tag */}
              <div className="flex-shrink-0 self-start sm:self-center">
                <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getActionColor(activity.action)}`}>
                  {activity.action}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
