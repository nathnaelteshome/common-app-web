"use client"

import { NotFoundBase } from "@/components/not-found-base"
import { Home, BookOpen, Tag, Calendar } from "lucide-react"

export default function BlogNotFound() {
  const blogIllustration = (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full opacity-20" />
      <div className="absolute inset-8 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl">📝</div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-2xl font-bold text-gray-400">404</div>
      </div>
    </div>
  )

  return (
    <NotFoundBase
      title="Blog Post Not Found"
      description="The blog post you're looking for doesn't exist or may have been removed. Check out our latest articles and resources."
      illustration={blogIllustration}
      primaryAction={{
        label: "Latest Posts",
        href: "/blog",
        icon: <BookOpen className="w-4 h-4" />,
      }}
      secondaryActions={[
        {
          label: "Popular Posts",
          href: "/blog?sort=popular",
          icon: <Tag className="w-4 h-4" />,
        },
        {
          label: "Recent Posts",
          href: "/blog?sort=recent",
          icon: <Calendar className="w-4 h-4" />,
        },
        {
          label: "Go Home",
          href: "/",
          icon: <Home className="w-4 h-4" />,
        },
      ]}
      showSearch={true}
      searchPlaceholder="Search blog posts..."
      onSearch={(query) => {
        window.location.href = `/blog?q=${encodeURIComponent(query)}`
      }}
    />
  )
}
