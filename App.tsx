
import React from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import CentralView from './components/CentralView';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#010c1e] text-white overflow-hidden">
      {/* Top Header */}
      <Header />

      {/* Main Dashboard Content */}
      <main className="flex flex-1 w-full overflow-hidden">
        {/* Left Side Panels */}
        <LeftSidebar />

        {/* Center 3D Visualization */}
        <CentralView />

        {/* Right Side Panels */}
        <RightSidebar />
      </main>

      {/* Lighter, Subtle Gradient Overlay for Depth without crushing shadows */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(1,12,30,0.3)_100%)]"></div>
    </div>
  );
};

export default App;
