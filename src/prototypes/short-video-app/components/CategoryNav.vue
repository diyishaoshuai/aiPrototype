<template>
  <div class="category-nav">
    <div class="categories">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        :class="{ active: category.id === activeCategory }"
        @click="$emit('change', category.id)"
      >
        {{ category.label }}
      </div>
    </div>
    <div class="filter-btn" @click="$emit('filter')">
      筛选
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeCategory: {
    type: String,
    default: 'recommend'
  }
})

defineEmits(['change', 'filter'])

const categories = [
  { id: 'recommend', label: '推荐' },
  { id: 'time-travel', label: '穿越' },
  { id: 'counterattack', label: '逆袭' },
  { id: 'urban', label: '都市' },
  { id: 'romance', label: '言情' }
]
</script>

<style scoped>
.category-nav {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  padding: 12px;
  z-index: 40;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.categories {
  flex: 1;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  justify-content: center;
}

.categories::-webkit-scrollbar {
  display: none;
}

.category-item {
  font-size: 15px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s;
}

.category-item.active {
  color: #667eea;
  font-weight: bold;
}

.filter-btn {
  padding: 6px 16px;
  background: #f0f0f0;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
