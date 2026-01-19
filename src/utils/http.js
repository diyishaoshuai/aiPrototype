/**
 * HTTP 请求工具
 * 基于 fetch API 封装
 */

import apiConfig from '../config/api.js'

class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async request(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(`${this.baseUrl}${url}`, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || '请求失败')
      }

      return data
    } catch (error) {
      console.error('API 请求错误:', error)
      throw error
    }
  }

  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' })
  }

  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' })
  }
}

// 创建默认实例
const http = new HttpClient(apiConfig.baseUrl)

export default http
