import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 调用 AuthService 登录
    const result = await authService.login({
      email,
      password,
    });

    return NextResponse.json({
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    console.error('Login error:', error);

    // 处理特定错误
    if (error.message.includes('Invalid')) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
