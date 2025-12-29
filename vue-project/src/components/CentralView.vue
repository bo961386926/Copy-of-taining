<template>
  <div class="flex-1 h-full relative overflow-hidden bg-[#0f172a] grid-bg perspective-1000">
    <!-- Background: Digital Twin / Schematic of Maintenance Depot -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
       <defs>
          <!-- Lighter Building Gradients -->
          <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stop-color="#334155" stop-opacity="0.9" />
             <stop offset="100%" stop-color="#1e293b" stop-opacity="0.9" />
          </linearGradient>
          <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stop-color="#1e293b" stop-opacity="0.9" />
             <stop offset="50%" stop-color="#1d4ed8" stop-opacity="0.5" />
             <stop offset="100%" stop-color="#1e293b" stop-opacity="0.9" />
          </linearGradient>
          <pattern id="gridPattern" width="40" height="20" patternUnits="userSpaceOnUse">
             <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(0, 229, 255, 0.1)" stroke-width="1"/>
          </pattern>
          <filter id="glow">
             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
       </defs>

       <!-- --- Ground Grid / Layout --- -->
       <g transform="translate(600, 400) scale(1.5)">
          <!-- Tracks entering from Right -->
          <path d="M 100 50 L 300 150 M 120 50 L 320 150 M 140 50 L 340 150" stroke="#60a5fa" stroke-width="1" opacity="0.4" />
          
          <!-- Road network -->
          <path d="M -200 100 L 200 300" stroke="#475569" stroke-width="20" stroke-linecap="round" opacity="0.3" />
       </g>

       <!-- --- 2# Depot (Back Right) --- -->
       <g transform="translate(700, 200)">
          <path d="M 0 50 L 150 0 L 300 50 L 150 100 Z" fill="url(#roofGradient)" stroke="#60a5fa" stroke-width="1" stroke-opacity="0.6" />
          <path d="M 0 50 L 0 120 L 150 170 L 150 100 Z" fill="url(#buildingGradient)" stroke="none" />
          <path d="M 150 170 L 300 120 L 300 50 L 150 100 Z" fill="#1e293b" opacity="0.8" />
       </g>

       <!-- --- 1# Depot (Main Left) --- -->
       <g transform="translate(300, 250)">
          <!-- Main Roof Surface -->
          <path d="M 0 80 L 250 0 L 550 80 L 300 160 Z" fill="url(#roofGradient)" stroke="#22d3ee" stroke-width="1.5" stroke-opacity="0.7" />
          <!-- Grid on Roof -->
          <path d="M 0 80 L 250 0 L 550 80 L 300 160 Z" fill="url(#gridPattern)" />
          
          <!-- Side Walls - Lighter Stroke -->
          <path d="M 0 80 L 0 200 L 300 280 L 300 160 Z" fill="url(#buildingGradient)" stroke="#475569" stroke-width="1" />
          <path d="M 300 280 L 550 200 L 550 80 L 300 160 Z" fill="#0f172a" opacity="0.8" stroke="#475569" stroke-width="1" />

          <!-- Roof Architectural Details (Skylights/Hoppers Lines) -->
          <!-- Parallel lines along the length -->
          <path d="M 50 64 L 350 144" stroke="#22d3ee" stroke-width="1" stroke-opacity="0.3" />
          <path d="M 100 48 L 400 128" stroke="#22d3ee" stroke-width="1" stroke-opacity="0.3" />
          <path d="M 150 32 L 450 112" stroke="#22d3ee" stroke-width="1" stroke-opacity="0.3" />
          <path d="M 200 16 L 500 96" stroke="#22d3ee" stroke-width="1" stroke-opacity="0.3" />
          
          <!-- Section Dividers -->
          <path d="M 83 53 L 83 170" stroke="#22d3ee" stroke-dasharray="4 4" stroke-width="0.5" stroke-opacity="0.4" />
          <path d="M 166 26 L 166 140" stroke="#22d3ee" stroke-dasharray="4 4" stroke-width="0.5" stroke-opacity="0.4" />
          
          <!-- Highlight Glow Lines -->
          <path d="M 0 80 L 300 160 L 550 80" stroke="#22d3ee" stroke-width="1.5" filter="url(#glow)" opacity="0.6" />
       </g>

       <!-- --- Pump House (Front Left) --- -->
       <g transform="translate(200, 500)">
          <path d="M 0 30 L 60 10 L 120 30 L 60 50 Z" fill="#334155" stroke="#22d3ee" stroke-width="1" />
          <path d="M 0 30 L 0 70 L 60 90 L 60 50 Z" fill="#1e293b" stroke="#334155" />
          <path d="M 60 90 L 120 70 L 120 30 L 60 50 Z" fill="#0f172a" stroke="#334155" />
       </g>

       <!-- --- Connection Lines (Pipes under ground) --- -->
       <path d="M 450 480 Q 550 520 650 480" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.5" class="animate-pulse" />

    </svg>

    <!-- Central Title HUD - Lightened Background -->
    <div class="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl text-center pointer-events-none">
      <div class="inline-block relative px-8 py-3 bg-[#0f172a]/80 backdrop-blur-md border-x border-cyan-400/40 rounded-sm">
          <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400"></div>
          <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400"></div>
          <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400"></div>
          <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400"></div>
          
          <p class="text-[14px] md:text-[16px] text-white font-black tracking-[0.1em] mb-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] transition-all duration-300">
            {{ currentProject ? currentProject.name : '北京轨道交通13号线扩能提升工程小辛庄停车场' }}
          </p>
          <div class="flex items-center justify-center space-x-2">
             <Layers :size="12" class="text-cyan-400" />
             <p class="text-[10px] md:text-[11px] text-cyan-400 font-bold tracking-[0.2em] uppercase">
               虹吸式屋面雨水监测运维系统
             </p>
          </div>
      </div>
    </div>

    <!-- Interactive Markers - Adjusted colors for lighter theme -->
    <div v-for="(marker, i) in markers" :key="i" class="absolute z-30 transform -translate-x-1/2 -translate-y-1/2" :style="{ top: marker.top, left: marker.left }">
      <div 
        class="relative flex flex-col items-center group cursor-pointer" 
        @mouseenter="setActiveHoverMarker(i)" 
        @mouseleave="setActiveHoverMarker(null)"
        @click="setSelectedMarker(i)"
      >
        <!-- Marker Pin -->
        <div class="relative">
           <div class="w-3 h-3 rounded-full border-2 border-white shadow-[0_0_10px_currentColor] transition-all duration-300" 
                :class="[isRainGauge(marker) ? 'bg-blue-500 text-blue-500' : 'bg-cyan-400 text-cyan-400', activeHoverMarker === i ? 'scale-125' : 'scale-100']">
           </div>
           <!-- Ripple Effect -->
           <div class="absolute inset-0 rounded-full border border-current animate-ping opacity-75" 
                :class="isRainGauge(marker) ? 'text-blue-500' : 'text-cyan-400'"></div>
           <!-- Connecting Line to Label -->
           <div class="absolute left-1/2 bottom-full w-[1px] h-6 bg-current opacity-60 transition-all duration-300" 
                :class="[isRainGauge(marker) ? 'text-blue-500' : 'text-cyan-400', activeHoverMarker === i ? 'h-10' : 'h-4']"></div>
        </div>

        <!-- Label Card -->
        <div class="absolute bottom-full mb-4 transition-all duration-300" 
             :class="activeHoverMarker === i ? 'mb-10 scale-110 z-50' : 'mb-4 scale-100'">
           <div class="px-3 py-1.5 bg-[#0f172a]/90 backdrop-blur-md border border-white/30 rounded-sm shadow-xl flex flex-col items-center"
                :class="activeHoverMarker === i ? [isRainGauge(marker) ? 'border-blue-400 bg-[#1e3a8a]/90' : 'border-cyan-400 bg-[#164e63]/90'] : ''">
              <span class="text-[10px] font-black text-white whitespace-nowrap">{{ marker.label }}</span>
              <div v-if="activeHoverMarker === i" class="mt-1 flex items-center space-x-1 border-t border-white/20 pt-1 w-full justify-center">
                 <span class="text-[9px] font-mono" :class="isRainGauge(marker) ? 'text-blue-200' : 'text-cyan-200'">{{ marker.val }}</span>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Bottom Status Bar Legend -->
    <div class="absolute bottom-4 left-6 z-20 flex space-x-6 px-6 py-2 bg-[#0f172a]/90 backdrop-blur border border-white/20 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div v-for="(item, i) in legendItems" :key="i" class="flex items-center space-x-2 group cursor-default">
        <div class="w-2 h-2 rounded-full animate-pulse" :class="item.bg"></div>
        <span class="text-[9px] text-white/90 font-bold tracking-wider">{{ item.label }}</span>
        <span class="text-[8px] font-orbitron opacity-70" :class="item.color">{{ item.val }}</span>
      </div>
    </div>

    <!-- Enter System Button -->
    <div class="absolute bottom-6 right-6 z-40">
      <button 
        @click="$emit('enterSystem')"
        class="flex items-center space-x-2 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 text-white px-6 py-2 rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] group backdrop-blur-md"
      >
        <LogIn :size="16" class="text-cyan-200 group-hover:text-white transition-colors" />
        <span class="text-xs font-black tracking-widest">进入监测系统</span>
      </button>
    </div>

    <!-- Detail Modal -->
    <DetailModal 
      :is-open="selectedMarker !== null" 
      @close="setSelectedMarker(null)"
      :marker-data="selectedMarker !== null ? markers[selectedMarker] : null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import DetailModal from './DetailModal.vue'
import { LogIn, Layers } from 'lucide-vue-next'
import { Project } from '../types'

interface Marker {
  top: string;
  left: string;
  label: string;
  val: string;
  status: string;
  type: string;
}

interface Props {
  currentProject?: Project;
}

interface Emits {
  (e: 'enterSystem'): void;
}

defineProps<Props>();
defineEmits<Emits>();

const activeHoverMarker: Ref<number | null> = ref(null);
const selectedMarker: Ref<number | null> = ref(null);

// Updated markers: 4 Level Monitors + 1 Rain Gauge
const markers: Marker[] = [
  // Rain Gauge - Placed on the high roof of 1# Depot
  { 
    top: '30%', 
    left: '40%', 
    label: '雨量筒', 
    val: '0.0mm', 
    status: 'online', 
    type: 'rain' 
  },
  // Level Monitor 1 - 1# Depot Gutter
  { 
    top: '45%', 
    left: '35%', 
    label: '1# 库天沟液位', 
    val: '2.5cm', 
    status: 'online',
    type: 'level' 
  },
  // Level Monitor 2 - 2# Depot Gutter
  { 
    top: '28%', 
    left: '62%', 
    label: '2# 库天沟液位', 
    val: '1.8cm', 
    status: 'online',
    type: 'level' 
  },
  // Level Monitor 3 - Retention Pond
  { 
    top: '55%', 
    left: '52%', 
    label: '调蓄池液位', 
    val: '3.2m', 
    status: 'online',
    type: 'level' 
  },
  // Level Monitor 4 - Pump House
  { 
    top: '60%', 
    left: '20%', 
    label: '雨水泵房液位', 
    val: '1.5m', 
    status: 'online', // Changed from warning to online for consistency unless specified
    type: 'level' 
  },
];

const legendItems = [
  { label: '液位监测', val: 'LEVEL_MON', color: 'text-cyan-400', bg: 'bg-cyan-400' },
  { label: '雨量筒', val: 'RAIN_GAUGE', color: 'text-blue-400', bg: 'bg-blue-400' },
];

const setActiveHoverMarker = (index: number | null) => {
  activeHoverMarker.value = index;
};

const setSelectedMarker = (index: number | null) => {
  selectedMarker.value = index;
};

const isRainGauge = (marker: Marker) => {
  return marker.type === 'rain';
};
</script>
