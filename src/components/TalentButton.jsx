import React from 'react';

const TalentButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 rounded-full border border-gray-700 
                 bg-gray-800/80 px-4 py-1.5 text-sm font-medium text-gray-200 
                 shadow-md backdrop-blur-lg transition-all hover:bg-gray-700 
                 hover:border-gray-600 active:scale-95"
    >
      {/* Green pulse dot */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
      </span>
      Looking to Hire?
    </button>
  );
};

export default TalentButton;