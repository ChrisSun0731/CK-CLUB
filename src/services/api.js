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
 * 下載範本檔案
 * @param {string} id - 範本 ID
 */
export async function downloadTemplate(id) {
  console.log('[downloadTemplate] Starting download for:', id)

  const response = await api.get(`/templates/download/${id}`, {
    responseType: 'blob',
  })

  console.log('[downloadTemplate] Response received:', {
    status: response.status,
    contentType: response.headers['content-type'],
    contentDisposition: response.headers['content-disposition'],
    dataSize: response.data.size,
  })

  // 從 Content-Disposition header 獲取檔名
  const contentDisposition = response.headers['content-disposition']
  let filename = `template-${id}.pdf`

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/)
    if (match) {
      filename = match[1]
    }
  }

  console.log('[downloadTemplate] Parsed filename:', filename)

  // 獲取正確的 MIME type
  const mimeType = response.headers['content-type'] || 'application/octet-stream'

  // 創建 blob URL 並觸發下載
  const blob = new Blob([response.data], { type: mimeType })
  console.log('[downloadTemplate] Blob created:', {
    size: blob.size,
    type: blob.type,
  })

  const url = window.URL.createObjectURL(blob)
  console.log('[downloadTemplate] Blob URL created:', url)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  console.log('[downloadTemplate] Link element created:', {
    href: link.href,
    download: link.download,
  })

  document.body.appendChild(link)
  console.log('[downloadTemplate] Link appended to body')

  // 使用 setTimeout 確保 DOM 更新完成
  setTimeout(() => {
    console.log('[downloadTemplate] Triggering click...')
    link.click()
    console.log('[downloadTemplate] Click triggered')

    // 短暫延遲後清理
    setTimeout(() => {
      console.log('[downloadTemplate] Cleaning up...')
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      console.log('[downloadTemplate] Cleanup completed')
    }, 100)
  }, 0)

  return { success: true, filename }
}

/**
 * 獲取範本下載連結（已廢棄，使用 downloadTemplate 代替）
 * @param {string} id - 範本 ID
 * @deprecated
 */
export async function getTemplateDownloadUrl(id) {
  return downloadTemplate(id)
} // ==================== 用戶 API ====================

/**
 * 獲取當前用戶資訊
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me')
  return response.data
}

export default api
