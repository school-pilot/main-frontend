import React from "react";

import RegisterAnimation from "../../components/registerAnimation.jsx";
import Image from "../../assets/image.js";


const Register = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden w-full">
      {/* Video section (desktop only) */}
      <div className="hidden md:block md:w-1/2 relative h-full bg-gray-200 overflow-hidden">
       <img src={Image.Logo} alt="" />
      </div>

      {/* Form section */}
      <div className="w-full md:w-1/2 p-1">
       <RegisterAnimation />
      </div>
    </div>
  );
};

export default Register;
