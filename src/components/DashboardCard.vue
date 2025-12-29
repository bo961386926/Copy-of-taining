<template>
  <div class="relative flex flex-col bg-[#1e293b]/50 border border-blue-400/40 rounded-sm backdrop-blur-md shadow-2xl card-breathing" :class="className">
    <!-- Decorative Corners -->
    <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 z-10"></div>
    <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 z-10"></div>
    
    <!-- Header Area -->
    <div class="h-8 flex items-center px-3 bg-gradient-to-r from-blue-600/30 via-blue-800/10 to-transparent border-b border-white/10 relative overflow-hidden">
      <div class="w-1 h-3 bg-cyan-400 mr-2 shadow-[0_0_8px_#00e5ff]"></div>
      <h2 class="text-[11px] font-black text-white tracking-[0.2em] uppercase italic drop-shadow-sm">
        {{ title }}
      </h2>
      <div class="ml-auto flex items-center space-x-1.5">
         <div class="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_4px_#00e5ff]"></div>
         <div class="text-[9px] font-bold text-cyan-400 font-orbitron tracking-tighter">LIVE_SENS</div>
      </div>
      <div class="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400/20 animate-[scan-move_8s_infinite_linear]"></div>
    </div>
    
    <!-- Content Area -->
    <div class="flex-1 p-2 overflow-hidden scan-light">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  className: ""
});
</script>
