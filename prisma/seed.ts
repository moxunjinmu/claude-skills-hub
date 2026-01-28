import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始数据库种子...');

  // 创建分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'document-processing' },
      update: {},
      create: {
        name: '文档处理',
        nameEn: 'Document Processing',
        slug: 'document-processing',
        description: '处理各种文档格式，包括 PDF、Word、Excel 等',
        icon: '📄',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'code-generation' },
      update: {},
      create: {
        name: '代码生成',
        nameEn: 'Code Generation',
        slug: 'code-generation',
        description: '自动生成代码、脚手架和模板',
        icon: '💻',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'data-analysis' },
      update: {},
      create: {
        name: '数据分析',
        nameEn: 'Data Analysis',
        slug: 'data-analysis',
        description: '数据处理、分析和可视化',
        icon: '📊',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'content-creation' },
      update: {},
      create: {
        name: '内容创作',
        nameEn: 'Content Creation',
        slug: 'content-creation',
        description: '文章、博客、社交媒体内容生成',
        icon: '✍️',
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'automation' },
      update: {},
      create: {
        name: '自动化',
        nameEn: 'Automation',
        slug: 'automation',
        description: '工作流自动化和任务调度',
        icon: '🤖',
        order: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: '设计',
        nameEn: 'Design',
        slug: 'design',
        description: 'UI/UX 设计、图形设计和创意工具',
        icon: '🎨',
        order: 6,
      },
    }),
  ]);

  console.log(`✅ 创建了 ${categories.length} 个分类`);

  // 创建标签
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'pdf' },
      update: {},
      create: { name: 'PDF', nameEn: 'PDF', slug: 'pdf' },
    }),
    prisma.tag.upsert({
      where: { slug: 'markdown' },
      update: {},
      create: { name: 'Markdown', nameEn: 'Markdown', slug: 'markdown' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', nameEn: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'python' },
      update: {},
      create: { name: 'Python', nameEn: 'Python', slug: 'python' },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', nameEn: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'api' },
      update: {},
      create: { name: 'API', nameEn: 'API', slug: 'api' },
    }),
    prisma.tag.upsert({
      where: { slug: 'web-scraping' },
      update: {},
      create: { name: '网页抓取', nameEn: 'Web Scraping', slug: 'web-scraping' },
    }),
    prisma.tag.upsert({
      where: { slug: 'seo' },
      update: {},
      create: { name: 'SEO', nameEn: 'SEO', slug: 'seo' },
    }),
  ]);

  console.log(`✅ 创建了 ${tags.length} 个标签`);

  // 创建测试用户
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: '$2a$10$YourHashedPasswordHere', // 实际应用中应该使用 bcrypt 哈希
      emailVerified: true,
      level: 1,
    },
  });

  // 为测试用户创建积分记录
  await prisma.credit.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      balance: 100, // 初始积分
    },
  });

  console.log(`✅ 创建了测试用户: ${testUser.email}`);

  console.log('🎉 数据库种子完成！');
}

main()
  .catch((e) => {
    console.error('❌ 数据库种子失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
