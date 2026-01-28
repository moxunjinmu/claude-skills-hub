import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // 验证必填字段
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    // 调用 AuthService 注册用户
    const result = await authService.register({
      email,
      username,
      password,
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    // 处理特定错误
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    if (error.message.includes('Invalid') || error.message.includes('must be')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
