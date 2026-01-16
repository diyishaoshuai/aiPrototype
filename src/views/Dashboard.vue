<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="page-title">AI Prototype Hub</h1>
        </div>
        <button class="create-btn" @click="createPrototype">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          新建原型
        </button>
      </div>
    </header>

    <main class="main-content">
      <div class="page-header">
        <div>
          <h2>原型列表</h2>
          <p>管理和预览你的所有原型项目</p>
        </div>
      </div>

      <div class="filters">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchText"
            placeholder="搜索原型..."
            @input="handleSearch"
          />
        </div>
        <div class="category-tabs">
          <button
            class="category-tab"
            :class="{ active: selectedCategory === '' }"
            @click="selectCategory('')"
          >
            全部
          </button>
          <button
            class="category-tab"
            :class="{ active: selectedCategory === '网页端' }"
            @click="selectCategory('网页端')"
          >
            网页端
          </button>
          <button
            class="category-tab"
            :class="{ active: selectedCategory === '移动端' }"
            @click="selectCategory('移动端')"
          >
            移动端
          </button>
        </div>
      </div>

      <div v-loading="store.loading" class="prototype-grid">
        <div v-if="!store.loading && store.prototypes.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M9 9H15M9 13H15M9 17H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>暂无原型</p>
        </div>

        <div v-for="item in store.prototypes" :key="item._id" class="prototype-card" @click="previewPrototype(item._id)">
          <div class="card-cover">
            <img v-if="item.coverImage" :src="item.coverImage" :alt="item.title" />
            <div v-else class="cover-placeholder">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="category-badge">{{ item.category }}</div>
            <div class="description-overlay">
              <p>{{ item.description || '暂无描述' }}</p>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ item.title }}</h3>
            <div class="card-actions">
              <button class="action-btn delete-btn" @click.stop="deletePrototype(item._id)" title="删除">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="action-btn edit-btn" @click.stop="editPrototype(item._id)" title="编辑">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePrototypeStore } from '@/stores/prototype'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const store = usePrototypeStore()

const searchText = ref('')
const selectedCategory = ref('')

onMounted(() => {
  store.fetchPrototypes()
})

// 防抖函数
let searchTimer = null
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    const params = {}
    if (searchText.value) params.search = searchText.value
    if (selectedCategory.value) params.category = selectedCategory.value
    store.fetchPrototypes(params)
  }, 300)
}

const selectCategory = (category) => {
  selectedCategory.value = category
  handleSearch()
}

const createPrototype = () => {
  router.push('/prototype/new')
}

const editPrototype = (id) => {
  router.push(`/prototype/${id}`)
}

const previewPrototype = (id) => {
  router.push(`/preview/${id}`)
}

const deletePrototype = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个原型吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await store.deletePrototype(id)
    ElMessage.success('删除成功')
    store.fetchPrototypes()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 40px;
  height: 72px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1600px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  color: #667eea;
  transition: transform 0.3s ease;
}

.logo-icon:hover {
  transform: rotate(180deg);
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.create-btn:active {
  transform: translateY(0);
}

.create-btn svg {
  width: 20px;
  height: 20px;
}

.main-content {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  padding: 40px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.page-header p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.category-tabs {
  display: flex;
  gap: 8px;
  background: white;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-tab {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-tab:hover {
  background: #f3f4f6;
  color: #374151;
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.prototype-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #9ca3af;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.prototype-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

.prototype-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.prototype-card:hover .card-cover img {
  transform: scale(1.05);
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.cover-placeholder svg {
  width: 64px;
  height: 64px;
}

.category-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.description-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.prototype-card:hover .description-overlay {
  opacity: 1;
}

.description-overlay p {
  color: white;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f3f4f6;
  color: #6b7280;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.edit-btn:hover {
  background: #dbeafe;
  color: #2563eb;
}

.preview-btn:hover {
  background: #e0e7ff;
  color: #667eea;
}
</style>
