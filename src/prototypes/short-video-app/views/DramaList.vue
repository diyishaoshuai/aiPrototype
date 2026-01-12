<template>
  <div class="drama-list-page">
    <TopTabs active-tab="drama" />
    <div class="content">
      <div class="drama-grid">
        <div
          v-for="drama in dramas"
          :key="drama.id"
          class="drama-card"
          @click="goToDetail(drama.id)"
        >
          <div class="drama-thumbnail" :style="{ background: drama.gradient }">
            {{ drama.icon }}
            <div class="episode-badge">共{{ drama.episodes }}集</div>
          </div>
          <div class="drama-info">
            <div class="drama-name">{{ drama.name }}</div>
            <div class="drama-meta">
              <span>📺 {{ drama.views }}</span>
            </div>
            <div class="drama-tags">
              <span v-for="tag in drama.tags" :key="tag" class="tag-item">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BottomNav active-tab="home" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopTabs from '../components/TopTabs.vue'
import BottomNav from '../components/BottomNav.vue'

const router = useRouter()

const dramas = ref([
  {
    id: 1,
    name: '霸道总裁爱上我',
    episodes: 80,
    views: '1.2亿',
    tags: ['都市', '言情', '霸总'],
    icon: '💼',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '重生之豪门千金',
    episodes: 60,
    views: '8500万',
    tags: ['重生', '复仇', '豪门'],
    icon: '👑',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
])

const goToDetail = (id) => {
  router.push({ name: 'DramaDetail', params: { id } })
}
</script>

<style scoped>
.drama-list-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-top: 48px;
  padding-bottom: 56px;
}

.content {
  padding: 12px;
}

.drama-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.drama-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.drama-card:active {
  transform: scale(0.95);
}

.drama-thumbnail {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  position: relative;
}

.episode-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.drama-info {
  padding: 10px;
}

.drama-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drama-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.drama-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag-item {
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 3px;
  font-size: 11px;
  color: #666;
}
</style>
