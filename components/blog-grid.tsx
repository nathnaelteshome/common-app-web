import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, ArrowRight, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/api/types"

interface BlogGridProps {
  posts: BlogPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div>
      <div className="text-center mb-12">
        <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          BLOG POST
        </div>
        <h2 className="text-4xl font-bold text-primary font-sora">Most Popular Post.</h2>
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
