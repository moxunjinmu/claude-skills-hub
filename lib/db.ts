import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 创建 Prisma Client 实例，配置日志和连接池
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'stdout' },
            { level: 'warn', emit: 'stdout' },
          ]
        : [{ level: 'error', emit: 'stdout' }],
  });

// 在开发环境下记录查询日志
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: any) => {
    console.log('Query: ' + e.query);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

// 在非生产环境下保持全局实例，避免热重载时创建多个连接
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 优雅关闭数据库连接
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
