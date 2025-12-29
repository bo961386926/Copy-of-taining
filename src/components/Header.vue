<template>
  <header class="h-12 w-full flex items-center justify-between px-6 bg-[#0f172a]/90 border-b border-cyan-400/40 backdrop-blur-xl z-50 relative">
    <!-- Left Side: Brand & Project Switcher -->
    <div class="flex items-center space-x-4 h-full relative z-50">
      <!-- Brand Logo -->
      <div class="flex items-center">
        <div class="text-2xl font-orbitron font-black text-cyan-400 tracking-tighter text-glow-cyan italic animate-[glow-pulse_2s_infinite]">DELION</div>
        <div class="h-6 w-[1px] bg-white/20 mx-3"></div>
        <h1 class="text-base font-black text-white tracking-[0.15em] drop-shadow-lg flex items-center whitespace-nowrap">
          <Terminal :size="16" class="mr-2 text-cyan-400" />
          泰宁集团
        </h1>
      </div>

      <!-- Project Switcher - Moved Here -->
      <div class="relative ml-4" ref="dropdownRef">
         <button 
           @click="toggleProjectDropdown"
           class="flex items-center space-x-2 px-3 py-1.5 rounded-sm border transition-all duration-300"
           :class="isProjectDropdownOpen 
             ? 'bg-[#1e293b] border-cyan-400/70 text-white' 
             : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-cyan-400/50 hover:text-cyan-100'"
         >
            <MapPin :size="14" class="text-cyan-400 shrink-0" />
            <span class="text-xs font-bold max-w-[200px] truncate">
              {{ currentProject ? currentProject.name : '选择项目' }}
            </span>
            <ChevronDown :size="12" class="transition-transform duration-300" :class="isProjectDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-white/50'" />
         </button>

         <!-- Dropdown Menu -->
         <Transition name="fade">
           <div v-if="isProjectDropdownOpen" class="absolute top-full left-0 mt-2 w-[320px] bg-[#0f172a]/95 border border-cyan-400/40 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
              <div class="p-2 border-b border-white/10 bg-cyan-900/20 flex justify-between items-center">
                 <p class="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">切换项目 / Switch Project</p>
              </div>
              <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
                <div 
                  v-for="proj in projects" 
                  :key="proj.id"
                  @click.stop="selectProject(proj)"
                  class="px-3 py-3 border-b border-white/5 cursor-pointer flex items-center justify-between group/item transition-all"
                  :class="currentProject?.id === proj.id ? 'bg-cyan-900/30' : 'hover:bg-white/5'"
                >
                   <div class="flex flex-col">
                     <span class="text-xs font-bold transition-colors line-clamp-1" :class="currentProject?.id === proj.id ? 'text-cyan-400' : 'text-white/80 group-hover/item:text-white'">
                       {{ proj.name }}
                     </span>
                     <span v-if="currentProject?.id === proj.id" class="text-[9px] text-cyan-500/70 font-mono mt-0.5">CURRENTLY ACTIVE</span>
                   </div>
                   <Check v-if="currentProject?.id === proj.id" :size="14" class="text-cyan-400 ml-2 shrink-0" />
                </div>
              </div>
           </div>
         </Transition>
      </div>
    </div>

    <!-- Central Title - Static Display Only -->
    <div class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
      <div 
        class="bg-gradient-to-b from-[#1e3a8a]/30 to-[#172554]/50 px-12 py-1 border-x border-b border-cyan-400/50 rounded-b-2xl shadow-[0_5px_20px_rgba(0,229,255,0.2)] flex items-center space-x-2"
      >
         <span class="text-lg font-black tracking-[0.4em] text-white text-glow-white uppercase italic whitespace-nowrap">
           建筑排水智慧管理与运维平台
         </span>
      </div>
    </div>

    <!-- Right Side: Time & Weather -->
    <div class="flex items-center space-x-6 z-50">
      <div class="text-right hidden md:block">
        <div class="font-orbitron text-white text-[11px] font-bold tracking-[0.05em] opacity-90">
          {{ formatDate(currentTime) }}
        </div>
      </div>
      
      <div class="flex items-center bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 rounded-full group hover:bg-cyan-400/20 transition-all">
         <Cloud :size="14" class="text-cyan-400 mr-2 animate-bounce" />
         <span class="font-orbitron text-xs font-black text-white">9°C</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted, watch } from 'vue'
import { Cloud, Terminal, ChevronDown, Check, MapPin } from 'lucide-vue-next'
import { Project } from '../types'

interface Props {
  projects?: Project[];
  currentProject?: Project;
}

interface Emits {
  (e: 'projectChange', project: Project): void;
}

const props = withDefaults(defineProps<Props>(), {
  projects: () => [],
  currentProject: undefined
});

const emit = defineEmits<Emits>();

const currentTime: Ref<Date> = ref(new Date());
const isProjectDropdownOpen: Ref<boolean> = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

let timer: number | null = null;

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
  
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
  document.removeEventListener("mousedown", handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isProjectDropdownOpen.value = false;
  }
};

const toggleProjectDropdown = () => {
  isProjectDropdownOpen.value = !isProjectDropdownOpen.value;
};

const selectProject = (project: Project) => {
  emit('projectChange', project);
  isProjectDropdownOpen.value = false;
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}年${m}月${d}日 ${day} ${h}:${min}:${s}`;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
