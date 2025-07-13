import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-blue-400 font-mono">
      {/* System text */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center mt-2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
