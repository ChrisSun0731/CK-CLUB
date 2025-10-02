# Firestore 資料庫結構設計

## Collections 概覽

```
ck-cl-24edb/
├── users/                    # 用戶資料
├── submissions/              # 外聘教師資料提交
├── clubs/                    # 社團資訊
└── templates/               # 範本管理 (可選)
```

---

## 1. users (用戶集合)

儲存登入用戶的基本資訊和權限

**Document ID**: Firebase Auth UID

**欄位**:

```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,            // 台北市教育帳號 (例: teacher@tp.edu.tw)
  role: string,             // 'teacher' | 'admin' | 'student'
  displayName: string,      // 顯示名稱 (可選)
  createdAt: timestamp,     // 帳號建立時間
  lastLogin: timestamp,     // 最後登入時間
}
```

**範例**:

```json
{
  "uid": "abc123xyz",
  "email": "teacher001@tp.edu.tw",
  "role": "teacher",
  "displayName": "王老師",
  "createdAt": "2025-10-01T10:00:00Z",
  "lastLogin": "2025-10-01T14:30:00Z"
}
```

---

## 2. submissions (提交資料集合)

儲存外聘指導教師的相關資料提交

**Document ID**: 自動生成

**欄位**:

```javascript
{
  // 基本資訊
  club: string,                  // 社團名稱
  clubCode: string,              // 社團代號
  clubLeader: string,            // 社長
  grade: number,                 // 年級

  // 教師資訊
  teacherName: string,           // 教師姓名
  lineId: string,                // Line ID

  // 繳交項目 (checkbox)
  items: {
    contractAndAgreement: boolean,  // 會辦單+契約書
    dataCard: boolean,               // 資料卡
    others: boolean,                 // 其他
    otherDescription: string,        // 其他說明
  },

  // 檔案上傳
  files: {
    contractFile: {
      filename: string,
      url: string,
      uploadedAt: timestamp,
    },
    dataCardFile: {
      filename: string,
      url: string,
      uploadedAt: timestamp,
    },
  },

  // 提交者資訊
  submittedBy: string,           // 提交者 UID
  submitterEmail: string,        // 提交者 email

  // 審核狀態
  status: string,                // 'pending' | 'approved' | 'rejected'
  reviewNote: string,            // 審核備註
  reviewedBy: string,            // 審核者 UID
  reviewedAt: timestamp,         // 審核時間

  // 時間戳記
  createdAt: timestamp,          // 建立時間
  updatedAt: timestamp,          // 更新時間
}
```

**範例**:

```json
{
  "club": "籃球社",
  "clubCode": "113",
  "clubLeader": "張同學",
  "grade": 2,
  "teacherName": "李教練",
  "lineId": "coach_lee",
  "items": {
    "contractAndAgreement": true,
    "dataCard": true,
    "others": false,
    "otherDescription": ""
  },
  "files": {
    "contractFile": {
      "filename": "contract_basketball.pdf",
      "url": "https://storage.googleapis.com/...",
      "uploadedAt": "2025-10-01T15:00:00Z"
    },
    "dataCardFile": {
      "filename": "datacard_lee.pdf",
      "url": "https://storage.googleapis.com/...",
      "uploadedAt": "2025-10-01T15:00:00Z"
    }
  },
  "submittedBy": "abc123xyz",
  "submitterEmail": "teacher001@tp.edu.tw",
  "status": "pending",
  "reviewNote": "",
  "reviewedBy": null,
  "reviewedAt": null,
  "createdAt": "2025-10-01T15:00:00Z",
  "updatedAt": "2025-10-01T15:00:00Z"
}
```

---

## 3. clubs (社團集合)

儲存建國中學的社團清單

**Document ID**: 社團代號 (clubCode)

**欄位**:

```javascript
{
  code: string,              // 社團代號 (例: "113")
  name: string,              // 社團名稱 (例: "籃球社")
  category: string,          // 類別 (例: "體育類")
  active: boolean,           // 是否啟用
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**範例**:

```json
{
  "code": "113",
  "name": "籃球社",
  "category": "體育類",
  "active": true,
  "createdAt": "2025-09-01T00:00:00Z",
  "updatedAt": "2025-09-01T00:00:00Z"
}
```

---

## Firestore 索引建議

為了優化查詢效能,建議在 Firebase Console 建立以下複合索引:

### submissions 索引

1. **按狀態和時間查詢**

   - Collection: `submissions`
   - Fields: `status` (Ascending), `createdAt` (Descending)

2. **按社團和時間查詢**

   - Collection: `submissions`
   - Fields: `club` (Ascending), `createdAt` (Descending)

3. **按提交者查詢**
   - Collection: `submissions`
   - Fields: `submittedBy` (Ascending), `createdAt` (Descending)

---

## Security Rules 建議

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Submissions collection
    match /submissions/{submissionId} {
      // 已登入用戶可以創建提交
      allow create: if request.auth != null;

      // 提交者本人和管理員可以讀取
      allow read: if request.auth != null &&
        (resource.data.submittedBy == request.auth.uid ||
         request.auth.token.role == 'admin');

      // 只有管理員可以更新和刪除
      allow update, delete: if request.auth != null &&
        request.auth.token.role == 'admin';
    }

    // Clubs collection (唯讀)
    match /clubs/{clubId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.auth.token.role == 'admin';
    }
  }
}
```

---

## Firebase Storage 結構

```
ck-cl-24edb.firebasestorage.app/
├── templates/                    # 範本 PDF
│   ├── 會辦單_契約書.pdf
│   └── 資料卡.pdf
└── submissions/                  # 用戶上傳的檔案
    ├── {timestamp}_{filename}.pdf
    └── ...
```

---

## 使用範例

### 前端 (Vue/Quasar) 查詢範例

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from 'src/boot/vuefire'

// 查詢待審核的提交
const q = query(collection(db, 'submissions'), where('status', '==', 'pending'))
const snapshot = await getDocs(q)
```

### 後端 (Fastify) 操作範例

```javascript
const db = getFirestore()

// 新增提交
await db.collection('submissions').add(data)

// 更新狀態
await db.collection('submissions').doc(id).update({ status: 'approved' })
```
