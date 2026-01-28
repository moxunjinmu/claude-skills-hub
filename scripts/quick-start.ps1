# 快速启动脚本
# 使用方法: .\scripts\quick-start.ps1

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Claude Skills Hub - 快速启动" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Docker 是否运行
Write-Host "检查 Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker 正在运行" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker 未运行，请先启动 Docker Desktop" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 启动数据库服务
Write-Host "启动数据库服务..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 数据库服务已启动" -ForegroundColor Green
} else {
    Write-Host "✗ 数据库服务启动失败" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 等待数据库就绪
Write-Host "等待数据库就绪..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "✓ 数据库应该已就绪" -ForegroundColor Green
Write-Host ""

# 生成 Prisma Client
Write-Host "生成 Prisma Client..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client 已生成" -ForegroundColor Green
} else {
    Write-Host "✗ Prisma Client 生成失败" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 检查是否需要运行迁移
Write-Host "检查数据库迁移..." -ForegroundColor Yellow
$migrationsExist = Test-Path "prisma/migrations"
if (-not $migrationsExist) {
    Write-Host "! 首次运行，需要创建数据库迁移" -ForegroundColor Yellow
    Write-Host "请输入迁移名称 (例如: init): " -NoNewline
    $migrationName = Read-Host
    
    if ([string]::IsNullOrWhiteSpace($migrationName)) {
        $migrationName = "init"
    }
    
    npm run db:migrate -- --name $migrationName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 数据库迁移完成" -ForegroundColor Green
    } else {
        Write-Host "✗ 数据库迁移失败" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ 迁移文件已存在" -ForegroundColor Green
    npm run db:migrate
}
Write-Host ""

# 填充初始数据
Write-Host "是否填充初始数据? (y/n): " -NoNewline
$seedChoice = Read-Host
if ($seedChoice -eq "y" -or $seedChoice -eq "Y") {
    Write-Host "填充初始数据..." -ForegroundColor Yellow
    npm run db:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 初始数据已填充" -ForegroundColor Green
    } else {
        Write-Host "! 初始数据填充失败（可能已存在）" -ForegroundColor Yellow
    }
}
Write-Host ""

# 启动开发服务器
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "准备就绪！" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "现在可以运行以下命令:" -ForegroundColor Yellow
Write-Host "  npm run dev          - 启动开发服务器" -ForegroundColor White
Write-Host "  npm run db:studio    - 打开 Prisma Studio" -ForegroundColor White
Write-Host "  .\scripts\test-api.ps1 - 运行 API 测试" -ForegroundColor White
Write-Host ""
Write-Host "是否现在启动开发服务器? (y/n): " -NoNewline
$devChoice = Read-Host
if ($devChoice -eq "y" -or $devChoice -eq "Y") {
    Write-Host ""
    Write-Host "启动开发服务器..." -ForegroundColor Green
    Write-Host "访问 http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    npm run dev
}
