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
    </div>

    <div class="footer">
      <button class="confirm-btn" @click="confirm">确定</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const types = ['全部', '逆袭', '都市', '言情', '高甜', '古风', '穿越', '悬疑', '年代', '其他']
const genders = ['全部', '男生', '女生']
const watchStatus = ['全部', '未看过']
const sortOptions = ['推荐', '最新']

const selectedType = ref('全部')
const selectedGender = ref('全部')
const selectedStatus = ref('全部')
const selectedSort = ref('推荐')

const reset = () => {
  selectedType.value = '全部'
  selectedGender.value = '全部'
  selectedStatus.value = '全部'
  selectedSort.value = '推荐'
}

const confirm = () => {
  router.back()
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
  padding: 60px 16px 80px;
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

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.confirm-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>
