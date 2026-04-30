// components/DotSpinner.jsx (clean centered version)
import React from "react";

const DotSpinner = ({ size = "2.8rem", speed = "0.9s", color = "#183153" }) => {
  const spinnerStyle = {
    "--uib-size": size,
    "--uib-speed": speed,
    "--uib-color": color,
  };

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="dot-spinner" style={spinnerStyle}>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    </div>
  );
};

export default DotSpinner;