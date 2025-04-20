import React from 'react';

const Sidebar = ({ onSelectFrame }) => {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 border-r w-48">
      <h2 className="text-lg font-semibold">Choose Frame</h2>
      <button
        onClick={() => onSelectFrame('rectangle')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Rectangle
      </button>
      
    </div>
  );
};

export default Sidebar;
