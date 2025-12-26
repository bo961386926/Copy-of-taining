
import React from 'react';
import DashboardCard from './DashboardCard';
import { 
  Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Cell, BarChart, LineChart
} from 'recharts';
import { ShieldCheck, Droplets, Zap } from 'lucide-react';
import { Button } from 'lucide-react';

const healthData = [
  { name: '1月', value: 95 },
  { name: '2月', value: 92 },
  { name: '3月', value: 88 },
  { name: '4月', value: 76 },
  { name: '5月', value: 85 },
  { name: '6月', value: 72 },
  { name: '7月', value: 82 },
];

const yearlyDrainageData = [
  { times:'2025-01.',name: '场次1', flow: 120, velocity: 3.2, rain: 8 },
  { times:'2025-02.',name: '场次2', flow: 450, velocity: 6.8, rain: 25 },
  { times:'2025-03.',name: '场次3', flow: 310, velocity: 4.5, rain: 15 },
  { times:'2025-04.',name: '场次4', flow: 890, velocity: 9.2, rain: 48 },
  { times:'2025-05.',name: '场次5', flow: 560, velocity: 7.1, rain: 30 },
  { times:'2025-06.',name: '场次6', flow: 980, velocity: 10.0, rain: 52 },
  { times:'2025-07.',name: '场次7', flow: 220, velocity: 3.8, rain: 12 },
];

const warningTrendYearly = [
  { name: '1月', value: 2 },
  { name: '2月', value: 1 },
  { name: '3月', value: 3 },
  { name: '4月', value: 5 },
  { name: '5月', value: 8 },
  { name: '6月', value: 12 },
  { name: '7月', value: 15 },
  { name: '8月', value: 10 },
  { name: '9月', value: 6 },
  { name: '10月', value: 4 },
  { name: '11月', value: 2 },
  { name: '12月', value: 1 },
];

const LeftSidebar: React.FC = () => {
  const commonTooltipProps = {
    contentStyle: { 
      backgroundColor: 'rgba(1, 12, 30, 0.95)', 
      borderColor: '#00e5ff', 
      borderRadius: '4px',
      borderWidth: '1px',
      padding: '8px',
      boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)'
    },
    labelStyle: { color: '#00e5ff', fontWeight: 'bold', marginBottom: '4px', fontSize: '11px' },
    itemStyle: { color: '#ffffff', fontSize: '11px', fontWeight: 'bold' }
  };

  const metrics = [
    { 
      value: '223', unit: '天', label: '安全运行', 
      color: 'from-emerald-500/20', accent: 'text-emerald-400', ring: 'emerald-400',
      icon: <ShieldCheck size={10} className="text-emerald-400" />,
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]'
    },
    { 
      value: '100', unit: '万吨', label: '累计排水', 
      color: 'from-blue-500/20', accent: 'text-blue-400', ring: 'blue-400',
      icon: <Droplets size={10} className="text-blue-400" />,
      glowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.4)]'
    },
    { 
      value: '10', unit: 'm/s', label: '最大流速', 
      color: 'from-purple-500/20', accent: 'text-purple-400', ring: 'purple-400',
      icon: <Zap size={10} className="text-purple-400" />,
      glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]'
    },
  ];

  return (
    <div className="w-[380px] h-full flex flex-col p-2 space-y-2 z-20">
      {/* 综合运行数据 - 强化安全运行天数概念 */}
      <DashboardCard title="综合运行数据" className="h-[145px]">
        <div className="grid grid-cols-3 gap-3 h-full items-center">
          {metrics.map((item, i) => (
            <div key={i} className={`relative flex flex-col items-center justify-center h-[100px] rounded-lg overflow-hidden border border-white/5 bg-gradient-to-br ${item.color} to-transparent group transition-all duration-500 hover:border-white/20`}>
              
              {/* 背景旋转环 - 对应主题色 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity">
                <svg viewBox="0 0 100 100" className="w-full h-full rotate-slow">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10,20" className={item.accent} />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,10" className="text-white/20" />
                </svg>
              </div>
              
              {/* 顶部主题色扫描线 */}
              <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent animate-[scan-move_4s_infinite_linear] ${item.accent}`}></div>

              {/* 数值展示层 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-baseline mb-0.5">
                  <span className={`text-2xl font-orbitron font-black metric-glow group-hover:scale-105 transition-transform duration-500 ${i === 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {item.value}
                  </span>
                  <span className={`text-[8px] font-bold uppercase ml-1 opacity-80 ${item.accent}`}>{item.unit}</span>
                </div>
                
                {/* 主题色进度条 */}
                <div className="w-14 h-[3px] bg-black/40 mt-1 mb-2 overflow-hidden rounded-full border border-white/5">
                  <div className={`h-full w-4/5 animate-[glow-pulse_2s_infinite] bg-current ${item.accent}`}></div>
                </div>

                <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-black/30 border border-white/5">
                   {item.icon}
                   <span className="text-[9px] font-black tracking-[0.1em] uppercase italic text-white/80">
                      {item.label} 
                   </span>
                </div>
              </div>

              {/* 四角装饰点 */}
              <div className={`absolute top-1 left-1 w-1 h-1 rounded-full opacity-40 bg-current ${item.accent}`}></div>
              <div className={`absolute bottom-1 right-1 w-1 h-1 rounded-full opacity-40 bg-current ${item.accent}`}></div>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* 健康指数分析 */}
      <DashboardCard title="健康指数分析" className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={healthData} margin={{ top: 15, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#ffffff" opacity={0.05} />
            <XAxis dataKey="name" fontSize={9} tick={{ fill: '#ffffff', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
            <YAxis fontSize={9} tick={{ fill: '#ffffff', fontWeight: 'bold' }} domain={[0, 100]} axisLine={false} tickLine={false} />
            <Tooltip 
              {...commonTooltipProps} 
              formatter={(val) => [`${val}分`, '健康指数']}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={18}>
              {healthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value < 80 ? '#fbbf24' : '#10b981'} />
              ))}
            </Bar>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#ffffff" 
              strokeWidth={1.5} 
              dot={{ r: 3, fill: '#ffffff', stroke: '#00e5ff', strokeWidth: 1.5 }} 
              tooltipType="none" 
            />
          </BarChart>
        </ResponsiveContainer>
      </DashboardCard>

      <DashboardCard title="监测告警分析" className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={warningTrendYearly} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#ffffff" opacity={0.05} />
            <XAxis dataKey="name" fontSize={9} tick={{ fill: '#ffffff', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
            <YAxis fontSize={9} tick={{ fill: '#ffffff', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
            <Tooltip 
              {...commonTooltipProps} 
              formatter={(val) => [`${val}次`, '告警次数']}
            />
            <Line type="monotone" dataKey="value" stroke="#00e5ff" strokeWidth={2} dot={{ r: 3, fill: '#00e5ff', stroke: '#ffffff', strokeWidth: 1.5 }} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardCard>

      <DashboardCard title="系统排水分析" className="h-[320px]">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center bg-blue-600/10 border border-blue-400/20 px-3 py-1.5 mb-2 rounded-sm relative overflow-hidden group">
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-cyan-300 font-bold uppercase tracking-widest">当日降雨</span>
              <span className="text-sm font-orbitron font-black text-white">52.0<span className="text-[8px] ml-0.5">mm</span></span>
            </div>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-yellow-300 font-bold uppercase tracking-widest">最高流速</span>
              <span className="text-sm font-orbitron font-black text-white">10<span className="text-[8px] ml-0.5">m/s</span></span>
            </div>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-blue-200 font-bold uppercase tracking-widest">最高流量</span>
              <span className="text-sm font-orbitron font-black text-white">980<span className="text-[8px] ml-0.5">m³/h</span></span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={yearlyDrainageData} margin={{ top: 5, right: -5, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#7dd913ff" opacity={0.05} />
    
                <XAxis dataKey="name" fontSize={8} tick={{ fill: '#ffffff', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" fontSize={8} tick={{ fill: '#fbbf24', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" fontSize={8} tick={{ fill: '#60a5fa', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  {...commonTooltipProps} 
                  formatter={(value, name) => {
                    if (name === 'rain') return [`${value} mm`, '降雨量1'];
                    if (name === 'velocity') return [`${value} m/s`, '流速'];
                    if (name === 'flow') return [`${value} m³/h`, '流量'];
                
                    return [value, name];
                  }}
                />
                <Bar dataKey="rain" name="rain" fill="#00e5ff" fillOpacity={0.6} barSize={10} radius={[1, 1, 0, 0]} />
                <Line yAxisId="left" name="velocity" type="monotone" dataKey="velocity" stroke="#fbbf24" strokeWidth={1.5} dot={{ r: 2, fill: '#fbbf24' }} />
                <Line yAxisId="right" name="flow" type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 2, fill: '#3b82f6' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardCard>

      
      
    </div>
  );
};

export default LeftSidebar;
