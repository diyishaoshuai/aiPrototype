<template>
  <div class="home-page">
    <TopTabs active-tab="live" />
    <div class="video-container" ref="containerRef">
      <div
        v-for="(video, index) in videos"
        :key="index"
        class="video-item"
        :class="{ active: index === currentIndex }"
        :style="{ background: video.gradient }"
      >
        <div class="video-content">
          <div class="video-number">{{ video.number }}</div>
          <div class="video-title">{{ video.title }}</div>
        </div>
      </div>
    </div>
    <BottomNav active-tab="home" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TopTabs from '../components/TopTabs.vue'
import BottomNav from '../components/BottomNav.vue'

const containerRef = ref(null)
const currentIndex = ref(0)
const startY = ref(0)
const isDragging = ref(false)

const videos = [
  { number: '1', title: '精彩视频 1', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { number: '2', title: '精彩视频 2', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { number: '3', title: '精彩视频 3', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
]

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
    if (diff > 0 && currentIndex.value < videos.length - 1) {
      currentIndex.value++
    } else if (diff < 0 && currentIndex.value > 0) {
      currentIndex.value--
    }
  }
  isDragging.value = false
}

onMounted(() => {
  const container = containerRef.value
  if (container) {
    container.addEventListener('touchstart', handleStart)
    container.addEventListener('touchmove', handleMove)
    container.addEventListener('touchend', handleEnd)
    container.addEventListener('mousedown', handleStart)
    container.addEventListener('mousemove', handleMove)
    container.addEventListener('mouseup', handleEnd)
  }
})

onUnmounted(() => {
  const container = containerRef.value
  if (container) {
    container.removeEventListener('touchstart', handleStart)
    container.removeEventListener('touchmove', handleMove)
    container.removeEventListener('touchend', handleEnd)
    container.removeEventListener('mousedown', handleStart)
    container.removeEventListener('mousemove', handleMove)
    container.removeEventListener('mouseup', handleEnd)
  }
})
</script>

<style scoped>
.home-page {
  background: black;
  height: 100vh;
  overflow: hidden;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-item {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
  opacity: 0;
  z-index: 0;
}

.video-item.active {
  opacity: 1;
  z-index: 10;
}

.video-content {
  color: white;
  text-align: center;
}

.video-number {
  font-size: 60px;
  margin-bottom: 16px;
}

.video-title {
  font-size: 20px;
}
</style>
