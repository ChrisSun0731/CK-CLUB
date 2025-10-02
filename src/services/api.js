// src/services/api.js
import axios from 'axios'
import { auth } from 'src/boot/vuefire'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

// 創建 axios 實例
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器:自動添加 Authorization header
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser
    if (user) {
      const token = await user.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 回應攔截器:統一錯誤處理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message
    console.error('API Error:', message)
    return Promise.reject(error)
  },
)

// ==================== 提交 API ====================

/**
 * 提交外聘教師資料
 * @param {FormData} formData - 包含文字欄位和檔案
 */
export async function createSubmission(formData) {
  const response = await api.post('/submissions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * 獲取所有提交 (管理員)
 * @param {Object} params - 查詢參數 { status, club, limit }
 */
export async function getSubmissions(params = {}) {
  const response = await api.get('/submissions', { params })
  return response.data
}

/**
 * 獲取單筆提交
 * @param {string} id - 提交 ID
 */
export async function getSubmission(id) {
  const response = await api.get(`/submissions/${id}`)
  return response.data
}

/**
 * 更新提交狀態 (管理員)
 * @param {string} id - 提交 ID
 * @param {Object} data - { status, reviewNote }
 */
export async function updateSubmissionStatus(id, data) {
  const response = await api.patch(`/submissions/${id}`, data)
  return response.data
}

/**
 * 刪除提交 (管理員)
 * @param {string} id - 提交 ID
 */
export async function deleteSubmission(id) {
  const response = await api.delete(`/submissions/${id}`)
  return response.data
}

// ==================== 範本 API ====================

/**
 * 獲取範本列表
 */
export async function getTemplates() {
  const response = await api.get('/templates')
  return response.data
}

/**
 * 獲取範本下載連結
 * @param {string} id - 範本 ID
 */
export async function getTemplateDownloadUrl(id) {
  const response = await api.get(`/templates/download/${id}`)
  return response.data
}

// ==================== 用戶 API ====================

/**
 * 獲取當前用戶資訊
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me')
  return response.data
}

export default api
