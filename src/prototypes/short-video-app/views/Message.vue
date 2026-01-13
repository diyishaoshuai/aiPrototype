<template>
  <div class="message-page">
    <div class="content">
      <div class="icon">💬</div>
      <h1 class="title">消息页面</h1>
      <p class="desc">查看你的消息</p>
    </div>
    <BottomNav active-tab="message" />
  </div>
</template>

<script setup>
import BottomNav from '../components/BottomNav.vue'
</script>

<style scoped>
.message-page {
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
