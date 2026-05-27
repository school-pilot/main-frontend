import React from "react";

import LoginAnimation from "../../components/loginAnimation.jsx";
import Image from "../../assets/image.js";

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden w-full">
      {/* Video section (desktop only) */}
      <div className="hidden md:block md:w-1/2 relative h-full bg-gray-200 overflow-hidden">
      <img src={Image.Logo} alt="" />
      </div>

      {/* Form section */}
      <div className="w-full md:w-1/2 h-full p-1">
        <LoginAnimation />
      </div>
    </div>
  );
};

export default Login;
