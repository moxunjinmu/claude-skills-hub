# 项目设置指南

## 前置要求

1. **安装 Docker Desktop**
   - 下载地址: https://www.docker.com/products/docker-desktop
   - 安装后启动 Docker Desktop

2. **Node.js 18+**
   - 确保已安装 Node.js 18 或更高版本

## 设置步骤

### 1. 启动数据库服务

确保 Docker Desktop 正在运行，然后执行：

```bash
cd claude-skills-hub
docker-compose up -d
```

这将启动 PostgreSQL 和 Redis 服务。

### 2. 生成 Prisma Client

```bash
npm run db:generate
```

### 3. 运行数据库迁移

```bash
npm run db:migrate
```

这将创建所有必要的数据库表。

### 4. 填充初始数据（可选）

```bash
npm run db:seed
```

这将创建：
- 6 个分类（文档处理、代码生成、数据分析等）
- 8 个标签（PDF、Markdown、TypeScript 等）
- 1 个测试用户（test@example.com）

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 常用命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run db:studio` - 打开 Prisma Studio（数据库可视化工具）
- `npm run db:push` - 推送 schema 变更到数据库（不创建迁移）
- `npm run lint` - 运行 ESLint
- `npm run format` - 格式化代码

## 故障排除

### Docker 无法启动

如果看到错误 "The system cannot find the file specified"，请：
1. 确保 Docker Desktop 已安装并正在运行
2. 在 Windows 上，确保 WSL 2 已启用
3. 重启 Docker Desktop

### 数据库连接失败

如果无法连接到数据库：
1. 检查 Docker 容器是否正在运行：`docker ps`
2. 检查 `.env.local` 中的 `DATABASE_URL` 是否正确
3. 尝试重启 Docker 容器：`docker-compose restart`

### Prisma 迁移失败

如果迁移失败：
1. 删除 `prisma/migrations` 目录
2. 重新运行 `npm run db:migrate`
3. 如果问题持续，尝试 `npm run db:push`

## 下一步

现在你已经完成了基础设置，可以开始开发了！

查看 `.kiro/specs/claude-skills-hub/tasks.md` 了解开发任务列表。
