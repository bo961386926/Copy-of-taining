<script setup lang="ts">
import { ref, Ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import DashboardCard from './DashboardCard.vue'
import * as echarts from 'echarts'; // 正确的导入方式
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

// 图表 DOM 引用
const healthChartRef: Ref<HTMLElement | null> = ref(null);
const warningChartRef: Ref<HTMLElement | null> = ref(null);
const drainageChartRef: Ref<HTMLElement | null> = ref(null);

// 持有 ECharts 实例，便于销毁与自适应
let healthChart: echarts.ECharts | null = null;
let warningChart: echarts.ECharts | null = null;
let drainageChart: echarts.ECharts | null = null;

let initAttempts = 0;
let retryTimer: number | null = null;

const handleResize = () => {
  healthChart?.resize();
  warningChart?.resize();
  drainageChart?.resize();
};

const initCharts = async () => {
  await nextTick();

  if (!healthChartRef.value || !warningChartRef.value || !drainageChartRef.value) return;

  const rect = healthChartRef.value.getBoundingClientRect();
  // 首屏时容器宽高可能为 0，这里做重试，直到布局稳定
  if ((rect.width === 0 || rect.height === 0) && initAttempts < 5) {
    initAttempts += 1;
    retryTimer && window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(() => {
      initCharts();
    }, 150);
    return;
  }

  if (!healthChart) {
    healthChart = echarts.init(healthChartRef.value);
  }
  if (!warningChart) {
    warningChart = echarts.init(warningChartRef.value);
  }
  if (!drainageChart) {
    drainageChart = echarts.init(drainageChartRef.value);
  }

  // 健康指数分析图表配置
  healthChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        return `${params[0].name}: ${params[0].value}分`;
      }
    },
    xAxis: {
      type: 'category',
      data: healthData.map(item => item.name),
      axisLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#ffffff'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#ffffff'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      // 保持纵向刻度，但不画横向网格线，视觉更简洁
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: '健康指数',
        type: 'bar',
        barSize: 18,
        radius: [2, 2, 0, 0],
        data: healthData.map(item => item.value),
        itemStyle: {
          color: (params: any) => params.value < 80 ? '#fbbf24' : '#10b981'
        }
      },
      {
        name: '趋势线',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#ffffff',
          width: 1.5
        },
        symbol: 'circle',
        symbolSize: 3,
        symbolStrokeColor: '#00e5ff',
        symbolStrokeWidth: 1.5,
        data: healthData.map(item => item.value)
      }
    ],
    grid: {
      top: 15,
      right: 5,
      left: -25,
      bottom: 0
    }
  });

  // 监测告警分析图表配置
  warningChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#22d3ee',
          width: 1,
          type: 'dashed'
        }
      },
      formatter: (params: any) => {
        return `${params[0].name}: ${params[0].value}次`;
      }
    },
    xAxis: {
      type: 'category',
      data: warningTrendYearly.map(item => item.name),
      axisLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#e5e7eb',
        padding: [8, 0, 0, 0]
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.4)'
        }
      },
      axisTick: {
        show: false
      },
      interval: 0,
      padding: { left: 10, right: 10 }
    },
    yAxis: {
      type: 'value',
      max: 16,
      min: 0,
      axisLabel: {
        show: true,
        fontSize: 10,
        color: '#9ca3af'
      },
      axisLine: { show: false },
      axisTick: { show: false },
      // 不显示横向网格线，保持清爽
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: '告警次数',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#22d3ee',
          width: 2
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#0f172a',
          borderColor: '#22d3ee',
          borderWidth: 2
        },
        data: warningTrendYearly.map(item => item.value)
      }
    ],
    grid: {
      top: 20,
      right: 20,
      left: 30,
      bottom: 30
    }
  });

  // 系统排水分析图表配置
  drainageChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const result = [];
        params.forEach((param: any) => {
          if (param.seriesName === '降雨量') {
            result.push(`${param.value} mm`);
          } else if (param.seriesName === '流量') {
            result.push(`${param.value} L/s`);
          } else if (param.seriesName === '流速') {
            result.push(`${param.value} m/s`);
          }
        });
        return result.join('<br>');
      }
    },
    legend: {
      iconSize: 10,
      bottom: 0,
      textStyle: {
        fontSize: 10,
        color: '#e5e7eb'
      }
    },
    xAxis: {
      type: 'category',
      data: drainageAnalysisData.map(item => item.date),
      axisLabel: {
        fontSize: 10,
        color: '#e5e7eb',
        margin: 12
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.4)'
        }
      },
      axisTick: {
        show: false
      },
      interval: 0
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        max: 100,
        min: 0,
        axisLabel: {
          show: false
        },
        axisLine: { show: false },
        axisTick: { show: false },
        // 系统排水左侧纵轴同样去掉横向网格线
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        position: 'right',
        // 右侧纵轴反转，使降雨量柱子从上往下生长
        inverse: true,
        // 提高最大值，让实际数据区整体更靠上，避免接近图例
        max: 120,
        axisLabel: {
          show: false
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '降雨量',
        type: 'bar',
        yAxisIndex: 1,
        barWidth: 14,
        data: drainageAnalysisData.map(item => item.rain),
        itemStyle: {
          color: 'rgba(190, 242, 100, 0.9)'
        }
      },
      {
        name: '流量',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        lineStyle: {
          color: '#ef4444',
          width: 2
        },
        symbol: 'circle',
        symbolSize: 4,
        data: drainageAnalysisData.map(item => item.flow)
      },
      {
        name: '流速',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 2
        },
        symbol: 'circle',
        symbolSize: 4,
        data: drainageAnalysisData.map(item => item.velocity)
      }
    ],
    // 再上移一些，给图例和时间轴留出更多空间
    grid: {
      top: 40,
      right: 10,
      left: 20,
      bottom: 80
    }
  });
};

// 初始化 ECharts 图表
onMounted(() => {
  initAttempts = 0;
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (retryTimer) {
    window.clearTimeout(retryTimer);
    retryTimer = null;
  }
  window.removeEventListener('resize', handleResize);
  healthChart?.dispose();
  warningChart?.dispose();
  drainageChart?.dispose();
});
</script>

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
      <div ref="healthChartRef" class="w-full h-full"></div>
    </DashboardCard>

    <DashboardCard title="监测告警分析" class="h-[180px]">
      <div ref="warningChartRef" class="w-full h-full"></div>
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
              <div ref="drainageChartRef" class="w-full h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  </div>
</template>
