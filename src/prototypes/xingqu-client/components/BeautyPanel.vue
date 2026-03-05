<template>
  <div v-if="visible" class="beauty-panel-overlay" @click="handleClose">
    <div class="beauty-panel" @click.stop>
      <div class="panel-header">
        <h3 class="panel-title">美颜设置</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <div class="panel-content">
        <!-- 美颜效果 -->
        <div class="beauty-section">
          <h4 class="section-title">美颜效果</h4>
          <div class="beauty-items">
            <div class="beauty-item">
              <div class="item-header">
                <span class="item-label">磨皮</span>
                <span class="item-value">{{ beautySettings.smooth }}</span>
              </div>
              <input
                v-model.number="beautySettings.smooth"
                type="range"
                min="0"
                max="100"
                class="beauty-slider"
              />
            </div>

            <div class="beauty-item">
              <div class="item-header">
                <span class="item-label">美白</span>
                <span class="item-value">{{ beautySettings.whiten }}</span>
              </div>
              <input
                v-model.number="beautySettings.whiten"
                type="range"
                min="0"
                max="100"
                class="beauty-slider"
              />
            </div>

            <div class="beauty-item">
              <div class="item-header">
                <span class="item-label">锐化</span>
                <span class="item-value">{{ beautySettings.sharpen }}</span>
              </div>
              <input
                v-model.number="beautySettings.sharpen"
                type="range"
                min="0"
                max="100"
                class="beauty-slider"
              />
            </div>
          </div>
        </div>

        <!-- 美型效果 -->
        <div class="beauty-section">
          <h4 class="section-title">美型效果</h4>
          <div class="beauty-items">
            <div class="beauty-item">
              <div class="item-header">
                <span class="item-label">瘦脸</span>
                <span class="item-value">{{ beautySettings.thinFace }}</span>
              </div>
              <input
                v-model.number="beautySettings.thinFace"
                type="range"
                min="0"
                max="100"
                class="beauty-slider"
              />
            </div>

            <div class="beauty-item">
              <div class="item-header">
                <span class="item-label">大眼</span>
                <span class="item-value">{{ beautySettings.bigEye }}</span>
              </div>
              <input
                v-model.number="beautySettings.bigEye"
                type="range"
                min="0"
                max="100"
                class="beauty-slider"
              />
            </div>

            <div class="beauty-item">
              <div class="item-header">
                <span class="item-label">小脸</span>
                <span class="item-value">{{ beautySettings.smallFace }}</span>
              </div>
              <input
                v-model.number="beautySettings.smallFace"
                type="range"
                min="0"
                max="100"
                class="beauty-slider"
              />
            </div>

            <div class="beauty-item">
              <div class="item-header">
                <span class="item-label">窄脸</span>
                <span class="item-value">{{ beautySettings.narrowFace }}</span>
              </div>
              <input
                v-model.number="beautySettings.narrowFace"
                type="range"
                min="0"
                max="100"
                class="beauty-slider"
              />
            </div>
          </div>
        </div>

        <!-- 滤镜效果 -->
        <div class="beauty-section">
          <h4 class="section-title">滤镜效果</h4>
          <div class="filter-list">
            <div
              v-for="filter in filters"
              :key="filter.id"
              class="filter-item"
              :class="{ active: selectedFilter === filter.id }"
              @click="selectFilter(filter.id)"
            >
              <div class="filter-preview" :style="{ background: filter.color }">
                <span class="filter-icon">{{ filter.icon }}</span>
              </div>
              <span class="filter-name">{{ filter.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <button class="reset-btn" @click="resetSettings">重置</button>
        <button class="apply-btn" @click="applySettings">应用</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'apply'])

// 美颜设置
const beautySettings = reactive({
  smooth: 50,      // 磨皮
  whiten: 30,      // 美白
  sharpen: 20,     // 锐化
  thinFace: 40,    // 瘦脸
  bigEye: 35,      // 大眼
  smallFace: 30,   // 小脸
  narrowFace: 25   // 窄脸
})

// 滤镜列表
const filters = ref([
  { id: 'none', name: '无', icon: '🚫', color: 'linear-gradient(135deg, #666, #999)' },
  { id: 'natural', name: '自然', icon: '🌿', color: 'linear-gradient(135deg, #a8e6cf, #dcedc1)' },
  { id: 'pink', name: '粉嫩', icon: '🌸', color: 'linear-gradient(135deg, #ffd3e1, #ffc4d6)' },
  { id: 'fresh', name: '清新', icon: '🍃', color: 'linear-gradient(135deg, #c1f0c1, #a8e6cf)' },
  { id: 'warm', name: '暖阳', icon: '☀️', color: 'linear-gradient(135deg, #ffd89b, #ffb88c)' },
  { id: 'cool', name: '冷色', icon: '❄️', color: 'linear-gradient(135deg, #a8d8ea, #c1e7ff)' }
])

const selectedFilter = ref('none')

const handleClose = () => {
  emit('close')
}

const selectFilter = (filterId) => {
  selectedFilter.value = filterId
}

const resetSettings = () => {
  beautySettings.smooth = 50
  beautySettings.whiten = 30
  beautySettings.sharpen = 20
  beautySettings.thinFace = 40
  beautySettings.bigEye = 35
  beautySettings.smallFace = 30
  beautySettings.narrowFace = 25
  selectedFilter.value = 'none'
}

const applySettings = () => {
  emit('apply', {
    ...beautySettings,
    filter: selectedFilter.value
  })
  handleClose()
}
</script>

<style scoped>
.beauty-panel-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.beauty-panel {
  width: min(90vw, 90%, 500px);
  max-width: 500px;
  max-height: min(80vh, 600px);
  background: #1b1d27;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.panel-header::after {
  display: none;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #c6c9d1;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(0);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.beauty-section {
  margin-bottom: 20px;
}

.beauty-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #c6c9d1;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.beauty-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.beauty-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.item-value {
  font-size: 13px;
  color: #ff4081;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.beauty-slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(236, 64, 122, 0.3), rgba(255, 64, 129, 0.2));
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.beauty-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec407a, #ff4081);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.6);
}

.beauty-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 20px rgba(236, 64, 122, 1);
}

.filter-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.6), rgba(22, 33, 62, 0.4));
  border: 1px solid rgba(236, 64, 122, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.filter-item.active {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
}

.filter-preview {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.filter-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.panel-footer::before {
  display: none;
}

.reset-btn,
.apply-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.apply-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1px solid #667eea;
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(26, 26, 46, 0.5);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(236, 64, 122, 0.6), rgba(255, 64, 129, 0.4));
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(236, 64, 122, 0.5);
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(236, 64, 122, 0.8), rgba(255, 64, 129, 0.6));
}
</style>
