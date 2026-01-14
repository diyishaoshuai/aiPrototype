<template>
  <div id="app" class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup>
// 根组件
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

/* 隐藏所有滚动条 */
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

*::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 优化触摸滑动 */
* {
  -webkit-overflow-scrolling: touch;
}
</style>
