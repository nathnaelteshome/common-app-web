import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/api/types"

interface RelatedBlogsProps {
  posts: BlogPost[]
}

export function RelatedBlogs({ posts }: RelatedBlogsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-primary mb-8 font-sora">RELATED BLOGS</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>Comment ({post.commentCount})</span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mb-3 text-sm line-clamp-2">{post.title}</h3>

              <Link href={`/blog/${post.slug}`}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  Read More
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
