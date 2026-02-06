<template>
  <div class="top-bar">
    <div class="top-left">
      <div class="logo">
        <span class="logo-icon">⭐</span>
        <span class="logo-text">星趣</span>
      </div>
      <div class="app-title">直播推流工具</div>
    </div>

    <div class="top-center">
      <div class="stream-status" :class="{ active: isStreaming }">
        <span class="status-dot"></span>
        <span class="status-text">{{ isStreaming ? '直播中' : '未开播' }}</span>
      </div>
    </div>

    <div class="top-right">
      <button class="icon-btn" title="设置">
        <span class="icon">⚙️</span>
      </button>
      <div class="window-controls">
        <button class="control-btn" title="最小化">−</button>
        <button class="control-btn" title="最大化">□</button>
        <button class="control-btn close" title="关闭">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isStreaming = ref(false)
</script>

<style scoped>
.top-bar {
  height: 50px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-icon {
  font-size: 20px;
}

.app-title {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  padding-left: 16px;
  border-left: 2px solid #e5e7eb;
}

.top-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.stream-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.stream-status.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  transition: all 0.3s ease;
}

.stream-status.active .status-dot {
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

.status-text {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.stream-status.active .status-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.top-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: #e5e7eb;
}

.icon {
  font-size: 18px;
}

.window-controls {
  display: flex;
  gap: 4px;
  margin-left: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.control-btn:hover {
  background: #f3f4f6;
}

.control-btn.close:hover {
  background: #ef4444;
  color: white;
}
</style>
