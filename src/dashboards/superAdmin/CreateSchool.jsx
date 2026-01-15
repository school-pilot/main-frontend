import { motion } from 'framer-motion';
import { useState } from 'react';
import { Building, Upload, X, Mail, Phone, MapPin, Hash, Quote, Image, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { useAuth } from "../../context/AuthContext";
import { schoolsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateSchool = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    registration_number: '',
    motto: '',
    logo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const { user, loadingAuth } = useAuth();
  const userRole = user?.role || null;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'logo' && files && files[0]) {
      const file = files[0];
      
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          logo: 'File must be JPG, PNG, or GIF'
        }));
        return;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          logo: 'File size must be less than 5MB'
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, logo: file }));
      setErrors(prev => ({ ...prev, logo: null }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'School name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.registration_number.trim())
      newErrors.registration_number = 'Registration number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate & check role as before
    if (!validate()) return;
    if (userRole !== 'super_admin') {
      toast.error('Only super administrators can create schools');
      return;
    }

    setLoading(true);

    try {
      // Prepare FormData
      const formDataToSend = new FormData();
      ['name', 'email', 'address', 'phone', 'registration_number', 'motto'].forEach(
        field => {
          if (formData[field]) formDataToSend.append(field, formData[field]);
        }
      );

      if (formData.logo instanceof File) formDataToSend.append('logo', formData.logo);

      // ✅ Use axios from api.js
      const { data } = await schoolsAPI.create(formDataToSend);

      toast.success('School created successfully!');
      if (onSuccess) onSuccess(data);
      navigate('/schools'); // Redirect to schools list page after success

    } catch (error) {
      console.error('CREATE SCHOOL ERROR:', error);
      toast.error(error.response?.data?.detail || error.message || 'Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      address: '',
      phone: '',
      registration_number: '',
      motto: '',
      logo: null,
    });
    setLogoPreview(null);
    setErrors({});
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setLogoPreview(null);
    setErrors(prev => ({ ...prev, logo: null }));
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Show loading while checking role
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <Loader />
        </div>
      </div>
    );
  }

  // Only check role after auth has finished loading
  if (userRole !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 mb-6">
              Only super administrators can create schools. Your role is: <span className="font-medium capitalize">{userRole}</span>
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the form if user is super_admin
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="cursor-pointer inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New School</h1>
                <p className="text-gray-600">Register a new educational institution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* School Logo Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Image className="w-5 h-5 text-primary-600" />
                    <span>School Logo</span>
                  </div>
                </label>
                
                <div className="flex items-center space-x-6">
                  {/* Logo Preview */}
                  {logoPreview ? (
                    <div className="relative">
                      <div className="w-32 h-32 border-2 border-dashed border-primary-200 rounded-xl overflow-hidden bg-primary-50">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <Image className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">No logo</span>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        id="logo"
                        name="logo"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                        className="inline-flex items-center space-x-2 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 cursor-pointer transition-colors duration-200"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Upload Logo</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: Square image, max 5MB. JPG, PNG, or GIF.
                      </p>
                    </div>
                    {errors.logo && (
                      <p className="text-sm text-red-600 mt-2">{errors.logo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* School Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-primary-600" />
                    <span>School Name *</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter school name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-2">{errors.name}</p>
                )}
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-primary-600" />
                      <span>Email Address *</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="school@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-primary-600" />
                      <span>Phone Number *</span>
                    </div>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+1234567890"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-2">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    <span>Full Address *</span>
                  </div>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter complete school address"
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-2">{errors.address}</p>
                )}
              </div>

              {/* Registration Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Registration Number */}
                <div>
                  <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-primary-600" />
                      <span>Registration Number *</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    id="registration_number"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.registration_number ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter official registration number"
                  />
                  {errors.registration_number && (
                    <p className="text-sm text-red-600 mt-2">{errors.registration_number}</p>
                  )}
                </div>

                {/* Motto */}
                <div>
                  <label htmlFor="motto" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <Quote className="w-4 h-4 text-primary-600" />
                      <span>School Motto</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    id="motto"
                    name="motto"
                    value={formData.motto}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter school motto (optional)"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Reset Form
                </button>
                
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Building className="w-5 h-5" />
                        <span>Create School</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Required Fields Note */}
              <div className="text-sm text-gray-500 pt-4">
                <p>* Required fields</p>
                <p className="mt-1 text-xs">All information will be verified before activation</p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSchool;