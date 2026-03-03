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
      <!-- 左侧导航栏 - 仅当有页面结构时显示 -->
      <div v-if="hasPageStructure" class="sidebar-nav">
        <div class="nav-header">
          <h3>页面结构</h3>
        </div>
        <div class="nav-content">
          <el-tree
            ref="treeRef"
            :data="pageStructure"
            :props="treeProps"
            @node-click="handleNodeClick"
            highlight-current
            default-expand-all
            :indent="20"
            node-key="id"
          >
            <template #default="{ node, data }">
              <span
                class="tree-node"
                :class="{ 'is-parent': data.children && data.children.length > 0, 'is-leaf': !data.children || data.children.length === 0 }"
                @dblclick.stop="handleNodeDoubleClick(data)"
              >
                <el-icon :size="16" class="node-icon">
                  <component :is="getPageIcon(data)" />
                </el-icon>
                <input
                  v-if="editingNodeId === data.id"
                  v-model="editingNodeLabel"
                  @blur="saveNodeLabel(data)"
                  @keyup.enter="saveNodeLabel(data)"
                  @keyup.esc="cancelEdit"
                  @click.stop
                  class="node-input"
                  ref="nodeInput"
                />
                <span v-else class="node-label">{{ node.label }}</span>
                <span v-if="data.children && data.children.length > 0" class="node-count">{{ data.children.length }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 预览区域 - 根据类型显示不同样式 -->
      <div class="preview-area" :class="{
        'is-mobile': prototype?.category === '移动端',
        'is-web': prototype?.category === '网页端',
        'is-client': prototype?.category === '客户端',
        'no-sidebar': !hasPageStructure
      }">
        <!-- 移动端：手机框架 -->
        <div v-if="prototype?.category === '移动端'" class="phone-frame">
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
              v-if="prototype && currentPageUrl"
              :src="currentPageUrl"
              frameborder="0"
              class="preview-iframe"
              @load="handleIframeLoad"
              ref="iframeRef"
            />
            <div v-else-if="prototype && !currentPageUrl" class="iframe-error">
              <p>无法加载页面</p>
              <p class="error-detail">URL: {{ prototype?.filePath }}</p>
            </div>
          </div>
        </div>

        <!-- 网页端：完整网页 -->
        <div v-else-if="prototype?.category === '网页端'" class="web-frame">
          <iframe
            v-if="prototype && currentPageUrl"
            :src="currentPageUrl"
            frameborder="0"
            class="preview-iframe"
            @load="handleIframeLoad"
            ref="iframeRef"
          />
          <div v-else-if="prototype && !currentPageUrl" class="iframe-error">
            <p>无法加载页面</p>
            <p class="error-detail">URL: {{ prototype?.filePath }}</p>
          </div>
        </div>

        <!-- 客户端：全屏显示 -->
        <div v-else-if="prototype?.category === '客户端'" class="client-frame">
          <iframe
            v-if="prototype && currentPageUrl"
            :src="currentPageUrl"
            frameborder="0"
            class="preview-iframe"
            @load="handleIframeLoad"
            ref="iframeRef"
          />
          <div v-else-if="prototype && !currentPageUrl" class="iframe-error">
            <p>无法加载页面</p>
            <p class="error-detail">URL: {{ prototype?.filePath }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePrototypeStore } from '@/stores/prototype'
import { Document, Folder, FolderOpened, HomeFilled, List, Filter, TrendCharts } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = usePrototypeStore()

const prototype = ref(null)
const currentPageUrl = ref('')
const editingNodeId = ref(null)
const editingNodeLabel = ref('')
const treeRef = ref(null)
const iframeRef = ref(null)

// 页面结构树配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 页面结构数据
const pageStructure = ref([])

// 计算是否有页面结构（用于判断是否显示左侧导航栏）
// 单页面原型（pageStructure 为空或只有一个主页面且没有子页面）不显示左侧导航
const hasPageStructure = computed(() => {
  if (!pageStructure.value || pageStructure.value.length === 0) {
    return false
  }
  // 如果只有一个主页面且没有子页面，视为单页面
  if (pageStructure.value.length === 1) {
    const mainPage = pageStructure.value[0]
    if (!mainPage.children || mainPage.children.length === 0) {
      return false
    }
    // 检查子页面是否真实存在（有有效的 URL）
    const hasValidChildren = mainPage.children.some(child => child.url)
    return hasValidChildren
  }
  // 有多个页面或有多层结构，显示导航
  return true
})

onMounted(async () => {
  console.log('Preview - route.params.id:', route.params.id)
  prototype.value = await store.getPrototype(route.params.id)
  console.log('Preview - prototype:', prototype.value)
  if (prototype.value) {
    // 使用原型配置的页面结构
    if (prototype.value.pageStructure && prototype.value.pageStructure.length > 0) {
      pageStructure.value = prototype.value.pageStructure
      // 设置默认页面 URL：优先使用页面结构中的第一个 URL，否则使用 filePath
      const firstUrl = findFirstUrl(prototype.value.pageStructure)
      // 添加时间戳参数强制刷新缓存，解决首次加载白屏问题
      const baseUrl = firstUrl || prototype.value.filePath
      currentPageUrl.value = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`
    } else {
      // 如果没有配置页面结构，说明是单页面原型，不设置 pageStructure
      pageStructure.value = []
      // 添加时间戳参数强制刷新缓存
      const baseUrl = prototype.value.filePath
      currentPageUrl.value = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`
    }
    console.log('Preview - currentPageUrl:', currentPageUrl.value)
    console.log('Preview - pageStructure:', pageStructure.value)
    console.log('Preview - hasPageStructure:', hasPageStructure.value)
  } else {
    console.error('Preview - prototype is null or undefined')
  }
})

// 递归查找第一个有效的 URL
function findFirstUrl(structure) {
  if (!structure || !Array.isArray(structure)) return null
  for (const item of structure) {
    if (item.url) return item.url
    if (item.children && item.children.length > 0) {
      const childUrl = findFirstUrl(item.children)
      if (childUrl) return childUrl
    }
  }
  return null
}

const handleNodeClick = (data) => {
  if (data.url) {
    currentPageUrl.value = data.url
  }
}

// 双击节点进入编辑模式
const handleNodeDoubleClick = (data) => {
  editingNodeId.value = data.id
  editingNodeLabel.value = data.label
  // 下一帧聚焦输入框
  setTimeout(() => {
    const input = document.querySelector('.node-input')
    if (input) {
      input.focus()
      input.select()
    }
  }, 0)
}

// 保存节点标签
const saveNodeLabel = async (data) => {
  if (editingNodeLabel.value && editingNodeLabel.value !== data.label) {
    data.label = editingNodeLabel.value
    // 更新到数据库
    try {
      await store.updatePrototype(route.params.id, {
        pageStructure: pageStructure.value
      })
      ElMessage.success('页面名称已更新')
    } catch (error) {
      console.error('更新页面名称失败:', error)
      ElMessage.error('更新失败')
    }
  }
  editingNodeId.value = null
  editingNodeLabel.value = ''
}

// 取消编辑
const cancelEdit = () => {
  editingNodeId.value = null
  editingNodeLabel.value = ''
}

const goBack = () => {
  router.push('/dashboard')
}

// iframe加载完成后，监听其URL变化
const handleIframeLoad = () => {
  try {
    const iframe = iframeRef.value
    if (!iframe || !iframe.contentWindow) return

    // 获取iframe当前URL
    const iframeUrl = iframe.contentWindow.location.href
    console.log('Preview - iframe loaded, URL:', iframeUrl)

    // 根据URL自动选中对应的树节点
    syncTreeSelection(iframeUrl)

    // 监听iframe内的hashchange事件（用于单页应用）
    iframe.contentWindow.addEventListener('hashchange', () => {
      const newUrl = iframe.contentWindow.location.href
      console.log('Preview - iframe URL changed:', newUrl)
      syncTreeSelection(newUrl)
    })
  } catch (error) {
    // 跨域限制可能导致无法访问iframe内容
    console.warn('Preview - Cannot access iframe content (CORS):', error)
  }
}

// 根据URL同步树的选中状态
const syncTreeSelection = (url) => {
  if (!url || !treeRef.value) return

  // 查找匹配的节点
  const nodeId = findNodeByUrl(pageStructure.value, url)
  if (nodeId && treeRef.value) {
    treeRef.value.setCurrentKey(nodeId)
    console.log('Preview - Auto selected node:', nodeId)
  }
}

// 递归查找URL对应的节点ID
const findNodeByUrl = (structure, targetUrl) => {
  if (!structure || !Array.isArray(structure)) return null

  for (const item of structure) {
    // 比较URL（忽略协议和域名，只比较路径和hash）
    if (item.url && urlsMatch(item.url, targetUrl)) {
      return item.id
    }
    if (item.children && item.children.length > 0) {
      const childId = findNodeByUrl(item.children, targetUrl)
      if (childId) return childId
    }
  }
  return null
}

// 比较两个URL是否匹配
const urlsMatch = (url1, url2) => {
  try {
    // 提取路径和hash部分
    const getPathAndHash = (url) => {
      const match = url.match(/([^:]*\.html[^#]*)?(#.*)?$/)
      return match ? (match[1] || '') + (match[2] || '') : url
    }

    const path1 = getPathAndHash(url1)
    const path2 = getPathAndHash(url2)

    return path1 === path2
  } catch {
    return url1 === url2
  }
}

const handleIframeError = (e) => {
  console.error('Preview - iframe load error:', e)
  ElMessage.error('页面加载失败，请检查文件路径是否正确')
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  pointer-events: none;
  overflow: hidden;
}

.preview-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 20px 0;
  position: sticky;
  top: 0;
  pointer-events: auto;
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
  max-width: 100%;
  margin: 0;
  width: 100%;
  padding: 32px;
  gap: 24px;
  pointer-events: none;
}

/* 左侧导航栏 */
.sidebar-nav {
  width: 280px;
  pointer-events: auto;
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
  overflow-x: hidden;
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

.node-input {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  padding: 4px 8px;
  margin-right: 8px;
  border: 2px solid #667eea;
  border-radius: 6px;
  outline: none;
  background: white;
  font-family: inherit;
  color: #1a1a1a;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.node-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

/* 预览区域 */
.preview-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

/* 移动端预览 */
.preview-area.is-mobile {
  justify-content: center;
  pointer-events: auto;
}

/* 网页端预览 */
.preview-area.is-web {
  padding: 0;
  padding-right: 32px;
}

/* 当没有左侧导航时，预览区域占满宽度 */
.preview-area.no-sidebar {
  width: 100%;
  padding-right: 0;
}

.preview-area.no-sidebar.is-web {
  padding-right: 0;
}

/* 网页端框架 */
.web-frame {
  width: 100%;
  height: calc(100vh - 140px);
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.phone-frame {
  width: 390px;
  height: 844px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 44px;
  padding: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  pointer-events: auto;
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
  pointer-events: auto;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0 0 30px 30px;
  pointer-events: auto;
}

.iframe-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 14px;
}

.iframe-error p {
  margin: 8px 0;
}

.iframe-error .error-detail {
  font-size: 12px;
  color: #9ca3af;
}

/* 网页端框架 */
.web-frame {
  width: 100%;
  height: calc(100vh - 140px);
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.web-frame .preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.web-frame .iframe-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 14px;
}

/* 客户端预览 */
.preview-area.is-client {
  padding: 20px 0;
  justify-content: center;
}

/* 客户端窗口框架 */
.client-frame {
  width: 100%;
  height: calc(100vh - 140px);
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}

/* 窗口标题栏 */
.window-titlebar {
  height: 40px;
  background: linear-gradient(180deg, #f5f5f5 0%, #ebebeb 100%);
  border-bottom: 1px solid #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  flex-shrink: 0;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.window-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
}

.window-icon svg {
  width: 100%;
  height: 100%;
}

.window-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  user-select: none;
}

.titlebar-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.control-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #666;
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.control-btn svg {
  width: 12px;
  height: 12px;
}

.minimize-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.maximize-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* 窗口内容区域 */
.window-content {
  flex: 1;
  background: white;
  overflow: hidden;
  position: relative;
}

.client-frame .preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: auto;
}

.client-frame .iframe-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 14px;
}

/* 响应式调整 - 小屏幕 */
@media (max-width: 1400px) {
  .client-frame {
    width: 100%;
    height: calc(100vh - 140px);
  }
}

@media (max-width: 1100px) {
  .client-frame {
    width: 100%;
    height: calc(100vh - 140px);
  }
}
</style>
