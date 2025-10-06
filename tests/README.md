# 測試腳本目錄

本目錄包含用於測試 CK-CLUB 專案各項功能的測試腳本。

---

## 📦 測試腳本清單

### **API 測試**

#### **test-download.ps1** (PowerShell)

**用途**: 測試範本下載 API  
**平台**: Windows (PowerShell)  
**特點**:

- ✅ 無需額外安裝
- ✅ 彩色輸出，易於閱讀
- ✅ 自動儲存下載檔案到 `test-downloads/`
- ✅ 自動開啟檔案總管
- ✅ 詳細的錯誤診斷

**使用方式**:

```powershell
# 從專案根目錄執行
.\tests\test-download.ps1

# 測試範本 1 (PDF)
.\tests\test-download.ps1 -TemplateId template-1

# 測試範本 2 (DOC)
.\tests\test-download.ps1 -TemplateId template-2

# 測試遠端伺服器
.\tests\test-download.ps1 -Hostname 192.168.123.83 -Port 3000
```

#### **test-download.js** (Node.js)

**用途**: 批次測試所有範本下載  
**平台**: 跨平台 (Node.js)  
**特點**:

- ✅ 批次測試所有範本
- ✅ 詳細的測試報告
- ✅ 驗證檔名、大小、耗時
- ✅ 自動生成測試總結

**使用方式**:

```bash
# 從專案根目錄執行
node tests/test-download.js
```

---

## 🎯 快速測試

### **測試後端 API 是否正常**

```powershell
# 確保後端運行
cd backend
node server.js

# 另開終端，執行測試
.\tests\test-download.ps1
```

### **測試所有範本**

```bash
# 批次測試
node tests/test-download.js
```

---

## 📁 測試輸出

測試腳本會將下載的檔案儲存至：

```
tests/
  test-downloads/     # 測試下載的檔案
    meeting_form_contract.pdf
    data_card.doc
```

**注意**: `test-downloads/` 目錄已加入 `.gitignore`，不會提交到版本控制。

---

## 🔧 故障排除

### **問題: 找不到後端服務**

```
❌ 錯誤: 連線被拒絕
```

**解決方案**:

1. 確認後端服務已啟動: `cd backend && node server.js`
2. 確認端口 3000 未被佔用
3. 檢查防火牆設置

### **問題: 檔案下載失敗**

```
❌ 狀態碼: 404
```

**解決方案**:

1. 確認範本檔案存在於 `backend/templates/` 目錄
2. 檢查範本 ID 是否正確: `template-1` 或 `template-2`
3. 查看後端日誌: `backend/logs/template-*.log`

---

## 📚 相關文檔

- [API_TESTING_GUIDE.md](../docs-internal/API_TESTING_GUIDE.md) - 完整測試指南
- [QUICK_TEST_GUIDE.md](../docs-internal/QUICK_TEST_GUIDE.md) - 快速測試參考
- [PROBLEM_RESOLUTION.md](../docs-internal/PROBLEM_RESOLUTION.md) - 問題解決總結

---

## 🧪 添加新測試

如果要添加新的測試腳本：

1. 在本目錄創建新的測試檔案
2. 更新本 README 的清單
3. 在 `docs-internal/` 中更新相關文檔
4. 確保測試輸出目錄已加入 `.gitignore`

---

**建立日期**: 2025-10-05  
**最後更新**: 2025-10-05
