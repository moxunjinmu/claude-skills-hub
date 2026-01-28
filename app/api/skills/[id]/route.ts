import { NextRequest, NextResponse } from 'next/server';
import { skillService } from '@/lib/services/skill.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 获取 Skill 详情
    const skill = await skillService.getSkillById(id);

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // 增加浏览计数（异步执行，不阻塞响应）
    skillService.incrementViewCount(id).catch((error) => {
      console.error('Failed to increment view count:', error);
    });

    return NextResponse.json({
      message: 'Skill retrieved successfully',
      data: skill,
    });
  } catch (error: any) {
    console.error('Get skill detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
