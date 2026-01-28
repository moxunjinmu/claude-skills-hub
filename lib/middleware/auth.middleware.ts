import { NextRequest, NextResponse } from 'next/server';
import { authService, UserPayload } from '../services/auth.service';

export interface AuthenticatedRequest extends NextRequest {
  user?: UserPayload;
}

/**
 * 认证中间件 - 验证 JWT token
 */
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    // 从 Authorization header 获取 token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证 token
    const user = await authService.verifyToken(token);

    // 将用户信息添加到请求头中，供后续处理使用
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-email', user.email);
    requestHeaders.set('x-user-username', user.username);

    // 返回 null 表示验证通过，继续处理请求
    return null;
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or expired token' },
      { status: 401 }
    );
  }
}

/**
 * 从请求中获取当前用户信息
 */
export function getCurrentUser(request: NextRequest): UserPayload | null {
  const userId = request.headers.get('x-user-id');
  const email = request.headers.get('x-user-email');
  const username = request.headers.get('x-user-username');

  if (!userId || !email || !username) {
    return null;
  }

  return {
    userId,
    email,
    username,
  };
}

/**
 * 可选认证中间件 - 如果有 token 则验证，没有则继续
 */
export async function optionalAuthMiddleware(
  request: NextRequest
): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 没有 token，继续处理请求
    return null;
  }

  // 有 token，验证它
  return authMiddleware(request);
}
