import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Download,
  BarChart3,
  CalendarDays,
  Clock as ClockIcon,
  Users,
  Target,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Loader from '../../components/Loader';

const StudentAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedView, setSelectedView] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockAttendanceData(selectedMonth, selectedYear);
      setAttendanceData(mockData);
      
      // Calculate summary
      const totalDays = mockData.length;
      const presentDays = mockData.filter(d => d.status === 'present').length;
      const absentDays = mockData.filter(d => d.status === 'absent').length;
      const lateDays = mockData.filter(d => d.status === 'late').length;
      const excusedDays = mockData.filter(d => d.status === 'excused').length;
      const attendanceRate = (presentDays / totalDays) * 100;
      
      setSummary({
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        attendanceRate: attendanceRate.toFixed(1),
        consecutivePresent: calculateConsecutiveDays(mockData, 'present'),
        consecutiveAbsent: calculateConsecutiveDays(mockData, 'absent'),
        lastAbsent: mockData.find(d => d.status === 'absent')?.date || null
      });
      
      setLoading(false);
    }, 1000);
  }, [selectedMonth, selectedYear]);

  const generateMockAttendanceData = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
      
      // Simulate realistic attendance patterns
      let status = 'present';
      const random = Math.random();
      
      if (random < 0.05) { // 5% chance of absent
        status = 'absent';
      } else if (random < 0.10) { // 5% chance of late
        status = 'late';
      } else if (random < 0.12) { // 2% chance of excused
        status = 'excused';
      }
      
      // Add reasons based on status
      let reason = '';
      let classTimes = [];
      
      if (status === 'present') {
        reason = 'Regular attendance';
        classTimes = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'];
      } else if (status === 'late') {
        reason = 'Arrived at 08:15 AM';
        classTimes = ['08:15 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'];
      } else if (status === 'absent') {
        reason = 'Medical leave';
        classTimes = [];
      } else if (status === 'excused') {
        reason = 'School event';
        classTimes = ['09:00 - 10:00', '10:00 - 11:00'];
      }
      
      data.push({
        id: day,
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        status,
        reason,
        classTimes,
        checkIn: status === 'present' ? '07:45 AM' : status === 'late' ? '08:15 AM' : null,
        checkOut: status === 'present' || status === 'late' ? '03:30 PM' : null,
        teacherRemarks: status === 'late' ? 'Please arrive on time' : ''
      });
    }
    
    return data;
  };

  const calculateConsecutiveDays = (data, status) => {
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    
    data.forEach(day => {
      if (day.status === status) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    });
    
    return maxConsecutive;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'excused':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-50';
      case 'absent':
        return 'bg-red-50';
      case 'late':
        return 'bg-yellow-50';
      case 'excused':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  const filteredData = attendanceData.filter(item =>
    item.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Attendance Record</h1>
          <p className="text-gray-600">Track your daily attendance and patterns</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Attendance Rate</p>
              <h3 className="text-2xl font-bold text-green-900 mt-2">
                {summary.attendanceRate}%
              </h3>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">Above target (95%)</span>
              </div>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Present Days</p>
              <h3 className="text-2xl font-bold text-blue-900 mt-2">
                {summary.presentDays}
              </h3>
              <div className="flex items-center mt-2">
                <Award className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600 ml-1">
                  {summary.consecutivePresent} consecutive days
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Absent Days</p>
              <h3 className="text-2xl font-bold text-red-900 mt-2">
                {summary.absentDays}
              </h3>
              {summary.absentDays > 0 && (
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 ml-1">
                    Last: {summary.lastAbsent ? new Date(summary.lastAbsent).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Late Arrivals</p>
              <h3 className="text-2xl font-bold text-yellow-900 mt-2">
                {summary.lateDays}
              </h3>
              <div className="flex items-center mt-2">
                <ClockIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 ml-1">Need improvement</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendar Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search attendance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="flex space-x-2">
              {['monthly', 'weekly', 'daily'].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                    selectedView === view
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Attendance Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {months[selectedMonth]} {selectedYear} Attendance
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4" />
            <span>{summary.totalDays} school days</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Late</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Excused</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for the first day of month */}
          {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() - 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24"></div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: new Date(selectedYear, selectedMonth + 1, 0).getDate() }).map((_, i) => {
            const day = i + 1;
            const date = new Date(selectedYear, selectedMonth, day);
            const attendance = attendanceData.find(a => 
              new Date(a.date).getDate() === day
            );
            
            if (date.getDay() === 0 || date.getDay() === 6) {
              return (
                <div key={day} className="h-24 p-2 bg-gray-50 rounded-lg text-center">
                  <div className="text-gray-400">{day}</div>
                  <div className="text-xs text-gray-400 mt-1">Weekend</div>
                </div>
              );
            }
            
            return (
              <div
                key={day}
                className={`h-24 p-2 rounded-lg border transition-all hover:shadow-md ${
                  attendance ? `${getStatusBgColor(attendance.status)} border-${getStatusColor(attendance.status).split('-')[1]}-200` : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium text-gray-900">{day}</div>
                  {attendance && (
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(attendance.status)}`}>
                      {attendance.status.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {attendance && (
                  <div className="mt-2 space-y-1">
                    {attendance.checkIn && (
                      <div className="text-xs text-gray-600 flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {attendance.checkIn}
                      </div>
                    )}
                    {attendance.status === 'late' && (
                      <div className="text-xs text-yellow-600">Late arrival</div>
                    )}
                    {attendance.status === 'excused' && (
                      <div className="text-xs text-blue-600">Excused</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Detailed Attendance List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Attendance Details</h3>
          <p className="text-gray-600">Click on any day to view detailed information</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In/Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason/Remarks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors ${getStatusBgColor(item.status)}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.day}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(item.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.checkIn ? (
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">In: {item.checkIn}</div>
                        <div className="text-sm text-gray-900">Out: {item.checkOut}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Not recorded</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{item.reason}</div>
                    {item.teacherRemarks && (
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">Teacher: </span>
                        {item.teacherRemarks}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {item.classTimes.length > 0 ? (
                        item.classTimes.map((time, idx) => (
                          <div key={idx} className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                            {time}
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500">No classes</div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Attendance Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-green-600">Present Days</span>
                <span className="text-sm font-medium text-gray-700">
                  {summary.presentDays} ({summary.attendanceRate}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${summary.attendanceRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-red-600">Absent Days</span>
                <span className="text-sm font-medium text-gray-700">
                  {summary.absentDays} ({((summary.absentDays / summary.totalDays) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(summary.absentDays / summary.totalDays) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-yellow-600">Late Arrivals</span>
                <span className="text-sm font-medium text-gray-700">
                  {summary.lateDays} ({((summary.lateDays / summary.totalDays) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(summary.lateDays / summary.totalDays) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Tips */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm p-6 border border-primary-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Tips</h3>
            <Target className="w-5 h-5 text-primary-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <Calendar className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Regular Attendance</h4>
                <p className="text-sm text-gray-600">
                  Maintain your {summary.consecutivePresent} day streak! Aim for 100% monthly attendance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <ClockIcon className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Punctuality</h4>
                <p className="text-sm text-gray-600">
                  Try to arrive 10-15 minutes early to avoid being marked late.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <AlertCircle className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Absence Notice</h4>
                <p className="text-sm text-gray-600">
                  Always inform your teacher in advance if you need to be absent.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-primary-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Next milestone:</p>
              <p className="text-lg font-bold text-primary-600">
                {30 - summary.presentDays} more days for perfect monthly attendance
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{summary.totalDays}</div>
            <p className="text-sm text-gray-600">Total Days</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">{summary.presentDays}</div>
            <p className="text-sm text-green-600">Present</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-900">{summary.absentDays}</div>
            <p className="text-sm text-red-600">Absent</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-900">{summary.lateDays}</div>
            <p className="text-sm text-yellow-600">Late</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentAttendance;