"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

/**
 * 筛选组件
 * 包含：分类选择、标签筛选、排序选项
 */
interface FiltersProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
  tags?: Array<{ id: string; name: string; slug: string }>;
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  category?: string;
  tags?: string[];
  sort?: "newest" | "hottest" | "rating";
}

export function Filters({ categories = [], tags = [], onFilterChange }: FiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "hottest" | "rating">("newest");

  // 处理分类选择
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onFilterChange?.({
      category: value === "all" ? undefined : value,
      tags: selectedTags,
      sort: sortBy,
    });
  };

  // 处理标签点击
  const handleTagClick = (tagSlug: string) => {
    const newTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter((t) => t !== tagSlug)
      : [...selectedTags, tagSlug];
    setSelectedTags(newTags);
    onFilterChange?.({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      tags: newTags,
      sort: sortBy,
    });
  };

  // 处理排序变更
  const handleSortChange = (value: string) => {
    const sortValue = value as "newest" | "hottest" | "rating";
    setSortBy(sortValue);
    onFilterChange?.({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      tags: selectedTags,
      sort: sortValue,
    });
  };

  // 清除所有筛选
  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedTags([]);
    setSortBy("newest");
    onFilterChange?.({});
  };

  const hasActiveFilters =
    selectedCategory !== "all" || selectedTags.length > 0;

  return (
    <div className="border-y border-border/40 bg-muted/30 py-4">
      <div className="container">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* 筛选选项 */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 分类选择 */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">分类:</span>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="全部分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 排序选择 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">排序:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">最新</SelectItem>
                  <SelectItem value="hottest">最热</SelectItem>
                  <SelectItem value="rating">评分</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 清除按钮 */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9"
              >
                清除筛选
              </Button>
            )}
          </div>

          {/* 活跃筛选标签 */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  分类: {categories.find((c) => c.slug === selectedCategory)?.name}
                </Badge>
              )}
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  {tags.find((t) => t.slug === tag)?.name}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 标签云 */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 12).map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.slug) ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary/20"
                onClick={() => handleTagClick(tag.slug)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
