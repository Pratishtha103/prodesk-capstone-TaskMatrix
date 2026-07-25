import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No tasks found",
  description = "Get started by adding a task to your board.",
  icon: Icon = Inbox,
  ctaText = "",
  onCtaClick = null,
  showCta = false,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-surface rounded-xl border border-secondary shadow-sm select-none max-w-sm mx-auto my-4 transition-all duration-200">
      {/* Icon Area */}
      <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm border border-secondary">
        <Icon className="w-6 h-6" />
      </div>

      {/* Header */}
      <h3 className="text-base font-semibold text-text-main mb-1.5 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-text-muted max-w-xs mb-5 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {showCta && ctaText && onCtaClick && (
        <button
          type="button"
          onClick={onCtaClick}
          className="rounded-md border bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white hover:bg-black/90 px-4 py-2 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
}
