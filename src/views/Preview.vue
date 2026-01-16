<template>
  <div class="preview-page">
    <header class="preview-header">
      <div class="header-content">
        <div class="header-left">
          <button class="back-btn" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="info">
            <h2>{{ prototype?.title }}</h2>
            <span class="category-badge">{{ prototype?.category }}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="preview-container">
      <!-- 左侧导航栏 -->
      <div class="sidebar-nav">
        <div class="nav-header">
          <h3>页面结构</h3>
        </div>
        <div class="nav-content">
          <el-tree
            :data="pageStructure"
            :props="treeProps"
            @node-click="handleNodeClick"
            highlight-current
            default-expand-all
            :indent="20"
          >
            <template #default="{ node, data }">
              <span class="tree-node" :class="{ 'is-parent': data.children && data.children.length > 0, 'is-leaf': !data.children || data.children.length === 0 }">
                <el-icon :size="16" class="node-icon">
                  <component :is="getPageIcon(data)" />
                </el-icon>
                <span class="node-label">{{ node.label }}</span>
                <span v-if="data.children && data.children.length > 0" class="node-count">{{ data.children.length }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 中间手机预览区域 -->
      <div class="phone-preview">
        <div class="phone-frame">
          <div class="phone-header">
            <div class="status-bar">
              <span class="time">9:41</span>
              <div class="notch"></div>
              <div class="status-icons">
                <span>📶</span>
                <span>📡</span>
                <span>🔋</span>
              </div>
            </div>
          </div>
          <div class="phone-screen">
            <iframe
              v-if="prototype"
              :src="currentPageUrl"
              frameborder="0"
              class="preview-iframe"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePrototypeStore } from '@/stores/prototype'
import { Document, Folder, FolderOpened, HomeFilled, List, Filter, TrendCharts } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = usePrototypeStore()

const prototype = ref(null)
const currentPageUrl = ref('')

// 页面结构树配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 页面结构数据
const pageStructure = ref([])

onMounted(async () => {
  console.log('Preview - route.params.id:', route.params.id)
  prototype.value = await store.getPrototype(route.params.id)
  console.log('Preview - prototype:', prototype.value)
  if (prototype.value) {
    currentPageUrl.value = prototype.value.filePath
    console.log('Preview - currentPageUrl:', currentPageUrl.value)
    // 使用原型配置的页面结构
    if (prototype.value.pageStructure && prototype.value.pageStructure.length > 0) {
      pageStructure.value = prototype.value.pageStructure
    } else {
      // 如果没有配置页面结构，默认显示主页面
      pageStructure.value = [
        {
          label: '主页面',
          id: 'main',
          url: prototype.value.filePath
        }
      ]
    }
  } else {
    console.error('Preview - prototype is null or undefined')
  }
})

const handleNodeClick = (data) => {
  if (data.url) {
    currentPageUrl.value = data.url
  }
}

const goBack = () => {
  router.push('/dashboard')
}

// 根据页面类型获取图标
const getPageIcon = (data) => {
  if (data.children && data.children.length > 0) {
    return Folder
  }

  const label = data.label.toLowerCase()
  if (label.includes('首页') || label.includes('主页')) {
    return HomeFilled
  } else if (label.includes('列表') || label.includes('排行')) {
    return List
  } else if (label.includes('筛选') || label.includes('分类')) {
    return Filter
  } else if (label.includes('播放') || label.includes('详情')) {
    return TrendCharts
  }

  return Document
}
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
}

.preview-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.back-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: translateX(-2px);
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.category-badge {
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.preview-container {
  flex: 1;
  display: flex;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  padding: 32px;
  gap: 24px;
}

/* 左侧导航栏 */
.sidebar-nav {
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.nav-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.nav-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.nav-content {
  padding: 12px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  transition: all 0.3s ease;
  width: 100%;
}

.tree-node:hover {
  background: #f3f4f6;
}

.tree-node.is-parent {
  font-weight: 600;
  color: #1a1a1a;
}

.tree-node.is-parent .node-icon {
  color: #667eea;
}

.tree-node.is-leaf {
  font-weight: 500;
  color: #4b5563;
}

.tree-node.is-leaf .node-icon {
  color: #9ca3af;
}

.node-icon {
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.node-label {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.node-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%);
  color: #667eea;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 600;
}

/* Element Plus Tree 样式覆盖 */
.nav-content :deep(.el-tree) {
  background: transparent;
}

.nav-content :deep(.el-tree-node__content) {
  height: auto;
  padding: 4px 0;
  background: transparent;
}

.nav-content :deep(.el-tree-node__content:hover) {
  background: transparent;
}

.nav-content :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: transparent;
}

.nav-content :deep(.el-tree-node.is-current > .el-tree-node__content .tree-node) {
  background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%);
  color: #667eea;
}

.nav-content :deep(.el-tree-node.is-current > .el-tree-node__content .tree-node .node-icon) {
  color: #667eea;
}

.nav-content :deep(.el-tree-node__expand-icon) {
  color: #909399;
  font-size: 14px;
}

.nav-content :deep(.el-tree-node__expand-icon.is-leaf) {
  color: transparent;
}

.nav-content :deep(.el-tree-node:focus > .el-tree-node__content) {
  background: transparent;
}

.nav-content :deep(.el-tree-node__children) {
  position: relative;
}

.nav-content :deep(.el-tree-node__children::before) {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #e4e7ed;
}

/* 手机预览区域 */
.phone-preview {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
}

.phone-frame {
  width: 390px;
  height: 844px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 44px;
  padding: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
}

.phone-header {
  height: 44px;
  background: white;
  border-radius: 30px 30px 0 0;
  position: relative;
  overflow: hidden;
}

.status-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 12px;
  color: #000;
}

.notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  background: #1a1a1a;
  border-radius: 0 0 20px 20px;
}

.status-icons {
  display: flex;
  gap: 4px;
  font-size: 14px;
}

.phone-screen {
  height: calc(100% - 44px);
  background: white;
  border-radius: 0 0 30px 30px;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
