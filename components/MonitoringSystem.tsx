
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Cloud, Moon, Sun, CloudRain, Wind, ChevronLeft, ChevronRight, ShieldCheck, Droplets, Zap, CloudLightning, Camera, Maximize2, Maximize, Minimize, Play, Pause, X, Video, Volume2, VolumeX, Move, Mic, MicOff, ZoomIn } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Legend } from 'recharts';

interface MonitoringSystemProps {
  onBack: () => void;
}

// Updated to display Point Numbers (IDs) instead of Location Names
const locationList = [
  "TN-P001",
  "TN-P002",
  "TN-P003",
  "TN-P004",
  "TN-P005",
  "TN-P006",
  "TN-P007",
  "TN-P008",
  "TN-P009",
  "TN-P010",
  "TN-P011"
];

// Comprehensive 24h Trend Data for Level, Pressure, Flow
const trendData = [
  { time: '12:00', level: 0.5, pressure: 50, flow: 120 },
  { time: '15:00', level: 0.8, pressure: 80, flow: 180 },
  { time: '18:00', level: 1.2, pressure: 150, flow: 350 },
  { time: '21:00', level: 3.5, pressure: 380, flow: 950 },
  { time: '00:00', level: 4.2, pressure: 460, flow: 1340 },
  { time: '03:00', level: 3.8, pressure: 410, flow: 1120 },
  { time: '06:00', level: 2.5, pressure: 250, flow: 680 },
  { time: '09:00', level: 1.5, pressure: 120, flow: 320 },
];

// Mock Photos Data for the Carousel
const monitoringPhotos = [
  { 
    id: 1, 
    location: 'TN-P001 天沟北段', 
    time: '22:35:10', 
    date: '2025-12-26',
    gradient: 'from-[#0f172a] via-[#1e293b] to-[#0f172a]', // Dark slate
    iconColor: 'text-cyan-400'
  },
  { 
    id: 2, 
    location: 'TN-P004 溢流口监测', 
    time: '22:36:22', 
    date: '2025-12-26',
    gradient: 'from-[#022c22] via-[#14532d] to-[#022c22]', // Dark green/moss
    iconColor: 'text-emerald-400'
  },
  { 
    id: 3, 
    location: 'TN-P007 汇流总管', 
    time: '22:34:05', 
    date: '2025-12-26',
    gradient: 'from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]', // Indigo
    iconColor: 'text-indigo-400'
  },
  { 
    id: 4, 
    location: '中央调蓄池入口', 
    time: '22:38:15', 
    date: '2025-12-26',
    gradient: 'from-[#4a044e] via-[#701a75] to-[#4a044e]', // Dark fuchsia
    iconColor: 'text-fuchsia-400'
  },
];

const MonitoringSystem: React.FC<MonitoringSystemProps> = ({ onBack }) => {
  const [activeLocation, setActiveLocation] = useState(0);
  const [isRaining, setIsRaining] = useState(true); // Control rain state - set to TRUE by default
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [enlargedPhoto, setEnlargedPhoto] = useState<typeof monitoringPhotos[0] | null>(null);
  
  // Video State
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoFullscreen, setVideoFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (enlargedPhoto || videoFullscreen) return; // Pause when lightbox/fullscreen is open
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % monitoringPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [enlargedPhoto, videoFullscreen]);

  // Handle Photo Navigation
  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!enlargedPhoto) return;
    const currentIndex = monitoringPhotos.findIndex(p => p.id === enlargedPhoto.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % monitoringPhotos.length;
    } else {
      newIndex = (currentIndex - 1 + monitoringPhotos.length) % monitoringPhotos.length;
    }
    setEnlargedPhoto(monitoringPhotos[newIndex]);
  };

  // Keyboard Support for Lightbox and Fullscreen Video
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (enlargedPhoto) {
        if (e.key === 'ArrowLeft') navigatePhoto('prev');
        if (e.key === 'ArrowRight') navigatePhoto('next');
        if (e.key === 'Escape') setEnlargedPhoto(null);
      }
      if (videoFullscreen) {
        if (e.key === 'Escape') setVideoFullscreen(false);
        if (e.key === ' ') setIsVideoPlaying(prev => !prev); // Space to toggle play
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedPhoto, videoFullscreen]);

  // Memoize randomized data based on activeLocation AND isRaining state
  const activeData = useMemo(() => {
    // If it's not raining, system is idle (mostly zeros)
    if (!isRaining) {
      return {
        gutterLevel: "0.00",
        negPressure: 0,
        flow: 0,
        residual: 0,
        health: 100, // Perfect health when idle
        maxLevel: 0,
        maxFlow: 0
      };
    }

    // Existing simulation logic when raining
    const seed = activeLocation + 1;
    return {
      gutterLevel: (2.3 + (Math.sin(seed) * 0.5)).toFixed(2),
      negPressure: Math.floor(450 + Math.cos(seed) * 50),
      flow: Math.floor(1250 + Math.sin(seed * 2) * 100),
      residual: Math.floor(100 + Math.cos(seed * 2) * 20),
      health: Math.min(100, Math.floor(98 - (seed % 5))),
      maxLevel: Math.floor(45 + (seed % 10)),
      maxFlow: Math.floor(128 + (Math.sin(seed) * 10))
    };
  }, [activeLocation, isRaining]);

  // Generate Raindrops CSS
  const rainDrops = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      left: Math.random() * 100 + '%',
      delay: Math.random() * 2 + 's',
      duration: 0.5 + Math.random() * 0.5 + 's'
    }));
  }, []);

  const currentPhoto = monitoringPhotos[currentPhotoIndex];

  // Helper to Render Video Player (Used in Sidebar and Fullscreen)
  const renderVideoPlayer = (isFull: boolean = false) => (
      <div 
        className={`relative w-full h-full bg-black overflow-hidden group select-none ${isFull ? '' : 'rounded-sm border border-white/10'}`}
        onClick={() => !isFull && setIsVideoPlaying(!isVideoPlaying)} // Only toggle play on click if NOT fullscreen (fullscreen has specific button)
      >
        {/* Mock Video Content Background */}
        <div className="absolute inset-0 bg-[#050505]">
           {/* Grid Pattern */}
           <div className="absolute inset-0 opacity-20" 
                style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
           </div>
           
           {/* Static Element (Crosshair) */}
           <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-8 h-8 border border-white/30 flex items-center justify-center">
                 <div className="w-3 h-[1px] bg-white/50"></div>
                 <div className="h-3 w-[1px] bg-white/50 absolute"></div>
              </div>
           </div>
        </div>

        {/* Scanline Animation (Active when playing) */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none transition-opacity duration-300 ${isVideoPlaying ? 'opacity-100 animate-[scan-move_2s_infinite]' : 'opacity-0'}`} style={{ animationDuration: '3s' }}></div>

        {/* Big Play Button (When Paused - only show if NOT fullscreen or if user prefers overlay) */}
        {!isVideoPlaying && !isFull && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-[1px]">
             <div className="p-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] transform scale-100 transition-transform hover:scale-110">
                <Play size={24} className="text-white fill-white ml-1" />
             </div>
          </div>
        )}

        {/* Header Info (Always show for Sidebar, Optional for Fullscreen) */}
        {!isFull && (
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none z-20">
             <div className="flex items-center space-x-2">
                <Video size={14} className="text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-wider shadow-black text-shadow">1# 运用库-东北角</span>
             </div>
             <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-[2px] border transition-colors ${isVideoPlaying ? 'bg-black/60 border-white/20' : 'bg-red-900/80 border-red-500/50'}`}>
                <div className={`w-2 h-2 rounded-full transition-all ${isVideoPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]' : 'bg-red-500'}`}></div>
                <span className="text-[10px] font-black text-white tracking-widest">{isVideoPlaying ? 'LIVE' : 'PAUSED'}</span>
             </div>
          </div>
        )}

        {/* Fullscreen Specific UI Overlays */}
        {isFull && (
           <div className="absolute top-4 left-6 z-20 pointer-events-none">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-[2px] border ${isVideoPlaying ? 'bg-black/60 border-white/20' : 'bg-red-900/80 border-red-500/50'}`}>
                  <div className={`w-2 h-2 rounded-full transition-all ${isVideoPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-black text-white tracking-widest">{isVideoPlaying ? 'LIVE' : 'PAUSED'}</span>
              </div>
           </div>
        )}

        {/* Control Bar */}
        {isFull ? (
          /* Fullscreen Enhanced Control Bar */
          <div 
             className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end pb-6 justify-between px-8 z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
             onClick={(e) => e.stopPropagation()}
          >
              <div className="flex items-center space-x-6">
                  {/* Play/Pause - Blue Circle Style */}
                  <button 
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)} 
                    className="group focus:outline-none"
                  >
                      <div className="w-12 h-12 rounded-full bg-[#0091ff] flex items-center justify-center hover:bg-[#33aaff] transition-colors shadow-[0_0_15px_rgba(0,145,255,0.4)] border-2 border-transparent group-hover:border-white/20">
                          {isVideoPlaying ? 
                             <Pause size={24} className="text-white fill-white" /> : 
                             <Play size={24} className="text-white fill-white ml-1" />
                          }
                      </div>
                  </button>

                  {/* Snapshot */}
                  <button className="text-white hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-full" title="截图">
                      <Camera size={26} strokeWidth={1.5} />
                  </button>

                  {/* Volume */}
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={`transition-colors p-2 hover:bg-white/10 rounded-full ${isMuted ? 'text-red-400' : 'text-white hover:text-cyan-400'}`}
                    title={isMuted ? "取消静音" : "静音"}
                  >
                      {isMuted ? <VolumeX size={26} strokeWidth={1.5} /> : <Volume2 size={26} strokeWidth={1.5} />}
                  </button>

                  {/* PTZ / Move */}
                  <button className="text-white hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-full" title="云台控制">
                      <Move size={26} strokeWidth={1.5} />
                  </button>

                  {/* Video Record */}
                  <button className="text-white hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-full" title="录像">
                      <Video size={26} strokeWidth={1.5} />
                  </button>

                  {/* Mic */}
                  <button 
                    onClick={() => setIsMicOn(!isMicOn)} 
                    className={`transition-colors p-2 hover:bg-white/10 rounded-full ${isMicOn ? 'text-green-400 animate-pulse' : 'text-white hover:text-cyan-400'}`}
                    title="对讲"
                  >
                       {isMicOn ? <Mic size={26} strokeWidth={1.5} /> : <MicOff size={26} strokeWidth={1.5} />}
                  </button>

                  {/* Zoom */}
                  <button className="text-white hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-full" title="放大">
                      <ZoomIn size={26} strokeWidth={1.5} />
                  </button>
              </div>

              <div className="flex items-center space-x-6 pb-1">
                   {/* Camera Name Text */}
                   <span className="text-xl font-bold text-white/90 tracking-widest drop-shadow-md">1# 运用库-东北角</span>

                   {/* HD Badge */}
                   <div className="border-[1.5px] border-white/80 rounded px-1.5 py-0.5">
                       <span className="text-sm font-black text-white/90">HD</span>
                   </div>

                   {/* Exit Fullscreen */}
                   <button 
                     onClick={() => setVideoFullscreen(false)} 
                     className="text-white hover:text-cyan-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                     title="退出全屏"
                   >
                       <Minimize size={26} strokeWidth={1.5} />
                   </button>
              </div>
          </div>
        ) : (
          /* Simple Control Bar for Sidebar */
          <div 
             className={`absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between px-3 transition-opacity duration-300 z-30 ${!isVideoPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
             onClick={(e) => e.stopPropagation()}
          >
             <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="text-white/80 hover:text-cyan-400 transition-colors focus:outline-none"
                >
                   {isVideoPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
                <span className="text-[10px] font-mono text-white/70 tracking-wider">2025-12-26 20:49:15</span>
             </div>

             <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setVideoFullscreen(!videoFullscreen)}
                  className="text-white/80 hover:text-cyan-400 transition-colors focus:outline-none"
                  title="全屏"
                >
                   <Maximize size={16} />
                </button>
             </div>
          </div>
        )}
      </div>
  );

  return (
    <div className="flex w-full h-full p-2 space-x-2 bg-[#010c1e] z-40 relative animate-in fade-in duration-300">
      
      {/* CSS for Rain Animation */}
      <style>{`
        @keyframes rainFall {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(80vh); opacity: 0; }
        }
        .rain-drop {
          position: absolute;
          top: 0;
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, rgba(0, 229, 255, 0.8));
          animation: rainFall linear infinite;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>

      {/* LEFT SIDEBAR - Location List */}
      <div className="w-[240px] flex flex-col bg-blue-900/10 border border-blue-400/20 rounded-sm transition-all duration-300 overflow-hidden">
        {/* Title */}
        <div className="h-10 flex items-center px-4 border-b border-blue-400/20 bg-gradient-to-r from-blue-600/20 to-transparent">
          <div className="w-1 h-3 bg-cyan-400 mr-2 shadow-[0_0_8px_#00e5ff]"></div>
          <span className="text-sm font-bold tracking-wider text-white">点位列表</span>
        </div>
        
        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="搜索点位编号" 
              className="w-full bg-[#0a1a3a] border border-blue-400/30 rounded-sm py-1.5 pl-3 pr-8 text-xs text-white focus:border-cyan-400 outline-none transition-colors"
            />
            <Search size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-2 space-y-2">
          {locationList.map((loc, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveLocation(idx)}
              className={`
                relative p-3 text-xs rounded-sm cursor-pointer flex items-center justify-between group
                transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${activeLocation === idx 
                  ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/40 border-l-2 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105 z-10' 
                  : 'text-white/60 border-l-2 border-transparent hover:border-cyan-400/50 hover:text-white hover:bg-white/5 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:z-20'
                }
              `}
            >
              {/* Background Glow Effect for Hover */}
              <div className="absolute inset-0 rounded-sm bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <span className={`truncate pr-2 font-mono tracking-wide relative z-10 transition-all ${activeLocation === idx ? 'font-bold text-cyan-300 text-shadow-glow' : 'group-hover:text-cyan-100'}`}>
                {loc}
              </span>
              
              {activeLocation === idx ? (
                <div className="relative z-10 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-ping"></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-cyan-400/50 group-hover:shadow-[0_0_5px_#00e5ff] transition-all relative z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CENTER VIEW - System Visualization */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-b from-[#020d24] to-[#051630] border border-blue-400/20 rounded-sm overflow-hidden">
        
        {/* TOP STATS BAR (HUD Style) */}
        <div className="absolute top-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
            <div className="flex items-center space-x-4 pointer-events-auto">
              
              {/* Rain Simulation Toggle Button */}
              <button 
                onClick={() => setIsRaining(!isRaining)}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-full border transition-all duration-300 group
                  ${isRaining 
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.4)]' 
                    : 'bg-[#020d24]/80 border-white/10 hover:border-cyan-400/50'}
                `}
              >
                {isRaining ? (
                  <CloudLightning size={18} className="text-cyan-400 animate-pulse" />
                ) : (
                  <CloudRain size={18} className="text-white/50 group-hover:text-cyan-400" />
                )}
                <span className={`text-xs font-bold ${isRaining ? 'text-cyan-300' : 'text-white/50 group-hover:text-white'}`}>
                  {isRaining ? '降雨模拟中...' : '启动降雨模拟'}
                </span>
              </button>

              {/* Data Stats */}
              <div className="
                flex items-center space-x-10
                bg-[#020d24]/80 backdrop-blur-md
                border border-cyan-400/30
                px-10 py-3 rounded-full
                shadow-[0_0_30px_rgba(0,229,255,0.15)]
                animate-in slide-in-from-top-4 fade-in duration-700
              ">
                  {/* Decorative glow behind */}
                  <div className="absolute inset-0 rounded-full bg-cyan-400/5 blur-xl"></div>

                  {[
                    { val: activeData.health, unit: '分', label: '健康指数', icon: ShieldCheck, valColor: 'text-cyan-400' },
                    { val: activeData.maxLevel, unit: 'mm', label: '最大天沟液位', icon: Droplets, valColor: 'text-white' },
                    { val: activeData.maxFlow, unit: 'L/s', label: '最大排水流量', icon: Zap, valColor: 'text-green-400' }
                  ].map((stat, i) => (
                    <div key={i} className={`flex items-center space-x-4 group relative transition-opacity duration-500 ${isRaining ? 'opacity-100' : 'opacity-50'}`}>
                        {/* Icon Box */}
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          bg-gradient-to-br from-white/10 to-transparent border border-white/10
                          group-hover:border-cyan-400/50 group-hover:scale-110 transition-all duration-300
                          shadow-[0_0_10px_rgba(0,0,0,0.5)]
                        `}>
                            <stat.icon size={18} className="text-cyan-300" />
                        </div>

                        {/* Text Info */}
                        <div className="flex flex-col">
                          <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold mb-0.5">{stat.label}</span>
                          <div className="flex items-baseline space-x-1">
                              <span className={`text-2xl font-orbitron font-black leading-none ${stat.valColor} drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]`}>
                                  {stat.val}
                              </span>
                              <span className="text-[10px] text-white/40 font-mono">{stat.unit}</span>
                          </div>
                        </div>

                        {/* Divider (except last) */}
                        {i < 2 && (
                            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                        )}
                    </div>
                  ))}
              </div>
            </div>
        </div>

        {/* Rain Visual Layer - Only visible when raining */}
        {isRaining && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
             {rainDrops.map((style, i) => (
                <div 
                  key={i} 
                  className="rain-drop"
                  style={{
                    left: style.left,
                    animationDuration: style.duration,
                    animationDelay: style.delay
                  }}
                ></div>
             ))}
          </div>
        )}

        {/* WRAPPER FOR TRANSITION EFFECT */}
        <div 
          key={activeLocation} 
          className="flex-1 relative animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
        >
           {/* Grid Background */}
           <div className="absolute inset-0 grid-bg opacity-30"></div>
           
           {/* Style for flow animation */}
           <style>{`
             @keyframes dashFlow {
               to { stroke-dashoffset: -20; }
             }
             .flow-line {
               stroke-dasharray: 4 4;
               animation: dashFlow 0.5s linear infinite;
             }
             @keyframes bubbleRise {
               0% { transform: translateY(0) scale(0.5); opacity: 0; }
               50% { opacity: 0.8; }
               100% { transform: translateY(-20px) scale(1.2); opacity: 0; }
             }
             .bubble {
               animation: bubbleRise 2s ease-out infinite;
             }
           `}</style>

           {/* System Schematic SVG */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 800 500">
              <defs>
                {/* Pipe Wall Gradient */}
                <linearGradient id="pipeWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                </linearGradient>
                
                {/* Pipe Glow */}
                <filter id="pipeGlow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* --- 1. PIPE STRUCTURE (Static Background) --- */}
              <g stroke="url(#pipeWallGradient)" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {/* Vertical Drops from Hoppers */}
                  <path d="M150,165 L150,210" />
                  <path d="M300,195 L300,220" />
                  <path d="M450,175 L450,210" />
                  
                  {/* Main Horizontal Pipe + Downspout */}
                  <path d="M150,210 L300,220 L450,210 L480,210 Q500,210 500,230 L500,350" />
              </g>

              {/* --- 2. DYNAMIC FLOW (Animated Center Lines) --- */}
              {/* Visibility controlled by isRaining state */}
              <g 
                className="flow-container" 
                stroke="#22d3ee" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#pipeGlow)"
                style={{ opacity: isRaining ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
              >
                  {/* Drop 1 Flow */}
                  <path d="M150,170 L150,210" className="flow-line" opacity="0.8" />
                  {/* Drop 2 Flow */}
                  <path d="M300,200 L300,220" className="flow-line" opacity="0.8" />
                  {/* Drop 3 Flow */}
                  <path d="M450,180 L450,210" className="flow-line" opacity="0.8" />
                  
                  {/* Main Collection Flow */}
                  <path d="M150,210 L300,220 L450,210 L480,210 Q500,210 500,230 L500,345" className="flow-line" opacity="1" />
              </g>

              {/* --- 3. COMPONENTS --- */}

              {/* Roof Outlets (Rainwater Hoppers) */}
              <g transform="translate(150, 150)">
                 <path d="M0,0 L10,20 L-10,20 Z" fill="#00e5ff" className="opacity-90 transition-all" />
                 <ellipse cx="0" cy="0" rx="15" ry="5" fill="#010c1e" stroke="#00e5ff" strokeWidth="1" />
                 {/* Swirl only spins when raining */}
                 <path d="M-5,0 Q0,5 5,0" fill="none" stroke="#fff" strokeWidth="1" opacity={isRaining ? 0.5 : 0} className={isRaining ? "animate-spin origin-center" : ""} />
              </g>

              <g transform="translate(300, 180)">
                 <path d="M0,0 L10,20 L-10,20 Z" fill="#00e5ff" className="opacity-90" />
                 <ellipse cx="0" cy="0" rx="15" ry="5" fill="#010c1e" stroke="#00e5ff" strokeWidth="1" />
              </g>

              <g transform="translate(450, 160)">
                 <path d="M0,0 L10,20 L-10,20 Z" fill="#00e5ff" className="opacity-90" />
                 <ellipse cx="0" cy="0" rx="15" ry="5" fill="#010c1e" stroke="#00e5ff" strokeWidth="1" />
              </g>

              {/* Tank */}
              <g transform="translate(520, 320)">
                {/* Tank Body */}
                <path d="M0,0 L100,20 L100,100 L0,80 Z" fill="#1e3a8a" opacity="0.4" stroke="#3b82f6" strokeWidth="1" />
                <path d="M0,0 L-40,20 L-40,100 L0,80" fill="#172554" opacity="0.5" stroke="#3b82f6" strokeWidth="1" />
                <path d="M-40,20 L60,40 L100,20" fill="none" stroke="#3b82f6" strokeWidth="1" />
                
                {/* Water Level Surface - Only oscillates/shows when raining or has baseline water */}
                <path d="M-40,80 L60,100 L100,80 L0,60 Z" fill="#0ea5e9" opacity="0.6" className={isRaining ? "animate-pulse" : ""}>
                   <animate attributeName="opacity" values="0.6;0.8;0.6" dur="3s" repeatCount="indefinite" begin={isRaining ? "0s" : "indefinite"} />
                </path>
                
                {/* Splash/Turbulence Area - Only visible when raining */}
                <g transform="translate(-20, 30)" style={{ opacity: isRaining ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                   <circle cx="0" cy="0" r="2" fill="white" className="bubble" style={{animationDelay: '0s'}} />
                   <circle cx="5" cy="2" r="1.5" fill="cyan" className="bubble" style={{animationDelay: '0.5s'}} />
                   <circle cx="-5" cy="5" r="2.5" fill="white" className="bubble" style={{animationDelay: '1.2s'}} />
                   <ellipse cx="0" cy="0" rx="10" ry="3" fill="#bef264" opacity="0.3" className="animate-ping" />
                </g>
              </g>
           </svg>

           {/* Data Tags Overlays */}
           
           {/* Gutter Level */}
           <div className={`absolute top-[20%] right-[10%] bg-[#020d24]/80 border border-blue-500/30 p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-500 ${isRaining ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2 grayscale'}`}>
              <div className="text-[10px] text-white/70 mb-0.5">天沟液位</div>
              <div className="text-lg font-orbitron font-bold text-cyan-400">{activeData.gutterLevel} <span className="text-[10px]">cm</span></div>
           </div>

           {/* Pipe Negative Pressure */}
           <div className={`absolute top-[40%] left-[10%] bg-[#020d24]/80 border border-blue-500/30 p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-500 delay-100 ${isRaining ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2 grayscale'}`}>
              <div className="text-[10px] text-white/70 mb-0.5">管道负压</div>
              <div className="text-lg font-orbitron font-bold text-white">{activeData.negPressure} <span className="text-[10px] text-yellow-500 bg-yellow-900/30 px-1 rounded">mbar</span></div>
           </div>

           {/* Outlet Flow */}
           <div className={`absolute top-[55%] left-[15%] bg-[#020d24]/80 border border-blue-500/30 p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-500 delay-200 ${isRaining ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2 grayscale'}`}>
              <div className="text-[10px] text-white/70 mb-0.5">出水瞬时流量</div>
              <div className="text-lg font-orbitron font-bold text-white">{activeData.flow} <span className="text-[10px] text-blue-400 bg-blue-900/30 px-1 rounded">m³/h</span></div>
           </div>

           {/* Residual Pressure */}
           <div className={`absolute top-[70%] left-[12%] bg-[#020d24]/80 border border-blue-500/30 p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-500 delay-300 ${isRaining ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2 grayscale'}`}>
              <div className="text-[10px] text-white/70 mb-0.5">出口余压</div>
              <div className="text-lg font-orbitron font-bold text-white">{activeData.residual} <span className="text-[10px] text-yellow-500 bg-yellow-900/30 px-1 rounded">mbar</span></div>
           </div>
           
           {/* Floating Icons for Decoration */}
           <div className="absolute top-[28%] right-[22%] opacity-80"><CloudRain size={24} className="text-white/20" /></div>
           <div className="absolute top-[45%] left-[30%] opacity-50"><Wind size={20} className="text-cyan-400/20" /></div>

        </div>

        {/* Back Button Overlay */}
        <button 
          onClick={onBack}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#020d24] border-t border-x border-cyan-500/50 rounded-t-lg px-6 py-1 text-xs text-cyan-400 hover:text-white hover:bg-cyan-900/50 transition-colors z-50 flex items-center space-x-2"
        >
          <ChevronLeft size={12} />
          <span>返回系统平台</span>
        </button>

      </div>

      {/* RIGHT SIDEBAR - Analysis */}
      <div className="w-[300px] flex flex-col space-y-2">
        {/* REPLACED WEATHER WITH EXPANDED MONITORING CHART */}
        <div className="bg-blue-900/10 border border-blue-400/20 rounded-sm p-2 flex flex-col h-[240px]">
           <div className="text-xs font-bold text-white italic border-l-2 border-cyan-400 pl-2 mb-2">监测数据趋势 (24h)</div>
           <div className="flex-1 relative">
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{top: 5, right: 0, bottom: 5, left: -25}}>
                   <defs>
                     <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.1} />
                   <XAxis dataKey="time" fontSize={8} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                   
                   {/* Left Axis: Flow & Pressure (mbar, m3/h - sharing scale roughly for viz, or just primary) */}
                   <YAxis yAxisId="left" fontSize={8} tick={{fill: '#fbbf24'}} axisLine={false} tickLine={false} label={{ value: 'mbar/m³h', angle: -90, position: 'insideLeft', fill: '#fbbf24', fontSize: 8, opacity: 0.5, dy: 30 }} />
                   
                   {/* Right Axis: Level (cm) */}
                   <YAxis yAxisId="right" orientation="right" fontSize={8} tick={{fill: '#22d3ee'}} axisLine={false} tickLine={false} label={{ value: 'cm', angle: 90, position: 'insideRight', fill: '#22d3ee', fontSize: 8, opacity: 0.5, dy: -10 }} />

                   <Tooltip 
                     contentStyle={{backgroundColor: '#020d24', borderColor: '#3b82f6', fontSize: '10px'}} 
                     itemStyle={{color: '#fff'}}
                     labelStyle={{color: '#fff', marginBottom: '5px', fontWeight: 'bold'}}
                     formatter={(value: any, name: any) => {
                        if (name === '运行负压') return [`${value} mbar`, name];
                        if (name === '排水流量') return [`${value} m³/h`, name];
                        if (name === '天沟液位') return [`${value} cm`, name];
                        return [value, name];
                     }}
                   />
                   <Legend iconSize={8} wrapperStyle={{fontSize: '10px', paddingTop: '5px'}} />
                   
                   <Area yAxisId="left" type="monotone" dataKey="pressure" name="运行负压" stroke="#fbbf24" fill="url(#colorPressure)" strokeWidth={1.5} />
                   <Line yAxisId="left" type="monotone" dataKey="flow" name="排水流量" stroke="#3b82f6" dot={false} strokeWidth={1.5} />
                   <Line yAxisId="right" type="monotone" dataKey="level" name="天沟液位" stroke="#22d3ee" dot={false} strokeWidth={1.5} strokeDasharray="3 3" />
                </ComposedChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Real-time Video (MOVED UP) - Styled to match request */}
        <div className="bg-blue-900/10 border border-blue-400/20 rounded-sm p-2 flex flex-col h-[220px]">
           <div className="text-xs font-bold text-white italic border-l-2 border-cyan-400 pl-2 mb-2">实时视频</div>
           <div className="flex-1">
              {renderVideoPlayer(false)}
           </div>
        </div>

        {/* Monitoring Photos (MOVED DOWN) */}
        <div className="bg-blue-900/10 border border-blue-400/20 rounded-sm p-2 flex flex-col flex-1 min-h-[150px]">
           <div className="flex items-center justify-between mb-2">
             <div className="text-xs font-bold text-white italic border-l-2 border-cyan-400 pl-2">监测照片</div>
             <div className="flex space-x-0.5">
               {monitoringPhotos.map((_, idx) => (
                 <div 
                   key={idx} 
                   className={`w-1 h-1 rounded-full transition-colors ${idx === currentPhotoIndex ? 'bg-cyan-400' : 'bg-white/20'}`}
                 />
               ))}
             </div>
           </div>
           
           <div 
             className="flex-1 relative rounded-sm overflow-hidden group cursor-pointer border border-white/5 hover:border-cyan-400/50 transition-colors"
             onClick={() => setEnlargedPhoto(currentPhoto)}
           >
              {/* Image Simulation */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentPhoto.gradient} transition-all duration-700`}></div>
              
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]"></div>
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
                {Array.from({length: 24}).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-white/20"></div>
                ))}
              </div>

              {/* Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-700">
                <Camera size={48} className={`text-white drop-shadow-lg ${currentPhoto.iconColor.replace('text-', 'stroke-')}`} />
              </div>

              {/* Text Info */}
              <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-2 border-t border-white/10">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white truncate">{currentPhoto.location}</span>
                    <span className="text-[9px] font-mono text-cyan-400">{currentPhoto.time}</span>
                 </div>
              </div>

              {/* Hover Effect: Maximize Icon */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <Maximize2 size={24} className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
              </div>
           </div>
        </div>
      </div>

      {/* Lightbox Modal (Photos) */}
      {enlargedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-[90%] h-[90%] max-w-5xl bg-[#020d24] border border-cyan-400/30 rounded-sm shadow-[0_0_50px_rgba(0,229,255,0.2)] flex flex-col">
            
            {/* Header */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-white/10 bg-gradient-to-r from-cyan-900/20 to-transparent">
               <div className="flex items-center space-x-3">
                 <Camera size={18} className="text-cyan-400" />
                 <span className="text-lg font-bold text-white tracking-wider">{enlargedPhoto.location}</span>
                 <span className="text-xs font-mono text-white/50 border-l border-white/20 pl-3">{enlargedPhoto.date} {enlargedPhoto.time}</span>
               </div>
               <button 
                 onClick={() => setEnlargedPhoto(null)}
                 className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
               >
                 <X size={24} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden bg-black/50 group/lightbox">
               {/* Large Mock Image */}
               <div className={`absolute inset-0 bg-gradient-to-br ${enlargedPhoto.gradient} opacity-80 transition-all duration-500`}></div>
               
               {/* Technical Grid Overlay */}
               <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 pointer-events-none opacity-20">
                 {Array.from({length: 96}).map((_, i) => (
                   <div key={i} className="border-[0.5px] border-white/10"></div>
                 ))}
               </div>

               {/* Navigation Controls */}
               <button 
                 onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
                 className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-400 text-white/70 hover:text-cyan-400 transition-all opacity-0 group-hover/lightbox:opacity-100 -translate-x-4 group-hover/lightbox:translate-x-0 duration-300 z-50"
               >
                 <ChevronLeft size={32} />
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
                 className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-400 text-white/70 hover:text-cyan-400 transition-all opacity-0 group-hover/lightbox:opacity-100 translate-x-4 group-hover/lightbox:translate-x-0 duration-300 z-50"
               >
                 <ChevronRight size={32} />
               </button>

               {/* Central Visual */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full border-4 ${enlargedPhoto.iconColor.replace('text-', 'border-')} opacity-30 animate-ping`}></div>
                    <Camera size={64} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${enlargedPhoto.iconColor} opacity-80`} />
                  </div>
               </div>

               {/* Fake Analysis Data Overlay */}
               <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur border-t border-cyan-400/30 p-4 flex justify-between items-center rounded-sm">
                  <div className="flex space-x-8">
                     <div>
                       <div className="text-[10px] text-white/50 uppercase">图像清晰度</div>
                       <div className="text-sm font-bold text-white">1080P / 96%</div>
                     </div>
                     <div>
                       <div className="text-[10px] text-white/50 uppercase">AI识别结果</div>
                       <div className="text-sm font-bold text-emerald-400">正常 (Confidence: 0.98)</div>
                     </div>
                  </div>
                  <div className="text-[10px] text-white/30 font-mono tracking-widest">ID: {enlargedPhoto.id} // CAM_SEQ_{Math.floor(Math.random() * 10000)}</div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Video Modal */}
      {videoFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300">
          {renderVideoPlayer(true)}
        </div>
      )}

    </div>
  );
};

export default MonitoringSystem;
