<template>
  <div class="stream-stats">
    <h3 class="section-title">📊 实时数据</h3>

    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">在线人数</span>
        <span class="stat-value">{{ viewers }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">码率</span>
        <span class="stat-value">{{ bitrate }} kbps</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">帧率</span>
        <span class="stat-value">{{ fps }} fps</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  viewers: {
    type: Number,
    default: 0
  },
  bitrate: {
    type: Number,
    default: 0
  },
  fps: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.stream-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  color: #667eea;
  font-weight: 700;
}
</style>
