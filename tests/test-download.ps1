# PowerShell 版本的範本下載測試腳本
# 用途：直接測試範本下載 API（無需認證）
# 執行：.\test-download.ps1

param(
    [string]$Hostname = "localhost",
    [int]$Port = 3000,
    [string]$TemplateId = "template-1"
)

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "範本下載 API 測試工具 (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$url = "http://${Hostname}:${Port}/api/templates/download/${TemplateId}"
Write-Host "`n測試 URL: $url" -ForegroundColor Blue

# 創建輸出目錄
$outputDir = Join-Path $PSScriptRoot "test-downloads"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
    Write-Host "✅ 創建輸出目錄: $outputDir" -ForegroundColor Green
}

try {
    Write-Host "`n📡 發送請求..." -ForegroundColor Yellow
    $startTime = Get-Date
    
    # 發送請求
    $response = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing
    
    $duration = (Get-Date) - $startTime
    
    Write-Host "`n✅ 請求成功！" -ForegroundColor Green
    Write-Host "📊 狀態碼: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "📦 檔案大小: $($response.Content.Length) bytes" -ForegroundColor Green
    Write-Host "⏱️  耗時: $($duration.TotalMilliseconds) ms" -ForegroundColor Green
    
    # 解析檔名 - 處理可能的 null 或空值
    $filename = "unknown"
    try {
        $contentDisposition = $response.Headers['Content-Disposition']
        if ($contentDisposition -and $contentDisposition -match 'filename="?([^"]+)"?') {
            $filename = $matches[1]
        }
    } catch {
        Write-Host "`n⚠️  無法解析檔名，使用預設名稱" -ForegroundColor Yellow
    }
    
    Write-Host "`n📄 檔案資訊:" -ForegroundColor Yellow
    Write-Host "   檔名: $filename" -ForegroundColor White
    
    # 安全獲取 Content-Type
    $contentType = "unknown"
    try {
        if ($response.Headers['Content-Type']) {
            $contentType = $response.Headers['Content-Type']
        }
    } catch {
        # 忽略錯誤
    }
    Write-Host "   Content-Type: $contentType" -ForegroundColor White
    
    # 儲存檔案
    $outputPath = Join-Path $outputDir $filename
    [System.IO.File]::WriteAllBytes($outputPath, $response.Content)
    
    Write-Host "`n💾 檔案已儲存:" -ForegroundColor Green
    Write-Host "   路徑: $outputPath" -ForegroundColor White
    Write-Host "   大小: $([System.IO.File]::ReadAllBytes($outputPath).Length) bytes" -ForegroundColor White
    
    # 驗證檔案
    if (Test-Path $outputPath) {
        $fileInfo = Get-Item $outputPath
        Write-Host "`n🔍 檔案驗證:" -ForegroundColor Yellow
        Write-Host "   ✅ 檔案存在" -ForegroundColor Green
        Write-Host "   ✅ 可讀取" -ForegroundColor Green
        Write-Host "   📊 實際大小: $($fileInfo.Length) bytes" -ForegroundColor Green
        
        # 嘗試在檔案總管中開啟目錄
        Write-Host "`n📂 開啟下載目錄..." -ForegroundColor Blue
        Start-Process explorer.exe -ArgumentList $outputDir
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "✅ 測試完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ 測試失敗！" -ForegroundColor Red
    Write-Host "錯誤訊息: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "`n📊 Response 詳情:" -ForegroundColor Yellow
        Write-Host "   狀態碼: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "   狀態描述: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
    
    Write-Host "`n💡 可能的原因:" -ForegroundColor Yellow
    Write-Host "   1. 後端服務未啟動 (請檢查 http://${Hostname}:${Port})" -ForegroundColor White
    Write-Host "   2. 範本 ID 不存在: $TemplateId" -ForegroundColor White
    Write-Host "   3. 範本檔案不存在於 backend/templates/ 目錄" -ForegroundColor White
    Write-Host "   4. 網路連線問題" -ForegroundColor White
    
    exit 1
}

Write-Host "`n💡 提示:" -ForegroundColor Cyan
Write-Host "測試其他範本: .\test-download.ps1 -TemplateId template-2" -ForegroundColor White
Write-Host "測試遠端伺服器: .\test-download.ps1 -Hostname 192.168.123.83 -Port 3000" -ForegroundColor White
