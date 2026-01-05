import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  Users,
  CreditCard,
  BookOpen,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { reportsAPI, studentsAPI, teachersAPI, feesAPI } from '../../services/api';
import Loader from '../../components/Loader';
import AttendanceChart from './analytics/AttendanceChart';
import FeesChart from './analytics/FeesChart';
import AcademicsChart from './analytics/AcademicsChart';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    attendance: {},
    fees: {},
    academics: {},
    summary: {},
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [attendanceRes, feesRes, academicsRes, studentsRes, teachersRes] =
        await Promise.all([
          reportsAPI.getAttendanceReports(),
          reportsAPI.getFeesReports(),
          reportsAPI.getAcademicsReports(),
          studentsAPI.getAll(),
          teachersAPI.getAll(),
        ]);

      const feesInvoices = await feesAPI.getInvoices();
      const paidFees = feesInvoices.data.filter(inv => inv.status === 'paid');

      setReportData({
        attendance: attendanceRes.data,
        fees: feesRes.data,
        academics: academicsRes.data,
        summary: {
          totalStudents: studentsRes.data.length,
          totalTeachers: teachersRes.data.length,
          totalRevenue: paidFees.reduce((sum, inv) => sum + inv.amount, 0),
          attendanceRate: attendanceRes.data.average_rate || 0,
        },
      });
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    // In a real app, this would generate and download a report file
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}`);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and analytics</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="input-field"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input-field"
            />
          </div>

          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </motion.div>

      {/* Report Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['summary', 'attendance', 'fees', 'academics', 'detailed'].map(
            (type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-1 py-4 text-sm font-medium border-b-2 capitalize ${
                  reportType === type
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {type} Report
              </button>
            )
          )}
        </nav>
      </div>

      {/* Summary Stats */}
      {reportType === 'summary' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {reportData.summary.totalStudents}
                </h3>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+5%</span>
                </div>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {reportData.summary.totalTeachers}
                </h3>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+2%</span>
                </div>
              </div>
              <Users className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  ${reportData.summary.totalRevenue.toLocaleString()}
                </h3>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+18%</span>
                </div>
              </div>
              <CreditCard className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {reportData.summary.attendanceRate}%
                </h3>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 ml-1">-2%</span>
                </div>
              </div>
              <BarChart3 className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(reportType === 'summary' || reportType === 'attendance') && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Attendance Overview
              </h3>
              <button
                onClick={() => exportReport('csv')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Export Data
              </button>
            </div>
            <AttendanceChart />
          </motion.div>
        )}

        {(reportType === 'summary' || reportType === 'fees') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Fees Collection
              </h3>
              <button
                onClick={() => exportReport('csv')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Export Data
              </button>
            </div>
            <FeesChart />
          </motion.div>
        )}
      </div>

      {/* Academics Chart */}
      {(reportType === 'summary' || reportType === 'academics') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Academic Performance
            </h3>
            <button
              onClick={() => exportReport('csv')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Export Data
            </button>
          </div>
          <AcademicsChart />
        </motion.div>
      )}

      {/* Detailed Report Table */}
      {reportType === 'detailed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Detailed Report
            </h3>
            <p className="text-gray-600">
              Comprehensive data for the selected period
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Date</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Metric</th>
                  <th className="table-header">Value</th>
                  <th className="table-header">Change</th>
                  <th className="table-header">Target</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    date: '2024-01-15',
                    category: 'Attendance',
                    metric: 'Daily Attendance',
                    value: '95%',
                    change: '+2%',
                    target: '96%',
                    status: 'On Track',
                  },
                  {
                    date: '2024-01-15',
                    category: 'Fees',
                    metric: 'Collection Rate',
                    value: '88%',
                    change: '+5%',
                    target: '90%',
                    status: 'Behind',
                  },
                  {
                    date: '2024-01-15',
                    category: 'Academics',
                    metric: 'Average Score',
                    value: '82%',
                    change: '+3%',
                    target: '85%',
                    status: 'On Track',
                  },
                  {
                    date: '2024-01-14',
                    category: 'Attendance',
                    metric: 'Daily Attendance',
                    value: '93%',
                    change: '-1%',
                    target: '96%',
                    status: 'Behind',
                  },
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="table-cell">{row.date}</td>
                    <td className="table-cell">{row.category}</td>
                    <td className="table-cell">{row.metric}</td>
                    <td className="table-cell font-medium">{row.value}</td>
                    <td className="table-cell">
                      <span
                        className={
                          row.change.startsWith('+')
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {row.change}
                      </span>
                    </td>
                    <td className="table-cell">{row.target}</td>
                    <td className="table-cell">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          row.status === 'On Track'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Key Insights</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Attendance rate has improved by 5% this month</span>
              </li>
              <li className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                <span>Fee collection is 12% higher than last month</span>
              </li>
              <li className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>Academic performance shows steady improvement</span>
              </li>
            </ul>
          </div>
          <div className="text-right">
            <p className="text-primary-100">Report Generated</p>
            <p className="text-xl font-bold">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;