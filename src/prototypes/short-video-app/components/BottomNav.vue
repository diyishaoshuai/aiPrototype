<template>
  <div class="bottom-nav">
    <div class="nav-container">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-item"
        :class="{ active: tab.id === activeTab }"
        @click="handleNavClick(tab)"
      >
        <span class="nav-icon">{{ tab.icon }}</span>
        <span class="nav-label">{{ tab.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  activeTab: {
    type: String,
    default: 'home'
  }
})

const tabs = [
  { id: 'home', icon: '🏠', label: '首页', route: '/home' },
  { id: 'square', icon: '🔥', label: '广场', route: '/square' },
  { id: 'publish', icon: '➕', label: '发布', route: '/publish' },
  { id: 'message', icon: '💬', label: '消息', route: '/message' },
  { id: 'profile', icon: '👤', label: '我', route: '/profile' }
]

const handleNavClick = (tab) => {
  router.push(tab.route)
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e5e5;
  z-index: 50;
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  color: #666;
}

.nav-item.active {
  color: #667eea;
}

.nav-icon {
  font-size: 24px;
}

.nav-label {
  font-size: 12px;
  margin-top: 4px;
}
</style>
