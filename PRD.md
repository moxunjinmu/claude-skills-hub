# Claude Skills 中文集合站 - 产品需求文档

## 项目概述

**项目名称**: Claude Skills 中文集合站
**项目目标**: 面向中文开发者和 AI 编程小白的 Claude Skills 集合网站，提供 Skills 的中文介绍、分类浏览、搜索筛选、在线试用等功能。

## 技术栈

- **前端**: Next.js 16 (App Router), React 19, TypeScript 5
- **样式**: Tailwind CSS 4, Shadcn/ui (New York)
- **后端**: Node.js (Next.js API Routes)
- **数据库**: PostgreSQL 15 (Docker)
- **缓存**: Redis 7 (Docker)
- **ORM**: Prisma 6

## 项目进度

### ✅ 已完成 (Phase 1-4)

#### Phase 1: 核心服务层基础设施
- [x] 项目初始化和配置
- [x] Prisma 数据模型设计
- [x] 数据库迁移脚本
- [x] Docker 开发环境配置

#### Phase 2: 认证和积分系统
- [x] 用户注册/登录 API
- [x] JWT 认证中间件
- [x] 积分服务
- [x] 积分交易记录

#### Phase 3: Skills 数据模型和服务
- [x] Skill CRUD 服务
- [x] 分类服务（支持层级结构）
- [x] 标签服务
- [x] Redis 缓存服务

#### Phase 4: API 路由
- [x] `POST /api/auth/register` - 用户注册
- [x] `POST /api/auth/login` - 用户登录
- [x] `GET /api/skills` - 获取 Skills 列表（支持筛选、搜索、排序、分页）
- [x] `GET /api/skills/[id]` - 获取 Skill 详情

### ✅ 已完成 (Phase 5)

#### Phase 5: 前端页面实现

**已完成**: 基础首页实现（列表+筛选）

**实现内容**:
1. **顶部导航栏** ([header.tsx](components/layout/header.tsx))
   - [x] 网站 Logo 和名称
   - [x] 导航链接（首页、关于、文档）
   - [x] 搜索框（大屏显示）
   - [x] GitHub 链接和登录入口

2. **Hero 区域** ([hero.tsx](components/home/hero.tsx))
   - [x] 网站标题和描述
   - [x] 快速搜索框
   - [x] 统计信息展示（Skills 数量、分类数量）

3. **筛选组件** ([filters.tsx](components/home/filters.tsx))
   - [x] 分类下拉选择
   - [x] 标签筛选（标签云）
   - [x] 排序选项（最新、最热、评分）
   - [x] 清除筛选功能

4. **Skills 列表** ([skills-grid.tsx](components/home/skills-grid.tsx))
   - [x] 响应式卡片网格
   - [x] 卡片信息：标题、描述、分类、标签、作者、评分
   - [x] 空状态处理
   - [x] 加载状态骨架屏

5. **页脚组件** ([footer.tsx](components/layout/footer.tsx))
   - [x] 网站信息和快速链接
   - [x] 版权信息

6. **数据对接**
   - [x] 调用 `/api/skills` API
   - [x] 客户端筛选和搜索状态管理

### 📋 待规划 (Phase 6+)

#### Phase 6: Skills 详情页
- [ ] Skill 详情页面
- [ ] 完整内容展示
- [ ] 评分和评论
- [ ] 收藏功能

#### Phase 7: 用户功能
- [ ] 用户登录/注册页面
- [ ] 个人中心
- [ ] 我的收藏

#### Phase 8: 在线试用
- [ ] 试用页面
- [ ] Claude API 对接
- [ ] 积分扣除

## 数据模型

### 核心模型
- **User** - 用户
- **Credit** - 积分账户
- **CreditTransaction** - 积分交易记录
- **Skill** - Skills
- **Category** - 分类（支持层级）
- **Tag** - 标签
- **Favorite** - 收藏
- **Rating** - 评分
- **Comment** - 评论
- **Trial** - 试用记录

## API 文档

### 认证 API

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123"
}
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Skills API

#### 获取 Skills 列表
```
GET /api/skills?page=1&limit=12&category=code-generation&tags=typescript&sort=newest&search=pdf
```

**查询参数**:
- `page` - 页码（默认 1）
- `limit` - 每页数量（默认 12）
- `category` - 分类 slug
- `tags` - 标签 slug（逗号分隔）
- `sort` - 排序方式（newest, hottest, rating）
- `search` - 搜索关键词

#### 获取 Skill 详情
```
GET /api/skills/[id]
```

## 更新日志

### 2025-01-29

**Phase 5 完成**:

- ✅ 诊断并修复页面显示问题
- ✅ 安装 shadcn/ui 组件（Button, Card, Input, Badge, Select）
- ✅ 实现顶部导航栏组件
- ✅ 实现 Hero 区域组件
- ✅ 实现筛选组件（分类、标签、排序）
- ✅ 实现 Skills 卡片网格组件
- ✅ 实现页脚组件
- ✅ 更新根布局和首页
- ✅ 完成 API 数据对接

**文件变更**:

新增文件:
- `components/layout/header.tsx`
- `components/layout/footer.tsx`
- `components/home/hero.tsx`
- `components/home/filters.tsx`
- `components/home/skills-grid.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/badge.tsx`
- `components/ui/select.tsx`
- `PLAN.md`
- `PRD.md`

修改文件:
- `app/layout.tsx`
- `app/page.tsx`
