import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { useFirebaseApp, VueFire } from 'vuefire'
import { createGtag } from 'vue-gtag'
import type { HttpsCallable } from '@firebase/functions'
import { getFunctions, httpsCallable } from '@firebase/functions'

// 使用統一的 Firebase 配置 (CK-CLUB 專案)
export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyAmbyVzqkR_hyDS05oaWsdLX10LESyYkZU',
  authDomain: 'ck-cl-24edb.firebaseapp.com',
  projectId: 'ck-cl-24edb',
  messagingSenderId: '431687323765',
  appId: '1:431687323765:web:ae4c730ab1d7236e8ca83c',
  measurementId: 'G-YJN8BVWQV3',
})
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  app.use(VueFire, {
    firebaseApp,
    modules: [],
  })
  app.use(
    createGtag({
      appName: 'CKSC Legislation Quasar App',
      tagId: firebaseApp.options.measurementId!,
    }),
  )
})

export function useFunction(name: string): HttpsCallable {
  return httpsCallable(getFunctions(useFirebaseApp(), 'asia-east1'), name)
}

// Firebase 服務實例
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const googleProvider = new GoogleAuthProvider()

// 便捷函數
export function useAuth() {
  return auth
}

export function useFirestore() {
  return db
}
