<template>
  <div style="background: #f5f5f5; min-height: 100vh; padding-top: 48px; padding-bottom: 56px;">
    <TopTabs active-tab="square" />
    <div style="padding: 32px; text-align: center;">
      <div style="font-size: 60px; margin-bottom: 16px;">🔥</div>
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">广场页面</h1>
      <p style="color: #666;">发现热门内容</p>
    </div>
    <BottomNav active-tab="square" />
  </div>
</template>

<script setup>
import TopTabs from '../components/TopTabs.vue'
import BottomNav from '../components/BottomNav.vue'
</script>
