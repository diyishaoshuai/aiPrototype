<template>
  <div class="filter-page">
    <div class="header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h1 class="title">筛选</h1>
      <button class="reset-btn" @click="reset">重置</button>
    </div>

    <div class="filter-content">
      <!-- 类型筛选 -->
      <div class="filter-section">
        <div class="filter-row">
          <div
            v-for="item in types"
            :key="item"
            class="filter-item"
            :class="{ active: selectedType === item }"
            @click="selectedType = item"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 性别筛选 -->
      <div class="filter-section">
        <div class="filter-row">
          <div
            v-for="item in genders"
            :key="item"
            class="filter-item"
            :class="{ active: selectedGender === item }"
            @click="selectedGender = item"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 观看状态筛选 -->
      <div class="filter-section">
        <div class="filter-row">
          <div
            v-for="item in watchStatus"
            :key="item"
            class="filter-item"
            :class="{ active: selectedStatus === item }"
            @click="selectedStatus = item"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 排序方式 -->
      <div class="filter-section">
        <div class="filter-row">
          <div
            v-for="item in sortOptions"
            :key="item"
            class="filter-item"
            :class="{ active: selectedSort === item }"
            @click="selectedSort = item"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 筛选结果展示 -->
      <div class="results-section">
        <div class="drama-grid">
          <DramaCard
            v-for="drama in filteredDramas"
            :key="drama.id"
            :drama="drama"
            @click="goToDetail"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DramaCard from '../components/DramaCard.vue'

const router = useRouter()

const types = ['全部', '逆袭', '都市', '言情', '高甜', '古风', '穿越', '悬疑', '年代', '其他']
const genders = ['全部', '男生', '女生']
const watchStatus = ['全部', '未看过']
const sortOptions = ['推荐', '最新']

const selectedType = ref('全部')
const selectedGender = ref('全部')
const selectedStatus = ref('全部')
const selectedSort = ref('推荐')

// 所有短剧数据
const allDramas = ref([
  { id: 1, name: '霸总的替身新娘', type: '都市', episodes: 80, playCount: '1.2亿次播放', emoji: '💼', isNew: true },
  { id: 2, name: '重生之豪门千金', type: '逆袭', episodes: 60, playCount: '9800万次播放', emoji: '👑', isNew: true },
  { id: 3, name: '穿越成王爷的小娇妻', type: '穿越', episodes: 70, playCount: '8500万次播放', emoji: '🏯', isNew: false },
  { id: 4, name: '都市修仙狂少', type: '都市', episodes: 90, playCount: '7200万次播放', emoji: '⚡', isNew: false },
  { id: 5, name: '闪婚后大佬每天都在撒糖', type: '言情', episodes: 50, playCount: '6800万次播放', emoji: '💕', isNew: true },
  { id: 6, name: '神医毒妃不好惹', type: '古风', episodes: 75, playCount: '6500万次播放', emoji: '💊', isNew: false },
  { id: 7, name: '重生后我成了首富', type: '逆袭', episodes: 65, playCount: '6200万次播放', emoji: '💰', isNew: false },
  { id: 8, name: '豪门千金的复仇计划', type: '都市', episodes: 55, playCount: '5800万次播放', emoji: '🔥', isNew: false },
  { id: 9, name: '穿书后我成了女配', type: '穿越', episodes: 60, playCount: '5500万次播放', emoji: '📖', isNew: true },
  { id: 10, name: '甜宠日常', type: '高甜', episodes: 45, playCount: '5000万次播放', emoji: '🍬', isNew: true },
  { id: 11, name: '悬疑探案录', type: '悬疑', episodes: 70, playCount: '4800万次播放', emoji: '🔍', isNew: false },
  { id: 12, name: '年代情缘', type: '年代', episodes: 80, playCount: '4500万次播放', emoji: '📻', isNew: false }
])

const reset = () => {
  selectedType.value = '全部'
  selectedGender.value = '全部'
  selectedStatus.value = '全部'
  selectedSort.value = '推荐'
}

// 筛选后的短剧列表
const filteredDramas = computed(() => {
  let result = allDramas.value

  // 按类型筛选
  if (selectedType.value !== '全部') {
    result = result.filter(drama => drama.type === selectedType.value)
  }

  // 按排序方式排序
  if (selectedSort.value === '最新') {
    result = [...result].reverse()
  }

  return result
})

const goToDetail = (id) => {
  router.push({ name: 'DramaPlayer', params: { id } })
}
</script>

<style scoped>
.filter-page {
  background: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.back-btn, .reset-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #667eea;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.filter-content {
  flex: 1;
  padding: 60px 16px 16px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.filter-section {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-item.active {
  background: #667eea;
  color: white;
}

.results-section {
  margin-top: 16px;
}

.drama-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
</style>
