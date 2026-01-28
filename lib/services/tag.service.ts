import prisma from '../db';
import cacheService, { CACHE_KEYS, CACHE_TTL } from './cache.service';

class TagService {
  /**
   * 获取所有标签
   */
  async getAllTags(): Promise<any[]> {
    // 尝试从缓存获取
    const cacheKey = CACHE_KEYS.TAGS;
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 从数据库获取
    const tags = await prisma.tag.findMany({
      orderBy: { count: 'desc' },
    });

    // 缓存结果
    await cacheService.set(cacheKey, tags, CACHE_TTL.CATEGORIES);

    return tags;
  }

  /**
   * 获取热门标签
   */
  async getPopularTags(limit: number = 20): Promise<any[]> {
    // 尝试从缓存获取
    const cacheKey = CACHE_KEYS.POPULAR_TAGS;
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) {
      return cached.slice(0, limit);
    }

    // 从数据库获取
    const tags = await prisma.tag.findMany({
      orderBy: { count: 'desc' },
      take: limit,
    });

    // 缓存结果
    await cacheService.set(cacheKey, tags, CACHE_TTL.CATEGORIES);

    return tags;
  }

  /**
   * 根据 slug 获取标签
   */
  async getTagBySlug(slug: string): Promise<any | null> {
    return prisma.tag.findUnique({
      where: { slug },
    });
  }

  /**
   * 创建标签
   */
  async createTag(data: { name: string; nameEn?: string; slug: string }): Promise<any> {
    const tag = await prisma.tag.create({
      data,
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.TAGS);
    await cacheService.delete(CACHE_KEYS.POPULAR_TAGS);

    return tag;
  }

  /**
   * 更新标签
   */
  async updateTag(
    id: string,
    data: { name?: string; nameEn?: string; slug?: string }
  ): Promise<any> {
    const tag = await prisma.tag.update({
      where: { id },
      data,
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.TAGS);
    await cacheService.delete(CACHE_KEYS.POPULAR_TAGS);

    return tag;
  }

  /**
   * 删除标签
   */
  async deleteTag(id: string): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.TAGS);
    await cacheService.delete(CACHE_KEYS.POPULAR_TAGS);
  }

  /**
   * 更新标签计数
   */
  async updateTagCount(tagId: string): Promise<void> {
    const count = await prisma.skillTag.count({
      where: { tagId },
    });

    await prisma.tag.update({
      where: { id: tagId },
      data: { count },
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.TAGS);
    await cacheService.delete(CACHE_KEYS.POPULAR_TAGS);
  }

  /**
   * 批量更新所有标签计数
   */
  async updateAllTagCounts(): Promise<void> {
    const tags = await prisma.tag.findMany();

    for (const tag of tags) {
      await this.updateTagCount(tag.id);
    }
  }
}

// 导出单例实例
export const tagService = new TagService();
export default tagService;
