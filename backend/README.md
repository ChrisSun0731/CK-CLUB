# CK Club Backend API

## 環境設置

### 1. 安裝依賴

```bash
cd backend
npm install
```

### 2. Firebase Admin SDK 設置

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇專案: `ck-cl-24edb`
3. 進入 **Project Settings** > **Service Accounts**
4. 點擊 **Generate New Private Key**
5. 下載 JSON 檔案,重新命名為 `serviceAccount.json`
6. 將檔案放到 `backend/` 目錄下

### 3. 環境變數設置

複製 `.env.example` 為 `.env`:

```bash
cp .env.example .env
```

### 4. 上傳 PDF 範本到 Firebase Storage

使用 Firebase Console 或 gsutil 上傳兩個 PDF 範本:

- `templates/會辦單_契約書.pdf`
- `templates/資料卡.pdf`

### 5. 啟動服務器

開發模式 (自動重啟):

```bash
npm run dev
```

生產模式:

```bash
npm start
```

服務器預設運行在 `http://localhost:3000`

---

## API 端點

### 健康檢查

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-01T10:00:00.000Z"
}
```

---

## 認證 API

### 1. 驗證用戶並設置角色

```http
POST /api/auth/verify
Content-Type: application/json

{
  "idToken": "Firebase_ID_Token"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "uid": "abc123",
    "email": "teacher@tp.edu.tw",
    "role": "teacher"
  }
}
```

### 2. 獲取當前用戶資訊

```http
GET /api/auth/me
Authorization: Bearer {idToken}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "uid": "abc123",
    "email": "teacher@tp.edu.tw",
    "role": "teacher",
    "lastLogin": "2025-10-01T10:00:00Z"
  }
}
```

---

## 提交 API

### 1. 提交外聘教師資料

```http
POST /api/submissions
Authorization: Bearer {idToken}
Content-Type: multipart/form-data

{
  "club": "籃球社",
  "clubCode": "113",
  "teacherName": "李教練",
  "lineId": "coach_lee",
  "items": {...},
  "contractFile": (file),
  "dataCardFile": (file)
}
```

**Response:**

```json
{
  "success": true,
  "submissionId": "submission_12345",
  "data": {...}
}
```

### 2. 獲取所有提交 (管理員)

```http
GET /api/submissions?status=pending&limit=50
Authorization: Bearer {adminToken}
```

**Query Parameters:**

- `status`: 過濾狀態 (pending/approved/rejected)
- `club`: 過濾社團
- `limit`: 限制數量 (預設 50)

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### 3. 獲取單筆提交

```http
GET /api/submissions/{id}
Authorization: Bearer {idToken}
```

### 4. 更新提交狀態 (管理員)

```http
PATCH /api/submissions/{id}
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "status": "approved",
  "reviewNote": "審核通過"
}
```

### 5. 刪除提交 (管理員)

```http
DELETE /api/submissions/{id}
Authorization: Bearer {adminToken}
```

---

## 範本 API

### 1. 獲取範本列表

```http
GET /api/templates
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "template-1",
      "name": "校外社團指導教師會辦單+契約書",
      "filename": "會辦單_契約書.pdf",
      "description": "所有外聘老師每年皆須繳交",
      "url": "/api/templates/download/template-1"
    }
  ]
}
```

### 2. 下載範本

```http
GET /api/templates/download/{id}
```

**Response:**

```json
{
  "success": true,
  "downloadUrl": "https://storage.googleapis.com/..."
}
```

---

## 錯誤處理

所有錯誤回應格式:

```json
{
  "error": "Error Type",
  "message": "錯誤描述"
}
```

**HTTP 狀態碼:**

- `400` - Bad Request (請求參數錯誤)
- `401` - Unauthorized (未認證)
- `403` - Forbidden (權限不足)
- `404` - Not Found (資源不存在)
- `500` - Internal Server Error (服務器錯誤)

---

## 部署建議

### 使用 Cloud Run

```bash
# 建立 Dockerfile
# 部署到 Google Cloud Run
gcloud run deploy ck-club-backend \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated
```

### 使用 Cloud Functions

將每個路由改為 Cloud Function 並部署。
