import { useEffect, useState } from "react";
import { Calendar, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Modal, DatePicker, Checkbox, Select, Button, Tag } from "antd";
import dayjs from "dayjs";

const FilterBar = ({ onFilterChange, value, applicationTypes = [] }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: [],
    applicationTypes: [],
  });

  // Sync fields from parent value (so chips actions reflect in modal)
  useEffect(() => {
    if (!value) return;
    const next = {
      startDate: value.startDate || "",
      endDate: value.endDate || "",
      status: value.status || [],
      applicationTypes: value.applicationTypes || [],
    };
    if (
      next.startDate !== filters.startDate ||
      next.endDate !== filters.endDate ||
      JSON.stringify(next.status) !== JSON.stringify(filters.status) ||
      JSON.stringify(next.applicationTypes) !== JSON.stringify(filters.applicationTypes)
    ) {
      setFilters(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.startDate, value?.endDate, value?.status, value?.applicationTypes]);

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
    const clearedFilters = { startDate: "", endDate: "", status: [], applicationTypes: [] };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.startDate || filters.endDate || filters.status.length > 0 || filters.applicationTypes.length > 0;

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

      <Modal
        title={
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span>Filters</span>
          </div>
        }
        open={showFilters}
        onCancel={() => setShowFilters(false)}
        footer={null}
        destroyOnClose
      >
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </label>
            <DatePicker.RangePicker
              allowEmpty={[true, true]}
              value={[
                filters.startDate ? dayjs(filters.startDate) : null,
                filters.endDate ? dayjs(filters.endDate) : null,
              ]}
              onChange={(vals) => {
                const [start, end] = vals || [];
                handleFilterChange("startDate", start ? start.format("YYYY-MM-DD") : "");
                handleFilterChange("endDate", end ? end.format("YYYY-MM-DD") : "");
              }}
              style={{ width: "100%" }}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Checkbox.Group
              options={["Pending", "Not Hiring", "Rejected", "Accepted"]}
              value={filters.status}
              onChange={(list) => handleFilterChange("status", list)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Application Types
            </label>
            {applicationTypes.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No application types found.</p>
            ) : (
              <Select
                mode="multiple"
                allowClear
                placeholder="Select application types"
                value={filters.applicationTypes}
                onChange={(vals) => handleFilterChange("applicationTypes", vals)}
                options={applicationTypes.map((t) => ({ value: t, label: String(t).split(" ").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" ") }))}
                style={{ width: "100%" }}
              />
            )}
          </div>

          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Filters</p>
            <div className="flex flex-wrap gap-2">
              <Button size="small" onClick={() => {
                const today = dayjs();
                const lastWeek = today.subtract(7, "day");
                handleFilterChange("startDate", lastWeek.format("YYYY-MM-DD"));
                handleFilterChange("endDate", today.format("YYYY-MM-DD"));
              }}>Last 7 days</Button>
              <Button size="small" onClick={() => {
                const today = dayjs();
                const lastMonth = today.subtract(30, "day");
                handleFilterChange("startDate", lastMonth.format("YYYY-MM-DD"));
                handleFilterChange("endDate", today.format("YYYY-MM-DD"));
              }}>Last 30 days</Button>
              <Button size="small" onClick={() => {
                const today = dayjs();
                const start = today.startOf("month");
                handleFilterChange("startDate", start.format("YYYY-MM-DD"));
                handleFilterChange("endDate", today.format("YYYY-MM-DD"));
              }}>This month</Button>
              <Button size="small" danger onClick={clearFilters}>Clear all</Button>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <Button onClick={clearFilters}>Reset</Button>
            <Button type="primary" onClick={() => setShowFilters(false)}>Apply</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FilterBar;
