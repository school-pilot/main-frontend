// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import { 
//   Users, 
//   Search, 
//   Filter, 
//   Download, 
//   Plus,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Eye,
//   UserPlus
// } from 'lucide-react';
// import { studentsAPI } from '../../services/api';
// import toast from 'react-hot-toast';
// import Loader from '../../components/Loader';
// import Pagination from '../../components/Pagination';

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedClass, setSelectedClass] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showBulkUpload, setShowBulkUpload] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [showActions, setShowActions] = useState(null);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const response = await studentsAPI.getAll();
//       setStudents(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch students');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddStudent = async (studentData) => {
//     try {
//       await studentsAPI.create(studentData);
//       toast.success('Student added successfully');
//       fetchStudents();
//       setShowAddModal(false);
//     } catch (error) {
//       toast.error('Failed to add student');
//     }
//   };

//   const handleDeleteStudent = async (studentId) => {
//     if (!window.confirm('Are you sure you want to delete this student?')) return;
    
//     try {
//       await studentsAPI.delete(studentId);
//       toast.success('Student deleted successfully');
//       fetchStudents();
//     } catch (error) {
//       toast.error('Failed to delete student');
//     }
//   };

//   const handleBulkUpload = async (file) => {
//     try {
//       await studentsAPI.bulkUpload(file);
//       toast.success('Bulk upload successful');
//       fetchStudents();
//       setShowBulkUpload(false);
//     } catch (error) {
//       toast.error('Failed to upload students');
//     }
//   };

//   const filteredStudents = students.filter(student => {
//     const matchesSearch = 
//       student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    
//     return matchesSearch && matchesClass;
//   });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

//   const uniqueClasses = [...new Set(students.map(s => s.class))].filter(Boolean);

//   if (loading) {
//     return <Loader fullScreen />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col md:flex-row md:items-center justify-between gap-4"
//       >
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Students</h1>
//           <p className="text-gray-600">Manage student records and information</p>
//         </div>
        
//         <div className="flex items-center space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowBulkUpload(true)}
//             className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//           >
//             <Download className="w-4 h-4" />
//             <span>Bulk Upload</span>
//           </motion.button>
          
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Add Student</span>
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white rounded-xl shadow-sm p-4"
//       >
//         <div className="flex flex-col md:flex-row md:items-center gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search students by name or admission number..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="input-field pl-10"
//             />
//           </div>
          
//           <div className="flex items-center space-x-3">
//             <Filter className="text-gray-400 w-5 h-5" />
//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="input-field"
//             >
//               <option value="all">All Classes</option>
//               {uniqueClasses.map(cls => (
//                 <option key={cls} value={cls}>{cls}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </motion.div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="bg-white rounded-xl shadow-sm p-4"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Students</p>
//               <h3 className="text-2xl font-bold text-gray-900 mt-1">
//                 {students.length}
//               </h3>
//             </div>
//             <Users className="w-10 h-10 text-primary-600" />
//           </div>
//         </motion.div>
        
//         {/* Add more stat cards for gender distribution, class distribution, etc. */}
//       </div>

//       {/* Students Table */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white rounded-xl shadow-sm overflow-hidden"
//       >
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="table-header">Admission No.</th>
//                 <th className="table-header">Name</th>
//                 <th className="table-header">Class</th>
//                 <th className="table-header">Gender</th>
//                 <th className="table-header">Date of Birth</th>
//                 <th className="table-header">Guardian Phone</th>
//                 <th className="table-header">Status</th>
//                 <th className="table-header">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentStudents.map((student, index) => (
//                 <motion.tr
//                   key={student.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                 >
//                   <td className="table-cell font-medium">
//                     {student.admission_number}
//                   </td>
//                   <td className="table-cell">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
//                         <Users className="w-4 h-4 text-primary-600" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {student.first_name} {student.last_name}
//                         </p>
//                         <p className="text-sm text-gray-500">{student.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="table-cell">
//                     <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                       {student.class}
//                     </span>
//                   </td>
//                   <td className="table-cell capitalize">{student.gender}</td>
//                   <td className="table-cell">
//                     {new Date(student.date_of_birth).toLocaleDateString()}
//                   </td>
//                   <td className="table-cell">{student.guardian_phone}</td>
//                   <td className="table-cell">
//                     <span className={`px-3 py-1 rounded-full text-sm ${
//                       student.status === 'active' 
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {student.status}
//                     </span>
//                   </td>
//                   <td className="table-cell">
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowActions(showActions === student.id ? null : student.id)}
//                         className="p-2 hover:bg-gray-100 rounded-lg"
//                       >
//                         <MoreVertical className="w-5 h-5 text-gray-400" />
//                       </button>
                      
//                       <AnimatePresence>
//                         {showActions === student.id && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.95 }}
//                             className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
//                           >
//                             <button
//                               onClick={() => {
//                                 setSelectedStudent(student);
//                                 setShowActions(null);
//                               }}
//                               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             >
//                               <Eye className="w-4 h-4 mr-2" />
//                               View Details
//                             </button>
//                             <button
//                               onClick={() => {
//                                 // Handle edit
//                                 setShowActions(null);
//                               }}
//                               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                             >
//                               <Edit className="w-4 h-4 mr-2" />
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => {
//                                 handleDeleteStudent(student.id);
//                                 setShowActions(null);
//                               }}
//                               className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                             >
//                               <Trash2 className="w-4 h-4 mr-2" />
//                               Delete
//                             </button>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination */}
//         <div className="px-6 py-4 border-t border-gray-200">
//           <Pagination
//             currentPage={currentPage}
//             totalItems={filteredStudents.length}
//             itemsPerPage={itemsPerPage}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </motion.div>

//       {/* Add Student Modal */}
//       <AnimatePresence>
//         {showAddModal && (
//           <AddStudentModal
//             onClose={() => setShowAddModal(false)}
//             onSubmit={handleAddStudent}
//           />
//         )}
//       </AnimatePresence>

//       {/* Bulk Upload Modal */}
//       <AnimatePresence>
//         {showBulkUpload && (
//           <BulkUploadModal
//             onClose={() => setShowBulkUpload(false)}
//             onSubmit={handleBulkUpload}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // Modal components would be defined here
// const AddStudentModal = ({ onClose, onSubmit }) => {
//   // Modal implementation
//   return null;
// };

// const BulkUploadModal = ({ onClose, onSubmit }) => {
//   // Modal implementation
//   return null;
// };

// export default Students;



import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import { studentsAPI, academicsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CreateStudent = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    date_of_birth: '',
    date_of_admission: new Date().toISOString().split('T')[0],
    gender: 'male',
    class_id: '',
    parent_email: '',
    parent_phone: '',
    emergency_contact: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await academicsAPI.getClasses();
      setClasses(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch classes');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.class_id) newErrors.class_id = 'Class is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (user && !user.is_active) {
      toast.error('Your account is inactive. Cannot create student.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create student with student role automatically
      const studentData = {
        ...formData,
        role: 'student', // Auto-assign student role
        school_id: user?.school_id,
      };
      
      await studentsAPI.createStudent(studentData);
      toast.success('Student created successfully!');
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        date_of_birth: '',
        date_of_admission: new Date().toISOString().split('T')[0],
        gender: 'male',
        class_id: '',
        parent_email: '',
        parent_phone: '',
        emergency_contact: '',
      });
    } catch (error) {
      toast.error('Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create New Student
      </Typography>
      
      {user && !user.is_active && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your account is inactive. You cannot create students until activated by super admin.
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, width: '100%' }}>
            Student Information
          </Typography>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name *"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              required
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name *"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              required
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth *"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth}
              InputLabelProps={{ shrink: true }}
              required
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Admission"
              name="date_of_admission"
              type="date"
              value={formData.date_of_admission}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={user && !user.is_active}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Class *"
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              error={!!errors.class_id}
              helperText={errors.class_id}
              required
              disabled={user && !user.is_active}
            >
              <MenuItem value="">Select Class</MenuItem>
              {classes.map((classItem) => (
                <MenuItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={2}
              value={formData.address}
              onChange={handleChange}
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1, width: '100%' }}>
            Parent/Guardian Information
          </Typography>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Parent Email"
              name="parent_email"
              type="email"
              value={formData.parent_email}
              onChange={handleChange}
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Parent Phone"
              name="parent_phone"
              value={formData.parent_phone}
              onChange={handleChange}
              disabled={user && !user.is_active}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Emergency Contact"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              disabled={user && !user.is_active}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || (user && !user.is_active)}
          >
            {loading ? 'Creating...' : 'Create Student'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreateStudent;