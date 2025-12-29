<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="relative bg-[#0f172a] border border-cyan-400/50 rounded-sm shadow-[0_0_50px_rgba(0,229,255,0.3)] w-full max-w-md z-10 animate-in zoom-in-95 duration-300">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-white/10">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full" 
               :class="markerData?.type === 'rain' ? 'bg-blue-500' : 'bg-cyan-400'"></div>
          <h3 class="text-lg font-bold text-white">{{ markerData?.label }}</h3>
        </div>
        <button 
          @click="$emit('close')"
          class="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
        >
          <X :size="20" />
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <!-- Status Indicator -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-sm text-white/80">在线</span>
          </div>
          <div class="text-right">
            <div class="text-2xl font-orbitron font-bold" 
                 :class="markerData?.type === 'rain' ? 'text-blue-400' : 'text-cyan-400'">
              {{ markerData?.val }}
            </div>
            <div class="text-xs text-white/50">当前数值</div>
          </div>
        </div>
        
        <!-- Additional Info -->
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-white/10">
            <span class="text-sm text-white/70">设备状态</span>
            <span class="text-sm text-green-400 font-medium">正常运行</span>
          </div>
          
          <div class="flex justify-between items-center pb-2 border-b border-white/10">
            <span class="text-sm text-white/70">最后更新</span>
            <span class="text-sm text-white">2025-12-26 22:45:30</span>
          </div>
          
          <div class="flex justify-between items-center pb-2 border-b border-white/10">
            <span class="text-sm text-white/70">设备ID</span>
            <span class="text-sm text-white font-mono">SN-{{ markerData?.type === 'rain' ? 'RG' : 'LM' }}-{{ Math.floor(Math.random() * 10000) }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm text-white/70">信号强度</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-cyan-400 rounded-full" style="width: 85%"></div>
              </div>
              <span class="text-sm text-cyan-400">良好</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex space-x-3 mt-8">
          <button class="flex-1 py-2 px-4 bg-[#1e293b] hover:bg-[#334155] border border-white/20 rounded-sm text-sm text-white transition-colors">
            历史数据
          </button>
          <button class="flex-1 py-2 px-4 bg-cyan-600 hover:bg-cyan-500 rounded-sm text-sm text-white transition-colors flex items-center justify-center space-x-1">
            <Activity :size="14" />
            <span>实时曲线</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, Activity } from 'lucide-vue-next'

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

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
