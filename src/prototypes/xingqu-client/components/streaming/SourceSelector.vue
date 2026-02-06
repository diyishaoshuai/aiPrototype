<template>
  <div class="source-selector">
    <h3 class="section-title">📹 视频源</h3>

    <div class="source-group">
      <label class="source-label">摄像头</label>
      <select
        v-model="selectedCamera"
        @change="handleCameraChange"
        class="source-select"
      >
        <option value="">选择摄像头</option>
        <option
          v-for="camera in cameras"
          :key="camera.deviceId"
          :value="camera.deviceId"
        >
          {{ camera.label || `摄像头 ${camera.deviceId.slice(0, 8)}` }}
        </option>
      </select>
    </div>

    <button @click="handleScreenCapture" class="capture-btn">
      🖥️ 屏幕捕获
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMediaCapture } from '../../composables/useMediaCapture.js'

const emit = defineEmits(['camera-selected', 'screen-capture'])

const { cameras, enumerateDevices } = useMediaCapture()
const selectedCamera = ref('')

onMounted(async () => {
  await enumerateDevices()
})

const handleCameraChange = () => {
  if (selectedCamera.value) {
    emit('camera-selected', selectedCamera.value)
  }
}

const handleScreenCapture = () => {
  emit('screen-capture')
}
</script>

<style scoped>
.source-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.source-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.source-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.source-select {
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.source-select:hover {
  border-color: #667eea;
}

.source-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.capture-btn {
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  background: white;
  color: #1f2937;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.capture-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  color: #667eea;
}
</style>
