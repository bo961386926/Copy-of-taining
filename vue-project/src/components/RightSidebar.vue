<template>
  <div class="w-[380px] h-full flex flex-col p-2 space-y-2 z-20 overflow-hidden">
    <!-- 1. 未来降雨预报 - Height reduced to 200px -->
    <DashboardCard title="未来降雨预报(24小时)" class="h-[200px] shrink-0">
      <div class="flex flex-col h-full relative py-1">
         <div class="flex mb-1">
           <div v-for="(w, i) in rainForecastData" :key="i" class="flex flex-col items-center flex-1">
             <span class="text-[8px] text-white/50 font-orbitron">{{ w.time }}</span>
             <CloudRain :size="10" class="my-1" :class="w.rainfall >= 10 ? 'text-yellow-400' : 'text-cyan-400'" />
             <span class="text-[9px] font-bold text-white/90">{{ w.rainfall }}</span>
           </div>
         </div>
         <div class="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart :data="rainForecastData" :margin="{ left: 0, right: 0, bottom: 0, top: 0 }">
                <CartesianGrid stroke-dasharray="2 2" :vertical="false" stroke="#ffffff" :opacity="0.05" />
                <XAxis data-key="time" hide />
                <YAxis :font-size="7" :tick="{fill: '#ffffff', opacity: 0.5}" :axis-line="false" :tick-line="false" />
                <Bar data-key="rainfall" :radius="[1, 1, 0, 0]" :bar-size="12">
                  <Cell v-for="(entry, index) in rainForecastData" :key="`cell-${index}`" :fill="getRainColor(entry.rainfall)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
         </div>
         <!-- 图例和数据来源 -->
         <div class="flex justify-between items-center mt-1 px-1">
           <div class="flex items-center">
             <div class="flex items-center mr-2">
               <div class="w-2 h-2 bg-cyan-400 rounded-full mr-1"></div>
               <span class="text-[7px] text-white">0-5mm</span>
             </div>
             <div class="flex items-center mr-2">
               <div class="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
               <span class="text-[7px] text-white">5-10mm</span>
             </div>
             <div class="flex items-center mr-2">
               <div class="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
               <span class="text-[7px] text-white">10-20mm</span>
             </div>
             <div class="flex items-center mr-2">
               <div class="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
               <span class="text-[7px] text-white">20-40mm</span>
             </div>
             <div class="flex items-center">
               <div class="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
               <span class="text-[7px] text-white">>40mm</span>
             </div>
           </div>
           <div class="text-[7px] text-white italic">数据来源: 和风天气</div>
         </div>
      </div>
    </DashboardCard>

    <!-- 2. 监测设备状态 -->
    <DashboardCard title="监测设备状态" class="h-[200px] shrink-0">
      <div class="flex h-full items-center py-1">
        <div class="w-[40%] h-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie :data="deviceStatusData" inner-radius="65%" outer-radius="85%" data-key="value" :start-angle="90" :end-angle="450">
                <Cell v-for="(e, i) in deviceStatusData" :key="i" :fill="e.color" stroke="none" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span class="text-xl font-black text-white font-orbitron leading-none">{{ totalDevices }}</span>
            <span class="text-[8px] text-cyan-300 font-bold uppercase tracking-widest mt-1">TOTAL</span>
          </div>
        </div>
        <div class="w-[60%] flex flex-col justify-center space-y-2 pr-4">
           <div v-for="(item, i) in equipmentDetails" :key="i" class="flex items-center justify-between border-b border-white/5 pb-1 last:border-0 group">
              <div class="flex items-center">
                 <div class="w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_5px_currentColor] group-hover:scale-125 transition-transform" 
                      :class="getOfflineCount(item) > 0 ? 'bg-yellow-400 text-yellow-400' : 'bg-cyan-400 text-cyan-400'"></div>
                 <span class="text-[10px] text-white/80">{{ item.type }}</span>
              </div>
              <div class="flex items-center space-x-1">
                 <div class="px-1.5 py-0.5 bg-cyan-900/30 border border-cyan-500/30 rounded-[2px] min-w-[50px] flex justify-end items-baseline">
                    <span class="text-xs font-orbitron font-bold text-cyan-400">{{ item.normal }}</span>
                    
                    <span v-if="getOfflineCount(item) > 0" class="text-xs font-orbitron font-bold text-yellow-400 ml-1">
                       <span class="text-[8px] opacity-60 mr-[1px]">!</span>{{ getOfflineCount(item) }}
                    </span>
                    
                    <span class="text-[8px] text-white/40 mx-0.5">/</span>
                    <span class="text-[8px] text-white/40">{{ item.total }}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardCard>

    <!-- 3. 系统运维预警 - 强化红色标签与警示特效 -->
    <DashboardCard title="系统运维预警" class="h-[250px] shrink-0">
      <div class="relative h-full overflow-hidden mt-1 px-1">
        <div 
          class="ticker-container" 
          :style="{ 
            transform: `translateY(-${currentIndex * itemHeight}px)`,
            transition: transitionEnabled ? 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)' : 'none'
          }"
        >
          <div 
            v-for="(alert, idx) in displayAlerts" 
            :key="`${alert.title}-${idx}`" 
            class="relative rounded-sm border-l-4 transition-all duration-300 group overflow-hidden"
            :class="alert.type === '告警' 
              ? 'bg-red-950/20 border-red-600 animate-[card-border-pulse_3s_infinite] shadow-[inset_0_0_15px_rgba(220,38,38,0.15)]' 
              : 'bg-blue-900/10 border-blue-500/50'"
            :style="{ height: '52px', marginBottom: `${itemMarginBottom}px` }"
          >
            <!-- 顶部标签行 -->
            <div class="flex items-center justify-between px-2 pt-1.5">
              <div class="flex items-center space-x-2">
                <!-- 动态状态标签 -->
                <div class="flex items-center space-x-1 px-1.5 py-0.5 rounded-[2px]" 
                     :class="alert.type === '告警' ? 'bg-red-600' : 'bg-blue-600'">
                  <AlertTriangle v-if="alert.type === '告警'" :size="8" class="text-white animate-pulse" />
                  <Info v-else :size="8" class="text-white" />
                  <span class="text-[8px] font-black text-white uppercase tracking-wider leading-none">
                    {{ alert.type }}
                  </span>
                </div>
                <!-- 标题 -->
                <span class="text-[10px] font-black truncate max-w-[180px]" 
                      :class="alert.type === '告警' ? 'text-red-400' : 'text-white'">
                  {{ alert.title }}
                </span>
              </div>
              <!-- 时间 -->
              <span class="text-[7px] font-orbitron font-bold" 
                    :class="alert.type === '告警' ? 'text-red-400/80' : 'text-cyan-400/50'">
                {{ alert.time }}
              </span>
            </div>

            <!-- 内容行 -->
            <p class="text-[9px] px-2 mt-1 line-clamp-1 italic font-medium transition-colors" 
               :class="alert.type === '告警' ? 'text-red-100/70 group-hover:text-red-100' : 'text-white/60 group-hover:text-white/90'">
              {{ alert.content }}
            </p>

            <!-- 背景装饰：扫描线 -->
            <div v-if="alert.type === '告警'" class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-[scan-move_3s_infinite]"></div>
            
            <!-- 装饰性警报闪烁点 -->
            <div v-if="alert.type === '告警'" class="absolute top-1.5 right-1.5 w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </DashboardCard>

    <!-- 4. 项目概况 - Height increased to 170px -->
    <DashboardCard title="项目概况" class="h-[170px]">
      <div class="relative h-full flex items-center px-3">
         <div class="absolute right-2 bottom-2 opacity-5">
            <ShieldCheck :size="40" class="text-cyan-400" />
         </div>
         <p class="text-[10px] leading-relaxed text-white/70 font-medium italic border-l-2 border-cyan-500/30 pl-3">
          {{ currentProject ? currentProject.description : '暂无项目描述' }}
        </p>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, onMounted, onUnmounted } from 'vue'
import DashboardCard from './DashboardCard.vue'
import { 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import { CloudRain, Bell, ShieldCheck, AlertTriangle, Info } from 'lucide-vue-next'
import { Project } from '../types'

interface RainForecast {
  time: string;
  rainfall: number;
}

interface EquipmentDetail {
  type: string;
  total: number;
  normal: number;
}

interface DeviceStatus {
  name: string;
  value: number;
  color: string;
}

interface MaintenanceAlert {
  id: number;
  type: string;
  title: string;
  content: string;
  time: string;
}

interface Props {
  currentProject?: Project;
}

const props = withDefaults(defineProps<Props>(), {
  currentProject: undefined
});

const currentIndex: Ref<number> = ref(0);
const transitionEnabled: Ref<boolean> = ref(true);

const rainForecastData: RainForecast[] = [
  { time: '18:00', rainfall: 0.2 },
  { time: '21:00', rainfall: 1.5 },
  { time: '00:00', rainfall: 5.2 },
  { time: '03:00', rainfall: 15.2 },
  { time: '06:00', rainfall: 8.5 },
  { time: '09:00', rainfall: 2.1 },
  { time: '12:00', rainfall: 0.0 },
  { time: '15:00', rainfall: 0.0 },
];

const equipmentDetails: EquipmentDetail[] = [
  { type: '液位计', total: 4, normal: 3 },
  { type: '负压传感器', total: 4, normal: 2 },
  { type: '流量计', total: 3, normal: 3 },
];

// Calculate aggregates
const totalDevices = computed(() => equipmentDetails.reduce((acc, item) => acc + item.total, 0));
const onlineDevices = computed(() => equipmentDetails.reduce((acc, item) => acc + item.normal, 0));
const offlineDevices = computed(() => totalDevices.value - onlineDevices.value);

const deviceStatusData: DeviceStatus[] = [
  { name: '在线', value: onlineDevices.value, color: '#00e5ff' },
  { name: '离线', value: offlineDevices.value, color: '#fbbf24' },
];

const maintenanceAlerts: MaintenanceAlert[] = [
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

const displayAlerts = computed(() => [...maintenanceAlerts, maintenanceAlerts[0]]);
const itemMarginBottom = 6;
const itemHeight = 52 + itemMarginBottom; 

let timer: number | null = null;
let snapTimer: number | null = null;

onMounted(() => {
  timer = window.setInterval(() => {
    currentIndex.value = currentIndex.value + 1;
  }, 4500);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
  if (snapTimer) {
    clearTimeout(snapTimer);
  }
});

const getOfflineCount = (item: EquipmentDetail) => {
  return item.total - item.normal;
};

const getRainColor = (val: number) => {
  if (val >= 40) return '#ef4444'; 
  if (val >= 20) return '#f97316'; 
  if (val >= 10) return '#fbbf24'; 
  if (val >= 5) return '#60a5fa';  
  return '#22d3ee'; 
};
</script>
