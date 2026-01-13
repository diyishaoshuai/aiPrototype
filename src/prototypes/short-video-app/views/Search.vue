<template>
  <div class="search-page">
    <div class="search-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <div class="search-input-wrapper">
        <input type="text" class="search-input" placeholder="搜索内容..." />
      </div>
    </div>

    <div class="search-content">
      <div class="icon">🔍</div>
      <h1 class="title">搜索页面</h1>
      <p class="desc">搜索你感兴趣的内容</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.search-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.search-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
}

.search-input-wrapper {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

.search-content {
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
