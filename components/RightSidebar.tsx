
import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import { 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { CloudRain, Bell, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

const rainForecastData = [
  { time: '18:00', rainfall: 0.2 },
  { time: '21:00', rainfall: 1.5 },
  { time: '00:00', rainfall: 5.2 },
  { time: '03:00', rainfall: 15.2 },
  { time: '06:00', rainfall: 8.5 },
  { time: '09:00', rainfall: 2.1 },
  { time: '12:00', rainfall: 0.0 },
  { time: '15:00', rainfall: 0.0 },
];

const deviceStatusData = [
  { name: '正常', value: 11, color: '#00e5ff' },
  { name: '故障', value: 0, color: '#fbbf24' },
];

const equipmentDetails = [
  { type: '液位计', total: 4, normal: 4 },
  { type: '负压传感器', total: 4, normal: 4 },
  { type: '流量计', total: 3, normal: 3 },
];

const maintenanceAlerts = [
  { id: 1, type: '告警', title: '极端暴雨预警', content: '预计03:00降雨量将超设计重现期，请开启溢流阀。', time: '实时' },
  { id: 2, type: '告警', title: '健康指数偏低', content: '健康指数72%低于阈值，建议安排运维巡检。', time: '5m' },
  { id: 3, type: '告警', title: '天沟积水预警', content: '5#雨水斗液位异常，疑似枯枝堵塞请清理。', time: '12m' },
  { id: 4, type: '告警', title: '负压抽吸异常', content: '3号子系统负压(32kPa)低，请排查气密性。', time: '28m' },
  { id: 5, type: '信息', title: '例行设备巡检', content: '8#传感器电量低(12%)，建议本周更换电池。', time: '1h' },
  { id: 6, type: '信息', title: '系统自检完成', content: '全站11个节点通讯良好，丢包率0.01%。', time: '2h' },
  { id: 7, type: '告警', title: '流量传感器偏差', content: '2#流量计校验异常，建议手动校准零点。', time: '3h' },
  { id: 8, type: '信息', title: '运维任务指派', content: '已生成Q3季度停车场排水设施保养清单。', time: '5h' },
  { id: 9, type: '信息', title: '气象联动响应', content: '接收橙色预警，系统已自动调低报警阈值。', time: '6h' },
  { id: 10, type: '信息', title: '历史数据备份', content: '7月运行报告已导出，综合效率提升12%。', time: '1d' },
];

const RightSidebar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  
  const displayAlerts = [...maintenanceAlerts, maintenanceAlerts[0]];
  const itemMarginBottom = 6;
  const itemHeight = 52 + itemMarginBottom; 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentIndex === displayAlerts.length - 1) {
      const snapTimer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(0);
      }, 800);
      return () => clearTimeout(snapTimer);
    } else {
      setTransitionEnabled(true);
    }
  }, [currentIndex, displayAlerts.length]);

  const getRainColor = (val: number) => {
    if (val >= 40) return '#ef4444'; 
    if (val >= 20) return '#f97316'; 
    if (val >= 10) return '#fbbf24'; 
    if (val >= 5) return '#60a5fa';  
    return '#22d3ee'; 
  };

  return (
    <div className="w-[380px] h-full flex flex-col p-2 space-y-2 z-20 overflow-hidden">
      {/* 1. 未来降雨预报 */}
      <DashboardCard title="未来降雨预报(24小时)" className="h-[250px] shrink-0">
        <div className="flex flex-col h-full relative py-1">
           <div className="flex mb-1">
             {rainForecastData.map((w, i) => (
               <div key={i} className="flex flex-col items-center flex-1">
                 <span className="text-[8px] text-white/50 font-orbitron">{w.time}</span>
                 <CloudRain size={10} className={`my-1 ${w.rainfall >= 10 ? 'text-yellow-400' : 'text-cyan-400'}`} />
                 <span className="text-[9px] font-bold text-white/90">{w.rainfall}</span>
               </div>
             ))}
           </div>
           <div className="flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rainForecastData} margin={{ left: 0, right: 0, bottom: 0, top: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#ffffff" opacity={0.05} />
                  <XAxis dataKey="time" hide />
                  <YAxis fontSize={7} tick={{fill: '#ffffff', opacity: 0.5}} axisLine={false} tickLine={false} />
                  <Bar dataKey="rainfall" radius={[1, 1, 0, 0]} barSize={12}>
                    {rainForecastData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={getRainColor(entry.rainfall)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
           {/* 图例和数据来源 */}
           <div className="flex justify-between items-center mt-1 px-1">
             <div className="flex items-center">
               <div className="flex items-center mr-2">
                 <div className="w-2 h-2 bg-cyan-400 rounded-full mr-1"></div>
                 <span className="text-[7px] text-white">0-5mm</span>
               </div>
               <div className="flex items-center mr-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                 <span className="text-[7px] text-white">5-10mm</span>
               </div>
               <div className="flex items-center mr-2">
                 <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                 <span className="text-[7px] text-white">10-20mm</span>
               </div>
               <div className="flex items-center mr-2">
                 <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                 <span className="text-[7px] text-white">20-40mm</span>
               </div>
               <div className="flex items-center">
                 <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                 <span className="text-[7px] text-white">&gt;40mm</span>
               </div>
             </div>
             <div className="text-[7px] text-white italic">数据来源: 和风天气</div>
           </div>
        </div>
      </DashboardCard>

      {/* 2. 监测设备状态 */}
      <DashboardCard title="监测设备状态" className="h-[200px] shrink-0">
        <div className="flex h-full items-center py-1">
          <div className="w-[35%] h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceStatusData} innerRadius="65%" outerRadius="90%" paddingAngle={3} dataKey="value" startAngle={90} endAngle={450}>
                  {deviceStatusData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-white font-orbitron leading-none">11</span>
              <span className="text-[7px] text-cyan-300 font-bold uppercase tracking-widest mt-0.5">ONLINE</span>
            </div>
          </div>
          <div className="w-[65%] flex flex-col justify-center space-y-2.5 px-4">
             {equipmentDetails.map((item, i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2.5"></div>
                    <span className="text-[10px] text-white/90 font-bold">{item.type}</span>
                 </div>
                 <div className="bg-[#0a1a3a] border border-blue-400/20 rounded px-2 py-0.5 text-[9px] font-orbitron font-bold text-cyan-300 min-w-[40px] text-center">
                   {item.normal}/{item.total}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </DashboardCard>

      {/* 3. 系统运维预警 - 强化红色标签与警示特效 */}
      <DashboardCard title="系统运维预警" className="h-[250px] shrink-0">
        <div className="relative h-full overflow-hidden mt-1 px-1">
          <div 
            className="ticker-container" 
            style={{ 
              transform: `translateY(-${currentIndex * itemHeight}px)`,
              transition: transitionEnabled ? 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)' : 'none'
            }}
          >
            {displayAlerts.map((alert, idx) => (
              <div 
                key={`${alert.title}-${idx}`} 
                className={`relative rounded-sm border-l-4 transition-all duration-300 group overflow-hidden ${
                  alert.type === '告警' 
                    ? 'bg-red-950/20 border-red-600 animate-[card-border-pulse_3s_infinite] shadow-[inset_0_0_15px_rgba(220,38,38,0.15)]' 
                    : 'bg-blue-900/10 border-blue-500/50'
                }`}
                style={{ height: '52px', marginBottom: `${itemMarginBottom}px` }}
              >
                {/* 顶部标签行 */}
                <div className="flex items-center justify-between px-2 pt-1.5">
                  <div className="flex items-center space-x-2">
                    {/* 动态状态标签 */}
                    <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-[2px] ${
                      alert.type === '告警' ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                      {alert.type === '告警' ? (
                        <AlertTriangle size={8} className="text-white animate-pulse" />
                      ) : (
                        <Info size={8} className="text-white" />
                      )}
                      <span className="text-[8px] font-black text-white uppercase tracking-wider leading-none">
                        {alert.type}
                      </span>
                    </div>
                    {/* 标题 */}
                    <span className={`text-[10px] font-black truncate max-w-[180px] ${
                      alert.type === '告警' ? 'text-red-400' : 'text-white'
                    }`}>
                      {alert.title}
                    </span>
                  </div>
                  {/* 时间 */}
                  <span className={`text-[7px] font-orbitron font-bold ${
                    alert.type === '告警' ? 'text-red-400/80' : 'text-cyan-400/50'
                  }`}>
                    {alert.time}
                  </span>
                </div>

                {/* 内容行 */}
                <p className={`text-[9px] px-2 mt-1 line-clamp-1 italic font-medium transition-colors ${
                  alert.type === '告警' ? 'text-red-100/70 group-hover:text-red-100' : 'text-white/60 group-hover:text-white/90'
                }`}>
                  {alert.content}
                </p>

                {/* 背景装饰：扫描线 */}
                {alert.type === '告警' && (
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-[scan-move_3s_infinite]"></div>
                )}
                
                {/* 装饰性警报闪烁点 */}
                {alert.type === '告警' && (
                   <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

      {/* 4. 项目概况 */}
      <DashboardCard title="项目概况" className="h-[120px]">
        <div className="relative h-full flex items-center px-3">
           <div className="absolute right-2 bottom-2 opacity-5">
              <ShieldCheck size={40} className="text-cyan-400" />
           </div>
           <p className="text-[10px] leading-relaxed text-white/70 font-medium italic border-l-2 border-cyan-500/30 pl-3">
            北京轨道交通13号线扩能提升工程小辛庄停车场占地面积约22.30公顷，总建筑面积约10.8万平方米，包含运用库、综合楼、调机车库等共11座单体建筑物。其中运用库屋面面积7万平方米，采用了虹吸式屋面排水系统，共设置108个系统，343个雨水斗。
          </p>
        </div>
      </DashboardCard>
    </div>
  );
};

export default RightSidebar;
