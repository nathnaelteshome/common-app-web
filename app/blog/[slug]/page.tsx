import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBlogPostBySlug } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/blog" className="inline-flex items-center text-gray-600 mb-6 hover:text-gray-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all posts
      </Link>

      <div className="mb-2">
        <span className="bg-purple-100 text-purple-800 px-3 py-1 text-xs font-medium rounded">BLOG POST</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

      <div className="flex items-center text-sm text-gray-600 mb-6">
        <span className="flex items-center">
          <CalendarIcon className="mr-1 h-4 w-4" />
          {post.date}
        </span>
        <span className="flex items-center ml-4">
          <CommentIcon className="mr-1 h-4 w-4" />
          Comment ({post.comments.toString().padStart(2, "0")})
        </span>
      </div>

      <div className="relative h-80 w-full mb-8 rounded-lg overflow-hidden">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
      </div>

      <div className="prose max-w-none">
        <p>{post.content}</p>
        <p>{post.content}</p>
        <p>{post.content}</p>
      </div>
    </div>
  )
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function CommentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
