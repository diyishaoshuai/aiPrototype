<template>
  <div class="publish-page">
    <div class="content">
      <div class="icon">➕</div>
      <h1 class="title">发布页面</h1>
      <p class="desc">分享你的精彩瞬间</p>
    </div>
    <BottomNav active-tab="publish" />
  </div>
</template>

<script setup>
import BottomNav from '../components/BottomNav.vue'
</script>

<style scoped>
.publish-page {
  background: #f5f5f5;
  min-height: 100vh;
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
