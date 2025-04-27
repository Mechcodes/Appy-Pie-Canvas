import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import Test from './components/Test';

const App = () => {
  const [selectedFrame, setSelectedFrame] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar onSelectFrame={setSelectedFrame} />
      <div className="flex flex-col flex-1 p-4 space-y-4">
        <Controls />
        <Canvas selectedFrame={selectedFrame} />
        {/* <Test selectedFrame={selectedFrame} /> */}
      </div>
    </div>
  );
};

export default App;
