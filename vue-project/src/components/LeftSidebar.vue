<template>
  <div class="w-[380px] h-full flex flex-col p-2 space-y-2 z-20">
    <!-- 综合运行数据 - 强化安全运行天数概念 -->
    <DashboardCard title="综合运行数据" class="h-[145px]">
      <!-- Updated: removed items-center to allow full height stretching -->
      <div class="grid grid-cols-3 gap-3 h-full">
        <div v-for="(item, i) in metrics" :key="i" class="relative flex flex-col items-center justify-center h-full rounded-lg overflow-hidden border border-white/5 bg-gradient-to-br group transition-all duration-500 hover:border-white/20" :class="[item.color, 'to-transparent']">
          
          <!-- 背景旋转环 - 对应主题色 -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity">
            <svg viewBox="0 0 100 100" class="w-full h-full rotate-slow">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="10,20" :class="item.accent" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2,10" class="text-white/20" />
            </svg>
          </div>
          
          <!-- 顶部主题色扫描线 -->
          <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent animate-[scan-move_4s_infinite_linear]" :class="item.accent"></div>

          <!-- 数值展示层 -->
          <div class="relative z-10 flex flex-col items-center">
            <div class="flex items-baseline mb-0.5">
              <span class="text-2xl font-orbitron font-black metric-glow group-hover:scale-105 transition-transform duration-500" :class="i === 0 ? 'text-emerald-400' : 'text-white'">
                {{ item.value }}
              </span>
              <span class="text-[8px] font-bold uppercase ml-1 opacity-80" :class="item.accent">{{ item.unit }}</span>
            </div>
            
            <!-- 主题色进度条 -->
            <div class="w-14 h-[3px] bg-black/40 mt-1 mb-2 overflow-hidden rounded-full border border-white/5">
              <div class="h-full w-4/5 animate-[glow-pulse_2s_infinite] bg-current" :class="item.accent"></div>
            </div>

            <div class="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-black/30 border border-white/5">
               <component :is="item.iconComponent" :size="10" :class="item.iconClass" />
               <span class="text-[9px] font-black tracking-[0.1em] uppercase italic text-white/80">
                  {{ item.label }} 
               </span>
            </div>
          </div>

          <!-- 四角装饰点 -->
          <div class="absolute top-1 left-1 w-1 h-1 rounded-full opacity-40 bg-current" :class="item.accent"></div>
          <div class="absolute bottom-1 right-1 w-1 h-1 rounded-full opacity-40 bg-current" :class="item.accent"></div>
        </div>
      </div>
    </DashboardCard>

    <!-- 健康指数分析 -->
    <DashboardCard title="健康指数分析" class="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart :data="healthData" margin="{ top: 15, right: 5, left: -25, bottom: 0 }">
          <CartesianGrid stroke-dasharray="2 2" :vertical="false" stroke="#ffffff" :opacity="0.05" />
          <XAxis data-key="name" :font-size="9" :tick="{ fill: '#ffffff', fontWeight: 'bold' }" :axis-line="false" :tick-line="false" />
          <YAxis :font-size="9" :tick="{ fill: '#ffffff', fontWeight: 'bold' }" :domain="[0, 100]" :axis-line="false" :tick-line="false" />
          <Tooltip 
            :content-style="commonTooltipProps.contentStyle" 
            :label-style="commonTooltipProps.labelStyle" 
            :item-style="commonTooltipProps.itemStyle" 
            :formatter="(val: any) => [`${val}分`, '健康指数']"
          />
          <Bar data-key="value" :radius="[2, 2, 0, 0]" :bar-size="18">
            <Cell v-for="(entry, index) in healthData" :key="`cell-${index}`" :fill="entry.value < 80 ? '#fbbf24' : '#10b981'" />
          </Bar>
          <Line 
            type="monotone" 
            data-key="value" 
            stroke="#ffffff" 
            :stroke-width="1.5" 
            :dot="{ r: 3, fill: '#ffffff', stroke: '#00e5ff', strokeWidth: 1.5 }" 
            :tooltip-type="'none'" 
          />
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>

    <DashboardCard title="监测告警分析" class="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart :data="warningTrendYearly" margin="{ top: 10, right: 25, left: -20, bottom: 0 }">
          <CartesianGrid stroke-dasharray="2 2" :vertical="false" stroke="#ffffff" :opacity="0.05" />
          <XAxis 
            data-key="name" 
            :font-size="9" 
            :tick="{ fill: '#ffffff', fontWeight: 'bold' }" 
            :axis-line="false" 
            :tick-line="false" 
            :interval="0" 
            :padding="{ left: 10, right: 10 }"
          />
          <YAxis :font-size="9" :tick="{ fill: '#ffffff', fontWeight: 'bold' }" :axis-line="false" :tick-line="false" />
          <Tooltip 
            :content-style="commonTooltipProps.contentStyle" 
            :label-style="commonTooltipProps.labelStyle" 
            :item-style="commonTooltipProps.itemStyle" 
            :formatter="(val: any) => [`${val}次`, '告警次数']"
          />
          <Line type="monotone" data-key="value" stroke="#00e5ff" :stroke-width="2" :dot="{ r: 3, fill: '#00e5ff', stroke: '#ffffff', strokeWidth: 1.5 }" />
        </LineChart>
      </ResponsiveContainer>
    </DashboardCard>

    <DashboardCard title="系统排水分析" class="h-[320px]">
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-center bg-blue-600/10 border border-blue-400/20 px-3 py-1.5 mb-2 rounded-sm relative overflow-hidden group shrink-0">
          <div class="flex flex-col items-center">
            <span class="text-[8px] text-[#bbf7d0] font-bold uppercase tracking-widest">最大降雨</span>
            <span class="text-sm font-orbitron font-black text-white">80<span class="text-[8px] ml-0.5">mm</span></span>
          </div>
          <div class="w-[1px] h-4 bg-white/10"></div>
          <div class="flex flex-col items-center">
            <span class="text-[8px] text-blue-300 font-bold uppercase tracking-widest">最高流速</span>
            <span class="text-sm font-orbitron font-black text-white">4.2<span class="text-[8px] ml-0.5">m/s</span></span>
          </div>
          <div class="w-[1px] h-4 bg-white/10"></div>
          <div class="flex flex-col items-center">
            <span class="text-[8px] text-red-300 font-bold uppercase tracking-widest">最高流量</span>
            <span class="text-sm font-orbitron font-black text-white">100<span class="text-[8px] ml-0.5">L/s</span></span>
          </div>
        </div>
        
        <div class="flex-1 min-h-0 relative">
          <div class="absolute inset-0 overflow-x-auto custom-scrollbar">
            <div :style="{ width: chartMinWidth > 0 ? `${chartMinWidth}px` : '100%', minWidth: '100%', height: '100%' }">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart :data="drainageAnalysisData" margin="{ top: 5, right: -5, left: -30, bottom: 0 }">
                  <CartesianGrid stroke-dasharray="2 2" :vertical="false" stroke="#ffffff" :opacity="0.05" />
      
                  <XAxis data-key="date" :font-size="8" :tick="{ fill: '#ffffff', fontWeight: 'bold' }" :axis-line="false" :tick-line="false" :interval="0" />
                  
                  <!-- Left Y-Axis for Flow and Velocity -->
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    :font-size="8" 
                    :tick="{ fill: '#ffffff', fontWeight: 'bold' }" 
                    :axis-line="false" 
                    :tick-line="false"
                    label="{ value: '流量(L/s) / 流速(m/s)', angle: -90, position: 'insideLeft', fontSize: 8, fill: '#ffffff', opacity: 0.7, dy: 40 }"
                  />
                  
                  <!-- Right Y-Axis for Rain (Inverted) -->
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    :font-size="8" 
                    :tick="{ fill: '#bbf7d0', fontWeight: 'bold' }" 
                    :axis-line="false" 
                    :tick-line="false"
                    :reversed="true"
                    label="{ value: '降雨量(mm)', angle: 90, position: 'insideRight', fontSize: 8, fill: '#bbf7d0', opacity: 0.7 }"
                  />

                  <Tooltip 
                    :content-style="commonTooltipProps.contentStyle" 
                    :label-style="commonTooltipProps.labelStyle" 
                    :formatter="(value: any, name: any) => {
                      if (name === '降雨量') return [`${value} mm`, '降雨量'];
                      if (name === '流速') return [`${value} m/s`, '流速'];
                      if (name === '流量') return [`${value} L/s`, '流量'];
                      return [value, name];
                    }"
                  />
                  
                  <Legend :icon-size="8" :wrapper-style="{ fontSize: '10px', paddingTop: '10px' }" />

                  <!-- Rain Bars - Hanging from top (using inverted axis) - Light Green user liked -->
                  <Bar yAxisId="right" name="降雨量" data-key="rain" fill="#bbf7d0" :bar-size="15" :radius="[0, 0, 2, 2]" />
                  
                  <!-- Flow Line - Red -->
                  <Line yAxisId="left" name="流量" type="monotone" data-key="flow" stroke="#ef4444" :stroke-width="2" :dot="{ r: 0 }" :active-dot="{ r: 4 }" />
                  
                  <!-- Velocity Line - Blue -->
                  <Line yAxisId="left" name="流速" type="monotone" data-key="velocity" stroke="#3b82f6" :stroke-width="2" :dot="{ r: 0 }" :active-dot="{ r: 4 }" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import DashboardCard from './DashboardCard.vue'
import { 
  Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Cell, BarChart, LineChart, Legend
} from 'recharts'
import { ShieldCheck, Droplets, Zap } from 'lucide-vue-next'

const healthData = [
  { name: '1月', value: 95 },
  { name: '2月', value: 92 },
  { name: '3月', value: 88 },
  { name: '4月', value: 76 },
  { name: '5月', value: 85 },
  { name: '6月', value: 72 },
  { name: '7月', value: 82 },
];

// Updated data with more entries to demonstrate scrolling capability for large datasets
const drainageAnalysisData = [
  { date: '5月6日', rain: 10, flow: 20, velocity: 1.0 },
  { date: '5月7日', rain: 30, flow: 50, velocity: 1.5 },
  { date: '5月8日', rain: 50, flow: 60, velocity: 2.5 },
  { date: '5月9日', rain: 60, flow: 70, velocity: 3.8 },
  { date: '5月10日', rain: 80, flow: 100, velocity: 4.2 },
  { date: '5月11日', rain: 60, flow: 80, velocity: 3.5 },
  { date: '5月12日', rain: 40, flow: 60, velocity: 2.2 },
  { date: '5月13日', rain: 20, flow: 50, velocity: 1.5 },
  { date: '5月14日', rain: 10, flow: 20, velocity: 0.8 },
  { date: '5月15日', rain: 5, flow: 15, velocity: 0.5 },
  { date: '5月16日', rain: 2, flow: 10, velocity: 0.3 },
  { date: '5月17日', rain: 0, flow: 5, velocity: 0.1 },
  { date: '5月18日', rain: 0, flow: 5, velocity: 0.1 },
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
    iconComponent: ShieldCheck,
    iconClass: "text-emerald-400"
  },
  { 
    value: '100', unit: '万吨', label: '累计排水', 
    color: 'from-blue-500/20', accent: 'text-blue-400', ring: 'blue-400',
    iconComponent: Droplets,
    iconClass: "text-blue-400"
  },
  { 
    value: '10', unit: 'm/s', label: '最大流速', 
    color: 'from-purple-500/20', accent: 'text-purple-400', ring: 'purple-400',
    iconComponent: Zap,
    iconClass: "text-purple-400"
  },
];

// Dynamic width calculation: ensure each data point gets at least 45px
// This enables horizontal scrolling when data points increase (e.g. > 8 items)
const chartMinWidth = computed(() => Math.max(drainageAnalysisData.length * 45, 100));
</script>
