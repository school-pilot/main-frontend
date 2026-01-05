import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { feesAPI } from '../../../services/api';

const FeesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeesData();
  }, []);

  const fetchFeesData = async () => {
    try {
      const response = await feesAPI.getInvoices();
      const invoices = response.data;
      
      // Calculate data for pie chart
      const feeData = [
        { name: 'Paid', value: invoices.filter(inv => inv.status === 'paid').length },
        { name: 'Unpaid', value: invoices.filter(inv => inv.status === 'unpaid').length },
        { name: 'Partial', value: invoices.filter(inv => inv.status === 'partial').length },
        { name: 'Overdue', value: invoices.filter(inv => inv.status === 'overdue').length },
      ];
      
      setData(feeData);
    } catch (error) {
      console.error('Failed to fetch fees data:', error);
      // Fallback data
      setData([
        { name: 'Paid', value: 65 },
        { name: 'Unpaid', value: 20 },
        { name: 'Partial', value: 10 },
        { name: 'Overdue', value: 5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6366f1'];

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Invoices']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="font-medium">{item.value}</span>
              <span className="text-xs text-gray-500 ml-1">
                ({(item.value / total * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeesChart;