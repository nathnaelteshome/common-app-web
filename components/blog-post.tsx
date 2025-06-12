import { Calendar, MessageCircle, Clock } from "lucide-react"
import Image from "next/image"
import type { BlogPost as BlogPostType } from "@/data/blog-data"

interface BlogPostProps {
  post: BlogPostType
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Image
        src={post.image || "/placeholder.svg"}
        alt={post.title}
        width={800}
        height={400}
        className="w-full h-64 md:h-80 object-cover"
      />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
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

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-tight">{post.title}</h1>

        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Written by</p>
              <p className="font-semibold text-gray-800">{post.author}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
