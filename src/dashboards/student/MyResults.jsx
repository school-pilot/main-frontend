import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FileText,
  TrendingUp,
  Download,
  Filter,
  Award,
  BookOpen,
  Calendar,
  Printer,
  Users,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  LineChart,
  Trophy,
} from 'lucide-react';
import { resultsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const MyResults = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    totalSubjects: 0,
    totalScore: 0,
    gpa: 0,
  });
  const [selectedTerm, setSelectedTerm] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user, selectedTerm, selectedSubject]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await resultsAPI.getStudentResults(user.id);
      const allResults = response.data || [];
      
      // Filter results based on selections
      let filteredResults = allResults;
      if (selectedTerm !== 'all') {
        filteredResults = filteredResults.filter(r => r.term === selectedTerm);
      }
      if (selectedSubject !== 'all') {
        filteredResults = filteredResults.filter(r => r.subject === selectedSubject);
      }
      
      setResults(filteredResults);
      
      // Calculate summary and performance data
      if (filteredResults.length > 0) {
        const totalScore = filteredResults.reduce((sum, r) => sum + (r.score || 0), 0);
        const averageScore = totalScore / filteredResults.length;
        const highestScore = Math.max(...filteredResults.map(r => r.score || 0));
        const lowestScore = Math.min(...filteredResults.map(r => r.score || 0));
        
        // Calculate GPA
        const totalGPA = filteredResults.reduce((sum, r) => {
          const gradeInfo = getGrade(r.score);
          return sum + gradeInfo.gpa;
        }, 0);
        const averageGPA = totalGPA / filteredResults.length;
        
        setSummary({
          average: averageScore.toFixed(1),
          highest: highestScore,
          lowest: lowestScore,
          totalSubjects: filteredResults.length,
          totalScore: totalScore,
          gpa: averageGPA.toFixed(2),
        });
        
        // Prepare performance data for chart
        const performanceChart = filteredResults.map((result, index) => ({
          subject: result.subject,
          score: result.score,
          grade: getGrade(result.score).grade,
          color: getGrade(result.score).color,
        }));
        setPerformanceData(performanceChart);
      }
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bgColor: 'bg-green-100', gpa: 4.0 };
    if (score >= 85) return { grade: 'A', color: 'text-green-600', bgColor: 'bg-green-100', gpa: 3.7 };
    if (score >= 80) return { grade: 'A-', color: 'text-green-600', bgColor: 'bg-green-100', gpa: 3.3 };
    if (score >= 75) return { grade: 'B+', color: 'text-blue-600', bgColor: 'bg-blue-100', gpa: 3.0 };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bgColor: 'bg-blue-100', gpa: 2.7 };
    if (score >= 65) return { grade: 'B-', color: 'text-blue-600', bgColor: 'bg-blue-100', gpa: 2.3 };
    if (score >= 60) return { grade: 'C+', color: 'text-yellow-600', bgColor: 'bg-yellow-100', gpa: 2.0 };
    if (score >= 55) return { grade: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-100', gpa: 1.7 };
    if (score >= 50) return { grade: 'C-', color: 'text-yellow-600', bgColor: 'bg-yellow-100', gpa: 1.3 };
    if (score >= 45) return { grade: 'D', color: 'text-gray-600', bgColor: 'bg-gray-100', gpa: 1.0 };
    return { grade: 'F', color: 'text-red-600', bgColor: 'bg-red-100', gpa: 0.0 };
  };

  const getRemarks = (score) => {
    if (score >= 90) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 80) return { text: 'Very Good', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 60) return { text: 'Satisfactory', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 50) return { text: 'Needs Improvement', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-green-400';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handlePrint = () => {
    window.print();
    toast.success('Printing results...');
  };

  const handleDownload = () => {
    toast.success('Downloading results report...');
  };

  const subjects = [...new Set(results.map(r => r.subject))];
  const terms = [...new Set(results.map(r => r.term))];

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
          <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
          <p className="text-gray-600">View your academic performance and results</p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {summary.average}%
              </h3>
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(summary.average)}`}
                    style={{ width: `${summary.average}%` }}
                  />
                </div>
              </div>
            </div>
            <TrendingUp className="w-10 h-10 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">GPA</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {summary.gpa}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Out of 4.0</p>
            </div>
            <Award className="w-10 h-10 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subjects</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {summary.totalSubjects}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Results available</p>
            </div>
            <BookOpen className="w-10 h-10 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Best Score</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {summary.highest}%
              </h3>
              <p className="text-sm text-gray-500 mt-1">Highest achieved</p>
            </div>
            <Trophy className="w-10 h-10 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Filter by Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="input-field"
            >
              <option value="all">All Terms</option>
              {terms.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Filter by Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedTerm('all');
                setSelectedSubject('all');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Detailed Results</h2>
            <p className="text-gray-600">All your assessment scores</p>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results found for the selected filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Subject</th>
                    <th className="table-header">Assessment</th>
                    <th className="table-header">Term</th>
                    <th className="table-header">Score</th>
                    <th className="table-header">Grade</th>
                    <th className="table-header">GPA</th>
                    <th className="table-header">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => {
                    const gradeInfo = getGrade(result.score);
                    const remarks = getRemarks(result.score);
                    
                    return (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="table-cell">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="font-medium">{result.subject}</span>
                          </div>
                        </td>
                        <td className="table-cell">{result.assessment}</td>
                        <td className="table-cell">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {result.term}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {result.score}
                            </span>
                            <span className="text-gray-500 ml-1">%</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${gradeInfo.bgColor} ${gradeInfo.color}`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="font-medium">{gradeInfo.gpa.toFixed(1)}</span>
                        </td>
                        <td className="table-cell">
                          <span className={`px-3 py-1 rounded-full text-sm ${remarks.bg} ${remarks.color}`}>
                            {remarks.text}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Performance Insights</h2>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>

          {results.length > 0 ? (
            <div className="space-y-6">
              {/* Grade Distribution */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Grade Distribution</h3>
                <div className="space-y-2">
                  {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'].map((grade) => {
                    const count = results.filter(r => getGrade(r.score).grade === grade).length;
                    const percentage = (count / results.length) * 100;
                    
                    return (
                      <div key={grade} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{grade}</span>
                          <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(percentage)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overall Assessment */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Overall Assessment</h3>
                <div className={`p-4 rounded-lg ${getRemarks(summary.average).bg}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        Overall Performance: <span className={getRemarks(summary.average).color}>
                          {getRemarks(summary.average).text}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Subjects */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Top Subjects</h3>
                <div className="space-y-2">
                  {performanceData
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <Trophy className={`w-4 h-4 mr-2 ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`} />
                          <span className="text-sm">{subject.subject}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{subject.score}%</span>
                          <span className={`ml-2 text-xs ${subject.color}`}>
                            {subject.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No performance data available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recommendations and Actions */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recommendations & Actions</h2>
            <Target className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900">Strengths</h3>
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 mt-0.5">•</div>
                  <span className="ml-2">Excellent performance in Mathematics and Physics</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 mt-0.5">•</div>
                  <span className="ml-2">Consistent improvement over the terms</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 mt-0.5">•</div>
                  <span className="ml-2">Strong analytical skills demonstrated in science subjects</span>
                </li>
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <h3 className="font-medium text-yellow-900">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 mt-0.5">•</div>
                  <span className="ml-2">Could improve in English and History subjects</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 mt-0.5">•</div>
                  <span className="ml-2">Focus on essay writing and creative expression</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-4 h-4 mt-0.5">•</div>
                  <span className="ml-2">Practice time management during examinations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3">Recommended Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center p-3 bg-white text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Study Schedule</span>
              </button>
              <button className="flex items-center justify-center p-3 bg-white text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">Meet Teacher</span>
              </button>
              <button className="flex items-center justify-center p-3 bg-white text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200">
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="text-sm">Progress Report</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Download Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Current Term Report</p>
                <p className="text-sm text-blue-600">PDF format with details</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">All Terms Report</p>
                <p className="text-sm text-green-600">Complete academic history</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Performance Chart</p>
                <p className="text-sm text-purple-600">Visual progress report</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MyResults;