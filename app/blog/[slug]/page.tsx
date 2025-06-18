"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { BlogHero } from "@/components/blog-hero"
import { BlogPost } from "@/components/blog-post"
import { BlogSidebar } from "@/components/blog-sidebar"
import { RelatedBlogs } from "@/components/related-blogs"
import { Footer } from "@/components/footer"
import { blogApi } from "@/lib/api/blog"
import { apiUtils } from "@/lib/api/client"
import { toast } from "sonner"
import type { BlogPost as BlogPostType } from "@/lib/api/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const slug = params.slug as string
        
        // Fetch the blog post by slug
        const response = await blogApi.getPostBySlug(slug)

        if (!response.success || !response.data) {
          setError("Post not found")
          return
        }

        const postData = response.data
        setPost(postData)

        // Fetch related posts from the same category
        const relatedResponse = await blogApi.listPosts({
          category: postData.category.slug,
          status: "published",
          limit: 3,
          sortBy: "published_at",
          sortOrder: "desc"
        })

        if (relatedResponse.success && relatedResponse.data) {
          // Filter out the current post from related posts
          const filtered = relatedResponse.data.posts.filter(p => p.id !== postData.id)
          setRelatedPosts(filtered.slice(0, 3))
        }

      } catch (err) {
        console.error("Error fetching blog post:", err)
        if (apiUtils.isApiError(err)) {
          setError(apiUtils.getErrorMessage(err))
        } else {
          setError("Failed to load blog post")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <BlogHero />
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <main className="lg:w-2/3">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-64 w-full" />
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              </main>
              <aside className="lg:w-1/3">
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </aside>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Header />
        <BlogHero />
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <Card className="text-center py-12">
              <CardContent>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been moved.</p>
                <button
                  onClick={() => router.push("/blog")}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                >
                  Back to Blog
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <BlogHero />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <main className="lg:w-2/3">
              <BlogPost post={post} />
              <RelatedBlogs posts={relatedPosts} />
            </main>
            <aside className="lg:w-1/3">
              <BlogSidebar />
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
