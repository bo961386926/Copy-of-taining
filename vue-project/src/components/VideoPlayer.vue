<template>
  <div class="relative w-full h-full bg-black rounded-sm overflow-hidden">
    <!-- Video Container -->
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- Mock Video Background -->
      <div class="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <!-- Simulated Video Feed -->
        <div class="relative w-full h-full flex items-center justify-center">
          <!-- Scanlines Effect -->
          <div class="absolute inset-0 bg-repeat-y bg-contain opacity-10" 
               style="background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 100% 3px;"></div>
          
          <!-- Video Overlay Grid -->
          <div class="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-2 opacity-20">
            <div v-for="(_, i) in Array.from({length: 48})" :key="i" class="border border-cyan-400/20"></div>
          </div>
          
          <!-- Camera Icon -->
          <div class="relative z-10">
            <div class="w-16 h-16 rounded-full border-2 border-cyan-400/50 flex items-center justify-center mb-4">
              <Video :size="32" class="text-cyan-400" />
            </div>
            <div class="text-center">
              <div class="text-cyan-400 font-mono text-sm">CAM_001</div>
              <div class="text-white/50 text-xs mt-1">TN-P001</div>
            </div>
          </div>
          
          <!-- Status Indicator -->
          <div class="absolute top-2 right-2 flex items-center">
            <div class="w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse"></div>
            <span class="text-[10px] text-white/70 font-mono">REC</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Video Controls -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 transition-opacity duration-300"
         :class="showControls ? 'opacity-100' : 'opacity-0'">
      <div class="flex items-center justify-between">
        <!-- Left Controls -->
        <div class="flex items-center space-x-2">
          <button 
            @click="$emit('toggle-play', !isVideoPlaying)"
            class="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
          >
            <component :is="isVideoPlaying ? Pause : Play" :size="16" />
          </button>
          
          <button 
            @click="$emit('toggle-muted', !isMuted)"
            class="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
          >
            <component :is="isMuted ? VolumeX : Volume2" :size="16" />
          </button>
          
          <div class="text-[10px] text-white/70 font-mono">00:15:32</div>
        </div>
        
        <!-- Progress Bar -->
        <div class="flex-1 mx-4">
          <div class="h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-cyan-400 w-1/3"></div>
          </div>
        </div>
        
        <!-- Right Controls -->
        <div class="flex items-center space-x-2">
          <button 
            @click="$emit('toggle-mic', !isMicOn)"
            class="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
          >
            <component :is="isMicOn ? Mic : MicOff" :size="16" />
          </button>
          
          <button 
            v-if="!isFull"
            @click="$emit('toggle-fullscreen', true)"
            class="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
          >
            <Maximize :size="16" />
          </button>
          
          <button 
            v-else
            @click="$emit('toggle-fullscreen', false)"
            class="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
          >
            <Minimize :size="16" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Click area to show controls -->
    <div 
      class="absolute inset-0"
      @mouseenter="showControls = true"
      @mouseleave="showControls = false"
      @mousemove="handleMouseMove"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Video, Mic, MicOff 
} from 'lucide-vue-next'

interface Props {
  isFull: boolean;
  isVideoPlaying: boolean;
  videoFullscreen: boolean;
  isMuted: boolean;
  isMicOn: boolean;
}

interface Emits {
  (e: 'toggle-play', play: boolean): void;
  (e: 'toggle-fullscreen', fullscreen: boolean): void;
  (e: 'toggle-muted', muted: boolean): void;
  (e: 'toggle-mic', mic: boolean): void;
}

defineProps<Props>();
defineEmits<Emits>();

const showControls: Ref<boolean> = ref(false);
let mouseMoveTimer: number | null = null;

const handleMouseMove = () => {
  showControls.value = true;
  if (mouseMoveTimer) {
    clearTimeout(mouseMoveTimer);
  }
  mouseMoveTimer = window.setTimeout(() => {
    showControls.value = false;
  }, 3000);
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
