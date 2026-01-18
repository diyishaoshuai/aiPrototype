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
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
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
}

.phone-frame {
  width: 300px;
  height: 600px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 40px;
  padding: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
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
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 64px;
  margin-bottom: 24px;
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

/* 底部 */
.footer {
  background: #2d3748;
  color: white;
  padding: 40px 32px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-info {
  text-align: center;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.company-address {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .screenshots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .nav {
    display: none;
  }

  .features-grid,
  .screenshots-grid {
    grid-template-columns: 1fr;
  }
}
</style>
