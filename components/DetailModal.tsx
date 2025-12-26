
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Calendar, CheckSquare, Square, ChevronDown,
  Video, Camera, ChevronLeft, ChevronRight, Clock, Maximize, Activity
} from 'lucide-react';
import { 
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  markerData: {
    label: string;
    status: string;
  } | null;
}

// --- Mock Data: Chart ---
// Updated to reflect Gutter Level, Negative Pressure, and Drainage Flow over 24h
const chartData = [
  { time: '00:00', level: 0.5, pressure: 50, flow: 120 },
  { time: '03:00', level: 0.8, pressure: 80, flow: 180 },
  { time: '06:00', level: 1.2, pressure: 150, flow: 350 },
  { time: '09:00', level: 3.5, pressure: 380, flow: 950 },
  { time: '12:00', level: 4.2, pressure: 460, flow: 1340 },
  { time: '15:00', level: 3.8, pressure: 410, flow: 1120 },
  { time: '18:00', level: 2.5, pressure: 250, flow: 680 },
  { time: '21:00', level: 1.5, pressure: 120, flow: 320 },
];

const metricsConfig = [
  { key: 'level', label: '天沟液位', color: '#22d3ee', unit: 'cm', yAxisId: 'right' },
  { key: 'pressure', label: '运行负压', color: '#fbbf24', unit: 'mbar', yAxisId: 'left' },
  { key: 'flow', label: '排水流量', color: '#3b82f6', unit: 'm³/h', yAxisId: 'left' },
];

// --- Mock Data: Video ---
const mockVideos = [
  { id: 1, name: '1# 运用库-东北角', status: 'LIVE' },
  { id: 2, name: '1# 运用库-西南角', status: 'LIVE' },
  { id: 3, name: '屋面排水-东区', status: 'REC' },
  { id: 4, name: '屋面排水-西区', status: 'LIVE' },
];

// --- Mock Data: Snapshots ---
const generateSnapshots = () => {
  const result = [];
  const baseTime = new Date('2025-12-26T20:49:00').getTime();
  for (let i = 0; i < 32; i++) {
    const t = new Date(baseTime - i * 1000 * 60 * 30); // 30 min intervals
    result.push({
      id: i + 1,
      time: `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`,
      date: `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')}`,
      location: `监测点 ${(i % 4) + 1}`,
      status: i % 5 === 0 ? '异常' : '正常'
    });
  }
  return result;
};
const mockSnapshots = generateSnapshots();
const SNAPSHOTS_PER_PAGE = 8; // 4 cols * 2 rows

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, markerData }) => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['level', 'pressure', 'flow']);
  const [timeRange, setTimeRange] = useState('近24小时');
  const [snapshotPage, setSnapshotPage] = useState(1);

  // Time Selection State
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [customStartTime, setCustomStartTime] = useState('2025-01-01');
  const [customEndTime, setCustomEndTime] = useState('2025-12-31');
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen || !markerData) return null;

  const toggleMetric = (key: string) => {
    setSelectedMetrics(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleTimePreset = (preset: string) => {
    setTimeRange(preset);
    setIsTimeDropdownOpen(false);
  };

  const handleCustomRange = () => {
    setTimeRange(`${customStartTime} 至 ${customEndTime}`);
    setIsTimeDropdownOpen(false);
  };

  // --- Render Helpers ---

  const renderRealtimeChart = () => (
    <>
      <div className="flex-1 min-h-0 bg-[#0a1a3a]/30 border border-cyan-400/20 rounded-sm p-4 relative shadow-[inset_0_0_20px_rgba(0,229,255,0.05)]">
        {/* Grid Background Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#00e5ff 0.5px, transparent 0.5px), linear-gradient(90deg, #00e5ff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {metricsConfig.map(m => (
                <linearGradient key={m.key} id={`gradient-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={m.color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={m.color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.1} />
            
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }} 
              dy={10}
            />

            {/* Left Axis for Flow & Pressure */}
            <YAxis 
              yAxisId="left"
              orientation="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }} 
              label={{ value: '流量(m³/h) / 负压(mbar)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, opacity: 0.6 }}
            />

            {/* Right Axis for Level */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#22d3ee', fontSize: 10, fontFamily: 'Orbitron' }}
              label={{ value: '液位(cm)', angle: 90, position: 'insideRight', fill: '#22d3ee', fontSize: 10, opacity: 0.8 }}
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(2, 13, 36, 0.95)', 
                borderColor: '#00e5ff', 
                borderRadius: '2px',
                borderWidth: '1px',
                boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Orbitron' }}
              labelStyle={{ color: '#00e5ff', marginBottom: '8px', fontWeight: 'bold', fontFamily: 'Orbitron' }}
              cursor={{ stroke: '#fff', strokeDasharray: '4 4', strokeOpacity: 0.3 }}
              formatter={(value: number, name: string) => {
                const metric = metricsConfig.find(m => m.label === name);
                return [`${value} ${metric?.unit || ''}`, name];
              }}
            />
            
            <Legend 
               wrapperStyle={{ paddingTop: '10px' }} 
               iconType="rect" 
               iconSize={10}
               formatter={(value) => <span className="text-white/80 text-xs font-bold ml-1">{value}</span>}
            />

            {metricsConfig.map(m => (
              selectedMetrics.includes(m.key) && (
                <Area 
                  key={m.key}
                  yAxisId={m.yAxisId}
                  type="monotone" 
                  dataKey={m.key} 
                  name={m.label}
                  stroke={m.color} 
                  fillOpacity={1}
                  fill={`url(#gradient-${m.key})`} 
                  strokeWidth={2}
                  activeDot={{ r: 4, stroke: '#fff', strokeWidth: 1 }}
                  animationDuration={1500}
                />
              )
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-8">
        {metricsConfig.map(m => (
          <button 
            key={m.key}
            onClick={() => toggleMetric(m.key)}
            className="flex items-center space-x-2 group"
          >
            <div className={`transition-all duration-300 ${selectedMetrics.includes(m.key) ? 'scale-110' : 'opacity-50 grayscale'}`}>
              {selectedMetrics.includes(m.key) ? 
                <CheckSquare size={16} color={m.color} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" /> : 
                <Square size={16} className="text-white/30" />
              }
            </div>
            <span className={`text-xs font-bold transition-colors ${selectedMetrics.includes(m.key) ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );

  const renderVideoGrid = () => {
    const isSingle = mockVideos.length === 1;
    return (
      <div className="flex-1 min-h-0 bg-black/20 rounded-sm overflow-hidden p-2">
        <div className={`w-full h-full grid gap-2 ${isSingle ? 'grid-cols-1' : 'grid-cols-2 grid-rows-2'}`}>
          {mockVideos.map(video => (
            <div key={video.id} className="relative bg-black/60 border border-white/10 rounded-sm overflow-hidden group">
              {/* Fake Video Feed Content */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                 <div className="w-[120%] h-[5px] bg-cyan-400/20 blur-md animate-[scan-move_3s_infinite_linear]"></div>
                 <div className="grid grid-cols-12 grid-rows-12 w-full h-full opacity-10">
                    {Array.from({length: 144}).map((_, i) => (
                      <div key={i} className="border-[0.5px] border-cyan-400/30"></div>
                    ))}
                 </div>
              </div>
              
              {/* Camera Info Overlay */}
              <div className="absolute top-2 left-3 flex items-center space-x-2 z-10">
                <Video size={14} className="text-cyan-400" />
                <span className="text-xs font-bold text-white/90 font-orbitron tracking-wider shadow-black drop-shadow-md">{video.name}</span>
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 right-3 flex items-center space-x-1.5 bg-black/50 px-2 py-0.5 rounded border border-white/10 backdrop-blur-md z-10">
                <div className={`w-2 h-2 rounded-full ${video.status === 'REC' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-[10px] font-black text-white">{video.status}</span>
              </div>

              {/* Time Stamp */}
              <div className="absolute bottom-2 right-3 z-10">
                <span className="text-[10px] font-mono text-white/70">2025-12-26 20:49:15</span>
              </div>
              
              {/* Crosshair Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 opacity-50 flex items-center justify-center pointer-events-none">
                 <div className="w-0.5 h-2 bg-white/50"></div>
                 <div className="absolute w-2 h-0.5 bg-white/50"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSnapshotGallery = () => {
    const totalPages = Math.ceil(mockSnapshots.length / SNAPSHOTS_PER_PAGE);
    const currentData = mockSnapshots.slice(
      (snapshotPage - 1) * SNAPSHOTS_PER_PAGE, 
      snapshotPage * SNAPSHOTS_PER_PAGE
    );

    return (
      <div className="flex-1 flex flex-col min-h-0">
        {/* Grid Area */}
        <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-3 min-h-0 overflow-y-auto pr-1">
          {currentData.map(shot => (
            <div key={shot.id} className="relative group bg-[#0a1a3a]/40 border border-white/10 hover:border-cyan-400/60 rounded-sm overflow-hidden transition-all duration-300 flex flex-col">
              {/* Image Area */}
              <div className="flex-1 relative bg-black/40 overflow-hidden">
                {/* Placeholder visual for image */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                   <Camera size={24} className="text-white/10" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#020d24] to-transparent opacity-60"></div>
                   {/* Simulating image content with a colored overlay based on ID to distinguish items */}
                   <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay"></div>
                </div>
                
                {/* Status Tag */}
                {shot.status === '异常' && (
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500/80 text-[8px] font-bold text-white rounded-[2px]">
                    异常
                  </div>
                )}
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Maximize size={20} className="text-white drop-shadow-md" />
                </div>
              </div>

              {/* Info Footer */}
              <div className="h-10 bg-[#020d24] border-t border-white/5 flex flex-col justify-center px-2 relative">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-cyan-100 font-bold truncate">{shot.location}</span>
                   <span className="text-[9px] text-white/40 font-mono">{shot.date}</span>
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                   <Clock size={8} className="text-cyan-400" />
                   <span className="text-[9px] text-white/60 font-mono">{shot.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="h-10 flex items-center justify-center space-x-4 mt-2 border-t border-white/5 pt-2">
          <button 
            onClick={() => setSnapshotPage(p => Math.max(1, p - 1))}
            disabled={snapshotPage === 1}
            className="p-1 rounded hover:bg-white/10 text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div 
                key={i}
                onClick={() => setSnapshotPage(i + 1)} 
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  snapshotPage === i + 1 
                    ? 'bg-cyan-400 w-4 shadow-[0_0_8px_#00e5ff]' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={() => setSnapshotPage(p => Math.min(totalPages, p + 1))}
            disabled={snapshotPage === totalPages}
            className="p-1 rounded hover:bg-white/10 text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[800px] h-[500px] bg-[#020d24]/95 border border-cyan-400/30 shadow-[0_0_50px_rgba(0,229,255,0.15)] relative flex flex-col overflow-hidden rounded-sm">
        
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-10"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-10"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-10"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-10"></div>

        {/* Header */}
        <div className="h-12 flex items-center justify-between px-6 border-b border-white/10 bg-gradient-to-r from-cyan-900/20 via-transparent to-cyan-900/20">
          <div className="flex items-center space-x-2">
             <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00e5ff]"></div>
             <h2 className="text-xl font-bold text-white tracking-wider font-orbitron">{markerData.label}</h2>
             <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 uppercase tracking-widest scale-90">
                {markerData.status === 'online' ? '运行正常' : '监测中'}
             </span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-cyan-400 transition-colors p-1 rounded hover:bg-white/5"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6">
          
          {/* Controls Row */}
          <div className="flex justify-between items-center mb-6">
            {/* Tabs */}
            <div className="flex space-x-2">
              {[
                { id: 'realtime', label: '实时监测' },
                { id: 'video', label: '监控视频' },
                { id: 'snapshot', label: '图像抓拍' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'snapshot') setSnapshotPage(1); // Reset page on tab switch
                  }}
                  className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-all duration-300 clip-path-slant ${
                    activeTab === tab.id 
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Time Selector Dropdown - Only show if NOT video tab */}
            {activeTab !== 'video' && (
              <div className="relative" ref={timeDropdownRef}>
                <button 
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="flex items-center space-x-2 text-sm text-white/90 bg-black/30 border border-cyan-400/30 px-3 py-1.5 rounded-sm hover:border-cyan-400 transition-colors"
                >
                  <Calendar size={14} className="text-cyan-400" />
                  <span>{timeRange}</span>
                  <ChevronDown size={14} className={`text-white/50 transition-transform ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTimeDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-[#020d24] border border-cyan-400/30 shadow-[0_0_20px_rgba(0,229,255,0.2)] rounded-sm p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                     <div className="grid grid-cols-2 gap-2 mb-4">
                        {['近24小时', '近7天', '近30天', '今年'].map(t => (
                          <button 
                            key={t}
                            onClick={() => handleTimePreset(t)}
                            className={`px-2 py-1.5 text-xs border rounded-sm transition-all ${
                              timeRange === t 
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                     </div>
                     
                     <div className="border-t border-white/10 pt-3">
                        <p className="text-xs text-cyan-400 mb-2 font-bold">自定义时间段</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <input 
                            type="date" 
                            value={customStartTime}
                            onChange={(e) => setCustomStartTime(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-sm px-2 py-1 text-xs text-white focus:border-cyan-400 outline-none color-scheme-dark"
                            style={{ colorScheme: 'dark' }}
                          />
                          <span className="text-white/30">-</span>
                          <input 
                            type="date" 
                            value={customEndTime}
                            onChange={(e) => setCustomEndTime(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-sm px-2 py-1 text-xs text-white focus:border-cyan-400 outline-none color-scheme-dark"
                            style={{ colorScheme: 'dark' }}
                          />
                        </div>
                        <button 
                          onClick={handleCustomRange}
                          className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-sm transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        >
                          确认
                        </button>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conditional Content Rendering */}
          {activeTab === 'realtime' && renderRealtimeChart()}
          {activeTab === 'video' && renderVideoGrid()}
          {activeTab === 'snapshot' && renderSnapshotGallery()}

        </div>
      </div>
    </div>
  );
};

export default DetailModal;
