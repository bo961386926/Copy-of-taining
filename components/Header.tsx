
import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Terminal, ChevronDown, Check, MapPin } from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  projects?: Project[];
  currentProject?: Project;
  onProjectChange?: (project: Project) => void;
}

const Header: React.FC<HeaderProps> = ({ projects = [], currentProject, onProjectChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    // Lightened background from #020d24/80 to #0f172a/90 (Slate-900)
    <header className="h-12 w-full flex items-center justify-between px-6 bg-[#0f172a]/90 border-b border-cyan-400/40 backdrop-blur-xl z-50 relative">
      {/* Left Side: Brand & Project Switcher */}
      <div className="flex items-center space-x-4 h-full relative z-50">
        {/* Brand Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-orbitron font-black text-cyan-400 tracking-tighter text-glow-cyan italic animate-[glow-pulse_2s_infinite]">DELION</div>
          <div className="h-6 w-[1px] bg-white/20 mx-3"></div>
          <h1 className="text-base font-black text-white tracking-[0.15em] drop-shadow-lg flex items-center whitespace-nowrap">
            <Terminal size={16} className="mr-2 text-cyan-400" />
            泰宁集团
          </h1>
        </div>

        {/* Project Switcher - Moved Here */}
        <div className="relative ml-4" ref={dropdownRef}>
           <button 
             onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
             className={`
               flex items-center space-x-2 px-3 py-1.5 rounded-sm border transition-all duration-300
               ${isProjectDropdownOpen 
                 ? 'bg-[#1e293b] border-cyan-400/70 text-white' 
                 : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-cyan-400/50 hover:text-cyan-100'}
             `}
           >
              <MapPin size={14} className="text-cyan-400 shrink-0" />
              <span className="text-xs font-bold max-w-[200px] truncate">
                {currentProject ? currentProject.name : '选择项目'}
              </span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${isProjectDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-white/50'}`} />
           </button>

           {/* Dropdown Menu */}
           {isProjectDropdownOpen && (
             <div className="absolute top-full left-0 mt-2 w-[320px] bg-[#0f172a]/95 border border-cyan-400/40 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 border-b border-white/10 bg-cyan-900/20 flex justify-between items-center">
                   <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">切换项目 / Switch Project</p>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {projects.map((proj) => (
                    <div 
                      key={proj.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onProjectChange?.(proj);
                        setIsProjectDropdownOpen(false);
                      }}
                      className={`
                        px-3 py-3 border-b border-white/5 cursor-pointer flex items-center justify-between group/item transition-all
                        ${currentProject?.id === proj.id ? 'bg-cyan-900/30' : 'hover:bg-white/5'}
                      `}
                    >
                       <div className="flex flex-col">
                         <span className={`text-xs font-bold transition-colors line-clamp-1 ${currentProject?.id === proj.id ? 'text-cyan-400' : 'text-white/80 group-hover/item:text-white'}`}>
                           {proj.name}
                         </span>
                         {currentProject?.id === proj.id && <span className="text-[9px] text-cyan-500/70 font-mono mt-0.5">CURRENTLY ACTIVE</span>}
                       </div>
                       {currentProject?.id === proj.id && <Check size={14} className="text-cyan-400 ml-2 shrink-0" />}
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Central Title - Static Display Only */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <div 
          className="bg-gradient-to-b from-[#1e3a8a]/30 to-[#172554]/50 px-12 py-1 border-x border-b border-cyan-400/50 rounded-b-2xl shadow-[0_5px_20px_rgba(0,229,255,0.2)] flex items-center space-x-2"
        >
           <span className="text-lg font-black tracking-[0.4em] text-white text-glow-white uppercase italic whitespace-nowrap">
             建筑排水智慧管理与运维平台
           </span>
        </div>
      </div>

      {/* Right Side: Time & Weather */}
      <div className="flex items-center space-x-6 z-50">
        <div className="text-right hidden md:block">
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
