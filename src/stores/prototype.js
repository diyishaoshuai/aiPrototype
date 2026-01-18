import { defineStore } from 'pinia'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export const usePrototypeStore = defineStore('prototype', {
  state: () => ({
    prototypes: [],
    loading: false,
    currentPrototype: null
  }),

  actions: {
    async fetchPrototypes(params = {}) {
      this.loading = true
      try {
        const response = await axios.get('/api/prototypes', { params })
        this.prototypes = response.data
      } catch (error) {
        console.error('获取原型列表失败:', error)
        ElMessage.error('获取原型列表失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    async getPrototype(id) {
      try {
        const response = await axios.get(`/api/prototypes/${id}`)
        this.currentPrototype = response.data
        return response.data
      } catch (error) {
        console.error('获取原型失败:', error)
        ElMessage.error('获取原型详情失败，请稍后重试')
        throw error
      }
    },

    async createPrototype(data) {
      try {
        const response = await axios.post('/api/prototypes', data)
        this.prototypes.push(response.data)
        return response.data
      } catch (error) {
        console.error('创建原型失败:', error)
        ElMessage.error('创建原型失败，请检查输入信息')
        throw error
      }
    },

    async updatePrototype(id, data) {
      try {
        const response = await axios.put(`/api/prototypes/${id}`, data)
        const index = this.prototypes.findIndex(p => p._id === id)
        if (index !== -1) {
          this.prototypes[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error('更新原型失败:', error)
        ElMessage.error('更新原型失败，请检查输入信息')
        throw error
      }
    },

    async deletePrototype(id) {
      try {
        await axios.delete(`/api/prototypes/${id}`)
        this.prototypes = this.prototypes.filter(p => p._id !== id)
      } catch (error) {
        console.error('删除原型失败:', error)
        ElMessage.error('删除原型失败，请稍后重试')
        throw error
      }
    }
  }
})
