<template>
  <div class="ranking-page">
    <div class="header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1 class="title">短剧排行榜</h1>
      <div class="placeholder"></div>
    </div>

    <div class="ranking-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: tab.id === activeTab }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="update-time">
      更新时间：{{ updateTime }}
    </div>

    <div class="ranking-list">
      <div
        v-for="(drama, index) in rankingList"
        :key="drama.id"
        class="ranking-item"
        @click="goToDetail(drama.id)"
      >
        <div class="cover-wrapper">
          <div class="cover" :style="{ background: drama.gradient }">
            {{ drama.emoji }}
          </div>
          <div class="rank-badge" :class="getRankClass(index + 1)">
            {{ index + 1 }}
          </div>
        </div>

        <div class="drama-info">
          <div class="drama-name">{{ drama.name }}</div>
          <div class="drama-meta">
            <span class="play-count">{{ drama.playCount }}</span>
            <span class="type">{{ drama.type }}</span>
            <span class="episodes">{{ drama.episodes }}集</span>
          </div>
        </div>

        <div class="hot-value">
          🔥 {{ drama.hotValue }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('hot')

const tabs = [
  { id: 'hot', label: '热播榜' },
  { id: 'counterattack', label: '逆袭榜' },
  { id: 'urban', label: '都市榜' },
  { id: 'romance', label: '言情榜' },
  { id: 'sweet', label: '高甜榜' },
  { id: 'ancient', label: '古风榜' },
  { id: 'time-travel', label: '穿越榜' },
  { id: 'mystery', label: '悬疑榜' },
  { id: 'period', label: '年代榜' }
]

// 更新时间
const updateTime = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

// 排行榜数据（20条）
const rankingList = ref([
  { id: 1, name: '霸总的替身新娘', type: '都市', episodes: 80, playCount: '1.2亿', hotValue: '985000', emoji: '💼', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: '重生之豪门千金', type: '逆袭', episodes: 60, playCount: '9800万', hotValue: '952000', emoji: '👑', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, name: '穿越成王爷的小娇妻', type: '穿越', episodes: 70, playCount: '8500万', hotValue: '928000', emoji: '🏯', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, name: '都市修仙狂少', type: '都市', episodes: 90, playCount: '7200万', hotValue: '893000', emoji: '⚡', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 5, name: '闪婚后大佬每天都在撒糖', type: '言情', episodes: 50, playCount: '6800万', hotValue: '867000', emoji: '💕', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 6, name: '神医毒妃不好惹', type: '古风', episodes: 75, playCount: '6500万', hotValue: '834000', emoji: '💊', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { id: 7, name: '重生后我成了首富', type: '逆袭', episodes: 65, playCount: '6200万', hotValue: '801000', emoji: '💰', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 8, name: '豪门千金的复仇计划', type: '都市', episodes: 55, playCount: '5800万', hotValue: '768000', emoji: '🔥', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { id: 9, name: '穿书后我成了女配', type: '穿越', episodes: 60, playCount: '5500万', hotValue: '735000', emoji: '📖', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 10, name: '王爷的小厨娘', type: '古风', episodes: 52, playCount: '5200万', hotValue: '702000', emoji: '🍜', gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' },
  { id: 11, name: '闪婚后被大佬宠上天', type: '言情', episodes: 48, playCount: '4900万', hotValue: '669000', emoji: '💝', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { id: 12, name: '重生之娱乐圈女王', type: '逆袭', episodes: 72, playCount: '4600万', hotValue: '636000', emoji: '👸', gradient: 'linear-gradient(135deg, #f8b500 0%, #fceabb 100%)' },
  { id: 13, name: '甜宠日常', type: '高甜', episodes: 45, playCount: '4300万', hotValue: '603000', emoji: '🍬', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
  { id: 14, name: '悬疑探案录', type: '悬疑', episodes: 70, playCount: '4000万', hotValue: '570000', emoji: '🔍', gradient: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)' },
  { id: 15, name: '年代情缘', type: '年代', episodes: 80, playCount: '3700万', hotValue: '537000', emoji: '📻', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { id: 16, name: '霸总的小娇妻', type: '都市', episodes: 58, playCount: '3400万', hotValue: '504000', emoji: '💎', gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' },
  { id: 17, name: '穿越之锦绣良缘', type: '穿越', episodes: 66, playCount: '3100万', hotValue: '471000', emoji: '🎋', gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
  { id: 18, name: '古风美人心计', type: '古风', episodes: 74, playCount: '2800万', hotValue: '438000', emoji: '🌸', gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)' },
  { id: 19, name: '都市爱情故事', type: '都市', episodes: 50, playCount: '2500万', hotValue: '405000', emoji: '🌆', gradient: 'linear-gradient(135deg, #74b9ff 0%, #a29bfe 100%)' },
  { id: 20, name: '逆袭人生', type: '逆袭', episodes: 62, playCount: '2200万', hotValue: '372000', emoji: '🚀', gradient: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)' }
])

// 获取排名样式类
const getRankClass = (rank) => {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return 'rank-default'
}

const goToDetail = (id) => {
  router.push({ name: 'DramaPlayer', params: { id } })
}
</script>

<style scoped>
.ranking-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 16px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.back-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #667eea;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.placeholder {
  width: 20px;
}

.ranking-tabs {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  z-index: 40;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.ranking-tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 6px 16px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab.active {
  background: #667eea;
  color: white;
}

.update-time {
  margin-top: 108px;
  padding: 12px 16px;
  font-size: 13px;
  color: #999;
  text-align: center;
}

.ranking-list {
  padding: 0 16px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.ranking-item:active {
  transform: scale(0.98);
}

.cover-wrapper {
  position: relative;
  width: 80px;
  height: 100px;
  flex-shrink: 0;
}

.cover {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

.rank-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #d4a574 100%);
}

.rank-default {
  background: #333;
}

.drama-info {
  flex: 1;
  min-width: 0;
}

.drama-name {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drama-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.hot-value {
  font-size: 14px;
  font-weight: bold;
  color: #ff6b6b;
  white-space: nowrap;
}
</style>
