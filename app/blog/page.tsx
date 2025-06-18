"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { BlogHero } from "@/components/blog-hero"
import { BlogGrid } from "@/components/blog-grid"
import { BlogSearchFilter } from "@/components/blog-search-filter"
import { BlogCategoriesSection } from "@/components/blog-categories-section"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { blogApi } from "@/lib/api/blog"
import { toast } from "sonner"
import type { BlogPost } from "@/lib/api/types"
import { Skeleton } from "@/components/ui/skeleton"
import BlogPage from "./BlogPageImpl"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPage />
    </Suspense>
  )
}
