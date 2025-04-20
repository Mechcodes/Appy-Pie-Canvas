import React from 'react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-5 text-center">Canvas Stencil Editor</h1>
          <div className="mb-5">
            <Canvas />
          </div>
          <Controls />
        </div>
      </div>
    </div>
  );
}

export default App;
