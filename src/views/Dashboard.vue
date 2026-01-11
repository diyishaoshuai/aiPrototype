<template>
  <div class="dashboard">
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🚀</span>
          <h1 class="page-title">AI Prototype Hub</h1>
        </div>
        <div class="header-actions">
          <el-button type="primary" :icon="Plus" @click="createPrototype">新建原型</el-button>
        </div>
      </div>
    </el-header>

    <el-main class="main-content">
      <div class="page-header">
        <div>
          <h2>原型列表</h2>
          <p>管理你的所有手机原型页面</p>
        </div>
      </div>

      <div class="filters">
        <el-input
          v-model="searchText"
          placeholder="搜索原型..."
          style="width: 300px"
          @input="handleSearch"
        />
        <el-select
          v-model="selectedCategory"
          placeholder="所有分类"
          style="width: 150px"
          @change="handleSearch"
        >
          <el-option label="所有分类" value="" />
          <el-option label="移动端" value="移动端" />
          <el-option label="PC端" value="PC端" />
          <el-option label="后台管理" value="后台管理" />
        </el-select>
      </div>

      <div v-loading="store.loading" class="prototype-grid">
        <el-empty v-if="!store.loading && store.prototypes.length === 0" description="暂无原型" />

        <el-card v-for="item in store.prototypes" :key="item._id" class="prototype-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="title">{{ item.title }}</span>
              <el-tag type="success" size="small">{{ item.category }}</el-tag>
            </div>
          </template>

          <div class="card-content">
            <p class="description">{{ item.description || '暂无描述' }}</p>
            <div class="tags">
              <el-tag v-for="tag in item.tags" :key="tag" size="small">{{ tag }}</el-tag>
            </div>
          </div>

          <template #footer>
            <div class="card-footer">
              <span class="date">{{ formatDate(item.createdAt) }}</span>
              <div class="actions">
                <el-button size="small" @click="editPrototype(item._id)">编辑</el-button>
                <el-button size="small" type="primary" @click="previewPrototype(item._id)">预览</el-button>
              </div>
            </div>
          </template>
        </el-card>
      </div>
    </el-main>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePrototypeStore } from '@/stores/prototype'
import { Plus } from '@element-plus/icons-vue'

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

const createPrototype = () => {
  router.push('/prototype/new')
}

const editPrototype = (id) => {
  router.push(`/prototype/${id}`)
}

const previewPrototype = (id) => {
  router.push(`/preview/${id}`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 32px;
  height: 64px;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 32px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 28px;
  margin-bottom: 8px;
}

.page-header p {
  color: #909399;
  font-size: 14px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.prototype-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .title {
  font-weight: 600;
}

.card-content {
  padding: 16px 0;
}

.description {
  color: #606266;
  font-size: 14px;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 8px;
}

.date {
  color: #909399;
  font-size: 12px;
}
</style>
