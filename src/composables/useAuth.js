// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from 'src/boot/vuefire'
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

// 全局狀態
const currentUser = ref(null)
const userRole = ref(null)
const loading = ref(true)
const error = ref(null)

// 初始化認證狀態監聽
onAuthStateChanged(auth, async (user) => {
  loading.value = true

  if (user) {
    try {
      // 獲取 ID Token
      const idToken = await user.getIdToken()

      // 向後端驗證並獲取角色
      const response = await axios.post(
        `${API_BASE}/auth/verify`,
        { idToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      currentUser.value = user
      userRole.value = response.data.user.role
      error.value = null
    } catch (err) {
      console.error('認證失敗:', err)
      error.value = err.response?.data?.message || '認證失敗'
      currentUser.value = null
      userRole.value = null
    }
  } else {
    currentUser.value = null
    userRole.value = null
  }

  loading.value = false
})

export function useAuth() {
  // 使用 Google 登入
  const signIn = async () => {
    try {
      loading.value = true
      error.value = null

      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      // 向後端驗證
      const response = await axios.post(
        `${API_BASE}/auth/verify`,
        { idToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      currentUser.value = result.user
      userRole.value = response.data.user.role

      return { success: true, user: result.user }
    } catch (err) {
      console.error('登入失敗:', err)
      error.value = err.response?.data?.message || err.message || '登入失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    try {
      loading.value = true
      await firebaseSignOut(auth)
      currentUser.value = null
      userRole.value = null
      error.value = null
      return { success: true }
    } catch (err) {
      console.error('登出失敗:', err)
      error.value = err.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 獲取當前 ID Token (用於 API 請求)
  const getIdToken = async () => {
    if (!currentUser.value) return null
    return await currentUser.value.getIdToken()
  }

  // Computed properties
  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isTeacher = computed(() => userRole.value === 'teacher')

  return {
    // State
    currentUser,
    userRole,
    loading,
    error,

    // Methods
    signIn,
    signOut,
    getIdToken,

    // Computed
    isAuthenticated,
    isAdmin,
    isTeacher,
  }
}
