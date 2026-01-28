# 测试指南

## 前置准备

### 1. 启动数据库服务

确保 Docker Desktop 正在运行，然后：

```bash
cd claude-skills-hub
docker-compose up -d
```

验证服务是否启动：
```bash
docker ps
```

应该看到 `claude-skills-hub-postgres` 和 `claude-skills-hub-redis` 两个容器在运行。

### 2. 生成 Prisma Client

```bash
npm run db:generate
```

### 3. 运行数据库迁移

```bash
npm run db:migrate
```

输入迁移名称，例如：`init`

### 4. 填充初始数据

```bash
npm run db:seed
```

这将创建：
- 6 个分类（文档处理、代码生成、数据分析等）
- 8 个标签（PDF、Markdown、TypeScript 等）
- 1 个测试用户（test@example.com，密码需要更新）

### 5. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

## API 测试

### 测试 1: 用户注册

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

预期响应：
```json
{
  "message": "User registered successfully",
  "data": {
    "userId": "...",
    "token": "...",
    "user": {
      "id": "...",
      "email": "user@example.com",
      "username": "testuser",
      "avatar": null,
      "level": 1
    }
  }
}
```

### 测试 2: 用户登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

保存返回的 `token`，后续请求需要使用。

### 测试 3: 获取 Skills 列表

```bash
curl http://localhost:3000/api/skills
```

预期响应：
```json
{
  "message": "Skills retrieved successfully",
  "data": {
    "skills": [],
    "total": 0,
    "page": 1,
    "totalPages": 0
  }
}
```

### 测试 4: 带筛选的 Skills 列表

```bash
# 按分类筛选
curl "http://localhost:3000/api/skills?category=code-generation"

# 按标签筛选
curl "http://localhost:3000/api/skills?tags=typescript,react"

# 搜索
curl "http://localhost:3000/api/skills?search=pdf"

# 排序
curl "http://localhost:3000/api/skills?sort=newest"

# 分页
curl "http://localhost:3000/api/skills?page=2&limit=10"
```

### 测试 5: 获取 Skill 详情

首先需要创建一个 Skill（需要认证）：

```bash
# 使用之前获取的 token
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/api/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "测试 Skill",
    "description": "这是一个测试 Skill",
    "content": "# 使用指南\n\n这是详细内容...",
    "author": "测试作者",
    "sourceUrl": "https://github.com/test/skill",
    "repositoryUrl": "https://github.com/test/skill",
    "categoryIds": [],
    "tagIds": []
  }'
```

然后获取详情：
```bash
curl http://localhost:3000/api/skills/{skill-id}
```

## 使用 Prisma Studio 查看数据

```bash
npm run db:studio
```

这将打开 http://localhost:5555，你可以在浏览器中查看和编辑数据库数据。

## 常见问题

### 问题 1: 数据库连接失败

**错误**: `Can't reach database server`

**解决方案**:
1. 确保 Docker Desktop 正在运行
2. 检查 `.env.local` 中的 `DATABASE_URL` 是否正确
3. 重启 Docker 容器：`docker-compose restart`

### 问题 2: Redis 连接失败

**错误**: `Error: connect ECONNREFUSED`

**解决方案**:
1. 确保 Redis 容器正在运行：`docker ps`
2. 检查 `.env.local` 中的 `REDIS_URL` 是否正确
3. 重启 Redis 容器：`docker-compose restart redis`

### 问题 3: Prisma Client 未生成

**错误**: `Cannot find module '@prisma/client'`

**解决方案**:
```bash
npm run db:generate
```

### 问题 4: 迁移失败

**错误**: `Migration failed`

**解决方案**:
1. 删除 `prisma/migrations` 目录
2. 重新运行：`npm run db:migrate`
3. 如果还是失败，使用：`npm run db:push`

## 下一步测试

一旦基础功能测试通过，你可以：

1. 测试积分系统（需要实现积分 API）
2. 测试收藏功能（需要实现收藏 API）
3. 测试评分和评论（需要实现相关 API）
4. 测试在线试用功能（Phase 5）

## 性能测试

使用 Apache Bench 进行简单的性能测试：

```bash
# 测试 Skills 列表 API
ab -n 1000 -c 10 http://localhost:3000/api/skills

# 测试登录 API
ab -n 100 -c 5 -p login.json -T application/json http://localhost:3000/api/auth/login
```

其中 `login.json` 内容：
```json
{"email":"user@example.com","password":"password123"}
```
