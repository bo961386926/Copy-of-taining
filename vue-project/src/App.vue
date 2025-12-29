<template>
  <div class="flex flex-col h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#111f38] to-[#0f172a] text-white overflow-hidden">
    <!-- Top Header - Controls Project Selection -->
    <Header 
      :projects="projects" 
      :current-project="currentProject" 
      @project-change="handleProjectChange" 
    />

    <!-- Main Content Area -->
    <main class="flex flex-1 w-full overflow-hidden relative">
      <template v-if="currentView === 'overview'">
        <!-- Left Side Panels -->
        <LeftSidebar />

        <!-- Center 3D Visualization - Receives Project Data -->
        <CentralView 
          @enter-system="setCurrentView('system')" 
          :current-project="currentProject"
        />

        <!-- Right Side Panels - Receives Project Data for Description -->
        <RightSidebar :current-project="currentProject" />
      </template>
      <template v-else>
        <!-- New Monitoring System View -->
        <MonitoringSystem @back="setCurrentView('overview')" />
      </template>
    </main>

    <!-- Updated Overlay: Lighter and acts as ambient light instead of shadow -->
    <div class="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.03)_0%,transparent_100%)]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import Header from './components/Header.vue'
import LeftSidebar from './components/LeftSidebar.vue'
import RightSidebar from './components/RightSidebar.vue'
import CentralView from './components/CentralView.vue'
import MonitoringSystem from './components/MonitoringSystem.vue'
import { Project } from './types'

// Mock Data for Projects
const projects: Project[] = [
  { 
    id: 'bj', 
    name: '北京轨道交通13号线扩能提升工程小辛庄停车场', 
    description: '北京轨道交通13号线扩能提升工程小辛庄停车场占地面积约22.30公顷，总建筑面积约10.8万平方米，包含运用库、综合楼、调机车库等共11座单体建筑物。其中运用库屋面面积7万平方米，采用了虹吸式屋面排水系统，共设置108个系统，343个雨水斗。'
  },
  { 
    id: 'sh', 
    name: '上海轨道交通18号线航头定修段', 
    description: '上海轨道交通18号线航头定修段位于浦东新区，占地面积约30公顷。该项目部署了新一代智能排水监测网络，覆盖运用库及检修库屋面，集成高精度液位传感器与气象联动控制系统，有效应对台风季极端降雨挑战。'
  },
  { 
    id: 'sz', 
    name: '深圳地铁6号线长圳车辆段智慧排水平台', 
    description: '深圳地铁6号线长圳车辆段作为全地下/半地下式车辆段，其排水系统至关重要。本项目建立了全维度的数字孪生平台，实时监控泵房运行状态与地下水位，保障车辆段在汛期的绝对安全。'
  }
]

const currentView: Ref<'overview' | 'system'> = ref('overview')
const currentProject: Ref<Project> = ref(projects[0])

const setCurrentView = (view: 'overview' | 'system') => {
  currentView.value = view
}

const handleProjectChange = (project: Project) => {
  currentProject.value = project
}
</script>
