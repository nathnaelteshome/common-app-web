import { Suspense } from "react"
import { BlogPostCard } from "@/components/blog-post-card"
import { getBlogPosts } from "@/lib/api"

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-2">
        <span className="bg-purple-100 text-purple-800 px-3 py-1 text-xs font-medium rounded">BLOG POST</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Most Popular Post.</h1>

      <Suspense fallback={<BlogGridSkeleton />}>
        <BlogGrid />
      </Suspense>
    </div>
  )
}

async function BlogGrid() {
  const posts = await getBlogPosts()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-5">
            <div className="flex items-center mb-3">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-24 ml-4" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="h-8 bg-gray-200 rounded-full w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}
