import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  ArrowLeft,
  X,
  Save,
  Building2,
  Calendar,
  FileText,
  Image,
  Link,
  ChevronDown,
} from "lucide-react";
import SkeletonLoader from "../components/SkeletonLoader";
import { Input, Select, DatePicker, Upload, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
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
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: "",
      link: "",
      link_type: "",
      other_link_type: "",
      date_of_applying: format(new Date(), "yyyy-MM-dd"),
      status: "Pending",
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
      setValue("link", application.link || "");
      setValue("link_type", application.link_type || "");
      setValue("other_link_type", "");
      setValue(
        "date_of_applying",
        format(new Date(application.date_of_applying), "yyyy-MM-dd")
      );
      setValue("notes", application.notes || "");
      setValue("status", application.status || "Pending");

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
      formData.append("link", data.link || "");

      // Handle link type - use "other" value if "other" is selected
      const linkType =
        data.link_type === "other" ? data.other_link_type : data.link_type;
      formData.append("link_type", linkType || "");

      formData.append("date_of_applying", data.date_of_applying);
      formData.append("status", data.status || "Pending");
      formData.append("notes", data.notes || "");

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      if (isEdit) {
        await applicationsAPI.update(id, formData);
        navigate(-1);
      } else {
        await applicationsAPI.create(formData);
        navigate("/");
      }
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
          onClick={() => (isEdit ? navigate(-1) : navigate("/"))}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-0">
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
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Building2 className="h-4 w-4 mr-2" />
              Company Name *
            </label>
            <Input
              size="large"
              {...register("company_name", { required: "Company name is required" })}
              placeholder="Enter company name"
            />
            {errors.company_name && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.company_name.message}</p>
            )}
          </div>

          {/* Link Type */}
          <div className="w-full">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ChevronDown className="h-4 w-4 mr-2" />
              Application Type
            </label>
            <Controller
              name="link_type"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  {...field}
                  allowClear
                  size="large"
                  placeholder="Select application type"
                  options={[
                    { value: "email", label: "Email" },
                    { value: "x", label: "X" },
                    { value: "linkedin", label: "LinkedIn" },
                    { value: "job portal", label: "Job Portal" },
                    { value: "other", label: "Other" },
                  ]}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />

            {showOtherTypeInput && (
              <div className="mt-3">
                <Input
                  size="large"
                  {...register("other_link_type")}
                  placeholder="Specify application type"
                />
              </div>
            )}
          </div>

          {/* Link */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Link className="h-4 w-4 mr-2" />
              Link
            </label>
            <Input size="large" type="url" {...register("link")} placeholder="https://example.com/job" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              URL to the job posting or application page
            </p>
          </div>

          {/* Date of Applying */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Date of Applying *
            </label>
            <Controller
              name="date_of_applying"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format("YYYY-MM-DD") : "")}
                />
              )}
            />
            {errors.date_of_applying && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.date_of_applying.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="w-full">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ChevronDown className="h-4 w-4 mr-2" />
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  {...field}
                  size="large"
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "Not Hiring", label: "Not Hiring" },
                    { value: "Rejected", label: "Rejected" },
                    { value: "Accepted", label: "Accepted" },
                    { value: "Followed up", label: "Followed up" },
                  ]}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              <Image className="h-4 w-4 mr-2" />
              Photo (Optional)
            </label>
            {photoPreview && (
              <div className="relative inline-block group mb-3">
                <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-600 shadow-soft" />
                <button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-medium transition-all duration-200">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <Upload.Dragger
              name="file"
              multiple={false}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
              onChange={({ file }) => {
                const real = file.originFileObj || file;
                if (real) handlePhotoChange(real);
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag image to upload</p>
              <p className="ant-upload-hint">PNG, JPG, GIF up to 10MB</p>
            </Upload.Dragger>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Notes / Additional Info
            </label>
            <Input.TextArea
              {...register("notes")}
              rows={4}
              placeholder="Add any additional notes about this application..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="default"
              onClick={() => (isEdit ? navigate(-1) : navigate("/"))}
              className="flex-1 order-2 sm:order-1"
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="flex-1 order-1 sm:order-2"
              size="large"
              icon={<Save className="h-4 w-4" />}
            >
              {isEdit ? "Update" : "Save"} Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditApplication;
