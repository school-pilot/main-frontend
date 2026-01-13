// import { motion } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import {
//   BookOpen,
//   Filter,
//   Save,
//   Download,
//   Upload,
//   TrendingUp,
//   Calculator,
// } from 'lucide-react';
// import { resultsAPI, teachersAPI } from '../../services/api';
// import toast from 'react-hot-toast';
// import Loader from '../../components/Loader';

// const EnterScores = () => {
//   const [loading, setLoading] = useState(true);
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedAssessment, setSelectedAssessment] = useState('');
//   const [students, setStudents] = useState([]);
//   const [scores, setScores] = useState({});
//   const [saving, setSaving] = useState(false);

//   const assessments = [
//     { id: 1, name: 'First Term Exam', max_score: 100 },
//     { id: 2, name: 'Mid Term Test', max_score: 50 },
//     { id: 3, name: 'Class Test 1', max_score: 20 },
//     { id: 4, name: 'Assignment 1', max_score: 10 },
//   ];

//   const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     if (selectedClass) {
//       fetchStudents();
//     }
//   }, [selectedClass]);

//   const fetchClasses = async () => {
//     try {
//       const response = await teachersAPI.getClasses(1); // Assuming teacher ID 1
//       setClasses(response.data);
//       if (response.data.length > 0) {
//         setSelectedClass(response.data[0].id);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch classes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStudents = () => {
//     // Mock student data
//     const mockStudents = [
//       { id: 1, name: 'John Doe', admission_number: 'S001' },
//       { id: 2, name: 'Jane Smith', admission_number: 'S002' },
//       { id: 3, name: 'Bob Johnson', admission_number: 'S003' },
//       { id: 4, name: 'Alice Brown', admission_number: 'S004' },
//       { id: 5, name: 'Charlie Wilson', admission_number: 'S005' },
//       { id: 6, name: 'David Lee', admission_number: 'S006' },
//       { id: 7, name: 'Emma Davis', admission_number: 'S007' },
//     ];
//     setStudents(mockStudents);

//     // Initialize scores
//     const initialScores = {};
//     mockStudents.forEach(student => {
//       initialScores[student.id] = '';
//     });
//     setScores(initialScores);
//   };

//   const handleScoreChange = (studentId, value) => {
//     const maxScore = assessments.find(a => a.id === parseInt(selectedAssessment))?.max_score || 100;
//     const numericValue = parseFloat(value);
    
//     if (value === '' || (numericValue >= 0 && numericValue <= maxScore)) {
//       setScores(prev => ({
//         ...prev,
//         [studentId]: value,
//       }));
//     }
//   };

//   const handleSaveScores = async () => {
//     if (!selectedClass || !selectedSubject || !selectedAssessment) {
//       toast.error('Please select class, subject, and assessment');
//       return;
//     }

//     setSaving(true);
//     try {
//       const scoreData = Object.entries(scores)
//         .filter(([_, score]) => score !== '')
//         .map(([studentId, score]) => ({
//           student_id: studentId,
//           assessment_id: selectedAssessment,
//           subject: selectedSubject,
//           score: parseFloat(score),
//           class_id: selectedClass,
//         }));

//       await resultsAPI.enterScores({ scores: scoreData });
//       toast.success('Scores saved successfully');
//     } catch (error) {
//       toast.error('Failed to save scores');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const calculateStats = () => {
//     const validScores = Object.values(scores)
//       .filter(score => score !== '')
//       .map(score => parseFloat(score));
    
//     if (validScores.length === 0) return null;

//     const maxScore = Math.max(...validScores);
//     const minScore = Math.min(...validScores);
//     const avgScore = validScores.reduce((a, b) => a + b, 0) / validScores.length;

//     return { max: maxScore.toFixed(1), min: minScore.toFixed(1), avg: avgScore.toFixed(1) };
//   };

//   const stats = calculateStats();

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
//           <h1 className="text-2xl font-bold text-gray-900">Enter Scores</h1>
//           <p className="text-gray-600">Enter and manage student assessment scores</p>
//         </div>

//         <div className="flex items-center space-x-3">
//           <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
//             <Download className="w-4 h-4" />
//             <span>Download Template</span>
//           </button>
//           <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
//             <Upload className="w-4 h-4" />
//             <span>Bulk Upload</span>
//           </button>
//         </div>
//       </motion.div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white rounded-xl shadow-sm p-4"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Class
//             </label>
//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="input-field"
//             >
//               <option value="">Select Class</option>
//               {classes.map((cls) => (
//                 <option key={cls.id} value={cls.id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Subject
//             </label>
//             <select
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               className="input-field"
//             >
//               <option value="">Select Subject</option>
//               {subjects.map((subject) => (
//                 <option key={subject} value={subject}>
//                   {subject}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Assessment Type
//             </label>
//             <select
//               value={selectedAssessment}
//               onChange={(e) => setSelectedAssessment(e.target.value)}
//               className="input-field"
//             >
//               <option value="">Select Assessment</option>
//               {assessments.map((assessment) => (
//                 <option key={assessment.id} value={assessment.id}>
//                   {assessment.name} (Max: {assessment.max_score})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={handleSaveScores}
//               disabled={saving || !selectedClass || !selectedSubject || !selectedAssessment}
//               className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {saving ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Saving...</span>
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4" />
//                   <span>Save Scores</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Statistics */}
//       {stats && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-xl shadow-sm p-6"
//         >
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Score Statistics
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="text-center p-4 bg-green-50 rounded-lg">
//               <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
//               <p className="text-2xl font-bold text-green-900">{stats.max}</p>
//               <p className="text-sm text-green-600">Highest Score</p>
//             </div>
//             <div className="text-center p-4 bg-yellow-50 rounded-lg">
//               <Calculator className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
//               <p className="text-2xl font-bold text-yellow-900">{stats.avg}</p>
//               <p className="text-sm text-yellow-600">Average Score</p>
//             </div>
//             <div className="text-center p-4 bg-red-50 rounded-lg">
//               <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-2" />
//               <p className="text-2xl font-bold text-red-900">{stats.min}</p>
//               <p className="text-sm text-red-600">Lowest Score</p>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Scores Entry Table */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white rounded-xl shadow-sm overflow-hidden"
//       >
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Enter Scores for Students
//           </h2>
//           <p className="text-gray-600">
//             {selectedAssessment && assessments.find(a => a.id === parseInt(selectedAssessment))?.name} - 
//             Max Score: {selectedAssessment && assessments.find(a => a.id === parseInt(selectedAssessment))?.max_score}
//           </p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="table-header">#</th>
//                 <th className="table-header">Admission No.</th>
//                 <th className="table-header">Student Name</th>
//                 <th className="table-header">Score</th>
//                 <th className="table-header">Grade</th>
//                 <th className="table-header">Remark</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {students.map((student, index) => {
//                 const score = scores[student.id] || '';
//                 const maxScore = selectedAssessment 
//                   ? assessments.find(a => a.id === parseInt(selectedAssessment))?.max_score || 100 
//                   : 100;
//                 const percentage = score ? (parseFloat(score) / maxScore) * 100 : 0;
                
//                 const getGrade = (percentage) => {
//                   if (percentage >= 80) return 'A';
//                   if (percentage >= 70) return 'B';
//                   if (percentage >= 60) return 'C';
//                   if (percentage >= 50) return 'D';
//                   return 'F';
//                 };

//                 const getGradeColor = (grade) => {
//                   switch (grade) {
//                     case 'A': return 'text-green-600';
//                     case 'B': return 'text-blue-600';
//                     case 'C': return 'text-yellow-600';
//                     case 'D': return 'text-orange-600';
//                     case 'F': return 'text-red-600';
//                     default: return 'text-gray-600';
//                   }
//                 };

//                 const grade = score ? getGrade(percentage) : '-';
//                 const gradeColor = getGradeColor(grade);

//                 return (
//                   <motion.tr
//                     key={student.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                   >
//                     <td className="table-cell">{index + 1}</td>
//                     <td className="table-cell font-medium">
//                       {student.admission_number}
//                     </td>
//                     <td className="table-cell">{student.name}</td>
//                     <td className="table-cell">
//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="number"
//                           min="0"
//                           max={maxScore}
//                           step="0.5"
//                           value={score}
//                           onChange={(e) => handleScoreChange(student.id, e.target.value)}
//                           className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                           placeholder="Enter score"
//                         />
//                         <span className="text-sm text-gray-500">/ {maxScore}</span>
//                       </div>
//                     </td>
//                     <td className={`table-cell font-medium ${gradeColor}`}>
//                       {grade}
//                     </td>
//                     <td className="table-cell">
//                       {score && (
//                         <span className={`text-sm ${
//                           percentage >= 50 ? 'text-green-600' : 'text-red-600'
//                         }`}>
//                           {percentage >= 50 ? 'Pass' : 'Fail'}
//                         </span>
//                       )}
//                     </td>
//                   </motion.tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       {/* Quick Actions */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-sm p-6"
//       >
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Quick Actions
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button
//             onClick={() => {
//               const avgScore = stats?.avg ? parseFloat(stats.avg) : 0;
//               const newScores = {};
//               students.forEach(student => {
//                 newScores[student.id] = avgScore.toFixed(1);
//               });
//               setScores(newScores);
//               toast.info('All scores set to average');
//             }}
//             className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
//           >
//             <div className="flex items-center">
//               <Calculator className="w-5 h-5 mr-3" />
//               <div>
//                 <p className="font-medium">Set All to Average</p>
//                 <p className="text-sm">Fill all with average score</p>
//               </div>
//             </div>
//           </button>
          
//           <button
//             onClick={() => {
//               const maxScore = selectedAssessment 
//                 ? assessments.find(a => a.id === parseInt(selectedAssessment))?.max_score || 100 
//                 : 100;
//               const newScores = {};
//               students.forEach(student => {
//                 newScores[student.id] = maxScore.toString();
//               });
//               setScores(newScores);
//               toast.info('All scores set to maximum');
//             }}
//             className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
//           >
//             <div className="flex items-center">
//               <TrendingUp className="w-5 h-5 mr-3" />
//               <div>
//                 <p className="font-medium">Set All to Max</p>
//                 <p className="text-sm">Fill all with maximum score</p>
//               </div>
//             </div>
//           </button>
          
//           <button
//             onClick={() => {
//               const newScores = {};
//               students.forEach(student => {
//                 newScores[student.id] = '';
//               });
//               setScores(newScores);
//               toast.info('All scores cleared');
//             }}
//             className="p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
//           >
//             <div className="flex items-center">
//               <BookOpen className="w-5 h-5 mr-3" />
//               <div>
//                 <p className="font-medium">Clear All Scores</p>
//                 <p className="text-sm">Remove all entered scores</p>
//               </div>
//             </div>
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };
 
// export default EnterScores;   import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { studentsAPI, resultsAPI, academicsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EnterScores = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [assessments, setAssessments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchAssessments();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await teachersAPI.getTeacherClasses(user.id);
      setClasses(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch classes');
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await resultsAPI.getAssessments();
      setAssessments(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch assessments');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await academicsAPI.getSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentsAPI.getStudents();
      const classStudents = response.data.slice(0, 10); // Mock data
      setStudents(classStudents);
      
      // Initialize scores
      const initialScores = {};
      classStudents.forEach(student => {
        initialScores[student.id] = '';
      });
      setScores(initialScores);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (studentId, value) => {
    // Validate score (0-100)
    const score = Math.min(Math.max(0, parseInt(value) || 0), 100);
    setScores({
      ...scores,
      [studentId]: score,
    });
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject || !selectedAssessment) {
      toast.error('Please select class, subject, and assessment');
      return;
    }

    setSaving(true);
    try {
      const scoreRecords = Object.entries(scores)
        .filter(([_, score]) => score !== '')
        .map(([studentId, score]) => ({
          student_id: studentId,
          subject_id: selectedSubject,
          assessment_id: selectedAssessment,
          score: parseFloat(score),
          class_id: selectedClass,
          teacher_id: user.id,
        }));

      await resultsAPI.enterScores(scoreRecords);
      toast.success('Scores entered successfully!');
      
      // Clear form
      setScores({});
      setSelectedSubject('');
      setSelectedAssessment('');
    } catch (error) {
      toast.error('Failed to enter scores');
    } finally {
      setSaving(false);
    }
  };

  const calculateGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: 'success' };
    if (score >= 80) return { grade: 'B', color: 'info' };
    if (score >= 70) return { grade: 'C', color: 'warning' };
    if (score >= 60) return { grade: 'D', color: 'default' };
    return { grade: 'F', color: 'error' };
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Enter Student Scores
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Select Class"
              >
                <MenuItem value="">Select a class</MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                label="Select Subject"
                disabled={!selectedClass}
              >
                <MenuItem value="">Select a subject</MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Assessment</InputLabel>
              <Select
                value={selectedAssessment}
                onChange={(e) => setSelectedAssessment(e.target.value)}
                label="Select Assessment"
                disabled={!selectedClass || !selectedSubject}
              >
                <MenuItem value="">Select an assessment</MenuItem>
                {assessments.map((assessment) => (
                  <MenuItem key={assessment.id} value={assessment.id}>
                    {assessment.name} ({assessment.weight}%)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {selectedClass && selectedSubject && selectedAssessment && (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Enter Scores for {students.length} Students
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Scores'}
              </Button>
            </Box>
          </Box>
          
          {loading ? (
            <Typography>Loading students...</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Roll Number</TableCell>
                    <TableCell>Score (0-100)</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => {
                    const score = scores[student.id] || '';
                    const gradeInfo = score !== '' ? calculateGrade(score) : null;
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell>{student.roll_number || 'N/A'}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={score}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            size="small"
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          {gradeInfo && (
                            <Chip
                              label={gradeInfo.grade}
                              color={gradeInfo.color}
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {gradeInfo && (
                            <Typography variant="body2" color="textSecondary">
                              {gradeInfo.grade === 'A' ? 'Excellent' :
                               gradeInfo.grade === 'B' ? 'Good' :
                               gradeInfo.grade === 'C' ? 'Average' :
                               gradeInfo.grade === 'D' ? 'Below Average' : 'Fail'}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default EnterScores;