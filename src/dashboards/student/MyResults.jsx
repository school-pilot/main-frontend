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
} from 'lucide-react';
import { resultsAPI } from '../../services/api';
import Loader from '../../components/Loader';

const MyResults = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [overallStats, setOverallStats] = useState({});
  const [selectedTerm, setSelectedTerm] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      // Mock data for demonstration
      const mockResults = [
        {
          id: 1,
          subject: 'Mathematics',
          term: 'First Term',
          exam: 'Final Exam',
          score: 85,
          max_score: 100,
          grade: 'A',
          position: 5,
          total_students: 40,
          date: '2024-01-15',
        },
        {
          id: 2,
          subject: 'Physics',
          term: 'First Term',
          exam: 'Final Exam',
          score: 78,
          max_score: 100,
          grade: 'B',
          position: 12,
          total_students: 40,
          date: '2024-01-14',
        },
        {
          id: 3,
          subject: 'Chemistry',
          term: 'First Term',
          exam: 'Mid Term',
          score: 82,
          max_score: 100,
          grade: 'B+',
          position: 8,
          total_students: 40,
          date: '2024-01-10',
        },
        {
          id: 4,
          subject: 'English',
          term: 'First Term',
          exam: 'Final Exam',
          score: 92,
          max_score: 100,
          grade: 'A',
          position: 3,
          total_students: 40,
          date: '2024-01-13',
        },
        {
          id: 5,
          subject: 'Biology',
          term: 'First Term',
          exam: 'Class Test',
          score: 76,
          max_score: 100,
          grade: 'B',
          position: 15,
          total_students: 40,
          date: '2024-01-08',
        },
      ];

      setResults(mockResults);

      // Calculate overall stats
      const totalScore = mockResults.reduce((sum, result) => sum + result.score, 0);
      const averageScore = totalScore / mockResults.length;
      const totalSubjects = [...new Set(mockResults.map(r => r.subject))].length;
      
      setOverallStats({
        averageScore: averageScore.toFixed(1),
        totalSubjects,
        bestSubject: mockResults.reduce((best, current) => 
          current.score > best.score ? current : best
        ),
        recentExam: mockResults[0],
      });
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'text-green-600';
      case 'B+':
        return 'text-blue-600';
      case 'B':
        return 'text-yellow-600';
      case 'C':
        return 'text-orange-600';
      default:
        return 'text-red-600';
    }
  };

  const getGradeBackground = (grade) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B+':
        return 'bg-blue-100 text-blue-800';
      case 'B':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredResults = results.filter(result => {
    const matchesTerm = selectedTerm === 'all' || result.term === selectedTerm;
    const matchesSubject = selectedSubject === 'all' || result.subject === selectedSubject;
    return matchesTerm && matchesSubject;
  });

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
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {overallStats.averageScore}%
              </h3>
            </div>
            <TrendingUp className="w-10 h-10 text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subjects</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {overallStats.totalSubjects}
              </h3>
            </div>
            <BookOpen className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Best Subject</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {overallStats.bestSubject?.subject}
              </h3>
              <p className="text-sm text-gray-500">{overallStats.bestSubject?.score}%</p>
            </div>
            <Award className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Exam</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {overallStats.recentExam?.exam}
              </h3>
              <p className="text-sm text-gray-500">{overallStats.recentExam?.date}</p>
            </div>
            <Calendar className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Term
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTerm('all')}
                className={`px-4 py-2 rounded-lg ${
                  selectedTerm === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                All Terms
              </button>
              {terms.map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedTerm === term
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Subject</th>
                <th className="table-header">Term</th>
                <th className="table-header">Exam</th>
                <th className="table-header">Score</th>
                <th className="table-header">Grade</th>
                <th className="table-header">Position</th>
                <th className="table-header">Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result, index) => (
                <motion.tr
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="table-cell font-medium">{result.subject}</td>
                  <td className="table-cell">{result.term}</td>
                  <td className="table-cell">{result.exam}</td>
                  <td className="table-cell">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-gray-900">
                        {result.score}
                      </span>
                      <span className="text-gray-500 ml-1">/{result.max_score}</span>
                      <span className="ml-3 text-sm text-gray-500">
                        ({((result.score / result.max_score) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeBackground(
                        result.grade
                      )}`}
                    >
                      {result.grade}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900">
                        #{result.position}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        /{result.total_students}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    {new Date(result.date).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <button className="text-primary-600 hover:text-primary-700">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Performance Summary
        </h2>
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <div key={result.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{result.subject}</h4>
                  <p className="text-sm text-gray-600">{result.exam}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getGradeColor(result.grade)}`}>
                  {result.grade} ({result.score}%)
                </p>
                <p className="text-sm text-gray-600">
                  Position: #{result.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Download Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Download Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Current Term Report</p>
                <p className="text-sm">PDF format</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">All Terms Report</p>
                <p className="text-sm">PDF format</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Performance Chart</p>
                <p className="text-sm">Image format</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MyResults;