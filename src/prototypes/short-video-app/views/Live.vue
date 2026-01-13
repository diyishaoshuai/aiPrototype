<template>
  <div class="live-page">
    <TopTabs active-tab="live" />

    <div
      class="live-container"
      @touchstart="handleStart"
      @touchmove="handleMove"
      @touchend="handleEnd"
      @mousedown="handleStart"
      @mousemove="handleMove"
      @mouseup="handleEnd"
    >
      <div
        class="live-wrapper"
        :style="{ transform: `translateY(-${currentIndex * 100}%)` }"
      >
        <div v-for="(live, index) in lives" :key="live.id" class="live-item">
          <div class="live-bg"></div>
          <div class="live-info">
            <div class="anchor-avatar">{{ live.avatar }}</div>
            <div class="anchor-details">
              <div class="anchor-name">{{ live.name }}</div>
              <div class="live-title">{{ live.title }}</div>
              <div class="viewer-count">👁️ {{ live.viewers }} 人观看</div>
            </div>
          </div>
          <button class="enter-btn">进入直播间</button>
        </div>
      </div>
    </div>

    <BottomNav active-tab="home" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopTabs from '../components/TopTabs.vue'
import BottomNav from '../components/BottomNav.vue'

const currentIndex = ref(0)
const startY = ref(0)
const isDragging = ref(false)

const lives = ref([
  { id: 1, name: '小美', title: '精彩直播 1', avatar: '👧', viewers: '12.3万' },
  { id: 2, name: '阿强', title: '精彩直播 2', avatar: '👨', viewers: '8.6万' },
  { id: 3, name: '甜甜', title: '精彩直播 3', avatar: '👩', viewers: '6.2万' }
])

const handleStart = (e) => {
  startY.value = e.touches ? e.touches[0].clientY : e.clientY
  isDragging.value = true
}

const handleMove = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
}

const handleEnd = (e) => {
  if (!isDragging.value) return
  const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
  const diff = startY.value - endY

  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex.value < lives.value.length - 1) {
      currentIndex.value++
    } else if (diff < 0 && currentIndex.value > 0) {
      currentIndex.value--
    }
  }
  isDragging.value = false
}
</script>

<style scoped>
.live-page {
  background: #000;
  min-height: 100vh;
  padding-top: 48px;
  padding-bottom: 56px;
  overflow: hidden;
}

.live-container {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 56px;
  overflow: hidden;
}

.live-wrapper {
  height: 100%;
  transition: transform 0.3s ease;
}

.live-item {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.live-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.8;
}

.live-info {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.anchor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.anchor-details {
  color: white;
  text-align: left;
}

.anchor-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.live-title {
  font-size: 16px;
  margin-bottom: 8px;
}

.viewer-count {
  font-size: 14px;
  opacity: 0.9;
}

.enter-btn {
  position: relative;
  z-index: 10;
  padding: 12px 40px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.enter-btn:active {
  opacity: 0.8;
}
</style>
