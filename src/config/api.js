/**
 * 前端 API 配置
 * 统一管理 API 请求
 */

// API 基础地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// API 端点配置
export const API_ENDPOINTS = {
  // 原型相关
  prototypes: {
    list: '/api/prototypes',
    detail: (id) => `/api/prototypes/${id}`,
    create: '/api/prototypes',
    update: (id) => `/api/prototypes/${id}`,
    delete: (id) => `/api/prototypes/${id}`,
    search: '/api/prototypes/search'
  },

  // 健康检查
  health: '/health'
}

// 创建完整的 API URL
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

export default {
  baseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS,
  createUrl: createApiUrl
}
