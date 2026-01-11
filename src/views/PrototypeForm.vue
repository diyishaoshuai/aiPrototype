<template>
  <div class="form-page">
    <div class="form-header">
      <div class="header-content">
        <h2>{{ isEdit ? '编辑原型' : '新建原型' }}</h2>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>

    <div class="form-container">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="原型标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入原型标题" />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="移动端" value="移动端" />
            <el-option label="PC端" value="PC端" />
            <el-option label="后台管理" value="后台管理" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入原型描述"
          />
        </el-form-item>

        <el-form-item label="文件路径" prop="filePath">
          <el-input
            v-model="form.filePath"
            placeholder="/prototypes/your-file.html"
          >
            <template #prepend>public</template>
          </el-input>
          <div class="form-tip">
            提示：在本地编辑器中编辑 HTML 文件，保存到 public/prototypes/ 目录
          </div>
        </el-form-item>

        <el-form-item label="标签">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            @close="removeTag(tag)"
            style="margin-right: 8px"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="tagInputVisible"
            ref="tagInputRef"
            v-model="tagInputValue"
            size="small"
            style="width: 100px"
            @keyup.enter="addTag"
            @blur="addTag"
          />
          <el-button v-else size="small" @click="showTagInput">+ 添加标签</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePrototypeStore } from '@/stores/prototype'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = usePrototypeStore()

const formRef = ref(null)
const tagInputRef = ref(null)
const isEdit = ref(false)
const submitting = ref(false)
const tagInputVisible = ref(false)
const tagInputValue = ref('')

const form = reactive({
  title: '',
  category: '移动端',
  description: '',
  filePath: '',
  tags: []
})

const rules = {
  title: [{ required: true, message: '请输入原型标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  filePath: [{ required: true, message: '请输入文件路径', trigger: 'blur' }]
}

onMounted(async () => {
  if (route.params.id && route.params.id !== 'new') {
    isEdit.value = true
    const prototype = await store.getPrototype(route.params.id)
    if (prototype) {
      Object.assign(form, prototype)
    }
  }
})

const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const addTag = () => {
  if (tagInputValue.value && !form.tags.includes(tagInputValue.value)) {
    form.tags.push(tagInputValue.value)
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

const removeTag = (tag) => {
  form.tags = form.tags.filter(t => t !== tag)
}

const submitForm = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (isEdit.value) {
          await store.updatePrototype(route.params.id, form)
          ElMessage.success('更新成功')
        } else {
          await store.createPrototype(form)
          ElMessage.success('创建成功')
        }
        router.push('/dashboard')
      } catch (error) {
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
  background: #f5f7fa;
}

.form-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 16px 0;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  font-size: 20px;
}

.form-container {
  max-width: 800px;
  margin: 32px auto;
  padding: 0 20px;
}

.el-form {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
