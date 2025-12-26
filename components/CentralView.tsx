
import React, { useState } from 'react';
import DetailModal from './DetailModal';
import { LogIn } from 'lucide-react';

interface CentralViewProps {
  onEnterSystem?: () => void;
}

const CentralView: React.FC<CentralViewProps> = ({ onEnterSystem }) => {
  const [activeHoverMarker, setActiveHoverMarker] = useState<number | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const markers = [
    { top: '62%', left: '46%', label: '1# 运用库', val: '0.2m/s', status: 'online' },
    { top: '53%', left: '52%', label: '中央枢纽', val: '运行良好', status: 'optimal' },
    { top: '47%', left: '58%', label: '2# 运用库', val: '0.1m/s', status: 'online' },
    { top: '42%', left: '62%', label: '咽喉区', val: '0.0m/s', status: 'idle' },
    { top: '78%', left: '53%', label: '雨水泵房', val: '12m³/h', status: 'warning' },
    { top: '69%', left: '49%', label: '调蓄池', val: '75%', status: 'online' },
  ];

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-[#000a18] grid-bg">
      {/* Background Decorative Radar Waves */}
      <div className="absolute inset-0 radar-wave" style={{ left: '50%', top: '50%' }}></div>
      
      {/* Decorative Curved Path Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <path 
          d="M 350,750 Q 550,550 750,250" 
          stroke="#00e5ff" 
          strokeWidth="1.5" 
          fill="none" 
          strokeDasharray="4 6"
          className="animate-[dash_25s_linear_infinite]"
        />
        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -200; }
          }
        `}</style>
      </svg>

      {/* Decorative Floating Squares */}
      <div className="absolute top-[15%] left-[34%] w-4 h-4 border border-cyan-400/40 shadow-[0_0_5px_#00e5ff] bg-cyan-400/5 rotate-[25deg] animate-pulse"></div>
      <div className="absolute top-[28%] right-[35%] w-3 h-3 border border-cyan-400/40 shadow-[0_0_5px_#00e5ff] bg-cyan-400/5 -rotate-[15deg] animate-pulse"></div>

      {/* Central Title HUD - Refined to focus on Project Info */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl text-center pointer-events-none">
        <div className="inline-block relative px-6 py-2">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/60"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400/60"></div>
          
          <div className="bg-[#020d24]/75 backdrop-blur-lg px-10 py-5 border border-cyan-400/30 rounded-sm shadow-[0_0_30px_rgba(0,229,255,0.1)]">
            <div className="flex flex-col items-center">
              {/* Main Info: Project Context */}
              <div className="flex flex-col items-center">
                <p className="text-[12px] md:text-[14px] text-white font-black tracking-[0.15em] mb-1.5 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                  北京轨道交通13号线扩能提升工程小辛庄停车场
                </p>
                <p className="text-[9px] md:text-[10px] text-cyan-400/60 font-bold tracking-[0.35em] uppercase italic">
                  虹吸式屋面雨水监测运维系统
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Markers */}
      {markers.map((marker, i) => (
        <div key={i} className="absolute z-30" style={{ top: marker.top, left: marker.left }}>
          <div 
            className="relative flex flex-col items-center group cursor-pointer" 
            onMouseEnter={() => setActiveHoverMarker(i)} 
            onMouseLeave={() => setActiveHoverMarker(null)}
            onClick={() => setSelectedMarker(i)}
          >
            <div className={`w-2 h-2 rounded-full border border-white/50 transition-all duration-300
              ${marker.status === 'warning' ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' : 'bg-cyan-400 shadow-[0_0_8px_#00e5ff]'}
              ${activeHoverMarker === i ? 'scale-125' : 'scale-100'}`}>
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
            </div>
            <div className={`mt-1.5 px-2 py-0.5 bg-[#0a1a3a]/90 backdrop-blur-sm border border-white/10 rounded-full shadow-lg transition-all 
              ${activeHoverMarker === i ? 'border-cyan-400 bg-cyan-900/60' : ''}`}>
               <span className="text-[8px] font-bold text-white tracking-widest whitespace-nowrap">{marker.label}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom Status Bar - Updated Legend to Level Monitoring and Rain Gauge */}
      <div className="absolute bottom-2 left-6 z-20 flex space-x-8 px-8 py-2 bg-[#020d24]/80 backdrop-blur-sm border border-cyan-400/20 rounded-sm">
        {[
          { label: '液位监测', val: 'LEVEL_MON', color: 'text-cyan-400' },
          { label: '雨量筒', val: 'RAIN_GAUGE', color: 'text-blue-400' }
        ].map((item, i) => (
          <div key={i} className="flex items-center space-x-2.5 group cursor-default">
            <div className={`w-1.5 h-1.5 rounded-full bg-current ${item.color} shadow-[0_0_4px_currentColor] animate-pulse`}></div>
            <div className="flex flex-col">
              <span className="text-[8px] text-white/90 font-black tracking-wider uppercase">{item.label}</span>
              <span className={`text-[7px] font-black font-orbitron tracking-widest mt-0.5 ${item.color}`}>{item.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Enter System Button - Positioned bottom right, to the left of Project Overview sidebar */}
      <div className="absolute bottom-2 right-6 z-40">
        <button 
          onClick={onEnterSystem}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500 hover:to-cyan-500 border border-cyan-400/50 hover:border-cyan-300 text-white px-5 py-2 rounded-sm transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] group relative overflow-hidden backdrop-blur-md"
        >
          <div className="absolute inset-0 bg-cyan-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
          <LogIn size={16} className="text-cyan-200 group-hover:text-white transition-colors relative z-10" />
          <span className="text-xs font-bold tracking-widest relative z-10">进入监测系统</span>
        </button>
      </div>

      {/* Detail Modal */}
      <DetailModal 
        isOpen={selectedMarker !== null} 
        onClose={() => setSelectedMarker(null)}
        markerData={selectedMarker !== null ? markers[selectedMarker] : null}
      />
    </div>
  );
};

export default CentralView;
