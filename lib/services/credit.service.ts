import prisma from '../db';
import cacheService, { CACHE_KEYS, CACHE_TTL } from './cache.service';

const DAILY_BONUS_CREDITS = parseInt(process.env.DAILY_BONUS_CREDITS || '10');

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'earn' | 'spend' | 'refund';
  limit?: number;
  offset?: number;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  reason: string;
  createdAt: Date;
}

class CreditService {
  /**
   * 获取用户积分余额
   */
  async getBalance(userId: string): Promise<number> {
    // 尝试从缓存获取
    const cacheKey = CACHE_KEYS.USER_CREDITS(userId);
    const cached = await cacheService.get<number>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // 从数据库获取
    const credit = await prisma.credit.findUnique({
      where: { userId },
    });

    if (!credit) {
      throw new Error('Credit record not found');
    }

    // 缓存结果
    await cacheService.set(cacheKey, credit.balance, CACHE_TTL.USER_CREDITS);

    return credit.balance;
  }

  /**
   * 增加积分
   */
  async addCredits(userId: string, amount: number, reason: string): Promise<void> {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    await prisma.$transaction(async (tx) => {
      // 更新积分余额
      const credit = await tx.credit.update({
        where: { userId },
        data: { balance: { increment: amount } },
      });

      // 创建交易记录
      await tx.creditTransaction.create({
        data: {
          creditId: credit.id,
          amount,
          type: 'earn',
          reason,
        },
      });
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.USER_CREDITS(userId));
  }

  /**
   * 扣除积分
   */
  async deductCredits(userId: string, amount: number, reason: string): Promise<void> {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    // 检查余额是否充足
    const balance = await this.getBalance(userId);
    if (balance < amount) {
      throw new Error('Insufficient credits');
    }

    await prisma.$transaction(async (tx) => {
      // 更新积分余额
      const credit = await tx.credit.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      });

      // 创建交易记录
      await tx.creditTransaction.create({
        data: {
          creditId: credit.id,
          amount: -amount,
          type: 'spend',
          reason,
        },
      });
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.USER_CREDITS(userId));
  }

  /**
   * 退款积分
   */
  async refundCredits(userId: string, amount: number, reason: string): Promise<void> {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    await prisma.$transaction(async (tx) => {
      // 更新积分余额
      const credit = await tx.credit.update({
        where: { userId },
        data: { balance: { increment: amount } },
      });

      // 创建交易记录
      await tx.creditTransaction.create({
        data: {
          creditId: credit.id,
          amount,
          type: 'refund',
          reason,
        },
      });
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.USER_CREDITS(userId));
  }

  /**
   * 获取交易记录
   */
  async getTransactions(
    userId: string,
    filters: TransactionFilters = {}
  ): Promise<CreditTransaction[]> {
    const credit = await prisma.credit.findUnique({
      where: { userId },
    });

    if (!credit) {
      throw new Error('Credit record not found');
    }

    const transactions = await prisma.creditTransaction.findMany({
      where: {
        creditId: credit.id,
        ...(filters.type && { type: filters.type }),
        ...(filters.startDate &&
          filters.endDate && {
            createdAt: {
              gte: filters.startDate,
              lte: filters.endDate,
            },
          }),
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });

    return transactions;
  }

  /**
   * 每日签到奖励
   */
  async grantDailyBonus(userId: string): Promise<number> {
    // 检查今天是否已经领取
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const credit = await prisma.credit.findUnique({
      where: { userId },
      include: {
        transactions: {
          where: {
            type: 'earn',
            reason: 'Daily sign-in bonus',
            createdAt: { gte: today },
          },
          take: 1,
        },
      },
    });

    if (!credit) {
      throw new Error('Credit record not found');
    }

    if (credit.transactions.length > 0) {
      throw new Error('Daily bonus already claimed today');
    }

    // 发放每日奖励
    await this.addCredits(userId, DAILY_BONUS_CREDITS, 'Daily sign-in bonus');

    return DAILY_BONUS_CREDITS;
  }

  /**
   * 检查积分是否充足
   */
  async hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= amount;
  }
}

// 导出单例实例
export const creditService = new CreditService();
export default creditService;
