import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  UserCircle,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  Users,
} from 'lucide-react';
import { teachersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignSubjects, setShowAssignSubjects] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teachersAPI.getAll();
      setTeachers(response.data);
    } catch (error) {
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (teacherData) => {
    try {
      await teachersAPI.create(teacherData);
      toast.success('Teacher added successfully');
      fetchTeachers();
      setShowAddModal(false);
    } catch (error) {
      toast.error('Failed to add teacher');
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?'))
      return;

    try {
      await teachersAPI.delete(teacherId);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to delete teacher');
    }
  };

  const handleAssignSubjects = async (teacherId, subjects) => {
    try {
      await teachersAPI.assignSubjects(teacherId, subjects);
      toast.success('Subjects assigned successfully');
      fetchTeachers();
      setShowAssignSubjects(false);
    } catch (error) {
      toast.error('Failed to assign subjects');
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      filterDepartment === 'all' || teacher.department === filterDepartment;

    return matchesSearch && matchesDept;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

  const departments = [...new Set(teachers.map((t) => t.department))].filter(Boolean);

  if (loading) {
    return <Loader fullScreen />;
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
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">Manage teaching staff and assignments</p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Teacher</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teachers by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="input-field"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {teachers.length}
              </h3>
            </div>
            <UserCircle className="w-10 h-10 text-primary-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {teachers.filter((t) => t.status === 'active').length}
              </h3>
            </div>
            <Users className="w-10 h-10 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Teachers Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Employee ID</th>
                <th className="table-header">Name</th>
                <th className="table-header">Department</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Subjects</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTeachers.map((teacher, index) => (
                <motion.tr
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="table-cell font-medium">
                    {teacher.employee_id}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <UserCircle className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {teacher.first_name} {teacher.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{teacher.department}</td>
                  <td className="table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-3 h-3 mr-1" />
                        {teacher.phone_number}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects?.slice(0, 2).map((subject) => (
                        <span
                          key={subject}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                      {teacher.subjects?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          +{teacher.subjects.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        teacher.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowAssignSubjects(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Assign Subjects"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActions(
                              showActions === teacher.id ? null : teacher.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>

                        <AnimatePresence>
                          {showActions === teacher.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                            >
                              <button
                                onClick={() => {
                                  setSelectedTeacher(teacher);
                                  setShowActions(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteTeacher(teacher.id);
                                  setShowActions(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredTeachers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddTeacherModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddTeacher}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAssignSubjects && (
          <AssignSubjectsModal
            teacher={selectedTeacher}
            onClose={() => {
              setShowAssignSubjects(false);
              setSelectedTeacher(null);
            }}
            onSubmit={handleAssignSubjects}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal Components
const AddTeacherModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    employee_id: '',
    department: '',
    qualification: '',
    date_of_birth: '',
    joining_date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Teacher</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.employee_id}
                  onChange={(e) =>
                    setFormData({ ...formData, employee_id: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({ ...formData, qualification: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joining Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.joining_date}
                  onChange={(e) =>
                    setFormData({ ...formData, joining_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Teacher
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const AssignSubjectsModal = ({ teacher, onClose, onSubmit }) => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([
    'Mathematics',
    'English',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Computer Science',
  ]);

  useEffect(() => {
    if (teacher?.subjects) {
      setSelectedSubjects(teacher.subjects);
    }
  }, [teacher]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(teacher.id, selectedSubjects);
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Assign Subjects to {teacher?.first_name} {teacher?.last_name}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {availableSubjects.map((subject) => (
                  <div key={subject} className="flex items-center">
                    <input
                      type="checkbox"
                      id={subject}
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={subject}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Assign Subjects
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Teachers;