import Link from "next/link";
import { Github, Heart } from "lucide-react";

/**
 * 页脚组件
 */
export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 网站信息 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">CS</span>
              </div>
              <span className="font-bold">Claude Skills Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              面向中文开发者的 Claude Skills 集合网站
            </p>
          </div>

          {/* 快速链接 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">快速链接</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  关于
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-foreground transition-colors">
                  文档
                </Link>
              </li>
            </ul>
          </div>

          {/* 资源 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">资源</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/api" className="hover:text-foreground transition-colors">
                  API 文档
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="hover:text-foreground transition-colors">
                  贡献指南
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-foreground transition-colors">
                  更新日志
                </Link>
              </li>
            </ul>
          </div>

          {/* 社区 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">社区</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Github className="h-3 w-3" />
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by the community
          </p>
        </div>
      </div>
    </footer>
  );
}
