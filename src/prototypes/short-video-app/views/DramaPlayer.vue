<template>
  <div class="player-page" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="back-btn" @click="goBack">←</button>
      <div class="drama-info-top">
        <div class="drama-name">{{ dramaInfo.name }}</div>
        <div class="play-count">{{ dramaInfo.totalPlayCount }}</div>
      </div>
    </div>

    <!-- 视频区域 -->
    <div class="video-container">
      <div class="video-placeholder" :style="{ background: currentEpisode.gradient }">
        {{ currentEpisode.emoji }}
      </div>
    </div>

    <!-- 左下角信息区域 -->
    <div class="left-info">
      <div class="author-name">@{{ dramaInfo.author }}</div>
      <div class="episode-title">第{{ currentEpisode.episode }}集</div>
      <div class="episode-desc">{{ currentEpisode.description }}</div>
    </div>

    <!-- 右下角功能按钮 -->
    <div class="right-actions">
      <!-- 发布人头像 + 关注按钮 -->
      <div class="action-item avatar-wrapper">
        <div class="avatar">{{ dramaInfo.authorAvatar }}</div>
        <div class="follow-btn" :class="{ followed: isFollowed }" @click="toggleFollow">
          {{ isFollowed ? '✓' : '+' }}
        </div>
      </div>

      <!-- 喜欢 -->
      <div class="action-item" @click="toggleLike">
        <div class="action-icon" :class="{ active: currentEpisode.isLiked }">❤️</div>
        <div class="action-text">{{ formatCount(currentEpisode.likes) }}</div>
      </div>

      <!-- 评论 -->
      <div class="action-item" @click="showComments">
        <div class="action-icon">💬</div>
        <div class="action-text">{{ formatCount(currentEpisode.comments) }}</div>
      </div>

      <!-- 分享 -->
      <div class="action-item" @click="share">
        <div class="action-icon">📤</div>
        <div class="action-text">分享</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar-container" @click="handleProgressClick" @touchstart="handleProgressTouchStart" @touchmove="handleProgressTouchMove" @touchend="handleProgressTouchEnd">
      <div class="progress-bar">
        <div class="progress-played" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 底部短剧信息栏 -->
    <div class="bottom-bar" @click="showEpisodeSheet = true">
      <div class="bottom-bar-content">
        <div class="drama-title">{{ dramaInfo.name }}</div>
        <div class="total-episodes">共{{ dramaInfo.totalEpisodes }}集</div>
        <div class="arrow-icon">▲</div>
      </div>
    </div>

    <!-- 选集半屏弹窗 -->
    <div v-if="showEpisodeSheet" class="episode-sheet" @click.self="showEpisodeSheet = false">
      <div class="sheet-content" @click.stop>
        <!-- 顶部短剧信息 -->
        <div class="sheet-header">
          <div class="sheet-drama-info">
            <div class="sheet-drama-title">{{ dramaInfo.name }}</div>
            <div class="sheet-total-episodes">共{{ dramaInfo.totalEpisodes }}集</div>
          </div>
          <div class="close-btn" @click="showEpisodeSheet = false">✕</div>
        </div>

        <!-- 短剧标签 -->
        <div class="drama-tags">
          <span v-for="tag in dramaInfo.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <!-- 短剧简介 -->
        <div class="drama-description">
          <div class="desc-text" :class="{ expanded: descExpanded }">
            {{ dramaInfo.description }}
          </div>
          <div class="expand-btn" @click="descExpanded = !descExpanded">
            {{ descExpanded ? '收起' : '展开' }}
          </div>
        </div>

        <!-- 分级分类 -->
        <div class="episode-categories">
          <div
            v-for="category in episodeCategories"
            :key="category.id"
            class="category-tab"
            :class="{ active: category.id === activeCategory }"
            @click="activeCategory = category.id"
          >
            {{ category.label }}
          </div>
        </div>

        <!-- 选集列表 -->
        <div class="episode-list">
          <div
            v-for="episode in filteredEpisodes"
            :key="episode.episode"
            class="episode-item"
            :class="{ playing: episode.episode === currentEpisode.episode }"
            @click="selectEpisode(episode)"
          >
            <div class="episode-cover" :style="{ background: episode.gradient }">
              {{ episode.emoji }}
            </div>
            <div class="episode-info">
              <div class="episode-title-row">
                <span class="episode-number">第{{ episode.episode }}集</span>
                <span class="separator">|</span>
                <span class="episode-brief">{{ episode.description }}</span>
              </div>
              <div class="episode-stats">
                <span class="duration">{{ episode.duration }}</span>
                <span class="play-count">{{ episode.playCount }}</span>
                <span class="like-count">{{ episode.likes }}赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 短剧信息
const dramaInfo = ref({
  id: 1,
  name: '霸总的替身新娘',
  author: '短剧工作室',
  authorAvatar: '👤',
  totalEpisodes: 80,
  totalPlayCount: '1.2亿次播放',
  tags: ['都市', '霸总', '甜宠', '逆袭'],
  description: '她本是豪门千金，却因一场阴谋成为霸总的替身新娘。婚后，她以为只是一场交易，却不料霸总对她日渐沉沦。当真相揭开，她选择离开，他却红了眼眶："你是我的唯一，不是任何人的替身。"一场追妻火葬场就此展开...'
})

// 当前播放集数索引
const currentEpisodeIndex = ref(0)

// 是否关注
const isFollowed = ref(false)

// 是否显示选集半屏
const showEpisodeSheet = ref(false)

// 简介是否展开
const descExpanded = ref(false)

// 当前选中的分级
const activeCategory = ref(1)

// 视频进度（0-100）
const progress = ref(30)

// 生成80集的数据
const allEpisodes = ref(
  Array.from({ length: 80 }, (_, i) => ({
    episode: i + 1,
    description: `第${i + 1}集精彩剧情简介`,
    duration: '02:30',
    playCount: `${(80 - i) * 10}万`,
    likes: (80 - i) * 1000,
    comments: (80 - i) * 500,
    isLiked: false,
    emoji: ['💼', '👑', '🏯', '⚡', '💕', '💊', '💰', '🔥'][i % 8],
    gradient: [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ][i % 8]
  }))
)

// 当前播放的集数
const currentEpisode = computed(() => allEpisodes.value[currentEpisodeIndex.value])

// 分级分类（每30集一个分级）
const episodeCategories = computed(() => {
  const categories = []
  const total = dramaInfo.value.totalEpisodes
  for (let i = 0; i < Math.ceil(total / 30); i++) {
    const start = i * 30 + 1
    const end = Math.min((i + 1) * 30, total)
    categories.push({
      id: i + 1,
      label: `${start}-${end}集`
    })
  }
  return categories
})

// 根据分级筛选的集数
const filteredEpisodes = computed(() => {
  const start = (activeCategory.value - 1) * 30
  const end = activeCategory.value * 30
  return allEpisodes.value.slice(start, end)
})

// 触摸滑动相关
let touchStartY = 0
let touchEndY = 0

const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  touchEndY = e.touches[0].clientY
}

const handleTouchEnd = () => {
  const diff = touchStartY - touchEndY

  // 向上滑动，播放下一集
  if (diff > 50 && currentEpisodeIndex.value < allEpisodes.value.length - 1) {
    currentEpisodeIndex.value++
  }

  // 向下滑动，播放上一集
  if (diff < -50 && currentEpisodeIndex.value > 0) {
    currentEpisodeIndex.value--
  }
}

// 切换关注
const toggleFollow = () => {
  isFollowed.value = !isFollowed.value
}

// 切换点赞
const toggleLike = () => {
  currentEpisode.value.isLiked = !currentEpisode.value.isLiked
  if (currentEpisode.value.isLiked) {
    currentEpisode.value.likes++
  } else {
    currentEpisode.value.likes--
  }
}

// 显示评论
const showComments = () => {
  console.log('显示评论')
}

// 分享
const share = () => {
  console.log('分享')
}

// 选择集数
const selectEpisode = (episode) => {
  currentEpisodeIndex.value = episode.episode - 1
  showEpisodeSheet.value = false
}

// 格式化数字
const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 进度条相关
let progressTouching = false

const handleProgressClick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const newProgress = (clickX / rect.width) * 100
  progress.value = Math.max(0, Math.min(100, newProgress))
}

const handleProgressTouchStart = (e) => {
  progressTouching = true
  e.stopPropagation()
}

const handleProgressTouchMove = (e) => {
  if (!progressTouching) return
  e.preventDefault()
  e.stopPropagation()

  const touch = e.touches[0]
  const container = e.currentTarget
  const rect = container.getBoundingClientRect()
  const touchX = touch.clientX - rect.left
  const newProgress = (touchX / rect.width) * 100
  progress.value = Math.max(0, Math.min(100, newProgress))
}

const handleProgressTouchEnd = (e) => {
  progressTouching = false
  e.stopPropagation()
}
</script>

<style scoped>
.player-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 顶部导航栏 */
.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
  z-index: 20;
}

.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 8px;
  margin-right: 12px;
}

.drama-info-top {
  flex: 1;
}

.drama-name {
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin-bottom: 2px;
}

.play-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
}

/* 左下角信息区域 */
.left-info {
  position: absolute;
  left: 16px;
  bottom: 80px;
  color: white;
  max-width: 60%;
  z-index: 10;
}

.author-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.episode-title {
  font-size: 14px;
  margin-bottom: 4px;
}

.episode-desc {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
}

/* 右下角功能按钮 */
.right-actions {
  position: absolute;
  right: 16px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 10;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid white;
}

.follow-btn {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff2d55;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #000;
  transition: all 0.3s;
}

.follow-btn.followed {
  background: #999;
}

.action-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  transition: transform 0.2s;
}

.action-icon.active {
  animation: heartBeat 0.3s;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.action-text {
  color: white;
  font-size: 12px;
  margin-top: 4px;
}

/* 进度条 */
.progress-bar-container {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 15;
  cursor: pointer;
  padding: 0;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.5);
  position: relative;
  overflow: hidden;
}

.progress-played {
  height: 100%;
  background: white;
  transition: width 0.1s ease;
}

/* 底部短剧信息栏 */
.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  color: white;
  cursor: pointer;
  z-index: 10;
}

.bottom-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 0 16px;
  height: 48px;
}

.drama-title {
  font-size: 15px;
  font-weight: bold;
}

.total-episodes {
  font-size: 13px;
  opacity: 0.8;
}

.arrow-icon {
  font-size: 12px;
  opacity: 0.8;
}

/* 选集半屏弹窗 */
.episode-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.sheet-content {
  width: 100%;
  max-height: 70vh;
  background: white;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sheet-drama-info {
  flex: 1;
}

.sheet-drama-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.sheet-total-episodes {
  font-size: 13px;
  color: #999;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.drama-tags {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.drama-description {
  padding: 0 16px 12px;
}

.desc-text {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.desc-text.expanded {
  display: block;
  -webkit-line-clamp: unset;
}

.expand-btn {
  color: #667eea;
  font-size: 13px;
  margin-top: 4px;
  cursor: pointer;
}

.episode-categories {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: visible;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.category-tab {
  padding: 6px 16px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-tab.active {
  background: #667eea;
  color: white;
}

.episode-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  -webkit-overflow-scrolling: touch;
}

.episode-list::-webkit-scrollbar {
  display: none;
}

.episode-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.episode-item.playing {
  background: #e8edff;
  border: 1px solid #667eea;
}

.episode-item:active {
  transform: scale(0.98);
}

.episode-cover {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.episode-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.episode-title-row {
  font-size: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.episode-number {
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}

.separator {
  color: #ccc;
}

.episode-brief {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.episode-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.episode-stats span {
  white-space: nowrap;
}
</style>
