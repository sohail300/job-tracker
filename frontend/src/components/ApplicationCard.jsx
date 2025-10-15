import { Link } from "react-router-dom";
import {
  Calendar,
  Mail,
  FileText,
  Edit,
  Trash2,
  Building2,
  ExternalLink,
  MoreVertical,
  Link as LinkIcon,
} from "lucide-react";
import { format } from "date-fns";
import { applicationsAPI } from "../services/api";
import { useState } from "react";

const ApplicationCard = ({ application, onDelete, viewMode = "card" }) => {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await applicationsAPI.delete(application._id);
        onDelete(application._id);
      } catch (error) {
        console.error("Error deleting application:", error);
        alert("Failed to delete application");
      }
    }
  };

  const getPhotoUrl = () => {
    if (application.photo_url) {
      return applicationsAPI.getPhotoUrl(application.photo_url);
    }
    return null;
  };

  const getDaysAgo = () => {
    const today = new Date();
    const appDate = new Date(application.date_of_applying);
    const diffTime = Math.abs(today - appDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statusStyles = {
    Pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    "Not Hiring": "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    Rejected: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    Accepted: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  };

  if (viewMode === "list") {
    return (
      <div className="card-compact group">
        <div className="flex items-start space-x-4">
          {/* Photo */}
          <div className="flex-shrink-0">
            {getPhotoUrl() ? (
              <img
                src={getPhotoUrl()}
                alt={`${application.company_name} logo`}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                <Building2 className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {application.company_name}
                </h3>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                  {application.email_or_portal && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate max-w-32">
                        {application.email_or_portal.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>
                      {format(
                        new Date(application.date_of_applying),
                        "MMM dd, yyyy"
                      )}
                    </span>
                    {isRecent && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        Recent
                      </span>
                    )}
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Details (match grid view) */}
            {application.link_type && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate flex-1 text-capitalize">
                  {application.link_type}
                </span>
              </div>
            )}

            {application.link && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <LinkIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate flex-1">
                  {application.link || "Link"}
                </span>
                <a
                  href={application.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 ml-2 flex-shrink-0"
                  title="Open link"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {application.notes && (
              <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                <FileText className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" />
                <p className="line-clamp-2 leading-relaxed">
                  {application.notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Applied {getDaysAgo()} day{getDaysAgo() !== 1 ? "s" : ""} ago
                </span>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/edit/${application._id}`}
                    className="btn-ghost text-xs px-3 py-1.5"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      handleDelete();
                    }}
                    className="flex items-center px-3 py-1.5 text-xs rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card group relative overflow-hidden">
      {/* Recent Badge */}
      {application.status && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusStyles[application.status] || "bg-gray-100 text-gray-800"}`}>
                      {application.status}
                    </span>
                  )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-4">
          {/* Photo */}
          <div className="flex-shrink-0">
            {getPhotoUrl() ? (
              <img
                src={getPhotoUrl()}
                alt={`${application.company_name} logo`}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-600 shadow-soft"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-soft">
                <Building2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate mb-1">
              {application.company_name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {format(new Date(application.date_of_applying), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {application.link_type && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className="truncate flex-1 text-capitalize">
                {application.link_type}
              </span>
            </div>
          )}

          {application.link && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <LinkIcon className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className="truncate flex-1">
                {application.link || "Link"}
              </span>
              <a
                href={application.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 ml-2 flex-shrink-0"
                title="Open link"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {application.notes && (
            <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
              <FileText className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-3 leading-relaxed">
                {application.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Applied {getDaysAgo()} day{getDaysAgo() !== 1 ? "s" : ""} ago
            </span>
            <div className="flex items-center justify-center space-x-2 whitespace-nowrap">
              <Link
                to={`/edit/${application._id}`}
                className="btn-ghost text-xs inline-flex items-center h-8 px-4"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  handleDelete();
                }}
                className="inline-flex items-center h-8 px-4 text-xs rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
