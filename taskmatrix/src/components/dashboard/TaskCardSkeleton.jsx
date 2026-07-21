export default function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-secondary animate-pulse pointer-events-none select-none">
      {/* Title placeholder */}
      <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-3"></div>

      {/* Description lines placeholder */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
        <div className="h-3 bg-gray-200 rounded-md w-5/6"></div>
      </div>

      {/* Footer divider */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary">
        {/* Left side: Due date placeholder */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded-md w-16"></div>
        </div>

        {/* Right side: Assignee placeholder */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded-md w-12"></div>
        </div>
      </div>
    </div>
  );
}
