<template>
  <div class="preview-page">
    <div class="preview-header">
      <div class="header-content">
        <div class="info">
          <h2>{{ prototype?.title }}</h2>
          <el-tag size="small">{{ prototype?.category }}</el-tag>
        </div>
        <el-button @click="goBack">返回列表</el-button>
      </div>
    </div>

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
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <el-icon><Document /></el-icon>
                <span>{{ node.label }}</span>
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
import { Document } from '@element-plus/icons-vue'

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
  prototype.value = await store.getPrototype(route.params.id)
  if (prototype.value) {
    currentPageUrl.value = prototype.value.filePath
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
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.preview-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 16px 0;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info h2 {
  font-size: 20px;
  margin: 0;
}

.preview-container {
  flex: 1;
  display: flex;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  gap: 20px;
}

/* 左侧导航栏 */
.sidebar-nav {
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.nav-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafafa;
}

.nav-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.nav-content {
  padding: 12px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
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
  background: #1a1a1a;
  border-radius: 40px;
  padding: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.phone-header {
  height: 44px;
  background: white;
  border-radius: 28px 28px 0 0;
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
  border-radius: 0 0 28px 28px;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
