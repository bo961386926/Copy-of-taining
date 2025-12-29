<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-[#0f172a] border border-cyan-400/50 rounded-sm shadow-[0_0_50px_rgba(0,229,255,0.3)] w-full max-w-6xl max-h-[90vh] z-10 animate-in zoom-in-95 duration-300 flex flex-col mx-auto my-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-white/10">
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full" 
               :class="markerData?.type === 'rain' ? 'bg-blue-500' : 'bg-cyan-400'"></div>
          <h3 class="text-lg font-bold text-white">{{ markerData?.label }}</h3>
          <div class="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
            <span class="text-xs font-bold text-green-400">运行正常</span>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
        >
          <X :size="20" />
        </button>
      </div>
      
      <!-- Tabs -->
      <div class="flex items-center border-b border-white/10 px-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-3 text-sm font-medium transition-all duration-300 relative"
          :class="activeTab === tab.id 
            ? 'text-cyan-400 border-b-2 border-cyan-400' 
            : 'text-white/60 hover:text-white/90'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden min-h-0">
        <!-- 实时监测 Tab -->
        <div v-if="activeTab === 'monitoring'" class="h-full flex flex-col p-4">
          <!-- Time Selector -->
          <div class="flex justify-end mb-3 shrink-0">
            <div class="relative">
              <select 
                v-model="selectedTimeRange"
                class="bg-[#1e293b] border border-cyan-400/30 rounded-sm px-4 py-2 pr-10 text-sm text-white focus:border-cyan-400 outline-none appearance-none cursor-pointer hover:border-cyan-400 transition-colors"
              >
                <option value="24h">近24小时</option>
                <option value="7d">近7天</option>
                <option value="30d">近30天</option>
                <option value="year">今年</option>
              </select>
              <Calendar :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
            </div>
          </div>

          <!-- Chart -->
          <div class="flex-1 min-h-0 mb-3">
            <div ref="monitoringChartRef" class="w-full h-full"></div>
          </div>

          <!-- Legend and Toggles -->
          <div class="space-y-2 flex flex-col items-center shrink-0">
            <!-- Legend -->
            <div class="flex items-center justify-center space-x-6 text-sm">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-cyan-400"></div>
                <span class="text-white/80">天沟液位</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500"></div>
                <span class="text-white/80">排水流量</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-yellow-500"></div>
                <span class="text-white/80">运行负压</span>
              </div>
            </div>

            <!-- Toggles -->
            <div class="flex items-center justify-center space-x-4">
              <label class="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  v-model="chartSeriesVisibility.level"
                  class="w-4 h-4 rounded border-2 border-cyan-400 text-cyan-400 focus:ring-cyan-400 bg-transparent checked:bg-cyan-400 checked:border-cyan-400 transition-all"
                />
                <span class="text-sm text-white/80 group-hover:text-white transition-colors">天沟液位</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  v-model="chartSeriesVisibility.pressure"
                  class="w-4 h-4 rounded border-2 border-yellow-500 text-yellow-500 focus:ring-yellow-500 bg-transparent checked:bg-yellow-500 checked:border-yellow-500 transition-all"
                />
                <span class="text-sm text-white/80 group-hover:text-white transition-colors">运行负压</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  v-model="chartSeriesVisibility.flow"
                  class="w-4 h-4 rounded border-2 border-blue-500 text-blue-500 focus:ring-blue-500 bg-transparent checked:bg-blue-500 checked:border-blue-500 transition-all"
                />
                <span class="text-sm text-white/80 group-hover:text-white transition-colors">排水流量</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- 监控视频 Tab -->
        <div v-if="activeTab === 'video'" class="h-full p-4 overflow-y-auto">
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="(video, index) in videoFeeds" 
              :key="index"
              class="relative bg-black rounded-sm border border-cyan-400/30 overflow-hidden group cursor-pointer hover:border-cyan-400 transition-all"
            >
              <!-- Video Placeholder -->
              <div class="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative">
                <!-- Grid Pattern -->
                <div class="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 opacity-10">
                  <div v-for="i in 48" :key="i" class="border border-cyan-400/20"></div>
                </div>
                <div class="relative z-10">
                  <div class="w-16 h-16 rounded-full border-2 border-cyan-400/30 flex items-center justify-center mb-2">
                    <Video :size="32" class="text-white/30" />
                  </div>
                  <div class="text-center">
                    <div class="text-cyan-400/50 font-mono text-xs">CAM_{{ String(index + 1).padStart(3, '0') }}</div>
                  </div>
                </div>
          </div>
          
              <!-- Video Info -->
              <div class="absolute top-2 left-2 right-2 flex items-center justify-between z-20">
                <span class="text-xs font-bold text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded border border-white/10">{{ video.title }}</span>
                <div class="flex items-center space-x-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
                  <div class="w-2 h-2 rounded-full" :class="video.status === 'LIVE' ? 'bg-green-500 animate-pulse shadow-[0_0_4px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.8)]'"></div>
                  <span class="text-[10px] font-mono font-bold text-white">{{ video.status }}</span>
          </div>
          </div>
          
              <!-- Timestamp -->
              <div class="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded border border-white/10 z-20">
                <span class="text-[10px] font-mono text-white/90">{{ video.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 图像抓拍 Tab -->
        <div v-if="activeTab === 'images'" class="h-full flex flex-col p-4">
          <!-- Time Filter -->
          <div class="flex justify-end mb-4">
            <div class="relative">
              <button
                @click.stop="showTimeFilter = !showTimeFilter"
                class="bg-[#1e293b] border border-cyan-400/30 rounded-sm px-4 py-2 pr-10 text-sm text-white hover:border-cyan-400 transition-colors flex items-center space-x-2 relative"
              >
                <Calendar :size="16" class="text-cyan-400" />
                <span>{{ selectedImageTimeRange }}</span>
                <ChevronUp :size="16" class="absolute right-3 text-cyan-400 transition-transform" :class="showTimeFilter ? 'rotate-180' : ''" />
              </button>

              <!-- Dropdown -->
              <div 
                v-if="showTimeFilter"
                @click.stop
                class="absolute right-0 top-full mt-2 w-64 bg-[#1e293b] border border-cyan-400/30 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-20 backdrop-blur-md"
              >
                <div class="p-2 space-y-1">
                  <button
                    v-for="range in timeRanges"
                    :key="range.value"
                    @click="selectImageTimeRange(range.value, range.label)"
                    class="w-full text-left px-3 py-2 text-sm rounded-sm transition-colors"
                    :class="selectedImageTimeRange === range.label 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-white/80 hover:bg-white/10'"
                  >
                    {{ range.label }}
                  </button>
                </div>
                  <div class="border-t border-white/10 p-2 mt-2">
                  <div class="text-xs text-white/60 mb-2 px-2 font-medium">自定义时间段</div>
                  <div class="flex items-center space-x-2 mb-3">
                    <input 
                      type="date" 
                      v-model="customStartDate"
                      class="flex-1 bg-[#0f172a] border border-white/20 rounded-sm px-2 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                    <span class="text-white/60 text-xs">至</span>
                    <input 
                      type="date" 
                      v-model="customEndDate"
                      class="flex-1 bg-[#0f172a] border border-white/20 rounded-sm px-2 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <button
                    @click="confirmCustomDate"
                    class="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs py-2 rounded-sm transition-colors font-medium shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                  >
                    确认
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Image Grid -->
          <div class="flex-1 overflow-y-auto custom-scrollbar">
            <div class="grid grid-cols-4 gap-4">
              <div
                v-for="(image, index) in displayedImages"
                :key="index"
                class="relative bg-black rounded-sm border border-cyan-400/30 overflow-hidden group cursor-pointer hover:border-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                <!-- Image Placeholder -->
                <div class="aspect-square bg-gradient-to-br relative" :class="image.gradient || 'from-gray-900 to-gray-800'">
                  <!-- Grid Pattern Overlay -->
                  <div class="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-0.5 opacity-10">
                    <div v-for="i in 36" :key="i" class="border border-white/10"></div>
                  </div>
                  <div class="w-full h-full flex items-center justify-center relative z-10">
                    <Camera :size="32" class="text-white/30 group-hover:text-white/50 transition-colors" />
                  </div>
                </div>

                <!-- Abnormal Tag -->
                <div 
                  v-if="image.abnormal"
                  class="absolute top-2 right-2 bg-red-500 px-2 py-0.5 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.6)] z-20"
                >
                  <span class="text-[10px] font-bold text-white">异常</span>
                </div>

                <!-- Image Info -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent p-2 z-20">
                  <div class="flex items-center space-x-1 mb-1">
                    <Clock :size="11" class="text-white/50" />
                    <span class="text-[10px] text-white/90 font-medium">监测点 {{ image.point }}</span>
                  </div>
                  <div class="text-[10px] font-mono text-white/70 mb-0.5">{{ image.time }}</div>
                  <div class="text-[10px] text-white/60">{{ image.date }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center space-x-2 mt-4">
            <button
              @click="currentPage > 1 && currentPage--"
              class="p-2 rounded-sm border border-white/20 hover:border-cyan-400 text-white/60 hover:text-cyan-400 transition-colors"
              :disabled="currentPage === 1"
            >
              <ChevronLeft :size="16" />
          </button>
            <div class="flex items-center space-x-1">
              <div
                v-for="page in totalPages"
                :key="page"
                class="w-2 h-2 rounded-full transition-colors"
                :class="page === currentPage ? 'bg-cyan-400' : 'bg-white/30'"
              ></div>
            </div>
            <button
              @click="currentPage < totalPages && currentPage++"
              class="p-2 rounded-sm border border-white/20 hover:border-cyan-400 text-white/60 hover:text-cyan-400 transition-colors"
              :disabled="currentPage === totalPages"
            >
              <ChevronRight :size="16" />
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { X, Calendar, Video, Camera, Clock, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-vue-next'
import * as echarts from 'echarts'

interface Marker {
  top: string;
  left: string;
  label: string;
  val: string;
  status: string;
  type: string;
}

interface Props {
  isOpen: boolean;
  markerData: Marker | null;
}

interface Emits {
  (e: 'close'): void;
}

interface VideoFeed {
  title: string;
  status: 'LIVE' | 'REC';
  timestamp: string;
}

interface CapturedImage {
  point: number;
  time: string;
  date: string;
  abnormal?: boolean;
  gradient?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const activeTab: Ref<'monitoring' | 'video' | 'images'> = ref('monitoring');
const selectedTimeRange = ref('24h');
const showTimeFilter = ref(false);
const selectedImageTimeRange = ref('近24小时');
const customStartDate = ref('2025-01-01');
const customEndDate = ref('2025-12-31');
const currentPage = ref(1);
const itemsPerPage = 8;

const tabs = [
  { id: 'monitoring', label: '实时监测' },
  { id: 'video', label: '监控视频' },
  { id: 'images', label: '图像抓拍' }
];

const chartSeriesVisibility = ref({
  level: true,
  pressure: true,
  flow: true
});

// 生成模拟监测数据
const generateMonitoringData = (timeRange: string) => {
  if (timeRange === '24h') {
    // 24小时数据 - 每3小时一个数据点（8个点）
    return {
      times: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
      level: [0.5, 0.8, 1.2, 3.5, 7.5, 4.2, 2.5, 1.5], // 天沟液位 (cm) - 峰值7.5
      flow: [120, 180, 350, 950, 1300, 1120, 680, 320], // 排水流量 (m³/h) - 峰值1300
      pressure: [50, 80, 150, 380, 450, 410, 250, 120] // 运行负压 (mbar) - 峰值450
    };
  } else if (timeRange === '7d') {
    // 7天数据 - 每天一个数据点
    const times: string[] = [];
    const level: number[] = [];
    const flow: number[] = [];
    const pressure: number[] = [];
    
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    for (let i = 0; i < 7; i++) {
      times.push(days[i]);
      
      // 模拟一周的波动
      const dayFactor = (i + 1) / 7;
      const baseValue = 0.3 + Math.sin(dayFactor * Math.PI * 2) * 0.3;
      
      const noise = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      level.push(Math.max(0.5, baseValue * 6 + (noise(i * 0.3) - 0.5) * 1.5));
      flow.push(Math.max(200, baseValue * 1000 + (noise(i * 0.4) - 0.5) * 200));
      pressure.push(Math.max(50, baseValue * 400 + (noise(i * 0.5) - 0.5) * 50));
    }
    
    return { times, level, flow, pressure };
  } else if (timeRange === '30d') {
    // 30天数据 - 每3天一个数据点
    const times: string[] = [];
    const level: number[] = [];
    const flow: number[] = [];
    const pressure: number[] = [];
    
    for (let i = 0; i < 10; i++) {
      const day = i * 3 + 1;
      times.push(`${day}日`);
      
      // 模拟月度趋势
      const monthFactor = i / 10;
      const trend = 0.4 + Math.sin(monthFactor * Math.PI) * 0.3;
      
      const noise = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      level.push(Math.max(0.5, trend * 7 + (noise(i * 0.6) - 0.5) * 1.2));
      flow.push(Math.max(150, trend * 1200 + (noise(i * 0.7) - 0.5) * 150));
      pressure.push(Math.max(40, trend * 450 + (noise(i * 0.8) - 0.5) * 40));
    }
    
    return { times, level, flow, pressure };
  } else {
    // 今年数据 - 每月一个数据点
    const times: string[] = [];
    const level: number[] = [];
    const flow: number[] = [];
    const pressure: number[] = [];
    
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    for (let i = 0; i < 12; i++) {
      times.push(months[i]);
      
      // 模拟季节性变化：夏季（6-8月）降雨多，冬季少
      const monthFactor = (i + 1) / 12;
      const seasonalFactor = Math.max(0.3, Math.sin((monthFactor - 0.25) * Math.PI * 2) * 0.4 + 0.6);
      
      const noise = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
      };
      
      level.push(Math.max(0.5, seasonalFactor * 6.5 + (noise(i * 0.9) - 0.5) * 1));
      flow.push(Math.max(200, seasonalFactor * 1100 + (noise(i * 1.0) - 0.5) * 100));
      pressure.push(Math.max(50, seasonalFactor * 420 + (noise(i * 1.1) - 0.5) * 30));
    }
    
    return { times, level, flow, pressure };
  }
};

// 响应式监测数据
const monitoringData = computed(() => generateMonitoringData(selectedTimeRange.value));

const videoFeeds: VideoFeed[] = [
  { title: '1# 运用库-东北角', status: 'LIVE', timestamp: '2025-12-26 20:49:15' },
  { title: '1# 运用库-西南角', status: 'LIVE', timestamp: '2025-12-26 20:49:15' },
  { title: '屋面排水-东区', status: 'REC', timestamp: '2025-12-26 20:49:15' },
  { title: '屋面排水-西区', status: 'LIVE', timestamp: '2025-12-26 20:49:15' }
];

// 生成图像数据
const generateImages = (): CapturedImage[] => {
  const images: CapturedImage[] = [];
  const gradients = [
    'from-[#1e293b] via-[#334155] to-[#1e293b]',
    'from-[#064e3b] via-[#065f46] to-[#064e3b]',
    'from-[#312e81] via-[#4338ca] to-[#312e81]',
    'from-[#701a75] via-[#86198f] to-[#701a75]'
  ];
  
  const times = ['20:49', '20:19', '19:49', '19:19', '18:49', '18:19', '17:49', '17:19'];
  
  for (let i = 0; i < 32; i++) {
    const point = (i % 4) + 1;
    const timeIndex = i % times.length;
    images.push({
      point,
      time: times[timeIndex],
      date: '2025-12-26',
      abnormal: (i === 0 || i === 5), // 标记第一个和第六个为异常
      gradient: gradients[point - 1]
    });
  }
  
  return images;
};

const allImages = generateImages();
const totalPages = computed(() => Math.ceil(allImages.length / itemsPerPage));
const displayedImages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return allImages.slice(start, start + itemsPerPage);
});

const timeRanges = [
  { value: '24h', label: '近24小时' },
  { value: '7d', label: '近7天' },
  { value: '30d', label: '近30天' },
  { value: 'year', label: '今年' }
];

const selectImageTimeRange = (value: string, label: string) => {
  selectedImageTimeRange.value = label;
  showTimeFilter.value = false;
  currentPage.value = 1;
};

const confirmCustomDate = () => {
  selectedImageTimeRange.value = `${customStartDate.value} 至 ${customEndDate.value}`;
  showTimeFilter.value = false;
  currentPage.value = 1;
};

// ECharts
const monitoringChartRef: Ref<HTMLElement | null> = ref(null);
let monitoringChart: echarts.ECharts | null = null;

const initChart = async () => {
  await nextTick();
  if (!monitoringChartRef.value) return;

  if (monitoringChart) {
    monitoringChart.dispose();
  }

  monitoringChart = echarts.init(monitoringChartRef.value);

  const updateChart = () => {
    if (!monitoringChart) return;

    const series: any[] = [];

    if (chartSeriesVisibility.value.level) {
      series.push({
        name: '天沟液位',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#22d3ee', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34, 211, 238, 0.4)' },
            { offset: 1, color: 'rgba(34, 211, 238, 0)' }
          ])
        },
        data: monitoringData.value.level
      });
    }

    if (chartSeriesVisibility.value.flow) {
      series.push({
        name: '排水流量',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#3b82f6', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        },
        data: monitoringData.value.flow
      });
    }

    if (chartSeriesVisibility.value.pressure) {
      series.push({
        name: '运行负压',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#fbbf24', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(251, 191, 36, 0.4)' },
            { offset: 1, color: 'rgba(251, 191, 36, 0)' }
          ])
        },
        data: monitoringData.value.pressure
      });
    }

    // 根据时间范围调整Y轴配置
    const is24h = selectedTimeRange.value === '24h';
    const maxFlow = monitoringData.value.flow.length > 0 ? Math.max(...monitoringData.value.flow) * 1.1 : 1400;
    const maxLevel = monitoringData.value.level.length > 0 ? Math.max(...monitoringData.value.level) * 1.1 : 8;
    const maxPressure = monitoringData.value.pressure.length > 0 ? Math.max(...monitoringData.value.pressure) * 1.1 : 500;

    monitoringChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { 
          type: 'cross',
          crossStyle: { color: '#00e5ff' }
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#00e5ff',
        borderWidth: 1,
        textStyle: { color: '#fff', fontSize: 12 },
        padding: [8, 12]
      },
      grid: {
        left: 70,
        right: 70,
        top: 50,
        bottom: 60,
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: monitoringData.value.times,
        axisLabel: { 
          color: '#94a3b8', 
          fontSize: 11,
          margin: 8
        },
        axisLine: { 
          lineStyle: { color: 'rgba(148, 163, 184, 0.4)', width: 1 } 
        },
        axisTick: { show: false },
        boundaryGap: false
      },
      yAxis: [
        {
          type: 'value',
          name: '流量(m³/h) / 负压(mbar)',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold' },
          axisLabel: { 
            color: '#fbbf24', 
            fontSize: 10
          },
          min: 0,
          max: is24h ? 1400 : Math.ceil(maxFlow / 100) * 100,
          interval: is24h ? 350 : Math.ceil(maxFlow / 400),
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false }
        },
        {
          type: 'value',
          name: '液位(cm)',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: { color: '#22d3ee', fontSize: 11, fontWeight: 'bold' },
          axisLabel: { 
            color: '#22d3ee', 
            fontSize: 10
          },
          min: 0,
          max: is24h ? 8 : Math.ceil(maxLevel / 1) * 1,
          interval: is24h ? 2 : Math.ceil(maxLevel / 4),
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false }
        }
      ],
      series
    });
  };

  updateChart();

  // Watch for visibility changes
  watch(chartSeriesVisibility, () => {
    updateChart();
  }, { deep: true });
};

const handleResize = () => {
  monitoringChart?.resize();
};

// Watch for time range changes
watch(selectedTimeRange, () => {
  if (monitoringChart && activeTab.value === 'monitoring') {
    const updateChart = () => {
      if (!monitoringChart) return;

      const series: any[] = [];

      if (chartSeriesVisibility.value.level) {
        series.push({
          name: '天沟液位',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#22d3ee', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(34, 211, 238, 0.4)' },
              { offset: 1, color: 'rgba(34, 211, 238, 0)' }
            ])
          },
          data: monitoringData.value.level
        });
      }

      if (chartSeriesVisibility.value.flow) {
        series.push({
          name: '排水流量',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#3b82f6', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ])
          },
          data: monitoringData.value.flow
        });
      }

      if (chartSeriesVisibility.value.pressure) {
        series.push({
          name: '运行负压',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#fbbf24', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(251, 191, 36, 0.4)' },
              { offset: 1, color: 'rgba(251, 191, 36, 0)' }
            ])
          },
          data: monitoringData.value.pressure
        });
      }

      const is24h = selectedTimeRange.value === '24h';
      const maxFlow = monitoringData.value.flow.length > 0 ? Math.max(...monitoringData.value.flow) * 1.1 : 1400;
      const maxLevel = monitoringData.value.level.length > 0 ? Math.max(...monitoringData.value.level) * 1.1 : 8;

      monitoringChart.setOption({
        xAxis: {
          data: monitoringData.value.times
        },
        yAxis: [
          {
            max: is24h ? 1400 : Math.ceil(maxFlow / 100) * 100,
            interval: is24h ? 350 : Math.ceil(maxFlow / 400)
          },
          {
            max: is24h ? 8 : Math.ceil(maxLevel / 1) * 1,
            interval: is24h ? 2 : Math.ceil(maxLevel / 4)
          }
        ],
        series
      });
    };
    updateChart();
  }
});

watch(() => props.isOpen, (newVal) => {
  if (newVal && activeTab.value === 'monitoring') {
    nextTick(() => {
      setTimeout(() => {
        initChart();
        window.addEventListener('resize', handleResize);
      }, 100);
    });
  } else {
    window.removeEventListener('resize', handleResize);
  }
});

watch(activeTab, (newTab) => {
  if (newTab === 'monitoring') {
    nextTick(() => {
      setTimeout(() => {
        initChart();
        window.addEventListener('resize', handleResize);
      }, 100);
    });
  } else {
    window.removeEventListener('resize', handleResize);
  }
});

onMounted(() => {
  if (props.isOpen && activeTab.value === 'monitoring') {
    initChart();
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  monitoringChart?.dispose();
});

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (showTimeFilter.value && !target.closest('.relative')) {
    showTimeFilter.value = false;
  }
};

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    showTimeFilter.value = false;
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 229, 255, 0.5);
  border-radius: 3px;
  transition: background 0.3s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 229, 255, 0.7);
  box-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
}
</style>
