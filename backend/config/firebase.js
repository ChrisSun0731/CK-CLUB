import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let db, auth

export function initializeFirebase() {
  try {
    // 讀取 Service Account JSON
    const serviceAccountPath = join(__dirname, '../serviceAccount.json')
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })

    db = admin.firestore()
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

export function getAuth() {
  return auth
}
