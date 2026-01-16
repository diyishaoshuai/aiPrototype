<template>
  <div class="banner-swiper">
    <div class="swiper-wrapper" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(banner, index) in banners" :key="index" class="swiper-slide" @click="goToDrama(banner.dramaId)">
        <div class="banner-image">{{ banner.emoji }}</div>
      </div>
    </div>
    <div class="swiper-pagination">
      <span
        v-for="(banner, index) in banners"
        :key="index"
        class="dot"
        :class="{ active: index === currentIndex }"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentIndex = ref(0)
const banners = [
  { emoji: '🎬', dramaId: 1 },
  { emoji: '🎭', dramaId: 2 },
  { emoji: '🎪', dramaId: 3 }
]

let timer = null

// 跳转到短剧播放页面
const goToDrama = (dramaId) => {
  router.push(`/drama/${dramaId}`)
}

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.length
  }, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.banner-swiper {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 16px;
}

.swiper-wrapper {
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
}

.swiper-slide {
  min-width: 100%;
  flex-shrink: 0;
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s;
}

.swiper-slide:active {
  transform: scale(0.98);
}

.banner-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
}

.swiper-pagination {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

.dot.active {
  width: 16px;
  border-radius: 3px;
  background: white;
}
</style>
