<template>
  <div class="ranking-section">
    <div class="ranking-header">
      <h3 class="title">短剧排行榜</h3>
      <div class="more" @click="$emit('more')">查看更多 ›</div>
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

    <div class="ranking-list-wrapper">
      <div class="ranking-list" ref="listRef">
        <div class="ranking-column">
          <div v-for="(item, index) in column1" :key="item.id" class="ranking-item" @click="goToDrama(item.id)">
            <div class="drama-cover" :style="{ background: item.gradient }">
              <div class="cover-emoji">{{ item.emoji }}</div>
              <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
            </div>
            <div class="drama-info">
              <div class="drama-name">{{ item.name }}</div>
              <div class="drama-meta">{{ item.playCount }}</div>
            </div>
          </div>
        </div>

        <div class="ranking-column">
          <div v-for="(item, index) in column2" :key="item.id" class="ranking-item" @click="goToDrama(item.id)">
            <div class="drama-cover" :style="{ background: item.gradient }">
              <div class="cover-emoji">{{ item.emoji }}</div>
              <div class="rank-badge" :class="'rank-' + (index + 4)">{{ index + 4 }}</div>
            </div>
            <div class="drama-info">
              <div class="drama-name">{{ item.name }}</div>
              <div class="drama-meta">{{ item.playCount }}</div>
            </div>
          </div>
        </div>

        <div class="ranking-column">
          <div v-for="(item, index) in column3" :key="item.id" class="ranking-item" @click="goToDrama(item.id)">
            <div class="drama-cover" :style="{ background: item.gradient }">
              <div class="cover-emoji">{{ item.emoji }}</div>
              <div class="rank-badge" :class="'rank-' + (index + 7)">{{ index + 7 }}</div>
            </div>
            <div class="drama-info">
              <div class="drama-name">{{ item.name }}</div>
              <div class="drama-meta">{{ item.playCount }}</div>
            </div>
          </div>
        </div>

        <div class="ranking-column">
          <div v-for="(item, index) in column4" :key="item.id" class="ranking-item" @click="goToDrama(item.id)">
            <div class="drama-cover" :style="{ background: item.gradient }">
              <div class="cover-emoji">{{ item.emoji }}</div>
              <div class="rank-badge" :class="'rank-' + (index + 10)">{{ index + 10 }}</div>
            </div>
            <div class="drama-info">
              <div class="drama-name">{{ item.name }}</div>
              <div class="drama-meta">{{ item.playCount }}</div>
            </div>
          </div>
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

const rankingData = [
  { id: 1, name: '霸总的替身新娘', playCount: '热度1.2亿', emoji: '💼', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: '重生之豪门千金', playCount: '热度9800万', emoji: '👑', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, name: '穿越成王爷的小娇妻', playCount: '热度8500万', emoji: '🏯', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, name: '都市修仙狂少', playCount: '热度7200万', emoji: '⚡', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 5, name: '闪婚后大佬每天都在撒糖', playCount: '热度6800万', emoji: '💕', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 6, name: '神医毒妃不好惹', playCount: '热度6500万', emoji: '💊', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { id: 7, name: '重生后我成了首富', playCount: '热度6200万', emoji: '💰', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 8, name: '豪门千金的复仇计划', playCount: '热度5800万', emoji: '🔥', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { id: 9, name: '穿书后我成了女配', playCount: '热度5500万', emoji: '📖', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 10, name: '王爷的小厨娘', playCount: '热度5200万', emoji: '🍜', gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)' },
  { id: 11, name: '闪婚后被大佬宠上天', playCount: '热度4900万', emoji: '💝', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { id: 12, name: '重生之娱乐圈女王', playCount: '热度4600万', emoji: '🎬', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
]

const column1 = computed(() => rankingData.slice(0, 3))
const column2 = computed(() => rankingData.slice(3, 6))
const column3 = computed(() => rankingData.slice(6, 9))
const column4 = computed(() => rankingData.slice(9, 12))

// 跳转到短剧播放页面
const goToDrama = (dramaId) => {
  router.push(`/drama/${dramaId}`)
}

defineEmits(['more'])
</script>

<style scoped>
.ranking-section {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.more {
  font-size: 13px;
  color: #999;
  cursor: pointer;
}

.ranking-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.ranking-tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 6px 16px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab.active {
  background: #667eea;
  color: white;
}

.ranking-list-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.ranking-list-wrapper::-webkit-scrollbar {
  display: none;
}

.ranking-list {
  display: flex;
  gap: 12px;
}

.ranking-column {
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.ranking-item:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

.ranking-item:active {
  transform: scale(0.98);
}

.drama-cover {
  position: relative;
  width: 50px;
  height: 70px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cover-emoji {
  font-size: 28px;
}

.rank-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

/* 前三名特殊颜色 */
.rank-badge.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #808080);
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
}

/* 其他排名使用紫色 */
.rank-badge.rank-4,
.rank-badge.rank-5,
.rank-badge.rank-6,
.rank-badge.rank-7,
.rank-badge.rank-8,
.rank-badge.rank-9,
.rank-badge.rank-10,
.rank-badge.rank-11,
.rank-badge.rank-12 {
  background: #667eea;
}

.drama-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.drama-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  max-height: 2.6em;
  word-break: break-all;
}

.drama-meta {
  font-size: 11px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
