import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
          {change && (
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600 font-medium">{change}</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;