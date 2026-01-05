import React from "react";
import Image from "../../assets/image.js";
import ChangePassAnimation from "../../components/ChanagePassAnimation.jsx";

const ChangePassword = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen justify-center items-center">
      {/* Video section (desktop only) */}
      <div className="hidden md:block md:w-1/2 relative min-h-screen bg-gray-200 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={Image.intro} type="video/mp4" />
        </video>
      </div>

      {/* Form section */}
      <div className="w-full md:w-1/2 min-h-screen p-1">
        <ChangePassAnimation />
      </div>
    </div>
  );
};

export default ChangePassword;
