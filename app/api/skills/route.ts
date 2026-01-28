import { NextRequest, NextResponse } from 'next/server';
import { skillService } from '@/lib/services/skill.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 解析查询参数
    const filters = {
      category: searchParams.get('category') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      search: searchParams.get('search') || undefined,
      difficulty: searchParams.get('difficulty') as any,
      sort: (searchParams.get('sort') as any) || 'popular',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    // 调用 SkillService 查询
    const result = await skillService.getSkills(filters);

    return NextResponse.json({
      message: 'Skills retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Get skills error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
