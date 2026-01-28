import redis from '../redis';

// 缓存键命名规范
export const CACHE_KEYS = {
  // Skills 相关
  SKILL_DETAIL: (id: string) => `skill:${id}`,
  SKILL_LIST: (filters: string) => `skills:list:${filters}`,
  TRENDING_SKILLS: 'skills:trending',
  NEW_SKILLS: 'skills:new',

  // 分类和标签
  CATEGORIES: 'categories:all',
  CATEGORY_TREE: 'categories:tree',
  TAGS: 'tags:all',
  POPULAR_TAGS: 'tags:popular',

  // 用户相关
  USER_PROFILE: (id: string) => `user:${id}:profile`,
  USER_CREDITS: (id: string) => `user:${id}:credits`,
  USER_FAVORITES: (id: string) => `user:${id}:favorites`,

  // 统计数据
  STATS_OVERVIEW: 'stats:overview',
  STATS_SKILL: (id: string) => `stats:skill:${id}`,
};

// 缓存 TTL 配置（秒）
export const CACHE_TTL = {
  SKILL_DETAIL: 3600, // 1 hour
  SKILL_LIST: 300, // 5 minutes
  TRENDING_SKILLS: 1800, // 30 minutes
  CATEGORIES: 86400, // 24 hours
  USER_PROFILE: 1800, // 30 minutes
  USER_CREDITS: 60, // 1 minute
  STATS: 300, // 5 minutes
};

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}

class RedisCacheService implements CacheService {
  /**
   * 从缓存中获取值
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * 设置缓存值
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redis.setEx(key, ttl, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * 删除缓存键
   */
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  /**
   * 根据模式删除多个缓存键
   */
  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (error) {
      console.error(`Cache invalidate error for pattern ${pattern}:`, error);
    }
  }
}

// 导出单例实例
export const cacheService = new RedisCacheService();
export default cacheService;
