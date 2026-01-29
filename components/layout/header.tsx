import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Github, User } from "lucide-react";

/**
 * 顶部导航栏组件
 * 包含：Logo、导航链接、搜索框、用户菜单
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">CS</span>
          </div>
          <span className="hidden font-bold sm:inline-block">
            Claude Skills Hub
          </span>
        </Link>

        {/* 导航链接 */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            首页
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            关于
          </Link>
          <Link
            href="/docs"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            文档
          </Link>
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-4">
          {/* 搜索框（大屏显示） */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索 Skills..."
                className="h-9 w-64 pl-9 bg-muted/50"
              />
            </div>
          </div>

          {/* GitHub 链接 */}
          <Button variant="ghost" size="icon" asChild>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>

          {/* 登录/注册 */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">登录</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
