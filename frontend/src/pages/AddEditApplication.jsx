import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Building2,
  Mail,
  Calendar,
  FileText,
  Image,
  Link,
  ChevronDown,
} from "lucide-react";
import SkeletonLoader from "../components/SkeletonLoader";
import { applicationsAPI } from "../services/api";
import { format } from "date-fns";

const AddEditApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showOtherTypeInput, setShowOtherTypeInput] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: "",
      email_or_portal: "",
      link: "",
      link_type: "",
      other_link_type: "",
      date_of_applying: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    },
  });

  const watchedLinkType = watch("link_type");

  useEffect(() => {
    if (isEdit) {
      fetchApplication();
    }
  }, [id]);

  useEffect(() => {
    setShowOtherTypeInput(watchedLinkType === "other");
  }, [watchedLinkType]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const application = await applicationsAPI.getById(id);

      setValue("company_name", application.company_name);
      setValue("email_or_portal", application.email_or_portal || "");
      setValue("link", application.link || "");
      setValue("link_type", application.link_type || "");
      setValue("other_link_type", "");
      setValue(
        "date_of_applying",
        format(new Date(application.date_of_applying), "yyyy-MM-dd")
      );
      setValue("notes", application.notes || "");

      if (application.photo_url) {
        setPhotoPreview(applicationsAPI.getPhotoUrl(application.photo_url));
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      setError("Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePhotoChange(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoChange(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("company_name", data.company_name);
      formData.append("email_or_portal", data.email_or_portal || "");
      formData.append("link", data.link || "");

      // Handle link type - use "other" value if "other" is selected
      const linkType =
        data.link_type === "other" ? data.other_link_type : data.link_type;
      formData.append("link_type", linkType || "");

      formData.append("date_of_applying", data.date_of_applying);
      formData.append("notes", data.notes || "");

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      if (isEdit) {
        await applicationsAPI.update(id, formData);
      } else {
        await applicationsAPI.create(formData);
      }

      navigate("/");
    } catch (error) {
      console.error("Error saving application:", error);
      setError("Failed to save application");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
        </div>

        {/* Form Skeleton */}
        <SkeletonLoader type="form" count={1} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? "Edit Application" : "Add New Application"}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Company Name */}
          <div className="input-floating">
            <input
              type="text"
              {...register("company_name", {
                required: "Company name is required",
              })}
              placeholder=" "
              className="input-field"
            />
            <label className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Company Name *
            </label>
            {errors.company_name && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                {errors.company_name.message}
              </p>
            )}
          </div>

          {/* Link Type */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ChevronDown className="h-4 w-4 mr-2" />
              Application Type
            </label>
            <select {...register("link_type")} className="input-field">
              <option value="">Select application type</option>
              <option value="email">Email</option>
              <option value="job portal">Job Portal</option>
              <option value="other">Other</option>
            </select>

            {showOtherTypeInput && (
              <div className="mt-3">
                <input
                  type="text"
                  {...register("other_link_type")}
                  placeholder="Specify application type"
                  className="input-field"
                />
              </div>
            )}
          </div>

          {/* Link */}
          <div className="input-floating">
            <input
              type="url"
              {...register("link")}
              placeholder=" "
              className="input-field"
            />
            <label className="flex items-center">
              <Link className="h-4 w-4 mr-2" />
              Link
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              URL to the job posting or application page
            </p>
          </div>

          {/* Date of Applying */}
          <div className="input-floating">
            <input
              type="date"
              {...register("date_of_applying", {
                required: "Date is required",
              })}
              placeholder=" "
              className="input-field"
            />
            <label className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Date of Applying *
            </label>
            {errors.date_of_applying && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                {errors.date_of_applying.message}
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              <Image className="h-4 w-4 mr-2" />
              Photo (Optional)
            </label>

            {photoPreview ? (
              <div className="relative inline-block group">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-600 shadow-soft"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-medium transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Drop your image here, or{" "}
                      <label
                        htmlFor="photo-upload"
                        className="text-primary-600 dark:text-primary-400 cursor-pointer hover:underline"
                      >
                        browse
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="photo-upload"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Notes / Additional Info
            </label>
            <textarea
              {...register("notes")}
              rows={4}
              className="input-field resize-none"
              placeholder="Add any additional notes about this application..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-secondary flex-1 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 order-1 sm:order-2"
            >
              {loading ? (
                <div className="loading-spinner h-4 w-4 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEdit ? "Update" : "Save"} Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditApplication;
