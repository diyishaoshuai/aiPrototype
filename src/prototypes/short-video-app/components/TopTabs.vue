<template>
  <div class="top-tabs">
    <div class="tabs-container">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: tab.id === activeTab }"
        @click="handleTabClick(tab)"
      >
        {{ tab.label }}
        <div v-if="tab.id === activeTab" class="tab-indicator"></div>
      </div>
    </div>
    <div class="search-btn" @click="goToSearch">
      🔍
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  activeTab: {
    type: String,
    default: 'live'
  }
})

const tabs = [
  { id: 'recommend', label: '推荐', route: '/recommend' },
  { id: 'live', label: '直播', route: '/home' },
  { id: 'social', label: '交友', route: '/social' },
  { id: 'drama', label: '短剧', route: '/drama' }
]

const handleTabClick = (tab) => {
  router.push(tab.route)
}

const goToSearch = () => {
  router.push('/search')
}
</script>

<style scoped>
.top-tabs {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabs-container {
  display: flex;
  gap: 24px;
}

.tab-item {
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
  color: #666;
}

.tab-item.active {
  color: #667eea;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background: #667eea;
}

.search-btn {
  position: absolute;
  right: 16px;
  font-size: 18px;
  cursor: pointer;
}
</style>
