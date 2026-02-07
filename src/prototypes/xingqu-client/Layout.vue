<template>
  <div class="app-layout">
    <router-view />
  </div>
</template>

<script setup>
// 移除 TopBar 和 StatusBar 的导入
</script>

<style scoped>
.app-layout {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}
</style>
