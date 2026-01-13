<template>
  <div class="drama-card" @click="$emit('click', drama.id)">
    <div class="cover">
      <div v-if="drama.isNew" class="new-tag">新剧</div>
      <div class="cover-bg">{{ drama.emoji }}</div>
      <div class="play-count">{{ drama.playCount }}</div>
    </div>
    <div class="info">
      <div class="name">{{ drama.name }}</div>
      <div class="meta">
        <span class="type">{{ drama.type }}</span>
        <span class="episodes">{{ drama.episodes }}集</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  drama: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.drama-card {
  cursor: pointer;
  min-width: 0;
  overflow: hidden;
}

.cover {
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.new-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  background: #52c41a;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  z-index: 2;
}

.cover-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.play-count {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.info {
  padding: 0 4px;
}

.name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #999;
}
</style>
