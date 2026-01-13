import React from "react";
import ChangePassAnimation from "../../components/ChanagePassAnimation.jsx"

const ChangePassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Form section - centered */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <ChangePassAnimation />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;