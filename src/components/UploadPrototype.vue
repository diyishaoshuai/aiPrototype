<template>
  <el-dialog
    v-model="visible"
    title="上传原型"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="原型名称" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入原型名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
          <el-option label="移动端" value="移动端" />
          <el-option label="网页端" value="网页端" />
          <el-option label="客户端" value="客户端" />
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入原型描述"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-input
          v-model="form.tags"
          placeholder="多个标签用逗号分隔，如：社交,直播"
        />
      </el-form-item>

      <el-form-item label="原型文件" prop="file">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          accept=".zip"
          drag
        >
          <div class="upload-area">
            <el-icon class="upload-icon"><upload-filled /></el-icon>
            <div class="upload-text">将 ZIP 文件拖到此处，或<em>点击上传</em></div>
            <div class="upload-tip">只支持 .zip 格式，文件大小不超过 50MB</div>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="uploading" @click="handleSubmit">
          {{ uploading ? '上传中...' : '确定上传' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import axios from 'axios'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const formRef = ref(null)
const uploadRef = ref(null)
const uploading = ref(false)

const form = reactive({
  title: '',
  category: '',
  description: '',
  tags: '',
  file: null
})

const rules = {
  title: [
    { required: true, message: '请输入原型名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  file: [
    { required: true, message: '请上传原型文件', trigger: 'change' }
  ]
}

// 文件选择处理
const handleFileChange = (file) => {
  const isZip = file.name.endsWith('.zip')
  const isLt50M = file.size / 1024 / 1024 < 50

  if (!isZip) {
    ElMessage.error('只支持 .zip 格式的文件')
    uploadRef.value.clearFiles()
    return false
  }

  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB')
    uploadRef.value.clearFiles()
    return false
  }

  form.file = file.raw
  return true
}

// 文件超出限制处理
const handleExceed = () => {
  ElMessage.warning('只能上传一个文件')
}

// 提交上传
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (!form.file) {
      ElMessage.error('请选择要上传的文件')
      return
    }

    uploading.value = true

    try {
      const formData = new FormData()
      formData.append('file', form.file)
      formData.append('title', form.title)
      formData.append('category', form.category)
      formData.append('description', form.description)
      formData.append('tags', form.tags)

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
      const response = await axios.post(`${apiBaseUrl}/api/prototypes/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        ElMessage.success('上传成功')
        emit('success')
        handleClose()
      } else {
        ElMessage.error(response.data.error || '上传失败')
      }
    } catch (error) {
      console.error('上传失败:', error)
      ElMessage.error(error.response?.data?.error || '上传失败，请重试')
    } finally {
      uploading.value = false
    }
  })
}

// 关闭对话框
const handleClose = () => {
  formRef.value?.resetFields()
  uploadRef.value?.clearFiles()
  form.file = null
  emit('update:modelValue', false)
}

// 监听 props 变化
import { watch } from 'vue'
watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  if (!val) {
    emit('update:modelValue', false)
  }
})
</script>

<style scoped>
.upload-area {
  padding: 40px;
  text-align: center;
}

.upload-icon {
  font-size: 64px;
  color: #667eea;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #606266;
  margin-bottom: 8px;
}

.upload-text em {
  color: #667eea;
  font-style: normal;
  cursor: pointer;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
