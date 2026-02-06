<template>
  <div class="beauty-panel">
    <h3 class="section-title">🎨 美颜特效</h3>

    <div class="control-group">
      <label class="control-label">美颜强度</label>
      <div class="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          :value="intensity"
          @input="updateIntensity"
          class="slider"
        />
        <span class="slider-value">{{ intensity }}</span>
      </div>
    </div>

    <div class="control-group">
      <label class="control-label">滤镜</label>
      <div class="filter-options">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-btn"
          :class="{ active: filter === f.value }"
          @click="updateFilter(f.value)"
        >
          {{ f.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  intensity: Number,
  filter: String
})

const emit = defineEmits(['update:intensity', 'update:filter'])

const filters = [
  { label: '原图', value: 'none' },
  { label: '清新', value: 'fresh' },
  { label: '复古', value: 'retro' },
  { label: '黑白', value: 'blackwhite' }
]

const updateIntensity = (e) => {
  emit('update:intensity', parseInt(e.target.value))
}

const updateFilter = (value) => {
  emit('update:filter', value)
}
</script>

<style scoped>
.beauty-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  border: none;
}

.slider-value {
  min-width: 32px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  text-align: right;
}

.filter-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.filter-btn {
  padding: 8px 12px;
  border: 1.5px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
