import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  Shield,
  UserCircle,
  ArrowLeft,
  Phone,
  X,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ================= Animations ================= */

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ================= Component ================= */

const RegisterAnimation = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolEmail: "",
    logo: "",
    phoneNumber: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    coverImage: "",
    isRegistered: false,
    registrationNumber: "",
    registrationDocument: "",
    principalName: "",
    establishedYear: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    image: "",
  });

  // Preview URLs for images
  const [imagePreviews, setImagePreviews] = useState({
    logo: null,
    coverImage: null,
    registrationDocument: null,
    profileImage: null,
  });

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({
    logo: false,
    coverImage: false,
    registrationDocument: false,
    profileImage: false,
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  // Get Cloudinary config from environment variables
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Create local preview for images
  const createLocalPreview = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({
        ...prev,
        [type]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove preview
  const removePreview = (type, fieldName) => {
    setImagePreviews((prev) => ({
      ...prev,
      [type]: null,
    }));
    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const uploadToCloudinary = async (file, type) => {
    setUploadingImages((prev) => ({ ...prev, [type]: true }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.secure_url) {
        toast.success(`${type} uploaded successfully!`);
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error(`Failed to upload ${type}. Please try again.`);
      return null;
    } finally {
      setUploadingImages((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileUpload = async (e, fieldName, uploadType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    const allowedDocTypes = ["application/pdf"];

    if (uploadType === "registrationDocument") {
      if (![...allowedImageTypes, ...allowedDocTypes].includes(file.type)) {
        toast.error(
          "Please upload a valid file (PDF, JPEG, PNG, WEBP, or JPG)",
        );
        return;
      }
    } else {
      if (!allowedImageTypes.includes(file.type)) {
        toast.error(
          "Please upload a valid image file (JPEG, PNG, WEBP, or JPG)",
        );
        return;
      }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create local preview for images (not for PDFs)
    if (
      uploadType !== "registrationDocument" ||
      file.type !== "application/pdf"
    ) {
      createLocalPreview(file, uploadType);
    } else {
      // For PDFs, show file name instead
      setImagePreviews((prev) => ({
        ...prev,
        [uploadType]: { name: file.name, type: "pdf" },
      }));
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(file, uploadType);

    if (imageUrl) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: imageUrl,
      }));
    } else {
      // Remove preview if upload failed
      removePreview(uploadType, fieldName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Basic validation for required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    setSuccess(false);

    // Prepare data for backend (matching your schema)
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      image: formData.image || undefined,
      schoolName: formData.schoolName || undefined,
      schoolEmail: formData.schoolEmail || undefined,
      logo: formData.logo || undefined,
      phoneNumber: formData.phoneNumber || undefined,
      website: formData.website || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
      coverImage: formData.coverImage || undefined,
      isRegistered: formData.isRegistered,
      registrationNumber: formData.registrationNumber || undefined,
      registrationDocument: formData.registrationDocument || undefined,
      principalName: formData.principalName || undefined,
      establishedYear: formData.establishedYear
        ? parseInt(formData.establishedYear)
        : undefined,
    };

    try {
      const result = await register(userData);

      if (result) {
        setSuccess(true);
        // Redirect happens inside register function
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Image Preview Component
  const ImagePreview = ({ preview, type, onRemove, fieldName, label }) => {
    if (!preview) return null;

    const isPdf = typeof preview === "object" && preview.type === "pdf";

    return (
      <div className="mt-2 relative inline-block">
        <div className="relative group">
          {isPdf ? (
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
              <FileText className="w-8 h-8 text-red-500" />
              <span className="text-sm text-gray-700">{preview.name}</span>
            </div>
          ) : (
            <img
              src={preview}
              alt={`${label} preview`}
              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
            />
          )}
          <button
            type="button"
            onClick={() => onRemove(type, fieldName)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col px-4 sm:px-6 py-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Card with scrollable content */}
      <motion.div
        className="z-10 w-full max-w-4xl mx-auto"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="rounded-xl shadow-xl bg-white/90 backdrop-blur border border-gray-100 overflow-hidden">
          {/* Logo and Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.div
                className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <img
                  src="/logo.jpg"
                  alt="Company Logo"
                  className="w-16 h-16 object-contain rounded-full drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]"
                />
              </motion.div>

              <div className="text-center sm:text-left">
                <motion.h2
                  className="text-xl sm:text-2xl font-bold text-gray-800"
                  variants={itemVariants}
                >
                  Create Your School Account
                </motion.h2>
                <motion.p
                  className="text-sm text-gray-600 mt-1"
                  variants={itemVariants}
                >
                  Please enter your details to get started
                </motion.p>
              </div>
            </div>
          </div>

          {/* Scrollable form container */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-4">
            {success ? (
              <motion.div
                className="p-4 bg-green-50 border border-green-200 rounded-lg text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800">
                  Registration Successful!
                </h3>
                <p className="text-green-600 mt-1">
                  Your account has been created successfully. Redirecting to
                  login...
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Personal Information Section - All fields are REQUIRED except Phone and Image */}
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <User className="w-5 h-5" />
                    <h3 className="font-semibold">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Enter first name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Image{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, "image", "profileImage")
                          }
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                          disabled={uploadingImages.profileImage}
                        />
                      </div>
                      <ImagePreview
                        preview={imagePreviews.profileImage}
                        type="profileImage"
                        fieldName="image"
                        label="Profile"
                        onRemove={removePreview}
                      />
                      {uploadingImages.profileImage && (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader size="sm" />
                          <span className="text-xs text-gray-500">
                            Uploading...
                          </span>
                        </div>
                      )}
                      {formData.image && !imagePreviews.profileImage && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Image uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* School Information Section - All fields are OPTIONAL */}
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Building className="w-5 h-5" />
                    <h3 className="font-semibold">School Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School Name{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter school name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School Email{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="email"
                        name="schoolEmail"
                        value={formData.schoolEmail}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter school email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School Phone{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter school phone"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter website URL"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter state"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Principal Name{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="principalName"
                        value={formData.principalName}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter principal name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Established Year{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="establishedYear"
                        value={formData.establishedYear}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter year established"
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                        placeholder="Enter registration number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School Logo{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo", "logo")}
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        disabled={uploadingImages.logo}
                      />
                      <ImagePreview
                        preview={imagePreviews.logo}
                        type="logo"
                        fieldName="logo"
                        label="Logo"
                        onRemove={removePreview}
                      />
                      {uploadingImages.logo && (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader size="sm" />
                          <span className="text-xs text-gray-500">
                            Uploading...
                          </span>
                        </div>
                      )}
                      {formData.logo && !imagePreviews.logo && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Logo uploaded successfully
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Image{" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, "coverImage", "coverImage")
                        }
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        disabled={uploadingImages.coverImage}
                      />
                      <ImagePreview
                        preview={imagePreviews.coverImage}
                        type="coverImage"
                        fieldName="coverImage"
                        label="Cover"
                        onRemove={removePreview}
                      />
                      {uploadingImages.coverImage && (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader size="sm" />
                          <span className="text-xs text-gray-500">
                            Uploading...
                          </span>
                        </div>
                      )}
                      {formData.coverImage && !imagePreviews.coverImage && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Cover image uploaded successfully
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Document (PDF/Image){" "}
                        <span className="text-gray-400 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            "registrationDocument",
                            "registrationDocument",
                          )
                        }
                        className="w-full bg-blue-50 px-4 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        disabled={uploadingImages.registrationDocument}
                      />
                      <ImagePreview
                        preview={imagePreviews.registrationDocument}
                        type="registrationDocument"
                        fieldName="registrationDocument"
                        label="Document"
                        onRemove={removePreview}
                      />
                      {uploadingImages.registrationDocument && (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader size="sm" />
                          <span className="text-xs text-gray-500">
                            Uploading...
                          </span>
                        </div>
                      )}
                      {formData.registrationDocument &&
                        !imagePreviews.registrationDocument && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Document uploaded successfully
                          </p>
                        )}
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isRegistered"
                        name="isRegistered"
                        checked={formData.isRegistered}
                        onChange={handleChange}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="isRegistered"
                        className="cursor-pointer text-sm text-gray-700"
                      >
                        School is registered with the government
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Account Information Section - ALL fields are REQUIRED */}
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <UserCircle className="w-5 h-5" />
                    <h3 className="font-semibold">Account Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Choose a username"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Password Section - ALL fields are REQUIRED */}
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Lock className="w-5 h-5" />
                    <h3 className="font-semibold">Password</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showPassword1 ? "text" : "password"}
                          required
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm pr-10"
                          placeholder="Create a password"
                          minLength="8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword1(!showPassword1)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword1 ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showPassword2 ? "text" : "password"}
                          required
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-blue-50 px-10 py-2 rounded-lg outline-none border border-transparent focus:border-blue-300 transition-colors text-sm pr-10"
                          placeholder="Confirm your password"
                          minLength="8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword2(!showPassword2)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword2 ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        id="showPassword1"
                        checked={showPassword1}
                        onChange={() => setShowPassword1(!showPassword1)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="showPassword1" className="cursor-pointer">
                        Show Password
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Terms and Conditions */}
                <motion.div className="pt-2" variants={itemVariants}>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div className="pt-4" variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      Object.values(uploadingImages).some(
                        (uploading) => uploading,
                      )
                    }
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader size="sm" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Register Account</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterAnimation;
