<template>
  <Transition name="dialog-fade">
    <div v-if="dialogVisible" class="dialog-overlay" @click.self="handleClose">
      <div class="create-dialog" @click.stop>
        <!-- 对话框头部 -->
        <div class="dialog-header">
          <div class="header-content">
            <div class="icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="header-text">
              <h2>创建新原型</h2>
              <p>快速生成原型项目结构</p>
            </div>
          </div>
          <button class="close-btn" @click="handleClose" :disabled="creating">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 对话框内容 -->
        <div class="dialog-body">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="create-form"
          >
            <!-- 文件夹名 -->
            <div class="form-group">
              <el-form-item label="文件夹名称" prop="folderName">
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <el-input
                    v-model="form.folderName"
                    placeholder="my-app"
                    class="custom-input"
                  />
                </div>
                <div class="path-preview" v-if="form.folderName">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>/prototypes/{{ form.folderName }}.html</span>
                </div>
                <div class="field-hint">
                  只能包含小写字母、数字和连字符
                </div>
              </el-form-item>
            </div>

            <!-- 标题 -->
            <div class="form-group">
              <el-form-item label="原型标题" prop="title">
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 7H20M4 12H20M4 17H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </span>
                  <el-input
                    v-model="form.title"
                    placeholder="我的应用"
                    class="custom-input"
                  />
                </div>
                <div class="field-hint">
                  可以使用中文、英文或特殊字符
                </div>
              </el-form-item>
            </div>

            <!-- 分类 -->
            <div class="form-group">
              <el-form-item label="原型分类" prop="category">
                <div class="category-grid">
                  <div
                    v-for="cat in categories"
                    :key="cat.value"
                    class="category-card"
                    :class="{ active: form.category === cat.value }"
                    @click="form.category = cat.value"
                  >
                    <div class="category-icon" v-html="cat.icon"></div>
                    <div class="category-info">
                      <div class="category-name">{{ cat.label }}</div>
                      <div class="category-desc">{{ cat.desc }}</div>
                    </div>
                    <div class="category-check">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>

            <!-- 描述 -->
            <div class="form-group">
              <el-form-item label="项目描述（可选）">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  :rows="3"
                  placeholder="简要描述这个原型的用途和特点..."
                  class="custom-textarea"
                />
              </el-form-item>
            </div>

            <!-- 标签 -->
            <div class="form-group">
              <el-form-item label="标签（可选）">
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 7H7.01M7 3H17L21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H7V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <el-input
                    v-model="form.tags"
                    placeholder="社交, 视频, 电商"
                    class="custom-input"
                  />
                </div>
                <div class="field-hint">
                  用逗号分隔多个标签
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <!-- 对话框底部 -->
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="handleClose" :disabled="creating">
            取消
          </button>
          <button class="btn btn-primary" @click="handleSubmit" :disabled="creating">
            <span v-if="!creating" class="btn-content">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              创建原型
            </span>
            <span v-else class="btn-content">
              <span class="loading-spinner"></span>
              创建中...
            </span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePrototypeStore } from '@/stores/prototype'
import { generateFilePath } from '@/utils/prototype'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const store = usePrototypeStore()
const formRef = ref(null)
const creating = ref(false)

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const form = ref({
  folderName: '',
  title: '',
  category: '',
  description: '',
  tags: ''
})

const categories = [
  {
    value: '移动端',
    label: '移动端',
    desc: '手机应用原型',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M12 18H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  },
  {
    value: '网页端',
    label: '网页端',
    desc: '网站页面原型',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9H21" stroke="currentColor" stroke-width="2"/></svg>'
  },
  {
    value: '客户端',
    label: '客户端',
    desc: '桌面应用原型',
    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 20H16M12 16V20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  }
]

const rules = {
  folderName: [
    { required: true, message: '请输入文件夹名', trigger: 'blur' },
    {
      pattern: /^[a-z0-9-_]+$/,
      message: '只能包含小写字母、数字、连字符和下划线',
      trigger: 'blur'
    }
  ],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
}

const handleClose = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    creating.value = true

    const filePath = generateFilePath(form.value.folderName)

    const data = {
      title: form.value.title,
      category: form.value.category,
      description: form.value.description,
      tags: form.value.tags ? form.value.tags.split(',').map(t => t.trim()) : [],
      filePath,
      status: 'PUBLISHED',
      pageStructure: []
    }

    await store.createPrototype(data)

    ElMessageBox.alert(
      '原型已创建成功！\n\n⚠️ 重要提示：\n请重启开发服务器以加载新原型：\n1. 停止当前服务器 (Ctrl+C)\n2. 运行: npm run dev',
      '创建成功',
      {
        confirmButtonText: '我知道了',
        type: 'success'
      }
    )

    emit('success')
    handleClose()
  } catch (error) {
    ElMessage.error(error.message || '创建失败')
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
/* 对话框过渡动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .create-dialog,
.dialog-fade-leave-active .create-dialog {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.dialog-fade-enter-from .create-dialog,
.dialog-fade-leave-to .create-dialog {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

/* 对话框遮罩层 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

/* 对话框主体 */
.create-dialog {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 对话框头部 */
.dialog-header {
  padding: 24px 28px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper svg {
  width: 24px;
  height: 24px;
  color: white;
}

.header-text h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
}

.header-text p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-btn svg {
  width: 18px;
  height: 18px;
  color: white;
}

/* 对话框内容区域 */
.dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}

.create-form {
  max-width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-group:last-child {
  margin-bottom: 0;
}

/* 表单标签 */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 8px;
}

/* 输入框包装器 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  z-index: 1;
  pointer-events: none;
}

.input-icon svg {
  width: 18px;
  height: 18px;
}

/* 自定义输入框样式 */
:deep(.custom-input .el-input__wrapper) {
  padding-left: 44px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  box-shadow: none;
  transition: all 0.2s ease;
}

:deep(.custom-input .el-input__wrapper:hover) {
  border-color: #d1d5db;
}

:deep(.custom-input .el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

:deep(.custom-input .el-input__inner) {
  font-size: 14px;
  color: #1f2937;
}

:deep(.custom-input .el-input__inner::placeholder) {
  color: #9ca3af;
}

/* 路径预览 */
.path-preview {
  margin-top: 10px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
}

.path-preview svg {
  width: 16px;
  height: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.path-preview span {
  word-break: break-all;
}

/* 字段提示 */
.field-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

/* 分类卡片 */
.category-card {
  position: relative;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.category-card:hover {
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.category-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.category-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.category-card.active .category-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-icon :deep(svg) {
  width: 22px;
  height: 22px;
  color: #6b7280;
}

.category-card.active .category-icon :deep(svg) {
  color: white;
}

.category-info {
  margin-bottom: 8px;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.category-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.category-check {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
}

.category-card.active .category-check {
  opacity: 1;
  background: #667eea;
}

.category-check svg {
  width: 12px;
  height: 12px;
  color: white;
}

/* 自定义文本域 */
:deep(.custom-textarea .el-textarea__inner) {
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  padding: 12px 14px;
  font-size: 14px;
  color: #1f2937;
  transition: all 0.2s ease;
  resize: vertical;
}

:deep(.custom-textarea .el-textarea__inner:hover) {
  border-color: #d1d5db;
}

:deep(.custom-textarea .el-textarea__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

:deep(.custom-textarea .el-textarea__inner::placeholder) {
  color: #9ca3af;
}

/* 对话框底部 */
.dialog-footer {
  padding: 20px 28px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  background: #fafafa;
}

/* 按钮基础样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 次要按钮 */
.btn-secondary {
  background: white;
  color: #6b7280;
  border: 1.5px solid #e5e7eb;
}

.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-content svg {
  width: 16px;
  height: 16px;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .create-dialog {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .dialog-header {
    padding: 20px;
  }

  .icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .header-text h2 {
    font-size: 18px;
  }

  .header-text p {
    font-size: 12px;
  }

  .dialog-body {
    padding: 20px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .dialog-footer {
    padding: 16px 20px;
  }
}
</style>
