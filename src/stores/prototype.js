import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { mockPrototypes } from '@/data/mockPrototypes.js'

export const usePrototypeStore = defineStore('prototype', {
  state: () => ({
    prototypes: [...mockPrototypes],
    loading: false,
    currentPrototype: null
  }),

  actions: {
    async fetchPrototypes(params = {}) {
      this.loading = true
      try {
        // 模拟异步加载
        await new Promise(resolve => setTimeout(resolve, 300))

        let filtered = [...mockPrototypes]

        // 支持分类筛选
        if (params.category) {
          filtered = filtered.filter(p => p.category === params.category)
        }

        // 支持标签筛选
        if (params.tag) {
          filtered = filtered.filter(p => p.tags.includes(params.tag))
        }

        this.prototypes = filtered
      } catch (error) {
        console.error('获取原型列表失败:', error)
        ElMessage.error('获取原型列表失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    async getPrototype(id) {
      try {
        // 模拟异步加载
        await new Promise(resolve => setTimeout(resolve, 200))

        const prototype = mockPrototypes.find(p => p._id === id)
        if (!prototype) {
          throw new Error('原型不存在')
        }

        this.currentPrototype = prototype
        return prototype
      } catch (error) {
        console.error('获取原型失败:', error)
        ElMessage.error('获取原型详情失败，请稍后重试')
        throw error
      }
    },

    async createPrototype(data) {
      try {
        const newPrototype = {
          _id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.prototypes.push(newPrototype)
        ElMessage.success('创建成功（仅本地预览）')
        return newPrototype
      } catch (error) {
        console.error('创建原型失败:', error)
        ElMessage.error('创建原型失败，请检查输入信息')
        throw error
      }
    },

    async updatePrototype(id, data) {
      try {
        const index = this.prototypes.findIndex(p => p._id === id)
        if (index !== -1) {
          this.prototypes[index] = {
            ...this.prototypes[index],
            ...data,
            updatedAt: new Date().toISOString()
          }
          ElMessage.success('更新成功（仅本地预览）')
          return this.prototypes[index]
        }
        throw new Error('原型不存在')
      } catch (error) {
        console.error('更新原型失败:', error)
        ElMessage.error('更新原型失败，请检查输入信息')
        throw error
      }
    },

    async deletePrototype(id) {
      try {
        this.prototypes = this.prototypes.filter(p => p._id !== id)
        ElMessage.success('删除成功（仅本地预览）')
      } catch (error) {
        console.error('删除原型失败:', error)
        ElMessage.error('删除原型失败，请稍后重试')
        throw error
      }
    }
  }
})
