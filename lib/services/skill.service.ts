import prisma from '../db';
import cacheService, { CACHE_KEYS, CACHE_TTL } from './cache.service';

export interface SkillFilters {
  category?: string;
  tags?: string[];
  search?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  sort?: 'popular' | 'newest' | 'rating' | 'favorites';
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface PaginatedSkills {
  skills: any[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateSkillData {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  content: string;
  contentEn?: string;
  thumbnail?: string;
  author: string;
  authorUrl?: string;
  sourceUrl: string;
  repositoryUrl: string;
  difficulty?: string;
  categoryIds: string[];
  tagIds: string[];
}

export interface UpdateSkillData {
  title?: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  difficulty?: string;
  isActive?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

class SkillService {
  /**
   * 获取 Skills 列表（支持分页、排序、筛选）
   */
  async getSkills(filters: SkillFilters = {}): Promise<PaginatedSkills> {
    const {
      category,
      tags = [],
      search,
      difficulty,
      sort = 'popular',
      page = 1,
      limit = 20,
      isActive = true,
    } = filters;

    // 尝试从缓存获取
    const cacheKey = CACHE_KEYS.SKILL_LIST(JSON.stringify(filters));
    const cached = await cacheService.get<PaginatedSkills>(cacheKey);
    if (cached) {
      return cached;
    }

    // 构建查询条件
    const where: any = { isActive };

    // 分类筛选
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    // 标签筛选（AND 逻辑）
    if (tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            slug: { in: tags },
          },
        },
      };
    }

    // 难度筛选
    if (difficulty) {
      where.difficulty = difficulty;
    }

    // 搜索
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 排序
    let orderBy: any = {};
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'favorites':
        orderBy = { favoriteCount: 'desc' };
        break;
      case 'popular':
      default:
        orderBy = { trialCount: 'desc' };
        break;
    }

    // 分页
    const skip = (page - 1) * limit;

    // 查询
    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.skill.count({ where }),
    ]);

    const result = {
      skills,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    // 缓存结果
    await cacheService.set(cacheKey, result, CACHE_TTL.SKILL_LIST);

    return result;
  }

  /**
   * 根据 ID 获取 Skill 详情
   */
  async getSkillById(id: string): Promise<any | null> {
    // 尝试从缓存获取
    const cacheKey = CACHE_KEYS.SKILL_DETAIL(id);
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    // 从数据库获取
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!skill) {
      return null;
    }

    // 缓存结果
    await cacheService.set(cacheKey, skill, CACHE_TTL.SKILL_DETAIL);

    return skill;
  }

  /**
   * 创建 Skill
   */
  async createSkill(data: CreateSkillData): Promise<any> {
    const skill = await prisma.skill.create({
      data: {
        title: data.title,
        titleEn: data.titleEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        content: data.content,
        contentEn: data.contentEn,
        thumbnail: data.thumbnail,
        author: data.author,
        authorUrl: data.authorUrl,
        sourceUrl: data.sourceUrl,
        repositoryUrl: data.repositoryUrl,
        difficulty: data.difficulty || 'beginner',
        categories: {
          create: data.categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
        tags: {
          create: data.tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 清除相关缓存
    await cacheService.invalidate('skills:list:*');

    return skill;
  }

  /**
   * 更新 Skill
   */
  async updateSkill(id: string, data: UpdateSkillData): Promise<any> {
    // 准备更新数据
    const updateData: any = {};

    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.content) updateData.content = data.content;
    if (data.thumbnail) updateData.thumbnail = data.thumbnail;
    if (data.difficulty) updateData.difficulty = data.difficulty;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // 更新分类和标签需要先删除旧的关系
    if (data.categoryIds) {
      await prisma.skillCategory.deleteMany({
        where: { skillId: id },
      });
      updateData.categories = {
        create: data.categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      };
    }

    if (data.tagIds) {
      await prisma.skillTag.deleteMany({
        where: { skillId: id },
      });
      updateData.tags = {
        create: data.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      };
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.SKILL_DETAIL(id));
    await cacheService.invalidate('skills:list:*');

    return skill;
  }

  /**
   * 删除 Skill
   */
  async deleteSkill(id: string): Promise<void> {
    await prisma.skill.delete({
      where: { id },
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.SKILL_DETAIL(id));
    await cacheService.invalidate('skills:list:*');
  }

  /**
   * 增加试用计数
   */
  async incrementTrialCount(id: string): Promise<void> {
    await prisma.skill.update({
      where: { id },
      data: { trialCount: { increment: 1 } },
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.SKILL_DETAIL(id));
  }

  /**
   * 增加浏览计数
   */
  async incrementViewCount(id: string): Promise<void> {
    await prisma.skill.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // 清除缓存
    await cacheService.delete(CACHE_KEYS.SKILL_DETAIL(id));
  }
}

// 导出单例实例
export const skillService = new SkillService();
export default skillService;
