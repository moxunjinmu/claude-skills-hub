import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";

/**
 * Hero 区域组件
 * 包含：标题、描述、搜索框、统计信息
 */
interface HeroProps {
  stats?: {
    totalSkills: number;
    totalCategories: number;
  };
}

export function Hero({ stats = { totalSkills: 0, totalCategories: 0 } }: HeroProps) {
  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center space-y-8">
        {/* 标题区域 */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Claude Skills 中文集合站</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            发现和使用
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Claude Skills
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            面向中文开发者的 Claude Skills 集合网站，提供中文介绍、分类浏览、搜索筛选等功能
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mx-auto max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索你需要的 Skills..."
              className="h-14 pl-12 pr-32 text-base bg-background shadow-sm"
            />
            <Button
              size="default"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              搜索
            </Button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold">{stats.totalSkills}+</p>
              <p className="text-muted-foreground">Skills</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold">{stats.totalCategories}+</p>
              <p className="text-muted-foreground">分类</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
