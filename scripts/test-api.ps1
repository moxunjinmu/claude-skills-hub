# API 测试脚本 (PowerShell)
# 使用方法: .\scripts\test-api.ps1

$BaseUrl = "http://localhost:3000"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Claude Skills Hub - API 测试" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 测试 1: 用户注册
Write-Host "测试 1: 用户注册" -ForegroundColor Yellow
$registerBody = @{
    email = "testuser@example.com"
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody

    if ($registerResponse.message -eq "User registered successfully") {
        Write-Host "✓ 注册成功" -ForegroundColor Green
        $token = $registerResponse.data.token
        Write-Host "Token: $($token.Substring(0, 20))..."
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "! 用户已存在，尝试登录..." -ForegroundColor Yellow
    } else {
        Write-Host "✗ 注册失败: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# 测试 2: 用户登录
Write-Host "测试 2: 用户登录" -ForegroundColor Yellow
$loginBody = @{
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    if ($loginResponse.message -eq "Login successful") {
        Write-Host "✓ 登录成功" -ForegroundColor Green
        $token = $loginResponse.data.token
        Write-Host "User ID: $($loginResponse.data.userId)"
    }
} catch {
    Write-Host "✗ 登录失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 测试 3: 获取 Skills 列表
Write-Host "测试 3: 获取 Skills 列表" -ForegroundColor Yellow
try {
    $skillsResponse = Invoke-RestMethod -Uri "$BaseUrl/api/skills" -Method Get

    if ($skillsResponse.message -eq "Skills retrieved successfully") {
        Write-Host "✓ 获取成功" -ForegroundColor Green
        Write-Host "总共 $($skillsResponse.data.total) 个 Skills"
        Write-Host "当前页: $($skillsResponse.data.page)"
    }
} catch {
    Write-Host "✗ 获取失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 测试 4: 带筛选的 Skills 列表
Write-Host "测试 4: 带筛选的 Skills 列表" -ForegroundColor Yellow
try {
    $filteredResponse = Invoke-RestMethod -Uri "$BaseUrl/api/skills?sort=newest&limit=5" -Method Get

    if ($filteredResponse.message -eq "Skills retrieved successfully") {
        Write-Host "✓ 筛选成功" -ForegroundColor Green
        Write-Host "返回 $($filteredResponse.data.skills.Count) 个结果"
    }
} catch {
    Write-Host "✗ 筛选失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 测试 5: 错误处理 - 无效登录
Write-Host "测试 5: 错误处理 - 无效登录" -ForegroundColor Yellow
$invalidLoginBody = @{
    email = "invalid@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $errorResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $invalidLoginBody
    
    Write-Host "✗ 应该返回错误但成功了" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ 错误处理正确 (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "! 返回了错误但状态码不对: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "测试完成！" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
