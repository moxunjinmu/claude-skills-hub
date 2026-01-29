"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, User, ArrowRight, Sparkles } from "lucide-react";

/**
 * Skills 数据类型
 */
export interface Skill {
  id: string;
  title: string;
  description: string;
  author?: string;
  categories?: Array<{ name: string; slug: string }>;
  tags?: Array<{ name: string; slug: string }>;
  averageRating?: number;
  totalRatings?: number;
  sourceUrl?: string;
}

/**
 * Skills 卡片网格组件
 * 展示 Skills 列表，支持空状态
 */
interface SkillsGridProps {
  skills?: Skill[];
  loading?: boolean;
}

export function SkillsGrid({ skills = [], loading = false }: SkillsGridProps) {
  // 加载状态
  if (loading) {
    return (
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // 空状态
  if (skills.length === 0) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">暂无 Skills</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            还没有添加任何 Skills，敬请期待...
          </p>
        </div>
      </div>
    );
  }

  // 显示 Skills 列表
  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      {/* 分页（示例） */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            上一页
          </Button>
          <Badge variant="secondary">1 / 1</Badge>
          <Button variant="outline" size="sm" disabled>
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 单个 Skill 卡片
 */
interface SkillCardProps {
  skill: Skill;
}

function SkillCard({ skill }: SkillCardProps) {
  return (
    <Card className="group flex h-full flex-col transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="space-y-3 pb-4">
        {/* 标题和评分 */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
            {skill.title}
          </h3>
          {skill.averageRating !== undefined && skill.averageRating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{skill.averageRating.toFixed(1)}</span>
              {skill.totalRatings && skill.totalRatings > 0 && (
                <span className="text-muted-foreground text-xs">
                  ({skill.totalRatings})
                </span>
              )}
            </div>
          )}
        </div>

        {/* 描述 */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {skill.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-4">
        {/* 分类 */}
        {skill.categories && skill.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skill.categories.map((cat) => (
              <Badge key={cat.slug} variant="secondary" className="text-xs">
                {cat.name}
              </Badge>
            ))}
          </div>
        )}

        {/* 标签 */}
        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skill.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.slug} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {skill.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skill.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/40 pt-4">
        {/* 作者 */}
        {skill.author && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{skill.author}</span>
          </div>
        )}

        {/* 查看详情按钮 */}
        {skill.sourceUrl ? (
          <Button variant="ghost" size="sm" asChild className="gap-1.5">
            <a
              href={skill.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看详情
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="gap-1.5">
            查看详情
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
