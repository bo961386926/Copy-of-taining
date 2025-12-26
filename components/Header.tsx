
import React, { useState, useEffect } from 'react';
import { Cloud, Terminal } from 'lucide-react';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${y}年${m}月${d}日 ${day} ${h}:${min}:${s}`;
  };

  return (
    <header className="h-12 w-full flex items-center justify-between px-6 bg-[#020d24]/80 border-b border-cyan-400/30 backdrop-blur-xl z-50">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-orbitron font-black text-cyan-400 tracking-tighter text-glow-cyan italic animate-[glow-pulse_2s_infinite]">DELION</div>
        <div className="h-6 w-[1px] bg-white/20 mx-1"></div>
        <div>
          <h1 className="text-base font-black text-white tracking-[0.15em] drop-shadow-lg flex items-center">
            <Terminal size={16} className="mr-2 text-cyan-400" />
            泰宁集团
          </h1>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="bg-gradient-to-b from-blue-700/20 to-blue-900/40 px-12 py-1 border-x border-b border-cyan-400/40 rounded-b-2xl shadow-[0_5px_20px_rgba(0,229,255,0.2)] group cursor-default">
           <span className="text-lg font-black tracking-[0.4em] text-white text-glow-white uppercase italic transition-all group-hover:tracking-[0.45em]">
             建筑排水智慧管理与运维平台
           </span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right">
          <div className="font-orbitron text-white text-[11px] font-bold tracking-[0.05em] opacity-90">
            {formatDate(currentTime)}
          </div>
        </div>
        <div className="flex items-center bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 rounded-full group hover:bg-cyan-400/20 transition-all">
           <Cloud size={14} className="text-cyan-400 mr-2 animate-bounce" />
           <span className="font-orbitron text-xs font-black text-white">9°C</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
