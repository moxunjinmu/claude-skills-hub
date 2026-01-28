import prisma from '../db';
import cacheService, { CACHE_KEYS, CACHE_TTL } from './cache.service';

export interface CategoryTree {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  children: CategoryTree[];
}

class CategoryService {
  /**
   * 获取所有分类
   */
  async getAllCategories(): Promise<any[]> {
    // 尝试从缓存获取
    const cacheKey = CACHE_KEYS.CATEGORIES;
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 从数据库获取
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });

    // 缓存结果
    await cacheService.set(cacheKey, categories, CACHE_TTL.CATEGORIES);

    return categories;
  }

  /**
   * 获取分类树（层级结构）
   */
  async getCategoryTree(): Promise<CategoryTree[]> {
    // 尝试从缓存获取
    const cacheKey = CACHE_KEYS.CATEGORY_TREE;
    const cached = await cacheService.get<CategoryTree[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 获取所有分类
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });

    // 构建树形结构
    const tree = this.buildTree(categories);

    // 缓存结果
    await cacheService.set(cacheKey, tree, CACHE_TTL.CATEGORIES);

    return tree;
  }

  /**
   * 根据 slug 获取分类
   */
  async getCategoryBySlug(slug: string): Promise<any | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  /**
   * 创建分类
   */
  async createCategory(data: {
    name: string;
    nameEn?: string;
    slug: string;
    description?: string;
    icon?: string;
    parentId?: string;
    order?: number;
  }): Promise<any> {
    // 验证父分类是否存在
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) {
        throw new Error('Parent category not found');
      }
    }

    const category = await prisma.category.create({
      data,
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.CATEGORIES);
    await cacheService.delete(CACHE_KEYS.CATEGORY_TREE);

    return category;
  }

  /**
   * 更新分类
   */
  async updateCategory(
    id: string,
    data: {
      name?: string;
      nameEn?: string;
      slug?: string;
      description?: string;
      icon?: string;
      parentId?: string;
      order?: number;
    }
  ): Promise<any> {
    // 验证不能将分类设置为自己的子分类
    if (data.parentId === id) {
      throw new Error('Category cannot be its own parent');
    }

    // 验证父分类是否存在
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) {
        throw new Error('Parent category not found');
      }

      // 验证不会形成循环引用
      if (await this.wouldCreateCycle(id, data.parentId)) {
        throw new Error('Cannot create circular reference');
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.CATEGORIES);
    await cacheService.delete(CACHE_KEYS.CATEGORY_TREE);

    return category;
  }

  /**
   * 删除分类
   */
  async deleteCategory(id: string): Promise<void> {
    // 检查是否有子分类
    const children = await prisma.category.findMany({
      where: { parentId: id },
    });

    if (children.length > 0) {
      throw new Error('Cannot delete category with children');
    }

    await prisma.category.delete({
      where: { id },
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.CATEGORIES);
    await cacheService.delete(CACHE_KEYS.CATEGORY_TREE);
  }

  /**
   * 构建树形结构
   */
  private buildTree(categories: any[], parentId: string | null = null): CategoryTree[] {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        nameEn: cat.nameEn,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
        children: this.buildTree(categories, cat.id),
      }));
  }

  /**
   * 检查是否会形成循环引用
   */
  private async wouldCreateCycle(categoryId: string, newParentId: string): Promise<boolean> {
    let currentId: string | null = newParentId;

    while (currentId) {
      if (currentId === categoryId) {
        return true;
      }

      const category = await prisma.category.findUnique({
        where: { id: currentId },
      });

      currentId = category?.parentId || null;
    }

    return false;
  }
}

// 导出单例实例
export const categoryService = new CategoryService();
export default categoryService;
