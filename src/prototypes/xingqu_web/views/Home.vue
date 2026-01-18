<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">⭐</div>
          <span class="logo-text">星趣</span>
        </div>
        <nav class="nav">
          <a href="#features" class="nav-item" @click.prevent="scrollToSection('features')">功能特色</a>
          <a href="#screenshots" class="nav-item" @click.prevent="scrollToSection('screenshots')">界面预览</a>
          <a href="#version" class="nav-item" @click.prevent="scrollToSection('version')">版本信息</a>
        </nav>
      </div>
    </header>

    <!-- Hero区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">星趣 - 你的直播社交平台</h1>
          <p class="hero-desc">
            汇聚精彩直播、语音互动、短剧娱乐、动态分享<br/>
            打造全新的社交娱乐体验
          </p>
          <div class="hero-buttons">
            <button class="btn-ios" @click="downloadIOS">
              <span class="btn-icon">🍎</span>
              iOS下载
            </button>
            <button class="btn-android" @click="downloadAndroid">
              <span class="btn-icon">🤖</span>
              Android下载
            </button>
          </div>
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
        </div>
        <div class="hero-phone">
          <div class="phone-frame">
            <div class="phone-screen">
              <div class="app-preview">
                <div class="preview-placeholder"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特色 -->
    <section class="features-section" id="features">
      <div class="section-container">
        <h2 class="section-title">核心功能</h2>
        <p class="section-desc">丰富多样的社交娱乐体验</p>
        <div class="features-grid">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
            <div class="feature-highlights">
              <div
                v-for="highlight in feature.highlights"
                :key="highlight"
                class="highlight-item"
              >
                <span class="highlight-dot">•</span>
                {{ highlight }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 界面预览 -->
    <section class="screenshots-section" id="screenshots">
      <div class="section-container">
        <h2 class="section-title">界面预览</h2>
        <p class="section-desc">精美的UI设计，流畅的交互体验</p>
        <div class="screenshots-grid">
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

    <!-- 版本信息 -->
    <section class="version-section" id="version">
      <div class="section-container">
        <h2 class="section-title">版本信息</h2>
        <div class="version-content">
          <!-- 当前版本 -->
          <div class="current-version">
            <div class="version-header" @click="toggleVersionHistory">
              <div class="version-info">
                <div class="version-number">当前版本: v{{ currentVersion.version }}</div>
                <div class="version-date">{{ currentVersion.date }}</div>
              </div>
              <div class="version-toggle" :class="{ expanded: showVersionHistory }">
                <span>▼</span>
              </div>
            </div>
            <div class="version-description">{{ currentVersion.description }}</div>
          </div>

          <!-- 版本历史 -->
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
              <div class="version-item-content">
                <div class="version-item-title">{{ version.title }}</div>
                <ul class="version-item-changes">
                  <li v-for="(change, idx) in version.changes" :key="idx">{{ change }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <div class="company-name">重庆共进互娱网络科技有限公司</div>
          <div class="company-address">重庆市沙坪坝区梨树湾工业园7号2-A1、2-A1-1</div>
          <div class="footer-links">
            <span>客服邮箱: <a href="mailto:xqlive8866@163.com">xqlive8866@163.com</a></span>
            <span>ICP: <a href="#">渝B2-20250981</a></span>
            <span>文化部全国举报电话: <a href="tel:12318">12318</a></span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showVersionHistory = ref(false)

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

const toggleVersionHistory = () => {
  showVersionHistory.value = !showVersionHistory.value
}

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
  // TODO: iOS下载逻辑
  console.log('iOS下载')
}

const downloadAndroid = () => {
  // TODO: Android下载逻辑
  console.log('Android下载')
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 80 // 顶部导航栏高度
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #ffffff;
  scroll-behavior: smooth;
}

/* 顶部导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
}

.logo-icon {
  font-size: 32px;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #ff6b6b;
}

/* Hero区域 */
.hero-section {
  padding: 120px 32px 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  animation: fadeInUp 0.8s ease-out;
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

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 24px;
  line-height: 1.2;
}

.hero-desc {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.95;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

.btn-ios,
.btn-android {
  padding: 16px 32px;
  border: none;
  border-radius: 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-ios {
  background: white;
  color: #667eea;
}

.btn-android {
  background: white;
  color: #ff6b6b;
}

.btn-ios:hover,
.btn-android:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.hero-stats {
  display: flex;
  gap: 48px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.hero-phone {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInRight 0.8s ease-out 0.3s both;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.phone-frame {
  width: 300px;
  height: 600px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 40px;
  padding: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
  animation: phoneFloat 3s ease-in-out infinite;
}

@keyframes phoneFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
}

.app-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 30px;
}

/* 功能特色 */
.features-section {
  padding: 80px 32px;
  background: #f8f9fa;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  color: #333;
}

.section-desc {
  font-size: 18px;
  text-align: center;
  color: #666;
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.feature-card {
  background: white;
  padding: 40px 32px;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.2);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  font-size: 64px;
  margin-bottom: 24px;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.feature-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.feature-highlights {
  text-align: left;
}

.highlight-item {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.highlight-dot {
  color: #ff6b6b;
  font-weight: bold;
}

/* 界面预览 */
.screenshots-section {
  padding: 80px 32px;
  background: white;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.screenshot-item {
  text-align: center;
}

.screenshot-frame {
  width: 100%;
  aspect-ratio: 9/16;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 24px;
  padding: 8px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.screenshot-content {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screenshot-placeholder {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 16px;
}

.screenshot-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 版本信息 */
.version-section {
  padding: 80px 32px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
}

.version-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

.version-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  right: -5%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 10s ease-in-out infinite reverse;
}

.version-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.current-version {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 20px;
  padding: 36px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(102, 126, 234, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.current-version::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.current-version:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.18), 0 4px 12px rgba(0, 0, 0, 0.06);
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 16px;
  user-select: none;
}

.version-info {
  flex: 1;
}

.version-number {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.version-date {
  font-size: 14px;
  color: #8b92a8;
  font-weight: 500;
  display: inline-block;
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 12px;
}

.version-toggle {
  font-size: 20px;
  color: #667eea;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 50%;
}

.version-toggle:hover {
  background: rgba(102, 126, 234, 0.15);
  transform: scale(1.1);
}

.version-toggle.expanded {
  transform: rotate(180deg);
  background: rgba(102, 126, 234, 0.15);
}

.version-toggle.expanded:hover {
  transform: rotate(180deg) scale(1.1);
}

.version-description {
  font-size: 15px;
  color: #5a6376;
  line-height: 1.8;
  padding-top: 20px;
  border-top: 2px solid transparent;
  border-image: linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-image-slice: 1;
  position: relative;
}

.version-history {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(102, 126, 234, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.version-history::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(102, 126, 234, 0.4) 20%,
    rgba(118, 75, 162, 0.4) 50%,
    rgba(102, 126, 234, 0.4) 80%,
    transparent 100%
  );
}

.version-item {
  padding: 28px 0;
  border-bottom: 1px solid rgba(102, 126, 234, 0.08);
  position: relative;
  transition: all 0.3s ease;
}

.version-item:hover {
  padding-left: 12px;
  background: rgba(102, 126, 234, 0.02);
  border-radius: 12px;
  margin: 0 -12px;
  padding-right: 12px;
}

.version-item:last-child {
  border-bottom: none;
}

.version-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.version-item-number {
  font-size: 19px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  padding-left: 24px;
}

.version-item-number::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.version-item-date {
  font-size: 13px;
  color: #8b92a8;
  font-weight: 500;
  padding: 3px 10px;
  background: rgba(102, 126, 234, 0.06);
  border-radius: 10px;
}

.version-item-title {
  font-size: 17px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 14px;
  letter-spacing: 0.2px;
}

.version-item-changes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.version-item-changes li {
  font-size: 14px;
  color: #5a6376;
  line-height: 1.8;
  padding-left: 24px;
  position: relative;
  transition: all 0.2s ease;
}

.version-item-changes li:hover {
  color: #2d3748;
  padding-left: 28px;
}

.version-item-changes li::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 10px;
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.version-item-changes li:hover::before {
  transform: scale(1.3);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

/* 底部 */
.footer {
  background: #1a1d29;
  color: white;
  padding: 48px 32px 32px;
  border-top: 1px solid rgba(102, 126, 234, 0.15);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-info {
  text-align: center;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.company-address {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.footer-links span {
  transition: color 0.2s ease;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  pointer-events: none;
  cursor: default;
}

.footer-links span:hover {
  color: rgba(255, 255, 255, 0.8);
}

/* 响应式设计 */

/* 平板设备 (768px - 968px) */
@media (max-width: 968px) {
  .header-content {
    padding: 0 24px;
  }

  .hero-section {
    padding: 100px 24px 60px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .hero-title {
    font-size: 40px;
  }

  .hero-desc {
    font-size: 18px;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .phone-frame {
    width: 260px;
    height: 520px;
  }

  .features-section,
  .screenshots-section,
  .version-section {
    padding: 60px 24px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .screenshots-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .section-title {
    font-size: 32px;
  }

  .footer {
    padding: 40px 24px 28px;
  }
}

/* 手机设备 (最大 640px) */
@media (max-width: 640px) {
  /* 导航栏优化 */
  .header {
    padding: 12px 0;
  }

  .header-content {
    padding: 0 16px;
  }

  .logo {
    font-size: 20px;
  }

  .logo-icon {
    font-size: 28px;
  }

  .nav {
    display: none;
  }

  /* Hero 区域优化 */
  .hero-section {
    padding: 80px 16px 50px;
  }

  .hero-content {
    gap: 32px;
  }

  .hero-title {
    font-size: 32px;
    margin-bottom: 20px;
    line-height: 1.3;
  }

  .hero-desc {
    font-size: 16px;
    margin-bottom: 28px;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .btn-ios,
  .btn-android {
    width: 100%;
    padding: 14px 24px;
    font-size: 15px;
    justify-content: center;
    min-height: 48px;
  }

  .hero-stats {
    gap: 24px;
    flex-wrap: wrap;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-label {
    font-size: 13px;
  }

  .phone-frame {
    width: 220px;
    height: 440px;
  }

  /* 功能特色优化 */
  .features-section,
  .screenshots-section,
  .version-section {
    padding: 50px 16px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 12px;
  }

  .section-desc {
    font-size: 16px;
    margin-bottom: 36px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 32px 24px;
  }

  .feature-icon {
    font-size: 56px;
    margin-bottom: 20px;
  }

  .feature-title {
    font-size: 20px;
  }

  .feature-desc {
    font-size: 14px;
  }

  /* 界面预览优化 */
  .screenshots-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .screenshot-frame {
    max-width: 280px;
    margin: 0 auto;
  }

  .screenshot-label {
    font-size: 15px;
  }

  /* 版本信息优化 */
  .current-version,
  .version-history {
    padding: 24px;
    border-radius: 16px;
  }

  .version-number {
    font-size: 22px;
  }

  .version-date {
    font-size: 13px;
    padding: 3px 10px;
  }

  .version-toggle {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }

  .version-description {
    font-size: 14px;
    padding-top: 16px;
  }

  .version-item {
    padding: 20px 0;
  }

  .version-item-number {
    font-size: 17px;
    padding-left: 20px;
  }

  .version-item-number::before {
    width: 10px;
    height: 10px;
  }

  .version-item-date {
    font-size: 12px;
  }

  .version-item-title {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .version-item-changes li {
    font-size: 13px;
    padding-left: 20px;
  }

  /* 底部优化 */
  .footer {
    padding: 36px 16px 24px;
  }

  .company-name {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .company-address {
    font-size: 12px;
    margin-bottom: 16px;
  }

  .footer-links {
    font-size: 12px;
    gap: 6px;
  }
}
</style>
