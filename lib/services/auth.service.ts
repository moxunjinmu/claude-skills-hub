import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const WELCOME_CREDITS = parseInt(process.env.WELCOME_CREDITS || '100');

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  userId: string;
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatar: string | null;
    level: number;
  };
}

export interface UserPayload {
  userId: string;
  email: string;
  username: string;
}

class AuthService {
  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<AuthResult> {
    // 验证邮箱格式
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // 验证密码强度
    if (!this.isStrongPassword(data.password)) {
      throw new Error('Password must be at least 8 characters long');
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // 检查用户名是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // 哈希密码
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 创建用户和积分记录（使用事务）
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          username: data.username,
          passwordHash,
        },
      });

      // 创建积分记录并添加欢迎积分
      await tx.credit.create({
        data: {
          userId: newUser.id,
          balance: WELCOME_CREDITS,
          transactions: {
            create: {
              amount: WELCOME_CREDITS,
              type: 'earn',
              reason: 'Welcome bonus',
            },
          },
        },
      });

      return newUser;
    });

    // 生成 JWT token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      userId: user.id,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
      },
    };
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // 生成 JWT token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      userId: user.id,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
      },
    };
  }

  /**
   * 验证 JWT token
   */
  async verifyToken(token: string): Promise<UserPayload> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * 刷新 token
   */
  async refreshToken(refreshToken: string): Promise<AuthResult> {
    const payload = await this.verifyToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      userId: user.id,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
      },
    };
  }

  /**
   * 登出（可选：实现 token 黑名单）
   */
  async logout(userId: string): Promise<void> {
    // 在实际应用中，可以将 token 添加到黑名单
    // 或者清除 Redis 中的会话信息
    console.log(`User ${userId} logged out`);
  }

  /**
   * 发送邮箱验证邮件
   */
  async sendVerificationEmail(email: string): Promise<void> {
    // TODO: 实现邮件发送逻辑
    console.log(`Verification email sent to ${email}`);
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(token: string): Promise<void> {
    // TODO: 实现邮箱验证逻辑
    const payload = await this.verifyToken(token);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { emailVerified: true },
    });
  }

  /**
   * 生成 JWT token
   */
  private generateToken(payload: UserPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * 验证邮箱格式
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证密码强度
   */
  private isStrongPassword(password: string): boolean {
    return password.length >= 8;
  }
}

// 导出单例实例
export const authService = new AuthService();
export default authService;
