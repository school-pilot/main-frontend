import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { attendanceAPI } from '../../../services/api';

const AttendanceChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await attendanceAPI.getSummary();
      // Transform API data for chart
      const chartData = response.data.daily_stats?.map(stat => ({
        date: stat.date,
        present: stat.present,
        absent: stat.absent,
        rate: stat.rate
      })) || [];
      
      setData(chartData);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={12}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Attendance Rate']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;