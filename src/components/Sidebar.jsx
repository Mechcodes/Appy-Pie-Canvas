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
      <button
        onClick={() => onSelectFrame('circle')}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Circle
      </button>
      <button
        onClick={() => onSelectFrame('star')}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Star
      </button>
    </div>
  );
};

export default Sidebar;
