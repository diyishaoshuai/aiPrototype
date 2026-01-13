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
          <div v-for="(item, index) in column1" :key="item.id" class="ranking-item">
            <div class="rank">{{ index + 1 }}</div>
            <div class="drama-info">
              <div class="drama-name">{{ item.name }}</div>
              <div class="drama-meta">{{ item.playCount }}</div>
            </div>
          </div>
        </div>

        <div class="ranking-column">
          <div v-for="(item, index) in column2" :key="item.id" class="ranking-item">
            <div class="rank">{{ index + 4 }}</div>
            <div class="drama-info">
              <div class="drama-name">{{ item.name }}</div>
              <div class="drama-meta">{{ item.playCount }}</div>
            </div>
          </div>
        </div>

        <div class="ranking-column">
          <div v-for="(item, index) in column3" :key="item.id" class="ranking-item">
            <div class="rank">{{ index + 7 }}</div>
            <div class="drama-info">
              <div class="drama-name">{{ item.name }}</div>
              <div class="drama-meta">{{ item.playCount }}</div>
            </div>
          </div>
        </div>

        <div class="ranking-column">
          <div v-for="(item, index) in column4" :key="item.id" class="ranking-item">
            <div class="rank">{{ index + 10 }}</div>
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
  { id: 1, name: '霸总的替身新娘', playCount: '1.2亿次播放' },
  { id: 2, name: '重生之豪门千金', playCount: '9800万次播放' },
  { id: 3, name: '穿越成王爷的小娇妻', playCount: '8500万次播放' },
  { id: 4, name: '都市修仙狂少', playCount: '7200万次播放' },
  { id: 5, name: '闪婚后大佬每天都在撒糖', playCount: '6800万次播放' },
  { id: 6, name: '神医毒妃不好惹', playCount: '6500万次播放' },
  { id: 7, name: '重生后我成了首富', playCount: '6200万次播放' },
  { id: 8, name: '豪门千金的复仇计划', playCount: '5800万次播放' },
  { id: 9, name: '穿书后我成了女配', playCount: '5500万次播放' },
  { id: 10, name: '王爷的小厨娘', playCount: '5200万次播放' },
  { id: 11, name: '闪婚后被大佬宠上天', playCount: '4900万次播放' },
  { id: 12, name: '重生之娱乐圈女王', playCount: '4600万次播放' }
]

const column1 = computed(() => rankingData.slice(0, 3))
const column2 = computed(() => rankingData.slice(3, 6))
const column3 = computed(() => rankingData.slice(6, 9))
const column4 = computed(() => rankingData.slice(9, 12))

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
  gap: 12px;
}

.rank {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  min-width: 24px;
}

.drama-info {
  flex: 1;
  min-width: 0;
}

.drama-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drama-meta {
  font-size: 12px;
  color: #999;
}
</style>
