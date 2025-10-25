import { useEffect, useState } from "react";
import { Calendar, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

const FilterBar = ({ onFilterChange, value }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: [],
  });

  // Sync fields from parent value (so chips actions reflect in modal)
  useEffect(() => {
    if (!value) return;
    const next = {
      startDate: value.startDate || "",
      endDate: value.endDate || "",
      status: value.status || [],
    };
    if (
      next.startDate !== filters.startDate ||
      next.endDate !== filters.endDate ||
      JSON.stringify(next.status) !== JSON.stringify(filters.status)
    ) {
      setFilters(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.startDate, value?.endDate, value?.status]);

  // Close on Escape
  useEffect(() => {
    if (!showFilters) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowFilters(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showFilters]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (showFilters) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [showFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (statusValue) => {
    const newStatus = filters.status.includes(statusValue)
      ? filters.status.filter(s => s !== statusValue)
      : [...filters.status, statusValue];
    
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { startDate: "", endDate: "", status: [] };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.startDate || filters.endDate || filters.status.length > 0;

  const getFilterSummary = () => {
    if (!hasActiveFilters) return null;

    const parts = [];
    if (filters.startDate) {
      parts.push(`From ${new Date(filters.startDate).toLocaleDateString()}`);
    }
    if (filters.endDate) {
      parts.push(`To ${new Date(filters.endDate).toLocaleDateString()}`);
    }
    return parts.join(" • ");
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors duration-200">
              <Filter className="h-4 w-4" />
            </div>
            <span className="font-medium">Filters</span>
          </div>

          {hasActiveFilters && (
            <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-2 py-1 rounded-full font-medium">
              Active
            </span>
          )}

          <div className="p-1">
            {showFilters ? (
              <ChevronUp className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            )}
          </div>
        </button>
      </div>

      {/* Active filter chips are rendered in Home.jsx */}

      {/* Modal Dialog */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Filter dialog"
          onClick={() => setShowFilters(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-compact animate-slide-up">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close filter dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                    className="input-field"
                    max={filters.endDate || undefined}
                  />
                  {filters.startDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Showing applications from{" "}
                      {new Date(filters.startDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                    className="input-field"
                    min={filters.startDate || undefined}
                  />
                  {filters.endDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Showing applications until{" "}
                      {new Date(filters.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <div className="space-y-2">
                    {["Pending", "Not Hiring", "Rejected", "Accepted"].map((status) => (
                      <label key={status} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={() => handleStatusChange(status)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quick Filters
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const today = new Date();
                      const lastWeek = new Date(
                        today.getTime() - 7 * 24 * 60 * 60 * 1000
                      );
                      handleFilterChange(
                        "startDate",
                        lastWeek.toISOString().split("T")[0]
                      );
                      handleFilterChange(
                        "endDate",
                        today.toISOString().split("T")[0]
                      );
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Last 7 days
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date(
                        today.getTime() - 30 * 24 * 60 * 60 * 1000
                      );
                      handleFilterChange(
                        "startDate",
                        lastMonth.toISOString().split("T")[0]
                      );
                      handleFilterChange(
                        "endDate",
                        today.toISOString().split("T")[0]
                      );
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Last 30 days
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const thisMonth = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1
                      );
                      handleFilterChange(
                        "startDate",
                        thisMonth.toISOString().split("T")[0]
                      );
                      handleFilterChange(
                        "endDate",
                        today.toISOString().split("T")[0]
                      );
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    This month
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
