<template>
  <div class="stream-settings">
    <h3 class="section-title">⚙️ 推流设置</h3>

    <div class="control-group">
      <label class="control-label">清晰度</label>
      <select
        :value="quality"
        @change="updateQuality"
        class="settings-select"
      >
        <option value="smooth">流畅 (360p)</option>
        <option value="sd">标清 (480p)</option>
        <option value="hd">高清 (720p)</option>
        <option value="fhd">超清 (1080p)</option>
      </select>
    </div>

    <div class="control-group">
      <label class="control-label">码率 (kbps)</label>
      <input
        type="number"
        :value="bitrate"
        @input="updateBitrate"
        min="500"
        max="6000"
        step="100"
        class="settings-input"
      />
    </div>

    <div class="control-group">
      <label class="control-label">帧率 (fps)</label>
      <select
        :value="framerate"
        @change="updateFramerate"
        class="settings-select"
      >
        <option value="15">15</option>
        <option value="24">24</option>
        <option value="30">30</option>
        <option value="60">60</option>
      </select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  quality: String,
  bitrate: Number,
  framerate: Number
})

const emit = defineEmits(['update:quality', 'update:bitrate', 'update:framerate'])

const updateQuality = (e) => {
  const quality = e.target.value
  emit('update:quality', quality)

  // 自动调整码率
  const bitrateMap = {
    smooth: 500,
    sd: 1000,
    hd: 2500,
    fhd: 6000
  }
  emit('update:bitrate', bitrateMap[quality])
}

const updateBitrate = (e) => {
  emit('update:bitrate', parseInt(e.target.value))
}

const updateFramerate = (e) => {
  emit('update:framerate', parseInt(e.target.value))
}
</script>

<style scoped>
.stream-settings {
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

.settings-select,
.settings-input {
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background: white;
  transition: all 0.2s;
}

.settings-select {
  cursor: pointer;
}

.settings-select:hover,
.settings-input:hover {
  border-color: #667eea;
}

.settings-select:focus,
.settings-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>
