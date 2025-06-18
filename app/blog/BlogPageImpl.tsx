"use client"

import { useState, useEffect, useMemo } from "react"
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

export default function BlogPage() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("posts")
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])

  // Memoize search parameters
  const categoryFilter = useMemo(() => searchParams.get("category"), [searchParams])
  const searchQuery = useMemo(() => searchParams.get("search"), [searchParams])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        // Fetch featured posts
        const featuredResponse = await blogApi.getFeaturedPosts({ limit: 6 })
        // Fetch all published posts
        const allPostsResponse = await blogApi.listPosts({
          status: "published",
          page: 1,
          limit: 20,
          sortBy: "published_at",
          sortOrder: "desc"
        })
        if (featuredResponse.success && featuredResponse.data) {
          setFeaturedPosts(featuredResponse.data.posts)
        }
        if (allPostsResponse.success && allPostsResponse.data) {
          setAllPosts(allPostsResponse.data.posts)
        }
        if (!featuredResponse.success || !allPostsResponse.success) {
          setError("Failed to load blog posts")
          toast.error("Failed to load blog posts")
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
        setError("Failed to load blog posts")
        toast.error("Failed to load blog posts")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <BlogHero />
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <BlogHero />
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">Failed to load blog posts. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Use featured posts if available, otherwise use all posts
  const postsToDisplay = featuredPosts.length > 0 ? featuredPosts : allPosts.slice(0, 6)

  return (
    <div className="min-h-screen">
      <Header />
      <BlogHero />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <BlogGrid initialPosts={postsToDisplay} />
        </div>
      </div>
      <Footer />
    </div>
  )
} 