<template>
  <div class="form-page">
    <header class="form-header">
      <div class="header-content">
        <div class="header-left">
          <button class="back-btn" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h2>{{ isEdit ? '编辑原型' : '新建原型' }}</h2>
        </div>
      </div>
    </header>

    <div class="form-container">
      <div class="form-card">
        <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
          <el-form-item label="原型标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入原型标题"
              size="large"
            />
          </el-form-item>

          <el-form-item label="分类" prop="category">
            <el-select
              v-model="form.category"
              placeholder="请选择分类"
              size="large"
              style="width: 100%"
            >
              <el-option label="网页端" value="网页端" />
              <el-option label="移动端" value="移动端" />
            </el-select>
          </el-form-item>

          <el-form-item label="描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入原型描述"
            />
          </el-form-item>

          <el-form-item label="文件名称" prop="folderName">
            <el-input
              v-model="form.folderName"
              placeholder="例如: short-video-app"
              size="large"
            >
              <template #prepend>/prototypes/</template>
              <template #append>.html</template>
            </el-input>
            <div class="form-tip">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>输入文件名（不含扩展名），例如输入 "short-video-app" 将对应 /prototypes/short-video-app.html</span>
            </div>
          </el-form-item>

          <el-form-item label="封面图片（可选）">
            <el-input
              v-model="form.coverImage"
              placeholder="图片URL或相对路径"
              size="large"
            />
          </el-form-item>

          <div class="form-actions">
            <button class="cancel-btn" @click="goBack" type="button">
              取消
            </button>
            <button class="submit-btn" @click="submitForm" :disabled="submitting" type="button">
              <span v-if="!submitting">{{ isEdit ? '更新原型' : '创建原型' }}</span>
              <span v-else>处理中...</span>
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePrototypeStore } from '@/stores/prototype'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = usePrototypeStore()

const formRef = ref(null)
const isEdit = ref(false)
const submitting = ref(false)

const form = reactive({
  title: '',
  category: '移动端',
  description: '',
  folderName: '',
  coverImage: '',
  pageStructure: null // 保存原有的页面结构
})

const rules = {
  title: [{ required: true, message: '请输入原型标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  folderName: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }]
}

onMounted(async () => {
  if (route.params.id && route.params.id !== 'new') {
    isEdit.value = true
    const prototype = await store.getPrototype(route.params.id)
    console.log('PrototypeForm - loaded prototype:', prototype)
    console.log('PrototypeForm - prototype.pageStructure:', prototype?.pageStructure)

    if (prototype) {
      // 手动赋值，避免包含不需要的字段
      form.title = prototype.title || ''
      form.category = prototype.category || '移动端'
      form.description = prototype.description || ''
      form.coverImage = prototype.coverImage || ''
      form.pageStructure = prototype.pageStructure || null // 保存页面结构

      console.log('PrototypeForm - form.pageStructure after assignment:', form.pageStructure)

      // 如果有 filePath，提取文件名（不含扩展名）
      if (prototype.filePath) {
        if (prototype.filePath.startsWith('/prototypes/')) {
          // 提取文件名，例如 /prototypes/short-video-app.html -> short-video-app
          const fileName = prototype.filePath.replace('/prototypes/', '').replace('.html', '')
          form.folderName = fileName
        } else {
          // 如果路径格式不同，尝试其他方式提取
          const pathParts = prototype.filePath.split('/')
          const lastPart = pathParts[pathParts.length - 1]
          form.folderName = lastPart.replace('.html', '')
        }
      }
    }
  }
})

const submitForm = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        // 构建完整的 filePath，保持 .html 格式
        const submitData = {
          title: form.title,
          category: form.category,
          description: form.description,
          coverImage: form.coverImage,
          filePath: `/prototypes/${form.folderName}.html`
        }

        // 如果是编辑模式且有 pageStructure，保留它
        if (isEdit.value && form.pageStructure) {
          submitData.pageStructure = form.pageStructure
        }

        console.log('PrototypeForm - submitData:', submitData)
        console.log('PrototypeForm - isEdit:', isEdit.value)
        console.log('PrototypeForm - route.params.id:', route.params.id)

        if (isEdit.value) {
          await store.updatePrototype(route.params.id, submitData)
          ElMessage.success('更新成功')
        } else {
          console.log('PrototypeForm - 开始创建原型')
          await store.createPrototype(submitData)
          console.log('PrototypeForm - 创建原型完成，准备显示成功消息')
          ElMessage.success('创建成功')
          console.log('PrototypeForm - 成功消息已显示')
        }
        router.push('/dashboard')
      } catch (error) {
        console.error('PrototypeForm - submit error:', error)
        ElMessage.error('操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
}

.form-header {
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
  max-width: 900px;
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

.header-content h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

.form-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 32px;
}

.form-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 8px;
  font-size: 13px;
  color: #0369a1;
  line-height: 1.5;
}

.form-tip svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 12px 24px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
  color: #374151;
}

.submit-btn {
  padding: 12px 32px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Element Plus form overrides */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #d1d5db;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #667eea !important;
}

:deep(.el-textarea__inner) {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.el-textarea__inner:hover) {
  border-color: #d1d5db;
}

:deep(.el-textarea__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

:deep(.el-input-group__prepend) {
  background: #f9fafb;
  border-radius: 10px 0 0 10px;
  border: 1px solid #e5e7eb;
  border-right: none;
  color: #6b7280;
  font-weight: 500;
}
</style>
