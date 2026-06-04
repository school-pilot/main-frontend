import React from "react";

const SchoolAdminDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-md shadow-sm">
        <h1 className="text-2xl font-bold text-blue-800 mb-3">
          Maintenance Mode
        </h1>

        <p className="text-gray-600 text-base mb-4">
          The School Admin Dashboard is currently undergoing updates to improve
          performance and user experience.
        </p>

        <p className="text-gray-500 text-sm">
          You will get updates soon. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;