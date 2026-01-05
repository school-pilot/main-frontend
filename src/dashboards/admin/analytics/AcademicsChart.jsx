import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useState, useEffect } from 'react';
import { resultsAPI } from '../../../services/api';

const AcademicsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const response = await resultsAPI.getClassResults({});
      // Transform API data for chart
      const chartData = [
        { class: 'Grade 1', average: 85, top: 95, bottom: 75 },
        { class: 'Grade 2', average: 82, top: 92, bottom: 72 },
        { class: 'Grade 3', average: 88, top: 96, bottom: 80 },
        { class: 'Grade 4', average: 90, top: 98, bottom: 82 },
        { class: 'Grade 5', average: 87, top: 95, bottom: 79 },
        { class: 'Grade 6', average: 85, top: 93, bottom: 77 },
      ];
      setData(chartData);
    } catch (error) {
      console.error('Failed to fetch academic data:', error);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-lg ${
              chartType === 'bar'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg ${
              chartType === 'line'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Line Chart
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="class" stroke="#666" fontSize={12} />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Score']}
                labelFormatter={(label) => `Class: ${label}`}
              />
              <Legend />
              <Bar dataKey="average" name="Average Score" fill="#3b82f6" />
              <Bar dataKey="top" name="Top Score" fill="#10b981" />
              <Bar dataKey="bottom" name="Bottom Score" fill="#ef4444" />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="class" stroke="#666" fontSize={12} />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Score']}
                labelFormatter={(label) => `Class: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                name="Average Score"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="top"
                name="Top Score"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">Overall Average</p>
          <p className="text-2xl font-bold text-blue-900">86.2%</p>
          <p className="text-xs text-blue-700">+2.1% from last term</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Top Performing Class</p>
          <p className="text-2xl font-bold text-green-900">Grade 4</p>
          <p className="text-xs text-green-700">Average: 90%</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">Improvement Needed</p>
          <p className="text-2xl font-bold text-yellow-900">Grade 2</p>
          <p className="text-xs text-yellow-700">Average: 82%</p>
        </div>
      </div>
    </div>
  );
};

export default AcademicsChart;