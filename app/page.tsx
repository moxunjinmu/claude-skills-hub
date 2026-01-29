/**
 * 首页
 * Claude Skills 中文集合站
 */
import { Hero } from "@/components/home/hero";
import { Filters, FilterState } from "@/components/home/filters";
import { SkillsGrid, Skill } from "@/components/home/skills-grid";

// 从 API 获取数据
async function getSkills(filters?: FilterState) {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.tags?.length) params.append("tags", filters.join(","));
    if (filters?.sort) params.append("sort", filters.sort);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/skills?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch skills:", res.statusText);
      return { skills: [], total: 0 };
    }

    const data = await res.json();
    return {
      skills: data.data?.skills || [],
      total: data.data?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching skills:", error);
    return { skills: [], total: 0 };
  }
}

// 获取分类和标签（暂时使用静态数据）
async function getCategoriesAndTags() {
  // TODO: 从 API 获取实际数据
  return {
    categories: [
      { id: "1", name: "文档处理", slug: "document-processing" },
      { id: "2", name: "代码生成", slug: "code-generation" },
      { id: "3", name: "数据分析", slug: "data-analysis" },
      { id: "4", name: "图像处理", slug: "image-processing" },
      { id: "5", name: "自动化", slug: "automation" },
      { id: "6", name: "其他", slug: "other" },
    ],
    tags: [
      { id: "1", name: "PDF", slug: "pdf" },
      { id: "2", name: "Markdown", slug: "markdown" },
      { id: "3", name: "TypeScript", slug: "typescript" },
      { id: "4", name: "React", slug: "react" },
      { id: "5", name: "Python", slug: "python" },
      { id: "6", name: "Excel", slug: "excel" },
      { id: "7", name: "CSV", slug: "csv" },
      { id: "8", name: "JSON", slug: "json" },
    ],
  };
}

export default async function Home() {
  // 获取数据
  const { skills } = await getSkills();
  const { categories, tags } = await getCategoriesAndTags();

  return (
    <>
      {/* Hero 区域 */}
      <Hero stats={{ totalSkills: 0, totalCategories: categories.length }} />

      {/* 筛选组件（客户端组件） */}
      <Filters categories={categories} tags={tags} />

      {/* Skills 列表 */}
      <SkillsGrid skills={skills as Skill[]} />
    </>
  );
}
