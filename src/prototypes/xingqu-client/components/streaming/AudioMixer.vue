<template>
  <div class="audio-mixer">
    <h3 class="section-title">🎤 音频设置</h3>

    <div class="control-group">
      <label class="control-label">麦克风</label>
      <select v-model="selectedMic" class="audio-select">
        <option value="">选择麦克风</option>
        <option v-for="mic in microphones" :key="mic.deviceId" :value="mic.deviceId">
          {{ mic.label || `麦克风 ${mic.deviceId.slice(0, 8)}` }}
        </option>
      </select>
    </div>

    <div class="control-group">
      <label class="control-label">音量</label>
      <div class="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          :value="volume"
          @input="updateVolume"
          class="slider"
        />
        <span class="slider-value">{{ volume }}</span>
      </div>
    </div>

    <div class="control-group">
      <label class="switch-container">
        <input
          type="checkbox"
          :checked="noiseReduction"
          @change="updateNoiseReduction"
          class="switch-input"
        />
        <span class="switch-slider"></span>
        <span class="switch-label">降噪</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMediaCapture } from '../../composables/useMediaCapture.js'

const props = defineProps({
  volume: Number,
  noiseReduction: Boolean
})

const emit = defineEmits(['update:volume', 'update:noiseReduction'])

const { microphones, enumerateDevices } = useMediaCapture()
const selectedMic = ref('')

onMounted(async () => {
  await enumerateDevices()
})

const updateVolume = (e) => {
  emit('update:volume', parseInt(e.target.value))
}

const updateNoiseReduction = (e) => {
  emit('update:noiseReduction', e.target.checked)
}
</script>

<style scoped>
.audio-mixer {
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

.audio-select {
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.audio-select:hover {
  border-color: #667eea;
}

.audio-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
}

.switch-input {
  display: none;
}

.switch-slider {
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s;
}

.switch-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: all 0.3s;
}

.switch-input:checked + .switch-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.switch-input:checked + .switch-slider::before {
  transform: translateX(20px);
}

.switch-label {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}
</style>
