<template>
  <div class="home-page">
    <!-- 顶部固定栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">⭐</div>
          <span class="logo-text">星趣</span>
        </div>
        <div class="menu-btn" @click="showMenu = !showMenu">
          <span v-if="!showMenu">☰</span>
          <span v-else>✕</span>
        </div>
      </div>
      <!-- 移动端菜单 -->
      <transition name="slide-down">
        <div class="mobile-menu" v-show="showMenu">
          <a href="#features" class="menu-item" @click.prevent="scrollToSection('features'); showMenu = false">功能特色</a>
          <a href="#screenshots" class="menu-item" @click.prevent="scrollToSection('screenshots'); showMenu = false">界面预览</a>
          <a href="#version" class="menu-item" @click.prevent="scrollToSection('version'); showMenu = false">版本信息</a>
        </div>
      </transition>
    </header>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- Hero区域 - 简化版 -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">星趣</h1>
          <p class="hero-subtitle">你的直播社交平台</p>
          <p class="hero-desc">汇聚精彩直播、语音互动、短剧娱乐</p>
          
          <!-- 统计数据 - 横向排列 -->
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">100万+</div>
              <div class="stat-label">用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">10万+</div>
              <div class="stat-label">主播</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50万+</div>
              <div class="stat-label">内容</div>
            </div>
          </div>

          <!-- 下载按钮区域 -->
          <div class="download-section">
            <button class="download-btn download-btn-android" @click="downloadAndroid">
              <span class="download-icon">🤖</span>
              <span class="download-label">Android下载</span>
            </button>
            <button class="download-btn download-btn-ios" @click="downloadIOS">
              <span class="download-icon">🍎</span>
              <span class="download-label">iOS下载 <span class="download-subtitle">App Store</span></span>
            </button>
          </div>
        </div>
      </section>

      <!-- 功能特色 - 横向滑动 -->
      <section class="features-section" id="features">
        <div class="section-header">
          <h2 class="section-title">核心功能</h2>
        </div>
        <div class="features-scroll" ref="featuresScrollRef">
          <div class="features-list">
            <div
              v-for="feature in features"
              :key="feature.id"
              class="feature-card"
            >
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.desc }}</p>
              <div class="feature-tags">
                <span
                  v-for="(highlight, idx) in feature.highlights.slice(0, 2)"
                  :key="idx"
                  class="feature-tag"
                >
                  {{ highlight }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 界面预览 - 横向滑动 -->
      <section class="screenshots-section" id="screenshots">
        <div class="section-header">
          <h2 class="section-title">界面预览</h2>
        </div>
        <div class="screenshots-scroll" ref="screenshotsScrollRef">
          <div class="screenshots-list">
            <div
              v-for="(screenshot, index) in screenshots"
              :key="index"
              class="screenshot-item"
            >
              <div class="screenshot-frame">
                <div class="screenshot-content">
                  <div class="screenshot-placeholder"></div>
                </div>
              </div>
              <div class="screenshot-label">{{ screenshot.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 版本信息 - 简化版 -->
      <section class="version-section" id="version">
        <div class="version-card" @click="toggleVersionHistory">
          <div class="version-header">
            <div class="version-info">
              <div class="version-number">v{{ currentVersion.version }}</div>
              <div class="version-date">{{ currentVersion.date }}</div>
            </div>
            <div class="version-toggle" :class="{ expanded: showVersionHistory }">
              <span>▼</span>
            </div>
          </div>
          <div class="version-description" v-show="!showVersionHistory">
            {{ currentVersion.description }}
          </div>
          <transition name="slide-down">
            <div class="version-history" v-show="showVersionHistory">
              <div
                v-for="(version, index) in versionHistory"
                :key="index"
                class="version-item"
              >
                <div class="version-item-header">
                  <div class="version-item-number">v{{ version.version }}</div>
                  <div class="version-item-date">{{ version.date }}</div>
                </div>
                <div class="version-item-title">{{ version.title }}</div>
                <ul class="version-item-changes">
                  <li v-for="(change, idx) in version.changes.slice(0, 3)" :key="idx">{{ change }}</li>
                </ul>
              </div>
            </div>
          </transition>
        </div>
      </section>

      <!-- 底部信息 -->
      <footer class="footer">
        <div class="footer-info">
          <div class="company-name">重庆共进互娱网络科技有限公司</div>
          <div class="company-address">重庆市沙坪坝区梨树湾工业园7号2-A1、2-A1-1</div>
          <div class="footer-links">
            <div class="footer-link-item">客服邮箱: xqlive8866@163.com</div>
            <div class="footer-link-item">ICP: 渝B2-20250981</div>
            <div class="footer-link-item">文化部全国举报电话: 12318</div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showMenu = ref(false)
const showVersionHistory = ref(false)
const featuresScrollRef = ref(null)
const screenshotsScrollRef = ref(null)

const currentVersion = ref({
  version: '2.1.0',
  date: '2025-01-15',
  description: '优化用户体验，修复已知问题，提升系统稳定性'
})

const versionHistory = ref([
  {
    version: '2.1.0',
    date: '2025-01-15',
    title: '优化更新',
    changes: [
      '优化直播画质和流畅度',
      '新增语音厅房间分类功能',
      '优化短剧播放体验',
      '修复部分已知问题'
    ]
  },
  {
    version: '2.0.0',
    date: '2025-01-08',
    title: '重大更新',
    changes: [
      '全新UI设计',
      '新增动态广场功能',
      '优化聊天系统',
      '提升整体性能'
    ]
  },
  {
    version: '1.5.0',
    date: '2024-12-25',
    title: '功能增强',
    changes: [
      '新增短剧模块',
      '优化直播互动功能',
      '改进用户体验'
    ]
  },
  {
    version: '1.0.0',
    date: '2024-12-01',
    title: '首次发布',
    changes: [
      '基础直播功能',
      '语音厅功能',
      '用户系统',
      '基础社交功能'
    ]
  }
])

const features = ref([
  {
    id: 1,
    icon: '📺',
    title: '精彩直播',
    desc: '海量优质主播，实时互动体验',
    highlights: ['高清画质', '实时弹幕', '礼物打赏', '连麦互动']
  },
  {
    id: 2,
    icon: '🎤',
    title: '语音厅',
    desc: '多人语音聊天，轻松社交',
    highlights: ['多人语音', '房间分类', '实时互动', '背景音乐']
  },
  {
    id: 3,
    icon: '🎬',
    title: '短剧娱乐',
    desc: '精彩短剧，随时随地观看',
    highlights: ['丰富内容', '高清播放', '离线缓存', '追剧提醒']
  },
  {
    id: 4,
    icon: '🔥',
    title: '动态广场',
    desc: '分享生活，发现精彩',
    highlights: ['图文动态', '视频分享', '点赞评论', '话题讨论']
  },
  {
    id: 5,
    icon: '💬',
    title: '即时聊天',
    desc: '私信群聊，沟通无阻',
    highlights: ['私信聊天', '群组功能', '语音消息', '表情包']
  },
  {
    id: 6,
    icon: '👥',
    title: '社交互动',
    desc: '关注好友，建立社交圈',
    highlights: ['关注系统', '粉丝互动', '动态推送', '好友推荐']
  }
])

const screenshots = ref([
  { label: '直播页面' },
  { label: '语音厅' },
  { label: '短剧' },
  { label: '广场' },
  { label: '聊天' },
  { label: '个人中心' }
])

const downloadIOS = () => {
  console.log('iOS下载')
}

const downloadAndroid = () => {
  console.log('Android下载')
}

const toggleVersionHistory = () => {
  showVersionHistory.value = !showVersionHistory.value
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 60
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// 启用横向滑动
onMounted(() => {
  if (featuresScrollRef.value) {
    let isDown = false
    let startX = 0
    let scrollLeft = 0

    featuresScrollRef.value.addEventListener('mousedown', (e) => {
      isDown = true
      startX = e.pageX - featuresScrollRef.value.offsetLeft
      scrollLeft = featuresScrollRef.value.scrollLeft
    })

    featuresScrollRef.value.addEventListener('mouseleave', () => {
      isDown = false
    })

    featuresScrollRef.value.addEventListener('mouseup', () => {
      isDown = false
    })

    featuresScrollRef.value.addEventListener('mousemove', (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - featuresScrollRef.value.offsetLeft
      const walk = (x - startX) * 2
      featuresScrollRef.value.scrollLeft = scrollLeft - walk
    })

    // 触摸事件
    let touchStartX = 0
    featuresScrollRef.value.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
    })

    featuresScrollRef.value.addEventListener('touchmove', (e) => {
      if (Math.abs(e.touches[0].clientX - touchStartX) > 10) {
        e.preventDefault()
      }
    })
  }

  // 同样的逻辑应用到界面预览
  if (screenshotsScrollRef.value) {
    let isDown = false
    let startX = 0
    let scrollLeft = 0

    screenshotsScrollRef.value.addEventListener('mousedown', (e) => {
      isDown = true
      startX = e.pageX - screenshotsScrollRef.value.offsetLeft
      scrollLeft = screenshotsScrollRef.value.scrollLeft
    })

    screenshotsScrollRef.value.addEventListener('mouseleave', () => {
      isDown = false
    })

    screenshotsScrollRef.value.addEventListener('mouseup', () => {
      isDown = false
    })

    screenshotsScrollRef.value.addEventListener('mousemove', (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - screenshotsScrollRef.value.offsetLeft
      const walk = (x - startX) * 2
      screenshotsScrollRef.value.scrollLeft = scrollLeft - walk
    })

    let touchStartX = 0
    screenshotsScrollRef.value.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
    })

    screenshotsScrollRef.value.addEventListener('touchmove', (e) => {
      if (Math.abs(e.touches[0].clientX - touchStartX) > 10) {
        e.preventDefault()
      }
    })
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #ffffff;
  scroll-behavior: smooth;
  padding-bottom: 0;
}

/* 顶部导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.header-content {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.logo-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
}

.menu-btn {
  font-size: 26px;
  color: #667eea;
  cursor: pointer;
  padding: 8px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.05);
}

.menu-btn:active {
  transform: scale(0.95);
  background: rgba(102, 126, 234, 0.15);
}

.mobile-menu {
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  border-top: 1px solid rgba(102, 126, 234, 0.15);
  padding: 12px 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.menu-item {
  display: block;
  padding: 16px 24px;
  color: #2d3748;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: rgba(102, 126, 234, 0.1);
  border-left: 3px solid transparent;
  position: relative;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.menu-item:active {
  background: rgba(102, 126, 234, 0.08);
  border-left-color: #667eea;
}

.menu-item:active::before {
  width: 4px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 主要内容 */
.main-content {
  margin-top: 60px;
}

/* Hero区域 */
.hero-section {
  padding: 60px 20px 48px;
  background: linear-gradient(160deg, #4c1d95 0%, #5b21b6 25%, #7c3aed 50%, #a855f7 75%, #c084fc 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%);
  border-radius: 50%;
  animation: pulse 4s ease-in-out infinite, float 8s ease-in-out infinite;
  filter: blur(40px);
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: -25%;
  left: -25%;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(192, 132, 252, 0.2) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%);
  border-radius: 50%;
  animation: pulse 5s ease-in-out infinite reverse, float 10s ease-in-out infinite reverse;
  filter: blur(50px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-30px) translateX(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 72px;
  font-weight: 900;
  margin-bottom: 20px;
  line-height: 1;
  letter-spacing: 8px;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(192, 132, 252, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out, glow 3s ease-in-out infinite;
  background: linear-gradient(180deg, #ffffff 0%, #e9d5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(192, 132, 252, 0.6));
  }
}

.hero-subtitle {
  font-size: 22px;
  margin-bottom: 16px;
  opacity: 0.95;
  font-weight: 600;
  letter-spacing: 3px;
  animation: fadeInUp 0.8s ease-out 0.15s both;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.hero-desc {
  font-size: 16px;
  margin-bottom: 32px;
  opacity: 0.92;
  line-height: 1.7;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease-out 0.3s both;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-weight: 400;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  animation: fadeInUp 0.8s ease-out 0.45s both;
}

.stat-item {
  text-align: center;
  min-width: 80px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.stat-number {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 4px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  line-height: 1;
  background: linear-gradient(180deg, #ffffff 0%, #f3e8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 11px;
  opacity: 0.85;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* 下载按钮区域 - 放在 Hero 区域内 */
.download-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 300px;
  margin: 0 auto;
  padding: 0;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.download-btn {
  width: 100%;
  padding: 11px 28px;
  border: none;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15);
  min-height: 46px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.download-btn-ios {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(243, 232, 255, 0.95) 100%);
  color: #6d28d9;
}

.download-btn-android {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.95) 100%);
  color: #ea580c;
}

.download-btn:active {
  transform: scale(0.97) translateY(1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2);
}

.download-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.download-btn:active::before {
  left: 100%;
}

.download-icon {
  font-size: 24px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.download-label {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.download-subtitle {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.65;
  margin-left: 5px;
  letter-spacing: 0.3px;
}

/* 功能特色 - 横向滑动 */
.features-section {
  padding: 48px 0;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  position: relative;
}

.features-section::after {
  content: '← 滑动查看更多 →';
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #999;
  opacity: 0.6;
  font-weight: 500;
}

.section-header {
  padding: 0 24px 24px;
}

.section-title {
  font-size: 26px;
  font-weight: 800;
  color: #2d3748;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.features-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 24px 32px;
  scroll-snap-type: x mandatory;
}

.features-scroll::-webkit-scrollbar {
  display: none;
}

.features-list {
  display: inline-flex;
  gap: 20px;
  padding-right: 24px;
}

.feature-card {
  background: white;
  padding: 28px 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-width: 300px;
  flex-shrink: 0;
  scroll-snap-align: start;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.feature-card:active {
  transform: scale(0.98);
  border-color: rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.feature-icon {
  font-size: 56px;
  margin-bottom: 20px;
  text-align: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2d3748;
  text-align: center;
  letter-spacing: 0.3px;
}

.feature-desc {
  font-size: 14px;
  color: #718096;
  margin-bottom: 18px;
  line-height: 1.6;
  text-align: center;
}

.feature-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-tag {
  font-size: 12px;
  color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
  padding: 6px 12px;
  border-radius: 14px;
  font-weight: 600;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* 界面预览 - 横向滑动 */
.screenshots-section {
  padding: 48px 0;
  background: white;
  position: relative;
}

.screenshots-section::after {
  content: '← 滑动查看更多 →';
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #999;
  opacity: 0.6;
  font-weight: 500;
}

.screenshots-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 24px 32px;
  scroll-snap-type: x mandatory;
}

.screenshots-scroll::-webkit-scrollbar {
  display: none;
}

.screenshots-list {
  display: inline-flex;
  gap: 24px;
  padding-right: 24px;
}

.screenshot-item {
  text-align: center;
  flex-shrink: 0;
  scroll-snap-align: start;
}

.screenshot-frame {
  width: 220px;
  aspect-ratio: 9/16;
  background: linear-gradient(145deg, #2d3748, #1a202c);
  border-radius: 24px;
  padding: 8px;
  margin-bottom: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
}

.screenshot-frame:active {
  transform: scale(0.98);
}

.screenshot-content {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.screenshot-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
}

.screenshot-label {
  font-size: 15px;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: 0.3px;
}

/* 版本信息 */
.version-section {
  padding: 48px 24px;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
}

.version-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.version-card:active {
  transform: scale(0.99);
  border-color: rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.version-info {
  flex: 1;
}

.version-number {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.version-date {
  font-size: 13px;
  color: #718096;
  font-weight: 600;
  display: inline-block;
  padding: 4px 10px;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 12px;
}

.version-toggle {
  font-size: 18px;
  color: #667eea;
  transition: all 0.3s ease;
  min-width: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 50%;
}

.version-toggle.expanded {
  transform: rotate(180deg);
  background: rgba(102, 126, 234, 0.15);
}

.version-description {
  font-size: 14px;
  color: #718096;
  line-height: 1.7;
}

.version-history {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
}

.version-item {
  padding: 20px 0;
  border-bottom: 1px solid rgba(102, 126, 234, 0.08);
}

.version-item:last-child {
  border-bottom: none;
}

.version-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.version-item-number {
  font-size: 17px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.version-item-date {
  font-size: 12px;
  color: #a0aec0;
  font-weight: 600;
}

.version-item-title {
  font-size: 15px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
}

.version-item-changes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.version-item-changes li {
  font-size: 13px;
  color: #718096;
  line-height: 1.8;
  padding-left: 20px;
  position: relative;
}

.version-item-changes li::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 9px;
  width: 5px;
  height: 5px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

/* 底部 */
.footer {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: white;
  padding: 40px 24px;
  margin-bottom: 0;
  border-top: 2px solid rgba(102, 126, 234, 0.2);
}

.footer-info {
  text-align: center;
}

.company-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.company-address {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 20px;
  line-height: 1.7;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-link-item {
  line-height: 1.7;
  font-weight: 500;
}
</style>
