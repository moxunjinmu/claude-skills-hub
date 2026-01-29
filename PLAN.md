# 首页实现计划

## 问题分析
- 项目后端服务已完成（认证、积分、Skills、分类、标签等）
- 前端页面仍为 Next.js 默认模板，未实现实际功能
- 项目已配置 Shadcn/ui (New York 风格)，但未安装 UI 组件

## 实现方案：基础首页（列表+筛选）

### 技术栈
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Shadcn/ui (New York)
- Lucide React Icons

### 需要安装的 Shadcn/ui 组件
1. **Button** - 按钮组件
2. **Card** - 卡片容器
3. **Input** - 搜索输入框
4. **Badge** - 标签徽章
5. **Select** - 下拉选择

### 组件架构

```
app/
├── layout.tsx          # 根布局（更新元数据）
├── page.tsx            # 首页（重写）
└── globals.css         # 全局样式（已有）

components/
├── layout/
│   ├── header.tsx      # 顶部导航栏
│   └── footer.tsx      # 页脚
├── home/
│   ├── hero.tsx        # Hero 区域
│   ├── skills-grid.tsx # Skills 卡片网格
│   └── filters.tsx     # 筛选组件（分类+标签）
└── ui/                 # shadcn/ui 组件
```

### 功能清单

#### 1. 顶部导航栏 (`header.tsx`)
- Logo/网站名称
- 导航链接（首页、关于、登录/注册）
- 响应式设计

#### 2. Hero 区域 (`hero.tsx`)
- 网站标题和描述
- 快速搜索框
- 统计信息（Skills 数量、分类数量）

#### 3. 筛选组件 (`filters.tsx`)
- 分类筛选（下拉选择）
- 标签筛选（标签云）
- 排序选项（最新、最热、评分）

#### 4. Skills 卡片网格 (`skills-grid.tsx`)
- 卡片布局（响应式网格）
- 每个卡片显示：
  - Skill 标题
  - 简短描述
  - 分类和标签
  - 作者信息
  - 评分（如已有）

#### 5. 数据获取
- 使用 `fetch` 从 API 获取数据
- 客户端筛选和搜索
- 空状态处理

### API 对接

| 端点 | 用途 |
|------|------|
| `GET /api/skills` | 获取 Skills 列表 |
| `GET /api/skills?[params]` | 带筛选的列表 |

### 实现步骤

1. **安装 Shadcn/ui 组件**
   ```bash
   npx shadcn@latest add button card input badge select
   ```

2. **创建布局组件**
   - `components/layout/header.tsx`
   - `components/layout/footer.tsx`

3. **创建首页组件**
   - `components/home/hero.tsx`
   - `components/home/filters.tsx`
   - `components/home/skills-grid.tsx`

4. **更新根布局**
   - 更新元数据（标题、描述）
   - 添加导航和页脚

5. **重写首页**
   - 整合所有组件
   - 实现数据获取和状态管理

6. **测试**
   - 验证页面显示
   - 测试筛选功能
   - 检查响应式布局

### 设计风格
- 参考 Shadcn/ui New York 风格
- 简洁现代的卡片设计
- 优雅的动画效果
- 支持暗色模式

### 注意事项
- 保持 DRY 原则，复用组件
- 组件单一职责
- 适当的错误处理和加载状态
- SEO 优化（metadata）
