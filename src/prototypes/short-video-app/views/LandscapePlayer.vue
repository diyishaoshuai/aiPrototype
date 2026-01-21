<template>
  <div class="landscape-player-page" @click="handlePageClick">
    <!-- 视频区域 -->
    <div class="video-area">
      <div class="video-placeholder" :style="{ background: currentEpisode.gradient }">
        {{ currentEpisode.emoji }}
      </div>
    </div>

    <!-- 顶部导航栏 -->
    <transition name="fade">
      <div v-if="showControls" class="top-nav" @click.stop>
        <button class="back-btn" @click="goBack">←</button>
        <div class="drama-info">
          <span class="drama-name">{{ dramaInfo.name }}</span>
          <span class="episode-info">第{{ currentEpisode.episode }}集</span>
        </div>
        <button class="more-btn" @click="toggleMoreMenu">⋯</button>
      </div>
    </transition>

    <!-- 底部控制栏 -->
    <transition name="fade">
      <div v-if="showControls" class="bottom-controls" @click.stop>
        <div class="progress-section">
          <span class="time-text">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar" @click="handleProgressClick">
            <div class="progress-track">
              <div class="progress-played" :style="{ width: progress + '%' }"></div>
              <div class="progress-dot" :style="{ left: progress + '%' }"></div>
            </div>
          </div>
          <span class="time-text">{{ formatTime(totalTime) }}</span>
        </div>
        <div class="controls-row">
          <button class="control-btn" @click="togglePlayPause">
            <span class="btn-icon">{{ isPlaying ? '⏸' : '▶' }}</span>
          </button>
          <button class="control-btn" @click="playPrevEpisode">
            <span class="btn-icon">⏮</span>
          </button>
          <button class="control-btn" @click="playNextEpisode">
            <span class="btn-icon">⏭</span>
          </button>
          <button class="control-btn" @click="toggleMoreMenu">
            <span class="btn-text">{{ playbackSpeed }}x</span>
          </button>
          <button class="control-btn" @click="toggleMoreMenu">
            <span class="btn-text">{{ currentQuality }}</span>
          </button>
          <button class="control-btn" :class="{ active: danmakuEnabled }" @click="toggleDanmaku">
            <span class="btn-icon">💬</span>
          </button>
          <button class="control-btn" @click="toggleEpisodeList">
            <span class="btn-icon">📋</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- 更多菜单 -->
    <transition name="slide-right">
      <div v-if="showMoreMenu" class="more-menu-overlay" @click="showMoreMenu = false">
        <div class="more-menu-panel" @click.stop>
          <div class="menu-header">
            <span class="menu-title">设置</span>
            <button class="close-btn" @click="showMoreMenu = false">✕</button>
          </div>

          <div class="menu-section">
            <div class="section-title">倍速</div>
            <div class="option-list">
              <div
                v-for="speed in speedOptions"
                :key="speed"
                class="option-item"
                :class="{ active: playbackSpeed === speed }"
                @click="selectSpeed(speed)"
              >
                {{ speed }}x
              </div>
            </div>
          </div>

          <div class="menu-section">
            <div class="section-title">画质</div>
            <div class="option-list">
              <div
                v-for="quality in qualityOptions"
                :key="quality"
                class="option-item"
                :class="{ active: currentQuality === quality }"
                @click="selectQuality(quality)"
              >
                {{ quality }}
              </div>
            </div>
          </div>

          <div class="menu-section">
            <div class="function-list">
              <div class="function-item" @click="toggleDanmaku">
                <span class="function-icon" :class="{ active: danmakuEnabled }">💬</span>
                <span class="function-label">{{ danmakuEnabled ? '关闭弹幕' : '开启弹幕' }}</span>
              </div>
              <div class="function-item" @click="openShare">
                <span class="function-icon">📤</span>
                <span class="function-label">分享</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 选集列表 -->
    <transition name="slide-right">
      <div v-if="showEpisodeList" class="episode-list-overlay" @click="showEpisodeList = false">
        <div class="episode-list-panel" @click.stop>
          <div class="menu-header">
            <span class="menu-title">选集 (共{{ dramaInfo.totalEpisodes }}集)</span>
            <button class="close-btn" @click="showEpisodeList = false">✕</button>
          </div>
          <div class="episode-grid">
            <div
              v-for="ep in episodes"
              :key="ep.episode"
              class="episode-item"
              :class="{ active: currentEpisode.episode === ep.episode }"
              @click="selectEpisode(ep)"
            >
              {{ ep.episode }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 短剧信息
const dramaInfo = ref({
  id: 1,
  name: '霸总的替身新娘',
  totalEpisodes: 80
})

// 剧集列表
const episodes = ref([])

// 当前剧集
const currentEpisode = ref({
  episode: 1,
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  emoji: '💼'
})

// 播放状态
const isPlaying = ref(true)
const currentTime = ref(0)
const totalTime = ref(180)
const progress = computed(() => (currentTime.value / totalTime.value) * 100)

// 控制栏显示
const showControls = ref(true)
let controlsTimer = null

// 菜单状态
const showMoreMenu = ref(false)
const showEpisodeList = ref(false)

// 播放设置
const playbackSpeed = ref(1)
const speedOptions = [0.75, 1, 1.25, 1.5, 2, 3]
const currentQuality = ref('高清')
const qualityOptions = ['流畅', '标清', '高清', '超清', '蓝光']
const danmakuEnabled = ref(false)

// 初始化
onMounted(() => {
  initEpisodes()
  loadEpisodeFromRoute()
  startControlsTimer()
  startPlaybackTimer()
})

onBeforeUnmount(() => {
  clearTimeout(controlsTimer)
})

// 初始化剧集列表
const initEpisodes = () => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ]
  const emojis = ['💼', '👑', '💎', '🌹', '🎭']

  episodes.value = Array.from({ length: dramaInfo.value.totalEpisodes }, (_, i) => ({
    episode: i + 1,
    gradient: gradients[i % gradients.length],
    emoji: emojis[i % emojis.length]
  }))
}

// 从路由加载剧集
const loadEpisodeFromRoute = () => {
  const id = route.params.id
  const ep = route.query.episode ? parseInt(route.query.episode) : 1
  if (id) dramaInfo.value.id = id
  const found = episodes.value.find(e => e.episode === ep)
  if (found) currentEpisode.value = found
}

// 控制栏定时器
const startControlsTimer = () => {
  clearTimeout(controlsTimer)
  controlsTimer = setTimeout(() => {
    if (!showMoreMenu.value && !showEpisodeList.value) {
      showControls.value = false
    }
  }, 3000)
}

// 播放进度定时器
let playbackTimer = null
const startPlaybackTimer = () => {
  playbackTimer = setInterval(() => {
    if (isPlaying.value && currentTime.value < totalTime.value) {
      currentTime.value += 1
    }
  }, 1000)
}

// 页面点击
const handlePageClick = () => {
  if (showMoreMenu.value || showEpisodeList.value) return
  showControls.value = !showControls.value
  if (showControls.value) startControlsTimer()
}

// 返回
const goBack = () => {
  router.back()
}

// 播放/暂停
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
  startControlsTimer()
}

// 上一集/下一集
const playPrevEpisode = () => {
  const idx = episodes.value.findIndex(e => e.episode === currentEpisode.value.episode)
  if (idx > 0) {
    currentEpisode.value = episodes.value[idx - 1]
    currentTime.value = 0
  }
  startControlsTimer()
}

const playNextEpisode = () => {
  const idx = episodes.value.findIndex(e => e.episode === currentEpisode.value.episode)
  if (idx < episodes.value.length - 1) {
    currentEpisode.value = episodes.value[idx + 1]
    currentTime.value = 0
  }
  startControlsTimer()
}

// 选择剧集
const selectEpisode = (ep) => {
  currentEpisode.value = ep
  currentTime.value = 0
  showEpisodeList.value = false
  startControlsTimer()
}

// 进度条点击
const handleProgressClick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  currentTime.value = Math.floor(percent * totalTime.value)
  startControlsTimer()
}

// 菜单切换
const toggleMoreMenu = () => {
  showMoreMenu.value = !showMoreMenu.value
  showEpisodeList.value = false
}

const toggleEpisodeList = () => {
  showEpisodeList.value = !showEpisodeList.value
  showMoreMenu.value = false
}

// 倍速选择
const selectSpeed = (speed) => {
  playbackSpeed.value = speed
}

// 画质选择
const selectQuality = (quality) => {
  currentQuality.value = quality
}

// 弹幕切换
const toggleDanmaku = () => {
  danmakuEnabled.value = !danmakuEnabled.value
}

// 分享
const openShare = () => {
  alert('分享功能')
}

// 时间格式化
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.landscape-player-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.video-area {
  width: 100%;
  height: 100%;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
}

/* 顶部导航栏 */
.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
  z-index: 10;
}

.back-btn, .more-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drama-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.drama-name {
  font-size: 18px;
  font-weight: 600;
}

.episode-info {
  font-size: 14px;
  opacity: 0.8;
}

/* 底部控制栏 */
.bottom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  z-index: 10;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.time-text {
  color: white;
  font-size: 12px;
  min-width: 45px;
}

.progress-bar {
  flex: 1;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  position: relative;
}

.progress-played {
  height: 100%;
  background: #667eea;
  border-radius: 2px;
}

.progress-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.control-btn {
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.control-btn:hover {
  background: rgba(255,255,255,0.1);
}

.control-btn.active {
  color: #667eea;
}

.btn-icon {
  font-size: 24px;
}

.btn-text {
  font-size: 14px;
  font-weight: 500;
}

/* 更多菜单 */
.more-menu-overlay,
.episode-list-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.more-menu-panel,
.episode-list-panel {
  width: 320px;
  height: 100%;
  background: white;
  overflow-y: auto;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.menu-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.menu-section {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.option-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-item {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.option-item.active {
  background: #667eea;
  color: white;
}

.function-list {
  display: flex;
  gap: 24px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.function-icon {
  font-size: 24px;
}

.function-icon.active {
  color: #667eea;
}

.function-label {
  font-size: 12px;
  color: #666;
}

/* 选集列表 */
.episode-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 16px;
}

.episode-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.episode-item.active {
  background: #667eea;
  color: white;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
