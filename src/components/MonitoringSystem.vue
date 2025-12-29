<template>
  <div class="flex w-full h-full p-2 space-x-2 bg-[#0f172a] z-40 relative animate-in fade-in duration-300">

    <!-- LEFT SIDEBAR - Location List -->
    <!-- Lightened bg from blue-900/10 to #1e293b/50 -->
    <div class="w-[240px] flex flex-col bg-[#1e293b]/50 border border-blue-400/30 rounded-sm transition-all duration-300 overflow-hidden">
      <!-- Title -->
      <div class="h-10 flex items-center px-4 border-b border-blue-400/20 bg-gradient-to-r from-blue-600/20 to-transparent">
        <div class="w-1 h-3 bg-cyan-400 mr-2 shadow-[0_0_8px_#00e5ff]"></div>
        <span class="text-sm font-bold tracking-wider text-white">点位列表</span>
      </div>
      
      <!-- Search -->
      <div class="p-3">
        <div class="relative">
          <input 
            type="text" 
            placeholder="搜索点位编号" 
            class="w-full bg-[#0f172a] border border-blue-400/30 rounded-sm py-1.5 pl-3 pr-8 text-xs text-white focus:border-cyan-400 outline-none transition-colors"
          />
          <Search :size="14" class="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-400" />
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar px-3 pb-2 space-y-2">
        <div 
          v-for="(loc, idx) in locationList" 
          :key="idx"
          @click="setActiveLocation(idx)"
          class="relative p-3 text-xs rounded-sm cursor-pointer flex items-center justify-between group transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          :class="activeLocation === idx 
            ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/40 border-l-2 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105 z-10' 
            : 'text-white/70 border-l-2 border-transparent hover:border-cyan-400/50 hover:text-white hover:bg-white/10 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:z-20'"
        >
          <!-- Background Glow Effect for Hover -->
          <div class="absolute inset-0 rounded-sm bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <span class="truncate pr-2 font-mono tracking-wide relative z-10 transition-all" 
                :class="activeLocation === idx ? 'font-bold text-cyan-300 text-shadow-glow' : 'group-hover:text-cyan-100'">
            {{ loc }}
          </span>
          
          <div v-if="activeLocation === idx" class="relative z-10 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-ping"></div>
          <div v-else class="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-cyan-400/50 group-hover:shadow-[0_0_5px_#00e5ff] transition-all relative z-10"></div>
        </div>
      </div>
    </div>

    <!-- CENTER VIEW - System Visualization -->
    <div class="flex-1 flex flex-col relative bg-gradient-to-b from-[#0f172a] to-[#172554] border border-blue-400/30 rounded-sm overflow-hidden">
      
      <!-- TOP STATS BAR (HUD Style) -->
      <div class="absolute top-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
          <div class="flex items-center space-x-4 pointer-events-auto">
            
            <!-- Rain Simulation Toggle Button -->
            <button 
              @click="toggleIsRaining"
              class="flex items-center space-x-2 px-4 py-3 rounded-full border transition-all duration-300 group"
              :class="isRaining 
                ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.4)]' 
                : 'bg-[#0f172a]/80 border-white/10 hover:border-cyan-400/50'"
            >
              <CloudLightning v-if="isRaining" :size="18" class="text-cyan-400 animate-pulse" />
              <CloudRain v-else :size="18" class="text-white/50 group-hover:text-cyan-400" />
              <span class="text-xs font-bold" :class="isRaining ? 'text-cyan-300' : 'text-white/50 group-hover:text-white'">
                {{ isRaining ? '降雨模拟中...' : '启动降雨模拟' }}
              </span>
            </button>

            <!-- Data Stats -->
            <div class="flex items-center space-x-10 bg-[#0f172a]/80 backdrop-blur-md border border-cyan-400/30 px-10 py-3 rounded-full shadow-[0_0_30px_rgba(0,229,255,0.15)] animate-in slide-in-from-top-4 fade-in duration-700">
                <div class="absolute inset-0 rounded-full bg-cyan-400/5 blur-xl"></div>

                <div v-for="(stat, i) in stats" :key="i" class="flex items-center space-x-4 group relative transition-opacity duration-500" 
                     :class="isRaining ? 'opacity-100' : 'opacity-50'">
                    <!-- Icon Box -->
                    <div class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent border border-white/10 group-hover:border-cyan-400/50 group-hover:scale-110 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                        <component :is="stat.icon" :size="18" class="text-cyan-300" />
                    </div>

                    <!-- Text Info -->
                    <div class="flex flex-col">
                      <span class="text-[10px] text-white/60 uppercase tracking-wider font-bold mb-0.5">{{ stat.label }}</span>
                      <div class="flex items-baseline space-x-1">
                          <span class="text-2xl font-orbitron font-black leading-none" :class="stat.valColor">
                              {{ stat.val }}
                          </span>
                          <span class="text-[10px] text-white/50 font-mono">{{ stat.unit }}</span>
                      </div>
                    </div>

                    <!-- Divider (except last) -->
                    <div v-if="i < 2" class="absolute -right-5 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                </div>
            </div>
          </div>
      </div>

      <!-- Rain Visual Layer - Only visible when raining -->
      <div v-if="isRaining" class="absolute inset-0 pointer-events-none z-10 overflow-hidden">
         <div v-for="(style, i) in rainDrops" :key="i" class="rain-drop" :style="style"></div>
      </div>

      <!-- WRAPPER FOR TRANSITION EFFECT -->
      <div 
        :key="activeLocation" 
        class="flex-1 relative animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
      >
         <!-- Grid Background -->
         <div class="absolute inset-0 grid-bg opacity-30"></div>

         <!-- System Schematic SVG -->
         <svg class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 800 500">
            <defs>
              <!-- Pipe Wall Gradient -->
              <linearGradient id="pipeWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3" />
                <stop offset="50%" stop-color="#1e3a8a" stop-opacity="0.1" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.3" />
              </linearGradient>
              
              <!-- Pipe Glow -->
              <filter id="pipeGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- --- 1. PIPE STRUCTURE (Static Background) --- -->
            <g stroke="url(#pipeWallGradient)" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <!-- Vertical Drops from Hoppers -->
                <path d="M150,165 L150,210" />
                <path d="M300,195 L300,220" />
                <path d="M450,175 L450,210" />
                
                <!-- Main Horizontal Pipe + Downspout -->
                <path d="M150,210 L300,220 L450,210 L480,210 Q500,210 500,230 L500,350" />
            </g>

            <!-- --- 2. DYNAMIC FLOW (Animated Center Lines) --- -->
            <!-- Visibility controlled by isRaining state -->
            <g 
              class="flow-container" 
              stroke="#22d3ee" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#pipeGlow)"
              :style="{ opacity: isRaining ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }"
            >
                <!-- Drop 1 Flow -->
                <path d="M150,170 L150,210" class="flow-line" opacity="0.8" />
                <!-- Drop 2 Flow -->
                <path d="M300,200 L300,220" class="flow-line" opacity="0.8" />
                <!-- Drop 3 Flow -->
                <path d="M450,180 L450,210" class="flow-line" opacity="0.8" />
                
                <!-- Main Collection Flow -->
                <path d="M150,210 L300,220 L450,210 L480,210 Q500,210 500,230 L500,345" class="flow-line" opacity="1" />
            </g>

            <!-- --- 3. COMPONENTS --- -->

            <!-- Roof Outlets (Rainwater Hoppers) -->
            <g transform="translate(150, 150)">
               <path d="M0,0 L10,20 L-10,20 Z" fill="#00e5ff" class="opacity-90 transition-all" />
               <ellipse cx="0" cy="0" rx="15" ry="5" fill="#0f172a" stroke="#00e5ff" stroke-width="1" />
               <!-- Swirl only spins when raining -->
               <path d="M-5,0 Q0,5 5,0" fill="none" stroke="#fff" stroke-width="1" :opacity="isRaining ? 0.5 : 0" :class="isRaining ? 'animate-spin origin-center' : ''" />
            </g>

            <g transform="translate(300, 180)">
               <path d="M0,0 L10,20 L-10,20 Z" fill="#00e5ff" class="opacity-90" />
               <ellipse cx="0" cy="0" rx="15" ry="5" fill="#0f172a" stroke="#00e5ff" stroke-width="1" />
            </g>

            <g transform="translate(450, 160)">
               <path d="M0,0 L10,20 L-10,20 Z" fill="#00e5ff" class="opacity-90" />
               <ellipse cx="0" cy="0" rx="15" ry="5" fill="#0f172a" stroke="#00e5ff" stroke-width="1" />
            </g>

            <!-- Tank -->
            <g transform="translate(520, 320)">
              <!-- Tank Body -->
              <path d="M0,0 L100,20 L100,100 L0,80 Z" fill="#1e3a8a" opacity="0.4" stroke="#3b82f6" stroke-width="1" />
              <path d="M0,0 L-40,20 L-40,100 L0,80" fill="#172554" opacity="0.5" stroke="#3b82f6" stroke-width="1" />
              <path d="M-40,20 L60,40 L100,20" fill="none" stroke="#3b82f6" stroke-width="1" />
              
              <!-- Water Level Surface - Only oscillates/shows when raining or has baseline water -->
              <path d="M-40,80 L60,100 L100,80 L0,60 Z" fill="#0ea5e9" opacity="0.6" :class="isRaining ? 'animate-pulse' : ''">
                 <animate attributeName="opacity" :values="isRaining ? '0.6;0.8;0.6' : '0.6'" dur="3s" repeatCount="indefinite" :begin="isRaining ? '0s' : 'indefinite'" />
              </path>
              
              <!-- Splash/Turbulence Area - Only visible when raining -->
              <g transform="translate(-20, 30)" :style="{ opacity: isRaining ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }">
                 <circle cx="0" cy="0" r="2" fill="white" class="bubble" style="animation-delay: 0s" />
                 <circle cx="5" cy="2" r="1.5" fill="cyan" class="bubble" style="animation-delay: 0.5s" />
                 <circle cx="-5" cy="5" r="2.5" fill="white" class="bubble" style="animation-delay: 1.2s" />
                 <ellipse cx="0" cy="0" rx="10" ry="3" fill="#bef264" opacity="0.3" class="animate-ping" />
              </g>
            </g>
         </svg>

         <!-- Data Tags Overlays - Backgrounds Lightened -->
         
         <!-- Gutter Level -->
         <div class="absolute top-[20%] right-[10%] bg-[#0f172a]/90 border border-blue-500/30 p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-500" 
              :class="isRaining ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2 grayscale'">
            <div class="text-[10px] text-white/70 mb-0.5">天沟液位</div>
            <div class="text-lg font-orbitron font-bold text-cyan-400">{{ activeData.gutterLevel }} <span class="text-[10px]">cm</span></div>
         </div>

         <!-- Pipe Negative Pressure -->
         <div class="absolute top-[40%] left-[10%] bg-[#0f172a]/90 border border-blue-500/30 p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-500 delay-100" 
              :class="isRaining ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2 grayscale'">
            <div class="text-[10px] text-white/70 mb-0.5">管道负压</div>
            <div class="text-lg font-orbitron font-bold text-white">{{ activeData.negPressure }} <span class="text-[10px] text-yellow-500 bg-yellow-900/30 px-1 rounded">mbar</span></div>
         </div>

         <!-- Outlet Flow -->
         <div class="absolute top-[55%] left-[15%] bg-[#0f172a]/90 border border-blue-500/30 p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-500 delay-200" 
              :class="isRaining ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2 grayscale'">
            <div class="text-[10px] text-white/70 mb-0.5">出水瞬时流量</div>
            <div class="text-lg font-orbitron font-bold text-white">{{ activeData.flow }} <span class="text-[10px] text-blue-400 bg-blue-900/30 px-1 rounded">m³/h</span></div>
         </div>

         <!-- Residual Pressure -->
         <div class="absolute top-[70%] left-[12%] bg-[#0f172a]/90 border border-blue-500/30 p-2 rounded-sm shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all duration-500 delay-300" 
              :class="isRaining ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2 grayscale'">
            <div class="text-[10px] text-white/70 mb-0.5">出口余压</div>
            <div class="text-lg font-orbitron font-bold text-white">{{ activeData.residual }} <span class="text-[10px] text-yellow-500 bg-yellow-900/30 px-1 rounded">mbar</span></div>
         </div>
         
         <!-- Floating Icons for Decoration -->
         <div class="absolute top-[28%] right-[22%] opacity-80"><CloudRain :size="24" class="text-white/20" /></div>
         <div class="absolute top-[45%] left-[30%] opacity-50"><Wind :size="20" class="text-cyan-400/20" /></div>

      </div>

      <!-- Back Button Overlay -->
      <button 
        @click="$emit('back')"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0f172a] border-t border-x border-cyan-500/50 rounded-t-lg px-6 py-1 text-xs text-cyan-400 hover:text-white hover:bg-cyan-900/50 transition-colors z-50 flex items-center space-x-2"
      >
        <ChevronLeft :size="12" />
        <span>返回系统平台</span>
      </button>

    </div>

    <!-- RIGHT SIDEBAR - Analysis -->
    <div class="w-[300px] flex flex-col space-y-2">
      <!-- REPLACED WEATHER WITH EXPANDED MONITORING CHART -->
      <div class="bg-[#1e293b]/50 border border-blue-400/30 rounded-sm p-2 flex flex-col h-[360px]">
         <div class="text-xs font-bold text-white italic border-l-2 border-cyan-400 pl-2 mb-2">监测数据趋势 (24h)</div>
         <div class="flex-1 relative">
           <div ref="trendChartRef" class="w-full h-full"></div>
         </div>
      </div>

      <!-- Real-time Video (MOVED UP) - Styled to match request -->
      <div class="bg-[#1e293b]/50 border border-blue-400/30 rounded-sm p-2 flex flex-col h-[300px]">
         <div class="text-xs font-bold text-white italic border-l-2 border-cyan-400 pl-2 mb-2">实时视频</div>
         <div class="flex-1">
            <VideoPlayer :is-full="false" :is-video-playing="isVideoPlaying" @toggle-play="toggleVideoPlay" :video-fullscreen="videoFullscreen" @toggle-fullscreen="toggleVideoFullscreen" :is-muted="isMuted" @toggle-muted="toggleMute" :is-mic-on="isMicOn" @toggle-mic="toggleMic" />
         </div>
      </div>

      <!-- Monitoring Photos (MOVED DOWN) -->
      <div class="bg-[#1e293b]/50 border border-blue-400/30 rounded-sm p-2 flex flex-col flex-1 min-h-[100px] max-h-[180px]">
         <div class="flex items-center justify-between mb-2">
           <div class="text-xs font-bold text-white italic border-l-2 border-cyan-400 pl-2">监测照片</div>
           <div class="flex space-x-0.5">
             <div 
               v-for="(_, idx) in monitoringPhotos" 
               :key="idx" 
               class="w-1 h-1 rounded-full transition-colors" 
               :class="idx === currentPhotoIndex ? 'bg-cyan-400' : 'bg-white/30'"
             />
           </div>
         </div>
         
         <div 
           class="flex-1 relative rounded-sm overflow-hidden group cursor-pointer border border-white/10 hover:border-cyan-400/50 transition-colors"
           @click="setEnlargedPhoto(currentPhoto)"
         >
            <!-- Image Simulation -->
            <div class="absolute inset-0 bg-gradient-to-br" :class="currentPhoto.gradient"></div>
            
            <!-- Pattern Overlay -->
            <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]"></div>
            <div class="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
              <div v-for="(_, i) in Array.from({length: 24})" :key="i" class="border-[0.5px] border-white/20"></div>
            </div>

            <!-- Icon Overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-700">
              <Camera :size="48" class="text-white drop-shadow-lg" :class="currentPhoto.iconColor.replace('text-', 'stroke-')" />
            </div>

            <!-- Text Info -->
            <div class="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-2 border-t border-white/10">
               <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold text-white truncate">{{ currentPhoto.location }}</span>
                  <span class="text-[9px] font-mono text-cyan-400">{{ currentPhoto.time }}</span>
               </div>
            </div>

            <!-- Hover Effect: Maximize Icon -->
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <Maximize2 :size="24" class="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
            </div>
         </div>
      </div>
    </div>

    <!-- Lightbox Modal (Photos) -->
    <div v-if="enlargedPhoto" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
      <div class="relative w-[90%] h-[90%] max-w-5xl bg-[#0f172a] border border-cyan-400/30 rounded-sm shadow-[0_0_50px_rgba(0,229,255,0.2)] flex flex-col">
        
        <!-- Header -->
        <div class="h-12 flex items-center justify-between px-4 border-b border-white/10 bg-gradient-to-r from-cyan-900/20 to-transparent">
           <div class="flex items-center space-x-3">
             <Camera :size="18" class="text-cyan-400" />
             <span class="text-lg font-bold text-white tracking-wider">{{ enlargedPhoto.location }}</span>
             <span class="text-xs font-mono text-white/50 border-l border-white/20 pl-3">{{ enlargedPhoto.date }} {{ enlargedPhoto.time }}</span>
           </div>
           <button 
             @click="setEnlargedPhoto(null)"
             class="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-cyan-400 transition-colors"
           >
             <X :size="24" />
           </button>
        </div>

        <!-- Content -->
        <div class="flex-1 relative overflow-hidden bg-black/50 group/lightbox">
           <!-- Large Mock Image -->
           <div class="absolute inset-0 bg-gradient-to-br" :class="enlargedPhoto.gradient"></div>
           
           <!-- Technical Grid Overlay -->
           <div class="absolute inset-0 grid grid-cols-12 grid-rows-8 pointer-events-none opacity-20">
             <div v-for="(_, i) in Array.from({length: 96})" :key="i" class="border-[0.5px] border-white/10"></div>
           </div>

           <!-- Navigation Controls -->
           <button 
             @click.stop="navigatePhoto('prev')"
             class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-400 text-white/70 hover:text-cyan-400 transition-all opacity-0 group-hover/lightbox:opacity-100 -translate-x-4 group-hover/lightbox:translate-x-0 duration-300 z-50"
           >
             <ChevronLeft :size="32" />
           </button>
           <button 
             @click.stop="navigatePhoto('next')"
             class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-400 text-white/70 hover:text-cyan-400 transition-all opacity-0 group-hover/lightbox:opacity-100 translate-x-4 group-hover/lightbox:translate-x-0 duration-300 z-50"
           >
             <ChevronRight :size="32" />
           </button>

           <!-- Central Visual -->
           <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="relative">
                <div class="w-32 h-32 rounded-full border-4" :class="enlargedPhoto.iconColor.replace('text-', 'border-') + ' opacity-30 animate-ping'"></div>
                <Camera :size="64" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :class="enlargedPhoto.iconColor + ' opacity-80'" />
              </div>
           </div>

           <!-- Fake Analysis Data Overlay -->
           <div class="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur border-t border-cyan-400/30 p-4 flex justify-between items-center rounded-sm">
              <div class="flex space-x-8">
                 <div>
                   <div class="text-[10px] text-white/50 uppercase">图像清晰度</div>
                   <div class="text-sm font-bold text-white">1080P / 96%</div>
                 </div>
                 <div>
                   <div class="text-[10px] text-white/50 uppercase">AI识别结果</div>
                   <div class="text-sm font-bold text-emerald-400">正常 (Confidence: 0.98)</div>
                 </div>
              </div>
              <div class="text-[10px] text-white/30 font-mono tracking-widest">ID: {{ enlargedPhoto.id }} // CAM_SEQ_{{ Math.floor(Math.random() * 10000) }}</div>
           </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Video Modal -->
    <div v-if="videoFullscreen" class="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300">
      <VideoPlayer :is-full="true" :is-video-playing="isVideoPlaying" @toggle-play="toggleVideoPlay" :video-fullscreen="videoFullscreen" @toggle-fullscreen="toggleVideoFullscreen" :is-muted="isMuted" @toggle-muted="toggleMute" :is-mic-on="isMicOn" @toggle-mic="toggleMic" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  Search, Cloud, Moon, Sun, CloudRain, Wind, ChevronLeft, ChevronRight, ShieldCheck, Droplets, Zap, CloudLightning, 
  Camera, Maximize2, Maximize, Minimize, Play, Pause, X, Video, Volume2, VolumeX, Move, Mic, MicOff, ZoomIn 
} from 'lucide-vue-next'
import * as echarts from 'echarts'
import VideoPlayer from './VideoPlayer.vue'

interface Location {
  id: number;
  location: string;
  time: string;
  date: string;
  gradient: string;
  iconColor: string;
}

interface TrendData {
  time: string;
  level: number;
  pressure: number;
  flow: number;
}

interface ActiveData {
  gutterLevel: string;
  negPressure: number;
  flow: number;
  residual: number;
  health: number;
  maxLevel: number;
  maxFlow: number;
}

interface Emits {
  (e: 'back'): void;
}

defineEmits<Emits>();

// Updated to display Point Numbers (IDs) instead of Location Names
const locationList = [
  "TN-P001",
  "TN-P002",
  "TN-P003",
  "TN-P004",
  "TN-P005",
  "TN-P006",
  "TN-P007",
  "TN-P008",
  "TN-P009",
  "TN-P010",
  "TN-P011"
];

// Comprehensive 24h Trend Data for Level, Pressure, Flow
const trendData: TrendData[] = [
  { time: '12:00', level: 0.5, pressure: 50, flow: 120 },
  { time: '15:00', level: 0.8, pressure: 80, flow: 180 },
  { time: '18:00', level: 1.2, pressure: 150, flow: 350 },
  { time: '21:00', level: 3.5, pressure: 380, flow: 950 },
  { time: '00:00', level: 4.2, pressure: 460, flow: 1340 },
  { time: '03:00', level: 3.8, pressure: 410, flow: 1120 },
  { time: '06:00', level: 2.5, pressure: 250, flow: 680 },
  { time: '09:00', level: 1.5, pressure: 120, flow: 320 },
];

// Mock Photos Data for the Carousel
const monitoringPhotos: Location[] = [
  { 
    id: 1, 
    location: 'TN-P001 天沟北段', 
    time: '22:35:10', 
    date: '2025-12-26',
    gradient: 'from-[#1e293b] via-[#334155] to-[#1e293b]', // Lighter slate
    iconColor: 'text-cyan-400'
  },
  { 
    id: 2, 
    location: 'TN-P004 溢流口监测', 
    time: '22:36:22', 
    date: '2025-12-26',
    gradient: 'from-[#064e3b] via-[#065f46] to-[#064e3b]', // Emerald green
    iconColor: 'text-emerald-400'
  },
  { 
    id: 3, 
    location: 'TN-P007 汇流总管', 
    time: '22:34:05', 
    date: '2025-12-26',
    gradient: 'from-[#312e81] via-[#4338ca] to-[#312e81]', // Indigo
    iconColor: 'text-indigo-400'
  },
  { 
    id: 4, 
    location: '中央调蓄池入口', 
    time: '22:38:15', 
    date: '2025-12-26',
    gradient: 'from-[#701a75] via-[#86198f] to-[#701a75]', // Fuchsia
    iconColor: 'text-fuchsia-400'
  },
];

const activeLocation: Ref<number> = ref(0);
const isRaining: Ref<boolean> = ref(true); // Control rain state - set to TRUE by default
const currentPhotoIndex: Ref<number> = ref(0);
const enlargedPhoto: Ref<Location | null> = ref(null);

// --- 右侧趋势图（ECharts） ---
const trendChartRef: Ref<HTMLElement | null> = ref(null);
let trendChart: echarts.ECharts | null = null;

// Video State
const isVideoPlaying: Ref<boolean> = ref(true);
const videoFullscreen: Ref<boolean> = ref(false);
const isMuted: Ref<boolean> = ref(false);
const isMicOn: Ref<boolean> = ref(false);

let photoTimer: number | null = null;
let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

onMounted(() => {
  // Auto-play carousel
  photoTimer = window.setInterval(() => {
    if (!enlargedPhoto.value && !videoFullscreen.value) {
      currentPhotoIndex.value = (currentPhotoIndex.value + 1) % monitoringPhotos.length;
    }
  }, 4000);
  
  // Keyboard Support for Lightbox and Fullscreen Video
  keydownHandler = (e: KeyboardEvent) => {
    if (enlargedPhoto.value) {
      if (e.key === 'ArrowLeft') navigatePhoto('prev');
      if (e.key === 'ArrowRight') navigatePhoto('next');
      if (e.key === 'Escape') setEnlargedPhoto(null);
    }
    if (videoFullscreen.value) {
      if (e.key === 'Escape') toggleVideoFullscreen(false);
      if (e.key === ' ') toggleVideoPlay(!isVideoPlaying.value); // Space to toggle play
    }
  };
  
  window.addEventListener('keydown', keydownHandler);

  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value);
    trendChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          const p = params as any[];
          const time = p[0]?.axisValue;
          const pressure = p.find(i => i.seriesName === '运行负压')?.data;
          const flow = p.find(i => i.seriesName === '排水流量')?.data;
          const level = p.find(i => i.seriesName === '天沟液位')?.data;
          return [
            `<span style="font-weight:700">${time}</span>`,
            `运行负压：${pressure} mbar`,
            `排水流量：${flow} m³/h`,
            `天沟液位：${level} cm`
          ].join('<br />');
        }
      },
      legend: {
        data: ['运行负压', '排水流量', '天沟液位'],
        textStyle: { color: '#e5e7eb', fontSize: 10 }
      },
      grid: {
        left: 40,
        right: 40,
        top: 30,
        bottom: 30
      },
      xAxis: {
        type: 'category',
        data: trendData.map(d => d.time),
        axisLabel: { color: '#94a3b8', fontSize: 8 },
        axisLine: { lineStyle: { color: 'rgba(148,163,184,0.4)' } },
        axisTick: { show: false }
      },
      yAxis: [
        {
          type: 'value',
          name: 'mbar / m³h',
          nameLocation: 'middle',
          nameGap: 45,
          nameTextStyle: { color: '#fbbf24', fontSize: 8, opacity: 0.6 },
          axisLabel: { color: '#fbbf24', fontSize: 8 },
          // 主纵轴也去掉横向网格线，和其它图表风格统一
          splitLine: {
            show: false
          },
          axisLine: { show: false },
          axisTick: { show: false }
        },
        {
          type: 'value',
          name: 'cm',
          nameLocation: 'middle',
          nameGap: 35,
          nameTextStyle: { color: '#22d3ee', fontSize: 8, opacity: 0.6 },
          axisLabel: { color: '#22d3ee', fontSize: 8 },
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false }
        }
      ],
      series: [
        {
          name: '运行负压',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#fbbf24', width: 1.5 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(251,191,36,0.4)' },
              { offset: 1, color: 'rgba(251,191,36,0)' }
            ])
          },
          data: trendData.map(d => d.pressure)
        },
        {
          name: '排水流量',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#3b82f6', width: 1.5 },
          data: trendData.map(d => d.flow)
        },
        {
          name: '天沟液位',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#22d3ee', width: 1.5, type: 'solid' },
          data: trendData.map(d => d.level)
        }
      ]
    });
  }

  const handleResize = () => trendChart?.resize();
  window.addEventListener('resize', handleResize);
  // 把处理函数挂到 window 上，便于在 onUnmounted 中移除
  (window as any).__monitoringTrendResize__ = handleResize;
});

onUnmounted(() => {
  if (photoTimer) {
    clearInterval(photoTimer);
  }
  if (keydownHandler) {
    window.removeEventListener('keydown', keydownHandler);
  }

  const handler = (window as any).__monitoringTrendResize__;
  if (handler) {
    window.removeEventListener('resize', handler);
    delete (window as any).__monitoringTrendResize__;
  }
  trendChart?.dispose();
});

const currentPhoto = computed(() => monitoringPhotos[currentPhotoIndex.value]);

// Handle Photo Navigation
const navigatePhoto = (direction: 'prev' | 'next') => {
  if (!enlargedPhoto.value) return;
  const currentIndex = monitoringPhotos.findIndex(p => p.id === enlargedPhoto.value!.id);
  let newIndex;
  if (direction === 'next') {
    newIndex = (currentIndex + 1) % monitoringPhotos.length;
  } else {
    newIndex = (currentIndex - 1 + monitoringPhotos.length) % monitoringPhotos.length;
  }
  enlargedPhoto.value = monitoringPhotos[newIndex];
};

const setActiveLocation = (index: number) => {
  activeLocation.value = index;
};

const toggleIsRaining = () => {
  isRaining.value = !isRaining.value;
};

const setEnlargedPhoto = (photo: Location | null) => {
  enlargedPhoto.value = photo;
};

const toggleVideoPlay = (play: boolean) => {
  isVideoPlaying.value = play;
};

const toggleVideoFullscreen = (fullscreen: boolean) => {
  videoFullscreen.value = fullscreen;
};

const toggleMute = (mute: boolean) => {
  isMuted.value = mute;
};

const toggleMic = (mic: boolean) => {
  isMicOn.value = mic;
};

// Memoize randomized data based on activeLocation AND isRaining state
const activeData = computed((): ActiveData => {
  // If it's not raining, system is idle (mostly zeros)
  if (!isRaining.value) {
    return {
      gutterLevel: "0.00",
      negPressure: 0,
      flow: 0,
      residual: 0,
      health: 100, // Perfect health when idle
      maxLevel: 0,
      maxFlow: 0
    };
  }

  // Existing simulation logic when raining
  const seed = activeLocation.value + 1;
  return {
    gutterLevel: (2.3 + (Math.sin(seed) * 0.5)).toFixed(2),
    negPressure: Math.floor(450 + Math.cos(seed) * 50),
    flow: Math.floor(1250 + Math.sin(seed * 2) * 100),
    residual: Math.floor(100 + Math.cos(seed * 2) * 20),
    health: Math.min(100, Math.floor(98 - (seed % 5))),
    maxLevel: Math.floor(45 + (seed % 10)),
    maxFlow: Math.floor(128 + (Math.sin(seed) * 10))
  };
});

// Generate Raindrops CSS
const rainDrops = computed(() => {
  return Array.from({ length: 40 }).map((_, i) => ({
    left: Math.random() * 100 + '%',
    delay: Math.random() * 2 + 's',
    duration: 0.5 + Math.random() * 0.5 + 's'
  }));
});

const stats = computed(() => [
  { val: activeData.value.health, unit: '分', label: '健康指数', icon: ShieldCheck, valColor: 'text-cyan-400' },
  { val: activeData.value.maxLevel, unit: 'mm', label: '最大天沟液位', icon: Droplets, valColor: 'text-white' },
  { val: activeData.value.maxFlow, unit: 'L/s', label: '最大排水流量', icon: Zap, valColor: 'text-green-400' }
]);
</script>

<style scoped>
@keyframes rainFall {
  0% { transform: translateY(-10vh); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(80vh); opacity: 0; }
}
.rain-drop {
  position: absolute;
  top: 0;
  width: 1px;
  height: 30px;
  background: linear-gradient(to bottom, transparent, rgba(0, 229, 255, 0.8));
  animation: rainFall linear infinite;
  pointer-events: none;
  z-index: 10;
}

/* Custom Scrollbar Styles */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #0ea5e9, #0284c7);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #00e5ff, #0284c7);
  box-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
}

.custom-scrollbar::-webkit-scrollbar-corner {
  background: rgba(15, 23, 42, 0.3);
}

/* Style for flow animation */
@keyframes dashFlow {
  to { stroke-dashoffset: -20; }
}
.flow-line {
  stroke-dasharray: 4 4;
  animation: dashFlow 0.5s linear infinite;
}
@keyframes bubbleRise {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-20px) scale(1.2); opacity: 0; }
}
.bubble {
  animation: bubbleRise 2s ease-out infinite;
}
</style>
