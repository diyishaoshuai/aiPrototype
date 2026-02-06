<template>
  <div class="status-bar">
    <div class="status-left">
      <span class="status-item">
        <span class="status-dot" :class="{ streaming: isStreaming }"></span>
        {{ isStreaming ? '推流中' : '未推流' }}
      </span>
    </div>

    <div class="status-center">
      <span class="status-item">
        <span class="label">码率:</span>
        <span class="value">{{ bitrate }} kbps</span>
      </span>
      <span class="status-item">
        <span class="label">帧率:</span>
        <span class="value">{{ fps }} fps</span>
      </span>
      <span class="status-item">
        <span class="label">CPU:</span>
        <span class="value">{{ cpuUsage }}%</span>
      </span>
    </div>

    <div class="status-right">
      <span class="status-item">
        <span class="network-icon">📶</span>
        {{ networkStatus }}
      </span>
      <span class="status-item">星趣推流工具 v1.0.0</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isStreaming = ref(false)
const bitrate = ref(0)
const fps = ref(0)
const cpuUsage = ref(0)
const networkStatus = ref('网络良好')
</script>

<style scoped>
.status-bar {
  height: 30px;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 12px;
  color: #6b7280;
}

.status-left,
.status-center,
.status-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-center {
  flex: 1;
  justify-content: center;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  transition: all 0.3s ease;
}

.status-dot.streaming {
  background: #ef4444;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.label {
  color: #9ca3af;
  font-weight: 500;
}

.value {
  color: #667eea;
  font-weight: 600;
}

.network-icon {
  font-size: 14px;
}
</style>
