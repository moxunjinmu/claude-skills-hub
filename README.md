# Claude Skills 中文集合站

一个面向中文开发者和 AI 编程小白的 Claude Skills 集合网站，提供 Skills 的中文介绍、分类浏览、搜索筛选、在线试用等功能。

## 技术栈

- **前端框架**: Next.js 14+ (App Router), React 18+
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS, Shadcn/ui
- **状态管理**: Zustand
- **数据获取**: React Query (TanStack Query)
- **ORM**: Prisma
- **数据库**: PostgreSQL 15+
- **缓存**: Redis 7+
- **API 集成**: Claude API (@anthropic-ai/sdk)
- **部署**: Docker, Nginx, PM2, 阿里云 ECS
- **存储**: 阿里云 OSS
- **CDN**: 阿里云 CDN

## 快速开始

### 前置要求

- Node.js 18+ 
- Docker 和 Docker Compose
- PostgreSQL 15+
- Redis 7+

### 安装

1. 克隆仓库

```bash
git clone <repository-url>
cd claude-skills-hub
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入必要的配置信息。

4. 启动数据库服务

```bash
docker-compose up -d
```

5. 运行数据库迁移

```bash
npm run db:migrate
```

6. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint
- `npm run format` - 格式化代码
- `npm run format:check` - 检查代码格式
- `npm run type-check` - TypeScript 类型检查

## 项目结构

```
claude-skills-hub/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API Routes
│   ├── skills/            # Skills 相关页面
│   ├── trial/             # 试用页面
│   ├── profile/           # 用户中心
│   └── admin/             # 管理后台
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   └── ...               # 业务组件
├── lib/                   # 工具库和服务
│   ├── services/         # 业务服务层
│   ├── utils/            # 工具函数
│   └── db.ts             # 数据库连接
├── prisma/               # Prisma Schema 和迁移
├── public/               # 静态资源
└── types/                # TypeScript 类型定义
```

## 功能特性

### MVP 阶段

- ✅ Skills 浏览和搜索
- ✅ 分类和标签系统
- ✅ 用户注册和登录
- ✅ 积分系统
- ✅ 在线试用功能
- ✅ 收藏和评分
- ✅ GitHub 数据自动抓取
- ✅ SEO 优化

### 后续计划

- 🔄 评论系统
- 🔄 用户提交 Skills
- 🔄 管理后台
- 🔄 企业版功能
- 🔄 多语言支持

## 开发指南

详细的开发文档请参考 `.kiro/specs/claude-skills-hub/` 目录：

- `requirements.md` - 需求文档
- `design.md` - 设计文档
- `tasks.md` - 任务列表

## 部署

### Docker 部署

1. 构建镜像

```bash
docker build -t claude-skills-hub .
```

2. 运行容器

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 阿里云 ECS 部署

详细部署步骤请参考 `docs/deployment.md`。

## 贡献

欢迎贡献！请先阅读 [贡献指南](CONTRIBUTING.md)。

## 许可证

MIT License

## 联系方式

- 项目主页: [https://github.com/your-username/claude-skills-hub](https://github.com/your-username/claude-skills-hub)
- 问题反馈: [https://github.com/your-username/claude-skills-hub/issues](https://github.com/your-username/claude-skills-hub/issues)
