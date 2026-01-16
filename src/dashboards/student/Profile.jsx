import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Edit,
  Save,
  Camera,
} from 'lucide-react';
import { studentsAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Try to fetch student data first, fallback to user account data
      try {
        const response = await studentsAPI.get(userId);
        setStudentData(response.data);
        setFormData(response.data);
      } catch (studentError) {
        // If student not found, fetch user account data
        const userResponse = await authAPI.getUser(userId);
        const accountData = userResponse.data;
        
        // Map user account data to student-like format
        const mappedData = {
          id: accountData.id,
          first_name: accountData.first_name || '',
          last_name: accountData.last_name || '',
          email: accountData.email || '',
          phone_number: accountData.phone_number || '',
          date_of_birth: accountData.date_of_birth || '',
          gender: accountData.gender || '',
          address: accountData.address || '',
          class: accountData.class_name || 'N/A',
          admission_number: accountData.admission_number || 'N/A',
          enrollment_date: accountData.created_at || '',
          status: accountData.is_active ? 'active' : 'inactive',
          guardian_name: accountData.guardian_name || '',
          guardian_phone: accountData.guardian_phone || '',
          guardian_email: accountData.guardian_email || '',
          guardian_relationship: accountData.guardian_relationship || '',
          emergency_contact: accountData.emergency_contact || '',
          medical_info: accountData.medical_info || '',
        };
        
        setStudentData(mappedData);
        setFormData(mappedData);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile. Please try again later.');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Try to update as student first, fallback to user account
      try {
        await studentsAPI.update(userId, formData);
      } catch (studentError) {
        // If student update fails, update user account instead
        await authAPI.updateUser(userId, formData);
      }

      setStudentData(formData);
      setEditing(false);
      toast.success('Profile updated successfully');
      // Refresh data to ensure we have the latest from server
      fetchStudentProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(studentData);
    setEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStudentProfile}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">View and manage your personal information</p>
        </div>

        <div className="flex items-center space-x-3">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-primary-600" />
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {studentData.first_name} {studentData.last_name}
                </h2>
                <p className="text-primary-600 font-medium">{studentData.class}</p>
                <p className="text-gray-600">Admission: {studentData.admission_number}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    studentData.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {studentData.status}
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  Enrolled: {new Date(studentData.enrollment_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <User className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="font-medium">{studentData.first_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="font-medium">{studentData.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="font-medium">{studentData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="font-medium">{studentData.phone_number}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date of Birth
                </label>
                {editing ? (
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="font-medium">
                    {new Date(studentData.date_of_birth).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                {editing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="font-medium">{studentData.gender}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              {editing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                />
              ) : (
                <p className="font-medium">{studentData.address}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Guardian Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Guardian Information
            </h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guardian Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="font-medium">{studentData.guardian_name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                {editing ? (
                  <select
                    name="guardian_relationship"
                    value={formData.guardian_relationship}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="font-medium">{studentData.guardian_relationship}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <p className="font-medium">{studentData.guardian_phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guardian Email
              </label>
              {editing ? (
                <input
                  type="email"
                  name="guardian_email"
                  value={formData.guardian_email}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="font-medium">{studentData.guardian_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              {editing ? (
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <p className="font-medium">{studentData.emergency_contact}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Information
              </label>
              {editing ? (
                <textarea
                  name="medical_info"
                  value={formData.medical_info}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                  placeholder="Any medical conditions, allergies, etc."
                />
              ) : (
                <p className="font-medium">{studentData.medical_info || 'None'}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Academic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Academic Information
          </h3>
          <BookOpen className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Current Class</p>
                <h4 className="text-xl font-bold text-blue-900 mt-2">
                  {studentData.class}
                </h4>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Admission Number</p>
                <h4 className="text-xl font-bold text-green-900 mt-2">
                  {studentData.admission_number}
                </h4>
              </div>
              <User className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Enrollment Date</p>
                <h4 className="text-xl font-bold text-purple-900 mt-2">
                  {new Date(studentData.enrollment_date).toLocaleDateString()}
                </h4>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Account Settings</h4>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                Notification Preferences
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                Privacy Settings
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Document Downloads</h4>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                Download ID Card
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                Download Fee Receipts
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                Download Academic Transcript
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;