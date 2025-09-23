import { Building2 } from "lucide-react";

const SkeletonLoader = ({ type = "card", count = 1 }) => {
  const renderCardSkeleton = () => (
    <div className="card animate-pulse">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-4">
          {/* Photo skeleton */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>

          {/* Actions skeleton */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="card-compact animate-pulse">
      <div className="flex items-center space-x-4">
        {/* Photo skeleton */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
          <div className="flex items-center space-x-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const renderStatsSkeleton = () => (
    <div className="card-compact animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-600" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="card animate-pulse">
      <div className="space-y-8">
        {/* Form fields skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        ))}

        {/* Photo upload skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex space-x-4 pt-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"></div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case "card":
        return renderCardSkeleton();
      case "list":
        return renderListSkeleton();
      case "stats":
        return renderStatsSkeleton();
      case "form":
        return renderFormSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  if (count === 1) {
    return renderContent();
  }

  return (
    <div
      className={type === "card" ? "grid grid-responsive gap-6" : "space-y-4"}
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          {renderContent()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
