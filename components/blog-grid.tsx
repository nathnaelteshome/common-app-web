"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, ArrowRight, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/api/types"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { blogApi } from "@/lib/api/blog"

interface BlogGridProps {
  initialPosts: BlogPost[]
}

export function BlogGrid({ initialPosts }: BlogGridProps) {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get("category")
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        if (categorySlug) {
          const response = await blogApi.listPosts({
            category: categorySlug,
            status: "published",
            limit: 20,
            sortBy: "published_at",
            sortOrder: "desc"
          })
          if (response.success && response.data) {
            setPosts(response.data.posts)
          }
        } else {
          setPosts(initialPosts)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [categorySlug, initialPosts])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200" />
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-12">
        <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          {categorySlug ? "CATEGORY" : "BLOG POST"}
        </div>
        <h2 className="text-4xl font-bold text-primary font-sora">
          {categorySlug ? `Posts in ${categorySlug.replace("-", " ")}` : "Most Popular Posts"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment ({post.commentCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>

              <div className="mb-2">
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {post.category.name}
                </span>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-3">{post.title}</h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">By {post.author}</span>
                <Link href={`/blog/${post.slug}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
