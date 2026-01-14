<template>
  <div class="drama-list-page">
    <TopTabs active-tab="drama" />

    <CategoryNav
      :active-category="activeCategory"
      @change="handleCategoryChange"
      @filter="goToFilter"
    />

    <div class="content">
      <BannerSwiper v-if="activeCategory === 'recommend'" />

      <div class="drama-grid">
        <DramaCard
          v-for="(drama, index) in displayedDramas.slice(0, 6)"
          :key="drama.id"
          :drama="drama"
          @click="goToDetail"
        />
      </div>

      <DramaRanking
        v-if="activeCategory === 'recommend'"
        @more="goToRankingMore"
      />

      <div class="drama-grid" v-if="displayedDramas.length > 6">
        <DramaCard
          v-for="drama in displayedDramas.slice(6)"
          :key="drama.id"
          :drama="drama"
          @click="goToDetail"
        />
      </div>
    </div>

    <BottomNav active-tab="home" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TopTabs from '../components/TopTabs.vue'
import BottomNav from '../components/BottomNav.vue'
import CategoryNav from '../components/CategoryNav.vue'
import BannerSwiper from '../components/BannerSwiper.vue'
import DramaCard from '../components/DramaCard.vue'
import DramaRanking from '../components/DramaRanking.vue'

const router = useRouter()

const activeCategory = ref('recommend')

const allDramas = ref([
  { id: 1, name: '霸总的替身新娘', type: '都市', episodes: 80, playCount: '1.2亿次播放', emoji: '💼', isNew: true },
  { id: 2, name: '重生之豪门千金', type: '重生', episodes: 60, playCount: '9800万次播放', emoji: '👑', isNew: true },
  { id: 3, name: '穿越成王爷的小娇妻', type: '穿越', episodes: 70, playCount: '8500万次播放', emoji: '🏯', isNew: false },
  { id: 4, name: '都市修仙狂少', type: '都市', episodes: 90, playCount: '7200万次播放', emoji: '⚡', isNew: false },
  { id: 5, name: '闪婚后大佬每天都在撒糖', type: '言情', episodes: 50, playCount: '6800万次播放', emoji: '💕', isNew: true },
  { id: 6, name: '神医毒妃不好惹', type: '古风', episodes: 75, playCount: '6500万次播放', emoji: '💊', isNew: false },
  { id: 7, name: '重生后我成了首富', type: '逆袭', episodes: 65, playCount: '6200万次播放', emoji: '💰', isNew: false },
  { id: 8, name: '豪门千金的复仇计划', type: '都市', episodes: 55, playCount: '5800万次播放', emoji: '🔥', isNew: false },
  { id: 9, name: '穿书后我成了女配', type: '穿越', episodes: 60, playCount: '5500万次播放', emoji: '📖', isNew: true }
])

const displayedDramas = computed(() => {
  if (activeCategory.value === 'recommend') {
    return allDramas.value
  }
  const categoryMap = {
    'time-travel': '穿越',
    'counterattack': '逆袭',
    'urban': '都市',
    'romance': '言情'
  }
  const filterType = categoryMap[activeCategory.value]
  return allDramas.value.filter(drama => drama.type === filterType)
})

const handleCategoryChange = (category) => {
  activeCategory.value = category
}

const goToFilter = () => {
  router.push({ name: 'DramaFilter' })
}

const goToDetail = (id) => {
  router.push({ name: 'DramaPlayer', params: { id } })
}

const goToRankingMore = () => {
  router.push({ name: 'DramaRanking' })
}
</script>

<style scoped>
.drama-list-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-top: 104px;
  padding-bottom: 56px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
}

.content {
  padding: 12px;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
}

.drama-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;
}
</style>
