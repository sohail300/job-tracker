import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Grid,
  List,
  TrendingUp,
  Calendar,
  Building2,
  X,
} from "lucide-react";
import ApplicationCard from "../components/ApplicationCard";
import FilterBar from "../components/FilterBar";
import SkeletonLoader from "../components/SkeletonLoader";
import { applicationsAPI } from "../services/api";

const Home = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(() => {
    try {
      return sessionStorage.getItem("home.searchTerm") || "";
    } catch {
      return "";
    }
  });
  const [viewMode, setViewMode] = useState(() => {
    try {
      return sessionStorage.getItem("home.viewMode") || "card";
    } catch {
      return "card";
    }
  }); // 'card' or 'list'
  const [dateFilters, setDateFilters] = useState(() => {
    try {
      const stored = sessionStorage.getItem("home.dateFilters");
      return stored
        ? JSON.parse(stored)
        : { startDate: "", endDate: "", status: [], applicationTypes: [] };
    } catch {
      return { startDate: "", endDate: "", status: [], applicationTypes: [] };
    }
  });

  useEffect(() => {
    fetchApplications();
    // Restore scroll position if saved
    try {
      const savedY = sessionStorage.getItem("home.scrollY");
      if (savedY) {
        const y = parseInt(savedY, 10);
        // allow layout to paint
        setTimeout(() => window.scrollTo(0, isNaN(y) ? 0 : y), 0);
        sessionStorage.removeItem("home.scrollY");
      }
    } catch {}
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, dateFilters]);

  // Persist UI state
  useEffect(() => {
    try {
      sessionStorage.setItem("home.searchTerm", searchTerm);
    } catch {}
  }, [searchTerm]);
  useEffect(() => {
    try {
      sessionStorage.setItem("home.viewMode", viewMode);
    } catch {}
  }, [viewMode]);
  useEffect(() => {
    try {
      sessionStorage.setItem("home.dateFilters", JSON.stringify(dateFilters));
    } catch {}
  }, [dateFilters]);

  // Scroll restore to last edited card (more reliable than absolute Y)
  useEffect(() => {
    const lastEditedId = sessionStorage.getItem("home.lastEditedId");
    if (!lastEditedId) return;

    let attempts = 0;
    const maxAttempts = 20; // try for a short while until layout stabilizes
    const tryScroll = () => {
      const el = document.getElementById(`app-${lastEditedId}`);
      attempts += 1;
      if (el) {
        // Offset for sticky header
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 0;
        const y = el.getBoundingClientRect().top + window.scrollY - Math.max(0, headerHeight + 12);
        window.scrollTo({ top: y, behavior: "instant" in window ? "instant" : "auto" });
        sessionStorage.removeItem("home.lastEditedId");
      } else if (attempts < maxAttempts) {
        requestAnimationFrame(tryScroll);
      }
    };

    requestAnimationFrame(tryScroll);
  }, [filteredApplications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationsAPI.getAll();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.email_or_portal &&
            app.email_or_portal
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (app.notes &&
            app.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Date filter
    if (dateFilters.startDate || dateFilters.endDate) {
      filtered = filtered.filter((app) => {
        const appDate = new Date(app.date_of_applying);
        const startDate = dateFilters.startDate
          ? new Date(dateFilters.startDate)
          : null;
        const endDate = dateFilters.endDate
          ? new Date(dateFilters.endDate)
          : null;

        if (startDate && endDate) {
          return appDate >= startDate && appDate <= endDate;
        } else if (startDate) {
          return appDate >= startDate;
        } else if (endDate) {
          return appDate <= endDate;
        }
        return true;
      });
    }

    // Status filter
    if (dateFilters.status.length > 0) {
      filtered = filtered.filter((app) => dateFilters.status.includes(app.status));
    }

    // Application Types filter (based on link_type)
    if (dateFilters.applicationTypes && dateFilters.applicationTypes.length > 0) {
      filtered = filtered.filter((app) => {
        if (!app.link_type) return false;
        return dateFilters.applicationTypes.includes(app.link_type);
      });
    }

    setFilteredApplications(filtered);
  };

  const handleDelete = (deletedId) => {
    setApplications((prev) => prev.filter((app) => app._id !== deletedId));
  };

  const handleFilterChange = (filters) => {
    setDateFilters(filters);
  };

  // Calculate stats
  const totalApplications = applications.length;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthApplications = applications.filter((app) => {
    const appDate = new Date(app.date_of_applying);
    return (
      appDate.getMonth() === thisMonth && appDate.getFullYear() === thisYear
    );
  }).length;

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonLoader type="stats" count={3} />
          </div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full max-w-md animate-pulse"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-20 animate-pulse"></div>
          </div>
        </div>

        {/* Applications Skeleton */}
        <SkeletonLoader type="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4 text-lg">
          {error}
        </div>
        <button onClick={fetchApplications} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Job Applications
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-compact">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Building2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {thisMonthApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Filtered Results
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {filteredApplications.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          <div className="flex items-center justify-between space-x-4">
            {/* Filter Bar */}
            <FilterBar onFilterChange={handleFilterChange} value={dateFilters} applicationTypes={[...new Set(applications.map(a => a.link_type).filter(Boolean))]} />
            {/* View Mode Toggle */}
            <div className="flex items-end w-fit justify-end bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "card"
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-soft"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                title="Card view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-soft"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {(dateFilters.startDate || dateFilters.endDate || dateFilters.status.length > 0 || (dateFilters.applicationTypes?.length || 0) > 0) && (
          <div className="flex items-start flex-wrap gap-2">
            {dateFilters.startDate && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-800 rounded-full">
                From {new Date(dateFilters.startDate).toLocaleDateString()}
                <button
                  onClick={() =>
                    setDateFilters((p) => ({ ...p, startDate: "" }))
                  }
                  className="ml-1 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                  aria-label="Clear from date filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {dateFilters.endDate && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-800 rounded-full">
                To {new Date(dateFilters.endDate).toLocaleDateString()}
                <button
                  onClick={() => setDateFilters((p) => ({ ...p, endDate: "" }))}
                  className="ml-1 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                  aria-label="Clear to date filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {dateFilters.status.map((status) => (
              <span key={status} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-800 rounded-full">
                Status: {status}
                <button
                  onClick={() => setDateFilters((p) => ({ ...p, status: p.status.filter(s => s !== status) }))}
                  className="ml-1 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                  aria-label={`Clear ${status} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {dateFilters.applicationTypes?.map((type) => (
              <span key={type} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-800 rounded-full">
                Application Type: {String(type).split(" ").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" ")}
                <button
                  onClick={() => setDateFilters((p) => ({ ...p, applicationTypes: p.applicationTypes.filter(t => t !== type) }))}
                  className="ml-1 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                  aria-label={`Clear ${type} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {(dateFilters.startDate || dateFilters.endDate || dateFilters.status.length > 0 || (dateFilters.applicationTypes?.length || 0) > 0) && (
              <button
                onClick={() => setDateFilters({ startDate: "", endDate: "", status: [], applicationTypes: [] })}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                Clear all
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {applications.length === 0
                ? "No applications yet"
                : "No matching applications"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {applications.length === 0
                ? "Start tracking your job applications by adding your first one!"
                : "Try adjusting your search or filter criteria."}
            </p>
            {applications.length === 0 && (
              <Link to="/applications/add" className="btn-primary">
                Add Your First Application
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "card" ? "grid grid-responsive gap-6" : "space-y-4"
          }
        >
          {filteredApplications.map((application, index) => (
            <div
              key={application._id}
              id={`app-${application._id}`}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ApplicationCard
                application={application}
                onDelete={handleDelete}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <Link to="/applications/add" className="fab">
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default Home;
