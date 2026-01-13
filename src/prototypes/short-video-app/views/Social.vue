<template>
  <div class="social-page">
    <TopTabs active-tab="social" />
    <div class="content">
      <div class="icon">💕</div>
      <h1 class="title">交友页面</h1>
      <p class="desc">发现有趣的人</p>
    </div>
    <BottomNav active-tab="message" />
  </div>
</template>

<script setup>
import TopTabs from '../components/TopTabs.vue'
import BottomNav from '../components/BottomNav.vue'
</script>

<style scoped>
.social-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-top: 48px;
  padding-bottom: 56px;
}

.content {
  padding: 80px 32px;
  text-align: center;
}

.icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}

.desc {
  color: #666;
  font-size: 16px;
}
</style>
