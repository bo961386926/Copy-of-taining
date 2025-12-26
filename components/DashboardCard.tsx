
import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`relative flex flex-col bg-blue-900/10 border border-blue-400/20 rounded-sm backdrop-blur-md shadow-2xl card-breathing ${className}`}>
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 z-10"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 z-10"></div>
      
      {/* Header Area */}
      <div className="h-8 flex items-center px-3 bg-gradient-to-r from-blue-600/20 via-blue-800/5 to-transparent border-b border-white/5 relative overflow-hidden">
        <div className="w-1 h-3 bg-cyan-400 mr-2 shadow-[0_0_8px_#00e5ff]"></div>
        <h2 className="text-[11px] font-black text-white tracking-[0.2em] uppercase italic drop-shadow-sm">
          {title}
        </h2>
        <div className="ml-auto flex items-center space-x-1.5">
           <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_4px_#00e5ff]"></div>
           <div className="text-[9px] font-bold text-cyan-400 font-orbitron tracking-tighter">LIVE_SENS</div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400/20 animate-[scan-move_8s_infinite_linear]"></div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 p-2 overflow-hidden scan-light">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
