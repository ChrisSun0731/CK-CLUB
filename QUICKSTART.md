# 🚀 快速開始指南

## 立即開始使用 CK Club 社團管理系統

### 📋 前置要求

- Node.js >= 20
- Firebase 專案 (已設置: `ck-cl-24edb`)
- Google 帳號 (台北市教育帳號 @tp.edu.tw)

---

## ⚡ 5 分鐘快速設置

### 步驟 1: Firebase Console 設置 (3 分鐘)

1. **前往** [Firebase Console](https://console.firebase.google.com/project/ck-cl-24edb)

2. **啟用 Authentication**

   - 左側選單 → Authentication
   - Sign-in method → Google → 啟用
   - 授權網域 → 確認包含 `localhost`

3. **下載 Service Account**

   - 齒輪圖示 → 專案設定 → 服務帳戶
   - 「產生新的私密金鑰」→ 下載 JSON
   - 重命名為 `serviceAccount.json`
   - 移動到 `backend/` 資料夾

4. **上傳 PDF 範本**

   - 左側選單 → Storage
   - 建立資料夾 `templates/`
   - 上傳兩個 PDF:
     - `會辦單_契約書.pdf`
     - `資料卡.pdf`

5. **設定安全規則** (複製貼上即可)

   **Firestore Rules:**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == userId;
       }
       match /submissions/{submissionId} {
         allow create: if request.auth != null;
         allow read: if request.auth != null &&
           (resource.data.submittedBy == request.auth.uid ||
            request.auth.token.role == 'admin');
         allow update, delete: if request.auth != null &&
           request.auth.token.role == 'admin';
       }
       match /clubs/{clubId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null &&
           request.auth.token.role == 'admin';
       }
     }
   }
   ```

   **Storage Rules:**

   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /templates/{filename} {
         allow read: if request.auth != null;
       }
       match /submissions/{filename} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

---

### 步驟 2: 啟動後端 (1 分鐘)

```bash
# 進入 backend 目錄
cd backend

# 安裝依賴
npm install

# 複製環境變數 (預設值已足夠)
cp .env.example .env

# 啟動服務器
npm run dev
```

✅ 看到 `🚀 Server running at http://0.0.0.0:3000` 表示成功!

---

### 步驟 3: 啟動前端 (1 分鐘)

**開啟新的終端視窗:**

```bash
# 回到專案根目錄
cd ..

# 安裝依賴 (如果還沒裝)
npm install

# 啟動 Quasar
npm run dev
```

✅ 瀏覽器自動開啟 `http://localhost:9000` 表示成功!

---

## 🧪 測試系統

### 1. 測試登入

1. 開啟 `http://localhost:9000`
2. 點擊「登入」按鈕
3. 選擇台北市教育帳號 (`@tp.edu.tw`)
4. 成功後會顯示用戶名稱

### 2. 測試提交資料

1. 前往「資料上傳」頁面
2. 填寫表單:
   - 社團名稱: 籃球社
   - 年級: 2
   - 教師姓名: 測試教師
   - Line ID: test123
3. 勾選「會辦單+契約書」
4. 上傳一個 PDF 檔案 (< 10MB)
5. 點擊「提交資料」
6. 看到「資料提交成功」通知

### 3. 測試下載範本

1. 在「資料上傳」頁面右側
2. 點擊「會辦單\_契約書.pdf」
3. 新分頁開啟 PDF 下載連結

### 4. 測試後台管理 (需要管理員帳號)

**設置管理員:**

- Email 必須包含 `admin` 或 `affair`
- 例如: `admin@tp.edu.tw`, `affair001@tp.edu.tw`

1. 使用管理員帳號登入
2. 前往「後台管理」頁面
3. 看到剛才提交的資料
4. 點擊列表查看詳情
5. 點擊「批准」或「拒絕」

---

## 🔍 檢查清單

在開始使用前,確認以下項目:

**Firebase:**

- [ ] Google 登入已啟用
- [ ] `serviceAccount.json` 已放置在 `backend/`
- [ ] PDF 範本已上傳到 Storage
- [ ] Firestore 規則已設定
- [ ] Storage 規則已設定

**後端:**

- [ ] 終端顯示 `Server running`
- [ ] 訪問 `http://localhost:3000/health` 看到 `{"status":"ok"}`

**前端:**

- [ ] 瀏覽器開啟 `http://localhost:9000`
- [ ] 沒有控制台錯誤

---

## 🆘 常見問題

### Q: 後端啟動失敗 "Error: ENOENT: no such file or directory"

**A:** 缺少 `serviceAccount.json`,請重新下載並放到 `backend/` 目錄。

### Q: 登入後顯示 "僅限台北市教育帳號登入"

**A:** 確保使用的 Google 帳號是 `@tp.edu.tw` 結尾。

### Q: 範本下載失敗

**A:**

1. 確認 PDF 已上傳到 Firebase Storage
2. 路徑必須是 `templates/會辦單_契約書.pdf` 和 `templates/資料卡.pdf`
3. Storage 規則允許讀取

### Q: 無法訪問後台管理

**A:**

1. 確保登入的 Email 包含 `admin` 或 `affair`
2. 或修改 `backend/routes/auth.js` 第 38-40 行的邏輯

---

## 📚 下一步

- 閱讀 [`ARCHITECTURE.md`](./ARCHITECTURE.md) 了解完整架構
- 閱讀 [`backend/README.md`](./backend/README.md) 了解 API 文件
- 閱讀 [`backend/DATABASE.md`](./backend/DATABASE.md) 了解資料庫結構

---

## 💡 提示

**開發技巧:**

- 後端修改會自動重啟 (`--watch`)
- 前端修改會熱重載 (HMR)
- 使用 `console.log()` 除錯
- 檢查瀏覽器開發者工具的 Network 和 Console

**部署前:**

- 修改 `src/services/api.js` 中的 `API_BASE` 為你的後端網址
- 建置前端: `npm run build`
- 部署後端到 Cloud Run 或其他平台

---

**需要幫助?** 聯絡: chris20090731@gmail.com
