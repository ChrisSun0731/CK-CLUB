import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let db, storage, auth

export function initializeFirebase() {
  try {
    // 讀取 Service Account JSON
    const serviceAccountPath = join(__dirname, '../serviceAccount.json')
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })

    db = admin.firestore()
    storage = admin.storage().bucket()
    auth = admin.auth()

    console.log('✅ Firebase Admin initialized successfully')
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message)
    process.exit(1)
  }
}

export function getFirestore() {
  return db
}

export function getStorage() {
  return storage
}

export function getAuth() {
  return auth
}
